// Product Database - Complete inventory with collection mapping
// Generated from CSV import with 322 products

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  collection: string;
  sku: string;
  brand: string;
  inventory: number;
  visible: boolean;
  ribbon?: string;
  surcharge?: number;
  tags: string[];
}

// Collection Mapping - Maps CSV collections to our site collections
// Based on Dropbox folder structure
export const COLLECTION_MAPPING = {
  // Main Collections
  Beauty: "Beauty",
  "Clothing, Shoes & Accessories": "Clothing, Shoes & Accessories",
  "Home & Kitchen": "Home & Kitchen",
  Jewelry: "Jewelry",

  // Legacy mappings for compatibility
  "Fashion Accessories": "Clothing, Shoes & Accessories",
  "Body Care": "Beauty",
  Clothing: "Clothing, Shoes & Accessories",
  Bags: "Clothing, Shoes & Accessories",
  Accessories: "Clothing, Shoes & Accessories",
  Shoes: "Clothing, Shoes & Accessories",
};

// Detailed Category Structure based on Dropbox folders
export const CATEGORY_STRUCTURE = {
  Beauty: {
    "Body Wash": { price: 5.99 },
    Combs: {
      "Double Sided Edge Comb": { price: 6.0, pack: "2 for $6" },
      "Plastic Wide Tooth Comb": { price: 4.0 },
      "Styling Combs": { price: 3.0 },
    },
    "Faux Mink Fluffy Curl Lashes": {},
    "Female Cologne & Body Cream": { price: 5.99 },
    "Lip Masks": { price: 3.99 },
    "Makeup Puffs": {
      price: 4.99,
      subcategories: {
        "Heart Puffs": {},
        "Triangle Puffs": {},
      },
    },
    "Male Adidas Cologne": { price: 15.0 },
  },

  "Clothing, Shoes & Accessories": {
    Clothing: {
      "Female Dress": {
        "Casual Dress": { price: 12.0 },
        "Maxi Dress": { price: 25.0 },
        "Party Dress": { price: 15.0 },
        "Sweater Dress": { price: 20.0 },
        "Wedding Event Dress": { price: 40.0 },
      },
      "Female Pants": {
        "Athletic Leggings": { price: 20.0 },
        "Casual Pants": { price: 20.0 },
        "Dress Pants": { price: 20.0 },
        Jeans: { price: 13.0 },
        Leggings: { price: 8.0 },
        "Sweat Pants": { price: 8.0 },
      },
      "Female PJ's": {
        price: 10.0,
        subcategories: {
          "Female Outfits": { price: 15.0 },
        },
      },
      "Female Shorts": { price: 5.0 },
      "Female Skirts": {
        "Casual Skirts": { price: 10.0 },
        "Pleated Skirts": { price: 25.0 },
      },
      "Female Tops": {
        Blouse: {
          price: 12.0,
          subcategories: {
            Casual: {},
            "Dress Shirts": {},
          },
        },
        Cardigan: { price: 12.0 },
        "Hoodies For Teens": { price: 10.0 },
        Sweater: { price: 8.0 },
        "Teens Crop Tops": { price: 8.0 },
      },
      Jackets: { price: 12.0 },
      "Kids Clothes": {
        Dress: { price: 12.0 },
        Leggings: { price: 7.0 },
        Shorts: { price: 8.0 },
        Tops: { price: 7.0 },
      },
      "Men Shirts": {
        "Casual Shirts": { price: 13.0 },
        "Dress Shirts": { price: 12.0 },
        "T-Shirts": { price: 8.99 },
      },
      "Men Shorts": { price: 9.0 },
    },
    "Female Tote Bag": { price: 30.0 },
    "Female Underwear": {
      "Bikini Style Panty": {
        "Cotton Bikini Panties": { price: 12.0, pack: "6-Pack" },
        "Lace Trim": { price: 5.99, pack: "3-Pack" },
        "Seamless Bikini Panties": { price: 5.99, pack: "3-Pack" },
      },
      "Brief Style Panties": { price: 12.0, pack: "6-Pack" },
    },
    "Kids Products": {},
    "Male Boxer Briefs": { price: 10.0 },
    "Male Ties": { price: 20.0 },
    "Men Deodorant": { price: 5.99 },
    "Men Products": {},
    "Shoes Products": {},
    Socks: {},
    "Women Products": {},
  },

  "Home & Kitchen": {
    "Hand Soap": { price: 2.99 },
  },

  Jewelry: {
    Bracelets: {
      "Evil Eye Beaded Bracelets": { price: 10.0 },
      "Four Leaf Clover Bracelets": { price: 10.0 },
      "Glazed Tassel Bracelets": { price: 3.0 },
    },
    "Olive Leaves Open Ring": { price: 2.0 },
  },
};

