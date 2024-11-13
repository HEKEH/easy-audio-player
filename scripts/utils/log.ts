export enum LogColor {
  reset = '\x1b[0m',

  red = '\x1b[91m',
  yellow = '\x1b[33m',
  blue = '\x1b[34m',

  lavender = '\x1b[95m',
  rose = '\x1b[35m', // Soft pink
  deepBlue = '\x1b[94m', // Muted deep blue
  seafoam = '\x1b[96m', // Light turquoise
  mint = '\x1b[92m', // Soft mint green
}

function formatMessage(message: unknown | unknown[]): string {
  return typeof message === 'object'
    ? JSON.stringify(message)
    : String(message);
}

export function log({
  projectName,
  color,
  message,
}: {
  projectName?: string;
  color?: LogColor;
  message: unknown;
}) {
  const formattedMessage = formatMessage(message);
  if (projectName) {
    console.log(
      // color is only applied to the project name
      `${color || LogColor.reset}[${projectName}] ${
        LogColor.reset
      }${formattedMessage}`,
    );
  } else {
    console.log(
      `${color || LogColor.reset}${formattedMessage}${LogColor.reset}`,
    );
  }
}

export function logError({
  projectName,
  color,
  message,
}: {
  projectName?: string;
  /** color is only applied to the project name  */
  color?: LogColor;
  message: unknown;
}): void {
  const formattedMessage = formatMessage(message);

  if (formattedMessage.toLowerCase().includes('warning')) {
    let logMessage = `${LogColor.yellow}${formattedMessage}${LogColor.reset}`;
    if (projectName) {
      logMessage = `${color || LogColor.yellow}[${projectName}] ${logMessage}`;
    }
    console.warn(logMessage);
  } else {
    let logMessage = `${LogColor.red}${formattedMessage}${LogColor.reset}`;
    if (projectName) {
      logMessage = `${color || LogColor.red}[${projectName}] ${logMessage}`;
    }
    console.error(logMessage);
  }
}
