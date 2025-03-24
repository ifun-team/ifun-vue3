import type { RollupOptions } from "rollup";
// import type { Options as ESBuildOptions } from "rollup-plugin-esbuild";
//
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { PluginPure as pure } from "rollup-plugin-pure";
import json from "@rollup/plugin-json";

const pluginEsbuild = esbuild();
const pluginDts = dts();
const pluginPure = pure({
  functions: ["defineComponent"],
});

const rollupConfig: RollupOptions[] = [
  {
    input: "index.ts",
    output: [
      {
        file: "index.cjs",
        format: "cjs",
      },
      {
        file: "index.mjs",
        format: "esm",
      },
      {
        file: "index.iife.js",
        format: "iife",
        name: "VueHooks",
        extend: true,
        globals: {
          vue: "Vue",
        },
        plugins: [],
      },
      {
        file: "index.iffe.min.js",
        format: "iife",
        name: "VueHooks",
        extend: true,
        globals: {
          vue: "Vue",
        },
        plugins: [
          {
            name: "esbuild-minifier",
            renderChunk: esbuild({ minify: true }).renderChunk,
          },
        ],
      },
    ],
    plugins: [pluginEsbuild, json, pluginPure],
    external: ["vue"],
  },
  {
    input: "index.ts",
    output: [
      {
        file: "index.d.ts",
      },
      {
        file: "index.d.mts",
      },
      {
        file: "index.d.cts",
      },
    ],
    plugins: [pluginDts],
    external: ["vue"],
  },
];

export default rollupConfig;
