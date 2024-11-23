{
  "branches": ["main"],
  "tagFormat": "${name}-v${version}",
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
    "extend": "semantic-release-monorepo",
}






