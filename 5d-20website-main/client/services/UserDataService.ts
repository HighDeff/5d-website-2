// User Data Management Service
// Handles multi-tier data persistence: sessions (short), localStorage (mid), database (long)

import AIService from "./AIService";

interface UserSession {
  userId: string;
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageHistory: string[];
  collections: any[];
  preferences: any;
  temporaryData: any;
}

interface UserData {
  profile: any;
  collections: any[];
  documents: any[];
  preferences: any;
  settings: any;
  history: any[];
}

class UserDataService {
  private currentSession: UserSession | null = null;
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
    this.initializeSession();
    this.startSessionMonitoring();
  }

  // Initialize user session with AI validation
  async initializeSession(): Promise<void> {
    const user = this.getCurrentUser();

    if (user) {
      const sessionId = this.generateSessionId();
      this.currentSession = {
        userId: user.id,
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageHistory: [window.location.pathname],
        collections: await this.loadUserCollections(user.id),
        preferences: await this.loadUserPreferences(user.id),
        temporaryData: {},
      };

      // Send session data to AI for validation
      await this.notifyAI("session_start", {
        user: user,
        session: this.currentSession,
        timestamp: new Date().toISOString(),
      });

      // Save session to localStorage (mid-term)
      this.saveSessionToStorage();
    }
  }

  // Constantly monitor login status and route changes
  startSessionMonitoring(): void {
    // Monitor route changes
    let currentPath = window.location.pathname;
    setInterval(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        this.handleRouteChange(currentPath);
      }
    }, 1000);

    // Monitor user authentication status
    setInterval(() => {
      this.checkAuthenticationStatus();
    }, 5000);

    // Monitor session timeout
    setInterval(() => {
      this.checkSessionTimeout();
    }, 60000); // Check every minute
  }

  // Handle route changes with AI notification
  async handleRouteChange(newPath: string): Promise<void> {
    const user = this.getCurrentUser();

    if (user && this.currentSession) {
      this.currentSession.pageHistory.push(newPath);
      this.currentSession.lastActivity = Date.now();

      // Send route change to AI
      await this.notifyAI("route_change", {
        user: user,
        previousPath:
          this.currentSession.pageHistory[
            this.currentSession.pageHistory.length - 2
          ],
        newPath: newPath,
        timestamp: new Date().toISOString(),
        sessionData: this.currentSession,
      });

      // Update session storage
      this.saveSessionToStorage();

      // Load page-specific data
      await this.loadPageData(newPath, user.id);
    }
  }

  // Check authentication status constantly
  async checkAuthenticationStatus(): Promise<void> {
    const user = this.getCurrentUser();
    const wasLoggedIn = this.currentSession !== null;
    const isLoggedIn = user !== null;

    if (wasLoggedIn && !isLoggedIn) {
      // User logged out
      await this.handleLogout();
    } else if (!wasLoggedIn && isLoggedIn) {
      // User logged in
      await this.handleLogin(user);
    } else if (isLoggedIn && user) {
      // Update activity
      if (this.currentSession) {
        this.currentSession.lastActivity = Date.now();
        this.saveSessionToStorage();
      }

      // Send periodic status to AI
      await this.notifyAI("auth_check", {
        user: user,
        status: "active",
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Load user preferences from storage
  async loadUserPreferences(userId: string): Promise<any> {
    try {
      // Load user preferences from localStorage
      const userPreferences = this.getUserData(userId, "preferences") || {};

      // Default preferences structure
      const defaultPreferences = {
        theme: "dark",
        notifications: {
          email: true,
          push: true,
          aiAlerts: true,
          systemUpdates: true
        },
        privacy: {
          profileVisibility: "public",
          showActivity: true,
          allowAnalytics: true
        },
        ai: {
          autoFix: true,
          learningMode: true,
          confidenceThreshold: 0.7,
          responseTime: 100
        },
        canvas: {
          showGrid: true,
          showTrails: true,
          autoSave: true,
          maxEntities: 100
        },
        language: "en",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        accessibility: {
          highContrast: false,
          largeText: false,
          reducedMotion: false
        }
      };

      // Merge with defaults
      const mergedPreferences = { ...defaultPreferences, ...userPreferences };

      // Validate with AI
      const validatedPreferences = await this.aiService.validateUserPreferences(
        mergedPreferences,
        userId
      );

      return validatedPreferences;
    } catch (error) {
      console.error("Error loading user preferences:", error);
      return {
        theme: "dark",
        notifications: { email: true, push: true, aiAlerts: true, systemUpdates: true },
        privacy: { profileVisibility: "public", showActivity: true, allowAnalytics: true },
        ai: { autoFix: true, learningMode: true, confidenceThreshold: 0.7, responseTime: 100 },
        canvas: { showGrid: true, showTrails: true, autoSave: true, maxEntities: 100 },
        language: "en",
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        accessibility: { highContrast: false, largeText: false, reducedMotion: false }
      };
    }
  }

  // Load user-specific collections (My Collections + Default Collections)
  async loadUserCollections(userId: string): Promise<any[]> {
    try {
      // Load user's personal collections (short-term from session)
      const sessionCollections = this.getSessionData("collections") || [];

      // Load user's saved collections (mid-term from localStorage)
      const userCollections = this.getUserData(userId, "collections") || [];

      // Load default/admin collections
      const defaultCollections = await this.loadDefaultCollections();

      // Merge collections with AI validation
      const allCollections = [
        ...sessionCollections,
        ...userCollections,
        ...defaultCollections,
      ];

      // Send to AI for validation and enhancement
      const validatedCollections = await this.aiService.validateCollections(
        allCollections,
        userId,
      );

      // Ensure all collections have proper creator objects
      const safeCollections = validatedCollections.map((collection) => ({
        ...collection,
        creator: collection.creator || {
          id: "unknown",
          name: "Unknown Creator",
          avatar: "",
          verified: false,
        },
      }));

      return safeCollections;
    } catch (error) {
      console.error("Error loading user collections:", error);
      return [];
    }
  }

  // Load default/admin collections
  async loadDefaultCollections(): Promise<any[]> {
    try {
      // Clear cached collections to load new structure
      localStorage.removeItem("defaultCollections");

      const defaultCollections = localStorage.getItem("defaultCollections");
      return defaultCollections
        ? JSON.parse(defaultCollections)
        : [
            {
              id: "beauty-collection",
              name: "Beauty",
              description:
                "Complete beauty collection including makeup puffs, body wash, combs, lip masks, and cologne",
              image:
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&h=400&fit=crop",
              type: "default",
              isAdmin: true,
              items: [],
              creator: {
                id: "admin",
                name: "Lilly's Fashion",
                avatar: "",
                verified: true,
              },
              category: "beauty",
              tags: ["beauty", "makeup", "skincare", "body care"],
              isPublic: true,
              likes: 28,
              views: 156,
              itemCount: 100,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "clothing-shoes-accessories",
              name: "Clothing, Shoes & Accessories",
              description:
                "Complete fashion collection including dresses, pants, tops, underwear, men's clothing, and kids clothes",
              image:
                "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop",
              type: "default",
              isAdmin: true,
              items: [],
              creator: {
                id: "admin",
                name: "Lilly's Fashion",
                avatar: "",
                verified: true,
              },
              category: "clothing",
              tags: [
                "clothing",
                "fashion",
                "shoes",
                "accessories",
                "men",
                "women",
                "kids",
              ],
              isPublic: true,
              likes: 45,
              views: 289,
              itemCount: 300,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "home-kitchen",
              name: "Home & Kitchen",
              description:
                "Essential home and kitchen products including hand soap and cleaning supplies",
              image:
                "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
              type: "default",
              isAdmin: true,
              items: [],
              creator: {
                id: "admin",
                name: "Lilly's Fashion",
                avatar: "",
                verified: true,
              },
              category: "home",
              tags: ["home", "kitchen", "cleaning", "soap"],
              isPublic: true,
              likes: 12,
              views: 78,
              itemCount: 25,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "jewelry-collection",
              name: "Jewelry",
              description:
                "Beautiful jewelry collection featuring bracelets, rings, and accessories",
              image:
                "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop",
              type: "default",
              isAdmin: true,
              items: [],
              creator: {
                id: "admin",
                name: "Lilly's Fashion",
                avatar: "",
                verified: true,
              },
              category: "jewelry",
              tags: ["jewelry", "bracelets", "rings", "accessories"],
              isPublic: true,
              likes: 32,
              views: 134,
              itemCount: 50,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
    } catch (error) {
      console.error("Error loading default collections:", error);
      return [];
    }
  }

  // Save user collection with multi-tier persistence
  async saveUserCollection(userId: string, collection: any): Promise<void> {
    try {
      // AI validation before saving
      const isValid = await this.aiService.validateBeforeChange(
        collection,
        userId,
      );

      if (!isValid) {
        throw new Error("AI validation failed for collection");
      }

      // Save to session (short-term)
      this.setSessionData("collections", collection);

      // Save to localStorage (mid-term)
      this.saveUserData(userId, "collections", collection);

      // Save to database (long-term) - immediate update
      await this.saveToDatabaseImmediate(userId, "collections", collection);

      // Notify AI of successful save
      await this.notifyAI("collection_saved", {
        userId,
        collection,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving user collection:", error);
      throw error;
    }
  }

  // Load page-specific data for user
  async loadPageData(path: string, userId: string): Promise<any> {
    try {
      // Check if user has specific data for this page
      const pageData = this.getUserData(
        userId,
        `page_${path.replace(/\//g, "_")}`,
      );

      // Send page load event to AI
      await this.notifyAI("page_load", {
        userId,
        path,
        pageData,
        timestamp: new Date().toISOString(),
      });

      return pageData;
    } catch (error) {
      console.error("Error loading page data:", error);
      return null;
    }
  }

  // Multi-tier data persistence methods

  // Session data (short-term)
  setSessionData(key: string, value: any): void {
    if (this.currentSession) {
      this.currentSession.temporaryData[key] = value;
      this.saveSessionToStorage();
    }
  }

  getSessionData(key: string): any {
    return this.currentSession?.temporaryData[key];
  }

  // User data (mid-term - localStorage)
  saveUserData(userId: string, key: string, value: any): void {
    try {
      const userDataKey = `userData_${userId}`;
      const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
      userData[key] = value;
      userData.lastUpdated = Date.now();
      localStorage.setItem(userDataKey, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  }

  getUserData(userId: string, key: string): any {
    try {
      const userDataKey = `userData_${userId}`;
      const userData = JSON.parse(localStorage.getItem(userDataKey) || "{}");
      return userData[key];
    } catch (error) {
      console.error("Error getting user data:", error);
      return null;
    }
  }

  // Database persistence (long-term)
  async saveToDatabaseImmediate(
    userId: string,
    key: string,
    value: any,
  ): Promise<void> {
    try {
      // This would connect to your actual database
      // For now, we'll simulate with enhanced localStorage
      const dbKey = `db_${userId}_${key}`;
      const dbData = {
        userId,
        key,
        value,
        timestamp: Date.now(),
        checksum: this.generateChecksum(value),
      };

      localStorage.setItem(dbKey, JSON.stringify(dbData));

      // Update database index
      this.updateDatabaseIndex(userId, key);
    } catch (error) {
      console.error("Error saving to database:", error);
      throw error;
    }
  }

  // AI Integration methods
  async notifyAI(event: string, data: any): Promise<void> {
    try {
      await this.aiService.processUserEvent(event, data);
    } catch (error) {
      console.error("Error notifying AI:", error);
    }
  }

  // Utility methods
  private getCurrentUser(): any {
    try {
      const user = localStorage.getItem("currentUser");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateChecksum(data: any): string {
    return btoa(JSON.stringify(data)).slice(0, 16);
  }

  private saveSessionToStorage(): void {
    if (this.currentSession) {
      sessionStorage.setItem(
        "currentSession",
        JSON.stringify(this.currentSession),
      );
    }
  }

  private updateDatabaseIndex(userId: string, key: string): void {
    try {
      const indexKey = `dbIndex_${userId}`;
      const index = JSON.parse(localStorage.getItem(indexKey) || "[]");

      if (!index.includes(key)) {
        index.push(key);
        localStorage.setItem(indexKey, JSON.stringify(index));
      }
    } catch (error) {
      console.error("Error updating database index:", error);
    }
  }

  private async handleLogin(user: any): Promise<void> {
    await this.initializeSession();
  }

  private async handleLogout(): Promise<void> {
    if (this.currentSession) {
      await this.notifyAI("session_end", {
        session: this.currentSession,
        timestamp: new Date().toISOString(),
      });

      this.currentSession = null;
      sessionStorage.removeItem("currentSession");
    }
  }

  private checkSessionTimeout(): void {
    if (this.currentSession) {
      const now = Date.now();
      const timeSinceActivity = now - this.currentSession.lastActivity;

      if (timeSinceActivity > this.sessionTimeout) {
        this.handleLogout();
      }
    }
  }

  // Public methods for components to use
  async getUserCollections(userId: string): Promise<any[]> {
    return await this.loadUserCollections(userId);
  }

  async saveCollection(userId: string, collection: any): Promise<void> {
    await this.saveUserCollection(userId, collection);
  }

  getSession(): UserSession | null {
    return this.currentSession;
  }
}

export default new UserDataService();
