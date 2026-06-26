<script>
  import { playerState, audioPlayer } from '$lib/services/audioPlayer';
  import { formatTime } from '$lib/utils/time';

  let isDragging = false;
  let draggedTime = 0;
</script>

<div class="player">
  {#if $playerState.currentSong}
    <div class="track-info">
      <div class="track-name">{$playerState.currentSong.name}</div>
      <div class="track-folder">{$playerState.currentSong.folder}</div>
    </div>

    <input
      type="range"
      min="0"
      max={$playerState.duration || 0}
      value={isDragging ? draggedTime : $playerState.currentTime}
      on:mousedown={() => isDragging = true}
      on:input={(e) => draggedTime = parseFloat(e.target.value)}
      on:mouseup={() => { audioPlayer.seekTo(draggedTime); isDragging = false; }}
      class="slider"
    />

    <div class="time-display">
      <span>{formatTime($playerState.currentTime)}</span>
      <span>{formatTime($playerState.duration)}</span>
    </div>

    <div class="controls">
      <button on:click={() => audioPlayer.toggleShuffle()}>🔀</button>
      <button on:click={() => audioPlayer.previous()}>⏮</button>
      <button class="play" on:click={() => audioPlayer.togglePlayPause()}>
        {$playerState.isPlaying ? '⏸' : '▶'}
      </button>
      <button on:click={() => audioPlayer.next()}>⏭</button>
      <button on:click={() => audioPlayer.toggleRepeat()}>↻</button>
    </div>

    <div class="volume">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={$playerState.volume}
        on:input={(e) => audioPlayer.setVolume(parseFloat(e.target.value))}
      />
    </div>
  {:else}
    <div class="no-song">Select a song to play</div>
  {/if}
</div>

<style>
  .player {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .track-info {
    margin-bottom: 1rem;
  }

  .track-name {
    font-size: 0.95rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-folder {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .slider {
    width: 100%;
    height: 4px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    accent-color: #ff6b6b;
  }

  .time-display {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
  }

  .controls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  button {
    background: none;
    border: none;
    color: #fff;
    font-size: 1.5rem;
    cursor: pointer;
    opacity: 0.7;
  }

  button:hover {
    opacity: 1;
  }

  button.play {
    background: #ff6b6b;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.8rem;
    opacity: 1;
  }

  .volume {
    display: flex;
    gap: 0.5rem;
  }

  .volume input {
    flex: 1;
    height: 3px;
    cursor: pointer;
    accent-color: #ff6b6b;
  }

  .no-song {
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
    padding: 2rem;
  }
</style>