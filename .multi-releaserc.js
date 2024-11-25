const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

module.exports = {
  branches: ["main"], // Replace "main" with your branch name
  tagFormat: `${packageJson.name}-v${"${version}"}`, // Proper semantic-release version placeholder
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git",
  ],
};

