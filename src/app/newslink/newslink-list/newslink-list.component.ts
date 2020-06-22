import { Component, OnInit } from '@angular/core';
import { NewslinkService } from '../shared/newslink.service';
import { Newslink } from '../shared/newslink.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-newslink-list',
  templateUrl: './newslink-list.component.html',
  styleUrls: ['./newslink-list.component.scss']
})
export class NewslinkListComponent implements OnInit {

  newslinks: Newslink[] = [];
 // newslinks.pages : number = 0;
 // newslinks['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private newslinkService: NewslinkService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const newslinkObservable = this.newslinkService.getNewslinks();

      newslinkObservable.subscribe(
      (newslinks: Newslink[]) => {
      console.log(newslinks);
      this.listalert = '';
        this.newslinks = newslinks['data'];
        this.totalpages= newslinks['pages'];
        if(this.newslinks.length === 0){
          this.listalert = 'Records Not Found';
        }
      },
      (err) => {
      },
      () => {
      });
  }
  deleteNews(custId: string) {
  this.deleteRecord = true;
    this.newslinkService.deleteNewslink(custId).subscribe(
      () => {
       this.deleteRecord = false;
        this.getalldata();
     //   this.newslinks.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const newslinkObservable = this.newslinkService.getNewslinksByParam(pages);
      newslinkObservable.subscribe(
      (newslinks: Newslink[]) => {

        this.newslinks = newslinks['data'];
        this.totalpages= newslinks['pages'];
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
