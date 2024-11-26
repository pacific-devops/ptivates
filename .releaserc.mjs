import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import semanticRelease from 'semantic-release';
import { fileURLToPath } from 'url';

const customInput = process.argv[2] || "Default Release Notes";

// Get the current directory and resolve the package.json path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

(async () => {
  const result = await semanticRelease(
    {
      branches: ["main","feature/yarn-testing"],
      tagFormat: `${packageJson.name}-v${"${version}"}`,
      "extends": "semantic-release-monorepo",
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
