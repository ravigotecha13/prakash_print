import { Component, OnInit } from '@angular/core';
import { City } from '../shared/city.model';
import { CityService } from '../shared/city.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-city-update',
  templateUrl: './city-update.component.html',
  styleUrls: ['./city-update.component.scss']
})
export class CityUpdateComponent  implements OnInit {

  city: City;
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private cityService: CityService,
              private toastr: ToastrService) {


  }

  ngOnInit() {
  this.city = new City();
  this.disableloading =true;
    this.route.params.subscribe(
      (params) => {
        this.getCity(params['newsId']);
      })
  }


  getCity(cityId: string) {
    this.cityService.getCityById(cityId).subscribe(
      (city: City) => {
        this.disableloading =false;
        this.city = city;

        console.log(this.city);
      });
  }

  updateCity() {
    this.disableloading =true;
  
    this.cityService.updateDental(this.city._id, this.city).subscribe(
      (updatedCity: City) => {
      console.log(updatedCity);
        this.disableloading =false;
        this.city = updatedCity;
        this.toastr.success('Data Changed Successfully ', 'Success');
      },
      (errorResponse: HttpErrorResponse) => {
        this.disableloading =false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getCity(cityId);
      })
  }

}
