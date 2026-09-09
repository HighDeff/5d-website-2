// Sourcing & Reselling Manager - Manage items sourced and resold for others
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Eye,
  ShoppingCart,
  ArrowUpDown,
  Calendar,
  Target,
  Award,
  RefreshCw,
} from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";

export interface SourcingItem {
  id: string;
  userId: string;
  type: "sourcing" | "reselling";
  productName: string;
  description: string;
  sourceLocation: string;
  costPrice: number;
  sellingPrice: number;
  expectedProfit: number;
  originalOwner?: string; // For reselling items
  commission?: number; // Commission for reselling
  status: "searching" | "found" | "purchased" | "listed" | "sold" | "returned";
  category: string;
  images: string[];
  tags: string[];
  clientInfo?: {
    name: string;
    contact: string;
    requirements: string;
  };
  salesData?: {
    soldPrice: number;
    soldDate: string;
    buyerId: string;
    commission: number;
    profit: number;
  };
  returnInfo?: {
    returnDate: string;
    reason: string;
    refundAmount: number;
    loss: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface SourcingManagerProps {
  userId?: string;
  className?: string;
}

const SourcingManager: React.FC<SourcingManagerProps> = ({
  userId,
  className = "",
}) => {
  const { user } = useUserAuth();
  const currentUserId = userId || user?.id;

  const [sourcingItems, setSourcingItems] = useState<SourcingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "all" | "sourcing" | "reselling" | "sold" | "returns"
  >("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SourcingItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formData, setFormData] = useState({
    type: "sourcing" as "sourcing" | "reselling",
    productName: "",
    description: "",
    sourceLocation: "",
    costPrice: 0,
    sellingPrice: 0,
    category: "",
    tags: "",
    originalOwner: "",
    commission: 10,
    clientName: "",
    clientContact: "",
    clientRequirements: "",
  });

  useEffect(() => {
    loadSourcingItems();
  }, [currentUserId]);

  const loadSourcingItems = () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const savedItems = localStorage.getItem("sourcingItems");
      const allItems: SourcingItem[] = savedItems ? JSON.parse(savedItems) : [];

      const userItems = allItems.filter(
        (item) => item.userId === currentUserId,
      );
      setSourcingItems(userItems);
    } catch (error) {
      console.error("Error loading sourcing items:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSourcingItems = (items: SourcingItem[]) => {
    try {
      // Get all items from storage
      const savedItems = localStorage.getItem("sourcingItems");
      const allItems: SourcingItem[] = savedItems ? JSON.parse(savedItems) : [];

      // Remove user's existing items and add updated ones
      const otherItems = allItems.filter(
        (item) => item.userId !== currentUserId,
      );
      const updatedAllItems = [...otherItems, ...items];

      localStorage.setItem("sourcingItems", JSON.stringify(updatedAllItems));
      setSourcingItems(items);
    } catch (error) {
      console.error("Error saving sourcing items:", error);
    }
  };

  const addSourcingItem = () => {
    if (!currentUserId || !formData.productName) return;

    const newItem: SourcingItem = {
      id: `sourcing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUserId,
      type: formData.type,
      productName: formData.productName,
      description: formData.description,
      sourceLocation: formData.sourceLocation,
      costPrice: formData.costPrice,
      sellingPrice: formData.sellingPrice,
      expectedProfit: formData.sellingPrice - formData.costPrice,
      originalOwner:
        formData.type === "reselling" ? formData.originalOwner : undefined,
      commission:
        formData.type === "reselling" ? formData.commission : undefined,
      status: "searching",
      category: formData.category,
      images: [],
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      clientInfo:
        formData.clientName && formData.type === "sourcing"
          ? {
              name: formData.clientName,
              contact: formData.clientContact,
              requirements: formData.clientRequirements,
            }
          : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedItems = [...sourcingItems, newItem];
    saveSourcingItems(updatedItems);

    // Reset form
    setFormData({
      type: "sourcing",
      productName: "",
      description: "",
      sourceLocation: "",
      costPrice: 0,
      sellingPrice: 0,
      category: "",
      tags: "",
      originalOwner: "",
      commission: 10,
      clientName: "",
      clientContact: "",
      clientRequirements: "",
    });

    setShowAddForm(false);
  };

  const updateItemStatus = (
    itemId: string,
    newStatus: SourcingItem["status"],
    additionalData?: any,
  ) => {
    const updatedItems = sourcingItems.map((item) => {
      if (item.id === itemId) {
        const updatedItem = {
          ...item,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };

        if (newStatus === "sold" && additionalData) {
          updatedItem.salesData = additionalData;
        } else if (newStatus === "returned" && additionalData) {
          updatedItem.returnInfo = additionalData;
        }

        return updatedItem;
      }
      return item;
    });

    saveSourcingItems(updatedItems);
  };

  const getFilteredItems = () => {
    let filtered = sourcingItems;

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "sourcing") {
        filtered = filtered.filter((item) => item.type === "sourcing");
      } else if (activeTab === "reselling") {
        filtered = filtered.filter((item) => item.type === "reselling");
      } else if (activeTab === "sold") {
        filtered = filtered.filter((item) => item.status === "sold");
      } else if (activeTab === "returns") {
        filtered = filtered.filter((item) => item.status === "returned");
      }
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  const getStats = () => {
    const totalItems = sourcingItems.length;
    const soldItems = sourcingItems.filter((item) => item.status === "sold");
    const totalRevenue = soldItems.reduce(
      (sum, item) => sum + (item.salesData?.soldPrice || 0),
      0,
    );
    const totalProfit = soldItems.reduce(
      (sum, item) => sum + (item.salesData?.profit || 0),
      0,
    );
    const returns = sourcingItems.filter((item) => item.status === "returned");
    const returnsLoss = returns.reduce(
      (sum, item) => sum + (item.returnInfo?.loss || 0),
      0,
    );

    return {
      totalItems,
      soldItems: soldItems.length,
      totalRevenue,
      totalProfit,
      returnsCount: returns.length,
      returnsLoss,
      netProfit: totalProfit - returnsLoss,
    };
  };

  const stats = getStats();
  const filteredItems = getFilteredItems();

  if (loading) {
    return (
      <div className={`${className}`}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mr-3" />
              <span className="text-gray-600">Loading sourcing data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header and Stats */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Package className="w-6 h-6 text-purple-600" />
            <span>Sourcing & Reselling</span>
          </h2>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalItems}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${stats.totalRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  ${stats.netProfit.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Net Profit</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${stats.returnsLoss.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Returns Loss</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: "all", label: `All (${sourcingItems.length})` },
            {
              id: "sourcing",
              label: `Sourcing (${sourcingItems.filter((i) => i.type === "sourcing").length})`,
            },
            {
              id: "reselling",
              label: `Reselling (${sourcingItems.filter((i) => i.type === "reselling").length})`,
            },
            { id: "sold", label: `Sold (${stats.soldItems})` },
            { id: "returns", label: `Returns (${stats.returnsCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Status</option>
          <option value="searching">Searching</option>
          <option value="found">Found</option>
          <option value="purchased">Purchased</option>
          <option value="listed">Listed</option>
          <option value="sold">Sold</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-12">
              <div className="text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by adding items you're sourcing or reselling for others.
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Item
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {item.productName}
                      </h3>
                      <Badge
                        variant={
                          item.type === "sourcing" ? "default" : "secondary"
                        }
                        className={
                          item.type === "sourcing"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "sold"
                            ? "border-green-300 text-green-700"
                            : item.status === "returned"
                              ? "border-red-300 text-red-700"
                              : "border-gray-300 text-gray-700"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">
                      {item.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Cost: </span>
                        <span className="font-medium">${item.costPrice}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Selling: </span>
                        <span className="font-medium">
                          ${item.sellingPrice}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expected Profit: </span>
                        <span className="font-medium text-green-600">
                          ${item.expectedProfit}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Category: </span>
                        <span className="font-medium">{item.category}</span>
                      </div>
                    </div>

                    {item.salesData && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-800">
                          <strong>Sold for ${item.salesData.soldPrice}</strong>{" "}
                          on{" "}
                          {new Date(
                            item.salesData.soldDate,
                          ).toLocaleDateString()}
                          <br />
                          Profit: ${item.salesData.profit} | Commission: $
                          {item.salesData.commission}
                        </div>
                      </div>
                    )}

                    {item.returnInfo && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-800">
                          <strong>Returned</strong> on{" "}
                          {new Date(
                            item.returnInfo.returnDate,
                          ).toLocaleDateString()}
                          <br />
                          Reason: {item.returnInfo.reason} | Loss: $
                          {item.returnInfo.loss}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2">
                    <select
                      value={item.status}
                      onChange={(e) =>
                        updateItemStatus(item.id, e.target.value as any)
                      }
                      className="text-sm px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="searching">Searching</option>
                      <option value="found">Found</option>
                      <option value="purchased">Purchased</option>
                      <option value="listed">Listed</option>
                      <option value="sold">Sold</option>
                      <option value="returned">Returned</option>
                    </select>

                    <Button variant="outline" size="sm">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Add New Item</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "sourcing" | "reselling",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="sourcing">Sourcing</option>
                    <option value="reselling">Reselling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                    placeholder="Enter product name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe the item"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cost Price
                  </label>
                  <Input
                    type="number"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        costPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selling Price
                  </label>
                  <Input
                    type="number"
                    value={formData.sellingPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sellingPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </div>

              {formData.type === "reselling" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Owner
                    </label>
                    <Input
                      value={formData.originalOwner}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          originalOwner: e.target.value,
                        })
                      }
                      placeholder="Owner name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Commission (%)
                    </label>
                    <Input
                      type="number"
                      value={formData.commission}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          commission: parseFloat(e.target.value) || 10,
                        })
                      }
                      placeholder="10"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={addSourcingItem}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SourcingManager;
