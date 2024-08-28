module.exports = {
  extends: ["altano"],
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx", "*.config.ts"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
