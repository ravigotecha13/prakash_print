import { Component, OnInit } from '@angular/core';
import { Newschannel } from '../shared/newschannel.model';
import { NewschannelService } from '../shared/newschannel.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-newschannel-create',
  templateUrl: './newschannel-create.component.html',
  styleUrls: ['./newschannel-create.component.scss']
})
export class NewschannelCreateComponent implements OnInit {

  newNewschannel: Newschannel;
//  newschannelagency = Newschannel.AGENCY;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private newschannelService: NewschannelService,
              private router: Router) { }

  ngOnInit() {
    this.newNewschannel = new Newschannel();
    console.log(this.newNewschannel);
//    this.newNewschannel.agency = 'prakash';
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
    this.newNewschannel.image=this.base64textString;
    }

  createNewschannel() {
  console.log(this.newNewschannel);
 
    this.disableloading =true;
    this.newschannelService.createNewschannel(this.newNewschannel).subscribe(
      (newschannel: Newschannel) => {
        this.disableloading =false;

        this.newNewschannel.tmpimage = "";
        this.newNewschannel.url = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
