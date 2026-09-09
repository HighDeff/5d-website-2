// File Share Service - Handles secure file sharing with AI content validation
// Supports images, documents, references with automatic content analysis

import ValidationService from "./ValidationService";

export interface SharedFile {
  id: string;
  name: string;
  originalName: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploaderId: string;
  shareCode: string;
  expiresAt: string;
  downloadCount: number;
  maxDownloads?: number;
  password?: string;
  aiValidation: FileAIValidation;
  metadata: FileMetadata;
  createdAt: string;
}

export interface FileAIValidation {
  contentType: "image" | "document" | "reference" | "specification" | "unknown";
  safetyScore: number; // 0-1, 1 = completely safe
  contentDescription: string;
  extractedText?: string;
  imageAnalysis?: {
    hasText: boolean;
    objectsDetected: string[];
    isProductImage: boolean;
    qualityScore: number;
  };
  documentAnalysis?: {
    pageCount: number;
    hasFormFields: boolean;
    containsPersonalInfo: boolean;
    language: string;
  };
  flags: string[];
  approved: boolean;
  confidence: number;
}

export interface FileMetadata {
  originalPath?: string;
  deviceInfo: string;
  uploadSession: string;
  contextId?: string; // Related tag along request ID
  tags: string[];
  description?: string;
  category: "product" | "reference" | "specification" | "other";
}

export interface FileUploadProgress {
  fileId: string;
  fileName: string;
  loaded: number;
  total: number;
  percentage: number;
  status: "uploading" | "processing" | "validating" | "complete" | "error";
  error?: string;
}

class FileShareService {
  private static instance: FileShareService;
  private files: Map<string, SharedFile> = new Map();
  private uploadProgress: Map<string, FileUploadProgress> = new Map();
  private validationService: ValidationService;
  private maxFileSize = 50 * 1024 * 1024; // 50MB
  private allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  static getInstance(): FileShareService {
    if (!FileShareService.instance) {
      FileShareService.instance = new FileShareService();
    }
    return FileShareService.instance;
  }

  async uploadFile(
    file: File,
    uploaderId: string,
    options: {
      contextId?: string;
      description?: string;
      category?: "product" | "reference" | "specification" | "other";
      maxDownloads?: number;
      expiresInHours?: number;
      password?: string;
    } = {},
  ): Promise<SharedFile> {
    // Validate file before upload
    this.validateFileForUpload(file);

    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const shareCode = this.generateShareCode();

    // Initialize upload progress
    const progress: FileUploadProgress = {
      fileId,
      fileName: file.name,
      loaded: 0,
      total: file.size,
      percentage: 0,
      status: "uploading",
    };
    this.uploadProgress.set(fileId, progress);

    try {
      // Simulate file upload with progress
      await this.simulateUpload(fileId, file);

      // Update progress to processing
      progress.status = "processing";
      this.uploadProgress.set(fileId, progress);

      // Generate secure URLs
      const url = `https://secure-storage.example.com/files/${fileId}`;
      const thumbnailUrl = this.isImage(file.type)
        ? `https://secure-storage.example.com/thumbnails/${fileId}`
        : undefined;

      // AI validation
      progress.status = "validating";
      this.uploadProgress.set(fileId, progress);

      const aiValidation = await this.performAIValidation(file);

      // Create shared file record
      const sharedFile: SharedFile = {
        id: fileId,
        name: this.sanitizeFileName(file.name),
        originalName: file.name,
        type: file.type,
        size: file.size,
        url,
        thumbnailUrl,
        uploaderId,
        shareCode,
        expiresAt: new Date(
          Date.now() + (options.expiresInHours || 168) * 60 * 60 * 1000,
        ).toISOString(), // Default 7 days
        downloadCount: 0,
        maxDownloads: options.maxDownloads,
        password: options.password,
        aiValidation,
        metadata: {
          deviceInfo: navigator.userAgent || "Unknown",
          uploadSession: `session_${Date.now()}`,
          contextId: options.contextId,
          tags: this.extractTags(file.name, options.description),
          description: options.description,
          category: options.category || "other",
        },
        createdAt: new Date().toISOString(),
      };

      this.files.set(fileId, sharedFile);

      // Complete upload
      progress.status = "complete";
      progress.percentage = 100;
      this.uploadProgress.set(fileId, progress);

      return sharedFile;
    } catch (error) {
      // Handle upload error
      progress.status = "error";
      progress.error = error instanceof Error ? error.message : "Upload failed";
      this.uploadProgress.set(fileId, progress);
      throw error;
    }
  }

