import { Component, OnInit } from '@angular/core';
import { Newslink } from '../shared/newslink.model';
import { NewslinkService } from '../shared/newslink.service';

import { Router,RouterModule } from '@angular/router';
import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-newslink-create',
  templateUrl: './newslink-create.component.html',
  styleUrls: ['./newslink-create.component.scss']
})
export class NewslinkCreateComponent implements OnInit {

  newNewslink: Newslink;
  errors: any[] = [];
  uploadedPercentage : number;
  uploadedPercentage1 : any;
  uploadedFiles: Array < File > ;
  uploadedFiles1: Array < File > ;
  base64textString : string = '';
  disableloading : any = false;
  imagesstring : any[] = [];

  constructor(private toastr: ToastrService,
              private newslinkService: NewslinkService,
              private router: Router,private http: HttpClient) { }

  ngOnInit() {
    this.newNewslink = new Newslink();
  }

   fileChange(element) {
      this.uploadedFiles = element.target.files;
  }
  fileChange1(element) {
      this.uploadedFiles1 = element.target.files;
  }

  _handleReaderLoaded(e) {

    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.newNewslink.file=this.base64textString;

    }

  createNewslink() {

  console.log(this.newNewslink);
    this.disableloading =true;
   let formData = new FormData();
      formData.append("name", this.newNewslink.name);
      formData.append("uploads[]", this.uploadedFiles[0], this.uploadedFiles[0].name);
      formData.append("uploads[]", this.uploadedFiles1[0], this.uploadedFiles1[0].name);


    this.http.post('/api/v1/newslink/add', formData, {
      reportProgress: true, observe: 'events'
    }).subscribe( (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
        console.log('Start');
//          this.slimLoadingBarService.start();
             this.disableloading =false;
          break;
        case HttpEventType.Response:
            this.uploadedPercentage = 0;
            this.newNewslink.name = "";
            this.newNewslink.tmpimage = "";
            this.newNewslink.tmpimage1 = "";
            this.base64textString="";
            this.imagesstring = [];
            this.disableloading =false;
            this.toastr.success('Record Added Successfully', 'Success!');

          break;
        case 1: {
          if (Math.round(this.uploadedPercentage) !== Math.round(event['loaded'] / event['total'] * 100)){
            this.uploadedPercentage = Math.round(event['loaded'] / event['total'] * 100);
          }
          break;
        }
      }
    },
    error => {
      console.log(error);
//      this.message = "Something went wrong";
  //    this.showMessage = true;
//      this.slimLoadingBarService.reset();
    });




/*    this.newslinkService.createNewslink(this.newNewslink).subscribe(
      (newslink: Newslink) => {

        this.disableloading =false;
        this.newNewslink.name = "";
        this.newNewslink.url = "";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })

      */
  }

}
