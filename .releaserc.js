module.exports = {
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    [
      "@semantic-release/github",
      {
        "assets": [
          {"path": "CHANGELOG.md", "label": "Changelog"}
        ]
      }
    ]
  ],
  "extends": "semantic-release-monorepo",  // Use semantic-release-monorepo for monorepo handling
  tagFormat: "v${version}",  // Set format for version tags
}






