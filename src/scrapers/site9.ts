/* eslint-disable no-prototype-builtins */
import puppeteer from 'puppeteer';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { FILTER_BUTTON, GENDER_MAP, GENDER_SELECTORS, ITEMS, LIST_GENDERS, SEARCH_STRING, URL,OPEN_GENDER_FILTER, CLOSE_COOKIE, SUBMIT_BUTTON, RESULT_BUTTON, LINK, PRICE, IMAGE, PRODUCT_AVAILABILITY, PRICE_OLD, PRICE_NEW, NEXT_BUTTON, AVAILABILITY, OPERATION_HAS_BEEN_SUCCESSFUL, NOT_FOUND_MODEL, SHOP_AVAILAIBLE } from '../constants/site9.js';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';

class Intersport implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':9';
        
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
            waitUntil: 'domcontentloaded'
        });
        
        await wait(2000);
        
        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');
        
        await wait(6000);
        
        const filterButton = page.$(FILTER_BUTTON);
        
        const items = await page.$$(ITEMS);
        
        const checkAvailability = await page.$$eval(
            SHOP_AVAILAIBLE,
            (elements: Element[]) => {
                
                return elements.map((element: Element): string | undefined => {
                    
                    if (element.textContent !== null) {
                        
                        return element.textContent;
                    }
                });
            },
        );
       
        if (items.length == checkAvailability.length || !filterButton) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userData.model);
            await browser.close();
            return null;
        
        }

        await page.click(FILTER_BUTTON);
        
        await wait(4000);
        
        await page.click(OPEN_GENDER_FILTER);

        const genders = await page.$$eval(
            LIST_GENDERS,
            (listElements: Element[],GENDER_MAP) => {
    
                return listElements.map(element => {
                    const textContent = element.textContent;
                    
                    if (textContent !== null && GENDER_MAP.hasOwnProperty(textContent)) {
                        
                        return GENDER_MAP[textContent];
                    
                    }
                
                    return null;
                
                }).filter((el) => el !== null);
            },
            GENDER_MAP
        );
             

        const genderFilter = GENDER_SELECTORS[userData.gender];
        
        if (genderFilter && genders.includes(userData.gender)) {
            
            await page.click(genderFilter);
        
        }else{
            
            await browser.close();
            return null;
        
        }
        
        await page.click(CLOSE_COOKIE);
        
        await page.click(SUBMIT_BUTTON);
        
        await page.click(RESULT_BUTTON);
        
        await wait(6000);
        
        const itemS:itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const linkElements = await page.$$(LINK);
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);
            const productsAvailability = await page.$$(PRODUCT_AVAILABILITY);

            for (let i = 0; i < linkElements.length; i++) {
                
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[i];
                const productAvailability = productsAvailability[i];
                
                if (productAvailability!== undefined) {
                    
                    const link = await productLink.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const imageElement = await productImage.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
                    );

                    const priceOld = await productPrice.$(PRICE_OLD);
                    const priceNew = await productPrice.$(PRICE_NEW);
                    
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
                    
                    const itemLinks: itemLinks = {
                        link: URL + link,
                        price: priceModel,
                        image: imageElement,
                    };
                    
                    itemS.push(itemLinks);
                }
            }
            
            const nextButton = await page.$(NEXT_BUTTON);
            
            const text = await page.$(AVAILABILITY);

            if (nextButton && text !== undefined) {
                
                await page.click(NEXT_BUTTON);
            
            } else {
                
                await browser.close();
                break;
            
            }
        }
        
        const resultS = await dbSetValues(key,itemS);
       
        logger.info(OPERATION_HAS_BEEN_SUCCESSFUL);
        
        return resultS;
    }
}

export const intersport = new Intersport();
