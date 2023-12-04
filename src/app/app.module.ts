// app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AgeCalculatorComponent } from './age-calculator/age-calculator.component';

@NgModule({
  declarations: [
    AppComponent,
    AgeCalculatorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule // Import ReactiveFormsModule to use reactive forms
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
