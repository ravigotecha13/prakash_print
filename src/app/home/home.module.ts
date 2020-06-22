import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthGuard } from '../auth/shared/auth.guard';
import { HomeService } from './shared/home.service';
import { ProfileComponent } from './profile/profile.component';
import { AuthModule } from '../auth/auth.module';

import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent,canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthModule
  ],
  providers: [
  HomeService

  ]
})
export class HomeModule { }
