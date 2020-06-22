import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './shared/home.service';
import { AuthService } from '../auth/shared/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'bwm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loginForm: FormGroup;
  homeData: any[] = [];

  errors: any[] = [];
  notifyMessage: string = '';
  hideheader: true;

  constructor(private fb: FormBuilder,
              private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private homeService: HomeService
              ) { }

  ngOnInit() {
    this.initForm();
   const homeObservable = this.homeService.getHomeData();


      homeObservable.subscribe(
      (homeData: []) => {

        console.log(homeData);

         this.homeData = homeData;  

      },
      (err) => {
//       this.listalert = '';
      },
      () => {
      });





    this.route.params.subscribe((params) => {
      if (params['registered'] === 'success') {
        this.notifyMessage = 'You have been succesfuly registered, you can login now!';
      }
    })
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
                   Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      password: ['', Validators.required]
    })
  }

  isInvalidForm(fieldName): boolean {
    return this.loginForm.controls[fieldName].invalid &&
           (this.loginForm.controls[fieldName].dirty || this.loginForm.controls[fieldName].touched)
  }


  isRequired(fieldName): boolean {
    return this.loginForm.controls[fieldName].errors.required
  }

  login() {
    this.auth.login(this.loginForm.value).subscribe(
      (token) => {
        this.router.navigate(['/rentals']);
      },
      (errorResponse) => {
        this.errors = errorResponse.error.errors;
      })
  }
}
