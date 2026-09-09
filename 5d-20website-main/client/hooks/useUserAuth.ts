import { useState, useCallback, useEffect } from "react";
import AuthService from "@/services/AuthService";
import DatabaseService from "@/services/DatabaseService";
import EnhancedAuthService from "@/services/EnhancedAuthService";
import GuestSalesService from "@/services/GuestSalesService";
import AdminAccountService from "@/services/AdminAccountService";
import AIDataMonitoringService from "@/services/AIDataMonitoringService";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  phone?: string;
  address?: string;
  membershipLevel: "free" | "member" | "premium";
  memberSince: string;
  totalSales: number;
  totalPurchases: number;
  salesCount: number;
  purchaseCount: number;
  productCount: number;
  rating: number;
  favoriteProducts: string[];
  favoriteUsers: string[];
  profileImage?: string;
  avatar?: string;
  bio?: string;
  joinDate: string;
  lastActive: string;
  status: "active" | "suspended" | "banned";
  verified: boolean;
  paymentInfo?: {
    paypalEmail?: string;
    cashAppTag?: string;
    cardNumber?: string;
    expiryDate?: string;
  };
  preferences?: {
    notifications: boolean;
    marketing: boolean;
    publicProfile: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  dateAdded: string;
  status: "active" | "sold" | "inactive";
  views: number;
  favorites: number;
  tags: string[];
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  sellerId: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  commission: number;
  date: string;
  status: "pending" | "completed" | "shipped";
  paymentMethod: "paypal" | "cashapp";
  contactInfo: any;
}

// Function to ensure admin account exists
const ensureAdminAccount = () => {
  try {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const adminExists = users.find(
      (u: any) => u.email === "haynes.d1993@yahoo.com",
    );

    if (!adminExists) {
      const adminUser = {
        id: "admin_haynes_d1993",
        name: "Daniel Haynes",
        email: "haynes.d1993@yahoo.com",
        username: "dan_haynes_admin",
        phone: "",
        address: "",
        membershipLevel: "premium",
        memberSince: new Date().toISOString(),
        totalSales: 0,
        totalPurchases: 0,
        salesCount: 0,
        purchaseCount: 0,
        productCount: 0,
        rating: 5.0,
        favoriteProducts: [],
        favoriteUsers: [],
        profileImage:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Head Administrator - Platform Owner and Developer",
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        status: "active",
        verified: true,
        isAdmin: true,
        adminLevel: "super_admin",
        paymentInfo: {
          paypalEmail: "haynes.d1993@yahoo.com",
          cashAppTag: "$DanHaynes",
        },
      };

      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Admin account created: Daniel Haynes");
    } else {
      // Update existing admin properties
      adminExists.isAdmin = true;
      adminExists.adminLevel = "super_admin";
      adminExists.verified = true;
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Admin account updated: Daniel Haynes");
    }

    // If current user is admin, update their session
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.email === "haynes.d1993@yahoo.com") {
        user.isAdmin = true;
        user.adminLevel = "super_admin";
        user.verified = true;
        localStorage.setItem("currentUser", JSON.stringify(user));
      }
    }
  } catch (error) {
    console.error("Error ensuring admin account:", error);
  }
};

