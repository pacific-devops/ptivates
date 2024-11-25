module.exports = {
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git"
  ],
  tagFormat: "v${version}",  // Set format for version tags
  //tagFormat: `${packageJson.name}-v${"${version}"}`
}






