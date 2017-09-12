import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { HuntService } from '../../../../../services/hunt.service';
import { Router } from '@angular/router';
import * as _ from "lodash";

@Component({
  selector: 'app-add-hunt-confirm',
  templateUrl: './add-hunt-confirm.component.html',
  styleUrls: ['./add-hunt-confirm.component.css']
})
export class AddHuntConfirmComponent implements OnInit {

//  participantData = {
//    teamData: {
//      red: [
//        {username: 'Tupac'}, 
//        {username: 'Biggie'}
//        ],
//      blue: [
//        {username: 'Snoop'},
//        {username: 'Kanye'}
//      ]
//       },
//     teams: true
//  }
userAuth: any;
profile: any;
basicData: any;
participantData: any;
//  teams: any;
teamKeys: any;
taskData: any;
prize: any;
// teamKeys = ['blue', 'red'];
//  teamData: any;



  constructor(
    private auth: AuthService,
    private hunt: HuntService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkLoginStatus();
    this.getTeams();
    this.getBasicData();
    this.getTasks();
    this.getPrize();
  }

  checkLoginStatus() {
      this.auth.getAuthState()
          .then((userAuth:any) => {
              this.userAuth = userAuth;
              this.auth.getProfile(userAuth.uid)
                  .then((profile) => {
                      this.profile = profile;
                      console.log("PROFILE IN CONFIRM", this.profile);
                  })
          }) 
    };


  getTeams() {
   this.hunt.getData('participant')
    .then((data:any) => {
      console.log("TEAM DATA CONFIRM PAGE", data);
      if (!data) {
        this.participantData = { invitedFriends: [], teamData: {}, teams:false, lutFriends: [] };
      } else {
       this.participantData = data;
       if (data.teams) {
         this.teamKeys = Object.keys(data.teamData);
         console.log("TEAM KEYS", this.teamKeys)
       }
      }
    })
  }

  getPrize() {
    this.hunt.getData('prize')
      .then((data:any) => {
        if (data) {
          this.prize = data.prize;
        }
      })
  }

  getBasicData() {
    this.hunt.getData('basic')
      .then((data:any) => {
        if (data) {
         data.startTime =  typeof data.startTime === 'string' ? this.convertTime(data.startDate, data.startTime) : data.startTime;
         data.endTime = typeof data.endTime === 'string' ? this.convertTime(data.endDate, data.endTime) : data.endTime;
         this.basicData = data;
        }
   
        console.log("BASIC DATA CONFIRM", data);
      })
  }

  getTasks() {
    this.hunt.getData('tasks')
      .then((data:any) => {
        if (data) {
          this.taskData = data;
        } else {
          this.taskData = {
            tasks: []
          }
        }
        console.log("TASKS CONFIRM", data);
      })
  }

  convertTime(date, time) {
    let timeSplit = time.split(':');
    date.setHours(timeSplit[0]);
    date.setMinutes(timeSplit[1]);
    return date;
  }

    submitHunt() {
    // let date = this.taskData.myDate.split('-');
    // let time = this.taskData.myTime.split(':');
    // let year = Number(date[0]);
    // let month = Number(date[1]);
    // let day = Number(date[2]);
    // let hours = Number(time[0]);
    // let minutes = Number(time[1]);

    let date_tm = this.basicData.startTime.toISOString();
    console.log("DATE TIME", date_tm);
    let team = false; 

    if (this.participantData.teams) {
      team = true;
    }
    //change duration in db and app to use endTime instead 
    let duration = Math.ceil((this.basicData.endTime - this.basicData.startTime) / 3600000);

    let pkg = {
      title: this.basicData.title,
      description: '',
      date_tm: date_tm,
      team: team,
      duration: duration,
      active: false,
      ended: false,
      prize: this.prize
    };

    console.log("SUBMISSION PKG", pkg);
    this.hunt.submitHunt(pkg).then((hunt:any) => {
      let huntID = hunt.id;
      console.log("ADDED HUNT", huntID);
      this.addTasksToHunt(huntID);
    }) 
  }

