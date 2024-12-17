import { namespace } from '../constants';

export const bem = (block: string, element?: string, modifier?: string) => {
  return `${namespace}-${block}${element ? `__${element}` : ''}${modifier ? `--${modifier}` : ''}`;
};
