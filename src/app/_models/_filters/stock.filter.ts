export interface StockFilter{
    sortASC: boolean;
    sortBy: string;
    ingredientCategory: string[];
    searchText: string;
    numPage: number;
    sizePage: number;
}