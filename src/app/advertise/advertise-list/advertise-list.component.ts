import { Component, OnInit } from '@angular/core';
import { AdvertiseService } from '../shared/advertise.service';
import { Advertise } from '../shared/advertise.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-advertise-list',
  templateUrl: './advertise-list.component.html',
  styleUrls: ['./advertise-list.component.scss']
})
export class AdvertiseListComponent implements OnInit {

  advertises: Advertise[] = [];
 // advertises.pages : number = 0;
 // advertises['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private advertiseService: AdvertiseService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata(this.searchData);
  }
  getalldata(searchData){
    this.listalert = 'Getting...';
    const advertiseObservable = this.advertiseService.getAdvertises(searchData);

      advertiseObservable.subscribe(
      (advertises: Advertise[]) => {
        this.listalert = '';
      console.log(advertises);
        this.advertises = advertises['data'];
        this.totalpages= advertises['pages'];
        this.setPage(1);
        if(this.advertises.length === 0){
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
    this.advertiseService.deleteAdvertise(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
//        this.advertises.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const advertiseObservable = this.advertiseService.getAdvertisesByParam(pages,this.searchData);
      advertiseObservable.subscribe(
      (advertises: Advertise[]) => {

        this.advertises = advertises['data'];
        this.totalpages= advertises['pages'];
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
