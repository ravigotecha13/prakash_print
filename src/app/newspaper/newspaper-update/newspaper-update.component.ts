import { Component, OnInit } from '@angular/core';
import { Newspaper } from '../shared/newspaper.model';
import { NewspaperService } from '../shared/newspaper.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-newspaper-update',
  templateUrl: './newspaper-update.component.html',
  styleUrls: ['./newspaper-update.component.scss']
})
export class NewspaperUpdateComponent  implements OnInit {

  newspaper: Newspaper;
  base64textString : string = '';
  newspaperagency = Newspaper.AGENCY;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private newspaperService: NewspaperService,
              private toastr: ToastrService,
              private upperPipe: UcWordsPipe) {

//   this.transformLocation = this.transformLocation.bind(this);

  }

  ngOnInit() {
  this.newspaper = new Newspaper();
    this.route.params.subscribe(
      (params) => {
        this.getNewspaper(params['newsId']);
      })
  }

  transformLocation(location: string): string {
    return this.upperPipe.transform(location);
  }

  getNewspaper(newspaperId: string) {
    this.newspaperService.getNewspaperById(newspaperId).subscribe(
      (newspaper: Newspaper) => {
        this.newspaper = newspaper;
//        this.base64textString='assets/public/'+newspaper.image;
//        this.newspaper.image='';

       // console.log(this.newspaper);
      });
  }
  getimageFile(evt){
      var files = evt.target.files;
      var file = files[0];
    
    if (files && file) {
        var reader = new FileReader();

        reader.onload =this._handleReaderLoaded.bind(this);

        reader.readAsBinaryString(file);
    }
  }
  
  _handleReaderLoaded(e) {
    
    this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
//    this.newspaper.image=this.base64textString;
    }
  updateNewspaper() {
  
    this.newspaperService.updateDental(this.newspaper._id, this.newspaper).subscribe(
      (updatedNewspaper: Newspaper) => {
      console.log(updatedNewspaper);
        this.newspaper = updatedNewspaper;
//        this.base64textString='./assets/public/'+updatedNewspaper.image;
//        this.newspaper.image='';
        this.newspaper.tmpimage = "";
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getNewspaper(newspaperId);
      })
  }

}
