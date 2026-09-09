import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  imageProcessingAI,
  ImageMetadata,
  ProcessingOptions,
} from "../services/ImageProcessingAI";

interface ImageProcessingInterfaceProps {
  userId: string;
  onImageProcessed: (metadata: ImageMetadata) => void;
  onPreviewGenerated: (preview: string) => void;
}

const ImageProcessingInterface: React.FC<ImageProcessingInterfaceProps> = ({
  userId,
  onImageProcessed,
  onPreviewGenerated,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ImageMetadata | null>(
    null,
  );
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>(
    {
      extractText: true,
      generateTags: true,
      enhance: true,
    },
  );
  const [cropArea, setCropArea] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [backgroundOptions, setBackgroundOptions] = useState({
    type: "color" as "color" | "image" | "remove",
    color: "#ffffff",
    imageUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        processImageFile(e.target.files[0]);
      }
    },
    [],
  );

  const processImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setProcessing(true);
    try {
      // Apply current processing options including crop and background
      const options: ProcessingOptions = {
        ...processingOptions,
        crop: cropArea || undefined,
        background:
          backgroundOptions.type !== "remove"
            ? {
                color: backgroundOptions.color,
                image:
                  backgroundOptions.type === "image"
                    ? backgroundOptions.imageUrl
                    : undefined,
              }
            : undefined,
      };

      const metadata = await imageProcessingAI.processImage(
        userId,
        file,
        options,
      );
      setProcessedImage(metadata);
      onImageProcessed(metadata);

      // Generate preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);

      // Generate AI product preview
      const productPreview = await imageProcessingAI.generateProductPreview(
        userId,
        metadata,
        { name: "Product", category: "General" },
      );
      onPreviewGenerated(productPreview);
    } catch (error) {
      console.error("Image processing failed:", error);
      alert("Failed to process image. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const updateCropArea = (
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    setCropArea({ x, y, width, height });
  };

  const clearCropArea = () => {
    setCropArea(null);
  };

  const handleBackgroundChange = (
    type: "color" | "image" | "remove",
    value?: string,
  ) => {
    setBackgroundOptions((prev) => ({
      ...prev,
      type,
      ...(type === "color" && value ? { color: value } : {}),
      ...(type === "image" && value ? { imageUrl: value } : {}),
    }));
  };

  const searchUserImages = async (query: string) => {
    try {
      const results = await imageProcessingAI.searchUserImages(userId, query);
      return results;
    } catch (error) {
      console.error("Image search failed:", error);
      return [];
    }
  };

  const getCapabilities = () => {
    return {
      canProcess: [
        "Extract text from images using OCR",
        "Generate descriptive tags automatically",
        "Crop images to desired dimensions",
        "Add solid color backgrounds",
        "Add custom image backgrounds",
        "Remove/transparent backgrounds",
        "Enhance image quality",
        "Extract color palette",
        "Calculate image quality score",
        "Generate marketing suggestions",
      ],
      cannotProcess: [
        "Advanced photo manipulation like Photoshop",
        "Complex object removal",
        "Face recognition or modification",
        "Copyright-protected content processing",
        "Real-time video processing",
        "Files larger than 50MB",
      ],
      limitations: [
        "OCR accuracy depends on image quality",
        "Background removal works best with clear subjects",
        "Processing time increases with image size",
        "Color extraction limited to dominant colors",
      ],
    };
  };

  return (
    <div className="image-processing-interface p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">AI Image Processing</h3>
        <p className="text-gray-600">
          Drag and drop an image or click to upload. AI will extract information
          and enhance your product images.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {!previewUrl ? (
          <div>
            <svg
              className="w-12 h-12 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your image here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports JPG, PNG, GIF, WebP up to 50MB
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Choose File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded"
            />
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Replace Image
              </button>
              <button
                onClick={() => {
                  setPreviewUrl("");
                  setProcessedImage(null);
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Processing Options */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Processing Options</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={processingOptions.extractText}
                onChange={(e) =>
                  setProcessingOptions((prev) => ({
                    ...prev,
                    extractText: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              Extract text using OCR
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={processingOptions.generateTags}
                onChange={(e) =>
                  setProcessingOptions((prev) => ({
                    ...prev,
                    generateTags: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              Generate descriptive tags
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={processingOptions.enhance}
                onChange={(e) =>
                  setProcessingOptions((prev) => ({
                    ...prev,
                    enhance: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              Enhance image quality
            </label>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">Background Options</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="background"
                checked={backgroundOptions.type === "remove"}
                onChange={() => handleBackgroundChange("remove")}
                className="mr-2"
              />
              Remove/Transparent
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="background"
                checked={backgroundOptions.type === "color"}
                onChange={() => handleBackgroundChange("color")}
                className="mr-2"
              />
              Solid Color
              {backgroundOptions.type === "color" && (
                <input
                  type="color"
                  value={backgroundOptions.color}
                  onChange={(e) =>
                    handleBackgroundChange("color", e.target.value)
                  }
                  className="ml-2 w-8 h-6 rounded"
                />
              )}
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="background"
                checked={backgroundOptions.type === "image"}
                onChange={() => handleBackgroundChange("image")}
                className="mr-2"
              />
              Custom Image
            </label>
            {backgroundOptions.type === "image" && (
              <input
                type="url"
                placeholder="Image URL"
                value={backgroundOptions.imageUrl}
                onChange={(e) =>
                  handleBackgroundChange("image", e.target.value)
                }
                className="ml-6 px-2 py-1 border rounded text-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* Crop Controls */}
      {previewUrl && (
        <div className="mt-6">
          <h4 className="font-medium mb-3">Crop Controls</h4>
          <div className="flex gap-4 items-center">
            {cropArea ? (
              <div className="text-sm bg-gray-100 p-2 rounded">
                Crop: {cropArea.x}, {cropArea.y}, {cropArea.width}x
                {cropArea.height}
                <button
                  onClick={clearCropArea}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Clear
                </button>
              </div>
            ) : (
              <button
                onClick={() => updateCropArea(10, 10, 200, 200)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Crop Area
              </button>
            )}
          </div>
        </div>
      )}

      {/* Processing Status */}
      {processing && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing image with AI...
          </div>
        </div>
      )}

      {/* Results */}
      {processedImage && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">Extracted Information</h4>
            <div className="bg-gray-50 p-4 rounded space-y-2 text-sm">
              <p>
                <strong>Filename:</strong> {processedImage.filename}
              </p>
              <p>
                <strong>Dimensions:</strong> {processedImage.dimensions.width}x
                {processedImage.dimensions.height}
              </p>
              <p>
                <strong>Format:</strong> {processedImage.format}
              </p>
              <p>
                <strong>Quality Score:</strong> {processedImage.quality}/100
              </p>

              {processedImage.extractedText.length > 0 && (
                <div>
                  <strong>Extracted Text:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {processedImage.extractedText.map((text, index) => (
                      <li key={index}>{text}</li>
                    ))}
                  </ul>
                </div>
              )}

              {processedImage.tags.length > 0 && (
                <div>
                  <strong>Generated Tags:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {processedImage.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Color Palette</h4>
            <div className="flex gap-2 flex-wrap">
              {processedImage.colorPalette.map((color, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Capabilities Info */}
      <div className="mt-8 border-t pt-6">
        <h4 className="font-medium mb-3">AI Capabilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-medium text-green-600 mb-2">What AI Can Do</h5>
            <ul className="space-y-1 text-gray-600">
              {getCapabilities()
                .canProcess.slice(0, 5)
                .map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-1">✓</span>
                    {item}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-red-600 mb-2">
              Current Limitations
            </h5>
            <ul className="space-y-1 text-gray-600">
              {getCapabilities()
                .cannotProcess.slice(0, 5)
                .map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-1">✗</span>
                    {item}
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <h5 className="font-medium text-yellow-600 mb-2">
              Important Notes
            </h5>
            <ul className="space-y-1 text-gray-600">
              {getCapabilities().limitations.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-500 mr-1">!</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageProcessingInterface;
