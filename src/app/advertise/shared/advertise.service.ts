import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Advertise } from '../shared/advertise.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AdvertiseService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getAdvertises(search :string): Observable<any> {
    return this.http.get(`/api/v1/advertise?search=${search}`);
  }
  public getAdvertisesByParam(pages: number,search :string): Observable<any> {
    return this.http.get(`/api/v1/advertise?pageno=${pages}&search=${search}`);
  }
  public createAdvertise(advertise: Advertise): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/advertise/add', advertise);
  }



  public getAdvertiseById(advertiseId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/advertise/' + advertiseId);
  }

  public deleteAdvertise(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/advertise/${custId}`);
  }


}
