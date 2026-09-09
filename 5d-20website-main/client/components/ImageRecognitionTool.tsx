import React, { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Upload,
  Download,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import ImageRecognitionService, {
  RecognizedProduct,
  ImageAnalysisResult,
} from "../services/ImageRecognitionService";
import ProductImageAnalyzer from "./ProductImageAnalyzer";
import { exportToCSV } from "../utils/csvExporter";

interface ProcessingStatus {
  total: number;
  processed: number;
  failed: number;
  isProcessing: boolean;
}

const ImageRecognitionTool: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [recognizedProducts, setRecognizedProducts] = useState<
    RecognizedProduct[]
  >([]);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>({
    total: 0,
    processed: 0,
    failed: 0,
    isProcessing: false,
  });
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedProduct, setSelectedProduct] =
    useState<RecognizedProduct | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      setError("Some files were skipped. Only image files are supported.");
    } else {
      setError("");
    }

    setSelectedFiles(imageFiles);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    setSelectedFiles(imageFiles);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const processImages = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select images to process");
      return;
    }

    setProcessingStatus({
      total: selectedFiles.length,
      processed: 0,
      failed: 0,
      isProcessing: true,
    });
    setError("");
    setRecognizedProducts([]);

    try {
      const result: ImageAnalysisResult =
        await ImageRecognitionService.analyzeBatch(selectedFiles);

      if (result.success) {
        const validatedProducts =
          await ImageRecognitionService.checkForDuplicates(result.products);
        setRecognizedProducts(validatedProducts);
        setProcessingStatus((prev) => ({
          ...prev,
          processed: validatedProducts.length,
          failed: selectedFiles.length - validatedProducts.length,
          isProcessing: false,
        }));
        setActiveTab("results");
      } else {
        setError(result.error || "Processing failed");
        setProcessingStatus((prev) => ({ ...prev, isProcessing: false }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setProcessingStatus((prev) => ({ ...prev, isProcessing: false }));
    }
  };

  const exportResults = () => {
    if (recognizedProducts.length === 0) {
      setError("No products to export");
      return;
    }

    try {
      exportToCSV(recognizedProducts);
    } catch (err) {
      setError(
        "Failed to export CSV: " +
          (err instanceof Error ? err.message : "Unknown error"),
      );
    }
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setRecognizedProducts([]);
    setProcessingStatus({
      total: 0,
      processed: 0,
      failed: 0,
      isProcessing: false,
    });
    setError("");
    setSelectedProduct(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const progressPercentage =
    processingStatus.total > 0
      ? Math.round(
          ((processingStatus.processed + processingStatus.failed) /
            processingStatus.total) *
            100,
        )
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Upload className="h-6 w-6" />
            AI Image Recognition Tool
          </CardTitle>
          <p className="text-muted-foreground">
            Upload product images to automatically generate product details and
            CSV data
          </p>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload Images</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, WebP, and other image formats
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="text-sm p-2 bg-gray-50 rounded truncate"
                      >
                        {file.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={processImages}
                  disabled={
                    selectedFiles.length === 0 || processingStatus.isProcessing
                  }
                  className="flex-1"
                >
                  {processingStatus.isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Process Images"
                  )}
                </Button>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Processing Progress</h3>
                  <Badge
                    variant={
                      processingStatus.isProcessing ? "default" : "secondary"
                    }
                  >
                    {processingStatus.isProcessing ? "In Progress" : "Complete"}
                  </Badge>
                </div>

                <Progress value={progressPercentage} className="w-full" />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold">
                      {processingStatus.total}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Total Images
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {processingStatus.processed}
                    </p>
                    <p className="text-sm text-muted-foreground">Processed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">
                      {processingStatus.failed}
                    </p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                </div>

                {processingStatus.isProcessing && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin mr-2" />
                    <span>Analyzing images with AI...</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recognition Results</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={exportResults}
                    disabled={recognizedProducts.length === 0}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Badge variant="secondary">
                    {recognizedProducts.length} products recognized
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {recognizedProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No products recognized yet. Upload and process images to see
                  results.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recognizedProducts.map((product, index) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="aspect-square mb-3 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={product.imageUrl}
                            alt={product.details.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-sm mb-1 truncate">
                          {product.details.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {product.details.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {product.generatedSku}
                          </Badge>
                          <span className="font-medium text-sm">
                            ${product.suggestedPrice}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => setSelectedProduct(product)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedProduct && (
        <ProductImageAnalyzer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ImageRecognitionTool;
