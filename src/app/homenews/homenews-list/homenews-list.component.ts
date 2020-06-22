import { Component, OnInit } from '@angular/core';
import { HomenewsService } from '../shared/homenews.service';
import { Homenews } from '../shared/homenews.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-homenews-list',
  templateUrl: './homenews-list.component.html',
  styleUrls: ['./homenews-list.component.scss']
})
export class HomenewsListComponent implements OnInit {

  homenewss: Homenews[] = [];
 // homenewss.pages : number = 0;
 // homenewss['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private homenewsService: HomenewsService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
      this.listalert = 'Getting...';
    const homenewsObservable = this.homenewsService.getHomenewss();

      homenewsObservable.subscribe(
      (homenewss: Homenews[]) => {
        this.listalert = '';
      console.log(homenewss);
        this.homenewss = homenewss['data'];
        this.totalpages= homenewss['pages'];
        this.setPage(1);
        if(this.homenewss.length === 0){
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
    this.homenewsService.deleteHomenews(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
 //     this.homenewss.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const homenewsObservable = this.homenewsService.getHomenewssByParam(pages);
      homenewsObservable.subscribe(
      (homenewss: Homenews[]) => {

        this.homenewss = homenewss['data'];
        this.totalpages= homenewss['pages'];
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
