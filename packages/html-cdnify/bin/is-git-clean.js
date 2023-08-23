var isClean = require("is-git-clean").sync();

if (!isClean) {
  console.error("Error: The current branch on your git repository is not clean.");
  process.exit(1);
}