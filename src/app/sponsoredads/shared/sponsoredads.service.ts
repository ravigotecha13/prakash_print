import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sponsoredads } from '../shared/sponsoredads.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class SponsoredadsService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getSponsoredadss(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/sponsoredads');
  }
  public getSponsoredadssByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/sponsoredads?pageno=${pages}`);
  }
  public createSponsoredads(sponsoredads: Sponsoredads): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/sponsoredads/add', sponsoredads);
  }



  public getSponsoredadsById(sponsoredadsId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/sponsoredads/' + sponsoredadsId);
  }

  public deleteSponsoredads(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/sponsoredads/${custId}`);
  }
  public getSponsoredadsList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/sponsoredads/list');
  }
  public updateSponsoreads(newsId: string, sponsoreadsData: any): Observable<any> {
    return this.http.patch(`/api/v1/sponsoredads/${newsId}`, sponsoreadsData);
  }

}
