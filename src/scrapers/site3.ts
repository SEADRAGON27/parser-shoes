/* eslint-disable no-prototype-builtins */
/* eslint-disable no-case-declarations */
import puppeteer from 'puppeteer';
import { FindModelDto  } from '../utils/interfaces/userDTO.interface.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ScraperInterface } from '../utils/interfaces/siteScraper.interface.js';
import { wait } from '../utils/wait.js';
import { logger } from '../logs/logger.js';
import { FILTER_BUTTON,GENDER_MAP,GENDER_SELECTORS,ICON_SEARCH,IMAGE,LINK,LIST_GENDERS,MODEL_NAME,NEXT_BUTTON,NOT_FOUND_MODEL,OPEN_GENDER_FILTER,PRICE,PRICE_NEW,RESULT_BUTTON,SEARCH_STRING,URL,OPERATION_HAS_BEEN_SUCCESSFUL} from '../constants/site3.js';
import { dbSetValues, dbSetValue } from '../db/dbSet.js';
import { dbGetValue, dbGetValues } from '../db/dbGet.js';
import { NOT_FOUND } from '../constants/db.js';

class MdFashion implements ScraperInterface {
    
    async parse(userData: FindModelDto ): Promise<itemLinks[] | null> {
        
        const key = userData.model + ':3';
        
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

        await wait(2000);

        await page.click(ICON_SEARCH);
        await page.waitForSelector(ICON_SEARCH);

        await page.type(SEARCH_STRING, userData.model);
        await page.keyboard.press('Enter');

        await page.waitForNavigation({ waitUntil: 'networkidle0' });

        const checkAvailability = await page.$(FILTER_BUTTON);

        if (!checkAvailability) {
            
            await dbSetValue(key,NOT_FOUND);
            logger.info(NOT_FOUND_MODEL + userModelName);
            await browser.close();
            return null;
        
        }

        page.click(FILTER_BUTTON);

        await wait(1000);

        await page.click(OPEN_GENDER_FILTER);
        await page.waitForSelector(OPEN_GENDER_FILTER);

        const genders = await page.$$eval(
            LIST_GENDERS,
            
            (listElements: Element[], GENDER_MAP) => {
                
                return listElements
                    .map((element) => {
                        const textContent = element.textContent;

                        if (textContent !== null && GENDER_MAP.hasOwnProperty(textContent)) {
                            
                            return GENDER_MAP[textContent];
                        
                        }
                        
                        return null;
                    
                    }).filter((el) => el !== null);
            },
            GENDER_MAP,
        );
        
        await wait(1000);

        const gendersLength = genders?.length;
        const gender = userData.gender;

        const actions = GENDER_SELECTORS[gender][gendersLength];

        if (Array.isArray(actions)) {
            
            for (const action of actions) {
                await page?.click(action);
            }
        
        } else {
            
            await page?.click(actions);
        
        }

        await wait(1000);

        await page?.click(RESULT_BUTTON);

        await page.waitForNavigation({ waitUntil: 'networkidle0' });
        
        const items: itemLinks[] = [];
        // eslint-disable-next-line no-constant-condition
        while (true) {
            
            const modelNameElements = await page.$$(MODEL_NAME);
            const linkElements = await page.$$(LINK);
            const priceElements = await page.$$(PRICE);
            const imageElements = await page.$$(IMAGE);

            for (let i = 0; i < linkElements.length; i++) {
                
                const modelName = modelNameElements[i];
                const productLink = linkElements[i];
                const productPrice = priceElements[i];
                const productImage = imageElements[i];

                const siteModelName = await modelName.evaluate(
                    (el: Element): string => el.textContent?.toLowerCase().trim() || '',
                );
               
                const matching = userModelName.split(' ').every(word => siteModelName.split(' ').includes(word));
                
                if (matching) {
                   
                    const link = await productLink.evaluate(
                        (el: Element): string | null => el.getAttribute('href'),
                    );

                    const image = await productImage.evaluate(
                        (el: Element): string | null => el.getAttribute('src'),
                    );

                    const priceOld = await productPrice.evaluate(
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
                        link: link,
                        price: modelPrice,
                        image: image,
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

export const mdFashion = new MdFashion();

