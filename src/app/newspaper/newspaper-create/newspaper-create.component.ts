import { Component, OnInit } from '@angular/core';
import { Newspaper } from '../shared/newspaper.model';
import { NewspaperService } from '../shared/newspaper.service';
import { AgencyService } from '../../agency/shared/agency.service';

import { NgxSortableModule } from 'ngx-sortable';
import { Router,RouterModule } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-newspaper-create',
  templateUrl: './newspaper-create.component.html',
  styleUrls: ['./newspaper-create.component.scss']
})
export class NewspaperCreateComponent implements OnInit {

  newNewspaper: Newspaper;
  base64textString : string = '';
  newspaperagency = Newspaper.AGENCY;
  uploadedPercentage : number;
  uploadedPercentage1 : any;
  uploadedFiles: Array < File > ;
  disableloading : any = false;
  agencylist : any[] = [];
  errors: any[] = [];
  items : any;
  imagesstring : any[] = [];
  name : string;
  listStyle:any;
  items1 = [1, 2, 3, 4, 5];
  options: SortablejsOptions = {
     group: 'test'
   };
  constructor(private toastr: ToastrService,
              private newspaperService: NewspaperService,
              private agencyService: AgencyService,
              private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.newNewspaper = new Newspaper();
    console.log(this.newNewspaper);
    var _arr = new Array();
    this.uploadedPercentage = 0;
    this.getAgencyList();

  }
  getAgencyList() {
    this.agencyService.getAgencyList().subscribe(
      (agency: any) => {
        this.agencylist = agency;
        this.newNewspaper.agency=agency[0]._id;

      },
      () => {

      })
  }

  getimageFile(evt){
      var files = evt.target.files;
      var file = files[0];

    if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }

  }

   fileChange(element) {
      this.uploadedFiles = element.target.files;
  }

  
  _handleReaderLoaded(e) {

    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.newNewspaper.file=this.base64textString;

    }

  createNewspaper() {

//    this.disableloading =true;

    let formData = new FormData();
      formData.append("agency", this.newNewspaper.agency);
      console.log(this.uploadedFiles);
      formData.append("uploads[]", this.uploadedFiles[0], this.uploadedFiles[0].name);


    this.http.post('/api/v1/newspaper/add', formData, {
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
            this.newNewspaper.tmpimage = "";
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

    }







/*
    .subscribe(
      (newspaper: Newspaper) => {

        this.newNewspaper.tmpimage = "";
        this.base64textString="";
        this.imagesstring = [];
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
*/

//  }
  deleteimg(index){
    this.imagesstring.splice(index, 1);
    console.log(this.imagesstring);
  }

}
