import { Component, OnInit } from '@angular/core';
import { TeacherStudentService } from '../shared/teacherstudent.service';
import { Division } from '../shared/division.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-division-list',
  templateUrl: './division-list.component.html',
  styleUrls: ['./division-list.component.scss']
})
export class TeacherStudentDivisionComponent implements OnInit {

  division: Division[] = [];
  pagingOptions: [];
  currentPage : number = 1;
  rowsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private teacherstudentService: TeacherStudentService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
      const divisionObservable = this.teacherstudentService.getDivisions();

      divisionObservable.subscribe(
      (division: Division[]) => {
      this.listalert = '';
  
        this.division = division['data'];
        this.totalpages= division['pages'];
        if(this.division.length === 0){
          this.listalert = 'Records Not Found';
        }
      },
      (err) => {
      this.listalert = '';
        },
      () => {
      });
  }
  deleteRows(custId: string) {
    this.deleteRecord = true;
       this.teacherstudentService.deleteDivision(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
 //       this.division.splice(this.rowsDeleteIndex, 1);
        this.rowsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const divisionObservable = this.teacherstudentService.getDivisionByParam(pages);
      divisionObservable.subscribe(
      (division: Division[]) => {

        this.division = division['data'];
        this.totalpages= division['pages'];
        this.currentPage = pages;
      },
      (err) => {
      },
      () => {
      });

  }

  arrayTwo(n: number): number[] {
  var binary = [];
  for (var i = 1; i <= n; i++) { 
     binary.push(i);
  }
     return binary;
  }


}
