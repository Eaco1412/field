/**
 * 腾讯云 Web 函数 —— DeepSeek API 代理
 * 
 * 特点：纯原生 Node.js，不依赖 express/cors 等外部包
 * 只需上传 index.js + package.json，不需要 node_modules
 * 
 * 使用方式：创建 Web 函数，启动命令填 npm start
 */

const http = require('http');

const ALLOWED_MODELS = ['deepseek-v4-flash', 'deepseek-v4-pro'];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(body);
  } catch {
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '无效的请求体' }));
    return;
  }

  const model = ALLOWED_MODELS.includes(parsedBody.model) ? parsedBody.model : 'deepseek-v4-flash';

  const payload = {
    model,
    messages: parsedBody.messages,
    temperature: typeof parsedBody.temperature === 'number' ? parsedBody.temperature : 0.7,
    response_format: parsedBody.response_format || { type: 'json_object' },
    max_tokens: typeof parsedBody.max_tokens === 'number' ? Math.min(parsedBody.max_tokens, 1200) : 800,
  };

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: '服务端未配置 API Key' }));
    return;
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

    res.writeHead(dsRes.status, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dsData));
  } catch (err) {
    console.error('proxy error:', err);
    res.writeHead(502, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'DeepSeek 请求异常', detail: String(err) }));
  }
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
