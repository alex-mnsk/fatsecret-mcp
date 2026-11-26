import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Run explicitly after Cloudflare login. Secret values travel over stdin, never argv.
const root = new URL('../', import.meta.url);
try {
  const token = JSON.parse(await readFile(new URL('.data/tokens.json', root), 'utf8'));
  if (!token.token || !token.secret || !process.env.FATSECRET_CONSUMER_KEY ||
      !process.env.FATSECRET_CONSUMER_SECRET) {
    throw new Error('Authorize FatSecret locally and fill in .env first.');
  }
  const secrets = {
    FATSECRET_CONSUMER_KEY: process.env.FATSECRET_CONSUMER_KEY,
    FATSECRET_CONSUMER_SECRET: process.env.FATSECRET_CONSUMER_SECRET,
    FATSECRET_ACCESS_TOKEN: token.token,
    FATSECRET_ACCESS_SECRET: token.secret
  };
  for (const name of ['GITHUB_CLIENT_ID', 'GITHUB_CLIENT_SECRET', 'OWNER_GITHUB_ID']) {
    if (!process.env[name]) throw new Error('Missing GitHub OAuth settings');
    secrets[name] = process.env[name];
  }
  if (secrets.OWNER_GITHUB_ID && !/^\d+$/.test(secrets.OWNER_GITHUB_ID)) {
    throw new Error('Invalid owner ID');
  }
  const result = spawnSync(process.execPath, [
    fileURLToPath(new URL('node_modules/wrangler/bin/wrangler.js', root)),
    'secret', 'bulk'
  ], {
    cwd: fileURLToPath(root),
    input: JSON.stringify(secrets),
    stdio: ['pipe', 'inherit', 'inherit'],
    windowsHide: true,
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' }
  });
  if (result.error || result.status !== 0) throw new Error('Secret upload failed. Check Cloudflare login and retry.');
  console.log('MCP secrets uploaded. No secret values were printed.');
} catch (error) {
  // Never print upstream responses or secret objects.
  console.error(error instanceof Error && error.message.startsWith('Secret upload')
    ? error.message : 'Cannot prepare secrets. Check .env, local FatSecret authorization and .data permissions.');
  process.exitCode = 1;
}
