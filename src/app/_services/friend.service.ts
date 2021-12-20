import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {SearchAccountParams} from "../_models/search-account-params";
import {Observable} from "rxjs";
import {AccountInList} from "../_models/account-in-list";
import {Page} from "../_models/page";

const baseUrl = `${environment.serverUrl}/friends`;

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  searchParams: SearchAccountParams;

  constructor(private http: HttpClient) {
  }

  private getAllFriends(currentPage: number, pageSize: number, searchParams: SearchAccountParams): Observable<Page<AccountInList>> {
    return this.http.get<Page<AccountInList>>(
      baseUrl,
      {
        params: new HttpParams()
          .set('size', pageSize)
          .set('pageNum', currentPage)
          .set('search', searchParams.search)
          .set('order', searchParams.order == 'asc')
          .set('gender', searchParams.gender)
      }
    );
  }

  private getAccount(currentPage: number, pageSize: number, searchParams: SearchAccountParams): Observable<Page<AccountInList>> {
    return this.http.get<Page<AccountInList>>(
      `${baseUrl}/new`,
      {
        params: new HttpParams()
          .set('size', pageSize)
          .set('pageNum', currentPage)
          .set('search', searchParams.search)
          .set('order', searchParams.order == 'asc')
          .set('gender', searchParams.gender)
      }
    );
  }

  getFriendsBySearch(search: SearchAccountParams, pageSize: number): Observable<Page<AccountInList>> {
    this.searchParams = search;
    return this.getAllFriends(0, pageSize, search);
  }

  getFriendsByPageNum(currentPage: number, pageSize: number): Observable<Page<AccountInList>> {
    return this.getAllFriends(currentPage, pageSize, this.searchParams);
  }

  getAccountsByPageNum(currentPage: number, pageSize: number): Observable<Page<AccountInList>> {
    return this.getAccount(currentPage, pageSize, this.searchParams);
  }

   getAccountBySearch(search: SearchAccountParams, pageSize: number): Observable<Page<AccountInList>> {
    this.searchParams = search;
    return this.getAccount(0, pageSize, this.searchParams);
  }

   getInvitesBySearch(search: SearchAccountParams, pageSize: number): Observable<Page<AccountInList>> {
    this.searchParams = search;
    return this.getInvites(0, pageSize, this.searchParams);
  }

  createInvite(id: number): Observable<Object> {
    return this.http.post(baseUrl, {}, {
      params: new HttpParams()
        .set('friendId', id)
    });
  }

  getInvitesByPageNum(currentPage: number, pageSize: number): Observable<Page<AccountInList>> {
    return this.getInvites(currentPage, pageSize, this.searchParams);
  }

  getInvites(currentPage: number, pageSize: number, searchParams: SearchAccountParams): Observable<Page<AccountInList>> {
    return this.http.get<Page<AccountInList>>(`${baseUrl}/invites`, {
      params: new HttpParams()
        .set('size', pageSize)
        .set('pageNum', currentPage)
        .set('search', searchParams.search)
        .set('order', searchParams.order == 'asc')
        .set('gender', searchParams.gender)
    });
  }

  removeFried(id: number): Observable<Object> {
    return this.http.delete(`${baseUrl}/` + id);
  }

  acceptInvite(id: number): Observable<Object> {
    return this.http.patch(`${baseUrl}/invites/` + id, {});
  }

  declineInvite(id: number): Observable<Object> {
    return this.http.delete(`${baseUrl}/invites/` + id);
  }
}
