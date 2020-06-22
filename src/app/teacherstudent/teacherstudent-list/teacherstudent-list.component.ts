import { Component, OnInit } from '@angular/core';
import { TeacherStudentService } from '../shared/teacherstudent.service';
import { Material } from '../shared/material.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-teacherstudent-list',
  templateUrl: './teacherstudent-list.component.html',
  styleUrls: ['./teacherstudent-list.component.scss']
})
export class TeacherStudentListComponent implements OnInit {

  material: Material[] = [];
 // material.pages : number = 0;
 // material['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  rowsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private materialService: TeacherStudentService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
      this.listalert = 'Getting...';
    const materialObservable = this.materialService.getMaterial();

      
      materialObservable.subscribe(
      (material: Material[]) => {
       this.listalert = '';
        this.material = material['data'];
        this.totalpages= material['pages'];
        if(this.material.length === 0){
          this.listalert = 'Records Not Found';
        }
      },
      (err) => {
        this.listalert = '';
     },
      () => {
      });
  }
  deleteNews(custId: string) {
    this.deleteRecord = true;
    this.materialService.deleteMaterial(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.material.splice(this.rowsDeleteIndex, 1);
        this.rowsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const materialObservable = this.materialService.getMaterialByParam(pages);
      materialObservable.subscribe(
      (material: Material[]) => {

        this.material = material['data'];
        this.totalpages= material['pages'];
        this.currentPage = pages;
      },
      (err) => {
      },
      () => {
      });

  }

  arrayTwo(c:number , m: number): number[] {
  var binary = [];
  var current = c,
        last = m,
        delta = 2,
        left = current - delta,
        right = current + delta + 1,
        range = [],
        rangeWithDots = [],
        l;

    for (let i = 1; i <= last; i++) {
        if (i == 1 || i == last || i >= left && i < right) {
            range.push(i);
        }
    }

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
  }



}
