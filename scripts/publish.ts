import { execSync } from "node:child_process";
import { version } from "../package.json";

let command =
  "pnpm publish -r --access public --no-git-checks --registry https://registry.npmjs.org";

if (version.includes("beta")) command += " --tag beta";

execSync(command, { stdio: "inherit" });
