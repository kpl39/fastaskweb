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
  lutFriends: any;
  friendRequests: any;



  constructor(
      private auth: AuthService
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
                this.getFriendRequests();
                this.auth.getProfile(userAuth.uid)
                    .then((profile) => {
                        console.log("PROFILE", profile);
                        this.profile = profile;
                        this.getLutFriends();
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
          this.facebookFriends = res.friends.data;
          console.log("LOOK HERE", res.friends.data);
          this.getRequestStatus();
        })
    }

    getLutFriends() {
      this.auth.getLutFriends(this.profile.userid)
        .then((res:any) => {
          let friends = res;
          console.log("Friends before splice", friends);
          friends.forEach((friend, i) => {
            if (friend.userid === this.userAuth.uid) {
              friends.splice(i, 1);
              console.log("FACEBOOK FRIENDS AFTER SPLICE", friends);
            }
          })
          this.lutFriends = friends;
          console.log("LuT Friends", this.lutFriends);
        })
    }
  
  sendFriendRequest(user, index) {
      let providers = this.userAuth.providerData;
      let facebookid; 
      this.facebookFriends[index].requestSent = true;
        providers.forEach((provider) => {
            if (provider.providerId === 'facebook.com') {
              facebookid = provider.uid;
            }
        })
      console.log("Send Friends Request", user);
      this.getUserIdFromFacebook(user.id)
        .then((res:any) => {
            console.log("USER ID from Facebook", res.userid);
            let pkg = {
              user1: this.userAuth.uid,
              user2: res.userid,
              requestsent: true,
              confirmed: false,
              user1facebookid: facebookid,
              user2facebookid: user.id
            }
            this.auth.sendFriendRequest(pkg)
              .then((res) => {
                console.log("SENT REQUEST", res);
              })
          })
    }

  acceptFriendRequest(userid, i) {
           let pkg = {
                        requestor: userid,
                        requestee: this.userAuth.uid
                      };
          this.auth.acceptFriendRequest(pkg)
            .then((res) => {
              console.log("Friend Request Accepted");
              this.friendRequests.splice(i, 1);
            })
  }

  declineFriendRequest(userid) {

  }


  getUserIdFromFacebook(facebookid) {
      return new Promise(resolve => {
        this.auth.getUserIdFromFacebook(facebookid)
          .then((userid) => {
            resolve(userid);
          })
       })
  }

  getRequestStatus() {
    let fbFriends = this.facebookFriends;
    this.auth.getRequestStatus(this.userAuth.uid)
      .then((requests:any) => {
         for (let i = 0; i < requests.length; i++) {
            for (let j = 0; j < fbFriends.length; j++) {
                if (requests[i].user1facebookid === fbFriends[j].id) {
                    console.log("FB FRIEND J", fbFriends[j]);
                    fbFriends[j].requestor = requests[i].requestsent;
                    fbFriends[j].confirmed = requests[i].confirmed;
                } else if (requests[i]. user2facebookid === fbFriends[j].id) {
                    fbFriends[j].requestee = requests[i].requestsent;
                    fbFriends[j].confirmed = requests[i].confirmed;
                } 
                
            }
        }
        console.log("FACEBOOK FRIENDS AFTER LOOP", fbFriends);
        this.facebookFriends = fbFriends;
      })
  }

  getFriendRequests() {
    this.auth.getFriendRequests(this.userAuth.uid)
      .then((res) => {
        console.log("RES FROM FRIENDS REQUESTS", res);
        this.friendRequests = res;
      })
  }

}