export function useUserAuth() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allSales, setAllSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on init
  useEffect(() => {
    // Initialize storage manager first to prevent quota issues
    initializeStorageManager();

    // Ensure admin account exists first
    ensureAdminAccount();

    const savedUser = localStorage.getItem("currentUser");
    const savedUsers = localStorage.getItem("users"); // Fixed: should be "users" not "allUsers"
    const savedProducts = localStorage.getItem("products"); // Fixed: should be "products"
    const savedSales = localStorage.getItem("sales"); // Fixed: should be "sales"

    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsSignedIn(true);
    }

    if (savedUsers) {
      const users = JSON.parse(savedUsers);
      setAllUsers(users);
    }

    if (savedProducts) {
      setAllProducts(JSON.parse(savedProducts));
    }

    if (savedSales) {
      setAllSales(JSON.parse(savedSales));
    }

    // Initialize system accounts (admin and template)
    AdminAccountService.initializeSystemAccounts();

    // Start AI monitoring
    AIDataMonitoringService.performFullDataAnalysis();

    // Set loading to false after all data is loaded
    setIsLoading(false);
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    // Use safe localStorage with quota management
    safeSetLocalStorageItem("allUsers", JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    safeSetLocalStorageItem("allProducts", JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    safeSetLocalStorageItem("allSales", JSON.stringify(allSales));
  }, [allSales]);

  const initializeStorageManager = async () => {
    try {
      const { default: LocalStorageManager } = await import(
        "../services/LocalStorageManager"
      );
      const storageManager = LocalStorageManager.getInstance();
      storageManager.initialize();

      // Log current usage for debugging
      console.log(storageManager.getUsageReport());
    } catch (error) {
      console.error("Error initializing storage manager:", error);
    }
  };

  const safeSetLocalStorageItem = async (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn(`📦 Quota exceeded for ${key}, using storage manager...`);

        try {
          const { default: LocalStorageManager } = await import(
            "../services/LocalStorageManager"
          );
          const storageManager = LocalStorageManager.getInstance();
          const success = storageManager.safeSetItem(key, value);

          if (!success) {
            console.error(`❌ Failed to save ${key} even with storage manager`);
          }
        } catch (importError) {
          console.error("Error importing storage manager:", importError);
        }
      } else {
        console.error(`Error setting ${key}:`, error);
      }
    }
  };

  const signUp = useCallback(
    (
      name: string,
      email: string,
      password: string,
      membershipLevel: "free" | "member" | "premium" = "free",
    ) => {
      try {
        console.log("SignUp function called with:", {
          name,
          email,
          membershipLevel,
        });
        console.log("Current allUsers:", allUsers);

        // Validate inputs
        if (!name || !email) {
          console.error("Missing required fields:", { name, email });
          return { success: false, error: "Name and email are required" };
        }

        // Check if user already exists
        const existingUser = allUsers.find((u) => u.email === email);
        if (existingUser) {
          console.error("User already exists:", existingUser);
          return {
            success: false,
            error: "User already exists with this email",
          };
        }

        const currentDate = new Date().toISOString();
        // Generate username from name and timestamp
        const baseUsername = name
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .substring(0, 10);
        const username = `${baseUsername}${Date.now().toString().slice(-4)}`;

        // Create fresh account using enhanced service
        const newUser = EnhancedAuthService.createFreshAccount({
          name,
          email,
          membershipLevel,
        });

        console.log("Creating new user:", newUser);

        // Migrate guest sales to new user account
        const migratedSales = EnhancedAuthService.migrateGuestSales(
          newUser,
          allSales,
        );
        if (migratedSales.length > allSales.length) {
          setAllSales(migratedSales);

          // Update user's sales count with migrated sales
          const guestSalesCount = migratedSales.length - allSales.length;
          newUser.salesCount += guestSalesCount;
          newUser.totalSales +=
            GuestSalesService.getGuestAnalytics().totalSales;
        }

        // Immediately save to localStorage to ensure persistence
        const updatedUsers = [...allUsers, newUser];
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(newUser));

        // Update state
        setAllUsers(updatedUsers);
        setCurrentUser(newUser);
        setIsSignedIn(true);

        console.log(
          "New user saved to localStorage and state updated:",
          newUser,
        );
        console.log("All users now:", updatedUsers);

        return { success: true, user: newUser };
      } catch (error) {
        console.error("Error in signUp function:", error);
        return {
          success: false,
          error: "Failed to create account: " + error.message,
        };
      }
    },
    [allUsers],
  );

  const signIn = useCallback(
    async (emailOrPhone: string, password: string) => {
      console.log("Attempting enhanced sign in with:", emailOrPhone);

      try {
        // Use enhanced auth service with AI verification
        const result = await EnhancedAuthService.verifyAndSignIn(
          emailOrPhone,
          password,
          allUsers,
          allSales,
        );

        if (result.success && result.user) {
          console.log("Enhanced verification successful:", result.user);

          // Update user state
          setCurrentUser(result.user);
          setIsSignedIn(true);

          // Force re-render by updating the users array
          setAllUsers((prev) =>
            prev.map((u) => (u.id === result.user!.id ? result.user! : u)),
          );

          // Migrate guest sales if any exist
          const migratedSales = GuestSalesService.migrateGuestSales(
            result.user,
            allSales,
          );
          if (migratedSales.length > allSales.length) {
            setAllSales(migratedSales);

            // Update user's sales count
            const guestSalesCount = migratedSales.length - allSales.length;
            const updatedUser = {
              ...result.user,
              salesCount: result.user.salesCount + guestSalesCount,
              totalSales:
                result.user.totalSales +
                GuestSalesService.getGuestAnalytics().totalSales,
            };

            setCurrentUser(updatedUser);
            GuestSalesService.clearGuestData();
          }

          return {
            success: true,
            user: result.user,
            verificationLevel: result.verificationLevel,
            warnings: result.warnings,
          };
        } else {
          console.log("Enhanced verification failed:", result.errors);
          return {
            success: false,
            error: result.errors.join(", ") || "Authentication failed",
            accountType: result.accountType,
          };
        }
      } catch (error) {
        console.error("Sign in error:", error);
        return {
          success: false,
          error: "Sign in failed: " + error.message,
        };
      }
    },
    [allUsers, allSales],
  );

  const signOut = useCallback(() => {
    setCurrentUser(null);
    setIsSignedIn(false);
    localStorage.removeItem("currentUser");
  }, []);

  const upgradeMembership = useCallback(() => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        membershipLevel: "member" as const,
      };
      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );
    }
  }, [currentUser]);

  const addProduct = useCallback(
    (
      productData: Omit<
        Product,
        "id" | "sellerId" | "sellerName" | "dateAdded" | "views" | "favorites"
      >,
    ) => {
      if (!currentUser) return { success: false, error: "Must be signed in" };

      const newProduct: Product = {
        ...productData,
        id: `product_${Date.now()}`,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        dateAdded: new Date().toISOString(),
        views: 0,
        favorites: 0,
      };

      // Update user's product count
      const updatedUser = {
        ...currentUser,
        productCount: currentUser.productCount + 1,
      };

      setAllProducts((prev) => [...prev, newProduct]);
      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );

      return { success: true, product: newProduct };
    },
    [currentUser],
  );

  const favoriteProduct = useCallback(
    (productId: string) => {
      if (!currentUser) return;

      const updatedUser = {
        ...currentUser,
        favoriteProducts: currentUser.favoriteProducts.includes(productId)
          ? currentUser.favoriteProducts.filter((id) => id !== productId)
          : [...currentUser.favoriteProducts, productId],
      };

      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );

      // Update product favorites count
      setAllProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? {
                ...p,
                favorites: updatedUser.favoriteProducts.includes(productId)
                  ? p.favorites + 1
                  : p.favorites - 1,
              }
            : p,
        ),
      );
    },
    [currentUser],
  );

  const favoriteUser = useCallback(
    (userId: string) => {
      if (!currentUser) return;

      const updatedUser = {
        ...currentUser,
        favoriteUsers: currentUser.favoriteUsers.includes(userId)
          ? currentUser.favoriteUsers.filter((id) => id !== userId)
          : [...currentUser.favoriteUsers, userId],
      };

      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );
    },
    [currentUser],
  );

  const recordSale = useCallback(
    (
      productId: string,
      buyerInfo: any,
      paymentMethod: "paypal" | "cashapp",
      contactInfo: any,
    ) => {
      if (!currentUser) return { success: false, error: "Must be signed in" };

      const product = allProducts.find((p) => p.id === productId);
      if (!product) return { success: false, error: "Product not found" };

      const commission = currentUser.membershipLevel === "member" ? 0.1 : 0.15; // 10% for members, 15% for free users
      const sellerAmount = product.price * (1 - commission);

      const newSale: Sale = {
        id: `sale_${Date.now()}`,
        productId,
        productName: product.name,
        sellerId: product.sellerId,
        buyerId: buyerInfo.id || `guest_${Date.now()}`,
        buyerName:
          buyerInfo.name || contactInfo.firstName + " " + contactInfo.lastName,
        amount: product.price,
        commission: product.price * commission,
        date: new Date().toISOString(),
        status: "pending",
        paymentMethod,
        contactInfo,
      };

      setAllSales((prev) => [...prev, newSale]);

      // Update seller's total sales
      const updatedUser = {
        ...currentUser,
        totalSales: currentUser.totalSales + sellerAmount,
      };
      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );

      // Mark product as sold
      setAllProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, status: "sold" as const } : p,
        ),
      );

      return { success: true, sale: newSale };
    },
    [currentUser, allProducts],
  );

  const getUserProducts = useCallback(
    (userId?: string) => {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) return [];
      return allProducts.filter((p) => p.sellerId === targetUserId);
    },
    [allProducts, currentUser],
  );

  const getUserSales = useCallback(
    (userId?: string) => {
      const targetUserId = userId || currentUser?.id;
      if (!targetUserId) return [];
      return allSales.filter((s) => s.sellerId === targetUserId);
    },
    [allSales, currentUser],
  );

  const getFavoriteProducts = useCallback(() => {
    if (!currentUser) return [];
    return allProducts.filter((p) =>
      currentUser.favoriteProducts.includes(p.id),
    );
  }, [allProducts, currentUser]);

  const updateUser = useCallback(
    (updatedUserData: Partial<User>) => {
      if (!currentUser) return { success: false, error: "No user logged in" };

      const updatedUser = { ...currentUser, ...updatedUserData };
      setCurrentUser(updatedUser);
      setAllUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? updatedUser : u)),
      );

      return { success: true, user: updatedUser };
    },
    [currentUser],
  );

  return {
    // User state
    currentUser,
    user: currentUser, // Alias for backward compatibility
    isSignedIn,
    isLoading,
    allUsers,

    // Data
    allProducts,
    allSales,

    // Auth actions
    signUp,
    signIn,
    signOut,
    updateUser,
    upgradeMembership,

    // Product actions
    addProduct,
    favoriteProduct,
    favoriteUser,

    // Sales actions
    recordSale,

    // Getters
    getUserProducts,
    getUserSales,
    getFavoriteProducts,
  };
}
