import { Component, OnInit } from '@angular/core';
import { Blood } from '../shared/blood.model';
import { BloodService } from '../shared/blood.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CityService } from '../../city/shared/city.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-blood-update',
  templateUrl: './blood-update.component.html',
  styleUrls: ['./blood-update.component.scss']
})
export class BloodUpdateComponent  implements OnInit {

  blood: Blood;
  citylist : [];

  bloodgroup = Blood.BloodType;
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private bloodService: BloodService,
              private toastr: ToastrService,
              private cityService: CityService) {

  }

  ngOnInit() {
  this.blood = new Blood();
    this.route.params.subscribe(
      (params) => {
        this.getBlood(params['newsId']);
      })
    this.getCityList();

  }

  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        console.log(city);
      },
      () => {

      })
  }


  getBlood(bloodId: string) {
    this.bloodService.getBloodById(bloodId).subscribe(
      (blood: Blood) => {
        this.blood = blood;
        this.blood.type=blood.type.toUpperCase();

       console.log(this.blood);
      });
  }
  updateBlood() {
    this.disableloading =true;
  
    this.bloodService.updateDental(this.blood._id, this.blood).subscribe(
      (updatedBlood: Blood) => {
      console.log(updatedBlood);
        this.disableloading =false;
        this.blood = updatedBlood;
         this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getBlood(bloodId);
      })
  }

}
