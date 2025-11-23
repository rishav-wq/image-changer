const fs = require('fs').promises;
const path = require('path');

/**
 * File Service - Handles file cleanup and management
 */
class FileService {
  /**
   * Clean up a file from the filesystem
   * @param {string} filePath - Path to the file to delete
   */
  async cleanupFile(filePath) {
    try {
      await fs.unlink(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(`Error cleaning up file ${filePath}:`, error.message);
      }
    }
  }

  /**
   * Clean up multiple files
   * @param {string[]} filePaths - Array of file paths to delete
   */
  async cleanupFiles(filePaths) {
    const cleanupPromises = filePaths.map(filePath => this.cleanupFile(filePath));
    await Promise.all(cleanupPromises);
  }

  /**
   * Clean up old files in a directory based on age
   * @param {string} directory - Directory to clean
   * @param {number} maxAgeMs - Maximum age in milliseconds (default: 1 hour)
   */
  async cleanupOldFiles(directory, maxAgeMs = 3600000) {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();

      for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile() && (now - stats.mtimeMs) > maxAgeMs) {
          await this.cleanupFile(filePath);
        }
      }
    } catch (error) {
      console.error(`Error cleaning up old files in ${directory}:`, error.message);
    }
  }
}

module.exports = new FileService();
