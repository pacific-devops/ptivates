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
        generateNotesCmd: `
          echo "PREV_TAG=v${lastRelease.version}" >> $GITHUB_OUTPUT;
          echo "NEXT_TAG=v${nextRelease.version}" >> $GITHUB_OUTPUT;
          if [ "${process.argv.slice(2)[0]}" != "" ]; then 
            echo "### Artifact Reference"; 
            echo "* JFrog Artifact link ([${process.argv.slice(2)[0]}](${process.argv.slice(2)[1]}))"; 
          fi
        `
      }
    ],
    "@semantic-release/git",
    [
      "@semantic-release/github", 
      {
        "successComment": false, 
        "failTitle": false 
      }
    ]
  ]
};
