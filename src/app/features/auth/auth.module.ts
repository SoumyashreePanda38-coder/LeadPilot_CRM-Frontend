import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({

  declarations: [

    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent

  ],

  imports: [

    CommonModule,

    FormsModule,
    ReactiveFormsModule,

    SharedModule,

    AuthRoutingModule

  ]

})
export class AuthModule { }