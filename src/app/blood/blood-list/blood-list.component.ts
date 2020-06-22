import { Component, OnInit } from '@angular/core';
import { BloodService } from '../shared/blood.service';
import { Blood } from '../shared/blood.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-blood-list',
  templateUrl: './blood-list.component.html',
  styleUrls: ['./blood-list.component.scss']
})
export class BloodListComponent implements OnInit {

  bloods: Blood[] = [];
 // bloods.pages : number = 0;
 // bloods['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private bloodService: BloodService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata(this.searchData);
  }
  getalldata(searchData){
      this.listalert = 'Getting...';
    const bloodObservable = this.bloodService.getBloods(encodeURI(searchData));

      bloodObservable.subscribe(
      (bloods: Blood[]) => {
        this.listalert = '';
      console.log(bloods);
        this.bloods = bloods['data'];
        this.totalpages= bloods['pages'];
        this.setPage(1);
        this.currentPage = 1;
        if(this.bloods.length === 0){
          this.listalert = 'Records Not Found';
        }
      },
      (err) => {
       this.listalert = '';
      },
      () => {
      });

  }
  search(search) {
    this.getalldata(search);
  }
  deleteNews(custId: string) {
    this.deleteRecord = true;
    this.bloodService.deleteBlood(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);

//        this.bloods.splice(this.newsDeleteIndex, 1);
         this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  newsActive(custId: string) {
    this.deleteRecord = true;
    this.bloodService.activeBlood(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);

//        this.bloods.splice(this.newsDeleteIndex, 1);
         this.newsDeleteIndex = undefined;
        this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }

  setPage(pages : number){
   const bloodObservable = this.bloodService.getBloodsByParam(pages,this.searchData);
      bloodObservable.subscribe(
      (bloods: Blood[]) => {

        this.bloods = bloods['data'];
        this.totalpages= bloods['pages'];
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
