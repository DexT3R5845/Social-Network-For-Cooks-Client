export interface IngredientFilter{
    sortASC: boolean;
    sortBy: string;
    ingredientCategory: string[];
    searchText: string;
    numPage: number;
    sizePage: number;
    status?: boolean;
}