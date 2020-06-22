import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { TeacherStudentDivisionComponent } from './division/division-list.component';
import { TeacherStudentDivisionCreateComponent } from './division-create/division-create.component';
import { TeacherStudentDivisionUpdateComponent } from './division-update/division-update.component';


import { TeacherStudentComponent } from './teacherstudent.component';
import { TeacherStudentListComponent } from './teacherstudent-list/teacherstudent-list.component';
import { TeacherStudentCreateComponent } from './teacherstudent-create/teacherstudent-create.component';
import { TeacherStudentUpdateComponent } from './teacherstudent-update/teacherstudent-update.component';

import { TeacherStudentService } from './shared/teacherstudent.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'teacherstudent',
    component: TeacherStudentComponent,
    children: [
      { path: '', component: TeacherStudentListComponent,canActivate: [AuthGuard] },
      
      { path: 'material', 
        children: [
          {path: '', component: TeacherStudentListComponent,canActivate: [AuthGuard]},
          { path: 'new', component: TeacherStudentCreateComponent, canActivate: [AuthGuard] },
          { path: ':materialId/edit', component: TeacherStudentUpdateComponent, canActivate: [AuthGuard] },

        ]

      },

      { path: 'division', 
        children: [
          {path: '', component: TeacherStudentDivisionComponent,canActivate: [AuthGuard]},
          {path: 'new', component: TeacherStudentDivisionCreateComponent,canActivate: [AuthGuard]},
          {path: ':divisionId/edit', component: TeacherStudentDivisionUpdateComponent,canActivate: [AuthGuard]},
        ]

      },
    ]
  }
]


@NgModule({
  declarations: [
    TeacherStudentComponent,
    TeacherStudentListComponent,
    TeacherStudentDivisionComponent,
    TeacherStudentDivisionCreateComponent,
    TeacherStudentDivisionUpdateComponent,
    TeacherStudentCreateComponent,
    TeacherStudentUpdateComponent

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
    TeacherStudentService,
  ]
})
export class TeacherStudentModule { }
