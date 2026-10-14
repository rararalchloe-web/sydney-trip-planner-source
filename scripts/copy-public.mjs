import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
cpSync(new URL("../public/", import.meta.url), projectRoot, {
  recursive: true,
  force: true,
});
