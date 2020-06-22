import { Component, OnInit } from '@angular/core';
import { Material } from '../shared/material.model';
import { TeacherStudentService } from '../shared/teacherstudent.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-teacherstudent-update',
  templateUrl: './teacherstudent-update.component.html',
  styleUrls: ['./teacherstudent-update.component.scss']
})
export class TeacherStudentUpdateComponent  implements OnInit {

  material: Material;
  base64textString : string = '';
  previewImageString: string = '';
  divisionlist : [];
 disableloading : any = false;
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private materialService: TeacherStudentService,
              private toastr: ToastrService) {



  }

  ngOnInit() {
    this.material = new Material();
    this.route.params.subscribe(
      (params) => {
        this.getMaterial(params['materialId']);
      })
    this.getDivisionList();
  }
  getDivisionList() {
    this.materialService.getDivisionList().subscribe(
      (division: any) => {
        this.divisionlist = division;
      },
      () => {

      })
  }



  getMaterial(materialId: string) {
    this.materialService.getMaterialById(materialId).subscribe(
      (material: Material) => {
//        this.material = material;
          this.material._id=material._id;
          this.material.division=material.division;
          this.material.type=material.type;
          this.material.url=material.url;

        if(material.previewimage !=""){
          this.previewImageString='./assets/public/'+material.previewimage;
        }
        if(material.file !=""  ){ 
          this.material.file = material.file;
          this.base64textString='./assets/public/'+material.file;
        }

        console.log(this.material);
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
    this.material.image=this.previewImageString;
    }
  _handleReaderLoadedPDF(e) {
    
//    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.material.file=('data:application/pdf;base64,' + btoa(e.target.result));
    }
  updateMaterial() {
  this.disableloading =true;
    this.materialService.updateMaterial(this.material._id, this.material).subscribe(
      (updatedMaterial: Material) => {
      console.log(updatedMaterial);
        this.material = updatedMaterial;
        this.material.division=updatedMaterial.division;
        this.material.type=updatedMaterial.type;
        this.material.url=updatedMaterial.url;
        this.material.pdffile='';
        this.material.previewimage = "";
        this.previewImageString="";
        this.disableloading =false;
        this.base64textString="";
        if(updatedMaterial.previewimage !=""){
          this.previewImageString='./assets/public/'+updatedMaterial.previewimage;
        }
        if(updatedMaterial.file !=""  ){
          this.base64textString='./assets/public/'+updatedMaterial.file;
        }
       
        this.toastr.success('Record Updated Successfully', 'Success!');

      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getMaterial(materialId);
      })
  }

}
