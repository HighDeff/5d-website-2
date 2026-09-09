// Comprehensive Database Service for User Data, Files, and Security
// Handles all user data, portfolios, files, and admin functionality

import ValidationService from "./ValidationService";

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  phone?: string;
  passwordHash: string; // In production, this would be properly hashed
  firstName: string;
  lastName: string;
  fullName: string;

  // Account status
  status: "active" | "suspended" | "banned" | "pending_verification";
  verified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;

  // Security
  securityToken?: string;
  lastSecurityTokenGenerated?: string;
  twoFactorEnabled: boolean;
  securityQuestions?: Array<{
    question: string;
    answerHash: string;
  }>;

  // Portfolio data
  portfolio: UserPortfolio;

  // Account settings
  settings: UserSettings;

  // Files and documents
  files: UserFiles;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  lastActivityAt: string;
}

export interface UserPortfolio {
  // Sales data
  totalSales: number;
  totalEarnings: number;
  salesCount: number;
  salesHistory: Sale[];

  // Items data
  itemsSold: number;
  itemsInProgress: Item[];
  itemsActive: Item[];
  itemsCompleted: Item[];
  itemsReturned: Item[];

  // Offers
  offersMade: Offer[];
  offersReceived: Offer[];

  // Performance metrics
  rating: number;
  reviews: Review[];

  // Financial data
  commissionRate: number;
  membershipLevel: "free" | "member" | "premium";
  membershipExpiry?: string;
  payoutMethods: PayoutMethod[];
}

export interface UserSettings {
  // Privacy
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowOffers: boolean;

  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;

  // Preferences
  language: string;
  timezone: string;
  currency: string;
  theme: "light" | "dark" | "auto";

  // Security preferences
  requireTwoFactor: boolean;
  sessionTimeout: number;
  allowRememberMe: boolean;
}

export interface UserFiles {
  profilePicture?: FileRecord;
  documents: FileRecord[];
  productImages: FileRecord[];
  uploads: FileRecord[];
  folders: FileFolder[];
}

export interface FileRecord {
  id: string;
  originalName: string;
  storedName: string;
  type: string;
  size: number;
  url: string;
  folderId?: string;
  tags: string[];
  uploadedAt: string;
  lastModified: string;
}

export interface FileFolder {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: string;
  files: string[]; // File IDs
}

export interface Sale {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  commission: number;
  netEarnings: number;
  status:
    | "pending"
    | "completed"
    | "shipped"
    | "delivered"
    | "refunded"
    | "disputed";
  paymentMethod: string;
  date: string;
  completedAt?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: "draft" | "active" | "sold" | "inactive" | "returned";
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  favorites: number;
  offers: string[]; // Offer IDs
}

export interface Offer {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  itemName: string;
  originalPrice: number;
  offerAmount: number;
  message: string;
  status: "pending" | "accepted" | "declined" | "expired" | "withdrawn";
  createdAt: string;
  expiresAt: string;
  respondedAt?: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  rating: number;
  comment: string;
  saleId?: string;
  createdAt: string;
}

export interface PayoutMethod {
  id: string;
  type: "paypal" | "cashapp" | "bank" | "venmo";
  details: {
    email?: string;
    tag?: string;
    accountNumber?: string;
    routingNumber?: string;
  };
  isDefault: boolean;
  verified: boolean;
  addedAt: string;
}

export interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface SecurityToken {
  token: string;
  type: "email" | "sms" | "authenticator";
  purpose: "login" | "password_reset" | "account_verification" | "transaction";
  userId: string;
  expiresAt: string;
  usedAt?: string;
  attempts: number;
  maxAttempts: number;
}

export interface AdminData {
  users: UserAccount[];
  loginAttempts: LoginAttempt[];
  securityTokens: SecurityToken[];
  systemSettings: {
    commissionRates: {
      free: number;
      member: number;
      premium: number;
    };
    securitySettings: {
      tokenExpiryMinutes: number;
      maxLoginAttempts: number;
      sessionTimeoutMinutes: number;
    };
    fileSettings: {
      maxFileSize: number;
      allowedTypes: string[];
      maxStoragePerUser: number;
    };
  };
  reports: {
    totalUsers: number;
    activeUsers: number;
    totalSales: number;
    totalCommission: number;
    lastUpdated: string;
  };
}

