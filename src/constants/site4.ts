export const URL = 'https://www.adidas.ua';
export const SEARCH_STRING = 'input[type="text"]';
export const MAN_GENDER =  '.list[data-type="checkbox-list"] a:nth-child(4)';
export const WOMAN_GENDER = '.list[data-type="checkbox-list"] a:nth-child(3)';
export const CHILD = '.list[data-type="checkbox-list"] a:nth-child(2)';
export const LINK = '.product__content .product__info';
export const PRICE = '.product__price';
export const IMAGE = '.image-main img';
export const PRICE_NEW = '.price__sale';
export const PRICE_OLD = '.price__first';
export const FILTER_BUTTON = '.filter__btn--icon';
export const OPEN_GENDER_FILTER = '.panel__list div:nth-child(4)';
export const RESULT_BUTTON = '.filter__content--apply';
export const NEXT_BUTTON = '.pagination__item--btn';
export const CLOSE_BANNER = '#__layout > div > div.v-popup__wrapper > div > div > div > div.v-popup__container__close-btn';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site4';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site4, your request:';

export const GENDER_SELECTORS: Record<string,string> = {
    man:MAN_GENDER,
    woman:WOMAN_GENDER,
    child:CHILD
};