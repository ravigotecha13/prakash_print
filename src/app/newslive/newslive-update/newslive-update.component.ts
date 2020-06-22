import { Component, OnInit } from '@angular/core';
import { Newslive } from '../shared/newslive.model';
import { NewsliveService } from '../shared/newslive.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CityService } from '../../city/shared/city.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-newslive-update',
  templateUrl: './newslive-update.component.html',
  styleUrls: ['./newslive-update.component.scss']
})
export class NewsliveUpdateComponent  implements OnInit {

  newslive: Newslive;
  citylist : [];
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private newsliveService: NewsliveService,
              private toastr: ToastrService,
              private cityService: CityService,
              ) {


  }

  ngOnInit() {
  this.newslive = new Newslive();
    this.route.params.subscribe(
      (params) => {
        this.getNewslive(params['newsId']);
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

  getNewslive(newsliveId: string) {
    this.newsliveService.getNewsliveById(newsliveId).subscribe(
      (newslive: Newslive) => {
        this.newslive = newslive;

       // console.log(this.newslive);
      });
  }
  updateNewslive() {
        this.disableloading =true;
  
    this.newsliveService.updateDental(this.newslive._id, this.newslive).subscribe(
      (updatedNewslive: Newslive) => {
      console.log(updatedNewslive);
        this.disableloading =false;
        this.newslive = updatedNewslive;
         this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getNewslive(newsliveId);
      })
  }

}
