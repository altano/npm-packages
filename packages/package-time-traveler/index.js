#!/usr/bin/env node

/* eslint-disable */

const fs = require("fs");
const pacote = require("pacote");
const { name } = require("./package.json");
const asyncPool = require("@altano/tiny-async-pool");

async function asyncPoolAll(...args) {
  const results = [];
  for await (const result of asyncPool(...args)) {
    results.push(result);
  }
  return results;
}

const [, , packageJsonPath, date] = process.argv;

async function getDepManifest(dependency) {
  const [depName, depVersion] = dependency;
  try {
    const manifest = await pacote.manifest(`${depName}@${depVersion}`, {
      fullMetadata: true,
      before: new Date(date),
    });
    return manifest;
  } catch (err) {
    console.error(err.message);
    console.error(`Try specifying a later date or an earlier version.`);
    return Promise.resolve(null);
  }
}

async function getNewDeps(dependencies) {
  if (dependencies == null) {
    return {};
  }
  const deps = Object.entries(dependencies);
  const manifests = await asyncPoolAll(5, deps, getDepManifest);
  const manifestEntries = manifests
    .filter(Boolean)
    .map((manifest) => [manifest.name, manifest.version]);
  return Object.fromEntries(manifestEntries);
}

async function main() {
  if (packageJsonPath == null || date == null) {
    console.log(`Parse a package.json and list all the packages older than the given date.
Usage: ${name} </path/to/package.json> <date>
    `);
  } else {
    const packageString = await fs.promises.readFile(packageJsonPath);
    const pkg = JSON.parse(packageString);
    const newDeps = {
      dependencies: await getNewDeps(pkg.dependencies),
      devDependencies: await getNewDeps(pkg.devDependencies),
    };
    console.log(JSON.stringify(newDeps, null, 2));
  }
}

main().catch((err) => console.error(err));
