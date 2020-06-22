import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSortableModule } from 'ngx-sortable';
import { SortablejsOptions } from 'angular-sortablejs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { HomenewsComponent } from './homenews.component';
import { HomenewsListComponent } from './homenews-list/homenews-list.component';
import { HomenewsCreateComponent } from './homenews-create/homenews-create.component';

import { RentalService } from './shared/rental.service';
import { HomenewsService } from './shared/homenews.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'homenews',
    component: HomenewsComponent,
    children: [
      { path: '', component: HomenewsListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: HomenewsCreateComponent, canActivate: [AuthGuard] },
   
    ]
  }
]


@NgModule({
  declarations: [
    HomenewsComponent,
    HomenewsListComponent,
    HomenewsCreateComponent
   

  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    EditableModule,
    ReactiveFormsModule,
    ImageUploadModule,
    NgxSortableModule
  ],
  providers: [
    RentalService,
    HomenewsService,
  ]
})
export class HomenewsModule { }
