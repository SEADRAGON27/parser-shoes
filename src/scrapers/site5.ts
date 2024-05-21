import puppeteer from 'puppeteer';
import {  FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { ALLOW_COOKIES, APPLY_FILTER, CLOSE_SALE_BANNER, FILTER_BUTTON, GENDER_SELECTORS, IMAGE, LINK, NEXT_BUTTON, NOT_FOUND_MODEL, OPEN_CATEGORY_FILTER, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, RESULT_BUTTON, SEARCH_STRING, SELECT_CATEGORY, URL} from '../constants/site5.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';

class Answear implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':5';
        
        const resultG = await dbGetValues(key);
        const productAvailabilityOnTheWebsite = await dbGetValue(key);
        
        if(resultG){
            
            logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
            return resultG;
        
        }
        
        if(productAvailabilityOnTheWebsite) return null;
        
        const browser = await puppeteer.launch({ headless: true });

        const page = await browser.newPage();

        await page.goto(URL, {
            waitUntil: 'domcontentloaded',
        });

        await wait(3000);
       
        await page.click(ALLOW_COOKIES);

        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        

        await wait(3000);

        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');

        await wait(5000);

        const checkAvailability = await page.$(FILTER_BUTTON);

        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userData.model);
            await browser.close();
            return null;
        
        }
        
        const closeBanner =await page.$(CLOSE_SALE_BANNER);
        
        if(closeBanner){
            await page.click(CLOSE_SALE_BANNER);
        }
        
        await wait(1000);
        
        await page.click(FILTER_BUTTON);
        
        await wait(1000);
       
        await page.click(OPEN_CATEGORY_FILTER);

        await wait(1000);

        const categoryShoes = await page.$(SELECT_CATEGORY);
        
        if (categoryShoes) {
            
            await page.click(SELECT_CATEGORY);
            
            await wait(1000);
            
            await page.click(APPLY_FILTER);
            
            await wait(2000);
            
            await page.click(RESULT_BUTTON);
        
        } else {
            
            await browser.close();
            return null;
        }

       
        await wait(3000);
        
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

                const image = await productImage.evaluate(
                    (el: Element): string | null => el.getAttribute('srcset'),
                );

                const priceOld = await productPrice?.$(PRICE_OLD);
                const priceNew = await productPrice?.$(PRICE_NEW);
                    
                let modelPrice: string | undefined = '';
                    
                if (priceNew === null) {
                    
                    modelPrice = await priceOld?.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                
                } else {
                    
                    modelPrice = await priceNew?.evaluate(
                        (el: Element): string | undefined =>
                            el.textContent?.replace(/\D/g, ''),
                    );
                
                }
                
                const imageMod = image?.split(/\s1x,/)[0];
                const itemLinks: itemLinks = {
                    link: URL + link,
                    price: modelPrice,
                    image: imageMod,
                };
                
                items.push(itemLinks);
            }
        
            
            const nextButton = await page.$(
                NEXT_BUTTON,
            );

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

export const answear = new Answear();
