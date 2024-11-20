import semanticRelease from "semantic-release";

const result = semanticRelease(
  {
    // Define the branches to release from
    extends: "semantic-release-monorepo",
    
    branches: [
      { name: "main" }, // Main branch
      { name: "feature/*", channel: "dev-feature", prerelease: '${name.replace("feature/", "dev-")}' }, // Feature branches
    ],

    // Define the tag format
    // The scope will be automatically extracted from the commit message or folder name in monorepos
    tagFormat: "${scope}-${channel}-v${version}",

    plugins: [
      // Analyze commits and determine the release type based on Conventional Commits format
      [
        "@semantic-release/commit-analyzer", 
        { 
          preset: "conventionalcommits", // Use Conventional Commits preset
        }
      ],
      
      // Generate release notes based on the commit history
      [
        "@semantic-release/release-notes-generator", 
        {
          preset: "conventionalcommits", // Use Conventional Commits preset for generating notes
        }
      ],
      
      // Update the changelog file with the generated release notes
      [
        "@semantic-release/changelog", 
        {
          changelogFile: "CHANGELOG.md", // Define changelog file to be updated
        }
      ],
      
      // Automatically execute shell commands during the release process
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

      // Commit changes back to the git repository after release (e.g., version bump)
      "@semantic-release/git",
      
      // Create a GitHub release with the generated release notes
      [
        "@semantic-release/github", 
        {
          successComment: false,
          failTitle: false, // Optional: hide failure title in GitHub release
        }
      ],
    ],
  },
  {
    stdout: process.stdout,
    stderr: process.stderr,
  }
);

// Execute the release process and log information
result
  .then(({ lastRelease, commits, nextRelease, releases }) => {
    console.log(`Last release: ${lastRelease?.version}`);
    console.log(`Next release: ${nextRelease?.version}`);
  })
  .catch((err) => {
    console.error("The automated release failed with %O", err);
    process.exit(1);
  });
