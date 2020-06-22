import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Directory } from '../shared/directory.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class DirectoryService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getDirectorys(search : string): Observable<any> {
    return this.http.get(`/api/v1/directory?search=${search}`);
  }
  public getDirectorysByParam(pages: number,search: string): Observable<any> {
    return this.http.get(`/api/v1/directory?pageno=${pages}&search=${search}`);
  }
  public createDirectory(directory: Directory): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/directory/add', directory);
  }
  public createDirectory1(directory: Directory): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/directory/csvupload', directory);
  }



  public getDirectoryById(directoryId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/directory/' + directoryId);
  }

  public getSocialtalent(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/directory/socialtalent');
  }


  public getRentalsByCity(city: string): Observable<any> {
    return this.http.get(`/api/v1/rentals?city=${city}`);
  }


  public getUserRentals(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/rentals/manage');
  }

  public deleteDirectory(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/directory/${custId}`);
  }

  public updateDental(newsId: string, directoryData: any): Observable<any> {
    return this.http.patch(`/api/v1/directory/${newsId}`, directoryData);
  }
  public updateSocial(socialData: any): Observable<any> {
    return this.http.post(`/api/v1/directory/updatesocialdata`, socialData);
  }
  public activeDirectory(custId: string): Observable<any> {
    return this.http.get(`/api/v1/directory/${custId}/active`);
  }

  public verifyRentalUser(rentalId: string): Observable<any> {
    return this.http.get(`/api/v1/rentals/${rentalId}/verify-user`);
  }
}
