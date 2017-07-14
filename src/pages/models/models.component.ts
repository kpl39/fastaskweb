import { Component } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { ModelService } from '../../services/models.service';
declare var Sketchfab;
declare var jQuery: any;
import * as _ from "lodash";


@Component({
  //selector: 'models-bar',
  templateUrl: './models.component.html',
  styleUrls: ['./models.component.css']
})
export class ModelsComponent {
  title = 'Models';
  valid = false;
  modelsPerm: any;
  models: any;
  filter: String;
  filtered: Boolean = false;

  constructor(
     private modelService: ModelService
  ) {
    this.getModels();
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

  getModels() {
      this.modelService.getModels()
        .then((models:any) => {
            console.log("MODELS", models);
            models.forEach((model) => {
                model.thumbnails.images.forEach((image) =>{
                    if (image.height === 144) {
                        model.thumburl = image.url;
                    }
                })
            })

            this.models = models;
            this.modelsPerm = models;
            this.initModel(null);
        })
  }

  openModel3D(uid) {
      console.log("OPEN MODEL 3D", uid);
      this.initModel(uid);
  }

  initModel(url) {
    let iframe = document.getElementById('api-frame');
    let version = '1.0.0';
    // let urlid = '7w7pAfrCfjovwykkEeRFLGw5SXS';
    let urlid = url || this.models[0].uid;
    let client = new Sketchfab( version, iframe );

    client.init( urlid, {
        success: function onSuccess( api ){
            api.start();
            api.addEventListener( 'viewerready', function() {

                // API is ready to use
                // Insert your code here
                console.log( 'Viewer is ready' );

            } );
        },
        error: function onError() {
            console.log( 'Viewer error' );
        }
    } );


  }

  filterModels() {
      console.log("FILTER MODELS")
      let filter = this.filter.toLowerCase();
      let temp = [];
      this.models.forEach((model) => {
          if (model.tags.length > 0) {
              model.tags.forEach((tag) => {
                  let tagLower = tag.name.toLowerCase();
                  if (tagLower === filter) {
                      temp.push(model);
                  }
              })
          }
      })
       this.models = _.uniqBy(temp, 'uid');
       this.filtered = true;
  }

  clearFilter() {
      this.models = this.modelsPerm;
      this.filter = '';
      this.filtered = false;
  }

}
