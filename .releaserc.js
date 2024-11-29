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
          if [ -n "$JFROG_FILE_NAME" ] && [ -n "$JFROG_FILE_URL" ]; then
            echo "### Artifact Reference" >> release-notes.md;
            echo "* JFrog Artifact link ([$JFROG_FILE_NAME]($JFROG_FILE_URL))" >> release-notes.md;
          fi
        `
      }
    ]
  ],
  extends: "semantic-release-monorepo",  // Use semantic-release-monorepo for monorepo handling
  //tagFormat: "v${version}",  // Set format for version tags
  tagFormat: `${packageJson.name}-v${"${version}"}`
}
