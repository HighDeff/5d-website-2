import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  X,
  Edit2,
  Save,
  Copy,
  Star,
  Package,
  DollarSign,
  Tag,
} from "lucide-react";
import { RecognizedProduct } from "../services/ImageRecognitionService";

interface ProductImageAnalyzerProps {
  product: RecognizedProduct;
  onClose: () => void;
  onSave?: (updatedProduct: RecognizedProduct) => void;
}

const ProductImageAnalyzer: React.FC<ProductImageAnalyzerProps> = ({
  product,
  onClose,
  onSave,
}) => {
  const [editedProduct, setEditedProduct] = useState<RecognizedProduct>({
    ...product,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleSave = () => {
    onSave?.(editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct({ ...product });
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const confidenceColor =
    product.details.confidence >= 0.8
      ? "text-green-600"
      : product.details.confidence >= 0.6
        ? "text-yellow-600"
        : "text-red-600";

  const confidenceLabel =
    product.details.confidence >= 0.8
      ? "High"
      : product.details.confidence >= 0.6
        ? "Medium"
        : "Low";

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Product Analysis Details
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={confidenceColor}>
                <Star className="h-3 w-3 mr-1" />
                {confidenceLabel} Confidence (
                {Math.round(product.details.confidence * 100)}%)
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Product Image
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={product.imageUrl}
                    alt={product.details.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <DollarSign className="h-4 w-4 mx-auto mb-1 text-green-600" />
                    <p className="text-sm font-medium">
                      ${editedProduct.suggestedPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Suggested Price
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Package className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm font-medium">
                      {editedProduct.generatedSku}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Generated SKU
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attributes">Attributes</TabsTrigger>
                <TabsTrigger value="data">Export Data</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        Product Information
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        {isEditing ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedProduct.details.name}
                          onChange={(e) =>
                            setEditedProduct((prev) => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                name: e.target.value,
                              },
                            }))
                          }
                        />
                      ) : (
                        <p className="text-sm mt-1">{product.details.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      {isEditing ? (
                        <Textarea
                          id="description"
                          value={editedProduct.details.description}
                          onChange={(e) =>
                            setEditedProduct((prev) => ({
                              ...prev,
                              details: {
                                ...prev.details,
                                description: e.target.value,
                              },
                            }))
                          }
                          rows={3}
                        />
                      ) : (
                        <p className="text-sm mt-1">
                          {product.details.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        {isEditing ? (
                          <Select
                            value={editedProduct.details.category}
                            onValueChange={(value) =>
                              setEditedProduct((prev) => ({
                                ...prev,
                                details: { ...prev.details, category: value },
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Fashion">Fashion</SelectItem>
                              <SelectItem value="Beauty">Beauty</SelectItem>
                              <SelectItem value="Accessories">
                                Accessories
                              </SelectItem>
                              <SelectItem value="Shoes">Shoes</SelectItem>
                              <SelectItem value="Bags">Bags</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-sm mt-1">
                            {product.details.category}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="type">Product Type</Label>
                        {isEditing ? (
                          <Input
                            id="type"
                            value={editedProduct.details.type}
                            onChange={(e) =>
                              setEditedProduct((prev) => ({
                                ...prev,
                                details: {
                                  ...prev.details,
                                  type: e.target.value,
                                },
                              }))
                            }
                          />
                        ) : (
                          <p className="text-sm mt-1">{product.details.type}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Colors</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {product.details.colors.map((color, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="text-xs"
                          >
                            {color}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleSave} size="sm">
                          <Save className="h-3 w-3 mr-1" />
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attributes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Product Attributes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {product.details.material && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Material:
                        </span>
                        <span className="text-sm">
                          {product.details.material}
                        </span>
                      </div>
                    )}

                    {product.details.style && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Style:
                        </span>
                        <span className="text-sm">{product.details.style}</span>
                      </div>
                    )}

                    {product.details.brand && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Brand:
                        </span>
                        <span className="text-sm">{product.details.brand}</span>
                      </div>
                    )}

                    {product.details.gender && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Gender:
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {product.details.gender}
                        </Badge>
                      </div>
                    )}

                    {product.details.size && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Size:
                        </span>
                        <span className="text-sm">{product.details.size}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Handle ID:
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono">
                          {product.handleId}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(product.handleId)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Generated SKU:
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-mono">
                          {product.generatedSku}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(product.generatedSku)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">
                      Export Data Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs font-mono bg-gray-50 p-3 rounded-lg max-h-60 overflow-y-auto">
                      <div>
                        <strong>handleId:</strong> {product.handleId}
                      </div>
                      <div>
                        <strong>fieldType:</strong> Product
                      </div>
                      <div>
                        <strong>name:</strong> {product.details.name}
                      </div>
                      <div>
                        <strong>description:</strong>{" "}
                        {product.details.description}
                      </div>
                      <div>
                        <strong>productImageUrl:</strong> {product.imageUrl}
                      </div>
                      <div>
                        <strong>collection:</strong> {product.details.category}
                      </div>
                      <div>
                        <strong>sku:</strong> {product.generatedSku}
                      </div>
                      <div>
                        <strong>ribbon:</strong>{" "}
                      </div>
                      <div>
                        <strong>price:</strong> {product.suggestedPrice}
                      </div>
                      <div>
                        <strong>surcharge:</strong> 0
                      </div>
                      <div>
                        <strong>visible:</strong> TRUE
                      </div>
                      <div>
                        <strong>discountMode:</strong> NONE
                      </div>
                      <div>
                        <strong>discountValue:</strong> 0
                      </div>
                      <div>
                        <strong>inventory:</strong> 100
                      </div>
                      <div>
                        <strong>weight:</strong> 0.5
                      </div>
                      <div>
                        <strong>cost:</strong> 5.99
                      </div>
                      <div>
                        <strong>brand:</strong> Lilly's Fashion Couture
                      </div>
                      <div>
                        <strong>additionalInfoTitle1:</strong> Return Policy
                      </div>
                      <div>
                        <strong>additionalInfoDescription1:</strong> 30-day
                        return policy. Contact us for details.
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(product, null, 2))
                      }
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy Raw Data
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageAnalyzer;
