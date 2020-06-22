import { Component, OnInit } from '@angular/core';
import { Directory } from '../shared/directory.model';
import { DirectoryService } from '../shared/directory.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { CityService } from '../../city/shared/city.service';
import { CategoryService } from '../../category/shared/category.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-directory-update',
  templateUrl: './directory-update.component.html',
  styleUrls: ['./directory-update.component.scss']
})
export class DirectoryUpdateComponent  implements OnInit {

  directory: Directory;
  citylist : [];
  categorylist : [];
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private directoryService: DirectoryService,
              private toastr: ToastrService,
              private cityService: CityService,
              private categoryService: CategoryService) {

//   this.transformLocation = this.transformLocation.bind(this);

  }

  ngOnInit() {
  this.directory = new Directory();
    this.route.params.subscribe(
      (params) => {
        this.getDirectory(params['newsId']);
      })
    this.getCityList();

    this.getCategoryList();
  }


  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        console.log(city);
      },
      () => {

      })
  }

  getCategoryList() {
   this.categoryService.getCategoryList().subscribe(
      (category: any) => {
    
         this.categorylist = category;
        console.log(category);
      },
      () => {

      })
  }

  getDirectory(directoryId: string) {
    this.directoryService.getDirectoryById(directoryId).subscribe(
      (directory: Directory) => {
      console.log(directory);
        this.directory = directory;
        this.directory.name = directory.name;
        this.directory.number = directory.number;
        this.directory.address = directory.address;

       console.log(this.directory);
      });
  }
  updateDirectory() {
    this.disableloading =true;
  
    this.directoryService.updateDental(this.directory._id, this.directory).subscribe(
      (updatedDirectory: Directory) => {
      console.log(updatedDirectory);
        this.disableloading =false;
        this.directory = updatedDirectory;
         this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getDirectory(directoryId);
      })
  }

}
