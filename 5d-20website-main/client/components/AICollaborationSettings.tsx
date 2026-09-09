import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Database, Settings, Save, RefreshCw } from "lucide-react";

interface AgentLite {
  id: string;
  name: string;
  type?: string;
  status?: string;
  lastActivity?: string | Date;
}

interface AgentSettings {
  enabled: boolean;
  shareLogs: boolean;
  allowPII: boolean;
  redactSensitive: boolean;
  retentionDays: number;
  rateLimitPerMin: number;
  role: "leader" | "contributor" | "observer";
  channels: string[];
}

const DEFAULT_AGENT_SETTINGS: AgentSettings = {
  enabled: true,
  shareLogs: false,
  allowPII: false,
  redactSensitive: true,
  retentionDays: 7,
  rateLimitPerMin: 60,
  role: "contributor",
  channels: ["general"],
};

function loadSettings(agentId: string): AgentSettings {
  try {
    const raw = localStorage.getItem(`ai_collab_settings_${agentId}`);
    if (raw) return { ...DEFAULT_AGENT_SETTINGS, ...(JSON.parse(raw) as AgentSettings) };
  } catch {}
  return { ...DEFAULT_AGENT_SETTINGS };
}

function saveSettings(agentId: string, settings: AgentSettings) {
  localStorage.setItem(`ai_collab_settings_${agentId}`, JSON.stringify(settings));
}

