import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'menu-bar',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuBarComponent {
  title = 'fasTask';
  userAuth: any;

  constructor(
      private auth: AuthService
    ) {
      console.log("Constructor");
    }
  
  ngOnInit() {
    console.log('ngOnInit fired');
    this.getAuth();
  }

  login(){
    this.auth.facebookLogin()
      .then((res)=> {
        console.log("FACEBOOK LOGIN", res);
        this.getAuth();
      })
  }

  getAuth() {
    this.auth.getAuthState()
      .then((user) => {
        this.userAuth = user;
      })
   
  }

  logout() {
    this.auth.facebookLogout();
    this.getAuth();
  }

}
