import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompetitiveExam } from '../shared/competitiveexam.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CompetitiveExamService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getCompetitiveExams(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/competitiveexam');
  }
  public getCompetitiveExamsByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/competitiveexam?pageno=${pages}`);
  }
  public createCompetitiveExam(competitiveexam: CompetitiveExam): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/competitiveexam/add', competitiveexam);
  }



  public getCompetitiveExamById(competitiveexamId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/competitiveexam/' + competitiveexamId);
  }

  public deleteCompetitiveExam(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/competitiveexam/${custId}`);
  }

  public updateDental(newsId: string, competitiveexamData: any): Observable<any> {
    return this.http.patch(`/api/v1/competitiveexam/${newsId}`, competitiveexamData);
  }


}
