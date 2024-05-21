import puppeteer from 'puppeteer';
import { FindModelDto } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { logger } from '../logs/logger.js';
import {CATEGORIES,GENDERS,GENDERS_AVAILABILITY,HREF,ICON_SEARCH,IMAGE,LINK,NEXT_BUTTON,NOT_FOUND_MODEL,OPERATION_HAS_BEEN_SUCCESSFUL,PRICE,PRICE_NEW,PRICE_OLD,PRODUCTS_ON_THE_PAGE,SEARCH_STRING,URL,} from '../constants/site6.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { dbSetValue, dbSetValues } from '../db/dbSet.js';
import { NOT_FOUND } from '../constants/db.js';

class DeltaSport implements ScraperInterface {
    
    async parse(userData: FindModelDto): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':6';
        
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

        await page.click(ICON_SEARCH);
        await page.waitForSelector(ICON_SEARCH);

        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const checkAvailability = await page.$(PRODUCTS_ON_THE_PAGE);
        
        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userData.model);
            await browser.close();
            return null;
        
        }

        const userDataMod: Record<string, string> = {};

        userDataMod.gender =
            userData.gender === 'man'
                ? 'Чоловіки'
                : userData.gender === 'woman'
                    ? 'Жінки'
                    : userData.gender === 'child'
                        ? 'Діти'
                        : userData.gender;

        const filterItems = await page.$$eval(
            GENDERS,
            (items) => items.map((item) => item.textContent?.trim()),
        );
        
        const filterIndexGender = filterItems.findIndex(
            (item) => item === userDataMod.gender,
        );
        
        if (filterIndexGender !== -1) {
            
            const filterGenders = await page.$$(GENDERS_AVAILABILITY);
            const genderItem = filterGenders[filterIndexGender];
            
            const categories = await genderItem.$$eval(
                CATEGORIES,
                (items) => items.map((item) => item.textContent?.trim()),
            );

            const categoriesMod = categories.map((item) => {
                const word = item?.trim().split(/\s+/)[0];
                return word;
            });

            const categorySneakersIndex = categoriesMod.findIndex(
                (item) => item == 'Кросівки',
            );
           
            const filterCategories = await genderItem.$$(
                CATEGORIES,
            );
            
            const categorySneakers = filterCategories[categorySneakersIndex];

            const href = await categorySneakers.$(HREF);
            await href?.click();
        }

        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
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
                    image: URL + image,
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

export const deltasport = new DeltaSport();

