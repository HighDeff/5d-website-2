import type { RequestHandler } from "express";

// Cache local GPT-2 family pipelines to avoid reloading
const GPT2_NAME_MAP: Record<string, string> = {
  'gpt2': 'Xenova/gpt2',
  'gpt2-medium': 'Xenova/gpt2-medium',
  'gpt2-large': 'Xenova/gpt2-large',
  'gpt2-xl': 'Xenova/gpt2-xl',
  'distilgpt2': 'Xenova/distilgpt2',
};
const localPipelines: Record<string, any> = {};
let transformersImport: Promise<any> | null = null;

async function getLocalGpt2Pipeline(model: string) {
  try {
    if (!transformersImport) {
      transformersImport = import('@xenova/transformers');
    }
    const mod = await transformersImport;
    const pipe = (mod as any)?.pipeline;
    if (typeof pipe !== 'function') return null;
    const key = GPT2_NAME_MAP[model] || GPT2_NAME_MAP['gpt2'];
    if (!localPipelines[key]) {
      localPipelines[key] = await pipe('text-generation', key, { quantized: true });
    }
    return localPipelines[key];
  } catch (e) {
    console.warn('Transformers.js not available or failed to load:', e);
    return null;
  }
}

async function tryLocalGpt2(model: string, prompt: string, maxNew?: number, temperature?: number): Promise<string | null> {
  try {
    const gen = await getLocalGpt2Pipeline(model);
    if (!gen) return null;
    const out = await gen(prompt, {
      max_new_tokens: Math.min(200, typeof maxNew === 'number' ? maxNew : 200),
      temperature: typeof temperature === 'number' ? temperature : 0.7,
    });
    const text = Array.isArray(out) ? (out[0]?.generated_text || '') : (out?.generated_text || '');
    const content = (text || '').split('assistant:').pop()?.trim() || text || ' ';
    if (content.trim().length > 1) return content;
  } catch (e) {
    console.warn('Local Transformers gpt2 failed:', e);
  }
  return null;
}

function buildUnifiedResponse(content: string) {
  return {
    message: { content },
    choices: [
      {
        message: { content },
      },
    ],
    response: content,
  };
}

export const handleAIHealth: RequestHandler = (_req, res) => {
  res.status(200).json({ status: "ok", service: "ai", timestamp: Date.now() });
};

export const handleAIChat: RequestHandler = async (req, res) => {
  try {
    const { model, messages, temperature, max_tokens, provider } = req.body || {};

    // Basic validation
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const lastUserMessage = messages[messages.length - 1]?.content ?? "";

    // In this environment, default to simulated response for reliability.
    // If you want to call external providers, add your integration below (guarded by env vars).

    // Example OpenAI proxy (disabled by default; enable by setting OPENAI_API_KEY)
    const useOpenAI = !!process.env.OPENAI_API_KEY && (req.headers["x-ai-provider"] === "openai" || provider === "openai");

    if (useOpenAI) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: model || "gpt-4o-mini",
            messages,
            temperature: typeof temperature === "number" ? temperature : 0.7,
            max_tokens: typeof max_tokens === "number" ? max_tokens : 256,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          return res.status(response.status).send(text);
        }

        const data = await response.json();
        return res.status(200).json(data);
      } catch (err) {
        // Fall through to simulated response if provider call fails
        console.warn("OpenAI proxy failed, falling back to simulated/backup response:", err);
      }
    }

    // Optional Torch provider proxy (custom PyTorch model service)
    if (provider === 'torch') {
      const torchUrl = process.env.TORCH_MODEL_URL;
      if (torchUrl) {
        try {
          const resp = await fetch(torchUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model, messages, temperature, max_tokens }),
          });
          if (!resp.ok) {
            const text = await resp.text();
            return res.status(502).send(text);
          }
          const data = await resp.json();
          return res.status(200).json(data);
        } catch (e) {
          console.warn('Torch provider failed, falling back to backup:', e);
        }
      } else {
        console.warn('TORCH_MODEL_URL not configured, falling back to backup');
      }
    }

    // GPT-2 via Hugging Face Inference API (supports gpt2, gpt2-medium/large/xl, distilgpt2)
    {
      const modelStr = typeof model === 'string' ? model.toLowerCase() : '';
      const baseModel = (modelStr.split(':')[0] || '').trim();
      const isGpt2Family = ['gpt2','gpt2-medium','gpt2-large','gpt2-xl','distilgpt2'].includes(baseModel);

      if (provider === 'gpt2' || isGpt2Family) {
        const hfKey = process.env.HUGGINGFACE_API_KEY;
        const prompt = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n') + '\nassistant:';
        const targetModel = baseModel || 'gpt2';
        const hfUrl = `https://api-inference.huggingface.co/models/${targetModel}`;
        let delivered = false;
        try {
          const headersWithKey: Record<string,string> = { 'Content-Type': 'application/json' };
          if (hfKey) headersWithKey['Authorization'] = `Bearer ${hfKey}`;

          if (hfKey) {
            const resp = await fetch(hfUrl, {
              method: 'POST',
              headers: headersWithKey,
              body: JSON.stringify({
                inputs: prompt,
                parameters: {
                  max_new_tokens: Math.min(200, typeof max_tokens === 'number' ? max_tokens : 200),
                  temperature: typeof temperature === 'number' ? temperature : 0.7
                }
              })
            });

            if (resp.ok) {
              const data = await resp.json();
              const text = Array.isArray(data) ? (data[0]?.generated_text || '') : (data?.generated_text || JSON.stringify(data));
              const content = (text || '').split('assistant:').pop()?.trim() || text || ' ';
              if (content.trim().length > 1) {
                delivered = true;
                return res.status(200).json(buildUnifiedResponse(content));
              }
            } else {
              const errText = await resp.text();
              console.warn('HuggingFace gpt2 error:', resp.status, errText);
            }
          }
        } catch (e) {
          console.warn('HuggingFace gpt2 call failed:', e);
        }

        // If no HF key or HF failed, try local Transformers.js
        const localContent = await tryLocalGpt2(targetModel, prompt, max_tokens, temperature);
        if (localContent) {
          return res.status(200).json(buildUnifiedResponse(localContent));
        }

        // Fallback local backup (degraded)
        const prefix = "[GPT-2 Backup]";
        const summary = String(lastUserMessage).split(/\s+/).slice(0, 40).join(' ');
        const content = `${prefix} ${summary}\n\nThis is a backup response generated locally to ensure continuity when primary models are unavailable.`;
        return res.status(200).json(buildUnifiedResponse(content));
      }
    }

    // Default simulated response
    const content = `Connected. Model: ${model || "unknown"}. Temperature: ${typeof temperature === "number" ? temperature : 0.7}. Received: ${String(lastUserMessage).slice(0, 200)}`;
    return res.status(200).json(buildUnifiedResponse(content));
  } catch (error) {
    console.error("AI chat handler error:", error);
    return res.status(500).json({ error: "AI chat handler failed" });
  }
};
