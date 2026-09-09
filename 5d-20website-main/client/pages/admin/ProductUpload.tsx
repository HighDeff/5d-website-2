import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  Camera,
  X,
  Plus,
  DollarSign,
  Tag,
  Sparkles,
  Package,
  Eye,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  Star,
  Heart,
  Menu,
  ChevronDown,
  Store,
  Zap,
  Shield,
  Wand2,
  Layout,
  Filter,
  Save,
  Globe,
  Edit3,
  Copy,
  Trash2,
  Settings,
  Smartphone,
  Target,
  Search,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import ShoppingCart from "@/components/ShoppingCart";
import { useUserAuth } from "@/hooks/useUserAuth";
import {
  PRODUCT_DATABASE,
  EXPECTANCY_MAP,
  getCollectionStats,
  COLLECTION_MAPPING,
  TEMPLATE_IMAGES,
} from "@/data/productDatabase";
// CSV import removed in production mode
import { useShoppingCart } from "@/hooks/useShoppingCart";
import BackToTop from "@/components/BackToTop";
import ProductUpdateMessaging from "@/services/ProductUpdateMessaging";
import SocialFeaturesService from "@/services/SocialFeaturesService";
import AnalyticsService from "@/services/AnalyticsService";

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  description: string;
  category: string;
  images: string[];
  tags: string[];
  rating: number;
  condition: "new" | "like-new" | "used" | "refurbished";
  brand?: string;
  size?: string;
  color?: string;
  material?: string;
  placement: "featured" | "new-arrival" | "regular" | "premium" | "custom";
  customSection?: string;
  template: "modern" | "classic" | "minimal" | "luxury" | "custom";
  dateAdded: string;
  status: "draft" | "published" | "pending";
  seller: string;
  views: number;
  likes: number;
}

interface ProductTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: object;
}

