import { timingSafeEqual } from 'node:crypto';
import { diary, epochDay } from './fatsecret.js';

type Env = {
  BRIDGE_API_KEY: string;
  FATSECRET_CONSUMER_KEY: string;
  FATSECRET_CONSUMER_SECRET: string;
  FATSECRET_ACCESS_TOKEN: string;
  FATSECRET_ACCESS_SECRET: string;
};

const send = (status: number, value: unknown) => new Response(JSON.stringify(value), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
    ...(status === 401 ? { 'www-authenticate': 'Bearer' } : {})
  }
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.protocol !== 'https:') return send(400, { error: 'HTTPS required' });
    // A missing or weak secret must never turn authentication off.
    if (!/^[a-f0-9]{64}$/.test(env.BRIDGE_API_KEY ?? '')) {
      return send(503, { error: 'Service not configured' });
    }
    const supplied = request.headers.get('authorization') ?? '';
    const expected = `Bearer ${env.BRIDGE_API_KEY}`;
    const a = Buffer.from(supplied);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return send(401, { error: 'Unauthorized' });
    }
    if (request.method !== 'GET') return send(405, { error: 'Method not allowed' });
    if (url.pathname === '/health') return send(200, { ok: true });
    if (url.pathname !== '/api/diary' && url.pathname !== '/api/range') {
      return send(404, { error: 'Not found' });
    }
    if (!env.FATSECRET_CONSUMER_KEY || !env.FATSECRET_CONSUMER_SECRET ||
        !env.FATSECRET_ACCESS_TOKEN || !env.FATSECRET_ACCESS_SECRET) {
      return send(503, { error: 'Service not configured' });
    }
    const config = { key: env.FATSECRET_CONSUMER_KEY, secret: env.FATSECRET_CONSUMER_SECRET };
    const token = { token: env.FATSECRET_ACCESS_TOKEN, secret: env.FATSECRET_ACCESS_SECRET };
    let start: number;
    let end: number;
    const date = url.searchParams.get('date') ?? '';
    const from = url.searchParams.get('from') ?? '';
    const to = url.searchParams.get('to') ?? '';
    try {
      start = epochDay(url.pathname === '/api/diary' ? date : from);
      end = url.pathname === '/api/diary' ? start : epochDay(to);
      if (end < start || end - start > 30) {
        return send(400, { error: 'Range must be 1 to 31 days' });
      }
    } catch {
      return send(400, { error: 'Provide valid YYYY-MM-DD dates' });
    }
    try {
      if (url.pathname === '/api/diary') return send(200, await diary(date, config, token));
      const days = [];
      // Bound parallelism and avoid repeating the local server's 31 serial requests.
      for (let day = start; day <= end; day += 4) {
        const dates = Array.from({ length: Math.min(4, end - day + 1) }, (_, offset) =>
          new Date((day + offset) * 86400000).toISOString().slice(0, 10));
        days.push(...await Promise.all(dates.map(value => diary(value, config, token))));
      }
      return send(200, { from, to, days });
    } catch {
      // Upstream exceptions may contain signed URLs or personal diary data.
      return send(502, { error: 'FatSecret request failed' });
    }
  }
};
