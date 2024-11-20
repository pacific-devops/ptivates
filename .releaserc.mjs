import semanticRelease from "semantic-release";

const result = semanticRelease(
  {
    extends: "semantic-release-monorepo",

    branches: [
      "main" ,
      { name: "feature/*", channel: "dev-feature"},
    ],

    // Use name as scope dynamically extracted from package.json
    tagFormat: "${name}-v${version}",

    plugins: [
      [
        "@semantic-release/commit-analyzer", 
        { 
          preset: "conventionalcommits", 
        }
      ],
      
      [
        "@semantic-release/release-notes-generator", 
        {
          preset: "conventionalcommits", 
        }
      ],
      
      [
        "@semantic-release/changelog", 
        {
          changelogFile: "CHANGELOG.md", 
        }
      ],
      
      [
        "@semantic-release/exec", 
        {
          generateNotesCmd: `
            echo "PREV_TAG=v\${lastRelease.version}" >> \$GITHUB_OUTPUT;
            echo "NEXT_TAG=v\${nextRelease.version}" >> \$GITHUB_OUTPUT;
            echo "RELEASE_TYPE=\${nextRelease.type}" >> \$GITHUB_OUTPUT;
            if [ "\${process.argv.slice(2)[0]}" != "" ]; then
              echo "### Artifact Reference";
              echo "* JFrog Artifact link ([\${process.argv.slice(2)[0]}](\${process.argv.slice(2)[1]}))";
            fi
          `,
        }
      ],

      "@semantic-release/git",
      
      [
        "@semantic-release/github", 
        {
          successComment: false,
          failTitle: false,
        }
      ],
    ],
  },
  {
    stdout: process.stdout,
    stderr: process.stderr,
  }
);

result
  .then(({ lastRelease, commits, nextRelease, releases }) => {
    console.log(`Last release: ${lastRelease?.version}`);
    console.log(`Next release: ${nextRelease?.version}`);
  })
  .catch((err) => {
    console.error("The automated release failed with %O", err);
    process.exit(1);
  });
