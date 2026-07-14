/**
 * Vercel Serverless Function 代理 —— 持有 DeepSeek API Key，转发请求。
 *
 * 部署步骤：
 *   1. 在 Vercel Dashboard 设置环境变量 DEEPSEEK_API_KEY
 *   2. 推送代码到 GitHub/GitLab，Vercel 会自动部署
 *   3. 部署成功后，API 地址为 https://your-project.vercel.app/api/ai-proxy
 *   4. 把 URL 填进 App 的 src/config/ai.ts → proxyUrl
 */

const ALLOWED_MODELS = ['deepseek-v4-flash', 'deepseek-v4-pro'];

interface RequestBody {
  model?: string;
  messages?: unknown;
  temperature?: number;
  response_format?: unknown;
  max_tokens?: number;
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  let body: RequestBody;
  try {
    body = await request.json() as RequestBody;
  } catch {
    return new Response(JSON.stringify({ error: '无效的请求体' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const model = ALLOWED_MODELS.includes(body.model || '')
    ? (body.model as string)
    : 'deepseek-v4-flash';

  const payload = {
    model,
    messages: body.messages,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7,
    response_format: body.response_format ?? { type: 'json_object' },
    max_tokens: typeof body.max_tokens === 'number' ? Math.min(body.max_tokens, 1200) : 800,
  };

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: '服务端未配置 API Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
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
      return new Response(JSON.stringify({ error: 'DeepSeek 请求失败', detail: dsData }), {
        status: dsRes.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    return new Response(JSON.stringify(dsData), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'DeepSeek 请求异常', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}