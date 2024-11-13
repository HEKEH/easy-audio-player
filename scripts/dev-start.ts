import { spawn, SpawnOptions } from 'child_process';
import { join } from 'path';
import { Color, log, logError } from './utils';

const PROJECT_COLORS = [
  Color.lavender,
  Color.seafoam,
  Color.mint,
  Color.rose,
] as const;

function getProjectColor(index: number): Color {
  return PROJECT_COLORS[index % PROJECT_COLORS.length];
}

type ReadySignal = string | RegExp;

type ProjectConfig = {
  name: string;
  path: string;
  command: string;
  readySignal?: ReadySignal;
};

/** Projects start order */
const projects: Array<ProjectConfig | Array<ProjectConfig>> = [
  // order 1
  {
    name: 'easy-audio-player-shared',
    path: join(__dirname, '../packages/shared'),
    command: 'pnpm dev',
    readySignal: /^built in \d+ms\.$/,
  },
  // order 2
  [
    {
      name: 'easy-audio-player-vue',
      path: join(__dirname, '../packages/player-vue'),
      command: 'pnpm dev',
      readySignal: /^built in \d+ms\.$/,
    },
    // TODO: add easy-audio-player-react
  ],
  // order 3
  {
    name: 'easy-audio-player-demo',
    path: join(__dirname, '../packages/demo'),
    command: 'pnpm dev',
    readySignal: /Local:\s+http:\/\/localhost:\d+\//,
  },
];

const runningChildProcesses: ReturnType<typeof spawn>[] = [];

/** execute command and wait for ready signal */
function executeCommand(
  project: ProjectConfig,
  projectIndex: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const projectColor = getProjectColor(projectIndex);
    log(projectColor, `Starting ${project.name}...`);

    const [cmd, ...args] = project.command.split(' ');
    const options: SpawnOptions = {
      cwd: project.path,
      shell: true,
    };

    const childProcess = spawn(cmd, args, options);
    runningChildProcesses.push(childProcess);

    let resolved = false;
    // Handle process output
    childProcess.stdout?.on('data', async data => {
      const output = data.toString().trim();
      log(projectColor, `[${project.name}] ${output}`);

      // Check for ready signal in output
      if (
        project.readySignal &&
        !resolved &&
        (typeof project.readySignal === 'string'
          ? output.includes(project.readySignal)
          : project.readySignal.test(output))
      ) {
        log(projectColor, `[${project.name}] is ready`);
        resolved = true;
        resolve();
      }
    });

    childProcess.stderr?.on('data', data => {
      logError(`[${project.name}] ${data.toString().trim()}`);
    });

    childProcess.on('error', error => {
      logError(`[${project.name}] error:`, error);
      reject(error);
    });

    childProcess.on('exit', code => {
      if (code !== 0) {
        reject(new Error(`${project.name} exited with code ${code}`));
      }
    });
    if (!project.readySignal) {
      resolve();
    }
  });
}

function killAllChildProcesses() {
  runningChildProcesses.forEach(_process => {
    _process.kill();
  });
}

/** add listener for Ctrl+C */
process.on('SIGINT', () => {
  log(Color.red, '\nReceived SIGINT. Shutting down all processes...');
  killAllChildProcesses();
  process.exit(0);
});

/** start projects sequentially */
async function startProjects() {
  try {
    let projectIndex = 0;
    for (const project of projects) {
      if (Array.isArray(project)) {
        await Promise.all(project.map(p => executeCommand(p, projectIndex++)));
      } else {
        await executeCommand(project, projectIndex++);
      }
    }
    log(Color.blue, 'All projects started successfully!');
  } catch (error) {
    logError('Failed to start projects:', error);
    killAllChildProcesses();
    process.exit(1);
  }
}

startProjects();
