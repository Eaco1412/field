const ALLOWED_MODELS = ['deepseek-v4-flash', 'deepseek-v4-pro'];

interface RequestBody {
  model?: string;
  messages?: unknown;
  temperature?: number;
  response_format?: unknown;
  max_tokens?: number;
}

function sendResponse(res: any, status: number, data: unknown) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(data));
}

function sendOptions(res: any) {
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end();
}

function readBody(req: any): Promise<string> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk: string) => {
      body += chunk;
    });
    req.on('end', () => {
      resolve(body);
    });
  });
}

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    return sendOptions(res);
  }

  if (req.method !== 'POST') {
    return sendResponse(res, 405, { error: 'Method Not Allowed' });
  }

  let body: RequestBody;
  try {
    const rawBody = await readBody(req);
    body = JSON.parse(rawBody);
  } catch {
    return sendResponse(res, 400, { error: '无效的请求体' });
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
    return sendResponse(res, 500, { error: '服务端未配置 API Key' });
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
      return sendResponse(res, dsRes.status, { error: 'DeepSeek 请求失败', detail: dsData });
    }

    return sendResponse(res, 200, dsData);
  } catch (err) {
    return sendResponse(res, 502, { error: 'DeepSeek 请求异常', detail: String(err) });
  }
}