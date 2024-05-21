import { HandlerIterface } from './interfaces/handler.interface.js';
import { FindModelDto } from './interfaces/userDTO.interface.js';
import { nike } from '../scrapers/site1.js';
import { newBalance } from '../scrapers/site2.js';
import { adidas } from '../scrapers/site4.js';
import { mdFashion } from '../scrapers/site3.js';
import { answear } from '../scrapers/site5.js';
import { deltasport } from '../scrapers/site6.js';
import { megasport } from '../scrapers/site7.js';
import { intertop } from '../scrapers/site8.js';
import { intersport } from '../scrapers/site9.js';
import { prm } from '../scrapers/site10.js';
import { ScraperInterface } from './interfaces/siteScraper.interface.js';
import { itemLinks } from './interfaces/itemsLinks.interface.js';

export class Handler implements HandlerIterface {
    
    private sites: ScraperInterface[] = [];

    constructor(sites: ScraperInterface[]) {
        this.sites = sites;
    }

    async parseAll(userData: FindModelDto): Promise<itemLinks[] | null> {
        
        const data = await Promise.all([
            this.sites[0].parse(userData),
            this.sites[1].parse(userData),
            this.sites[2].parse(userData),
            this.sites[3].parse(userData),
            this.sites[4].parse(userData),
            this.sites[5].parse(userData),
            this.sites[6].parse(userData),
            //this.sites[7].parse(userData),
            this.sites[8].parse(userData),
            this.sites[9].parse(userData),
        ]);

        const links = data.flat(2);
        
        const sortPrice = links
            .filter((link): link is itemLinks => link !== null) 
            .sort(
                (a: itemLinks, b: itemLinks): number =>
                    Number(a.price) - Number(b.price),
            );
        
        if(sortPrice.length === 0){
            return null;
        }
        
        const slicedItems: itemLinks[] = sortPrice
            .slice(0, 20)
            .map((el: itemLinks) => ({ ...el, name: userData.model }));
       
        return slicedItems;
    }
}

export const handler = new Handler([nike,newBalance,mdFashion,adidas,answear,deltasport,megasport,intertop,intersport,prm]);


