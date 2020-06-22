import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Notification } from '../shared/notification.model';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class NotificationService {

  private  Apiurl;
  constructor(private http: HttpClient) {
    this.Apiurl= environment.API_URL;
  
  }

  public getNotifications(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/notification');
  }
  public getNotificationsByParam(pages: number): Observable<any> {
    return this.http.get(`/api/v1/notification?pageno=${pages}`);
  }
  public createNotification(notification: Notification): Observable<any> {
    return this.http.post(this.Apiurl+'/api/v1/notification/add', notification);
  }



  public getNotificationById(notificationId: string): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/notification/' + notificationId);
  }

  public deleteNotification(custId: string): Observable<any> {
    return this.http.delete(`/api/v1/notification/${custId}`);
  }
  public getNotificationList(): Observable<any> {
    return this.http.get(this.Apiurl+'/api/v1/notification/list');
  }


}
