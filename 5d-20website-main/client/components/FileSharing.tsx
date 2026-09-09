// File Sharing Component - Drag-drop file upload with AI validation and preview
// Supports multiple files, progress tracking, and secure sharing

import React, { useState, useRef, useCallback } from "react";
import {
  Upload,
  File,
  Image,
  FileText,
  X,
  Check,
  AlertCircle,
  Download,
  Share,
  Lock,
  Eye,
  Bot,
  Loader,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FileShareService, {
  SharedFile,
  FileUploadProgress,
} from "../services/FileShareService";
import { useUserAuth } from "../hooks/useUserAuth";

interface FileSharingProps {
  onFilesSelected?: (files: File[]) => void;
  onFilesUploaded?: (sharedFiles: SharedFile[]) => void;
  maxFiles?: number;
  maxFileSize?: number;
  accept?: string;
  showUploadedFiles?: boolean;
  contextId?: string;
}

const FileSharing: React.FC<FileSharingProps> = ({
  onFilesSelected,
  onFilesUploaded,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  accept = "*/*",
  showUploadedFiles = true,
  contextId,
}) => {
  const { user } = useUserAuth();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<SharedFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, FileUploadProgress>
  >(new Map());
  const [isDragOver, setIsDragOver] = useState(false);
  const [shareDialogFile, setShareDialogFile] = useState<SharedFile | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileShareService = FileShareService.getInstance();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFileSelection(files);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFileSelection(files);
    },
    [],
  );

  const handleFileSelection = (files: File[]) => {
    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      if (file.size > maxFileSize) {
        errors.push(
          `${file.name}: File too large (max ${maxFileSize / 1024 / 1024}MB)`,
        );
        return;
      }

      if (selectedFiles.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join("\n"));
    }

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onFilesSelected?.(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  const uploadFiles = async () => {
    if (!user || selectedFiles.length === 0) return;

    const uploadPromises = selectedFiles.map(async (file) => {
      try {
        const sharedFile = await fileShareService.uploadFile(user.id, file, {
          contextId,
          category: "other",
          expiresInHours: 168, // 7 days
        });

        return sharedFile;
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        return null;
      }
    });

    // Monitor upload progress
    const progressInterval = setInterval(() => {
      const currentProgress = new Map<string, FileUploadProgress>();
      selectedFiles.forEach((file) => {
        const fileId = `temp_${file.name}_${file.size}`;
        const progress = fileShareService.getUploadProgress(fileId);
        if (progress) {
          currentProgress.set(fileId, progress);
        }
      });
      setUploadProgress(currentProgress);
    }, 100);

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(
        (file): file is SharedFile => file !== null,
      );

      setUploadedFiles([...uploadedFiles, ...successfulUploads]);
      setSelectedFiles([]);
      onFilesUploaded?.(successfulUploads);
    } finally {
      clearInterval(progressInterval);
      setUploadProgress(new Map());
    }
  };

  const getFileIcon = (file: File | SharedFile) => {
    const type = file.type;
    if (type.startsWith("image/")) {
      return <Image className="h-5 w-5 text-blue-500" />;
    } else if (type.includes("pdf") || type.includes("document")) {
      return <FileText className="h-5 w-5 text-red-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const copyShareLink = (file: SharedFile) => {
    const shareLink = `${window.location.origin}/shared/${file.shareCode}`;
    navigator.clipboard.writeText(shareLink);
    alert("Share link copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Support for images, documents, and references up to{" "}
          {maxFileSize / 1024 / 1024}MB
        </p>
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          Select Files
        </Button>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">
                Selected Files ({selectedFiles.length})
              </h4>
              <Button onClick={uploadFiles} disabled={!user}>
                <Upload className="h-4 w-4 mr-1" />
                Upload All
              </Button>
            </div>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {uploadProgress.size > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Upload Progress</h4>
            <div className="space-y-3">
              {Array.from(uploadProgress.entries()).map(
                ([fileId, progress]) => (
                  <div key={fileId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{progress.fileName}</span>
                      <div className="flex items-center space-x-2">
                        {progress.status === "uploading" && (
                          <Loader className="h-4 w-4 animate-spin" />
                        )}
                        {progress.status === "complete" && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {progress.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs">{progress.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={progress.percentage} className="h-2" />
                    {progress.error && (
                      <p className="text-xs text-red-500">{progress.error}</p>
                    )}
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {showUploadedFiles && uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Uploaded Files</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200"
                >
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                        {file.aiValidation && (
                          <Badge
                            variant={
                              file.aiValidation.approved
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            <Bot className="h-3 w-3 mr-1" />
                            {file.aiValidation.approved
                              ? "Validated"
                              : "Flagged"}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Downloads: {file.downloadCount}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyShareLink(file)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>File Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm text-gray-600">
                              File Name
                            </Label>
                            <p className="text-sm">{file.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm text-gray-600">
                              Share Code
                            </Label>
                            <div className="flex items-center space-x-2">
                              <Input
                                value={file.shareCode}
                                readOnly
                                className="text-xs"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyShareLink(file)}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          {file.aiValidation && (
                            <div>
                              <Label className="text-sm text-gray-600">
                                AI Analysis
                              </Label>
                              <div className="space-y-1">
                                <p className="text-xs">
                                  Content:{" "}
                                  {file.aiValidation.contentDescription}
                                </p>
                                <p className="text-xs">
                                  Safety Score:{" "}
                                  {Math.round(
                                    file.aiValidation.safetyScore * 100,
                                  )}
                                  %
                                </p>
                                {file.aiValidation.flags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {file.aiValidation.flags.map((flag) => (
                                      <Badge
                                        key={flag}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {flag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Limits Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          • Maximum {maxFiles} files, {maxFileSize / 1024 / 1024}MB each
        </p>
        <p>• Files are automatically validated by AI for safety and content</p>
        <p>• Shared files expire after 7 days by default</p>
      </div>
    </div>
  );
};

export default FileSharing;
