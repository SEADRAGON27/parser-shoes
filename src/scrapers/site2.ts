/* eslint-disable no-case-declarations */
import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
class NewBalance implements IScraperInterface {
  async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://www.newbalance.ua',{
            waitUntil: 'domcontentloaded'
        });
        await page.type('[type="search"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(3000);
        const filterButton = await page.$('.icon-filters');
        
        if (!filterButton) {
            logger.info(`Not found ${userData.model} in site2.js`);
            await browser.close();
            return;
        }
        
        await page.click('.icon-filters');
        await wait(1000);
        await page.click('i.accordion-form__icon');
        await wait(1000);
        await page.click('[data-column-id="gender"] .accordion-form__icon');
        await wait(1000);
        switch (userData.category) {
        case 'man':
            await page.click('[for="gender1"]');
            await wait(1000);
            await page.click('.action-buttons__item_submit');
            break;
        case 'woman':
            await page.click('[for="gender2"]');
            await wait(1000);
            await page.click('.action-buttons__item_submit');
            break;
        case 'child':
            await page.click('[for="gender5"]');
            await wait(1000);
            await page.click('.action-buttons__item_submit');
            break;
        }
        await wait(3000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.products__link'); // Находим все элементы с классом 'product-cut__title-link'
            const priceElements = await page.$$('.prices');
            const images = await page.$$(
                '.product-item__image picture source:nth-child(1)',
            );

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];

                const text = await element.evaluate(
                    (el: Element): string | undefined =>
                        el.textContent?.toLowerCase(),
                );

                if (text?.includes(userData.model.toLowerCase())) {
                    const link = await element.evaluate(
                        (el: Element): string => (el as HTMLAnchorElement).href,
                    );

                    const imageElement = await image.evaluate(
                        (el: Element): string | null =>
                            el.getAttribute('data-srcset'),
                    );

                    const priceOld = await priceElement.$eval(
                        '.prices__price:not(.prices__price_discount)',
                        (el: Element) => el.textContent?.replace(/\D/g, ''),
                    );
                    const priceNew = await priceElement.$(
                        '.prices__price_discount',
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

                    //const imagE=imageElement?.match(/(.+?)\s1x,/);
                    const imagE = imageElement?.split(/\s1x,/)[0];
                    itemsLinks = {
                        link: link,
                        price: priceModel,
                        image: imagE,
                    };
                    await file('write', itemsLinks);
                }
            }
            const elementSelector =
                '#catalog-list-all > ul > li:nth-child(26) > div.products__hover > a';
            const nextButton = await page.$('.show-more js-show-more');
            const text = await page.$eval(
                elementSelector,
                (el: Element): string | null => el.textContent,
            );
            if (nextButton && text?.includes(userData.model.toLowerCase())) {
                await page.click('.show-more js-show-more');
            } else {
                logger.info('The operation was completed successfully in site2.js');
                await browser.close();
                break;
            }
        }
    }
}
export const newBalance = new NewBalance();
