//import { itemsLinks } from './itemsLinks.interface.js';
//import { itemsLinks } from './itemsLinks.interface.js';
import { userDTO } from './userDTO.interface.js';

export interface IScraperInterface{
    // eslint-disable-next-line no-unused-vars
    parse:(userData:userDTO)=>void
}