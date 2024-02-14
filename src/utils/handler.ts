import { IHandlerIterface } from './interfaces/handler.interface.js';
import { userDTO } from './interfaces/userDTO.interface.js';
import { file } from '../data/file.js';
import { nike } from '../scrapers/site1.js';
import { newBalance } from '../scrapers/site2.js';
import { adidas } from '../scrapers/site4.js';
import { mdFashion } from '../scrapers/site3.js';
import { answear } from '../scrapers/site6.js';
import { deltasport } from '../scrapers/site7.js';
import { megasport } from '../scrapers/site8.js';
import { intertop } from '../scrapers/site9.js';
import { intersport } from '../scrapers/site10.js';
import { prm } from '../scrapers/site11.js';
import { yesOriginals } from '../scrapers/site12.js';
import { IScraperInterface } from './interfaces/siteScraper.interface.js';
import { itemsLinks } from './interfaces/itemsLinks.interface.js';

export class Handler implements IHandlerIterface {
    private sites: IScraperInterface[] = [];
    constructor(sites: IScraperInterface[]) {
        this.sites = sites;
    }
    async parseAll(userData: userDTO) {
        
        await Promise.all([
            this.sites[0].parse(userData),
            this.sites[1].parse(userData),
            this.sites[2].parse(userData),
        ]);

        /*await Promise.all([
            this.sites[4].parse(userData),
            this.sites[5].parse(userData),
            this.sites[6].parse(userData),
           
        ]);
        
        await Promise.all([
            this.sites[3].parse(userData),
            this.sites[7].parse(userData),
            this.sites[8].parse(userData)
        ]);
        
        await Promise.all([ 
            this.sites[9].parse(userData), 
        ]);*/
       
        const links = await file('read');
        await file('remove');
        
        if (links !== undefined && links.length >= 1) {
            
            const sortPrice = links.sort(
                (a: itemsLinks, b: itemsLinks): number =>
                    Number(a.price) - Number(b.price)
            );
            
            const slicedItems = sortPrice
                .slice(0, 20)
                .map((el: itemsLinks) => ({ ...el, name: userData.model }));
            return slicedItems;
        }else{
            return false;
        } 
    }
}
export const handler = new Handler([nike,newBalance ,mdFashion,adidas,answear,deltasport,megasport,intertop,intersport,prm,yesOriginals]);
//handler.parseAll({ model: 'new balance 574', category: 'man' });


