import { Filesystem, Directory } from '@capacitor/filesystem';
import { nanoid } from 'nanoid';

export class MusicService {
  constructor() {
    this.musicDir = `${Directory.Documents}/Music`;
  }

  async getAllSongs() {
    try {
      const result = await Filesystem.readdir({
        path: this.musicDir,
        directory: Directory.Documents
      });
      
      return result.files
        .filter(f => this.isAudioFile(f.name))
        .map(f => ({
          id: nanoid(),
          name: f.name,
          path: `${this.musicDir}/${f.name}`,
          folder: 'All Songs'
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error reading songs:', error);
      return [];
    }
  }

  async getFolders() {
    try {
      const result = await Filesystem.readdir({
        path: this.musicDir,
        directory: Directory.Documents
      });
      
      const folders = ['All Songs'];
      for (const file of result.files) {
        if (file.type === 'directory') {
          folders.push(file.name);
        }
      }
      return folders;
    } catch (error) {
      console.error('Error reading folders:', error);
      return ['All Songs'];
    }
  }

  async getSongsByFolder(folderName) {
    try {
      if (folderName === 'All Songs') {
        return this.getAllSongs();
      }

      const result = await Filesystem.readdir({
        path: `${this.musicDir}/${folderName}`,
        directory: Directory.Documents
      });

      return result.files
        .filter(f => this.isAudioFile(f.name))
        .map(f => ({
          id: nanoid(),
          name: f.name,
          path: `${this.musicDir}/${folderName}/${f.name}`,
          folder: folderName
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      console.error('Error reading folder songs:', error);
      return [];
    }
  }

  async moveSongToFolder(songPath, songName, targetFolder) {
    try {
      const targetPath = `${this.musicDir}/${targetFolder}`;

      await Filesystem.mkdir({
        path: targetPath,
        directory: Directory.Documents,
        recursive: true
      }).catch(() => {});

      const file = await Filesystem.readFile({
        path: songPath,
        directory: Directory.Documents
      });

      await Filesystem.writeFile({
        path: `${targetPath}/${songName}`,
        data: file.data,
        directory: Directory.Documents
      });

      await Filesystem.deleteFile({
        path: songPath,
        directory: Directory.Documents
      });

      return true;
    } catch (error) {
      console.error('Error moving song:', error);
      return false;
    }
  }

  async createFolder(folderName) {
    try {
      const newFolderPath = `${this.musicDir}/${folderName}`;
      await Filesystem.mkdir({
        path: newFolderPath,
        directory: Directory.Documents,
        recursive: true
      });
      return true;
    } catch (error) {
      console.error('Error creating folder:', error);
      return false;
    }
  }

  isAudioFile(filename) {
    const audioExtensions = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg', '.wma'];
    return audioExtensions.some(ext => filename.toLowerCase().endsWith(ext));
  }
}

export default new MusicService();