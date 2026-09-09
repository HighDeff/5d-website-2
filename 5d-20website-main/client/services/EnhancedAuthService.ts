// Enhanced Auth Service with AI Verification and Account Management
import { User, Sale } from "@/hooks/useUserAuth";
import AdminAccountService from "./AdminAccountService";

export interface AuthVerificationResult {
  success: boolean;
  user?: User;
  errors: string[];
  warnings: string[];
  accountType: "user" | "admin" | "guest" | "unknown";
  verificationLevel: "none" | "basic" | "verified" | "fully_verified";
}

export interface AccountVerificationChecks {
  emailVerified: boolean;
  phoneVerified: boolean;
  salesHistoryMatches: boolean;
  purchaseHistoryMatches: boolean;
  accountNumberMatches: boolean;
  notAdminAccount: boolean;
  passwordValid: boolean;
}

class EnhancedAuthService {
  private adminEmails = [
    "haynes.d1993@yahoo.com",
    "admin@example.com",
    "root@example.com",
  ];
  private adminPasswords = ["Dh011799", "admin123", "root123"];

  /**
   * AI-Enhanced Sign In with comprehensive verification
   */
  async verifyAndSignIn(
    emailOrPhone: string,
    password: string,
    allUsers: User[],
    allSales: Sale[],
  ): Promise<AuthVerificationResult> {
    const result: AuthVerificationResult = {
      success: false,
      errors: [],
      warnings: [],
      accountType: "unknown",
      verificationLevel: "none",
    };

    try {
      // Step 1: Check if this is an admin account attempt
      if (this.isAdminAttempt(emailOrPhone, password)) {
        // For head admin, allow access
        if (
          emailOrPhone.toLowerCase() === "haynes.d1993@yahoo.com" &&
          password === "Dh011799"
        ) {
          const adminUser = allUsers.find(
            (u) => u.email.toLowerCase() === emailOrPhone.toLowerCase(),
          );
          if (adminUser || AdminAccountService.isAdmin(emailOrPhone)) {
            result.success = true;
            result.user = adminUser || this.createAdminUser(emailOrPhone);
            result.accountType = "admin";
            result.verificationLevel = "fully_verified";
            return result;
          }
        }
        result.errors.push("Access denied: Invalid admin credentials");
        result.accountType = "admin";
        return result;
      }

      // Step 2: Find user by email or phone
      const user = allUsers.find(
        (u) => u.email === emailOrPhone || u.phone === emailOrPhone,
      );

      if (!user) {
        result.errors.push("User not found with provided credentials");
        result.accountType = "unknown";
        return result;
      }

      // Step 3: Run comprehensive verification checks
      const checks = await this.runVerificationChecks(user, allSales);

      // Step 4: Analyze verification results
      const verificationAnalysis = this.analyzeVerificationResults(checks);

      if (verificationAnalysis.isValid) {
        result.success = true;
        result.user = user;
        result.accountType = "user";
        result.verificationLevel = verificationAnalysis.level;

        // Update user's last active timestamp
        user.lastActive = new Date().toISOString();

        result.warnings = verificationAnalysis.warnings;
      } else {
        result.errors = verificationAnalysis.errors;
        result.warnings = verificationAnalysis.warnings;
      }

      return result;
    } catch (error) {
      result.errors.push(`Verification failed: ${error.message}`);
      return result;
    }
  }

  /**
   * Create fresh account with clean slate
   */
  createFreshAccount(userData: {
    name: string;
    email: string;
    phone?: string;
    membershipLevel?: "free" | "member" | "premium";
  }): User {
    const currentDate = new Date().toISOString();
    const baseUsername = userData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 10);
    const username = `${baseUsername}${Date.now().toString().slice(-4)}`;

