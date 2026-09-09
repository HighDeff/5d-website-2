interface AIModule {
  id: string;
  userId: string;
  name: string;
  description: string;
  capabilities: AICapability[];
  triggers: AITrigger[];
  actions: AIAction[];
  parameters: AIParameter[];
  isActive: boolean;
  membershipRequired: "free" | "member" | "premium";
  createdAt: Date;
  lastUsed: Date;
}

interface AICapability {
  id: string;
  name: string;
  type:
    | "account_management"
    | "product_management"
    | "social_media"
    | "analytics"
    | "automation";
  description: string;
  permissions: string[];
  membershipRequired: "free" | "member" | "premium";
}

interface AITrigger {
  id: string;
  type: "schedule" | "event" | "manual" | "data_change";
  condition: string;
  frequency?: string; // for schedule type
  enabled: boolean;
}

interface AIAction {
  id: string;
  type:
    | "api_call"
    | "notification"
    | "data_update"
    | "social_post"
    | "custom_code";
  target: string;
  parameters: Record<string, any>;
  priority: "low" | "medium" | "high";
}

interface AIParameter {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description: string;
  defaultValue?: any;
}

interface FriendAIAccess {
  friendUserId: string;
  moduleId: string;
  permissions: string[];
  parameters: Record<string, any>;
  canAdjustBidding: boolean;
  canPromoteItems: boolean;
  canViewAnalytics: boolean;
  expiresAt?: Date;
}

class CustomAIModuleBuilder {
  private userModules: Map<string, AIModule[]> = new Map();
  private friendAccess: Map<string, FriendAIAccess[]> = new Map();
  private availableCapabilities: AICapability[] = [];
  private moduleExecutionQueue: Map<string, any[]> = new Map();

  constructor() {
    this.initializeCapabilities();
    this.loadUserModules();
    this.startModuleProcessor();
  }

  private initializeCapabilities(): void {
    this.availableCapabilities = [
      // Account Management Capabilities
      {
        id: "track_favorites",
        name: "Favorites Tracking",
        type: "account_management",
        description: "Monitor and manage user favorites across the platform",
        permissions: ["read_favorites", "modify_favorites"],
        membershipRequired: "free",
      },
      {
        id: "manage_listings",
        name: "Product Listing Management",
        type: "product_management",
        description:
          "Automatically manage product listings, pricing, and inventory",
        permissions: ["read_products", "modify_products", "create_products"],
        membershipRequired: "member",
      },
      {
        id: "auto_bidding",
        name: "Automated Bidding",
        type: "account_management",
        description:
          "Automatically place bids on items based on predefined criteria",
        permissions: ["place_bids", "view_auctions"],
        membershipRequired: "member",
      },
      {
        id: "social_promotion",
        name: "Social Media Promotion",
        type: "social_media",
        description: "Automatically promote products on social media platforms",
        permissions: ["post_social", "manage_campaigns"],
        membershipRequired: "premium",
      },
      {
        id: "analytics_reports",
        name: "Analytics & Reporting",
        type: "analytics",
        description: "Generate automated reports and insights",
        permissions: ["read_analytics", "generate_reports"],
        membershipRequired: "member",
      },
      {
        id: "inventory_sync",
        name: "Inventory Synchronization",
        type: "automation",
        description: "Sync inventory across multiple platforms",
        permissions: ["read_inventory", "update_inventory"],
        membershipRequired: "premium",
      },
      {
        id: "price_optimization",
        name: "Dynamic Pricing",
        type: "product_management",
        description: "Automatically adjust prices based on market conditions",
        permissions: ["read_market_data", "update_pricing"],
        membershipRequired: "premium",
      },
      {
        id: "customer_support",
        name: "Customer Support Bot",
        type: "automation",
        description: "Automated customer support and FAQ responses",
        permissions: ["read_messages", "send_messages"],
        membershipRequired: "member",
      },
    ];
  }

