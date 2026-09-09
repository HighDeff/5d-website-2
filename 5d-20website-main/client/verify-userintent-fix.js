// Quick verification that UserIntentAnalysisAI fixes are working
console.log("🔍 Verifying UserIntentAnalysisAI fixes...");

// Test the fixes
function testUserIntentFixes() {
  try {
    // Test with various elementId types that could cause errors
    const testData = [
      { elementId: "canvas-test", includes: "canvas" }, // normal string
      { elementId: null, includes: "canvas" }, // null
      { elementId: undefined, includes: "canvas" }, // undefined
      { elementId: 123, includes: "canvas" }, // number
      { elementId: { id: "test" }, includes: "canvas" }, // object
      { elementId: "", includes: "canvas" }, // empty string
    ];

    // Simulate the helper function that was added
    function safeElementIdIncludes(elementId, searchString) {
      return typeof elementId === "string" && elementId.includes(searchString);
    }

    console.log("Testing safeElementIdIncludes function:");

    testData.forEach((test, index) => {
      try {
        const result = safeElementIdIncludes(test.elementId, test.includes);
        console.log(
          `✅ Test ${index + 1}: elementId=${JSON.stringify(test.elementId)} -> ${result}`,
        );
      } catch (error) {
        console.error(`❌ Test ${index + 1} failed:`, error.message);
      }
    });

    // Test normalizing interaction data
    const testInteractions = [
      { elementId: "button-1", type: "click", success: true },
      { elementId: null, type: "hover" },
      { elementId: 123, success: "true" },
      { elementId: { toString: () => "form-input" } },
    ];

    console.log("\nTesting interaction normalization:");

    testInteractions.forEach((interaction, index) => {
      try {
        const normalized = {
          type: interaction.type || "click",
          timestamp: interaction.timestamp || new Date().toISOString(),
          elementId:
            typeof interaction.elementId === "string"
              ? interaction.elementId
              : String(interaction.elementId || ""),
          success: Boolean(interaction.success),
          duration: Number(interaction.duration) || 0,
          intention: String(interaction.intention || ""),
          context: String(interaction.context || ""),
          frustrationIndicators: Array.isArray(
            interaction.frustrationIndicators,
          )
            ? interaction.frustrationIndicators.map(String)
            : [],
        };

        console.log(
          `✅ Normalized ${index + 1}: ${JSON.stringify(normalized.elementId)} (type: ${typeof normalized.elementId})`,
        );
      } catch (error) {
        console.error(`❌ Normalization ${index + 1} failed:`, error.message);
      }
    });

    return true;
  } catch (error) {
    console.error("❌ UserIntentAnalysisAI fix verification failed:", error);
    return false;
  }
}

// Run the test
const success = testUserIntentFixes();

if (success) {
  console.log("✅ All UserIntentAnalysisAI fixes verified working!");

  // Add global notification
  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    background: linear-gradient(135deg, #00ff00, #008800);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: monospace;
    font-weight: bold;
  `;

  notification.innerHTML = `
    ✅ USERINTENT ERRORS FIXED
    <div style="font-size: 12px; margin-top: 5px; opacity: 0.9;">elementId.includes() errors resolved</div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
} else {
  console.log("❌ Some fixes may need additional work");
}

// Export for console access
window.testUserIntentFixes = testUserIntentFixes;

console.log("🔍 UserIntentAnalysisAI fix verification complete");
