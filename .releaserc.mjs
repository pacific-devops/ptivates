import semanticRelease from "semantic-release";
import { readdirSync, statSync } from "fs";
import { resolve } from "path";

// Get folders dynamically from the root directory
const packageFolders = readdirSync(resolve("./"))
  .filter((folder) => {
    const path = resolve(folder);
    return (
      !folder.startsWith(".") && // Exclude hidden files/folders
      !["node_modules", "dist", "build"].includes(folder) && // Exclude standard folders
      statSync(path).isDirectory() // Use statSync imported from 'fs'
    );
  });

const result = semanticRelease(
  {
    branches: [
      { name: "main" },
      { name: "feature/*", channel: "dev-feature", prerelease: '${name.replace("feature/", "dev-")}' }
    ],
    tagFormat: '${name}-v${version}',
    plugins: [
      [
        '@semantic-release/commit-analyzer',
        {
          preset: 'conventionalcommits',
          releaseRules: [
            { type: 'feat', release: 'minor' },
            { type: 'fix', release: 'patch' },
            { type: 'perf', release: 'patch' },
            { type: 'BREAKING CHANGE', release: 'major' }
          ]
        }
      ],
      [
        '@semantic-release/release-notes-generator',
        {
          preset: 'conventionalcommits'
        }
      ],
      ...packageFolders.map((packageName) => [
        '@semantic-release/changelog',
        { changelogFile: `${packageName}/CHANGELOG.md` },
      ]).flat(),
      ...packageFolders.map((packageName) => [
        '@semantic-release/git',
        { assets: [`${packageName}/CHANGELOG.md`, 'package.json'], message: `chore(release): ${packageName} ${"${nextRelease.version}"}` },
      ]).flat(),
      ...packageFolders.map((packageName) => [
        '@semantic-release/github',
        { successComment: false, failTitle: false },
      ]).flat(),
      [
        '@semantic-release/exec',
        {
          generateNotesCmd: `echo "PREV_TAG=v\${lastRelease.version}" >> $GITHUB_OUTPUT; \
            echo "NEXT_TAG=v\${nextRelease.version}" >> $GITHUB_OUTPUT; \
            echo "RELEASE_TYPE=\${nextRelease.type}" >> $GITHUB_OUTPUT;`
        }
      ]
    ]
  },
  {
    stdout: process.stdout,
    stderr: process.stderr
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
