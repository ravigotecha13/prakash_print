import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ImageUploadModule } from '../common/components/image-upload/image-upload.module';
import { EditableModule } from '../common/components/editable/editable.module';

import { VideoinquiryComponent } from './videoinquiry.component';
import { VideoinquiryListComponent } from './videoinquiry-list/videoinquiry-list.component';

import { VideoinquiryService } from './shared/videoinquiry.service';

import { AuthGuard } from '../auth/shared/auth.guard';

const routes: Routes = [
  { path: 'videoinquiry',
    component: VideoinquiryComponent,
    children: [
      { path: '', component: VideoinquiryListComponent,canActivate: [AuthGuard] }
    ]
  }
]


@NgModule({
  declarations: [
    VideoinquiryComponent,
    VideoinquiryListComponent,
//    VideoinquiryCreateComponent,
//    VideoinquiryUpdateComponent

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
    VideoinquiryService,
  ]
})
export class VideoinquiryModule { }
