module.exports = {
  extends: ["altano"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
