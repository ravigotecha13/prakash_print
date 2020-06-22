import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxSortableModule } from 'ngx-sortable';
import { SortablejsOptions } from 'angular-sortablejs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { NewspaperComponent } from './newspaper.component';
import { NewspaperListComponent } from './newspaper-list/newspaper-list.component';
import { NewspaperCreateComponent } from './newspaper-create/newspaper-create.component';
import { NewspaperUpdateComponent } from './newspaper-update/newspaper-update.component';

import { RentalService } from './shared/rental.service';
import { NewspaperService } from './shared/newspaper.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'newspaper',
    component: NewspaperComponent,
    children: [
      { path: '', component: NewspaperListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: NewspaperCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: NewspaperUpdateComponent, canActivate: [AuthGuard] },
/*      { path: ':rentalId', component: RentalDetailComponent},
      { path: ':city/homes', component: RentalSearchComponent}*/
    ]
  }
]


@NgModule({
  declarations: [
    NewspaperComponent,
    NewspaperListComponent,
    NewspaperCreateComponent,
    NewspaperUpdateComponent

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
    NewspaperService,
  ]
})
export class NewspaperModule { }
