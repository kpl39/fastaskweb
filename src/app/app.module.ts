import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MdButtonModule, MdCheckboxModule, MdCardModule, MdListModule, MdIconModule } from '@angular/material';
import { Ng2FileDropModule }  from 'ng2-file-drop';

import { AppComponent } from './app.component';
import { CustomersComponent } from '../pages/customers/customers.component';
import { FeaturesComponent } from '../pages/features/features.component';
import { HomeComponent } from '../pages/home/home.component';
import { MenuBarComponent } from '../pages/menu/menu.component';
import { ModelsComponent } from '../pages/models/models.component';



const appRoutes: Routes = [
  { path: 'models', component: ModelsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'home', component: HomeComponent},
  { path: 'features', component: FeaturesComponent},
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: '**', component: HomeComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CustomersComponent,
    FeaturesComponent, 
    HomeComponent,
    MenuBarComponent,
    ModelsComponent, 
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MdButtonModule, MdCheckboxModule, MdCardModule, MdListModule, MdIconModule,
    Ng2FileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
