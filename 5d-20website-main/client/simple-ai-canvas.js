// Simple AI Canvas - Direct implementation that definitely works
console.log("🎮 Loading Simple AI Canvas...");

// Create the canvas immediately
function createSimpleAICanvas() {
  console.log("🎨 Creating Simple AI Canvas...");

  // Remove any existing canvas
  const existing = document.getElementById("simple-ai-canvas");
  if (existing) existing.remove();

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.id = "simple-ai-canvas";
  canvas.width = 1200;
  canvas.height = 800;
  canvas.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 9999;
    border: 5px solid #00ffff;
    border-radius: 12px;
    background: rgba(0, 0, 40, 0.95);
    box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
  `;

  // Add to page
  document.body.appendChild(canvas);

  // Create control panel
  const panel = document.createElement("div");
  panel.id = "simple-ai-controls";
  panel.style.cssText = `
    position: fixed;
    top: 830px;
    left: 20px;
    z-index: 10000;
    background: rgba(0, 0, 40, 0.95);
    border: 3px solid #00ffff;
    border-radius: 8px;
    padding: 15px;
    font-family: monospace;
    color: #00ffff;
  `;

  panel.innerHTML = `
    <div style="margin-bottom: 10px; font-weight: bold; color: #ffffff;">🎮 SIMPLE AI CANVAS</div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button id="test-simple" style="background: #ff0000; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">🧪 TEST</button>
      <button id="create-simple" style="background: #00ff00; color: black; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">🤖 CREATE</button>
      <button id="clear-simple" style="background: #ffff00; color: black; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">🧹 CLEAR</button>
      <button id="animate-simple" style="background: #ff8800; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">▶️ ANIMATE</button>
    </div>
    <div id="simple-status" style="font-size: 12px; color: #88ffff;">Ready</div>
  `;

  document.body.appendChild(panel);

  // Get canvas context
  const ctx = canvas.getContext("2d");

  // Draw initial background
  ctx.fillStyle = "rgba(0, 0, 40, 1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw title
  ctx.fillStyle = "#00ffff";
  ctx.font = "36px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "SIMPLE AI VISUALIZATION",
    canvas.width / 2,
    canvas.height / 2 - 50,
  );

  ctx.font = "18px Arial";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(
    "Canvas is working! Use buttons below to test.",
    canvas.width / 2,
    canvas.height / 2 + 20,
  );

  // Add button events
  let ais = [];
  let animating = false;

  document.getElementById("test-simple").onclick = function () {
    console.log("🧪 TEST CLICKED");
    this.style.background = "#ffffff";
    this.style.color = "#000000";
    setTimeout(() => {
      this.style.background = "#ff0000";
      this.style.color = "#ffffff";
    }, 200);

    // Test render
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "48px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🧪 TEST SUCCESS", canvas.width / 2, canvas.height / 2);

    document.getElementById("simple-status").textContent =
      "✅ Test complete - red background shown";
  };

  document.getElementById("create-simple").onclick = function () {
    console.log("🤖 CREATE CLICKED");
    this.style.background = "#ffffff";
    this.style.color = "#000000";
    setTimeout(() => {
      this.style.background = "#00ff00";
      this.style.color = "#000000";
    }, 200);

    // Clear and create AIs
    ctx.fillStyle = "rgba(0, 0, 40, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ais = [
      { x: 300, y: 200, color: "#ff0000", name: "Central-AI", vx: 2, vy: 1 },
      { x: 600, y: 300, color: "#00ff00", name: "Memory-AI", vx: -1, vy: 2 },
      { x: 900, y: 200, color: "#0000ff", name: "Logic-AI", vx: 1, vy: -1 },
      { x: 450, y: 500, color: "#ffff00", name: "Pattern-AI", vx: -2, vy: 1 },
      { x: 750, y: 400, color: "#ff00ff", name: "Decision-AI", vx: 1, vy: -2 },
    ];

    ais.forEach((ai) => {
      // Draw AI circle
      ctx.fillStyle = ai.color;
      ctx.beginPath();
      ctx.arc(ai.x, ai.y, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Draw AI glow
      ctx.strokeStyle = ai.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ai.x, ai.y, 40, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw AI label
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(ai.name, ai.x, ai.y + 60);
    });

    document.getElementById("simple-status").textContent =
      `✅ Created ${ais.length} AI entities`;
  };

  document.getElementById("clear-simple").onclick = function () {
    console.log("🧹 CLEAR CLICKED");
    this.style.background = "#ffffff";
    this.style.color = "#000000";
    setTimeout(() => {
      this.style.background = "#ffff00";
      this.style.color = "#000000";
    }, 200);

    ctx.fillStyle = "rgba(0, 0, 40, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ais = [];

    document.getElementById("simple-status").textContent = "🧹 Canvas cleared";
  };

  document.getElementById("animate-simple").onclick = function () {
    animating = !animating;
    this.textContent = animating ? "⏸️ PAUSE" : "▶️ ANIMATE";
    this.style.background = animating ? "#ff4444" : "#ff8800";

    document.getElementById("simple-status").textContent = animating
      ? "🎮 Animation started"
      : "⏸️ Animation paused";

    if (animating) {
      animateAIs();
    }
  };

  function animateAIs() {
    if (!animating || ais.length === 0) return;

    // Clear canvas
    ctx.fillStyle = "rgba(0, 0, 40, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw AIs
    ais.forEach((ai) => {
      // Update position
      ai.x += ai.vx;
      ai.y += ai.vy;

      // Bounce off walls
      if (ai.x < 50 || ai.x > canvas.width - 50) ai.vx *= -1;
      if (ai.y < 50 || ai.y > canvas.height - 50) ai.vy *= -1;

      // Keep in bounds
      ai.x = Math.max(50, Math.min(canvas.width - 50, ai.x));
      ai.y = Math.max(50, Math.min(canvas.height - 50, ai.y));

      // Draw AI
      ctx.fillStyle = ai.color;
      ctx.beginPath();
      ctx.arc(ai.x, ai.y, 30, 0, 2 * Math.PI);
      ctx.fill();

      // Draw glow
      ctx.strokeStyle = ai.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(ai.x, ai.y, 40, 0, 2 * Math.PI);
      ctx.stroke();

      // Draw trail
      ctx.fillStyle = ai.color + "40";
      ctx.beginPath();
      ctx.arc(ai.x - ai.vx * 10, ai.y - ai.vy * 10, 20, 0, 2 * Math.PI);
      ctx.fill();
    });

    // Continue animation
    requestAnimationFrame(animateAIs);
  }

  console.log("✅ Simple AI Canvas created successfully!");
  return canvas;
}

// Global functions that definitely work
window.showAICanvas = function () {
  console.log("🎮 SHOW AI CANVAS CALLED");
  createSimpleAICanvas();
  alert(
    "✅ Simple AI Canvas created! Look for cyan-bordered canvas in top-left corner.",
  );
};

window.hideAICanvas = function () {
  const canvas = document.getElementById("simple-ai-canvas");
  const panel = document.getElementById("simple-ai-controls");
  if (canvas) canvas.remove();
  if (panel) panel.remove();
  console.log("🧹 AI Canvas hidden");
};

// Auto-create after 1 second
setTimeout(() => {
  console.log("🎮 Auto-creating Simple AI Canvas...");
  createSimpleAICanvas();

  // Show instructions
  console.log("✅ Simple AI Canvas is ready!");
  console.log("🎮 Available commands:");
  console.log("   showAICanvas() - Show the canvas");
  console.log("   hideAICanvas() - Hide the canvas");

  // Alert user
  setTimeout(() => {
    alert(
      "🎮 AI VISUALIZATION READY!\n\nLook for the CYAN-BORDERED CANVAS in the top-left corner.\n\nUse the colored buttons below it to:\n🧪 TEST - Test canvas\n🤖 CREATE - Make AI entities\n🧹 CLEAR - Clear canvas\n▶️ ANIMATE - Start animation",
    );
  }, 1000);
}, 1000);

console.log("✅ Simple AI Canvas script loaded");
