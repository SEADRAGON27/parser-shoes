import { GenderSelectors } from '../utils/interfaces/genderSelectorsSite3.js';

export const URL = 'https://md-fashion.ua';
export const SEARCH_STRING = 'input[type="search"]';
export const ICON_SEARCH = '.mobile-search';
export const LINK = '.products-item__link';
export const PRICE = '.product-info__price';
export const IMAGE = '.responsive-image picture img';
export const PRICE_NEW = '.product-info__price__text_new';
export const FILTER_BUTTON = '.mobile-filters div:nth-child(1)';
export const OPEN_GENDER_FILTER = '.filters-popup div:nth-child(5)';
export const LIST_GENDERS = '.filters__list__link';
export const DEFINE_GENDER4 =  '.filters__list__scroll div:nth-child(4)';
export const DEFINE_GENDER3 =  '.filters__list__scroll div:nth-child(3)';
export const DEFINE_GENDER2 =  '.filters__list__scroll div:nth-child(2)';
export const DEFINE_GENDER1 =  '.filters__list__scroll div:nth-child(1)';
export const NEXT_BUTTON = '.pagination__button btn btn--accent';
export const RESULT_BUTTON = '.filters-popup__buttons button:nth-child(1)';
export const MODEL_NAME = '.product-info a:nth-child(1)';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site3';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site3, your request:';

export const GENDER_SELECTORS:GenderSelectors = {
    man: {
        4: DEFINE_GENDER4,
        2: DEFINE_GENDER2,
        1: DEFINE_GENDER1
    },
    woman: {
        4: DEFINE_GENDER2,
        2: DEFINE_GENDER1,
        1: DEFINE_GENDER1
    },
    child: {
        4: [DEFINE_GENDER1, DEFINE_GENDER3],
        2: [DEFINE_GENDER1, DEFINE_GENDER2]
    }
};

export const GENDER_MAP:Record<string,string> = {
    'Чоловікам': 'man',
    'Жінкам': 'woman',
    'Хлопчикам': 'child',
    'Дівчаткам': 'child'
};