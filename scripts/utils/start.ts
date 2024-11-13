import { spawn, SpawnOptions } from 'child_process';
import { LogColor, log, logError } from './log';

const runningChildProcesses: ReturnType<typeof spawn>[] = [];

/** execute command and wait for ready signal */
export function executeCommand(project: ProjectConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    const { logColor: projectColor } = project;
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

export function killAllChildProcesses() {
  runningChildProcesses.forEach(_process => {
    _process.kill();
  });
}

type ReadySignal = string | RegExp;

export type ProjectConfig = {
  name: string;
  path: string;
  command: string;
  readySignal?: ReadySignal;
  logColor: LogColor;
};

/** start projects sequentially */
export async function startProjects(
  projects: Array<ProjectConfig | ProjectConfig[]>,
) {
  // add listener for Ctrl+C
  process.on('SIGINT', () => {
    log(LogColor.red, '\nReceived SIGINT. Shutting down all processes...');
    killAllChildProcesses();
    process.exit(0);
  });
  try {
    for (const project of projects) {
      if (Array.isArray(project)) {
        // start projects in parallel
        await Promise.all(project.map(p => executeCommand(p)));
      } else {
        await executeCommand(project);
      }
    }
    log(LogColor.blue, 'All projects started successfully!');
  } catch (error) {
    logError('Failed to start projects:', error);
    killAllChildProcesses();
    process.exit(1);
  }
}
