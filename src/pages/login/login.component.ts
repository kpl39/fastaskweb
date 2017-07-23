import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../services/validators/password-match.validator';
import { MdDialog } from '@angular/material';
import { PasswordResetModalComponent } from './password-modal/password-modal.compenent';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,10}$/;
const PHONE_REGEX = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
const ZIP_REGEX = /^[0-9]{5}$/;
const STATE_REGEX = /^[a-zA-Z]{2}$/;

@Component({
//   selector: 'menu-bar',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {
  userAuth: any;
  userLoginForm: any;
  userSignUpForm: any;
  partnerLoginForm: any;
  partnerSignUpForm: any;
  partnerData: any = {};
  userCredentials: any = {};
  partnerCredentials: any = {};
  userLogin: Boolean = true;
  captcha: Boolean = false;
  error: String;
  signUpError: String;
  partnerLoginError: String;
  partnerSignUpError: String;

  constructor(
      private auth: AuthService,
      private fb: FormBuilder,
      public dialog: MdDialog,
      public router: Router
    ) {
      console.log("Constructor");
    }


ngOnInit() {
    this.userLoginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    })

    this.userSignUpForm = this.fb.group(
        {
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        }, {validator: PasswordValidation.MatchPassword}
    )

    this.partnerLoginForm = new FormGroup({
        email: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required])
    })

     this.partnerSignUpForm = this.fb.group(
        {
            businessName: ['', Validators.required],
            businessWebsite: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.compose([Validators.required, Validators.pattern(EMAIL_REGEX)])],
            password: ['', Validators.compose([Validators.required, Validators.pattern(PASSWORD_REGEX)])],
            confirmPassword: ['', Validators.required],
            city: ['', Validators.required],
            state: ['', Validators.compose([Validators.required, Validators.pattern(STATE_REGEX)])],
            zip: ['', Validators.compose([Validators.required, Validators.pattern(ZIP_REGEX)])],
            phone: ['', Validators.compose([Validators.required, Validators.pattern(PHONE_REGEX)])]
        }, {validator: PasswordValidation.MatchPassword}
    )

    this.getAuth();
  }

    isInvalid() {
        return this.partnerSignUpForm.valid && this.captcha ? false : true;
    }


  facebookLogin(){
    this.auth.facebookLogin()
      .then((res:any)=> {
        console.log("FACEBOOK LOGIN", res);
        
        this.checkEmailStatus(res.user.email)
            .then((status) => {
                console.log("check email status facebook", status);
                if (status === 'vendor') {
                    this.getAuth();
                    this.router.navigate(['/vendor-dashboard']);
                } else if (status === 'user') {
                    this.getAuth();
                    this.router.navigate(['/dashboard']);
                } else if (status === 'not-found') {
                   
                    let pkg = {
                        email: res.user.email,
                        profileurl: res.user.photoURL,
                        username: res.user.displayName,
                        userid: res.user.uid
                    };
                    console.log("user not found, adding now", pkg);
                    this.auth.addUser(pkg)
                        .then((res) => {
                            this.getAuth();
                            this.router.navigate(['/dashboard']);
                        })
                } 
            })
      })
  }

  googleLogin() {
      this.auth.googleLogin()
        .then((res:any) => {
            console.log("GOOGLE LOGIN", res);
            this.checkEmailStatus(res.user.email)
            .then((status) => {
                console.log("check email status google", status);
                if (status === 'vendor') {
                    this.getAuth();
                    this.router.navigate(['/vendor-dashboard']);
                } else if (status === 'user') {
                    this.getAuth();
                    this.router.navigate(['/dashboard']);
                } else if (status === 'not-found') {
                   
                    let pkg = {
                        email: res.user.email,
                        profileurl: res.user.photoURL,
                        username: res.user.displayName,
                        userid: res.user.uid
                    };
                    console.log("user not found, adding now", pkg);
                    this.auth.addUser(pkg)
                        .then((res) => {
                            this.getAuth();
                            this.router.navigate(['/dashboard']);
                        })
                } 
            })
        })
  }

  getAuth() {
    this.auth.getAuthState()
      .then((user) => {
        this.userAuth = user;
      })
   
  }

  logout() {
    this.auth.logout();
    this.getAuth();
  }

  onSubmit() {
      console.log("SUBMIT", this.userCredentials);
  }

  userEmailSignUp() {
      this.auth.createEmailUser(this.userCredentials.signUpEmail, this.userCredentials.signUpPassword)
        //check for error in response and handle errrors
        .then((res:any) => {
            console.log("RES FROM SIGNUP", res)

            if (res.code === 'auth/email-already-in-use') {
                this.signUpError = 'That email is already in use. Please login.'
            } else {
                let pkg = {
                    userid: res.uid, 
                    email: this.userCredentials.signUpEmail,
                    username: null,
                    profileurl: 'https://s3.amazonaws.com/fastaskweb/assets/images/stock-avatar.png'
                };

                console.log('add user pkg', pkg);
                this.auth.addUser(pkg)
                    .then((res) => {
                        console.log('added user', res);
                        this.router.navigate(['/dashboard']);
                    })
                 
            }
        })
  }

  userEmailLogin() {
      this.auth.loginEmailUser(this.userCredentials.email, this.userCredentials.password)
      //check for error in response and handle errrors
        .then((res:any) => {
            if (res.code) {
                switch (res.code) {
                    case 'auth/wrong-password': 
                        this.partnerLoginError = 'Wrong Password. Please try again'
                        break;
                    case 'auth/user-not-found':
                        this.partnerLoginError = 'Email address not found. Please try again'
                        break;
                    case 'auth/invalid-email':
                        this.partnerLoginError = 'Email address invalid. Please try again'
                        break;
                    default: 
                        this.partnerLoginError = 'Login Error. Please try again';
                }
            } else {
                this.getAuth();
                this.checkEmailStatus(this.userCredentials.email)
                    .then((res) => {
                        if (res === 'vendor') {
                            this.error = 'This is a partner account. Please use partner login';
                        } else {
                            this.router.navigate(['/dashboard']);
                        }
                    })
            }
        })
  }


  

  partnerEmailLogin() {
      console.log("PARTNER LOGIN", this.partnerCredentials);
      this.auth.loginEmailUser(this.partnerCredentials.email, this.partnerCredentials.password)
        .then((res:any) => {
            if (res.code) {
                switch (res.code) {
                    case 'auth/wrong-password': 
                        this.error = 'Wrong Password. Please try again'
                        break;
                    case 'auth/user-not-found':
                        this.error = 'Email address not found. Please try again'
                        break;
                    case 'auth/invalid-email':
                        this.error = 'Email address invalid. Please try again'
                        break;
                    default: 
                        this.error = 'Login Error. Please try again';
                }
            } else {
                this.checkEmailStatus(this.partnerCredentials.email)
                    .then((res) => {
                        console.log("RES partner login ", res );
                        if (res === 'user') {
                            this.partnerLoginError = 'This is a user account. Please use the user login';
                        } else {
                            this.getAuth();
                            this.router.navigate(['/vendor-dashboard']);
                        };
                    })
            }
        })
  }

  forgotPasswordModal() {
      this.dialog.open(PasswordResetModalComponent);
  }

  partnerEmailSignUp() {
      console.log("PARTNER DATA", this.partnerData);
      this.auth.createEmailUser(this.partnerData.email, this.partnerData.password)
        .then((res:any) => {
            if (res.code === 'auth/email-already-in-use') {
                this.partnerSignUpError = 'That email is already in use. Please login.'
            } else {
                 this.auth.addCustomer(this.partnerData)
                    .then((res) => {
                        console.log("RES FROM ADD CUSTOMER")
                        this.router.navigate(['/vendor-dashboard'])
                    })
            }
        })
  }

  handleCorrectCaptcha(event) {
    this.auth.verifyCaptcha(event)
      .then((res:any) => {
        var resObj = JSON.parse(res);
        if (resObj.success === true) {
          this.captcha = true;
        } else {
          this.captcha = false;
        }
      });
  }

  captchaExpired() {
    console.log("CAPTCHA EXPIRED");
    this.captcha = false;
  }


  toggleSignUp() {
    this.userLogin ? this.userLogin = false : this.userLogin = true;

  }

  checkEmailStatus(email) {
      return new Promise(resolve => {
      this.auth.checkEmailStatus(email)
        .then((res:any) => {
            console.log("RES FROM CHECK EMAIL", res);
            if (res.vendor) {
                resolve('vendor')
            } else if (res.user) {
                resolve('user');
            } else {
                resolve('not-found');
            }
        })
      })
  }

}
