import { Component, OnInit } from '@angular/core';
import { CompetitiveExam } from '../shared/competitiveexam.model';
import { CompetitiveExamService } from '../shared/competitiveexam.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-competitiveexam-update',
  templateUrl: './competitiveexam-update.component.html',
  styleUrls: ['./competitiveexam-update.component.scss']
})
export class CompetitiveExamUpdateComponent  implements OnInit {

  competitiveexam: CompetitiveExam;
  base64textString : string = '';
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private competitiveexamService: CompetitiveExamService,
              private toastr: ToastrService) {



  }

  ngOnInit() {
  this.competitiveexam = new CompetitiveExam();
    this.route.params.subscribe(
      (params) => {
        this.getCompetitiveExam(params['newsId']);
      })
  }



  getCompetitiveExam(competitiveexamId: string) {
    this.competitiveexamService.getCompetitiveExamById(competitiveexamId).subscribe(
      (competitiveexam: CompetitiveExam) => {
        this.competitiveexam = competitiveexam;
        this.base64textString='assets/public/'+competitiveexam.file;


        console.log(this.competitiveexam);
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
    
    this.base64textString= ('data:application/pdf;base64,' + btoa(e.target.result));
    this.competitiveexam.image=this.base64textString;
    }
  updateCompetitiveExam() {
  
    this.disableloading =true;
    this.competitiveexamService.updateDental(this.competitiveexam._id, this.competitiveexam).subscribe(
      (updatedCompetitiveExam: CompetitiveExam) => {
      console.log(updatedCompetitiveExam);
        this.disableloading =false;
        this.competitiveexam = updatedCompetitiveExam;
        this.base64textString='./assets/public/'+updatedCompetitiveExam.file;
        this.competitiveexam.image='';
        this.competitiveexam.tmpimage = "";
        this.toastr.success('Record Updated Successfully', 'Success!');

      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getCompetitiveExam(competitiveexamId);
      })
  }

}
