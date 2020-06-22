
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ImageUploadService {
  private  Apiurl;

  constructor(private http: HttpClient){
    this.Apiurl= environment.API_URL;

  }


  public uploadImage(image: File): Observable<string | any> {
    const formData = new FormData();

    formData.append('image', image);

    return this.http.post(this.Apiurl+'/api/v1/image-upload', formData).pipe(map(((json: any) =>  json.imageUrl)));
  }
}
