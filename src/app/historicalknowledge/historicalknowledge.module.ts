import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { HistoricalKnowledgeComponent } from './historicalknowledge.component';
import { HistoricalKnowledgeListComponent } from './historicalknowledge-list/historicalknowledge-list.component';

import { HistoricalKnowledgeService } from './shared/historicalknowledge.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'historicalknowledge',
    component: HistoricalKnowledgeComponent,
    children: [
      { path: '', component: HistoricalKnowledgeListComponent,canActivate: [AuthGuard] }
    ]
  }
]


@NgModule({
  declarations: [
    HistoricalKnowledgeComponent,
    HistoricalKnowledgeListComponent,
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
    HistoricalKnowledgeService,
  ]
})
export class HistoricalKnowledgeModule { }
