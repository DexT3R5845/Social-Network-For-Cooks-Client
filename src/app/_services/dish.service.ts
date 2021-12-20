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

  getDishesBySearch(dishSearchParams: SearchDishParams, pageSize: number): Observable<Page<Dish>> {
    this.dishSearchParams = dishSearchParams;
    return this.getSearchDishList(0, this.dishSearchParams, pageSize);
  }

  getDishesByPageNum(currentPage: number, pageSize: number): Observable<Page<Dish>> {
    return this.getSearchDishList(currentPage, this.dishSearchParams, pageSize);
  }

  getStockDishes(currentPage: number, pageSize: number): Observable<Page<Dish>> {
    return this.http.get<Page<Dish>>(`${baseUrl}/stock?`, {
      params: new HttpParams()
        .set('pageSize', pageSize)
        .set('pageNum', currentPage)});
  }

  getFavoriteDishes(currentPage: number, pageSize: number): Observable<Page<Dish>> {
    return this.http.get<Page<Dish>>(`${baseUrl}/favorite?`, {
      params: new HttpParams()
        .set('pageSize', pageSize)
        .set('pageNum', currentPage)});
  }

  getDishById(id: string): Observable<Dish> {
    return this.http.get<Dish>(`${baseUrl}/${id}`);
  }

  deleteDish(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  manageDishLike(id: string, isLiked: boolean) : Observable<Object> {
    return this.http.put(`${baseUrl}/like?`, {}, {
      params: new HttpParams()
      .set('id', id)
      .set('isLike', isLiked)});
  }

  manageFavoriteDish(id: string, isFavorite: boolean) : Observable<Object> {
    return this.http.put(`${baseUrl}/favorite?`, {}, {
      params: new HttpParams()
      .set('id', id)
      .set('isFavorite', isFavorite)});
  }

  createDish(dish: Dish): Observable<Object> {
    return this.http.post(`${baseUrl}`, dish);
  }

  editDish(dish: Dish): Observable<Object>{
    return this.http.put(`${baseUrl}/${dish.id}`, dish);
  }
}
