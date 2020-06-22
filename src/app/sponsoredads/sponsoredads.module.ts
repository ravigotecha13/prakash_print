import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { SponsoredadsComponent } from './sponsoredads.component';
import { SponsoredadsListComponent } from './sponsoredads-list/sponsoredads-list.component';
import { SponsoredadsCreateComponent } from './sponsoredads-create/sponsoredads-create.component';
import { SponsoredadsUpdateComponent } from './sponsoredads-update/sponsoredads-update.component';
import { SponsoredadsService } from './shared/sponsoredads.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'sponsoredads',
    component: SponsoredadsComponent,
    children: [
      { path: '', component: SponsoredadsListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: SponsoredadsCreateComponent, canActivate: [AuthGuard] },
      { path: ':sponsorid/edit', component: SponsoredadsUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    SponsoredadsComponent,
    SponsoredadsListComponent,
    SponsoredadsCreateComponent,
    SponsoredadsUpdateComponent,
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
    SponsoredadsService,
  ]
})
export class SponsoredadsModule { }
