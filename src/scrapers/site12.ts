import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';

class YesOriginals implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('https://yesoriginal.com.ua',{ 
            waitUntil: 'domcontentloaded'
        });
        await wait(2000);
        await page.click('#searchid > svg');
        await wait(2000);
        await page.type('#search > input', userData.model);
        await page.keyboard.press('Enter');
        await wait(4000);
        const filterButton = page.$('[data-option-id="10021"]');
        
        if (filterButton === null) {
            logger.info(`Not found ${userData.model} in site12.js`);
            await browser.close();
            return;
        }
        
        const categories = await page.$$eval(
            '[data-option-id="10021"]',
            (listElements: Element[]) => {
                const listOfGenders = [];

                for (let i = 0; i < listElements.length; i++) {
                    switch (listElements[i].textContent?.slice(6).trim()) {
                    case 'Чоловіча':
                        listOfGenders.push('man');
                        break;
                    case 'Жіноча':
                        listOfGenders.push('woman');
                        break;
                    case 'Дитяча':
                        listOfGenders.push('child');
                        break;
                    case 'Унісекс':
                        listOfGenders.push('unisex');
                    }
                }
                return listOfGenders;
            },
        );
        
        switch (userData.category) {
        case 'man':
            switch (categories.indexOf('man')) {
            case 3:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(4)',
                );
                break;
            case 2:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(3)',
                );
                break;
            case 1:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(2)',
                );
                break;
            case 0:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(1)',
                );
                break;
            case -1:
                break;
            }
            break;
        case 'woman':
            switch (categories.indexOf('woman')) {
            case 1:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(2)',
                );
                break;
            case 0:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(1)',
                );
                break;
            case -1:
                break;
            }
            break;
        case 'child':
            switch (categories.indexOf('child')) {
            case 0:
                await page.click(
                    '[id="option-values-10021"] label:nth-child(1)',
                );
                break;
            case -1:
                break;
            }
            break;
        }
        await wait(7000);
        await page.click('.popover-content button:nth-child(1)');
        await wait(3000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.caption');
            const images = await page.$$('.image a img');
            
            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const image = images[i];

                const link = await element.$eval(
                    'a',
                    (el: Element): string | null => el.getAttribute('href'),
                );

                const imageElement = await image.evaluate(
                    (el: Element): string | null => el.getAttribute('src'),
                );

                let priceModel: string | undefined = '';
                const priceOldElement = await element.$('.price-old');
                const priceNewElement = await element.$('.price-new');

                if (priceNewElement) {
                    priceModel = await priceNewElement.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                } else if (priceOldElement) {
                    priceModel = await priceOldElement.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                } else {
                    const priceElement = await element.$('.price');
                    if (priceElement) {
                        priceModel = await priceElement.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }
                }

                itemsLinks = {
                    link: link,
                    price: priceModel,
                    image: imageElement,
                };

                await file('write', itemsLinks);
            }

            const nextButton = await page.$(
                '#content > div:nth-child(5) > div > ul > li:nth-child(8) > a',
            );
            if (nextButton) {
                await page.click(
                    '#content > div:nth-child(5) > div > ul > li:nth-child(8) > a',
                );
            } else {
                logger.info('The operation was completed successfully in site12.js');
                await browser.close();
                break;
            }
        }
    }
}

export const yesOriginals = new YesOriginals();
