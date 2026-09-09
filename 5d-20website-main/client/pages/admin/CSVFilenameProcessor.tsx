import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileText,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Search,
  Download,
} from "lucide-react";

interface CSVProduct {
  name: string;
  imageField: string;
  originalData: any;
  index: number;
}

export default function CSVFilenameProcessor() {
  const [csvProducts, setCsvProducts] = useState<CSVProduct[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [matches, setMatches] = useState<{ [key: number]: string[] }>({});

  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessingStatus("Processing CSV...");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content
          .split("\n")
          .filter((line) => line.trim().length > 0);

        // Parse CSV
        const products: CSVProduct[] = [];
        let headers: string[] = [];

        // Detect headers
        if (
          lines[0] &&
          (lines[0].toLowerCase().includes("name") ||
            lines[0].toLowerCase().includes("product"))
        ) {
          headers = lines[0]
            .split(",")
            .map((h) => h.trim().toLowerCase().replace(/"/g, ""));
          lines.shift(); // Remove header line
        } else {
          headers = [
            "id",
            "type",
            "name",
            "description",
            "images",
            "category",
            "sku",
            "ribbon",
            "price",
            "surcharge",
            "visible",
            "inventory",
            "brand",
          ];
        }

        lines.forEach((line, index) => {
          const values = [];
          let current = "";
          let inQuotes = false;

          // Smart CSV parsing
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              values.push(current.trim().replace(/^"|"$/g, ""));
              current = "";
            } else {
              current += char;
            }
          }
          values.push(current.trim().replace(/^"|"$/g, ""));

          // Create product object
          const product: any = {};
          headers.forEach((header, i) => {
            product[header] = values[i] || "";
          });

          // Find image field
          const imageField =
            product.images ||
            product.productimageurl ||
            product.image ||
            product.filename ||
            values.find(
              (val) =>
                val &&
                (val.includes(".jpg") ||
                  val.includes(".png") ||
                  val.includes(".jpeg")),
            ) ||
            "";

          const productName =
            product.name || values[2] || values[1] || `Product ${index + 1}`;

          products.push({
            name: productName,
            imageField: imageField,
            originalData: product,
            index: index,
          });
        });

        setCsvProducts(products);
        setProcessingStatus(`Loaded ${products.length} products from CSV`);

        console.log("CSV Products loaded:", products);
      } catch (error) {
        setProcessingStatus(
          `Error: ${error instanceof Error ? error.message : "Failed to parse CSV"}`,
        );
      }
    };

    reader.readAsText(file);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const imageNames = Array.from(files).map((file) => file.name);
    setUploadedImages(imageNames);

    console.log("Image files uploaded:", imageNames);

    // Auto-match images with CSV products
    matchImagesWithProducts(imageNames);
  };

  const matchImagesWithProducts = (imageNames: string[]) => {
    const newMatches: { [key: number]: string[] } = {};

    csvProducts.forEach((product, productIndex) => {
      const potentialMatches: {
        image: string;
        score: number;
        reason: string;
      }[] = [];

      imageNames.forEach((imageName) => {
        const imageBase = imageName.replace(/\.[^/.]+$/, "").toLowerCase();
        const productImageField = product.imageField.toLowerCase();
        const productName = product.name.toLowerCase();

        let score = 0;
        let reasons: string[] = [];

        // Exact filename match
        if (
          imageBase === productImageField.replace(/\.[^/.]+$/, "").toLowerCase()
        ) {
          score += 100;
          reasons.push("Exact filename match");
        }

        // UUID matching
        const imageUUID = imageName.match(
          /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
        )?.[0];
        const productUUID = product.imageField.match(
          /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
        )?.[0];

        if (
          imageUUID &&
          productUUID &&
          imageUUID.toLowerCase() === productUUID.toLowerCase()
        ) {
          score += 95;
          reasons.push("UUID match");
        }

        // Partial filename match
        if (
          productImageField.includes(imageBase) ||
          imageBase.includes(productImageField.replace(/\.[^/.]+$/, ""))
        ) {
          score += 80;
          reasons.push("Partial filename match");
        }

        // Name similarity
        const nameWords = productName
          .split(/[\s\-_]+/)
          .filter((w) => w.length > 2);
        const imageWords = imageBase
          .split(/[\s\-_]+/)
          .filter((w) => w.length > 2);

        const commonWords = nameWords.filter((word) =>
          imageWords.some(
            (imgWord) => imgWord.includes(word) || word.includes(imgWord),
          ),
        );

        if (commonWords.length > 0) {
          score += commonWords.length * 15;
          reasons.push(`${commonWords.length} word matches`);
        }

        if (score > 10) {
          potentialMatches.push({
            image: imageName,
            score,
            reason: reasons.join(", "),
          });
        }
      });

      // Sort by score and take top matches
      potentialMatches.sort((a, b) => b.score - a.score);
      newMatches[productIndex] = potentialMatches
        .slice(0, 3)
        .map((match) => `${match.image} (${match.score}pts: ${match.reason})`);
    });

    setMatches(newMatches);
    setProcessingStatus(
      `Matched images with ${Object.keys(newMatches).length} products`,
    );
  };

  const downloadReport = () => {
    const report = csvProducts.map((product, index) => {
      const productMatches = matches[index] || [];
      return {
        "Product Name": product.name,
        "CSV Image Field": product.imageField,
        "Potential Matches": productMatches.join(" | "),
        "Match Count": productMatches.length,
      };
    });

    const csv = [
      Object.keys(report[0]).join(","),
      ...report.map((row) =>
        Object.values(row)
          .map((val) => `"${val}"`)
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "csv_image_matching_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              CSV Filename Processor
            </CardTitle>
            <p className="text-center text-gray-600">
              Debug and resolve CSV image filename issues
            </p>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* CSV Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Upload CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 border-2 border-dashed border-purple-300 rounded-lg">
                <Upload className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <Button
                  onClick={() => document.getElementById("csv-upload")?.click()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Choose CSV File
                </Button>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleCSVUpload}
                />
              </div>
              {csvProducts.length > 0 && (
                <div className="mt-4">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-300"
                  >
                    {csvProducts.length} products loaded
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                2. Upload Image Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 border-2 border-dashed border-pink-300 rounded-lg">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 text-pink-600" />
                <Button
                  onClick={() =>
                    document.getElementById("image-upload")?.click()
                  }
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  Choose Image Files
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-300"
                  >
                    {uploadedImages.length} images loaded
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Status */}
        {processingStatus && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{processingStatus}</AlertDescription>
          </Alert>
        )}

        {/* Results */}
        {csvProducts.length > 0 && uploadedImages.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Matching Results</CardTitle>
              <Button onClick={downloadReport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {csvProducts.map((product, index) => {
                  const productMatches = matches[index] || [];
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{product.name}</h4>
                          <p className="text-sm text-gray-600">
                            CSV Image Field: <code>{product.imageField}</code>
                          </p>
                        </div>
                        <Badge
                          variant={
                            productMatches.length > 0
                              ? "default"
                              : "destructive"
                          }
                        >
                          {productMatches.length} matches
                        </Badge>
                      </div>

                      {productMatches.length > 0 ? (
                        <div className="space-y-1">
                          {productMatches.map((match, matchIndex) => (
                            <div
                              key={matchIndex}
                              className="text-sm bg-green-50 p-2 rounded"
                            >
                              <CheckCircle className="w-4 h-4 inline text-green-600 mr-2" />
                              {match}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          <AlertCircle className="w-4 h-4 inline mr-2" />
                          No matching images found
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
