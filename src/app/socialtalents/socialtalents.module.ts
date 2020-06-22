import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { SocialtalentsComponent } from './socialtalents.component';
import { SocialtalentsListComponent } from './socialtalents-list/socialtalents-list.component';
import { SocialtalentsCreateComponent } from './socialtalents-create/socialtalents-create.component';
import { SocialtalentsUpdateComponent } from './socialtalents-update/socialtalents-update.component';

import { SocialtalentsService } from './shared/socialtalents.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'socialtalents',
    component: SocialtalentsComponent,
    children: [
      { path: '', component: SocialtalentsListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: SocialtalentsCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: SocialtalentsUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    SocialtalentsComponent,
    SocialtalentsListComponent,
    SocialtalentsCreateComponent,
    SocialtalentsUpdateComponent

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
    SocialtalentsService,
  ]
})
export class SocialtalentsModule { }
