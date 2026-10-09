import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: "utf-8" }, { name: "viewport", content: "width=device-width, initial-scale=1" }],
  }),
  shellComponent: Shell,
  component: () => <Outlet />,
  notFoundComponent: () => (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui" }}>
      <h1>404 — Page not found</h1>
      <a href="/">Go home</a>
    </div>
  ),
});

function Shell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
