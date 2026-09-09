import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Eye,
  Search,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Copy,
} from "lucide-react";

export default function SimpleCSVDebugger() {
  const [csvRawContent, setCsvRawContent] = useState<string>("");
  const [csvLines, setCsvLines] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [manualMatches, setManualMatches] = useState<{ [key: number]: string }>(
    {},
  );

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvRawContent(content);

      const lines = content
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      setCsvLines(lines);

      console.log("📄 CSV RAW CONTENT:");
      console.log(content);
      console.log("📄 CSV LINES:");
      lines.forEach((line, i) => {
        console.log(`Line ${i}: ${line}`);
      });
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const names: string[] = [];
    for (let i = 0; i < files.length; i++) {
      names.push(files[i].name);
    }

    setImageFiles(names);

    console.log("🖼️ IMAGE FILES:");
    names.forEach((name, i) => {
      console.log(`Image ${i}: ${name}`);
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const findPotentialMatches = (csvLine: string, imageNames: string[]) => {
    const matches: { image: string; reason: string; score: number }[] = [];

    // Extract all text chunks from CSV line
    const csvParts = csvLine
      .split(",")
      .map((part) => part.replace(/"/g, "").trim());

    console.log(`\n🔍 ANALYZING CSV LINE: ${csvLine}`);
    console.log(`📋 CSV PARTS:`, csvParts);

    imageNames.forEach((imageName) => {
      const imageBase = imageName.replace(/\.[^/.]+$/, "").toLowerCase();
      const imageWords = imageBase.split(/[-_.]/).filter((w) => w.length > 2);

      console.log(`\n🖼️ Testing image: ${imageName}`);
      console.log(`   Base name: ${imageBase}`);
      console.log(`   Words: ${imageWords.join(", ")}`);

      csvParts.forEach((csvPart, partIndex) => {
        if (!csvPart || csvPart.length < 3) return;

        const csvPartLower = csvPart.toLowerCase();
        const csvWords = csvPartLower
          .split(/[-_.\s]/)
          .filter((w) => w.length > 2);

        // Test 1: Exact match
        if (csvPartLower === imageBase) {
          matches.push({
            image: imageName,
            reason: `Exact match: CSV[${partIndex}]="${csvPart}" = Image base "${imageBase}"`,
            score: 100,
          });
          console.log(
            `   ✅ EXACT MATCH with CSV part ${partIndex}: "${csvPart}"`,
          );
        }

        // Test 2: Contains match
        else if (
          csvPartLower.includes(imageBase) ||
          imageBase.includes(csvPartLower)
        ) {
          const score = Math.round(
            (Math.min(csvPartLower.length, imageBase.length) /
              Math.max(csvPartLower.length, imageBase.length)) *
              80,
          );
          matches.push({
            image: imageName,
            reason: `Contains match: CSV[${partIndex}]="${csvPart}" contains "${imageBase}" (${score}%)`,
            score,
          });
          console.log(
            `   ✅ CONTAINS MATCH with CSV part ${partIndex}: "${csvPart}" (${score}%)`,
          );
        }

        // Test 3: Word overlap
        else {
          const commonWords = csvWords.filter((csvWord) =>
            imageWords.some(
              (imageWord) =>
                csvWord.includes(imageWord) || imageWord.includes(csvWord),
            ),
          );

          if (commonWords.length > 0) {
            const score = Math.round(
              (commonWords.length /
                Math.max(csvWords.length, imageWords.length)) *
                60,
            );
            matches.push({
              image: imageName,
              reason: `Word overlap: CSV[${partIndex}]="${csvPart}" shares words [${commonWords.join(", ")}] with "${imageBase}" (${score}%)`,
              score,
            });
            console.log(
              `   ✅ WORD OVERLAP with CSV part ${partIndex}: words [${commonWords.join(", ")}] (${score}%)`,
            );
          } else {
            console.log(
              `   ❌ No match with CSV part ${partIndex}: "${csvPart}"`,
            );
          }
        }
      });
    });

    // Sort by score and return top matches
    return matches.sort((a, b) => b.score - a.score).slice(0, 3);
  };

  const setManualMatch = (csvLineIndex: number, imageName: string) => {
    setManualMatches((prev) => ({
      ...prev,
      [csvLineIndex]: imageName,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Search className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Simple CSV vs Images Debugger
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Raw comparison tool. Upload your files and see exactly what's in
            them - no complex algorithms, just direct comparison.
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Upload Your CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="mb-4"
              />
              {csvLines.length > 0 && (
                <div className="space-y-2">
                  <Badge className="bg-green-600">
                    ✅ Loaded {csvLines.length} CSV lines
                  </Badge>
                  <Button
                    onClick={() => copyToClipboard(csvRawContent)}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Raw CSV Content
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Upload Your Images
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
                <div className="space-y-2">
                  <Badge className="bg-blue-600">
                    ✅ Loaded {imageFiles.length} image files
                  </Badge>
                  <Button
                    onClick={() => copyToClipboard(imageFiles.join("\n"))}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Image Names List
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Raw Data Display */}
        {(csvLines.length > 0 || imageFiles.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* CSV Raw Data */}
            {csvLines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>CSV Raw Data ({csvLines.length} lines)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="font-mono text-xs space-y-1">
                      {csvLines.map((line, index) => (
                        <div key={index} className="flex">
                          <span className="text-blue-600 w-8 flex-shrink-0">
                            {index}:
                          </span>
                          <span className="break-all">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Image Files */}
            {imageFiles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Image Files ({imageFiles.length} files)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <div className="font-mono text-xs space-y-1">
                      {imageFiles.map((filename, index) => (
                        <div key={index} className="flex">
                          <span className="text-green-600 w-8 flex-shrink-0">
                            {index}:
                          </span>
                          <span className="break-all">{filename}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Manual Matching */}
        {csvLines.length > 0 && imageFiles.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Manual Matching & Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {csvLines.map((csvLine, csvIndex) => {
                  const potentialMatches = findPotentialMatches(
                    csvLine,
                    imageFiles,
                  );

                  return (
                    <div
                      key={csvIndex}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">CSV Line {csvIndex}</Badge>
                          {potentialMatches.length > 0 ? (
                            <Badge className="bg-green-600">
                              {potentialMatches.length} potential matches
                            </Badge>
                          ) : (
                            <Badge className="bg-red-600">
                              0 matches found
                            </Badge>
                          )}
                        </div>
                        <div className="font-mono text-sm bg-white p-2 rounded border break-all">
                          {csvLine}
                        </div>
                      </div>

                      {/* Show CSV parts breakdown */}
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">
                          CSV Parts:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {csvLine.split(",").map((part, partIndex) => (
                            <Badge
                              key={partIndex}
                              variant="outline"
                              className="text-xs"
                            >
                              [{partIndex}] {part.replace(/"/g, "").trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Potential matches */}
                      {potentialMatches.length > 0 && (
                        <div className="mb-3">
                          <div className="text-sm font-medium mb-2">
                            Potential Matches:
                          </div>
                          <div className="space-y-2">
                            {potentialMatches.map((match, matchIndex) => (
                              <div
                                key={matchIndex}
                                className={`p-2 rounded border text-sm ${
                                  match.score >= 80
                                    ? "bg-green-100 border-green-300"
                                    : match.score >= 60
                                      ? "bg-yellow-100 border-yellow-300"
                                      : "bg-red-100 border-red-300"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">
                                    {match.image}
                                  </span>
                                  <Badge
                                    className={
                                      match.score >= 80
                                        ? "bg-green-600"
                                        : match.score >= 60
                                          ? "bg-yellow-600"
                                          : "bg-red-600"
                                    }
                                  >
                                    {match.score}%
                                  </Badge>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {match.reason}
                                </div>
                                <Button
                                  onClick={() =>
                                    setManualMatch(csvIndex, match.image)
                                  }
                                  size="sm"
                                  className="mt-1"
                                  variant={
                                    manualMatches[csvIndex] === match.image
                                      ? "default"
                                      : "outline"
                                  }
                                >
                                  {manualMatches[csvIndex] === match.image
                                    ? "✅ Selected"
                                    : "Select This Match"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Manual selection */}
                      <div>
                        <div className="text-sm font-medium mb-2">
                          Manual Override:
                        </div>
                        <select
                          value={manualMatches[csvIndex] || ""}
                          onChange={(e) =>
                            setManualMatch(csvIndex, e.target.value)
                          }
                          className="w-full p-2 border rounded text-sm"
                        >
                          <option value="">No match selected</option>
                          {imageFiles.map((filename) => (
                            <option key={filename} value={filename}>
                              {filename}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {Object.keys(manualMatches).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Matching Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex gap-4 text-sm">
                  <Badge className="bg-blue-600">
                    {Object.keys(manualMatches).length} CSV lines matched
                  </Badge>
                  <Badge className="bg-green-600">
                    {new Set(Object.values(manualMatches)).size} unique images
                    used
                  </Badge>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="font-mono text-xs space-y-1">
                    {Object.entries(manualMatches).map(
                      ([csvIndex, imageName]) => (
                        <div key={csvIndex}>
                          CSV Line {csvIndex} → {imageName}
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    const summary = Object.entries(manualMatches)
                      .map(
                        ([csvIndex, imageName]) =>
                          `CSV Line ${csvIndex} → ${imageName}`,
                      )
                      .join("\n");
                    copyToClipboard(summary);
                  }}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Matching Summary
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
