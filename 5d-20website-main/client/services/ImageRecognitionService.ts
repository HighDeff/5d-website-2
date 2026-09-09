interface ProductDetails {
  name: string;
  description: string;
  category: string;
  colors: string[];
  material?: string;
  style?: string;
  brand?: string;
  type: string;
  gender?: "men" | "women" | "unisex";
  size?: string;
  confidence: number;
}

interface RecognizedProduct {
  id: string;
  details: ProductDetails;
  imageUrl: string;
  generatedSku: string;
  handleId: string;
  suggestedPrice: number;
}

interface ImageAnalysisResult {
  success: boolean;
  products: RecognizedProduct[];
  processingTime: number;
  error?: string;
}

class ImageRecognitionService {
  private apiKey: string;
  private baseUrl = "https://api.openai.com/v1/chat/completions";

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  async analyzeImage(imageFile: File): Promise<ImageAnalysisResult> {
    const startTime = Date.now();

    try {
      // Check if API key is available
      if (!this.apiKey) {
        // Demo mode - generate mock analysis
        return this.generateDemoAnalysis(imageFile, startTime);
      }

      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);

      // Analyze with AI
      const analysisResult = await this.performAIAnalysis(base64Image);

      // Generate product data
      const products = await this.generateProductData(
        analysisResult,
        imageFile,
      );

      return {
        success: true,
        products,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      console.error("Image analysis failed:", error);
      return {
        success: false,
        products: [],
        processingTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async analyzeBatch(imageFiles: File[]): Promise<ImageAnalysisResult> {
    const startTime = Date.now();
    const allProducts: RecognizedProduct[] = [];

    try {
      // Process images in parallel with limited concurrency
      const batchSize = 3;
      for (let i = 0; i < imageFiles.length; i += batchSize) {
        const batch = imageFiles.slice(i, i + batchSize);
        const batchPromises = batch.map((file) => this.analyzeImage(file));
        const batchResults = await Promise.all(batchPromises);

        batchResults.forEach((result) => {
          if (result.success) {
            allProducts.push(...result.products);
          }
        });
      }

      return {
        success: true,
        products: allProducts,
        processingTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        products: allProducts,
        processingTime: Date.now() - startTime,
        error:
          error instanceof Error ? error.message : "Batch processing failed",
      };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove data:image/...;base64, prefix
      };
      reader.onerror = (error) => reject(error);
    });
  }

  private async performAIAnalysis(
    base64Image: string,
  ): Promise<ProductDetails> {
    const prompt = `Analyze this fashion product image and extract detailed information. Return a JSON object with:
    - name: descriptive product name
    - description: detailed product description (50-100 words)
    - category: main category (Fashion, Beauty, Accessories, etc.)
    - colors: array of main colors visible
    - material: fabric/material type if identifiable
    - style: style description (casual, formal, sporty, etc.)
    - brand: brand name if visible/identifiable
    - type: specific product type (dress, shirt, pants, bag, etc.)
    - gender: target gender if applicable
    - size: size if visible
    - confidence: confidence score 0-1 for the analysis

    Focus on accuracy and provide detailed, marketable descriptions suitable for e-commerce.`;

    const response = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No analysis result received");
    }

    try {
      return JSON.parse(content);
    } catch {
      // Fallback parsing if JSON is malformed
      return this.parseContentManually(content);
    }
  }

