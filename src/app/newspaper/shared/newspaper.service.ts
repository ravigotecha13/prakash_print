import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';
import { Newspaper } from '../shared/newspaper.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NewspaperService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getNewspapers(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newspaper');
  }
  public getNewspapersByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/newspaper?pageno=${pages}`);
  }
  public createNewspaper(newspaper: Newspaper): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/newspaper/add', newspaper);
  }



  public getNewspaperById(newspaperId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/newspaper/' + newspaperId);
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteNewspaper(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/newspaper/${custId}`);
  }

  public updateDental(newsId: string, newspaperData: any): Observable<any> {
    return this.http.patch(`/api/v1/newspaper/${newsId}`, newspaperData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
