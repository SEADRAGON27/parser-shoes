import express, { NextFunction, Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { handler } from './utils/handler.js';
import { userDTO } from './utils/userDTO.interface.js';
import ejs from 'ejs';
import { wait } from './utils/wait.js';

const app = express();
const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const jsonFilePath = join(currentDirPath, 'client', 'views');
// eslint-disable-next-line no-unused-vars

app.use(express.static(jsonFilePath));
app.use(express.urlencoded({ extended: true }));

// eslint-disable-next-line no-unused-vars


app.get('/', (req: Request, res: Response) => {
    res.sendFile(join(jsonFilePath, 'index.html'));
});
app.post('/submit', async (req: Request, res: Response) => {
    
   
    
    try{
        const userData: userDTO = req.body;
        //res.sendFile(join(jsonFilePath, 'loadingPage.html'));
        const items = await handler.parseAll(userData);
        
        /* if (items) {
            const renderedHtml = await ejs.renderFile(join(jsonFilePath, 'items.ejs'), { items: items });
            res.send(renderedHtml);
        }*/
       
       
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});
