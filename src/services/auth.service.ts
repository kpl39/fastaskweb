import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

declare var AWS;

@Injectable()
export class AuthService {
    user: any;

constructor(
    private http: Http,
    private afAuth: AngularFireAuth
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

    facebookLogin() {
        return new Promise(resolve => {
            this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
                .then((res) => resolve(res));
        })
    }

    getAuthState() {
        return new Promise(resolve => {
            this.afAuth.authState.
                subscribe(res => resolve(res));
        })
    }

    facebookLogout() {
        this.afAuth.auth.signOut();
    }

};