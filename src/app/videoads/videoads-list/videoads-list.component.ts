import { Component, OnInit } from '@angular/core';
import { VideoadsService } from '../shared/videoads.service';
import { Videoads } from '../shared/videoads.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-videoads-list',
  templateUrl: './videoads-list.component.html',
  styleUrls: ['./videoads-list.component.scss']
})
export class VideoadsListComponent implements OnInit {

  videoadss: Videoads[] = [];
 // videoadss.pages : number = 0;
 // videoadss['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private videoadsService: VideoadsService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata(this.searchData);
  }
  getalldata(searchData){
      this.listalert = 'Getting...';
    const videoadsObservable = this.videoadsService.getVideoadss(searchData);

      videoadsObservable.subscribe(
      (videoadss: Videoads[]) => {
      console.log(videoadss);
        this.listalert = '';
        this.videoadss = videoadss['data'];
        this.totalpages= videoadss['pages'];
        this.setPage(1);
        if(this.videoadss.length === 0){
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
    this.videoadsService.deleteVideoads(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
        this.videoadss.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
        this.newsDeleteIndex = undefined;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const videoadsObservable = this.videoadsService.getVideoadssByParam(pages,this.searchData);
      videoadsObservable.subscribe(
      (videoadss: Videoads[]) => {

        this.videoadss = videoadss['data'];
        this.totalpages= videoadss['pages'];
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
