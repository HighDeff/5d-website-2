import { nanoid } from 'nanoid/non-secure';

export type LibraryItemType = 'strategy' | 'method' | 'fix' | 'command' | 'state';

export interface LibraryItem {
  id: string;
  type: LibraryItemType;
  title: string;
  description: string;
  tags: string[];
  priority: number; // 1 (low) - 5 (high)
  retries: number; // 0-10
  altMethodIds: string[]; // fallback chain
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SimulationResultStep {
  id: string;
  itemId: string;
  title: string;
  action: string;
  state: string;
  durationMs: number;
  success: boolean;
  notes?: string;
}

const STORAGE_KEY = 'ai_library_items_v1';

function seedBase(): { categories: string[]; actions: string[]; domains: string[]; tactics: string[]; states: string[] } {
  const categories = [
    'Networking','Parsing','Auth','Caching','Retry','Streaming','RateLimit','Concurrency','Token','Prompt','Eval','Logging','Telemetry','Security','Sanitization','Throttling','CircuitBreaker','Transport','Compression','Shard','Queue','Batch','Index','Rollout','Rollback','ColdStart','Warmup','Prefetch','Timeout','Fallback','Heuristic','Semantic','Vector','Search','Ranking','Summarization','Synthesis','Validation','Schema','Transform','ETL','OCR','Vision','Speech','Audio','Image','PDF','HTML','JSON','CSV','Graph','RPC','WebSocket','SSE','gRPC','REST','Proxy','CDN','CacheBust','Pagination','Dedup','Idempotency','Consistency','Storage','Encryption','Decryption','KeyMgmt','Versioning','A/B','Blue/Green','Canary','Shadow','Snapshot','Backup','Restore','SafeMode','Isolation','Sandbox','Simulation','Test','Benchmark','Profile','Trace','Health','SelfHeal','Repair','Migration','Bootstrap','Shutdown','Recovery','Monitoring','Alerting','Dashboard','Playbook','Runbook','Escalation','Ownership','SLO','SLA','SLI'
  ];
  const actions = [
    'Detect','Fix','Retry','Switch','Validate','Normalize','Trim','Compress','Encrypt','Decrypt','Redact','Mask','Snapshot','Restore','Scrub','Paginate','Batch','Queue','Throttle','Debounce','Backoff','Probe','Warm','Cool','Prefetch','Rebuild','Reindex','Invalidate','Refresh','Summarize','Rank','Cluster','Vectorize','Embed','Classify','Route','Shard','Balance','Failover','Mirror','Shadow','Benchmark','Profile','Trace','Simulate','Test','Monitor','Alert','Escalate','Report','Audit','Log','Sample','Calibrate','Tune','Optimize','Prioritize','Deduplicate','Merge','Split','Chunk','Stream','Buffer','Resume','Checkpoint','Handoff','Quarantine','Sandbox','Isolate','Recover','Harden','ValidateSchema','SanitizeHTML','VerifySignature','RotateKey','RenewToken','RevokeKey','Authenticate','Authorize','Scope','ScopeDown','Transcode','Resize','OCR','Parse','Transform','Render','Annotate','Hash','Checksum','Diff','Patch','Rollout','Rollback','Commit','Stage','Gate','Approve','Plan','Review'
  ];
  const domains = [
    'API','DB','Cache','Queue','File','Blob','Auth','Search','VectorDB','LLM','Model','GPU','CPU','Memory','Network','Browser','Mobile','Server','Edge','CDN','Proxy','Gateway','Worker','Scheduler','Cron','Billing','Analytics','FeatureFlag','AIAgent','Monitoring','Alerting','CI','CD','Testing','Security','Compliance','Privacy','Observability'
  ];
  const tactics = [
    'ExponentialBackoff','Jitter','CircuitBreaker','Bulkhead','TimeoutBudget','TokenBucket','LeakyBucket','SlidingWindow','AdaptiveRate','HealthProbe','ProgressiveEnhancement','GracefulDegradation','ShadowWrite','ShadowRead','BlueGreen','Canary','StickySession','ConnectionPool','KeepAlive','Compression','DeltaSync','ETag','If-Modified-Since','Prefetcher','HeuristicCutoff','SemanticCache','ColdStartMitigation','WarmPool','Prewarming','LazyInit','EagerInit','FastPath','SlowPath','RetryQueue','DeadLetter','PoisonQueue','IdempotencyKey','ConsistencyCheck','SchemaGuard','AutoRollback','AutoFix','SelfHealing','Watchdog','Quorum','MajorityVote','LeaderElection','Gossip','Raft','Paxos','TwoPhaseCommit','SAGA','CQRS','EventSourcing'
  ];
  const states = [
    'Planning','SelectingAgents','Coordinating','Simulating','ApplyingFix','Verifying','Observing','Recording','Organizing','Assigning','Testing','Benchmarking','Reconfiguring','Sharing','RollbackReady','Recovery','SafeMode','Isolated','Watchdog','Escalating','Confirming','Reporting','Archiving','Completed'
  ];
  return { categories, actions, domains, tactics, states };
}

function generateItems(): LibraryItem[] {
  const { categories, actions, domains, tactics, states } = seedBase();
  const items: LibraryItem[] = [];
  const now = Date.now();

  // Generate strategies/methods/fixes by combinatorics until > 600
  let count = 0;
  for (let ci = 0; ci < categories.length; ci++) {
    for (let ai = 0; ai < actions.length; ai += 3) {
      const domain = domains[(ci + ai) % domains.length];
      const tactic = tactics[(ci * 7 + ai) % tactics.length];
      const type: LibraryItemType = (ai % 5 === 0) ? 'strategy' : (ai % 5 === 1) ? 'method' : (ai % 5 === 2) ? 'fix' : (ai % 5 === 3) ? 'command' : 'strategy';
      const title = `${actions[ai]} ${categories[ci]} in ${domain} via ${tactic}`;
      const tags = [categories[ci], actions[ai], domain, tactic];
      items.push({
        id: nanoid(10),
        type,
        title,
        description: `${title} pipeline combining ${categories[ci]} and ${domain} using ${tactic}. Includes validation, telemetry, and rollback with idempotency keys.`,
        tags,
        priority: ((ci + ai) % 5) + 1,
        retries: ((ci + ai) % 4),
        altMethodIds: [],
        favorite: false,
        createdAt: now - (count * 1000),
        updatedAt: now - (count * 1000),
      });
      count++;
      if (count > 650) break;
    }
    if (count > 650) break;
  }

  // Add states as items
  for (const s of states) {
    items.push({
      id: nanoid(10),
      type: 'state',
      title: `Agent State: ${s}`,
      description: `Progressive agent coordination state: ${s}.`,
      tags: ['state','agent','orchestration'],
      priority: 3,
      retries: 0,
      altMethodIds: [],
      favorite: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  return items;
}

export function getAllItems(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const seeded = generateItems();
  saveAllItems(seeded);
  return seeded;
}

export function saveAllItems(items: LibraryItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function updateItem(updated: LibraryItem) {
  const items = getAllItems();
  const idx = items.findIndex(i => i.id === updated.id);
  if (idx !== -1) {
    items[idx] = { ...updated, updatedAt: Date.now() };
    saveAllItems(items);
  }
}

export function reorder(idsInOrder: string[]) {
  const items = getAllItems();
  const map = new Map(items.map(i => [i.id, i] as const));
  const reordered: LibraryItem[] = [];
  const now = Date.now();
  idsInOrder.forEach((id, i) => {
    const it = map.get(id);
    if (it) {
      reordered.push({ ...it, updatedAt: now + i });
      map.delete(id);
    }
  });
  for (const rest of map.values()) reordered.push(rest);
  saveAllItems(reordered);
}

export function toggleFavorite(id: string, fav?: boolean) {
  const items = getAllItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    const val = typeof fav === 'boolean' ? fav : !items[idx].favorite;
    items[idx].favorite = val;
    items[idx].updatedAt = Date.now();
    saveAllItems(items);
  }
}

export function setPriority(id: string, priority: number) {
  const items = getAllItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items[idx].priority = Math.max(1, Math.min(5, Math.floor(priority)));
    items[idx].updatedAt = Date.now();
    saveAllItems(items);
  }
}

export function setRetries(id: string, retries: number) {
  const items = getAllItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items[idx].retries = Math.max(0, Math.min(10, Math.floor(retries)));
    items[idx].updatedAt = Date.now();
    saveAllItems(items);
  }
}

export function setAltMethods(id: string, altIds: string[]) {
  const items = getAllItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx !== -1) {
    items[idx].altMethodIds = altIds.filter(x => x !== id);
    items[idx].updatedAt = Date.now();
    saveAllItems(items);
  }
}

export function simulatePlan(itemIds: string[]): SimulationResultStep[] {
  const items = getAllItems();
  const selected = itemIds.map(id => items.find(i => i.id === id)).filter(Boolean) as LibraryItem[];
  const steps: SimulationResultStep[] = [];
  let t = 0;
  for (const it of selected) {
    const dur = 200 + (it.priority * 80) + Math.floor(Math.random() * 200);
    const success = Math.random() < (0.7 + (it.priority * 0.05));
    steps.push({
      id: nanoid(8),
      itemId: it.id,
      title: it.title,
      action: `Execute ${it.type}`,
      state: it.tags[0] || 'General',
      durationMs: dur,
      success,
      notes: success ? 'Step completed' : 'Step encountered issues'
    });
    t += dur;
    if (!success && it.altMethodIds.length) {
      for (const aid of it.altMethodIds.slice(0, 2)) {
        const alt = items.find(x => x.id === aid);
        if (!alt) continue;
        const adur = 150 + (alt.priority * 70);
        const asuccess = Math.random() < 0.75;
        steps.push({
          id: nanoid(8),
          itemId: alt.id,
          title: alt.title,
          action: 'Execute Alternate',
          state: alt.tags[0] || 'General',
          durationMs: adur,
          success: asuccess,
          notes: asuccess ? 'Fallback succeeded' : 'Fallback failed'
        });
        t += adur;
        if (asuccess) break;
      }
    }
  }
  return steps;
}

export function clearLibrary() {
  localStorage.removeItem(STORAGE_KEY);
}
