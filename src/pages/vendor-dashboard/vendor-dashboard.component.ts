import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../services/auth.service';
import { RouterModule, Routes, Router } from '@angular/router';

// import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {
  userAuth: any;
  profile: any;
  navLinks = [
      {label: 'Settings', link: 'settings'},
      {label: 'Metrics', link: 'metrics'},
      {label: 'Add Campaign', link: 'addtask'},
      {label: 'Billing', link: 'billing'}
  ];
        

  constructor(
      private auth: AuthService,
      public router: Router 
    //   private route: ActivatedRoute
    ) {
      console.log("Constructor");
    //   this.route.params.subscribe((params)=> {
    //     console.log("PARAMS", params);
    //   });
    }

    ngOnInit() {
        this.checkLoginStatus();
    };

    checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth) => {
                if (!this.auth.isAuthenticated()) {
                    this.router.navigate(['login'])
                 }
            }) 
      };

}