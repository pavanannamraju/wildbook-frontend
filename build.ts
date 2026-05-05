import tailwindcss from "bun-plugin-tailwind";

await Bun.build({
  entrypoints: ["./src/index.html"],
  outdir: "./build",
  sourcemap: "external",
  target: "browser",
  minify: true,
  plugins: [tailwindcss],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  env: "BUN_PUBLIC_*",
});
