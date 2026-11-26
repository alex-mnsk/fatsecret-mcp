import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { apiMethods } from '../fatsecretApi/catalog.js';
import { createInputSchema } from '../fatsecretApi/schema.js';
import { callFatSecret, FatSecretApiError } from '../fatsecretApi/request.js';
import type { CloudEnv } from './types.js';

// Build schemas once per isolate, rather than on every MCP request.
const tools = apiMethods.map(method => ({
  method,
  name: `fatsecret_${method.name.replace(/\./g, '_')}_${method.source.split('/').at(-2)}`,
  schema: createInputSchema(method)
}));

const apiErrorMessages: Record<string, string> = {
  '10': 'This method is unavailable for the FatSecret API account or version.',
  '11': 'The FatSecret application request limit has been reached.',
  '12': 'FatSecret is rate limiting this user.',
  '14': 'The FatSecret account lacks the required API scope or entitlement.',
  '101': 'FatSecret requires an additional parameter for this operation.',
  '106': 'FatSecret rejected an identifier. Look up the real identifier before trying again.',
  '107': 'FatSecret rejected a parameter that is outside its allowed range.',
  '108': 'FatSecret rejected a parameter type.',
  '109': 'FatSecret rejected a value that exceeds its character limit.'
};

export const registerFatsecretTools = (server: McpServer, env: CloudEnv, grantedScopes: string[]) => {
  for (const { method, name, schema } of tools) {
    if (method.write && env.ENABLE_WRITES !== 'true') continue;
    const scopes = method.write ? ['nutrition:read', 'nutrition:write'] : ['nutrition:read'];
    server.registerTool(name, {
      title: method.title,
      description: `${method.description} ${method.write ? 'Changes FatSecret data. Use only when the user requests this operation; do not retry automatically after an uncertain outcome.' : 'Reads FatSecret data.'} ${method.premier ? 'Requires the matching FatSecret Premier entitlement.' : ''} Documentation: ${method.source}`,
      inputSchema: schema,
      annotations: { readOnlyHint: !method.write, destructiveHint: method.write, idempotentHint: !method.write, openWorldHint: true },
      _meta: { securitySchemes: [{ type: 'oauth2', scopes }] }
    }, async input => {
      if (!scopes.every(scope => grantedScopes.includes(scope))) {
        return {
          isError: true,
          content: [{ type: 'text' as const, text: 'Reconnect FatSecret and grant permission to change data.' }],
          _meta: { 'mcp/www_authenticate': [`Bearer resource_metadata="${env.PUBLIC_ORIGIN}/.well-known/oauth-protected-resource/mcp", error="insufficient_scope", error_description="Write permission is required", scope="nutrition:read nutrition:write"`] }
        };
      }
      try {
        const value = await callFatSecret(method, input, env);
        return { content: [{ type: 'text' as const, text: JSON.stringify(value) }] };
      } catch (error) {
        const known = error instanceof FatSecretApiError;
        const kind = known ? error.kind : 'upstream';
        let message = 'FatSecret could not complete the operation. Check its API entitlement, supplied parameters, credentials and service limits.';
        if (known && error.apiCode) message = apiErrorMessages[error.apiCode] ?? message;
        if (kind === 'outcome_unknown') message = 'The write outcome is unknown. Do not repeat automatically. Read back the affected data before deciding whether another write is needed.';
        return {
          isError: true,
          content: [{ type: 'text' as const, text: JSON.stringify({ operation: method.name, error: kind, apiCode: known ? error.apiCode : null, message, retryAutomatically: false }) }]
        };
      }
    });
  }
};
