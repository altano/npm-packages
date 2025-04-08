// @ts-check
import { readFileSync } from "node:fs";
import semver from "semver";
import { parse } from "yaml";

/**
 * @returns {NonNullable<import("syncpack").RcFile['versionGroups']>}
 */
function getPnpmCatalogPeerDependencies() {
  const workspaceConfig = readFileSync("pnpm-workspace.yaml", "utf8");
  const pnpmWorkspaceConfig = parse(workspaceConfig);
  /**
   * @type {import("syncpack").RcFile['versionGroups']}
   */
  const specialCases = [
    // special cases
    {
      label: `react peer deps for astro projects`,
      packages: ["@altano/astro-**"],
      dependencies: ["react", "react-dom", "@types/react", "@types/react-dom"],
      dependencyTypes: ["peer"],
      pinVersion: ">=18",
    },
  ];

  const generalCases = Object.entries(pnpmWorkspaceConfig.catalog).flatMap(
    ([packageName, versionStr]) => {
      const minVersion = semver.minVersion(versionStr);
      if (minVersion == null) {
        throw new Error(
          `Invalid semver range "${versionStr} for package ${packageName}"`,
        );
      }

      return [
        {
          label: `Enforce pnpm default catalog for ${packageName} (regular deps)`,
          packages: ["!**/*-example"], // excludes example w/ exact versions
          dependencies: [packageName],
          dependencyTypes: ["!local", "!peer"],
          pinVersion: "catalog:",
        },
        // general cases
        {
          label: `Enforce pnpm default catalog for ${packageName} (peer deps)`,
          dependencies: [packageName],
          dependencyTypes: ["peer"],
          pinVersion: `${minVersion.major}.x.x`,
        },
      ];
    },
  );

  return [...specialCases, ...generalCases];
}

/** @type {import("syncpack").RcFile} */
const config = {
  lintFormatting: false,
  semverGroups: [
    {
      packages: ["package-time-traveler"],
      isIgnored: true,
    },
    {
      dependencyTypes: ["local"],
      isIgnored: true,
    },
    {
      dependencyTypes: ["peer"],
      packages: ["@altano/**"],
      range: ".x",
    },
  ],
  versionGroups: [
    {
      packages: ["package-time-traveler"],
      isIgnored: true,
    },
    {
      dependencyTypes: ["local"],
      isIgnored: true,
    },
    ...getPnpmCatalogPeerDependencies(),
    {
      label: "Local package dependencies",
      packages: ["@altano/**"],
      dependencies: ["$LOCAL"],
      dependencyTypes: ["!local"],
      pinVersion: "workspace:*",
    },
  ],
};

export default config;
