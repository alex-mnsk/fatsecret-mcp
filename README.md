# FatSecret MCP bridge

Run a single-user MCP server for your own FatSecret account. Each deployment uses its own Cloudflare resources, OAuth app, and credentials. ChatGPT connects to the HTTPS MCP endpoint using OAuth. The example configuration disables writes. An operator can opt in with `ENABLE_WRITES=true` and reconnect to grant the required write scope.

## Cloudflare setup

1. Install Node.js 22 or newer and run `npm ci`.
2. Authenticate Wrangler with your own Cloudflare account. Copy `wrangler.example.jsonc` to `wrangler.jsonc`. Set your Worker name and the exact HTTPS `PUBLIC_ORIGIN` without a trailing slash.
3. Run `npx wrangler kv namespace create OAUTH_KV` and paste the new ID in `wrangler.jsonc`. Use a separate namespace for each deployment. It holds OAuth state and grants, so restrict access to it.
4. Run `npm run cloud:deploy`. Set the secrets below via Cloudflare's dashboard or `npx wrangler secret put SECRET_NAME`, which prompts for the value. The service rejects account access until the owner and credentials are configured.

## FatSecret authorization

1. Register an OAuth 1.0 consumer with [FatSecret Platform](https://platform.fatsecret.com/) with delegated diary access. Add the consumer key and secret to a local `.env` copied from `.env.example`.
2. Run `npm start` and open `http://127.0.0.1:3333/auth/start` on the same computer to authorize your FatSecret account. The callback stores the OAuth credentials under the ignored `.data/` folder. Stop the local server when authorization is complete.
3. Create a GitHub OAuth App with callback `<your-origin>/github/callback`. Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and your numeric `OWNER_GITHUB_ID` in the local `.env`. Run `npm run cloud:secrets` from the project directory. It passes secrets to Wrangler via standard input.

## Connect ChatGPT

Add a custom MCP server with URL `<your-origin>/mcp`. Complete OAuth using the same owner account you configured. Only the configured account may approve access. Confirm that an unauthenticated request to `/mcp` cannot access any tools, then connect as the owner and test a read operation.

Store deployment values in ignored local configuration and secret values in Worker Secrets. Keep local credentials and token files accessible only to your user. Rotate credentials at their issuer if exposed.

## Development

Run `npm run check`. Example configuration uses placeholder infrastructure and no production credentials.
