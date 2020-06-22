import { Component, OnInit } from '@angular/core';
import { Directory } from '../shared/directory.model';
import { DirectoryService } from '../shared/directory.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';
import { CityService } from '../../city/shared/city.service';
import { CategoryService } from '../../category/shared/category.service';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-socialtalent-update',
  templateUrl: './socialtalent.component.html',
  styleUrls: ['./socialtalent.component.scss']
})
export class SocialTalentsComponent  implements OnInit {

  directory: Directory;
  base64textString : string = '';
  social : any ={
    image: '',
    img: '',
  };
  constructor(private route: ActivatedRoute,
              private directoryService: DirectoryService,
              private toastr: ToastrService,
              private upperPipe: UcWordsPipe) {


  }

  ngOnInit() {
     this.getSocialtalent();
  }

  transformLocation(location: string): string {
    return this.upperPipe.transform(location);
  }

  getSocialtalent() {
    this.directoryService.getSocialtalent().subscribe(
      (directory: Directory) => {
        this.directory = directory;
        this.base64textString = './assets/public/'+this.directory['image'];

       console.log(this.directory);
      });
  }

  getimageFile(evt){
      var files = evt.target.files;
      var file = files[0];
    console.log(file);
    if (files && file) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
    }
  }
  
  _handleReaderLoaded(e) {

    this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
    this.social.img=this.base64textString;

    }


  updateStaff() {
  
    this.directoryService.updateSocial(this.social).subscribe(
      (updatedDirectory: Directory) => {
      console.log(updatedDirectory);
        this.directory = updatedDirectory;
        this.base64textString = '';
        this.social.img = '';
        this.social.image = '';
         this.getSocialtalent();
         this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getDirectory(directoryId);
      })
  }

}
