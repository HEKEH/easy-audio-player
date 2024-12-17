import { namespace } from '../constants';

export function bem(block: string, element?: string, modifier?: string) {
  return `${namespace}-${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`;
}
