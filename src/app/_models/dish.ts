import { Ingredient, NewKitchenware } from ".";

export interface Dish {
    description: string;
    dishCategory: string;
    dishName: string;
    dishType: string;
    id?: string;
    imgUrl: string;
    ingredients: Ingredient[];
    kitchenwares: NewKitchenware[];
    receipt: string;
    isLiked?: boolean;
    isFavorite?: boolean;
    totalLikes?: number;
}
