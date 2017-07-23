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
    profile: any;
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
                    this.getAuthState();
                    resolve(res)
                });
        })
    }

    googleLogin() {
        return new Promise(resolve => {
            this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((res) => {
                    this.getAuthState();
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
                    this.getAuthState();
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
                    console.log("RES FROM GET AUTH STATE", res);
                    if (res) {
                        this.user = res;
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
                .subscribe((res) => resolve(res.json()));
        })
    }

    addUser(pkg) {
        return new Promise(resolve => {
            this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/adduser', pkg)
                .subscribe((res) => resolve(res.json()));
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

    updatePassword(newpassword) {
        return new Promise(resolve => {
            
            let user = this.afAuth.auth.currentUser;
            user.updatePassword(newpassword)
                .then((res) => {
                    console.log("RES FROM UPDATE PASSWORD", res);
                    resolve(res);
                })
                .catch((err) => {
                    console.log("ERROR in password update", err);
                    resolve(err);
                })
        })
    }
    

    getProfile(uid) {
        return new Promise(resolve => {
            // if (this.profile) {
            //     console.log("Profile already loaded");
            //     resolve(this.profile);
            // } else {
                this.http.get('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/getprofile/'+ uid)
                    .subscribe((res) => {
                        console.log('GET PROFILE FROM API')
                        this.profile = res.json().data;
                        resolve(res.json().data)
                    });
            // }
        })
    }

    checkEmailStatus(email) {
        return new Promise(resolve => {
            this.http.get('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/checkemail/' + email)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    uploadProfileImage(pkg) {
        console.log("CALLED PROFILE SERVICE", pkg);
        return new Promise(resolve => {
            this.http.post('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/uploadprofileimage', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getUsernames() {
        return new Promise(resolve => {
            this.http.get('http://dev-env.fdxvi7xumg.us-east-1.elasticbeanstalk.com/api/getusers')
                .subscribe( res => resolve(res.json().data))
        })
  }


//   linkFacebookAccount() {
//      let provider = new firebase.auth.FacebookAuthProvider();
//      let user = this.afAuth.auth.currentUser;
//      return new Promise(resolve => {
//         user.linkWithPopup(provider)
//             .then((res) => {
//                 resolve(res);
//             })
//             .catch((err) => {
//             resolve(err);
//             })
//      })
//   }

//   linkGoogleAccount() {
//     let provider = new firebase.auth.GoogleAuthProvider();
//      let user = this.afAuth.auth.currentUser;
//      return new Promise(resolve => {
//         user.linkWithPopup(provider)
//             .then((res) => {
//                 resolve(res);
//             })
//             .catch((err) => {
//             resolve(err);
//             })
//      })
//   }

//   linkTwitterAccount() {
//      let provider = new firebase.auth.TwitterAuthProvider();
//      let user = this.afAuth.auth.currentUser;
//      return new Promise(resolve => {
//         user.linkWithPopup(provider)
//             .then((res) => {
//                 resolve(res);
//             })
//             .catch((err) => {
//                 resolve(err);
//             })
//      })
//   }

  linkAccount(provider) {
   let providerAccount;
    switch (provider) {
        case 'facebook': 
            providerAccount = new firebase.auth.FacebookAuthProvider();
            break;
        case 'google':
            providerAccount = new firebase.auth.GoogleAuthProvider();
            break;
        case 'twitter':
            providerAccount = new firebase.auth.TwitterAuthProvider();
            break;
    }


      let user = this.afAuth.auth.currentUser;
      return new Promise(resolve => {
            user.linkWithPopup(providerAccount)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    resolve(err);
                })
        })
  }

  unlinkAccount(provider) {
    let user = this.afAuth.auth.currentUser;
    return new Promise(resolve => {
        user.unlink((provider + '.com'))
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                resolve(err);
            })
    })
  }


};