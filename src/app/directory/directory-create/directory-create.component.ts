import { Component, OnInit } from '@angular/core';
import { Directory } from '../shared/directory.model';
import { DirectoryService } from '../shared/directory.service';
import { CityService } from '../../city/shared/city.service';
import { CategoryService } from '../../category/shared/category.service';

import { Router,RouterModule } from '@angular/router';
import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
//import XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-directory-create',
  templateUrl: './directory-create.component.html',
  styleUrls: ['./directory-create.component.scss']
})
export class DirectoryCreateComponent implements OnInit {

  newDirectory: Directory;
  base64textString : string = '';
  citylist : [];
  categorylist : [];
  errors: any[] = [];
  csvfileupload: boolean = false;
  uploadedFiles: Array < File > ;
  disableloading : any = false;
  uploadedPercentage : number;
  newDirectory1 : any ={
    city1: '',
    csvdata: '',
  };

  constructor(private toastr: ToastrService,
              private directoryService: DirectoryService,
              private cityService: CityService,
              private categoryService: CategoryService,
              private http: HttpClient,
              private router: Router) { }

  ngOnInit() {
    this.newDirectory = new Directory();
    this.uploadedPercentage = 0;
    console.log(this.newDirectory);
    this.getCityList();
  }
  csvformchange(){
    if(this.csvfileupload == true){
        this.csvfileupload = false;
    }else{
        this.csvfileupload = true;
    }


  }



  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        this.newDirectory.city=city[0]._id;
        this.newDirectory1.city1=city[0]._id;

      },
      () => {

      })
    this.categoryService.getCategoryList().subscribe(
      (category: any) => {
    
         this.categorylist = category;
        this.newDirectory.category=category[0]._id;
      },
      () => {

      })


       

  }
  getcsvFile(evt){
      var files = evt.target.files;
      var file = files[0];
    console.log(file);
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
  console.log(e.target.result);

    this.base64textString=  e.target.result;
    this.newDirectory1.csvdata=this.base64textString;

    }


  createDirectory() {

    this.disableloading =true;
 
    this.directoryService.createDirectory(this.newDirectory).subscribe(
      (directory: Directory) => {
        this.newDirectory.name="";
        this.newDirectory.number="";
        this.newDirectory.address="";
        this.disableloading =false;
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }
  createDirectory1(){
      this.disableloading =true;

      let formData = new FormData();
      formData.append("city1", this.newDirectory1.city1);
      formData.append("uploads[]", this.uploadedFiles[0], this.uploadedFiles[0].name);




   this.http.post('/api/v1/directory/csvupload', formData, {
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
            this.newDirectory1.csvdata="";
            this.newDirectory1.csvfile="";
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
    this.directoryService.createDirectory1(formData).subscribe(
      (directory: Directory) => {
   this.disableloading =false;
        this.newDirectory1.csvdata="";
        this.newDirectory1.csvfile="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  } */
}
