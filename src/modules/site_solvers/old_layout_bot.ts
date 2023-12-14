import { get_filename_time } from '../time';
import { send_captcha, recive_captcha } from '../captcha_solving';
import { logger } from '../logger';
import { faker } from '@faker-js/faker';
import { append_user } from '../collect_data_csv';

export async function site_solver_old(page: any, analize_link: string) {
  interface userInterface {
    date: string;
    nickname: string;
    email: string;
    password: string;
    advancement: number;
    captcha: string;
    game_link: string;
  }

  let is_captcha: boolean = false;

  await page
    .waitForSelector('[alt="Captcha"]', { timeout: 2500 })
    .then(() => {
      logger.info(`Captcha solve is required`);
      is_captcha = true;
    })
    .catch(() => {
      logger.info('Captcha solve is not required');
      is_captcha = false;
    });

  if (is_captcha) {
    const screenshot_time: string = get_filename_time();

    const captcha_image_selector = await page.$('[alt="Captcha"]');

    await captcha_image_selector?.screenshot({
      path: `./src/captcha_images/${screenshot_time}.png`,
      type: 'png',
    });

    const captcha_image_encoded: string = (await captcha_image_selector?.screenshot({
      type: 'png',
      encoding: 'base64',
    })) as string;

    const captcha_id: any = await send_captcha(captcha_image_encoded);

    const captcha_solved_code: any = await recive_captcha(captcha_id);

    const registration_captcha = await page.$('[id="registration_captcha"]');

    await registration_captcha?.type(captcha_solved_code);
  }

  const user: userInterface = {
    date: `${get_filename_time()}`,
    nickname: faker.string.alphanumeric(20),
    email: faker.string.alphanumeric(20) + '@sbcglobal.net',
    password: 'ChessCom2023essa123',
    advancement: faker.number.int({ min: 0, max: 3 }),
    captcha: '0',
    game_link: analize_link,
  };

  logger.debug('Created user email:', user.email);

  logger.debug('Created user nickname:', user.nickname);

  logger.debug('Created user password:', user.password);
  logger.debug('Created user advancement level:', user.advancement);

  const registration_username: any = await page.$('[id="registration_username"]');
  const registration_email: any = await page.$('[id="registration_email"]');
  const registration_password: any = await page.$('[id="registration_password"]');
  const registration_advancement_level: any = await page.$$('.authentication-skill-level-selection-level');
  const register_button: any = await page.$('[id="registration_submit"]');

  await registration_username.type(user.nickname);
  await registration_email.type(user.email);
  await registration_password.type(user.password);

  await registration_advancement_level[user.advancement].click();
  await page.waitForTimeout(1000);
  await register_button.click();

  await page.waitForTimeout(1000);
  await page.goto(analize_link);

  append_user(user, 'src/users_data.csv');
}
