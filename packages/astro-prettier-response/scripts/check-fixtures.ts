#!/usr/bin/env zx

import { $, echo, glob, os, path } from "zx";
import { doWork } from "@altano/tiny-async-pool";

const matches = await glob("./tests/fixtures/**/package.json");
const fixtures = matches.map((m) => path.dirname(m));
echo(`Found ${fixtures.length} fixtures`);
// `astro check` fixtures in parallel
await doWork(
  os.cpus().length, // use all CPUs
  fixtures,
  async (fixture) => {
    echo(`Checking "${fixture}"`);
    await $`pnpm astro check --root "${fixture}"`;
  },
);
echo("done, all fixtures passed");
