import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
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
      private auth: AuthService,
      private router: Router
    ) {
      console.log("Constructor");
    }
  
  ngOnInit() {
    console.log('ngOnInit fired');
    // this.getAuth();
  }

  checkAuth() {
    return this.auth.isAuthenticated();
  }

  // login(){
  //   this.auth.facebookLogin()
  //     .then((res)=> {
  //       console.log("FACEBOOK LOGIN", res);
  //       this.getAuth();
  //     })
  // }

  // getAuth() {
  //   this.auth.getAuthState()
  //     .then((user) => {
  //       this.userAuth = user;
  //       console.log("USER AUTH", user);
  //     })
   
  // }

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }

}
