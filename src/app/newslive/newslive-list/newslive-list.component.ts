import { Component, OnInit } from '@angular/core';
import { NewsliveService } from '../shared/newslive.service';
import { Newslive } from '../shared/newslive.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-newslive-list',
  templateUrl: './newslive-list.component.html',
  styleUrls: ['./newslive-list.component.scss']
})
export class NewsliveListComponent implements OnInit {

  newslives: Newslive[] = [];
 // newslives.pages : number = 0;
 // newslives['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private newsliveService: NewsliveService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
      this.listalert = 'Getting...';
    const newsliveObservable = this.newsliveService.getNewslives();

      newsliveObservable.subscribe(
      (newslives: Newslive[]) => {
      console.log(newslives);
        this.listalert = '';
        this.newslives = newslives['data'];
        this.totalpages= newslives['pages'];
        if(this.newslives.length === 0){
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
    this.newsliveService.deleteNewslive(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
        this.newslives.splice(this.newsDeleteIndex, 1);
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
   const newsliveObservable = this.newsliveService.getNewslivesByParam(pages);
      newsliveObservable.subscribe(
      (newslives: Newslive[]) => {

        this.newslives = newslives['data'];
        this.totalpages= newslives['pages'];
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
