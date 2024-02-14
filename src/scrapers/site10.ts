import puppeteer from 'puppeteer';
import { userDTO } from '../utils/interfaces/userDTO.interface.js';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';

class Intersport implements IScraperInterface {
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto('https://intersport.ua', {
            waitUntil: 'domcontentloaded'
        });
        await wait(1000);
        await page.type('.searchInput___aZ57Z', userData.model);
        await page.keyboard.press('Enter');
        await wait(4000);
        const filterButton = page.$('.btn___3F1Ek');
        const items = await page.$$('.wrapper___4CoMj');
        const checkAvaliable = await page.$$eval(
            '.shopAvailable___3_rYr span',
            (elements: Element[]) => {
                const texts = elements.map((element: Element) => {
                    if (element.textContent !== null) {
                        return element.textContent;
                    }
                });
                return texts;
            },
        );
        if (items.length == checkAvaliable.length || filterButton === null) {
            logger.info(`Not found ${userData.model} in site10.js`);
            await browser.close();
            return;
        }

        await page.click('.btn___3F1Ek');
        await wait(4000);
        await page.click('.filtersList___2BqIx div:nth-child(4)');

        const categories = await page.$$eval(
            '.checkbox___2KocV label:not(.checkbox_hide___1vP7z label)',
            (listElements: Element[]): string[] => {
                const listOfGenders = [];
                for (let i = 0; i < listElements.length; i++) {
                    switch (listElements[i].textContent) {
                    case 'чоловіча':
                        listOfGenders.push('man');
                        break;
                    case 'жіноча':
                        listOfGenders.push('woman');
                        break;
                    case 'діти':
                        listOfGenders.push('child');
                        break;
                    case 'унісекс':
                        listOfGenders.push('unisex');
                    }
                }
                return listOfGenders;
            },
        );
        await wait(3000);
        switch (userData.category) {
        case 'man':
            if (categories.includes('man')) {
                await page.click(
                    '.filterValuesList___25QWx div:nth-child(6) .checkboxWrapper_small___1fVHV',
                );
                await page.click(
                    '#__next > div.CookieMessage___R6YKh > div > div.buttons___30eld > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div > div.bottom___24gk2 > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div.bottom___24gk2 > button',
                );
            }
            break;
        case 'woman':
            if (categories.includes('woman')) {
                await page.click(
                    '.filterValuesList___25QWx div:nth-child(3) .checkboxWrapper_small___1fVHV',
                );
                await page.click(
                    '#__next > div.CookieMessage___R6YKh > div > div.buttons___30eld > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div > div.bottom___24gk2 > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div.bottom___24gk2 > button',
                );
            }

            break;
        case 'child':
            if (categories.includes('child')) {
                await page.click(
                    '.filterValuesList___25QWx div:nth-child(2) .checkboxWrapper_small___1fVHV',
                );
                await page.click(
                    '#__next > div.CookieMessage___R6YKh > div > div.buttons___30eld > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div > div.bottom___24gk2 > button',
                );
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.subheaderMobile___MhAbC > div.menu___xfr1m > div > div.wrapper___lejhK > div.bottom___24gk2 > button',
                );
            }
            break;
        }

        await wait(4000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.title___36ZSt');
            const priceElements = await page.$$('.prices___eX8Hc');
            const images = await page.$$('.image___lTtOK');
            const avs = await page.$$(
                '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.catalogWrapper___2SPdS > div > div.productsList___3ttMv > div:nth-child(5) > div > div.shopAvailable___3_rYr > span',
            );

            for (let i = 0; i < elements.length; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];
                const av = avs[i];
                if (av !== undefined) {
                    const link = await element.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const imageElement = await image.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
                    );

                    const priceOld = await priceElement.$(
                        '.prices___eX8Hc span',
                    );

                    const priceNew = await priceElement.$(
                        '.currentPrice_accent___1s_2W',
                    );
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
                        link: 'https://intersport.ua' + link,
                        price: priceModel,
                        image: imageElement,
                    };
                    await file('write', itemsLinks);
                }
            }
            const nextButton = await page.$(
                '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.catalogWrapper___2SPdS > div > div.more___1kVAz > button',
            );
            const text = await page.$(
                '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.catalogWrapper___2SPdS > div > div.productsList___3ttMv > div:nth-child(8) > div > div.shopAvailable___3_rYr > span',
            );

            if (nextButton && text !== undefined) {
                await page.click(
                    '#__next > div.layout > div.layout__content > div.pageCatalog___1SdQM > div.catalogContainer___3Svjs.container > div > div.catalogWrapper___2SPdS > div > div.more___1kVAz > button',
                );
            } else {
                logger.info('The operation was completed successfully in site10.js');
                await browser.close();
                break;
            }
        }
    }
}

export const intersport = new Intersport();
