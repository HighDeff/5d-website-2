// Admin Account Management Service
import { User } from "@/hooks/useUserAuth";

export interface AdminAccount {
  email: string;
  level: "super_admin" | "admin" | "moderator";
  permissions: string[];
  createdAt: string;
  lastLogin: string;
}

class AdminAccountService {
  private adminAccounts: AdminAccount[] = [];

  constructor() {
    this.initializeAdminAccounts();
  }

  /**
   * Initialize default admin accounts
   */
  private initializeAdminAccounts(): void {
    // Set head admin account
    const headAdmin: AdminAccount = {
      email: "haynes.d1993@yahoo.com",
      level: "super_admin",
      permissions: [
        "view_all_users",
        "edit_all_users",
        "delete_users",
        "view_analytics",
        "manage_products",
        "manage_sales",
        "system_settings",
        "ai_monitoring",
        "financial_reports",
      ],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    this.adminAccounts = [headAdmin];
    this.saveAdminAccounts();

    // Ensure head admin user exists in user system
    this.ensureHeadAdminUser();
  }

  /**
   * Ensure head admin user exists in the user system
   */
  private ensureHeadAdminUser(): void {
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const existingAdmin = users.find(
        (u: any) => u.email === "haynes.d1993@yahoo.com",
      );

      if (!existingAdmin) {
        const adminUser = {
          id: "admin_haynes_d1993",
          name: "Daniel Haynes",
          email: "haynes.d1993@yahoo.com",
          username: "dan_haynes_admin",
          password: "Dh011799",
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
        console.log("Head admin user created successfully");
      } else {
        // Update existing admin user properties
        existingAdmin.isAdmin = true;
        existingAdmin.adminLevel = "super_admin";
        existingAdmin.verified = true;
        if (!existingAdmin.name || existingAdmin.name === "Unknown") {
          existingAdmin.name = "Daniel Haynes";
        }
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Head admin user updated");
      }
    } catch (error) {
      console.error("Error ensuring head admin user:", error);
    }
  }

  /**
   * Check if email is admin
   */
  public isAdmin(email: string): boolean {
    return this.adminAccounts.some(
      (admin) => admin.email.toLowerCase() === email.toLowerCase(),
    );
  }

  /**
   * Get admin account by email
   */
  public getAdminAccount(email: string): AdminAccount | null {
    return (
      this.adminAccounts.find(
        (admin) => admin.email.toLowerCase() === email.toLowerCase(),
      ) || null
    );
  }

  /**
   * Create template account (Sarah Johnson)
   */
  public createTemplateAccount(): User {
    const templateUser: User = {
      id: "template_sarah_johnson",
      name: "Sarah Johnson",
      email: "sarah.johnson@template.com",
      username: "sarah_johnson_demo",
      phone: "(555) 123-4567",
      address: "123 Demo Street, Sample City, ST 12345",
      membershipLevel: "member",
      memberSince: "2023-01-15T00:00:00.000Z",
      totalSales: 2450.75,
      totalPurchases: 890.5,
      salesCount: 18,
      purchaseCount: 12,
      productCount: 25,
      rating: 4.8,
      favoriteProducts: ["demo-product-1", "demo-product-2", "demo-product-3"],
      favoriteUsers: ["demo-user-1"],
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      bio: "Template account showcasing platform features. Fashion enthusiast and small business owner selling vintage and handmade items.",
      joinDate: "2023-01-15T00:00:00.000Z",
      lastActive: new Date().toISOString(),
      status: "active",
      verified: true,
      paymentInfo: {
        paypalEmail: "sarah.demo@paypal.com",
        cashAppTag: "$SarahDemo",
      },
      preferences: {
        notifications: true,
        marketing: true,
        publicProfile: true,
      },
    };

    return templateUser;
  }

  /**
   * Create admin user account
   */
  public createAdminUserAccount(email: string): User {
    const adminUser: User = {
      id: `admin_${Date.now()}`,
      name: "Admin Account",
      email: email,
      username: `admin_${email.split("@")[0]}`,
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
      bio: "System Administrator Account",
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      status: "active",
      verified: true,
      paymentInfo: {},
      preferences: {
        notifications: true,
        marketing: false,
        publicProfile: false,
      },
    };

    return adminUser;
  }

  /**
   * Initialize system accounts
   */
  public initializeSystemAccounts(): { adminUser: User; templateUser: User } {
    const adminUser = this.createAdminUserAccount("haynes.d1993@yahoo.com");
    const templateUser = this.createTemplateAccount();

    // Load existing users
    const existingUsers = JSON.parse(
      localStorage.getItem("allUsers") || "[]",
    ) as User[];

    // Check if admin user already exists
    const adminExists = existingUsers.some(
      (u) => u.email === "haynes.d1993@yahoo.com",
    );
    const templateExists = existingUsers.some(
      (u) => u.email === "sarah.johnson@template.com",
    );

    let updatedUsers = [...existingUsers];

    if (!adminExists) {
      updatedUsers.push(adminUser);
    }

    if (!templateExists) {
      updatedUsers.push(templateUser);
    }

    // Save updated users with quota management
    this.saveUsersWithQuotaManagement(updatedUsers);

    return { adminUser, templateUser };
  }

  /**
   * Save users with localStorage quota management
   */
  private saveUsersWithQuotaManagement(users: any[]): void {
    try {
      // First, try to clean up old data
      this.cleanupOldData();

      // Try to save the users
      const usersJson = JSON.stringify(users);
      localStorage.setItem("allUsers", usersJson);

      console.log(`✅ Saved ${users.length} users to localStorage`);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn("📦 localStorage quota exceeded, implementing cleanup...");

        // More aggressive cleanup
        this.aggressiveCleanup();

        try {
          // Try saving a reduced dataset
          const reducedUsers = this.reduceUserData(users);
          const reducedJson = JSON.stringify(reducedUsers);
          localStorage.setItem("allUsers", reducedJson);

          console.log(
            `✅ Saved ${reducedUsers.length} reduced users after cleanup`,
          );
        } catch (secondError) {
          console.error("��� Still unable to save after cleanup:", secondError);

          // Last resort: save only essential users
          this.saveEssentialUsersOnly(users);
        }
      } else {
        console.error("Error saving users:", error);
        throw error;
      }
    }
  }

