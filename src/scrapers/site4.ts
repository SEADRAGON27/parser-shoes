import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class Adidas implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const userModel = userData.model.replace(/^(\S+\s*)/, '').trim();
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('https://www.adidas.ua');
        await page.click('.search-input__button');
        await wait(1000);
        await page.type('input[type="text"]', userModel);
        await page.keyboard.press('Enter');
        await wait(2000);
        const filterButton = await page.$('.filter__btn--icon');
        
        if (filterButton === null) {
            logger.info(`Not found ${userData.model} in site4.js`);
            await browser.close();
            return;
        }
        
        await page.click('.filter__btn--icon');
        await wait(2000);
        await page.click('.panel__list div:nth-child(4)');
        await wait(2000);

        switch (userData.category) {
        case 'man':
            await page.click(
                '.list[data-type="checkbox-list"] a:nth-child(4)',
            );

            await page.click('.filter__content--apply');
            break;
        case 'woman':
            await page.click(
                '.list[data-type="checkbox-list"] a:nth-child(3)',
            );
            await page.click('.filter__content--apply');
            break;
        case 'child':
            await page.click(
                '.list[data-type="checkbox-list"] a:nth-child(2)',
            );
            await page.click('.filter__content--apply');
            break;
        }

        await wait(3000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.product__content');
            const priceElements = await page.$$('.product__price');
            const images = await page.$$('.image-main img');
            
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];

                const link = await element.$eval(
                    '.product__info',
                    (el: Element): string | null => el.getAttribute('href'),
                );

                const imageElement = await image.evaluate(
                    (el: Element): string | null => el.getAttribute('src'),
                );

                const priceOld = await priceElement.$eval(
                    '.price__first',
                    (el: Element): string | undefined =>
                        el.textContent?.replace(/\D/g, ''),
                );
                const priceNew = await priceElement.$('.price__sale');
                let priceModel: string | undefined = '';
                if (priceNew === null) {
                    priceModel = priceOld;
                } else {
                    priceModel = await priceNew.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                }

                itemsLinks = {
                    link: 'https://www.adidas.ua' + link,
                    price: priceModel,
                    image: imageElement,
                };
                await file('write', itemsLinks);
            }
            const nextButton = await page.$('.pagination__item--btn');
            if (nextButton) {
                await page.click('.pagination__item--btn');
            } else {
                logger.info('The operation was completed successfully in site4.js');
                await browser.close();
                break;
            }
        }
    }
}

export const adidas = new Adidas();
