#!/usr/bin/env node
// Sets the system/package version and rewrites the install URLs to point at
// this repository's GitHub Releases. Invoked by the release workflow with the
// version (without the leading "v") derived from the pushed tag.
import fs from "node:fs";

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`Usage: set-version.mjs <x.y.z> (got: ${version ?? "<none>"})`);
  process.exit(1);
}

const repo = process.env.GITHUB_REPOSITORY || "giro-dev/foundryvtt-dee-sanction";
const base = `https://github.com/${repo}`;

const systemPath = "src/system.json";
const system = JSON.parse(fs.readFileSync(systemPath, "utf8"));
system.version = version;
system.url = base;
// Stable manifest URL: always resolves to the latest published release.
system.manifest = `${base}/releases/latest/download/system.json`;
// Version-specific package attached to this release.
system.download = `${base}/releases/download/v${version}/dee-v${version}.zip`;
fs.writeFileSync(systemPath, JSON.stringify(system, null, 2) + "\n");

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`Set version to ${version}`);
console.log(`  manifest: ${system.manifest}`);
console.log(`  download: ${system.download}`);
