import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';
import { Homenews } from '../shared/homenews.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class HomenewsService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getHomenewss(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/homenews');
  }
  public getHomenewssByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/homenews?pageno=${pages}`);
  }
  public createHomenews(homenews: Homenews): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/homenews/add', homenews);
  }



  public getHomenewsById(homenewsId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/homenews/' + homenewsId);
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteHomenews(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/homenews/${custId}`);
  }

  public updateDental(newsId: string, homenewsData: any): Observable<any> {
    return this.http.patch(`/api/v1/homenews/${newsId}`, homenewsData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
