module.exports = {
  branches: [
    { name: "main" },
    { name: "feature/*", channel: "dev-feature", prerelease: '${name.replace("feature/", "dev-")}' }
  ],
  tagFormat: "v${version}",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      { "preset": "conventionalcommits" }
    ],
    [
      "@semantic-release/release-notes-generator",
      { "preset": "conventionalcommits" }
    ],
    [
      "@semantic-release/changelog",
      { "changelogFile": "CHANGELOG.md" }
    ],
    [
      "@semantic-release/exec",
      {
        prepareCmd: "npx lerna version --yes --conventional-commits --no-push --preid ${nextRelease.channel}",
        publishCmd: "npx lerna publish from-package --yes"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json", "packages/*/package.json"],
        message: "chore(release): ${nextRelease.version} [skip ci]"
      }
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failTitle: false
      }
    ]
  ]
};
