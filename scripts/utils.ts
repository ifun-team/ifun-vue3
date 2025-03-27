import { existsSync } from "node:fs";
import * as fs from "node:fs/promises";
import { packages } from "../meta/packages";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const ROOT_DIR = resolve(__dirname, "../packages");
export const updatePackageJSON = async () => {
  const { version } = JSON.parse(
    await fs.readFile("package.json", { encoding: "utf-8" })
  );

  for (const { name, description, author } of packages) {
    const pkg_dir = join(ROOT_DIR, name);
    const pkg_json_dir = join(pkg_dir, "package.json");
    const pkg_json = JSON.parse(
      await fs.readFile(pkg_json_dir, { encoding: "utf-8" })
    );

    pkg_json.version = version;
    pkg_json.author = author || "hboot <bobolity@163.com>";
    pkg_json.description ||= description;

    await fs.writeFile(pkg_json_dir, `${JSON.stringify(pkg_json, null, 2)}\n`);
  }
};
export const updateIndexREADME = () => {};

/**
 * dynamic import all core functions and update the index.ts
 */
export const updateImport = () => {};
