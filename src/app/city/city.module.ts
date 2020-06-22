import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { CityComponent } from './city.component';
import { CityListComponent } from './city-list/city-list.component';
import { CityCreateComponent } from './city-create/city-create.component';
import { CityUpdateComponent } from './city-update/city-update.component';

import { CityService } from './shared/city.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'city',
    component: CityComponent,
    children: [
      { path: '', component: CityListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: CityCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: CityUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    CityComponent,
    CityListComponent,
    CityCreateComponent,
    CityUpdateComponent

  ],
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    EditableModule,
    ReactiveFormsModule,
    ImageUploadModule
  ],
  providers: [
    CityService,
  ]
})
export class CityModule { }