  /**
   * Clean up old data from localStorage
   */
  private cleanupOldData(): void {
    const keysToClean = [
      "ai-central-database",
      "ai-autofix-notifications",
      "guestUploads",
      "shopping-cart",
      "userFavorites",
      "products",
      "clickEvents",
      "aiClickEvents",
      "interactions",
      "productStats",
    ];

    let cleanedCount = 0;

    keysToClean.forEach((key) => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);

          // If it's an array, keep only recent items
          if (Array.isArray(parsed)) {
            if (parsed.length > 100) {
              const reduced = parsed.slice(-50); // Keep last 50 items
              localStorage.setItem(key, JSON.stringify(reduced));
              cleanedCount += parsed.length - reduced.length;
            }
          }
          // If it's an object with timestamp, check if it's old
          else if (parsed.timestamp) {
            const age = Date.now() - new Date(parsed.timestamp).getTime();
            if (age > 7 * 24 * 60 * 60 * 1000) {
              // Older than 7 days
              localStorage.removeItem(key);
              cleanedCount++;
            }
          }
        }
      } catch (error) {
        // If parsing fails, remove the corrupt data
        localStorage.removeItem(key);
        cleanedCount++;
      }
    });

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old localStorage items`);
    }
  }

  /**
   * Aggressive cleanup when quota is exceeded
   */
  private aggressiveCleanup(): void {
    console.log("🔥 Performing aggressive localStorage cleanup...");

    // Remove all non-essential data
    const essentialKeys = ["user", "allUsers", "isSignedIn"];
    const allKeys = Object.keys(localStorage);

    let removedCount = 0;
    allKeys.forEach((key) => {
      if (!essentialKeys.includes(key)) {
        localStorage.removeItem(key);
        removedCount++;
      }
    });

    console.log(`🔥 Removed ${removedCount} non-essential localStorage items`);
  }

  /**
   * Reduce user data size by removing non-essential fields
   */
  private reduceUserData(users: any[]): any[] {
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      verified: user.verified,
      status: user.status,
      joinDate: user.joinDate,
      // Remove large fields like favorites, purchase history, etc.
    }));
  }

  /**
   * Save only essential users (admin accounts)
   */
  private saveEssentialUsersOnly(users: any[]): void {
    try {
      // Keep only admin users and essential accounts
      const essentialUsers = users.filter(
        (user) =>
          user.isAdmin ||
          user.email === "haynes.d1993@yahoo.com" ||
          user.email === "template@example.com",
      );

      const essentialJson = JSON.stringify(essentialUsers);
      localStorage.setItem("allUsers", essentialJson);

      console.log(
        `⚠️ Saved only ${essentialUsers.length} essential users due to quota limits`,
      );
    } catch (error) {
      console.error("❌ Failed to save even essential users:", error);

      // Complete fallback - create minimal admin user
      const minimalAdmin = [
        {
          id: "admin-001",
          name: "Dan Haynes",
          email: "haynes.d1993@yahoo.com",
          isAdmin: true,
          verified: true,
          status: "active",
          joinDate: new Date().toISOString(),
        },
      ];

      try {
        localStorage.setItem("allUsers", JSON.stringify(minimalAdmin));
        console.log("💾 Saved minimal admin user as fallback");
      } catch (finalError) {
        console.error("💥 Complete localStorage failure:", finalError);
      }
    }
  }

  /**
   * Get localStorage usage statistics
   */
  public getStorageStats(): {
    used: number;
    available: number;
    percentage: number;
    items: number;
  } {
    let totalSize = 0;
    let itemCount = 0;

    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
        itemCount++;
      }
    }

    // Rough estimate of localStorage limit (5MB in most browsers)
    const limit = 5 * 1024 * 1024;

    return {
      used: totalSize,
      available: limit - totalSize,
      percentage: (totalSize / limit) * 100,
      items: itemCount,
    };
  }

  /**
   * Validate admin login
   */
  public validateAdminLogin(
    email: string,
    password: string,
  ): {
    valid: boolean;
    admin?: AdminAccount;
    error?: string;
  } {
    // Check if it's the head admin
    if (
      email.toLowerCase() === "haynes.d1993@yahoo.com" &&
      password === "Dh011799"
    ) {
      const admin = this.getAdminAccount(email);
      if (admin) {
        // Update last login
        admin.lastLogin = new Date().toISOString();
        this.saveAdminAccounts();

        return {
          valid: true,
          admin,
        };
      }
    }

    return {
      valid: false,
      error: "Invalid admin credentials",
    };
  }

  /**
   * Check admin permissions
   */
  public hasPermission(email: string, permission: string): boolean {
    const admin = this.getAdminAccount(email);
    return admin ? admin.permissions.includes(permission) : false;
  }

  /**
   * Save admin accounts
   */
  private saveAdminAccounts(): void {
    try {
      localStorage.setItem("adminAccounts", JSON.stringify(this.adminAccounts));
    } catch (error) {
      console.error("Error saving admin accounts:", error);
    }
  }

  /**
   * Load admin accounts
   */
  private loadAdminAccounts(): void {
    try {
      const saved = localStorage.getItem("adminAccounts");
      if (saved) {
        this.adminAccounts = JSON.parse(saved);
      }
    } catch (error) {
      console.error("Error loading admin accounts:", error);
    }
  }
}

export default new AdminAccountService();
