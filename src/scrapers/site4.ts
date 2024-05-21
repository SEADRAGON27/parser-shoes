import puppeteer from 'puppeteer';
import { FindModelDto  } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { logger } from '../logs/logger.js';
import { CLOSE_BANNER, FILTER_BUTTON, GENDER_SELECTORS, IMAGE, LINK, NEXT_BUTTON, NOT_FOUND_MODEL, OPEN_GENDER_FILTER, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, RESULT_BUTTON, SEARCH_STRING, URL } from '../constants/site4.js';
import { wait } from '../utils/wait.js';
import { dbSetValues, dbSetValue } from '../db/dbSet.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { NOT_FOUND } from '../constants/db.js';

class Adidas implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':4';
        
        const resultG = await dbGetValues(key);
        const productAvailabilityOnTheWebsite = await dbGetValue(key);
        
        if(resultG){
            
            logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
            return resultG;
        
        }
        
        if(productAvailabilityOnTheWebsite) return null;
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.setViewport({ width: 1366, height: 768 });
        
        await page.goto(URL,{
            waitUntil: 'domcontentloaded',
        });
        
        await wait(1000);
        
        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');
        
    
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        const checkAvailability= await page.$(FILTER_BUTTON);
        
        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userData.model);
            await browser.close();
            return null;
        
        }
        
        await page.click(FILTER_BUTTON);
        await page.waitForSelector(FILTER_BUTTON);
        
        await wait(3000);

        const banner = await page.$(CLOSE_BANNER);
        
        if(banner) await page.click(CLOSE_BANNER);
    
        await page.click(OPEN_GENDER_FILTER);
        await page.waitForSelector(OPEN_GENDER_FILTER);
        
        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        
        await wait(2000);
        
        await page.click(RESULT_BUTTON);
        
        await wait(4000);
        
        const items:itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const linkElements = await page.$$(LINK);
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);
            
            for (let i = 0; i < linkElements.length; i++) {
                
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[i];

                const link = await productLink.evaluate(
                    (el: Element): string | null => el.getAttribute('href'),
                );

                const imageElement = await productImage.evaluate(
                    (el: Element): string | null => el.getAttribute('data-srcset'),
                );

                const priceOld = await productPrice.$eval(
                    PRICE_OLD,
                    (el: Element): string | undefined =>
                        el.textContent?.replace(/\D/g, ''),
                );
                
                const priceNew = await productPrice.$(PRICE_NEW);
                
                let modelPrice: string | undefined = '';
                
                if (priceNew === null) {
                    
                    modelPrice = priceOld;
                
                } else {
                    
                    modelPrice = await priceNew.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                
                }

                const itemLinks: itemLinks = {
                    link: URL + link,
                    price: modelPrice,
                    image: imageElement,
                };
                
                items.push(itemLinks);
            
            }
            
            const nextButton = await page.$(NEXT_BUTTON);
            
            if (nextButton) {
                
                await page.click(NEXT_BUTTON);
                
            } else {
                
                await browser.close();
                break;
            
            }
        }
        
        const resultS = await dbSetValues(key,items);
       
        logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
        
        return resultS;
    }
}

export const adidas = new Adidas();

