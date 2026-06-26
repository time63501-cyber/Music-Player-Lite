import { writable } from 'svelte/store';

export const playerState = writable({
  isPlaying: false,
  currentSong: null,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  isShuffle: false,
  repeatMode: 0,
  volume: 1
});

export class AudioPlayer {
  constructor() {
    this.audio = null;
    this.initAudio();
  }

  initAudio() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      
      this.audio.addEventListener('timeupdate', () => {
        playerState.update(state => ({
          ...state,
          currentTime: this.audio.currentTime
        }));
      });

      this.audio.addEventListener('loadedmetadata', () => {
        playerState.update(state => ({
          ...state,
          duration: this.audio.duration || 0
        }));
      });

      this.audio.addEventListener('ended', () => {
        this.next();
      });

      this.audio.addEventListener('error', () => {
        this.next();
      });
    }
  }

  async loadQueue(songs, startIndex = 0) {
    playerState.update(state => ({
      ...state,
      queue: songs,
      currentIndex: startIndex
    }));

    if (songs[startIndex]) {
      await this.playSong(songs[startIndex]);
    }
  }

  async playSong(song) {
    try {
      if (!this.audio) return;
      const uri = song.path.startsWith('file://') ? song.path : `file://${song.path}`;
      this.audio.src = uri;
      playerState.update(state => ({ ...state, currentSong: song, isPlaying: true }));
      await this.audio.play().catch(e => console.error('Play error:', e));
    } catch (error) {
      console.error('Error playing song:', error);
    }
  }

  play() {
    if (this.audio) {
      this.audio.play();
      playerState.update(s => ({ ...s, isPlaying: true }));
    }
  }

  pause() {
    this.audio?.pause();
    playerState.update(s => ({ ...s, isPlaying: false }));
  }

  togglePlayPause() {
    let state = { isPlaying: false };
    playerState.subscribe(s => Object.assign(state, s))();
    state.isPlaying ? this.pause() : this.play();
  }

  next() {
    let state = { currentIndex: 0, queue: [] };
    playerState.subscribe(s => Object.assign(state, s))();
    let nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.queue.length) nextIndex = 0;
    playerState.update(s => ({ ...s, currentIndex: nextIndex }));
    if (state.queue[nextIndex]) this.playSong(state.queue[nextIndex]);
  }

  previous() {
    let state = { currentIndex: 0, queue: [] };
    playerState.subscribe(s => Object.assign(state, s))();
    let prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) prevIndex = state.queue.length - 1;
    playerState.update(s => ({ ...s, currentIndex: prevIndex }));
    if (state.queue[prevIndex]) this.playSong(state.queue[prevIndex]);
  }

  seekTo(time) {
    if (this.audio) this.audio.currentTime = time;
  }

  setVolume(volume) {
    if (this.audio) this.audio.volume = Math.max(0, Math.min(1, volume));
    playerState.update(s => ({ ...s, volume }));
  }

  toggleShuffle() {
    playerState.update(s => ({ ...s, isShuffle: !s.isShuffle }));
  }

  toggleRepeat() {
    playerState.update(s => ({ ...s, repeatMode: (s.repeatMode + 1) % 3 }));
  }
}

export const audioPlayer = new AudioPlayer();