import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { VideoadsComponent } from './videoads.component';
import { VideoadsListComponent } from './videoads-list/videoads-list.component';
import { VideoadsCreateComponent } from './videoads-create/videoads-create.component';

import { VideoadsService } from './shared/videoads.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'videoads',
    component: VideoadsComponent,
    children: [
      { path: '', component: VideoadsListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: VideoadsCreateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    VideoadsComponent,
    VideoadsListComponent,
    VideoadsCreateComponent,

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
    VideoadsService,
  ]
})
export class VideoadsModule { }
