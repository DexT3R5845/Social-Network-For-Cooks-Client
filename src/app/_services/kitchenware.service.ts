import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import {FormGroup} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {Kitchenware} from "../_models/kitchenware";
import {SearchKitchenwareParams} from "../_models/search-kitchenware-params";

const baseUrl = `${environment.serverUrl}/kitchenware`;

@Injectable({
  providedIn: 'root'
})
export class KitchenwareService {
  searchParams: SearchKitchenwareParams;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${baseUrl}/categories`);
  }


  private getKitchenwareList(currentPage: number, searchedParams: SearchKitchenwareParams, pageSize: number): Observable<Page<Kitchenware>> {
    return this.http.get<Page<Kitchenware>>(
      baseUrl,
      {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchedParams.name)
          .set('order', searchedParams.order == 'asc')
          .set('categories', searchedParams.categories)
          .set('active', searchedParams.active)
      }
    );
  }

  getKitchenwareBySearch(search: FormGroup, pageSize: number): Observable<Page<Kitchenware>> {
    this.searchParams = search.value;
    return this.getKitchenwareList(0, this.searchParams, pageSize);
  }

  getKitchenwareByPageNum(currentPage: number, pageSize: number): Observable<Page<Kitchenware>> {
    return this.getKitchenwareList(currentPage, this.searchParams, pageSize);
  }

  changeStatus(id: string): Observable<any> {
    return this.http.put(`${baseUrl}/changeStatus/` + id, {});
  }

  editKitchenware(formGroup: FormGroup, id: string): Observable<any> {
      return this.http.put(`${baseUrl}/` + id, formGroup.value);
  }

  getById(id: string): Observable<Kitchenware> {
    return this.http.get<Kitchenware>(`${baseUrl}/` + id);
  }

  addKitchenware(formGroup: FormGroup): Observable<any> {
    return this.http.post(`${baseUrl}`, formGroup.value);
  }
}
