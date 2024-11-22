module.exports = {
  "branches": ["main"],
  "preset": "conventionalcommits",
  "tagFormat": "${scope}-v${version}",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
};