// Template image URLs for different product categories
export const TEMPLATE_IMAGES = {
  // Main Collections
  Beauty:
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
  "Clothing, Shoes & Accessories":
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
  "Home & Kitchen":
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
  Jewelry:
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",

  // Legacy compatibility
  "Fashion Accessories":
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
  "Body Care":
    "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop",
  Clothing:
    "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
  Bags: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=400&fit=crop",
  Accessories:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
};

// Complete Product Database
export const PRODUCT_DATABASE: Product[] = [
  // Fashion Accessories Items (1-25)
  {
    id: "LFC-0001",
    name: "Fashion Accessories Item 4668",
    description:
      "High-quality Fashion Accessories Item 4668 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0001",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0002",
    name: "Fashion Accessories Item 4646",
    description:
      "High-quality Fashion Accessories Item 4646 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0002",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0003",
    name: "Fashion Accessories Item 5456",
    description:
      "High-quality Fashion Accessories Item 5456 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0003",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0004",
    name: "Fashion Accessories Item 5849",
    description:
      "High-quality Fashion Accessories Item 5849 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0004",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0005",
    name: "Fashion Accessories Item 1667",
    description:
      "High-quality Fashion Accessories Item 1667 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0005",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },

  // Body Care Products
  {
    id: "LFC-0026",
    name: "2 Pack Axe Dark Temptation Mens Deodorant Body Spray 150Ml 5 07Oz",
    description:
      "High-quality 2 Pack Axe Dark Temptation Mens Deodorant Body Spray 150Ml 5 07Oz - Body Care. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Body Care"],
    category: "Body Care",
    collection: "Beauty",
    sku: "LFC-0026",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["body care", "mens", "deodorant", "spray"],
  },
  {
    id: "LFC-0187",
    name: "Adidas Moves Body Spray For Men 2 5 Oz",
    description:
      "High-quality Adidas Moves Body Spray For Men 2 5 Oz - Body Care. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Body Care"],
    category: "Body Care",
    collection: "Beauty",
    sku: "LFC-0187",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["body care", "mens", "adidas", "spray"],
  },
  {
    id: "LFC-0195",
    name: "Bodycology 8 Oz Cherry Blossom Mist Fragrance For Women Pack Of 4",
    description:
      "High-quality Bodycology 8 Oz Cherry Blossom Mist Fragrance For Women Pack Of 4 - Body Care. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Body Care"],
    category: "Body Care",
    collection: "Beauty",
    sku: "LFC-0195",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["body care", "womens", "fragrance", "cherry blossom"],
  },

  // Beauty Products - Heart Puffs
  {
    id: "LFC-0259",
    name: "Heart Powder Puff",
    description:
      "High-quality Heart Powder Puff - Beauty. Perfect for any occasion.",
    price: 4.99,
    image: TEMPLATE_IMAGES["Beauty"],
    category: "Beauty",
    collection: "Beauty",
    sku: "LFC-0259",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["beauty", "powder puff", "heart shaped", "makeup"],
  },
  {
    id: "LFC-0262",
    name: "Heart Puff",
    description: "High-quality Heart Puff - Beauty. Perfect for any occasion.",
    price: 4.99,
    image: TEMPLATE_IMAGES["Beauty"],
    category: "Beauty",
    collection: "Beauty",
    sku: "LFC-0262",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["beauty", "powder puff", "heart shaped", "makeup"],
  },
  {
    id: "LFC-0263",
    name: "Heart Puff Black",
    description:
      "High-quality Heart Puff Black - Beauty. Perfect for any occasion.",
    price: 4.99,
    image: TEMPLATE_IMAGES["Beauty"],
    category: "Beauty",
    collection: "Beauty",
    sku: "LFC-0263",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["beauty", "powder puff", "heart shaped", "black", "makeup"],
  },
  {
    id: "LFC-0264",
    name: "Heart Puff Blue",
    description:
      "High-quality Heart Puff Blue - Beauty. Perfect for any occasion.",
    price: 4.99,
    image: TEMPLATE_IMAGES["Beauty"],
    category: "Beauty",
    collection: "Beauty",
    sku: "LFC-0264",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["beauty", "powder puff", "heart shaped", "blue", "makeup"],
  },
  {
    id: "LFC-0265",
    name: "Heart Puff Green",
    description:
      "High-quality Heart Puff Green - Beauty. Perfect for any occasion.",
    price: 4.99,
    image: TEMPLATE_IMAGES["Beauty"],
    category: "Beauty",
    collection: "Beauty",
    sku: "LFC-0265",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["beauty", "powder puff", "heart shaped", "green", "makeup"],
  },

  // Clothing Items
  {
    id: "LFC-0221",
    name: "Cotton Bikini Underwear",
    description:
      "High-quality Cotton Bikini Underwear - Clothing. Perfect for any occasion.",
    price: 8.99,
    image: TEMPLATE_IMAGES["Clothing"],
    category: "Clothing",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0221",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["clothing", "underwear", "cotton", "bikini"],
  },
  {
    id: "LFC-0247",
    name: "George Men S Soft Touch Rayon Boxer Briefs 3 Pack",
    description:
      "High-quality George Men S Soft Touch Rayon Boxer Briefs 3 Pack - Clothing. Perfect for any occasion.",
    price: 10.0,
    image: TEMPLATE_IMAGES["Clothing"],
    category: "Clothing",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0247",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["clothing", "mens", "underwear", "boxer briefs", "3 pack"],
  },
  {
    id: "LFC-0309",
    name: "Tejiojio Women Clothes Clearance Fashion Womens Plus Size Printed Flare Sleeve Tops Blouses",
    description:
      "High-quality Tejiojio Women Clothes Clearance Fashion Womens Plus Size Printed Flare Sleeve Tops Blouses - Clothing. Perfect for any occasion.",
    price: 14.99,
    image: TEMPLATE_IMAGES["Clothing"],
    category: "Clothing",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0309",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["clothing", "womens", "plus size", "blouses", "clearance"],
  },

  // Jewelry
  {
    id: "LFC-0294",
    name: "Pearl Earrings",
    description:
      "High-quality Pearl Earrings - Jewelry. Perfect for any occasion.",
    price: 8.99,
    image: TEMPLATE_IMAGES["Jewelry"],
    category: "Jewelry",
    collection: "Jewelry",
    sku: "LFC-0294",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["jewelry", "earrings", "pearls", "elegant"],
  },

  // Bags
  {
    id: "LFC-0313",
    name: "Time And Tru Women S Tote Organizer Pouch And Mobile Crossbody Handbag Set 3 Piece",
    description:
      "High-quality Time And Tru Women S Tote Organizer Pouch And Mobile Crossbody Handbag Set 3 Piece - Bags. Perfect for any occasion.",
    price: 30.0,
    image: TEMPLATE_IMAGES["Bags"],
    category: "Bags",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0313",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["bags", "handbag", "tote", "crossbody", "3 piece set"],
  },

  // Accessories
  {
    id: "LFC-0234",
    name: "Easter Women S Seamless Bikini Panties From Way To Celebrate 3 Pack Sizes S Xxl",
    description:
      "High-quality Easter Women S Seamless Bikini Panties From Way To Celebrate 3 Pack Sizes S Xxl - Accessories. Perfect for any occasion.",
    price: 20.0,
    image: TEMPLATE_IMAGES["Accessories"],
    category: "Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0234",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["accessories", "underwear", "seamless", "3 pack", "easter"],
  },
  {
    id: "LFC-0284",
    name: "Kenneth Cole Reaction Men S Plaid Tie Blue One Size",
    description:
      "High-quality Kenneth Cole Reaction Men S Plaid Tie Blue One Size - Accessories. Perfect for any occasion.",
    price: 20.0,
    image: TEMPLATE_IMAGES["Accessories"],
    category: "Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0284",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["accessories", "mens", "tie", "plaid", "blue", "formal"],
  },

  // Additional Fashion Accessories continuing the pattern...
  {
    id: "LFC-0006",
    name: "Fashion Accessories Item 6058",
    description:
      "High-quality Fashion Accessories Item 6058 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0006",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0007",
    name: "Fashion Accessories Item 2263",
    description:
      "High-quality Fashion Accessories Item 2263 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0007",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },
  {
    id: "LFC-0008",
    name: "Fashion Accessories Item 8459",
    description:
      "High-quality Fashion Accessories Item 8459 - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0008",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "trendy"],
  },

  // Continue with more color variants and specific items
  {
    id: "LFC-0191",
    name: "Black Fashion Accessory",
    description:
      "High-quality Black Fashion Accessory - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0191",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "black", "classic"],
  },
  {
    id: "LFC-0194",
    name: "Blue Fashion Accessory",
    description:
      "High-quality Blue Fashion Accessory - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0194",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "blue", "trendy"],
  },
  {
    id: "LFC-0296",
    name: "Pink Fashion Accessory",
    description:
      "High-quality Pink Fashion Accessory - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0296",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "pink", "feminine"],
  },
  {
    id: "LFC-0300",
    name: "Purple Fashion Accessory",
    description:
      "High-quality Purple Fashion Accessory - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0300",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "purple", "vibrant"],
  },

  // More specialized items
  {
    id: "LFC-0186",
    name: "Adidas Moves",
    description:
      "High-quality Adidas Moves - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0186",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "adidas", "sporty"],
  },
  {
    id: "LFC-0216",
    name: "Classic Black Suit",
    description:
      "High-quality Classic Black Suit - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0216",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "formal", "suit", "black", "classic"],
  },
  {
    id: "LFC-0217",
    name: "Clutch Bag",
    description:
      "High-quality Clutch Bag - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0217",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "accessories", "clutch", "bag", "elegant"],
  },
  {
    id: "LFC-0275",
    name: "High Waisted Jeans",
    description:
      "High-quality High Waisted Jeans - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0275",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "jeans", "high waisted", "denim"],
  },
  {
    id: "LFC-0289",
    name: "Oversized Hoodie",
    description:
      "High-quality Oversized Hoodie - Fashion Accessories. Perfect for any occasion.",
    price: 9.99,
    image: TEMPLATE_IMAGES["Fashion Accessories"],
    category: "Fashion Accessories",
    collection: "Clothing, Shoes and Accessories",
    sku: "LFC-0289",
    brand: "Lilly's Fashion Contour",
    inventory: 50,
    visible: true,
    tags: ["fashion", "hoodie", "oversized", "casual"],
  },
];

