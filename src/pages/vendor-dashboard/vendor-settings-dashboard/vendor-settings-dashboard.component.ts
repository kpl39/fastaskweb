import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from '../../../services/validators/password-match.validator';


@Component({
  selector: 'app-vendor-settings-dashboard',
  templateUrl: './vendor-settings-dashboard.component.html',
  styleUrls: ['./vendor-settings-dashboard.component.css']
})
export class VendorSettingsDashboardComponent implements OnInit {

  userAuth: any;
  vendorInfo: any;
  validFile: Boolean;
  avatarFinished: Boolean = false;
  updateInfo: any;
  passwordForm: any;
  passwords: any = {};
  passwordReset: Boolean = false;
  companyInfoForm: any;

  constructor(
    private auth: AuthService,
    public router: Router,
    private fb: FormBuilder
  ) { }

   ngOnInit() {
        this.checkLoginStatus();
        this.createPasswordForm();
        this.createCompanyInfoForm();
    };

    createPasswordForm() {
        this.passwordForm =  {};
        this.passwordForm = this.fb.group(
            {
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required]
            }, {validator: PasswordValidation.MatchPassword}
        )
    }

    createCompanyInfoForm() {
        this.companyInfoForm = this.fb.group(
        {
          address: ['', Validators.required],
          city: ['', Validators.required],
          zip: ['', Validators.required],
          phone: ['', Validators.required],
          country: ['', Validators.required],
          website: ['', Validators.required]
        }
      )
    }


    checkLoginStatus() {
        this.auth.getAuthState()
            .then((userAuth) => {
                console.log("UserAuth", userAuth);
                if (!this.auth.isAuthenticated()) {
                    this.router.navigate(['login'])
                 } else {
                   this.userAuth = userAuth;
                   this.getVendorInfo();
                 }
            }) 
      };

    getVendorInfo() {
      console.log("Vendor Info");
      this.auth.getVendorInfo(this.userAuth.uid)
        .then((vendorInfo:any) => {
          console.log("VENDOR WEBSITE", vendorInfo);
          this.vendorInfo = vendorInfo;
          this.updateInfo = vendorInfo;
        })
    }

     uploadAvatar() {
          console.log("UPLOAD FILE")
          if (this.validFile) {
              let pkg = {
                  image: this.vendorInfo.profileurl,
                  userid: this.userAuth.uid,
                  id: this.vendorInfo.id
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
                this.vendorInfo.profileurl = reader.result;
            }

            reader.readAsDataURL(files[0]);
        }  else {
            this.validFile = false;
        }
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

    resetPasswordForm() {
         Object.keys(this.passwordForm.controls).forEach(key => {
          this.passwordForm.controls[key].setErrors(null)
        });
    }

    updateProfile() {
      let pkg = {
        address: this.vendorInfo.address,
        city: this.vendorInfo.city,
        zip: this.vendorInfo.zip,
        country: this.vendorInfo.country,
        phone: this.vendorInfo.phone,
        website: this.vendorInfo.website
      }

      this.auth.updateCompanyProfile(pkg)
        .then(res => console.log("RES FROM UPDATE PROFILE", res))
    }


}
