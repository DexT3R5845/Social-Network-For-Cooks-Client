import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import { SearchDishParams } from '../_models/search-dish-params';
import { Dish } from '../_models';

const baseUrl = `${environment.serverUrl}/dish`;

@Injectable({
  providedIn: 'root'
})
export class DishService {
  dishSearchParams: SearchDishParams;
  constructor(
    private http: HttpClient
  ) {
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/categories`);
  }


  private getSearchDishList(currentPage: number, dishSearchParams: SearchDishParams, pageSize: number): Observable<Page<Dish>> {
    return this.http.get<Page<Dish>>(`${baseUrl}?`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', dishSearchParams.name)
          .set('order', dishSearchParams.order == 'asc')
          .set('ingredients', dishSearchParams.ingredients)
          .set('categories', dishSearchParams.categories)});
  }

  getDishBySearch(dishSearchParams: SearchDishParams, pageSize: number): Observable<Page<Dish>> {
    this.dishSearchParams = dishSearchParams;
    return this.getSearchDishList(0, this.dishSearchParams, pageSize);
  }

  getDishByPageNum(currentPage: number, pageSize: number): Observable<Page<Dish>> {
    return this.getSearchDishList(currentPage, this.dishSearchParams, pageSize);
  }

  getById(id: string): Observable<Dish> {
    return this.http.get<Dish>(`${baseUrl}/` + id);
  }

  createDish(dish: Dish): Observable<Object> {
    return this.http.post(`${baseUrl}`, dish);
  }
}
