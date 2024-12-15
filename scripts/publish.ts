import { execSync } from 'child_process';

const publishPackage = (packagePath: string) => {
  const originalDir = process.cwd();
  // Navigate to package directory
  console.log('[INFO] Navigating to package directory...');
  process.chdir(packagePath);

  // Build
  console.log('[INFO] Preparing publish...');
  execSync('pnpm run before:publish');

  // Publish
  console.log('[INFO] Publishing easy-audio-player-vue to npm...');
  execSync('pnpm publish --access public');

  console.log('[SUCCESS] ==== Package published successfully! ====');

  // Return to root directory
  console.log('[INFO] Returning to root directory...');
  process.chdir(originalDir);
};

const main = () => {
  console.log('[INFO] ==== Starting publish process ====');

  // Install dependencies
  console.log('[INFO] Installing dependencies...');
  execSync('pnpm install');
  publishPackage('packages/player-vue');
};

main();
