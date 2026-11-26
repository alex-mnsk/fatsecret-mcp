import type { OAuthHelpers } from '@cloudflare/workers-oauth-provider';
import type { NutritionEnv } from '../fatsecretApi/types.js';

export type CloudEnv = NutritionEnv & {
  OAUTH_KV: KVNamespace;
  OAUTH_PROVIDER: OAuthHelpers;
  PUBLIC_ORIGIN: string;
  ENABLE_WRITES?: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  OWNER_GITHUB_ID: string;
};
