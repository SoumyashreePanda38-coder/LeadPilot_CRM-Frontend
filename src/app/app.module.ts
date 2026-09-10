import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';

import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { ServiceWorkerModule } from '@angular/service-worker';


@NgModule({

  declarations: [

    AppComponent

  ],

  imports: [

    // =========================================================
    // ANGULAR MODULES
    // =========================================================

    BrowserModule,

    BrowserAnimationsModule,

    HttpClientModule,

    FormsModule,

    ReactiveFormsModule,

    NgChartsModule,


    // =========================================================
    // TOAST NOTIFICATIONS
    // =========================================================

    ToastrModule.forRoot({

      positionClass: 'toast-top-right',

      preventDuplicates: true,

      closeButton: true,

      progressBar: true,

      timeOut: 3000

    }),


    // =========================================================
    // APPLICATION MODULES
    // =========================================================

    CoreModule,

    SharedModule,

    LayoutModule,


    // =========================================================
    // ROUTING
    // =========================================================

    AppRoutingModule,


    // =========================================================
    // SERVICE WORKER / PWA
    // =========================================================

    ServiceWorkerModule.register(
      'ngsw-worker.js',
      {

        enabled: !isDevMode(),

        // Register the ServiceWorker as soon as
        // the application is stable or after 30 seconds
        // whichever comes first.

        registrationStrategy:
          'registerWhenStable:30000'

      }
    )

  ],


  // =========================================================
  // GLOBAL HTTP INTERCEPTORS
  // =========================================================

  providers: [

    {
      provide: HTTP_INTERCEPTORS,

      useClass: JwtInterceptor,

      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,

      useClass: ErrorInterceptor,

      multi: true
    }

  ],


  // =========================================================
  // BOOTSTRAP
  // =========================================================

  bootstrap: [

    AppComponent

  ]

})


export class AppModule { }