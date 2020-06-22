import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socialtalents } from '../shared/socialtalents.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class SocialtalentsService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getSocialtalentss(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/socialtalents');
  }
  public getSocialtalentssByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/socialtalents?pageno=${pages}`);
  }
  public createSocialtalents(socialtalents: Socialtalents): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/socialtalents/add', socialtalents);
  }



  public getSocialtalentsById(socialtalentsId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/socialtalents/' + socialtalentsId);
  }

  public deleteSocialtalents(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/socialtalents/${custId}`);
  }

  public updateDental(newsId: string, socialtalentsData: any): Observable<any> {
    return this.http.patch(`/api/v1/socialtalents/${newsId}`, socialtalentsData);
  }


}
