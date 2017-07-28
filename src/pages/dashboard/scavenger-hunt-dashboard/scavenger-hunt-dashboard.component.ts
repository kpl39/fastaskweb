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

    navLinks = [
                {label: 'Your Scavenger Hunts', link: 'your'},
                {label: 'Add Scavenger Hunt', link: 'add'}
                ];

    // <a md-tab-link routerLink="your" routerLinkActive="active-link">Your Scavenger Hunts</a>
    // <a md-tab-link routerLink="add" routerLinkActive="active-link">Add Scavenger Hunt</a>

  constructor(
      private auth: AuthService,
    ) {}

    ngOnInit() {
        console.log("IN scavenger hunt DASHBOARD");
    }

}