import fs from "node:fs";
import path from "node:path";
import glob from "fast-glob";
import { isolatedDeclaration } from "oxc-transform";
import { rollup } from "rollup";
import picocolors from "picocolors";

const shouldBundle = process.argv.includes("--bundle");
const unbundledDestination = shouldBundle
  ? ".build/temp"
  : "dist/oxc-unbundled";
const bundledDestination = shouldBundle ? "dist/oxc-bundled" : null;

if (fs.existsSync(unbundledDestination)) {
  fs.rmSync(unbundledDestination, { recursive: true });
}

if (bundledDestination && fs.existsSync(bundledDestination)) {
  fs.rmSync(bundledDestination, { recursive: true });
}

console.time("type generation");

const filesToProcess = await glob("src/**/*.{cts,mts,ts,tsx}");
for (const file of filesToProcess) {
  const ts = fs.readFileSync(file, "utf-8");
  const dts = isolatedDeclaration(file, ts, { sourcemap: false });
  write(
    path.join(unbundledDestination, file.replace(/\.[cm]?tsx?$/, ".d.ts")),
    dts.code,
  );
}

console.timeEnd("type generation");
console.log(`${filesToProcess.length} isolated dts files generated`);

if (shouldBundle) {
  console.log("bundling dts with rollup-plugin-dts...");
  console.time("type bundling");

  // bundle with rollup-plugin-dts
  const rollupConfigs = (await import("./rollup.dts.config.js")).default;

  await Promise.all(
    rollupConfigs.map((c) =>
      rollup(c).then((bundle) => {
        return bundle.write(c.output).then(() => {
          console.log(
            picocolors.gray("built: ") + picocolors.blue(c.output.file),
          );
        });
      }),
    ),
  );

  console.timeEnd("type bundling");
}

function write(file, content) {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, content);
}
