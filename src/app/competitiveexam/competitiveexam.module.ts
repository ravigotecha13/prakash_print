import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { CompetitiveExamComponent } from './competitiveexam.component';
import { CompetitiveExamListComponent } from './competitiveexam-list/competitiveexam-list.component';
import { CompetitiveExamCreateComponent } from './competitiveexam-create/competitiveexam-create.component';
import { CompetitiveExamUpdateComponent } from './competitiveexam-update/competitiveexam-update.component';

import { CompetitiveExamService } from './shared/competitiveexam.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'competitiveexam',
    component: CompetitiveExamComponent,
    children: [
      { path: '', component: CompetitiveExamListComponent,canActivate: [AuthGuard] },
      { path: 'new', component: CompetitiveExamCreateComponent, canActivate: [AuthGuard] },
      { path: ':newsId/edit', component: CompetitiveExamUpdateComponent, canActivate: [AuthGuard] },
    ]
  }
]


@NgModule({
  declarations: [
    CompetitiveExamComponent,
    CompetitiveExamListComponent,
    CompetitiveExamCreateComponent,
    CompetitiveExamUpdateComponent

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
    CompetitiveExamService,
  ]
})
export class CompetitiveExamModule { }
