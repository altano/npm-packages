module.exports = {
  extends: ["altano"],
  overrides: [
    {
      files: ["src/**/*.ts", "src/**/*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