export default function ProductUpload() {
  const { user, saveProduct, addProduct } = useUserAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  // PRODUCTION MODE: CSV import removed
  const [expectancyMap, setExpectancyMap] = useState(null);
  const [importStats, setImportStats] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [autoDescription, setAutoDescription] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"single" | "bulk">("single");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [bulkData, setBulkData] = useState<any[]>([]);
  const [bulkUploadProgress, setBulkUploadProgress] = useState(0);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [uploadType, setUploadType] = useState<"folder" | "images">("images");
  const [duplicateProducts, setDuplicateProducts] = useState<any[]>([]);
  const [showDuplicates, setShowDuplicates] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectionMode, setSelectionMode] = useState<
    "single" | "multiple" | "folder"
  >("folder");
  const [multiProductMode, setMultiProductMode] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [multiProductData, setMultiProductData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [readyToUpload, setReadyToUpload] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [showUserProfiles, setShowUserProfiles] = useState(false);
  const [offers, setOffers] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(1250.75);
  const [pendingWithdrawal, setPendingWithdrawal] = useState(0);
  const [isUserMember, setIsUserMember] = useState(false);
  const [showCSVImport, setShowCSVImport] = useState(false);
  const [showCSVMapping, setShowCSVMapping] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mappingResults, setMappingResults] = useState<any[]>([]);
  const [mappingProgress, setMappingProgress] = useState(0);
  const [mappingStep, setMappingStep] = useState<
    "upload" | "mapping" | "validation" | "complete"
  >("upload");
  const [duplicateMatches, setDuplicateMatches] = useState<any[]>([]);
  const [missingImages, setMissingImages] = useState<any[]>([]);
  const [validationResults, setValidationResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const multipleInputRef = useRef<HTMLInputElement>(null);

  const { cartItems, updateQuantity, removeItem, handleCheckout } =
    useShoppingCart();

  const { currentUser, isSignedIn } = useUserAuth();

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  // Initialize expectancy map and import stats with working CSV support
  useEffect(() => {
    const stats = {
      totalProducts: 322,
      collections: [
        "Jewelry",
        "Clothing",
        "Beauty",
        "Accessories",
        "Home & Kitchen",
        "Electronics",
        "Sports",
      ],
      priceRange: { min: 5, max: 500 },
      brands: ["Lilly Fashion", "Premium Collection", "Designer Series"],
    };

    // Create working expectancy map with real image URLs
    const map = {
      Jewelry: {
        expectedItems: 85,
        currentItems: 23,
        categories: ["Rings", "Necklaces", "Earrings", "Bracelets"],
        avgPrice: 125.5,
        imageMapping: {
          ring: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          necklace:
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          earring:
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          bracelet:
            "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          watch:
            "https://images.unsplash.com/photo-1524805444973-151ef98f0f37?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          ring: "💍",
          necklace: "📿",
          earring: "💎",
          bracelet: "⭐",
          watch: "⌚",
        },
      },
      Clothing: {
        expectedItems: 120,
        currentItems: 34,
        categories: ["Dresses", "Tops", "Bottoms", "Outerwear"],
        avgPrice: 75.0,
        imageMapping: {
          dress:
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          top: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          bottom:
            "https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          jacket:
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          shirt:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          pants:
            "https://images.unsplash.com/photo-1624378515195-6bbdb73dff1a?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          dress: "👗",
          top: "��",
          bottom: "👖",
          jacket: "🧥",
          shirt: "👔",
          pants: "👖",
        },
      },
      Beauty: {
        expectedItems: 65,
        currentItems: 18,
        categories: ["Makeup", "Skincare", "Fragrance", "Tools"],
        avgPrice: 35.0,
        imageMapping: {
          makeup:
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          skincare:
            "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          fragrance:
            "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          tool: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          perfume:
            "https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          lipstick:
            "https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          makeup: "💄",
          skincare: "🧴",
          fragrance: "🌸",
          tool: "🪒",
          perfume: "🧴",
          lipstick: "💄",
        },
      },
      Accessories: {
        expectedItems: 45,
        currentItems: 12,
        categories: ["Bags", "Belts", "Scarves", "Sunglasses"],
        avgPrice: 45.0,
        imageMapping: {
          bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          belt: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          scarf:
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          sunglasses:
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          wallet:
            "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          bag: "👜",
          belt: "👔",
          scarf: "🧣",
          sunglasses: "🕶���",
          wallet: "💳",
        },
      },
      Home: {
        expectedItems: 7,
        currentItems: 3,
        categories: ["Decor", "Kitchen", "Bedroom", "Bath"],
        avgPrice: 85.0,
        imageMapping: {
          decor:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          kitchen:
            "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          bedroom:
            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          bath: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          candle:
            "https://images.unsplash.com/photo-1602874801007-c9bc2b8e2f9b?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          vase: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          decor: "🏠",
          kitchen: "🍽️",
          bedroom: "🛏���",
          bath: "🛁",
          candle: "🕯️",
          vase: "🏺",
        },
      },
      Shoes: {
        expectedItems: 40,
        currentItems: 8,
        categories: ["Heels", "Sneakers", "Boots", "Sandals"],
        avgPrice: 95.0,
        imageMapping: {
          heel: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          sneaker:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          boot: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          sandal:
            "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          shoe: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          heel: "👠",
          sneaker: "👟",
          boot: "👢",
          sandal: "🩴",
          shoe: "👞",
        },
      },
      "shoes-accessories": {
        expectedItems: 25,
        currentItems: 6,
        categories: ["Shoes", "Bags", "Belts", "Jewelry"],
        avgPrice: 65.0,
        imageMapping: {
          shoe: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          belt: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          accessory:
            "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          heel: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
          sneaker:
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
        },
        emojiMapping: {
          shoe: "👠",
          bag: "👜",
          belt: "👔",
          accessory: "💍",
          heel: "👠",
          sneaker: "👟",
        },
      },
    };

    setImportStats(stats);
    setExpectancyMap(map);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    discountPercentage: "",
    description: "",
    category: "",
    images: [] as string[],
    tags: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    condition: "new" as const,
    placement: "regular" as const,
    customSection: "",
    template: "modern",
    shippingOption: "self-ship" as "self-ship" | "platform-storage",
    allowOffers: true,
    minimumOfferPercentage: 15,
  });

  const categories = [
    {
      name: "Jewelry",
      icon: "💍",
      suggested: "$25-500",
      color: "from-purple-500 to-blue-500",
    },
    {
      name: "Clothing",
      icon: "👗",
      suggested: "$20-300",
      color: "from-pink-500 to-purple-500",
    },
    {
      name: "Beauty",
      icon: "💄",
      suggested: "$10-150",
      color: "from-red-500 to-pink-500",
    },
    {
      name: "Shoes & Accessories",
      icon: "👠",
      suggested: "$30-400",
      color: "from-amber-500 to-orange-500",
    },
    {
      name: "Home & Kitchen",
      icon: "🏠",
      suggested: "$15-200",
      color: "from-green-500 to-teal-500",
    },
    {
      name: "Electronics",
      icon: "📱",
      suggested: "$50-800",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const placements = [
    {
      id: "featured",
      name: "Featured Products",
      icon: "⭐",
      description: "High visibility on homepage",
    },
    {
      id: "new-arrival",
      name: "New Arrivals",
      icon: "✨",
      description: "Latest products section",
    },
    {
      id: "premium",
      name: "Premium Showcase",
      icon: "��",
      description: "Premium products section",
    },
    {
      id: "regular",
      name: "Regular Catalog",
      icon: "��",
      description: "Standard product listing",
    },
    {
      id: "custom",
      name: "Custom Section",
      icon: "🎨",
      description: "Create your own section",
    },
  ];

  const templates: ProductTemplate[] = [
    {
      id: "modern",
      name: "Modern",
      description: "Clean & contemporary",
      preview: "🎨",
      style: {},
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional & elegant",
      preview: "🏛️",
      style: {},
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple & clean",
      preview: "⚪",
      style: {},
    },
    {
      id: "luxury",
      name: "Luxury",
      description: "Premium & sophisticated",
      preview: "✨",
      style: {},
    },
  ];

  const steps = [
    { number: 1, title: "Details", icon: Package },
    { number: 2, title: "Design", icon: Camera },
    { number: 3, title: "Publish", icon: Globe },
  ];

  // AI-powered description generator
  const generateDescription = (
    name: string,
    category: string,
    brand?: string,
    material?: string,
    color?: string,
  ) => {
    let description = `Discover this exceptional ${name.toLowerCase()}`;

    if (brand) description += ` from ${brand}`;
    if (color) description += ` in ${color.toLowerCase()}`;
    if (material)
      description += `, crafted from premium ${material.toLowerCase()}`;

    description += `. This ${category.toLowerCase()} combines style and functionality`;

    switch (category) {
      case "Jewelry":
        description +=
          ", featuring exquisite craftsmanship and timeless design";
        break;
      case "Clothing":
        description += ", offering comfort and contemporary fashion";
        break;
      case "Beauty":
        description +=
          ", formulated with high-quality ingredients for optimal results";
        break;
      case "Shoes & Accessories":
        description += ", designed to complement your personal style";
        break;
      case "Home & Kitchen":
        description += ", bringing both beauty and practicality to your space";
        break;
      case "Electronics":
        description += ", incorporating the latest technology and innovation";
        break;
    }

    description += " Perfect for those who appreciate quality and style.";

    return description;
  };

  // Smart tag suggestions
  const getSuggestedTags = (name: string, category: string, brand?: string) => {
    const commonTags = ["premium", "quality", "stylish", "elegant"];
    const categoryTags = {
      Jewelry: ["handcrafted", "luxury", "timeless", "precious"],
      Clothing: ["comfortable", "trendy", "versatile", "fashion"],
      Beauty: ["organic", "natural", "skincare", "premium"],
      "Shoes & Accessories": ["statement", "versatile", "designer", "classic"],
      "Home & Kitchen": ["modern", "functional", "decorative", "practical"],
    };

    let tags = [...commonTags];
    if (categoryTags[category as keyof typeof categoryTags]) {
      tags.push(...categoryTags[category as keyof typeof categoryTags]);
    }
    if (brand) tags.push(brand.toLowerCase());
    if (name.toLowerCase().includes("vintage")) tags.push("vintage");
    if (name.toLowerCase().includes("new")) tags.push("new", "latest");

    return tags.slice(0, 6);
  };

  const categoryMappings: { [key: string]: string } = {
    // Jewelry keywords
    jewelry: "Jewelry",
    jewellery: "Jewelry",
    rings: "Jewelry",
    ring: "Jewelry",
    necklaces: "Jewelry",
    necklace: "Jewelry",
    earrings: "Jewelry",
    earring: "Jewelry",
    bracelet: "Jewelry",
    bracelets: "Jewelry",
    watch: "Jewelry",
    watches: "Jewelry",
    pendant: "Jewelry",
    pendants: "Jewelry",
    chain: "Jewelry",
    chains: "Jewelry",

    // Clothing keywords
    clothing: "Clothing",
    clothes: "Clothing",
    apparel: "Clothing",
    dresses: "Clothing",
    dress: "Clothing",
    shirts: "Clothing",
    shirt: "Clothing",
    pants: "Clothing",
    jeans: "Clothing",
    skirts: "Clothing",
    skirt: "Clothing",
    tops: "Clothing",
    top: "Clothing",
    blouse: "Clothing",
    blouses: "Clothing",
    jacket: "Clothing",
    jackets: "Clothing",
    coat: "Clothing",
    coats: "Clothing",
    sweater: "Clothing",
    sweaters: "Clothing",
    hoodie: "Clothing",
    hoodies: "Clothing",

    // Beauty keywords
    beauty: "Beauty",
    cosmetics: "Beauty",
    makeup: "Beauty",
    skincare: "Beauty",
    lipstick: "Beauty",
    foundation: "Beauty",
    perfume: "Beauty",
    fragrance: "Beauty",
    serum: "Beauty",
    cream: "Beauty",
    lotion: "Beauty",
    cleanser: "Beauty",

    // Accessories keywords
    accessories: "Shoes & Accessories",
    shoes: "Shoes & Accessories",
    shoe: "Shoes & Accessories",
    bags: "Shoes & Accessories",
    bag: "Shoes & Accessories",
    handbags: "Shoes & Accessories",
    purse: "Shoes & Accessories",
    purses: "Shoes & Accessories",
    wallet: "Shoes & Accessories",
    belt: "Shoes & Accessories",
    belts: "Shoes & Accessories",
    scarf: "Shoes & Accessories",
    hat: "Shoes & Accessories",
    hats: "Shoes & Accessories",
    sunglasses: "Shoes & Accessories",

    // Home & Kitchen keywords
    home: "Home & Kitchen",
    kitchen: "Home & Kitchen",
    decor: "Home & Kitchen",
    furniture: "Home & Kitchen",
    lighting: "Home & Kitchen",
    candle: "Home & Kitchen",
    vase: "Home & Kitchen",
    pillow: "Home & Kitchen",
    cushion: "Home & Kitchen",

    // Electronics keywords
    electronics: "Electronics",
    tech: "Electronics",
    gadgets: "Electronics",
    phone: "Electronics",
    tablet: "Electronics",
    laptop: "Electronics",
    headphones: "Electronics",
    speaker: "Electronics",
    camera: "Electronics",
  };

  const extractDataFromPath = (filePath: string, fileName: string) => {
    const pathParts = filePath.split("/").filter(Boolean);
    const fileNameParts = fileName.split(/[._-]/).filter(Boolean);
    const allParts = [...pathParts, ...fileNameParts];

    let category = "";
    let price = "";
    let condition = "new";
    let brand = "";
    let color = "";
    let size = "";
    let productName = "";

    // Generate product name from filename first
    productName = fileName
      .replace(/\.[^/.]+$/, "") // Remove extension
      .replace(/[_-]/g, " ") // Replace underscores and dashes with spaces
      .replace(/\b\w/g, (l) => l.toUpperCase()) // Capitalize first letter of each word
      .replace(/\s+/g, " ") // Remove extra spaces
      .trim();

    // Extract price (various formats: $29.99, 29-99, price_29_99, 29.99, etc.)
    const priceRegex = /(?:\$|price[_-]?)(\d+)(?:[._-](\d{2}))?/i;
    for (const part of allParts) {
      const priceMatch = part.match(priceRegex);
      if (priceMatch && !price) {
        const dollars = priceMatch[1];
        const cents = priceMatch[2] || "00";
        price = `${dollars}.${cents}`;
        break;
      }
    }

    // Extract brand (expanded brand patterns)
    const brandKeywords = [
      "nike",
      "adidas",
      "puma",
      "reebok",
      "converse",
      "vans",
      "apple",
      "samsung",
      "sony",
      "lg",
      "microsoft",
      "google",
      "gucci",
      "prada",
      "chanel",
      "dior",
      "versace",
      "armani",
      "dolce",
      "gabbana",
      "louis",
      "vuitton",
      "hermes",
      "burberry",
      "fendi",
      "saint",
      "laurent",
      "zara",
      "h&m",
      "uniqlo",
      "gap",
      "levi",
      "calvin",
      "klein",
      "tommy",
      "hilfiger",
      "rolex",
      "omega",
      "cartier",
      "tiffany",
      "pandora",
      "swarovski",
      "mac",
      "clinique",
      "estee",
      "lauder",
      "lancome",
      "maybelline",
      "revlon",
      "kitchenaid",
      "cuisinart",
      "breville",
      "ninja",
      "vitamix",
      "nespresso",
    ];

    for (const part of allParts) {
      const lowerPart = part.toLowerCase();
      if (brandKeywords.some((keyword) => lowerPart.includes(keyword))) {
        brand = part;
        break;
      }
    }

    // Extract condition
    const conditionKeywords = [
      "new",
      "used",
      "like-new",
      "refurbished",
      "vintage",
      "pre-owned",
      "mint",
      "excellent",
      "good",
      "fair",
    ];
    for (const part of allParts) {
      const lowerPart = part.toLowerCase();
      if (conditionKeywords.includes(lowerPart)) {
        condition =
          lowerPart === "pre-owned"
            ? "used"
            : lowerPart === "mint" || lowerPart === "excellent"
              ? "like-new"
              : lowerPart;
        break;
      }
    }

    // Extract color (expanded color palette)
    const colorKeywords = [
      "red",
      "blue",
      "green",
      "yellow",
      "black",
      "white",
      "pink",
      "purple",
      "orange",
      "brown",
      "gray",
      "grey",
      "silver",
      "gold",
      "navy",
      "beige",
      "cream",
      "tan",
      "khaki",
      "maroon",
      "burgundy",
      "coral",
      "mint",
      "teal",
      "turquoise",
      "lavender",
      "rose",
      "champagne",
      "copper",
      "bronze",
      "platinum",
      "pearl",
      "ivory",
      "charcoal",
      "slate",
      "olive",
    ];
    for (const part of allParts) {
      const lowerPart = part.toLowerCase();
      if (colorKeywords.includes(lowerPart)) {
        color = part;
        break;
      }
    }

    // Extract size (expanded size detection)
    const sizeRegex =
      /^(xxs|xs|s|m|l|xl|xxl|xxxl|\d+|\d+[.,]\d+|size[_-]?\d+|us[_-]?\d+|eu[_-]?\d+|uk[_-]?\d+)$/i;
    for (const part of allParts) {
      if (sizeRegex.test(part.toLowerCase()) && !size) {
        size = part
          .toUpperCase()
          .replace(/SIZE[_-]?/i, "")
          .replace(/[_-]/g, " ");
        break;
      }
    }

    // Use intelligent categorization instead of simple mapping
    const intelligentResult = intelligentCategorization(productName, brand);
    if (intelligentResult.confidence > 0.6) {
      category = intelligentResult.category;
    } else {
      // Fallback to path-based categorization
      for (const part of allParts) {
        const lowerPart = part.toLowerCase();
        if (categoryMappings[lowerPart] && !category) {
          category = categoryMappings[lowerPart];
          break;
        }
      }
    }

    return {
      category,
      price,
      condition,
      brand,
      color,
      size,
      productName,
      aiSuggestion:
        intelligentResult.confidence > 0.6 ? intelligentResult : undefined,
    };
  };

  const recognizeImageContent = async (
    file: File,
  ): Promise<{ category: string; confidence: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        // Basic image analysis based on dominant colors and aspect ratio
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) {
          resolve({ category: "Clothing", confidence: 0.1 });
          return;
        }

        const data = imageData.data;
        let totalR = 0,
          totalG = 0,
          totalB = 0;
        const pixelCount = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          totalR += data[i];
          totalG += data[i + 1];
          totalB += data[i + 2];
        }

        const avgR = totalR / pixelCount;
        const avgG = totalG / pixelCount;
        const avgB = totalB / pixelCount;
        const aspectRatio = img.width / img.height;

        // Simple heuristics for category detection
        let category = "Clothing";
        let confidence = 0.3;

        // Jewelry tends to have metallic colors and square/portrait aspect ratios
        if (
          (avgR > 180 && avgG > 180 && avgB > 150) || // Metallic/gold colors
          (avgR < 50 && avgG < 50 && avgB < 50 && aspectRatio < 1.5)
        ) {
          // Dark metallic
          category = "Jewelry";
          confidence = 0.6;
        }
        // Beauty products often have bright colors and portrait orientation
        else if ((avgR > 150 || avgB > 150) && aspectRatio < 1.2) {
          category = "Beauty";
          confidence = 0.5;
        }
        // Home items tend to have neutral colors and landscape orientation
        else if (avgR > 100 && avgG > 100 && avgB > 100 && aspectRatio > 1.3) {
          category = "Home & Kitchen";
          confidence = 0.4;
        }
        // Shoes/accessories often have leather browns or specific patterns
        else if ((avgR > 100 && avgG < 80 && avgB < 80) || aspectRatio > 1.5) {
          category = "Shoes & Accessories";
          confidence = 0.4;
        }

        resolve({ category, confidence });
      };

      img.onerror = () => {
        resolve({ category: "Clothing", confidence: 0.1 });
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const processFolderUpload = async (files: FileList) => {
    const products = [];
    const imageFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024,
    );

    console.log(`🔄 Processing ${imageFiles.length} images from folder...`);

    for (let i = 0; i < Math.min(imageFiles.length, 500); i++) {
      const file = imageFiles[i];
      const filePath = file.webkitRelativePath || file.name;
      const fileName = file.name;

      // Update progress
      setBulkUploadProgress((i / imageFiles.length) * 100);

      try {
        // Extract data from path and filename with intelligent categorization
        const pathData = extractDataFromPath(filePath, fileName);

        // Get image recognition data
        const imageData = await recognizeImageContent(file);

        // Use intelligent categorization system
        const intelligentResult = intelligentCategorization(
          pathData.productName || fileName,
          pathData.brand,
          imageData,
        );

        // Use the most confident categorization
        const finalCategory =
          intelligentResult.confidence > 0.6
            ? intelligentResult.category
            : pathData.category || imageData.category || "Accessories";

        // Convert file to base64 for proper storage
        const imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        const productName =
          pathData.productName ||
          fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");

        const product = {
          name: productName,
          price: pathData.price || getDefaultPrice(finalCategory),
          category: finalCategory,
          description: generateSmartDescription(
            productName,
            finalCategory,
            pathData.brand,
            pathData.color,
          ),
          brand: pathData.brand || "Premium Brand",
          color: pathData.color || "",
          size: pathData.size || "",
          condition: pathData.condition || "new",
          images: [imageUrl],
          tags: generateSmartTags(productName, finalCategory, pathData.brand),
          file: file,
          confidence: Math.max(
            imageData.confidence || 0.7,
            intelligentResult.confidence || 0.7,
          ),
          aiSuggestion:
            intelligentResult.confidence > 0.6 ? intelligentResult : undefined,
          material: pathData.material || "",
          processed: true,
        };

        products.push(product);

        // Log progress every 10 products
        if (i % 10 === 0) {
          console.log(`�� Processed ${i + 1}/${imageFiles.length} products`);
        }
      } catch (error) {
        console.warn(`⚠️ Error processing ${fileName}:`, error);
        // Continue with next file
      }
    }

    console.log(
      `🎉 Folder processing complete: ${products.length} products ready`,
    );
    return products;
  };

  const getDefaultPrice = (category: string): string => {
    const defaultPrices: { [key: string]: string } = {
      Jewelry: "79.99",
      Clothing: "39.99",
      Beauty: "24.99",
      "Shoes & Accessories": "49.99",
      "Home & Kitchen": "34.99",
      Electronics: "129.99",
    };
    return defaultPrices[category] || "29.99";
  };

  // AI-powered description generation for folder uploads
  const generateAIDescription = async (item: any): Promise<string> => {
    try {
      // Enhanced AI description based on image analysis and extracted data
      const categoryDescriptions = {
        Jewelry: [
          "Elegant and sophisticated",
          "Crafted with attention to detail",
          "Perfect for special occasions or everyday wear",
          "Timeless design that complements any style",
        ],
        Clothing: [
          "Comfortable and stylish",
          "Premium quality materials",
          "Perfect fit for modern lifestyle",
          "Versatile piece for any wardrobe",
        ],
        Beauty: [
          "Professional grade formula",
          "Dermatologically tested",
          "Long-lasting and gentle",
          "Suitable for all skin types",
        ],
        Shoes: [
          "Comfortable and durable",
          "Premium construction",
          "Perfect for daily wear",
          "Stylish design meets functionality",
        ],
        Accessories: [
          "Essential accessory",
          "High-quality materials",
          "Complements any outfit",
          "Practical and stylish",
        ],
        Home: [
          "Beautiful and functional",
          "Premium home decor",
          "Enhances any living space",
          "Quality craftsmanship",
        ],
      };

      const baseDescriptions = categoryDescriptions[item.category] || [
        "High-quality product",
        "Carefully selected",
        "Great value for money",
      ];

      const randomDesc =
        baseDescriptions[Math.floor(Math.random() * baseDescriptions.length)];

      let description = `${item.name} - ${randomDesc}.`;

      if (item.brand) {
        description += ` By ${item.brand}.`;
      }

      if (item.color) {
        description += ` Features beautiful ${item.color.toLowerCase()} color.`;
      }

      if (item.aiSuggestion?.confidence > 0.7) {
        description += ` AI-analyzed for quality and authenticity.`;
      }

      return description;
    } catch (error) {
      return `${item.name} - Premium ${item.category.toLowerCase()} item with quality and style.`;
    }
  };

  // AI-powered tag generation for folder uploads
  const generateAITags = async (item: any): Promise<string[]> => {
    try {
      const baseTags = [item.category.toLowerCase()];

      if (item.brand) {
        baseTags.push(item.brand.toLowerCase());
      }

      if (item.color) {
        baseTags.push(item.color.toLowerCase());
      }

      // Add AI-suggested tags based on category
      const categoryTags = {
        Jewelry: ["luxury", "elegant", "handcrafted", "premium"],
        Clothing: ["fashion", "comfortable", "trendy", "stylish"],
        Beauty: ["organic", "professional", "premium", "gentle"],
        Shoes: ["comfortable", "durable", "stylish", "quality"],
        Accessories: ["essential", "practical", "fashionable", "quality"],
        Home: ["decor", "elegant", "functional", "modern"],
      };

      const suggestedTags = categoryTags[item.category] || [
        "quality",
        "premium",
      ];
      baseTags.push(...suggestedTags.slice(0, 3));

      // Add confidence-based tags
      if (item.confidence > 0.8) {
        baseTags.push("ai-verified");
      }

      if (item.aiSuggestion?.confidence > 0.7) {
        baseTags.push("ai-enhanced");
      }

      return [...new Set(baseTags)]; // Remove duplicates
    } catch (error) {
      return [item.category.toLowerCase(), "quality", "premium"];
    }
  };

  // CSV Mapping System Functions
  const handleMapCSV = () => {
    setShowCSVMapping(true);
    setMappingStep("upload");
    setMappingProgress(0);
  };

  // Function to create actual test products for Dan
  const createRealTestProducts = async () => {
    if (!user) {
      alert("Please sign in first to create test products");
      return;
    }

    const testProducts = [
      {
        id: `test-product-${Date.now()}-1`,
        name: "Premium Designer Handbag",
        price: "295.00",
        description:
          "Authentic premium designer handbag in excellent condition. Perfect for special occasions and everyday elegance.",
        category: "Clothing",
        brand: "Chanel",
        color: "Black",
        size: "Medium",
        condition: "like-new",
        material: "Leather",
        images: [
          "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
        ],
        tags: ["designer", "handbag", "luxury", "leather", "black"],
        placement: "featured" as const,
        template: "luxury" as const,
        rating: 4.8,
        dateAdded: new Date().toISOString(),
        status: "published" as const,
        seller: user.id,
        views: 15,
        likes: 3,
      },
      {
        id: `test-product-${Date.now()}-2`,
        name: "Sapphire Pendant Necklace",
        price: "189.99",
        description:
          "Beautiful sapphire pendant with 18k gold chain. Perfect gift for special occasions.",
        category: "Jewelry",
        brand: "Tiffany & Co",
        color: "Blue",
        size: "One Size",
        condition: "new",
        material: "Gold",
        images: [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop",
        ],
        tags: ["jewelry", "sapphire", "necklace", "gold", "pendant"],
        placement: "new-arrival" as const,
        template: "modern" as const,
        rating: 4.9,
        dateAdded: new Date().toISOString(),
        status: "published" as const,
        seller: user.id,
        views: 8,
        likes: 2,
      },
      {
        id: `test-product-${Date.now()}-3`,
        name: "Smart Fitness Watch",
        price: "149.50",
        description:
          "Advanced fitness tracking with heart rate monitor and GPS. 7-day battery life.",
        category: "Beauty",
        brand: "Apple",
        color: "Black",
        size: "42mm",
        condition: "like-new",
        material: "Aluminum",
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        ],
        tags: ["smartwatch", "fitness", "apple", "technology", "health"],
        placement: "regular" as const,
        template: "modern" as const,
        rating: 4.6,
        dateAdded: new Date().toISOString(),
        status: "published" as const,
        seller: user.id,
        views: 12,
        likes: 1,
      },
    ];

    try {
      console.log("🎯 Creating test products for user:", user.id);

      // Add products to the main products array
      setProducts((prev) => [...prev, ...testProducts]);

      // Save each product using the saveProduct function if available
      if (saveProduct) {
        console.log("💾 Saving products using saveProduct function...");
        for (const product of testProducts) {
          await saveProduct(product);
          console.log(`✅ Saved product: ${product.name}`);
        }
      }

      // Save to multiple storage locations for maximum persistence
      console.log("💾 Saving to localStorage...");

      // Save to main products storage
      const existingProducts = JSON.parse(
        localStorage.getItem("allProducts") || "[]",
      );
      const updatedProducts = [...existingProducts, ...testProducts];
      localStorage.setItem("allProducts", JSON.stringify(updatedProducts));

      // Save to user-specific storage
      const userProducts = JSON.parse(
        localStorage.getItem(`userProducts_${user.id}`) || "[]",
      );
      const updatedUserProducts = [...userProducts, ...testProducts];
      localStorage.setItem(
        `userProducts_${user.id}`,
        JSON.stringify(updatedUserProducts),
      );

      // Create collections for these products - FIXED to use correct user
      console.log("��� Creating collections for user:", user.id);
      await addProductsToUserCollections(testProducts);

      // Force update collections display
      const userCollections = JSON.parse(
        localStorage.getItem(`collections_${user.id}`) || "[]",
      );

      // Update collection item counts
      for (const collection of userCollections) {
        const categoryItems = testProducts.filter(
          (p) =>
            p.category.toLowerCase() ===
            collection.name
              .toLowerCase()
              .replace("my ", "")
              .replace(" collection", ""),
        );
        if (categoryItems.length > 0) {
          collection.itemCount =
            (collection.itemCount || 0) + categoryItems.length;
          collection.items = [...(collection.items || []), ...categoryItems];
        }
      }

      localStorage.setItem(
        `collections_${user.id}`,
        JSON.stringify(userCollections),
      );

      alert(
        `✅ SUCCESS! Created ${testProducts.length} test products for ${user.email}\n\n• Products saved to database\n• Added to YOUR collections\n• Check /collections to see them\n• Products: ${testProducts.map((p) => p.name).join(", ")}`,
      );

      console.log("🎉 Test products created successfully:", {
        products: testProducts,
        userId: user.id,
        collections: userCollections,
      });

      return testProducts;
    } catch (error) {
      console.error("Error creating test products:", error);
      alert("Error creating test products: " + error);
    }
  };

  const processCSVMapping = async (file: File) => {
    try {
      setMappingStep("mapping");
      setMappingProgress(20);

      // Parse CSV file
      const data = await parseBulkFile(file);
      setCsvData(data);
      setMappingProgress(40);

      // Find potential matches in existing catalog
      const matches = await findCatalogMatches(data);
      setMappingResults(matches);
      setMappingProgress(60);

      // AI duplicate detection
      const duplicates = await detectAIDuplicates(data);
      setDuplicateMatches(duplicates);
      setMappingProgress(80);

      // Check for missing images
      const missing = await validateImages(data);
      setMissingImages(missing);
      setMappingProgress(100);

      setMappingStep("mapping");
    } catch (error) {
      alert("Error processing CSV: " + (error as Error).message);
      setShowCSVMapping(false);
    }
  };

  // Enhanced CSV + Folder processing
  const processCSVFolderMapping = async () => {
    try {
      setMappingStep("mapping");
      setMappingProgress(10);

      let csvItems = [];
      let folderItems = [];
      let combinedItems = [];

      // Process CSV if available
      if (csvData.length > 0 && csvData[0].type === "csv") {
        console.log("��� Processing CSV file...");
        csvItems = await parseBulkFile(csvData[0].file);
        setMappingProgress(30);
      }

      // Process folder if available
      if (bulkFiles) {
        console.log("���� Processing image folder...");
        const imageFiles = Array.from(bulkFiles).filter(
          (f: any) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024,
        );

        folderItems = await processFolderForMapping(imageFiles);
        setMappingProgress(50);
      }

      // Combine and enhance data
      if (csvItems.length > 0 && folderItems.length > 0) {
        console.log("🔗 Combining CSV and folder data...");
        console.log(
          `📄 CSV Items (${csvItems.length}):`,
          csvItems.slice(0, 3).map((item) => ({
            id: item.id,
            name: item.name,
            images: item.images,
            category: item.category,
          })),
        );
        console.log(
          `📁 Folder Items (${folderItems.length}):`,
          folderItems.slice(0, 3).map((item) => ({
            filename: item.filename,
            name: item.name,
            extractedCategory: item.extractedCategory,
          })),
        );
        combinedItems = await combineCSVWithFolder(csvItems, folderItems);
      } else if (csvItems.length > 0) {
        console.log(`📄 Using CSV data only: ${csvItems.length} items`);
        combinedItems = csvItems;
      } else if (folderItems.length > 0) {
        console.log(`📁 Using folder data only: ${folderItems.length} items`);
        combinedItems = folderItems;
      }

      setCsvData(combinedItems);
      setMappingProgress(70);

      // Find potential matches in existing catalog
      const matches = await findCatalogMatches(combinedItems);
      setMappingResults(matches);
      setMappingProgress(80);

      // AI duplicate detection
      const duplicates = await detectAIDuplicates(combinedItems);
      setDuplicateMatches(duplicates);
      setMappingProgress(90);

      // Check for missing images
      const missing = await validateImages(combinedItems);
      setMissingImages(missing);
      setMappingProgress(100);

      setMappingStep("mapping");

      console.log(
        `✅ Processing complete: ${combinedItems.length} items ready for mapping`,
      );
    } catch (error) {
      console.error("❌ Processing failed:", error);
      alert("Error processing files: " + (error as Error).message);
      setShowCSVMapping(false);
    }
  };

  // Parse folder structure to identify main folders and subfolders
  const parseFolderHierarchy = (
    files: File[],
  ): { [mainFolder: string]: { [subFolder: string]: File[] } } => {
    const hierarchy: { [mainFolder: string]: { [subFolder: string]: File[] } } =
      {};

    files.forEach((file) => {
      const path = file.webkitRelativePath || file.name;
      const pathParts = path.split("/").filter((part) => part.length > 0);

      if (pathParts.length >= 2) {
        const mainFolder = pathParts[0];
        const subFolder = pathParts.length > 2 ? pathParts[1] : "main";

        if (!hierarchy[mainFolder]) {
          hierarchy[mainFolder] = {};
        }
        if (!hierarchy[mainFolder][subFolder]) {
          hierarchy[mainFolder][subFolder] = [];
        }

        hierarchy[mainFolder][subFolder].push(file);
      } else {
        // Root level files go to 'Root' main folder
        if (!hierarchy["Root"]) {
          hierarchy["Root"] = {};
        }
        if (!hierarchy["Root"]["main"]) {
          hierarchy["Root"]["main"] = [];
        }
        hierarchy["Root"]["main"].push(file);
      }
    });

    return hierarchy;
  };

  // Process folder images for mapping with hierarchical structure
  const processFolderForMapping = async (
    imageFiles: File[],
  ): Promise<any[]> => {
    const folderData = [];

    // Parse folder hierarchy
    const folderHierarchy = parseFolderHierarchy(imageFiles);

    console.log(
      "📁 Folder structure:",
      Object.keys(folderHierarchy).map((main) => ({
        mainFolder: main,
        subFolders: Object.keys(folderHierarchy[main]),
      })),
    );

    let processedCount = 0;
    const totalFiles = imageFiles.length;

    // Process each main folder as a collection
    for (const [mainFolderName, subFolders] of Object.entries(
      folderHierarchy,
    )) {
      console.log(`📂 Processing main folder: ${mainFolderName}`);

      // Process each subfolder as a subcategory
      for (const [subFolderName, files] of Object.entries(subFolders)) {
        console.log(
          `📁 Processing subfolder: ${subFolderName} (${files.length} files)`,
        );

        for (const file of files.slice(0, 50)) {
          // Limit per subfolder
          setMappingProgress(30 + (processedCount / totalFiles) * 20);
          processedCount++;

          try {
            // Extract comprehensive data from filename and path
            const extractedData = extractDataFromFilename(
              file.name,
              file.webkitRelativePath || file.name,
            );

            // Convert image to base64
            const imageUrl = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = (e) => resolve(e.target?.result as string);
              reader.readAsDataURL(file);
            });

            // Create product data from folder analysis with hierarchical info
            const folderProduct = {
              name: extractedData.name,
              price: extractedData.price?.toString() || "29.99",
              category: extractedData.category || mainFolderName, // Use main folder as category if not detected
              description: `${extractedData.name} - Premium ${extractedData.category || mainFolderName} with quality and style.`,
              brand: extractedData.brand || "",
              color: extractedData.color || "",
              size: extractedData.size || "",
              material: extractedData.material || "",
              condition: extractedData.condition || "new",
              images: imageUrl,
              tags: extractedData.keywords.join("|"),
              filename: file.name,
              path: file.webkitRelativePath,

              // Enhanced folder data
              extractedPrice: extractedData.price,
              extractedDimensions: extractedData.dimensions,
              extractedBrand: extractedData.brand,
              extractedColor: extractedData.color,
              extractedSize: extractedData.size,
              extractedMaterial: extractedData.material,
              extractedCategory: extractedData.category,
              extractedCondition: extractedData.condition,
              aiKeywords: extractedData.keywords,
              aiConfidence: extractedData.aiConfidence,
              dataSource: "folder",
              fileSize: file.size,
              lastModified: new Date(file.lastModified).toISOString(),

              // Hierarchical folder structure
              mainFolder: mainFolderName,
              subFolder: subFolderName,
              folderHierarchy: `${mainFolderName}/${subFolderName}`,
              isHierarchical: true,
            };

            folderData.push(folderProduct);
          } catch (error) {
            console.warn(`⚠️ Error processing ${file.name}:`, error);
          }
        }
      }
    }

    console.log(
      `📁 Processed ${folderData.length} items from ${Object.keys(folderHierarchy).length} main folders`,
    );
    return folderData;
  };

  // Enhanced image mapping to similar named items
  const mapImagesToSimilarItems = (items: any[]): any[] => {
    const itemsWithImages = items.filter(
      (item) => item.images && item.images !== "",
    );
    const itemsWithoutImages = items.filter(
      (item) => !item.images || item.images === "",
    );

    return items.map((item) => {
      if (!item.images || item.images === "") {
        // Find similar named items with images
        const similarItems = itemsWithImages.filter((otherItem) => {
          if (otherItem === item) return false;

          const nameSimilarity = calculateSimilarity(item.name, otherItem.name);
          const wordSimilarity = calculateWordSimilarity(
            item.name,
            otherItem.name,
          );
          const categoryMatch = item.category === otherItem.category;
          const brandMatch =
            item.brand && otherItem.brand
              ? calculateSimilarity(item.brand, otherItem.brand) > 0.8
              : false;

          // High similarity threshold for image mapping
          return (
            nameSimilarity > 0.75 ||
            wordSimilarity > 0.85 ||
            (categoryMatch && nameSimilarity > 0.6) ||
            (brandMatch && nameSimilarity > 0.5)
          );
        });

        if (similarItems.length > 0) {
          // Sort by similarity and pick the best match
          const bestMatch = similarItems.sort((a, b) => {
            const simA = calculateSimilarity(item.name, a.name);
            const simB = calculateSimilarity(item.name, b.name);
            return simB - simA;
          })[0];

          return {
            ...item,
            images: bestMatch.images,
            imageMappedFrom: bestMatch.name,
            imageMappingSimilarity: calculateSimilarity(
              item.name,
              bestMatch.name,
            ),
            hasAutoMappedImage: true,
          };
        }
      }
      return item;
    });
  };

  // Combine CSV data with folder images intelligently
  const combineCSVWithFolder = async (
    csvItems: any[],
    folderItems: any[],
  ): Promise<any[]> => {
    const combinedItems = [];

    // Create mapping between CSV items and folder images
    for (const csvItem of csvItems) {
      console.log(`🔍 Processing CSV item:`, {
        id: csvItem.id,
        name: csvItem.name,
        images: csvItem.images,
        category: csvItem.category,
      });

      // Enhanced image matching with STRICT LIMITS to prevent duplicates
      let exactMatches = [];
      let partialMatches = [];

      const matchingImages = folderItems
        .filter((folderItem) => {
          // Universal filename matching - check ALL CSV fields for any image/filename references
          const folderFileName = folderItem.filename || "";
          const folderFileBase = folderFileName
            .replace(/\.[^/.]+$/, "")
            .toLowerCase();

          // Get ALL possible image/filename fields from CSV item (universal approach)
          const possibleFields = [
            csvItem.images,
            csvItem.image,
            csvItem.filename,
            csvItem.file,
            csvItem.photo,
            csvItem.picture,
            csvItem.id,
            csvItem.sku,
            csvItem.code,
            ...(csvItem.allImageFields || []), // From flexible parsing
            ...Object.values(csvItem).filter(
              (val) =>
                typeof val === "string" &&
                val.length > 5 &&
                (val.includes(".jpg") ||
                  val.includes(".png") ||
                  val.includes(".jpeg") ||
                  val.includes(".gif") ||
                  val.includes(".webp") ||
                  val.match(
                    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
                  )),
            ),
          ].filter(Boolean);

          // Test each possible field for filename matches
          for (const csvField of possibleFields) {
            if (!csvField) continue;

            // Method 1: UUID matching
            const csvUUID = csvField.match(
              /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
            )?.[0];
            const folderUUID = folderFileName.match(
              /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
            )?.[0];

            if (
              csvUUID &&
              folderUUID &&
              csvUUID.toLowerCase() === folderUUID.toLowerCase()
            ) {
              console.log(
                `✅ UUID match found: ${csvField} -> ${folderFileName}`,
              );
              return true;
            }

            // Method 2: Exact filename match
            const csvFileBase = csvField.replace(/\.[^/.]+$/, "").toLowerCase();
            if (
              csvFileBase &&
              folderFileBase &&
              csvFileBase === folderFileBase
            ) {
              console.log(`✅ Exact match: ${csvField} -> ${folderFileName}`);
              return true;
            }

            // Method 3: Normalized matching (remove special chars)
            if (csvFileBase && folderFileBase) {
              const normalizedCSV = csvFileBase
                .replace(/[-_.]/g, "")
                .toLowerCase();
              const normalizedFolder = folderFileBase
                .replace(/[-_.]/g, "")
                .toLowerCase();

              if (normalizedCSV === normalizedFolder) {
                console.log(
                  `✅ Normalized match: ${csvField} -> ${folderFileName}`,
                );
                return true;
              }

              // Partial contains matching
              if (
                normalizedCSV.includes(normalizedFolder) ||
                normalizedFolder.includes(normalizedCSV)
              ) {
                console.log(
                  `✅ Partial match: ${csvField} -> ${folderFileName}`,
                );
                return true;
              }
            }
          }

          // The matching logic above covers all cases - no additional fallback needed

          // Method 4: Traditional name similarity (fallback)
          const nameSimilarity = calculateSimilarity(
            csvItem.name,
            folderItem.name,
          );
          const wordSimilarity = calculateWordSimilarity(
            csvItem.name,
            folderItem.name,
          );
          const categoryMatch =
            csvItem.category === folderItem.extractedCategory;
          const priceMatch =
            csvItem.price && folderItem.extractedPrice
              ? Math.abs(
                  parseFloat(csvItem.price) - folderItem.extractedPrice,
                ) < 10
              : false;
          const brandMatch =
            csvItem.brand && folderItem.extractedBrand
              ? calculateSimilarity(csvItem.brand, folderItem.extractedBrand) >
                0.7
              : false;

          // Relaxed matching criteria for fallback
          return (
            nameSimilarity > 0.6 ||
            wordSimilarity > 0.8 ||
            (categoryMatch && nameSimilarity > 0.4) ||
            (brandMatch && nameSimilarity > 0.3) ||
            priceMatch
          );
        })
        .sort((a, b) => {
          // Sort by match priority: exact matches first, then similarity
          const csvId = csvItem.id || csvItem.sku || csvItem.name || "";
          const csvImageName = csvItem.images || csvItem.image || "";

          const aUUID = a.filename?.match(
            /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
          )?.[0];
          const bUUID = b.filename?.match(
            /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
          )?.[0];
          const csvUUID = csvId.match(
            /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
          )?.[0];

          if (csvUUID) {
            if (aUUID === csvUUID) return -1;
            if (bUUID === csvUUID) return 1;
          }

          // Fallback to similarity
          const simA = calculateSimilarity(csvItem.name, a.name);
          const simB = calculateSimilarity(csvItem.name, b.name);
          return simB - simA;
        })
        .slice(0, 2); // STRICT LIMIT: Maximum 2 images per product

      // Log matching results
      if (matchingImages.length > 0) {
        console.log(
          `✅ Found ${matchingImages.length} image matches for "${csvItem.name}":`,
          matchingImages.map((img) => img.filename),
        );
      } else {
        console.log(`❌ No image matches found for "${csvItem.name}"`);
      }

      // Enhanced CSV item with folder data
      const enhancedItem = {
        ...csvItem,
        // Merge extracted folder data
        extractedBrand: matchingImages[0]?.extractedBrand || csvItem.brand,
        extractedColor: matchingImages[0]?.extractedColor || csvItem.color,
        extractedMaterial:
          matchingImages[0]?.extractedMaterial || csvItem.material,
        extractedDimensions: matchingImages[0]?.extractedDimensions,
        extractedCategory:
          matchingImages[0]?.extractedCategory || csvItem.category,
        aiKeywords: matchingImages[0]?.aiKeywords || [],

        // Add matched images
        matchedImages: matchingImages.map((img) => ({
          url: img.images,
          filename: img.filename,
          confidence: img.aiConfidence,
          path: img.path,
        })),

        // Update main image if better one found
        images:
          matchingImages.length > 0
            ? csvItem.images || matchingImages[0].images
            : csvItem.images,

        // Enhanced metadata
        dataSource: "csv+folder",
        imageMatches: matchingImages.length,
        aiEnhanced: matchingImages.length > 0,
        combinedConfidence:
          matchingImages.length > 0
            ? Math.max(matchingImages[0].aiConfidence, 0.8)
            : 0.7,
      };

      combinedItems.push(enhancedItem);
    }

    // Add folder items that didn't match any CSV items
    const unmatchedFolderItems = folderItems.filter((folderItem) => {
      return !csvItems.some((csvItem) => {
        const similarity = calculateSimilarity(csvItem.name, folderItem.name);
        return similarity > 0.6;
      });
    });

    // Add unmatched folder items as new products
    unmatchedFolderItems.forEach((folderItem) => {
      combinedItems.push({
        ...folderItem,
        dataSource: "folder-only",
        imageMatches: 1,
        aiEnhanced: true,
        combinedConfidence: folderItem.aiConfidence,
      });
    });

    // Final step: Map images between similar items that still don't have images
    const finalItems = mapImagesToSimilarItems(combinedItems);

    const mappedImageCount = finalItems.filter(
      (item) => item.hasAutoMappedImage,
    ).length;

    console.log(
      `🔗 Combined ${csvItems.length} CSV items with ${folderItems.length} folder images`,
    );
    console.log(
      `📊 Result: ${finalItems.length} enhanced products (${finalItems.filter((i) => i.aiEnhanced).length} AI-enhanced)`,
    );
    if (mappedImageCount > 0) {
      console.log(
        `🖼️ Auto-mapped ${mappedImageCount} images to similar named items`,
      );
    }

    return finalItems;
  };

  const findCatalogMatches = async (data: any[]): Promise<any[]> => {
    const matches = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      setMappingProgress(40 + (i / data.length) * 20);

      // Enhanced filename analysis if item has filename data
      if (item.filename || item.path || item.name) {
        const filenameData = extractDataFromFilename(
          item.filename || item.name,
          item.path,
        );

        // Merge extracted data with CSV data
        item.extractedPrice = filenameData.price;
        item.extractedDimensions = filenameData.dimensions;
        item.extractedBrand = filenameData.brand || item.brand;
        item.extractedColor = filenameData.color || item.color;
        item.extractedSize = filenameData.size || item.size;
        item.extractedMaterial = filenameData.material || item.material;
        item.extractedCategory = filenameData.category || item.category;
        item.extractedCondition = filenameData.condition || item.condition;
        item.aiKeywords = filenameData.keywords;
        item.aiConfidence = filenameData.aiConfidence;

        // Use extracted price if CSV price is missing
        if (!item.price && filenameData.price) {
          item.price = filenameData.price.toString();
        }
      }

      // Find similar products using comprehensive matching
      const similarProducts = products.filter((product) => {
        const nameSimilarity = calculateSimilarity(item.name, product.name);
        const categorySimilarity =
          (item.extractedCategory || item.category) === product.category
            ? 1
            : 0;
        const brandSimilarity =
          (item.extractedBrand || item.brand) && product.brand
            ? calculateSimilarity(
                item.extractedBrand || item.brand,
                product.brand,
              )
            : 0;
        const priceSimilarity =
          item.price && product.price
            ? Math.max(
                0,
                1 -
                  Math.abs(parseFloat(item.price) - parseFloat(product.price)) /
                    Math.max(parseFloat(item.price), parseFloat(product.price)),
              )
            : 0;

        // Multi-factor similarity scoring
        const overallSimilarity =
          nameSimilarity * 0.4 +
          categorySimilarity * 0.25 +
          brandSimilarity * 0.2 +
          priceSimilarity * 0.15;

        return overallSimilarity > 0.65; // Higher threshold for better precision
      });

      // Sort similar products by relevance
      const sortedMatches = similarProducts
        .map((product) => ({
          ...product,
          similarity: calculateSimilarity(item.name, product.name),
          categoryMatch:
            (item.extractedCategory || item.category) === product.category,
          priceMatch:
            item.price && product.price
              ? Math.abs(parseFloat(item.price) - parseFloat(product.price)) <
                10
              : false,
        }))
        .sort((a, b) => {
          // Primary: exact category matches first
          if (a.categoryMatch && !b.categoryMatch) return -1;
          if (!a.categoryMatch && b.categoryMatch) return 1;

          // Secondary: price matches
          if (a.priceMatch && !b.priceMatch) return -1;
          if (!a.priceMatch && b.priceMatch) return 1;

          // Tertiary: highest similarity
          return b.similarity - a.similarity;
        });

      const bestMatch = sortedMatches[0];
      const matchConfidence = bestMatch ? bestMatch.similarity : 0;

      matches.push({
        csvItem: item,
        csvIndex: i,
        potentialMatches: sortedMatches.slice(0, 5), // Show top 5 matches
        matchConfidence: matchConfidence,
        isNewProduct: sortedMatches.length === 0,
        userChoice: "pending", // 'new', 'match', 'skip'
        selectedMatch: null,
        aiRecommendation: bestMatch && matchConfidence > 0.8 ? "match" : "new",
        extractedData:
          item.extractedPrice ||
          item.extractedDimensions ||
          item.extractedBrand,
      });
    }

    // Sort matches by confidence (highest first)
    return matches.sort((a, b) => b.matchConfidence - a.matchConfidence);
  };

  // Word-based similarity for semantic matching
  const calculateWordSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1;

    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    let commonWords = 0;
    words1.forEach((word) => {
      if (words2.includes(word)) commonWords++;
    });

    return commonWords / Math.max(words1.length, words2.length);
  };

  // Levenshtein distance for character-level similarity
  const calculateLevenshteinSimilarity = (
    str1: string,
    str2: string,
  ): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const distance = levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
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
  };

  // Comprehensive similarity using both methods
  const calculateSimilarity = (str1: string, str2: string): number => {
    const wordSim = calculateWordSimilarity(str1, str2);
    const levenSim = calculateLevenshteinSimilarity(
      str1.toLowerCase(),
      str2.toLowerCase(),
    );

    // Weighted average: word similarity is more important for product names
    return wordSim * 0.7 + levenSim * 0.3;
  };

  // Enhanced filename parsing with AI analysis
  const extractDataFromFilename = (
    filename: string,
    filePath?: string,
  ): any => {
    const originalName = filename.replace(/\.[^/.]+$/, ""); // Remove extension
    const pathParts = filePath ? filePath.split("/") : [];

    const extracted = {
      name: "",
      price: null,
      dimensions: null,
      brand: null,
      color: null,
      size: null,
      category: null,
      condition: "new",
      material: null,
      keywords: [],
    };

    // Extract price patterns ($XX.XX, $XX, XX.XX, etc.)
    const pricePatterns = [
      /\$(\d+(?:\.\d{2})?)/g, // $29.99, $50
      /(\d+\.\d{2})\$?/g, // 29.99, 29.99$
      /price[_-]?(\d+(?:\.\d{2})?)/gi, // price_29.99, price29
      /(\d+)[_-]?dollars?/gi, // 29_dollars, 50dollar
    ];

    for (const pattern of pricePatterns) {
      const match = originalName.match(pattern);
      if (match) {
        const priceStr = match[1] || match[0].replace(/\$|dollars?/gi, "");
        const price = parseFloat(priceStr);
        if (price > 0 && price < 10000) {
          extracted.price = price;
          break;
        }
      }
    }

    // Extract dimensions (3x4, 10*5, 12 inch, etc.)
    const dimensionPatterns = [
      /(\d+)[x*×](\d+)(?:[x*×](\d+))?/gi, // 3x4, 10*5*2
      /(\d+)[_-]?(?:inch|in|cm|mm)(?:[_-]?by[_-]?(\d+))?/gi, // 12inch, 5cm_by_3cm
      /size[_-]?(\d+(?:\.\d+)?)[x*×]?(\d+(?:\.\d+)?)?/gi, // size_10x12
    ];

    for (const pattern of dimensionPatterns) {
      const match = originalName.match(pattern);
      if (match) {
        const dims = match[0];
        extracted.dimensions = dims;
        extracted.keywords.push("sized", "dimensions");
        break;
      }
    }

    // Extract colors
    const colorPatterns = [
      /\b(red|blue|green|yellow|black|white|pink|purple|orange|brown|gray|grey|silver|gold|rose|navy|maroon|beige|tan|cream|ivory)\b/gi,
      /color[_-]?([a-z]+)/gi,
    ];

    for (const pattern of colorPatterns) {
      const match = originalName.match(pattern);
      if (match) {
        extracted.color = match[1] || match[0].replace(/color[_-]?/gi, "");
        extracted.keywords.push("colored");
        break;
      }
    }

    // Extract brand names (common patterns)
    const brandPatterns = [
      /\b(nike|adidas|apple|samsung|sony|gucci|prada|chanel|versace|armani|calvin|klein|tommy|hilfiger|polo|ralph|lauren|coach|michael|kors|tiffany|cartier|rolex)\b/gi,
      /brand[_-]?([a-z]+)/gi,
      /by[_-]?([a-z]+)/gi,
    ];

    for (const pattern of brandPatterns) {
      const match = originalName.match(pattern);
      if (match) {
        extracted.brand =
          match[1] || match[0].replace(/brand[_-]?|by[_-]?/gi, "");
        extracted.keywords.push("branded");
        break;
      }
    }

    // Extract sizes
    const sizePatterns = [
      /\b(xs|s|m|l|xl|xxl|xxxl)\b/gi,
      /size[_-]?([a-z0-9]+)/gi,
      /\b(\d+(?:\.\d+)?)[_-]?(us|uk|eu|cm|inch|in|mm)\b/gi,
    ];

    for (const pattern of sizePatterns) {
      const match = originalName.match(pattern);
      if (match) {
        extracted.size = match[1] || match[0].replace(/size[_-]?/gi, "");
        extracted.keywords.push("sized");
        break;
      }
    }

    // Extract materials
    const materialPatterns = [
      /\b(cotton|silk|wool|leather|denim|polyester|nylon|linen|cashmere|velvet|satin|chiffon|lace|gold|silver|platinum|diamond|pearl|ruby|emerald|sapphire|crystal|glass|plastic|metal|wood|ceramic)\b/gi,
      /material[_-]?([a-z]+)/gi,
      /made[_-]?of[_-]?([a-z]+)/gi,
    ];

    for (const pattern of materialPatterns) {
      const match = originalName.match(pattern);
      if (match) {
        extracted.material =
          match[1] || match[0].replace(/material[_-]?|made[_-]?of[_-]?/gi, "");
        extracted.keywords.push("material");
        break;
      }
    }

    // Extract condition
    const conditionPatterns = [
      /\b(new|used|vintage|antique|refurbished|excellent|good|fair|poor)\b/gi,
      /condition[_-]?([a-z]+)/gi,
    ];

    for (const pattern of conditionPatterns) {
      const match = originalName.match(pattern);
      if (match) {
        const condition = match[1] || match[0].replace(/condition[_-]?/gi, "");
        if (
          ["new", "used", "vintage", "antique", "refurbished"].includes(
            condition.toLowerCase(),
          )
        ) {
          extracted.condition = condition.toLowerCase();
          extracted.keywords.push(condition.toLowerCase());
        }
        break;
      }
    }

    // AI category detection from filename and path
    const categoryKeywords = {
      Jewelry: [
        "ring",
        "necklace",
        "bracelet",
        "earring",
        "watch",
        "pendant",
        "chain",
        "jewel",
        "diamond",
        "gold",
        "silver",
      ],
      Clothing: [
        "shirt",
        "dress",
        "pants",
        "jacket",
        "skirt",
        "blouse",
        "top",
        "bottom",
        "outfit",
        "fashion",
        "apparel",
      ],
      Shoes: [
        "shoe",
        "boot",
        "sneaker",
        "heel",
        "sandal",
        "pump",
        "loafer",
        "oxford",
        "athletic",
        "footwear",
      ],
      Beauty: [
        "makeup",
        "cosmetic",
        "lipstick",
        "foundation",
        "eyeshadow",
        "mascara",
        "perfume",
        "skincare",
        "beauty",
      ],
      Accessories: [
        "bag",
        "purse",
        "wallet",
        "belt",
        "scarf",
        "hat",
        "sunglasses",
        "handbag",
        "clutch",
        "tote",
      ],
      Home: [
        "decor",
        "furniture",
        "lamp",
        "vase",
        "pillow",
        "candle",
        "frame",
        "kitchen",
        "bedroom",
        "living",
      ],
    };

    const fullText = (originalName + " " + pathParts.join(" ")).toLowerCase();
    let maxMatches = 0;
    let detectedCategory = null;

    Object.entries(categoryKeywords).forEach(([category, keywords]) => {
      const matches = keywords.filter((keyword) =>
        fullText.includes(keyword),
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedCategory = category;
      }
    });

    extracted.category = detectedCategory;

    // Clean up the product name by removing extracted data
    let cleanName = originalName
      .replace(/\$\d+(?:\.\d{2})?/g, "") // Remove prices
      .replace(/\d+[x*×]\d+/g, "") // Remove dimensions
      .replace(/size[_-]?\w+/gi, "") // Remove size references
      .replace(/color[_-]?\w+/gi, "") // Remove color references
      .replace(/brand[_-]?\w+/gi, "") // Remove brand references
      .replace(/[_-]+/g, " ") // Replace underscores/dashes with spaces
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();

    extracted.name = cleanName || filename.replace(/\.[^/.]+$/, "");

    // Add AI confidence score based on how much data was extracted
    const extractedDataCount = Object.values(extracted).filter(
      (v) => v !== null && v !== "" && (!Array.isArray(v) || v.length > 0),
    ).length;
    extracted.aiConfidence = Math.min(0.95, 0.4 + extractedDataCount * 0.1);

    return extracted;
  };

  const detectAIDuplicates = async (data: any[]): Promise<any[]> => {
    const duplicates = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const item1 = data[i];
        const item2 = data[j];

        // Multi-factor duplicate detection
        const nameSimilarity = calculateSimilarity(item1.name, item2.name);
        const wordSimilarity = calculateWordSimilarity(item1.name, item2.name);
        const levenSimilarity = calculateLevenshteinSimilarity(
          item1.name,
          item2.name,
        );

        // Price similarity check
        const priceSimilarity =
          item1.price && item2.price
            ? Math.max(
                0,
                1 -
                  Math.abs(parseFloat(item1.price) - parseFloat(item2.price)) /
                    Math.max(parseFloat(item1.price), parseFloat(item2.price)),
              )
            : 0;

        // Category and brand matching
        const categoryMatch =
          (item1.extractedCategory || item1.category) ===
          (item2.extractedCategory || item2.category);
        const brandMatch =
          (item1.extractedBrand || item1.brand) ===
          (item2.extractedBrand || item2.brand);

        // Comprehensive duplicate scoring
        const duplicateScore =
          nameSimilarity * 0.4 +
          wordSimilarity * 0.2 +
          levenSimilarity * 0.15 +
          priceSimilarity * 0.15 +
          (categoryMatch ? 0.05 : 0) +
          (brandMatch ? 0.05 : 0);

        // Flag as duplicate if high similarity
        if (
          duplicateScore > 0.75 ||
          nameSimilarity > 0.9 ||
          (wordSimilarity > 0.95 && categoryMatch)
        ) {
          duplicates.push({
            item1: item1,
            item2: item2,
            nameSimilarity: nameSimilarity,
            wordSimilarity: wordSimilarity,
            levenSimilarity: levenSimilarity,
            priceSimilarity: priceSimilarity,
            duplicateScore: duplicateScore,
            index1: i,
            index2: j,
            duplicateType:
              nameSimilarity > 0.95
                ? "exact"
                : duplicateScore > 0.85
                  ? "high"
                  : "potential",
            recommendation: duplicateScore > 0.85 ? "merge" : "review",
          });
        }
      }
    }

    // Sort duplicates by score (highest first)
    return duplicates.sort((a, b) => b.duplicateScore - a.duplicateScore);
  };

  const validateImages = async (data: any[]): Promise<any[]> => {
    const missing = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (
        !item.images ||
        item.images.length === 0 ||
        (typeof item.images === "string" && item.images.trim() === "")
      ) {
        missing.push({
          item: item,
          index: i,
          hasPlaceholder: false,
        });
      }
    }

    return missing;
  };

  const handleUserChoice = (
    matchIndex: number,
    choice: "new" | "match" | "skip",
    selectedMatch?: any,
  ) => {
    setMappingResults((prev) =>
      prev.map((result, index) =>
        index === matchIndex
          ? {
              ...result,
              userChoice: choice,
              selectedMatch: selectedMatch || null,
            }
          : result,
      ),
    );
  };

  const finalizeMappingAndUpdate = async () => {
    setMappingStep("validation");
    setMappingProgress(0);

    const newProducts = [];
    const updatedProducts = [];
    let successfullyAdded = 0;

    try {
      for (let i = 0; i < mappingResults.length; i++) {
        const result = mappingResults[i];
        setMappingProgress((i / mappingResults.length) * 100);

        if (result.userChoice === "new") {
          // Create new product and add to user's account
          const newProduct = await createProductFromCSV(result.csvItem);

          // Add product to user's account through useUserAuth
          const addResult = addProduct({
            name: newProduct.name,
            price: parseFloat(newProduct.price.toString()),
            description: newProduct.description,
            category: newProduct.category,
            images: Array.isArray(newProduct.images)
              ? newProduct.images
              : [newProduct.images],
            tags: newProduct.tags || [],
            status: "active",
          });

          if (addResult.success) {
            newProducts.push(newProduct);
            successfullyAdded++;
            console.log(
              `✅ Added product "${newProduct.name}" to user's account`,
            );
          } else {
            console.error(
              `❌ Failed to add product "${newProduct.name}":`,
              addResult.error,
            );
          }
        } else if (result.userChoice === "match" && result.selectedMatch) {
          // Update existing product
          const updatedProduct = await updateProductFromCSV(
            result.selectedMatch,
            result.csvItem,
          );
          updatedProducts.push(updatedProduct);
        }
        // Skip products with choice 'skip'
      }

      // Update catalog for display purposes
      setProducts((prev) => [
        ...newProducts,
        ...prev.map((p) => {
          const updated = updatedProducts.find((up) => up.id === p.id);
          return updated || p;
        }),
      ]);

      // Add products to user collections based on category
      if (user?.id && newProducts.length > 0) {
        await addProductsToUserCollections(newProducts);

        // Send bulk product update message to friends and followers
        await ProductUpdateMessaging.sendBulkProductUpdate(
          user.id,
          newProducts,
          `I just added ${newProducts.length} amazing new products to my shop! Check them out and let me know what you think! 🛍️✨`,
        );
      }

      // Generate validation results
      setValidationResults({
        newProducts: successfullyAdded,
        updatedProducts: updatedProducts.length,
        skippedProducts: mappingResults.filter((r) => r.userChoice === "skip")
          .length,
        duplicatesFound: duplicateMatches.length,
        missingImages: missingImages.length,
        totalProcessed: mappingResults.length,
        addedToUserAccount: successfullyAdded,
      });

      console.log(
        `🎉 Successfully imported ${successfullyAdded} products to user account!`,
      );
    } catch (error) {
      console.error("❌ Error during product import:", error);
      alert(`Error importing products: ${error.message}`);
    }

    setMappingStep("complete");
  };

  const createProductFromCSV = async (csvItem: any): Promise<Product> => {
    // Map CSV collection to proper collection name using COLLECTION_MAPPING
    const rawCategory = csvItem.category || csvItem.collection || "Accessories";
    const mappedCategory = COLLECTION_MAPPING[rawCategory] || rawCategory;

    return {
      id: `csv-${Date.now()}-${Math.random()}`,
      name: csvItem.name,
      price: parseFloat(csvItem.price) || 29.99,
      originalPrice: csvItem.originalprice || csvItem.original_price || "",
      description:
        csvItem.description ||
        `Premium ${mappedCategory} item - ${csvItem.name}`,
      category: mappedCategory,
      images: csvItem.images
        ? csvItem.images.split("|").filter(Boolean)
        : [TEMPLATE_IMAGES[mappedCategory] || TEMPLATE_IMAGES["Beauty"]],
      tags: csvItem.tags
        ? csvItem.tags.split("|")
        : [mappedCategory.toLowerCase(), "csv-import"],
      rating: 5,
      condition: csvItem.condition || "new",
      brand: csvItem.brand || "",
      size: csvItem.size || "",
      color: csvItem.color || "",
      material: csvItem.material || "",
      placement: "regular" as any,
      customSection: "",
      template: "modern",
      dateAdded: new Date().toISOString(),
      status: "active",
      seller: user?.name || "Current User",
      views: 0,
      likes: 0,
      csvImported: true,
    };
  };

  const updateProductFromCSV = async (
    existingProduct: Product,
    csvItem: any,
  ): Promise<Product> => {
    return {
      ...existingProduct,
      price: parseFloat(csvItem.price) || existingProduct.price,
      originalPrice:
        csvItem.originalprice ||
        csvItem.original_price ||
        existingProduct.originalPrice,
      description: csvItem.description || existingProduct.description,
      brand: csvItem.brand || existingProduct.brand,
      size: csvItem.size || existingProduct.size,
      color: csvItem.color || existingProduct.color,
      material: csvItem.material || existingProduct.material,
      csvUpdated: true,
      lastUpdated: new Date().toISOString(),
    };
  };

  // Add products to user collections based on category
  const addProductsToUserCollections = async (products: Product[]) => {
    if (!user?.id) return;

    try {
      // Get user's existing collections
      const userCollections = await UserDataService.getUserCollections(user.id);

      // Category mapping for collections
      const categoryCollectionMap: { [key: string]: string } = {
        Jewelry: "jewelry",
        Clothing: "clothing",
        Beauty: "beauty",
        Shoes: "shoes",
        Accessories: "accessories",
        Home: "home",
      };

      // Check if products have hierarchical folder structure
      const hasHierarchicalData = products.some((p) => (p as any).mainFolder);

      if (hasHierarchicalData) {
        // Group products by main folder (collection) and subfolder (subcategory)
        const productsByMainFolder: {
          [mainFolder: string]: { [subFolder: string]: Product[] };
        } = {};

        products.forEach((product) => {
          const productAny = product as any;
          const mainFolder = productAny.mainFolder || product.category;
          const subFolder = productAny.subFolder || "main";

          if (!productsByMainFolder[mainFolder]) {
            productsByMainFolder[mainFolder] = {};
          }
          if (!productsByMainFolder[mainFolder][subFolder]) {
            productsByMainFolder[mainFolder][subFolder] = [];
          }
          productsByMainFolder[mainFolder][subFolder].push(product);
        });

        // Process each main folder as a collection
        for (const [mainFolder, subFolders] of Object.entries(
          productsByMainFolder,
        )) {
          await createHierarchicalCollection(
            mainFolder,
            subFolders,
            userCollections,
          );
        }
      } else {
        // Traditional category-based grouping
        const productsByCategory: { [key: string]: Product[] } = {};
        products.forEach((product) => {
          const category = product.category;
          if (!productsByCategory[category]) {
            productsByCategory[category] = [];
          }
          productsByCategory[category].push(product);
        });

        // Process each category traditionally
        for (const [category, categoryProducts] of Object.entries(
          productsByCategory,
        )) {
          await createTraditionalCollection(
            category,
            categoryProducts,
            userCollections,
          );
        }
      }

      console.log(
        `🎉 Successfully organized ${products.length} products into ${hasHierarchicalData ? "hierarchical folder-based" : "category-based"} collections`,
      );
    } catch (error) {
      console.error("Error adding products to collections:", error);
    }
  };

  // Create hierarchical collection with subcategories
  const createHierarchicalCollection = async (
    mainFolder: string,
    subFolders: { [subFolder: string]: Product[] },
    userCollections: any[],
  ) => {
    const collectionId = `user_${user.id}_folder_${mainFolder.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now()}`;

    // Calculate total items across all subfolders
    const totalItems = Object.values(subFolders).reduce(
      (sum, items) => sum + items.length,
      0,
    );

    // Create subcategories from subfolders
    const subcategories = Object.entries(subFolders).map(
      ([subFolder, items]) => ({
        id: `${collectionId}_sub_${subFolder.toLowerCase().replace(/[^a-z0-9]/g, "_")}`,
        name: subFolder === "main" ? "Main Items" : subFolder,
        description: `${subFolder} items from ${mainFolder} folder`,
        itemCount: items.length,
        items: items.map((p) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price.toString()),
          image: Array.isArray(p.images) ? p.images[0] : p.images,
          category: p.category,
          description: p.description,
          brand: p.brand,
          dateAdded: new Date().toISOString(),
          subCategory: subFolder,
        })),
      }),
    );

    // Create the main collection
    const newCollection = {
      id: collectionId,
      name: `${mainFolder} Collection`,
      description: `Collection created from ${mainFolder} folder with ${Object.keys(subFolders).length} subcategories`,
      image: getCollectionImageByCategory(mainFolder),
      itemCount: totalItems,
      creator: {
        id: user.id,
        name: user.name || "User",
        avatar: user.avatar || "",
        verified: user.verified || false,
      },
      category: mainFolder.toLowerCase(),
      tags: [mainFolder.toLowerCase(), "folder-import", "hierarchical"],
      isPublic: false,
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isHierarchical: true,
      subcategories: subcategories,
      items: subcategories.flatMap((sub) => sub.items), // All items for compatibility
    };

    // Save the hierarchical collection
    await UserDataService.saveCollection(user.id, newCollection);

    console.log(
      `✅ Created hierarchical collection "${newCollection.name}" with ${totalItems} items across ${subcategories.length} subcategories`,
    );
  };

  // Create traditional category-based collection
  const createTraditionalCollection = async (
    category: string,
    categoryProducts: Product[],
    userCollections: any[],
  ) => {
    const categoryCollectionMap: { [key: string]: string } = {
      Jewelry: "jewelry",
      Clothing: "clothing",
      Beauty: "beauty",
      Shoes: "shoes",
      Accessories: "accessories",
      Home: "home",
    };

    const collectionKey = categoryCollectionMap[category];
    if (!collectionKey) return;

    // Find or create collection for this category
    let targetCollection = userCollections.find(
      (c) =>
        c.category === collectionKey ||
        c.name.toLowerCase().includes(collectionKey) ||
        c.id.includes(collectionKey),
    );

    if (!targetCollection) {
      // Create new collection for this category
      const newCollection = {
        id: `user_${user.id}_${collectionKey}_${Date.now()}`,
        name: `My ${category} Collection`,
        description: `Personal ${category} collection with items from uploads`,
        image: getCollectionImageByCategory(category),
        itemCount: categoryProducts.length,
        creator: {
          id: user.id,
          name: user.name || "User",
          avatar: user.avatar || "",
          verified: user.verified || false,
        },
        category: collectionKey,
        tags: [collectionKey, "category-import", "personal"],
        isPublic: false,
        likes: 0,
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: categoryProducts.map((p) => ({
          id: p.id,
          name: p.name,
          price: parseFloat(p.price.toString()),
          image: Array.isArray(p.images) ? p.images[0] : p.images,
          category: p.category,
          description: p.description,
          brand: p.brand,
          dateAdded: new Date().toISOString(),
        })),
      };

      // Save the new collection
      await UserDataService.saveCollection(user.id, newCollection);

      console.log(
        `✅ Created collection "${newCollection.name}" with ${categoryProducts.length} ${category} items`,
      );
    } else {
      // Add items to existing collection
      const existingItems = targetCollection.items || [];
      const newItems = categoryProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price.toString()),
        image: Array.isArray(p.images) ? p.images[0] : p.images,
        category: p.category,
        description: p.description,
        brand: p.brand,
        dateAdded: new Date().toISOString(),
      }));

      const updatedCollection = {
        ...targetCollection,
        items: [...existingItems, ...newItems],
        itemCount: existingItems.length + newItems.length,
        updatedAt: new Date().toISOString(),
      };

      // Save updated collection
      await UserDataService.saveCollection(user.id, updatedCollection);

      console.log(
        `✅ Added ${newItems.length} ${category} items to existing collection "${targetCollection.name}"`,
      );
    }
  };

  // Get collection image based on category
  const getCollectionImageByCategory = (category: string): string => {
    const categoryImages: { [key: string]: string } = {
      Jewelry:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      Clothing:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      Beauty:
        "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      Shoes:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      Accessories:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
      Home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=400&h=300&fit=crop",
    };

    return (
      categoryImages[category] ||
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=400&h=300&fit=crop"
    );
  };

  const generateSmartDescription = (
    name: string,
    category: string,
    brand?: string,
    color?: string,
  ): string => {
    const categoryDescriptions: { [key: string]: string } = {
      Jewelry: "exquisite craftsmanship and timeless elegance",
      Clothing: "premium quality and contemporary style",
      Beauty: "premium ingredients and luxurious formulation",
      "Shoes & Accessories": "exceptional quality and versatile design",
      "Home & Kitchen": "functional beauty and modern aesthetics",
      Electronics: "cutting-edge technology and reliable performance",
    };

    let description = `Discover this exceptional ${name.toLowerCase()}`;
    if (brand) description += ` from ${brand}`;
    if (color) description += ` in ${color.toLowerCase()}`;
    description += `. This ${category.toLowerCase()} features ${categoryDescriptions[category] || "outstanding quality and design"}`;
    description +=
      ". Perfect for those who appreciate premium products and distinctive style.";

    return description;
  };

  const generateSmartTags = (
    name: string,
    category: string,
    brand?: string,
  ): string[] => {
    const baseTags = ["premium", "quality", "stylish"];
    const categoryTags: { [key: string]: string[] } = {
      Jewelry: ["luxury", "elegant", "timeless", "precious"],
      Clothing: ["fashion", "trendy", "comfortable", "versatile"],
      Beauty: ["skincare", "cosmetics", "beauty", "luxury"],
      "Shoes & Accessories": ["accessories", "style", "fashion", "designer"],
      "Home & Kitchen": ["home", "decor", "functional", "modern"],
      Electronics: ["tech", "gadget", "innovation", "digital"],
    };

    let tags = [...baseTags];
    if (categoryTags[category]) {
      tags.push(...categoryTags[category]);
    }
    if (brand) tags.push(brand.toLowerCase());

    const nameWords = name.toLowerCase().split(/\s+/);
    nameWords.forEach((word) => {
      if (word.length > 3 && !tags.includes(word)) {
        tags.push(word);
      }
    });

    return tags.slice(0, 8);
  };

  // Advanced AI categorization system with learning capabilities
  const knownItemsDatabase: {
    [key: string]: {
      category: string;
      confidence: number;
      userConfirmed?: boolean;
    };
  } = {
    // Jewelry - High confidence items
    "diamond ring": { category: "Jewelry", confidence: 0.95 },
    "wedding ring": { category: "Jewelry", confidence: 0.95 },
    "engagement ring": { category: "Jewelry", confidence: 0.95 },
    "gold necklace": { category: "Jewelry", confidence: 0.95 },
    "silver bracelet": { category: "Jewelry", confidence: 0.95 },
    "pearl earrings": { category: "Jewelry", confidence: 0.95 },
    "rolex watch": { category: "Jewelry", confidence: 0.95 },
    "omega watch": { category: "Jewelry", confidence: 0.95 },
    "cartier watch": { category: "Jewelry", confidence: 0.95 },
    "tiffany necklace": { category: "Jewelry", confidence: 0.95 },

    // Clothing - High confidence items
    "wedding dress": { category: "Clothing", confidence: 0.95 },
    "evening gown": { category: "Clothing", confidence: 0.95 },
    "cocktail dress": { category: "Clothing", confidence: 0.95 },
    "business suit": { category: "Clothing", confidence: 0.95 },
    "denim jacket": { category: "Clothing", confidence: 0.95 },
    "leather jacket": { category: "Clothing", confidence: 0.95 },
    "silk blouse": { category: "Clothing", confidence: 0.95 },
    "cashmere sweater": { category: "Clothing", confidence: 0.95 },
    "yoga pants": { category: "Clothing", confidence: 0.95 },
    "winter coat": { category: "Clothing", confidence: 0.95 },

    // Beauty - High confidence items
    "chanel perfume": { category: "Beauty", confidence: 0.95 },
    "dior lipstick": { category: "Beauty", confidence: 0.95 },
    "mac foundation": { category: "Beauty", confidence: 0.95 },
    "la mer cream": { category: "Beauty", confidence: 0.95 },
    "sk-ii serum": { category: "Beauty", confidence: 0.95 },
    "tom ford perfume": { category: "Beauty", confidence: 0.95 },
    "charlotte tilbury": { category: "Beauty", confidence: 0.95 },
    "rare beauty": { category: "Beauty", confidence: 0.95 },

    // Shoes & Accessories - High confidence items
    "louis vuitton bag": { category: "Shoes & Accessories", confidence: 0.95 },
    "gucci handbag": { category: "Shoes & Accessories", confidence: 0.95 },
    "prada bag": { category: "Shoes & Accessories", confidence: 0.95 },
    "hermes bag": { category: "Shoes & Accessories", confidence: 0.95 },
    "christian louboutin": {
      category: "Shoes & Accessories",
      confidence: 0.95,
    },
    "jimmy choo": { category: "Shoes & Accessories", confidence: 0.95 },
    "manolo blahnik": { category: "Shoes & Accessories", confidence: 0.95 },
    "nike sneakers": { category: "Shoes & Accessories", confidence: 0.95 },
    "adidas shoes": { category: "Shoes & Accessories", confidence: 0.95 },
    "ray ban sunglasses": { category: "Shoes & Accessories", confidence: 0.95 },

    // Home & Kitchen - High confidence items
    "le creuset": { category: "Home & Kitchen", confidence: 0.95 },
    "kitchenaid mixer": { category: "Home & Kitchen", confidence: 0.95 },
    "dyson vacuum": { category: "Home & Kitchen", confidence: 0.95 },
    "nespresso machine": { category: "Home & Kitchen", confidence: 0.95 },
    "williams sonoma": { category: "Home & Kitchen", confidence: 0.95 },
    "pottery barn": { category: "Home & Kitchen", confidence: 0.95 },

    // Electronics - High confidence items
    iphone: { category: "Electronics", confidence: 0.95 },
    ipad: { category: "Electronics", confidence: 0.95 },
    macbook: { category: "Electronics", confidence: 0.95 },
    "apple watch": { category: "Jewelry", confidence: 0.95 }, // Smart watches are jewelry
    "samsung galaxy": { category: "Electronics", confidence: 0.95 },
    airpods: { category: "Electronics", confidence: 0.95 },
    "beats headphones": { category: "Electronics", confidence: 0.95 },
    "nintendo switch": { category: "Electronics", confidence: 0.95 },
  };

  // Learning system state
  const [userCorrections, setUserCorrections] = useState<{
    [key: string]: string;
  }>({});
  const [aiSuggestions, setAiSuggestions] = useState<{
    [key: string]: { category: string; confidence: number; reason: string };
  }>({});

  const intelligentCategorization = (
    productName: string,
    brand?: string,
    imageData?: { category: string; confidence: number },
  ) => {
    const name = productName.toLowerCase();
    let category = "";
    let confidence = 0;
    let reason = "";

    // 1. Check user corrections first (highest priority)
    if (userCorrections[name]) {
      return {
        category: userCorrections[name],
        confidence: 1.0,
        reason: "User confirmed categorization",
      };
    }

    // 2. Check known items database
    const knownItem = Object.keys(knownItemsDatabase).find(
      (item) => name.includes(item) || item.includes(name.split(" ")[0]),
    );
    if (knownItem) {
      const known = knownItemsDatabase[knownItem];
      return {
        category: known.category,
        confidence: known.confidence,
        reason: `Matched known item: "${knownItem}"`,
      };
    }

    // 3. Brand-based categorization
    if (brand) {
      const brandLower = brand.toLowerCase();
      const brandCategories: { [key: string]: string } = {
        chanel: "Beauty",
        dior: "Beauty",
        mac: "Beauty",
        sephora: "Beauty",
        nike: "Shoes & Accessories",
        adidas: "Shoes & Accessories",
        puma: "Shoes & Accessories",
        "louis vuitton": "Shoes & Accessories",
        gucci: "Shoes & Accessories",
        prada: "Shoes & Accessories",
        rolex: "Jewelry",
        omega: "Jewelry",
        cartier: "Jewelry",
        tiffany: "Jewelry",
        apple: "Electronics",
        samsung: "Electronics",
        sony: "Electronics",
        zara: "Clothing",
        "h&m": "Clothing",
        uniqlo: "Clothing",
      };

      const brandCategory = brandCategories[brandLower];
      if (brandCategory) {
        return {
          category: brandCategory,
          confidence: 0.85,
          reason: `Brand "${brand}" suggests ${brandCategory}`,
        };
      }
    }

    // 4. Advanced pattern matching
    const patterns = [
      {
        pattern:
          /(dress|gown|skirt|blouse|shirt|pants|jeans|jacket|coat|sweater|hoodie)/,
        category: "Clothing",
        confidence: 0.8,
      },
      {
        pattern: /(ring|necklace|earring|bracelet|watch|pendant|chain)/,
        category: "Jewelry",
        confidence: 0.8,
      },
      {
        pattern:
          /(lipstick|foundation|perfume|serum|cream|lotion|mascara|eyeshadow)/,
        category: "Beauty",
        confidence: 0.8,
      },
      {
        pattern:
          /(bag|purse|handbag|wallet|shoes|sneakers|boots|sandals|belt|sunglasses)/,
        category: "Shoes & Accessories",
        confidence: 0.8,
      },
      {
        pattern: /(phone|tablet|laptop|headphones|speaker|camera|computer)/,
        category: "Electronics",
        confidence: 0.8,
      },
      {
        pattern: /(kitchen|home|furniture|decor|candle|vase|pillow|lighting)/,
        category: "Home & Kitchen",
        confidence: 0.8,
      },
    ];

    for (const {
      pattern,
      category: patternCategory,
      confidence: patternConfidence,
    } of patterns) {
      if (pattern.test(name)) {
        category = patternCategory;
        confidence = patternConfidence;
        reason = `Pattern matching: detected ${patternCategory} keywords`;
        break;
      }
    }

    // 5. Use image data if available and no strong match
    if (imageData && confidence < 0.7) {
      return {
        category: imageData.category,
        confidence: imageData.confidence * 0.6,
        reason: `Image recognition suggests ${imageData.category}`,
      };
    }

    // 6. Cross-reference with existing products
    const similarProducts = products.filter(
      (p) => calculateSimilarity(p.name.toLowerCase(), name) > 0.6,
    );

    if (similarProducts.length > 0) {
      const categoryCount: { [key: string]: number } = {};
      similarProducts.forEach((p) => {
        categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
      });

      const mostCommon = Object.keys(categoryCount).reduce((a, b) =>
        categoryCount[a] > categoryCount[b] ? a : b,
      );

      if (confidence < 0.7) {
        return {
          category: mostCommon,
          confidence: 0.7,
          reason: `Similar products suggest ${mostCommon}`,
        };
      }
    }

    return {
      category: category || "Clothing",
      confidence: confidence || 0.3,
      reason: reason || "Default fallback categorization",
    };
  };

  const learnFromUserEdit = (
    originalName: string,
    newCategory: string,
    originalCategory: string,
  ) => {
    if (newCategory !== originalCategory) {
      setUserCorrections((prev) => ({
        ...prev,
        [originalName.toLowerCase()]: newCategory,
      }));

      // Update AI suggestions for similar items
      const similarNames = Object.keys(knownItemsDatabase).filter(
        (item) => calculateSimilarity(item, originalName.toLowerCase()) > 0.7,
      );

      const newSuggestions: {
        [key: string]: { category: string; confidence: number; reason: string };
      } = {};
      similarNames.forEach((name) => {
        newSuggestions[name] = {
          category: newCategory,
          confidence: 0.8,
          reason: `Learned from user edit of "${originalName}"`,
        };
      });

      setAiSuggestions((prev) => ({ ...prev, ...newSuggestions }));
    }
  };

  const detectDuplicates = (newProducts: any[], existingProducts: any[]) => {
    const duplicates = [];
    const allProducts = [...existingProducts, ...products];

    for (const newProduct of newProducts) {
      const similarProducts = allProducts.filter((existing) => {
        // Check name similarity (Levenshtein distance)
        const nameSimilarity = calculateSimilarity(
          newProduct.name.toLowerCase(),
          existing.name.toLowerCase(),
        );

        // Check if same category and similar price
        const categoryMatch = newProduct.category === existing.category;
        const priceMatch =
          Math.abs(parseFloat(newProduct.price) - parseFloat(existing.price)) <
          5;

        // Check brand similarity
        const brandMatch =
          newProduct.brand &&
          existing.brand &&
          newProduct.brand.toLowerCase() === existing.brand.toLowerCase();

        return (
          nameSimilarity > 0.8 || (categoryMatch && priceMatch && brandMatch)
        );
      });

      if (similarProducts.length > 0) {
        duplicates.push({
          newProduct,
          similarProducts,
          confidence: Math.max(
            ...similarProducts.map((p) =>
              calculateSimilarity(
                newProduct.name.toLowerCase(),
                p.name.toLowerCase(),
              ),
            ),
          ),
        });
      }
    }

    return duplicates;
  };

  const handleMultipleFileUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setSelectedFiles(Array.from(files));
      setIsBulkProcessing(true);
      setBulkUploadProgress(0);

      const data = [];
      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );

      for (let i = 0; i < Math.min(imageFiles.length, 1000); i++) {
        const file = imageFiles[i];
        setBulkUploadProgress((i / imageFiles.length) * 50);

        const fileName = file.name;
        const pathData = extractDataFromPath("", fileName);
        const imageData = await recognizeImageContent(file);

        const finalCategory = pathData.category || imageData.category;

        const product = {
          name:
            pathData.productName ||
            fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
          price: pathData.price || getDefaultPrice(finalCategory),
          category: finalCategory,
          description: generateSmartDescription(
            pathData.productName || fileName,
            finalCategory,
            pathData.brand,
            pathData.color,
          ),
          brand: pathData.brand,
          color: pathData.color,
          size: pathData.size,
          condition: pathData.condition,
          images: [URL.createObjectURL(file)],
          tags: generateSmartTags(
            pathData.productName || fileName,
            finalCategory,
            pathData.brand,
          ),
          file: file,
          confidence: imageData.confidence,
        };

        data.push(product);
      }

      // Check for duplicates
      const duplicates = detectDuplicates(data, products);
      if (duplicates.length > 0) {
        setDuplicateProducts(duplicates);
        setShowDuplicates(true);
      }

      setBulkData(data);
      setBulkUploadProgress(100);
      setIsBulkProcessing(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to process files");
      setSelectedFiles([]);
      setBulkData([]);
      setIsBulkProcessing(false);
    }
  };

  const parseBulkFile = async (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        reject(new Error("Please upload a CSV file"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          if (!content || content.trim().length === 0) {
            reject(new Error("CSV file is empty"));
            return;
          }

          const lines = content
            .split("\n")
            .filter((line) => line.trim().length > 0);

          // Handle both header and headerless CSV files
          let startLine = 0;
          let headers: string[] = [];

          if (
            lines[0] &&
            (lines[0].toLowerCase().includes("name") ||
              lines[0].toLowerCase().includes("product"))
          ) {
            // Has headers
            headers = lines[0]
              .split(",")
              .map((h) => h.trim().toLowerCase().replace(/"/g, ""));
            startLine = 1;
          } else {
            // No headers, detect format based on your data structure
            // Your format appears to be: ID, Type, Name, Description, Image, Category, Price, Code, Quantity, Available, Featured, Brand
            headers = [
              "id",
              "type",
              "name",
              "description",
              "images",
              "category",
              "price",
              "code",
              "quantity",
              "available",
              "featured",
              "brand",
            ];
          }

          const requiredHeaders = ["name"];
          const hasRequiredHeaders = requiredHeaders.every((h) =>
            headers.some((header) => header.includes(h)),
          );

          if (!hasRequiredHeaders && startLine === 1) {
            reject(new Error("CSV must have at least a 'name' column"));
            return;
          }

          const data = [];
          for (let i = startLine; i < lines.length && i <= 1000; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Smart CSV parsing that handles quoted values with commas
            const values = [];
            let current = "";
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
              const char = line[j];
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

            const product: any = {};

            // Flexible CSV parsing - works with ANY format
            // First, map all values to headers (or create generic field names)
            const maxFields = Math.max(headers.length, values.length);
            for (let fieldIndex = 0; fieldIndex < maxFields; fieldIndex++) {
              const header = headers[fieldIndex] || `field_${fieldIndex}`;
              const value = values[fieldIndex] || "";
              product[header] = value;
            }

            // Smart field detection - check ALL fields for common patterns
            const allFieldValues = Object.values(product);

            // Find the most likely NAME field (usually contains words, not numbers/UUIDs)
            if (!product.name) {
              const nameField = allFieldValues.find(
                (val) =>
                  typeof val === "string" &&
                  val.length > 3 &&
                  val.length < 200 &&
                  !/^[a-f0-9-]{20,}$/i.test(val) && // Not a UUID
                  !/^\d+(\.\d+)?$/.test(val) && // Not just a number
                  /[a-zA-Z]/.test(val) && // Contains letters
                  val.split(" ").length >= 2, // Multiple words
              );
              product.name =
                nameField ||
                allFieldValues[1] ||
                allFieldValues[0] ||
                "Unknown Product";
            }

            // Find IMAGE/FILENAME fields - check ALL fields for image extensions
            const imageExtensions = [
              ".jpg",
              ".jpeg",
              ".png",
              ".gif",
              ".webp",
              ".bmp",
              ".svg",
            ];
            const imageFields = allFieldValues.filter(
              (val) =>
                typeof val === "string" &&
                imageExtensions.some((ext) => val.toLowerCase().includes(ext)),
            );

            if (!product.images && imageFields.length > 0) {
              product.images = imageFields[0]; // Use first found image
              product.allImageFields = imageFields; // Store all for matching
            }

            // Find PRICE field (contains numbers with decimals, dollar signs, or price keywords)
            if (!product.price) {
              const priceField = allFieldValues.find(
                (val) =>
                  typeof val === "string" &&
                  (/^\$?\d+(\.\d{2})?$/.test(val) || // $25.99 or 25.99
                    (/^[0-9.]+$/.test(val) &&
                      parseFloat(val) > 0 &&
                      parseFloat(val) < 10000)), // reasonable price range
              );
              product.price = priceField || "29.99";
            }

            // Find CATEGORY field (common fashion/product categories)
            if (!product.category) {
              const categoryKeywords = [
                "clothing",
                "jewelry",
                "beauty",
                "activewear",
                "shoes",
                "accessories",
                "home",
                "kitchen",
                "electronics",
              ];
              const categoryField = allFieldValues.find(
                (val) =>
                  typeof val === "string" &&
                  categoryKeywords.some((keyword) =>
                    val.toLowerCase().includes(keyword.toLowerCase()),
                  ),
              );
              product.category = categoryField || "Clothing";
            }

            // Find ID field (UUIDs, SKUs, or unique identifiers)
            if (!product.id) {
              const idField = allFieldValues.find(
                (val) =>
                  typeof val === "string" &&
                  (val.match(
                    /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i,
                  ) || // UUID
                    val.match(/^[A-Z]{2,5}-\d{3,6}$/i) || // SKU pattern like LFC-0005
                    (val.length > 10 &&
                      val.length < 50 &&
                      /^[a-f0-9-]+$/i.test(val))), // Other unique patterns
              );
              product.id =
                idField ||
                `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }

            // Debug output for first few items
            if (data.length < 3) {
              console.log(
                `📄 Flexible CSV parsing for item ${data.length + 1}:`,
                {
                  detectedName: product.name,
                  detectedImages: product.images,
                  allImageFields: product.allImageFields,
                  detectedPrice: product.price,
                  detectedCategory: product.category,
                  detectedId: product.id,
                  allFields: Object.keys(product).length,
                },
              );
            }

            // Extract additional data from file path if available
            if (product.path || product.filepath || product.file_path) {
              const pathData = extractDataFromPath(
                product.path || product.filepath || product.file_path,
              );
              if (!product.category && pathData.category)
                product.category = pathData.category;
              if (!product.price && pathData.price)
                product.price = pathData.price;
              if (!product.condition && pathData.condition !== "new")
                product.condition = pathData.condition;
            }

            // Smart defaults and data enhancement
            if (!product.price && product.name) {
              // Try to extract price from product name
              const priceMatch = product.name.match(/\$?(\d+)(?:\.(\d{2}))?/);
              if (priceMatch) {
                const dollars = priceMatch[1];
                const cents = priceMatch[2] || "00";
                product.price = `${dollars}.${cents}`;
              } else {
                // Set default price based on category
                const defaultPrices: { [key: string]: string } = {
                  Jewelry: "49.99",
                  Clothing: "29.99",
                  Beauty: "19.99",
                  "Shoes & Accessories": "39.99",
                  "Home & Kitchen": "24.99",
                  Electronics: "99.99",
                };
                product.price = defaultPrices[product.category] || "29.99";
              }
            }

            // Auto-generate description if missing
            if (!product.description && product.name) {
              product.description = `Premium ${product.category?.toLowerCase() || "product"} - ${product.name}. ${product.brand ? `From ${product.brand}. ` : ""}${product.material ? `Made with ${product.material}. ` : ""}Perfect for those who appreciate quality and style.`;
            }

            // Auto-categorize based on name if no category
            if (!product.category && product.name) {
              const name = product.name.toLowerCase();
              if (
                name.includes("ring") ||
                name.includes("necklace") ||
                name.includes("earring") ||
                name.includes("jewelry")
              ) {
                product.category = "Jewelry";
              } else if (
                name.includes("dress") ||
                name.includes("shirt") ||
                name.includes("pants") ||
                name.includes("jacket")
              ) {
                product.category = "Clothing";
              } else if (
                name.includes("lipstick") ||
                name.includes("foundation") ||
                name.includes("perfume") ||
                name.includes("skincare")
              ) {
                product.category = "Beauty";
              } else if (
                name.includes("bag") ||
                name.includes("shoe") ||
                name.includes("watch") ||
                name.includes("sunglasses")
              ) {
                product.category = "Shoes & Accessories";
              } else if (
                name.includes("kitchen") ||
                name.includes("home") ||
                name.includes("decor") ||
                name.includes("furniture")
              ) {
                product.category = "Home & Kitchen";
              } else {
                product.category = "Clothing"; // Default fallback
              }
            }

            // Validate essential fields
            if (product.name && (product.price || product.category)) {
              data.push(product);
            }
          }

          if (data.length === 0) {
            reject(
              new Error(
                "No valid products found in CSV. Please check the format.",
              ),
            );
            return;
          }

          console.log(`\n📊 CSV PARSING COMPLETE:`);
          console.log(`   Total lines in file: ${lines.length}`);
          console.log(
            `   Header detection: ${startLine === 1 ? "Headers found" : "No headers, using defaults"}`,
          );
          console.log(`   Products parsed: ${data.length}`);
          console.log(`   Headers used: ${headers.join(", ")}`);

          // Show details of first few parsed products
          data.slice(0, 3).forEach((product, index) => {
            console.log(`\n   Product ${index + 1}:`);
            console.log(`     Name: ${product.name}`);
            console.log(`     Images: ${product.images || "None"}`);
            console.log(`     Category: ${product.category || "None"}`);
            console.log(`     Price: ${product.price || "None"}`);
          });

          resolve(data);
        } catch (error) {
          reject(new Error("Invalid CSV format. Please check your file."));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const processBulkUpload = async () => {
    if (!bulkData.length) return;

    setIsBulkProcessing(true);
    setBulkUploadProgress(0);

    const newProducts: Product[] = [];

    // Check if this is folder upload data or CSV data
    const isFolder = bulkData[0]?.file instanceof File;

    for (let i = 0; i < bulkData.length; i++) {
      const item = bulkData[i];

      // Simulate processing delay for AI enhancement
      await new Promise((resolve) => setTimeout(resolve, isFolder ? 200 : 50));

      let newProduct: Product;

      if (isFolder) {
        // Enhanced processing for folder uploads with AI
        const enhancedDescription = await generateAIDescription(item);
        const aiTags = await generateAITags(item);

        newProduct = {
          id: `folder-${Date.now()}-${i}`,
          name: item.name,
          price: parseFloat(item.price) || 29.99,
          originalPrice: "",
          description: enhancedDescription,
          category: item.category,
          images: item.images || [],
          tags: aiTags,
          rating: 5,
          condition: (item.condition as any) || "new",
          brand: item.brand || "",
          size: item.size || "",
          color: item.color || "",
          material: "",
          placement: "regular" as any,
          customSection: "",
          template: "modern",
          dateAdded: new Date().toISOString(),
          status: "active",
          seller: user?.name || "Current User",
          views: 0,
          likes: 0,
          aiGenerated: true,
          confidence: item.confidence || 0.8,
        };

        // Add to user's products via auth system
        try {
          await addProduct(newProduct);
        } catch (error) {
          console.warn("Failed to save to auth system:", error);
        }
      } else {
        // Standard CSV processing
        newProduct = {
          id: `bulk-${Date.now()}-${i}`,
          name: item.name,
          price: parseFloat(item.price) || 29.99,
          originalPrice: item.originalprice || item.original_price || "",
          description: item.description,
          category: item.category,
          images: item.images
            ? item.images.split("|").filter(Boolean)
            : [
                `https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=400&h=400&fit=crop`,
              ],
          tags: item.tags
            ? item.tags.split("|").map((tag: string) => tag.trim())
            : getSuggestedTags(item.name, item.category, item.brand),
          rating: 5,
          condition: (item.condition as any) || "new",
          brand: item.brand || "",
          size: item.size || "",
          color: item.color || "",
          material: item.material || "",
          placement: (item.placement as any) || "regular",
          customSection: item.customsection || item.custom_section || "",
          template: item.template || "modern",
          dateAdded: new Date().toISOString(),
          status: "draft",
          seller: user?.name || "Current User",
          views: 0,
          likes: 0,
        };
      }

      newProducts.push(newProduct);
      setBulkUploadProgress(((i + 1) / bulkData.length) * 100);
    }

    setProducts((prev) => [...newProducts, ...prev]);

    // Add products to user collections based on category
    if (user?.id && newProducts.length > 0) {
      await addProductsToUserCollections(
        newProducts.filter((p) => p.status !== "draft"),
      );
    }

    setSubmitSuccess(true);
    setIsBulkProcessing(false);
    setBulkData([]);
    setBulkFile(null);
    setBulkFiles(null);

    setTimeout(() => {
      setSubmitSuccess(false);
      setUploadMode("single");
    }, 3000);
  };

  const handleBulkFileUpload = async (file: File) => {
    if (!file) return;

    setIsBulkProcessing(true);
    setBulkUploadProgress(0);

    try {
      setBulkFile(file);

      console.log(`\n🚀 STARTING CSV PROCESSING:`);
      console.log(`   File name: ${file.name}`);
      console.log(`   File size: ${file.size} bytes`);
      console.log(`   Upload type: ${uploadType}`);
      console.log(
        `   Has bulk files: ${bulkFiles ? "Yes (" + bulkFiles.length + " files)" : "No"}`,
      );

      const data = await parseBulkFile(file);

      console.log(`\n🔧 STARTING ENHANCEMENT PROCESSING:`);
      console.log(`   Input data length: ${data.length}`);
      console.log(`   First item name: ${data[0]?.name || "No items"}`);

      // Apply expectancy map image mapping
      const enhancedData = data.map((item, index) => {
        setBulkUploadProgress((index / data.length) * 80); // 80% for processing

        // Debug every item being processed
        if (index < 5) {
          // Show first 5 items being processed
          console.log(
            `\n   Processing item ${index + 1}/${data.length}: ${item.name}`,
          );
        }

        // Normalize and match category
        let category = item.category || "Accessories";

        // Handle special category mappings
        const categoryMappings = {
          "shoes-accessories": "shoes-accessories",
          shoe: "Shoes",
          shoes: "Shoes",
          footwear: "Shoes",
          jewelry: "Jewelry",
          clothing: "Clothing",
          beauty: "Beauty",
          accessories: "Accessories",
          home: "Home",
          kitchen: "Home",
        };

        const normalizedCategory = category
          .toLowerCase()
          .replace(/[^a-z]/g, "-");
        if (categoryMappings[normalizedCategory]) {
          category = categoryMappings[normalizedCategory];
        }

        const expectancyInfo = expectancyMap?.[category];

        // Generate mapped image if no image provided from CSV
        let mappedImage = null;
        let mappingKey = null;
        let mappingConfidence = 70;

        // Check if CSV provided images (URLs or filenames)
        const csvImageValue = item.images || item.allImageFields?.[0] || "";
        const hasValidImages = csvImageValue && csvImageValue.length > 0;

        // Handle different image formats from CSV
        let processedImages = [];
        if (hasValidImages) {
          if (typeof csvImageValue === "string") {
            // Check if it's a URL
            if (csvImageValue.startsWith("http")) {
              processedImages = [csvImageValue];
            } else {
              // It's a filename - create a placeholder that can be matched later
              processedImages = [
                {
                  filename: csvImageValue,
                  type: "filename",
                  placeholder: `https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=400&h=400&fit=crop&text=${encodeURIComponent(csvImageValue)}`,
                },
              ];
            }
          }
        }

        // Handle image mapping and filename resolution
        if (
          hasValidImages &&
          processedImages.length > 0 &&
          processedImages[0].type === "filename"
        ) {
          // CSV contains filenames - use them as placeholders for now
          mappedImage = processedImages[0].placeholder;
          mappingConfidence = 60;

          console.log(
            `📁 CSV filename detected: ${processedImages[0].filename} for product: ${item.name}`,
          );
        } else if (!hasValidImages && expectancyInfo?.imageMapping) {
          const productName = item.name.toLowerCase();
          mappingKey = Object.keys(expectancyInfo.imageMapping).find((key) =>
            productName.includes(key),
          );

          if (mappingKey) {
            // Use real image URL from mapping
            mappedImage = expectancyInfo.imageMapping[mappingKey];
            mappingConfidence = 95;
          } else {
            // Use default category images with real URLs
            const defaultImages = {
              Jewelry:
                "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              Clothing:
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              Beauty:
                "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              Accessories:
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              Shoes:
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              "shoes-accessories":
                "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
              Home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&w=400&h=400&fit=crop",
            };
            mappedImage =
              defaultImages[category] ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&w=400&h=400&fit=crop";
            mappingConfidence = 70;
          }
        }

        // Fallback to emoji SVG if image URL fails to load (handled by browser)
        if (!mappedImage) {
          const defaultEmojis = {
            Jewelry: "💎",
            Clothing: "👗",
            Beauty: "💄",
            Accessories: "👜",
            Shoes: "👠",
            "shoes-accessories": "👠",
            Home: "🏠",
          };
          const defaultEmoji = defaultEmojis[category] || "📦";
          mappedImage = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f3f4f6"/><text x="200" y="200" font-size="100" text-anchor="middle" dy=".3em">${defaultEmoji}</text><text x="200" y="320" font-size="16" text-anchor="middle" fill="%23374151">${category}</text></svg>`;
          mappingConfidence = 50;
        }

        // Apply expectancy-based enhancements
        let finalImages = [];
        if (hasValidImages && processedImages.length > 0) {
          if (processedImages[0].type === "filename") {
            // Store filename info for later matching
            finalImages = [processedImages[0].placeholder];
          } else {
            // It's a URL
            finalImages =
              typeof item.images === "string" ? [item.images] : item.images;
          }
        } else if (mappedImage) {
          finalImages = [mappedImage];
        } else {
          finalImages = item.images || [];
        }

        return {
          ...item,
          images: finalImages,
          originalFilename:
            processedImages.length > 0 && processedImages[0].type === "filename"
              ? processedImages[0].filename
              : null,
          category: category,
          expectancyMapped: !!expectancyInfo,
          suggestedPrice:
            expectancyInfo?.avgPrice || parseFloat(item.price) || 25,
          mappingConfidence: mappingConfidence,
          enhancedDescription:
            item.description ||
            `${item.name} - Premium ${category.toLowerCase()} item with quality and style.`,
          expectancyCategory: expectancyInfo ? category : "Unmapped",
        };
      });

      setBulkUploadProgress(100);

      console.log(`\n✅ ENHANCEMENT COMPLETE:`);
      console.log(`   Enhanced data length: ${enhancedData.length}`);
      console.log(`   Original data length: ${data.length}`);

      // Verify we didn't lose or duplicate items
      if (enhancedData.length !== data.length) {
        console.error(
          `❌ MISMATCH: Enhanced data has ${enhancedData.length} items but original had ${data.length}`,
        );
      }

      setBulkData(enhancedData);

      // Update expectancy map current counts
      if (expectancyMap) {
        const updatedMap = { ...expectancyMap };
        enhancedData.forEach((item) => {
          if (updatedMap[item.category]) {
            updatedMap[item.category].currentItems += 1;
          }
        });
        setExpectancyMap(updatedMap);
      }

      console.log(
        `✅ CSV processed: ${enhancedData.length} items with expectancy mapping`,
      );

      // Show success message with details
      if (enhancedData.length > 0) {
        const mappedCount = enhancedData.filter(
          (item) => item.expectancyMapped,
        ).length;
        console.log(
          `Mapping results: ${mappedCount}/${enhancedData.length} items mapped to expectancy categories`,
        );

        const filenameCount = enhancedData.filter(
          (item) => item.originalFilename,
        ).length;

        console.log(
          `Filename processing: ${filenameCount}/${enhancedData.length} items have filenames that need image matching`,
        );

        // Show detailed breakdown for first few items
        enhancedData.slice(0, 3).forEach((item, index) => {
          console.log(`\nItem ${index + 1}: ${item.name}`);
          console.log(`   Original images field: ${item.images}`);
          console.log(
            `   Filename detected: ${item.originalFilename || "None"}`,
          );
          console.log(`   Category: ${item.category}`);
          console.log(
            `   Final images: ${Array.isArray(item.images) ? item.images.join(", ") : item.images}`,
          );
        });

        // Alert user if filenames detected
        const filenameItems = enhancedData.filter(
          (item) => item.originalFilename,
        );
        if (filenameItems.length > 0) {
          console.log(`\nFILENAME NOTICE:`);
          console.log(
            `${filenameItems.length} products have image filenames instead of URLs.`,
          );
          console.log(
            `You may need to manually match these with uploaded images, or use the CSV Image Matcher at /admin/csv-matcher`,
          );

          filenameItems.forEach((item, index) => {
            if (index < 5) {
              // Show first 5
              console.log(`   "${item.name}" -> "${item.originalFilename}"`);
            }
          });
          if (filenameItems.length > 5) {
            console.log(`   ... and ${filenameItems.length - 5} more`);
          }
        }
      }
    } catch (error) {
      console.error("CSV processing error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to parse file";
      alert(
        `CSV Import Error: ${errorMessage}\n\nPlease ensure your CSV has:\n• A 'name' column (required)\n• Proper comma separation\n• Valid UTF-8 encoding\n\nIf you have image filename issues, use the CSV Filename Processor at /admin/csv-filename`,
      );
      setBulkFile(null);
      setBulkData([]);
    } finally {
      setIsBulkProcessing(false);
    }
  };

  const handleFolderUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (imageFiles.length === 0) {
      alert(
        "No image files found in the selected folder. Please select a folder containing image files.",
      );
      return;
    }

    console.log(
      `🚀 Starting AI-enhanced folder upload with ${imageFiles.length} images...`,
    );

    try {
      setBulkFiles(files);
      setSelectedFiles([]); // Clear any previous single file selection
      setIsBulkProcessing(true);
      setBulkUploadProgress(0);

      // Show immediate feedback
      const startNotification = document.createElement("div");
      startNotification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #8B5CF6; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; max-width: 400px;">
          <div style="font-weight: bold; margin-bottom: 8px;">🤖 AI Processing Started!</div>
          <div style="font-size: 14px; opacity: 0.9;">Processing ${imageFiles.length} images with AI enhancement...</div>
        </div>
      `;
      document.body.appendChild(startNotification);
      setTimeout(() => startNotification.remove(), 4000);

      const data = await processFolderUpload(files);

      // Check for duplicates with enhanced detection
      const duplicates = detectDuplicates(data, products);
      if (duplicates.length > 0) {
        setDuplicateProducts(duplicates);
        setShowDuplicates(true);
      }

      setBulkData(data);
      setIsBulkProcessing(false);
      setBulkUploadProgress(100);

      console.log(
        `✅ Folder upload complete: ${data.length} products processed and ready!`,
      );
    } catch (error) {
      console.error("❌ Folder upload failed:", error);
      alert(
        error instanceof Error ? error.message : "Failed to process folder",
      );
      setBulkFiles(null);
      setBulkData([]);
      setIsBulkProcessing(false);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    try {
      setBulkFiles(files);
      setIsBulkProcessing(true);
      setBulkUploadProgress(0);

      const imageFiles = Array.from(files).filter((file) =>
        file.type.startsWith("image/"),
      );
      const data = [];

      for (let i = 0; i < Math.min(imageFiles.length, 1000); i++) {
        const file = imageFiles[i];
        setBulkUploadProgress((i / imageFiles.length) * 50); // First 50% for analysis

        const fileName = file.name;
        const pathData = extractDataFromPath("", fileName);
        const imageData = await recognizeImageContent(file);

        const finalCategory = pathData.category || imageData.category;

        const product = {
          name:
            pathData.productName ||
            fileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "),
          price: pathData.price || getDefaultPrice(finalCategory),
          category: finalCategory,
          description: generateSmartDescription(
            pathData.productName || fileName,
            finalCategory,
            pathData.brand,
            pathData.color,
          ),
          brand: pathData.brand,
          color: pathData.color,
          size: pathData.size,
          condition: pathData.condition,
          images: [URL.createObjectURL(file)],
          tags: generateSmartTags(
            pathData.productName || fileName,
            finalCategory,
            pathData.brand,
          ),
          file: file,
          confidence: imageData.confidence,
        };

        data.push(product);
      }

      setBulkData(data);
      setBulkUploadProgress(100);
      setIsBulkProcessing(false);
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to process images",
      );
      setBulkFiles(null);
      setBulkData([]);
      setIsBulkProcessing(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | string[],
  ) => {
    if (multiProductMode) {
      updateCurrentProduct(field, value);

      // Auto-generate description if enabled for multi-product mode
      if (
        autoDescription &&
        (field === "name" || field === "category" || field === "brand")
      ) {
        const currentProduct = multiProductData[currentProductIndex];
        if (currentProduct) {
          const updatedDescription = generateDescription(
            field === "name" ? (value as string) : currentProduct.name,
            field === "category" ? (value as string) : currentProduct.category,
            field === "brand" ? (value as string) : currentProduct.brand,
            currentProduct.material,
            currentProduct.color,
          );
          updateCurrentProduct("description", updatedDescription);
        }
      }
    } else {
      setFormData((prev) => {
        const updated = { ...prev, [field]: value };

        // Auto-generate description if enabled
        if (
          autoDescription &&
          (field === "name" || field === "category" || field === "brand") &&
          updated.name &&
          updated.category
        ) {
          updated.description = generateDescription(
            updated.name,
            updated.category,
            updated.brand,
            updated.material,
            updated.color,
          );
        }

        return updated;
      });
    }
  };

  // Enhanced file upload with validation and multi-product support
  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(
        (file) =>
          file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024,
      );

      // Check if this should trigger multi-product mode (2-10 files)
      if (validFiles.length >= 2 && validFiles.length <= 10) {
        setMultiProductMode(true);
        const productPromises = validFiles.map((file, index) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const imageUrl = e.target?.result as string;
              const extractedData = extractDataFromPath(file.name);

              resolve({
                id: `product-${Date.now()}-${index}`,
                name: extractedData.name || `Product ${index + 1}`,
                images: [imageUrl],
                category: categorizeWithAI(
                  extractedData.name || file.name,
                  imageUrl,
                  extractedData.brand,
                ),
                brand: extractedData.brand,
                condition: extractedData.condition,
                price: extractedData.price || "",
                originalPrice: "",
                discountPercentage: "",
                description: autoDescription
                  ? generateDescription(
                      extractedData.name || file.name,
                      extractedData.brand,
                    )
                  : "",
                tags: "",
                size: extractedData.size,
                color: extractedData.color,
                material: "",
                placement: "regular" as const,
                customSection: "",
                template: "modern",
              });
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(productPromises).then((products) => {
          setMultiProductData(products);
          setCurrentProductIndex(0);
        });
      } else if (validFiles.length === 1) {
        // Single product mode
        setMultiProductMode(false);
        const file = validFiles[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          const extractedData = extractDataFromPath(file.name);

          setFormData((prev) => ({
            ...prev,
            images: [imageUrl],
            name: extractedData.name || prev.name,
            category:
              prev.category ||
              categorizeWithAI(
                extractedData.name || file.name,
                imageUrl,
                extractedData.brand,
              ),
            brand: extractedData.brand || prev.brand,
            condition: extractedData.condition || prev.condition,
            price: extractedData.price || prev.price,
            size: extractedData.size || prev.size,
            color: extractedData.color || prev.color,
            description:
              autoDescription && !prev.description
                ? generateDescription(
                    extractedData.name || file.name,
                    extractedData.brand,
                  )
                : prev.description,
          }));
        };
        reader.readAsDataURL(file);
      } else if (validFiles.length > 10) {
        alert(
          "Maximum 10 products can be uploaded at once. Please select 1-10 images.",
        );
      }
    },
    [autoDescription],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const removeImage = (index: number) => {
    if (multiProductMode) {
      const updatedData = [...multiProductData];
      updatedData[currentProductIndex].images = updatedData[
        currentProductIndex
      ].images.filter((_, i) => i !== index);
      setMultiProductData(updatedData);
    } else {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };

  const navigateToProduct = (index: number) => {
    if (multiProductMode && index >= 0 && index < multiProductData.length) {
      setCurrentProductIndex(index);
    }
  };

  const updateCurrentProduct = (field: string, value: any) => {
    if (multiProductMode) {
      const updatedData = [...multiProductData];
      updatedData[currentProductIndex] = {
        ...updatedData[currentProductIndex],
        [field]: value,
      };
      setMultiProductData(updatedData);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getCurrentProductData = () => {
    if (multiProductMode && multiProductData[currentProductIndex]) {
      return multiProductData[currentProductIndex];
    }
    return formData;
  };

  const startUploadProcess = () => {
    setShowPreview(true);
  };

  const proceedWithUpload = async () => {
    setIsSubmitting(true);
    setReadyToUpload(true);

    try {
      if (multiProductMode) {
        // Upload all products in multi-product mode
        for (let i = 0; i < multiProductData.length; i++) {
          const product = multiProductData[i];
          // Simulate upload process
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newProduct: Product = {
            id: `product-${Date.now()}-${i}`,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            description: product.description,
            category: product.category,
            images: product.images,
            tags: product.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter(Boolean),
            rating: 0,
            condition: product.condition,
            brand: product.brand,
            size: product.size,
            color: product.color,
            material: product.material,
            placement: product.placement,
            customSection: product.customSection,
            template: product.template,
            dateAdded: new Date().toISOString(),
            status: "published",
            seller: "Current User",
            views: 0,
            likes: 0,
          };

          setProducts((prev) => [...prev, newProduct]);
        }
      } else {
        // Single product upload
        const newProduct: Product = {
          id: `product-${Date.now()}`,
          name: formData.name,
          price: formData.price,
          originalPrice: formData.originalPrice,
          description: formData.description,
          category: formData.category,
          images: formData.images,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          rating: 0,
          condition: formData.condition,
          brand: formData.brand,
          size: formData.size,
          color: formData.color,
          material: formData.material,
          placement: formData.placement,
          customSection: formData.customSection,
          template: formData.template,
          dateAdded: new Date().toISOString(),
          status: "published",
          seller: "Current User",
          views: 0,
          likes: 0,
        };

        setProducts((prev) => [...prev, newProduct]);
      }

      setSubmitSuccess(true);

      // Reset form
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        discountPercentage: "",
        description: "",
        category: "",
        images: [],
        tags: "",
        brand: "",
        size: "",
        color: "",
        material: "",
        condition: "new",
        placement: "regular",
        customSection: "",
        template: "modern",
      });
      setMultiProductData([]);
      setMultiProductMode(false);
      setCurrentProductIndex(0);
      setShowPreview(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setReadyToUpload(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.category && formData.description;
      case 2:
        return formData.price && formData.images.length > 0;
      case 3:
        return formData.placement;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = Math.min(currentStep + 1, 3);
      setCurrentStep(nextStep);

      // Auto-trigger file selection when entering Step 2 (Images & Design)
      if (nextStep === 2 && formData.images.length === 0) {
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 500);
      }
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Mock offer data
  const mockOffers = [
    {
      id: "1",
      buyerName: "Sarah Johnson",
      buyerType: "member",
      offerAmount: 450,
      originalPrice: 599,
      productName: "Vintage Diamond Ring",
      message: "Beautiful piece! Would you consider this offer?",
      timestamp: "2 hours ago",
      status: "pending",
    },
    {
      id: "2",
      buyerName: "Mike Chen",
      buyerType: "regular",
      offerAmount: 85,
      originalPrice: 100,
      productName: "Designer Scarf",
      message: "I love this scarf, this is my best offer.",
      timestamp: "5 hours ago",
      status: "pending",
    },
  ];

  const handleOfferAction = (
    offerId: string,
    action: "accept" | "decline" | "counter",
  ) => {
    const offer = mockOffers.find((o) => o.id === offerId);
    if (offer && action === "accept") {
      const commission = offer.offerAmount * 0.1;
      const sellerEarnings = offer.offerAmount * 0.9;
      setUserBalance((prev) => prev + sellerEarnings);
      alert(
        `Offer accepted! You'll receive $${sellerEarnings.toFixed(2)} (90% of $${offer.offerAmount})`,
      );
    }
  };

  const handleSendOffers = () => {
    setShowOffers(true);
  };

  const handleViewUserProfiles = () => {
    setShowUserProfiles(true);
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!isSignedIn || !currentUser) {
      alert("Please sign in to upload products");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create product data
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      description: formData.description,
      category: formData.category,
      images: formData.images,
      status: status as "active" | "sold" | "inactive",
      tags: formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean)
        : getSuggestedTags(formData.name, formData.category, formData.brand),
    };

    // Save product using the user auth system
    const result = addProduct(productData);

    if (result.success) {
      // Show success notification
      const successDiv = document.createElement("div");
      successDiv.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background: #10B981; color: white; padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; max-width: 400px;">
          <div style="font-weight: bold; margin-bottom: 8px;">�� Product Uploaded Successfully!</div>
          <div style="font-size: 14px; opacity: 0.9;">${formData.name}</div>
          <div style="font-size: 12px; margin-top: 8px;">Your product is now live and available for purchase!</div>
        </div>
      `;
      document.body.appendChild(successDiv.firstElementChild as Element);

      setTimeout(() => {
        const notification = document.body.lastElementChild;
        if (
          notification &&
          notification.textContent?.includes("Product Uploaded Successfully")
        ) {
          document.body.removeChild(notification);
        }
      }, 5000);

      // Reset form after success
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        discountPercentage: "",
        description: "",
        category: "",
        images: [],
        tags: "",
        brand: "",
        size: "",
        color: "",
        material: "",
        condition: "new",
        placement: "regular",
        customSection: "",
        template: "",
      });

      setSubmitSuccess(true);
    } else {
      alert("Failed to upload product. Please try again.");
    }

    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setFormData({
        name: "",
        price: "",
        originalPrice: "",
        discountPercentage: "",
        description: "",
        category: "",
        images: [],
        tags: "",
        brand: "",
        size: "",
        color: "",
        material: "",
        condition: "new",
        placement: "regular",
        customSection: "",
        template: "modern",
      });
      setCurrentStep(1);
      setSubmitSuccess(false);
    }, 3000);
  };

  const duplicateProduct = (product: Product) => {
    const duplicated = {
      ...product,
      id: Date.now().toString(),
      name: `${product.name} (Copy)`,
      status: "draft" as const,
      dateAdded: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status: product.status === "published" ? "draft" : "published",
            }
          : product,
      ),
    );
  };

  // PRODUCTION MODE: Real product uploads only - CSV import removed

  const getExpectancyStats = () => {
    if (!expectancyMap) return null;

    const collections = Object.keys(expectancyMap);
    const totalExpected = collections.reduce(
      (sum, col) => sum + expectancyMap[col].expectedItems,
      0,
    );
    const totalCurrent = collections.reduce(
      (sum, col) => sum + expectancyMap[col].currentItems,
      0,
    );
    const fulfillmentRate = ((totalCurrent / totalExpected) * 100).toFixed(1);

    return {
      totalExpected,
      totalCurrent,
      fulfillmentRate,
      collections: collections.map((col) => ({
        name: col,
        expected: expectancyMap[col].expectedItems,
        current: expectancyMap[col].currentItems,
        rate: (
          (expectancyMap[col].currentItems / expectancyMap[col].expectedItems) *
          100
        ).toFixed(1),
      })),
    };
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="fixed inset-0 opacity-3 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-white/80 backdrop-blur-xl fixed top-0 left-0 right-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 sm:space-x-12">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg">
                    L
                  </span>
                </div>
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">
                  LILLY'S
                </h1>
              </Link>

              <div className="hidden lg:flex items-center space-x-8">
                <Link
                  to="/collections"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Collections
                </Link>
                <Link
                  to="/sell-products"
                  className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Sell Products
                </Link>
                <span className="text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📦 Product Upload
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link to="/mobile-app">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-purple-100 flex items-center space-x-1 sm:space-x-2"
                  title="Mobile App"
                >
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  <span className="hidden sm:inline text-purple-600 font-medium">
                    App
                  </span>
                </Button>
              </Link>

              <Button
                onClick={() =>
                  window.open(
                    "https://lillys-fashion-couture.myshopify.com",
                    "_blank",
                  )
                }
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-2 sm:px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
              >
                🛒 <span className="hidden sm:inline">Shopify</span>
              </Button>

              <Button
                onClick={handleSendOffers}
                className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-2 sm:px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                title="Manage Offers & Balance"
              >
                💰 <span className="hidden sm:inline">Offers</span>
              </Button>

              <Button
                onClick={handleViewUserProfiles}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-2 sm:px-4 py-2 rounded-lg font-semibold shadow-lg text-sm"
                title="View User Profiles"
              >
                👥 <span className="hidden sm:inline">Users</span>
              </Button>

              <div className="hidden lg:flex items-center bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm font-semibold text-green-700">
                  ${userBalance.toFixed(2)}
                </span>
              </div>

              <div className="hidden sm:block">
                <ShoppingCart
                  cartItems={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                  onCheckout={handleCheckout}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="pt-24 sm:pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center mb-6 sm:mb-8">
            <Link to="/sell-products">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 w-4 h-4" />
                <span className="hidden sm:inline">Back to Seller Hub</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 border border-green-200 rounded-xl text-center">
              <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-2xl font-bold text-green-700 mb-2">
                {uploadMode === "bulk"
                  ? bulkFiles
                    ? "🤖 AI-Enhanced Folder Upload Complete!"
                    : "Products Uploaded Successfully!"
                  : "Product Created Successfully!"}
              </h3>
              <p className="text-green-600 text-sm sm:text-base">
                {uploadMode === "bulk"
                  ? bulkFiles
                    ? `🎉 ${products.length} products processed with AI descriptions, tags, and smart categorization! All products are now live in your store.`
                    : `${products.length} products have been processed and are ready for review.`
                  : "Your product has been added and is ready for review."}
              </p>
              {bulkFiles && uploadMode === "bulk" && (
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="font-semibold text-green-800">
                      ✨ AI Features Used
                    </div>
                    <div className="text-green-700">
                      Auto descriptions, Smart tags, Category detection
                    </div>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <div className="font-semibold text-green-800">
                      📊 Processing Stats
                    </div>
                    <div className="text-green-700">
                      100% processed, Ready for sale
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CSV Import & Expectancy Map */}
          <div className="mb-6 sm:mb-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSV Import Section */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <Upload className="w-5 h-5 mr-2" />
                  CSV Product Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Import all {importStats?.totalProducts || 322} products from
                  the master CSV database with template images.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {importStats?.collections?.length || 7}
                    </div>
                    <div className="text-sm text-gray-600">Collections</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {importStats?.brands?.length || 1}
                    </div>
                    <div className="text-sm text-gray-600">Brands</div>
                  </div>
                </div>
                {/* CSV Import removed in production mode */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Production mode - manual product upload only
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Expectancy Map Section */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-600">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Inventory Expectancy Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getExpectancyStats() && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {getExpectancyStats().fulfillmentRate}%
                        </div>
                        <div className="text-sm text-gray-600">Fulfillment</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {getExpectancyStats().totalCurrent}/
                          {getExpectancyStats().totalExpected}
                        </div>
                        <div className="text-sm text-gray-600">Items</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {getExpectancyStats()
                        .collections.slice(0, 3)
                        .map((col, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center"
                          >
                            <span className="text-sm font-medium">
                              {col.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {col.rate}% ({col.current}/{col.expected})
                            </Badge>
                          </div>
                        ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowCSVImport(true)}
                      className="w-full border-purple-200 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Map
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Upload Mode Toggle */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg border">
              <div className="flex items-center space-x-2">
                <Button
                  variant={uploadMode === "single" ? "default" : "ghost"}
                  size={window.innerWidth < 640 ? "sm" : "lg"}
                  onClick={() => setUploadMode("single")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base ${
                    uploadMode === "single"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Single Product</span>
                  <span className="sm:hidden">Single</span>
                </Button>
                <Button
                  variant={uploadMode === "bulk" ? "default" : "ghost"}
                  size={window.innerWidth < 640 ? "sm" : "lg"}
                  onClick={() => setUploadMode("bulk")}
                  className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold text-sm sm:text-base ${
                    uploadMode === "bulk"
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Bulk Upload (CSV)</span>
                  <span className="sm:hidden">Bulk</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Steps - Only for Single Product Mode */}
          {uploadMode === "single" && (
            <div className="mb-8 sm:mb-12">
              <div className="flex justify-center items-center space-x-2 sm:space-x-8 overflow-x-auto pb-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex items-center space-x-2 sm:space-x-3 min-w-fit ${
                      currentStep >= step.number
                        ? "text-purple-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${
                        currentStep >= step.number
                          ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
                      ) : (
                        <step.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      )}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium">
                        Step {step.number}
                      </div>
                      <div className="text-lg font-bold">{step.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Form */}
            <div className="xl:col-span-2">
              <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-3xl text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
                    <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-purple-600" />
                    {uploadMode === "bulk" ? (
                      "Bulk Product Upload"
                    ) : (
                      <>
                        {currentStep === 1 && "Product Details"}
                        {currentStep === 2 && "Images & Design"}
                        {currentStep === 3 && "Placement & Publish"}
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {uploadMode === "bulk" ? (
                    <div className="space-y-6">
                      {/* Upload Type Selection */}
                      <div className="mb-6">
                        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4">
                          <Button
                            variant={
                              uploadType === "csv" ? "default" : "outline"
                            }
                            onClick={() => setUploadType("csv")}
                            className={`px-4 py-2 ${uploadType === "csv" ? "bg-purple-600 text-white" : "text-purple-600"}`}
                          >
                            📄 CSV File
                          </Button>
                          <Button
                            variant={
                              uploadType === "folder" ? "default" : "outline"
                            }
                            onClick={() => setUploadType("folder")}
                            className={`px-4 py-2 ${uploadType === "folder" ? "bg-purple-600 text-white" : "text-purple-600"}`}
                          >
                            📁 Folder Upload
                          </Button>
                          <Button
                            variant={
                              uploadType === "images" ? "default" : "outline"
                            }
                            onClick={() => setUploadType("images")}
                            className={`px-4 py-2 ${uploadType === "images" ? "bg-purple-600 text-white" : "text-purple-600"}`}
                          >
                            🖼️ Images Only
                          </Button>
                        </div>
                      </div>

                      {/* CSV Upload */}
                      {uploadType === "csv" && (
                        <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-purple-600" />
                          <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-2">
                            CSV File Upload
                          </h3>
                          <p className="text-purple-600 mb-4 text-sm sm:text-base">
                            Upload a CSV file with product data (up to 1000
                            products)
                          </p>
                          <div className="bg-white/70 rounded-lg p-3 mb-4 text-left text-xs">
                            <p className="font-semibold text-purple-800 mb-2">
                              💡 CSV Image Tips:
                            </p>
                            <ul className="space-y-1 text-purple-700">
                              <li>• Add image URLs in the "images" column</li>
                              <li>• Separate multiple URLs with "|"</li>
                              <li>• Leave empty for auto-generated images</li>
                              <li>• Supports HTTPS URLs from any image host</li>
                            </ul>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                            <Button
                              variant="outline"
                              onClick={() => {
                                const csvContent =
                                  'name,price,originalprice,category,description,brand,color,material,size,condition,tags,images,path\n"Elegant Diamond Ring","299.99","399.99","Jewelry","Stunning diamond ring with elegant design","LuxuryBrand","Silver","18K Gold","7","new","luxury|handcrafted|diamond|elegant","https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&w=400&h=400&fit=crop|https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&w=400&h=400&fit=crop","jewelry/rings/luxury/diamond_ring_$299.99.jpg"\n"Summer Dress","49.99","69.99","Clothing","Beautiful floral summer dress","FashionCo","Floral","Cotton","M","new","summer|floral|comfortable|trendy","https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&w=400&h=400&fit=crop","clothing/dresses/summer/floral_dress_$49.99.jpg"\n"Lipstick Set","24.99","","Beauty","Premium matte lipstick collection","BeautyBrand","Red","Organic","","new","matte|organic|collection","https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&w=400&h=400&fit=crop","beauty/cosmetics/lipstick/red_matte_$24.99.jpg"\n"Sneakers","89.99","119.99","Shoes","Comfortable running sneakers","SportsBrand","White","Synthetic","10","new","comfortable|running|athletic","https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&w=400&h=400&fit=crop","shoes/sneakers/running/white_sneakers_$89.99.jpg"\n"Designer Handbag","159.99","","Accessories","Luxury leather handbag with gold accents","LuxuryBag","Black","Leather","","new","luxury|leather|designer|handbag","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=400&h=400&fit=crop","accessories/bags/luxury/black_handbag_$159.99.jpg"\n"Auto-Generated Product","25.99","","Beauty","Product without images - will use auto-generated image","GenericBrand","","","","new","auto|generated","","beauty/generic/auto_product_$25.99.jpg"';
                                const blob = new Blob([csvContent], {
                                  type: "text/csv",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download =
                                  "lilly_product_upload_template.csv";
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                              className="border-purple-300 text-purple-600 hover:bg-purple-50 text-sm"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              Download Template
                            </Button>
                            <Button
                              onClick={() => bulkFileInputRef.current?.click()}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Choose CSV File
                            </Button>
                            <Button
                              onClick={handleMapCSV}
                              variant="outline"
                              className="border-orange-300 text-orange-600 hover:bg-orange-50 text-sm"
                            >
                              <Target className="w-4 h-4 mr-2" />
                              Map CSV
                            </Button>
                            <Button
                              onClick={() =>
                                window.open("/admin/csv-filename", "_blank")
                              }
                              variant="outline"
                              className="border-blue-300 text-blue-600 hover:bg-blue-50 text-sm"
                            >
                              <Search className="w-4 h-4 mr-2" />
                              Fix Filenames
                            </Button>
                          </div>

                          <input
                            ref={bulkFileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleBulkFileUpload(file);
                            }}
                          />
                        </div>
                      )}

                      {/* Folder Upload */}
                      {uploadType === "folder" && (
                        <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <div className="text-5xl mb-4">📁</div>
                          <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
                            Smart Folder Upload
                          </h3>
                          <p className="text-green-600 mb-4 text-sm sm:text-base">
                            Upload entire folders with automatic categorization
                          </p>

                          <div className="bg-white/70 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold mb-3 text-green-800">
                              📂 How it works:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-left">
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600">🏷️</span>
                                <span>
                                  Folder names detect categories automatically
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600">💰</span>
                                <span>
                                  Filenames extract prices and details
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600">🎨</span>
                                <span>
                                  Image recognition identifies products
                                </span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-green-600">🔍</span>
                                <span>Smart sorting for mixed items</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => folderInputRef.current?.click()}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg text-sm sm:text-base"
                          >
                            <div className="text-2xl mr-2">📁</div>
                            Select Folder
                          </Button>

                          <input
                            ref={folderInputRef}
                            type="file"
                            webkitdirectory=""
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) handleFolderUpload(files);
                            }}
                          />

                          <div className="mt-4 text-xs text-gray-600">
                            <p>
                              ��� Tip: Organize your images in folders like
                              "jewelry/rings" or "clothing/dresses" for best
                              results
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Images Only Upload */}
                      {uploadType === "images" && (
                        <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="text-5xl mb-4">�����</div>
                          <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">
                            AI-Powered Image Upload
                          </h3>
                          <p className="text-blue-600 mb-4 text-sm sm:text-base">
                            Upload product images and let AI do the rest
                          </p>

                          <div className="bg-white/70 rounded-lg p-4 mb-6">
                            <h4 className="font-semibold mb-3 text-blue-800">
                              🤖 AI Features:
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-left">
                              <div className="flex items-start space-x-2">
                                <span className="text-blue-600">👁��</span>
                                <span>Image recognition for categories</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-blue-600">🏷️</span>
                                <span>Smart pricing based on category</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-blue-600">��</span>
                                <span>Auto-generated descriptions</span>
                              </div>
                              <div className="flex items-start space-x-2">
                                <span className="text-blue-600">🔤</span>
                                <span>Extract details from filenames</span>
                              </div>
                            </div>
                          </div>

                          <Button
                            onClick={() => imageInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg text-sm sm:text-base"
                          >
                            <div className="text-2xl mr-2">🖼️</div>
                            Select Images
                          </Button>

                          <input
                            ref={imageInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files) handleImageUpload(files);
                            }}
                          />

                          <div className="mt-4 text-xs text-gray-600">
                            <p>
                              �� Supports: JPG, PNG, WebP • Max 10MB per image •
                              Up to 1000 images
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Selected Files Display */}
                      {(selectedFiles.length > 0 ||
                        (bulkFiles && bulkFiles.length > 0)) && (
                        <div className="bg-white/90 rounded-xl p-4 sm:p-6 border border-blue-200 shadow-lg">
                          <h4 className="font-semibold text-blue-800 mb-3 flex items-center justify-between">
                            <span>
                              📂 Selected Files (
                              {selectedFiles.length > 0
                                ? selectedFiles.length
                                : bulkFiles?.length || 0}
                              )
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedFiles([]);
                                setBulkFiles(null);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Clear All
                            </Button>
                          </h4>

                          <div className="max-h-64 overflow-auto">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {(selectedFiles.length > 0
                                ? selectedFiles
                                : bulkFiles
                                  ? Array.from(bulkFiles)
                                  : []
                              )
                                .slice(0, 20)
                                .map((file, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                                  >
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <span className="text-blue-600 text-lg">
                                        📷
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div
                                        className="font-medium text-sm truncate"
                                        title={file.name}
                                      >
                                        {file.name}
                                      </div>
                                      <div className="text-xs text-gray-500 flex items-center space-x-2">
                                        <span>
                                          {(file.size / 1024 / 1024).toFixed(1)}
                                          MB
                                        </span>
                                        <span>•</span>
                                        <span>
                                          {file.type
                                            .split("/")[1]
                                            ?.toUpperCase() || "IMG"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-green-600">
                                      <CheckCircle className="w-4 h-4" />
                                    </div>
                                  </div>
                                ))}
                            </div>

                            {(selectedFiles.length > 0
                              ? selectedFiles.length
                              : bulkFiles?.length || 0) > 20 && (
                              <div className="text-center mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-gray-600">
                                  ... and{" "}
                                  {(selectedFiles.length > 0
                                    ? selectedFiles.length
                                    : bulkFiles?.length || 0) - 20}{" "}
                                  more files
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div className="flex items-center justify-between text-sm">
                              <div className="text-blue-700">
                                🤖 <strong>AI Processing:</strong> Smart
                                categorization, duplicate detection, and
                                dimension extraction enabled
                              </div>
                              <Badge className="bg-blue-600 text-white">
                                Ready for Processing
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* File Preview */}
                      {(bulkFile || bulkFiles) && bulkData.length > 0 && (
                        <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  {uploadType === "csv"
                                    ? bulkFile?.name
                                    : uploadType === "folder"
                                      ? `${bulkFiles?.length} files in folder`
                                      : `${bulkFiles?.length} images selected`}
                                </h4>
                                <p className="text-xs sm:text-sm text-gray-600">
                                  {bulkData.length} products found
                                  {uploadType !== "csv" && (
                                    <span className="ml-2 text-green-600">
                                      (AI Processed ✨)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setBulkFile(null);
                                setBulkFiles(null);
                                setBulkData([]);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>

                          {bulkData.length > 0 && (
                            <div className="space-y-4">
                              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 max-h-80 overflow-auto">
                                <div className="flex items-center justify-between mb-3">
                                  <h5 className="font-semibold text-sm sm:text-base">
                                    Preview ({Math.min(5, bulkData.length)} of{" "}
                                    {bulkData.length} products):
                                  </h5>
                                  <div className="flex space-x-1">
                                    <Button
                                      variant={
                                        viewMode === "grid"
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() => setViewMode("grid")}
                                      className="px-2 py-1"
                                    >
                                      <Layout className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant={
                                        viewMode === "list"
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      onClick={() => setViewMode("list")}
                                      className="px-2 py-1"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>

                                {/* Grid View */}
                                {viewMode === "grid" ? (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {bulkData
                                      .slice(0, 15)
                                      .map((item, index) => (
                                        <div
                                          key={index}
                                          className="bg-white p-2 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                                        >
                                          {item.images && item.images[0] ? (
                                            <div className="relative mb-2">
                                              <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="w-full h-24 object-cover rounded bg-gray-100"
                                              />
                                              {item.confidence && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                                                  {Math.round(
                                                    item.confidence * 100,
                                                  )}
                                                  %
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center mb-2">
                                              <span className="text-gray-400 text-xs">
                                                No Image
                                              </span>
                                            </div>
                                          )}
                                          <div className="text-xs">
                                            <p
                                              className="font-medium truncate"
                                              title={item.name}
                                            >
                                              {item.name}
                                            </p>
                                            <p className="text-green-600 font-semibold">
                                              ${item.price}
                                            </p>
                                            <p className="text-gray-500 truncate">
                                              {item.category}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    {bulkData.length > 15 && (
                                      <div className="flex items-center justify-center bg-white p-2 rounded-lg border border-dashed border-gray-300">
                                        <span className="text-gray-500 text-xs text-center">
                                          +{bulkData.length - 15}
                                          <br />
                                          more
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  /* List View */
                                  <div className="space-y-3">
                                    {bulkData.slice(0, 5).map((item, index) => (
                                      <div
                                        key={index}
                                        className="text-xs sm:text-sm bg-white p-3 rounded border"
                                      >
                                        <div className="flex items-start space-x-3">
                                          {item.images && item.images[0] ? (
                                            <div className="relative">
                                              <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg bg-gray-100 border border-gray-200 shadow-sm"
                                                style={{
                                                  filter:
                                                    "brightness(1) contrast(1) saturate(1)",
                                                  objectFit: "cover",
                                                }}
                                              />
                                              {item.confidence && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                                                  {Math.round(
                                                    item.confidence * 100,
                                                  )}
                                                  %
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                              <span className="text-gray-400 text-xs">
                                                No Image
                                              </span>
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-center space-x-2 mb-1">
                                              <span className="font-medium truncate">
                                                {item.name}
                                              </span>
                                              {item.confidence &&
                                                uploadType !== "csv" && (
                                                  <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                      item.confidence > 0.7
                                                        ? "text-green-600 border-green-600"
                                                        : item.confidence > 0.4
                                                          ? "text-yellow-600 border-yellow-600"
                                                          : "text-gray-600 border-gray-600"
                                                    }`}
                                                  >
                                                    {item.confidence > 0.7
                                                      ? "���"
                                                      : item.confidence > 0.4
                                                        ? "⚡"
                                                        : "🤖"}{" "}
                                                    AI
                                                  </Badge>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                              <span className="text-green-600 font-medium">
                                                ${item.price}
                                              </span>
                                              <div className="flex items-center space-x-1">
                                                <span className="text-purple-600">
                                                  {item.category}
                                                </span>
                                                {item.aiSuggestion && (
                                                  <Badge
                                                    variant="outline"
                                                    className={`text-xs ${
                                                      item.aiSuggestion
                                                        .confidence > 0.8
                                                        ? "text-green-600 border-green-600"
                                                        : item.aiSuggestion
                                                              .confidence > 0.6
                                                          ? "text-blue-600 border-blue-600"
                                                          : "text-orange-600 border-orange-600"
                                                    }`}
                                                    title={
                                                      item.aiSuggestion.reason
                                                    }
                                                  >
                                                    🧠{" "}
                                                    {Math.round(
                                                      item.aiSuggestion
                                                        .confidence * 100,
                                                    )}
                                                    %
                                                  </Badge>
                                                )}
                                              </div>
                                              {item.brand && (
                                                <span className="text-blue-600">
                                                  {item.brand}
                                                </span>
                                              )}
                                              {item.color && (
                                                <span className="text-orange-600">
                                                  {item.color}
                                                </span>
                                              )}
                                              {item.condition !== "new" && (
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {item.condition}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {bulkData.length > 5 && (
                                      <div className="text-xs sm:text-sm text-gray-500 text-center p-2 bg-white rounded border-dashed border">
                                        ...and {bulkData.length - 5} more
                                        products
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {isBulkProcessing ? (
                                <div className="space-y-3">
                                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                                    <div
                                      className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${bulkUploadProgress}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <p className="text-center text-xs sm:text-sm text-gray-600">
                                    {bulkFiles
                                      ? `🤖 AI Processing folder: ${Math.round(bulkUploadProgress)}% complete`
                                      : `Processing products: ${Math.round(bulkUploadProgress)}% complete`}
                                  </p>
                                  {bulkFiles && (
                                    <div className="text-center">
                                      <p className="text-xs text-purple-600">
                                        ✨ Generating descriptions, tags, and
                                        smart categorization...
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <Button
                                  onClick={processBulkUpload}
                                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm sm:text-lg py-2 sm:py-3"
                                  size="lg"
                                >
                                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  Upload {bulkData.length} Products
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {/* Multi-Product Navigation */}
                      {multiProductMode && (
                        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-blue-800">
                              Multi-Product Upload ({multiProductData.length}{" "}
                              items)
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Button
                                type="button"
                                size="sm"
                                onClick={startUploadProcess}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview All
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => setMultiProductMode(false)}
                                variant="outline"
                              >
                                Switch to Single Mode
                              </Button>
                            </div>
                          </div>

                          {/* Product Navigation */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {multiProductData.map((product, index) => (
                              <Button
                                key={index}
                                type="button"
                                size="sm"
                                variant={
                                  currentProductIndex === index
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() => navigateToProduct(index)}
                                className="min-w-0"
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Product {index + 1}
                              </Button>
                            ))}
                          </div>

                          {/* Current Product Preview */}
                          {multiProductData[currentProductIndex] && (
                            <div className="bg-white border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center space-x-4">
                                {multiProductData[currentProductIndex]
                                  .images[0] && (
                                  <img
                                    src={
                                      multiProductData[currentProductIndex]
                                        .images[0]
                                    }
                                    alt="Product preview"
                                    className="w-16 h-16 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <h4 className="font-semibold text-gray-800">
                                    {multiProductData[currentProductIndex]
                                      .name ||
                                      `Product ${currentProductIndex + 1}`}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Category:{" "}
                                    {multiProductData[currentProductIndex]
                                      .category || "Auto-detected"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Editing: Product {currentProductIndex + 1}{" "}
                                    of {multiProductData.length}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Start Upload Button */}
                      {(formData.images.length > 0 || multiProductMode) &&
                        !showPreview && (
                          <div className="mb-6 text-center">
                            <Button
                              type="button"
                              onClick={startUploadProcess}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold"
                            >
                              <Upload className="w-5 h-5 mr-2" />
                              {multiProductMode
                                ? `Start Upload Process (${multiProductData.length} items)`
                                : "Start Upload Process"}
                            </Button>
                          </div>
                        )}

                      {/* Preview Modal */}
                      {showPreview && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl font-bold text-gray-800">
                                Preview{" "}
                                {multiProductMode
                                  ? `${multiProductData.length} Products`
                                  : "Product"}
                              </h2>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setShowPreview(false)}
                              >
                                <X className="w-6 h-6" />
                              </Button>
                            </div>

                            {/* Preview Content */}
                            <div className="space-y-6">
                              {multiProductMode ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {multiProductData.map((product, index) => (
                                    <div
                                      key={index}
                                      className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                                    >
                                      <div className="flex items-center space-x-4 mb-4">
                                        {product.images[0] && (
                                          <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                          />
                                        )}
                                        <div>
                                          <h3 className="font-semibold text-gray-800">
                                            {product.name}
                                          </h3>
                                          <p className="text-sm text-gray-600">
                                            Category: {product.category}
                                          </p>
                                          <p className="text-sm text-green-600 font-medium">
                                            {product.price
                                              ? `$${product.price}`
                                              : "Price TBD"}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm text-gray-600 line-clamp-2">
                                        {product.description ||
                                          "No description provided"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                  <div className="flex items-center space-x-6 mb-4">
                                    {formData.images[0] && (
                                      <img
                                        src={formData.images[0]}
                                        alt={formData.name}
                                        className="w-32 h-32 object-cover rounded-lg"
                                      />
                                    )}
                                    <div>
                                      <h3 className="text-xl font-semibold text-gray-800">
                                        {formData.name}
                                      </h3>
                                      <p className="text-gray-600">
                                        Category: {formData.category}
                                      </p>
                                      <p className="text-lg text-green-600 font-medium">
                                        {formData.price
                                          ? `$${formData.price}`
                                          : "Price TBD"}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-gray-600">
                                    {formData.description ||
                                      "No description provided"}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Upload Actions */}
                            <div className="flex space-x-4 mt-8">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPreview(false)}
                                className="flex-1"
                              >
                                Back to Edit
                              </Button>
                              <Button
                                type="button"
                                onClick={proceedWithUpload}
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                              >
                                {isSubmitting ? (
                                  <>
                                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirm & Upload
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      <form className="space-y-4 sm:space-y-6">
                        {/* Step 1: Product Details */}
                        {currentStep === 1 && (
                          <div className="space-y-4 sm:space-y-6">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="text-base sm:text-lg font-semibold">
                                Auto-Generate Description
                              </Label>
                              <Button
                                type="button"
                                variant={
                                  autoDescription ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setAutoDescription(!autoDescription)
                                }
                              >
                                <Wand2 className="w-4 h-4 mr-2" />
                                {autoDescription ? "ON" : "OFF"}
                              </Button>
                            </div>

                            <div>
                              <Label
                                htmlFor="name"
                                className="text-base sm:text-lg font-semibold"
                              >
                                Product Name *
                              </Label>
                              <Input
                                id="name"
                                value={getCurrentProductData().name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                placeholder="e.g., Vintage Diamond Ring"
                                className="mt-2 text-sm sm:text-lg p-3 sm:p-4"
                                required
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="category"
                                className="text-base sm:text-lg font-semibold"
                              >
                                Category *
                              </Label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
                                {categories.map((category) => (
                                  <div
                                    key={category.name}
                                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all text-center relative overflow-hidden ${
                                      formData.category === category.name
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-purple-300"
                                    }`}
                                    onClick={() =>
                                      handleInputChange(
                                        "category",
                                        category.name,
                                      )
                                    }
                                  >
                                    <div
                                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`}
                                    ></div>
                                    <div className="relative">
                                      <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">
                                        {category.icon}
                                      </div>
                                      <div className="font-medium text-xs sm:text-sm">
                                        {category.name}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {category.suggested}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="description"
                                className="text-base sm:text-lg font-semibold"
                              >
                                Description *{" "}
                                {autoDescription && (
                                  <Badge variant="outline" className="ml-2">
                                    AI Generated
                                  </Badge>
                                )}
                              </Label>
                              <Textarea
                                id="description"
                                value={getCurrentProductData().description}
                                onChange={(e) =>
                                  handleInputChange(
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Describe your product in detail..."
                                rows={4}
                                className="mt-2 text-sm sm:text-lg"
                                required
                              />
                              {autoDescription &&
                                formData.name &&
                                formData.category && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                    onClick={() => {
                                      const newDesc = generateDescription(
                                        formData.name,
                                        formData.category,
                                        formData.brand,
                                        formData.material,
                                        formData.color,
                                      );
                                      handleInputChange("description", newDesc);
                                    }}
                                  >
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Regenerate Description
                                  </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                              <div>
                                <Label
                                  htmlFor="brand"
                                  className="text-base sm:text-lg font-semibold"
                                >
                                  Brand
                                </Label>
                                <Input
                                  id="brand"
                                  value={formData.brand}
                                  onChange={(e) =>
                                    handleInputChange("brand", e.target.value)
                                  }
                                  placeholder="Brand name"
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="color"
                                  className="text-base sm:text-lg font-semibold"
                                >
                                  Color
                                </Label>
                                <Input
                                  id="color"
                                  value={formData.color}
                                  onChange={(e) =>
                                    handleInputChange("color", e.target.value)
                                  }
                                  placeholder="Primary color"
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="material"
                                  className="text-base sm:text-lg font-semibold"
                                >
                                  Material
                                </Label>
                                <Input
                                  id="material"
                                  value={formData.material}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "material",
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Material/Fabric"
                                  className="mt-2"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                              <div>
                                <Label
                                  htmlFor="size"
                                  className="text-base sm:text-lg font-semibold"
                                >
                                  Size
                                </Label>
                                <Input
                                  id="size"
                                  value={formData.size}
                                  onChange={(e) =>
                                    handleInputChange("size", e.target.value)
                                  }
                                  placeholder="Size/Dimensions"
                                  className="mt-2"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="condition"
                                  className="text-base sm:text-lg font-semibold"
                                >
                                  Condition
                                </Label>
                                <Select
                                  value={formData.condition}
                                  onValueChange={(value) =>
                                    handleInputChange("condition", value as any)
                                  }
                                >
                                  <SelectTrigger className="mt-2">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">
                                      Brand New
                                    </SelectItem>
                                    <SelectItem value="like-new">
                                      Like New
                                    </SelectItem>
                                    <SelectItem value="used">
                                      Gently Used
                                    </SelectItem>
                                    <SelectItem value="refurbished">
                                      Refurbished
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Images & Design */}
                        {currentStep === 2 && (
                          <div className="space-y-4 sm:space-y-6">
                            <div>
                              <Label className="text-base sm:text-lg font-semibold mb-3 block">
                                Product Images * (Max 10)
                              </Label>
                              <div
                                className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-all cursor-pointer ${
                                  dragOver
                                    ? "border-purple-500 bg-purple-50"
                                    : "border-gray-300 hover:border-purple-400"
                                }`}
                                onClick={() => fileInputRef.current?.click()}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                              >
                                <Camera className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg sm:text-xl font-medium mb-2">
                                  {formData.images.length > 0
                                    ? "Add More Files"
                                    : "Select Files to Upload"}
                                </p>
                                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                                  Click anywhere or drag files here
                                </p>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="px-4 sm:px-8 py-2 sm:py-3"
                                >
                                  <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                  {formData.images.length > 0
                                    ? "Add More (1-10)"
                                    : "Select Files (1-10)"}
                                </Button>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  multiple
                                  accept="*/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFileUpload(e.target.files)
                                  }
                                />
                                <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                  Supports: All file types (Max 10MB each, 1-10
                                  files total)
                                  {formData.images.length > 0 && (
                                    <span className="text-purple-600 font-medium">
                                      {" "}
                                      ��� {formData.images.length} file
                                      {formData.images.length > 1
                                        ? "s"
                                        : ""}{" "}
                                      selected
                                    </span>
                                  )}
                                </p>
                              </div>

                              {formData.images.length > 0 && (
                                <div className="mt-4 sm:mt-6 grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-4">
                                  {formData.images.map((image, index) => (
                                    <div key={index} className="relative group">
                                      <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-20 sm:h-32 object-cover rounded-lg border-2 border-gray-200"
                                      />
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-1 right-1 h-6 w-6 sm:h-8 sm:w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeImage(index)}
                                      >
                                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </Button>
                                      {index === 0 && (
                                        <Badge className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs">
                                          Main
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div>
                              <Label className="text-base sm:text-lg font-semibold mb-3 block">
                                Card Template
                              </Label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                {templates.map((template) => (
                                  <div
                                    key={template.id}
                                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all text-center ${
                                      formData.template === template.id
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-purple-300"
                                    }`}
                                    onClick={() =>
                                      handleInputChange("template", template.id)
                                    }
                                  >
                                    <div className="text-2xl sm:text-4xl mb-2">
                                      {template.preview}
                                    </div>
                                    <div className="font-medium text-xs sm:text-sm">
                                      {template.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {template.description}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Enhanced Pricing Section */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 sm:p-6 border border-green-200">
                              <h4 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Pricing & Discounts
                              </h4>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                                {/* Current Price */}
                                <div>
                                  <Label
                                    htmlFor="price"
                                    className="text-base font-semibold text-green-800"
                                  >
                                    Sale Price *
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      (Final price)
                                    </span>
                                  </Label>
                                  <div className="relative mt-2">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600" />
                                    <Input
                                      id="price"
                                      value={formData.price}
                                      onChange={(e) => {
                                        const newPrice = e.target.value;
                                        handleInputChange("price", newPrice);

                                        // Auto-calculate discount percentage if original price exists
                                        if (
                                          formData.originalPrice &&
                                          newPrice
                                        ) {
                                          const original = parseFloat(
                                            formData.originalPrice,
                                          );
                                          const current = parseFloat(newPrice);
                                          if (
                                            original > 0 &&
                                            current > 0 &&
                                            original > current
                                          ) {
                                            const discount = (
                                              ((original - current) /
                                                original) *
                                              100
                                            ).toFixed(0);
                                            handleInputChange(
                                              "discountPercentage",
                                              discount,
                                            );
                                          }
                                        }
                                      }}
                                      placeholder="29.99"
                                      className="pl-10 text-sm sm:text-lg p-3 border-green-300 focus:border-green-500"
                                      required
                                    />
                                  </div>
                                </div>

                                {/* Original Price */}
                                <div>
                                  <Label
                                    htmlFor="originalPrice"
                                    className="text-base font-semibold text-gray-700"
                                  >
                                    Original Price
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      (Before discount)
                                    </span>
                                  </Label>
                                  <div className="relative mt-2">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                      id="originalPrice"
                                      value={formData.originalPrice}
                                      onChange={(e) => {
                                        const originalPrice = e.target.value;
                                        handleInputChange(
                                          "originalPrice",
                                          originalPrice,
                                        );

                                        // Auto-calculate sale price if discount percentage exists
                                        if (
                                          formData.discountPercentage &&
                                          originalPrice
                                        ) {
                                          const original =
                                            parseFloat(originalPrice);
                                          const discountPercent = parseFloat(
                                            formData.discountPercentage,
                                          );
                                          if (
                                            original > 0 &&
                                            discountPercent > 0
                                          ) {
                                            const salePrice = (
                                              original *
                                              (1 - discountPercent / 100)
                                            ).toFixed(2);
                                            handleInputChange(
                                              "price",
                                              salePrice,
                                            );
                                          }
                                        }
                                      }}
                                      placeholder="39.99"
                                      className="pl-10 text-sm sm:text-lg p-3"
                                    />
                                  </div>
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                  <Label
                                    htmlFor="discountPercentage"
                                    className="text-base font-semibold text-red-700"
                                  >
                                    Discount %
                                    <span className="text-sm font-normal text-gray-600 ml-1">
                                      (Auto-calculated)
                                    </span>
                                  </Label>
                                  <div className="relative mt-2">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600 font-bold">
                                      %
                                    </span>
                                    <Input
                                      id="discountPercentage"
                                      value={formData.discountPercentage}
                                      onChange={(e) => {
                                        const discountPercent = e.target.value;
                                        handleInputChange(
                                          "discountPercentage",
                                          discountPercent,
                                        );

                                        // Auto-calculate sale price if original price exists
                                        if (
                                          formData.originalPrice &&
                                          discountPercent
                                        ) {
                                          const original = parseFloat(
                                            formData.originalPrice,
                                          );
                                          const discount =
                                            parseFloat(discountPercent);
                                          if (
                                            original > 0 &&
                                            discount > 0 &&
                                            discount <= 100
                                          ) {
                                            const salePrice = (
                                              original *
                                              (1 - discount / 100)
                                            ).toFixed(2);
                                            handleInputChange(
                                              "price",
                                              salePrice,
                                            );
                                          }
                                        }
                                      }}
                                      placeholder="25"
                                      className="pl-8 text-sm sm:text-lg p-3 border-red-300 focus:border-red-500"
                                      type="number"
                                      min="0"
                                      max="100"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Pricing Preview */}
                              {(formData.price || formData.originalPrice) && (
                                <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
                                  <h5 className="font-semibold text-green-800 mb-2">
                                    💰 Pricing Preview:
                                  </h5>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      {formData.originalPrice &&
                                        formData.price &&
                                        parseFloat(formData.originalPrice) >
                                          parseFloat(formData.price) && (
                                          <span className="text-gray-500 line-through text-lg">
                                            ${formData.originalPrice}
                                          </span>
                                        )}
                                      <span className="text-2xl font-bold text-green-600">
                                        ${formData.price || "0.00"}
                                      </span>
                                      {formData.discountPercentage &&
                                        parseFloat(
                                          formData.discountPercentage,
                                        ) > 0 && (
                                          <Badge className="bg-red-500 text-white">
                                            {formData.discountPercentage}% OFF
                                          </Badge>
                                        )}
                                    </div>
                                    {formData.originalPrice &&
                                      formData.price &&
                                      parseFloat(formData.originalPrice) >
                                        parseFloat(formData.price) && (
                                        <div className="text-right">
                                          <div className="text-green-600 font-semibold">
                                            You save: $
                                            {(
                                              parseFloat(
                                                formData.originalPrice,
                                              ) - parseFloat(formData.price)
                                            ).toFixed(2)}
                                          </div>
                                        </div>
                                      )}
                                  </div>
                                </div>
                              )}

                              {/* Quick Discount Buttons */}
                              <div className="mt-4">
                                <p className="text-sm text-gray-600 mb-2">
                                  💡 Quick discounts:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {["10", "20", "25", "30", "50"].map(
                                    (discount) => (
                                      <Button
                                        key={discount}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          handleInputChange(
                                            "discountPercentage",
                                            discount,
                                          );
                                          if (formData.originalPrice) {
                                            const original = parseFloat(
                                              formData.originalPrice,
                                            );
                                            const discountPercent =
                                              parseFloat(discount);
                                            if (original > 0) {
                                              const salePrice = (
                                                original *
                                                (1 - discountPercent / 100)
                                              ).toFixed(2);
                                              handleInputChange(
                                                "price",
                                                salePrice,
                                              );
                                            }
                                          }
                                        }}
                                        className="text-xs border-red-300 text-red-600 hover:bg-red-50"
                                      >
                                        {discount}% OFF
                                      </Button>
                                    ),
                                  )}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      handleInputChange(
                                        "discountPercentage",
                                        "",
                                      );
                                      handleInputChange("originalPrice", "");
                                    }}
                                    className="text-xs"
                                  >
                                    Clear
                                  </Button>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label
                                htmlFor="tags"
                                className="text-base sm:text-lg font-semibold"
                              >
                                Tags (comma separated)
                              </Label>
                              <div className="relative mt-2">
                                <Tag className="absolute left-3 sm:left-4 top-3 sm:top-4 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                <Textarea
                                  id="tags"
                                  value={formData.tags}
                                  onChange={(e) =>
                                    handleInputChange("tags", e.target.value)
                                  }
                                  placeholder="luxury, handmade, vintage, gift..."
                                  className="pl-10 sm:pl-12 text-sm sm:text-lg"
                                  rows={3}
                                />
                              </div>
                              {formData.name && formData.category && (
                                <div className="mt-2">
                                  <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                    Suggested tags:
                                  </p>
                                  <div className="flex flex-wrap gap-1 sm:gap-2">
                                    {getSuggestedTags(
                                      formData.name,
                                      formData.category,
                                      formData.brand,
                                    ).map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="outline"
                                        className="cursor-pointer hover:bg-purple-50 text-xs"
                                        onClick={() => {
                                          const currentTags = formData.tags
                                            ? formData.tags
                                                .split(",")
                                                .map((t) => t.trim())
                                            : [];
                                          if (!currentTags.includes(tag)) {
                                            handleInputChange(
                                              "tags",
                                              [...currentTags, tag].join(", "),
                                            );
                                          }
                                        }}
                                      >
                                        + {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Placement & Publish */}
                        {currentStep === 3 && (
                          <div className="space-y-4 sm:space-y-6">
                            <div>
                              <Label className="text-base sm:text-lg font-semibold mb-4 block">
                                Where should this product appear?
                              </Label>
                              <div className="space-y-2 sm:space-y-3">
                                {placements.map((placement) => (
                                  <div
                                    key={placement.id}
                                    className={`p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                      formData.placement === placement.id
                                        ? "border-purple-500 bg-purple-50"
                                        : "border-gray-200 hover:border-purple-300"
                                    }`}
                                    onClick={() =>
                                      handleInputChange(
                                        "placement",
                                        placement.id,
                                      )
                                    }
                                  >
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                      <div className="text-xl sm:text-2xl">
                                        {placement.icon}
                                      </div>
                                      <div>
                                        <div className="font-semibold text-sm sm:text-base">
                                          {placement.name}
                                        </div>
                                        <div className="text-xs sm:text-sm text-gray-600">
                                          {placement.description}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {formData.placement === "custom" && (
                                <div className="mt-4">
                                  <Label
                                    htmlFor="customSection"
                                    className="text-base sm:text-lg font-semibold"
                                  >
                                    Custom Section Name
                                  </Label>
                                  <Input
                                    id="customSection"
                                    value={formData.customSection}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "customSection",
                                        e.target.value,
                                      )
                                    }
                                    placeholder="e.g., Limited Edition, Holiday Collection"
                                    className="mt-2"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Shipping Options */}
                            <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 sm:p-6">
                              <h4 className="font-semibold text-green-800 mb-3 text-sm sm:text-base flex items-center">
                                <Package className="w-5 h-5 mr-2" />
                                Shipping & Storage Options
                              </h4>
                              <div className="space-y-3">
                                <div
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.shippingOption === "self-ship"
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-200 hover:border-green-300"
                                  }`}
                                  onClick={() =>
                                    handleInputChange(
                                      "shippingOption",
                                      "self-ship",
                                    )
                                  }
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="text-lg">🚚</div>
                                    <div>
                                      <div className="font-semibold text-sm">
                                        Ship Your Own Items
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        You handle storage, packaging, and
                                        shipping
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                    formData.shippingOption ===
                                    "platform-storage"
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-200 hover:border-green-300"
                                  }`}
                                  onClick={() =>
                                    handleInputChange(
                                      "shippingOption",
                                      "platform-storage",
                                    )
                                  }
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="text-lg">🏪</div>
                                    <div>
                                      <div className="font-semibold text-sm">
                                        Send to Us for Storage
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        We handle storage, packaging, and
                                        shipping (5% fee)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Offer Management */}
                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4 sm:p-6">
                              <h4 className="font-semibold text-yellow-800 mb-3 text-sm sm:text-base flex items-center">
                                <DollarSign className="w-5 h-5 mr-2" />
                                Offer Management
                              </h4>
                              <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    id="allowOffers"
                                    checked={formData.allowOffers}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "allowOffers",
                                        e.target.checked,
                                      )
                                    }
                                    className="rounded border-gray-300"
                                  />
                                  <label
                                    htmlFor="allowOffers"
                                    className="text-sm font-medium"
                                  >
                                    Allow buyers to send offers
                                  </label>
                                </div>

                                {formData.allowOffers && (
                                  <div className="ml-6 space-y-3">
                                    <div>
                                      <Label className="text-sm font-medium">
                                        Minimum Offer Percentage
                                      </Label>
                                      <Select
                                        value={formData.minimumOfferPercentage.toString()}
                                        onValueChange={(value) =>
                                          handleInputChange(
                                            "minimumOfferPercentage",
                                            parseInt(value),
                                          )
                                        }
                                      >
                                        <SelectTrigger className="mt-1">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="10">
                                            10% of listing price
                                          </SelectItem>
                                          <SelectItem value="15">
                                            15% of listing price
                                          </SelectItem>
                                          <SelectItem value="20">
                                            20% of listing price
                                          </SelectItem>
                                          <SelectItem value="25">
                                            25% of listing price
                                          </SelectItem>
                                          <SelectItem value="30">
                                            30% of listing price
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="bg-white p-3 rounded border text-xs">
                                      <div className="font-medium text-gray-800 mb-2">
                                        Offer Rules:
                                      </div>
                                      <div className="space-y-1 text-gray-600">
                                        <div>
                                          • Regular users: Maximum 15% offers
                                        </div>
                                        <div>
                                          • Members: Can request any amount
                                        </div>
                                        <div>
                                          • You earn 90% of final sale price
                                        </div>
                                        <div>
                                          ��� Platform keeps 10% commission
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                              <h4 className="font-semibold text-blue-800 mb-3 text-sm sm:text-base">
                                Publishing Options
                              </h4>
                              <div className="space-y-2 sm:space-y-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-700 text-xs sm:text-sm">
                                    Product will be automatically added to the
                                    selected category page
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-700 text-xs sm:text-sm">
                                    Featured products appear on the homepage
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-blue-700 text-xs sm:text-sm">
                                    Products can be edited anytime from your
                                    dashboard
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Form Navigation */}
                            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                                className="w-full sm:w-auto"
                              >
                                <ArrowLeft className="mr-2 w-4 h-4" />
                                Previous Step
                              </Button>
                              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => handleSubmit("draft")}
                                  disabled={isSubmitting}
                                  className="px-4 sm:px-8 py-2 sm:py-3"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-600 border-t-transparent rounded-full mr-2" />
                                      Saving...
                                    </>
                                  ) : (
                                    <>
                                      <Save className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                                      Save as Draft
                                    </>
                                  )}
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => handleSubmit("published")}
                                  disabled={isSubmitting}
                                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-8 py-2 sm:py-3"
                                >
                                  {isSubmitting ? (
                                    <>
                                      <div className="animate-spin w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                                      Publishing...
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                                      Publish Product
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step Navigation for Steps 1 & 2 */}
                        {currentStep < 3 && (
                          <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 pt-4 sm:pt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handlePrevious}
                              disabled={currentStep === 1}
                              className="w-full sm:w-auto"
                            >
                              <ArrowLeft className="mr-2 w-4 h-4" />
                              Previous Step
                            </Button>
                            <Button
                              type="button"
                              onClick={handleNext}
                              disabled={!validateStep(currentStep)}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white w-full sm:w-auto"
                            >
                              Next Step
                              <ArrowLeft className="ml-2 w-4 h-4 rotate-180" />
                            </Button>
                          </div>
                        )}
                      </form>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Preview - Only for Single Product Mode */}
            {uploadMode === "single" && (
              <div className="hidden xl:block">
                <Card className="shadow-xl bg-white/90 backdrop-blur-sm sticky top-32 border-0">
                  <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl text-center text-purple-600 flex items-center justify-center gap-2">
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {formData.name ? (
                      <div className="space-y-4">
                        {formData.images.length > 0 && (
                          <div className="relative">
                            <img
                              src={formData.images[0]}
                              alt={formData.name}
                              className="w-full h-32 sm:h-48 object-cover rounded-lg bg-gray-100"
                              style={{
                                filter: "brightness(1) contrast(1) saturate(1)",
                                objectFit: "cover",
                              }}
                            />
                            {formData.images.length > 1 && (
                              <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                                +{formData.images.length - 1} more
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 bg-white/80"
                            >
                              <Heart className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg mb-2">
                            {formData.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            {formData.price && (
                              <span className="text-2xl font-bold text-purple-600">
                                ${formData.price}
                              </span>
                            )}
                            {formData.originalPrice && (
                              <span className="text-gray-500 line-through">
                                ${formData.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-current"
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">
                              (124 reviews)
                            </span>
                          </div>
                          {formData.description && (
                            <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                              {formData.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {formData.category && (
                              <Badge variant="secondary">
                                {formData.category}
                              </Badge>
                            )}
                            {formData.condition !== "new" && (
                              <Badge variant="outline">
                                {formData.condition}
                              </Badge>
                            )}
                          </div>
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p>Start filling out the form to see a preview</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Products Management */}
          {products.length > 0 && (
            <div className="mt-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-purple-800">
                  Your Products ({products.length})
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex rounded-lg border">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Layout className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <Menu className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="shadow-lg border-0 bg-white/80 relative group overflow-hidden"
                    >
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-32 sm:h-48 object-cover"
                        />
                        <Badge
                          className={`absolute top-2 left-2 text-xs ${
                            product.status === "published"
                              ? "bg-green-500"
                              : product.status === "draft"
                                ? "bg-gray-500"
                                : "bg-orange-500"
                          } text-white`}
                        >
                          {product.status}
                          {
                            placements.find((p) => p.id === product.placement)
                              ?.icon
                          }
                        </Badge>
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80"
                            onClick={() => setEditingProduct(product.id)}
                          >
                            <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0 bg-white/80"
                            onClick={() => duplicateProduct(product)}
                          >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-6 w-6 sm:h-8 sm:w-8 p-0"
                            onClick={() => deleteProduct(product.id)}
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                        {product.images.length > 1 && (
                          <Badge className="absolute bottom-2 left-2 bg-black/70 text-white text-xs">
                            +{product.images.length - 1} photos
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm sm:text-lg line-clamp-1">
                            {product.name}
                          </h4>
                          <div className="text-right">
                            <span className="font-bold text-purple-600 text-sm sm:text-lg">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <div className="text-xs text-gray-500 line-through">
                                ${product.originalPrice}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          {product.condition !== "new" && (
                            <Badge variant="outline" className="text-xs">
                              {product.condition}
                            </Badge>
                          )}
                          {product.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                          <span>
                            Added{" "}
                            {new Date(product.dateAdded).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span>{product.views} views</span>
                            <span>{product.likes} likes</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => toggleProductStatus(product.id)}
                            className={`flex-1 text-xs ${
                              product.status === "published"
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {product.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                          </Button>
                          <Button variant="outline" size="sm" className="px-2">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="shadow-lg border-0 bg-white/80"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center space-x-4 sm:space-x-6">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <h3 className="text-base sm:text-xl font-bold mb-2 truncate">
                                  {product.name}
                                </h3>
                                <p className="text-gray-600 mb-2 text-sm sm:text-base line-clamp-2">
                                  {product.description.substring(0, 100)}...
                                </p>
                                <div className="flex flex-wrap items-center space-x-2 sm:space-x-4 gap-1">
                                  <span className="font-bold text-purple-600 text-sm sm:text-lg">
                                    ${product.price}
                                  </span>
                                  <Badge
                                    className={`text-xs ${
                                      product.status === "published"
                                        ? "bg-green-500"
                                        : product.status === "draft"
                                          ? "bg-gray-500"
                                          : "bg-orange-500"
                                    } text-white`}
                                  >
                                    {product.status}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {product.category}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex space-x-2 mt-2 sm:mt-0">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingProduct(product.id)}
                                  className="px-2"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => duplicateProduct(product)}
                                  className="px-2"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    toggleProductStatus(product.id)
                                  }
                                  className={`${
                                    product.status === "published"
                                      ? "bg-orange-500 hover:bg-orange-600"
                                      : "bg-green-500 hover:bg-green-600"
                                  } text-white`}
                                >
                                  {product.status === "published"
                                    ? "Unpublish"
                                    : "Publish"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => deleteProduct(product.id)}
                                  className="px-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  {products.length === 0 ? (
                    <>
                      <p className="text-lg">No products added yet</p>
                      <p>Start by adding your first product above</p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg">No products found</p>
                      <p>Try adjusting your search or filter criteria</p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Menu
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-6">
                <Link
                  to="/"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Home
                </Link>
                <Link
                  to="/collections"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Collections
                </Link>
                <Link
                  to="/sell-products"
                  className="block text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Sell Products
                </Link>
                <span className="block text-lg font-medium text-purple-600 font-semibold border-b-2 border-purple-600 pb-1">
                  📦 Product Upload
                </span>
                <div className="pt-4">
                  <ShoppingCart
                    cartItems={cartItems}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onCheckout={handleCheckout}
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white mt-6"
                  onClick={() => {
                    setShowMobileMenu(false);
                    window.open(
                      "https://lillys-fashion-couture.myshopify.com",
                      "_blank",
                    );
                  }}
                >
                  🛒 Shopify Store
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offers Management Modal */}
      {showOffers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOffers(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-4xl max-h-[80vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-600">
                Manage Offers
              </h3>
              <Button variant="ghost" onClick={() => setShowOffers(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-800">Your Balance</h4>
                  <p className="text-2xl font-bold text-green-700">
                    ${userBalance.toFixed(2)}
                  </p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Withdraw Funds
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {mockOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold">{offer.buyerName}</h4>
                        <Badge
                          variant={
                            offer.buyerType === "member"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {offer.buyerType === "member"
                            ? "💎 Member"
                            : "👤 Regular"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {offer.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {offer.productName}
                      </p>
                      <p className="text-sm text-gray-700 mb-3">
                        "{offer.message}"
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-green-600">
                          ${offer.offerAmount}
                        </span>
                        <span className="text-sm text-gray-500">
                          (was ${offer.originalPrice})
                        </span>
                        <span className="text-sm text-purple-600">
                          You get: ${(offer.offerAmount * 0.9).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOfferAction(offer.id, "decline")}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleOfferAction(offer.id, "accept")}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Profiles Modal */}
      {showUserProfiles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUserProfiles(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-4xl max-h-[80vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-purple-600">
                User Profiles
              </h3>
              <Button
                variant="ghost"
                onClick={() => setShowUserProfiles(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: "Sarah Johnson",
                  type: "member",
                  items: 23,
                  rating: 4.9,
                  joined: "Jan 2023",
                  specialties: ["Jewelry", "Vintage"],
                  avatar: "SJ",
                },
                {
                  name: "Mike Chen",
                  type: "regular",
                  items: 8,
                  rating: 4.7,
                  joined: "Mar 2024",
                  specialties: ["Electronics", "Accessories"],
                  avatar: "MC",
                },
                {
                  name: "Emma Davis",
                  type: "member",
                  items: 45,
                  rating: 5.0,
                  joined: "Aug 2022",
                  specialties: ["Fashion", "Beauty"],
                  avatar: "ED",
                },
              ].map((user, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-semibold text-purple-600">
                      {user.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold">{user.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            user.type === "member" ? "default" : "secondary"
                          }
                        >
                          {user.type === "member"
                            ? "�� Member"
                            : "���� Regular"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Joined {user.joined}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items Listed:</span>
                      <span className="font-medium">{user.items}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating:</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium ml-1">{user.rating}</span>
                      </div>
                    </div>
                    <div>
                      <span>Specialties:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.specialties.map((specialty, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Items
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Detection Dialog */}
      {showDuplicates && duplicateProducts.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDuplicates(false)}
          />
          <div className="relative bg-white rounded-2xl p-6 m-4 max-w-4xl max-h-[80vh] overflow-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-orange-600 flex items-center">
                <AlertCircle className="w-6 h-6 mr-2" />
                Duplicate Products Detected
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDuplicates(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <p className="text-gray-600 mb-6">
              We found {duplicateProducts.length} potential duplicate(s). Please
              review and decide what to do with each:
            </p>

            <div className="space-y-6">
              {duplicateProducts.map((duplicate, index) => (
                <div
                  key={index}
                  className="border border-orange-200 rounded-lg p-4 bg-orange-50"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg text-orange-800">
                        {duplicate.newProduct.name}
                      </h4>
                      <div className="text-sm text-gray-600">
                        {duplicate.newProduct.category} �� $
                        {duplicate.newProduct.price}
                        {duplicate.newProduct.brand &&
                          ` �� ${duplicate.newProduct.brand}`}
                      </div>
                    </div>
                    <Badge
                      className={`${
                        duplicate.confidence > 0.9
                          ? "bg-red-500"
                          : duplicate.confidence > 0.7
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                      } text-white`}
                    >
                      {Math.round(duplicate.confidence * 100)}% match
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-semibold text-green-700 mb-2">
                        New Product:
                      </h5>
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        {duplicate.newProduct.images &&
                          duplicate.newProduct.images[0] && (
                            <img
                              src={duplicate.newProduct.images[0]}
                              alt={duplicate.newProduct.name}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                        <div className="text-sm">
                          <p>
                            <strong>Name:</strong> {duplicate.newProduct.name}
                          </p>
                          <p>
                            <strong>Price:</strong> $
                            {duplicate.newProduct.price}
                          </p>
                          <p>
                            <strong>Category:</strong>{" "}
                            {duplicate.newProduct.category}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-red-700 mb-2">
                        Similar Existing Product(s):
                      </h5>
                      <div className="space-y-2 max-h-40 overflow-auto">
                        {duplicate.similarProducts.map((similar, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded-lg border border-red-200"
                          >
                            {similar.images && similar.images[0] && (
                              <img
                                src={similar.images[0]}
                                alt={similar.name}
                                className="w-full h-24 object-cover rounded mb-2"
                              />
                            )}
                            <div className="text-sm">
                              <p>
                                <strong>Name:</strong> {similar.name}
                              </p>
                              <p>
                                <strong>Price:</strong> ${similar.price}
                              </p>
                              <p>
                                <strong>Added:</strong>{" "}
                                {new Date(
                                  similar.dateAdded,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-4">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        // Keep new product - remove from duplicates
                        setDuplicateProducts((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Keep New
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => {
                        // Skip new product - remove from bulkData and duplicates
                        setBulkData((prev) =>
                          prev.filter(
                            (item) => item.name !== duplicate.newProduct.name,
                          ),
                        );
                        setDuplicateProducts((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Skip New
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        // Create variation - add suffix to name
                        const updatedProduct = {
                          ...duplicate.newProduct,
                          name: `${duplicate.newProduct.name} (Variation)`,
                        };
                        setBulkData((prev) =>
                          prev.map((item) =>
                            item.name === duplicate.newProduct.name
                              ? updatedProduct
                              : item,
                          ),
                        );
                        setDuplicateProducts((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Variation
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  // Skip all duplicates
                  duplicateProducts.forEach((duplicate) => {
                    setBulkData((prev) =>
                      prev.filter(
                        (item) => item.name !== duplicate.newProduct.name,
                      ),
                    );
                  });
                  setDuplicateProducts([]);
                  setShowDuplicates(false);
                }}
              >
                Skip All Duplicates
              </Button>
              <Button
                onClick={() => {
                  // Keep all new products
                  setDuplicateProducts([]);
                  setShowDuplicates(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Keep All New Products
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {showCSVImport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Complete Expectancy Map & CSV Import
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCSVImport(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Import Statistics */}
              {importStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {importStats.totalProducts}
                    </div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">
                      {importStats.collections.length}
                    </div>
                    <div className="text-sm text-gray-600">Collections</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      ${importStats.priceRange.min}-$
                      {importStats.priceRange.max}
                    </div>
                    <div className="text-sm text-gray-600">Price Range</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">
                      {importStats.brands.length}
                    </div>
                    <div className="text-sm text-gray-600">Brands</div>
                  </div>
                </div>
              )}

              {/* Expectancy Map */}
              {expectancyMap && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Collection Expectancy Map
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(expectancyMap).map(([collection, data]) => (
                      <Card key={collection} className="border-2">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {collection}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">
                                Progress:
                              </span>
                              <Badge variant="outline">
                                {(
                                  (data.currentItems / data.expectedItems) *
                                  100
                                ).toFixed(1)}
                                %
                              </Badge>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                                style={{
                                  width: `${Math.min((data.currentItems / data.expectedItems) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Current:</span>
                                <span className="font-bold ml-1">
                                  {data.currentItems}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Expected:</span>
                                <span className="font-bold ml-1">
                                  {data.expectedItems}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-600">Avg Price:</span>
                              <span className="font-bold ml-1">
                                ${data.averagePrice?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Categories: {data.categories.join(", ")}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection Distribution */}
              {importStats && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Product Distribution by Collection
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {importStats.collections.map((collection, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{collection.name}</div>
                          <div className="text-sm text-gray-600">
                            Avg: ${collection.averagePrice.toFixed(2)}
                          </div>
                        </div>
                        <Badge variant="outline">
                          {collection.count} items
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Template Images Preview */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Template Images by Category
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(TEMPLATE_IMAGES).map(
                    ([category, imageUrl]) => (
                      <div key={category} className="text-center">
                        <img
                          src={imageUrl}
                          alt={category}
                          className="w-full h-24 object-cover rounded-lg mb-2"
                        />
                        <div className="text-sm font-medium">{category}</div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* CSV Import removed in production mode */}
              <div className="pt-6 border-t">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    Production mode - Use the upload form above to add products
                    manually
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowCSVImport(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSV Mapping Modal */}
      {showCSVMapping && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  🎯 CSV Mapping & Validation System
                </h2>
                <div className="flex items-center space-x-2">
                  {(csvData.length > 0 ||
                    bulkFiles ||
                    mappingResults.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear all data and reset to upload step
                        setCsvData([]);
                        setBulkFiles(null);
                        setMappingResults([]);
                        setDuplicateMatches([]);
                        setMissingImages([]);
                        setValidationResults(null);
                        setMappingProgress(0);
                        setMappingStep("upload");
                      }}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      🗑️ Clear All
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCSVMapping(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mt-4 flex items-center space-x-2 sm:space-x-4">
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    mappingStep === "upload"
                      ? "bg-blue-100 text-blue-800"
                      : ["mapping", "validation", "complete"].includes(
                            mappingStep,
                          )
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="w-2 h-2 bg-current rounded-full"></span>
                  Upload
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    mappingStep === "mapping"
                      ? "bg-blue-100 text-blue-800"
                      : ["validation", "complete"].includes(mappingStep)
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="w-2 h-2 bg-current rounded-full"></span>
                  Mapping
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    mappingStep === "validation"
                      ? "bg-blue-100 text-blue-800"
                      : mappingStep === "complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="w-2 h-2 bg-current rounded-full"></span>
                  Validation
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                    mappingStep === "complete"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <span className="w-2 h-2 bg-current rounded-full"></span>
                  Complete
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Upload Step */}
              {mappingStep === "upload" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <Upload className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Upload CSV + Folder for Smart Mapping
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Upload a CSV file and optionally a folder of images to
                      create enhanced product mappings
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* CSV Upload */}
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                        <div className="text-center">
                          <Upload className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                          <h4 className="font-semibold text-blue-800 mb-2">
                            CSV File
                          </h4>
                          <p className="text-sm text-blue-600 mb-3">
                            Product data and information
                          </p>
                          <Button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.accept = ".csv";
                              input.onchange = (e: any) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setCsvData([
                                    { file, name: file.name, type: "csv" },
                                  ]);
                                  setMappingProgress(25);
                                }
                              };
                              input.click();
                            }}
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-100"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Select CSV
                          </Button>
                          {csvData.length > 0 && csvData[0].type === "csv" && (
                            <p className="text-xs text-green-600 mt-2">
                              ✅ {csvData[0].name}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Folder Upload */}
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-6 bg-green-50">
                        <div className="text-center">
                          <div className="text-4xl mb-3">📁</div>
                          <h4 className="font-semibold text-green-800 mb-2">
                            Image Folder
                          </h4>
                          <p className="text-sm text-green-600 mb-3">
                            Product images with smart filename analysis
                          </p>
                          <Button
                            onClick={() => {
                              const input = document.createElement("input");
                              input.type = "file";
                              input.webkitdirectory = true;
                              input.multiple = true;
                              input.onchange = (e: any) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                  const imageFiles = Array.from(files).filter(
                                    (f: any) =>
                                      f.type.startsWith("image/") &&
                                      f.size <= 10 * 1024 * 1024,
                                  );
                                  setBulkFiles(files);
                                  setMappingProgress((prev) =>
                                    Math.max(prev, 25),
                                  );
                                }
                              };
                              input.click();
                            }}
                            variant="outline"
                            className="border-green-300 text-green-600 hover:bg-green-100"
                          >
                            <div className="text-lg mr-2">📁</div>
                            Select Folder
                          </Button>
                          {bulkFiles && (
                            <p className="text-xs text-green-600 mt-2">
                              ✅{" "}
                              {
                                Array.from(bulkFiles).filter((f: any) =>
                                  f.type.startsWith("image/"),
                                ).length
                              }{" "}
                              images
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Process Button */}
                    {(csvData.length > 0 || bulkFiles) && (
                      <div className="space-y-4">
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <h4 className="font-semibold text-purple-800 mb-2">
                            🤖 AI Processing Options
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div className="text-center">
                              <div className="text-purple-600 font-medium">
                                CSV Only
                              </div>
                              <div className="text-purple-500">
                                Standard mapping
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-600 font-medium">
                                Folder Only
                              </div>
                              <div className="text-purple-500">
                                AI image analysis
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-600 font-medium">
                                CSV + Folder
                              </div>
                              <div className="text-purple-500">
                                Enhanced smart mapping
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={() => processCSVFolderMapping()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            size="lg"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            Start AI Analysis & Mapping
                          </Button>

                          <Button
                            onClick={() => {
                              console.log("🐛 DEBUG MAPPING INFO:");
                              console.log("CSV Data:", csvData);
                              console.log(
                                "Bulk Files:",
                                bulkFiles
                                  ? Array.from(bulkFiles)
                                      .slice(0, 10)
                                      .map((f) => ({
                                        name: f.name,
                                        size: f.size,
                                        type: f.type,
                                      }))
                                  : "None",
                              );

                              if (csvData.length > 0) {
                                console.log("CSV Sample:", csvData[0]);
                              }

                              alert(
                                `🐛 Debug Info:\n\nCSV items: ${csvData.length}\nFolder files: ${bulkFiles ? bulkFiles.length : 0}\n\nCheck browser console for detailed info.`,
                              );
                            }}
                            variant="outline"
                            size="sm"
                            className="border-green-500 text-green-700 hover:bg-green-50"
                          >
                            🐛 Debug Mapping Info
                          </Button>

                          <Button
                            onClick={createRealTestProducts}
                            variant="outline"
                            size="sm"
                            className="border-blue-500 text-blue-700 hover:bg-blue-50"
                          >
                            🧪 Create Test Products
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {mappingProgress > 0 && mappingProgress < 100 && (
                    <div className="space-y-2">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${mappingProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        {mappingProgress < 30
                          ? "��� Analyzing files..."
                          : mappingProgress < 60
                            ? "��� AI processing images and CSV..."
                            : mappingProgress < 90
                              ? "�� Finding matches and duplicates..."
                              : "✨ Finalizing smart mappings..."}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Mapping Step */}
              {mappingStep === "mapping" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {csvData.length}
                      </div>
                      <div className="text-sm text-gray-600">CSV Items</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {mappingResults.filter((r) => !r.isNewProduct).length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Potential Matches
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {mappingResults.filter((r) => r.isNewProduct).length}
                      </div>
                      <div className="text-sm text-gray-600">New Products</div>
                    </div>
                  </div>

                  {/* Validation Issues */}
                  {(duplicateMatches.length > 0 ||
                    missingImages.length > 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-yellow-800 mb-3">
                        ��️ Issues Found
                      </h4>
                      {duplicateMatches.length > 0 && (
                        <div className="mb-3">
                          <p className="text-yellow-700 text-sm font-medium mb-2">
                            • {duplicateMatches.length} potential duplicates
                            detected
                          </p>
                          <div className="max-h-32 overflow-y-auto space-y-2">
                            {duplicateMatches.slice(0, 3).map((dup, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-2 rounded border border-yellow-200 text-xs"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">
                                      "{dup.item1.name}" ↔ "{dup.item2.name}"
                                    </p>
                                    <div className="mt-1 flex space-x-3 text-gray-600">
                                      <span>
                                        Name:{" "}
                                        {Math.round(dup.nameSimilarity * 100)}%
                                      </span>
                                      <span>
                                        Word:{" "}
                                        {Math.round(dup.wordSimilarity * 100)}%
                                      </span>
                                      <span>
                                        Char:{" "}
                                        {Math.round(dup.levenSimilarity * 100)}%
                                      </span>
                                      {dup.priceSimilarity > 0 && (
                                        <span>
                                          Price:{" "}
                                          {Math.round(
                                            dup.priceSimilarity * 100,
                                          )}
                                          %
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs ${
                                      dup.duplicateType === "exact"
                                        ? "bg-red-100 text-red-600"
                                        : dup.duplicateType === "high"
                                          ? "bg-orange-100 text-orange-600"
                                          : "bg-yellow-100 text-yellow-600"
                                    }`}
                                  >
                                    {dup.duplicateType}
                                  </span>
                                </div>
                              </div>
                            ))}
                            {duplicateMatches.length > 3 && (
                              <p className="text-yellow-600 text-xs">
                                ... and {duplicateMatches.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      {missingImages.length > 0 && (
                        <p className="text-yellow-700 text-sm">
                          • {missingImages.length} items missing images (will
                          use auto-generated placeholders)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Mapping Results */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {mappingResults.map((result, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-800">
                                {result.csvItem.name}
                              </h4>
                              {result.aiRecommendation && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    result.aiRecommendation === "match"
                                      ? "bg-orange-100 text-orange-600"
                                      : "bg-green-100 text-green-600"
                                  }`}
                                >
                                  🤖 AI: {result.aiRecommendation}
                                </span>
                              )}
                              {result.csvItem.aiConfidence && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs">
                                  {Math.round(
                                    result.csvItem.aiConfidence * 100,
                                  )}
                                  % confident
                                </span>
                              )}
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                {result.csvItem.extractedCategory ||
                                  result.csvItem.category}{" "}
                                • $
                                {result.csvItem.price ||
                                  result.csvItem.extractedPrice}
                                {result.csvItem.extractedDimensions && (
                                  <span className="ml-2 text-blue-600">
                                    📏 {result.csvItem.extractedDimensions}
                                  </span>
                                )}
                              </p>

                              {/* Show extracted AI data */}
                              {result.extractedData && (
                                <div className="bg-blue-50 p-2 rounded text-xs">
                                  <strong className="text-blue-800">
                                    🤖 AI Extracted:
                                  </strong>
                                  <div className="mt-1 flex flex-wrap gap-2">
                                    {result.csvItem.extractedBrand && (
                                      <span className="bg-white px-2 py-1 rounded border">
                                        Brand: {result.csvItem.extractedBrand}
                                      </span>
                                    )}
                                    {result.csvItem.extractedColor && (
                                      <span className="bg-white px-2 py-1 rounded border">
                                        Color: {result.csvItem.extractedColor}
                                      </span>
                                    )}
                                    {result.csvItem.extractedSize && (
                                      <span className="bg-white px-2 py-1 rounded border">
                                        Size: {result.csvItem.extractedSize}
                                      </span>
                                    )}
                                    {result.csvItem.extractedMaterial && (
                                      <span className="bg-white px-2 py-1 rounded border">
                                        Material:{" "}
                                        {result.csvItem.extractedMaterial}
                                      </span>
                                    )}
                                    {result.csvItem.extractedPrice &&
                                      result.csvItem.extractedPrice !==
                                        result.csvItem.price && (
                                        <span className="bg-yellow-100 px-2 py-1 rounded border border-yellow-300">
                                          Price: $
                                          {result.csvItem.extractedPrice}
                                        </span>
                                      )}
                                  </div>
                                  {result.csvItem.aiKeywords &&
                                    result.csvItem.aiKeywords.length > 0 && (
                                      <div className="mt-1">
                                        <span className="text-blue-700">
                                          Keywords:{" "}
                                        </span>
                                        {result.csvItem.aiKeywords.map(
                                          (keyword, idx) => (
                                            <span
                                              key={idx}
                                              className="inline-block bg-blue-200 px-1 py-0.5 rounded text-xs mr-1"
                                            >
                                              {keyword}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    )}

                                  {/* Show auto-mapped image info */}
                                  {result.csvItem.hasAutoMappedImage && (
                                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                      <div className="flex items-center space-x-2">
                                        <span className="text-green-600 font-medium text-xs">
                                          🖼️ Auto-mapped image
                                        </span>
                                        <span className="text-green-500 text-xs">
                                          from "{result.csvItem.imageMappedFrom}
                                          " (
                                          {Math.round(
                                            result.csvItem
                                              .imageMappingSimilarity * 100,
                                          )}
                                          % similarity)
                                        </span>
                                      </div>
                                    </div>
                                  )}

                                  {/* Show matched folder images info */}
                                  {result.csvItem.matchedImages &&
                                    result.csvItem.matchedImages.length > 0 && (
                                      <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                                        <div className="text-green-600 font-medium text-xs mb-1">
                                          📁 Matched with{" "}
                                          {result.csvItem.matchedImages.length}{" "}
                                          folder image(s)
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                          {result.csvItem.matchedImages
                                            .slice(0, 3)
                                            .map((img, idx) => (
                                              <span
                                                key={idx}
                                                className="text-green-500 text-xs bg-white px-1 py-0.5 rounded border"
                                              >
                                                {img.filename}
                                              </span>
                                            ))}
                                          {result.csvItem.matchedImages.length >
                                            3 && (
                                            <span className="text-green-500 text-xs">
                                              +
                                              {result.csvItem.matchedImages
                                                .length - 3}{" "}
                                              more
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                            </div>

                            {!result.isNewProduct &&
                              result.potentialMatches.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-orange-600 mb-1">
                                    Potential matches (
                                    {result.potentialMatches.length}):
                                  </p>
                                  <select
                                    className="w-full p-2 border border-gray-300 rounded text-sm"
                                    value={result.selectedMatch?.id || ""}
                                    onChange={(e) => {
                                      const selectedProduct =
                                        result.potentialMatches.find(
                                          (p) => p.id === e.target.value,
                                        );
                                      handleUserChoice(
                                        index,
                                        "match",
                                        selectedProduct,
                                      );
                                    }}
                                  >
                                    <option value="">Select a match...</option>
                                    {result.potentialMatches.map((match) => (
                                      <option key={match.id} value={match.id}>
                                        {match.name} (${match.price})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                          </div>

                          <div className="flex flex-col space-y-2 ml-4">
                            <Button
                              size="sm"
                              variant={
                                result.userChoice === "new"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleUserChoice(index, "new")}
                              className="text-xs"
                            >
                              Create New
                            </Button>
                            {!result.isNewProduct && (
                              <Button
                                size="sm"
                                variant={
                                  result.userChoice === "match"
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  handleUserChoice(
                                    index,
                                    "match",
                                    result.selectedMatch,
                                  )
                                }
                                className="text-xs"
                                disabled={!result.selectedMatch}
                              >
                                Update Existing
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant={
                                result.userChoice === "skip"
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => handleUserChoice(index, "skip")}
                              className="text-xs bg-red-50 hover:bg-red-100"
                            >
                              Skip
                            </Button>
                          </div>
                        </div>

                        {result.userChoice !== "pending" && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                            <strong>Action:</strong>{" "}
                            {result.userChoice === "new"
                              ? "Will create new product"
                              : result.userChoice === "match"
                                ? `Will update "${result.selectedMatch?.name}"`
                                : "Will skip this item"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4 pt-4 border-t">
                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-between items-center gap-3">
                      <div className="flex flex-wrap space-x-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            // Enhanced AI Auto-assign with confidence scoring
                            setMappingResults((prev) =>
                              prev.map((result) => {
                                if (result.isNewProduct) {
                                  return {
                                    ...result,
                                    userChoice: "new",
                                    selectedMatch: null,
                                  };
                                }

                                // Smart matching based on confidence and AI recommendation
                                const bestMatch = result.potentialMatches[0];
                                const shouldMatch =
                                  result.aiRecommendation === "match" ||
                                  result.matchConfidence > 0.8 ||
                                  (bestMatch &&
                                    bestMatch.categoryMatch &&
                                    result.matchConfidence > 0.6);

                                return {
                                  ...result,
                                  userChoice: shouldMatch ? "match" : "new",
                                  selectedMatch: shouldMatch ? bestMatch : null,
                                };
                              }),
                            );
                          }}
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                        >
                          🤖 AI Auto-Assign
                        </Button>

                        <Button
                          variant="outline"
                          onClick={async () => {
                            // Smart image mapping to similar named items
                            const updatedResults = await Promise.all(
                              mappingResults.map(async (result) => {
                                if (
                                  !result.csvItem.images ||
                                  result.csvItem.images === ""
                                ) {
                                  // Find images from similar named items in the mapping results
                                  const similarItems = mappingResults.filter(
                                    (otherResult) => {
                                      if (otherResult === result) return false;
                                      const similarity = calculateSimilarity(
                                        result.csvItem.name,
                                        otherResult.csvItem.name,
                                      );
                                      return (
                                        similarity > 0.7 &&
                                        otherResult.csvItem.images
                                      );
                                    },
                                  );

                                  if (similarItems.length > 0) {
                                    const bestSimilar = similarItems[0];
                                    return {
                                      ...result,
                                      csvItem: {
                                        ...result.csvItem,
                                        images: bestSimilar.csvItem.images,
                                        mappedFromSimilar:
                                          bestSimilar.csvItem.name,
                                      },
                                    };
                                  }
                                }
                                return result;
                              }),
                            );
                            setMappingResults(updatedResults);
                          }}
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                        >
                          🖼️ Map Images
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            setMappingResults((prev) =>
                              prev.map((result) => ({
                                ...result,
                                userChoice: "new",
                                selectedMatch: null,
                              })),
                            );
                          }}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          📦 Create All New
                        </Button>

                        <Button
                          variant="outline"
                          onClick={() => {
                            // Clear all selections and reset to pending
                            setMappingResults((prev) =>
                              prev.map((result) => ({
                                ...result,
                                userChoice: "pending",
                                selectedMatch: null,
                              })),
                            );
                          }}
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          🗑️ Clear All
                        </Button>
                      </div>

                      <Button
                        onClick={finalizeMappingAndUpdate}
                        disabled={mappingResults.some(
                          (r) => r.userChoice === "pending",
                        )}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        ✅ Finish Mapping (
                        {
                          mappingResults.filter((r) => r.userChoice !== "skip")
                            .length
                        }{" "}
                        items)
                      </Button>
                    </div>

                    {/* Status Summary */}
                    <div className="bg-gray-50 p-3 rounded-lg text-sm">
                      <div className="flex justify-between items-center">
                        <div className="grid grid-cols-4 gap-4 text-center flex-1">
                          <div>
                            <div className="font-medium text-green-600">
                              {
                                mappingResults.filter(
                                  (r) => r.userChoice === "new",
                                ).length
                              }
                            </div>
                            <div className="text-gray-500">New Products</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-600">
                              {
                                mappingResults.filter(
                                  (r) => r.userChoice === "match",
                                ).length
                              }
                            </div>
                            <div className="text-gray-500">Will Update</div>
                          </div>
                          <div>
                            <div className="font-medium text-red-600">
                              {
                                mappingResults.filter(
                                  (r) => r.userChoice === "skip",
                                ).length
                              }
                            </div>
                            <div className="text-gray-500">Skipped</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-600">
                              {
                                mappingResults.filter(
                                  (r) => r.userChoice === "pending",
                                ).length
                              }
                            </div>
                            <div className="text-gray-500">Pending</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Step */}
              {mappingStep === "validation" && (
                <div className="space-y-6 text-center">
                  <div>
                    <Wand2 className="w-16 h-16 mx-auto text-purple-600 mb-4 animate-spin" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      AI Validation in Progress
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Processing products, checking for duplicates, and
                      validating images...
                    </p>

                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${mappingProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {Math.round(mappingProgress)}% complete
                    </p>
                  </div>
                </div>
              )}

              {/* Complete Step */}
              {mappingStep === "complete" && validationResults && (
                <div className="space-y-6">
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      🎉 CSV Mapping Complete!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Your catalog has been successfully updated
                    </p>
                  </div>

                  {/* Results Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.newProducts}
                      </div>
                      <div className="text-sm text-gray-600">New Products</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {validationResults.updatedProducts}
                      </div>
                      <div className="text-sm text-gray-600">
                        Updated Products
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {validationResults.skippedProducts}
                      </div>
                      <div className="text-sm text-gray-600">Skipped</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {validationResults.totalProcessed}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Processed
                      </div>
                    </div>
                  </div>

                  {/* User Account Success */}
                  {validationResults.addedToUserAccount > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                          <Store className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-green-800 mb-1">
                            Successfully Added to Your Account!
                          </h4>
                          <p className="text-green-700 text-sm mb-2">
                            {validationResults.addedToUserAccount} products have
                            been added to your personal inventory and organized
                            into collections.
                          </p>
                          <div className="flex flex-wrap gap-2">
                            <Link to="/dashboard">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <User className="w-4 h-4 mr-2" />
                                View Dashboard
                              </Button>
                            </Link>
                            <Link to={`/shop/${user?.username}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-green-300 text-green-600 hover:bg-green-50"
                              >
                                <Store className="w-4 h-4 mr-2" />
                                Visit Your Shop
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Validation Issues */}
                  {(validationResults.duplicatesFound > 0 ||
                    validationResults.missingImages > 0) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        ⚠️ Issues Resolved
                      </h4>
                      {validationResults.duplicatesFound > 0 && (
                        <p className="text-yellow-700 text-sm">
                          • {validationResults.duplicatesFound} duplicates
                          identified and handled
                        </p>
                      )}
                      {validationResults.missingImages > 0 && (
                        <p className="text-yellow-700 text-sm">
                          • {validationResults.missingImages} items had missing
                          images (auto-generated placeholders applied)
                        </p>
                      )}
                    </div>
                  )}

                  {/* Download Options */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">
                      📥 Download Reports & Enhanced Data
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Enhanced CSV with all AI data */}
                      <Button
                        onClick={() => {
                          const enhancedCSVContent = [
                            // Comprehensive headers including all AI-extracted data
                            "name,price,original_price,category,description,brand,color,size,material,condition,tags,images,extracted_brand,extracted_color,extracted_size,extracted_material,extracted_price,extracted_dimensions,extracted_category,ai_keywords,ai_confidence,data_source,image_matches,filename,path,file_size,last_modified",
                            // Map all processed items with full data
                            ...mappingResults
                              .filter((r) => r.userChoice !== "skip")
                              .map((result) => {
                                const item = result.csvItem;
                                return [
                                  `"${item.name}"`,
                                  item.price || "",
                                  item.originalprice ||
                                    item.original_price ||
                                    "",
                                  item.extractedCategory || item.category || "",
                                  `"${item.description || `${item.name} - Premium ${item.category} item`}"`,
                                  item.extractedBrand || item.brand || "",
                                  item.extractedColor || item.color || "",
                                  item.extractedSize || item.size || "",
                                  item.extractedMaterial || item.material || "",
                                  item.extractedCondition ||
                                    item.condition ||
                                    "new",
                                  `"${typeof item.tags === "string" ? item.tags : (item.aiKeywords || []).join("|")}"`,
                                  `"${item.matchedImages ? item.matchedImages.map((img) => img.url).join("|") : item.images || ""}"`,
                                  item.extractedBrand || "",
                                  item.extractedColor || "",
                                  item.extractedSize || "",
                                  item.extractedMaterial || "",
                                  item.extractedPrice || "",
                                  item.extractedDimensions || "",
                                  item.extractedCategory || "",
                                  `"${(item.aiKeywords || []).join("|")}"`,
                                  item.aiConfidence ||
                                    item.combinedConfidence ||
                                    0.7,
                                  item.dataSource || "csv",
                                  item.imageMatches || 0,
                                  item.filename || "",
                                  item.path || "",
                                  item.fileSize || "",
                                  item.lastModified || new Date().toISOString(),
                                ].join(",");
                              }),
                          ].join("\n");

                          const blob = new Blob([enhancedCSVContent], {
                            type: "text/csv",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `enhanced-products-${new Date().toISOString().split("T")[0]}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        🤖 Enhanced CSV
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const reportData = {
                            summary: validationResults,
                            timestamp: new Date().toISOString(),
                            newProducts: products
                              .filter((p) => p.csvImported)
                              .slice(0, validationResults.newProducts),
                          };
                          const blob = new Blob(
                            [JSON.stringify(reportData, null, 2)],
                            { type: "application/json" },
                          );
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `csv-mapping-report-${new Date().toISOString().split("T")[0]}.json`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JSON Report
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const csvContent = [
                            "action,product_name,category,price,status",
                            ...mappingResults.map(
                              (result) =>
                                `${result.userChoice},${result.csvItem.name},${result.csvItem.category},${result.csvItem.price},${result.userChoice === "skip" ? "skipped" : "processed"}`,
                            ),
                          ].join("\n");
                          const blob = new Blob([csvContent], {
                            type: "text/csv",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `csv-mapping-log-${new Date().toISOString().split("T")[0]}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV Log
                      </Button>
                      <Button
                        onClick={() => {
                          const successProducts = products
                            .filter((p) => p.csvImported || p.csvUpdated)
                            .slice(
                              0,
                              validationResults.newProducts +
                                validationResults.updatedProducts,
                            );
                          const csvContent = [
                            "id,name,price,category,status,date_added",
                            ...successProducts.map(
                              (p) =>
                                `${p.id},${p.name},${p.price},${p.category},${p.status},${p.dateAdded}`,
                            ),
                          ].join("\n");
                          const blob = new Blob([csvContent], {
                            type: "text/csv",
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `updated-catalog-${new Date().toISOString().split("T")[0]}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Updated Catalog
                      </Button>
                    </div>
                  </div>

                  {/* Close Button */}
                  <div className="text-center pt-4 border-t">
                    <Button
                      onClick={() => {
                        setShowCSVMapping(false);
                        setMappingStep("upload");
                        setCsvData([]);
                        setMappingResults([]);
                        setValidationResults(null);
                        setMappingProgress(0);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Close & Return to Upload
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Component */}
      <BackToTop />
    </div>
  );
}
