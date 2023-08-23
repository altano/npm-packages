module.exports = function(wallaby) {
  return {
    files: [
      "src/**/*.ts"
    ],

    tests: [
      "test/**/*.spec.ts"
    ],

    testFramework: "mocha",

    env: {
      type: "node"
    },
  };
};

