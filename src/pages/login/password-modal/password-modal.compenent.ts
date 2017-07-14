import { Component } from '@angular/core';
import { MdDialog } from '@angular/material';
import { AuthService } from '../../../services/auth.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.css']
})
export class  PasswordResetModalComponent {

    notFound: Boolean = false;
    success: Boolean = false;
    email: String = '';
    emailResetForm: any;

    constructor(
      public dialog: MdDialog,
      private auth: AuthService
    ) {}


    ngOnInit() {
        this.emailResetForm = new FormGroup({
            email: new FormControl('', [Validators.required])
        })
    }

    resetPassword() {
        this.auth.resetPassword(this.email)
            .then((res:any) => {
                if (res) {
                    this.notFound = true;
                    this.success = false;
                } else {
                    this.notFound = false;
                    this.success = true;
                }
            })
    }


}