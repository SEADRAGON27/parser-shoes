import { createClient } from 'redis';
import { logger } from '../logs/logger.js';
import { itemLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { ERROR_SETTING, EXPIRATION_TIME_24H } from '../constants/db.js';

export async function dbSetValues(key: string, values: itemLinks[] ): Promise<itemLinks[]> {
    
    const client = createClient();
    
    const result: itemLinks[] = [];
    
    try {
        
        await client.connect();
        
        
        for(const value of values){
            
            const serializedValue = JSON.stringify(value);
            
            await client.rPush(key, serializedValue); 
            
            await client.expire(key, EXPIRATION_TIME_24H);
            
            result.push(value);
        
        }
        
    } catch(error) {
       
        logger.error(ERROR_SETTING + error);
    
    } finally {
        
        client.quit();
    
    }
    
    return result;
}

export async function dbSetValue(key: string, value: string) {
    
    const client = createClient();
    
    try {
        
        await client.connect();
        
        client.set(key,value);

        await client.expire(key, EXPIRATION_TIME_24H);
    
    } catch(error) {
        
        logger.error(ERROR_SETTING + error);
    
    } finally {
        
        client.quit();
    
    }
}