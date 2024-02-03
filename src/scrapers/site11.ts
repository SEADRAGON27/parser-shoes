import puppeteer from 'puppeteer';
import { userDTO } from '../utils/userDTO.interface.js';
import { itemsLinks } from '../utils/itemsLinks.interface.js';
import { file } from '../data/file.js';
import { IScraperInterface } from '../utils/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
class PRM implements IScraperInterface {
    constructor() {}
    async parse(userData: userDTO) {
        let itemsLinks: itemsLinks;
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        await page.goto('https://prm.com/ua', { waitUntil: 'load' });
        
        await wait(1000);
        await page.click('.CookiesInfo__cookiesInfoBtnWrapperAccept__nyIJU');
        switch (userData.category) {
        case 'man':
            await page.click('.grid-row figure:nth-child(2)');
            break;
        case 'woman':
            await page.click('.grid-row figure:nth-child(1)');
            break;
        }

        await wait(3000);
        await page.type('[type="text"]', userData.model);
        await page.keyboard.press('Enter');
        await wait(3000);

        const checkAvaliable = await page.$(
            '.ProductItem__productCard__8ivfZ div:nth-child(1) a',
        );

        if (checkAvaliable === null) {
            await browser.close();
            return;
        }
        // eslint-disable-next-line no-constant-condition, no-useless-escape
       
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const elements = await page.$$(
                '.ProductItem__productCard__8ivfZ div:nth-child(1) a',
            );
            const priceElements = await page.$$('.notranslate');
            const images = await page.$$('.Image__cardImage__xvgs1 img');
            
            for (let i = 0; i < elements.length-1; i++) {
                const element = elements[i];
                const priceElement = priceElements[i];
                const image = images[i];
                
                const imageElement = await image?.evaluate(
                    (el: Element): string | null => el.getAttribute('src'),
                );
                    
                const link = await element?.evaluate(
                    (el: Element): string | null => el.getAttribute('href'),
                );

                const priceOld = await priceElement?.$(
                    '.ProductItemPrice__priceRegular__KkofN',
                );

                const priceNew = await priceElement?.$(
                    '.ProductItemPrice__priceSale__zVVVx',
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
                    link: 'https://prm.com' + link,
                    price: priceModel,
                    image:imageElement
                };
                await file('write', itemsLinks);
                
            }
            
            const nextButton = await page.$(
                '.SVGInline ProductsPagination__chevronRight__czML3',
            );
            if (nextButton) {
                await page.click(
                    '.SVGInline ProductsPagination__chevronRight__czML3',
                );
            } else {
                await browser.close();
                break;
            }
        }
    }
}
export const prm = new PRM();
