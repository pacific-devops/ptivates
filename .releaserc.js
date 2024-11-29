const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/github",
    "@semantic-release/git",
     [
      "@semantic-release/exec",
        {
          generateNotesCmd: `
               echo "### Artifact Reference" >> release-notes.md;
              echo "* JFrog Artifact link ([hardcoded-artifact.zip](https://jfrog.com/hardcoded-artifact.zip))" >> release-notes.md;
        `,
      },
    ]

  ],
  extends: "semantic-release-monorepo",  // Use semantic-release-monorepo for monorepo handling
  //tagFormat: "v${version}",  // Set format for version tags
  tagFormat: `${packageJson.name}-v${"${version}"}`
}
