import { Component, OnInit } from '@angular/core';
import { NewspaperService } from '../shared/newspaper.service';
import { Newspaper } from '../shared/newspaper.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-newspaper-list',
  templateUrl: './newspaper-list.component.html',
  styleUrls: ['./newspaper-list.component.scss']
})
export class NewspaperListComponent implements OnInit {

  newspapers: Newspaper[] = [];
 // newspapers.pages : number = 0;
 // newspapers['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;

  listalert : string = '';
  deleteRecord: any = false;
  totalpages : number = 0;
  pages: number = 0;

  constructor(private newspaperService: NewspaperService,
              private toastr: ToastrService) { }




  ngOnInit() {
 this.getalldata();
 
  }
  getalldata(){

     this.listalert = 'Getting...';
     const newspaperObservable = this.newspaperService.getNewspapers();

      newspaperObservable.subscribe(
      (newspapers: Newspaper[]) => {
      console.log(newspapers);
        this.listalert = '';
        this.newspapers = newspapers['data'];
        this.totalpages= newspapers['pages'];
        if(this.newspapers.length === 0){
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
    this.newspaperService.deleteNewspaper(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
        this.newspapers.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
       this.deleteRecord = false;
       this.getalldata();
       this.newsDeleteIndex = undefined;
       this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const newspaperObservable = this.newspaperService.getNewspapersByParam(pages);
      newspaperObservable.subscribe(
      (newspapers: Newspaper[]) => {

        this.newspapers = newspapers['data'];
        this.totalpages= newspapers['pages'];
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
