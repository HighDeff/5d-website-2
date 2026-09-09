import { RecognizedProduct } from "../services/ImageRecognitionService";

interface CSVRow {
  handleId: string;
  fieldType: string;
  name: string;
  description: string;
  productImageUrl: string;
  collection: string;
  sku: string;
  ribbon: string;
  price: number;
  surcharge: number;
  visible: string;
  discountMode: string;
  discountValue: number;
  inventory: number;
  weight: number;
  cost: number;
  brand: string;
  additionalInfoTitle1: string;
  additionalInfoDescription1: string;
}

/**
 * Converts recognized products to CSV format matching the existing product data structure
 */
export function convertToCSVFormat(products: RecognizedProduct[]): CSVRow[] {
  return products.map((product) => ({
    handleId: product.handleId,
    fieldType: "Product",
    name: product.details.name,
    description: product.details.description,
    productImageUrl: product.imageUrl,
    collection: product.details.category,
    sku: product.generatedSku,
    ribbon: "", // Empty by default, can be set manually if needed
    price: product.suggestedPrice,
    surcharge: 0, // Default surcharge
    visible: "TRUE",
    discountMode: "NONE",
    discountValue: 0,
    inventory: 100, // Default inventory
    weight: 0.5, // Default weight in lbs
    cost: Math.round(product.suggestedPrice * 0.6 * 100) / 100, // 60% of suggested price as cost
    brand: product.details.brand || "Lilly's Fashion Couture",
    additionalInfoTitle1: "Return Policy",
    additionalInfoDescription1: "30-day return policy. Contact us for details.",
  }));
}

/**
 * Generates CSV content from product data
 */
function generateCSVContent(data: CSVRow[]): string {
  if (data.length === 0) {
    throw new Error("No data to export");
  }

  // Get headers from the first row
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(","),
    // Data rows
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header as keyof CSVRow];
          // Escape values that contain commas, quotes, or newlines
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"') || value.includes("\n"))
          ) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    ),
  ].join("\n");

  return csvContent;
}

/**
 * Downloads CSV file with recognized products data
 */
export function exportToCSV(
  products: RecognizedProduct[],
  filename?: string,
): void {
  try {
    const csvData = convertToCSVFormat(products);
    const csvContent = generateCSVContent(csvData);

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        filename ||
          `recognized_products_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      throw new Error("CSV download not supported in this browser");
    }
  } catch (error) {
    console.error("Error exporting CSV:", error);
    throw error;
  }
}

/**
 * Validates CSV data structure
 */
export function validateCSVData(data: CSVRow[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!Array.isArray(data) || data.length === 0) {
    errors.push("No data provided for validation");
    return { isValid: false, errors };
  }

  const requiredFields: (keyof CSVRow)[] = [
    "handleId",
    "fieldType",
    "name",
    "description",
    "productImageUrl",
    "collection",
    "sku",
    "price",
    "visible",
    "inventory",
    "brand",
  ];

  data.forEach((row, index) => {
    requiredFields.forEach((field) => {
      if (
        !row[field] ||
        (typeof row[field] === "string" && row[field].trim() === "")
      ) {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });

    // Validate specific field types
    if (typeof row.price !== "number" || row.price <= 0) {
      errors.push(`Row ${index + 1}: Invalid price value`);
    }

    if (typeof row.inventory !== "number" || row.inventory < 0) {
      errors.push(`Row ${index + 1}: Invalid inventory value`);
    }

    if (!row.handleId.startsWith("product_")) {
      errors.push(`Row ${index + 1}: Handle ID should start with 'product_'`);
    }

    if (!row.sku.startsWith("LFC-")) {
      errors.push(`Row ${index + 1}: SKU should start with 'LFC-'`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Preview CSV content without downloading
 */
export function previewCSV(
  products: RecognizedProduct[],
  maxRows: number = 5,
): string {
  const csvData = convertToCSVFormat(products.slice(0, maxRows));
  return generateCSVContent(csvData);
}

/**
 * Get CSV statistics
 */
export function getCSVStats(products: RecognizedProduct[]): {
  totalProducts: number;
  avgPrice: number;
  categories: Record<string, number>;
  brands: Record<string, number>;
} {
  const stats = {
    totalProducts: products.length,
    avgPrice: 0,
    categories: {} as Record<string, number>,
    brands: {} as Record<string, number>,
  };

  if (products.length === 0) return stats;

  let totalPrice = 0;

  products.forEach((product) => {
    // Price calculation
    totalPrice += product.suggestedPrice;

    // Category counting
    const category = product.details.category;
    stats.categories[category] = (stats.categories[category] || 0) + 1;

    // Brand counting
    const brand = product.details.brand || "Lilly's Fashion Couture";
    stats.brands[brand] = (stats.brands[brand] || 0) + 1;
  });

  stats.avgPrice = Math.round((totalPrice / products.length) * 100) / 100;

  return stats;
}
