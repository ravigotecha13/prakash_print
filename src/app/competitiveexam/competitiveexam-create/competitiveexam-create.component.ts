import { Component, OnInit } from '@angular/core';
import { CompetitiveExam } from '../shared/competitiveexam.model';
import { CompetitiveExamService } from '../shared/competitiveexam.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-competitiveexam-create',
  templateUrl: './competitiveexam-create.component.html',
  styleUrls: ['./competitiveexam-create.component.scss']
})
export class CompetitiveExamCreateComponent implements OnInit {

  newCompetitiveExam: CompetitiveExam;
  base64textString : string = '';
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private competitiveexamService: CompetitiveExamService,
              private router: Router) { }

  ngOnInit() {
    this.newCompetitiveExam = new CompetitiveExam();
    console.log(this.newCompetitiveExam);
    this.newCompetitiveExam.type = 'Study';
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
    
    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.newCompetitiveExam.image=this.base64textString;
    }
extantion
  createCompetitiveExam() {
  console.log(this.newCompetitiveExam);
    this.disableloading =true;
 
    this.competitiveexamService.createCompetitiveExam(this.newCompetitiveExam).subscribe(
      (competitiveexam: CompetitiveExam) => {
        this.disableloading =false;
        this.newCompetitiveExam.image = "";
        this.newCompetitiveExam.url = "";
        this.base64textString="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
