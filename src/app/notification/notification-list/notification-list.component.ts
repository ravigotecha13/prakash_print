import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../shared/notification.service';
import { Notification } from '../shared/notification.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private notificationService: NotificationService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const notificationObservable = this.notificationService.getNotifications();

      notificationObservable.subscribe(
      (notifications: Notification[]) => {
        this.listalert = '';
      console.log(notifications);
        this.notifications = notifications['data'];
        this.totalpages= notifications['pages'];
        if(this.notifications.length === 0){
          this.listalert = 'Records Not Found';
        }

      },
      (err) => {
       this.listalert = '';
      },
      () => {
      });
  
  }
  deleteNews(custId: string) {
    this.deleteRecord = true;
    this.notificationService.deleteNotification(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.notifications.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const notificationObservable = this.notificationService.getNotificationsByParam(pages);
      notificationObservable.subscribe(
      (notifications: Notification[]) => {

        this.notifications = notifications['data'];
        this.totalpages= notifications['pages'];
        this.currentPage = pages;
      },
      (err) => {
      },
      () => {
      });

  }

  arrayTwo(c:number , m: number): number[] {
  var binary = [];
  var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
  }



}
