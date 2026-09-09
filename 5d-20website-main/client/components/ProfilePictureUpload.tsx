// Profile Picture Upload Component
// Handles profile picture upload with validation and preview

import React, { useState, useRef } from "react";
import {
  Camera,
  Upload,
  Trash2,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DatabaseService from "../services/DatabaseService";
import ValidationService from "../services/ValidationService";
import { useUserAuth } from "../hooks/useUserAuth";

interface ProfilePictureUploadProps {
  currentImage?: string;
  onUploadSuccess?: (imageUrl: string) => void;
  onUploadError?: (error: string) => void;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  onUploadSuccess,
  onUploadError,
}) => {
  const { user, refreshUser } = useUserAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImage || null,
  );
  const [validationResult, setValidationResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      onUploadError?.("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      onUploadError?.("Image must be smaller than 5MB");
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Run AI validation
    await validateImage(file);
  };

  const validateImage = async (file: File) => {
    try {
      const validationService = ValidationService.getInstance();
      const result = await validationService.validateProfileImage(file);
      setValidationResult(result);

      if (!result.isValid) {
        onUploadError?.(result.issues[0]?.message || "Image validation failed");
      }
    } catch (error) {
      console.error("Image validation error:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    try {
      // Convert file to base64 for storage
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64String = e.target?.result as string;

        // Save to database
        const db = DatabaseService.getInstance();
        const uploadResult = await db.uploadFile(
          user.id,
          selectedFile,
          undefined,
          ["profile", "avatar"],
        );

        if (uploadResult.success) {
          // Update user profile with new image
          const updatedUser = {
            ...user,
            files: {
              ...user.files,
              profilePicture: base64String,
            },
            updatedAt: new Date().toISOString(),
          };

          await db.updateUser(user.id, updatedUser);
          await refreshUser();

          onUploadSuccess?.(base64String);
          console.log("✅ Profile picture uploaded successfully");
        } else {
          throw new Error(uploadResult.error || "Upload failed");
        }
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Upload error:", error);
      onUploadError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) return;

    try {
      const db = DatabaseService.getInstance();
      const updatedUser = {
        ...user,
        files: {
          ...user.files,
          profilePicture: undefined,
        },
        updatedAt: new Date().toISOString(),
      };

      await db.updateUser(user.id, updatedUser);
      await refreshUser();

      setPreviewUrl(null);
      setSelectedFile(null);
      setValidationResult(null);

      console.log("✅ Profile picture removed");
    } catch (error) {
      console.error("Remove error:", error);
      onUploadError?.("Failed to remove profile picture");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          {/* Profile Picture Display */}
          <div className="relative mx-auto w-32 h-32">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-4 border-purple-200 shadow-lg"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="absolute -bottom-2 -right-2 flex space-x-1">
              <Button
                size="sm"
                onClick={triggerFileSelect}
                className="w-8 h-8 rounded-full bg-purple-600 hover:bg-purple-700"
                disabled={isUploading}
              >
                <Camera className="w-4 h-4" />
              </Button>
              {previewUrl && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleRemove}
                  className="w-8 h-8 rounded-full"
                  disabled={isUploading}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Status */}
          {selectedFile && !previewUrl?.startsWith("data:") && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
              <Button
                onClick={handleUpload}
                disabled={isUploading || !validationResult?.isValid}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Picture
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Validation Results */}
          {validationResult && (
            <div className="space-y-2 text-left">
              {validationResult.isValid ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">
                    Image looks good! Score: {validationResult.score}/100
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    <div className="space-y-1">
                      <div>
                        Issues found (Score: {validationResult.score}/100):
                      </div>
                      {validationResult.issues.map(
                        (issue: any, index: number) => (
                          <div key={index} className="text-xs">
                            • {issue.message}
                          </div>
                        ),
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* AI Analysis Details */}
              {validationResult.faceDetected !== undefined && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        validationResult.faceDetected
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span>
                      Face: {validationResult.faceDetected ? "✓" : "?"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        validationResult.appropriateContent
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span>
                      Content: {validationResult.appropriateContent ? "✓" : "✗"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        validationResult.imageQuality > 70
                          ? "bg-green-500"
                          : validationResult.imageQuality > 50
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <span>
                      Quality: {Math.round(validationResult.imageQuality)}%
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        validationResult.dimensionsValid
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span>
                      Size: {validationResult.dimensionsValid ? "✓" : "✗"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Upload a clear photo of yourself</p>
            <p>• Maximum size: 5MB</p>
            <p>• Supported formats: JPG, PNG, WebP</p>
            <p>• AI validation ensures appropriate content</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfilePictureUpload;
