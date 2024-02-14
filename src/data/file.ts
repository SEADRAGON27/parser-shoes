/* eslint-disable no-case-declarations */
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { itemsLinks } from '../utils/interfaces/itemsLinks.interface.js';
import { logger } from '../logs/logger.js';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const jsonFilePath = join(currentDirPath, 'itemsLinks.json');

export async function file(
    action: string,
    newData?: itemsLinks,
): Promise<itemsLinks[] | undefined> {
    try {
        switch (action) {
        case 'write':
            logger.info(`Performing ${action} action`);
            const jsonData = await fs.readFile(jsonFilePath, 'utf-8');
            const data = JSON.parse(jsonData);
            data.push(newData);
            await fs.writeFile(
                jsonFilePath,
                JSON.stringify(data, null, 2),
                'utf-8',
            );
            logger.info(`${action} action completed successfully`);
            break;
        case 'read':
            logger.info(`Performing ${action} action`);
            const fileData = await fs.readFile(jsonFilePath, 'utf-8');
            const itemsLinks = JSON.parse(fileData);
            logger.info(`${action} action completed successfully`);
            return itemsLinks;
        case 'remove':
            logger.info(`Performing ${action} action`);
            await fs.writeFile(
                jsonFilePath,
                JSON.stringify([], null, 2),
                'utf-8',
            );
            logger.info(`${action} action completed successfully`);
        }
    } catch (error) {
        logger.error('Error occurred while performing file operation:', error);
    }
}
