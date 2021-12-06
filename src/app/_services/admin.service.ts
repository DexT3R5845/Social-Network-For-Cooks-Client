import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {Injectable} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {SearchParams} from "../_models/search-params";
import {AccountsPerPage} from "../_models/accounts-per-page";
import {AccountInList} from "../_models/account-in-list";

const baseUrl = `${environment.serverUrl}/management`;

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  searchParams: SearchParams;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
  }

  private getAccounts(currentPage: number, searchedParams: SearchParams, pageSize: number): Observable<AccountsPerPage<AccountInList>> {
    return this.http.get<AccountsPerPage<AccountInList>>(
      baseUrl + "/all",
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

  getAccountsBySearch(search: FormGroup, pageSize: number): Observable<AccountsPerPage<AccountInList>> {
    this.searchParams = search.value;
    return this.getAccounts(0, this.searchParams, pageSize);
  }

  getAccountByPageNum(currentPage: number, pageSize: number): Observable<AccountsPerPage<AccountInList>> {
    return this.getAccounts(currentPage, this.searchParams, pageSize);
  }

  addModerator(formGroup: FormGroup): Observable<any> {
    return this.http.post(`${baseUrl}/new`, formGroup.value);
  }

  editModerator(formGroup: FormGroup): Observable<any> {
    return this.http.put(`${baseUrl}/profile`, formGroup.value);
  }

  changeStatus(id: string, status: boolean): Observable<any> {
    let reqParams = new HttpParams();
    reqParams = reqParams.append('id', id);
    reqParams = reqParams.append('status', status);
    return this.http.put(`${baseUrl}/profile-status`, {}, {params:reqParams});
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${baseUrl}/` + id);
  }
}


