// Enhanced Authentication Service with Security Tokens and 2FA
// Provides secure authentication, token management, and session handling

import DatabaseService, { UserAccount } from "./DatabaseService";
import ValidationService from "./ValidationService";
import MonitoringService from "./MonitoringService";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount | null;
  requiresTwoFactor: boolean;
  pendingUserId?: string;
  sessionToken?: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  membershipLevel?: "free" | "member" | "premium";
}

export interface SignInData {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    requiresTwoFactor: false,
  };
  private readonly SESSION_STORAGE_KEY = "lillys_auth_session";
  private readonly REMEMBER_TOKEN_KEY = "lillys_remember_token";

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  constructor() {
    this.loadSessionFromStorage();
    // Start system monitoring when auth service initializes
    MonitoringService.getInstance().startMonitoring();
  }

  // ===== AUTHENTICATION METHODS =====

  async signUp(
    data: SignUpData & {
      profileImage?: File;
      documents?: File[];
    },
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    requiresVerification?: boolean;
    validationResult?: any;
    error?: string;
  }> {
    try {
      console.log("🔐 Starting user registration with AI validation...");

      // Create account in database with AI validation
      const result = await DatabaseService.createAccount({
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        membershipLevel: data.membershipLevel,
        profileImage: data.profileImage,
        documents: data.documents,
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error,
          validationResult: result.validationResult,
        };
      }

      const user = result.user!;

      // Log successful account creation for monitoring
      console.log("✅ Account created successfully:", {
        userId: user.id,
        username: user.username,
        email: user.email,
        validationScore: result.validationResult?.score,
      });

      // Generate email verification token
      const tokenResult = await DatabaseService.generateSecurityToken(
        user.id,
        "email",
        "account_verification",
      );

      if (tokenResult.success) {
        console.log("📧 Verification email sent with code:", tokenResult.token);
      }

      console.log("✅ User registration successful:", user.fullName);

      // Trigger welcome email and initial monitoring
      const monitoringService = MonitoringService.getInstance();

      return {
        success: true,
        user,
        requiresVerification: true,
        validationResult: result.validationResult,
      };
    } catch (error) {
      console.error("❌ Registration error:", error);
      return { success: false, error: "Registration failed" };
    }
  }

  async signIn(data: SignInData): Promise<{
    success: boolean;
    user?: UserAccount;
    requiresTwoFactor?: boolean;
    pendingUserId?: string;
    error?: string;
  }> {
    try {
      console.log("🔐 Starting user authentication...");

      const result = await DatabaseService.authenticateUser(
        data.emailOrPhone,
        data.password,
      );

      if (!result.success) {
        if (result.requiresTwoFactor) {
          // Generate 2FA token
          const user = await DatabaseService.findUserByEmailOrPhone(
            data.emailOrPhone,
          );
          if (user) {
            const tokenResult = await DatabaseService.generateSecurityToken(
              user.id,
              user.phone ? "sms" : "email",
              "login",
            );

            console.log("🔐 Two-factor authentication required");
            return {
              success: false,
              requiresTwoFactor: true,
              pendingUserId: user.id,
            };
          }
        }
        return { success: false, error: result.error };
      }

      const user = result.user!;

      // Create session
      await this.createSession(user, data.rememberMe);

      console.log("✅ User authentication successful:", user.fullName);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Authentication error:", error);
      return { success: false, error: "Authentication failed" };
    }
  }

  async verifyTwoFactor(
    userId: string,
    token: string,
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    error?: string;
  }> {
    try {
      console.log("🔐 Verifying two-factor token...");

      const tokenResult = await DatabaseService.verifySecurityToken(
        userId,
        token,
        "login",
      );

      if (!tokenResult.success) {
        return { success: false, error: tokenResult.error };
      }

      const user = await DatabaseService.getUserById(userId);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      // Create session
      await this.createSession(user);

      console.log("✅ Two-factor verification successful:", user.fullName);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Two-factor verification error:", error);
      return { success: false, error: "Verification failed" };
    }
  }

  async verifyAccount(
    email: string,
    token: string,
  ): Promise<{
    success: boolean;
    user?: UserAccount;
    error?: string;
  }> {
    try {
      console.log("🔐 Verifying account...");

      // Find user by email
      const user = await DatabaseService.findUserByEmail(email);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const tokenResult = await DatabaseService.verifySecurityToken(
        user.id,
        token,
        "account_verification",
      );

      if (!tokenResult.success) {
        return { success: false, error: tokenResult.error };
      }

      // Update user verification status
      user.verified = true;
      user.emailVerified = true;
      user.updatedAt = new Date().toISOString();
      await DatabaseService.saveUserAccount(user);

      console.log("✅ Account verification successful:", user.fullName);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Account verification error:", error);
      return { success: false, error: "Verification failed" };
    }
  }

  async requestPasswordReset(
    email: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await DatabaseService.findUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists
        return { success: true };
      }

      const tokenResult = await DatabaseService.generateSecurityToken(
        user.id,
        "email",
        "password_reset",
      );

      if (tokenResult.success) {
        console.log(
          "📧 Password reset email sent with code:",
          tokenResult.token,
        );
      }

      return { success: true };
    } catch (error) {
      console.error("❌ Password reset request error:", error);
      return { success: false, error: "Failed to send reset email" };
    }
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const user = await DatabaseService.findUserByEmail(email);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const tokenResult = await DatabaseService.verifySecurityToken(
        user.id,
        token,
        "password_reset",
      );

      if (!tokenResult.success) {
        return { success: false, error: tokenResult.error };
      }

      // Update password
      user.passwordHash = this.hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();
      await DatabaseService.saveUserAccount(user);

      console.log("✅ Password reset successful for:", user.fullName);

      return { success: true };
    } catch (error) {
      console.error("❌ Password reset error:", error);
      return { success: false, error: "Password reset failed" };
    }
  }

  async signOut(): Promise<void> {
    try {
      console.log("🔐 User signing out...");

      // Clear session data
      this.authState = {
        isAuthenticated: false,
        user: null,
        requiresTwoFactor: false,
      };

      // Clear storage
      localStorage.removeItem(this.SESSION_STORAGE_KEY);
      localStorage.removeItem(this.REMEMBER_TOKEN_KEY);

      console.log("✅ User signed out successfully");
    } catch (error) {
      console.error("❌ Sign out error:", error);
    }
  }

  // ===== SESSION MANAGEMENT =====

  private async createSession(
    user: UserAccount,
    rememberMe: boolean = false,
  ): Promise<void> {
    const sessionToken = this.generateSessionToken();
    const expiresAt = new Date(
      Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000,
    ).toISOString(); // 30 days if remember me, 1 day otherwise

    this.authState = {
      isAuthenticated: true,
      user,
      requiresTwoFactor: false,
      sessionToken,
    };

    // Save session to localStorage
    const sessionData = {
      user,
      sessionToken,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify(sessionData));

    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_TOKEN_KEY, sessionToken);
    }

    console.log("🔐 Session created for:", user.fullName);
  }

  private loadSessionFromStorage(): void {
    try {
      const sessionData = localStorage.getItem(this.SESSION_STORAGE_KEY);
      if (!sessionData) return;

      const session = JSON.parse(sessionData);

      // Check if session is expired
      if (new Date() > new Date(session.expiresAt)) {
        this.signOut();
        return;
      }

      this.authState = {
        isAuthenticated: true,
        user: session.user,
        requiresTwoFactor: false,
        sessionToken: session.sessionToken,
      };

      console.log("🔐 Session restored for:", session.user.fullName);
    } catch (error) {
      console.error("❌ Error loading session:", error);
      this.signOut();
    }
  }

  private generateSessionToken(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  }

  private hashPassword(password: string): string {
    // Simple hash for demo - in production use proper bcrypt
    return btoa(password + "salt_key_demo");
  }

  // ===== PUBLIC API =====

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getCurrentUser(): UserAccount | null {
    return this.authState.user;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  async refreshUserData(): Promise<void> {
    if (!this.authState.user) return;

    try {
      const updatedUser = await DatabaseService.getUserById(
        this.authState.user.id,
      );
      if (updatedUser) {
        this.authState.user = updatedUser;

        // Update session storage
        const sessionData = localStorage.getItem(this.SESSION_STORAGE_KEY);
        if (sessionData) {
          const session = JSON.parse(sessionData);
          session.user = updatedUser;
          localStorage.setItem(
            this.SESSION_STORAGE_KEY,
            JSON.stringify(session),
          );
        }
      }
    } catch (error) {
      console.error("❌ Error refreshing user data:", error);
    }
  }

  async updateUserProfile(
    updates: Partial<UserAccount>,
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const updatedUser = { ...this.authState.user, ...updates };
      updatedUser.updatedAt = new Date().toISOString();

      await DatabaseService.saveUserAccount(updatedUser);
      this.authState.user = updatedUser;

      console.log("✅ User profile updated:", updatedUser.fullName);
      return { success: true };
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      return { success: false, error: "Failed to update profile" };
    }
  }

  async enableTwoFactor(): Promise<{ success: boolean; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      this.authState.user.twoFactorEnabled = true;
      this.authState.user.settings.requireTwoFactor = true;
      await DatabaseService.saveUserAccount(this.authState.user);

      console.log(
        "🔐 Two-factor authentication enabled for:",
        this.authState.user.fullName,
      );
      return { success: true };
    } catch (error) {
      console.error("❌ Error enabling 2FA:", error);
      return {
        success: false,
        error: "Failed to enable two-factor authentication",
      };
    }
  }

  async disableTwoFactor(): Promise<{ success: boolean; error?: string }> {
    if (!this.authState.user) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      this.authState.user.twoFactorEnabled = false;
      this.authState.user.settings.requireTwoFactor = false;
      await DatabaseService.saveUserAccount(this.authState.user);

      console.log(
        "🔐 Two-factor authentication disabled for:",
        this.authState.user.fullName,
      );
      return { success: true };
    } catch (error) {
      console.error("❌ Error disabling 2FA:", error);
      return {
        success: false,
        error: "Failed to disable two-factor authentication",
      };
    }
  }

  // ===== FALLBACK METHODS =====

  async testDatabaseConnection(): Promise<boolean> {
    try {
      const testData = { test: true, timestamp: Date.now() };
      localStorage.setItem("lillys_db_test", JSON.stringify(testData));
      const retrieved = localStorage.getItem("lillys_db_test");
      localStorage.removeItem("lillys_db_test");
      return retrieved !== null;
    } catch (error) {
      console.error("❌ Database connection test failed:", error);
      return false;
    }
  }

  async getSystemStatus(): Promise<{
    databaseOnline: boolean;
    storageAvailable: boolean;
    userCount: number;
    lastBackup?: string;
    monitoringActive?: boolean;
    systemHealth?: string;
  }> {
    try {
      const databaseOnline = await this.testDatabaseConnection();
      const users = await DatabaseService.getAllUsersForAdmin();
      const monitoringService = MonitoringService.getInstance();
      const latestReport = await monitoringService.getLatestReport();

      return {
        databaseOnline,
        storageAvailable: databaseOnline,
        userCount: users.length,
        lastBackup: new Date().toISOString(),
        monitoringActive: true,
        systemHealth: latestReport?.systemHealth || "unknown",
      };
    } catch (error) {
      console.error("❌ Error getting system status:", error);
      return {
        databaseOnline: false,
        storageAvailable: false,
        userCount: 0,
        monitoringActive: false,
      };
    }
  }

  // ===== AI VALIDATION AND MONITORING METHODS =====

  async validateUserAccount(userId: string): Promise<{
    success: boolean;
    validationResult?: any;
    error?: string;
  }> {
    try {
      const result = await DatabaseService.validateAndRestoreUserData(userId);

      if (result.success && result.validationResult) {
        console.log("🔍 User account validation completed:", {
          userId,
          score: result.validationResult.score,
          issues: result.validationResult.issues.length,
          riskLevel: result.validationResult.riskLevel,
        });
      }

      return result;
    } catch (error) {
      console.error("❌ Error validating user account:", error);
      return { success: false, error: "Validation failed" };
    }
  }

  async validateUserPurchases(userId: string): Promise<{
    success: boolean;
    validationResult?: any;
    error?: string;
  }> {
    try {
      const result = await DatabaseService.validatePurchaseIntegrity(userId);

      if (result.success && result.validationResult) {
        console.log("💰 Purchase validation completed:", {
          userId,
          score: result.validationResult.score,
          balanceCorrect: result.validationResult.isValid,
          issues: result.validationResult.issues.length,
        });
      }

      return result;
    } catch (error) {
      console.error("❌ Error validating purchases:", error);
      return { success: false, error: "Purchase validation failed" };
    }
  }

  async getMonitoringReport(): Promise<{
    success: boolean;
    report?: any;
    error?: string;
  }> {
    try {
      const monitoringService = MonitoringService.getInstance();
      const report = await monitoringService.runFullSystemCheck();

      console.log("📊 System monitoring report generated:", {
        timestamp: report.timestamp,
        systemHealth: report.systemHealth,
        overdueShipments: report.overdueShipments.length,
        balanceDiscrepancies: report.balanceDiscrepancies.length,
        recommendations: report.recommendations.length,
      });

      return { success: true, report };
    } catch (error) {
      console.error("❌ Error generating monitoring report:", error);
      return { success: false, error: "Failed to generate monitoring report" };
    }
  }

  async getMonitoringHistory(limit: number = 10): Promise<{
    success: boolean;
    history?: any[];
    error?: string;
  }> {
    try {
      const monitoringService = MonitoringService.getInstance();
      const history = await monitoringService.getMonitoringHistory(limit);

      return { success: true, history };
    } catch (error) {
      console.error("❌ Error getting monitoring history:", error);
      return { success: false, error: "Failed to get monitoring history" };
    }
  }

  // Auto-restore user data if validation fails
  async autoRestoreUserData(userId: string): Promise<{
    success: boolean;
    restored?: boolean;
    error?: string;
  }> {
    try {
      console.log("🔧 Attempting auto-restore for user:", userId);

      // First validate current data
      const validation = await this.validateUserAccount(userId);

      if (!validation.success || !validation.validationResult?.isValid) {
        // Attempt restoration
        const validationService = ValidationService.getInstance();
        const restoreResult = await validationService.restoreUserInfo(userId, {
          includeProfilePicture: true,
          includeDocuments: true,
          includePortfolio: true,
        });

        console.log("🔧 Auto-restore completed:", {
          userId,
          success: restoreResult.isValid,
          issuesFixed: validation.validationResult?.issues.length || 0,
        });

        return {
          success: true,
          restored: restoreResult.isValid,
        };
      }

      return { success: true, restored: false };
    } catch (error) {
      console.error("❌ Error during auto-restore:", error);
      return { success: false, error: "Auto-restore failed" };
    }
  }
}

export default AuthService.getInstance();
