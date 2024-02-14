/* eslint-disable no-case-declarations */
import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class MdFashion implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://md-fashion.ua', {
            waitUntil: 'domcontentloaded',
        });
        await wait(2000);
        await page.click('.mobile-search');
        await wait(2000);
        await page.type('input[type="search"]', userData.model);
        await page.keyboard.press('Enter');
        await page.waitForSelector('input[type="search"]');
        await wait(3000);
        const filterButton = await page.$('.mobile-filters div:nth-child(1)');
        
        if (filterButton === null) {
            logger.info(`Not found ${userData.model} in site3.js`);
            await browser.close();
            return;
        }
        
        await page.click('.mobile-filters div:nth-child(1)');
        await wait(1000);
        await page.click('.filters-popup div:nth-child(5)');
        await wait(1000);

        const categories = await page.$$eval(
            '.filters__list__link',
            (listElements: Element[]) => {
                const listOfGenders = [];
                for (let i = 0; i < listElements.length; i++) {
                    switch (listElements[i].textContent) {
                    case 'Чоловікам':
                        listOfGenders.push('man');
                        break;
                    case 'Жінкам':
                        listOfGenders.push('woman');
                        break;
                    case 'Хлопчикам':
                        listOfGenders.push('child');
                        break;
                    case 'Дівчаткам':
                        listOfGenders.push('child');
                        break;
                    }
                }
                return listOfGenders;
            },
        );

        await wait(1000);
        switch (userData.category) {
        case 'man':
            switch (categories?.length) {
            case 4:
                await page?.click(
                    '.filters__list__scroll div:nth-child(4)',
                );
                await wait(1000);
                break;
            case 2:
                await page?.click(
                    '.filters__list__scroll div:nth-child(2)',
                );
                await wait(1000);
                break;
            case 1:
                await page?.click(
                    '.filters__list__scroll div:nth-child(1)',
                );
                await wait(1000);
                break;
            }
            await page?.click(
                '.filters-popup__buttons button:nth-child(1)',
            );
            break;
        case 'woman':
            switch (categories?.length) {
            case 4:
                await page?.click(
                    '.filters__list__scroll div:nth-child(2)',
                );
                await wait(1000);
                break;
            case 2:
                await page?.click(
                    '.filters__list__scroll div:nth-child(1)',
                );
                await wait(1000);
                break;
            case 1:
                await page?.click(
                    '.filters__list__scroll div:nth-child(1)',
                );
                await wait(1000);
                break;
            }
            await page?.click(
                '.filters-popup__buttons button:nth-child(1)',
            );
            break;
        case 'child':
            switch (categories?.length) {
            case 4:
                await page?.click(
                    '.filters__list__scroll div:nth-child(1)',
                );
                await page?.click(
                    '.filters__list__scroll div:nth-child(3)',
                );
                await wait(1000);
                break;
            case 2:
                await page?.click(
                    '.filters__list__scroll div:nth-child(1)',
                );
                await page?.click(
                    '.filters__list__scroll div:nth-child(2)',
                );
                await wait(1000);
                break;
            }
            await page?.click(
                '.filters-popup__buttons button:nth-child(1)',
            );
            break;
        }
        await wait(2000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.products-item__link'); // Находим все элементы с классом 'product-cut__title-link'
            const priceElements = await page.$$('.product-info__price');
            const images = await page.$$('.responsive-image picture img');

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];

                const link = await element.evaluate(
                    (el: Element): string | null => el.getAttribute('href'),
                );

                const imageElement = await image.evaluate(
                    (el: Element): string | null => el.getAttribute('src'),
                );

                const priceOld = await priceElement.evaluate(
                    (el: Element): string | undefined =>
                        el.textContent?.replace(/\D/g, ''),
                );
                const priceNew = await priceElement.$(
                    '.product-info__price__text_new',
                );
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
                    link: link,
                    price: priceModel,
                    image: imageElement,
                };
                await file('write', itemsLinks);
            }

            const nextButton = await page.$(
                '.pagination__button btn btn--accent',
            );
            if (nextButton) {
                await page.click('.pagination__button btn btn--accent');
            } else {
                logger.info('The operation was completed successfully in site3.js');
                await browser.close();
                break;
            }
        }
    }
}
export const mdFashion = new MdFashion();
