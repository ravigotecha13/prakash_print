import { Component, OnInit } from '@angular/core';
import { City } from '../shared/city.model';
import { CityService } from '../shared/city.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-city-create',
  templateUrl: './city-create.component.html',
  styleUrls: ['./city-create.component.scss']
})
export class CityCreateComponent implements OnInit {

  newCity: City;
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private cityService: CityService,
              private router: Router) { }

  ngOnInit() {
    this.newCity = new City();
  }

  createCity() {
    this.disableloading =true;
    this.cityService.createCity(this.newCity).subscribe(
      (city: City) => {
        this.disableloading =false;
        this.newCity.name = "";
        this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.disableloading =false;
        this.errors = errorResponse.error.errors;
      })
  }

}
