const path = require("path");
const fs = require("fs");

const semanticRelease = async () => {
  const { default: release } = await import("semantic-release");
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8")
  );

  const args = process.argv.slice(2);
  const jFrogFileName = args[0];
  const jFrogFileUrl = args[1];

  try {
    const result = await release(
      {
        branches: [
            "main",
             {
               "name": "feature/*",
               "channel": "dev-feature",
               "prerelease": "dev-feature"
            }
        ],
        tagFormat: `${packageJson.name}-v\${version}`, // Use literal "${version}" for semantic-release to resolve it dynamically
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
              prepareCmd: `
                if [ "\${lastRelease.version}" != "" ]; then
                  echo "PREV_TAG=v\${lastRelease.version}" >> $GITHUB_OUTPUT;
                fi
                echo "NEXT_TAG=v\${nextRelease.version}" >> $GITHUB_OUTPUT;
                echo "RELEASE_TYPE=\${nextRelease.type}" >> $GITHUB_OUTPUT;
                if [ "${jFrogFileName}" != "" ]; then
                  echo "### Artifact Reference" >> release-notes.md;
                  echo "* JFrog Artifact link ([${jFrogFileName}](${jFrogFileUrl}))" >> release-notes.md;
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
      },
      {
        stdout: process.stdout,
        stderr: process.stderr,
      }
    );

    console.log(`Last release: ${result.lastRelease?.version}`);
    console.log(`Next release: ${result.nextRelease?.version}`);
  } catch (err) {
    console.error("Release failed: ", err);
    console.error("Details: ", err.message);
    process.exit(1);
  }
};

semanticRelease();
