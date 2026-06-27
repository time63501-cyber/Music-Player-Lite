import { Filesystem, Directory } from '@capacitor/filesystem';
import { nanoid } from 'nanoid';

export class MusicService {
  constructor() {
    // Use Documents folder as starting point
    this.baseDir = Directory.Documents;
  }

  async getAllSongs() {
    try {
      // Scan multiple common music locations
      let allSongs = [];
      
      // Scan Documents/Music
      allSongs = allSongs.concat(await this.scanDirectory('Music', 'Music'));
      
      // Scan Downloads
      allSongs = allSongs.concat(await this.scanDirectory('Downloads', 'Downloads'));
      
      // Scan root Documents
      allSongs = allSongs.concat(await this.scanDirectory('', 'Root'));
      
      // Remove duplicates and sort
      const uniqueSongs = [];
      const seen = new Set();
      
      allSongs.forEach(song => {
        if (!seen.has(song.path)) {
          seen.add(song.path);
          uniqueSongs.push(song);
        }
      });
      
      return uniqueSongs.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error reading songs:', error);
      return [];
    }
  }

  async scanDirectory(path, folderLabel) {
    let songs = [];
    try {
      const result = await Filesystem.readdir({
        path: path || '/',
        directory: this.baseDir
      });

      for (const file of result.files) {
        try {
          if (file.type === 'file' && this.isAudioFile(file.name)) {
            const fullPath = path ? `${path}/${file.name}` : file.name;
            songs.push({
              id: nanoid(),
              name: file.name,
              path: fullPath,
              folder: folderLabel || 'All Songs'
            });
          } else if (file.type === 'directory' && !file.name.startsWith('.')) {
            // Recursively scan subdirectories (max 2 levels deep)
            const newPath = path ? `${path}/${file.name}` : file.name;
            const subSongs = await this.scanDirectory(newPath, file.name);
            songs = songs.concat(subSongs);
          }
        } catch (fileError) {
          // Skip files that can't be read
          console.log(`Skipping file ${file.name}:`, fileError);
        }
      }

      return songs;
    } catch (error) {
      console.error(`Error scanning directory ${path}:`, error);
      return [];
    }
  }

  async getFolders() {
    try {
      const songs = await this.getAllSongs();
      const folders = new Set(['All Songs']);
      
      songs.forEach(song => {
        if (song.folder && song.folder !== 'All Songs') {
          folders.add(song.folder);
        }
      });
      
      return Array.from(folders).sort();
    } catch (error) {
      console.error('Error reading folders:', error);
      return ['All Songs'];
    }
  }

  async getSongsByFolder(folderName) {
    try {
      const allSongs = await this.getAllSongs();
      
      if (folderName === 'All Songs') {
        return allSongs;
      }

      return allSongs.filter(song => song.folder === folderName);
    } catch (error) {
      console.error('Error reading folder songs:', error);
      return [];
    }
  }

  async moveSongToFolder(songPath, songName, targetFolder) {
    try {
      const file = await Filesystem.readFile({
        path: songPath,
        directory: this.baseDir
      });

      // Create target folder if needed
      await Filesystem.mkdir({
        path: targetFolder,
        directory: this.baseDir,
        recursive: true
      }).catch(() => {});

      const targetPath = `${targetFolder}/${songName}`;
      
      await Filesystem.writeFile({
        path: targetPath,
        data: file.data,
        directory: this.baseDir
      });

      await Filesystem.deleteFile({
        path: songPath,
        directory: this.baseDir
      });

      return true;
    } catch (error) {
      console.error('Error moving song:', error);
      return false;
    }
  }

  async createFolder(folderName) {
    try {
      await Filesystem.mkdir({
        path: folderName,
        directory: this.baseDir,
        recursive: true
      });
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      return false;
    }
  }

  isAudioFile(filename) {
    const audioExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg', '.wma', '.opus'];
    return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

export default new MusicService();