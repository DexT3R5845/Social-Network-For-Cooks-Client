import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
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


  getKitchenwareList(currentPage: number, searchedParams: SearchKitchenwareParams, pageSize: number): Observable<Page<Kitchenware>> {
    return this.http.get<Page<Kitchenware>>(`${baseUrl}?`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchedParams.name)
          .set('order', searchedParams.order == 'asc')
          .set('active', searchedParams.active)
          .set('categories', searchedParams.categories)});
  }

  getKitchenwareBySearch(searchParams: SearchKitchenwareParams, pageSize: number): Observable<Page<Kitchenware>> {
    this.searchParams = searchParams;
    return this.getKitchenwareList(0, this.searchParams, pageSize);
  }

  getKitchenwareByPageNum(currentPage: number, pageSize: number): Observable<Page<Kitchenware>> {
    return this.getKitchenwareList(currentPage, this.searchParams, pageSize);
  }

  changeStatus(id: string) {
    return this.http.put(`${baseUrl}/changeStatus/` + id, {});
  }

  editKitchenware(kitchenware: Kitchenware) {
      return this.http.put(`${baseUrl}/` + kitchenware.id, kitchenware);
  }


  addKitchenware(kitchenware: Kitchenware) {
    return this.http.post(`${baseUrl}`, kitchenware);
  }
}
