// Simplified App Initializer Component
// Provides basic initialization without blocking app startup

import { useEffect } from "react";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const initializeBasicServices = async () => {
      try {
        console.log("🚀 Initializing basic services...");

        // Initialize enhanced AI services
        const { default: EnhancedAIAutoFixService } = await import("../services/EnhancedAIAutoFixService");
        const { default: EnhancedAIKnowledgeDatabase } = await import("../services/EnhancedAIKnowledgeDatabase");

        // Start auto-fix monitoring
        const autoFix = EnhancedAIAutoFixService.getInstance();
        autoFix.startMonitoring();

        // Initialize knowledge database
        const knowledge = EnhancedAIKnowledgeDatabase.getInstance();

        console.log("✅ Enhanced AI services initialized");
        console.log("🔧 Auto-fix monitoring started");
        console.log("📚 Knowledge database ready");

      } catch (error) {
        console.warn("⚠️ Some services failed to initialize:", error);
        // Don't block app loading for service failures
      }
    };

    // Initialize services after a short delay to ensure app renders first
    setTimeout(initializeBasicServices, 1000);
  }, []);

  return <>{children}</>;
};

export default AppInitializer;
