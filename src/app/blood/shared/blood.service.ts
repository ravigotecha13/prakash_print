import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blood } from '../shared/blood.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class BloodService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getBloods(search :string): Observable<any> {
  var search = search.replace(/\+/gi, '%2B');
    return this.http.get(`/api/v1/blood?search=${search}`);
  }
  public getBloodsByParam(pages: number,search :string): Observable<any> {
  var search = search.replace(/\+/gi, '%2B');
    return this.http.get(`/api/v1/blood?pageno=${pages}&search=${search}`);
  }
  public createBlood(blood: Blood): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/blood/add', blood);
  }
  public createBlood1(blood: Blood): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/blood/csvupload', blood);
  }



  public getBloodById(bloodId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/blood/' + bloodId);
  }

  public getSocialtalent(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/blood/socialtalent');
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteBlood(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/blood/${custId}`);
  }
  public activeBlood(custId: string): Observable<any> {
    return this.http.get(`/api/v1/blood/${custId}/active`);
  }

  public updateDental(newsId: string, bloodData: any): Observable<any> {
    return this.http.patch(`/api/v1/blood/${newsId}`, bloodData);
  }
  public updateSocial(socialData: any): Observable<any> {
    return this.http.post(`/api/v1/blood/updatesocialdata`, socialData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
