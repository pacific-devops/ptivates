export default {
  branches: ["main"],
  plugins: [
    [
      "semantic-release-monorepo",
      {
        analyzeCommits: ["@semantic-release/commit-analyzer"],
        generateNotes: ["@semantic-release/release-notes-generator"],
      },
    ],
    "@semantic-release/changelog",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): ${nextRelease.gitTag} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
