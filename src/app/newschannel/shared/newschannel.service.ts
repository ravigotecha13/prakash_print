import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Newschannel } from '../shared/newschannel.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewschannelService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getNewschannels(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newschannel');
  }
  public getNewschannelsByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/newschannel?pageno=${pages}`);
  }
  public createNewschannel(newschannel: Newschannel): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/newschannel/add', newschannel);
  }



  public getNewschannelById(newschannelId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newschannel/' + newschannelId);
  }

  public deleteNewschannel(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/newschannel/${custId}`);
  }

  public updateDental(newsId: string, newschannelData: any): Observable<any> {
    return this.http.patch(`/api/v1/newschannel/${newsId}`, newschannelData);
  }


}
