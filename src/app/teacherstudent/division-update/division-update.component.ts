import { Component, OnInit } from '@angular/core';
import { Division } from '../shared/division.model';
import { TeacherStudentService } from '../shared/teacherstudent.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-division-update',
  templateUrl: './division-update.component.html',
  styleUrls: ['./division-update.component.scss']
})
export class TeacherStudentDivisionUpdateComponent  implements OnInit {

  division: Division;
  base64textString : string = '';
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private teacherstudentService: TeacherStudentService,
              private toastr: ToastrService) {



  }

  ngOnInit() {
  this.division = new Division();
    this.route.params.subscribe(
      (params) => {
        this.getDivisions(params['divisionId']);
      })
  }



  getDivisions(divisionId: string) {
    this.teacherstudentService.getDivisionById(divisionId).subscribe(
      (division: Division) => {
      console.log(division)
        this.division = division;
      });
  }
  updateDivision() {
  
    this.disableloading =true;
    this.teacherstudentService.updateDivision(this.division._id, this.division).subscribe(
      (updatedDivision: Division) => {
        this.disableloading =false;
        this.division = updatedDivision;
        this.toastr.success('Record Updated Successfully', 'Success!');

      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getCompetitiveExam(divisionId);
      })
  }

}
