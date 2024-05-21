export const URL = 'https://www.newbalance.ua';
export const SEARCH_STRING = '[type="search"]';
export const MAN_GENDER = '[for="gender1"]';
export const WOMAN_GENDER = '[for="gender2"]';
export const CHILD = '[for="gender5"]';
export const FILTER_BUTTON = '.icon-filters';
export const CLOSE_CATEGORY_FILTER = 'i.accordion-form__icon';
export const OPEN_GENDER_FILTER = '[data-column-id="gender"] .accordion-form__icon';
export const RESULT_BUTTON = '.action-buttons__item_submit';
export const LINK = '.products__link';
export const PRICE = '.prices';
export const IMAGE = '.product-item__image picture source:nth-child(1)';
export const PRICE_OLD = '.prices__price:not(.prices__price_discount)';
export const PRICE_NEW = '.prices__price_discount';
export const NEXT_BUTTON = '.show-more js-show-more';
export const MODEL_NAME = '.products__link';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site2';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site2, your request:';

export const GENDER_SELECTORS: Record<string,string> = {
    man:MAN_GENDER,
    woman:WOMAN_GENDER,
    child:CHILD
};