import { userDTO } from './userDTO.interface.js';
export interface IHandlerIterface {
    // eslint-disable-next-line no-unused-vars
    parseAll: (userData: userDTO) => void;
}
