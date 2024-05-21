/* eslint-disable no-prototype-builtins */
import puppeteer from 'puppeteer';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { CHECK_AVAILABILITY_SHOES, FILTER_BUTTON, ICON_SEARCH, IMAGE, LINK, LIST_GENDERS, NEXT_BUTTON, NOT_FOUND_MODEL, OPERATION_HAS_BEEN_SUCCESSFUL, PRICE, PRICE_NEW, PRICE_OLD, RESULT_BUTTON, SALE_BUTTON, SEARCH_STRING, SELECT_SHOES, URL } from '../constants/site7.js';
import { GENDER_MAP } from '../constants/site7.js';
import { GENDER_SELECTORS } from '../constants/site7.js';
import { OPEN_CATEGORY_FILTER } from '../constants/site7.js';
import { OPEN_GENDER_FILTER } from '../constants/site7.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';


class MegaSport implements ScraperInterface {
   
    async parse(userData: FindModelDto): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':7';
        
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
            waitUntil: 'domcontentloaded'
        });
        
        await wait(1000);
        
        const saleButton = await page.$(SALE_BUTTON);
        
        if (saleButton) page.click(SALE_BUTTON);
        
        await wait(2000);
        
        await page.click(ICON_SEARCH);
        
        await wait(1000);
        
        await page.type(SEARCH_STRING, userData.model);
        
        await page.keyboard.press('Enter');
        
        await wait(3000);
        
        const checkAvailability = await page.$(FILTER_BUTTON);
        
        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        
        }
        
        await page.click(FILTER_BUTTON);
        
        await wait(2000);
      
        await page.click(
            OPEN_CATEGORY_FILTER,
        );
        
        const categoryShoes = await page.$(CHECK_AVAILABILITY_SHOES);
        
        const text = await categoryShoes?.evaluate(
            (category) => category.textContent?.slice(0, 6),
        );
   
        if (text === 'Взуття') {
            
            await page.click(SELECT_SHOES);
            await wait(1000);
           
        } else {
            
            await browser.close();
            return null;
        
        }
        
        await page.click(OPEN_GENDER_FILTER);
        
        const genders = await page.$$eval(
            LIST_GENDERS,
            (listElements: Element[],GENDER_MAP) => {
    
                return listElements.map(element => {
                    const textContent = element.textContent?.replace(/[^а-яА-Я]/g ,'');
                    
                    if (textContent !== undefined && GENDER_MAP.hasOwnProperty(textContent)) {
                        
                        return GENDER_MAP[textContent];
                    
                    }
                   
                    return null;
                
                }).filter((el) => el !== null);;
            },
            GENDER_MAP
        );
        
        await wait(1000);
        
        const genderIndex = genders.indexOf(userData.gender);
        const gender = userData.gender;

        const actions = GENDER_SELECTORS[gender][genderIndex];
        
        await page.click(actions);
        
        await page.click(RESULT_BUTTON);
        
        await wait(2000);
        
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


                const siteModelName = await productImage.evaluate(
                    (el: Element): string => el.getAttribute('alt')?.toLowerCase().trim() || '',
                );

               
                if (siteModelName.includes(userModelName) ||
                    userModelName.includes(siteModelName)) {
                    
                    const link = await productLink.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const imageElement = await productImage.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
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
                        link: URL + link,
                        price: modelPrice,
                        image: imageElement,
                    };
                    
                    items.push(itemLinks);
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
export const megasport = new MegaSport();
