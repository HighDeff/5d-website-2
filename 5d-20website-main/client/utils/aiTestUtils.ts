/**
 * AI System Test Utilities
 * Helper functions to verify AI system functionality
 */

export const testAICentralCommandMethods = async (): Promise<{
  success: boolean;
  results: any[];
}> => {
  const results: any[] = [];

  try {
    // Test 1: Import AICentralCommand
    const AICentralCommand = (await import("../services/AICentralCommand"))
      .default;
    results.push({
      test: "Import AICentralCommand",
      success: true,
      message: "Successfully imported AICentralCommand",
    });

    // Test 2: Test processCommand static method
    try {
      const commandResult = await AICentralCommand.processCommand({
        type: "TEST_COMMAND",
        payload: { test: true },
      });
      results.push({
        test: "processCommand static method",
        success: true,
        message: "processCommand executed successfully",
        data: commandResult,
      });
    } catch (error) {
      results.push({
        test: "processCommand static method",
        success: false,
        message: error.message,
      });
    }

    // Test 3: Test reportError static method
    try {
      await AICentralCommand.reportError("test_error", {
        message: "Test error for verification",
        timestamp: new Date().toISOString(),
      });
      results.push({
        test: "reportError static method",
        success: true,
        message: "reportError executed successfully",
      });
    } catch (error) {
      results.push({
        test: "reportError static method",
        success: false,
        message: error.message,
      });
    }

    // Test 4: Test reportHealthStatus static method
    try {
      await AICentralCommand.reportHealthStatus("test_agent", {
        status: "healthy",
        lastCheck: new Date().toISOString(),
        metrics: { uptime: 100 },
      });
      results.push({
        test: "reportHealthStatus static method",
        success: true,
        message: "reportHealthStatus executed successfully",
      });
    } catch (error) {
      results.push({
        test: "reportHealthStatus static method",
        success: false,
        message: error.message,
      });
    }

    // Test 5: Test getSystemHealth static method
    try {
      const healthData = AICentralCommand.getSystemHealth();
      results.push({
        test: "getSystemHealth static method",
        success: true,
        message: "getSystemHealth executed successfully",
        data: healthData,
      });
    } catch (error) {
      results.push({
        test: "getSystemHealth static method",
        success: false,
        message: error.message,
      });
    }

    // Test 6: Test getInstance and instance methods
    try {
      const instance = AICentralCommand.getInstance();
      await instance.initialize();
      const agents = instance.getAgents();
      const tasks = instance.getActiveTasks();

      results.push({
        test: "getInstance and instance methods",
        success: true,
        message: "Instance methods working correctly",
        data: {
          agentCount: agents.length,
          taskCount: tasks.length,
        },
      });
    } catch (error) {
      results.push({
        test: "getInstance and instance methods",
        success: false,
        message: error.message,
      });
    }

    const successCount = results.filter((r) => r.success).length;
    const totalTests = results.length;

    return {
      success: successCount === totalTests,
      results,
    };
  } catch (error) {
    results.push({
      test: "Overall system test",
      success: false,
      message: error.message,
    });

    return {
      success: false,
      results,
    };
  }
};

export const logTestResults = async (): Promise<void> => {
  console.group("🧪 AI Central Command Test Results");

  const { success, results } = await testAICentralCommandMethods();

  console.log(`Overall Test Status: ${success ? "✅ PASSED" : "❌ FAILED"}`);
  console.log(
    `Tests Passed: ${results.filter((r) => r.success).length}/${results.length}`,
  );

  results.forEach((result, index) => {
    const status = result.success ? "✅" : "❌";
    console.log(`${status} Test ${index + 1}: ${result.test}`);
    console.log(`   Message: ${result.message}`);
    if (result.data) {
      console.log(`   Data:`, result.data);
    }
  });

  console.groupEnd();
};

// Auto-run test in development
if (import.meta.env.DEV) {
  // Run test after a short delay to ensure all imports are ready
  setTimeout(() => {
    logTestResults().catch(console.error);
  }, 2000);
}
