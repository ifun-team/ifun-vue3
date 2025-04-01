import type { OutputOptions, RollupOptions } from "rollup";
// import fs from "node:fs";
// import type { Options as ESBuildOptions } from "rollup-plugin-esbuild";
//
import dts from "rollup-plugin-dts";
import esbuild from "rollup-plugin-esbuild";
import { PluginPure as pure } from "rollup-plugin-pure";
import json from "@rollup/plugin-json";
import { PackageManifest } from "@ifun-vue3/metadata";

const pluginEsbuild = esbuild();
const pluginDts = dts();
const pluginPure = pure({
  functions: ["defineComponent"],
});

const externals = ["vue"];

const configs: RollupOptions[] = [];
// const metadata = JSON.parse(
//   fs.readFileSync(
//     new URL("./packages/metadata/index.json", import.meta.url),
//     "utf-8"
//   )
// );
// const functions = metadata.functions as PackageIndexes["functions"];
export function createRollupConfig(pkg: PackageManifest) {
  const {
    iife = true,
    dts = true,
    mjs = true,
    globals = {},
    target = "es2018",
  } = pkg;

  const iffeGlobals = {
    vue: "Vue",
    ...globals,
  };
  const input = "index.ts";
  const outputName = "index";
  const iffeName = "VueHooks";
  // const info = functions.find((fn) => pkg.name == fn.name);

  const output: OutputOptions[] = [];

  if (mjs) {
    output.push({
      file: `${outputName}.mjs`,
      format: "es",
    });
  }
  if (iife) {
    output.push({
      file: `${iffeName}.iife.js`,
      name: iffeName,
      format: "iife",
      extend: true,
      globals: iffeGlobals,
      plugins: [],
    });
    output.push({
      file: `${iffeName}.iife.min.js`,
      name: iffeName,
      format: "iife",

      extend: true,
      globals: iffeGlobals,
      plugins: [
        {
          name: "esbuild-minifier",
          renderChunk: esbuild({ minify: true }).renderChunk,
        },
      ],
    });
  }

  configs.push({
    input,
    output,
    plugins: [target ? esbuild({ target }) : pluginEsbuild, json(), pluginPure],
    external: [...externals],
  });

  if (dts) {
    configs.push({
      input,
      output: {
        file: `${outputName}.d.ts`,
      },
      plugins: [pluginDts],
      external: [...externals],
    });
  }

  return configs;
}
