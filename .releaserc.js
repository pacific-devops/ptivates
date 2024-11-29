const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));

module.exports = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    {
      "path": "@semantic-release/changelog",
      "changelogFile": "CHANGELOG.md"
    },
    "@semantic-release/github",
    "@semantic-release/git",
    {
      "path": "@semantic-release/exec",
      "cmd": `
        echo "### Artifact Reference" >> release-notes.md;
        echo "* JFrog Artifact link ([${process.env.JFROG_FILE_NAME}](${process.env.JFROG_FILE_URL}))" >> release-notes.md;
      `,
    }
  ],
  extends: "semantic-release-monorepo",  // Use semantic-release-monorepo for monorepo handling
  tagFormat: `${packageJson.name}-v${version}`,
  generateNotes: {
    path: "@semantic-release/release-notes-generator",
    releaseNotes: (pluginConfig, context) => {
      // Add JFrog artifact reference dynamically
      const jfrogFileName = process.env.JFROG_FILE_NAME || "default-file";
      const jfrogFileUrl = process.env.JFROG_FILE_URL || "https://default-url.com";

      const releaseNotes = `${pluginConfig.releaseNotes}\n\n### Artifact Reference\n* JFrog Artifact link ([${jfrogFileName}](${jfrogFileUrl}))`;

      return releaseNotes;
    }
  }
}
