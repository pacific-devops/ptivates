const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));
module.exports = {
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
  tagFormat: `${packageJson.name}-v${version}` // Correctly interpolates version
};
