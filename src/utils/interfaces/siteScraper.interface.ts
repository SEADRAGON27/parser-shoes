/* eslint-disable no-unused-vars */
import { itemLinks } from './itemsLinks.interface.js';
import { FindModelDto } from './userDTO.interface.js';

export interface ScraperInterface {
    parse: (
       userData: FindModelDto,
    ) => Promise<itemLinks[] | null>;
}
