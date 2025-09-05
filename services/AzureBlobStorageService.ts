import { BlobServiceClient, ContainerClient, BlobClient } from '@azure/storage-blob';
import { IStorageService } from './IStorageService';
import { configurationManager } from '../config/ConfigurationManager';

/**
 * Azure Blob Storage service implementation
 * Similar to AzureBlobStorageService.cs in the C# project
 */
export class AzureBlobStorageService implements IStorageService {
  private blobServiceClient: BlobServiceClient | null = null;
  private defaultContainerName: string;

  constructor() {
    const settings = configurationManager.getSettings();
    this.defaultContainerName = settings.testSettings.screenshotContainer;
    this.initializeClient();
  }

  /**
   * Initialize the Azure Blob Service Client
   */
  private initializeClient(): void {
    const settings = configurationManager.getSettings();
    const azureConfig = settings.azureBlobStorageConfiguration;

    if (!azureConfig?.connectionString) {
      console.warn('Azure Blob Storage connection string not configured. Storage service will not be available.');
      return;
    }

    try {
      this.blobServiceClient = new BlobServiceClient(azureConfig.connectionString);
      console.log('Azure Blob Storage client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Azure Blob Storage client:', error);
      this.blobServiceClient = null;
    }
  }

  /**
   * Get container client
   */
  private getContainerClient(containerName?: string): ContainerClient {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const container = containerName || this.defaultContainerName;
    return this.blobServiceClient.getContainerClient(container);
  }

  /**
   * Upload a file to Azure Blob Storage
   */
  public async uploadFile(filePath: string, containerName?: string): Promise<string> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const fs = require('fs');
    const path = require('path');

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileName = path.basename(filePath);
    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      const fileBuffer = fs.readFileSync(filePath);
      await blockBlobClient.upload(fileBuffer, fileBuffer.length);
      
      console.log(`File uploaded successfully: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error(`Failed to upload file ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Download a file from Azure Blob Storage
   */
  public async downloadFile(fileName: string, containerName?: string): Promise<Buffer> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      const downloadResponse = await blockBlobClient.download();
      const chunks: Buffer[] = [];
      
      if (downloadResponse.readableStreamBody) {
        for await (const chunk of downloadResponse.readableStreamBody) {
          chunks.push(chunk);
        }
      }

      const fileBuffer = Buffer.concat(chunks);
      console.log(`File downloaded successfully: ${fileName}`);
      return fileBuffer;
    } catch (error) {
      console.error(`Failed to download file ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a file from Azure Blob Storage
   */
  public async deleteFile(fileName: string, containerName?: string): Promise<void> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      await blockBlobClient.delete();
      console.log(`File deleted successfully: ${fileName}`);
    } catch (error) {
      console.error(`Failed to delete file ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * List files in a container
   */
  public async listFiles(containerName?: string): Promise<string[]> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const containerClient = this.getContainerClient(containerName);
    const files: string[] = [];

    try {
      for await (const blob of containerClient.listBlobsFlat()) {
        files.push(blob.name);
      }
      
      console.log(`Listed ${files.length} files from container`);
      return files;
    } catch (error) {
      console.error('Failed to list files:', error);
      throw error;
    }
  }

  /**
   * Generate a SAS URI for a file
   */
  public async generateSasUri(
    fileName: string, 
    expiryHours: number = 24, 
    containerName?: string
  ): Promise<string> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const settings = configurationManager.getSettings();
    const azureConfig = settings.azureBlobStorageConfiguration;

    if (!azureConfig?.shouldGenerateSasUri) {
      throw new Error('SAS URI generation is disabled in configuration');
    }

    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      const expiryTime = new Date();
      expiryTime.setHours(expiryTime.getHours() + expiryHours);

      const sasUri = await blockBlobClient.generateSasUrl({
        permissions: 'r', // Read permission
        expiresOn: expiryTime
      });

      console.log(`SAS URI generated for file: ${fileName}`);
      return sasUri;
    } catch (error) {
      console.error(`Failed to generate SAS URI for file ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Check if a file exists in storage
   */
  public async fileExists(fileName: string, containerName?: string): Promise<boolean> {
    if (!this.blobServiceClient) {
      return false;
    }

    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      const exists = await blockBlobClient.exists();
      return exists;
    } catch (error) {
      console.error(`Failed to check if file exists ${fileName}:`, error);
      return false;
    }
  }

  /**
   * Get file metadata
   */
  public async getFileMetadata(fileName: string, containerName?: string): Promise<{
    size: number;
    lastModified: Date;
    contentType: string;
  }> {
    if (!this.blobServiceClient) {
      throw new Error('Azure Blob Storage client not initialized');
    }

    const containerClient = this.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    try {
      const properties = await blockBlobClient.getProperties();
      
      return {
        size: properties.contentLength || 0,
        lastModified: properties.lastModified || new Date(),
        contentType: properties.contentType || 'application/octet-stream'
      };
    } catch (error) {
      console.error(`Failed to get file metadata for ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Upload test artifacts (screenshots, videos, traces)
   */
  public async uploadTestArtifacts(testRunId?: string): Promise<string[]> {
    const fs = require('fs');
    const path = require('path');
    
    const artifactsPath = path.join(process.cwd(), 'test-results');
    const uploadedFiles: string[] = [];

    if (!fs.existsSync(artifactsPath)) {
      console.log('No test artifacts found to upload');
      return uploadedFiles;
    }

    const runId = testRunId || `test-run-${Date.now()}`;
    const containerName = `${this.defaultContainerName}-${runId}`;

    try {
      // Create container if it doesn't exist
      const containerClient = this.getContainerClient(containerName);
      await containerClient.createIfNotExists();

      // Upload all files recursively
      await this.uploadDirectoryRecursive(artifactsPath, containerName, uploadedFiles);

      console.log(`Uploaded ${uploadedFiles.length} test artifacts to container: ${containerName}`);
      return uploadedFiles;
    } catch (error) {
      console.error('Failed to upload test artifacts:', error);
      throw error;
    }
  }

  /**
   * Upload directory recursively
   */
  private async uploadDirectoryRecursive(
    dirPath: string, 
    containerName: string, 
    uploadedFiles: string[]
  ): Promise<void> {
    const fs = require('fs');
    const path = require('path');

    const items = fs.readdirSync(dirPath);

    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        await this.uploadDirectoryRecursive(itemPath, containerName, uploadedFiles);
      } else {
        const relativePath = path.relative(process.cwd(), itemPath);
        await this.uploadFile(itemPath, containerName);
        uploadedFiles.push(relativePath);
      }
    }
  }
}
