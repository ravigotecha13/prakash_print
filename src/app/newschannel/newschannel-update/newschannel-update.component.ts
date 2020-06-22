import { Component, OnInit } from '@angular/core';
import { Newschannel } from '../shared/newschannel.model';
import { NewschannelService } from '../shared/newschannel.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-newschannel-update',
  templateUrl: './newschannel-update.component.html',
  styleUrls: ['./newschannel-update.component.scss']
})
export class NewschannelUpdateComponent  implements OnInit {

  newschannel: Newschannel;
  base64textString : string = '';
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private newschannelService: NewschannelService,
              private toastr: ToastrService) {


  }

  ngOnInit() {
  this.newschannel = new Newschannel();
    this.route.params.subscribe(
      (params) => {
        this.getNewschannel(params['newsId']);
      })
  }

  getNewschannel(newschannelId: string) {
    this.newschannelService.getNewschannelById(newschannelId).subscribe(
      (newschannel: Newschannel) => {
        this.newschannel = newschannel;
        this.base64textString='assets/public/'+newschannel.image;
        this.newschannel.image='';

        console.log(this.newschannel);
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
    this.newschannel.image=this.base64textString;
    }
  updateNewschannel() {
      this.disableloading =true;

    this.newschannelService.updateDental(this.newschannel._id, this.newschannel).subscribe(
      (updatedNewschannel: Newschannel) => {
      console.log(updatedNewschannel);
        this.disableloading =false;
        this.newschannel = updatedNewschannel;
        this.base64textString='./assets/public/'+updatedNewschannel.image;
        this.newschannel.image='';
        this.newschannel.tmpimage = "";
        this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getNewschannel(newschannelId);
      })
  }

}
