/*import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
/*class Modivo implements IScraperInterface {
    constructor() {}
    async parse( 
        
        userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://modivo.ua', { waitUntil: 'load' });

        await wait(4000);
        await page.click('.buttons button:nth-child(1)');
        await wait(1000);
        await page.click('.search-icon');
        await wait(1000);
        await page.type('input[type="text"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(4000);
        const filter = await page.$('.navigation-tree li:nth-child(1)');
        if (filter === null) {
            await browser.close();
            return;
        }
        switch (userData.category) {
        case 'man':
            await page.click('.navigation-tree li:nth-child(1)');
            await wait(2000);
            await page.click('[data-test-id="10368"]');
            break;
        case 'woman':
            await page.click('.navigation-tree li:nth-child(2)');
            await wait(2000);
            await page.click('[data-test-id="10368"]');
            break;
        case 'child':
            await page.click('.navigation-tree li:nth-child(3)');
            await wait(2000);
            await page.click('[data-test-id="10368"]');
            break;
        }
        await wait(4000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.product-card-link'); // Находим все элементы с классом 'product-cut__title-link'
            const priceElements = await page.$$('.price-container');

            let model = userData.model.replace(
                /\b\w/g,
                (char: string): string => char.toUpperCase(),
            );

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const text = await element.evaluate(
                    (el: Element): string | null => el.getAttribute('title'),
                );

                if (model?.includes('Adidas')) {
                    model =
                        model.charAt(0).toLowerCase() + userData.model.slice(1);
                }

                const checkModel = [...model].every(
                    (char) => text?.includes(char),
                );

                if (checkModel) {
                    const link = await element.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const priceOld = await priceElement.$(
                        '.price:not(.is-sale)',
                    );

                    const priceNew = await priceElement.$('.is-sale');
                    let priceModel: string | undefined = '';
                    if (priceNew === null) {
                        const price = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, '').slice(0, -2),
                        );
                        priceModel = price;
                    } else {
                        priceModel = await priceNew.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, '').slice(0, -2),
                        );
                    }

                    itemsLinks = {
                        link: 'https://modivo.ua' + link,
                        price: priceModel,
                    };
                    await file('write', itemsLinks);
                }
            }
            const nextButton = await page.$('.button-icon s tertiary');
            if (nextButton) {
                await page.click('.button-icon s tertiary');
            } else {
                //await browser.close();
                break;
            }
        }
    }
}

export const modivo = new Modivo();
//modivo.parse({ model: 'new balance 574', category: 'man' });
*/