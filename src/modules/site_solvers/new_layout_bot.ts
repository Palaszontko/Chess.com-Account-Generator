import { get_filename_time } from '../time';
import { send_captcha, recive_captcha } from '../captcha_solving';
import { logger } from '../logger';
import { faker } from '@faker-js/faker';
import { append_user } from '../collect_data_csv';
import { getUserInput } from '../user_input';
import { ElementHandle } from 'puppeteer';
import { text } from 'stream/consumers';

export async function site_solver_new(page: any, analize_link: string) {
  interface userInterface {
    date: string;
    nickname: string;
    email: string;
    password: string;
    advancement: number;
    captcha: string;
    game_link: string;
  }

  const user: userInterface = {
    date: `${get_filename_time()}`,
    nickname: faker.string.alphanumeric(20),
    email: faker.string.alphanumeric(20) + '@sbcglobal.net',
    password: 'ChessCom2023qwer123',
    advancement: faker.number.int({ min: 0, max: 3 }),
    captcha: '0',
    game_link: analize_link,
  };

  await page.waitForSelector('button');

  const first_page_buttons = await page.$$('button');

  for (const button of first_page_buttons) {
    const textValue = await button.evaluate((el: any) => el.textContent); //Locating button by innerHtml (textContent)
    if (textValue == 'Zarejestruj się' || textValue == 'Sign up') {
      await button
        .evaluate((b: any) => b.click())
        .then(() => {
          // logger.debug('Register button clicked.');
        });
      break;
    }
  }

  await page.waitForSelector('label');
  const advancement_level_buttons = await page.$$('label'); //Locating advancement buttons
  await advancement_level_buttons[user.advancement].click(); // Clicking randomly generated advancement level from user object

  const second_page_buttons = await page.$$('button');

  for (const button of second_page_buttons) {
    const textValue = await button.evaluate((el: any) => el.textContent); //Locating button by innerHtml (textContent)
    if (textValue == 'Kontynuuj' || textValue == 'Continue') {
      await button
        .evaluate((b: any) => b.click())
        .then(() => {
          // logger.debug('Continue button clicked.');
        });
      break;
    }
  }

  await page.waitForSelector('[id="registration_email"]');

  const registration_email: any = await page.$('[id="registration_email"]');
  const registration_password: any = await page.$('[id="registration_password"]');

  await registration_email.type(user.email, { delay: faker.number.int({ min: 12, max: 30 }) });
  await registration_password.type(user.password, { delay: faker.number.int({ min: 12, max: 30 }) });

  const third_page_buttons = await page.$$('button');

  for (const button of third_page_buttons) {
    const textValue = await button.evaluate((el: any) => el.textContent); //Locating button by innerHtml (textContent)
    if (textValue == 'Kontynuuj' || textValue == 'Continue') {
      await button
        .evaluate((b: any) => b.click())
        .then(() => {
          // logger.debug('Continue button clicked.');
        });

      break;
    }
  }

  await page.waitForSelector('[id="registration_username"]');
  const registration_username: any = await page.$('[id="registration_username"]');
  await registration_username.type(user.nickname, { delay: faker.number.int({ min: 12, max: 30 }) });

  await console.log('essa');

  const [button] = await page.$x('/html/body/div[1]/div/div[3]/main/div/form/div[3]/div/div[2]/button'); //Unable to locate button so I used xpath

  await button.click();

  let is_captcha: boolean = false;

  // Did Captcha box appear?
  await page
    .waitForSelector('[alt="Captcha"]', { timeout: 4000 })
    .then(() => {
      logger.info(`Captcha solve is required`);
      is_captcha = true;
    })
    .catch(() => {
      logger.info('Captcha solve is not required');
      is_captcha = false;
    });

  // Solving Captcha
  if (is_captcha) {
    const screenshot_time: string = get_filename_time();

    const captcha_image_selector = await page.$('[alt="Captcha"]');

    await captcha_image_selector //Taking Screenshot
      ?.screenshot({
        path: `./src/captcha_images/${screenshot_time}.png`,
        type: 'png',
      })
      .then(() => {
        // logger.debug('Screenshot taken.');
      })
      .catch(() => {
        logger.error('Smth went wrong while taking screenshot of captcha.');
      });

    const captcha_image_encoded: string = (await captcha_image_selector?.screenshot({
      type: 'png',
      encoding: 'base64',
    })) as string;

    const captcha_id: any = await send_captcha(captcha_image_encoded);

    const captcha_solved_code: any = await recive_captcha(captcha_id);

    const registration_captcha = await page.$('[id="registration_captcha"]');

    await registration_captcha?.type(captcha_solved_code);

    user.captcha = await captcha_solved_code;

    await page.waitForSelector('[name="registration[password]"]');

    const second_registeration = await page.$('[name="registration[password]"]');

    await second_registeration.type(user.password);

    await page.waitForXPath('/html/body/div[1]/div/div[3]/main/div/form/div[2]/button');

    const [button2] = await page.$x('/html/body/div[1]/div/div[3]/main/div/form/div[2]/button'); //Unable to locate button so I used xpath
    await button2.click();

    await page.waitForTimeout(2000);

    await page.waitForSelector('[name="registration[username]"]');
    const second_username_input = await page.$('[name="registration[username]"]');
    await second_username_input.type(user.nickname, { delay: faker.number.int({ min: 12, max: 30 }) });

    await page.waitForXPath('/html/body/div[1]/div/div[3]/main/div/form/div[3]/div/div[2]/button');
    const [button3] = await page.$x('/html/body/div[1]/div/div[3]/main/div/form/div[3]/div/div[2]/button'); //Unable to locate button so I used xpath
    await button3.click();

    await page.waitForTimeout(2000);

    await page.goto(analize_link);
  } else {
    await page.goto(analize_link);
  }

  append_user(user, 'src/users_data.csv');
}
