const path = require("path");

let packageJson;
try {
  packageJson = require(path.resolve(process.cwd(), "package.json"));
} catch (error) {
  console.error("Error reading package.json:", error);
  process.exit(1); // Exit with an error code
}

module.exports = {
  branches: [
    { name: "main" },
    { name: "feature/*", channel: "dev-feature", prerelease: '${name.replace("feature/", "dev-")}' },
  ],
  tagFormat: `${packageJson.name}-v${"${version}"}`,
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    [
      "@semantic-release/exec",
      {
        generateNotesCmd: `
          echo "PREV_TAG=v\${lastRelease.version}" >> $GITHUB_OUTPUT;
          echo "NEXT_TAG=v\${nextRelease.version}" >> $GITHUB_OUTPUT;
          echo "RELEASE_TYPE=\${nextRelease.type}" >> $GITHUB_OUTPUT;
          echo \"### Artifact Reference\"; 
          if [ -n \"${process.env.JFROG_FILE_URL}\" ] && [ -n \"${process.env.JFROG_FILE_NAME}\" ]; then 
            echo '* JFrog Artifact link ([${process.env.JFROG_FILE_NAME}](${process.env.JFROG_FILE_URL}))'; 
          fi
        `,
      },
    ],
    "@semantic-release/git",
    ["@semantic-release/github", { successComment: false, failTitle: false }],
  ],
};
