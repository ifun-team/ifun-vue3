import _metadata, {
  functions as _functions,
  packages as _packages,
} from "./index.json";
import { PackageIndexes } from "./types";

export const metadata = _metadata as PackageIndexes;
export const funtions = _functions as PackageIndexes["functions"];
export const packages = _packages as PackageIndexes["packages"];

export const funtionNames = funtions.map((fn) => fn.name);

export function getFunction(name: string) {
  return metadata.functions.find((fn) => fn.name === name);
}
