import OAuthProvider from '@cloudflare/workers-oauth-provider';
import { mcpHandler } from './cloud/mcp.js';
import { signInHandler } from './cloud/sign-in.js';
import type { CloudEnv } from './cloud/types.js';

const REFRESH_TOKEN_IDLE_TTL = 90 * 24 * 60 * 60;

export default {
  async fetch(request: Request, env: CloudEnv, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (!env.PUBLIC_ORIGIN || url.origin !== env.PUBLIC_ORIGIN || url.protocol !== 'https:') {
      return new Response('Service setup is incomplete', { status: 503 });
    }
    // API keys from the previous REST handler cannot bypass MCP OAuth.
    const provider = new OAuthProvider<CloudEnv>({
      apiRoute: '/mcp', apiHandler: mcpHandler, defaultHandler: signInHandler,
      authorizeEndpoint: '/authorize', tokenEndpoint: '/oauth/token',
      scopesSupported: ['nutrition:read', ...(env.ENABLE_WRITES === 'true' ? ['nutrition:write'] : []), 'offline_access'], requiredScopes: ['nutrition:read'],
      accessTokenTTL: 900,
      // Refreshing extends the grant; active connections no longer expire after a fixed month.
      refreshTokenTTL: REFRESH_TOKEN_IDLE_TTL,
      refreshTokenIdleTTL: REFRESH_TOKEN_IDLE_TTL,
      clientIdMetadataDocumentEnabled: true,
      resourceMetadata: {
        resource: `${env.PUBLIC_ORIGIN}/mcp`, authorization_servers: [env.PUBLIC_ORIGIN],
        resource_name: 'Private FatSecret nutrition'
      }
    });
    try {
      const response = await provider.fetch(request, env, ctx);
      response.headers.set('cache-control', 'no-store');
      response.headers.set('x-content-type-options', 'nosniff');
      response.headers.set('referrer-policy', 'same-origin');
      return response;
    } catch {
      return new Response('Service temporarily unavailable', { status: 503, headers: { 'cache-control': 'no-store' } });
    }
  }
};
