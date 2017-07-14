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
    authenticated: Boolean;

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
                .then((res) => {
                    this.authenticated = true;
                    resolve(res)
                });
        })
    }

    googleLogin() {
        return new Promise(resolve => {
            this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((res) => {
                    this.authenticated = true;
                    resolve(res)
                })
        })
    }

    // console.log(this.authState)

    createEmailUser(email, password) {
        return new Promise(resolve => {
            this.afAuth.auth.createUserWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log("RES ADD USER", res);
                    resolve(res);    
                })
                .catch((err) => {
                    console.log("ERROR", err);
                    resolve(err);
                })
        })
      
    }

    loginEmailUser(email, password) {
        return new Promise(resolve => {
            this.afAuth.auth.signInWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log("RES LOGIN USER", res);
                    resolve(res);
                })
                .catch((err) => {
                    console.log("ERROR", err)
                    resolve(err);
                })
        })
        
    }

    getAuthState() {
        return new Promise(resolve => {
            this.afAuth.authState.
                subscribe( (res) => {
                    if (res) {
                        this.authenticated = true;
                    } else {
                        this.authenticated = false;
                    }
                    resolve(res)
                });
        })
    }

    logout() {
        this.afAuth.auth.signOut();
        this.authenticated = false;
    }

    addCustomer(pkg) {
        return new Promise(resolve => {
            this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/addcustomer', pkg)
            .subscribe((res) => resolve(res.json().data));
        })
    }

    isAuthenticated() {
        return this.authenticated;
    }

    resetPassword(email) {
        return new Promise(resolve => {
            this.afAuth.auth.sendPasswordResetEmail(email)
            .then((res) => {
                console.log("RES FROM RESET", res)
                resolve(res);
            })
            .catch((err) => {
                console.log("RESET ERROR", err);
                resolve(err);
            })
        })
        
    };

};