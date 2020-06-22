import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { NewslinkComponent } from './newslink.component';
import { NewslinkListComponent } from './newslink-list/newslink-list.component';
import { NewslinkCreateComponent } from './newslink-create/newslink-create.component';
import { NewslinkUpdateComponent } from './newslink-update/newslink-update.component';

import { NewslinkService } from './shared/newslink.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'newslink',
    component: NewslinkComponent,
    children: [
      { path: '', component: NewslinkListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: NewslinkCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: NewslinkUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    NewslinkComponent,
    NewslinkListComponent,
    NewslinkCreateComponent,
    NewslinkUpdateComponent

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
    NewslinkService,
  ]
})
export class NewslinkModule { }
