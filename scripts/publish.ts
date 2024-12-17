import { execSync } from 'child_process';

const execSyncWithError = (command: string) => {
  try {
    return execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('\n[ERROR] Command failed:', command);
    if (error instanceof Error) {
      console.error('\nError details:');
      console.error(error.message);
      // 如果需要更详细的信息，可以把整个error对象打印出来
      console.error('\nFull error object:', error);
    }
    process.exit(1);
  }
};

const publishPackage = (packagePath: string) => {
  const originalDir = process.cwd();
  console.log(`[INFO] Navigating to package directory ${packagePath}...`);
  process.chdir(packagePath);

  console.log(`[INFO] Preparing publish ${packagePath}...`);
  execSyncWithError('pnpm run before:publish');

  console.log(`[INFO] Publishing ${packagePath} to npm...`);
  execSyncWithError('pnpm publish --access public');

  console.log('[SUCCESS] ==== Package published successfully! ====');

  console.log('[INFO] Returning to root directory...');
  process.chdir(originalDir);
};

const main = () => {
  const packageName = process.argv[2] || 'all';
  console.log('[INFO] ==== Starting publish process ====');

  console.log('[INFO] Installing dependencies...');
  execSyncWithError('pnpm install');

  console.log('[INFO] Building packages...');
  execSyncWithError('pnpm build');
  if (packageName === 'vue') {
    publishPackage('packages/player-vue');
  } else if (packageName === 'react') {
    publishPackage('packages/player-react');
  } else if (packageName === 'all') {
    publishPackage('packages/player-vue');
    publishPackage('packages/player-react');
  } else {
    console.error('[ERROR] Invalid package name');
    process.exit(1);
  }
};

main();
