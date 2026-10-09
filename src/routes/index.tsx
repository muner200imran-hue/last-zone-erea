import { createFileRoute } from "@tanstack/react-router";
import homeHtml from "../../index.html?raw";

// The home page is the original static HTML file, served as-is.
export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async () =>
        new Response(homeHtml, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
    },
  },
});
