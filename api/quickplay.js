const BASE = 'https://api.quickplay.my.id';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }

    const url = new URL(req.url, 'https://vercel.local');
    const path = url.searchParams.get('path');

    const allowed = [
      '/api/v2/discover',
      '/api/v2/search',
      '/api/v2/detail',
      '/api/v2/video'
    ];

    if (!allowed.includes(path)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid API path'
      });
    }

    const upstream = new URL(BASE + path);

    for (const [k, v] of url.searchParams.entries()) {
      if (k !== 'path') {
        upstream.searchParams.set(k, v);
      }
    }

    const key = process.env.QUICKPLAY_API_KEY;

    if (!key) {
      return res.status(500).json({
        success: false,
        error: 'QUICKPLAY_API_KEY belum dikonfigurasi'
      });
    }

    const ts = Date.now().toString();

    const fullPath =
      upstream.pathname +
      (upstream.search || '');

    const crypto = await import('crypto');

    const signature = crypto
      .createHmac('sha256', key)
      .update(`GET:${fullPath}:${ts}`)
      .digest('hex');

    const response = await fetch(upstream.toString(), {
      method: 'GET',
      headers: {
        'X-Timestamp': ts,
        'X-Signature': signature,
        'Accept': 'application/json'
      }
    });

    const text = await response.text();

    res.setHeader(
      'Cache-Control',
      's-maxage=60, stale-while-revalidate=300'
    );

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') ||
      'application/json'
    );

    return res.status(response.status).send(text);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
