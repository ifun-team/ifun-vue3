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
        file: "index.mjs",
        format: "esm",
      },
    ],
    plugins: [pluginEsbuild, json, pluginPure],
    external: ["vue", /@vueuse\/.*/],
  },
  {
    input: "index.ts",
    output: [
      {
        file: "index.d.mts",
      },
    ],
    plugins: [pluginDts],
    external: ["vue", /@vueuse\/.*/],
  },
];

export default rollupConfig;
