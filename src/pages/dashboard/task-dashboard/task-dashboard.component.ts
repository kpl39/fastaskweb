import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AuthService } from '../../../services/auth.service';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.css']
})
export class TaskDashboardComponent {

  userAuth: any;
  profile: any;
  posts: any;

  constructor(
      private auth: AuthService
    ) {}

    ngOnInit() {
        console.log("IN Task DASHBOARD");
        this.checkLoginStatus();
    }

    checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth:any) => {
                this.userAuth = userAuth;
                console.log("USER AUTH", userAuth);
                this.auth.getProfile(userAuth.uid)
                    .then((profile) => {
                        console.log("PROFILE", profile);
                        this.profile = profile;
                        this.getPosts();
                    })
            }) 
      };

      getPosts() {
        this.auth.getPostsFromUser(this.profile.id)
          .then((res) => {
            this.posts = res;
            console.log("POSTS", this.posts);
          })
      }

}