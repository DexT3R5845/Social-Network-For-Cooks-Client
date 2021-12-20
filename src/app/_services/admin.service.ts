import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {SearchAccountParams} from "../_models/search-account-params";
import {Page} from "../_models/page";
import {AccountInList} from "../_models/account-in-list";

const baseUrl = `${environment.serverUrl}/management`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  searchParams: SearchAccountParams;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  private getAccounts(currentPage: number, searchedParams: SearchAccountParams, pageSize: number): Observable<Page<AccountInList>> {
    return this.http.get<Page<AccountInList>>(
      `${baseUrl}`,
      {
        params: new HttpParams()
          .set('size', pageSize)
          .set('pageNum', currentPage)
          .set('search', searchedParams.search)
          .set('order', searchedParams.order == 'asc')
          .set('gender', searchedParams.gender)
          .set('status', searchedParams.status)
      }
    );
  }

  getAccountsBySearch(searchParams: SearchAccountParams, pageSize: number): Observable<Page<AccountInList>> {
    this.searchParams = searchParams;
    return this.getAccounts(0, this.searchParams, pageSize);
  }

  getAccountByPageNum(currentPage: number, pageSize: number): Observable<Page<AccountInList>> {
    return this.getAccounts(currentPage, this.searchParams, pageSize);
  }

  addModerator(account: AccountInList) {
    return this.http.post(`${baseUrl}`, account);
  }

  editModerator(account: AccountInList) {
    return this.http.put(`${baseUrl}`, account);
  }

  changeStatus(id: string) {
    return this.http.put(`${baseUrl}/` + id, {});
  }

  getById(id: string): Observable<AccountInList> {
    return this.http.get<AccountInList>(`${baseUrl}/` + id);
  }
}


