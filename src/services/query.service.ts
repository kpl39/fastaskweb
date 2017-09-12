import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';



@Injectable()
export class QueryService {
    user: any;
    recentQueries = [];

constructor(
    private http: Http
    ) {}

    buildQuery(pkg) {
        let options:any = {};
        
        if (pkg.timePeriod === 'everything') {
            options.name = 'metrics-everything';
            options.values = [pkg.taskid];
            options.query = 'SELECT count(date_tm::date) as viewcount, date_tm::date as count_date from task_views WHERE taskid = $1 group by count_date order by count_date ASC';
        } else if (pkg.timePeriod === 'hourly') {
            options.name = 'metrics-hourly';
            let date = new Date(pkg.hourlyDate).toLocaleDateString();
            options.values = [date, pkg.taskid];
            options.query = "SELECT EXTRACT(HOUR FROM date_tm) as hour, count(EXTRACT(HOUR FROM date_tm)) as viewcount, date_tm::date as count_date from task_views WHERE date_tm::date = $1 AND taskid = $2 group by hour, count_date ORDER BY hour ASC"
        } else {
            options.name = 'metrics-range';
            let date1 =  new Date(pkg.startDate).toLocaleDateString();
            let date2 =  new Date(pkg.endDate).toLocaleDateString();
            options.query = 'SELECT count(date_tm::date) as viewcount, date_tm::date as count_date from task_views WHERE taskid = $1 AND date_tm::date BETWEEN $2 AND $3 group by count_date order by count_date ASC';
            options.values = [pkg.taskid, date1, date2];
        }
        console.log("OPTIONS", options);
        return new Promise(resolve => {
            this.sendQuery(options)
                .then((res) => {
                    resolve(res);
                })
        })
    }


    sendQuery(pkg) {
        console.log("IN SEND QUERY", pkg);
        return new Promise(resolve => {
             this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/taskquery', pkg)
                .subscribe((res) => {
                    let data = res.json().data;
                    let query = {time: new Date().toISOString(), data: res}
                    this.recentQueries.push(query);
                    

                    // let minDate = new Date('2017-08-24');
                    // let maxDate = new Date('')





                    console.log("Data from Query", data);



                    resolve(data);
            });
        })
    }

   

}
