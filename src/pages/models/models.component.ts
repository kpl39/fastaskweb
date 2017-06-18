import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';


@Component({
  //selector: 'models-bar',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent {
  title = 'Models';
  valid = false;
  models: any = {}; 

  constructor() {

  }

  dragFilesDropped(event) {
      console.log("EVENT", event);
      this.models = event;
      this.valid = true;
      
  }

  dragFileOverStart() {
      console.log("HOVER STARTED");
  }

  dragFileOverEnd(){
      console.log("HOVER ENDED");
  }

  test() {
      console.log("TEST");
  }

  submitModel() {
      console.log("Submitted: ", this.models);
  }

  removeFile(index) {
      this.models.acceptedFiles.splice(index, 1);
  }
}
