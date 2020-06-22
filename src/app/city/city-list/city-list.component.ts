import { Component, OnInit } from '@angular/core';
import { CityService } from '../shared/city.service';
import { City } from '../shared/city.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-city-list',
  templateUrl: './city-list.component.html',
  styleUrls: ['./city-list.component.scss']
})
export class CityListComponent implements OnInit {

  citys: City[] = [];
 // citys.pages : number = 0;
 // citys['data'] : [];
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

  constructor(private cityService: CityService,
              private toastr: ToastrService) { }




  ngOnInit() {
   
     this.getalldata(this.searchData);
    
  }
  getalldata(searchData){

   this.listalert = 'Getting...';
  const cityObservable = this.cityService.getCitys(searchData);

      cityObservable.subscribe(
      (citys: City[]) => {
      console.log(citys);
        this.listalert = '';
        this.citys = citys['data'];
        this.totalpages= citys['pages'];
        this.setPage(1);
        if(this.citys.length === 0){
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
    this.cityService.deleteCity(custId).subscribe(
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
   const cityObservable = this.cityService.getCitysByParam(pages,this.searchData);
      cityObservable.subscribe(
      (citys: City[]) => {

        this.citys = citys['data'];
        this.totalpages= citys['pages'];
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
