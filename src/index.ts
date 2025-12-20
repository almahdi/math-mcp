import { HttpLayerRouter, HttpServerResponse } from "@effect/platform"
import { McpServer, Tool, Toolkit } from "@effect/ai"
import { Effect, Layer, Schema } from "effect"
// @ts-ignore
import math from "mathjs/lib/browser/math.js"

// ======================
// MATH TOOLS
// ======================
const EvaluateTool = Tool.make("evaluate", {
  description: "Evaluates a mathematical expression using mathjs. Supports basic arithmetic, units, matrices, and more.",
  parameters: {
    expression: Schema.String
  },
  success: Schema.Unknown,
  failure: Schema.String
})

const mathToolkit = Toolkit.make(EvaluateTool)

// ======================
// PROMPTS
// ======================
const MathjsHelpPrompt = McpServer.prompt({
  name: "mathjs-help",
  description: "Get help and examples for mathjs syntax and features.",
  content: () =>
    Effect.succeed(`The 'evaluate' tool uses mathjs. Here are some advanced capabilities:
- Units: '10 cm to inch', '2 kg + 500 g', '50 mph in km/h'
- Matrices: 'det([[1, 2], [3, 4]])', 'inv([[1, 2], [3, 4]])'
- Complex: 'sqrt(-4)', '2 + 3i * (4 - 2i)'
- Trigonometry: 'sin(45 deg)', 'atan2(3, -3)'
- Statistics: 'mean(1, 2, 3, 4)', 'std(1, 2, 3, 4)'`)
})

const ExplainMathPrompt = McpServer.prompt({
  name: "explain-math",
  description: "Get a prompt that asks to explain a mathematical concept with an example evaluate call.",
  parameters: Schema.Struct({
    topic: Schema.String.annotations({ description: "The math topic to explain" })
  }),
  content: ({ topic }) =>
    Effect.succeed(
      `Please explain the concept of ${topic}. After the explanation, provide a specific example of how to calculate a related value using the 'evaluate' tool.`
    )
})

// Handlers
const MathHandlers = mathToolkit.toLayer({
  evaluate: ({ expression }) =>
    Effect.try({
      try: () => math.evaluate(expression),
      catch: (error) => String(error)
    })
})

// ======================
// LAYERS
// ======================
const WebRoutes = HttpLayerRouter.addAll([
  HttpLayerRouter.route("GET", "/", HttpServerResponse.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Math MCP Server</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #2563eb; }
          code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
          pre { background: #1f2937; color: #f3f4f6; padding: 16px; border-radius: 8px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>🧮 Math MCP Server (mathjs)</h1>
        <p>Effect AI MCP Server running on Cloudflare Workers, powered by mathjs.</p>
        <p>This server supports the HTTP transport (POST to <code>/mcp</code>).</p>
        <ul>
          <li><strong>GET /health</strong> - Check server status</li>
          <li><strong>POST /mcp</strong> - MCP Protocol endpoint</li>
        </ul>
        <hr/>
        <h2>Tool: evaluate</h2>
        <p>Call the <code>evaluate</code> tool with an <code>expression</code> string.</p>
        <pre>
{
  "method": "tools/call",
  "params": {
    "name": "evaluate",
    "arguments": { "expression": "12 cm to inch" }
  }
}
        </pre>
        <h2>Prompts</h2>
        <ul>
          <li><code>mathjs-help</code>: Documentation for supported math syntax.</li>
          <li><code>explain-math(topic)</code>: Helper to explain concepts.</li>
        </ul>
        <hr/>
        <p>To use with MCP Inspector:</p>
        <code>npx @modelcontextprotocol/inspector --url https://<your-worker>.workers.dev/mcp</code>
      </body>
    </html>
  `)),
  HttpLayerRouter.route("GET", "/health", HttpServerResponse.json({ status: "ok", engine: "mathjs" })),
  HttpLayerRouter.route("GET", "/mcp", HttpServerResponse.text("MCP HTTP JSON-RPC endpoint. Use POST."))
])

const McpRegistration = Layer.effectDiscard(McpServer.registerToolkit(mathToolkit))

const McpLayer = McpServer.layerHttpRouter({
  name: "Math Server",
  version: "1.0.0",
  path: "/mcp"
})

// App Layer composition
const McpCombined = McpRegistration.pipe(
  Layer.provide(McpLayer),
  Layer.provide(MathHandlers),
  Layer.provideMerge(MathjsHelpPrompt),
  Layer.provideMerge(ExplainMathPrompt)
)

const AppLayer = HttpLayerRouter.layer.pipe(
  Layer.provideMerge(HttpLayerRouter.cors()),
  Layer.provideMerge(WebRoutes),
  Layer.provideMerge(McpLayer),
  Layer.provideMerge(McpCombined)
)

// ======================
// WORKER HANDLER
// ======================
const { handler } = HttpLayerRouter.toWebHandler(AppLayer, {})

export default {
  fetch: (request, env, ctx) => handler(request as any)
} satisfies ExportedHandler
