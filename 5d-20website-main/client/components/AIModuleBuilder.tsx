import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bot,
  Brain,
  Settings,
  Play,
  Pause,
  Plus,
  Users,
  Share,
  Trash2,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  MessageSquare,
  Code,
} from "lucide-react";
import {
  customAIModuleBuilder,
  AIModule,
  AICapability,
  AITrigger,
  AIAction,
  FriendAIAccess,
} from "../services/CustomAIModuleBuilder";

interface AIModuleBuilderProps {
  userId: string;
  membershipLevel: string;
  friends?: string[];
}

const AIModuleBuilder: React.FC<AIModuleBuilderProps> = ({
  userId,
  membershipLevel,
  friends = [],
}) => {
  const [userModules, setUserModules] = useState<AIModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);
  const [availableCapabilities, setAvailableCapabilities] = useState<
    AICapability[]
  >([]);
  const [isCreating, setIsCreating] = useState(false);

  // New module form
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    [],
  );

  // Trigger form
  const [newTriggerType, setNewTriggerType] =
    useState<AITrigger["type"]>("manual");
  const [newTriggerCondition, setNewTriggerCondition] = useState("");
  const [newTriggerFrequency, setNewTriggerFrequency] = useState("");

  // Action form
  const [newActionType, setNewActionType] =
    useState<AIAction["type"]>("notification");
  const [newActionTarget, setNewActionTarget] = useState("");
  const [newActionParams, setNewActionParams] = useState("");

  // Friend access form
  const [selectedFriend, setSelectedFriend] = useState("");
  const [friendPermissions, setFriendPermissions] = useState<string[]>([]);

  useEffect(() => {
    loadUserModules();
    loadAvailableCapabilities();
  }, [userId, membershipLevel]);

  const loadUserModules = () => {
    const modules = customAIModuleBuilder.getUserModules(userId);
    setUserModules(modules);
    if (modules.length > 0 && !selectedModule) {
      setSelectedModule(modules[0]);
    }
  };

  const loadAvailableCapabilities = () => {
    const capabilities =
      customAIModuleBuilder.getAvailableCapabilities(membershipLevel);
    setAvailableCapabilities(capabilities);
  };

  const createNewModule = () => {
    if (!newModuleName.trim() || selectedCapabilities.length === 0) return;

    const module = customAIModuleBuilder.createAIModule(
      userId,
      newModuleName,
      newModuleDescription,
      selectedCapabilities,
      membershipLevel,
    );

    setSelectedModule(module);
    setIsCreating(false);
    setNewModuleName("");
    setNewModuleDescription("");
    setSelectedCapabilities([]);
    loadUserModules();
  };

  const toggleCapability = (capabilityId: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(capabilityId)
        ? prev.filter((id) => id !== capabilityId)
        : [...prev, capabilityId],
    );
  };

  const addTrigger = () => {
    if (!selectedModule || !newTriggerCondition.trim()) return;

    const success = customAIModuleBuilder.addTrigger(
      userId,
      selectedModule.id,
      newTriggerType,
      newTriggerCondition,
      newTriggerFrequency || undefined,
    );

    if (success) {
      setNewTriggerCondition("");
      setNewTriggerFrequency("");
      loadUserModules();

      // Update selected module
      const updatedModules = customAIModuleBuilder.getUserModules(userId);
      const updated = updatedModules.find((m) => m.id === selectedModule.id);
      if (updated) setSelectedModule(updated);
    }
  };

  const addAction = () => {
    if (!selectedModule || !newActionTarget.trim()) return;

    let parameters = {};
    try {
      parameters = newActionParams ? JSON.parse(newActionParams) : {};
    } catch (error) {
      alert("Invalid JSON in parameters");
      return;
    }

    const success = customAIModuleBuilder.addAction(
      userId,
      selectedModule.id,
      newActionType,
      newActionTarget,
      parameters,
    );

    if (success) {
      setNewActionTarget("");
      setNewActionParams("");
      loadUserModules();

      // Update selected module
      const updatedModules = customAIModuleBuilder.getUserModules(userId);
      const updated = updatedModules.find((m) => m.id === selectedModule.id);
      if (updated) setSelectedModule(updated);
    }
  };

  const toggleModule = (moduleId: string, isActive: boolean) => {
    customAIModuleBuilder.toggleModule(userId, moduleId, isActive);
    loadUserModules();

    if (selectedModule?.id === moduleId) {
      const updatedModules = customAIModuleBuilder.getUserModules(userId);
      const updated = updatedModules.find((m) => m.id === moduleId);
      if (updated) setSelectedModule(updated);
    }
  };

  const grantFriendAccess = () => {
    if (
      !selectedModule ||
      !selectedFriend ||
      friendPermissions.length === 0 ||
      membershipLevel === "free"
    )
      return;

    const parameters = {
      maxBidAmount: 100,
      promotionBudget: 50,
      allowedActions: friendPermissions,
    };

    const success = customAIModuleBuilder.grantFriendAccess(
      userId,
      selectedModule.id,
      selectedFriend,
      friendPermissions,
      parameters,
    );

    if (success) {
      setSelectedFriend("");
      setFriendPermissions([]);
      alert("Friend access granted successfully!");
    }
  };

  const executeModuleAction = async (moduleId: string, actionId: string) => {
    try {
      const result = await customAIModuleBuilder.executeModuleAction(
        userId,
        moduleId,
        actionId,
      );
      alert(`Action executed successfully: ${JSON.stringify(result)}`);
    } catch (error) {
      alert(`Action failed: ${error}`);
    }
  };

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case "premium":
        return <Shield className="w-4 h-4 text-purple-600" />;
      case "member":
        return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCapabilityIcon = (type: string) => {
    switch (type) {
      case "account_management":
        return <Settings className="w-4 h-4" />;
      case "product_management":
        return <Bot className="w-4 h-4" />;
      case "social_media":
        return <Share className="w-4 h-4" />;
      case "analytics":
        return <TrendingUp className="w-4 h-4" />;
      case "automation":
        return <Zap className="w-4 h-4" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bot className="w-8 h-8 mr-3 text-purple-600" />
            Custom AI Module Builder
          </h1>
          <p className="text-gray-600 mt-1">
            Create personalized AI assistants for your account
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="flex items-center space-x-1">
            {getMembershipIcon(membershipLevel)}
            <span>{membershipLevel.toUpperCase()}</span>
          </Badge>

          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New AI Module
          </Button>
        </div>
      </div>

      {/* Membership Info */}
      {membershipLevel === "free" && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">
                  Upgrade for Advanced Features
                </h3>
                <p className="text-sm text-orange-700">
                  Members and Premium users can create friend AI access,
                  advanced automation, and social media integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Your AI Modules ({userModules.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userModules.map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedModule?.id === module.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedModule(module)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{module.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Badge
                        variant={module.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {module.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModule(module.id, !module.isActive);
                        }}
                      >
                        {module.isActive ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {module.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    Last used: {module.lastUsed.toLocaleDateString()}
                  </div>
                </div>
              ))}

              {userModules.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">No AI modules yet</p>
                  <p className="text-sm text-gray-400">
                    Create your first AI assistant
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Module Details */}
        <div className="lg:col-span-2">
          {isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>Create New AI Module</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Module Name
                    </label>
                    <Input
                      value={newModuleName}
                      onChange={(e) => setNewModuleName(e.target.value)}
                      placeholder="My AI Assistant"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Description
                    </label>
                    <Textarea
                      value={newModuleDescription}
                      onChange={(e) => setNewModuleDescription(e.target.value)}
                      placeholder="Describe what your AI will do..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Capabilities
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {availableCapabilities.map((capability) => (
                        <div
                          key={capability.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedCapabilities.includes(capability.id)
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => toggleCapability(capability.id)}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            {getCapabilityIcon(capability.type)}
                            <span className="font-medium text-sm">
                              {capability.name}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {capability.membershipRequired}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">
                            {capability.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={createNewModule}>Create Module</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : selectedModule ? (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="triggers">Triggers</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="friends">Friends</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {selectedModule.name}
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            selectedModule.isActive ? "default" : "secondary"
                          }
                        >
                          {selectedModule.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() =>
                            toggleModule(
                              selectedModule.id,
                              !selectedModule.isActive,
                            )
                          }
                        >
                          {selectedModule.isActive ? (
                            <Pause className="w-4 h-4 mr-2" />
                          ) : (
                            <Play className="w-4 h-4 mr-2" />
                          )}
                          {selectedModule.isActive ? "Pause" : "Activate"}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {selectedModule.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedModule.capabilities.length}
                        </div>
                        <div className="text-sm text-gray-600">
                          Capabilities
                        </div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedModule.triggers.length}
                        </div>
                        <div className="text-sm text-gray-600">Triggers</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedModule.actions.length}
                        </div>
                        <div className="text-sm text-gray-600">Actions</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Capabilities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedModule.capabilities.map((capability) => (
                          <Badge
                            key={capability.id}
                            variant="outline"
                            className="flex items-center space-x-1"
                          >
                            {getCapabilityIcon(capability.type)}
                            <span>{capability.name}</span>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="triggers">
                <Card>
                  <CardHeader>
                    <CardTitle>Triggers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add Trigger Form */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-3">Add New Trigger</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <Select
                            value={newTriggerType}
                            onValueChange={(value) =>
                              setNewTriggerType(value as AITrigger["type"])
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manual">Manual</SelectItem>
                              <SelectItem value="schedule">Schedule</SelectItem>
                              <SelectItem value="event">Event</SelectItem>
                              <SelectItem value="data_change">
                                Data Change
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder="Condition"
                            value={newTriggerCondition}
                            onChange={(e) =>
                              setNewTriggerCondition(e.target.value)
                            }
                          />

                          {newTriggerType === "schedule" && (
                            <Input
                              placeholder="Frequency (e.g., 1h, 30m)"
                              value={newTriggerFrequency}
                              onChange={(e) =>
                                setNewTriggerFrequency(e.target.value)
                              }
                            />
                          )}
                        </div>
                        <Button size="sm" className="mt-3" onClick={addTrigger}>
                          Add Trigger
                        </Button>
                      </div>

                      {/* Existing Triggers */}
                      <div className="space-y-2">
                        {selectedModule.triggers.map((trigger) => (
                          <div
                            key={trigger.id}
                            className="flex items-center justify-between p-3 border rounded"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{trigger.type}</Badge>
                                <span className="font-medium">
                                  {trigger.condition}
                                </span>
                              </div>
                              {trigger.frequency && (
                                <p className="text-sm text-gray-600">
                                  Every {trigger.frequency}
                                </p>
                              )}
                            </div>
                            <Badge
                              variant={
                                trigger.enabled ? "default" : "secondary"
                              }
                            >
                              {trigger.enabled ? "Enabled" : "Disabled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions">
                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Add Action Form */}
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <h4 className="font-medium mb-3">Add New Action</h4>
                        <div className="space-y-3">
                          <Select
                            value={newActionType}
                            onValueChange={(value) =>
                              setNewActionType(value as AIAction["type"])
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="notification">
                                Notification
                              </SelectItem>
                              <SelectItem value="api_call">API Call</SelectItem>
                              <SelectItem value="data_update">
                                Data Update
                              </SelectItem>
                              <SelectItem value="social_post">
                                Social Post
                              </SelectItem>
                              <SelectItem value="custom_code">
                                Custom Code
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Input
                            placeholder="Target"
                            value={newActionTarget}
                            onChange={(e) => setNewActionTarget(e.target.value)}
                          />

                          <Textarea
                            placeholder='Parameters (JSON format, e.g., {"title": "Hello", "message": "World"})'
                            value={newActionParams}
                            onChange={(e) => setNewActionParams(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <Button size="sm" className="mt-3" onClick={addAction}>
                          Add Action
                        </Button>
                      </div>

                      {/* Existing Actions */}
                      <div className="space-y-2">
                        {selectedModule.actions.map((action) => (
                          <div
                            key={action.id}
                            className="flex items-center justify-between p-3 border rounded"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">{action.type}</Badge>
                                <span className="font-medium">
                                  {action.target}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">
                                Priority: {action.priority}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                executeModuleAction(
                                  selectedModule.id,
                                  action.id,
                                )
                              }
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Execute
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="friends">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      Friend AI Access
                      {membershipLevel === "free" && (
                        <Badge variant="outline" className="ml-2">
                          Members Only
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {membershipLevel !== "free" ? (
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4 bg-gray-50">
                          <h4 className="font-medium mb-3">
                            Grant Friend Access
                          </h4>
                          <div className="space-y-3">
                            <Select
                              value={selectedFriend}
                              onValueChange={setSelectedFriend}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select friend" />
                              </SelectTrigger>
                              <SelectContent>
                                {friends.map((friend) => (
                                  <SelectItem key={friend} value={friend}>
                                    {friend}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div>
                              <label className="block text-sm font-medium mb-2">
                                Permissions
                              </label>
                              <div className="space-y-2">
                                {[
                                  "adjust_bidding",
                                  "promote_items",
                                  "view_analytics",
                                  "manage_listings",
                                ].map((permission) => (
                                  <label
                                    key={permission}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={friendPermissions.includes(
                                        permission,
                                      )}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFriendPermissions((prev) => [
                                            ...prev,
                                            permission,
                                          ]);
                                        } else {
                                          setFriendPermissions((prev) =>
                                            prev.filter(
                                              (p) => p !== permission,
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                    <span className="text-sm capitalize">
                                      {permission.replace("_", " ")}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="mt-3"
                            onClick={grantFriendAccess}
                          >
                            Grant Access
                          </Button>
                        </div>

                        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                          <h5 className="font-medium mb-1">
                            Friend AI Features:
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              <strong>Adjust Bidding:</strong> Friend can modify
                              bidding parameters for your items
                            </li>
                            <li>
                              <strong>Promote Items:</strong> Friend can promote
                              your products on social media
                            </li>
                            <li>
                              <strong>View Analytics:</strong> Friend can see
                              performance data
                            </li>
                            <li>
                              <strong>Manage Listings:</strong> Friend can help
                              manage your product listings
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500 mb-2">
                          Friend AI Access is available for Members and Premium
                          users
                        </p>
                        <p className="text-sm text-gray-400">
                          Upgrade your membership to allow friends to help
                          manage your AI modules
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="test">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2" />
                      Test & Debug
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Quick Test</h4>
                        <p className="text-sm text-gray-600 mb-3">
                          Test your AI module by executing all actions manually
                        </p>
                        <Button
                          onClick={() => {
                            selectedModule?.actions.forEach((action) => {
                              executeModuleAction(selectedModule.id, action.id);
                            });
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Run All Actions
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Module Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge
                              variant={
                                selectedModule?.isActive
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedModule?.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Used:</span>
                            <span>
                              {selectedModule?.lastUsed.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Triggers:</span>
                            <span>{selectedModule?.triggers.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Actions:</span>
                            <span>{selectedModule?.actions.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Bot className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No module selected
                </h3>
                <p className="text-gray-500">
                  Select a module from the left panel or create a new one
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIModuleBuilder;
