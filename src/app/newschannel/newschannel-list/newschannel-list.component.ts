import { Component, OnInit } from '@angular/core';
import { NewschannelService } from '../shared/newschannel.service';
import { Newschannel } from '../shared/newschannel.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-newschannel-list',
  templateUrl: './newschannel-list.component.html',
  styleUrls: ['./newschannel-list.component.scss']
})
export class NewschannelListComponent implements OnInit {

  newschannels: Newschannel[] = [];
 // newschannels.pages : number = 0;
 // newschannels['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private newschannelService: NewschannelService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const newschannelObservable = this.newschannelService.getNewschannels();

      newschannelObservable.subscribe(
      (newschannels: Newschannel[]) => {
        this.listalert = '';
      console.log(newschannels);
        this.newschannels = newschannels['data'];
        this.totalpages= newschannels['pages'];
        if(this.newschannels.length === 0){
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
    this.newschannelService.deleteNewschannel(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.newschannels.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const newschannelObservable = this.newschannelService.getNewschannelsByParam(pages);
      newschannelObservable.subscribe(
      (newschannels: Newschannel[]) => {

        this.newschannels = newschannels['data'];
        this.totalpages= newschannels['pages'];
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
