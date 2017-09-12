import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';

@Component({
  //selector: 'home-page',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'home';
  messages = [];
  connection;
  message;

  constructor(
    private chatservice: ChatService
  ){}

  ngOnInit() {
    let browser = navigator.userAgent.toLowerCase();
    // alert(JSON.stringify(browser));
    this.connection = this.chatservice.getMessages()
      .subscribe(message => {
        this.messages.push(message);
      })
  }

  sendMessage() {
    this.chatservice.sendMessage(this.message);
    this.message = '';
  }
 

}
