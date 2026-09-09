import React, { useState, useEffect, useRef } from "react";
import { aiCentralCommand } from "../services/AICentralCommand";
import { recursiveMemorySystem } from "../services/RecursiveMemorySystem";
import { multiLayerCoordination } from "../services/MultiLayerCoordination";
import { reverseThinkingEngine } from "../services/ReverseThinkingEngine";
import { fieldManipulationSystem } from "../services/FieldManipulationSystem";
import { aiRegeneration } from "../services/AIRegeneration";

interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "failed";
  priority: "low" | "medium" | "high" | "critical";
  category: string;
  created_at: Date;
  assigned_ai?: string;
  user_input?: string;
  fix_attempts: number;
  error_details?: string;
}

interface AIChat {
  id: string;
  message: string;
  sender: "user" | "ai";
  timestamp: Date;
  ai_system?: string;
}

interface MovableItem {
  id: string;
  type: "button" | "element" | "task";
  x: number;
  y: number;
  width: number;
  height: number;
  isDragging: boolean;
  moveAttempts: number;
  tempAllowance: boolean;
  lastMoveTime: Date;
}

export const EnhancedTaskDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"tasks" | "chat" | "map">("tasks");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [chatHistory, setChatHistory] = useState<AIChat[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [selectedAI, setSelectedAI] = useState("central_command");
  const [movableItems, setMovableItems] = useState<Map<string, MovableItem>>(
    new Map(),
  );
  const [isMapMovable, setIsMapMovable] = useState(true);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [taskCategory, setTaskCategory] = useState("general");
  const [taskPriority, setTaskPriority] = useState<
    "low" | "medium" | "high" | "critical"
  >("medium");

  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    item: MovableItem | null;
    offset: { x: number; y: number };
  }>({
    item: null,
    offset: { x: 0, y: 0 },
  });

  useEffect(() => {
    initializeDashboard();
    loadExistingTasks();
    initializeCollectionButtonFix();
    setupMapMovability();
  }, []);

  const initializeDashboard = () => {
    console.log("🎮 Enhanced Task Dashboard initializing...");

    // Initialize chat with AI greeting
    setChatHistory([
      {
        id: `chat_${Date.now()}`,
        message:
          "✅ Task Management AI ready! I can help fix issues, create tasks, and manage system functions. What would you like me to help with?",
        sender: "ai",
        timestamp: new Date(),
        ai_system: "central_command",
      },
    ]);

    // Load previous movable items from storage
    loadMovableItems();
  };

  const loadExistingTasks = () => {
    try {
      // Get tasks from various AI systems
      const recursiveTasks = getRecursiveMemoryTasks();
      const coordinationTasks = getCoordinationTasks();
      const collectionsTasks = getCollectionsTasks();

      const allTasks = [
        ...recursiveTasks,
        ...coordinationTasks,
        ...collectionsTasks,
      ];
      setTasks(allTasks);

      console.log(`📋 Loaded ${allTasks.length} existing tasks`);
    } catch (error) {
      console.error("Failed to load existing tasks:", error);
    }
  };

  const initializeCollectionButtonFix = () => {
    console.log("🔧 Initializing Collections Button Fix System...");

    // Detect collections button issues
    const collectionsButton = document.querySelector(
      "[data-collections], .collections-button, button[class*='collection']",
    );

    if (collectionsButton) {
      // Add click monitoring
      collectionsButton.addEventListener("click", (event) => {
        console.log("🔍 Collections button click detected");

        // Check if button is functional
        setTimeout(() => {
          const isWorking = checkCollectionsButtonFunctionality();
          if (!isWorking) {
            handleCollectionsButtonFix(event.target as HTMLElement);
          }
        }, 500);
      });

      // Create task for the detected button
      const buttonTask: TaskItem = {
        id: `collections_fix_${Date.now()}`,
        title: "Collections Button Fix",
        description:
          "Detected collections button, monitoring functionality and applying fixes when needed",
        status: "active",
        priority: "high",
        category: "ui_fixes",
        created_at: new Date(),
        assigned_ai: "recursiveMemorySystem",
        fix_attempts: 0,
      };

      setTasks((prev) => [...prev, buttonTask]);

      console.log("✅ Collections button monitoring established");
    }
  };

  const checkCollectionsButtonFunctionality = (): boolean => {
    try {
      // Check if collections modal/page opened
      const modal = document.querySelector(
        ".modal, [data-modal], [role='dialog']",
      );
      const collectionsContent = document.querySelector(
        "[data-collections-content], .collections-grid, .collection-items",
      );

      if (modal || collectionsContent) {
        console.log("✅ Collections functionality working");
        return true;
      }

      // Check URL changes
      const currentUrl = window.location.href;
      if (
        currentUrl.includes("collections") ||
        currentUrl.includes("collection")
      ) {
        console.log("✅ Collections navigation working");
        return true;
      }

      console.log("❌ Collections button not functional");
      return false;
    } catch (error) {
      console.error("Error checking collections functionality:", error);
      return false;
    }
  };

  const handleCollectionsButtonFix = (button: HTMLElement) => {
    console.log("🔧 Applying collections button fix...");

    // Create fix task
    const fixTask: TaskItem = {
      id: `collections_urgent_fix_${Date.now()}`,
      title: "URGENT: Collections Button Not Functional",
      description: `Collections button clicked but no response detected. Button: ${button.outerHTML.slice(0, 100)}...`,
      status: "pending",
      priority: "critical",
      category: "urgent_fixes",
      created_at: new Date(),
      assigned_ai: "recursiveMemorySystem",
      fix_attempts: 0,
      error_details:
        "Collections button click detected but no functionality response",
    };

    setTasks((prev) => [...prev, fixTask]);

    // Apply immediate fixes
    applyCollectionsButtonFixes(button);

    // Add to chat
    addAIMessage(
      "🚨 DETECTED: Collections button not functional! Applying automatic fixes and creating urgent task.",
      "recursiveMemorySystem",
    );
  };

  const applyCollectionsButtonFixes = (button: HTMLElement) => {
    try {
      // Fix 1: Ensure button has proper event listeners
      const clonedButton = button.cloneNode(true) as HTMLElement;
      button.parentNode?.replaceChild(clonedButton, button);

      // Fix 2: Add href if it's a link without one
      if (clonedButton.tagName === "A" && !clonedButton.getAttribute("href")) {
        clonedButton.setAttribute("href", "/collections");
      }

      // Fix 3: Add proper click handler
      clonedButton.addEventListener("click", () => {
        window.location.href = "/collections";
      });

      // Fix 4: Ensure button is not disabled
      clonedButton.removeAttribute("disabled");
      clonedButton.style.pointerEvents = "auto";

      console.log("✅ Applied emergency collections button fixes");

      // Update task status
      setTasks((prev) =>
        prev.map((task) =>
          task.title.includes("Collections Button")
            ? {
                ...task,
                status: "completed" as const,
                fix_attempts: task.fix_attempts + 1,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("❌ Failed to apply collections button fixes:", error);
    }
  };

  const setupMapMovability = () => {
    console.log("🗺️ Setting up movable map functionality...");

    // Detect map elements
    const mapElements = document.querySelectorAll(
      ".map, [data-map], .interactive-map, .ai-visualization",
    );

    mapElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      const movableItem: MovableItem = {
        id: `map_${index}_${Date.now()}`,
        type: "element",
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
        isDragging: false,
        moveAttempts: 0,
        tempAllowance: false,
        lastMoveTime: new Date(),
      };

      setMovableItems((prev) => new Map(prev).set(movableItem.id, movableItem));
      makeElementMovable(element as HTMLElement, movableItem);
    });
  };

  const makeElementMovable = (element: HTMLElement, item: MovableItem) => {
    element.style.position = "relative";
    element.style.cursor = "move";
    element.style.zIndex = "1000";

    const handleMouseDown = (e: MouseEvent) => {
      // Check for excessive move attempts
      if (item.moveAttempts > 5 && !item.tempAllowance) {
        handleExcessiveMoveAttempts(item);
        return;
      }

      item.isDragging = true;
      item.moveAttempts++;
      item.lastMoveTime = new Date();

      dragRef.current = {
        item,
        offset: {
          x: e.clientX - item.x,
          y: e.clientY - item.y,
        },
      };

      element.style.opacity = "0.8";

      setMovableItems((prev) => new Map(prev).set(item.id, { ...item }));
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current.item || !item.isDragging) return;

      const newX = e.clientX - dragRef.current.offset.x;
      const newY = e.clientY - dragRef.current.offset.y;

      element.style.transform = `translate(${newX - item.x}px, ${newY - item.y}px)`;

      // Update item position
      setMovableItems((prev) =>
        new Map(prev).set(item.id, {
          ...item,
          x: newX,
          y: newY,
        }),
      );
    };

    const handleMouseUp = () => {
      if (!item.isDragging) return;

      item.isDragging = false;
      element.style.opacity = "1";

      dragRef.current = { item: null, offset: { x: 0, y: 0 } };

      setMovableItems((prev) => new Map(prev).set(item.id, { ...item }));
      saveMovableItems();
    };

    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleExcessiveMoveAttempts = (item: MovableItem) => {
    console.log(`🚨 Excessive move attempts detected for ${item.id}`);

    // Grant temporary allowance
    item.tempAllowance = true;
    item.moveAttempts = 0;

    // Create move assistance button
    const assistButton = document.createElement("button");
    assistButton.textContent = "🔧 AI Move Assist";
    assistButton.style.position = "fixed";
    assistButton.style.top = `${item.y - 40}px`;
    assistButton.style.left = `${item.x}px`;
    assistButton.style.zIndex = "10000";
    assistButton.style.background = "#4f46e5";
    assistButton.style.color = "white";
    assistButton.style.border = "none";
    assistButton.style.padding = "8px 12px";
    assistButton.style.borderRadius = "6px";
    assistButton.style.cursor = "pointer";

    assistButton.onclick = () => {
      enableAIMoveAssist(item);
      document.body.removeChild(assistButton);
    };

    document.body.appendChild(assistButton);

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(assistButton)) {
        document.body.removeChild(assistButton);
      }
    }, 10000);

    // Add to chat
    addAIMessage(
      `🔧 Detected excessive move attempts on ${item.type}. Enabled AI move assistance with temporary allowance.`,
      "fieldManipulationSystem",
    );

    // Create task
    const moveTask: TaskItem = {
      id: `move_assist_${Date.now()}`,
      title: "AI Move Assistance",
      description: `User attempting to move ${item.type} multiple times. Provided AI assistance.`,
      status: "active",
      priority: "medium",
      category: "user_assistance",
      created_at: new Date(),
      assigned_ai: "fieldManipulationSystem",
      fix_attempts: 0,
    };

    setTasks((prev) => [...prev, moveTask]);
  };

  const enableAIMoveAssist = (item: MovableItem) => {
    // Smooth AI-assisted movement
    const targetX = window.innerWidth / 2 - item.width / 2;
    const targetY = window.innerHeight / 2 - item.height / 2;

    const element =
      document.getElementById(item.id) ||
      (document.querySelector(`[data-id="${item.id}"]`) as HTMLElement);

    if (element) {
      element.style.transition = "transform 0.5s ease-out";
      element.style.transform = `translate(${targetX - item.x}px, ${targetY - item.y}px)`;

      setTimeout(() => {
        element.style.transition = "";
        item.x = targetX;
        item.y = targetY;
        item.tempAllowance = false;

        setMovableItems((prev) => new Map(prev).set(item.id, { ...item }));
        saveMovableItems();
      }, 500);
    }

    addAIMessage(
      "✅ AI move assistance completed. Element repositioned to center. Temporary allowance expired.",
      "fieldManipulationSystem",
    );
  };

  const createNewTask = () => {
    if (!newTaskInput.trim()) return;

    const task: TaskItem = {
      id: `user_task_${Date.now()}`,
      title: newTaskInput.slice(0, 50),
      description: newTaskInput,
      status: "pending",
      priority: taskPriority,
      category: taskCategory,
      created_at: new Date(),
      assigned_ai: selectedAI,
      fix_attempts: 0,
    };

    setTasks((prev) => [...prev, task]);
    setNewTaskInput("");

    addAIMessage(
      `📋 New task created: "${task.title}". Assigned to ${selectedAI}. I'll begin working on this right away.`,
      selectedAI,
    );

    // Start processing the task
    processTask(task);
  };

  const processTask = async (task: TaskItem) => {
    try {
      console.log(`🤖 Processing task: ${task.title}`);

      // Update task status
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, status: "active" } : t)),
      );

      let result;

      // Route to appropriate AI system
      switch (task.assigned_ai) {
        case "recursiveMemorySystem":
          result = await recursiveMemorySystem.processUserTask(
            task.description,
          );
          break;
        case "multiLayerCoordination":
          result = await multiLayerCoordination.createTask({
            type: "user_request",
            priority: task.priority,
            payload: {
              description: task.description,
              user_input: task.user_input,
            },
          });
          break;
        case "reverseThinkingEngine":
          // Use reverse thinking for complex problems
          result =
            await reverseThinkingEngine.generateNewStrategiesFromExperience(
              task.id,
            );
          break;
        default:
          result = await aiCentralCommand.processUserRequest(task.description);
      }

      // Update task with result
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? { ...t, status: "completed", fix_attempts: t.fix_attempts + 1 }
            : t,
        ),
      );

      addAIMessage(
        `✅ Task completed: "${task.title}". Result: ${JSON.stringify(result).slice(0, 100)}...`,
        task.assigned_ai,
      );
    } catch (error) {
      console.error("Task processing failed:", error);

      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: "failed",
                error_details: error.toString(),
                fix_attempts: t.fix_attempts + 1,
              }
            : t,
        ),
      );

      addAIMessage(
        `❌ Task failed: "${task.title}". Error: ${error.toString().slice(0, 100)}. Creating retry strategy...`,
        task.assigned_ai,
      );
    }
  };

  const sendChatMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message
    const userMessage: AIChat = {
      id: `user_${Date.now()}`,
      message: currentMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);

    // Process AI response
    processAIResponse(currentMessage, selectedAI);
    setCurrentMessage("");
  };

  const processAIResponse = async (message: string, aiSystem: string) => {
    try {
      let response = "";

      // Route to appropriate AI
      switch (aiSystem) {
        case "central_command":
          response = `🤖 Central Command: I'll help you with "${message}". Let me analyze this and create appropriate tasks.`;
          break;
        case "recursiveMemorySystem":
          response = `🧠 Memory System: I've processed your request about "${message}". Checking for similar patterns and solutions.`;
          break;
        case "reverseThinkingEngine":
          response = `🔄 Reverse Thinking: Interesting! Let me think backwards from "${message}" to generate new approaches.`;
          break;
        case "fieldManipulationSystem":
          response = `🌐 Field System: I can help manipulate fields related to "${message}". Would you like me to pierce barriers or perform sensing?`;
          break;
        default:
          response = `🤖 ${aiSystem}: I understand you want help with "${message}". I'm on it!`;
      }

      // Add AI response
      addAIMessage(response, aiSystem);

      // Create task from chat if it seems actionable
      if (isActionableMessage(message)) {
        const task: TaskItem = {
          id: `chat_task_${Date.now()}`,
          title: `Chat Request: ${message.slice(0, 30)}...`,
          description: message,
          status: "pending",
          priority: "medium",
          category: "chat_requests",
          created_at: new Date(),
          assigned_ai: aiSystem,
          user_input: message,
          fix_attempts: 0,
        };

        setTasks((prev) => [...prev, task]);
        processTask(task);
      }
    } catch (error) {
      console.error("AI response failed:", error);
      addAIMessage(
        `❌ Sorry, I encountered an error processing your message. Error: ${error.toString()}`,
        aiSystem,
      );
    }
  };

  const isActionableMessage = (message: string): boolean => {
    const actionKeywords = [
      "fix",
      "create",
      "move",
      "update",
      "delete",
      "change",
      "help",
      "debug",
      "analyze",
      "process",
      "generate",
      "build",
      "test",
      "check",
      "find",
    ];

    return actionKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword),
    );
  };

  const addAIMessage = (message: string, aiSystem: string) => {
    const aiMessage: AIChat = {
      id: `ai_${Date.now()}`,
      message,
      sender: "ai",
      timestamp: new Date(),
      ai_system: aiSystem,
    };

    setChatHistory((prev) => [...prev, aiMessage]);
  };

  // Helper functions for loading tasks from different systems
  const getRecursiveMemoryTasks = (): TaskItem[] => {
    try {
      const features = recursiveMemorySystem.getFeatures();
      return features
        .filter((f) => f.status === "error" || f.errorCount > 0)
        .map((f) => ({
          id: f.id,
          title: f.name,
          description: f.description,
          status:
            f.status === "error" ? ("failed" as const) : ("active" as const),
          priority: f.priority as any,
          category: f.category,
          created_at: f.lastChecked,
          assigned_ai: "recursiveMemorySystem",
          fix_attempts: f.errorCount,
        }));
    } catch {
      return [];
    }
  };

  const getCoordinationTasks = (): TaskItem[] => {
    try {
      const tasks = multiLayerCoordination.getTaskHistory(20);
      return tasks
        .filter((t) => t.status === "failed")
        .map((t) => ({
          id: t.id,
          title: t.type,
          description: `Coordination task: ${t.type}`,
          status: "failed" as const,
          priority: t.priority as any,
          category: "coordination",
          created_at: t.createdAt,
          assigned_ai: "multiLayerCoordination",
          fix_attempts: t.retryCount || 0,
        }));
    } catch {
      return [];
    }
  };

  const getCollectionsTasks = (): TaskItem[] => {
    // Check for collections-related issues
    const collectionsButton = document.querySelector(
      "[data-collections], .collections-button",
    );

    if (collectionsButton && !checkCollectionsButtonFunctionality()) {
      return [
        {
          id: "collections_button_issue",
          title: "Collections Button Issue",
          description:
            "Collections button detected but not functioning properly",
          status: "pending" as const,
          priority: "high" as const,
          category: "ui_fixes",
          created_at: new Date(),
          assigned_ai: "recursiveMemorySystem",
          fix_attempts: 0,
        },
      ];
    }

    return [];
  };

  const loadMovableItems = () => {
    try {
      const stored = localStorage.getItem("movable_items");
      if (stored) {
        const items = JSON.parse(stored);
        const itemsMap = new Map();
        Object.entries(items).forEach(([key, value]) => {
          itemsMap.set(key, value);
        });
        setMovableItems(itemsMap);
      }
    } catch (error) {
      console.error("Failed to load movable items:", error);
    }
  };

  const saveMovableItems = () => {
    try {
      const itemsObj = Object.fromEntries(movableItems);
      localStorage.setItem("movable_items", JSON.stringify(itemsObj));
    } catch (error) {
      console.error("Failed to save movable items:", error);
    }
  };

  // Render components
  const renderTasksTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Create New Task</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">AI System</label>
            <select
              value={selectedAI}
              onChange={(e) => setSelectedAI(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="central_command">Central Command</option>
              <option value="recursiveMemorySystem">Memory System</option>
              <option value="multiLayerCoordination">Coordination</option>
              <option value="reverseThinkingEngine">Reverse Thinking</option>
              <option value="fieldManipulationSystem">Field System</option>
              <option value="aiRegeneration">AI Regeneration</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <textarea
          value={newTaskInput}
          onChange={(e) => setNewTaskInput(e.target.value)}
          placeholder="Describe the task or issue you need help with..."
          className="w-full p-3 border rounded h-24 mb-4"
        />
        <button
          onClick={createNewTask}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📋 Create Task
        </button>
      </div>

      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Active Tasks ({tasks.length})</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 border-b last:border-b-0 ${
                task.status === "failed"
                  ? "bg-red-50"
                  : task.status === "completed"
                    ? "bg-green-50"
                    : task.status === "active"
                      ? "bg-blue-50"
                      : "bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium">{task.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Status: {task.status}</span>
                    <span>Priority: {task.priority}</span>
                    <span>AI: {task.assigned_ai}</span>
                    <span>Attempts: {task.fix_attempts}</span>
                  </div>
                </div>
                <button
                  onClick={() => processTask(task)}
                  disabled={task.status === "active"}
                  className={`px-3 py-1 text-xs rounded ${
                    task.status === "active"
                      ? "bg-gray-300 text-gray-500"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {task.status === "active" ? "Processing..." : "Retry"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChatTab = () => (
    <div className="space-y-4">
      <div className="bg-white border rounded-lg h-96 overflow-y-auto p-4">
        {chatHistory.map((chat) => (
          <div
            key={chat.id}
            className={`mb-4 ${chat.sender === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                chat.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{chat.message}</p>
              <p className="text-xs opacity-75 mt-1">
                {chat.sender === "ai" &&
                  chat.ai_system &&
                  `${chat.ai_system} • `}
                {chat.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <select
          value={selectedAI}
          onChange={(e) => setSelectedAI(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="central_command">Central</option>
          <option value="recursiveMemorySystem">Memory</option>
          <option value="reverseThinkingEngine">Reverse</option>
          <option value="fieldManipulationSystem">Field</option>
        </select>
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
          placeholder="Ask AI for help or create a task..."
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendChatMessage}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          💬 Send
        </button>
      </div>
    </div>
  );

  const renderMapTab = () => (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Movable Map Controls</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isMapMovable}
              onChange={(e) => setIsMapMovable(e.target.checked)}
              className="mr-2"
            />
            Enable Map Movement
          </label>
        </div>
        <p className="text-sm text-gray-600">
          When enabled, map elements can be dragged around. AI will assist if
          you have trouble moving items.
        </p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-4">
          Movable Items ({movableItems.size})
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {Array.from(movableItems.values()).map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-3 bg-gray-50 rounded"
            >
              <div>
                <span className="font-medium">{item.type}</span>
                <span className="text-sm text-gray-500 ml-2">
                  ({item.x.toFixed(0)}, {item.y.toFixed(0)})
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Moves: {item.moveAttempts}
                {item.tempAllowance && (
                  <span className="text-green-600 ml-2">✓ Assisted</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-3 font-medium ${
              activeTab === "tasks"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📋 Tasks & Fixes
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-6 py-3 font-medium ${
              activeTab === "chat"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            💬 AI Chat
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`px-6 py-3 font-medium ${
              activeTab === "map"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🗺️ Movable Map
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "tasks" && renderTasksTab()}
        {activeTab === "chat" && renderChatTab()}
        {activeTab === "map" && renderMapTab()}
      </div>
    </div>
  );
};
