module.exports = {
  "extends": "semantic-release-monorepo"
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
  "tagFormat": "${name}-v${version}"
};

