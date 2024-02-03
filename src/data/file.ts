/* eslint-disable no-case-declarations */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { itemsLinks } from '../utils/itemsLinks.interface.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const jsonFilePath = join(currentDirPath, 'itemsLinks.json');

export async function file(action:string,newData?:itemsLinks): Promise<itemsLinks[] | undefined> {
    try {
        switch(action){
        case 'write':
            const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
            const data = JSON.parse(jsonData);
            data.push(newData);
            await fs.writeFile(jsonFilePath,JSON.stringify(data, null, 2),'utf-8');
            break;
        case 'read':
            const fileData = await fs.readFile(jsonFilePath, 'utf-8');
            const itemsLinks = JSON.parse(fileData);
            return itemsLinks;
        case 'remove':
            await fs.writeFile(jsonFilePath, JSON.stringify([], null, 2), 'utf-8');
        }
    } catch (error) {
        console.error('Ops,something was wrong!');
        throw error;
    }
}


