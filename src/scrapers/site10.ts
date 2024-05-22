/* eslint-disable quotes */
import puppeteer from 'puppeteer';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { CLOSE_COOKIE, CLOSE_SALE_BANNER, GENDER_SELECTORS, IMAGE, LINK, MODEL_NAME, NEXT_BUTTON, NOT_FOUND_MODEL, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, PRODUCT, SEARCH_STRING, URL } from '../constants/site10.js';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';


class PRM implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':10';
        
        const resultG = await dbGetValues(key);
        const productAvailabilityOnTheWebsite = await dbGetValue(key);
        
        if(resultG){
            
            logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
            return resultG;
        
        }
        
        if(productAvailabilityOnTheWebsite) return null;
        
        if(userData.gender == 'child') return null;
        
        const userModelName = userData.model.toLowerCase().trim();
        
        const browser = await puppeteer.launch({ headless: true });
        
        const page = await browser.newPage();
        
        await page.goto(URL,{
            waitUntil: 'domcontentloaded'
        });
        
        await wait(4000);
        
        await page.click(CLOSE_COOKIE);
        
        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        
        await wait(3000);
        
        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');
        
        await wait(3000);
        
        const saleBanner =await page.$(CLOSE_SALE_BANNER);
        
        if(saleBanner){
            await page.click(CLOSE_SALE_BANNER);
        }
        
        const checkAvailability = await page.$(PRODUCT);

        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        
        }
        
        const items:itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const linkElements = await page.$$(LINK);
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);
            const modelNameElements = await page.$$(MODEL_NAME);
            
            for (let i = 0; i < linkElements.length; i++) {
               
                const productLinks = linkElements[i];
                const productPrices = priceElements[i];
                const productImages = imageElements[i];
                const productName = modelNameElements[i];

                const siteModelName = await productName.evaluate(
                    (el: Element): string  => el.getAttribute('alt')?.toLowerCase().trim() || ''
                );
                
                const matching = userModelName.split(' ').every(word => siteModelName.split(' ').includes(word));
                
                if(matching){
                
                    const image = await productImages?.evaluate(
                        (el: Element): string | null => el.getAttribute('srcset'),
                    );

                    const link = await productLinks?.evaluate(
                        (el: Element): string | undefined =>{
                            const href = el.getAttribute('href');
                            return href?.substring(3);  
                        }
                    );
                
                    const priceOld = await productPrices?.$(PRICE_OLD);
                    const priceNew = await productPrices?.$(PRICE_NEW);
                
                    let productPrice: string | undefined = '';
                
                    if (priceNew === null) {
                        
                        productPrice = await priceOld?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    
                    } else {
                        
                        productPrice = await priceNew?.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    
                    }
                
                    const imageMod = image?.split(/\s1x,/)[0];
                    const itemsLinks: itemLinks = {
                        link: URL + link,
                        price: productPrice,
                        image: imageMod,
                    };
                
                    items.push(itemsLinks);
                }
            
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

export const prm = new PRM();
