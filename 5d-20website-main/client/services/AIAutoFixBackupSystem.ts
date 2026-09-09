/**
 * AI Auto-Fix Backup System
 * Handles backup creation, restoration, and collaboration between AIs
 */

interface BackupData {
  id: string;
  timestamp: Date;
  issueId: string;
  htmlSnapshot: string;
  localStorageSnapshot: Record<string, string>;
  cssSnapshot: string;
  componentStates: Record<string, any>;
  url: string;
  method: string;
}

interface CollaborationMessage {
  type:
    | "backup_created"
    | "fix_successful"
    | "fix_failed"
    | "rollback_completed"
    | "suggestion_request";
  issueId: string;
  backupId?: string;
  method?: string;
  suggestedAlternatives?: string[];
  error?: string;
  fromAI: string;
  timestamp: Date;
}

export class AIAutoFixBackupSystem {
  private static instance: AIAutoFixBackupSystem;
  private backups: Map<string, BackupData> = new Map();
  private collaboratingAIs: Set<string> = new Set([
    "auto-fix-001",
    "monitoring-002",
    "validator-003",
    "predictor-004",
    "database-005",
  ]);
  private messageQueue: CollaborationMessage[] = [];

  static getInstance(): AIAutoFixBackupSystem {
    if (!AIAutoFixBackupSystem.instance) {
      AIAutoFixBackupSystem.instance = new AIAutoFixBackupSystem();
    }
    return AIAutoFixBackupSystem.instance;
  }

  /**
   * Create comprehensive backup before applying fix
   */
  async createBackup(issueId: string, method: string): Promise<string> {
    const backupId = `backup_${issueId}_${Date.now()}`;

    try {
      // Capture current DOM state
      const htmlSnapshot = document.documentElement.outerHTML;

      // Capture localStorage
      const localStorageSnapshot: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageSnapshot[key] = localStorage.getItem(key) || "";
        }
      }

      // Capture computed styles of key elements
      const cssSnapshot = this.captureKeyStyles();

      // Capture React component states if available
      const componentStates = this.captureComponentStates();

      const backup: BackupData = {
        id: backupId,
        timestamp: new Date(),
        issueId,
        htmlSnapshot,
        localStorageSnapshot,
        cssSnapshot,
        componentStates,
        url: window.location.href,
        method,
      };

      this.backups.set(backupId, backup);

      console.log(
        `📦 AI Backup: Created backup ${backupId} for issue ${issueId}`,
      );

