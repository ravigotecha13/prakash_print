import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoricalKnowledge } from '../shared/historicalknowledge.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class HistoricalKnowledgeService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getHistoricalKnowledge(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/historicalknowledge');
  }
  public getHistoricalKnowledgeByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/historicalknowledge?pageno=${pages}`);
  }
  public createPressnote(historicalknowledge: HistoricalKnowledge): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/historicalknowledge/add', historicalknowledge);
  }

  public getHistoricalKnowledgeById(historicalknowledgeId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/historicalknowledge/' + historicalknowledgeId);
  }

  public deleteHistoricalKnowledge(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/historicalknowledge/${custId}`);
  }

  public updateDental(newsId: string, pressnoteData: any): Observable<any> {
    return this.http.patch(`/api/v1/pressnote/${newsId}`, pressnoteData);
  }
  public getHistoricalKnowledgeList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/historicalknowledge/list');
  }


}
