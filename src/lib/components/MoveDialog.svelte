<script>
  import { createEventDispatcher } from 'svelte';

  export let folders = [];
  export let selectedSong = null;

  const dispatch = createEventDispatcher();
  let selectedFolder = '';
  let showNewFolder = false;
  let newFolderName = '';

  function handleMove() {
    const target = showNewFolder ? newFolderName.trim() : selectedFolder;
    if (target) dispatch('move', { targetFolder: target });
  }
</script>

<div class="overlay" role="dialog" tabindex="-1" on:click={() => dispatch('close')} on:keydown={(e) => e.key === 'Escape' && dispatch('close')}>
<div class="dialog" on:click|stopPropagation role="presentation" tabindex="0">
    <h3>Move to folder:</h3>

    {#if !showNewFolder}
      <div class="options">
        {#each folders.filter(f => f !== selectedSong?.folder) as folder}
          <label>
            <input type="radio" bind:group={selectedFolder} value={folder} />
            <span>{folder}</span>
          </label>
        {/each}
        <button on:click={() => showNewFolder = true}>➕ New Playlist</button>
      </div>
    {:else}
      <input type="text" bind:value={newFolderName} placeholder="Playlist name" />
      <button on:click={() => showNewFolder = false}>Back</button>
    {/if}

    <div class="actions">
      <button on:click={() => dispatch('close')}>Cancel</button>
      <button class="move" on:click={handleMove}>Move</button>
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
  }

  .dialog {
    background: #2d2d2d;
    padding: 1.5rem;
    border-radius: 12px;
    width: 90%;
    max-width: 450px;
    max-height: 80vh;
    overflow-y: auto;
  }

  .dialog h3 {
    margin: 0 0 1rem 0;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    cursor: pointer;
  }

  label:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  input[type="radio"] {
    accent-color: #ff6b6b;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    border-radius: 6px;
    margin-bottom: 1rem;
    box-sizing: border-box;
  }

  .actions {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  .actions button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .actions button.move {
    background: #ff6b6b;
  }
</style>