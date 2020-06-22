import { Component, OnInit } from '@angular/core';
import { Socialtalents } from '../shared/socialtalents.model';
import { SocialtalentsService } from '../shared/socialtalents.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-socialtalents-create',
  templateUrl: './socialtalents-create.component.html',
  styleUrls: ['./socialtalents-create.component.scss']
})
export class SocialtalentsCreateComponent implements OnInit {

  newSocialtalents: Socialtalents;
//  socialtalentsagency = Socialtalents.AGENCY;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private socialtalentsService: SocialtalentsService,
              private router: Router) { }

  ngOnInit() {
    this.newSocialtalents = new Socialtalents();
    console.log(this.newSocialtalents);
//    this.newSocialtalents.agency = 'prakash';
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
    this.newSocialtalents.image=this.base64textString;
    }

  createSocialtalents() {
  console.log(this.newSocialtalents);
 
    this.disableloading =true;
    this.socialtalentsService.createSocialtalents(this.newSocialtalents).subscribe(
      (socialtalents: Socialtalents) => {
        this.disableloading =false;

        this.newSocialtalents.tmpimage = "";
        this.newSocialtalents.url = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