const AICollaborationSettings = () => {
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, AgentSettings>>({});
  const [globalPolicy, setGlobalPolicy] = useState({
    defaultEnabled: true,
    defaultShareLogs: false,
    defaultAllowPII: false,
    defaultRedact: true,
    defaultRetentionDays: 7,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        // Prefer AICentralCommand if available
        const mod = await import("@/services/AICentralCommand").catch(() => null as any);
        if (mod?.default) {
          const central = mod.default.getInstance();
          const list = (central.getAgents?.() || []).map((a: any) => ({
            id: a.id,
            name: a.name || a.id,
            type: a.type,
            status: a.status,
            lastActivity: a.lastActivity,
          }));
          setAgents(list);
          const initMap: Record<string, AgentSettings> = {};
          list.forEach((a: AgentLite) => (initMap[a.id] = loadSettings(a.id)));
          setSettingsMap(initMap);
          return;
        }
      } catch {}
      // Fallback to window.aiCollaborationNetwork
      const win: any = window as any;
      const list: AgentLite[] = Array.from(win?.aiCollaborationNetwork?.agents?.values?.() || []).map((a: any) => ({
        id: a.id,
        name: a.name || a.id,
        type: a.type,
        status: a.status,
        lastActivity: a.lastActivity,
      }));
      setAgents(list);
      const initMap: Record<string, AgentSettings> = {};
      list.forEach((a) => (initMap[a.id] = loadSettings(a.id)));
      setSettingsMap(initMap);
    };
    init();
  }, []);

  const saveAll = () => {
    Object.entries(settingsMap).forEach(([id, s]) => saveSettings(id, s));
  };

  const applyGlobalToAll = () => {
    const updated: Record<string, AgentSettings> = {};
    agents.forEach((a) => {
      updated[a.id] = {
        ...loadSettings(a.id),
        enabled: globalPolicy.defaultEnabled,
        shareLogs: globalPolicy.defaultShareLogs,
        allowPII: globalPolicy.defaultAllowPII,
        redactSensitive: globalPolicy.defaultRedact,
        retentionDays: globalPolicy.defaultRetentionDays,
      };
    });
    setSettingsMap(updated);
  };

  const agentCards = useMemo(
    () =>
      agents.map((agent) => {
        const s = settingsMap[agent.id] || DEFAULT_AGENT_SETTINGS;
        return (
          <Card key={agent.id} className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  {agent.name}
                  <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
                    {agent.type || "agent"}
                  </Badge>
                </span>
                <Badge variant="outline" className={`bg-slate-700 text-slate-300 border-slate-600`}>
                  {agent.status || "idle"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Enable Collaboration</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                    <span className="text-xs text-slate-400">Enabled</span>
                    <Switch
                      checked={s.enabled}
                      onCheckedChange={(v) => updateAgent(agent.id, { enabled: v })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Share Logs</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                    <span className="text-xs text-slate-400">Allow</span>
                    <Switch
                      checked={s.shareLogs}
                      onCheckedChange={(v) => updateAgent(agent.id, { shareLogs: v })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Allow PII (redacted)</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                    <span className="text-xs text-slate-400">Allow</span>
                    <Switch
                      checked={s.allowPII}
                      onCheckedChange={(v) => updateAgent(agent.id, { allowPII: v })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Redact Sensitive</Label>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-700">
                    <span className="text-xs text-slate-400">Redact</span>
                    <Switch
                      checked={s.redactSensitive}
                      onCheckedChange={(v) => updateAgent(agent.id, { redactSensitive: v })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Retention Days: {s.retentionDays}</Label>
                  <Slider
                    value={[s.retentionDays]}
                    min={1}
                    max={90}
                    step={1}
                    onValueChange={([v]) => updateAgent(agent.id, { retentionDays: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Rate Limit (per min): {s.rateLimitPerMin}</Label>
                  <Slider
                    value={[s.rateLimitPerMin]}
                    min={10}
                    max={600}
                    step={10}
                    onValueChange={([v]) => updateAgent(agent.id, { rateLimitPerMin: v })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Role</Label>
                  <Select
                    value={s.role}
                    onValueChange={(v: any) => updateAgent(agent.id, { role: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leader">Leader</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                      <SelectItem value="observer">Observer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Channels (comma-separated)</Label>
                  <Input
                    value={s.channels.join(", ")}
                    onChange={(e) =>
                      updateAgent(agent.id, {
                        channels: e.target.value
                          .split(",")
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="general, fixes, research"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      }),
    [agents, settingsMap]
  );

  function updateAgent(id: string, patch: Partial<AgentSettings>) {
    setSettingsMap((prev) => {
      const next = { ...prev, [id]: { ...(prev[id] || DEFAULT_AGENT_SETTINGS), ...patch } };
      saveSettings(id, next[id]);
      return next;
    });
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-400" />
            AI Collaboration Network — Settings
            <Badge variant="outline" className="bg-slate-700 text-slate-300 border-slate-600">
              Live
            </Badge>
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={applyGlobalToAll} className="bg-slate-700 border-slate-600">
              <Settings className="h-3 w-3 mr-1" /> Apply Defaults
            </Button>
            <Button size="sm" onClick={saveAll} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-3 w-3 mr-1" /> Save All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Global Defaults */}
        <Card className="bg-slate-900 border-slate-700">
          <CardContent className="p-3 grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <Label className="text-slate-300">Default Enabled</Label>
              <Switch
                checked={globalPolicy.defaultEnabled}
                onCheckedChange={(v) => setGlobalPolicy((p) => ({ ...p, defaultEnabled: v }))}
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <Label className="text-slate-300">Default Share Logs</Label>
              <Switch
                checked={globalPolicy.defaultShareLogs}
                onCheckedChange={(v) => setGlobalPolicy((p) => ({ ...p, defaultShareLogs: v }))}
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <Label className="text-slate-300">Default Allow PII</Label>
              <Switch
                checked={globalPolicy.defaultAllowPII}
                onCheckedChange={(v) => setGlobalPolicy((p) => ({ ...p, defaultAllowPII: v }))}
              />
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <Label className="text-slate-300">Default Redact</Label>
              <Switch
                checked={globalPolicy.defaultRedact}
                onCheckedChange={(v) => setGlobalPolicy((p) => ({ ...p, defaultRedact: v }))}
              />
            </div>
            <div className="col-span-2">
              <Label className="text-slate-300">Default Retention Days: {globalPolicy.defaultRetentionDays}</Label>
              <Slider
                value={[globalPolicy.defaultRetentionDays]}
                min={1}
                max={90}
                step={1}
                onValueChange={([v]) => setGlobalPolicy((p) => ({ ...p, defaultRetentionDays: v }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Agents */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {agentCards}
        </div>
      </CardContent>
    </Card>
  );
};

export default AICollaborationSettings;
