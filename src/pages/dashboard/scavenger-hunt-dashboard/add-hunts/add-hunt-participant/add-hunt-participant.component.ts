import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../../services/auth.service';
import { HuntService } from '../../../../../services/hunt.service';
import { DragulaService } from 'ng2-dragula';
import * as _ from "lodash";

@Component({
  selector: 'app-add-hunt-participant',
  templateUrl: './add-hunt-participant.component.html',
  styleUrls: ['./add-hunt-participant.component.css']
})
export class AddHuntParticipantComponent implements OnInit {

  teams: Boolean; false;
  userAuth: any;
  profile: any;
  participantData: any;
  // {
  //   invitedFriends: [],
  //   teamData: {},
  //   teams: false,
  //   lutFriends: {}
  // }
  indvLutFriends: any;
  lutFriends: any;
  teamTemp = '';
  teamKeys: any;
  nameCheck: Boolean = false;
  teamCheck: Boolean = false;

  constructor(
    private auth: AuthService,
    public dragulaService: DragulaService,
    public huntService: HuntService
  ) {
    this.dragulaService.drop.subscribe((value) => {
      // console.log(`drop: ${value[0]}`);
      console.log("CHANGE TO TEAMS", this.participantData);
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
    // this.getData();
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
                       this.getData();
                      // this.getLutFriends();
                  })
          }) 
    };
  
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
          this.indvLutFriends = friends.slice();
          this.lutFriends = friends;
          console.log("LuT Friends", this.lutFriends);
        })
  }

  toggleTeams() {
    if (this.participantData.teams) {
      this.participantData.teams = false;
    } else {
      this.participantData.teams = true;
    }
  }

  addFriend(friend, index) {
      this.participantData.invitedFriends.push(friend);
      this.indvLutFriends[index].selected = true;
      console.log("Select Friends", this.participantData.invitedFriends);
  };

  removeFriend(friend, index) {
    this.indvLutFriends[index].selected = false;
    for (let i = 0; i < this.participantData.invitedFriends.length; i++) {
      
      if (friend.id == this.participantData.invitedFriends[i].id) {
        console.log("SPLICED")
        this.participantData.invitedFriends.splice(i, 1);
      }
    }
    console.log("Select Friends", this.participantData.invitedFriends);
  };

  addTeam() { 
    // this.teams.push({teamName: this.teamTemp});
    this.participantData.teamData[this.teamTemp] = [];
    this.teamKeys = Object.keys(this.participantData.teamData);
    console.log("TEAM DATA after add Team", this.participantData.teamData);
    this.teamTemp = '';
    this.nameCheck = false;
    this.teamCheck = false;
  }

   checkTeamName() {
   console.log("check name")
    if (this.teamTemp === '') {
      console.log("team temp is blank",this.teamTemp)
      this.nameCheck = false;
    } else {
      console.log("theres text", this.teamTemp)
      this.nameCheck = true;
    }
 }

 checkTeams() {
  //  console.log("checkTeams called", this.teamData)
   if (this.teamKeys.length > 0) {
      this.teamCheck = true;
      _.forEach(this.participantData.teamData, (value, key) => {
            console.log("KEY", key);
            console.log("VALUE", value);
              if (value.length < 1 || !value) {
                console.log("no members");
                this.teamCheck = false;
              }; 
        })
      }
 };

 deleteTeam(key) {
    _.forEach(this.participantData.teamData[key], (member) => {
      this.lutFriends.push(member)
    })
    delete this.participantData.teamData[key];
    this.teamKeys = Object.keys(this.participantData.teamData);
    this.checkTeams();
 }



  getData() {
     this.huntService.getData('participant')
      .then((data:any) => {
        if (!data) {
          this.participantData = { invitedFriends: [], teamData: {}, teams:false, lutFriends: [] };
          this.getLutFriends();
          console.log("PART DATA BLANK", this.participantData);
        } else {
          this.participantData = data;
          if (this.participantData.teamData) {
            this.teamKeys = Object.keys(this.participantData.teamData);
            this.lutFriends = data.lutFriends;
          }
          this.indvLutFriends = data.indvLutFriends;
          console.log("ALL FRINEDs BEFORE LOOP", this.indvLutFriends);
          console.log("INVITED FRINEDS BEFORE LOOP", data.invitedFriends);
          if (data.invitedFriends.length > 0) {
           for (let i = 0; i < data.invitedFriends.length; i++) {
             for (let j = 0; j < this.indvLutFriends.length; j++) {
               if ( data.invitedFriends[i].id === this.indvLutFriends[j].id ) {
                 this.indvLutFriends.selected = true;
               }
             }
           }
          }
          console.log("PART DATA", this.participantData);
        }
      })
  }


  setData() {
    this.participantData.lutFriends = this.lutFriends;
    this.participantData.indvLutFriends = this.indvLutFriends;
    this.huntService.setData('participant', this.participantData);
  }

  ngOnDestroy() {
         this.setData();
    }




}
