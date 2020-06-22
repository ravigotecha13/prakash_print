import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Newslink } from '../shared/newslink.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewslinkService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getNewslinks(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newslink');
  }
  public getNewslinksByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/newslink?pageno=${pages}`);
  }
  public createNewslink(newslink: Newslink): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/newslink/add', newslink);
  }



  public getNewslinkById(newslinkId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newslink/' + newslinkId);
  }





  public deleteNewslink(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/newslink/${custId}`);
  }

  public updateDental(newsId: string, newslinkData: any): Observable<any> {
    return this.http.patch(`/api/v1/newslink/${newsId}`, newslinkData);
  }

}
