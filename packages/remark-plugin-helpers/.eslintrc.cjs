module.exports = {
  extends: ["altano"],
  overrides: [
    {
      files: ["src/**/*.ts", "src/**/*.tsx", "*.config.ts"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
