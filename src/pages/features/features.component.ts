import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  // selector: 'customers-page',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css']
})
export class FeaturesComponent {
  title = 'customers';
  device: string;


  constructor(
    private auth: AuthService
  ) {

  }

  ngOnInit() { 
    this.checkDevice();
  }


  checkDevice() {
    this.auth.checkDevice()
      .then((res:string) => {
        console.log("RES FROM DEVICE CHECK", res);
        this.device = res;
      })
  }
}
