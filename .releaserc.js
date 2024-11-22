module.exports = {
  "branches": ["main"],
  //"tagFormat": "${packageName}-v${version}",
  "tagFormat": "v${version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
  "extends": "semantic-release-monorepo"
};

