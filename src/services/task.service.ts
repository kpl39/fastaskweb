import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

declare var AWS;
declare const Buffer;




@Injectable()
export class TaskService {
    models: any;

constructor(
     private http: Http
    ) {}

    addTask(pkg) {
        console.log("IN ADD TASK", pkg);
        return new Promise(resolve => {
             this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/addtask', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    uploadTaskImage(image) {
        console.log("UPLOAD IMAGE")
        let pkg = {
            image: image,
            vendorid: 1
        }

        return new Promise( resolve => {
            this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/uploadtaskimage', pkg)
                .subscribe((res) => resolve(res.json()));
        })
    }



     addGeoLocations(pkg) {
        return new Promise(resolve => {
             this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/addgeolocations', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addPromotion(pkg) {
         return new Promise(resolve => {
             this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/addpromotion', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getFavoriteTasks(userid) {
        return new Promise(resolve => {
             this.http.get('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/getfavoritetasks/' + userid)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addFavoriteTask(pkg) {
        return new Promise(resolve => {
             this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/addfavoritetask', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

}