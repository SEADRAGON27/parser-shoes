import { join,dirname } from 'path';
import { fileURLToPath } from 'url';
import {pino} from 'pino';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const logFilePath = join(currentDirPath, 'app.log');

export const logger = pino({
    transport: {
        targets: [
            {
                level: 'info',
                target: 'pino/file',
                options: { destination: logFilePath },
            },
        ],
    },
});

