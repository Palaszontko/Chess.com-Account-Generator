import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { faker } from '@faker-js/faker';
import { Puppeteer } from 'puppeteer';

import { get_time, get_filename_time } from './modules/time';
import { logger } from './modules/logger';
import { send_captcha, recive_captcha } from './modules/captcha_solving';
import { getUserInput } from './modules/user_input';
import { validateChessGameLink } from './modules/validate_link';
import { append_user } from './modules/collect_data_csv';

import { site_solver_old } from './modules/site_solvers/old_layout_bot';
import { site_solver_new } from './modules/site_solvers/new_layout_bot';

(async () => {
  await logger.info('Game link format: https://www.chess.com/game/live/1234567890');

  let analize_link: string = await getUserInput('Input game link to analize: ');
  while (true) {
    if (validateChessGameLink(analize_link)) {
      logger.info('Game address is valid.');
      const analize_link_digits = analize_link.match(/\d+$/);
      analize_link = `https://www.chess.com/analysis/game/live/${analize_link_digits}?tab=review`;
      break;
    } else {
      logger.error(`Game address isn't valid. Try again.`);
      analize_link = await getUserInput('Input game link to analize: ');
    }
  }

  const browser = await puppeteer.use(StealthPlugin()).launch({
    headless: false,
    // ignoreDefaultArgs: ['--enable-automation'],
    args: ['--no-default-browser-check', '--lang=pl-PL', '--password_manager_enabled=false'],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto('https://www.chess.com/pl/register?returnUrl=https://www.chess.com/pl');

  let site_version_new: boolean = true;

  await page
    .waitForSelector('.authentication-skill-level-selection-component', { timeout: 2500 })
    .then(() => {
      site_version_new = false;
    })
    .catch(() => {
      site_version_new = true;
    });

  await logger.info(site_version_new ? 'NEW Site Layout' : 'OLD Site layout');

  if (site_version_new) {
    await site_solver_new(page, analize_link);
  } else {
    await site_solver_old(page, analize_link);
  }

  await logger.info('Account created successfuly.');
})();
