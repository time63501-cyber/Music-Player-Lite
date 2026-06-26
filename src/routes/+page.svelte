<script>
  import { onMount } from 'svelte';
  import { audioPlayer } from '$lib/services/audioPlayer';
  import musicService from '$lib/services/musicService';
  import Player from '$lib/components/Player.svelte';
  import SongList from '$lib/components/SongList.svelte';
  import FolderNav from '$lib/components/FolderNav.svelte';
  import MoveDialog from '$lib/components/MoveDialog.svelte';

  let songs = [];
  let folders = [];
  let activeFolder = 'All Songs';
  let showMoveDialog = false;
  let selectedSongForMove = null;
  let isLoading = false;

  onMount(async () => {
    await loadFolders();
    await loadSongs(activeFolder);
  });

  async function loadFolders() {
    folders = await musicService.getFolders();
  }

  async function loadSongs(folder) {
    isLoading = true;
    songs = await musicService.getSongsByFolder(folder);
    activeFolder = folder;
    isLoading = false;
  }

  async function handlePlayFolder(event) {
    await loadSongs(event.detail);
    if (songs.length > 0) {
      await audioPlayer.loadQueue(songs, 0);
    }
  }

  async function handlePlaySong(event) {
    const index = songs.findIndex(s => s.id === event.detail);
    if (index !== -1) {
      await audioPlayer.loadQueue(songs, index);
    }
  }

  function handleShowMoveDialog(event) {
    selectedSongForMove = event.detail;
    showMoveDialog = true;
  }

  async function handleMoveSong(event) {
    const { targetFolder } = event.detail;
    if (selectedSongForMove) {
      await musicService.moveSongToFolder(
        selectedSongForMove.path,
        selectedSongForMove.name,
        targetFolder
      );
      showMoveDialog = false;
      await loadFolders();
      await loadSongs(activeFolder);
    }
  }

  async function handleCreateFolder(event) {
    const { folderName } = event.detail;
    await musicService.createFolder(folderName);
    await loadFolders();
  }
</script>

<div class="container">
  <header class="header">
    <h1>Music Player</h1>
  </header>

  <main class="main">
    <FolderNav
      {folders}
      {activeFolder}
      on:selectFolder={handlePlayFolder}
      on:createFolder={handleCreateFolder}
    />

    {#if isLoading}
      <div class="loading">Loading...</div>
    {:else}
      <SongList
        {songs}
        on:playSong={handlePlaySong}
        on:moveSong={handleShowMoveDialog}
      />
    {/if}
  </main>

  <footer class="footer">
    <Player />
  </footer>

  {#if showMoveDialog}
    <MoveDialog
      {folders}
      selectedSong={selectedSongForMove}
      on:move={handleMoveSong}
      on:close={() => (showMoveDialog = false)}
    />
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  }

  .header {
    padding: 1.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
  }

  .header h1 {
    margin: 0;
    font-size: 1.8rem;
  }

  .main {
    flex: 1;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 250px 1fr;
  }

  .loading {
    grid-column: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255, 255, 255, 0.5);
  }

  .footer {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    .main {
      grid-template-columns: 1fr;
    }
  }
</style>