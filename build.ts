import tailwindcss from "bun-plugin-tailwind";

const outdir = "./build";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name}. Static hosting has no server for /public-config; ` +
        `this value must be present when running \`bun run build\` (e.g. in CI).`,
    );
  }
  return value;
}

await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir,
  sourcemap: "external",
  target: "browser",
  minify: true,
  plugins: [tailwindcss],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  env: "BUN_PUBLIC_*",
});

// Azure Static Web Apps (and other static hosts) do not run `src/index.ts`; the browser
// still fetches `/public-config`, so emit the same JSON the dev server serves.
const publicConfig = {
  firebase: {
    apiKey: requiredEnv("BUN_PUBLIC_FIREBASE_API_KEY"),
    authDomain: requiredEnv("BUN_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: requiredEnv("BUN_PUBLIC_FIREBASE_PROJECT_ID"),
    appId: requiredEnv("BUN_PUBLIC_FIREBASE_APP_ID"),
  },
};
await Bun.write(`${outdir}/public-config`, JSON.stringify(publicConfig));
