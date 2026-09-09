// AI-Powered Validation Service for Account Creation and Data Integrity
// Ensures files, information, and site details are correct and consistent

import DatabaseService, { UserAccount, UserFile } from "./DatabaseService";

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100 confidence score
  issues: ValidationIssue[];
  suggestions: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface ValidationIssue {
  type: "error" | "warning" | "info";
  field: string;
  message: string;
  severity: number; // 1-10
  fixSuggestion?: string;
}

export interface ImageValidationResult extends ValidationResult {
  imageQuality: number;
  faceDetected: boolean;
  appropriateContent: boolean;
  dimensionsValid: boolean;
  fileSize: number;
  format: string;
}

export interface DataRestoreOptions {
  includeProfilePicture: boolean;
  includeDocuments: boolean;
  includePortfolio: boolean;
  backupDate?: string;
}

export class ValidationService {
  private static instance: ValidationService;
  private readonly MIN_VALIDATION_SCORE = 75;
  private readonly PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly DOCUMENT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  // AI-powered account creation validation
  async validateAccountCreation(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone?: string;
    profileImage?: File;
    documents?: File[];
  }): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Validate name consistency
    const nameValidation = await this.validateNameConsistency(
      userData.firstName,
      userData.lastName,
    );
    if (!nameValidation.isValid) {
      issues.push(...nameValidation.issues);
      score -= 15;
    }

    // Validate email format and domain
    const emailValidation = await this.validateEmailAddress(userData.email);
    if (!emailValidation.isValid) {
      issues.push(...emailValidation.issues);
      score -= 20;
    }

    // Validate phone number if provided
    if (userData.phone) {
      const phoneValidation = await this.validatePhoneNumber(userData.phone);
      if (!phoneValidation.isValid) {
        issues.push(...phoneValidation.issues);
        score -= 10;
      }
    }

    // Validate username uniqueness and appropriateness
    const usernameValidation = await this.validateUsername(userData.username);
    if (!usernameValidation.isValid) {
      issues.push(...usernameValidation.issues);
      score -= 25;
    }

    // Validate profile image if provided
    if (userData.profileImage) {
      const imageValidation = await this.validateProfileImage(
        userData.profileImage,
      );
      if (!imageValidation.isValid) {
        issues.push(...imageValidation.issues);
        score -= 15;
      }
    }

    // Validate documents if provided
    if (userData.documents && userData.documents.length > 0) {
      const docValidation = await this.validateDocuments(userData.documents);
      if (!docValidation.isValid) {
        issues.push(...docValidation.issues);
        score -= 10;
      }
    }

    // Check for potential duplicate accounts
    const duplicateCheck = await this.checkForDuplicateAccounts(userData);
    if (!duplicateCheck.isValid) {
      issues.push(...duplicateCheck.issues);
      score -= 30;
    }

    return {
      isValid: score >= this.MIN_VALIDATION_SCORE,
      score: Math.max(0, score),
      issues,
      suggestions: this.generateSuggestions(issues),
      riskLevel: this.calculateRiskLevel(score, issues),
    };
  }

  // Validate profile images using AI-like analysis
  async validateProfileImage(imageFile: File): Promise<ImageValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check file size
    if (imageFile.size > this.PROFILE_IMAGE_MAX_SIZE) {
      issues.push({
        type: "error",
        field: "profileImage",
        message: "Profile image exceeds maximum size limit",
        severity: 8,
        fixSuggestion: "Compress image to under 5MB",
      });
      score -= 20;
    }

    // Check file format
    const validFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!validFormats.includes(imageFile.type)) {
      issues.push({
        type: "error",
        field: "profileImage",
        message: "Invalid image format",
        severity: 7,
        fixSuggestion: "Use JPEG, PNG, or WebP format",
      });
      score -= 15;
    }

    // Simulate AI image analysis
    const imageAnalysis = await this.analyzeImageContent(imageFile);

    if (!imageAnalysis.appropriateContent) {
      issues.push({
        type: "error",
        field: "profileImage",
        message: "Image content may not be appropriate for profile",
        severity: 9,
        fixSuggestion: "Upload a clear, professional photo",
      });
      score -= 40;
    }

    if (!imageAnalysis.faceDetected) {
      issues.push({
        type: "warning",
        field: "profileImage",
        message: "No face detected in profile image",
        severity: 5,
        fixSuggestion:
          "Consider uploading a photo that clearly shows your face",
      });
      score -= 10;
    }

    return {
      isValid: score >= this.MIN_VALIDATION_SCORE,
      score: Math.max(0, score),
      issues,
      suggestions: this.generateSuggestions(issues),
      riskLevel: this.calculateRiskLevel(score, issues),
      imageQuality: imageAnalysis.quality,
      faceDetected: imageAnalysis.faceDetected,
      appropriateContent: imageAnalysis.appropriateContent,
      dimensionsValid: imageAnalysis.dimensionsValid,
      fileSize: imageFile.size,
      format: imageFile.type,
    };
  }

  // Restore user information and check for data corruption
  async restoreUserInfo(
    userId: string,
    options: DataRestoreOptions = {
      includeProfilePicture: true,
      includeDocuments: true,
      includePortfolio: true,
    },
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    const db = DatabaseService; // DatabaseService is already an instance
    const user = await db.getUserById(userId);

    if (!user) {
      return {
        isValid: false,
        score: 0,
        issues: [
          {
            type: "error",
            field: "user",
            message: "User account not found for restoration",
            severity: 10,
          },
        ],
        suggestions: ["Check user ID and try again"],
        riskLevel: "high",
      };
    }

    // Check for missing or corrupted profile data
    if (!user.firstName || !user.lastName || !user.email) {
      issues.push({
        type: "error",
        field: "profile",
        message: "Critical profile information is missing",
        severity: 9,
        fixSuggestion:
          "Restore from backup or request user to re-enter information",
      });
      score -= 30;
    }

    // Validate portfolio data integrity
    if (options.includePortfolio) {
      const portfolioValidation = await this.validatePortfolioIntegrity(user);
      if (!portfolioValidation.isValid) {
        issues.push(...portfolioValidation.issues);
        score -= 20;
      }
    }

    // Check profile picture integrity
    if (options.includeProfilePicture && user.files.profilePicture) {
      const imageValidation = await this.checkImageIntegrity(
        user.files.profilePicture,
      );
      if (!imageValidation.isValid) {
        issues.push(...imageValidation.issues);
        score -= 15;
      }
    }

    // Validate documents
    if (options.includeDocuments && user.files.documents.length > 0) {
      const docValidation = await this.validateStoredDocuments(
        user.files.documents,
      );
      if (!docValidation.isValid) {
        issues.push(...docValidation.issues);
        score -= 10;
      }
    }

    // Attempt auto-restoration for fixable issues
    if (issues.length > 0) {
      await this.attemptAutoRestore(userId, issues);
    }

    return {
      isValid: score >= this.MIN_VALIDATION_SCORE,
      score: Math.max(0, score),
      issues,
      suggestions: this.generateRestorationSuggestions(issues),
      riskLevel: this.calculateRiskLevel(score, issues),
    };
  }

  // Validate purchase and balance consistency
  async validatePurchaseConsistency(userId: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    const db = DatabaseService; // DatabaseService is already an instance
    const user = await db.getUserById(userId);

    if (!user) {
      return {
        isValid: false,
        score: 0,
        issues: [
          {
            type: "error",
            field: "user",
            message: "User not found for purchase validation",
            severity: 10,
          },
        ],
        suggestions: [],
        riskLevel: "high",
      };
    }

    // Validate sales calculations
    const calculatedEarnings = user.portfolio.sales.reduce(
      (total, sale) => total + sale.amount,
      0,
    );
    const commissionRate = 0.1; // 10% commission
    const expectedEarnings = calculatedEarnings * (1 - commissionRate);

    if (Math.abs(user.portfolio.totalEarnings - expectedEarnings) > 0.01) {
      issues.push({
        type: "error",
        field: "earnings",
        message: "Total earnings don't match calculated amount",
        severity: 8,
        fixSuggestion: "Recalculate earnings based on sales and commission",
      });
      score -= 25;
    }

    // Validate purchase history
    for (const purchase of user.portfolio.purchases) {
      if (!purchase.itemId || !purchase.amount || !purchase.date) {
        issues.push({
          type: "warning",
          field: "purchases",
          message: `Incomplete purchase record: ${purchase.id}`,
          severity: 6,
          fixSuggestion: "Request missing purchase information",
        });
        score -= 10;
      }
    }

    // Check for duplicate transactions
    const transactionIds = user.portfolio.sales.map((s) => s.id);
    const duplicates = transactionIds.filter(
      (id, index) => transactionIds.indexOf(id) !== index,
    );

    if (duplicates.length > 0) {
      issues.push({
        type: "error",
        field: "transactions",
        message: "Duplicate transaction IDs detected",
        severity: 9,
        fixSuggestion: "Remove duplicate transactions",
      });
      score -= 20;
    }

    return {
      isValid: score >= this.MIN_VALIDATION_SCORE,
      score: Math.max(0, score),
      issues,
      suggestions: this.generateSuggestions(issues),
      riskLevel: this.calculateRiskLevel(score, issues),
    };
  }

  // Private helper methods for AI-like validation

  private async validateNameConsistency(
    firstName: string,
    lastName: string,
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check for common name patterns and potential issues
    if (firstName.length < 2 || lastName.length < 2) {
      issues.push({
        type: "warning",
        field: "name",
        message: "Names appear unusually short",
        severity: 4,
      });
      score -= 10;
    }

    // Check for special characters
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      issues.push({
        type: "warning",
        field: "name",
        message: "Names contain unusual characters",
        severity: 5,
      });
      score -= 15;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async validateEmailAddress(email: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      issues.push({
        type: "error",
        field: "email",
        message: "Invalid email format",
        severity: 8,
      });
      score -= 30;
    }

    // Check for common disposable email domains
    const disposableDomains = [
      "tempmail.org",
      "10minutemail.com",
      "guerrillamail.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      issues.push({
        type: "warning",
        field: "email",
        message: "Temporary email address detected",
        severity: 6,
      });
      score -= 20;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async validatePhoneNumber(phone: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Basic phone validation (US format)
    const phoneRegex =
      /^\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phone)) {
      issues.push({
        type: "warning",
        field: "phone",
        message: "Phone number format may be invalid",
        severity: 5,
      });
      score -= 15;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async validateUsername(username: string): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check username requirements
    if (username.length < 3 || username.length > 20) {
      issues.push({
        type: "error",
        field: "username",
        message: "Username must be 3-20 characters long",
        severity: 7,
      });
      score -= 25;
    }

    // Check for inappropriate content
    const inappropriateWords = [
      "admin",
      "moderator",
      "support",
      "staff",
      "official",
    ];
    if (
      inappropriateWords.some((word) => username.toLowerCase().includes(word))
    ) {
      issues.push({
        type: "warning",
        field: "username",
        message: "Username may contain restricted terms",
        severity: 6,
      });
      score -= 20;
    }

    // Check uniqueness
    const db = DatabaseService; // DatabaseService is already an instance
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      issues.push({
        type: "error",
        field: "username",
        message: "Username is already taken",
        severity: 8,
      });
      score -= 30;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async analyzeImageContent(imageFile: File): Promise<{
    quality: number;
    faceDetected: boolean;
    appropriateContent: boolean;
    dimensionsValid: boolean;
  }> {
    // Simulate AI image analysis
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          quality: Math.random() * 40 + 60, // 60-100
          faceDetected: Math.random() > 0.3, // 70% chance
          appropriateContent: Math.random() > 0.1, // 90% chance
          dimensionsValid: imageFile.size < this.PROFILE_IMAGE_MAX_SIZE,
        });
      }, 500);
    });
  }

  private async validateDocuments(
    documents: File[],
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    for (const doc of documents) {
      if (doc.size > this.DOCUMENT_MAX_SIZE) {
        issues.push({
          type: "error",
          field: "documents",
          message: `Document ${doc.name} exceeds size limit`,
          severity: 7,
        });
        score -= 15;
      }
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async checkForDuplicateAccounts(
    userData: any,
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    const db = DatabaseService; // DatabaseService is already an instance

    // Check for existing email
    const existingEmailUser = await db.getUserByEmail(userData.email);
    if (existingEmailUser) {
      issues.push({
        type: "error",
        field: "email",
        message: "Account with this email already exists",
        severity: 9,
      });
      score -= 40;
    }

    // Check for existing phone
    if (userData.phone) {
      const existingPhoneUser = await db.getUserByPhone(userData.phone);
      if (existingPhoneUser) {
        issues.push({
          type: "warning",
          field: "phone",
          message: "Account with this phone number already exists",
          severity: 7,
        });
        score -= 25;
      }
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "medium",
    };
  }

  private async validatePortfolioIntegrity(
    user: UserAccount,
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    if (user.portfolio.salesCount !== user.portfolio.sales.length) {
      issues.push({
        type: "error",
        field: "portfolio",
        message: "Sales count doesn't match actual sales records",
        severity: 8,
      });
      score -= 20;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async checkImageIntegrity(
    imageUrl: string,
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Simulate checking if image is accessible
    if (Math.random() < 0.1) {
      // 10% chance of corruption
      issues.push({
        type: "error",
        field: "profilePicture",
        message: "Profile picture appears to be corrupted or inaccessible",
        severity: 7,
      });
      score -= 25;
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async validateStoredDocuments(
    documents: UserFile[],
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    for (const doc of documents) {
      if (!doc.url || !doc.name) {
        issues.push({
          type: "warning",
          field: "documents",
          message: `Document ${doc.id} has missing information`,
          severity: 5,
        });
        score -= 10;
      }
    }

    return {
      isValid: score >= 75,
      score,
      issues,
      suggestions: [],
      riskLevel: "low",
    };
  }

  private async attemptAutoRestore(
    userId: string,
    issues: ValidationIssue[],
  ): Promise<void> {
    // Implement auto-restoration logic for fixable issues
    console.log(
      `Attempting auto-restore for user ${userId} with ${issues.length} issues`,
    );
  }

  private generateSuggestions(issues: ValidationIssue[]): string[] {
    return issues
      .filter((issue) => issue.fixSuggestion)
      .map((issue) => issue.fixSuggestion!)
      .slice(0, 5); // Top 5 suggestions
  }

  private generateRestorationSuggestions(issues: ValidationIssue[]): string[] {
    const suggestions = this.generateSuggestions(issues);
    suggestions.unshift("Consider restoring from latest backup");
    return suggestions;
  }

  private calculateRiskLevel(
    score: number,
    issues: ValidationIssue[],
  ): "low" | "medium" | "high" {
    const highSeverityIssues = issues.filter((i) => i.severity >= 8).length;

    if (score < 50 || highSeverityIssues > 0) return "high";
    if (score < 75 || issues.length > 3) return "medium";
    return "low";
  }
}

export default ValidationService;
