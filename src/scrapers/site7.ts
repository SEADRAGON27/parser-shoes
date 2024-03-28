import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class DeltaSport implements IScraperInterface {
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://deltasport.ua',{
            waitUntil: 'domcontentloaded'
        });
        await wait(1000);
        await page.click('.b_nav-b_s-search');
        await page.type('input[type="text"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(2000);
        const filterButton = await page.$('.s_item-top_inf');
        
        if (!filterButton) {
            logger.info(`Not found ${userData.model} in site7.js`);
            await browser.close();
            return;
        }
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.s_item-top_inf');
            const priceElements = await page.$$('.price');
            const images = await page.$$('.js-product_img source');
            const NewUserData: Record<string, string> = {};
            NewUserData.category =
                userData.category === 'man'
                    ? 'для чоловіків'
                    : userData.category === 'woman'
                        ? 'для жінок'
                        : userData.category === 'child'
                            ? 'для дітей'
                            : userData.category;

            NewUserData.unisex =
                userData.category === 'для чоловіків' ||
                userData.category === 'для жінок'
                    ? 'UNISEX'
                    : '';

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];

                const categories = await element.$eval(
                    '.lowercase',
                    (el: Element): string | null => el.textContent,
                );

                if (
                    categories?.includes(NewUserData.category) ||
                    categories?.includes(NewUserData.unisex)
                ) {
                    const link = await element.$eval(
                        '.s_item-top_inf a',
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const imageElement = await image.evaluate(
                        (el: Element): string | null =>
                            el.getAttribute('srcset'),
                    );

                    const priceOld = await priceElement.$('.f_price');

                    const priceNew = await priceElement.$('.sale');
                    let priceModel: string | undefined = '';
                    if (priceNew === null) {
                        priceModel = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    } else {
                        priceModel = await priceElement.$eval(
                            '.f_price',
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }

                    itemsLinks = {
                        link: 'https://deltasport.ua' + link,
                        price: priceModel,
                        image: 'https://deltasport.ua' + imageElement,
                    };
                    await file('write', itemsLinks);
                }
            }

            const nextButton = await page.$('.next');
            if (nextButton) {
                await page.click('.next');
            } else {
                logger.info('The operation was completed successfully in site7.js');
                await browser.close();
                break;
            }
        }
    }
}

export const deltasport = new DeltaSport();
