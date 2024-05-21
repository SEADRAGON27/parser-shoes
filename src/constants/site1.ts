export const URL = 'https://www.nike.one';
export const SEARCH_STRING = '[type="text"]';
export const MAN_GENDER = 'body > div.page__body > div.page__content > div > div > div > div.content__sidebar.hidden-xs > div > div > ul > li:nth-child(1) > ul > li > a';
export const WOMAN_GENDER = 'body > div.page__body > div.page__content > div > div > div > div.content__sidebar.hidden-xs > div > div > ul > li:nth-child(2) > ul > li > a';
export const LINK = '.product-cut__title-link';
export const PRICE = '.product-price--bg';
export const IMAGE = '.product-photo__item img';
export const PRICE_NEW = '.product-price__old';
export const PRICE_OLD = '.product-price__main';
export const NEXT_BUTTON = 'body > div.page__body > div.page__content > div > div > div > div.content__body > div:nth-child(3) > div.content__pagination > ul > li.paginator__item.paginator__item--next > a > svg';
export const MODEL_NAME = '.product-cut__title-link';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site1';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site1, your request:';

export const GENDER_SELECTORS: Record<string,string> = {
    man:MAN_GENDER,
    woman:WOMAN_GENDER,
};