import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

declare var AWS;
declare const Buffer;




@Injectable()
export class ModelService {
    models: any;

constructor(
     private http: Http
    ) {}

    getModels() {
        return new Promise(resolve =>{
            let authHeaders = new Headers();
            authHeaders.append('Authorization', 'Token 6980e83cdfc94d1996bdb66ace19e644');
            let url = 'https://api.sketchfab.com/v3/me/models';
            this.http.get(url, {headers: authHeaders})
                .subscribe((res) => resolve(res.json().results))
        })
    }

    uploadTaskImage(image) {
        console.log("UPLOAD IMAGE")
        let pkg = {
            image: image,
            vendorid: 1
        }

        return new Promise( resolve => {
            this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/uploadtaskimage', pkg)
                .subscribe((res) => resolve(res.json()));
        })
    }


    addTask(pkg) {
        console.log("IN ADD TASK", pkg);
        return new Promise(resolve => {
             this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addtask', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getModelID(uid) {
         return new Promise(resolve => {
             this.http.get('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/getmodelid/' + uid)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    addGeoLocations(pkg) {
        return new Promise(resolve => {
             this.http.post('https://lutapi-dev.us-east-1.elasticbeanstalk.com/api/addgeolocations/', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

}
