import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { BloodComponent } from './blood.component';
import { BloodListComponent } from './blood-list/blood-list.component';
import { BloodCreateComponent } from './blood-create/blood-create.component';
import { BloodUpdateComponent } from './blood-update/blood-update.component';


import { BloodService } from './shared/blood.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'blood',
    component: BloodComponent,
    children: [
      { path: '', component: BloodListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: BloodCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: BloodUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    BloodComponent,
    BloodListComponent,
    BloodCreateComponent,
    BloodUpdateComponent,

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
    BloodService,
  ]
})
export class BloodModule { }