  private parseContentManually(content: string): ProductDetails {
    // Fallback manual parsing for cases where AI doesn't return valid JSON
    const lines = content.split("\n");
    const details: Partial<ProductDetails> = {};

    lines.forEach((line) => {
      if (line.includes("name:"))
        details.name = line.split("name:")[1]?.trim().replace(/['"]/g, "");
      if (line.includes("description:"))
        details.description = line
          .split("description:")[1]
          ?.trim()
          .replace(/['"]/g, "");
      if (line.includes("category:"))
        details.category = line
          .split("category:")[1]
          ?.trim()
          .replace(/['"]/g, "");
      if (line.includes("type:"))
        details.type = line.split("type:")[1]?.trim().replace(/['"]/g, "");
    });

    return {
      name: details.name || "Fashion Item",
      description: details.description || "High quality fashion item.",
      category: details.category || "Fashion",
      colors: ["Multi-Color"],
      type: details.type || "Apparel",
      confidence: 0.5,
    };
  }

  private async generateProductData(
    details: ProductDetails,
    imageFile: File,
  ): Promise<RecognizedProduct[]> {
    // Generate unique identifiers
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const id = `product_${timestamp}_${randomId}`;

    // Generate SKU (Lilly's Fashion Couture format)
    const sku = this.generateSKU(details);

    // Generate handle ID
    const handleId = `product_product_${timestamp}`;

    // Upload image and get URL (in real implementation, you'd upload to your CDN)
    const imageUrl = await this.uploadImage(imageFile);

    // Estimate price based on category and type
    const suggestedPrice = this.estimatePrice(details);

    return [
      {
        id,
        details,
        imageUrl,
        generatedSku: sku,
        handleId,
        suggestedPrice,
      },
    ];
  }

  private generateSKU(details: ProductDetails): string {
    const prefix = "LFC";
    const typeCode = details.type.slice(0, 3).toUpperCase();
    const colorCode = details.colors[0]?.slice(0, 3).toUpperCase() || "MUL";
    const randomSuffix = Math.random().toString(36).substr(2, 4).toUpperCase();

    return `${prefix}-${typeCode}${colorCode}-${randomSuffix}`;
  }

  private async uploadImage(file: File): Promise<string> {
    // In a real implementation, you would upload to your CDN/storage service
    // For now, we'll create a local blob URL
    return URL.createObjectURL(file);
  }

  private estimatePrice(details: ProductDetails): number {
    const basePrices: Record<string, number> = {
      dress: 29.99,
      shirt: 19.99,
      pants: 24.99,
      bag: 34.99,
      shoes: 39.99,
      jacket: 49.99,
      accessories: 14.99,
    };

    const basePrice = basePrices[details.type.toLowerCase()] || 19.99;

    // Adjust based on material and style
    let multiplier = 1;
    if (details.material?.toLowerCase().includes("silk")) multiplier += 0.5;
    if (details.material?.toLowerCase().includes("leather")) multiplier += 0.7;
    if (details.style?.toLowerCase().includes("formal")) multiplier += 0.3;
    if (details.brand) multiplier += 0.2;

    return Math.round(basePrice * multiplier * 100) / 100;
  }

  // Method to validate and clean product data
  validateProductData(product: RecognizedProduct): boolean {
    return !!(
      product.details.name &&
      product.details.description &&
      product.details.category &&
      product.generatedSku &&
      product.handleId
    );
  }

  // Method to merge with existing products database
  async checkForDuplicates(
    products: RecognizedProduct[],
  ): Promise<RecognizedProduct[]> {
    // In real implementation, check against existing products database
    // For now, just return unique products based on name similarity
    const uniqueProducts: RecognizedProduct[] = [];

    for (const product of products) {
      const isDuplicate = uniqueProducts.some(
        (existing) =>
          this.calculateSimilarity(
            existing.details.name,
            product.details.name,
          ) > 0.8,
      );

      if (!isDuplicate) {
        uniqueProducts.push(product);
      }
    }

    return uniqueProducts;
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1,
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Generates demo analysis when no API key is provided
   */
  private async generateDemoAnalysis(
    imageFile: File,
    startTime: number,
  ): Promise<ImageAnalysisResult> {
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const demoProducts = [
      {
        name: "Fashion Women's Summer Dress",
        description:
          "Elegant summer dress perfect for casual or semi-formal occasions. Features floral pattern and comfortable fit.",
        category: "Fashion",
        colors: ["Blue", "White", "Pink"],
        material: "Cotton Blend",
        style: "Casual",
        brand: "Fashion Forward",
        type: "Dress",
        gender: "women" as const,
        confidence: 0.85,
      },
      {
        name: "Designer Handbag",
        description:
          "Stylish leather handbag with gold accents. Perfect for everyday use or special occasions.",
        category: "Accessories",
        colors: ["Black", "Gold"],
        material: "Leather",
        style: "Elegant",
        brand: "Luxury Style",
        type: "Bag",
        gender: "women" as const,
        confidence: 0.78,
      },
      {
        name: "Classic Athletic Sneakers",
        description:
          "Comfortable athletic sneakers with modern design. Perfect for sports or casual wear.",
        category: "Shoes",
        colors: ["White", "Blue"],
        material: "Synthetic",
        style: "Athletic",
        brand: "SportStyle",
        type: "Sneakers",
        gender: "unisex" as const,
        confidence: 0.92,
      },
    ];

    // Randomly select one demo product
    const selectedDemo =
      demoProducts[Math.floor(Math.random() * demoProducts.length)];

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const id = `demo_product_${timestamp}_${randomId}`;
    const handleId = `product_product_${timestamp}`;
    const imageUrl = URL.createObjectURL(imageFile);
    const generatedSku = this.generateSKU(selectedDemo);
    const suggestedPrice = this.estimatePrice(selectedDemo);

    return {
      success: true,
      products: [
        {
          id,
          details: selectedDemo,
          imageUrl,
          generatedSku,
          handleId,
          suggestedPrice,
        },
      ],
      processingTime: Date.now() - startTime,
    };
  }
}

export default new ImageRecognitionService();
export type { ProductDetails, RecognizedProduct, ImageAnalysisResult };
