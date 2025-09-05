/**
 * Interface for storage services
 * Similar to IStorageService.cs in the C# project
 */
export interface IStorageService {
  /**
   * Upload a file to storage
   */
  uploadFile(filePath: string, containerName?: string): Promise<string>;

  /**
   * Download a file from storage
   */
  downloadFile(fileName: string, containerName?: string): Promise<Buffer>;

  /**
   * Delete a file from storage
   */
  deleteFile(fileName: string, containerName?: string): Promise<void>;

  /**
   * List files in a container
   */
  listFiles(containerName?: string): Promise<string[]>;

  /**
   * Generate a SAS URI for a file
   */
  generateSasUri(fileName: string, expiryHours?: number, containerName?: string): Promise<string>;

  /**
   * Check if a file exists in storage
   */
  fileExists(fileName: string, containerName?: string): Promise<boolean>;

  /**
   * Get file metadata
   */
  getFileMetadata(fileName: string, containerName?: string): Promise<{
    size: number;
    lastModified: Date;
    contentType: string;
  }>;
}
