import { Component, OnInit, NgZone } from '@angular/core';
import { TaskService } from '../../../../services/task.service';
import { AuthService } from '../../../../services/auth.service';
import { HuntService } from '../../../../services/hunt.service';

@Component({
  selector: 'app-your-hunts',
  templateUrl: './your-hunts.component.html',
  styleUrls: ['./your-hunts.component.css']
})
export class YourHuntsComponent implements OnInit {

    
 authenticated: boolean;
 userAuth: any; 
 profile: any;
 yourHunts: any = [];
 otherHunts: any = [];
 hunts: any;

 constructor(

    private auth: AuthService,
    private tasks: TaskService,
    private huntService: HuntService
    ) {}
      

  ngOnInit() {
    this.checkLoginStatus();
  }

  // checkUserAuth(): void {
  //    this.authenticated = this.auth.authenticated();  
  //    if (!this.authenticated) {
  //       this.nav.setRoot(LoginPage);
  //    }
  //    this.userInfo = this.auth.displayName();
  //    this.auth.getProfile(this.userInfo.uid).subscribe((profile) => {
  //        this.profile = profile;
  //        console.log("profile", profile);
  //        this.getHunts();
  //    })
  //  };

     checkLoginStatus() {
      this.auth.getAuthState()
          .then((userAuth:any) => {
              this.userAuth = userAuth;
              this.auth.getProfile(userAuth.uid)
                  .then((profile) => {
                      console.log("PROFILE", profile);
                      this.profile = profile;
                      this.getHunts();
                  })
          }) 
      };



  getHunts() {
      this.huntService.getHunts(this.profile.id)
        .then((hunts:any) => {
            this.hunts = hunts;
            this.getHuntStatus();
            this.startTimers();
        })
  }

  getHuntStatus() {
      this.huntService.getHuntStatus(this.profile.id)
        .then((status:any) => {
            let yourHuntsTemp = []; 
            let otherHuntsTemp = [];
            this.hunts.forEach(hunt => {
                for (let i = 0; i < status.length; i++) {
                    if (status[i].hunt_id === hunt.huntid) {
                        hunt.accepted = status[i].accepted;
                        hunt.declined = status[i].declined;
                    }
                }    
                if (hunt.adminid === this.profile.id) {
                    yourHuntsTemp.push(hunt);
                } else {
                    otherHuntsTemp.push(hunt);
                }
            })
          
            this.yourHunts = yourHuntsTemp;
            this.otherHunts = otherHuntsTemp;
            console.log("hunts", this.yourHunts);
            console.log("other hunts", this.otherHunts)
        })
  }   

    checkTeamBased(hunt, index, list) {
        console.log("HUNT CHECK TEAM", hunt);
        if (hunt.team) {
            this.huntService.getUserTeamByHunt(hunt.huntid, this.profile.id)
                .then((team_id:any) => {
                    console.log("TEAM ID", team_id);
                    this.acceptHunt(hunt, index, list, team_id.id);
                })
        } else {
            this.acceptHunt(hunt, index, list, null);
        }
    }

    acceptHunt(hunt, index, list, team_id) {
        let pkg = {
            userid: this.profile.id,
            hunt_id: hunt.huntid,
            team_id: team_id
        };
        this.huntService.acceptHunt(pkg)
        .then(res => {
            console.log("res from accept hunt", res);
            // let alert = this.alertCtrl.create({
            //     title: 'Confirmed',
            //     subTitle: 'You have accepted this scavenger hunt!',
            //     buttons: ['OK']
            // });
            // alert.present();
             
            if (list === "your") {
                this.yourHunts[index].declined = false;
                this.yourHunts[index].accepted = true;
            } else {
                this.otherHunts[index].declined = false;
                this.otherHunts[index].accepted = true;
            }
        })
        this.huntService.addCompleteRecord(pkg).then((res) => {
            console.log("RESP ADD TASK COMPLETE FOR USER", res);
        })
    };


    getTeam(huntid, userid) {

    }

    declineHunt(hunt, index, list) {
        console.log("DECLINED", hunt.huntid, index, list);
        let pkg = {
            userid: this.profile.id,
            hunt_id: hunt.huntid
        };
        this.huntService.declinetHunt(pkg)
            .then(res => {
                console.log("res from decline hunt", res);
                // let alert = this.alertCtrl.create({
                //         title: 'Declined',
                //         subTitle: 'You have declined this scavenger hunt!',
                //         buttons: ['OK']
                // });
                // alert.present();
                
                if (list === "your") {
                    this.yourHunts[index].declined = true;
                    this.yourHunts[index].accepted = false;
                } else {
                     this.otherHunts[index].declined = true;
                    this.otherHunts[index].accepted = false;
                }
            })
        };

  

    goTo(hunt) {
        let pkg = {
            huntDetails: hunt, 
            userDetails: this.userAuth,
            profile: this.profile
        }
       
    }

    // detailsModal(hunt) {
    //     let detailsModal = this.modalCtrl.create(HuntDetailsModal, hunt);
    //     detailsModal.onDidDismiss(data => {
    //         console.log("data from details modal", data);
    //     })
    //     detailsModal.present();
    // }

    countDown(date_tm) {
    let timeNow = new Date();

    let postTimeObj = new Date(date_tm);
    
    let difference = (postTimeObj.getTime() - timeNow.getTime()) / 3600000; 
    let textTime;
    if (difference <= 0) {
        textTime = "Time to Start"
    } 
    else if (difference < 1) {
       textTime = Math.floor(difference * 60) + " Minutes";
    } else if (difference < 24) {
      difference = Math.floor(difference/24);
      textTime = difference + " Hours"
    } else {
        textTime = postTimeObj.toDateString();
    }

    return textTime;
  }

  countdownTimer(index) {
    let end: any = new Date(this.hunts[index].date_tm);
    end.setHours(end.getHours() + this.hunts[index].duration);

    let now: any = new Date();
    let difference = end - now;

    setInterval(() => {
      let msInHour = 3600000;

      let hours = difference / msInHour;
      let minutes =  (difference % msInHour) / 60000;
      let seconds = ((difference % msInHour) % 60000)  / 1000;
      
      this.hunts[index].hours = hours > 0 ? Math.floor(difference / msInHour) : '00';
      this.hunts[index].minutes = minutes > 0 ? (minutes < 10 ? '0' + Math.floor(minutes).toString() : Math.floor(minutes) ) : '00';
      this.hunts[index].seconds = seconds > 0 ? (seconds < 10 ? '0' + Math.floor(seconds).toString() : Math.floor(seconds) ) : '00';
      difference -= 1000; 

    }, 1000)
  }

  startTimers() {
   for (let i = 0; i < this.hunts.length; i++) {
       if (this.hunts[i].active === true) {
           this.countdownTimer(i);
       };
   }
  }


}


