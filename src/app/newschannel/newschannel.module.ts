import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { NewschannelComponent } from './newschannel.component';
import { NewschannelListComponent } from './newschannel-list/newschannel-list.component';
import { NewschannelCreateComponent } from './newschannel-create/newschannel-create.component';
import { NewschannelUpdateComponent } from './newschannel-update/newschannel-update.component';

import { NewschannelService } from './shared/newschannel.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'newschannel',
    component: NewschannelComponent,
    children: [
      { path: '', component: NewschannelListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: NewschannelCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: NewschannelUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    NewschannelComponent,
    NewschannelListComponent,
    NewschannelCreateComponent,
    NewschannelUpdateComponent

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
    NewschannelService,
  ]
})
export class NewschannelModule { }
