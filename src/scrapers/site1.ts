/* eslint-disable no-constant-condition */
import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';

export class Nike implements IScraperInterface {
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://www.nike.one', {
            waitUntil: 'domcontentloaded',
        });
        await wait(1000);
        await page.type('[type="text"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(2000);
        const filterButton = await page.$(
            'body > div.page__body > div.page__content > div > div > div > div.content__sidebar.hidden-xs > div > div > ul > li:nth-child(1) > ul > li > a',
        );
        
        if (filterButton === null) {
            logger.info(`Not found ${userData.model} in site1.js`);
            await browser.close();
            return;
        }
        
        switch (userData.category) {
        case 'man':
            await page.click(
                'body > div.page__body > div.page__content > div > div > div > div.content__sidebar.hidden-xs > div > div > ul > li:nth-child(1) > ul > li > a',
            );
            break;
        case 'woman':
            await page.click(
                'body > div.page__body > div.page__content > div > div > div > div.content__sidebar.hidden-xs > div > div > ul > li:nth-child(2) > ul > li > a',
            );
            break;
        }
        // eslint-disable-next-line quotes, no-constant-condition
        await wait(2000);
        while (true) {
            const elements = await page.$$('.product-cut__title-link'); // Находим все элементы с классом 'product-cut__title-link'
            const priceElements = await page.$$('.product-price--bg');
            const images = await page.$$('.product-photo__item img');

            const model = userData.model.replace(/\b\w/g, (char) =>
                char.toUpperCase(),
            );

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[5 + i];
                const text = await element.evaluate(
                    (el: Element): string | null => el.textContent,
                );

                const imageElement = await image.evaluate(
                    (el: Element): string | null => el.getAttribute('src'),
                );

                if (text?.includes(model)) {
                    const link = await element.evaluate(
                        (el: Element): string => (el as HTMLAnchorElement).href,
                    );

                    const priceOld = await priceElement.$(
                        '.product-price__main',
                    );

                    const priceNew = await priceElement.$(
                        '.product-price__old',
                    );
                    let priceModel: string | undefined = '';
                    if (priceNew === null) {
                        priceModel = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    } else {
                        priceModel = await priceElement.$eval(
                            '.product-price__main',
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }

                    itemsLinks = {
                        link: link,
                        price: priceModel,
                        image: 'https://www.nike.one' + imageElement,
                    };
                    await file('write', itemsLinks);
                }
            }

            const nextButtonSelector =
                'body > div.page__body > div.page__content > div > div > div > div.content__body > div:nth-child(3) > div.content__pagination > ul > li.paginator__item.paginator__item--next > a > svg';
            const nextButton = await page.$(nextButtonSelector);

            const text = await page.$eval(
                '.product-cut__title-link',
                (el: Element): string | null => el.textContent,
            );
            if (nextButton && text?.includes(model)) {
                await page.click(nextButtonSelector);
            } else {
                logger.info('The operation was completed successfully in site1.js');
                await browser.close();
                break;
            }
        }
    }
}

export const nike = new Nike();
