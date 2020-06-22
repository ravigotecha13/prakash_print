import { Component, OnInit } from '@angular/core';
import { Notification } from '../shared/notification.model';
import { NotificationService } from '../shared/notification.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-notification-create',
  templateUrl: './notification-create.component.html',
  styleUrls: ['./notification-create.component.scss']
})
export class NotificationCreateComponent implements OnInit {

  newNotification: Notification;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;
//  sectionlist = Notification.SECTION;

  constructor(private toastr: ToastrService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit() {
    this.newNotification = new Notification();
  }
  getimageFile(evt,imgtype){
      var files = evt.target.files;
      var file = files[0];
    console.log(imgtype);
    if (files && file) {
        var reader = new FileReader();
          reader.onload =this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
    }
  }
  
  _handleReaderLoaded(e) {
        this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
        this.newNotification.image=this.base64textString;
  }

  createNotification() {
  console.log(this.newNotification);
 
    this.disableloading =true;
    this.notificationService.createNotification(this.newNotification).subscribe(
      (notification: Notification) => {
        this.disableloading =false;

        this.newNotification.title = "";
        this.newNotification.description = "";
        this.newNotification.tmpimage = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
