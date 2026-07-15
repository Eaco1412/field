import type { VercelRequest, VercelResponse } from '@vercel/node';

const ALLOWED_MODELS = ['deepseek-chat', 'deepseek-reasoner'];

interface RequestBody {
  model?: string;
  messages?: unknown;
  temperature?: number;
  max_tokens?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Vercel 自动解析 body，直接用 req.body
  const body: RequestBody = req.body || {};
  console.log('[AI Proxy] Received body:', JSON.stringify(body).slice(0, 300));

  const model = ALLOWED_MODELS.includes(body.model || '')
    ? (body.model as string)
    : 'deepseek-chat';

  const payload = {
    model,
    messages: body.messages,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
    max_tokens: typeof body.max_tokens === 'number' ? Math.min(body.max_tokens, 800) : 400,
  };

  console.log('[AI Proxy] Sending to DeepSeek:', JSON.stringify(payload).slice(0, 300));

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error('[AI Proxy] No API key configured');
    return res.status(500).json({ error: '服务端未配置 API Key' });
  }

  try {
    const dsRes = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const dsData = await dsRes.json();
    console.log('[AI Proxy] DeepSeek response status:', dsRes.status);

    if (!dsRes.ok) {
      console.error('[AI Proxy] DeepSeek error:', JSON.stringify(dsData).slice(0, 300));
      return res.status(dsRes.status).json({ error: 'DeepSeek 请求失败', detail: dsData });
    }

    return res.status(200).json(dsData);
  } catch (err) {
    console.error('[AI Proxy] Fetch error:', String(err));
    return res.status(502).json({ error: 'DeepSeek 请求异常', detail: String(err) });
  }
}
