import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent implements OnInit {

  newCategory: Category;
  errors: any[] = [];

  disableloading : any = false;

  constructor(private toastr: ToastrService,
              private categoryService: CategoryService,
              private router: Router) { }

  ngOnInit() {
    this.newCategory = new Category();
  }

  createCategory() {
    
    this.disableloading =true;
    this.categoryService.createCategory(this.newCategory).subscribe(
      (category: Category) => {
        this.disableloading =false;
        this.newCategory.name = "";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
        this.disableloading =false;
         this.toastr.warning('Already Exists', 'Warning!');
      })
  }

}
