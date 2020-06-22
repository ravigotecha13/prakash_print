import { Component, OnInit } from '@angular/core';
import { User } from '../shared/User.model';
import { HomeService } from '../shared/home.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthService } from '../../auth/shared/auth.service';

@Component({
  selector: 'bwm-profile-update',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent  implements OnInit {

  user: User;
  disableloading : any = false;

  constructor(private route: ActivatedRoute,
              private homeService: HomeService,
              private toastr: ToastrService,
              private auth: AuthService,

              ) {

  }

  ngOnInit() {
    this.getUser(this.auth.getUserId())

  }

  getUser(userId: string) {
    this.homeService.getUserById(this.auth.getUserId()).subscribe(
      (user: User) => {
       this.user = user;
       this.user.password = "";
      });
  }

  getDirectory(directoryId: string) {
    // this.directoryService.getDirectoryById(directoryId).subscribe(
    //   (directory: Directory) => {
    //   console.log(directory);
    //     this.directory = directory;
    //     this.directory.name = directory.name;
    //     this.directory.number = directory.number;
    //     this.directory.address = directory.address;

    //    console.log(this.directory);
    //   });
  }
  updateUser() {
    this.disableloading =true;
  
    this.homeService.updateUser(this.auth.getUserId(), this.user).subscribe(
      (updatedUser: User) => {
      console.log(updatedUser);
        this.disableloading =false;
        this.user = updatedUser;
        this.user.password = "";
         this.toastr.success('Record Updated Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.toastr.error(errorResponse.error.errors[0].detail, 'Error');
//        this.getDirectory(directoryId);
      })
  }

}
