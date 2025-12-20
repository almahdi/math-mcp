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
		expect(await response.text()).toContain("Effect AI Math Console");
	});

	it('responds to MCP tool call (evaluate)', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'tools/call',
				params: {
					name: 'evaluate',
					arguments: { expression: '2 + 3 * 4' }
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
				content: [{ type: 'text', text: '14' }],
				isError: false
			}
		});
	});

	it('responds to MCP tool call (evaluate with units)', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'tools/call',
				params: {
					name: 'evaluate',
					arguments: { expression: '10 cm to inch' }
				},
				id: 2
			})
		});
		
		const result = await response.json() as any;
		const responseObj = Array.isArray(result) ? result[0] : result;
		// 10 cm is approx 3.93701 inches
		expect(responseObj.result.content[0].text).toContain('3.937');
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

	it('lists tools and prompts correctly', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'tools/list',
				params: {},
				id: 3
			})
		});
		
		const result = await response.json() as any;
		const toolsObj = Array.isArray(result) ? result[0] : result;
		expect(toolsObj.result.tools).toContainEqual(expect.objectContaining({
			name: 'evaluate'
		}));

		const promptsResponse = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'prompts/list',
				params: {},
				id: 4
			})
		});
		const promptsResult = await promptsResponse.json() as any;
		const promptsObj = Array.isArray(promptsResult) ? promptsResult[0] : promptsResult;
		expect(promptsObj.result.prompts).toContainEqual(expect.objectContaining({
			name: 'mathjs-help'
		}));
		expect(promptsObj.result.prompts).toContainEqual(expect.objectContaining({
			name: 'explain-math'
		}));
	});

	it('retrieves a prompt correctly', async () => {
		const response = await SELF.fetch('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'prompts/get',
				params: {
					name: 'explain-math',
					arguments: { topic: 'calculus' }
				},
				id: 5
			})
		});
		
		const result = await response.json() as any;
		const responseObj = Array.isArray(result) ? result[0] : result;
		expect(responseObj.result.messages[0].content.text).toContain('calculus');
		expect(responseObj.result.messages[0].content.text).toContain('evaluate');
	});
});
