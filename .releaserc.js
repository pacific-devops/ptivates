const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

// Capture custom input from command line
const customInput = process.argv[2] || "default-value";

module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: `chore(release): ${packageJson.name} v\${nextRelease.version} (${customInput}) [skip ci]`,
      },
    ],
    "@semantic-release/github",
  ],
  extends: "semantic-release-monorepo",
  tagFormat: `${packageJson.name}-v${"${version}"}`,
};
