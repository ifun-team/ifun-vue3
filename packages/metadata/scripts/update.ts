import * as fs from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath, resolve } from "node:url";
import { glob } from "tinyglobby";
import Git from "simple-git";
import { HooksFunction, HooksPackage, PackageIndexes } from "../types";
import { packages } from "../../../meta/packages.ts";
import { existsSync } from "node:fs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const PKG_DIR = resolve(__dirname, "..");
export const ROOT_DIR = resolve(PKG_DIR, "../..");

const git = Git(ROOT_DIR);

export async function listFunctions(dir: string, ignores: string[] = []) {
  const files = await glob("*", {
    cwd: dir,
    onlyDirectories: true,
    ignore: ["dist", "node_modules", ...ignores],
  });

  files.sort();

  return files.map((path) => (path.endsWith("/") ? path.slice(0, -1) : path));
}
async function readMetadata() {
  let indexes: PackageIndexes = {
    packages: {},
    functions: [],
  };

  for (const info of packages) {
    if (info.utils) {
      continue;
    }
    const dir = join(ROOT_DIR, "packages", info.name);

    const functions = await listFunctions(dir);

    const pkg: HooksPackage = {
      ...info,
      dir: relative(ROOT_DIR, dir).replace(/\\/g, "/"),
      docs: undefined,
    };

    indexes.packages[info.name] = pkg;

    await Promise.all(
      functions.map(async (fnName) => {
        // const mdPath = join(dir, fnName, "index.md");
        const tsPath = join(dir, fnName, "index.ts");

        const fn: HooksFunction = {
          name: fnName,
          package: pkg.name,
          lastUpdate:
            +(await git.raw(["log", "-1", "--format=%at", tsPath])) * 1000,
        };

        if (existsSync(join(dir, fnName, "component.ts"))) {
          fn.component = true;
        }
        if (existsSync(join(dir, fnName, "directive.ts"))) {
          fn.directive = true;
        }

        indexes.functions.push(fn);
      })
    );
  }
  indexes.functions.sort((a, b) => a.name.localeCompare(b.name));

  return indexes;
}
async function run() {
  const indexs = await readMetadata();

  await fs.writeFile(
    join(PKG_DIR, "index.json"),
    `${JSON.stringify(indexs, null, 2)}\n`
  );
}

run();
