import { rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

rmSync(fileURLToPath(new URL("../assets/", import.meta.url)), {
  recursive: true,
  force: true,
});
