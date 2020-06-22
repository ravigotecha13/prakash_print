import { Component, OnInit } from '@angular/core';
import { CompetitiveExamService } from '../shared/competitiveexam.service';
import { CompetitiveExam } from '../shared/competitiveexam.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-competitiveexam-list',
  templateUrl: './competitiveexam-list.component.html',
  styleUrls: ['./competitiveexam-list.component.scss']
})
export class CompetitiveExamListComponent implements OnInit {

  competitiveexams: CompetitiveExam[] = [];
 // competitiveexams.pages : number = 0;
 // competitiveexams['data'] : [];
  pagingOptions: [];
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private competitiveexamService: CompetitiveExamService,
              private toastr: ToastrService) { }




  ngOnInit() {
  this.getalldata();
  }
  getalldata(){
      this.listalert = 'Getting...';
    const competitiveexamObservable = this.competitiveexamService.getCompetitiveExams();

      competitiveexamObservable.subscribe(
      (competitiveexams: CompetitiveExam[]) => {
        this.listalert = '';
      console.log(competitiveexams);
        this.competitiveexams = competitiveexams['data'];
        this.totalpages= competitiveexams['pages'];
      },
      (err) => {
      },
      () => {
      });
  }
  deleteNews(custId: string) {
    this.deleteRecord = true;
    this.competitiveexamService.deleteCompetitiveExam(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata();
//        this.competitiveexams.splice(this.newsDeleteIndex, 1);
        this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const competitiveexamObservable = this.competitiveexamService.getCompetitiveExamsByParam(pages);
      competitiveexamObservable.subscribe(
      (competitiveexams: CompetitiveExam[]) => {

        this.competitiveexams = competitiveexams['data'];
        this.totalpages= competitiveexams['pages'];
        this.currentPage = pages;
      },
      (err) => {
        this.listalert = '';
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
