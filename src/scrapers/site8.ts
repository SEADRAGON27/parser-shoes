import puppeteer from 'puppeteer';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { ALLOW_COOKIES, ALL_BRANDS, BRAND_AVAILABILITY, CATEGORY_SHOES, CHECK_PRODUCT,  CLOSE_SALE_BANNER,  FILTER_BUTTON, GENDER_SELECTORS, GET_LINK, GET_MODEL_NAME, IMAGE, LINK,  MENU, NEXT_BUTTON, NOT_FOUND_MODEL, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, PRODUCT_AVAILABILITY, RESULT_BUTTON, SEARCH_STRING, SELECT_BRAND, SELECT_BRANDS, SUBMIT_BUTTON, URL} from '../constants/site8.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';

class Intertop implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':8';
        
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
        
        await page.goto(URL, {
            waitUntil: 'domcontentloaded',
        });
        
        await wait(1000);

        const genderFilter = GENDER_SELECTORS[userData.gender];
        page.click(genderFilter);
        
        await wait(1000);
        
        await page.click(MENU);
        
        await wait(1000);
        
        await page.click(CATEGORY_SHOES);
        
        await wait(1000);
        
        await page.click(ALL_BRANDS);
        
        await wait(2000);
        
        await page.click(FILTER_BUTTON);
        
        await wait(1000);
        
        await page.click(SELECT_BRANDS);
        
        await page.type(SEARCH_STRING,userData.model.split(' ')[0]);
        
        await wait(3000);

        const checkAvailability = await page.$(BRAND_AVAILABILITY);

        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        
        }

        await page.click(
            SELECT_BRAND,
        );
        
        await wait(2000);
        
        await page.click(SUBMIT_BUTTON);
        
        await wait(1000);

        await page.click(RESULT_BUTTON);
        
        await wait(4000);
        
        await page.click(ALLOW_COOKIES);
        
        const saleBanner = await page.$(CLOSE_SALE_BANNER);
        
        if(saleBanner)  await page.$(CLOSE_SALE_BANNER);
        
        
        const items: itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const linkElements = await page.$$(LINK);
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);

            const availabilityOfproducts = await page.$$(CHECK_PRODUCT);

            for (let i = 0; i < linkElements.length; i++) {
                    
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[i];
                const availabilityOfproduct = availabilityOfproducts[i];
                    
                const modelName = await productLink.$(GET_MODEL_NAME);

                  
                if (!modelName) {
                        
                    await browser.close();
                    return null;
                    
                }
                    
                const siteModelName = await modelName?.evaluate((el: Element): string => el.textContent?.toLowerCase().trim() || '');
                
                const checkAvaliability = await availabilityOfproduct.$(
                    PRODUCT_AVAILABILITY,
                );

                if ((siteModelName.includes(userModelName) ||
                    userModelName.includes(siteModelName)) && 
                    !checkAvaliability) {
                        
                    const link = await productLink.$eval(
                        GET_LINK,
                        (el: Element): string | null =>
                            el.getAttribute('href'),
                    );

                    const image = await productImage.evaluate(
                        (el: Element): string | null =>
                            el.getAttribute('src'),
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
                            
                        modelPrice = await priceNew.evaluate(
                            (el: Element): string | undefined =>
                                el.textContent?.replace(/\D/g, ''),
                        );
                    }

                    const itemLinks: itemLinks = {
                        link: link,
                        price: modelPrice,
                        image: image,
                    };
                    
                    items.push(itemLinks);
                }
            }

            const nextButton = await page.$(NEXT_BUTTON);
            const productAvailability = await page.$(PRODUCT_AVAILABILITY);
            
            if (nextButton && !productAvailability) {
                
                if(saleBanner) await page.$(CLOSE_SALE_BANNER);
                
                await wait(1500);
                
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

export const intertop = new Intertop();

