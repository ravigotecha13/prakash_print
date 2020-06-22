import { Component, OnInit } from '@angular/core';
import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss']
})
export class CategoryUpdateComponent  implements OnInit {

  category: Category;
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private categoryService: CategoryService,
              private toastr: ToastrService) {


  }

  ngOnInit() {
  this.category = new Category();
    this.route.params.subscribe(
      (params) => {
        this.getCategory(params['newsId']);
      })
  }


  getCategory(categoryId: string) {
    this.categoryService.getCategoryById(categoryId).subscribe(
      (category: Category) => {
        this.category = category;

        console.log(this.category);
      });
  }

  updateCategory() {
    this.disableloading =true;
    this.categoryService.updateDental(this.category._id, this.category).subscribe(
      (updatedCategory: Category) => {
      console.log(updatedCategory);
        this.disableloading =false;
        this.category = updatedCategory;
        this.toastr.success('Data Changed Successfully ', 'Success');
      },
      (errorResponse: HttpErrorResponse) => {
        this.disableloading =false;
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getCategory(categoryId);
      })
  }

}
