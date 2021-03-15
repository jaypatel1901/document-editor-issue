import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages.routing.module';
import { PagesComponent } from './pages.component';
import { NotesComponent, MyAccountComponent, DashboardComponent, QuickAcessComponent, NotesWritingComponent, TrashComponent, Subscription,HelpComponent } from './';
import { FooterComponent, HeaderComponent } from '../shared';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// import { AngularEditorModule } from '@kolkov/angular-editor';
import { SearchPipe } from './search.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { NgxStripeModule } from 'ngx-stripe';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerModule } from "ngx-spinner";
import { AngularResizeElementModule } from 'angular-resize-element';
import { ImageCropperModule } from 'ngx-image-cropper';

import {NgxMarkjsModule} from 'ngx-markjs';
import {NgxPrintModule} from 'ngx-print';
import {AutoSizeInputModule} from 'ngx-autosize-input';
// import { TrashComponent } from './trash/trash.component';


// import { MatMomentDateModule } from "@angular/material-moment-adapter";
@NgModule({
  declarations: [
    PagesComponent,
    NotesComponent,
    MyAccountComponent,
    FooterComponent,
    HeaderComponent,
    DashboardComponent,
    QuickAcessComponent,
    NotesWritingComponent,
    TrashComponent,
    Subscription,
    SearchPipe,
    HelpComponent,
  ],

  imports: [
    PagesRoutingModule,
    FormsModule,
    CommonModule,
    BsDatepickerModule,
    AngularEditorModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    NgxSpinnerModule,
    MatProgressBarModule,
    AngularResizeElementModule,ImageCropperModule,
    AngularResizeElementModule,
    NgxMarkjsModule,
    NgxPrintModule,
    AutoSizeInputModule,
    NgxStripeModule.forRoot('pk_test_51I9o5VFheDBxtkR8zgsYUz1CBcOFHpWM1LEvHbU7chibPKpoLpupCvZHwu3vwGzIkVFolltsEHGG1DChCdpuTRBy00Mq4rF562'),
  ],
  providers: [],
})
export class PagesModule { }
