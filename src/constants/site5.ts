export const URL = 'https://answear.ua';
export const SEARCH_STRING = 'input[type="text"]';
export const ALLOW_COOKIES = '.CookiesInfo__cookiesInfoBtnWrapperAccept__nyIJU';
export const MAN_GENDER =  '.grid-row figure:nth-child(2)';
export const WOMAN_GENDER = '.grid-row figure:nth-child(1)';
export const CHILD = '.grid-row figure:nth-child(3)';
export const LINK =  '[data-test="outfitProduct"] .ProductItem__productCard__8ivfZ div:nth-child(2) div .ProductItemSubmenu__submenu__-fgpe .ColorPicker__colors__q-7EP a' ;
export const PRICE = '[data-test="outfitProduct"] .ProductItem__productCard__8ivfZ div:nth-child(2) div .notranslate';
export const IMAGE = '[data-test="outfitProduct"] .ProductItem__productCard__8ivfZ div:nth-child(1) a .Image__imageWrapper__R-bNK .Image__cardImage__xvgs1 [media="(max-width: 1100px)"]';
export const PRICE_NEW = '.ProductItemPrice__priceSale__PueP7';
export const PRICE_OLD = '.ProductItemPrice__priceRegular__7OKlG';
export const FILTER_BUTTON = '.multiTheme-icon-settings';
export const OPEN_CATEGORY_FILTER = 'body > div.MobileFiltersContent__mobileFilters__-c3pD > div.MobileFiltersContent__filtersContent__cIrnB > ul > li:nth-child(3)';
export const RESULT_BUTTON =  '.MobileFiltersContent__filtersContentListButton__8yYgm';
export const NEXT_BUTTON =  '.ProductsPagination__paginationNext__8I870';
export const SELECT_CATEGORY = '[for="90_radio_0"]';
export const APPLY_FILTER = '.btn--filtersSubmit';
export const CLOSE_SALE_BANNER = 'body > div.modal > div > div > div.Modal__close__C40RR > i';
export const OPERATION_HAS_BEEN_SUCCESSFUL = 'The operation has been successful in site5';
export const NOT_FOUND_MODEL = 'According to the search results, nothing was found in site5, your request:';
export const MODEL_NAME = '.ProductItem__productCardName__DCKIH';

export const GENDER_SELECTORS: Record<string,string> = {
    man:MAN_GENDER,
    woman:WOMAN_GENDER,
    child:CHILD
};