module.exports = {
  "branches": ["main"],
  "preset": "conventionalcommits",
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
    "tagFormat": "${scope}-v${version}",
  "extend": "semantic-release-monorepo",
  prepare: [
    {
      path: '@semantic-release/commit-analyzer',
      release: process.env.SCOPE ? process.env.SCOPE : 'default',  // Dynamically set scope
    }
  ]
};

