import { Component } from '@angular/core';
import { AuthService } from './auth/shared/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  componentTitle = "I am component from component.ts"
  constructor(private router:Router,public auth: AuthService) {}
  handleClick() {
    alert("I AM CLICKED");
  }
 
   ngOnInit() {

  }
}
