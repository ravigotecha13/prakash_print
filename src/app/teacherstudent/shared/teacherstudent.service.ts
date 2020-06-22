import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherStudent } from '../shared/teacherstudent.model';
import { Material } from '../shared/material.model';
import { Division } from '../shared/division.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class TeacherStudentService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getMaterial(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/material');
  }
  public getMaterialByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/material?pageno=${pages}`);
  }
  public createMaterial(material: Material): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/material/add', material);
  }
  public getMaterialById(materialId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/material/' + materialId);
  }

  public deleteMaterial(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/material/${custId}`);
  }
 public updateMaterial(materialId: string, materialData: any): Observable<any> {
    return this.http.patch(`/api/v1/material/${materialId}`, materialData);
  }
  

  public getDivisions(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/division');
  }

  public getDivisionByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/division?pageno=${pages}`);
  }

  public createDivision(division: Division): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/division/add', division);
  }

  public deleteDivision(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/division/${custId}`);
  }
  public getDivisionById(divisionId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/division/' + divisionId);
  }
  public updateDivision(divisionId: string, divisionData: any): Observable<any> {
    return this.http.patch(`/api/v1/division/${divisionId}`, divisionData);
  }
  public getDivisionList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/division/list');
  }







  public getCompetitiveExamById(competitiveexamId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/competitiveexam/' + competitiveexamId);
  }


  public updateDental(newsId: string, competitiveexamData: any): Observable<any> {
    return this.http.patch(`/api/v1/competitiveexam/${newsId}`, competitiveexamData);
  }


}
