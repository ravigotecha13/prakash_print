import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { DirectoryComponent } from './directory.component';
import { DirectoryListComponent } from './directory-list/directory-list.component';
import { DirectoryCreateComponent } from './directory-create/directory-create.component';
import { DirectoryUpdateComponent } from './directory-update/directory-update.component';

import { SocialTalentsComponent } from './socialtalent/socialtalent.component';

import { DirectoryService } from './shared/directory.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'directory',
    component: DirectoryComponent,
    children: [
      { path: '', component: DirectoryListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: DirectoryCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: DirectoryUpdateComponent, canActivate: [AuthGuard] },
      { path: 'social_talents', component: SocialTalentsComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    DirectoryComponent,
    DirectoryListComponent,
    DirectoryCreateComponent,
    DirectoryUpdateComponent,
    SocialTalentsComponent

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
    DirectoryService,
  ]
})
export class DirectoryModule { }
