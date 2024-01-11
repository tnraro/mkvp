<script lang="ts">
  import Dnd from "./lib/dnd.svelte";
  import Media from "./lib/media.svelte";

  let mediae: { id: string; file: File }[] = [];
</script>

<main>
  <Dnd
    on:drop={(e) => {
      const files = e.detail.files;
      mediae = [
        ...mediae,
        ...files.map((file) => {
          return {
            id: crypto.randomUUID(),
            file,
          };
        }),
      ];
    }}
  />
  {#if mediae.length > 0}
    <div class="mediae">
      {#each mediae as media (media.id)}
        <Media file={media.file} />
      {/each}
    </div>
  {:else}
    <div>여기에 동영상을 끌어넣어 주세요!</div>
  {/if}
</main>

<style>
  .mediae {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
