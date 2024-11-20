import semanticRelease from "semantic-release";
import { readFileSync } from 'fs';
import path from 'path';

// Function to get the package name
const getPackageName = () => {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  return packageJson.name;
};

const result = semanticRelease(
  {
    extends: "semantic-release-monorepo",

    branches: [
      "main",
      { name: "feature/*", prerelease: true },
    ],

    tagFormat: `${getPackageName()}`-v${version},

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