  addTasksToHunt(huntID) {
    let taskPkg = [];
    this.taskData.tasks.forEach((task) => {
      let latitude = task.lat || 1;
      let longitude = task.lng || 1;
      //do something about getting model id using the supplied uid from sketchfab 
      let model_id = 1;

      //add range to table schema and to pkg for geo tasks
      console.log("LATITUDE", latitude);
      console.log("LONGITUDE", longitude);
      console.log("model id", model_id);
      let pkg = {
        hunt_id: huntID, 
        title: task.title,
        hint: task.hint,
        points: task.points,
        latitude: latitude,
        longitude: longitude,
        model_id: model_id,
        type: task.type 
      };

      taskPkg.push(pkg);
    })

    this.hunt.submitHuntTasks(taskPkg).then((res) => {
      console.log("RES HUNT TASKS", res);
      this.addUsersToHunt(huntID);
      if (this.participantData.teams) {
        this.addTeamsToHunt(huntID);
      }
    })
  }

  addUsersToHunt(huntID) {
    let userPkg = [];
    console.log("INVITED FRIENDS", this.taskData.invitedFriends);
    if (!this.participantData.teams) {
      this.participantData.invitedFriends.forEach((friend) => {
        if (friend.id != this.profile.id) {
          console.log("FRIEND", friend);
            let pkg = {
              hunt_id: huntID,
              user_id: friend.id,
              admin: false,
              accepted: false,
              declined: false,
              total_points: 0    
            };
          userPkg.push(pkg);
        }
      })
    } else {
      this.teamKeys.forEach((team) => {
        this.participantData.teamData[team].forEach((friend) => {
          let pkg = {
              hunt_id: huntID,
              user_id: friend.id,
              admin: false,
              accepted: false,
              declined: false,
              total_points: 0    
          }
          userPkg.push(pkg);
        })
      })
    }

  


    let adminpkg = {
      hunt_id: huntID, 
      user_id: this.profile.id,
      admin: true,
      accepted: true,
      declined: false,
      total_points: 0
    }
    userPkg.push(adminpkg);
    console.log("USER PKG", userPkg);

    this.hunt.submitHuntUsers(userPkg).then((res) => {
      console.log("RES FROM USERS", res);
      // let alert = this.alertCtrl.create({
      //     title: 'Submitted!',
      //     subTitle: this.taskData.title + ' has been submitted!',
      //     buttons: ['OK']
      //   });
      //   this.nativeAudio.play('confirmation');
      //   alert.present();
      //   this.nav.setRoot(ScavengerHuntDashboardPage);
      this.router.navigate(['/dashboard/hunts']);
    })
    if (!this.participantData.teams) {
      this.addAdminCompleteRecord(huntID, null);
    }
    this.hunt.clearData();
  }
  
  addAdminCompleteRecord(huntID, team) {
    let adminTeam = null;

    let pkg = {
      userid: this.profile.id,
      hunt_id: huntID,
      team_id: team || null
    };
     this.hunt.addCompleteRecord(pkg).then((res) => {
            console.log("RESP ADD TASK COMPLETE FOR USER", res);
        })
  }

  addTeamsToHunt(huntID) {
    let teamList = [];

    _.forEach(this.participantData.teamData, (value, key) => {
      teamList.push({title: key, hunt_id: huntID, total_points: 0});
    })
    console.log("TEAM LIST", teamList);
   this.hunt.addTeamsToHunt(teamList)
    .then((teams) => {
      console.log("teams", teams);
      this.addUsersToTeams(teams, huntID);
    })
  }

  addUsersToTeams(teams, huntID) {
    let teamAssignment = [];
    _.forEach(this.participantData.teamData, (members:any, team:any) => {
      for (let i = 0; i < teams.length; i++) {
        if (team == teams[i].title) {
          for (let j = 0; j < members.length; j++) {
            teamAssignment.push({user_id: members[j].id, team_id: teams[i].id})
            if (members[j].id === this.profile.id) {
              this.addAdminCompleteRecord(huntID, teams[i].id);
              console.log("found admin in team");
            }
          }
        }
      }
    });
    this.hunt.addUsersToTeams(teamAssignment)
      .then((res) => {
        console.log("TEAM ASSINGMENT RESPONSE", res);
      });
  }

}
