import { HttpLayerRouter, HttpServerResponse } from "@effect/platform"
import { McpServer, Tool, Toolkit } from "@effect/ai"
import { Effect, Layer, Schema } from "effect"

// ======================
// MATH TOOLS
// ======================
const MathParams = {
  a: Schema.Number,
  b: Schema.Number
}

const AddTool = Tool.make("add", {
  description: "Adds two numbers together",
  parameters: MathParams,
  success: Schema.Number
})

const SubtractTool = Tool.make("subtract", {
  description: "Subtracts two numbers",
  parameters: MathParams,
  success: Schema.Number
})

const MultiplyTool = Tool.make("multiply", {
  description: "Multiplies two numbers",
  parameters: MathParams,
  success: Schema.Number
})

const DivideTool = Tool.make("divide", {
  description: "Divides two numbers",
  parameters: MathParams,
  success: Schema.Number,
  failure: Schema.String
})

const mathToolkit = Toolkit.make(AddTool, SubtractTool, MultiplyTool, DivideTool)

// Handlers
const MathHandlers = mathToolkit.toLayer({
  add: ({ a, b }) => Effect.succeed(a + b),
  subtract: ({ a, b }) => Effect.succeed(a - b),
  multiply: ({ a, b }) => Effect.succeed(a * b),
  divide: ({ a, b }) => 
    b === 0 
      ? Effect.fail("Division by zero")
      : Effect.succeed(a / b)
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
        <h1>🧮 Math MCP Server</h1>
        <p>Effect AI MCP Server running on Cloudflare Workers.</p>
        <p>This server supports the HTTP transport (POST to <code>/mcp</code>).</p>
        <ul>
          <li><strong>GET /health</strong> - Check server status</li>
          <li><strong>POST /mcp</strong> - MCP Protocol endpoint</li>
        </ul>
        <hr/>
        <p>To use with MCP Inspector:</p>
        <code>npx @modelcontextprotocol/inspector --url https://<your-worker>.workers.dev/mcp</code>
      </body>
    </html>
  `)),
  HttpLayerRouter.route("GET", "/health", HttpServerResponse.json({ status: "ok" })),
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
  Layer.provide(MathHandlers)
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
