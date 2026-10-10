import { createFileRoute } from "@tanstack/react-router";

// Old links to /index.html go to the real home page.
export const Route = createFileRoute("/index.html")({
  server: {
    handlers: {
      GET: async () => new Response(null, { status: 301, headers: { Location: "/" } }),
    },
  },
});
