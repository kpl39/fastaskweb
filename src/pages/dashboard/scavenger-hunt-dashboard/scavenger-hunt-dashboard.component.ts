import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AuthService } from '../../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'scavenger-hunt-dashboard',
  templateUrl: './scavenger-hunt-dashboard.component.html',
  styleUrls: ['./scavenger-hunt-dashboard.component.css']
})
export class ScavengerHuntDashboardComponent {

  constructor(
      private auth: AuthService,
    ) {}

    ngOnInit() {
        console.log("IN scavenger hunt DASHBOARD");
    }

}