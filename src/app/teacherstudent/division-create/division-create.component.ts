import { Component, OnInit } from '@angular/core';
import { TeacherStudent } from '../shared/teacherstudent.model';
import { TeacherStudentService } from '../shared/teacherstudent.service';
import { Division } from '../shared/division.model';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-division-create',
  templateUrl: './division-create.component.html',
  styleUrls: ['./division-create.component.scss']
})
export class TeacherStudentDivisionCreateComponent implements OnInit {

  newDivision: Division;
  errors: any[] = [];
  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private teacherstudentService: TeacherStudentService,
              private router: Router) { }

    ngOnInit() {
      this.newDivision = new Division();
    }
  
    createDivision(){

    this.disableloading =true;
    this.teacherstudentService.createDivision(this.newDivision).subscribe(
      (competitiveexam: Division) => {
        this.disableloading =false;
        this.newDivision.name = "";
        this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      });
  }

}
