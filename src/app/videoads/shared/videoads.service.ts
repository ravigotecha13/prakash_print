import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Videoads } from '../shared/videoads.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class VideoadsService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getVideoadss(search :string): Observable<any> {
    return this.http.get(`/api/v1/videoad?search=${search}`);
  }
  public getVideoadssByParam(pages: number,search :string): Observable<any> {
    return this.http.get(`/api/v1/videoad?pageno=${pages}&search=${search}`);
  }
  public createVideoads(videoads: Videoads): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/videoad/add', videoads);
  }



  public getVideoadsById(videoadsId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/videoad/' + videoadsId);
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteVideoads(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/videoad/${custId}`);
  }

  public updateDental(newsId: string, videoadsData: any): Observable<any> {
    return this.http.patch(`/api/v1/videoad/${newsId}`, videoadsData);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
