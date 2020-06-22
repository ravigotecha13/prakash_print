import { Component, OnInit } from '@angular/core';
import { Sponsoredads } from '../shared/sponsoredads.model';
import { SponsoredadsService } from '../shared/sponsoredads.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-sponsoredads-create',
  templateUrl: './sponsoredads-create.component.html',
  styleUrls: ['./sponsoredads-create.component.scss']
})
export class SponsoredadsCreateComponent implements OnInit {

  newSponsoredads: Sponsoredads;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;
//  sectionlist = Sponsoredads.SECTION;

  constructor(private toastr: ToastrService,
              private sponsoredadsService: SponsoredadsService,
              private router: Router) { }

  ngOnInit() {
    this.newSponsoredads = new Sponsoredads();
  }
  getimageFile(evt,imgtype){
      var files = evt.target.files;
      var file = files[0];
    console.log(imgtype);
    if (files && file) {
        var reader = new FileReader();
          reader.onload =this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
    }
  }
  
  _handleReaderLoaded(e) {
        this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
        this.newSponsoredads.image=this.base64textString;
  }

  createSponsoredads() {
  console.log(this.newSponsoredads);
 
    this.disableloading =true;
    this.sponsoredadsService.createSponsoredads(this.newSponsoredads).subscribe(
      (sponsoredads: Sponsoredads) => {
        this.disableloading =false;

        this.newSponsoredads.url = "";
        this.newSponsoredads.tmpimage = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
