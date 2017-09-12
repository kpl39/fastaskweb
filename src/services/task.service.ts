import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

declare var AWS;
declare const Buffer;




@Injectable()
export class TaskService {
    models: any;
    vendorTasks: any;

constructor(
     private http: Http
    ) {}

    addTask(pkg) {
        console.log("IN ADD TASK", pkg);
        return new Promise(resolve => {
             this.http.post('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addtask', pkg)
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
            this.http.post('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/uploadtaskimage', pkg)
                .subscribe((res) => resolve(res.json()));
        })
    }



     addGeoLocations(pkg) {
        return new Promise(resolve => {
             this.http.post('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addgeolocations', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addPromotion(pkg) {
         return new Promise(resolve => {
             this.http.post('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addpromotion', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getFavoriteTasks(userid) {
        return new Promise(resolve => {
             this.http.get('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/getfavoritetasks/' + userid)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addFavoriteTask(pkg) {
        return new Promise(resolve => {
             this.http.post('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addfavoritetask', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getVendorTasks(vendorid) {
        return new Promise(resolve => {
            if (this.vendorTasks) {
                console.log("Cached Vendor Tasks")
                resolve(this.vendorTasks);
            } else {
             this.http.get('http://lutapi-dev.us-east-1.elasticbeanstalk.com/api/gettasksbyvendor/' + vendorid)
                .subscribe((res) => {
                    console.log("Vendor Tasks from API");
                    this.vendorTasks = res.json().data;
                    resolve(res.json().data)
                });
            }
        })
    }

}