  private validateFileForUpload(file: File): void {
    if (file.size > this.maxFileSize) {
      throw new Error(
        `File too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`File type not allowed: ${file.type}`);
    }

    // Additional security checks
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".scr", ".com"];
    const hasEarlyDot = file.name.includes("..");
    const hasDangerousExtension = dangerousExtensions.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (hasEarlyDot || hasDangerousExtension) {
      throw new Error("File name contains potentially dangerous patterns");
    }
  }

  private async simulateUpload(fileId: string, file: File): Promise<void> {
    const progress = this.uploadProgress.get(fileId);
    if (!progress) throw new Error("Upload progress not found");

    // Simulate chunked upload with progress
    const chunkSize = 64 * 1024; // 64KB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // Simulate network delay

      progress.loaded = Math.min((i + 1) * chunkSize, file.size);
      progress.percentage = Math.round(
        (progress.loaded / progress.total) * 100,
      );
      this.uploadProgress.set(fileId, progress);
    }
  }

  private async performAIValidation(file: File): Promise<FileAIValidation> {
    // AI content validation
    const isImage = this.isImage(file.type);
    const isDocument = this.isDocument(file.type);

    // Base validation
    const validation: FileAIValidation = {
      contentType: isImage ? "image" : isDocument ? "document" : "unknown",
      safetyScore: 0.95, // Default high safety score
      contentDescription: `${file.type} file: ${file.name}`,
      flags: [],
      approved: true,
      confidence: 0.9,
    };

    try {
      if (isImage) {
        validation.imageAnalysis = await this.analyzeImage(file);
        validation.contentDescription = `Image file containing ${validation.imageAnalysis.objectsDetected.join(", ")}`;

        // Adjust safety score based on image content
        if (validation.imageAnalysis.qualityScore < 0.5) {
          validation.flags.push("low_quality_image");
          validation.safetyScore *= 0.9;
        }
      } else if (isDocument) {
        validation.documentAnalysis = await this.analyzeDocument(file);
        validation.extractedText = await this.extractTextFromDocument(file);

        // Check for personal information
        if (validation.documentAnalysis.containsPersonalInfo) {
          validation.flags.push("contains_personal_info");
          validation.safetyScore *= 0.8;
        }
      }

      // Final safety assessment
      if (validation.safetyScore < 0.7) {
        validation.approved = false;
        validation.flags.push("low_safety_score");
      }

      return validation;
    } catch (error) {
      // If AI validation fails, use conservative defaults
      validation.safetyScore = 0.5;
      validation.approved = false;
      validation.flags.push("validation_error");
      validation.confidence = 0.3;
      return validation;
    }
  }

  private async analyzeImage(
    file: File,
  ): Promise<NonNullable<FileAIValidation["imageAnalysis"]>> {
    // Simulate AI image analysis
    await new Promise((resolve) => setTimeout(resolve, 500));

    const objects = [
      "product",
      "item",
      "clothing",
      "electronics",
      "accessories",
    ];
    const detectedObjects = objects.slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      hasText: Math.random() > 0.5,
      objectsDetected: detectedObjects,
      isProductImage:
        detectedObjects.includes("product") || detectedObjects.includes("item"),
      qualityScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
    };
  }

  private async analyzeDocument(
    file: File,
  ): Promise<NonNullable<FileAIValidation["documentAnalysis"]>> {
    // Simulate AI document analysis
    await new Promise((resolve) => setTimeout(resolve, 300));

    return {
      pageCount: Math.floor(Math.random() * 10) + 1,
      hasFormFields: Math.random() > 0.7,
      containsPersonalInfo: Math.random() > 0.8,
      language: "en",
    };
  }

  private async extractTextFromDocument(file: File): Promise<string> {
    // Simulate text extraction
    await new Promise((resolve) => setTimeout(resolve, 200));
    return `Extracted text from ${file.name}. This is a sample of extracted content...`;
  }

  private isImage(type: string): boolean {
    return type.startsWith("image/");
  }

  private isDocument(type: string): boolean {
    return (
      type.includes("pdf") || type.includes("document") || type.includes("text")
    );
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9.-]/g, "_");
  }

  private generateShareCode(): string {
    return Math.random().toString(36).substr(2, 12).toUpperCase();
  }

  private extractTags(fileName: string, description?: string): string[] {
    const text = `${fileName} ${description || ""}`.toLowerCase();
    const tags: string[] = [];

    // Extract common tags
    if (text.includes("product")) tags.push("product");
    if (text.includes("spec") || text.includes("specification"))
      tags.push("specification");
    if (text.includes("reference")) tags.push("reference");
    if (text.includes("manual")) tags.push("manual");
    if (text.includes("image") || text.includes("photo")) tags.push("image");

    return tags;
  }

  async getFile(fileId: string): Promise<SharedFile | undefined> {
    return this.files.get(fileId);
  }

  async getFileByShareCode(shareCode: string): Promise<SharedFile | undefined> {
    return Array.from(this.files.values()).find(
      (file) => file.shareCode === shareCode,
    );
  }

  async getUserFiles(uploaderId: string): Promise<SharedFile[]> {
    return Array.from(this.files.values()).filter(
      (file) => file.uploaderId === uploaderId,
    );
  }

  async downloadFile(
    fileId: string,
    password?: string,
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    const file = this.files.get(fileId);
    if (!file) {
      return { success: false, error: "File not found" };
    }

    // Check expiration
    if (new Date() > new Date(file.expiresAt)) {
      return { success: false, error: "File has expired" };
    }

    // Check password
    if (file.password && file.password !== password) {
      return { success: false, error: "Invalid password" };
    }

    // Check download limits
    if (file.maxDownloads && file.downloadCount >= file.maxDownloads) {
      return { success: false, error: "Download limit exceeded" };
    }

    // Check AI approval
    if (!file.aiValidation.approved) {
      return { success: false, error: "File failed security validation" };
    }

    // Increment download count
    file.downloadCount++;
    this.files.set(fileId, file);

    return { success: true, url: file.url };
  }

  async deleteFile(fileId: string, requesterId: string): Promise<boolean> {
    const file = this.files.get(fileId);
    if (!file) return false;

    // Only owner can delete
    if (file.uploaderId !== requesterId) return false;

    this.files.delete(fileId);
    return true;
  }

  getUploadProgress(fileId: string): FileUploadProgress | undefined {
    return this.uploadProgress.get(fileId);
  }

  async getFileStats(uploaderId: string): Promise<{
    totalFiles: number;
    totalSize: number;
    totalDownloads: number;
    approvedFiles: number;
    flaggedFiles: number;
  }> {
    const userFiles = await this.getUserFiles(uploaderId);

    return {
      totalFiles: userFiles.length,
      totalSize: userFiles.reduce((sum, file) => sum + file.size, 0),
      totalDownloads: userFiles.reduce(
        (sum, file) => sum + file.downloadCount,
        0,
      ),
      approvedFiles: userFiles.filter((file) => file.aiValidation.approved)
        .length,
      flaggedFiles: userFiles.filter(
        (file) => file.aiValidation.flags.length > 0,
      ).length,
    };
  }

  async cleanupExpiredFiles(): Promise<number> {
    const now = new Date();
    let deletedCount = 0;

    for (const [id, file] of this.files.entries()) {
      if (now > new Date(file.expiresAt)) {
        this.files.delete(id);
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

export default FileShareService;
