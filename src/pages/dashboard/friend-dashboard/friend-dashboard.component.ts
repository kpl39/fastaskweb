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
  userAuth: any;
  profile: any;
  twitterFriends: any;
  facebookFriends: any;



  constructor(
      private auth: AuthService,
    ) {}

    ngOnInit() {
        console.log("IN FRIEND DASHBOARD");
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
                    })
            }) 
      };


    getTwitterFriends() {
        let providers = this.userAuth.providerData;
        let twitterid; 
        providers.forEach((provider) => {
            if (provider.providerId === 'twitter.com') {
              twitterid = provider.uid;
            }
        })
        this.auth.getTwitterFriends(twitterid)
          .then((friends:any) => {
            this.twitterFriends = friends;
            console.log("TWITTER FRIENDS", this.twitterFriends);
          })
    }


    getFacebookFriends() {
      this.auth.getFacebookFriends()
        .then((res:any) => {
          this.facebookFriends = res.friends;
        })
    }

}