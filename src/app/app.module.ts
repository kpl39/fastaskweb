import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { MdButtonModule, MdCheckboxModule, MdTooltipModule, MdCardModule, MdListModule, MdIconModule, MdInputModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule, MdRadioModule, MdTabsModule, MdDialogModule, MdProgressSpinnerModule, MdSlideToggleModule, MdGridListModule } from '@angular/material';
import { Ng2FileDropModule }  from 'ng2-file-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { HttpModule } from '@angular/http';
import { AngularFireModule } from "angularfire2";
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { ChartModule} from 'angular2-highcharts';
import { HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
import { SlickCarouselComponent } from '../components/slick-carousel';
import { FileUploadModule } from 'ng2-file-upload';
import { AgmCoreModule, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';




import { AppComponent } from './app.component';
import { CustomersComponent } from '../pages/customers/customers.component';
import { FeaturesComponent } from '../pages/features/features.component';
import { HomeComponent } from '../pages/home/home.component';
import { MenuBarComponent } from '../pages/menu/menu.component';
import { ModelsComponent } from '../pages/models/models.component';
import { AddLutComponent } from '../pages/add-lut/add-lut.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
  import { FriendDashboardComponent } from '../pages/dashboard/friend-dashboard/friend-dashboard.component';
  import { TaskDashboardComponent } from '../pages/dashboard/task-dashboard/task-dashboard.component';
  import { ScavengerHuntDashboardComponent } from '../pages/dashboard/scavenger-hunt-dashboard/scavenger-hunt-dashboard.component';
  import { UserDashboardComponent, UnLinkAccountDialog } from '../pages/dashboard/user-dashboard/user-dashboard.component';
import { VendorDashboardComponent } from '../pages/vendor-dashboard/vendor-dashboard.component';
import { LoginComponent } from '../pages/login/login.component';
import { PasswordResetModalComponent } from '../pages/login/password-modal/password-modal.compenent';
 
import { AuthService } from '../services/auth.service';
import { ChartService } from '../services/chart.service';
import { ModelService } from '../services/models.service';
import { TaskService } from '../services/task.service';

import { PasswordValidation } from '../services/validators/password-match.validator';



const appRoutes: Routes = [
  { path: 'models', component: ModelsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'home', component: HomeComponent },
  { path: 'features', component: FeaturesComponent },
  { path: 'addlut', component: AddLutComponent },
  { path: 'dashboard', 
    component: DashboardComponent,
    children: [
        { path: 'user', component: UserDashboardComponent },
        { path: 'tasks', component: TaskDashboardComponent },
        { path: 'friends', component: FriendDashboardComponent },
        { path: 'hunts', component: ScavengerHuntDashboardComponent },
        { path: '', redirectTo: 'user', pathMatch: 'full'}
    ]
  },
  { path: 'vendor-dashboard', component: VendorDashboardComponent},
  { path: 'login', component: LoginComponent},
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
    SlickCarouselComponent,
    AddLutComponent,
    VendorDashboardComponent,
    FriendDashboardComponent,
    TaskDashboardComponent,
    ScavengerHuntDashboardComponent,
    UserDashboardComponent,
    DashboardComponent,
    LoginComponent,
    PasswordResetModalComponent,
    UnLinkAccountDialog
  ],
  entryComponents: [
    PasswordResetModalComponent, 
    UnLinkAccountDialog
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MdButtonModule, MdCheckboxModule, MdCardModule, MdTooltipModule, MdListModule, MdIconModule, MdInputModule, MdSelectModule, MdDatepickerModule, MdNativeDateModule, MdRadioModule, MdTabsModule, MdDialogModule, MdProgressSpinnerModule, MdSlideToggleModule, MdGridListModule,
    Ng2FileDropModule,
    FileUploadModule,
    FormsModule, ReactiveFormsModule,
    BrowserAnimationsModule,
    ReCaptchaModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig, 'fastaskweb'),
    AngularFireAuthModule,
    ChartModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDoKOpAvv_zmg7cTWW3Aong62BtgPeDPYc'
    })
  ],
  providers: [
    AuthService,
    ChartService,
    ModelService,
    TaskService,
    PasswordValidation,
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
	  }, 
    AgmMap, GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
