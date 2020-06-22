import { Component, OnInit } from '@angular/core';
import { Sponsoredads } from '../shared/sponsoredads.model';
import { SponsoredadsService } from '../shared/sponsoredads.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-sponsoredads-update',
  templateUrl: './sponsoredads-update.component.html',
  styleUrls: ['./sponsoredads-update.component.scss']
})
export class SponsoredadsUpdateComponent  implements OnInit {

  sponsoredads: Sponsoredads;
  base64textString : string = '';
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private sponsoredadsService: SponsoredadsService,
              private toastr: ToastrService) {


  }

  ngOnInit() {
  this.sponsoredads = new Sponsoredads();
    this.route.params.subscribe(
      (params) => {
        this.getSponsoredads(params['sponsorid']);
      })
  }

  getSponsoredads(sponsoredadsId: string) {
    this.sponsoredadsService.getSponsoredadsById(sponsoredadsId).subscribe(
      (sponsoredads: Sponsoredads) => {
        this.sponsoredads = sponsoredads;
        this.base64textString='assets/public/'+sponsoredads.image;
        this.sponsoredads.image='';

        console.log(this.sponsoredads);
      });
  }
  getimageFile(evt){
      var files = evt.target.files;
      var file = files[0];
    
    if (files && file) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
    }
  }
  
  _handleReaderLoaded(e) {
    
    this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
    this.sponsoredads.image=this.base64textString;
    }
  updateSponsoredads() {
      this.disableloading =true;

    this.sponsoredadsService.updateSponsoreads(this.sponsoredads._id, this.sponsoredads).subscribe(
      (updatedSponsoredads: Sponsoredads) => {
      console.log(updatedSponsoredads);
        this.disableloading =false;
        this.sponsoredads = updatedSponsoredads;
        this.base64textString='./assets/public/'+updatedSponsoredads.image;
        this.sponsoredads.image='';
        this.sponsoredads.tmpimage = "";
       this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getSponsoredads(sponsoredadsId);
      })
  }

}
