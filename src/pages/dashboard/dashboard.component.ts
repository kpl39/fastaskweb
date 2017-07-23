import { Component, NgModule } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FriendDashboardComponent } from './friend-dashboard/friend-dashboard.component';
import { TaskDashboardComponent } from './task-dashboard/task-dashboard.component';
import { ScavengerHuntDashboardComponent } from './scavenger-hunt-dashboard/scavenger-hunt-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
//   entryComponents: [UserInfoDashboardComponent, FriendDashboardComponent]
})

// @NgModule({
//     declarations: [FriendDashboardComponent, TaskDashboardComponent]
// })

export class DashboardComponent {
  userAuth: any;
  profile: any;


  constructor(
      private auth: AuthService,
      public router: Router
    ) {}

    ngOnInit() {
        this.checkLoginStatus();
    };

    checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth) => {
                if (!this.auth.isAuthenticated()) {
                    this.router.navigate(['/login'])
                 }
            }) 
      };

    

}