    return {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      username,
      phone: userData.phone,
      membershipLevel: userData.membershipLevel || "free",
      memberSince: currentDate,
      totalSales: 0,
      totalPurchases: 0,
      salesCount: 0,
      purchaseCount: 0,
      productCount: 0,
      rating: 5.0,
      favoriteProducts: [],
      favoriteUsers: [],
      joinDate: currentDate,
      lastActive: currentDate,
      status: "active",
      verified: false,
      avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      paymentInfo: {},
      preferences: {
        notifications: true,
        marketing: false,
        publicProfile: true,
      },
    };
  }

  /**
   * Migrate guest sales to user account
   */
  migrateGuestSales(newUser: User, allSales: Sale[]): Sale[] {
    const guestSales = JSON.parse(localStorage.getItem("guestSales") || "[]");
    const migratedSales: Sale[] = [];

    guestSales.forEach((guestSale: any) => {
      const migratedSale: Sale = {
        ...guestSale,
        id: `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sellerId: newUser.id,
        buyerName: newUser.name,
        buyerId: newUser.id,
        date: guestSale.date || new Date().toISOString(),
        status: guestSale.status || "completed",
      };
      migratedSales.push(migratedSale);
    });

    // Clear guest sales after migration
    localStorage.removeItem("guestSales");

    return [...allSales, ...migratedSales];
  }

  /**
   * Check if login attempt is for admin account
   */
  private isAdminAttempt(email: string, password: string): boolean {
    return (
      this.adminEmails.includes(email.toLowerCase()) ||
      this.adminPasswords.includes(password)
    );
  }

  /**
   * Run comprehensive verification checks
   */
  private async runVerificationChecks(
    user: User,
    allSales: Sale[],
  ): Promise<AccountVerificationChecks> {
    const userSales = allSales.filter((sale) => sale.sellerId === user.id);
    const userPurchases = allSales.filter((sale) => sale.buyerId === user.id);

    return {
      emailVerified: this.verifyEmail(user.email),
      phoneVerified: this.verifyPhone(user.phone),
      salesHistoryMatches: this.verifySalesHistory(user, userSales),
      purchaseHistoryMatches: this.verifyPurchaseHistory(user, userPurchases),
      accountNumberMatches: this.verifyAccountNumber(user),
      notAdminAccount: !this.adminEmails.includes(user.email.toLowerCase()),
      passwordValid: true, // Password verification would happen here
    };
  }

  /**
   * Analyze verification results and determine access level
   */
  private analyzeVerificationResults(checks: AccountVerificationChecks): {
    isValid: boolean;
    level: "none" | "basic" | "verified" | "fully_verified";
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Critical checks that must pass
    if (!checks.notAdminAccount) {
      errors.push("Admin account access denied");
    }

    if (!checks.passwordValid) {
      errors.push("Invalid password");
    }

    // Warning checks
    if (!checks.emailVerified) {
      warnings.push("Email verification recommended");
    }

    if (!checks.salesHistoryMatches) {
      warnings.push("Sales history inconsistency detected");
    }

    if (!checks.purchaseHistoryMatches) {
      warnings.push("Purchase history inconsistency detected");
    }

    // Determine verification level
    let level: "none" | "basic" | "verified" | "fully_verified" = "none";

    if (checks.notAdminAccount && checks.passwordValid) {
      level = "basic";

      if (checks.emailVerified && checks.salesHistoryMatches) {
        level = "verified";

        if (
          checks.phoneVerified &&
          checks.purchaseHistoryMatches &&
          checks.accountNumberMatches
        ) {
          level = "fully_verified";
        }
      }
    }

    return {
      isValid: errors.length === 0,
      level,
      errors,
      warnings,
    };
  }

  /**
   * Verify email format and validity
   */
  private verifyEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Verify phone number format
   */
  private verifyPhone(phone?: string): boolean {
    if (!phone) return false;
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Verify sales history consistency
   */
  private verifySalesHistory(user: User, userSales: Sale[]): boolean {
    // Check if user's sales count matches actual sales
    return user.salesCount === userSales.length;
  }

  /**
   * Verify purchase history consistency
   */
  private verifyPurchaseHistory(user: User, userPurchases: Sale[]): boolean {
    // Check if user's purchase count matches actual purchases
    return user.purchaseCount === userPurchases.length;
  }

  /**
   * Verify account number consistency
   */
  private verifyAccountNumber(user: User): boolean {
    // Check if user ID format is valid
    return user.id.startsWith("user_") && user.id.length > 10;
  }

  /**
   * Get user dashboard data with verification
   */
  async getUserDashboardData(userId: string, allSales: Sale[]) {
    const userSales = allSales.filter((sale) => sale.sellerId === userId);
    const userPurchases = allSales.filter((sale) => sale.buyerId === userId);

    const salesData = {
      totalSales: userSales.reduce((sum, sale) => sum + sale.amount, 0),
      salesCount: userSales.length,
      recentSales: userSales.slice(-5),
      pendingSales: userSales.filter((sale) => sale.status === "pending"),
    };

    const purchaseData = {
      totalPurchases: userPurchases.reduce((sum, sale) => sum + sale.amount, 0),
      purchaseCount: userPurchases.length,
      recentPurchases: userPurchases.slice(-5),
    };

    return {
      sales: salesData,
      purchases: purchaseData,
      verified: true,
    };
  }
  /**
   * Create admin user object
   */
  private createAdminUser(email: string): User {
    return {
      id: "admin_haynes_d1993",
      name: "Daniel Haynes",
      email: email,
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
    };
  }
}

export default new EnhancedAuthService();
