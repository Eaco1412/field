/**
 * Cloudflare Worker 代理（已弃用，改用 Vercel Serverless Function）。
 *
 * 当前推荐使用 api/ai-proxy.ts 部署到 Vercel。
 * 此文件仅作为备用方案保留。
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // 只接受 POST
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // CORS 预检
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const clientIP = request.headers.get('CF-Connecting-IP') ?? 'unknown';

    // 简易限流：每 IP 每 60 秒最多 20 次请求
    const rateKey = `rate:${clientIP}`;
    const count = parseInt((await env.KV?.get(rateKey)) ?? '0', 10);
    if (count >= 20) {
      return json({ error: '请求过于频繁，请稍后再试' }, 429);
    }
    if (env.KV) {
      await env.KV.put(rateKey, String(count + 1), { expirationTtl: 60 });
    }

    // 解析请求体
    let body: RequestBody;
    try {
      body = await request.json() as RequestBody;
    } catch {
      return json({ error: '无效的请求体' }, 400);
    }

    // 白名单校验：只允许特定 model
    const ALLOWED_MODELS = [
      'deepseek-v4-flash',
      'deepseek-v4-pro',
    ];
    const model = ALLOWED_MODELS.includes(body.model) ? body.model : 'deepseek-v4-flash';

    // 只透传必要字段，忽略多余字段
    const payload = {
      model,
      messages: body.messages,
      temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
      response_format: body.response_format ?? { type: 'json_object' },
      max_tokens: typeof body.max_tokens === 'number' ? Math.min(body.max_tokens, 1200) : 800,
    };

    // 转发给 DeepSeek
    const apiKey = env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return json({ error: '服务端未配置 API Key' }, 500);
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

      if (!dsRes.ok) {
        return json({ error: 'DeepSeek 请求失败', detail: dsData }, dsRes.status);
      }

      return json(dsData, 200);
    } catch (err) {
      return json({ error: 'DeepSeek 请求异常', detail: String(err) }, 502);
    }
  },
};

function json(data: unknown, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

interface Env {
  DEEPSEEK_API_KEY: string;
  KV?: KVNamespace;
}

interface RequestBody {
  model?: string;
  messages?: unknown;
  temperature?: number;
  response_format?: unknown;
  max_tokens?: number;
}
