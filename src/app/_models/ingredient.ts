export interface Ingredient{
    id: string;
    name: string;
    imgUrl: string;
    ingredientCategory: string;
    active: boolean;
}

export interface IngredientListResponse {
    content: Ingredient[];
    totalElements: number;
}