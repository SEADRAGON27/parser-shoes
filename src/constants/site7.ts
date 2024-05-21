import { GenderSelectors } from '../utils/interfaces/genderSelectorsSite7.js';

export const LIST_GENDERS = '[data-test-id="pickGenderSection"]';
export const URL = 'https://megasport.ua';
export const SALE_BUTTON =  'body > div.pure-modal-backdrop > div > div > svg > path:nth-child(2)';
export const ICON_SEARCH = '.gU1QRr';
export const SEARCH_STRING = 'input[type="search"]';
export const DEFINE_GENDER4 =  '.m2bZBx  button:nth-child(4)';
export const DEFINE_GENDER3 =  '.m2bZBx  button:nth-child(3)';
export const DEFINE_GENDER2 =  '.m2bZBx  button:nth-child(2)';
export const FILTER_BUTTON = '.WiOXQg';
export const OPEN_CATEGORY_FILTER =  '#js--root > main > section > div > div.cmAzQ2 > div > div.EJ4dgM > div:nth-child(3) > div > button';
export const CHECK_AVAILABILITY_SHOES = '#js--root > main > section > div > div.cmAzQ2 > div > div.EJ4dgM > div:nth-child(3) > div > div > div:nth-child(2) > div.HVhdsK.MRkJnC > button.cK8hAd.Y4wuHv > span.PMJvKK';
export const SELECT_SHOES = '#js--root > main > section > div > div.cmAzQ2 > div > div.EJ4dgM > div:nth-child(3) > div > div > div:nth-child(2) > div.HVhdsK.MRkJnC > button.cK8hAd.Q0LLN_ > svg > path';
export const OPEN_GENDER_FILTER = '#js--root > main > section > div > div.cmAzQ2 > div > div.EJ4dgM > div:nth-child(4) > div > button > div.j0Nkyt';
export const RESULT_BUTTON = '#js--root > main > section > div > div.cmAzQ2 > div > div.EJ4dgM > div.nwWf9K > label';
export const LINK = '.it25hX';
export const PRICE = '.loPig4';
export const IMAGE = '.Wi5B_k img';
export const PRICE_OLD = '.MeSmTt';
export const PRICE_NEW = '.EGoTsG';
export const NEXT_BUTTON =  '#js--root > main > section > div > div.gMgNGc > div > div.Fkfp3V > div.zmYnwY > div.qjmBYR > button';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site7';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site7, your request:';

export const GENDER_SELECTORS:GenderSelectors = {
    man: {
        0: DEFINE_GENDER2,
    },
    woman: {
        1: DEFINE_GENDER3,
        0: DEFINE_GENDER2,
    },
    child: {
        1: DEFINE_GENDER3,
        2: DEFINE_GENDER4,
        0: DEFINE_GENDER2
    }
};

export const GENDER_MAP: Record<string,string> = {
    'Чоловкам': 'man',
    'Жнкам': 'woman',
    'Дтям': 'child',
};