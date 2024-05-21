import { createClient } from 'redis';
import { logger } from '../logs/logger.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ERROR_GETTING } from '../constants/db.js';


export async function dbGetValues(key: string): Promise<itemLinks[] | null> {
    
    const client = createClient();
    
    try{
        
        await client.connect();
        
        const listValues = await client.lRange(key, 0, -1); 
        
        const items = listValues.map((value) => JSON.parse(value));
        
        if(items.length >= 1){
            return items;
        }
    
    } catch(error) {
    
        logger.error(ERROR_GETTING + error);
   
    } finally {
    
        client.quit();
    
    }
    return null;
}

export async function dbGetValue(key:string): Promise<string | null> {
    
    const client = createClient(); 
    
    try{
        
        await client.connect();
    
        const value = await client.get(key);
        
        if(value){
            return value;
        }
       
    } catch(error) {
        
        logger.error(ERROR_GETTING + error);
    
    } finally {
        
        client.quit();
    
    }
    return null;
}