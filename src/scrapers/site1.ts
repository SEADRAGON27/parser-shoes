/* eslint-disable quotes */
/* eslint-disable no-constant-condition */
import puppeteer from 'puppeteer';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { logger } from '../logs/logger.js';
import { GENDER_SELECTORS, IMAGE, LINK, MAN_GENDER, MODEL_NAME, NEXT_BUTTON, NOT_FOUND_MODEL, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, SEARCH_STRING, URL} from '../constants/site1.js';
import { dbSetValues, dbSetValue } from '../db/dbSet.js';
import { wait } from '../utils/wait.js';
import { dbGetValues, dbGetValue } from '../db/dbGet.js';
import { NOT_FOUND } from '../constants/db.js';

export class Nike implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':1';
        
        const resultG = await dbGetValues(key);
        const productAvailabilityOnTheWebsite = await dbGetValue(key);
        
        if(resultG){
            
            logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
            return resultG;
        
        }
        
        if(productAvailabilityOnTheWebsite) return null;
        
        const userModelName = userData.model.toLowerCase().trim();
        
        const browser = await puppeteer.launch({ headless: false });
        
        const page = await browser.newPage();
        
        await page.goto(URL, {
            waitUntil: 'domcontentloaded',
        });
      
        await page.type(SEARCH_STRING, userData.model);
        
        await page.keyboard.press('Enter');
        
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        const checkAvailability = await page.$(MAN_GENDER);
        
        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        }
        
        
        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        
        const items: itemLinks[] = [];

        await wait(3000);

        while (true) {
            
            const linkElements = await page.$$(LINK); 
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);

            const model = userData.model.replace(/\b\w/g, (char) =>
                char.toUpperCase(),
            );

            for (let i = 0; i < linkElements.length; i++) {
                
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[5 + i];
                
                const siteModelName = await productLink.evaluate(
                    (el: Element): string => el.textContent?.toLowerCase().trim() || '',
                );
                
                if (siteModelName.includes(userModelName) ||
                    userModelName.includes(siteModelName)) {
                    
                    const image = await productImage.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
                    );
                    
                    
                    const link = await productLink.evaluate(
                        (el: Element): string => (el as HTMLAnchorElement).href,
                    );

                    const priceOld = await productPrice.$(PRICE_OLD);
                    const priceNew = await productPrice.$(PRICE_NEW);
                    
                    let modelPrice: string | undefined = '';
                    
                    if (priceNew === null) {
                        
                        modelPrice = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    
                    } else {
                        
                        modelPrice = await productPrice.$eval(
                            PRICE_OLD,
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    
                    }

                    const itemLinks: itemLinks = {
                        link: link,
                        price: modelPrice,
                        image: URL + image,
                    };
                    
                    items.push(itemLinks);
                   
                }
            }

            const nextButton = await page.$(NEXT_BUTTON);

            const text = await page.$eval(
                MODEL_NAME,
                (el: Element): string | null => el.textContent,
            );
            
            if (nextButton && text?.includes(model)) {
                
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

export const nike = new Nike();

