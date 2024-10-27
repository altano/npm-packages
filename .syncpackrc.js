// @ts-check

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
    {
      label: "Examples w/ exact versions",
      packages: ["!@altano/**"],
      dependencies: ["**"],
      dependencyTypes: ["!local"],
      range: "",
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
