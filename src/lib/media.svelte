<script lang="ts">
  import { FFmpeg } from "@ffmpeg/ffmpeg";
  import {
    convertFileDataToUrl,
    createThumbnail,
    load,
    mergeAudioTracks,
    readFileData,
    upload,
  } from "./ffmpeg/util";
  import { humanReadableDateTime, humanReadableFileSize } from "./file/util";
  const ffmpeg = new FFmpeg();
  const enum State {
    Loading,
    Idle,
    Processing,
    Done,
    Error,
  }
  const process = async () => {
    state = State.Processing;
    await mergeAudioTracks(ffmpeg, file.name, numberOfAudioTracks);
    state = State.Done;
  };
  const download = async () => {
    const output = await readFileData(ffmpeg, "output.mp4");
    const outputUrl = await convertFileDataToUrl(output, "video/mp4");
    const a = document.createElement("a");
    a.href = outputUrl;
    a.download = file.name.replace(/\.[^.]+$/, "") + ".mp4";
    a.click();
    URL.revokeObjectURL(outputUrl);
  };

  export let file: File;

  let thumbnailUrl: string;
  let numberOfAudioTracks: number = 3;
  let progress: number | null = null;
  let state = State.Loading;

  $: isSafeSize = file.size < 2147483648; /* 2 GB */

  if (!ffmpeg.loaded) {
    ffmpeg.on("progress", (e) => {
      if (state === State.Processing) {
        if (e.progress <= 1 && e.progress >= 0) {
          progress = e.progress;
        }
      }
    });
    load(ffmpeg)
      .then(async () => {
        await upload(ffmpeg, file);
        await createThumbnail(ffmpeg, file.name);
        const thumbnail = await readFileData(ffmpeg, "thumbnail.webp");
        thumbnailUrl = await convertFileDataToUrl(thumbnail, "image/webp");
        state = State.Idle;
      })
      .catch((error) => {
        console.error(error);
        state = State.Error;
      });
  }
</script>

<div class="container">
  <img class="thumbnail" src={thumbnailUrl} alt="" />
  <h1 class="title">{file.name}</h1>
  <p class="info">
    {humanReadableFileSize(file.size)} | {humanReadableDateTime(
      file.lastModified,
    )}
  </p>
  <div class="progress">
    {#if isSafeSize}
      {#if progress != null}
        <div class="progress-bar" style:--size="{progress * 100}%">
          {(progress * 100).toFixed(2)}%
        </div>
      {:else}
        <label>
          오디오 트랙 수
          <input
            type="number"
            bind:value={numberOfAudioTracks}
            min="1"
            max="6"
          />
        </label>
      {/if}
    {:else}
      <p class="error">2 GB 미만 파일만 처리 가능합니다</p>
    {/if}
  </div>
  <button
    disabled={!(state === State.Idle || state === State.Done)}
    class="download"
    on:click={() => {
      if (state === State.Idle) {
        process();
      }
      if (state === State.Done) {
        download();
      }
    }}
    >{state === 0
      ? "준비 중"
      : state === 1
        ? "처리"
        : state === 2
          ? "처리 중"
          : state === 3
            ? "내려받기"
            : "오류"}</button
  >
</div>

<style>
  .container {
    height: max-content;
    display: grid;
    gap: 0.25rem 1rem;
    grid-template:
      "thumbnail title download" auto
      "thumbnail info download" auto
      "thumbnail progress download" auto
      / min-content 1fr 5rem;
  }
  .thumbnail {
    grid-area: thumbnail;
    height: 5rem;
    aspect-ratio: 16/9;
    object-fit: cover;
    border-radius: 0.5rem;
    background: black;
  }
  .title {
    grid-area: title;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 1rem;
  }
  .error {
    color: #d13415;
  }
  .info {
    grid-area: info;
  }
  .progress {
    grid-area: progress;
    position: relative;
  }
  .progress-bar::before {
    content: "";
    width: var(--size);
    background: #b0e64c;
    border-radius: 999rem;
    position: absolute;
    bottom: 0;
    height: 4px;
  }
  .download {
    grid-area: download;
    white-space: nowrap;
  }
</style>
