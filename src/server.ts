/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response } from 'express';
import path from 'path';
import { handler } from './utils/handler.js';
import { FindModelDto } from './utils/interfaces/userDTO.interface.js';
import ejs from 'ejs';
import { logger } from './logs/logger.js';

const app = express();

const __dirname = path.resolve();

const filePath = path.join(__dirname,'built','client','views');

app.use(express.static(filePath));
app.use(express.urlencoded({ extended: true }));

app.post('/submit',async (req: Request, res: Response) => {
    
    try {
        
        const userData: FindModelDto = req.body;
        
        const items = await handler.parseAll(userData);
        
        if (items) {
            
            const renderedHtml = await ejs.renderFile(
                path.join(filePath, 'items.ejs'),
                { items: items },
            
            );
            
            logger.info('Model is found');
            res.send(renderedHtml);
        
        }else{
            
            logger.info('Model is not found');
            res.sendFile(path.join(filePath,'not-found.html'));
        
        }
    } catch (error) {
        
        logger.error(`Error server:${error}`);
        res.status(500).sendFile(path.join(filePath,'server-error.html'));
    
    }
});

app.listen(8080, () => {
    console.log(`Server is running on http://localhost:${8080}`);
});
