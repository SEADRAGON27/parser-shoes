import { userDTO } from './userDTO.interface.js';

export interface IScraperInterface {
    parse: (
        // eslint-disable-next-line no-unused-vars
        userData: userDTO,
    ) => void;
}
