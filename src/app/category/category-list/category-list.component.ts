import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bwm-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categorys: Category[] = [];
 // categorys.pages : number = 0;
 // categorys['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  RowDeleteIndex: number;
  listalert : string = '';
 
  deleteRecord: any = false;

  totalpages : number = 0;
  pages: number = 0;

  constructor(private categoryService: CategoryService,
              private toastr: ToastrService) { }




  ngOnInit() {
  
  this.getalldata(this.searchData);
  }
  getalldata(searchData){
      this.listalert = 'Getting...';
      const categoryObservable = this.categoryService.getCategorys(searchData);
      categoryObservable.subscribe(
      (categorys: Category[]) => {
      console.log(categorys);
        this.listalert = '';
        this.categorys = categorys['data'];
        this.totalpages= categorys['pages'];
        this.setPage(1);
        if(this.categorys.length === 0){
          this.listalert = 'Records Not Found';
        }
      },
      (err) => {
       this.listalert = '';
      },
      () => {
//       this.listalert = '';
      });

  }
  search(search) {
    this.getalldata(search);
  }

  deleteRows(custId: string) {
   this.deleteRecord = true;
    this.categoryService.deleteCategory(custId).subscribe(
      () => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
        this.RowDeleteIndex = undefined;
        this.toastr.success('Record Deleted Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.deleteRecord = false;
        this.getalldata(this.searchData);
        this.RowDeleteIndex = undefined;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Failed!');
      })
  }
  setPage(pages : number){
   const categoryObservable = this.categoryService.getCategorysByParam(pages,this.searchData);
      categoryObservable.subscribe(
      (categorys: Category[]) => {

        this.categorys = categorys['data'];
        this.totalpages= categorys['pages'];
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
