import { Component } from '@angular/core';
import { AuthService } from '../../auth/shared/auth.service';
import { Router,NavigationEnd } from '@angular/router';
import {filter} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: "bwm-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent {	
  subscription: Subscription;
  visible : true;
  hideShowMenu1 : boolean = false;
  hideShowMenu2 : boolean = false;
  hideShowMenu : boolean = false;
  constructor(public auth: AuthService,private router: Router) {}

  search(city: string) {
    city ? this.router.navigate([`/rentals/${city}/homes`]) : this.router.navigate(['/rentals']);
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
 this.subscription = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => window.scrollTo(0, 0));
  }
}
