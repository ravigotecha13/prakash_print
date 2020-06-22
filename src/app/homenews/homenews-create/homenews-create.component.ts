import { Component, OnInit } from '@angular/core';
import { Homenews } from '../shared/homenews.model';
import { HomenewsService } from '../shared/homenews.service';
import { CityService } from '../../city/shared/city.service';
import { NgxSortableModule } from 'ngx-sortable';
import { Router,RouterModule } from '@angular/router';
import { SortablejsOptions } from 'angular-sortablejs';
import { HttpClient,HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'bwm-homenews-create',
  templateUrl: './homenews-create.component.html',
  styleUrls: ['./homenews-create.component.scss']
})
export class HomenewsCreateComponent implements OnInit {

  newHomenews: Homenews;
  base64textString : string = '';
  uploadedPercentage : number;
  newschannelagency = Homenews.AGENCY;

  uploadedPercentage1 : any;
  disableloading : any = false;
   uploadedFiles: Array < File > ;
  errors: any[] = [];
  items : any;
  citylist : [];
  imagesstring : any[] = [];
  name : string;
  listStyle:any;
   urls = new Array<string>();
  items1 = [1, 2, 3, 4, 5];
  options: SortablejsOptions = {
     group: 'test'
   };
  constructor(private toastr: ToastrService,
              private homenewsService: HomenewsService,
              private router: Router, private http: HttpClient,
              private cityService: CityService) { }

  ngOnInit() {
    this.newHomenews = new Homenews();
    console.log(this.newHomenews);
    var _arr = new Array();
    this.uploadedPercentage = 0;
    this.newHomenews.agency = 'prakash';
  //  this.getCityList();

  }
   getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        this.newHomenews.city=city[0]._id;
        console.log(city);
      },
      () => {

      })
  }

  getimageFile(evt){
      var files = evt.target.files;
      var file = files;
    console.log(files);
    for(var i=0;i<file.length;i++){

      if (files && file[i]) {
          var reader = new FileReader();

          reader.onload =this._handleReaderLoaded.bind(this);

          reader.readAsBinaryString(file[i]);
      }

    }

  }
   fileChange(element) {
   //this.urls = [];
   this.imagesstring = [];
      this.uploadedFiles = element.target.files;
      const files = element.target.files;


    if (files) {
    var i = 0;
    Object.keys(files).forEach(i => {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e : any) => {
      this.imagesstring[i]= e.target.result;      
    }
    reader.readAsDataURL(file);
  })

}

/*
      for (let file of files) {
      console.log(file);
        let reader = new FileReader();
        reader.onload = (e: any) => {
        this.urls.push(e.target.result);
        console.log(file.name)
        console.log(i);
          this.imagesstring.push(e.target.result);
          i = i + 1;
        }
        reader.readAsDataURL(file);
        console.log(this.imagesstring);
        
      }
    }

    */


  /*  for(var i=0;i<file.length;i++){
      if (this.uploadedFiles && file[i]) {
          var reader = new FileReader();
          reader.onload =(event: Event) => {
            console.log(event);
              this.base64textString= event.target.result;
              this.imagesstring.push({'img':this.base64textString});
          }; 
  
      reader.onload = this._handleReaderLoaded.bind(this);

          reader.readAsDataURL(file[i]);
      }

    }*/


  }
  
  _handleReaderLoaded(e) {
//  console.log(e.target.result);

    this.base64textString= e.target.result;
    this.imagesstring.push({'img':this.base64textString});
    }

  createHomenews() {

    this.newHomenews['image']=this.imagesstring;
    console.log(this.newHomenews);
    this.disableloading =true;
    let formData = new FormData();
      formData.append("agency", this.newHomenews.agency);

    for (var i = this.uploadedFiles.length - 1; i >= 0; i--) {
    console.log(this.imagesstring[i]);
      if(this.imagesstring[i] !=""){
            formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
      } 
    }

    this.http.post('/api/v1/homenews/add', formData, {
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
            this.newHomenews.tmpimage = "";
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
      (homenews: Homenews) => {

        this.newHomenews.tmpimage = "";
        this.base64textString="";
        this.imagesstring = [];
        this.ngForm.reset();
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
*/

//  }
  deleteimg(index){
    this.imagesstring.splice(index, 1);
//    this.imagesstring[index] = "";
//    this.uploadedFiles.splice(index, 1);
  }

}
