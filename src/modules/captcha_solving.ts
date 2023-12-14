import axios from 'axios';
import dotenv from 'dotenv';

import { logger } from './logger';

dotenv.config();

export function send_captcha(encoded_image_base64: string) {
  return new Promise((resolve, reject) => {
    const params = {
      key: process.env.CAPTCHA_API_KEY,
      method: 'base64',
      body: encoded_image_base64,
      textinstructions: 'Type text from image',
      json: 1,
    };
    axios
      .post('http://2captcha.com/in.php', params)
      .then((response) => {
        logger.debug('Captcha ID:', response.data.request);
        resolve(response.data.request);
      })
      .catch((error) => {
        logger.error(error);
        reject(0);
      });
  });
}

export async function recive_captcha(id: string): Promise<object> {
  const params = {
    key: process.env.CAPTCHA_API_KEY,
    action: 'get',
    id: id,
    json: 1,
  };

  while (true) {
    try {
      const response = await axios.get('http://2captcha.com/res.php', { params: params });

      if (response.data.status == 1) {
        logger.info('Captcha solved! Solved Captcha:', response.data.request);
        return response.data.request;
      }
    } catch (error: any) {
      logger.error(error);
    }
    logger.info('Waiting for Captcha to be solved...')
    await delay(3000);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
