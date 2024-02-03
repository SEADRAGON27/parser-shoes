//import * as fs from 'fs/promises';
//import * as readline from 'readline';
//import chalk from 'chalk';
/*import { Handler } from './utils/handler.js';
import { userDTO } from './utils/userDTO.interface.js';
import { IHandlerIterface } from './utils/handler.interface.js';
import { nike } from './scrapers/site1Scraper.js';
import { newBalance } from './src/scrapers/site2Scraper.js';
class UserPrompt { background: rgba(0, 0, 0, 0.8);
    private rl: readline.Interface;
    private controller:IHandlerIterface;
    constructor(controller:IHandlerIterface) {
        this.controller=controller;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    private askQuestion(question: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(question,resolve);
        });
    }

  

    public  async start()  {
        let userData:userDTO;

        const model = await this.askQuestion(
            chalk.bold.bgYellow.black('Write the shoe model!'),
        );
       

        
        // eslint-disable-next-line no-constant-condition
        let category:string;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            category = await this.askQuestion(
                chalk.bold.bgBlue.black(
                    'Write your category (man/woman/child)!',
                ),
            );
            if (['man', 'woman', 'child'].includes(category)) {
                break;
            }
            console.log(
                chalk.bold.bgRed.black('Invalid category. Please try again.'),
            );
        }
        // eslint-disable-next-line prefer-const
        userData={
            model:model,
            category:category,
        };
        const links= this.controller.parseAll(userData);
        //await this.writeUserDataToFile(userData);
        console.log(
            chalk.bold.bgGreen.white('Data was sent to the handler, wait...'),
        );
        console.log(links);
        this.rl.close();
        
        
        
    }
}
const controller=new Handler([nike]);
const userPrompt = new UserPrompt(controller);

userPrompt.start().then(result=>result);

*/