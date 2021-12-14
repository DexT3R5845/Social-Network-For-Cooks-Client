import { Ingredient } from ".";
import { Kitchenware } from "./kitchenware";

export interface Dish {
    description: string;
    dishCategory: string;
    dishName: string;
    dishType: string;
    id: string;
    imgUrl: string;
    ingredients: Ingredient[];
    kitchenwares: Kitchenware[];
    receipt: string;
}
