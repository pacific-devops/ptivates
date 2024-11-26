const path = require("path");
const packageJson = require(path.resolve(process.cwd(), "package.json"));
const semanticRelease = require("semantic-release");

const customInput = process.argv[2] || "Default Release Notes";

(async () => {
  const result = await semanticRelease(
    {
      branches: ["main"],
      tagFormat: `${packageJson.name}-v${"${version}"}`,
      plugins: [
        "@semantic-release/commit-analyzer",
        "@semantic-release/release-notes-generator",
        [
          "@semantic-release/changelog",
          {
            changelogFile: "CHANGELOG.md",
          },
        ],
        [
          "@semantic-release/exec",
          {
            prepareCmd: `echo "Custom Input: ${customInput}" >> release-notes.txt`,
          },
        ],
        "@semantic-release/github",
        [
          "@semantic-release/git",
          {
            assets: ["CHANGELOG.md"],
            message: `chore(release): ${customInput} [skip ci]`,
          },
        ],
      ],
    },
    {
      cwd: process.cwd(),
      stdout: process.stdout,
      stderr: process.stderr,
    }
  );

  if (result) {
    console.log(`Released version: ${result.nextRelease.version}`);
  } else {
    console.log("No release made.");
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
  

