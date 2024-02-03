import puppeteer from 'puppeteer';
import { userDTO } from '../utils/userDTO.interface.js';
import { itemsLinks } from '../utils/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
class MegaSport implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://megasport.ua', { waitUntil: 'load' });
        
        await wait(1000);
        const saleButton = await page.$(
            'body > div.pure-modal-backdrop > div > div > svg > path:nth-child(2)',
        );
        if (saleButton !== null) {
            page.click(
                'body > div.pure-modal-backdrop > div > div > svg > path:nth-child(2)',
            );
        }
        await wait(2000);
        await page.click('.gU1QRr');
        await wait(1000);
        await page.type('input[type="search"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(3000);
        const filter = await page.$('.WiOXQg');
        if (filter === null) {
            await browser.close();
            return;
        }
        await page.click('.WiOXQg');
        await wait(1000);
        await page.click(
            '#js--root > main > section > div > div.gMgNGc > div > div.EsEZ4A > div.hUG3It > div:nth-child(2) > button.cK8hAd.T4WwML.V5PAx1.fRUyj7 > div.WUWUnG',
        );
        const shoesCategories = await page.$$('.fSDYfB');
        const shoesCategory = [];
        for (const category of shoesCategories) {
            const res = await category.evaluate(
                (el) => el.textContent?.slice(0, 6),
            );
            shoesCategory.push(res);
        }
        if (shoesCategory.includes('Взуття')) {
            await page.click(
                '#js--root > main > section > div > div.gMgNGc > div > div.EsEZ4A > div.hUG3It > div:nth-child(2) > div > div > div:nth-child(2)',
            );
            await page.click(
                '#js--root > main > section > div > div.gMgNGc > div > div.EsEZ4A > div.hUG3It > div:nth-child(2) > div > div > div.fSDYfB.ajAQxP > div.Yy8vrQ > button',
            );
            await page.click(
                '#js--root > main > section > div > div.gMgNGc > div > div.EsEZ4A > div.hUG3It > div:nth-child(2) > button.cK8hAd.T4WwML.V5PAx1.ajAQxP',
            );
        } else {
            await browser.close();
        }
        await page.click('.hUG3It div:nth-child(3)');
        
        const categories = await page.$$eval(
            '[data-test-id="pickGenderSection"]',
            (listElements: Element[]): string[] => {
                const listOfGenders:string[] = [];
                for (let i = 0; i < listElements.length; i++) {
                    const text=listElements[i].textContent?.replace(/[^а-яА-Я]/g,'');
                    switch (text) {
                    case 'Чоловкам':
                        listOfGenders.push('man');
                        break;
                    case 'Жнкам':
                        listOfGenders.push('woman');
                        break;
                    case 'Дтям':
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
            switch (categories.indexOf('man')) {
            case 0:
                await page?.click('.jqTLpt button:nth-child(2)');
                break;
            case -1:
                break;
            }
            await page.click('.BuVhpF');
            break;
        case 'woman':
            switch (categories.indexOf('woman')) {
            case 1:
                await page?.click('.jqTLpt button:nth-child(3)');
                break;
            case 0:
                await page?.click('.jqTLpt button:nth-child(2)');
                break;
            case -1:
                break;
            }
            await page.click('.BuVhpF');
            break;
        case 'child':
            switch (categories.indexOf('child')) {
            case 2:
                await page?.click('.jqTLpt button:nth-child(4)');
                break;
            case 1:
                await page?.click('.jqTLpt button:nth-child(3)');
                break;
            case 0:
                await page?.click('.jqTLpt button:nth-child(2)');
                break;
            case -1:
                break;
            }
        }
        await wait(2000);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$('.it25hX');
            const priceElements = await page.$$('.loPig4');
            const images = await page.$$('.Wi5B_k img');

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

                    const priceOld = await priceElement.$('.MeSmTt');

                    const priceNew = await priceElement.$('.EGoTsG');
                    let priceModel: string | undefined = '';
                    if (priceNew === null) {
                        priceModel = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    } else {
                        priceModel = await priceElement.$eval(
                            '.MeSmTt',
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }

                    itemsLinks = {
                        link: 'https://megasport.ua' + link,
                        price: priceModel,
                        image: imageElement,
                    };
                    await file('write', itemsLinks);
                }
            }
            const nextButton = await page.$(
                '#js--root > main > section > div > div.gMgNGc > div > div.Fkfp3V > div.zmYnwY > div.qjmBYR > button',
            );
            if (nextButton) {
                await page.click(
                    '#js--root > main > section > div > div.gMgNGc > div > div.Fkfp3V > div.zmYnwY > div.qjmBYR > button',
                );
            } else {
                await browser.close();
                break;
            }
        }
    }
}
export const megasport = new MegaSport();
