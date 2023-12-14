import fs from 'fs';
import { logger } from './logger';

export function append_user(user: any, path: string) {
  const data = '\n' + [user.date, user.nickname, user.password, user.game_link, user.captcha].join(';');
  fs.appendFile(path, data, (response: any) => {
    logger.debug('User data saved.');
  });
}
