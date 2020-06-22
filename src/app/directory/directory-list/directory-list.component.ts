import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../shared/directory.service';
import { Directory } from '../shared/directory.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-directory-list',
  templateUrl: './directory-list.component.html',
  styleUrls: ['./directory-list.component.scss']
})
export class DirectoryListComponent implements OnInit {

  directorys: Directory[] = [];
 // directorys.pages : number = 0;
 // directorys['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  newsDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;


  totalpages : number = 0;
  pages: number = 0;

  constructor(private directoryService: DirectoryService,
              private toastr: ToastrService) { }




  ngOnInit() {

  this.getalldata(this.searchData);
  }
  getalldata(searchData){
      this.listalert = 'Getting...';
    const directoryObservable = this.directoryService.getDirectorys(searchData);

      directoryObservable.subscribe(
      (directorys: Directory[]) => {
        this.listalert = '';
      console.log(directorys);
        this.directorys = directorys['data'];
        this.totalpages= directorys['pages'];
        this.setPage(1);
        if(this.directorys.length === 0){
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
    this.directoryService.deleteDirectory(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);

//        this.directorys.splice(this.newsDeleteIndex, 1);
         this.newsDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }

  newsActive(custId: string) {
    this.deleteRecord = true;
    this.directoryService.activeDirectory(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);

//        this.bloods.splice(this.newsDeleteIndex, 1);
         this.newsDeleteIndex = undefined;
        this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
      this.deleteRecord = false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }


  setPage(pages : number){
   const directoryObservable = this.directoryService.getDirectorysByParam(pages,this.searchData);
      directoryObservable.subscribe(
      (directorys: Directory[]) => {

        this.directorys = directorys['data'];
        this.totalpages= directorys['pages'];
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
