import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export const load = async (ffmpeg: FFmpeg) => {
  const baseUrl = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm"
  const coreUrl = toBlobURL(`${baseUrl}/ffmpeg-core.js`, "text/javascript");
  const wasmUrl = toBlobURL(`${baseUrl}/ffmpeg-core.wasm`, "appliccation/wasm");

  await ffmpeg.load({
    coreURL: await coreUrl,
    wasmURL: await wasmUrl,
  });
};
export const upload = async (ffmpeg: FFmpeg, file: File) => {
  await ffmpeg.writeFile(file.name, await fetchFile(file));
};
export const readFileData = async (ffmpeg: FFmpeg, filename: string) => {
  return await ffmpeg.readFile(filename);
}
export const convertFileDataToUrl = async (fileData: Uint8Array | string, type: string): Promise<string> => {
  if (typeof fileData === "string") throw 53
  return URL.createObjectURL(new Blob([fileData.buffer], { type }))
}

export const createThumbnail = async (ffmpeg: FFmpeg, filename: string) => {
  await ffmpeg.exec([
    "-ss", "1",
    "-t", "2",
    "-i",
    filename,
    "-ss",
    "00:00:01.000",
    "-vframes",
    "1",
    "thumbnail.webp",
  ]);
};

export const mergeAudioTracks = async (ffmpeg: FFmpeg, filename: string, numberOfAudioTracks: number) => {
  await ffmpeg.exec([
    "-i",
    filename,
    "-c:v", "copy",
    "-c:a", "aac",
    "-b:a", "160k",
    "-ac", "2",
    "-filter_complex", `amerge=inputs=${numberOfAudioTracks}`,
    "output.mp4",
  ])
}