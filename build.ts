import tailwindcss from "bun-plugin-tailwind";

const outdir = "./build";

function collectPublicEnv(): Record<string, string> {
  const publicEnv: Record<string, string> = {};

  for (const [key, rawValue] of Object.entries(process.env)) {
    if (!key.startsWith("BUN_PUBLIC_")) continue;
    const value = rawValue?.trim();
    if (value) {
      publicEnv[key] = value;
    }
  }

  const jsonConfig = process.env.BUN_PUBLIC_CONFIG_JSON?.trim();
  if (jsonConfig) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonConfig);
    } catch (error) {
      throw new Error(`BUN_PUBLIC_CONFIG_JSON is not valid JSON: ${String(error)}`);
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("BUN_PUBLIC_CONFIG_JSON must be a JSON object.");
    }

    for (const [key, value] of Object.entries(parsed)) {
      if (!key.startsWith("BUN_PUBLIC_")) continue;
      if (typeof value === "string" && value.trim()) {
        publicEnv[key] = value.trim();
      }
    }
  }

  return publicEnv;
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
// still fetches `/public-config`, so emit runtime config for browser code.
const publicConfig = {
  publicEnv: collectPublicEnv(),
};
await Bun.write(`${outdir}/public-config`, JSON.stringify(publicConfig));