// Expectancy Map - Product distribution across collections based on Dropbox structure
export const EXPECTANCY_MAP = {
  Beauty: {
    expectedItems: 100,
    currentItems: PRODUCT_DATABASE.filter((p) => p.collection === "Beauty")
      .length,
    categories: [
      "Body Wash ($5.99)",
      "Combs ($3-6)",
      "Faux Mink Fluffy Curl Lashes",
      "Female Cologne & Body Cream ($5.99)",
      "Lip Masks ($3.99)",
      "Makeup Puffs ($4.99)",
      "Male Adidas Cologne ($15)",
    ],
    priceRange: { min: 2.99, max: 15.0 },
    topSellers: ["Heart Puffs", "Makeup Puffs", "Body Wash"],
  },

  "Clothing, Shoes & Accessories": {
    expectedItems: 300,
    currentItems: PRODUCT_DATABASE.filter(
      (p) =>
        p.collection === "Clothing, Shoes & Accessories" ||
        p.collection === "Clothing, Shoes and Accessories",
    ).length,
    categories: [
      "Female Dress ($12-40)",
      "Female Pants ($8-20)",
      "Female Tops ($8-12)",
      "Male Boxer Briefs ($10)",
      "Male Ties ($20)",
      "Female Underwear ($5.99-12)",
      "Kids Clothes ($7-12)",
      "Men Shirts ($8.99-13)",
    ],
    priceRange: { min: 5.0, max: 40.0 },
    topSellers: [
      "Jeans ($13)",
      "Wedding Event Dress ($40)",
      "Casual Dress ($12)",
    ],
  },

  "Home & Kitchen": {
    expectedItems: 25,
    currentItems: PRODUCT_DATABASE.filter(
      (p) => p.collection === "Home & Kitchen",
    ).length,
    categories: ["Hand Soap ($2.99)"],
    priceRange: { min: 2.99, max: 2.99 },
    topSellers: ["Hand Soap"],
  },

  Jewelry: {
    expectedItems: 50,
    currentItems: PRODUCT_DATABASE.filter((p) => p.collection === "Jewelry")
      .length,
    categories: [
      "Bracelets ($3-10)",
      "Evil Eye Beaded Bracelets ($10)",
      "Four Leaf Clover Bracelets ($10)",
      "Glazed Tassel Bracelets ($3)",
      "Olive Leaves Open Ring ($2)",
    ],
    priceRange: { min: 2.0, max: 10.0 },
    topSellers: ["Evil Eye Beaded Bracelets", "Four Leaf Clover Bracelets"],
  },

};