      return backupId;
    } catch (error) {
      console.error("Error creating backup:", error);
      throw error;
    }
  }

  /**
   * Restore from backup
   */
  async performRollbackFromBackup(backupId: string): Promise<boolean> {
    const backup = this.backups.get(backupId);
    if (!backup) {
      console.error(`Backup ${backupId} not found`);
      return false;
    }

    try {
      console.log(`🔄 AI Backup: Restoring from backup ${backupId}`);

      // Restore localStorage
      localStorage.clear();
      Object.entries(backup.localStorageSnapshot).forEach(([key, value]) => {
        localStorage.setItem(key, value);
      });

      // Restore DOM (careful with this - might need page refresh)
      // For safety, we'll restore specific elements rather than full DOM
      await this.restoreKeyElements(backup);

      // Restore component states
      await this.restoreComponentStates(backup.componentStates);

      console.log(
        `✅ AI Backup: Successfully restored from backup ${backupId}`,
      );
      return true;
    } catch (error) {
      console.error(`Error restoring from backup ${backupId}:`, error);
      return false;
    }
  }

  /**
   * Notify collaborating AIs about events
   */
  async notifyCollaboratingAIs(
    message: Omit<CollaborationMessage, "fromAI" | "timestamp">,
  ): Promise<void> {
    const collaborationMessage: CollaborationMessage = {
      ...message,
      fromAI: "auto-fix-001",
      timestamp: new Date(),
    };

    this.messageQueue.push(collaborationMessage);

    // Broadcast to all collaborating AIs
    for (const aiId of this.collaboratingAIs) {
      if (aiId !== "auto-fix-001") {
        await this.sendMessageToAI(aiId, collaborationMessage);
      }
    }

    console.log(
      `📡 AI Collaboration: Notified ${this.collaboratingAIs.size - 1} AIs about ${message.type}`,
    );
  }

  /**
   * Send message to specific AI
   */
  private async sendMessageToAI(
    aiId: string,
    message: CollaborationMessage,
  ): Promise<void> {
    try {
      // Store message for AI to pick up
      const aiMessages = JSON.parse(
        localStorage.getItem(`ai_messages_${aiId}`) || "[]",
      );
      aiMessages.push(message);
      localStorage.setItem(`ai_messages_${aiId}`, JSON.stringify(aiMessages));

      // Trigger AI notification event
      window.dispatchEvent(
        new CustomEvent(`ai_message_${aiId}`, {
          detail: message,
        }),
      );
    } catch (error) {
      console.error(`Error sending message to AI ${aiId}:`, error);
    }
  }

  /**
   * Generate alternative fix methods based on issue analysis
   */
  generateAlternativeMethods(issue: any): string[] {
    const alternatives: string[] = [];

    switch (issue.type) {
      case "missing_component":
        alternatives.push("enhanced", "collaborative", "template-based");
        break;
      case "broken_functionality":
        alternatives.push("alternative", "enhanced", "rollback-and-retry");
        break;
      case "data_loading":
        alternatives.push("enhanced", "fallback-data", "lazy-loading");
        break;
      case "user_experience":
        alternatives.push("collaborative", "enhanced", "a11y-focused");
        break;
      default:
        alternatives.push("enhanced", "alternative", "collaborative");
    }

    return alternatives;
  }

  /**
   * Escalate to human review when all AI attempts fail
   */
  async escalateToHumanReview(issue: any): Promise<void> {
    const escalationData = {
      issueId: issue.id,
      type: issue.type,
      description: issue.description,
      location: issue.location,
      attempts: this.messageQueue.filter((m) => m.issueId === issue.id),
      timestamp: new Date().toISOString(),
      priority: "high",
    };

    // Store escalation for admin review
    const escalations = JSON.parse(
      localStorage.getItem("ai_escalations") || "[]",
    );
    escalations.push(escalationData);
    localStorage.setItem("ai_escalations", JSON.stringify(escalations));

    // Notify admin
    window.dispatchEvent(
      new CustomEvent("ai_escalation", {
        detail: escalationData,
      }),
    );

    console.log(
      `🚨 AI Escalation: Issue ${issue.id} escalated to human review`,
    );
  }

  /**
   * Capture styles of key elements
   */
  private captureKeyStyles(): string {
    const keySelectors = [
      ".collection-card",
      ".favorite-button",
      "[data-item-id]",
      ".cart-button",
      ".product-card",
    ];

    let styles = "";
    keySelectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element, index) => {
        const computedStyles = window.getComputedStyle(element);
        styles += `/* ${selector}[${index}] */\n`;
        styles += `${selector}[data-backup-index="${index}"] {\n`;

        // Capture important style properties
        const importantProps = [
          "display",
          "position",
          "top",
          "left",
          "right",
          "bottom",
          "width",
          "height",
          "margin",
          "padding",
          "background",
          "color",
          "font-size",
          "opacity",
          "transform",
        ];

        importantProps.forEach((prop) => {
          styles += `  ${prop}: ${computedStyles.getPropertyValue(prop)};\n`;
        });

        styles += "}\n\n";
      });
    });

    return styles;
  }

  /**
   * Capture React component states
   */
  private captureComponentStates(): Record<string, any> {
    const states: Record<string, any> = {};

    // Try to capture React states from data attributes
    const componentsWithState = document.querySelectorAll(
      "[data-component-state]",
    );
    componentsWithState.forEach((element, index) => {
      const stateData = element.getAttribute("data-component-state");
      if (stateData) {
        try {
          states[`component_${index}`] = JSON.parse(stateData);
        } catch (error) {
          console.warn("Could not parse component state:", stateData);
        }
      }
    });

    return states;
  }

  /**
   * Restore key elements from backup
   */
  private async restoreKeyElements(backup: BackupData): Promise<void> {
    // For safety, we'll only restore specific elements rather than full DOM
    const parser = new DOMParser();
    const backupDoc = parser.parseFromString(backup.htmlSnapshot, "text/html");

    // Restore favorite buttons
    const currentFavoriteButtons = document.querySelectorAll(
      ".favorite-button, [data-favorite]",
    );
    const backupFavoriteButtons = backupDoc.querySelectorAll(
      ".favorite-button, [data-favorite]",
    );

    currentFavoriteButtons.forEach((button, index) => {
      const backupButton = backupFavoriteButtons[index];
      if (backupButton) {
        button.className = backupButton.className;
        button.innerHTML = backupButton.innerHTML;

        // Restore data attributes
        Array.from(backupButton.attributes).forEach((attr) => {
          if (attr.name.startsWith("data-")) {
            button.setAttribute(attr.name, attr.value);
          }
        });
      }
    });
  }

  /**
   * Restore component states
   */
  private async restoreComponentStates(
    states: Record<string, any>,
  ): Promise<void> {
    // Dispatch custom events to trigger component state restoration
    Object.entries(states).forEach(([componentId, state]) => {
      window.dispatchEvent(
        new CustomEvent("restore_component_state", {
          detail: { componentId, state },
        }),
      );
    });
  }

  /**
   * Get backup history for debugging
   */
  getBackupHistory(): BackupData[] {
    return Array.from(this.backups.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    );
  }

  /**
   * Clean old backups to save space
   */
  cleanOldBackups(maxAge: number = 24 * 60 * 60 * 1000): void {
    const cutoff = new Date(Date.now() - maxAge);

    for (const [id, backup] of this.backups.entries()) {
      if (backup.timestamp < cutoff) {
        this.backups.delete(id);
        console.log(`🗑️ AI Backup: Cleaned old backup ${id}`);
      }
    }
  }
}

export default AIAutoFixBackupSystem;
