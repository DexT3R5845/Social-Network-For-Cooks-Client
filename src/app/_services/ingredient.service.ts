import { HttpClient } from "@angular/common/http";
import { getAllLifecycleHooks } from "@angular/compiler/src/lifecycle_reflector";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Ingredient, IngredientListResponse } from "../_models";
import { ingredientCategory } from "../_models/ingredient.category";
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
        return this.http.post<IngredientListResponse>(`${baseUrl}`, ingredientFilter);
    }

    getAllIngredientCategory(){
        return this.http.get<ingredientCategory[]>(`${baseUrl}/category`);
    }
}