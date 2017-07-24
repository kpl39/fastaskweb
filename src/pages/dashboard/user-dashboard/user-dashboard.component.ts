import { Component } from '@angular/core';
import { HomeComponent } from '../../home/home.component';
import { AuthService } from '../../../services/auth.service';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../../services/validators/password-match.validator';
import {MdDialog, MdDialogRef} from '@angular/material';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {
  userAuth: any;
  profile: any;
  validFile: Boolean;
  avatarFinished: Boolean = false;
  usernames: any;
  updatedUsername: String = '';
  usernameAvailable: Boolean;
  passwordForm: any;
  passwords: any = {};
  passwordReset: Boolean = false;
  connectedAccounts: any = {};

  constructor(
      private auth: AuthService,
      private fb: FormBuilder,
      public dialog: MdDialog
    ) {}

    ngOnInit() {
        console.log("IN USER DASHBOARD");
        this.checkLoginStatus();
        this.getUsernames();
        this.createPasswordForm();
    }

    createPasswordForm() {
        this.passwordForm =  {};
        this.passwordForm = this.fb.group(
            {
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            }, {validator: PasswordValidation.MatchPassword}
        )
    }

     checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth:any) => {
                this.userAuth = userAuth;
                this.checkConnectedAccounts();
                console.log("USER AUTH", userAuth);
                this.auth.getProfile(userAuth.uid)
                    .then((profile) => {
                        console.log("PROFILE", profile);
                        this.profile = profile;
                    })
            }) 
      };

      chooseAvatar() {
          console.log('choose Avatar');
          document.getElementById("fileUpload").click();
          this.avatarFinished = false;
      }

      uploadAvatar() {
          console.log("UPLOAD FILE")
          if (this.validFile) {
              let pkg = {
                  image: this.profile.profileurl,
                  userid: this.userAuth.uid,
                  id: this.profile.id
              };
              this.auth.uploadProfileImage(pkg)
                .then((url) => {
                    this.avatarFinished = true;
                    console.log("IMAGE URL", url)
                })
          }
      }

      uploadFile(files) {
        console.log("FILES", files);
        let reader:FileReader = new FileReader();

        if (files[0].type === 'image/png' || files[0].type === 'image/gif' || files[0].type === 'image/jpg') {
            this.validFile = true;
            reader.onloadend = (e) => {
                this.profile.profileurl = reader.result;
            }

            reader.readAsDataURL(files[0]);
        }  else {
            this.validFile = false;
        }
      }

    getUsernames() {
        this.auth.getUsernames()
            .then((res) => {
                console.log("usernames", res);
                this.usernames = res;
            })
    }

    checkUserName() {
        for (var i = 0; i < this.usernames.length; i++) {
            if (this.usernames[i].username === this.updatedUsername || this.updatedUsername === '') {
                this.usernameAvailable = false;
                return;
            }
        }
        this.usernameAvailable = true;
    }

    updatePassword() {
        this.auth.updatePassword(this.passwords.password)
            .then((res) => {
                if (res) {
                    console.log("ERROR", res);
                } else {
                    this.passwordReset = true;
                    this.passwords = {};
                    this.passwordForm.reset();
                    this.resetPasswordForm();
                    setTimeout(()=>{this.passwordReset = false}, 3000);
                }
            })
    }

    checkConnectedAccounts() {
        let providers = this.userAuth.providerData;
        providers.forEach((provider) => {
            switch (provider.providerId) {
                case 'facebook.com':
                    this.connectedAccounts.facebook = true;
                    break;
                case 'google.com':
                    this.connectedAccounts.google = true;
                    break;
                case 'twitter.com':
                    this.connectedAccounts.twitter = true;
                    break;
            }
        })
    }

    resetPasswordForm() {
         Object.keys(this.passwordForm.controls).forEach(key => {
          this.passwordForm.controls[key].setErrors(null)
        });
    }

    // connectFacebook() {
    //     this.auth.linkFacebookAccount()
    //         .then((res)=> {
    //             console.log("RES FROM CONNECT FACEBOOK", res);
    //         })
    // }

    // connectGoogle() {
    //     this.auth.linkGoogleAccount()
    //         .then((res) =>{
    //             console.log("RES FROM GOOGLE CONNECT", res);
    //         })
    // }

    // connectTwitter() {
    //     this.auth.linkTwitterAccount()
    //         .then((res) => {
    //             console.log("RES FROM TWITTER CONNECT", res);
    //         })
    // }

    linkAccount(provider) {
        this.auth.linkAccount(provider)
            .then((res) => {
                console.log("RES FROM LINK ACCOUNT", res);
            })

    }

    toggleAccount(provider) {
       if (this.connectedAccounts[provider]) {
            let dialogRef = this.dialog.open(UnLinkAccountDialog);
            dialogRef.componentInstance.provider = provider;
            dialogRef.afterClosed()
                .subscribe(result => {
                    if (result === 'unlink') {
                        this.auth.unlinkAccount(provider)
                            .then((res) => {
                                console.log("RES FROM UNLINK", res);
                            })
                    } else {
                        this.connectedAccounts[provider] = true;
                    }
                });
       } else {
           this.linkAccount(provider)
            
       }
    }
}

@Component({
  templateUrl: 'unlink-dialog.html',
})
export class UnLinkAccountDialog {
    provider: String;
    constructor(
        public dialogRef: MdDialogRef<UnLinkAccountDialog>
    ) {}
}
