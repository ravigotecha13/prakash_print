import { Component, OnInit } from '@angular/core';
import { Farmercorner } from '../shared/farmercorner.model';
import { FarmercornerService } from '../shared/farmercorner.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-farmercorner-create',
  templateUrl: './farmercorner-create.component.html',
  styleUrls: ['./farmercorner-create.component.scss']
})
export class FarmercornerCreateComponent implements OnInit {

  newFarmercorner: Farmercorner;
  base64textString : string = '';
  previewImageString: string = '';
  errors: any[] = [];

  constructor(private toastr: ToastrService,
              private farmercornerService: FarmercornerService,
              private router: Router) { }

  ngOnInit() {
    this.newFarmercorner = new Farmercorner();
    console.log(this.newFarmercorner);
    this.newFarmercorner.type = 'pdf';

  }

  getimageFile(evt,filetype){
      var files = evt.target.files;
      var file = files[0];
    
    if (files && file) {
        var reader = new FileReader();

        if(filetype  == 'image'){
        reader.onload =this._handleReaderLoadedImage.bind(this);

        reader.readAsBinaryString(file);
        }else{

        reader.onload =this._handleReaderLoadedPDF.bind(this);

        reader.readAsBinaryString(file);

        }
    }
  }
  
  _handleReaderLoadedImage(e) {
    
    this.previewImageString= ('data:image/png;base64,' + btoa(e.target.result));
    this.newFarmercorner.image=this.previewImageString;
    }
  _handleReaderLoadedPDF(e) {
    
    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.newFarmercorner.file=this.base64textString;
    }


extantion
  createFarmercorner() {
  console.log(this.newFarmercorner);
 
    this.farmercornerService.createFarmercorner(this.newFarmercorner).subscribe(
      (farmercorner: Farmercorner) => {
//        this.newFarmercorner.previewimage = "";
        this.newFarmercorner.pdffile = "";
        this.newFarmercorner.image = "";
        this.newFarmercorner.url = "";
        this.base64textString="";
        this.previewImageString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
