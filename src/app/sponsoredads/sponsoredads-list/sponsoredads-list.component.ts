import { Component, OnInit } from '@angular/core';
import { SponsoredadsService } from '../shared/sponsoredads.service';
import { Sponsoredads } from '../shared/sponsoredads.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-sponsoredads-list',
  templateUrl: './sponsoredads-list.component.html',
  styleUrls: ['./sponsoredads-list.component.scss']
})
export class SponsoredadsListComponent implements OnInit {

  sponsoredadss: Sponsoredads[] = [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private sponsoredadsService: SponsoredadsService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const sponsoredadsObservable = this.sponsoredadsService.getSponsoredadss();

      sponsoredadsObservable.subscribe(
      (sponsoredadss: Sponsoredads[]) => {
        this.listalert = '';
      console.log(sponsoredadss);
        this.sponsoredadss = sponsoredadss['data'];
        this.totalpages= sponsoredadss['pages'];
        if(this.sponsoredadss.length === 0){
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
    this.sponsoredadsService.deleteSponsoredads(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.sponsoredadss.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const sponsoredadsObservable = this.sponsoredadsService.getSponsoredadssByParam(pages);
      sponsoredadsObservable.subscribe(
      (sponsoredadss: Sponsoredads[]) => {

        this.sponsoredadss = sponsoredadss['data'];
        this.totalpages= sponsoredadss['pages'];
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
