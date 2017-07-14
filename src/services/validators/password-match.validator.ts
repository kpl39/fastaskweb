import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

    static MatchPassword(AC): {[key: string]: any} {
       console.log("AC", AC);
       let password = AC.get('password').value; // to get value in input tag
       console.log("password", password);
       let confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
       console.log("confirm password", confirmPassword);
        if(password != confirmPassword) {
            console.log('false');
            AC.get('confirmPassword').setErrors( {MatchPassword: true} )
        } else {
            console.log('password match');
            return null
        }
    }
}


// export class PasswordValidation {

//   static nonEmpty(control: any) {
//     if (!control.value || control.value.length === 0) {
//       return { 'noElements': true };
//     }
//     return null;
//   }


//  static matchingPasswords(c: AbstractControl): {[key: string]: any} {
//     let password = c.get(['passwords']);
//     let confirmPassword = c.get(['confirmpwd']);

//     if (password.value !== confirmPassword.value) {
//       return { mismatchedPasswords: true };
//     }
//     return null;
//   }
// }