import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';

import { HomeComponent } from './home/home.component';
import { HomeModule } from './home/home.module';

import { HomenewsComponent } from './homenews/homenews.component';
import { HomenewsModule } from './homenews/homenews.module';

import { NewspaperComponent } from './newspaper/newspaper.component';
import { NewspaperModule } from './newspaper/newspaper.module';

import { NewschannelComponent } from './newschannel/newschannel.component';
import { NewschannelModule } from './newschannel/newschannel.module';

import { SocialtalentsComponent } from './socialtalents/socialtalents.component';
import { SocialtalentsModule } from './socialtalents/socialtalents.module';

import { NewslinkComponent } from './newslink/newslink.component';
import { NewslinkModule } from './newslink/newslink.module';

import { CityComponent } from './city/city.component';
import { CityModule } from './city/city.module';

import { PressnoteComponent } from './pressnote/pressnote.component';
import { PressnoteModule } from './pressnote/pressnote.module';

import { HistoricalKnowledgeComponent } from './historicalknowledge/historicalknowledge.component';
import { HistoricalKnowledgeModule } from './historicalknowledge/historicalknowledge.module';

import { CategoryComponent } from './category/category.component';
import { CategoryModule } from './category/category.module';

import { DirectoryComponent } from './directory/directory.component';
import { DirectoryModule } from './directory/directory.module';

import { BloodComponent } from './blood/blood.component';
import { BloodModule } from './blood/blood.module';


import { NewsliveComponent } from './newslive/newslive.component';
import { NewsliveModule } from './newslive/newslive.module';

import { TeacherStudentComponent } from './teacherstudent/teacherstudent.component';
import { TeacherStudentModule } from './teacherstudent/teacherstudent.module';

import { CompetitiveExamComponent } from './competitiveexam/competitiveexam.component';
import { CompetitiveExamModule } from './competitiveexam/competitiveexam.module';


import { FarmercornerComponent } from './farmercorner/farmercorner.component';
import { FarmercornerModule } from './farmercorner/farmercorner.module';

import { AdvertiseComponent } from './advertise/advertise.component';
import { AdvertiseModule } from './advertise/advertise.module';

import { AgencyComponent } from './agency/agency.component';
import { AgencyModule } from './agency/agency.module';

import { SponsoredadsComponent } from './sponsoredads/sponsoredads.component';
import { SponsoredadsModule } from './sponsoredads/sponsoredads.module';

import { NotificationComponent } from './notification/notification.component';
import { NotificationModule } from './notification/notification.module';

import { VideoadsComponent } from './videoads/videoads.component';
import { VideoadsModule } from './videoads/videoads.module';

import { VideoinquiryComponent } from './videoinquiry/videoinquiry.component';
import { VideoinquiryModule } from './videoinquiry/videoinquiry.module';


import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/shared/auth.guard';
import { UserModule } from './user/user.module';

import { SortablejsOptions } from 'angular-sortablejs';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full',canActivate: [AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HomeModule,
    HomenewsModule,
    NewspaperModule,

    NewschannelModule,
    SocialtalentsModule,
    NewslinkModule,
    CityModule,
    CategoryModule,
    PressnoteModule,
    HistoricalKnowledgeModule,
    DirectoryModule,
    BloodModule,
    NewsliveModule,
    TeacherStudentModule,
    CompetitiveExamModule,
    FarmercornerModule,
    AdvertiseModule,
    AgencyModule, 
    SponsoredadsModule,
    NotificationModule,
    VideoadsModule,
    VideoinquiryModule,
    
    AuthModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    UserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
