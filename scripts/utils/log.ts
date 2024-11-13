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

export function log(color: LogColor, ...args: unknown[]) {
  const message = args
    .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
    .join(' ');
  console.log(`${color}${message}${LogColor.reset}`);
}

export function logError(...args: unknown[]): void {
  const message = args
    .map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
    .join(' ');

  if (message.toLowerCase().includes('warning')) {
    console.warn(`${LogColor.yellow}${message}${LogColor.reset}`);
  } else {
    console.error(`${LogColor.red}${message}${LogColor.reset}`);
  }
}
