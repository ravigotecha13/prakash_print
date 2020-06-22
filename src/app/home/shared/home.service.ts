import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class HomeService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getHomeData(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/users/getalldata');
  }
  public getUserById(userId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/users/' + userId);
  }

  public updateUser(userId: string, userData: any): Observable<any> {
    return this.http.patch(`/api/v1/users/${userId}`, userData);
  }


}
