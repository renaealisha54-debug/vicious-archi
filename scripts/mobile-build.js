// Next's static-export check scans source files for the 'use server'
// directive before webpack ever resolves aliases, so an alias swap alone
// isn't enough — the file at this path has to not contain 'use server'
// during a mobile build. This script backs up the real flow, overwrites
// it with a plain stub, runs the mobile build, and always restores the
// original file afterward (even if the build fails).

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const flowPath = path.join(
  __dirname,
  '..',
  'src/ai/flows/generate-codebase-readme.ts'
);
const backupPath = `${flowPath}.bak`;

const stub = `// Temporary stub swapped in for the mobile build by scripts/mobile-build.js.
// If you're seeing this file after a build, something failed before restore —
// check src/ai/flows/generate-codebase-readme.ts.bak and restore it manually.

export async function generateCodebaseReadme(_input: {
  codebaseDescription: string;
}): Promise<{ readmeContent: string }> {
  throw new Error(
    "README synthesis needs a server and isn't available in the mobile app."
  );
}
`;

fs.copyFileSync(flowPath, backupPath);

try {
  fs.writeFileSync(flowPath, stub);
  execSync('next build', {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_MOBILE_BUILD: 'true' },
  });
} finally {
  fs.copyFileSync(backupPath, flowPath);
  fs.unlinkSync(backupPath);
}
