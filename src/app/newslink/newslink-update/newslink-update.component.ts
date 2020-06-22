import { Component, OnInit } from '@angular/core';
import { Newslink } from '../shared/newslink.model';
import { NewslinkService } from '../shared/newslink.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { UcWordsPipe } from 'ngx-pipes';

import { Subject } from 'rxjs';

@Component({
  selector: 'bwm-newslink-update',
  templateUrl: './newslink-update.component.html',
  styleUrls: ['./newslink-update.component.scss']
})
export class NewslinkUpdateComponent  implements OnInit {

  newslink: Newslink;
  disableloading : any = false;
 
  locationSubject: Subject<any> = new Subject();

  constructor(private route: ActivatedRoute,
              private newslinkService: NewslinkService,
              private toastr: ToastrService,
              private upperPipe: UcWordsPipe) {


  }

  ngOnInit() {
  this.newslink = new Newslink();
    this.route.params.subscribe(
      (params) => {
        this.getNewslink(params['newsId']);
      })
  }


  getNewslink(newslinkId: string) {
    this.newslinkService.getNewslinkById(newslinkId).subscribe(
      (newslink: Newslink) => {
        this.newslink = newslink;

        console.log(this.newslink);
      });
  }

  updateNewslink() {
      this.disableloading =true;

    this.newslinkService.updateDental(this.newslink._id, this.newslink).subscribe(
      (updatedNewslink: Newslink) => {
      console.log(updatedNewslink);
        this.disableloading =false;
        this.newslink = updatedNewslink;
        this.toastr.success('Data Changed Successfully ', 'Success');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getNewslink(newslinkId);
      })
  }

}