export class DatabaseService {
  private static instance: DatabaseService;
  private readonly USER_STORAGE_KEY = "lillys_user_accounts";
  private readonly ADMIN_STORAGE_KEY = "lillys_admin_data";
  private readonly CURRENT_USER_KEY = "lillys_current_user";
  private readonly SECURITY_TOKENS_KEY = "lillys_security_tokens";
  private readonly LOGIN_ATTEMPTS_KEY = "lillys_login_attempts";

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ===== USER ACCOUNT MANAGEMENT =====

  async createAccount(userData: {
    username: string;
    email: string;
    phone?: string;
    password: string;
    firstName: string;
    lastName: string;
    membershipLevel?: "free" | "member" | "premium";
    profileImage?: File;
    documents?: File[];
  }): Promise<{
    success: boolean;
    user?: UserAccount;
    error?: string;
    validationResult?: any;
  }> {
    try {
      console.log(
        "👤 Creating new account with AI validation...",
        userData.username,
      );

      // AI-powered validation of account creation data
      const validationService = ValidationService.getInstance();
      const validationResult = await validationService.validateAccountCreation({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        profileImage: userData.profileImage,
        documents: userData.documents,
      });

      console.log("🤖 AI Validation Results:", {
        score: validationResult.score,
        isValid: validationResult.isValid,
        riskLevel: validationResult.riskLevel,
        issuesCount: validationResult.issues.length,
        suggestions: validationResult.suggestions,
      });

      // Log validation issues if any
      if (validationResult.issues.length > 0) {
        console.log("⚠️ Validation Issues Found:", validationResult.issues);
      }

      // Check validation results
      if (!validationResult.isValid) {
        const criticalIssues = validationResult.issues.filter(
          (issue) => issue.type === "error",
        );
        if (criticalIssues.length > 0) {
          return {
            success: false,
            error: `Account validation failed: ${criticalIssues[0].message}`,
            validationResult,
          };
        }
      }

      // Check if user already exists (additional check after validation)
      const existingUser = await this.findUserByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: "Account already exists with this email",
        };
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const newAccount: UserAccount = {
        id: userId,
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        passwordHash: this.hashPassword(userData.password), // Simple hash for demo
        firstName: userData.firstName,
        lastName: userData.lastName,
        fullName: `${userData.firstName} ${userData.lastName}`,

        status: "active",
        verified: false,
        emailVerified: false,
        phoneVerified: false,
        twoFactorEnabled: false,

        portfolio: {
          totalSales: 0,
          totalEarnings: 0,
          salesCount: 0,
          salesHistory: [],
          itemsSold: 0,
          itemsInProgress: [],
          itemsActive: [],
          itemsCompleted: [],
          itemsReturned: [],
          offersMade: [],
          offersReceived: [],
          rating: 5.0,
          reviews: [],
          commissionRate: this.getCommissionRate(
            userData.membershipLevel || "free",
          ),
          membershipLevel: userData.membershipLevel || "free",
          payoutMethods: [],
        },

        settings: {
          profileVisible: true,
          showEmail: false,
          showPhone: false,
          allowOffers: true,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true,
          marketingEmails: false,
          language: "en",
          timezone: "UTC",
          currency: "USD",
          theme: "light",
          requireTwoFactor: false,
          sessionTimeout: 60,
          allowRememberMe: true,
        },

        files: {
          documents: [],
          productImages: [],
          uploads: [],
          folders: [],
        },

        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
      };

      // Save to database
      await this.saveUserAccount(newAccount);

      console.log("✅ User account created:", {
        id: newAccount.id,
        name: newAccount.fullName,
        email: newAccount.email,
        membership: newAccount.portfolio.membershipLevel,
      });

      return { success: true, user: newAccount };
    } catch (error) {
      console.error("❌ Error creating account:", error);
      return { success: false, error: "Failed to create account" };
    }
  }

  async authenticateUser(
    emailOrPhone: string,
    password: string,
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    requiresTwoFactor?: boolean;
    error?: string;
  }> {
    try {
      const user = await this.findUserByEmailOrPhone(emailOrPhone);
      if (!user) {
        await this.logLoginAttempt(emailOrPhone, false, "User not found");
        return { success: false, error: "Account not found" };
      }

      // Check password
      if (!this.verifyPassword(password, user.passwordHash)) {
        await this.logLoginAttempt(emailOrPhone, false, "Invalid password");
        return { success: false, error: "Invalid password" };
      }

      // Check if account is suspended
      if (user.status === "suspended" || user.status === "banned") {
        await this.logLoginAttempt(
          emailOrPhone,
          false,
          `Account ${user.status}`,
        );
        return { success: false, error: `Account is ${user.status}` };
      }

      // Check if two-factor is required
      if (user.twoFactorEnabled || user.settings.requireTwoFactor) {
        return { success: false, requiresTwoFactor: true };
      }

      // Update last login
      user.lastLoginAt = new Date().toISOString();
      user.lastActivityAt = new Date().toISOString();
      await this.saveUserAccount(user);

      await this.logLoginAttempt(emailOrPhone, true);
      console.log("✅ User authenticated:", user.fullName);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Authentication error:", error);
      return { success: false, error: "Authentication failed" };
    }
  }

  // ===== SECURITY TOKEN SYSTEM =====

  async generateSecurityToken(
    userId: string,
    type: "email" | "sms" | "authenticator",
    purpose:
      | "login"
      | "password_reset"
      | "account_verification"
      | "transaction",
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    try {
      const token = this.generateRandomToken();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

      const securityToken: SecurityToken = {
        token,
        type,
        purpose,
        userId,
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
      };

      await this.saveSecurityToken(securityToken);

      // Update user record
      const user = await this.findUserById(userId);
      if (user) {
        user.securityToken = token;
        user.lastSecurityTokenGenerated = new Date().toISOString();
        await this.saveUserAccount(user);
      }

      console.log(
        `🔐 Security token generated for ${type}: ${token.substr(0, 3)}***`,
      );

      // Simulate sending token
      if (type === "email") {
        console.log(`📧 Sending security code via email: ${token}`);
      } else if (type === "sms") {
        console.log(`📱 Sending security code via SMS: ${token}`);
      }

      return { success: true, token };
    } catch (error) {
      console.error("❌ Error generating security token:", error);
      return { success: false, error: "Failed to generate security token" };
    }
  }

  async verifySecurityToken(
    userId: string,
    token: string,
    purpose: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const securityToken = await this.findSecurityToken(
        userId,
        token,
        purpose,
      );
      if (!securityToken) {
        return { success: false, error: "Invalid or expired security token" };
      }

      // Check if token is expired
      if (new Date() > new Date(securityToken.expiresAt)) {
        return { success: false, error: "Security token has expired" };
      }

      // Check attempts
      if (securityToken.attempts >= securityToken.maxAttempts) {
        return {
          success: false,
          error: "Too many attempts. Please request a new code.",
        };
      }

      // Mark as used
      securityToken.usedAt = new Date().toISOString();
      await this.saveSecurityToken(securityToken);

      console.log("✅ Security token verified successfully");
      return { success: true };
    } catch (error) {
      console.error("❌ Error verifying security token:", error);
      return { success: false, error: "Failed to verify security token" };
    }
  }

  // ===== FILE MANAGEMENT =====

  async uploadFile(
    userId: string,
    file: File,
    folderId?: string,
    tags: string[] = [],
  ): Promise<{ success: boolean; fileRecord?: FileRecord; error?: string }> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Check file size and type
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: "File too large. Maximum size is 10MB.",
        };
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "application/pdf",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: "File type not allowed" };
      }

      // Create file record
      const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      // In a real app, you would upload to cloud storage
      // For demo, we'll create a blob URL
      const url = URL.createObjectURL(file);

      const fileRecord: FileRecord = {
        id: fileId,
        originalName: file.name,
        storedName: `${fileId}_${file.name}`,
        type: file.type,
        size: file.size,
        url,
        folderId,
        tags,
        uploadedAt: now,
        lastModified: now,
      };

      // Add to user's files
      user.files.uploads.push(fileRecord);
      if (file.type.startsWith("image/")) {
        user.files.productImages.push(fileRecord);
      } else {
        user.files.documents.push(fileRecord);
      }

      await this.saveUserAccount(user);

      console.log("📁 File uploaded:", fileRecord.originalName);
      return { success: true, fileRecord };
    } catch (error) {
      console.error("❌ Error uploading file:", error);
      return { success: false, error: "Failed to upload file" };
    }
  }

  async createFolder(
    userId: string,
    name: string,
    description?: string,
    parentId?: string,
  ): Promise<{ success: boolean; folder?: FileFolder; error?: string }> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const folderId = `folder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const folder: FileFolder = {
        id: folderId,
        name,
        description,
        parentId,
        createdAt: now,
        files: [],
      };

      user.files.folders.push(folder);
      await this.saveUserAccount(user);

      console.log("📂 Folder created:", name);
      return { success: true, folder };
    } catch (error) {
      console.error("❌ Error creating folder:", error);
      return { success: false, error: "Failed to create folder" };
    }
  }

  // ===== PORTFOLIO MANAGEMENT =====

  async updatePortfolio(
    userId: string,
    updates: Partial<UserPortfolio>,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await this.findUserById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      user.portfolio = { ...user.portfolio, ...updates };
      user.updatedAt = new Date().toISOString();
      await this.saveUserAccount(user);

      console.log("📊 Portfolio updated for:", user.fullName);
      return { success: true };
    } catch (error) {
      console.error("❌ Error updating portfolio:", error);
      return { success: false, error: "Failed to update portfolio" };
    }
  }

  async recordSale(
    sellerId: string,
    saleData: Omit<Sale, "id" | "commission" | "netEarnings" | "date">,
  ): Promise<{ success: boolean; sale?: Sale; error?: string }> {
    try {
      const seller = await this.findUserById(sellerId);
      if (!seller) {
        return { success: false, error: "Seller not found" };
      }

      const saleId = `sale_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const commission =
        saleData.amount * (seller.portfolio.commissionRate / 100);
      const netEarnings = saleData.amount - commission;

      const sale: Sale = {
        ...saleData,
        id: saleId,
        commission,
        netEarnings,
        date: new Date().toISOString(),
      };

      // Update seller portfolio
      seller.portfolio.salesHistory.push(sale);
      seller.portfolio.totalSales += saleData.amount;
      seller.portfolio.totalEarnings += netEarnings;
      seller.portfolio.salesCount += 1;
      seller.portfolio.itemsSold += 1;

      await this.saveUserAccount(seller);

      console.log("💰 Sale recorded:", {
        amount: saleData.amount,
        commission,
        netEarnings,
        seller: seller.fullName,
      });

      return { success: true, sale };
    } catch (error) {
      console.error("❌ Error recording sale:", error);
      return { success: false, error: "Failed to record sale" };
    }
  }

  // ===== DATA PERSISTENCE =====

  private async saveUserAccount(user: UserAccount): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex((u) => u.id === user.id);

      if (userIndex >= 0) {
        users[userIndex] = user;
      } else {
        users.push(user);
      }

      localStorage.setItem(this.USER_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Failed to save user account:", error);
      throw error;
    }
  }

  private async getAllUsers(): Promise<UserAccount[]> {
    try {
      const data = localStorage.getItem(this.USER_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get users:", error);
      return [];
    }
  }

  private async findUserById(id: string): Promise<UserAccount | null> {
    const users = await this.getAllUsers();
    return users.find((u) => u.id === id) || null;
  }

  private async findUserByEmail(email: string): Promise<UserAccount | null> {
    const users = await this.getAllUsers();
    return users.find((u) => u.email === email) || null;
  }

  private async findUserByEmailOrPhone(
    emailOrPhone: string,
  ): Promise<UserAccount | null> {
    const users = await this.getAllUsers();
    return (
      users.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone) ||
      null
    );
  }

  private async saveSecurityToken(token: SecurityToken): Promise<void> {
    try {
      const tokens = await this.getSecurityTokens();
      const tokenIndex = tokens.findIndex(
        (t) =>
          t.userId === token.userId &&
          t.token === token.token &&
          t.purpose === token.purpose,
      );

      if (tokenIndex >= 0) {
        tokens[tokenIndex] = token;
      } else {
        tokens.push(token);
      }

      localStorage.setItem(this.SECURITY_TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error("Failed to save security token:", error);
      throw error;
    }
  }

  private async getSecurityTokens(): Promise<SecurityToken[]> {
    try {
      const data = localStorage.getItem(this.SECURITY_TOKENS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get security tokens:", error);
      return [];
    }
  }

  private async findSecurityToken(
    userId: string,
    token: string,
    purpose: string,
  ): Promise<SecurityToken | null> {
    const tokens = await this.getSecurityTokens();
    return (
      tokens.find(
        (t) =>
          t.userId === userId &&
          t.token === token &&
          t.purpose === purpose &&
          !t.usedAt,
      ) || null
    );
  }

  private async logLoginAttempt(
    email: string,
    success: boolean,
    errorMessage?: string,
  ): Promise<void> {
    try {
      const attempts = await this.getLoginAttempts();
      const attempt: LoginAttempt = {
        id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        success,
        timestamp: new Date().toISOString(),
        errorMessage,
      };

      attempts.push(attempt);

      // Keep only last 100 attempts
      if (attempts.length > 100) {
        attempts.splice(0, attempts.length - 100);
      }

      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error("Failed to log login attempt:", error);
    }
  }

  private async getLoginAttempts(): Promise<LoginAttempt[]> {
    try {
      const data = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get login attempts:", error);
      return [];
    }
  }

  // ===== UTILITY METHODS =====

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper bcrypt or similar
    return btoa(password + "salt_key_demo");
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  private generateRandomToken(): string {
    return Math.random().toString(36).substr(2, 6).toUpperCase();
  }

  private getCommissionRate(membershipLevel: string): number {
    const rates = { free: 15, member: 10, premium: 5 };
    return rates[membershipLevel] || 15;
  }

  // ===== PUBLIC API =====

  async getUserById(id: string): Promise<UserAccount | null> {
    return this.findUserById(id);
  }

  async getAllUsersForAdmin(): Promise<UserAccount[]> {
    return this.getAllUsers();
  }

  async getLoginAttemptsForAdmin(): Promise<LoginAttempt[]> {
    return this.getLoginAttempts();
  }

  async clearAllData(): Promise<void> {
    localStorage.removeItem(this.USER_STORAGE_KEY);
    localStorage.removeItem(this.ADMIN_STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.SECURITY_TOKENS_KEY);
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    console.log("🗑️ All database data cleared");
  }

  async exportUserData(userId: string): Promise<any> {
    const user = await this.findUserById(userId);
    if (!user) return null;

    // Remove sensitive data before export
    const exportData = {
      ...user,
      passwordHash: "[REDACTED]",
      securityToken: "[REDACTED]",
    };

    return exportData;
  }

  // AI-powered data validation and restoration methods
  async validateAndRestoreUserData(
    userId: string,
    options?: {
      includeProfilePicture?: boolean;
      includeDocuments?: boolean;
      includePortfolio?: boolean;
    },
  ): Promise<{ success: boolean; validationResult?: any; error?: string }> {
    try {
      const validationService = ValidationService.getInstance();
      const validationResult = await validationService.restoreUserInfo(userId, {
        includeProfilePicture: options?.includeProfilePicture ?? true,
        includeDocuments: options?.includeDocuments ?? true,
        includePortfolio: options?.includePortfolio ?? true,
      });

      console.log("🔍 Data validation and restoration completed:", {
        userId,
        score: validationResult.score,
        isValid: validationResult.isValid,
        issuesFound: validationResult.issues.length,
      });

      return {
        success: true,
        validationResult,
      };
    } catch (error) {
      console.error("❌ Data validation error:", error);
      return {
        success: false,
        error: "Data validation failed",
      };
    }
  }

  async validatePurchaseIntegrity(
    userId: string,
  ): Promise<{ success: boolean; validationResult?: any; error?: string }> {
    try {
      const validationService = ValidationService.getInstance();
      const validationResult =
        await validationService.validatePurchaseConsistency(userId);

      console.log("💰 Purchase integrity validation completed:", {
        userId,
        score: validationResult.score,
        isValid: validationResult.isValid,
        balanceIssues: validationResult.issues.filter(
          (i) => i.field.includes("earnings") || i.field.includes("balance"),
        ).length,
      });

      return {
        success: true,
        validationResult,
      };
    } catch (error) {
      console.error("❌ Purchase validation error:", error);
      return {
        success: false,
        error: "Purchase validation failed",
      };
    }
  }

  // Enable comprehensive monitoring
  enableSystemMonitoring(): void {
    console.log("📊 Starting comprehensive system monitoring...");
    // MonitoringService will be auto-started when imported
  }
}

export default DatabaseService.getInstance();
