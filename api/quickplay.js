const BASE = 'https://api.quickplay.my.id';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed' });

    const url = new URL(req.url, 'https://vercel.local');
    const path = url.searchParams.get('path');
    const allowed = ['/api/v2/discover', '/api/v2/search', '/api/v2/detail', '/api/v2/video'];
    if (!allowed.includes(path)) return res.status(400).json({ success: false, error: 'Invalid API path' });

    const upstream = new URL(BASE + path);
    for (const [k, v] of url.searchParams.entries()) {
      if (k !== 'path') upstream.searchParams.set(k, v);
    }

    const headers = { accept: 'application/json' };
    const key = process.env.QUICKPLAY_API_KEY;
    if (key) {
      const header = process.env.QUICKPLAY_API_KEY_HEADER || 'x-api-key';
      const prefix = process.env.QUICKPLAY_API_PREFIX || '';
      headers[header] = prefix ? `${prefix} ${key}` : key;
    }

    const response = await fetch(upstream, { headers });
    const text = await response.text();
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
    return res.status(response.status).send(text);
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
