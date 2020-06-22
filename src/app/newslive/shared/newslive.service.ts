import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Newslive } from '../shared/newslive.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewsliveService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getNewslives(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newslive');
  }
  public getNewslivesByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/newslive?pageno=${pages}`);
  }
  public createNewslive(newslive: Newslive): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/newslive/add', newslive);
  }



  public getNewsliveById(newsliveId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newslive/' + newsliveId);
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteNewslive(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/newslive/${custId}`);
  }

  public updateDental(newsId: string, newsliveData: any): Observable<any> {
    return this.http.patch(`/api/v1/newslive/${newsId}`, newsliveData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
