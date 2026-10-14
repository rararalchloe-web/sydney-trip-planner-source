import { cpSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
for (const name of readdirSync(publicDirectory)) {
  if (name === "shopping-products.png") continue;
  cpSync(join(publicDirectory, name), join(projectRoot, name), {
    recursive: true,
    force: true,
  });
}
