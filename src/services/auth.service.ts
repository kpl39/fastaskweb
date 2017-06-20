import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

declare var AWS;

@Injectable()
export class AuthService {

constructor(
    private http: Http
    ) {}

    verifyCaptcha(response) {
       let pkg = {
           response: response
       };
       console.log("BEFORE SENDING TO SERVER", response);
        return new Promise(resolve => {
            this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/captcha', pkg)
            .subscribe((res) => resolve(res.json().data));
        })
    }
};