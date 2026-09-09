/**
 * Test AI Services to verify fixes
 */

export const testAIServices = async (): Promise<void> => {
  console.group("🧪 Testing AI Services");

  try {
    // Test 1: AILikesViewsTracker
    console.log("Testing AILikesViewsTracker...");
    const { aiLikesViewsTracker } = await import(
      "../services/AILikesViewsTracker"
    );

    // Test like tracking (should not throw errors now)
    const likeResult = await aiLikesViewsTracker.trackLike(
      "test-product",
      "test-user",
    );
    console.log("✅ AILikesViewsTracker.trackLike:", likeResult);

    // Test 2: AIClickLogger
    console.log("Testing AIClickLogger...");
    const { AIClickLogger } = await import("../services/AIClickLogger");

    // Test click logging (should not throw errors now)
    const clickLogger = AIClickLogger.getInstance();
    clickLogger.logClick({
      elementType: "button",
      elementText: "test",
      page: "test",
      section: "test",
      expectedResult: "test",
      actualResult: "test",
    });
    console.log("✅ AIClickLogger.logClick: Success");

    // Test 3: AICentralCommand instance methods
    console.log("Testing AICentralCommand...");
    const AICentralCommand = (await import("../services/AICentralCommand"))
      .default;
    const central = AICentralCommand.getInstance();
    await central.initialize();

    await central.logToDatabase({
      type: "communication",
      agentId: "test-agent",
      data: { action: "test" },
      metadata: { page: "test" },
    });
    console.log("✅ AICentralCommand.logToDatabase: Success");

    const agents = central.getAgents();
    console.log("✅ AICentralCommand.getAgents:", agents.length, "agents");

    console.log("🎉 All AI services are working correctly!");
  } catch (error) {
    console.error("❌ Error testing AI services:", error);
  }

  console.groupEnd();
};

// Auto-run in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    testAIServices();
  }, 3000);
}
