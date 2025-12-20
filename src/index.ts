import { HttpRouter, HttpServerResponse, HttpApp } from "@effect/platform"

const router = HttpRouter.empty.pipe(
  HttpRouter.get("/", HttpServerResponse.text("Hello World from Effect Platform!")),
  HttpRouter.all("*", HttpServerResponse.empty({ status: 404 })),
  HttpRouter.catchAll(e => HttpServerResponse.text(`Internal Server Error: ${e}`, { status: 500 })),
  HttpApp.toWebHandler
)

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// return new Response('Hello World!');
		return await router(request);
	},
} satisfies ExportedHandler<Env>;
