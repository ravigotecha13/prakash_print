import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { PressnoteComponent } from './pressnote.component';
import { PressnoteListComponent } from './pressnote-list/pressnote-list.component';

import { PressnoteService } from './shared/pressnote.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'pressnote',
    component: PressnoteComponent,
    children: [
      { path: '', component: PressnoteListComponent,canActivate: [AuthGuard] }
    ]
  }
]


@NgModule({
  declarations: [
    PressnoteComponent,
    PressnoteListComponent,
//    PressnoteCreateComponent,
//    PressnoteUpdateComponent

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
    PressnoteService,
  ]
})
export class PressnoteModule { }
