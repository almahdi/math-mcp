import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Math MCP worker', () => {
	it('responds with index page (unit style)', async () => {
		const request = new IncomingRequest('http://example.com');
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await response.text()).toContain("Math MCP Server");
	});

	it('responds to MCP tool call (integration)', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'tools/call',
				params: {
					name: 'add',
					arguments: { a: 10, b: 20 }
				},
				id: 1
			})
		});
		
		const result = await response.json() as any;
		const responseObj = Array.isArray(result) ? result[0] : result;
		expect(responseObj).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			result: {
				content: [{ type: 'text', text: '30' }],
				isError: false
			}
		});
	});

	it('responds to OPTIONS request for CORS', async () => {
		const response = await SELF.fetch('https://example.com/mcp', {
			method: 'OPTIONS',
			headers: {
				'Origin': 'http://localhost:3000',
				'Access-Control-Request-Method': 'POST',
				'Access-Control-Request-Headers': 'Content-Type'
			}
		});
		expect(response.status).toBe(204);
		expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
	});

	it('lists tools correctly', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'tools/list',
				params: {},
				id: 2
			})
		});
		
		const result = await response.json() as any;
		const responseObj = Array.isArray(result) ? result[0] : result;
		expect(responseObj.result.tools).toContainEqual(expect.objectContaining({
			name: 'add'
		}));
	});
});
