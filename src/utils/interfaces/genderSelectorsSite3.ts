export interface GenderSelectors {
    [gender: string]: {
        [genderLength: number]: string | string[];
    };
}