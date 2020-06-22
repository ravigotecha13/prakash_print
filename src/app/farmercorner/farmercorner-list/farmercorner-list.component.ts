import { Component, OnInit } from '@angular/core';
import { FarmercornerService } from '../shared/farmercorner.service';
import { Farmercorner } from '../shared/farmercorner.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-farmercorner-list',
  templateUrl: './farmercorner-list.component.html',
  styleUrls: ['./farmercorner-list.component.scss']
})
export class FarmercornerListComponent implements OnInit {

  farmercorner: Farmercorner[] = [];
 // farmercorner.pages : number = 0;
 // farmercorner['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  rowsDeleteIndex: number;
 listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private farmercornerService: FarmercornerService,
              private toastr: ToastrService) { }




  ngOnInit() {
    
  this.getalldata();
  }
  getalldata(){
   this.listalert = 'Getting...';
    const farmercornerObservable = this.farmercornerService.getFarmercorner();

      farmercornerObservable.subscribe(
      (farmercorner: Farmercorner[]) => {
       this.listalert = '';
        this.farmercorner = farmercorner['data'];
        this.totalpages= farmercorner['pages'];
        if(this.farmercorner.length === 0){
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
    this.farmercornerService.deleteFarmercorner(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
    //   this.farmercorner.splice(this.rowsDeleteIndex, 1);
        this.rowsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
       this.deleteRecord = false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const farmercornerObservable = this.farmercornerService.getFarmercornerByParam(pages);
      farmercornerObservable.subscribe(
      (farmercorner: Farmercorner[]) => {

        this.farmercorner = farmercorner['data'];
        this.totalpages= farmercorner['pages'];
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
