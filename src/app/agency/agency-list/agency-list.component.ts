import { Component, OnInit } from '@angular/core';
import { AgencyService } from '../shared/agency.service';
import { Agency } from '../shared/agency.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-agency-list',
  templateUrl: './agency-list.component.html',
  styleUrls: ['./agency-list.component.scss']
})
export class AgencyListComponent implements OnInit {

  agencys: Agency[] = [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private agencyService: AgencyService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata();
  }
  getalldata(){
    this.listalert = 'Getting...';
    const agencyObservable = this.agencyService.getAgencys();

      agencyObservable.subscribe(
      (agencys: Agency[]) => {
        this.listalert = '';
      console.log(agencys);
        this.agencys = agencys['data'];
        this.totalpages= agencys['pages'];
        if(this.agencys.length === 0){
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
    this.agencyService.deleteAgency(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.agencys.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
      this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const agencyObservable = this.agencyService.getAgencysByParam(pages);
      agencyObservable.subscribe(
      (agencys: Agency[]) => {

        this.agencys = agencys['data'];
        this.totalpages= agencys['pages'];
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
