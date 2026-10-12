import { createFileRoute } from "@tanstack/react-router";
import { STATIC_PAGES } from "@/lib/static-pages";

// Old addresses (from the previous version of the site) that Google still shows,
// pointed at the closest page that exists today.
const OLD_LINKS: Record<string, string> = {
  "/guide": "/guides.html",
  "/lovable-unlimited-credits-extension": "/lovable-unlimited-credits.html",
  "/how-to-get-unlimited-lovable-credits": "/lovable-unlimited-credits.html",
  "/enhance-lovable-dev-with-last-zone": "/guides/what-is-last-zone.html",
  "/lovable-browser-extension": "/lovable-extension.html",
  "/hudood-lovable-2-majaniya": "/ar/blog/can-i-use-lovable-for-free.html",
  "/ishtirak-lovable-pro": "/ar/lovable-pro.html",
  "/zone": "/",
  "/my-license": "/",
  "/reseller": "/",
  "/checkout": "/products.html",
  "/guides/lovable-credits-explained.html": "/guides/how-lovable-credits-work.html",
  "/guides/lovable-credits-explained": "/guides/how-lovable-credits-work.html",
  "/lovable-free-year": "/guides/is-lovable-free.html",
  "/lovable-pro-android-majani": "/ar/lovable-pro.html",
  "/lovable-pro-free": "/lovable-pro-free.html",
  "/what-is-last-zone-for-lovable": "/guides/what-is-last-zone.html",
  "/khasm-tullab-lovable-50": "/guides/lovable-student-discount.html",
  "/lovable-free-for-teachers-and-students": "/guides/lovable-student-discount.html",
  "/lovable-free-month": "/guides/is-lovable-free.html",
};

const NOT_FOUND = `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="robots" content="noindex"/><title>Page not found | LAST ZONE</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#07070d;color:#e8e8f0;font-family:Inter,system-ui,sans-serif;text-align:center}a{color:#22d3ee;margin:0 10px}</style></head><body><main><h1>Page not found</h1><p>This page moved or no longer exists.</p><p><a href="/">Home</a><a href="/guides.html">Guides</a></p></main></body></html>`;

function findTarget(pathname: string): string | null {
  let path = decodeURIComponent(pathname);
  if (path.length > 1) path = path.replace(/\/+$/, "");
  if (OLD_LINKS[path]) return OLD_LINKS[path];
  if (/^\/(products|r)\//.test(path)) return path.startsWith("/r/") ? "/" : "/products.html";
  if (STATIC_PAGES.has(`${path}.html`)) return `${path}.html`;
  if (STATIC_PAGES.has(`${path}/index.html`)) return path === "" ? "/" : `${path}/index.html`;
  return null;
}

export const Route = createFileRoute("/$")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const target = findTarget(url.pathname);
        if (target && target !== url.pathname) {
          return new Response(null, { status: 301, headers: { Location: target + url.search } });
        }
        return new Response(NOT_FOUND, {
          status: 404,
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      },
    },
  },
});
