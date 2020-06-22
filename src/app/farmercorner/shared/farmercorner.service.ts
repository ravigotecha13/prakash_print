import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Farmercorner } from '../shared/farmercorner.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class FarmercornerService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getFarmercorner(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/farmercorner');
  }
  public getFarmercornerByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/farmercorner?pageno=${pages}`);
  }
  public createFarmercorner(farmercorner: Farmercorner): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/farmercorner/add', farmercorner);
  }
  public getFarmercornerById(farmercornerId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/farmercorner/' + farmercornerId);
  }

  public deleteFarmercorner(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/farmercorner/${custId}`);
  }
 public updateFarmercorner(farmercornerId: string, farmercornerData: any): Observable<any> {
    return this.http.patch(`/api/v1/farmercorner/${farmercornerId}`, farmercornerData);
  }
  

  public getCompetitiveExamById(competitiveexamId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/competitiveexam/' + competitiveexamId);
  }


  public updateDental(newsId: string, competitiveexamData: any): Observable<any> {
    return this.http.patch(`/api/v1/competitiveexam/${newsId}`, competitiveexamData);
  }


}
