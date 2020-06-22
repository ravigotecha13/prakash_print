import { Component, OnInit } from '@angular/core';
import { Newslive } from '../shared/newslive.model';
import { NewsliveService } from '../shared/newslive.service';
import { CityService } from '../../city/shared/city.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-newslive-create',
  templateUrl: './newslive-create.component.html',
  styleUrls: ['./newslive-create.component.scss']
})
export class NewsliveCreateComponent implements OnInit {

  newNewslive: Newslive;
  base64textString : string = '';
  citylist : [];
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private newsliveService: NewsliveService,
              private cityService: CityService,
              private router: Router) { }

  ngOnInit() {
    this.newNewslive = new Newslive();
    console.log(this.newNewslive);
    this.getCityList();

  }
  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        this.newNewslive.city=city[0]._id;
        console.log(city);
      },
      () => {

      })
  }


  createNewslive() {
    this.disableloading =true;
    this.newsliveService.createNewslive(this.newNewslive).subscribe(
      (newslive: Newslive) => {
        this.disableloading =false;
        this.newNewslive.url="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.disableloading =false;
        this.errors = errorResponse.error.errors;
      })
  }

}
