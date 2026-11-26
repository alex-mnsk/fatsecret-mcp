import { epochDay } from '../fatsecret.js';
import { signedUrl } from '../oauth.js';
import type { ApiMethod, NutritionEnv } from './types.js';

export class FatSecretApiError extends Error {
  constructor(public kind: 'configuration' | 'rejected' | 'upstream' | 'outcome_unknown', public apiCode: string | null = null) {
    super(kind);
  }
}

const encode = (value: string) => encodeURIComponent(value).replace(/[!'()*]/g, char => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);

const readJson = async (response: Response): Promise<unknown> => {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty response');
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 2 * 1024 * 1024) throw new Error('Response too large');
      chunks.push(part.value);
    }
  } finally { await reader.cancel(); }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(body));
};

const withoutSecrets = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(withoutSecrets);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !/^(auth_token|auth_secret|oauth_.*|access_token|refresh_token|client_secret|secret)$/i.test(key))
    .map(([key, nested]) => [key, withoutSecrets(nested)]));
  return value;
};

export const callFatSecret = async (method: ApiMethod, input: Record<string, unknown>, env: NutritionEnv) => {
  if (!env.FATSECRET_CONSUMER_KEY || !env.FATSECRET_CONSUMER_SECRET ||
      (method.delegated && (!env.FATSECRET_ACCESS_TOKEN || !env.FATSECRET_ACCESS_SECRET))) {
    throw new FatSecretApiError('configuration');
  }
  const parameters = Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined).map(([key, value]) => [
    key, ['date', 'from_date', 'to_date'].includes(key) ? epochDay(String(value)) : value
  ]));
  // Use documented REST reads (some newer versions are absent from server.api).
  // Keep mutations on their explicit method names, independent of REST aliases.
  const restRead = method.encoding === 'form' && !method.write;
  const endpoint = method.encoding === 'form' && !restRead ? 'https://platform.fatsecret.com/rest/server.api' : method.endpoint;
  const httpMethod = restRead ? 'GET' : 'POST';
  if (method.encoding === 'form' && !method.apiMethod) throw new FatSecretApiError('configuration');
  // No caller-controlled hosts, methods, OAuth fields or output formats.
  const form: Record<string, string> = method.encoding === 'form' ? {
    ...Object.fromEntries(Object.entries(parameters).map(([key, value]) => [key, String(value)])),
    ...(!restRead ? { method: method.apiMethod! } : {}), format: 'json'
  } : {};
  const signed = new URL(signedUrl(httpMethod, endpoint,
    { key: env.FATSECRET_CONSUMER_KEY, secret: env.FATSECRET_CONSUMER_SECRET },
    method.encoding === 'form' && env.FATSECRET_ACCESS_TOKEN && env.FATSECRET_ACCESS_SECRET
      ? { token: env.FATSECRET_ACCESS_TOKEN, secret: env.FATSECRET_ACCESS_SECRET } : undefined,
    form));
  const authorization = 'OAuth ' + [...signed.searchParams].filter(([key]) => key.startsWith('oauth_'))
    .map(([key, value]) => `${encode(key)}="${encode(value)}"`).join(', ');
  const requestUrl = new URL(endpoint);
  if (restRead) for (const [key, value] of Object.entries(form)) requestUrl.searchParams.set(key, value);
  let response: Response;
  let data: unknown;
  try {
    const body = method.encoding === 'form' ? new URLSearchParams(form).toString() : JSON.stringify(parameters);
    if (new TextEncoder().encode(body).byteLength > 1048576) throw new FatSecretApiError('rejected');
    response = await fetch(requestUrl, {
      method: httpMethod, headers: { authorization, 'content-type': method.encoding === 'form' ? 'application/x-www-form-urlencoded' : 'application/json', accept: 'application/json' },
      body: restRead ? undefined : body, redirect: 'manual', signal: AbortSignal.timeout(15000)
    });
    // Workers supports manual/follow only. Never forward signed credentials on a redirect.
    if (response.status >= 300 && response.status < 400) {
      throw new FatSecretApiError(method.write ? 'outcome_unknown' : 'upstream');
    }
    data = await readJson(response);
  } catch (error) {
    if (error instanceof FatSecretApiError) throw error;
    // Never retry writes: the server may have applied them before a connection failed.
    throw new FatSecretApiError(method.write ? 'outcome_unknown' : 'upstream');
  }
  if (data && typeof data === 'object' && 'error' in data) {
    const raw = data.error;
    const code = raw && typeof raw === 'object' && 'code' in raw ? String(raw.code) : '';
    throw new FatSecretApiError('rejected', /^\d{1,6}$/.test(code) ? code : null);
  }
  if (!response.ok) throw new FatSecretApiError(method.write ? 'outcome_unknown' : 'upstream');
  if (data && typeof data === 'object' && 'success' in data && String(data.success) === '0') {
    throw new FatSecretApiError('rejected');
  }
  return { operation: method.name, data: withoutSecrets(data) };
};
