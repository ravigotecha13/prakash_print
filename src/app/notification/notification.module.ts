import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { NotificationComponent } from './notification.component';
import { NotificationListComponent } from './notification-list/notification-list.component';
import { NotificationCreateComponent } from './notification-create/notification-create.component';
import { NotificationService } from './shared/notification.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'notification',
    component: NotificationComponent,
    children: [
      { path: '', component: NotificationListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: NotificationCreateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    NotificationComponent,
    NotificationListComponent,
    NotificationCreateComponent,
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
    NotificationService,
  ]
})
export class NotificationModule { }
