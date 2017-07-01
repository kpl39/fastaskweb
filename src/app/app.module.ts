import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdButtonModule, MdCheckboxModule, MdCardModule, MdListModule, MdIconModule, MdInputModule, MdSelectModule } from '@angular/material';
import { Ng2FileDropModule }  from 'ng2-file-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import {ChartModule} from 'angular2-highcharts';
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import { SlickCarouselComponent } from '../components/slick-carousel';




import { AppComponent } from './app.component';
import { CustomersComponent } from '../pages/customers/customers.component';
import { FeaturesComponent } from '../pages/features/features.component';
import { HomeComponent } from '../pages/home/home.component';
import { MenuBarComponent } from '../pages/menu/menu.component';
import { ModelsComponent } from '../pages/models/models.component';

import { AuthService } from '../services/auth.service';
import { ChartService } from '../services/chart.service';
import { ModelService } from '../services/models.service';




const appRoutes: Routes = [
  { path: 'models', component: ModelsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'home', component: HomeComponent},
  { path: 'features', component: FeaturesComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: HomeComponent }
];

declare var require: any;
export function highchartsFactory() {
    const hc = require('highcharts/highstock');
    const dd = require('highcharts/modules/exporting');
    dd(hc);
    return hc;
}

const firebaseConfig = {
    apiKey: "AIzaSyA_83XNGILrHGYhUcjrWcoj46AHGK8_EwM",
    authDomain: "fastask-f8319.firebaseapp.com",
    databaseURL: "https://fastask-f8319.firebaseio.com",
    projectId: "fastask-f8319",
    storageBucket: "fastask-f8319.appspot.com",
    messagingSenderId: "495065049502"
};

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    FeaturesComponent, 
    HomeComponent,
    MenuBarComponent,
    ModelsComponent, 
    SlickCarouselComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MdButtonModule, MdCheckboxModule, MdCardModule, MdListModule, MdIconModule, MdInputModule, MdSelectModule,
    Ng2FileDropModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    ReCaptchaModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, 'fastaskweb'),
    AngularFireAuthModule,
    ChartModule
  ],
  providers: [
    AuthService,
    ChartService,
    ModelService,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
	  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
