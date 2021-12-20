import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Ingredient, Page } from "../_models";
import { IngredientFilter } from "../_models/_filters/ingredient.filter";

const baseUrl = `${environment.serverUrl}/ingredient`;

@Injectable({
    providedIn: 'root'
  })
export class IngredientService{

    constructor(
        private http: HttpClient
    ){}

    getAll(ingredientFilter: IngredientFilter): Observable<Page<Ingredient>> {
        return this.http.post<Page<Ingredient>>(`${baseUrl}`, ingredientFilter);
    }

    getAllIngredientCategory(): Observable<string[]> {
        return this.http.get<string[]>(`${baseUrl}/category`);
    }

    editIngredient(ingredient: Ingredient): Observable<Object> {
        return this.http.put(`${baseUrl}/${ingredient.id}`, ingredient)
    }

    addIngredient(ingredient: Ingredient): Observable<Object> {
        return this.http.post(`${baseUrl}/create`, ingredient)
    }

    changeIngredientStatus(id: string, status: boolean): Observable<Object> {
        let params = new HttpParams().set('status', status);
        return this.http.patch(`${baseUrl}/${id}`, params);
    }
}
