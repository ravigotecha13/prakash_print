import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  public getUser(userId: string): Observable<any> {
    return this.http.get(`/api/v1/users/${userId}`);
  }
  public getUsers(search : string): Observable<any> {
    return this.http.get(`/api/v1/users?search=${search}`);
  }
  public getUsersByParam(pages: number,search: string): Observable<any> {
    return this.http.get(`/api/v1/users?pageno=${pages}&search=${search}`);
  }
  public getAllUsers(): Observable<any> {
    return this.http.get(`/api/v1/users/getall`);
  }

}
