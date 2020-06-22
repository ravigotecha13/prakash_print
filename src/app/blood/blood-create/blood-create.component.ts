import { Component, OnInit } from '@angular/core';
import { Blood } from '../shared/blood.model';
import { BloodService } from '../shared/blood.service';
import { CityService } from '../../city/shared/city.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-blood-create',
  templateUrl: './blood-create.component.html',
  styleUrls: ['./blood-create.component.scss']
})
export class BloodCreateComponent implements OnInit {

  newBlood: Blood;
  base64textString : string = '';
  citylist : [];
  bloodgroup = Blood.BloodType;
  errors: any[] = [];
  csvfileupload: boolean = false;
  disableloading : any = false;
  newBlood1 : any ={
    city1: '',
    csvdata: '',
  };

  constructor(private toastr: ToastrService,
              private bloodService: BloodService,
              private cityService: CityService,
              private router: Router) { }

  ngOnInit() {
    this.newBlood = new Blood();
    console.log(this.newBlood);
    this.newBlood.type = 'A+';

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
        this.newBlood.city=city[0]._id;
        this.newBlood1.city1=city[0]._id;

        console.log(city);
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
  
  _handleReaderLoaded(e) {
  console.log(e.target.result);

    this.base64textString=  e.target.result;
    this.newBlood1.csvdata=this.base64textString;

    }


  createBlood() {

    this.disableloading =true;
 
    this.bloodService.createBlood(this.newBlood).subscribe(
      (blood: Blood) => {
        this.newBlood.name="";
        this.newBlood.number="";
        this.disableloading =false;
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }
  createBlood1(){
      this.disableloading =true;
    this.bloodService.createBlood1(this.newBlood1).subscribe(
      (blood: Blood) => {
   this.disableloading =false;
        this.newBlood1.csvdata="";
        this.newBlood1.csvfile="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }
}
