import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';

declare var AWS;

@Injectable()
export class AuthService {
  private secret: String = '6LfwIyYUAAAAAPBdFdRPNZ7c-llt0nBb7O9DSUP0';

constructor(
    private http: Http
    ) {}

    verifyCaptcha(response) {
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ headers: headers });

        let pkg = {
            secret: this.secret,
            response: response
        };

        return new Promise(resolve => {
            this.http.post('https://www.google.com/recaptcha/api/siteverify', pkg, options)
            .subscribe((res) => resolve(res.json().data));
        })
    }
};