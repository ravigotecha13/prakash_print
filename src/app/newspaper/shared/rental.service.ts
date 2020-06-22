import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rental } from './rental.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class RentalService {
  private  Apiurl;

  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getRentalById(rentalId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/' + rentalId);
  }

  public getRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals');
  }

  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }

  public createRental(rental: Rental): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/rentals', rental);
  }

  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteRental(rentalId: string): Observable<any> {
    return this.http.delete(`/api/v1/rentals/${rentalId}`);
  }

  public updateDental(rentalId: string, rentalData: any): Observable<any> {
    return this.http.patch(`/api/v1/rentals/${rentalId}`, rentalData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
