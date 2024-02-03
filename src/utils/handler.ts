import { IHandlerIterface } from './handler.interface.js';
import { userDTO } from './userDTO.interface.js';
import {file} from '../data/file.js';
import { nike } from '../scrapers/site1.js';
import {newBalance} from '../scrapers/site2.js';
import {adidas} from '../scrapers/site4.js';
import { mdFashion } from '../scrapers/site3.js';
import { answear } from '../scrapers/site6.js';
import { deltasport } from '../scrapers/site7.js';
import { megasport } from '../scrapers/site8.js';
import { intertop } from '../scrapers/site9.js';
import { intersport } from '../scrapers/site10.js';
import {prm} from '../scrapers/site11.js';
import { yesOriginals } from '../scrapers/site12.js';
import { IScraperInterface } from './siteScraper.interface.js';
import { itemsLinks } from './itemsLinks.interface.js';
import Queue  from 'bull';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Worker, isMainThread, workerData } from 'worker_threads';
//import { itemsLinks } from './itemsLinks.interface.js';
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const jsonFilePath = join(currentDirPath, 'handler.js');
export class Handler implements IHandlerIterface {
    private shops:IScraperInterface[]=[];
    constructor(sites:IScraperInterface[]) {
        this.shops=sites;
        
    }
    async parseAll(userData: userDTO){
       
        /*await Promise.all([
            this.shops[0].parse(userData),
            this.shops[1].parse(userData),
            this.shops[2].parse(userData),
        ]);
        
        await Promise.all([
            this.shops[4].parse(userData),
            this.shops[5].parse(userData),
            this.shops[6].parse(userData),
           
        ]);
        await Promise.all([
            this.shops[3].parse(userData),
            this.shops[7].parse(userData),
            this.shops[8].parse(userData)
        ]);
        await Promise.all([ 
            this.shops[9].parse(userData), 
        ]);*/
        /*function parseShop(userData) {
            return this.parse(userData); // Предполагается, что функция parse определена в объекте this (например, this.shops[0])
        }*/
        
        // Запуск каждой функции в отдельном потоке
        function runWorker(sites:object) {
            const worker = new Worker(jsonFilePath, { workerData: sites });
            worker.on('error', error => console.error('Ошибка в worker thread:', error));
            worker.on('exit', code => {
                if (code !== 0)
                    console.error(`Worker остановился с кодом выхода ${code}`);
            });
        }
        
        // Данные для парсинга
        //const userData = { /* данные для парсинга */ };
        
        // Запуск функций воркеров для каждой функции
        await Promise.all([
            runWorker({ shop: this.shops[0], userData }),
            runWorker({ shop: this.shops[1], userData }),
            runWorker({ shop: this.shops[2], userData }),
        ]);
        
        const links=await file('read');
        await file('remove');
        if(links!==undefined && links.length>=1){
            const sortPrice = links.sort((a:itemsLinks,b:itemsLinks):number => Number(a.price) - Number(b.price));
            const slicedItems = sortPrice.slice(0, 20).map((el:itemsLinks) => ({ ...el, name: userData.model }));
            console.log(slicedItems);
           
        }
    }
   
}
export const handler=new Handler([nike,newBalance,mdFashion,adidas,answear,deltasport,megasport,intertop,intersport,prm,yesOriginals]);
handler.parseAll({model:'new balance 574',category:'man'});


//process.setMaxListeners(12);
//await Promise.all([
/*this.shops[0].parse(userData),
            this.shops[1].parse(userData),
            this.shops[2].parse(userData),
            this.shops[3].parse(userData),
            //this.shops[4].parse(userData),
            /*this.shops[5].parse(userData),
            this.shops[6].parse(userData),
            this.shops[7].parse(userData),
            this.shops[8].parse(userData),
            this.shops[9].parse(userData), 
            this.shops[10].parse(userData)*/
// ]); //const parsingQueue = new Queue('parsing', {redis: {host: '127.0.0.1', port: 6379}});
/*parsingQueue.process(async job => {
            try{
                switch(job.data.site) {
                case 'site1':
                    await  nike.parse(userData);
                    break;
              
                case 'site2': 
                    await newBalance.parse(userData);
                    break;
               
              // ... остальные сайты   
                }
            }catch(error){
                console.log(error);
            }
        });
       
        parsingQueue.add({site: 'site1'});
        parsingQueue.add({site: 'site2'});
       
       */
       