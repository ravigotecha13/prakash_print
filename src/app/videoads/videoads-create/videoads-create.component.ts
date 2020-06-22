import { Component, OnInit } from '@angular/core';
import { Videoads } from '../shared/videoads.model';
import { VideoadsService } from '../shared/videoads.service';
import { CityService } from '../../city/shared/city.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-videoads-create',
  templateUrl: './videoads-create.component.html',
  styleUrls: ['./videoads-create.component.scss']
})
export class VideoadsCreateComponent implements OnInit {

  newVideoads: Videoads;
  base64textString : string = '';
  citylist : [];
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private videoadsService: VideoadsService,
              private cityService: CityService,
              private router: Router) { }

  ngOnInit() {
    this.newVideoads = new Videoads();
    console.log(this.newVideoads);
    this.getCityList();

  }
  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        this.newVideoads.city=city[0]._id;
        console.log(city);
      },
      () => {

      })
  }


  createVideoads() {
    this.disableloading =true;
    this.videoadsService.createVideoads(this.newVideoads).subscribe(
      (videoads: Videoads) => {
        this.disableloading =false;
        this.newVideoads.name="";
        this.newVideoads.url="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.disableloading =false;
        this.errors = errorResponse.error.errors;
      })
  }

}
