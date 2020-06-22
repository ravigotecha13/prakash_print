import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { NewsliveComponent } from './newslive.component';
import { NewsliveListComponent } from './newslive-list/newslive-list.component';
import { NewsliveCreateComponent } from './newslive-create/newslive-create.component';
import { NewsliveUpdateComponent } from './newslive-update/newslive-update.component';

import { NewsliveService } from './shared/newslive.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'newslive',
    component: NewsliveComponent,
    children: [
      { path: '', component: NewsliveListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: NewsliveCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: NewsliveUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    NewsliveComponent,
    NewsliveListComponent,
    NewsliveCreateComponent,
    NewsliveUpdateComponent

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
    NewsliveService,
  ]
})
export class NewsliveModule { }
