import { Component, OnInit } from '@angular/core';
import { Socialtalents } from '../shared/socialtalents.model';
import { SocialtalentsService } from '../shared/socialtalents.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-socialtalents-update',
  templateUrl: './socialtalents-update.component.html',
  styleUrls: ['./socialtalents-update.component.scss']
})
export class SocialtalentsUpdateComponent  implements OnInit {

  socialtalents: Socialtalents;
  base64textString : string = '';
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private socialtalentsService: SocialtalentsService,
              private toastr: ToastrService) {

//   this.transformLocation = this.transformLocation.bind(this);

  }

  ngOnInit() {
  this.socialtalents = new Socialtalents();
    this.route.params.subscribe(
      (params) => {
        this.getSocialtalents(params['newsId']);
      })
  }


  getSocialtalents(socialtalentsId: string) {
    this.socialtalentsService.getSocialtalentsById(socialtalentsId).subscribe(
      (socialtalents: Socialtalents) => {
        this.socialtalents = socialtalents;
        this.base64textString='assets/public/'+socialtalents.image;
        this.socialtalents.image='';

        console.log(this.socialtalents);
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
    this.socialtalents.image=this.base64textString;
    }
  updateSocialtalents() {
      this.disableloading =true;

    this.socialtalentsService.updateDental(this.socialtalents._id, this.socialtalents).subscribe(
      (updatedSocialtalents: Socialtalents) => {
      console.log(updatedSocialtalents);
        this.disableloading =false;
        this.socialtalents = updatedSocialtalents;
        this.base64textString='./assets/public/'+updatedSocialtalents.image;
        this.socialtalents.image='';
        this.socialtalents.tmpimage = "";
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getSocialtalents(socialtalentsId);
      })
  }

}
