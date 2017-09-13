import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

// declare var AWS;
declare var FB;

@Injectable()
export class AuthService {
    user: any;
    profile: any;
    authenticated: Boolean;
    device: string;
    vendorInfo: any;
    userType: String;

constructor(
    private http: Http,
    private afAuth: AngularFireAuth
    ) {
        FB.init({
            appId      : '196079437518291',
            cookie     : false, 
            xfbml      : true,  // parse social plugins on this page
            version    : 'v2.1' // use graph api version 2.5
        });
    }

    checkDevice() {
        return new Promise(resolve => {
            if (!this.device) {
                let check = false;
                (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
                if (check) {
                    this.device = 'mobile'
                } else {
                    this.device = 'desktop'
                }
            } 
            resolve(this.device);
        })
        
        
    }

    verifyCaptcha(response) {
       let pkg = {
           response: response
       };
       console.log("BEFORE SENDING TO SERVER", response);
        return new Promise(resolve => {
            this.http.post('https://server.xn--lt-xka.co/api/captcha', pkg)
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
                        this.checkEmailStatus(res.email);
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
        this.userType = null;
    }

    addCustomer(pkg) {
        return new Promise(resolve => {
            this.http.post('https://server.xn--lt-xka.co/api/addcustomer', pkg)
                .subscribe((res) => resolve(res.json()));
        })
    }

    addUser(pkg) {
        return new Promise(resolve => {
            this.http.post('https://server.xn--lt-xka.co/api/adduser', pkg)
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
                this.http.get('https://server.xn--lt-xka.co/api/getprofile/'+ uid)
                    .subscribe((res) => {
                        console.log('GET PROFILE FROM API')
                        this.profile = res.json().data;
                        resolve(res.json().data)
                    });
            // }
        })
    }

    getVendorInfo(uid) {
          return new Promise(resolve => {
              if (this.vendorInfo) {
                  resolve(this.vendorInfo);
              } else {
                 this.http.get('https://server.xn--lt-xka.co/api/getvendorinfo/'+ uid)
                    .subscribe((res) => {
                        this.vendorInfo = res.json().data;
                        resolve(res.json().data)
                    });
              }
        })
    }

    checkEmailStatus(email) {
        return new Promise(resolve => {
            this.http.get('https://server.xn--lt-xka.co/api/checkemail/' + email)
                .subscribe((res) => {
                    let userType = res.json().data;
                    if (userType.user) {
                        this.userType = 'user';
                    } else if (userType.vendor) {
                        this.userType = 'vendor';
                    } else {
                        this.userType = null;
                    }
                    resolve(userType);
                });
        })
    }

    uploadProfileImage(pkg) {
        console.log("CALLED PROFILE SERVICE", pkg);
        return new Promise(resolve => {
            this.http.post('https://server.xn--lt-xka.co/api/uploadprofileimage', pkg)
                .subscribe((res) => resolve(res.json().data));
        })
    }

    getUsernames() {
        return new Promise(resolve => {
            this.http.get('https://server.xn--lt-xka.co/api/getusers')
                .subscribe( res => resolve(res.json().data))
        })
  }

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


  getTwitterFriends(twitterid) {
      return new Promise(resolve => {
           this.http.get('https://server.xn--lt-xka.co/api/twitterfriends/' + twitterid)
                .subscribe( res => resolve(res.json().data))
        })
  }

   getFacebookFriends() {
        return new Promise(resolve => {
            FB.login(function(){
                FB.api('/me?fields=id,name,email,birthday,picture{url},friends{picture{url},email,name}', function(response) {
                    console.log("RES FACEBOOK FRIENDS", response);
                    resolve(response);
                })
            });
        })    
     };

     getLutFriends(userid) {
         return new Promise(resolve => {
             this.http.get('https://server.xn--lt-xka.co/api/getfastaskfriends/' + userid)
                .subscribe(res => resolve(res.json().data))
         })
     }

     getUserIdFromFacebook(facebookid) {
         return new Promise(resolve => {
             this.http.get('https://server.xn--lt-xka.co/api/getidfromfacebookid/' + facebookid)
                .subscribe(res => resolve(res.json().data))
         })
     }

     sendFriendRequest(pkg) {
         return new Promise(resolve => {
             this.http.post('https://server.xn--lt-xka.co/api/friendrequest', pkg)
                .subscribe(res => resolve(res.json()))
         })
     }

     getFriendRequests(userid) {
         return new Promise(resolve => {
             this.http.get('https://server.xn--lt-xka.co/api/getfriendrequests/' + userid)
                .subscribe(res => resolve(res.json().data))
         })
     }

     getRequestStatus(userid) {
         return new Promise(resolve => {
             this.http.get('https://server.xn--lt-xka.co/api/requeststatus/' + userid)
                .subscribe(res => resolve(res.json().data))
         })
     }

     acceptFriendRequest(pkg) {
         return new Promise(resolve => {
             this.http.put('https://server.xn--lt-xka.co/api/acceptrequest', pkg)
                .subscribe(res => resolve(res.json().data))
         })
     }

     getPostsFromUser(userid) {
         return new Promise(resolve => {
             this.http.get('https://server.xn--lt-xka.co/api/userposts/' + userid)
                .subscribe(res => resolve(res.json().data))
         })
     }

     updateCompanyProfile(pkg) {
          return new Promise(resolve => {
             this.http.put('https://server.xn--lt-xka.co/api/updatecompanyprofile', pkg)
                .subscribe(res => resolve(res.json().data))
         })
     }

     getUserType() {
         return this.userType;
     }


}