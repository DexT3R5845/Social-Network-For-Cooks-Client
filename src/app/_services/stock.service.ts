import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Page } from "../_models";
import { Stock } from "../_models/stock";
import { IngredientFilter } from "../_models/_filters/ingredient.filter";

const baseUrl = `${environment.serverUrl}/stock`;

@Injectable({
    providedIn: 'root'
  })
export class StockService{

    constructor(
        private http: HttpClient
    ){}

    getAll(ingredientFilter: IngredientFilter): Observable<Page<Stock>> {
        let params = new HttpParams();
        if(ingredientFilter.ingredientCategory){
            for(let category of ingredientFilter.ingredientCategory){
                params = params.append('ingredientCategory', category);
            }
        }
        params = params.append('order', ingredientFilter.sortASC);
        params = params.append('pageNum', ingredientFilter.numPage);
        if(ingredientFilter.searchText != null)
            params = params.append('search', ingredientFilter.searchText);
        params = params.append('size', ingredientFilter.sizePage);
        params = params.append('sortBy', ingredientFilter.sortBy)

        return this.http.get<Page<Stock>>(`${baseUrl}`, { params: params });
    }

    editIngredientInStock(ingredientId: string, amount: number): Observable<Object> {
        return this.http.patch(`${baseUrl}/${ingredientId}?amount=${amount}`, {});
    }

    deleteIngredientInStock(ingredientId: string): Observable<Object> {
        return this.http.delete(`${baseUrl}/${ingredientId}`);
    }

    getAvaibleIngredientForStock(ingredientFilter: IngredientFilter): Observable<Page<Stock>> {
        let params = new HttpParams();
        if(ingredientFilter.ingredientCategory){
            for(let category of ingredientFilter.ingredientCategory){
                params = params.append('ingredientCategory', category);
            }
        }
        params = params.append('order', ingredientFilter.sortASC);
        params = params.append('pageNum', ingredientFilter.numPage);
        if(ingredientFilter.searchText != null)
            params = params.append('search', ingredientFilter.searchText);
        params = params.append('size', ingredientFilter.sizePage);
        params = params.append('sortBy', ingredientFilter.sortBy)

        return this.http.get<Page<Stock>>(`${baseUrl}/new`, { params: params });
    }

    addIngredientInStock(ingredientId: string): Observable<Object> {
        let params = new HttpParams().set('ingredientId', ingredientId);
        return this.http.post(`${baseUrl}`, params)
    }
}