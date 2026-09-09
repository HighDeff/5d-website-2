import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Plus,
  Trash2,
  Image as ImageIcon,
  FileText,
  Upload,
  Eye,
  Copy,
} from "lucide-react";

interface ProductRow {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  tags: string;
}

export default function CSVGenerator() {
  const [products, setProducts] = useState<ProductRow[]>([
    {
      id: "1",
      name: "Sample Product",
      price: "29.99",
      description: "Sample product description",
      category: "Clothing",
      brand: "Sample Brand",
      images: [
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400",
      ],
      tags: "sample, product, test",
    },
  ]);
  const [csvFormat, setCsvFormat] = useState<"urls" | "base64" | "paths">(
    "urls",
  );
  const [previewCSV, setPreviewCSV] = useState<string>("");

  const addProduct = () => {
    const newProduct: ProductRow = {
      id: (products.length + 1).toString(),
      name: "",
      price: "",
      description: "",
      category: "Clothing",
      brand: "",
      images: [],
      tags: "",
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (
    index: number,
    field: keyof ProductRow,
    value: any,
  ) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const addImageToProduct = (productIndex: number, imageUrl: string) => {
    if (!imageUrl.trim()) return;

    const updated = [...products];
    updated[productIndex].images = [
      ...updated[productIndex].images,
      imageUrl.trim(),
    ];
    setProducts(updated);
  };

  const removeImageFromProduct = (productIndex: number, imageIndex: number) => {
    const updated = [...products];
    updated[productIndex].images = updated[productIndex].images.filter(
      (_, i) => i !== imageIndex,
    );
    setProducts(updated);
  };

  const convertImageToBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return url; // Return original URL if conversion fails
    }
  };

  const generateCSV = async () => {
    let headers: string[];

    if (csvFormat === "urls") {
      headers = [
        "id",
        "name",
        "price",
        "description",
        "category",
        "brand",
        "image1",
        "image2",
        "image3",
        "tags",
      ];
    } else if (csvFormat === "base64") {
      headers = [
        "id",
        "name",
        "price",
        "description",
        "category",
        "brand",
        "image_data1",
        "image_data2",
        "image_data3",
        "tags",
      ];
    } else {
      headers = [
        "id",
        "name",
        "price",
        "description",
        "category",
        "brand",
        "image_path1",
        "image_path2",
        "image_path3",
        "tags",
      ];
    }

    const csvRows = [headers.join(",")];

    for (const product of products) {
      const row: string[] = [
        `"${product.id}"`,
        `"${product.name}"`,
        `"${product.price}"`,
        `"${product.description}"`,
        `"${product.category}"`,
        `"${product.brand}"`,
      ];

      // Handle images based on format
      if (csvFormat === "base64") {
        // Convert images to base64
        const base64Images: string[] = [];
        for (const imageUrl of product.images.slice(0, 3)) {
          if (imageUrl.startsWith("data:")) {
            base64Images.push(imageUrl);
          } else {
            const base64 = await convertImageToBase64(imageUrl);
            base64Images.push(base64);
          }
        }

        // Add base64 images (up to 3)
        for (let i = 0; i < 3; i++) {
          row.push(`"${base64Images[i] || ""}"`);
        }
      } else {
        // Add image URLs or paths (up to 3)
        for (let i = 0; i < 3; i++) {
          row.push(`"${product.images[i] || ""}"`);
        }
      }

      row.push(`"${product.tags}"`);
      csvRows.push(row.join(","));
    }

    const csvContent = csvRows.join("\n");
    setPreviewCSV(csvContent);
    return csvContent;
  };

  const downloadCSV = async () => {
    const csvContent = await generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products_with_images_${csvFormat}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCSVToClipboard = async () => {
    const csvContent = await generateCSV();
    navigator.clipboard.writeText(csvContent);
    alert("CSV content copied to clipboard!");
  };

  const loadSampleData = () => {
    const sampleProducts: ProductRow[] = [
      {
        id: "UUID-001-ABC",
        name: "Vintage Designer Handbag",
        price: "295.00",
        description:
          "Authentic vintage designer handbag in excellent condition",
        category: "Clothing",
        brand: "Chanel",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
        ],
        tags: "vintage, designer, handbag, luxury",
      },
      {
        id: "UUID-002-DEF",
        name: "Sapphire Pendant Necklace",
        price: "189.99",
        description: "Beautiful sapphire pendant with 18k gold chain",
        category: "Jewelry",
        brand: "Tiffany",
        images: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
        ],
        tags: "jewelry, sapphire, necklace, gold",
      },
      {
        id: "UUID-003-GHI",
        name: "Smart Fitness Watch",
        price: "149.50",
        description: "Advanced fitness tracking with heart rate monitor",
        category: "Beauty",
        brand: "Apple",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
        ],
        tags: "smartwatch, fitness, technology",
      },
    ];
    setProducts(sampleProducts);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              CSV with Images Generator
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create CSV files with embedded images. Choose from URLs, Base64
            data, or file paths.
          </p>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Image Format</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={csvFormat}
                onValueChange={(value: any) => setCsvFormat(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urls">Image URLs</SelectItem>
                  <SelectItem value="base64">Base64 Data</SelectItem>
                  <SelectItem value="paths">File Paths</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 text-xs text-gray-600">
                {csvFormat === "urls" && "Store image URLs in CSV"}
                {csvFormat === "base64" && "Embed images as base64 data"}
                {csvFormat === "paths" && "Store relative file paths"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={loadSampleData}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Load Sample Data
              </Button>
              <Button onClick={addProduct} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={downloadCSV}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
              <Button
                onClick={copyCSVToClipboard}
                variant="outline"
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy to Clipboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Product Editor */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Products ({products.length})</span>
              <Badge variant="outline">{csvFormat} format</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {products.map((product, productIndex) => (
                <div
                  key={productIndex}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">
                      Product {productIndex + 1}
                    </h3>
                    <Button
                      onClick={() => removeProduct(productIndex)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label>ID</Label>
                      <Input
                        value={product.id}
                        onChange={(e) =>
                          updateProduct(productIndex, "id", e.target.value)
                        }
                        placeholder="Product ID or UUID"
                      />
                    </div>
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(productIndex, "name", e.target.value)
                        }
                        placeholder="Product name"
                      />
                    </div>
                    <div>
                      <Label>Price</Label>
                      <Input
                        value={product.price}
                        onChange={(e) =>
                          updateProduct(productIndex, "price", e.target.value)
                        }
                        placeholder="29.99"
                      />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select
                        value={product.category}
                        onValueChange={(value) =>
                          updateProduct(productIndex, "category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Clothing">Clothing</SelectItem>
                          <SelectItem value="Jewelry">Jewelry</SelectItem>
                          <SelectItem value="Beauty">Beauty</SelectItem>
                          <SelectItem value="Shoes & Accessories">
                            Shoes & Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Brand</Label>
                      <Input
                        value={product.brand}
                        onChange={(e) =>
                          updateProduct(productIndex, "brand", e.target.value)
                        }
                        placeholder="Brand name"
                      />
                    </div>
                    <div>
                      <Label>Tags</Label>
                      <Input
                        value={product.tags}
                        onChange={(e) =>
                          updateProduct(productIndex, "tags", e.target.value)
                        }
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <Label>Description</Label>
                    <Textarea
                      value={product.description}
                      onChange={(e) =>
                        updateProduct(
                          productIndex,
                          "description",
                          e.target.value,
                        )
                      }
                      placeholder="Product description"
                      rows={2}
                    />
                  </div>

                  {/* Images Section */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <ImageIcon className="w-4 h-4" />
                      Images ({product.images.length}/3)
                    </Label>

                    <div className="space-y-2">
                      {product.images.map((imageUrl, imageIndex) => (
                        <div
                          key={imageIndex}
                          className="flex items-center gap-2 p-2 bg-white rounded border"
                        >
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={`Product ${productIndex + 1} Image ${imageIndex + 1}`}
                              className="w-12 h-12 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          )}
                          <Input
                            value={imageUrl}
                            onChange={(e) => {
                              const updated = [...products];
                              updated[productIndex].images[imageIndex] =
                                e.target.value;
                              setProducts(updated);
                            }}
                            placeholder="Image URL or path"
                            className="flex-1"
                          />
                          <Button
                            onClick={() =>
                              removeImageFromProduct(productIndex, imageIndex)
                            }
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}

                      {product.images.length < 3 && (
                        <div className="flex gap-2">
                          <Input
                            placeholder="Add image URL..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                addImageToProduct(
                                  productIndex,
                                  (e.target as HTMLInputElement).value,
                                );
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <Button
                            onClick={() => {
                              const input = document.querySelector(
                                `input[placeholder="Add image URL..."]`,
                              ) as HTMLInputElement;
                              if (input?.value) {
                                addImageToProduct(productIndex, input.value);
                                input.value = "";
                              }
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CSV Preview */}
        {previewCSV && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                CSV Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
                <pre>{previewCSV}</pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
