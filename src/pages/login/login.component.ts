import { Component } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../../services/auth.service';
import { FormControl, Validators, FormGroup, AbstractControl, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../services/validators/password-match.validator';
import { MdDialog } from '@angular/material';
import { PasswordResetModalComponent } from './password-modal/password-modal.compenent';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
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

    this.partnerSignUpForm = new FormGroup({
        businessName: new FormControl('', [Validators.required]),
        businessWebsite: new FormControl('', [Validators.required]),
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAIL_REGEX)]),
        city: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required, Validators.pattern(STATE_REGEX)]),
        zip: new FormControl('', [Validators.required, Validators.pattern(ZIP_REGEX)]),
        phone: new FormControl('', [Validators.required, Validators.pattern(PHONE_REGEX)]),
    })

    this.getAuth();
  }

    isInvalid() {
        return this.partnerSignUpForm.valid && this.captcha ? false : true;
    }


  facebookLogin(){
    this.auth.facebookLogin()
      .then((res)=> {
        console.log("FACEBOOK LOGIN", res);
        this.getAuth();
        this.router.navigate(['/dashboard']);
      })
  }

  googleLogin() {
      this.auth.googleLogin()
        .then((res) => {
            console.log("GOOGLE LOGIN", res);
            this.getAuth();
            this.router.navigate(['/dashboard']);
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
        .then((res) => {
            this.router.navigate(['/dashboard']);
        })
  }

  userEmailLogin() {
      this.auth.loginEmailUser(this.userCredentials.email, this.userCredentials.password)
      //check for error in response and handle errrors
        .then((res) => {
            this.router.navigate(['/dashboard']);
        })
  }

  partnerEmailLogin() {
      console.log("PARTNER LOGIN", this.partnerCredentials);
      //this.auth.loginEmailUser(this.partnerCredentials.email, this.userCredentials.password);
  }

  forgotPasswordModal() {
      this.dialog.open(PasswordResetModalComponent)
  }

  partnerEmailSignUp() {
      console.log("PARTNER DATA", this.partnerData);
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

}
