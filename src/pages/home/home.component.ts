import { Component } from '@angular/core';

@Component({
  //selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'home';

  ngOnInit() {
    let browser = navigator.userAgent.toLowerCase();
    // alert(JSON.stringify(browser));
  }
}
