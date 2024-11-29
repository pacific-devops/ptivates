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
        prepareCmd: `
          echo "### Artifact Reference" >> release-notes.md;
          echo "* JFrog Artifact link ([${process.env.JFROG_FILE_NAME}](${process.env.JFROG_FILE_URL}))" >> release-notes.md;
        `,
        publishCmd: `
          echo "Publishing to JFrog...";
          echo "Artifact URL: ${process.env.JFROG_FILE_URL}";
        `
      }
    ]
  ],
  extends: "semantic-release-monorepo", // For monorepo handling
  tagFormat: `${packageJson.name}-v${"${version}"}` // Custom tag format
};

