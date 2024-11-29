const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

module.exports = {
branches: ["main"],
plugins: [
          [
            "@semantic-release/commit-analyzer",
            { preset: "conventionalcommits" },
          ],
          [
            "@semantic-release/release-notes-generator",
            { preset: "conventionalcommits" },
          ],
          [
            "@semantic-release/changelog",
            { changelogFile: "CHANGELOG.md" },
          ],
          [
            "@semantic-release/exec",
            {
              generateNotesCmd: "echo '### Artifact Reference' >> release-notes.md"
            },
          ],
          "@semantic-release/git",
          [
            "@semantic-release/github",
            {
              successComment: false,
              failTitle: false,
            },
          ],
        ],
  extends: "semantic-release-monorepo",  // Use semantic-release-monorepo for monorepo handling
  //tagFormat: "v${version}",  // Set format for version tags
  tagFormat: `${packageJson.name}-v${"${version}"}`
}

