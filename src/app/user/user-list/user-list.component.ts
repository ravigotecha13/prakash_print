import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { User } from '../shared/user.model';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import * as XLSX from 'xlsx';
@Component({
  selector: 'bwm-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  users: User[] = [];
 // users.pages : number = 0;
 // users['data'] : [];
  pagingOptions: [];
  searchData : string = '';
  currentPage : number = 1;
  currentindex : number = 1;
  userDeleteIndex: number;
  listalert : string = '';
  deleteRecord: any = false;

  totalpages : number = 0;
  totalrecord : number = 0;
  pages: number = 0;

  constructor(private userService: UserService,
              private toastr: ToastrService) { }




  ngOnInit() {
    this.getalldata(this.searchData);
  }
  getalldata(searchData){
    this.listalert = 'Getting...';
    const userObservable = this.userService.getUsers(searchData);

      userObservable.subscribe(
      (users: User[]) => {
        this.listalert = '';
      console.log(users);
        this.users = users['data'];
        this.totalpages= users['pages'];
        this.totalrecord= users['totalRecord'];
        this.setPage(1);
      if(this.currentPage >1){
        this.currentindex = ((this.currentPage - 1) * 10) + 1;
      }else{
        this.currentindex = 1;

      }


        if(this.users.length === 0){
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
  setPage(pages : number){
   const userObservable = this.userService.getUsersByParam(pages,this.searchData);
      userObservable.subscribe(
      (users: User[]) => {

        this.users = users['data'];
        this.totalpages= users['pages'];
        this.totalrecord= users['totalRecord'];
        this.currentPage = pages;

      if(this.currentPage >1){
        this.currentindex = ((this.currentPage - 1) * 10) + 1;
      }else{
        this.currentindex = 1;

      }


      },
      (err) => {
      },
      () => {
      });

  }

  Datetoday() { 
      var currentdate = new Date(); 
    return ((currentdate.getDate() < 10)?"0":"") + currentdate.getDate() +"_"+(((currentdate.getMonth()+1) < 10)?"0":"") + (currentdate.getMonth()+1) +"_"+ currentdate.getFullYear();
  }
  DatetimeNow() {
      var currentdate = new Date(); 
       return ((currentdate.getHours() < 10)?"0":"") + currentdate.getHours() +"_"+ ((currentdate.getMinutes() < 10)?"0":"") + currentdate.getMinutes() +"_"+ ((currentdate.getSeconds() < 10)?"0":"") + currentdate.getSeconds();
  }
  getCurDate(udate){
   var today = new Date(udate);
   console.log(today);
    var dd = ("0" + today.getDate()).slice(-2);
    var mm = ("0" + (today.getMonth() + 1)).slice(-2); //As January is 0.
    var yyyy = today.getFullYear();
   console.log(dd);

    // if(dd<10) {  dd=0+dd };
    // if(mm<10){ mm+='0'+mm };
    return (dd+'-'+mm+'-'+yyyy);

  }

  exportUser(){
    const readyToExport = [
      {id: 1, name: 'a'},
      {id: 2, name: 'b'},
      {id: 3, name: 'c'}
    ];    
    const getAllRecord = this.userService.getAllUsers();
      getAllRecord.subscribe(
      (users: User[]) => {

        var users = users['data'];
        var expodata = [];
          for (var x in users) {
            var tmpdata = [];
            tmpdata['Name']= users[x]['name'];
            tmpdata['NickName']  = users[x]['patname'];
            tmpdata['MobileNumber'] = users[x]['mobileno'];
            tmpdata['City'] =users[x]['city'];
            tmpdata['Date'] = this.getCurDate(users[x]['createdAt']);
            expodata.push(tmpdata);
          }
        var datetime = this.Datetoday() + "_" + this.DatetimeNow();
        console.log(datetime);

        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(expodata);
        XLSX.utils.book_append_sheet(workBook, workSheet, 'data'); // add the worksheet to the book
        XLSX.writeFile(workBook, 'users_'+datetime+'.xlsx'); // initiate a file download in browser


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
