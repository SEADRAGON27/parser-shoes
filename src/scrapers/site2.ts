/* eslint-disable no-case-declarations */
import puppeteer from 'puppeteer';
import { FindModelDto  } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { CLOSE_CATEGORY_FILTER, FILTER_BUTTON, GENDER_SELECTORS, IMAGE, LINK,  MODEL_NAME, NEXT_BUTTON, NOT_FOUND_MODEL, OPEN_GENDER_FILTER, PRICE, PRICE_NEW, PRICE_OLD, RESULT_BUTTON, SEARCH_STRING, URL,OPERATION_HAS_BEEN_SUCCESSFUL} from '../constants/site2.js';
import { dbSetValues, dbSetValue } from '../db/dbSet.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';

class NewBalance implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':2';
        
        const resultG = await dbGetValues(key);
        const productAvailabilityOnTheWebsite = await dbGetValue(key);
        
        if(resultG){
            
            logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
            return resultG;
        
        }
        
        if(productAvailabilityOnTheWebsite) return null;
        
        const userModelName = userData.model.toLowerCase().trim();
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.goto(URL,{
            waitUntil: 'domcontentloaded'
        });
        
        await wait(2000);
        
        await page.type(SEARCH_STRING, userData.model);
        
        await page.keyboard.press('Enter');
        
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
       
        const checkAvailability = await page.$(FILTER_BUTTON);
        
        if (!checkAvailability) {
            
            await dbSetValue(key,'not found model');
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        
        }
        
        await page.click(FILTER_BUTTON);
        await wait(1000);
       
        await page.click(CLOSE_CATEGORY_FILTER);
        await wait(1000);
     
        await page.click(OPEN_GENDER_FILTER);
        await wait(1000);
       
        
        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        
        await wait(1000);
        await page.click(RESULT_BUTTON);
        
        await wait(3000);
       
        const items: itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const linkElements = await page.$$(LINK); 
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);

            for (let i = 0; i < linkElements.length; i++) {
                
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[i];

                const siteModelName = await productLink.evaluate(
                    (el: Element): string  =>
                        el.textContent?.toLowerCase().trim() || '',
                );
                
                if (siteModelName.includes(userModelName) ||
                    userModelName.includes(siteModelName)) {
                    
                    const link = await productLink.evaluate(
                        (el: Element): string => (el as HTMLAnchorElement).href,
                    );

                    const image = await productImage.evaluate(
                        (el: Element): string | null =>
                            el.getAttribute('data-srcset'),
                    );

                    const priceOld = await productPrice.$eval(
                        PRICE_OLD,
                        (el: Element) => el.textContent?.replace(/\D/g, ''),
                    );
                    
                    const priceNew = await productPrice.$(
                        PRICE_NEW,
                    );

                    let modelPrice: string | undefined = '';
                    
                    if (priceNew === null) {
                        
                        modelPrice = priceOld;
                    
                    } else {
                        
                        modelPrice = await priceNew.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    
                    }

                    const imagMod = image?.split(/\s1x,/)[0];
                    const itemLinks: itemLinks = {
                        link: link,
                        price: modelPrice,
                        image: imagMod,
                    };
                    
                    items.push(itemLinks);
                    
                }
            }
            
         
            const nextButton = await page.$(NEXT_BUTTON);
            
            const text = await page.$$eval(
                MODEL_NAME,
                (elements) => elements.map(element => element.textContent?.trim())
            );
            
            if (nextButton && text?.includes(userData.model.toLowerCase())) {
                
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
export const newBalance = new NewBalance();

