import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  FileText,
  Zap,
  Target,
  Settings,
} from "lucide-react";

interface CSVItem {
  [key: string]: string;
  imageUrls?: string[]; // Extracted image URLs
  imageData?: string[]; // Base64 image data
  imagePaths?: string[]; // File paths
}

interface ImageFile {
  name: string;
  file: File;
  preview: string;
}

interface MatchResult {
  csvItem: CSVItem;
  csvIndex: number;
  imageMatches: {
    image: ImageFile;
    matchType: string;
    matchField: string;
    confidence: number;
    reason: string;
  }[];
  totalMatches: number;
}

export default function CSVImageMatcher() {
  const [csvData, setCsvData] = useState<CSVItem[]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Enhanced UUID extraction
  const extractUUID = (text: string): string | null => {
    const match = text.match(
      /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
    );
    return match ? match[0].toLowerCase() : null;
  };

  // Enhanced filename normalization
  const normalizeFilename = (filename: string): string => {
    return filename
      .replace(/\.[^/.]+$/, "") // Remove extension
      .toLowerCase()
      .replace(/[-_.]/g, ""); // Remove separators
  };

  // Extract images from CSV fields
  const extractImagesFromCSV = (csvItem: CSVItem): CSVItem => {
    const imageUrls: string[] = [];
    const imageData: string[] = [];
    const imagePaths: string[] = [];

    Object.entries(csvItem).forEach(([key, value]) => {
      if (!value || typeof value !== "string") return;

      // Check for image URLs
      if (
        value.startsWith("http") &&
        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(value)
      ) {
        imageUrls.push(value);
      }
      // Check for base64 image data
      else if (value.startsWith("data:image/")) {
        imageData.push(value);
      }
      // Check for file paths
      else if (
        value.includes("/") &&
        /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(value)
      ) {
        imagePaths.push(value);
      }
      // Check for multiple URLs separated by commas
      else if (value.includes(",") && value.includes("http")) {
        const urls = value
          .split(",")
          .map((url) => url.trim())
          .filter(
            (url) =>
              url.startsWith("http") &&
              /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url),
          );
        imageUrls.push(...urls);
      }
    });

    return {
      ...csvItem,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      imageData: imageData.length > 0 ? imageData : undefined,
      imagePaths: imagePaths.length > 0 ? imagePaths : undefined,
    };
  };

  // Detailed matching logic with debug info
  const findImageMatches = useCallback(
    (csvItem: CSVItem, images: ImageFile[]) => {
      const matches: any[] = [];
      const debug: string[] = [];

      debug.push(`\n🔍 MATCHING FOR CSV ITEM: ${csvItem.name || "Unknown"}`);

      // Get all possible fields that might contain filenames
      const possibleFields = Object.entries(csvItem).filter(([key, value]) => {
        if (!value || typeof value !== "string") return false;

        // Check if field might contain a filename
        const hasImageExtension = /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(value);
        const hasUUID =
          /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i.test(
            value,
          );
        const looksLikeFile = value.includes(".") || value.length > 10;

        return hasImageExtension || hasUUID || looksLikeFile;
      });

      debug.push(
        `📋 Possible filename fields: ${possibleFields.map(([k, v]) => `${k}="${v}"`).join(", ")}`,
      );

      // Test each image against each possible field
      for (const image of images) {
        const imageName = image.name;
        const imageBase = normalizeFilename(imageName);
        const imageUUID = extractUUID(imageName);

        debug.push(`\n🖼️ Testing image: ${imageName}`);
        debug.push(`   - Normalized: ${imageBase}`);
        debug.push(`   - UUID: ${imageUUID || "none"}`);

        for (const [fieldName, fieldValue] of possibleFields) {
          debug.push(`\n   🔍 Testing field "${fieldName}": "${fieldValue}"`);

          // Method 1: Exact UUID match
          if (imageUUID) {
            const fieldUUID = extractUUID(fieldValue);
            if (fieldUUID && fieldUUID === imageUUID) {
              debug.push(`   ✅ EXACT UUID MATCH: ${fieldUUID}`);
              matches.push({
                image,
                matchType: "UUID Exact",
                matchField: fieldName,
                confidence: 1.0,
                reason: `UUID "${fieldUUID}" matches exactly`,
              });
              continue; // Skip other tests for this image
            } else if (fieldUUID) {
              debug.push(
                `   ❌ UUID no match: field="${fieldUUID}" vs image="${imageUUID}"`,
              );
            }
          }

          // Method 2: Exact filename match
          const fieldBase = normalizeFilename(fieldValue);
          if (fieldBase && imageBase && fieldBase === imageBase) {
            debug.push(`   ✅ EXACT FILENAME MATCH: ${fieldBase}`);
            matches.push({
              image,
              matchType: "Filename Exact",
              matchField: fieldName,
              confidence: 0.9,
              reason: `Normalized filename "${fieldBase}" matches exactly`,
            });
            continue;
          }

          // Method 3: Partial filename match
          if (
            fieldBase &&
            imageBase &&
            fieldBase.length > 5 &&
            imageBase.length > 5
          ) {
            if (
              fieldBase.includes(imageBase) ||
              imageBase.includes(fieldBase)
            ) {
              const overlap =
                Math.min(fieldBase.length, imageBase.length) /
                Math.max(fieldBase.length, imageBase.length);
              if (overlap > 0.6) {
                debug.push(
                  `   ✅ PARTIAL FILENAME MATCH: ${overlap.toFixed(2)} overlap`,
                );
                matches.push({
                  image,
                  matchType: "Filename Partial",
                  matchField: fieldName,
                  confidence: overlap * 0.8,
                  reason: `Partial filename match with ${(overlap * 100).toFixed(1)}% overlap`,
                });
                continue;
              } else {
                debug.push(
                  `   ❌ Partial match too weak: ${overlap.toFixed(2)} overlap`,
                );
              }
            }
          }

          debug.push(`   ❌ No match for field "${fieldName}"`);
        }
      }

      // Sort matches by confidence and limit to top 2
      const sortedMatches = matches
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 2);

      debug.push(`\n📊 FINAL RESULTS: ${sortedMatches.length} matches found`);
      sortedMatches.forEach((match, i) => {
        debug.push(
          `   ${i + 1}. ${match.image.name} (${match.matchType}, ${(match.confidence * 100).toFixed(1)}%)`,
        );
      });

      return { matches: sortedMatches, debug };
    },
    [],
  );

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split("\n").filter((line) => line.trim());

      if (lines.length === 0) return;

      // Parse CSV
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const data: CSVItem[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i]
          .split(",")
          .map((v) => v.trim().replace(/"/g, ""));
        const item: CSVItem = {};

        headers.forEach((header, index) => {
          item[header] = values[index] || "";
        });

        // If no headers detected, create generic ones
        if (!headers.some((h) => h.toLowerCase().includes("name"))) {
          item["field_0"] = values[0] || "";
          item["field_1"] = values[1] || "";
          item["field_2"] = values[2] || "";
          item["field_3"] = values[3] || "";
          item["field_4"] = values[4] || "";
          item["name"] = values[2] || values[1] || values[0] || "Unknown";
        }

        // Extract embedded images from CSV fields
        const enhancedItem = extractImagesFromCSV(item);
        data.push(enhancedItem);
      }

      setCsvHeaders(headers);
      setCsvData(data);
      setDebugInfo([
        `📄 Loaded CSV: ${data.length} items, ${headers.length} columns`,
      ]);
    };

    reader.readAsText(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const images: ImageFile[] = [];
    const loadPromises: Promise<void>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith("image/")) continue;

      const promise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          images.push({
            name: file.name,
            file,
            preview: e.target?.result as string,
          });
          resolve();
        };
        reader.readAsDataURL(file);
      });

      loadPromises.push(promise);
    }

    Promise.all(loadPromises).then(() => {
      setImageFiles(images);
      setDebugInfo((prev) => [...prev, `🖼️ Loaded ${images.length} images`]);
    });
  };

  const runMatching = () => {
    if (csvData.length === 0 || imageFiles.length === 0) {
      alert("Please upload both CSV file and images first");
      return;
    }

    setIsMatching(true);
    setDebugInfo(["🚀 Starting detailed matching process..."]);

    // Process each CSV item
    const results: MatchResult[] = [];
    const allDebugInfo: string[] = ["🚀 Starting detailed matching process..."];

    csvData.forEach((csvItem, index) => {
      const { matches, debug } = findImageMatches(csvItem, imageFiles);

      results.push({
        csvItem,
        csvIndex: index,
        imageMatches: matches,
        totalMatches: matches.length,
      });

      allDebugInfo.push(...debug);
    });

    setMatchResults(results);
    setDebugInfo(allDebugInfo);
    setIsMatching(false);

    // Show summary
    const totalMatches = results.reduce((sum, r) => sum + r.totalMatches, 0);
    const itemsWithMatches = results.filter((r) => r.totalMatches > 0).length;

    alert(
      `Matching complete!\n\n${itemsWithMatches}/${csvData.length} CSV items found matches\nTotal matches: ${totalMatches}\n\nCheck debug info for details.`,
    );
  };

  const getMatchColor = (confidence: number) => {
    if (confidence >= 0.9)
      return "bg-green-100 border-green-300 text-green-800";
    if (confidence >= 0.7)
      return "bg-yellow-100 border-yellow-300 text-yellow-800";
    return "bg-red-100 border-red-300 text-red-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              CSV Image Matcher Debugger
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real-time CSV to image matching with detailed debug information and
            visual preview of all matches.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="mb-4"
              />
              {csvData.length > 0 && (
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Loaded {csvData.length} CSV items with {csvHeaders.length}{" "}
                    columns
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Images
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mb-4"
              />
              {imageFiles.length > 0 && (
                <Alert>
                  <CheckCircle className="w-4 h-4" />
                  <AlertDescription>
                    Loaded {imageFiles.length} images for matching
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Matching Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={runMatching}
                disabled={
                  isMatching || csvData.length === 0 || imageFiles.length === 0
                }
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isMatching ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Matching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start Detailed Matching
                  </>
                )}
              </Button>

              {matchResults.length > 0 && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {matchResults.filter((r) => r.totalMatches > 0).length}/
                  {matchResults.length} items matched
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Match Results */}
        {matchResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Match Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {matchResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedMatch === result
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedMatch(result)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {result.csvItem.name || `CSV Item ${index + 1}`}
                        </h4>
                        <Badge
                          variant={
                            result.totalMatches > 0 ? "default" : "secondary"
                          }
                          className={
                            result.totalMatches > 0
                              ? "bg-green-600"
                              : "bg-gray-400"
                          }
                        >
                          {result.totalMatches} matches
                        </Badge>
                      </div>

                      {result.totalMatches > 0 ? (
                        <div className="space-y-2">
                          {result.imageMatches.map((match, mi) => (
                            <div
                              key={mi}
                              className={`p-2 rounded border ${getMatchColor(match.confidence)}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium">
                                  {match.image.name}
                                </span>
                                <span className="text-xs">
                                  {(match.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="text-xs mt-1">
                                {match.matchType} via {match.matchField}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No matches found
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Match Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Match Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMatch ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold mb-2">CSV Item Data:</h4>

                      {/* Show embedded images if any */}
                      {(selectedMatch.csvItem.imageUrls ||
                        selectedMatch.csvItem.imageData ||
                        selectedMatch.csvItem.imagePaths) && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">
                            📸 Images Found in CSV:
                          </h5>

                          {selectedMatch.csvItem.imageUrls && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-blue-700">
                                URLs:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedMatch.csvItem.imageUrls.map(
                                  (url, i) => (
                                    <img
                                      key={i}
                                      src={url}
                                      alt={`CSV Image ${i + 1}`}
                                      className="w-16 h-16 object-cover rounded border"
                                      onError={(e) => {
                                        (
                                          e.target as HTMLImageElement
                                        ).style.display = "none";
                                      }}
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {selectedMatch.csvItem.imageData && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-blue-700">
                                Base64 Data:
                              </span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {selectedMatch.csvItem.imageData.map(
                                  (data, i) => (
                                    <img
                                      key={i}
                                      src={data}
                                      alt={`CSV Base64 Image ${i + 1}`}
                                      className="w-16 h-16 object-cover rounded border"
                                    />
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                          {selectedMatch.csvItem.imagePaths && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-blue-700">
                                File Paths:
                              </span>
                              <div className="text-xs text-gray-600">
                                {selectedMatch.csvItem.imagePaths.map(
                                  (path, i) => (
                                    <div key={i}>• {path}</div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedMatch.csvItem)
                          .filter(
                            ([key]) =>
                              ![
                                "imageUrls",
                                "imageData",
                                "imagePaths",
                              ].includes(key),
                          )
                          .map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-medium w-24 shrink-0">
                                {key}:
                              </span>
                              <span className="text-gray-600">{value}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {selectedMatch.imageMatches.length > 0 ? (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Matched Images:</h4>
                        {selectedMatch.imageMatches.map((match, index) => (
                          <div
                            key={index}
                            className={`p-4 border rounded-lg ${getMatchColor(match.confidence)}`}
                          >
                            <div className="flex gap-4">
                              <img
                                src={match.image.preview}
                                alt={match.image.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                              <div className="flex-1">
                                <div className="font-medium">
                                  {match.image.name}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {match.reason}
                                </div>
                                <div className="text-xs mt-1">
                                  <Badge variant="outline">
                                    {match.matchType}
                                  </Badge>
                                  <span className="ml-2">
                                    Field: {match.matchField}
                                  </span>
                                  <span className="ml-2">
                                    Confidence:{" "}
                                    {(match.confidence * 100).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No matches found for this CSV item
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a CSV item from the left to preview matches
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Debug Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                {debugInfo.map((line, index) => (
                  <div key={index} className="whitespace-pre-wrap">
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
