import { Component, OnInit } from '@angular/core';
import { SocialtalentsService } from '../shared/socialtalents.service';
import { Socialtalents } from '../shared/socialtalents.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-socialtalents-list',
  templateUrl: './socialtalents-list.component.html',
  styleUrls: ['./socialtalents-list.component.scss']
})
export class SocialtalentsListComponent implements OnInit {

  socialtalentss: Socialtalents[] = [];
 // socialtalentss.pages : number = 0;
 // socialtalentss['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private socialtalentsService: SocialtalentsService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const socialtalentsObservable = this.socialtalentsService.getSocialtalentss();

      socialtalentsObservable.subscribe(
      (socialtalentss: Socialtalents[]) => {
        this.listalert = '';
      console.log(socialtalentss);
        this.socialtalentss = socialtalentss['data'];
        this.totalpages= socialtalentss['pages'];
        if(this.socialtalentss.length === 0){
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
    this.socialtalentsService.deleteSocialtalents(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.socialtalentss.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const socialtalentsObservable = this.socialtalentsService.getSocialtalentssByParam(pages);
      socialtalentsObservable.subscribe(
      (socialtalentss: Socialtalents[]) => {

        this.socialtalentss = socialtalentss['data'];
        this.totalpages= socialtalentss['pages'];
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
