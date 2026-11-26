import 'dotenv/config';
import { createServer, type ServerResponse } from 'node:http';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { diary, epochDay } from './fatsecret.js';
import { oauthRequest, type Token } from './oauth.js';

const config = { key: process.env.FATSECRET_CONSUMER_KEY ?? '', secret: process.env.FATSECRET_CONSUMER_SECRET ?? '' };
const host = process.env.HOST ?? '127.0.0.1';
const port = Number(process.env.PORT ?? '3333');
const callback = process.env.CALLBACK_URL ?? `http://${host}:${port}/auth/callback`;
const dataFile = resolve('.data/tokens.json');
const pending = new Map<string, { secret: string; createdAt: number }>();
const REQUEST = 'https://authentication.fatsecret.com/oauth/request_token';
const ACCESS = 'https://authentication.fatsecret.com/oauth/access_token';
const AUTHORIZE = 'https://authentication.fatsecret.com/oauth/authorize';

async function loadToken(): Promise<Token | null> {
  try { return JSON.parse(await readFile(dataFile, 'utf8')) as Token; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null; throw error; }
}
async function saveToken(token: Token) {
  await mkdir(resolve('.data'), { recursive: true, mode: 0o700 });
  await writeFile(dataFile, JSON.stringify(token), { mode: 0o600 });
}
function send(res: ServerResponse, status: number, value: unknown) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' });
  res.end(JSON.stringify(value));
}
function authorized(key: string | undefined): boolean {
  const expected = process.env.API_KEY;
  if (!expected) return host === '127.0.0.1' || host === 'localhost';
  if (!key) return false;
  const a = Buffer.from(key); const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', `http://${host}:${port}`);
    if (req.method !== 'GET') return send(res, 405, { error: 'Method not allowed' });
    if (url.pathname === '/health') return send(res, 200, { ok: true, connected: !!(await loadToken()) });
    if (url.pathname === '/auth/start') {
      if (!config.key || !config.secret) return send(res, 500, { error: 'Set FatSecret consumer credentials in .env' });
      if (host !== '127.0.0.1' && host !== 'localhost') return send(res, 403, { error: 'Run OAuth setup on localhost' });
      const q = await oauthRequest('GET', REQUEST, config, undefined, { oauth_callback: callback });
      const token = q.get('oauth_token'); const secret = q.get('oauth_token_secret');
      if (!token || !secret) throw new Error('OAuth request token missing');
      for (const [k, v] of pending) if (Date.now() - v.createdAt > 600000) pending.delete(k);
      pending.set(token, { secret, createdAt: Date.now() });
      res.writeHead(302, { location: `${AUTHORIZE}?oauth_token=${encodeURIComponent(token)}`, 'cache-control': 'no-store' }); res.end(); return;
    }
    if (url.pathname === '/auth/callback') {
      const token = url.searchParams.get('oauth_token'); const verifier = url.searchParams.get('oauth_verifier');
      const record = token ? pending.get(token) : undefined;
      if (!token || !verifier || !record || Date.now() - record.createdAt > 600000) return send(res, 400, { error: 'Invalid or expired OAuth callback; retry /auth/start' });
      pending.delete(token);
      const q = await oauthRequest('GET', ACCESS, config, { token, secret: record.secret }, { oauth_verifier: verifier });
      const access = q.get('oauth_token'); const secret = q.get('oauth_token_secret');
      if (!access || !secret) throw new Error('OAuth access token missing');
      await saveToken({ token: access, secret });
      return send(res, 200, { connected: true, message: 'FatSecret authorized. You can now call /api/diary?date=YYYY-MM-DD' });
    }
    if (url.pathname.startsWith('/api/')) {
      if (!authorized(req.headers['x-api-key'] as string | undefined)) return send(res, 401, { error: 'Unauthorized' });
      const token = await loadToken();
      if (!token) return send(res, 409, { error: 'Not connected. Open /auth/start locally.' });
      if (url.pathname === '/api/diary') {
        const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
        try { epochDay(date); } catch { return send(res, 400, { error: 'Invalid YYYY-MM-DD date' }); }
        return send(res, 200, await diary(date, config, token));
      }
      if (url.pathname === '/api/range') {
        const from = url.searchParams.get('from') ?? '';
        const to = url.searchParams.get('to') ?? '';
        let start: number, end: number;
        try { start = epochDay(from); end = epochDay(to); } catch { return send(res, 400, { error: 'Invalid YYYY-MM-DD dates' }); }
        if (end < start || end - start > 30) return send(res, 400, { error: 'Range must be 1 to 31 days' });
        const days = [];
        for (let d = start; d <= end; d++) days.push(await diary(new Date(d * 86400000).toISOString().slice(0, 10), config, token));
        return send(res, 200, { from, to, days });
      }
    }
    return send(res, 404, { error: 'Not found', routes: ['/health', '/auth/start', '/api/diary?date=YYYY-MM-DD', '/api/range?from=YYYY-MM-DD&to=YYYY-MM-DD'] });
  } catch (error) {
    console.error(error);
    send(res, 502, { error: 'Upstream or server error; check server logs' });
  }
});
server.listen(port, host, () => console.log(`FatSecret bridge at http://${host}:${port}`));
