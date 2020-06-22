import { Component, OnInit } from '@angular/core';
import { Agency } from '../shared/agency.model';
import { AgencyService } from '../shared/agency.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-agency-create',
  templateUrl: './agency-create.component.html',
  styleUrls: ['./agency-create.component.scss']
})
export class AgencyCreateComponent implements OnInit {

  newAgency: Agency;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;
//  sectionlist = Agency.SECTION;

  constructor(private toastr: ToastrService,
              private agencyService: AgencyService,
              private router: Router) { }

  ngOnInit() {
    this.newAgency = new Agency();
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
        this.newAgency.image=this.base64textString;
  }

  createAgency() {
  console.log(this.newAgency);
 
    this.disableloading =true;
    this.agencyService.createAgency(this.newAgency).subscribe(
      (agency: Agency) => {
        this.disableloading =false;

        this.newAgency.tmpimage = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
