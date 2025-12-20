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
  failure: Schema.Struct({
    error: Schema.String
  })
})

const mathToolkit = Toolkit.make(AddTool, SubtractTool, MultiplyTool, DivideTool)

// Handlers
const MathHandlers = mathToolkit.toLayer({
  add: ({ a, b }) => Effect.succeed(a + b),
  subtract: ({ a, b }) => Effect.succeed(a - b),
  multiply: ({ a, b }) => Effect.succeed(a * b),
  divide: ({ a, b }) => 
    b === 0 
      ? Effect.fail({ error: "Division by zero" })
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
        </style>
      </head>
      <body>
        <h1>🧮 Math MCP Server</h1>
        <p>Effect AI MCP Server running on Cloudflare Workers.</p>
        <ul>
          <li><strong>GET /health</strong> - Check server status</li>
          <li><strong>POST /mcp</strong> - MCP Protocol endpoint</li>
        </ul>
      </body>
    </html>
  `)),
  HttpLayerRouter.route("GET", "/health", HttpServerResponse.json({ status: "ok" }))
])

const McpRegistration = Layer.effectDiscard(McpServer.registerToolkit(mathToolkit))

const McpLayer = McpServer.layerHttpRouter({
  name: "Math Server",
  version: "1.0.0",
  path: "/mcp"
})

// MCP part that requires HttpRouter
const McpCombined = McpRegistration.pipe(
  Layer.provide(McpLayer),
  Layer.provide(MathHandlers)
)

// App part that requires nothing (provides HttpRouter)
const AppLayer = Layer.mergeAll(WebRoutes, McpCombined).pipe(
  Layer.provide(HttpLayerRouter.layer)
)

// ======================
// WORKER HANDLER
// ======================
const { handler } = HttpLayerRouter.toWebHandler(AppLayer)

export default {
  fetch: (request, env, ctx) => handler(request as any)
} satisfies ExportedHandler
