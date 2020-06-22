import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';


import { FarmercornerComponent } from './farmercorner.component';
import { FarmercornerListComponent } from './farmercorner-list/farmercorner-list.component';
import { FarmercornerCreateComponent } from './farmercorner-create/farmercorner-create.component';
import { FarmercornerUpdateComponent } from './farmercorner-update/farmercorner-update.component';

import { FarmercornerService } from './shared/farmercorner.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'farmercorner',
    component: FarmercornerComponent,
    children: [
          {path: '', component: FarmercornerListComponent,canActivate: [AuthGuard]},
          { path: 'new', component: FarmercornerCreateComponent, canActivate: [AuthGuard] },
          { path: ':farmercornerId/edit', component: FarmercornerUpdateComponent, canActivate: [AuthGuard] },
  
    ]
  }
]


@NgModule({
  declarations: [
    FarmercornerComponent,
    FarmercornerListComponent,
    FarmercornerCreateComponent,
    FarmercornerUpdateComponent

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
    FarmercornerService,
  ]
})
export class FarmercornerModule { }
