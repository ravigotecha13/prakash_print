import { Component, OnInit } from '@angular/core';
import { VideoinquiryService } from '../shared/videoinquiry.service';
import { Videoinquiry } from '../shared/videoinquiry.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-videoinquiry-list',
  templateUrl: './videoinquiry-list.component.html',
  styleUrls: ['./videoinquiry-list.component.scss']
})
export class VideoinquiryListComponent implements OnInit {

  videoinquirys: Videoinquiry[] = [];
 // videoinquirys.pages : number = 0;
 // videoinquirys['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  newsDeleteIndex: number;
  disableloading : any = false;
  listalert : string = '';
  RowDeleteIndex : number;
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private videoinquiryService: VideoinquiryService,
              private toastr: ToastrService) { }




  ngOnInit() {
   
     this.getalldata(this.searchData);
    
  }
  getalldata(searchData){

   this.listalert = 'Getting...';
  const videoinquiryObservable = this.videoinquiryService.getVideoinquirys(searchData);

      videoinquiryObservable.subscribe(
      (videoinquirys: Videoinquiry[]) => {
      console.log(videoinquirys);
        this.listalert = '';
        this.videoinquirys = videoinquirys['data'];
        this.totalpages= videoinquirys['pages'];
        this.setPage(1);
        this.currentPage = 1;
        console.log(this.videoinquirys);
        if(this.videoinquirys.length === 0){
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
    this.videoinquiryService.deleteVideoinquiry(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const videoinquiryObservable = this.videoinquiryService.getVideoinquirysByParam(pages,this.searchData);
      videoinquiryObservable.subscribe(
      (videoinquirys: Videoinquiry[]) => {

        this.videoinquirys = videoinquirys['data'];
        this.totalpages= videoinquirys['pages'];
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
