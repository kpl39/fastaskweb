import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AuthService } from '../../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'friend-dashboard',
  templateUrl: './friend-dashboard.component.html',
  styleUrls: ['./friend-dashboard.component.css']
})
export class FriendDashboardComponent {

  constructor(
      private auth: AuthService,
    ) {}

    ngOnInit() {
        console.log("IN FRIEND DASHBOARD");
    }

}