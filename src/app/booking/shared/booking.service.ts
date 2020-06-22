import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from './booking.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class BookingService {
  private  Apiurl;

  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public createBooking(booking: Booking): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/bookings', booking);
  }

  public getUserBookings(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/bookings/manage');
  }
}
