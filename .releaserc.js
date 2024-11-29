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
              generateNotesCmd: `
                echo "PREV_TAG=1.2" >> $GITHUB_OUTPUT;
                echo "NEXT_TAG=v1.3" >> $GITHUB_OUTPUT;
                echo "RELEASE_TYPE=patch >> $GITHUB_OUTPUT;
                echo "### Artifact Reference" >> release-notes.md;
                  echo "* JFrog Artifact link ([master.zip](https://jfrog.com))" >> release-notes.md;
                fi
              `,
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

