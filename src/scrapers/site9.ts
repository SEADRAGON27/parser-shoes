import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class Intertop implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://intertop.ua', {
            waitUntil: 'domcontentloaded'
        });
        await wait(1000);
        
        switch (userData.category) {
        case 'man':
            await page.click('.main-intro-container-in div:nth-child(2)');
            break;
        case 'woman':
            await page.click('.main-intro-container-in div:nth-child(1)');
            break;
        case 'child':
            await page.click('.main-intro-container-in div:nth-child(3)');
        }
        await wait(1000);
        await page.click('.mobile-navigation__item');
        await wait(2000);
        await page.click('.top-menu-list li:nth-child(3)');
        await wait(2000);
        await page.click('.menu-part .submenu-head');
        await wait(2000);
        await page.click('.filter-right');
        await wait(2000);
        await page.click('.filters-list li:nth-child(2) .filter-name');
        await page.type(
            '[placeholder="Знайти бренд"]',
            userData.model.split(' ')[0],
        );
        await wait(3000);

        const filterButton = await page.$(
            '#app > div.header-container.catalog-section-container > div > div.catalog-wrap > div.filter-mobile.opened > div.mobile-filter-menu.opened > div.mobile-filter-menu-in > ul > li.filter-select.filter-prop-brands.one-filter.opened > div > ul > li > a > label > span.styled-checkbox.styled-checkbox--v2',
        );
        
        if (!filterButton) {
            logger.info(`Not found ${userData.model} in site9.js`);
            await browser.close();
            return;
        }
        
        await page.click(
            '#app > div.header-container.catalog-section-container > div > div.catalog-wrap > div.filter-mobile.opened > div.mobile-filter-menu.opened > div.mobile-filter-menu-in > ul > li.filter-select.filter-prop-brands.one-filter.opened > div > ul > li > a > label > span.styled-checkbox.styled-checkbox--v2',
        );
        await wait(1000);
        await page.click(
            '#app > div.header-container.catalog-section-container > div > div.catalog-wrap > div.filter-mobile.opened > div.mobile-filter-menu.opened > div.mobile-filter-menu-in > ul > li.filter-select.filter-prop-brands.one-filter.opened > div > ul > div > span',
        );
        await wait(1000);
        await page.click(
            '#app > div.header-container.catalog-section-container > div > div.catalog-wrap > div.filter-mobile.opened > div.mobile-filter-menu.opened > div.root-filter-controls > div > div:nth-child(1) > div',
        );
        await wait(2000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const avaliableItem = await page.$('.not-available-indicator');
            const nextButton = await page.$('.justify-content-center');
            let stopScroling = false;
            if (nextButton && !avaliableItem) {
                await nextButton.click();
            } else {
                const elements = await page.$$('.product-name');
                const priceElements = await page.$$('.product-price');
                const images = await page.$$('.product-thumb img');
                const productsAvaliability = await page.$$('.product-thumb');

                for (let i = 0; i < elements.length; i++) {
                    const element = elements[i];
                    const priceElement = priceElements[i];
                    const image = images[i];
                    const productAvaliability = productsAvaliability[i];
                    const elemenT = await element.$('a div:nth-child(1)');

                    if (!elemenT) {
                        await browser.close();
                        return;
                    }

                    const text = await elemenT.evaluate(
                        (el: Element): string | null => el.textContent,
                    );

                    const checkAvaliability = await productAvaliability.$(
                        '.not-available-indicator',
                    );

                    if (
                        text
                            ?.toLowerCase()
                            ?.includes(userData.model.toLowerCase()) &&
                        !checkAvaliability
                    ) {
                        const link = await element.$eval(
                            '.product-name a',
                            (el: Element): string | null =>
                                el.getAttribute('href'),
                        );

                        const imageElement = await image.evaluate(
                            (el: Element): string | null =>
                                el.getAttribute('src'),
                        );

                        const priceOld = await priceElement.$('.current-price');

                        const priceNew = await priceElement.$('.action_price');
                        let priceModel: string | undefined = '';
                        if (priceNew === null) {
                            priceModel = await priceOld?.evaluate(
                                (el: Element): string | undefined =>
                                    el.textContent?.replace(/\D/g, ''),
                            );
                        } else {
                            priceModel = await priceNew.evaluate(
                                (el: Element): string | undefined =>
                                    el.textContent?.replace(/\D/g, ''),
                            );
                        }

                        itemsLinks = {
                            link: link,
                            price: priceModel,
                            image: imageElement,
                        };

                        await file('write', itemsLinks);
                    }
                }

                stopScroling = true;
            }

            if (stopScroling === true) {
                logger.info('The operation was completed successfully in site9.js');
                browser.close();
                break;
            }
        }
    }
}

export const intertop = new Intertop();
