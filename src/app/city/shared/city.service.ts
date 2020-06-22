import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../shared/city.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CityService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getCitys(search : string): Observable<any> {
    return this.http.get(`/api/v1/city?search=${search}`);
  }
  public getCitysByParam(pages: number,search : string): Observable<any> {
    return this.http.get(`/api/v1/city?pageno=${pages}&search=${search}`);
  }
  public createCity(city: City): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/city/add', city);
  }

  public getCityById(cityId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/city/' + cityId);
  }

  public deleteCity(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/city/${custId}`);
  }

  public updateDental(newsId: string, cityData: any): Observable<any> {
    return this.http.patch(`/api/v1/city/${newsId}`, cityData);
  }
  public getCityList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/city/list');
  }


}
