import { HttpClient } from "@angular/common/http";
import { getAllLifecycleHooks } from "@angular/compiler/src/lifecycle_reflector";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Ingredient } from "../_models";

const baseUrl = `${environment.serverUrl}/ingredient`;

@Injectable({
    providedIn: 'root'
  })
export class IngredientService{

    constructor(
        private http: HttpClient
    ){}

    getAll(){
        return this.http.get<Ingredient[]>(`${baseUrl}/`);
    }
}