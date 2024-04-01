module.exports = {
  extends: ["altano"],
  overrides: [
    {
      files: ["src/**/!(*.d).{ts,tsx}", "*.config.ts"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
    {
      files: ["tests/**/*.ts", "tests/**/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: `${__dirname}/tests/`,
      },
    },
  ],
};