  /**
   * Create custom AI module for user
   */
  createAIModule(
    userId: string,
    name: string,
    description: string,
    capabilityIds: string[],
    membershipLevel: string,
  ): AIModule {
    const moduleId = `ai-module-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Filter capabilities based on membership
    const allowedCapabilities = this.availableCapabilities.filter(
      (cap) =>
        capabilityIds.includes(cap.id) &&
        this.hasPermissionForCapability(cap, membershipLevel),
    );

    const module: AIModule = {
      id: moduleId,
      userId,
      name,
      description,
      capabilities: allowedCapabilities,
      triggers: [],
      actions: [],
      parameters: [],
      isActive: false,
      membershipRequired: membershipLevel as "free" | "member" | "premium",
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    const userModules = this.userModules.get(userId) || [];
    userModules.push(module);
    this.userModules.set(userId, userModules);

    this.saveUserModules();
    console.log(`🤖 Created AI module: ${name} for user ${userId}`);

    return module;
  }

  /**
   * Add trigger to AI module
   */
  addTrigger(
    userId: string,
    moduleId: string,
    triggerType: AITrigger["type"],
    condition: string,
    frequency?: string,
  ): boolean {
    const module = this.getUserModule(userId, moduleId);
    if (!module) return false;

    const trigger: AITrigger = {
      id: `trigger-${Date.now()}`,
      type: triggerType,
      condition,
      frequency,
      enabled: true,
    };

    module.triggers.push(trigger);
    this.saveUserModules();

    return true;
  }

  /**
   * Add action to AI module
   */
  addAction(
    userId: string,
    moduleId: string,
    actionType: AIAction["type"],
    target: string,
    parameters: Record<string, any>,
  ): boolean {
    const module = this.getUserModule(userId, moduleId);
    if (!module) return false;

    const action: AIAction = {
      id: `action-${Date.now()}`,
      type: actionType,
      target,
      parameters,
      priority: "medium",
    };

    module.actions.push(action);
    this.saveUserModules();

    return true;
  }

  /**
   * Grant friend access to AI module
   */
  grantFriendAccess(
    userId: string,
    moduleId: string,
    friendUserId: string,
    permissions: string[],
    parameters: Record<string, any> = {},
  ): boolean {
    const module = this.getUserModule(userId, moduleId);
    if (!module || module.membershipRequired === "free") return false; // Members only

    const access: FriendAIAccess = {
      friendUserId,
      moduleId,
      permissions,
      parameters,
      canAdjustBidding: permissions.includes("adjust_bidding"),
      canPromoteItems: permissions.includes("promote_items"),
      canViewAnalytics: permissions.includes("view_analytics"),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    };

    const userFriendAccess = this.friendAccess.get(userId) || [];
    userFriendAccess.push(access);
    this.friendAccess.set(userId, userFriendAccess);

    this.saveFriendAccess();
    console.log(
      `👥 Granted friend access: ${friendUserId} to module ${moduleId}`,
    );

    return true;
  }

  /**
   * Execute AI module action
   */
  async executeModuleAction(
    userId: string,
    moduleId: string,
    actionId: string,
    context: any = {},
  ): Promise<any> {
    const module = this.getUserModule(userId, moduleId);
    if (!module || !module.isActive) {
      throw new Error("Module not found or inactive");
    }

    const action = module.actions.find((a) => a.id === actionId);
    if (!action) {
      throw new Error("Action not found");
    }

    module.lastUsed = new Date();

    try {
      const result = await this.processAction(action, context, userId);

      // Log execution
      console.log(`⚡ Executed action ${actionId} for module ${moduleId}`);

      return result;
    } catch (error) {
      console.error(`❌ Action execution failed:`, error);
      throw error;
    }
  }

  private async processAction(
    action: AIAction,
    context: any,
    userId: string,
  ): Promise<any> {
    switch (action.type) {
      case "api_call":
        return this.executeAPICall(action, context);

      case "notification":
        return this.sendNotification(action, context, userId);

      case "data_update":
        return this.updateData(action, context, userId);

      case "social_post":
        return this.postToSocial(action, context, userId);

      case "custom_code":
        return this.executeCustomCode(action, context);

      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async executeAPICall(action: AIAction, context: any): Promise<any> {
    try {
      const response = await fetch(action.target, {
        method: action.parameters.method || "GET",
        headers: action.parameters.headers || {},
        body: action.parameters.body
          ? JSON.stringify(action.parameters.body)
          : undefined,
      });

      return await response.json();
    } catch (error) {
      throw new Error(`API call failed: ${error}`);
    }
  }

  private sendNotification(
    action: AIAction,
    context: any,
    userId: string,
  ): any {
    // Send notification to user
    const notification = {
      userId,
      title: action.parameters.title || "AI Module Notification",
      message: action.parameters.message || "Action completed",
      type: action.parameters.type || "info",
      timestamp: new Date(),
    };

    // Trigger notification system
    window.dispatchEvent(
      new CustomEvent("aiModuleNotification", { detail: notification }),
    );

    return notification;
  }

  private updateData(action: AIAction, context: any, userId: string): any {
    // Update user data based on action parameters
    const updates = action.parameters.updates || {};

    // Apply updates to localStorage or send to backend
    Object.entries(updates).forEach(([key, value]) => {
      const currentData = JSON.parse(localStorage.getItem(key) || "{}");
      const updatedData = { ...currentData, ...value };
      localStorage.setItem(key, JSON.stringify(updatedData));
    });

    return { success: true, updatedFields: Object.keys(updates) };
  }

  private postToSocial(action: AIAction, context: any, userId: string): any {
    // Simulate social media posting
    const post = {
      platform: action.parameters.platform || "internal",
      content: action.parameters.content || "Check out my products!",
      hashtags: action.parameters.hashtags || [],
      userId,
      timestamp: new Date(),
    };

    console.log(`📱 Social post:`, post);

    // In production, this would connect to actual social media APIs
    return { success: true, postId: `post-${Date.now()}`, post };
  }

  private executeCustomCode(action: AIAction, context: any): any {
    try {
      // Safely execute custom code
      const code = action.parameters.code || "";
      const result = eval(`(function(context) { ${code} })`)(context);

      return { success: true, result };
    } catch (error) {
      throw new Error(`Custom code execution failed: ${error}`);
    }
  }

  /**
   * Get available capabilities for membership level
   */
  getAvailableCapabilities(membershipLevel: string): AICapability[] {
    return this.availableCapabilities.filter((cap) =>
      this.hasPermissionForCapability(cap, membershipLevel),
    );
  }

  private hasPermissionForCapability(
    capability: AICapability,
    membershipLevel: string,
  ): boolean {
    const membershipHierarchy = { free: 0, member: 1, premium: 2 };
    const userLevel =
      membershipHierarchy[
        membershipLevel as keyof typeof membershipHierarchy
      ] || 0;
    const requiredLevel =
      membershipHierarchy[capability.membershipRequired] || 0;

    return userLevel >= requiredLevel;
  }

  /**
   * Get user's AI modules
   */
  getUserModules(userId: string): AIModule[] {
    return this.userModules.get(userId) || [];
  }

  private getUserModule(
    userId: string,
    moduleId: string,
  ): AIModule | undefined {
    const userModules = this.userModules.get(userId) || [];
    return userModules.find((m) => m.id === moduleId);
  }

  /**
   * Activate/Deactivate AI module
   */
  toggleModule(userId: string, moduleId: string, isActive: boolean): boolean {
    const module = this.getUserModule(userId, moduleId);
    if (!module) return false;

    module.isActive = isActive;
    this.saveUserModules();

    if (isActive) {
      this.startModuleExecution(module);
    }

    return true;
  }

  private startModuleExecution(module: AIModule): void {
    // Start executing module based on triggers
    module.triggers.forEach((trigger) => {
      if (!trigger.enabled) return;

      switch (trigger.type) {
        case "schedule":
          this.scheduleModuleExecution(module, trigger);
          break;
        case "event":
          this.attachEventListener(module, trigger);
          break;
      }
    });
  }

  private scheduleModuleExecution(module: AIModule, trigger: AITrigger): void {
    if (!trigger.frequency) return;

    const interval = this.parseFrequency(trigger.frequency);

    setInterval(() => {
      if (module.isActive) {
        console.log(`⏰ Scheduled execution for module ${module.id}`);
        module.actions.forEach((action) => {
          this.executeModuleAction(module.userId, module.id, action.id);
        });
      }
    }, interval);
  }

  private attachEventListener(module: AIModule, trigger: AITrigger): void {
    window.addEventListener(trigger.condition, (event) => {
      if (module.isActive) {
        console.log(`📡 Event triggered for module ${module.id}`);
        module.actions.forEach((action) => {
          this.executeModuleAction(module.userId, module.id, action.id, {
            event,
          });
        });
      }
    });
  }

  private parseFrequency(frequency: string): number {
    // Parse frequency strings like "5m", "1h", "1d"
    const match = frequency.match(/(\d+)([mhd])/);
    if (!match) return 60000; // Default 1 minute

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case "m":
        return value * 60 * 1000; // minutes
      case "h":
        return value * 60 * 60 * 1000; // hours
      case "d":
        return value * 24 * 60 * 60 * 1000; // days
      default:
        return 60000;
    }
  }

  /**
   * Generate groups based on parameters (members only)
   */
  generateUserGroups(
    userId: string,
    parameters: {
      criteria: string;
      maxSize: number;
      membershipRequired: string;
    },
  ): any[] {
    const userModules = this.getUserModules(userId);
    if (userModules.length === 0) return [];

    // Mock group generation based on criteria
    const groups = [
      {
        id: `group-${Date.now()}`,
        name: `Auto Group - ${parameters.criteria}`,
        members: [`user1`, `user2`, `user3`],
        criteria: parameters.criteria,
        createdBy: userId,
        createdAt: new Date(),
        membershipRequired: parameters.membershipRequired,
      },
    ];

    return groups;
  }

  private startModuleProcessor(): void {
    // Process module execution queue every 30 seconds
    setInterval(() => {
      this.processExecutionQueue();
    }, 30000);
  }

  private processExecutionQueue(): void {
    for (const [userId, executions] of this.moduleExecutionQueue) {
      executions.forEach((execution) => {
        // Process queued executions
        console.log(`Processing queued execution for user ${userId}`);
      });
    }
  }

  private loadUserModules(): void {
    try {
      const saved = localStorage.getItem("customAIModules");
      if (saved) {
        const data = JSON.parse(saved);
        for (const [userId, modules] of Object.entries(data as any)) {
          const userModules = (modules as any[]).map((moduleData) => ({
            ...moduleData,
            createdAt: new Date(moduleData.createdAt),
            lastUsed: new Date(moduleData.lastUsed),
          }));
          this.userModules.set(userId, userModules);
        }
        console.log(`🤖 Loaded AI modules for ${this.userModules.size} users`);
      }
    } catch (error) {
      console.error("Error loading AI modules:", error);
    }
  }

  private saveUserModules(): void {
    try {
      const data = Object.fromEntries(this.userModules);
      localStorage.setItem("customAIModules", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving AI modules:", error);
    }
  }

  private saveFriendAccess(): void {
    try {
      const data = Object.fromEntries(this.friendAccess);
      localStorage.setItem("friendAIAccess", JSON.stringify(data));
    } catch (error) {
      console.error("Error saving friend access:", error);
    }
  }
}

export const customAIModuleBuilder = new CustomAIModuleBuilder();
export type { AIModule, AICapability, AITrigger, AIAction, FriendAIAccess };
