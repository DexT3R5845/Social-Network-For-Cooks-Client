import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Ingredient } from "../_models";
import { ingredientCategory } from "../_models/ingredient.category";
import { ListResponse } from "../_models/list.response";
import { IngredientFilter } from "../_models/_filters/ingredient.filter";

const baseUrl = `${environment.serverUrl}/ingredient`;

@Injectable({
    providedIn: 'root'
  })
export class IngredientService{

    constructor(
        private http: HttpClient
    ){}

    getAll(ingredientFilter: IngredientFilter){
        return this.http.post<ListResponse<Ingredient>>(`${baseUrl}`, ingredientFilter);
    }

    getAllIngredientCategory(){
        return this.http.get<ingredientCategory[]>(`${baseUrl}/category`);
    }

    editIngredient(ingredient: Ingredient){
        return this.http.put(`${baseUrl}/${ingredient.id}`, ingredient)
    }

    addIngredient(ingredient: Ingredient){
        return this.http.post(`${baseUrl}/create`, ingredient)
    }

    changeIngredientStatus(id: string | undefined, status: boolean){
        let params = new HttpParams().set('status', status);
        return this.http.patch(`${baseUrl}/${id}`, params);
    }
}
