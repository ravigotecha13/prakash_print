import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../shared/category.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class CategoryService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getCategorys(search : string): Observable<any> {
    return this.http.get(`/api/v1/category?search=${search}`);
  }
  public getCategorysByParam(pages: number,search : string): Observable<any> {
    return this.http.get(`/api/v1/category?pageno=${pages}&search=${search}`);
  }
  public createCategory(category: Category): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/category/add', category);
  }

  public getCategoryById(categoryId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/category/' + categoryId);
  }

  public deleteCategory(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/category/${custId}`);
  }

  public updateDental(newsId: string, categoryData: any): Observable<any> {
    return this.http.patch(`/api/v1/category/${newsId}`, categoryData);
  }
  public getCategoryList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/category/list');
  }


}
