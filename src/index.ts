import { serve } from "bun";
import index from "./index.html";

function getBackendOrigin(): string {
  const backendOrigin = process.env.BACKEND_ORIGIN;
  if (!backendOrigin) {
    throw new Error(
      "BACKEND_ORIGIN is required (example: BACKEND_ORIGIN=http://localhost:8000).",
    );
  }
  return backendOrigin;
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const server = serve({
  routes: {
    "/public-config": () =>
      Response.json({
        firebase: {
          apiKey: getRequiredEnv("BUN_PUBLIC_FIREBASE_API_KEY"),
          authDomain: getRequiredEnv("BUN_PUBLIC_FIREBASE_AUTH_DOMAIN"),
          projectId: getRequiredEnv("BUN_PUBLIC_FIREBASE_PROJECT_ID"),
          appId: getRequiredEnv("BUN_PUBLIC_FIREBASE_APP_ID"),
        },
      }),
    "/api/*": async (req) => {
      const url = new URL(req.url);
      const target = new URL(url.pathname + url.search, getBackendOrigin());

      return fetch(target, {
        method: req.method,
        headers: req.headers,
        body: req.body,
        redirect: "manual",
      });
    },
    // Serve index.html for all unmatched routes.
    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,
    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
