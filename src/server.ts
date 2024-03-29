/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { handler } from './utils/handler.js';
import { userDTO } from './utils/interfaces/userDTO.interface.js';
import ejs from 'ejs';
import { logger } from './logs/logger.js';

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const filePath = join(currentDirPath, 'client', 'views');
app.use(express.static(filePath));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(filePath, 'index.html'));
});

// eslint-disable-next-line no-unused-vars
app.get('/submit',async (req: Request, res: Response) => {
    try {
        const userData: userDTO = req.body;
        const items = await handler.parseAll(userData);
        if (items) {
            const renderedHtml = await ejs.renderFile(
                join(filePath, 'items.ejs'),
                { items: items },
            );
            logger.info('Model is found');
            res.send(renderedHtml);
        }else{
            logger.info('Model is not found');
            res.sendFile(join(filePath,'not-found.html'));
        }
    } catch (error) {
        logger.error(`Error server:${error}`);
        res.status(500).sendFile(join(filePath,'server-error.html'));
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});
