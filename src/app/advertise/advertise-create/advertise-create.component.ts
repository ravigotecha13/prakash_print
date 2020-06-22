import { Component, OnInit } from '@angular/core';
import { Advertise } from '../shared/advertise.model';
import { AdvertiseService } from '../shared/advertise.service';
import { CityService } from '../../city/shared/city.service';
import { CategoryService } from '../../category/shared/category.service';
import { Router,RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'bwm-advertise-create',
  templateUrl: './advertise-create.component.html',
  styleUrls: ['./advertise-create.component.scss']
})
export class AdvertiseCreateComponent implements OnInit {

  newAdvertise: Advertise;
  base64textString : string = '';
  base64textString1 : string = '';
  base64textString2 : string = '';
  errors: any[] = [];
  citylist : [];
  categorylist : [];
  categoryId : any[];
  disableloading : any = false;
  sectionlist = Advertise.SECTION;

  constructor(private toastr: ToastrService,
              private advertiseService: AdvertiseService,
              private cityService: CityService,
              private categoryService: CategoryService,
              private router: Router) { }

  ngOnInit() {
    this.newAdvertise = new Advertise();
    this.newAdvertise.section = 'slider';
    this.newAdvertise.pagetype = 'Home';
    this.getCityList();
  }
  getCityList() {
    this.cityService.getCityList().subscribe(
      (city: any) => {
        this.citylist = city;
        this.newAdvertise.city=city[0]._id;

      },
      () => {

      })
    this.categoryService.getCategoryList().subscribe(
      (category: any) => {
    
         this.categorylist = category;
         this.newAdvertise.category='All';
         this.categoryId = this.categorylist.map(item => { return item['_id']; })
      },
      () => {

      })


       

  }


  getimageFile(evt,imgtype){
      var files = evt.target.files;
      var file = files[0];
    console.log(imgtype);
    if (files && file) {
        var reader = new FileReader();

        if(imgtype == 'leftimage'){
          reader.onload =this._handleReaderLoaded.bind(this);
          reader.readAsBinaryString(file);
        }
        else if(imgtype == 'bottomimage'){
          reader.onload =this._handleReaderLoaded1.bind(this);
          reader.readAsBinaryString(file);

        }
        else{
          reader.onload =this._handleReaderLoaded2.bind(this);
          reader.readAsBinaryString(file);

        }
    }
  }
  
  _handleReaderLoaded(e) {
        this.base64textString= ('data:image/png;base64,' + btoa(e.target.result));
        this.newAdvertise.leftimage=this.base64textString;
  }
  _handleReaderLoaded1(e) {
        this.base64textString1= ('data:image/png;base64,' + btoa(e.target.result));
        this.newAdvertise.bottomimage=this.base64textString1;

  }
  _handleReaderLoaded2(e) {
        this.base64textString2= ('data:image/png;base64,' + btoa(e.target.result));
        this.newAdvertise.sliderimage=this.base64textString2;
//        console.log(this.newAdvertise.sliderimage);

  }

  createAdvertise() {

    this.disableloading =true;
    if(this.newAdvertise.category =='All')
    {
        this.newAdvertise.isCategory = 'All';

    }
    this.advertiseService.createAdvertise(this.newAdvertise).subscribe(
      (advertise: Advertise) => {
        this.disableloading =false;
        this.newAdvertise.name = "";
        this.newAdvertise.tmpimage = "";
        this.newAdvertise.sliderimage ="";
        this.newAdvertise.leftimage ="";
        this.newAdvertise.bottomimage ="";
        this.newAdvertise.category='All';
        this.base64textString="";
        this.base64textString1="";
        this.base64textString2="";
       this.toastr.success('Record Added Successfully', 'Success!');
      },
      (errorResponse: HttpErrorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }

}
