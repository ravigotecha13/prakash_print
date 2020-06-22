import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pressnote } from '../shared/pressnote.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class PressnoteService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getPressnotes(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/pressnote');
  }
  public getPressnotesByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/pressnote?pageno=${pages}`);
  }
  public createPressnote(pressnote: Pressnote): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/pressnote/add', pressnote);
  }

  public getPressnoteById(pressnoteId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/pressnote/' + pressnoteId);
  }

  public deletePressnote(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/pressnote/${custId}`);
  }

  public updateDental(newsId: string, pressnoteData: any): Observable<any> {
    return this.http.patch(`/api/v1/pressnote/${newsId}`, pressnoteData);
  }
  public getPressnoteList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/pressnote/list');
  }


}
