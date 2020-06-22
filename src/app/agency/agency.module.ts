import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { AgencyComponent } from './agency.component';
import { AgencyListComponent } from './agency-list/agency-list.component';
import { AgencyCreateComponent } from './agency-create/agency-create.component';
import { AgencyService } from './shared/agency.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'agency',
    component: AgencyComponent,
    children: [
      { path: '', component: AgencyListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: AgencyCreateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    AgencyComponent,
    AgencyListComponent,
    AgencyCreateComponent,
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
    AgencyService,
  ]
})
export class AgencyModule { }
