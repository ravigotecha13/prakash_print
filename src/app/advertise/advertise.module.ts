import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { AdvertiseComponent } from './advertise.component';
import { AdvertiseListComponent } from './advertise-list/advertise-list.component';
import { AdvertiseCreateComponent } from './advertise-create/advertise-create.component';
import { AdvertiseService } from './shared/advertise.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'advertise',
    component: AdvertiseComponent,
    children: [
      { path: '', component: AdvertiseListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: AdvertiseCreateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    AdvertiseComponent,
    AdvertiseListComponent,
    AdvertiseCreateComponent,
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
    AdvertiseService,
  ]
})
export class AdvertiseModule { }
