<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let isDragging = false;
</script>

<svelte:window
  on:drop={(e) => {
    e.preventDefault();
    isDragging = false;
    const dt = e.dataTransfer;
    if (dt == null) return;
    dispatch("drop", {
      files: [...dt.files],
    });
  }}
  on:dragover={(e) => {
    e.preventDefault();
  }}
/>

<style>
</style>
