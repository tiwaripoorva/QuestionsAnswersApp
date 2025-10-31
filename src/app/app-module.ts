import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { Dashboard } from './component/dashboard/dashboard';
import { SignUp } from './component/sign-up/sign-up';
import { Navbar } from './component/navbar/navbar';
import { Footer } from './component/footer/footer';
import { Home } from './component/home/home';
import { Login } from './component/login/login';
import { Error } from './component/error/error';
import { AddQuestions } from './component/add-questions/add-questions';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    App,
    Dashboard,
    Footer,
    Home,
    Error
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    Login,
    SignUp,
    Navbar,
    CommonModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
