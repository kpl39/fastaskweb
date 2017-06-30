import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../../services/auth.service';
import { ChartService } from '../../services/chart.service';



const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const PHONE_REGEX = /^\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}$/;
const ZIP_REGEX = /^[0-9]{5}$/;
const STATE_REGEX = /^[a-zA-Z]{2}$/;


@Component({
  // selector: 'customers-page',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})



export class CustomersComponent {
  title = 'customers';
  errorField: any;
  customerData: any = {};
  captcha: Boolean = false;
  //states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'];
  custForm: any;
  options: any;
  hourOptions: any;

  constructor(
      private http: Http,
      private auth: AuthService,
      private chart: ChartService
    ) {

    }



ngOnInit() {
  this.custForm = new FormGroup({
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
  this.makeChart();
  this.makeTimeChart();
}

  showData() {
    console.log("CUSTOMER DATA", this.customerData);
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

  onSubmit() {
    console.log("FORM DATA SUBMIT", this.customerData)
  }

  isInvalid() {
    return this.custForm.valid && this.captcha ? false : true;
  }

  makeChart() {
    this.options = this.chart.makeChart();
  }

  makeTimeChart() {
    this.hourOptions = this.chart.makeTimeChart();
  }
  
}
