import { Injectable } from '@angular/core';
import 'rxjs';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';


@Injectable()
export class ChatService {
    private url ='https://server.xn--lt-xka.co';
    private socket;

    constructor() {}

    sendMessage(message) {
        console.log("Message", message);
        this.socket.emit('add-message', message);
    };

    getMessages() {
        let observable = new Observable(observer => {
            this.socket = io(this.url);

            console.log("SOCKET", this.socket);

            this.socket.on('message', (data) => {
                console.log("DATA", data);
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }


}
