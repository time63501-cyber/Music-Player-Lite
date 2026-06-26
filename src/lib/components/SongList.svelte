<script>
  import { createEventDispatcher } from 'svelte';

  export let songs = [];
  const dispatch = createEventDispatcher();
</script>

<div class="song-list">
  {#if songs.length === 0}
    <div class="empty">No songs found</div>
  {:else}
    {#each songs as song (song.id)}
      <div class="song-item">
        <button class="play-btn" on:click={() => dispatch('playSong', song.id)}>▶</button>
        <div class="info">
          <div class="name">{song.name}</div>
          <div class="folder">{song.folder}</div>
        </div>
        <button class="move-btn" on:click={() => dispatch('moveSong', song)}>📁</button>
      </div>
    {/each}
  {/if}
</div>

<style>
  .song-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }

  .empty {
    color: rgba(255, 255, 255, 0.4);
    text-align: center;
    padding: 2rem;
  }

  .song-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }

  .song-item:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .play-btn {
    background: none;
    border: none;
    color: #ff6b6b;
    font-size: 1rem;
    cursor: pointer;
  }

  .info {
    flex: 1;
    min-width: 0;
  }

  .name {
    font-size: 0.9rem;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .folder {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
  }

  .move-btn {
    background: none;
    border: none;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
    opacity: 0.6;
  }

  .move-btn:hover {
    opacity: 1;
  }
</style>