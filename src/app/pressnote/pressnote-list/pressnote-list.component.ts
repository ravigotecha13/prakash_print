import { Component, OnInit } from '@angular/core';
import { PressnoteService } from '../shared/pressnote.service';
import { Pressnote } from '../shared/pressnote.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-pressnote-list',
  templateUrl: './pressnote-list.component.html',
  styleUrls: ['./pressnote-list.component.scss']
})
export class PressnoteListComponent implements OnInit {

  pressnotes: Pressnote[] = [];
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

  constructor(private pressnoteService: PressnoteService,
              private toastr: ToastrService) { }




  ngOnInit() {
   
     this.getalldata();
    
  }
  getalldata(){

   this.listalert = 'Getting...';
  const pressnoteObservable = this.pressnoteService.getPressnotes();

      pressnoteObservable.subscribe(
      (pressnotes: Pressnote[]) => {
      console.log(pressnotes);
        this.listalert = '';
        this.pressnotes = pressnotes['data'];
        this.totalpages= pressnotes['pages'];
        console.log(this.pressnotes);
        if(this.pressnotes.length === 0){
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
    this.pressnoteService.deletePressnote(custId).subscribe(
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
   const pressnoteObservable = this.pressnoteService.getPressnotesByParam(pages);
      pressnoteObservable.subscribe(
      (pressnotes: Pressnote[]) => {

        this.pressnotes = pressnotes['data'];
        this.totalpages= pressnotes['pages'];
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
