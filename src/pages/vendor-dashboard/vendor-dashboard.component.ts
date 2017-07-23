import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './vendor-dashboard.component.html',
  styleUrls: ['./vendor-dashboard.component.css']
})
export class VendorDashboardComponent {

  constructor(
      private auth: AuthService,
    //   private route: ActivatedRoute
    ) {
      console.log("Constructor");
    //   this.route.params.subscribe((params)=> {
    //     console.log("PARAMS", params);
    //   });
    }

    ngOnInit() {
        console.log("IN DASHBOARD");
    }

}