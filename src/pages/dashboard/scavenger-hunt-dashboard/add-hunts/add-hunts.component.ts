import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-hunts',
  templateUrl: './add-hunts.component.html',
  styleUrls: ['./add-hunts.component.css']
})
export class AddHuntsComponent implements OnInit {

  constructor(
    public router: Router
  ) {
    router.events.subscribe((val) =>{
      this.checkURL();
    })
    // this.router.events.subscribe((val) => {
    //     // see also 
    //     console.log(val instanceof NavigationEnd) 
  }

  ngOnInit() {
    this.checkURL();
  }


  checkURL() {
    //REDO THIS BULLSHIT EVENTUALLY

    let baseRoute = '/dashboard/hunts/add/';
    switch (this.router.url) {
      case baseRoute + 'basic':
          document.getElementById("basicBubble").className = "active";
          document.getElementById("participantBubble").className = "";
          document.getElementById("taskBubble").className = "";
          document.getElementById("prizeBubble").className = "";
          document.getElementById("confirmBubble").className = "";
          break;
      case baseRoute + 'participant':
          document.getElementById("basicBubble").className = "active";
          document.getElementById("participantBubble").className = "active";
          document.getElementById("taskBubble").className = "";
          document.getElementById("prizeBubble").className = "";
          document.getElementById("confirmBubble").className = "";
          break;
      case baseRoute + 'task':
          document.getElementById("basicBubble").className = "active";
          document.getElementById("participantBubble").className = "active";
          document.getElementById("taskBubble").className = "active";
          document.getElementById("prizeBubble").className = "";
          document.getElementById("confirmBubble").className = "";
          break;
      case baseRoute + 'prize':
          document.getElementById("basicBubble").className = "active";
          document.getElementById("participantBubble").className = "active";
          document.getElementById("taskBubble").className = "active";
          document.getElementById("prizeBubble").className = "active";
          document.getElementById("confirmBubble").className = "";
          break;
      case baseRoute + 'confirm':
          document.getElementById("basicBubble").className = "active";
          document.getElementById("participantBubble").className = "active";
          document.getElementById("taskBubble").className = "active";
          document.getElementById("prizeBubble").className = "active";
          document.getElementById("confirmBubble").className = "active";
          break;
    }
  }

}
