import { get_time } from './time';

export const logger = {
  colors: {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
  },
  info: (msg: string, value: any = ' ') => {
    console.log(`[${get_time()}] ${logger.colors.green}INFO${logger.colors.reset} ${msg} ${value}`);
  },
  debug: (msg: string = ' ', value: any = ' ') => {
    console.log(`[${get_time()}] ${logger.colors.blue}DEBUG${logger.colors.reset} ${msg} ${value}`);
  },
  error: (msg: string) => {
    console.log(`[${get_time()}] ${logger.colors.red}ERROR${logger.colors.reset} ${msg}`);
  },
};
