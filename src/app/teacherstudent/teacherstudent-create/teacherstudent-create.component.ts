import { Component, OnInit } from '@angular/core';
import { Material } from '../shared/material.model';
import { TeacherStudentService } from '../shared/teacherstudent.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-teacherstudent-create',
  templateUrl: './teacherstudent-create.component.html',
  styleUrls: ['./teacherstudent-create.component.scss']
})
export class TeacherStudentCreateComponent implements OnInit {

  newMaterial: Material;
  base64textString : string = '';
  previewImageString: string = '';
  errors: any[] = [];
  divisionlist : [];
disableloading : any = false;
  constructor(private toastr: ToastrService,
              private materialService: TeacherStudentService,
              private router: Router) { }

  ngOnInit() {
    this.newMaterial = new Material();
    console.log(this.newMaterial);
    this.newMaterial.type = 'Study';
    this.getDivisionList();

  }
  getDivisionList() {
    this.materialService.getDivisionList().subscribe(
      (division: any) => {
        this.divisionlist = division;
        this.newMaterial.division=division[0]._id;
        console.log(division);
      },
      () => {

      })
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
    this.newMaterial.image=this.previewImageString;
    }
  _handleReaderLoadedPDF(e) {
    
    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.newMaterial.file=this.base64textString;
    }


extantion
  createMaterial() {
  console.log(this.newMaterial);
 this.disableloading =true;
    this.materialService.createMaterial(this.newMaterial).subscribe(
      (material: Material) => {
        this.newMaterial.previewimage = "";
        this.newMaterial.pdffile = "";
        this.newMaterial.image = "";
        this.newMaterial.url = "";
        this.base64textString="";
        this.previewImageString="";
        this.disableloading =false;
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
