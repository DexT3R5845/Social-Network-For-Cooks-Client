import { HttpClient } from "@angular/common/http";
import { getAllLifecycleHooks } from "@angular/compiler/src/lifecycle_reflector";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Ingredient, IngredientListResponse } from "../_models";

const baseUrl = `${environment.serverUrl}/ingredient`;

@Injectable({
    providedIn: 'root'
  })
export class IngredientService{

    constructor(
        private http: HttpClient
    ){}

    getAll(page: number,size: number){
        return this.http.get<IngredientListResponse>(`${baseUrl}?page=${page}&size=${size}`);
    }
}