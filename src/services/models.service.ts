import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';




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


}
