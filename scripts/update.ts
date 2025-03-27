import { updateIndexREADME, updatePackageJSON, updateImport } from "./utils";

async function run() {
  await Promise.all([updateImport(), updatePackageJSON(), updateIndexREADME()]);
}

run();
