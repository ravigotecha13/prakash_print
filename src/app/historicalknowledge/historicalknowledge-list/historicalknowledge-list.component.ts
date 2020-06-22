import { Component, OnInit } from '@angular/core';
import { HistoricalKnowledgeService } from '../shared/historicalknowledge.service';
import { HistoricalKnowledge } from '../shared/historicalknowledge.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-historicalknowledge-list',
  templateUrl: './historicalknowledge-list.component.html',
  styleUrls: ['./historicalknowledge-list.component.scss']
})
export class HistoricalKnowledgeListComponent implements OnInit {

  historicalknowledge: HistoricalKnowledge[] = [];
 // pressnotes.pages : number = 0;
 // pressnotes['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  disableloading : any = false;
  listalert : string = '';
  RowDeleteIndex : number;
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private historicalknowledgeService: HistoricalKnowledgeService,
              private toastr: ToastrService) { }




  ngOnInit() {
   
     this.getalldata();
    
  }
  getalldata(){

   this.listalert = 'Getting...';
  const historicalknowledgeObservable = this.historicalknowledgeService.getHistoricalKnowledge();

      historicalknowledgeObservable.subscribe(
      (historicalknowledge: HistoricalKnowledge[]) => {
      console.log(historicalknowledge);
        this.listalert = '';
        this.historicalknowledge = historicalknowledge['data'];
        this.totalpages= historicalknowledge['pages'];
        console.log(this.historicalknowledge);
        if(this.historicalknowledge.length === 0){
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
    this.historicalknowledgeService.deleteHistoricalKnowledge(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const historicalknowledgeObservable = this.historicalknowledgeService.getHistoricalKnowledgeByParam(pages);
      historicalknowledgeObservable.subscribe(
      (historicalknowledge: HistoricalKnowledge[]) => {

        this.historicalknowledge = historicalknowledge['data'];
        this.totalpages= historicalknowledge['pages'];
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
