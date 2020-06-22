import { Component, OnInit } from '@angular/core';
import { Farmercorner } from '../shared/farmercorner.model';
import { FarmercornerService } from '../shared/farmercorner.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-farmercorner-update',
  templateUrl: './farmercorner-update.component.html',
  styleUrls: ['./farmercorner-update.component.scss']
})
export class FarmercornerUpdateComponent  implements OnInit {

  farmercorner: Farmercorner;
  base64textString : string = '';
  previewImageString: string = '';
  divisionlist : [];
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private farmercornerService: FarmercornerService,
              private toastr: ToastrService,
              private upperPipe: UcWordsPipe) {



  }

  ngOnInit() {
    this.farmercorner = new Farmercorner();
    this.route.params.subscribe(
      (params) => {
        this.getFarmercorner(params['farmercornerId']);
      })
  }


  getFarmercorner(farmercornerId: string) {
    this.farmercornerService.getFarmercornerById(farmercornerId).subscribe(
      (farmercorner: Farmercorner) => {
//        this.farmercorner = farmercorner;
          this.farmercorner._id=farmercorner._id;
          this.farmercorner.type=farmercorner.type;
          this.farmercorner.url=farmercorner.url;

        if(farmercorner.file !=""  ){ 
          this.farmercorner.file = farmercorner.file;
          this.base64textString='./assets/public/'+farmercorner.file;
        }

        console.log(this.farmercorner);
      });
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
    this.farmercorner.image=this.previewImageString;
    }
  _handleReaderLoadedPDF(e) {
    
//    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.farmercorner.file=('data:application/pdf;base64,' + btoa(e.target.result));
    }
  updateFarmercorner() {
  
    this.farmercornerService.updateFarmercorner(this.farmercorner._id, this.farmercorner).subscribe(
      (updatedFarmercorner: Farmercorner) => {
      console.log(updatedFarmercorner);
        this.farmercorner = updatedFarmercorner;
        this.farmercorner.type=updatedFarmercorner.type;
        this.farmercorner.url=updatedFarmercorner.url;
        this.farmercorner.pdffile='';
        this.farmercorner.previewimage = "";
        this.previewImageString="";
        this.base64textString="";
        if(updatedFarmercorner.previewimage !=""){
          this.previewImageString='./assets/public/'+updatedFarmercorner.previewimage;
        }
        if(updatedFarmercorner.file !=""  ){
          this.base64textString='./assets/public/'+updatedFarmercorner.file;
        }
       
        this.toastr.success('Record Updated Successfully', 'Success!');

      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getFarmercorner(farmercornerId);
      })
  }

}
