module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-altano`
  extends: ["altano"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
