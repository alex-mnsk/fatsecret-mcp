import { createHmac, randomBytes } from 'node:crypto';

const enc = (x: string) => encodeURIComponent(x).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const compare = (a: string, b: string) => a < b ? -1 : Number(a > b);

export type Token = { token: string; secret: string };
export type OAuthConfig = { key: string; secret: string };

export function signedUrl(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, config: OAuthConfig, token?: Token, extra: Record<string, string> = {}): string {
  const url = new URL(endpoint);
  const oauth: Record<string, string> = {
    oauth_consumer_key: config.key,
    oauth_nonce: randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_version: '1.0'
  };
  if (token) oauth.oauth_token = token.token;
  const params = new URLSearchParams(url.search);
  for (const [k, v] of Object.entries(extra)) params.set(k, v);
  for (const [k, v] of Object.entries(oauth)) params.set(k, v);
  const normalized = [...params.entries()]
    .map(([k, v]) => [enc(k), enc(v)])
    // RFC 5849 sorts percent-encoded octets, not locale-dependent text.
    .sort(([ak, av], [bk, bv]) => compare(ak, bk) || compare(av, bv))
    .map(([k, v]) => `${k}=${v}`).join('&');
  const baseUrl = `${url.origin}${url.pathname}`;
  const base = [method, enc(baseUrl), enc(normalized)].join('&');
  const key = `${enc(config.secret)}&${enc(token?.secret ?? '')}`;
  const signature = createHmac('sha1', key).update(base).digest('base64');
  params.set('oauth_signature', signature);
  url.search = params.toString();
  return url.toString();
}

export async function oauthRequest(method: 'GET' | 'POST', endpoint: string, config: OAuthConfig, token?: Token, extra: Record<string, string> = {}): Promise<URLSearchParams> {
  const response = await fetch(signedUrl(method, endpoint, config, token, extra), { method, signal: AbortSignal.timeout(15000) });
  const text = await response.text();
  if (!response.ok) throw new Error(`FatSecret OAuth HTTP ${response.status}: ${text.slice(0, 250)}`);
  return new URLSearchParams(text);
}
