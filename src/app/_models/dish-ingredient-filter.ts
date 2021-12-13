export class DishIngredientFilter {
    name: string;
    id: string;
    checked: boolean;
  
    constructor(name: string, id: string) {
      this.name = name;
      this.checked = true;
      this.id = id;
    }
  }