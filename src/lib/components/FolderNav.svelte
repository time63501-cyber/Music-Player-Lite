<script>
  import { createEventDispatcher } from 'svelte';

  export let folders = [];
  export let activeFolder = 'All Songs';

  const dispatch = createEventDispatcher();
  let showCreateDialog = false;
  let newFolderName = '';

  function handleCreateFolder() {
    if (newFolderName.trim() && !folders.includes(newFolderName)) {
      dispatch('createFolder', { folderName: newFolderName });
      newFolderName = '';
      showCreateDialog = false;
    }
  }
</script>

<div class="folder-nav">
  <div class="header">
    <h2>Playlists</h2>
    <button on:click={() => showCreateDialog = true}>➕</button>
  </div>

  <div class="folders">
    {#each folders as folder (folder)}
      <button
        class="folder-btn"
        class:active={folder === activeFolder}
        on:click={() => dispatch('selectFolder', folder)}
      >
        <span>{folder === 'All Songs' ? '🎵' : '📂'}</span>
        <span>{folder}</span>
      </button>
    {/each}
  </div>
</div>

{#if showCreateDialog}
<div class="dialog-overlay" role="dialog" tabindex="-1" on:click={() => showCreateDialog = false} on:keydown={(e) => e.key === 'Escape' && (showCreateDialog = false)}>
<div class="dialog" on:click|stopPropagation role="presentation" tabindex="0">
      <h3>Create Playlist</h3>
      <input bind:value={newFolderName} placeholder="Playlist name" />
      <div class="actions">
        <button on:click={() => showCreateDialog = false}>Cancel</button>
        <button class="create" on:click={handleCreateFolder}>Create</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .folder-nav {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .header h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .header button {
    background: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #ff6b6b;
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
  }

  .folders {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .folder-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #fff;
    border-radius: 8px;
    cursor: pointer;
    text-align: left;
  }

  .folder-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .folder-btn.active {
    background: rgba(255, 107, 107, 0.2);
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: #2d2d2d;
    padding: 1.5rem;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
  }

  .dialog h3 {
    margin: 0 0 1rem 0;
  }

  .dialog input {
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

  .actions button.create {
    background: #ff6b6b;
  }
</style>