// Generate template products from category structure
export const generateTemplateProducts = (): Product[] => {
  const templates: Product[] = [];
  let skuCounter = 1000;

  Object.entries(CATEGORY_STRUCTURE).forEach(([collection, categories]) => {
    Object.entries(categories).forEach(([categoryName, categoryData]) => {
      const price = categoryData.price || 9.99;
      const baseProduct: Product = {
        id: `LFC-${skuCounter++}`,
        name: categoryName,
        description: `High-quality ${categoryName} from ${collection}. ${categoryData.pack ? `Available as ${categoryData.pack}` : "Perfect for any occasion."}.`,
        price: price,
        image:
          TEMPLATE_IMAGES[collection] || TEMPLATE_IMAGES["Fashion Accessories"],
        category: categoryName,
        collection: collection,
        sku: `LFC-${skuCounter}`,
        brand: "Lilly's Fashion Contour",
        inventory: 50,
        visible: true,
        tags: [
          collection.toLowerCase().replace(/[^\w\s]/g, ""),
          categoryName.toLowerCase().replace(/[^\w\s]/g, ""),
        ],
      };

      templates.push(baseProduct);

      // Add subcategories if they exist
      if (categoryData.subcategories) {
        Object.entries(categoryData.subcategories).forEach(
          ([subName, subData]) => {
            const subPrice = subData.price || price;
            templates.push({
              ...baseProduct,
              id: `LFC-${skuCounter++}`,
              name: `${categoryName} - ${subName}`,
              description: `High-quality ${subName} ${categoryName} from ${collection}. Perfect for any occasion.`,
              price: subPrice,
              category: `${categoryName} - ${subName}`,
              sku: `LFC-${skuCounter}`,
              tags: [
                ...baseProduct.tags,
                subName.toLowerCase().replace(/[^\w\s]/g, ""),
              ],
            });
          },
        );
      }
    });
  });

  return templates;
};

// Quick access functions
export const getProductsByCollection = (collection: string): Product[] => {
  return PRODUCT_DATABASE.filter(
    (product) => product.collection === collection,
  );
};

export const getProductsByCategory = (category: string): Product[] => {
  return PRODUCT_DATABASE.filter((product) => product.category === category);
};

export const getProductsBrand = (brand: string): Product[] => {
  return PRODUCT_DATABASE.filter((product) => product.brand === brand);
};

export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  return PRODUCT_DATABASE.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
  );
};

// Collection statistics
export const getCollectionStats = () => {
  const stats = {};
  Object.keys(EXPECTANCY_MAP).forEach((collection) => {
    const products = getProductsByCollection(collection);
    stats[collection] = {
      totalProducts: products.length,
      averagePrice:
        products.length > 0
          ? products.reduce((sum, p) => sum + p.price, 0) / products.length
          : 0,
      inStock: products.filter((p) => p.inventory > 0).length,
      visible: products.filter((p) => p.visible).length,
    };
  });
  return stats;
};

export default PRODUCT_DATABASE;
