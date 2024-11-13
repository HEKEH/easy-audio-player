import { join } from 'path';
import { LogColor, ProjectConfig, startProjects } from './utils';

/** Projects start order */
const projects: Array<ProjectConfig | Array<ProjectConfig>> = [
  // order 1
  {
    name: 'easy-audio-player-shared',
    path: join(__dirname, '../packages/shared'),
    command: 'pnpm dev',
    readySignal: /^built in \d+ms\.$/,
    logColor: LogColor.lavender,
  },
  // order 2
  [
    {
      name: 'easy-audio-player-vue',
      path: join(__dirname, '../packages/player-vue'),
      command: 'pnpm dev',
      readySignal: /^built in \d+ms\.$/,
      logColor: LogColor.seafoam,
    },
    // TODO: add easy-audio-player-react
  ],
  // order 3
  {
    name: 'easy-audio-player-demo',
    path: join(__dirname, '../packages/demo'),
    command: 'pnpm dev',
    readySignal: /Local:\s+http:\/\/localhost:\d+\//,
    logColor: LogColor.mint,
  },
];

startProjects(projects);
