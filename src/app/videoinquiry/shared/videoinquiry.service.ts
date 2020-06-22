import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Videoinquiry } from '../shared/videoinquiry.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class VideoinquiryService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getVideoinquirys(search :string): Observable<any> {
    return this.http.get(`/api/v1/videoinquiry?search=${search}`);
  }
  public getVideoinquirysByParam(pages: number,search :string): Observable<any> {
    return this.http.get(`/api/v1/videoinquiry?pageno=${pages}&search=${search}`);
  }
  public createVideoinquiry(videoinquiry: Videoinquiry): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/videoinquiry/add', videoinquiry);
  }

  public getVideoinquiryById(videoinquiryId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/videoinquiry/' + videoinquiryId);
  }

  public deleteVideoinquiry(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/videoinquiry/${custId}`);
  }

  public updateDental(newsId: string, videoinquiryData: any): Observable<any> {
    return this.http.patch(`/api/v1/videoinquiry/${newsId}`, videoinquiryData);
  }
  public getVideoinquiryList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/videoinquiry/list');
  }


}
