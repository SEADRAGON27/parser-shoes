import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class Answear implements IScraperInterface {
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('https://answear.ua', {
            waitUntil: 'domcontentloaded',
        });
        await wait(2000);
        await page.click('.CookiesInfo__cookiesInfoBtnWrapperAccept__nyIJU');
        switch (userData.category) {
        case 'man':
            await page.click('.grid-row figure:nth-child(2)');
            break;
        case 'woman':
            await page.click('.grid-row figure:nth-child(1)');
            break;
        case 'child':
            await page.click('.grid-row figure:nth-child(3)');
        }
        await wait(1000);
        await page.type('input[type="text"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(5000);
        const filterButton = await page.$('.multiTheme-icon-settings');
        
        if (!filterButton) {
            logger.info(`Not found ${userData.model} in site6.js`);
            await browser.close();
            return;
        }
        
        await page.click('.multiTheme-icon-settings');
        await wait(1000);
        await page.click(
            'body > div.MobileFiltersContent__mobileFilters__-c3pD > div.MobileFiltersContent__filtersContent__cIrnB > ul > li:nth-child(3)',
        );
        await wait(1000);
        await page.click('[for="90_radio_0"]');
        await wait(1000);
        await page.click('.btn--filtersSubmit');
        await wait(1000);
        await page.click(
            'body > div.MobileFiltersContent__mobileFilters__-c3pD > div.MobileFiltersContent__filtersContent__cIrnB > div > button',
        );
        const categoryShoes = await page.$('[for="90_radio_0"]');
        
        if (categoryShoes) {
            await page.click('[for="90_radio_0"]');
            await page.click('.btn--filtersSubmit');
            await page.click('.btn--primary');
        } else {
            await page.click('.Icon__icon-cross__2BDeD');
        }

        await wait(2000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$(
                '.ProductItem__productCardImageWrapper__8Is-g a:nth-child(3)',
            );
            const priceElements = await page.$$('.Price__wrapperMain__sjWJK');
            const images = await page.$$('.Image__cardImage__xvgs1 img');

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];

                const text = await image.evaluate(
                    (el: Element) => el.getAttribute('alt')?.toLowerCase(),
                );

                const model = userData.model.toLowerCase();
                let modelIndex = 0;
                if (text) {
                    for (const char of text) {
                        if (
                            modelIndex < model.length &&
                            char === model[modelIndex]
                        ) {
                            modelIndex++;
                        }
                    }
                }

                let modelName = false;
                modelIndex === model.length ? (modelName = true) : '';

                if (modelName) {
                    const link = await element.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const imageElement = await image.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
                    );

                    const priceOld = await priceElement?.$(
                        '.ProductItemPrice__priceRegularWithSale__FChUZ',
                    );

                    const priceNew = await priceElement?.$(
                        '.ProductItemPrice__priceSale__PueP7',
                    );
                    let priceModel: string | undefined = '';
                    if (priceNew === null) {
                        priceModel = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    } else {
                        priceModel = await priceNew?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }

                    itemsLinks = {
                        link: 'https://answear.ua' + link,
                        price: priceModel,
                        image: imageElement,
                    };
                    await file('write', itemsLinks);
                }
            }
            const nextButton = await page.$(
                '.ProductsPagination__paginationNext__8I870',
            );

            if (nextButton) {
                await page.click('.ProductsPagination__paginationNext__8I870');
            } else {
                logger.info('The operation was completed successfully in site6.js');
                await browser.close();
                break;
            }
        }
    }
}
export const answear = new Answear();
