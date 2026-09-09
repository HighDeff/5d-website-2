import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  getAllItems,
  LibraryItem,
  LibraryItemType,
  setAltMethods,
  setPriority,
  setRetries,
  simulatePlan,
  toggleFavorite,
} from '@/services/AILibraryService';
import { Link } from 'react-router-dom';
import {
  Layers, Star, Search, Filter, Settings, Play, RefreshCw, Rocket, Pin, ListChecks,
  CheckCircle, XCircle, Shuffle, Sparkles, Activity, TriangleAlert, ClipboardList, HeartHandshake
} from 'lucide-react';

const TYPES: { label: string; value: LibraryItemType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Strategies', value: 'strategy' },
  { label: 'Methods', value: 'method' },
  { label: 'Fixes', value: 'fix' },
  { label: 'Commands', value: 'command' },
  { label: 'States', value: 'state' },
];

export default function AILibraryManager() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | LibraryItemType>('all');
  const [onlyFav, setOnlyFav] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [simSteps, setSimSteps] = useState<any[]>([]);
  const [safeMode, setSafeMode] = useState<boolean>(false);

  useEffect(() => {
    setItems(getAllItems());
    setSafeMode(localStorage.getItem('ai_safe_mode') === '1');
  }, []);

  const filtered = useMemo(() => {
    return items.filter(i => {
      if (onlyFav && !i.favorite) return false;
      if (type !== 'all' && i.type !== type) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, type, onlyFav]);

  const toggleSel = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const runSimulation = () => {
    const steps = simulatePlan(selected);
    setSimSteps(steps);
  };

  const saveAlt = (id: string, altIds: string[]) => {
    setAltMethods(id, altIds);
    setItems(getAllItems());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="h-8 w-8 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold">AI Methods & Strategies Library</h1>
              <p className="text-slate-300 text-sm">Browse 600+ strategies, methods, fixes, commands, and states. Favorite, prioritize, set retries and alternates. Simulate plans.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" className="bg-slate-800 border-slate-600">
              <Link to="/ai-management">Back to AI Hub</Link>
            </Button>
            <Button asChild variant="outline" className="bg-slate-800 border-slate-600">
              <a href="#" onClick={(e) => { e.preventDefault(); alert('To persist to a database, please Connect to Neon via MCP in the top bar, then we can wire this library to Postgres.'); }}>Connect DB</a>
            </Button>
          </div>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="col-span-2 flex items-center gap-2">
              <Search className="h-4 w-4 text-slate-400" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, description, tags" className="bg-slate-700 border-slate-600" />
            </div>
            <div>
              <Select value={type} onValueChange={(v: any) => setType(v)}>
                <SelectTrigger className="bg-slate-700 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map(t => <SelectItem key={t.value} value={t.value as any}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm"><Filter className="h-4 w-4"/> Favorites</div>
              <Switch checked={onlyFav} onCheckedChange={setOnlyFav} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="library" className="space-y-4">
          <TabsList className="grid grid-cols-4 bg-slate-800">
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="plan">Plan & Simulate</TabsTrigger>
            <TabsTrigger value="states">Active Check Plane</TabsTrigger>
            <TabsTrigger value="settings">Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filtered.slice(0, 1200).map(item => (
                <Card key={item.id} className="bg-slate-800 border-slate-700">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-cyan-900 text-cyan-300 border-cyan-600">{item.type}</Badge>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-slate-900 text-slate-300 border-slate-600">P{item.priority}</Badge>
                        <Badge variant="outline" className="bg-slate-900 text-slate-300 border-slate-600">R{item.retries}</Badge>
                      </div>
                    </div>
                    <CardTitle className="text-base mt-2">{item.title}</CardTitle>
                    <CardDescription className="text-slate-300">{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map(t => (<Badge key={t} variant="outline" className="text-xs bg-slate-900 border-slate-600">{t}</Badge>))}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600" onClick={() => toggleSel(item.id)}>
                        <ListChecks className="h-3 w-3 mr-1" /> {selected.includes(item.id) ? 'Remove' : 'Add'} to Plan
                      </Button>
                      <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600" onClick={() => { toggleFavorite(item.id); setItems(getAllItems()); }}>
                        <Star className={`h-3 w-3 mr-1 ${item.favorite ? 'text-yellow-400' : ''}`} /> Favorite
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 items-center">
                      <div>
                        <div className="text-xs mb-1">Priority ({item.priority})</div>
                        <Slider min={1} max={5} step={1} value={[item.priority]} onValueChange={([v]) => { setPriority(item.id, v); setItems(getAllItems()); }} />
                      </div>
                      <div>
                        <div className="text-xs mb-1">Retries ({item.retries})</div>
                        <Slider min={0} max={10} step={1} value={[item.retries]} onValueChange={([v]) => { setRetries(item.id, v); setItems(getAllItems()); }} />
                      </div>
                      <div>
                        <Button size="sm" variant="outline" className="w-full bg-slate-700 border-slate-600" onClick={() => {
                          const pool = items.filter(x => x.id !== item.id && (x.type === 'method' || x.type === 'strategy')).slice(0, 50);
                          const current = new Set(item.altMethodIds);
                          const picked = [] as string[];
                          for (const p of pool) { if (picked.length >= 3) break; if (!current.has(p.id)) picked.push(p.id); }
                          saveAlt(item.id, picked);
                        }}>
                          <Shuffle className="h-3 w-3 mr-1"/> Set Alternates
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="plan" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList className="h-4 w-4"/> Selected Plan</CardTitle>
                <CardDescription>{selected.length} items selected</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {selected.map(id => {
                    const it = items.find(i => i.id === id);
                    if (!it) return null;
                    return <Badge key={id} variant="outline" className="bg-slate-900 border-slate-600">{it.title.slice(0, 60)}</Badge>;
                  })}
                </div>
                <div className="flex gap-2">
                  <Button onClick={runSimulation} className="bg-blue-600 hover:bg-blue-700"><Play className="h-4 w-4 mr-1"/> Simulate</Button>
                  <Button variant="outline" className="bg-slate-700 border-slate-600" onClick={() => setSelected([])}><RefreshCw className="h-4 w-4 mr-1"/> Clear</Button>
                </div>
              </CardContent>
            </Card>

            {simSteps.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Rocket className="h-4 w-4"/> Simulation Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {simSteps.map((s, idx) => (
                    <div key={s.id} className="flex items-center justify-between p-2 bg-slate-900 rounded border border-slate-700">
                      <div className="flex items-center gap-2">
                        {s.success ? <CheckCircle className="h-4 w-4 text-green-400"/> : <XCircle className="h-4 w-4 text-red-400"/>}
                        <div>
                          <div className="text-sm">{idx + 1}. {s.title}</div>
                          <div className="text-xs text-slate-400">{s.action} • {s.state} • {s.durationMs}ms</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-300">{s.notes}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="states" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4"/> Active Check Plane</CardTitle>
                <CardDescription>Progressive states for agent coordination, simulation, sharing, testing, and recovery.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                  {['Planning','SelectingAgents','Coordinating','Simulating','ApplyingFix','Verifying','Observing','Recording','Organizing','Assigning','Testing','Benchmarking','Reconfiguring','Sharing','RollbackReady','Recovery','SafeMode','Isolated','Watchdog','Escalating','Confirming','Reporting','Archiving','Completed'].map(st => (
                    <Badge key={st} className="bg-slate-900 border border-slate-600 text-slate-200">{st}</Badge>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="bg-slate-700 border-slate-600" onClick={() => { localStorage.setItem('ai_safe_mode','1'); setSafeMode(true); }}><TriangleAlert className="h-4 w-4 mr-1"/> Enable Safe Mode</Button>
                  <Button variant="outline" className="bg-slate-700 border-slate-600" onClick={() => { localStorage.removeItem('ai_safe_mode'); setSafeMode(false); }}><Sparkles className="h-4 w-4 mr-1"/> Disable Safe Mode</Button>
                  <div className="text-sm text-slate-300">Safe Mode: <span className={safeMode ? 'text-green-400' : 'text-red-400'}>{safeMode ? 'ON' : 'OFF'}</span></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-4 w-4"/> Library Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="text-sm mb-2">Order by Priority</div>
                    <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600" onClick={() => {
                      const next = [...items].sort((a,b) => b.priority - a.priority);
                      localStorage.setItem('ai_library_items_v1', JSON.stringify(next));
                      setItems(next);
                    }}>Apply</Button>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="text-sm mb-2">Show Favorites First</div>
                    <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600" onClick={() => {
                      const next = [...items].sort((a,b) => Number(b.favorite) - Number(a.favorite));
                      localStorage.setItem('ai_library_items_v1', JSON.stringify(next));
                      setItems(next);
                    }}>Apply</Button>
                  </div>
                  <div className="p-3 bg-slate-900 rounded border border-slate-700">
                    <div className="text-sm mb-2">Reset Filters</div>
                    <Button size="sm" variant="outline" className="bg-slate-700 border-slate-600" onClick={() => { setQuery(''); setType('all'); setOnlyFav(false); }}>Reset</Button>
                  </div>
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-700 text-sm">
                  To persist this library to a database and enable cross-device sync, please Open MCP popover and Connect to Neon, Supabase, or Prisma Postgres. Once connected, we can wire this page to your DB.
                </div>
                <div className="p-3 bg-slate-900 rounded border border-slate-700 text-sm flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4"/> Need help? Contact support or open the MCP panel to link services.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
