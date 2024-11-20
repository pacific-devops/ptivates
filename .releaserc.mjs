import semanticRelease from "semantic-release";

const args = process.argv.slice(2);
const jFrogFileName = args[0];
const jFrogFileUrl = args[1];

const result = semanticRelease(
  {
    branches: [
      { name: "main" }, // Stable releases
      { 
        name: "feature/*", 
        prerelease: "${name.replace('feature/', '')}" // Marks the release as a pre-release for the branch
      }
    ],
    tagFormat: "${scope}-v${version}", // Scoped tag format for stable and pre-releases

    plugins: [
      [
        "@semantic-release/commit-analyzer",
        { preset: "conventionalcommits" }
      ],
      [
        "@semantic-release/release-notes-generator",
        { preset: "conventionalcommits" }
      ],
      [
        "@semantic-release/changelog",
        { changelogFile: "CHANGELOG.md" }
      ],
      [
        "@semantic-release/exec",
        {
          generateNotesCmd: `
            echo "PREV_TAG=v${lastRelease.version}" >> $GITHUB_OUTPUT;
            echo "NEXT_TAG=v${nextRelease.version}" >> $GITHUB_OUTPUT;
            echo "RELEASE_TYPE=${nextRelease.type}" >> $GITHUB_OUTPUT;
            if [ "${jFrogFileName}" != "" ]; then 
              echo "### Artifact Reference";
              echo "* JFrog Artifact link ([${jFrogFileName}](${jFrogFileUrl}))";
            fi;
          `
        }
      ],
      "@semantic-release/git",
      [
        "@semantic-release/github",
        {
          successComment: false,
          failTitle: false,
        }
      ]
    ],

    parserOpts: {
      headerPattern: /^(\w*)(?:\(([\w$.\-*/ ]*)\))?: (.*)$/,
      headerCorrespondence: ["type", "scope", "subject"],
    },
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
