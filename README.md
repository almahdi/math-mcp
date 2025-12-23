# Ali's Math MCP Server

A Model Context Protocol (MCP) server providing powerful mathematical computation capabilities through a Cloudflare Worker. Built with Effect, TypeScript, and mathjs.

## Features

- **Mathematical Evaluation**: Compute expressions using mathjs, including:
  - Basic arithmetic
  - Unit conversions (`10 cm to inch`, `2 kg + 500 g`)
  - Matrices (`det([[1, 2], [3, 4]])`, `inv([[1, 2], [3, 4]])`)
  - Complex numbers (`sqrt(-4)`, `2 + 3i * (4 - 2i)`)
  - Trigonometry (`sin(45 deg)`, `atan2(3, -3)`)
  - Statistics (`mean(1, 2, 3, 4)`, `std(1, 2, 3, 4)`)

- **MCP Tools**:
  - `evaluate` - Evaluate mathematical expressions

- **MCP Prompts**:
  - `mathjs-help` - Get help and examples for mathjs syntax
  - `explain-math` - Get explanations of mathematical concepts with example calculations

- **Web Interface**: Stateful mathematical console with persistent sessions

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Framework**: Effect (functional effect system)
- **AI**: @effect/ai for MCP server implementation
- **Math**: mathjs v15.1.0
- **Testing**: Vitest with @cloudflare/vitest-pool-workers

## Installation

```bash
# Install dependencies
pnpm install
```

## Usage

### Development

```bash
# Start local development server
pnpm dev
```

The server will be available at `http://localhost:8787`

### Testing

```bash
# Run tests
pnpm test
```

### Deployment

```bash
# Deploy to Cloudflare Workers
pnpm deploy
```

## API Endpoints

- `GET /` - Web interface with math console
- `POST /mcp` - MCP HTTP JSON-RPC endpoint
- `GET /health` - Health check endpoint

## MCP Server Configuration

To connect an MCP client to this server:

```json
{
  "mcpServers": {
    "alis-math": {
      "url": "https://your-worker-url.workers.dev/mcp",
      "transport": {
        "type": "http"
      }
    }
  }
}
```

## Example MCP Tool Call

```bash
curl -X POST https://your-worker-url.workers.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "evaluate",
      "arguments": { "expression": "2 + 3 * 4" }
    },
    "id": 1
  }'
```

Response:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{ "type": "text", "text": "14" }],
    "isError": false
  }
}
```

## License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

```
Math MCP Server - A Model Context Protocol server for mathematical computations

Copyright (C) 2025 Ali Almahdi

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```

## Contributing

This is an AGPL-licensed project. By contributing, you agree that your contributions will be licensed under the AGPL-3.0 license.

## Author

Ali Almahdi - [ali.ac](https://ali.ac) - [@alialmahdi](https://x.com/alialmahdi)

## Repository

[github.com/almahdi/math-mcp](https://github.com/almahdi/math-mcp)
