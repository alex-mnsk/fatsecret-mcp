import { AuthorizationError, CimdFetchError, authorizationErrorRedirect } from '@cloudflare/workers-oauth-provider';
import { createHash, randomBytes } from 'node:crypto';
import type { CloudEnv } from './types.js';

const escape = (value: string) => value.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`);
const callbackUrl = (env: CloudEnv) => `${env.PUBLIC_ORIGIN}/github/callback`;

export const signInHandler = {
  async fetch(request: Request, env: CloudEnv): Promise<Response> {
    const url = new URL(request.url);
    const oauth = env.OAUTH_PROVIDER;
    if (url.pathname !== '/authorize' && url.pathname !== '/github/callback') {
      return new Response('Not found', { status: 404 });
    }
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET || !/^\d+$/.test(env.OWNER_GITHUB_ID ?? '')) {
      return new Response('Owner sign-in is not configured yet', { status: 503 });
    }
    try {
      if (url.pathname === '/authorize' && request.method === 'GET') {
        const authRequest = await oauth.parseAuthRequest(request);
        const details = await oauth.describeConsent(authRequest);
        const consent = await oauth.beginConsent(authRequest);
        consent.headers.set('content-type', 'text/html; charset=utf-8');
        // Chromium also checks the destinations of redirects after a form POST.
        consent.headers.set('content-security-policy', "default-src 'none'; form-action 'self' https://github.com https://chatgpt.com; frame-ancestors 'none'; base-uri 'none'");
        // Preserve Origin on the same-origin consent POST without leaking OAuth URLs to GitHub.
        consent.headers.set('referrer-policy', 'same-origin');
        return new Response(`<!doctype html><html lang="ru"><meta charset="utf-8"><title>Доступ к FatSecret</title>
<h1>Разрешить доступ к FatSecret?</h1>
<p>Приложение: <strong>${escape(details.clientName)}</strong>.</p>
<p>${details.clientDomain ? `Домен приложения: ${escape(details.clientDomain)}.` : 'Название приложения не подтверждено.'}</p>
<p>Доступ будет передан на: <strong>${escape(details.redirectHost)}</strong>.</p>
${details.redirectIsLoopback ? '<p>Это приложение на вашем компьютере. Продолжайте, только если вы сами начали подключение.</p>' : ''}
<p>${details.scope.includes('nutrition:write') ? 'Чтение, добавление, изменение и удаление данных FatSecret.' : 'Только чтение данных FatSecret.'} Войти сможет только владелец.</p>
<form method="post" action="/authorize"><input type="hidden" name="handle" value="${escape(consent.handle)}">
<button name="decision" value="approve">Продолжить через GitHub</button>
<button name="decision" value="deny">Отмена</button></form></html>`, { headers: consent.headers });
      }
      if (url.pathname === '/authorize' && request.method === 'POST') {
        if (request.headers.get('origin') !== env.PUBLIC_ORIGIN) return new Response('Access denied', { status: 403 });
        const form = await request.formData();
        const handle = String(form.get('handle') ?? '');
        if (form.get('decision') !== 'approve') {
          const denied = await oauth.denyConsent(request, handle);
          return new Response(null, { status: 302, headers: denied.headers });
        }
        const approved = await oauth.approveConsent(request, handle);
        const verifier = randomBytes(32).toString('base64url');
        const transaction = await oauth.beginUpstream(approved.request, { data: { verifier }, headers: approved.headers });
        const github = new URL('https://github.com/login/oauth/authorize');
        github.search = new URLSearchParams({
          client_id: env.GITHUB_CLIENT_ID, redirect_uri: callbackUrl(env),
          state: transaction.state, scope: '',
          code_challenge: createHash('sha256').update(verifier).digest('base64url'),
          code_challenge_method: 'S256', allow_signup: 'false'
        }).toString();
        transaction.headers.set('location', github.toString());
        return new Response(null, { status: 302, headers: transaction.headers });
      }
      if (url.pathname === '/github/callback' && request.method === 'GET') {
        const transaction = await oauth.finishUpstream<{ verifier: string }>(request);
        const code = url.searchParams.get('code');
        if (!code || url.searchParams.has('error')) {
          transaction.headers.set('location', authorizationErrorRedirect(transaction.request, 'access_denied'));
          return new Response(null, { status: 302, headers: transaction.headers });
        }
        const exchange = await fetch('https://github.com/login/oauth/access_token', {
          method: 'POST', headers: { accept: 'application/json' },
          body: new URLSearchParams({
            client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET,
            code, redirect_uri: callbackUrl(env), code_verifier: transaction.data.verifier
          }), signal: AbortSignal.timeout(15000)
        });
        const token: unknown = await exchange.json();
        if (!exchange.ok || !token || typeof token !== 'object' || !('access_token' in token) || typeof token.access_token !== 'string') {
          throw new Error('GitHub authorization failed');
        }
        const userResponse = await fetch('https://api.github.com/user', {
          headers: { authorization: `Bearer ${token.access_token}`, accept: 'application/vnd.github+json', 'user-agent': 'private-fatsecret-bridge' },
          signal: AbortSignal.timeout(15000)
        });
        const user: unknown = await userResponse.json();
        if (!userResponse.ok || !user || typeof user !== 'object' || !('id' in user) || String(user.id) !== env.OWNER_GITHUB_ID) {
          transaction.headers.set('location', authorizationErrorRedirect(transaction.request, 'access_denied'));
          return new Response(null, { status: 302, headers: transaction.headers });
        }
        // GitHub proves identity only; its token is never retained.
        const grant = await oauth.completeAuthorization({
          request: transaction.request, userId: env.OWNER_GITHUB_ID, metadata: {},
          scope: transaction.request.scope, props: { githubId: env.OWNER_GITHUB_ID }
        });
        transaction.headers.set('location', grant.redirectTo);
        return new Response(null, { status: 302, headers: transaction.headers });
      }
      return new Response('Method not allowed', { status: 405 });
    } catch (error) {
      if (error instanceof AuthorizationError || error instanceof CimdFetchError) {
        return new Response('Invalid or expired sign-in. Start the connection again from ChatGPT.', { status: 400 });
      }
      return new Response('Sign-in is temporarily unavailable', { status: 502 });
    }
  }
};
