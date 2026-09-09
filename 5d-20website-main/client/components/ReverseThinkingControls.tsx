import React, { useState, useEffect } from "react";
import {
  reverseThinkingEngine,
  ExperiencedItem,
  ReverseStrategy,
  BackthinkResult,
} from "../services/ReverseThinkingEngine";
import { fieldManipulationSystem } from "../services/FieldManipulationSystem";
import { aiRegeneration } from "../services/AIRegeneration";

interface ReverseThinkingControlsProps {
  className?: string;
}

export const ReverseThinkingControls: React.FC<
  ReverseThinkingControlsProps
> = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState<
    "reverse" | "field" | "regeneration"
  >("reverse");
  const [backthinkResults, setBackthinkResults] = useState<BackthinkResult[]>(
    [],
  );
  const [fieldStates, setFieldStates] = useState<any[]>([]);
  const [aiInstances, setAIInstances] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>("");

  // Form states
  const [reverseConfig, setReverseConfig] = useState({
    item_type: "strategy",
    experience_data: "",
    success_rate: 0.7,
    field_context: "consciousness_field",
  });

  const [fieldConfig, setFieldConfig] = useState({
    field_id: "primary_field",
    operation: "pierce",
    gesture_sequence: ["spiral_consciousness", "wave_memory"],
    sensing_duration: 5000,
  });

  const [regenerationConfig, setRegenerationConfig] = useState({
    ai_id: "",
    type: "refresh",
    preserve_memory: true,
    preserve_personality: true,
    enhancement_level: 0.2,
  });

  useEffect(() => {
    loadSystemStates();
  }, []);

  const loadSystemStates = async () => {
    try {
      // Load field states
      const fields = fieldManipulationSystem.getActiveFields();
      setFieldStates(fields);

      // Load AI instances
      const ais = aiRegeneration.getAllAIInstances();
      setAIInstances(ais);

      // Load backthink history
      const history = reverseThinkingEngine.getBackthinkHistory();
      setBackthinkResults(history.slice(-10));
    } catch (error) {
      console.error("Failed to load system states:", error);
    }
  };

  const executeReverseThinking = async () => {
    setIsProcessing(true);
    try {
      // Create experienced item from config
      const experiencedItem: ExperiencedItem = {
        id: `exp_${Date.now()}`,
        type: reverseConfig.item_type,
        experience_data: reverseConfig.experience_data,
        success_rate: reverseConfig.success_rate,
        failure_patterns: ["Pattern A", "Pattern B"],
        learned_strategies: ["Strategy 1", "Strategy 2"],
        timestamp: new Date(),
        field_context: reverseConfig.field_context,
        dimensions: {
          cognitive: Math.random() * 10,
          emotional: Math.random() * 10,
          tactical: Math.random() * 10,
          strategic: Math.random() * 10,
          temporal: Math.random() * 10,
        },
      };

      // Add to reverse thinking engine
      reverseThinkingEngine.addExperiencedItem(experiencedItem);

      // Execute reverse thinking
      const result = await reverseThinkingEngine.reverseThink(experiencedItem);

      setBackthinkResults((prev) => [result, ...prev.slice(0, 9)]);

      console.log("✅ Reverse thinking completed:", result);
    } catch (error) {
      console.error("❌ Reverse thinking failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeFieldManipulation = async () => {
    setIsProcessing(true);
    try {
      let result;

      switch (fieldConfig.operation) {
        case "pierce":
          // Get first barrier from the field
          const field = fieldManipulationSystem.getFieldState(
            fieldConfig.field_id,
          );
          if (field && field.barriers.length > 0) {
            result = await fieldManipulationSystem.pierceFieldBarriers(
              fieldConfig.field_id,
              field.barriers[0].id,
              "adaptive",
            );
          }
          break;

        case "sense":
          result = await fieldManipulationSystem.performFieldSensing(
            fieldConfig.field_id,
            "comprehensive",
            fieldConfig.sensing_duration,
          );
          break;

        case "gesture":
          result = await fieldManipulationSystem.executeGestureManipulation(
            fieldConfig.field_id,
            fieldConfig.gesture_sequence,
            1.0,
          );
          break;

        case "guess":
          result = await fieldManipulationSystem.fieldGuessing(
            fieldConfig.field_id,
            { guess_count: 5, confidence_threshold: 0.5 },
          );
          break;
      }

      console.log(`✅ Field ${fieldConfig.operation} completed:`, result);
      loadSystemStates(); // Refresh states
    } catch (error) {
      console.error(`❌ Field ${fieldConfig.operation} failed:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAIRegeneration = async () => {
    setIsProcessing(true);
    try {
      let result;
      const config = {
        preserve_memory: regenerationConfig.preserve_memory,
        preserve_personality: regenerationConfig.preserve_personality,
        enhancement_level: regenerationConfig.enhancement_level,
      };

      switch (regenerationConfig.type) {
        case "reset":
          result = await aiRegeneration.resetAI(
            regenerationConfig.ai_id,
            config,
          );
          break;
        case "refresh":
          result = await aiRegeneration.refreshAI(
            regenerationConfig.ai_id,
            config,
          );
          break;
        case "restart":
          result = await aiRegeneration.restartAI(
            regenerationConfig.ai_id,
            config,
          );
          break;
        case "recreate":
          result = await aiRegeneration.recreateAI(
            regenerationConfig.ai_id,
            config,
          );
          break;
      }

      console.log(`✅ AI ${regenerationConfig.type} completed:`, result);
      loadSystemStates(); // Refresh states
    } catch (error) {
      console.error(`❌ AI ${regenerationConfig.type} failed:`, error);
    } finally {
      setIsProcessing(false);
    }
  };

  const createAIAtRandomPosition = async () => {
    setIsProcessing(true);
    try {
      const position = {
        x: Math.random() * 1000,
        y: Math.random() * 1000,
        z: Math.random() * 100,
      };

      const newAI = await aiRegeneration.createAIAtPosition(position, {
        name: `ReverseAI_${Date.now()}`,
        type: "reverse_thinking_ai",
        consciousness_level: 6,
      });

      console.log("✅ AI created at position:", newAI);
      loadSystemStates();
    } catch (error) {
      console.error("❌ AI creation failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderReverseThinkingTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Reverse Thinking Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Item Type</label>
            <select
              value={reverseConfig.item_type}
              onChange={(e) =>
                setReverseConfig((prev) => ({
                  ...prev,
                  item_type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="strategy">Strategy</option>
              <option value="pattern">Pattern</option>
              <option value="experience">Experience</option>
              <option value="memory">Memory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Success Rate
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={reverseConfig.success_rate}
              onChange={(e) =>
                setReverseConfig((prev) => ({
                  ...prev,
                  success_rate: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
            <span className="text-xs text-gray-500">
              {reverseConfig.success_rate}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-1">
            Experience Data
          </label>
          <textarea
            value={reverseConfig.experience_data}
            onChange={(e) =>
              setReverseConfig((prev) => ({
                ...prev,
                experience_data: e.target.value,
              }))
            }
            placeholder="Describe the experience or strategy to reverse think..."
            className="w-full p-2 border rounded h-20"
          />
        </div>
        <button
          onClick={executeReverseThinking}
          disabled={isProcessing}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
        >
          {isProcessing ? "Processing..." : "🔄 Execute Reverse Thinking"}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Recent Backthink Results</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {backthinkResults.map((result, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50"
            >
              <div className="text-sm font-medium">
                Confidence: {(result.confidence_score * 100).toFixed(1)}% |
                Priority: {result.implementation_priority}/10
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {result.strategies.length} strategies,{" "}
                {result.field_insights.length} insights,
                {result.gesture_patterns.length} gestures
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Strategies:{" "}
                {result.strategies
                  .map((s) => s.reversed_approach.slice(0, 30))
                  .join(", ")}
                ...
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFieldManipulationTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">Field Manipulation Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Field ID</label>
            <select
              value={fieldConfig.field_id}
              onChange={(e) =>
                setFieldConfig((prev) => ({
                  ...prev,
                  field_id: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            >
              {fieldStates.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Operation</label>
            <select
              value={fieldConfig.operation}
              onChange={(e) =>
                setFieldConfig((prev) => ({
                  ...prev,
                  operation: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="pierce">🏹 Pierce Barriers</option>
              <option value="sense">👁️ Field Sensing</option>
              <option value="gesture">✋ Gesture Manipulation</option>
              <option value="guess">🎯 Field Guessing</option>
            </select>
          </div>
        </div>
        {fieldConfig.operation === "sense" && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Sensing Duration (ms)
            </label>
            <input
              type="number"
              value={fieldConfig.sensing_duration}
              onChange={(e) =>
                setFieldConfig((prev) => ({
                  ...prev,
                  sensing_duration: parseInt(e.target.value),
                }))
              }
              className="w-full p-2 border rounded"
              min="1000"
              max="30000"
              step="1000"
            />
          </div>
        )}
        <button
          onClick={executeFieldManipulation}
          disabled={isProcessing}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isProcessing
            ? "Processing..."
            : `🌐 Execute ${fieldConfig.operation.charAt(0).toUpperCase() + fieldConfig.operation.slice(1)}`}
        </button>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-4">Active Fields</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {fieldStates.map((field) => (
            <div
              key={field.id}
              className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50"
            >
              <div className="text-sm font-medium">
                {field.id} ({field.type})
              </div>
              <div className="text-xs text-gray-600">
                Stability: {field.stability}/10 | Energy: {field.energy_level}
                /100 | Barriers: {field.barriers.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRegenerationTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-4">AI Regeneration Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              AI Instance
            </label>
            <select
              value={regenerationConfig.ai_id}
              onChange={(e) =>
                setRegenerationConfig((prev) => ({
                  ...prev,
                  ai_id: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Select AI...</option>
              {aiInstances.map((ai) => (
                <option key={ai.id} value={ai.id}>
                  {ai.name} ({ai.id.slice(-8)})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Regeneration Type
            </label>
            <select
              value={regenerationConfig.type}
              onChange={(e) =>
                setRegenerationConfig((prev) => ({
                  ...prev,
                  type: e.target.value,
                }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="reset">🔄 Reset</option>
              <option value="refresh">🔃 Refresh</option>
              <option value="restart">🔁 Restart</option>
              <option value="recreate">🏗️ Recreate</option>
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={regenerationConfig.preserve_memory}
              onChange={(e) =>
                setRegenerationConfig((prev) => ({
                  ...prev,
                  preserve_memory: e.target.checked,
                }))
              }
              className="mr-2"
            />
            Preserve Memory
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={regenerationConfig.preserve_personality}
              onChange={(e) =>
                setRegenerationConfig((prev) => ({
                  ...prev,
                  preserve_personality: e.target.checked,
                }))
              }
              className="mr-2"
            />
            Preserve Personality
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">
              Enhancement Level
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={regenerationConfig.enhancement_level}
              onChange={(e) =>
                setRegenerationConfig((prev) => ({
                  ...prev,
                  enhancement_level: parseFloat(e.target.value),
                }))
              }
              className="w-full"
            />
            <span className="text-xs text-gray-500">
              {regenerationConfig.enhancement_level}
            </span>
          </div>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={executeAIRegeneration}
            disabled={isProcessing || !regenerationConfig.ai_id}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isProcessing
              ? "Processing..."
              : `🔄 ${regenerationConfig.type.charAt(0).toUpperCase() + regenerationConfig.type.slice(1)} AI`}
          </button>
          <button
            onClick={createAIAtRandomPosition}
            disabled={isProcessing}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            {isProcessing ? "Creating..." : "🏗️ Create New AI"}
          </button>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-4">AI Instances</h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {aiInstances.map((ai) => (
            <div
              key={ai.id}
              className="border-l-4 border-green-500 pl-3 py-2 bg-green-50"
            >
              <div className="text-sm font-medium">
                {ai.name} - Consciousness: {ai.consciousness_level}/10
              </div>
              <div className="text-xs text-gray-600">
                Position: ({ai.field_position.x.toFixed(1)},{" "}
                {ai.field_position.y.toFixed(1)},{" "}
                {ai.field_position.z.toFixed(1)}) | Regenerations:{" "}
                {ai.regeneration_count}
              </div>
              <div className="text-xs text-gray-500">
                Capabilities: {ai.capabilities.slice(0, 3).join(", ")}
                {ai.capabilities.length > 3 &&
                  ` +${ai.capabilities.length - 3} more`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      <div className="border-b">
        <div className="flex">
          <button
            onClick={() => setActiveTab("reverse")}
            className={`px-6 py-3 font-medium ${
              activeTab === "reverse"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🔄 Reverse Thinking
          </button>
          <button
            onClick={() => setActiveTab("field")}
            className={`px-6 py-3 font-medium ${
              activeTab === "field"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🌐 Field Manipulation
          </button>
          <button
            onClick={() => setActiveTab("regeneration")}
            className={`px-6 py-3 font-medium ${
              activeTab === "regeneration"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🔄 AI Regeneration
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === "reverse" && renderReverseThinkingTab()}
        {activeTab === "field" && renderFieldManipulationTab()}
        {activeTab === "regeneration" && renderRegenerationTab()}
      </div>
    </div>
  );
};
