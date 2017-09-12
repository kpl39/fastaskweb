import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';





@Injectable()
export class HuntService {

    huntData: any = {};

constructor(
     private http: Http
    ) {}



  getData(type) {
      return new Promise(resolve => {
          if (type === 'all') {
              resolve(this.huntData);
          } else {
              if (this.huntData[type]) {
                resolve(this.huntData[type]);
              } else {
                  resolve(null);
              }
          };
      })
  }

  setData(type, pkg) {
      this.huntData[type] = pkg;
      console.log("SET DATA", this.huntData[type]);
  }

  clearData() {
      this.huntData = {};
  }

  submitHunt(pkg) {
         return new Promise(resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/submithunt', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    submitHuntTasks(pkg) {
         return new Promise(resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/submithunttasks', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }
    submitHuntUsers(pkg) {
         return new Promise(resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/submithuntusers', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getHuntTasksByHuntId(huntid) {
        return new Promise(resolve => {
            this.http.get('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/gethunttasksbyhunt/' + huntid)
                .subscribe((res) => resolve(res.json().data));
        }) 
    }


    addCompleteRecord(pkg) {
        console.log("ADD COMP RECORD", pkg);
         return new Promise(resolve => {
            // let tasks = [];
            this.getHuntTasksByHuntId(pkg.hunt_id).then((taskData:any) => {
                console.log("TASK DATA IN SERVICE", taskData)
                let tasks = [];
                let iterator = taskData.length;
                taskData.forEach((task) => {
                    let taskPkg = {
                        user_id: pkg.userid, 
                        hunt_id: pkg.hunt_id, 
                        task_id: task.id, 
                        team_id: pkg.team_id, 
                        completed: false,
                        date_tm: '',
                        image_url: ''
                    };
                    tasks.push(taskPkg);
                    console.log("TASKS IN LOOP", tasks);
                    iterator--; 
                    console.log("iterator", iterator);
                    if (iterator === 0){
                        console.log("TASKS IN FINAL LOOP", tasks);
                        this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addcomplete', tasks)
                            .subscribe((res) => resolve(res.json().data));
                    }
                })        
            })
        })
    }

    addTeamsToHunt(pkg) {
        return new Promise(resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addteamstohunt', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addUsersToTeams(pkg) {
        return new Promise(resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/adduserstoteams', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }


    getHunts(userid) {
        return new Promise(resolve => {
            this.http.get('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/getuserhunts/ ' + userid)
                .subscribe((res) => resolve(res.json().data));
        })
    } 

    getHuntStatus(userid) {
        return new Promise(resolve => {
            this.http.get('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/gethuntaccepts/ ' + userid)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    acceptHunt(pkg) {
        return new Promise(resolve => {
            this.http.put('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/accepthunt', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    } 

    declinetHunt(pkg) {
        return new Promise(resolve => {
            this.http.put('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/declinehunt', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    } 

    getUserTeamByHunt(hunt_id, user_id) {
        return new Promise(resolve => {
            this.http.get('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/getuserteambyhunt/' + hunt_id + '/' + user_id)
                .subscribe((res) => resolve(res.json().data));
        })
    }




}