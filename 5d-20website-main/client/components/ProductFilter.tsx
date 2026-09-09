import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Filter, SlidersHorizontal, Check, RotateCcw } from "lucide-react";

interface FilterOptions {
  categories: string[];
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: string;
  inStockOnly: boolean;
}

interface ProductFilterProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function ProductFilter({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
}: ProductFilterProps) {
  // Default filters to prevent undefined errors
  const defaultFilters: FilterOptions = {
    categories: [],
    priceRange: { min: 0, max: 1000 },
    sortBy: "featured",
    inStockOnly: false,
  };

  const [filters, setFilters] = useState<FilterOptions>(currentFilters || defaultFilters);

  const categories = [
    "Clothing",
    "Jewelry",
    "Shoes & Accessories",
    "Home & Kitchen",
    "Beauty",
  ];

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "rating", label: "Highest Rated" },
  ];

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseFloat(value) || 0;
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [type]: numValue,
      },
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      categories: [],
      priceRange: { min: 0, max: 1000 },
      sortBy: "featured",
      inStockOnly: false,
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const getActiveFiltersCount = () => {
    if (!filters) return 0;

    let count = 0;
    if (filters.categories?.length > 0) count++;
    if (filters.priceRange?.min > 0 || filters.priceRange?.max < 1000) count++;
    if (filters.sortBy !== "featured") count++;
    if (filters.inStockOnly) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent flex items-center">
              <SlidersHorizontal className="w-6 h-6 mr-2 text-pink-600" />
              Filter Products
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          {getActiveFiltersCount() > 0 && (
            <Badge className="bg-pink-100 text-pink-800 w-fit">
              {getActiveFiltersCount()} filter
              {getActiveFiltersCount() > 1 ? "s" : ""} active
            </Badge>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Categories */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters?.categories?.includes(category) || false}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium">{category}</span>
                    {filters?.categories?.includes(category) && (
                      <Check className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Range */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Price Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price
                  </label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={filters?.priceRange?.min || ""}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price
                  </label>
                  <Input
                    type="number"
                    placeholder="$1000"
                    value={filters?.priceRange?.max || ""}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Showing products from ${filters?.priceRange?.min || 0} to $
                {filters?.priceRange?.max || 1000}
              </div>
            </CardContent>
          </Card>

          {/* Sort By */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Sort By</h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={filters.sortBy === option.value}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sortBy: e.target.value,
                        }))
                      }
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                    {filters?.sortBy === option.value && (
                      <Check className="w-4 h-4 text-green-500 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Availability</h3>
              <label className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={filters?.inStockOnly || false}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      inStockOnly: e.target.checked,
                    }))
                  }
                  className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                />
                <span className="text-sm font-medium">In Stock Only</span>
                {filters?.inStockOnly && (
                  <Check className="w-4 h-4 text-green-500 ml-auto" />
                )}
              </label>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-6 border-t">
          <Button
            onClick={handleResetFilters}
            variant="outline"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
