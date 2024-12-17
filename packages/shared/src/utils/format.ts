/**
 * Format seconds to MM:SS
 * @param time Time in seconds
 * @returns Formatted time string
 */
export function formatTime(time: number): string {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
