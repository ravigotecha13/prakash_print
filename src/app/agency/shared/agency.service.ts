import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agency } from '../shared/agency.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class AgencyService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getAgencys(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/agency');
  }
  public getAgencysByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/agency?pageno=${pages}`);
  }
  public createAgency(agency: Agency): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/agency/add', agency);
  }



  public getAgencyById(agencyId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/agency/' + agencyId);
  }

  public deleteAgency(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/agency/${custId}`);
  }
  public getAgencyList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/agency/list');
  }


}
