import { Component, OnInit, NgZone } from '@angular/core';
import { GoogleMapsAPIWrapper, AgmCoreModule } from '@agm/core';
import { ModelService } from '../../../../../services/models.service';
import { MdDialog } from '@angular/material';
import { HelpModalComponent } from './help-modal/help-modal.component';
import { FavoritesModalComponent } from './favorites-modal/favorites-modal.component';
declare var google;
declare var Sketchfab;
import * as _ from "lodash";

@Component({
  selector: 'app-add-hunt-task',
  templateUrl: './add-hunt-task.component.html',
  styleUrls: ['./add-hunt-task.component.css']
})
export class AddHuntTaskComponent implements OnInit {
  titleTemp: String;
  hintTemp: String;
  pointsTemp: Number;
  types = [
    'picture', 'picture-geolocation', 'geolocation-model'
  ]
  type: String = 'picture';
  taskData = {
    tasks: []
  };
  lat: Number = 39.095915;
  lng: Number = -84.513952;
  map: any;
  markers: any = [];
  model: any;
  models: any;
  filter: any;
  filtered: any;
  selectedModelIndex: any;
  selectedModel: any;
  modelsPerm: any;
  // labelIterator = 1;


  constructor(
    private _ngZone: NgZone,
    private modelService: ModelService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {

  }

  addTask() {
    if (this.type === 'picture') {
       let pkg = { title: this.titleTemp, hint: this.hintTemp, type: this.type, points: this.pointsTemp};
       this.taskData.tasks.push(pkg);
    } else if (this.type === 'picture-geolocation') {
       let pkg = { title: this.titleTemp, hint: this.hintTemp, type: this.type, points: this.pointsTemp, lat: this.markers[0].position.lat(), lng: this.markers[0].position.lng() };
       this.taskData.tasks.push(pkg);
    } else {
       let pkg = { title: this.titleTemp, hint: this.hintTemp, type: this.type, points: this.pointsTemp, lat: this.markers[0].position.lat(), lng: this.markers[0].position.lng(), model: this.selectedModel };
       this.taskData.tasks.push(pkg);
       this.selectedModel = null;
       this.selectedModelIndex = -1;
    }
    this.titleTemp = '';
    this.hintTemp = '';
    if (this.map && this.markers.length > 0) {
        this.removeMarker();
    }
    this.markers = [];
    this.pointsTemp = null;
    console.log("TASK DATA AFTER ADD TASK", this.taskData);
  }

  checkType() {
    console.log("type check nigga", this.type);
    if ( this.type === 'picture-geolocation' || this.type === 'geolocation-model') {
        if (!this.map) {
           this.addMap(); 
        } 
        if (this.type === 'geolocation-model') {
          this.getModels();
        }
        
    } 
  }

  openHelpModal() {
      this.dialog.open(HelpModalComponent);
  }

  openFavoritesModal() {
    this.dialog.open(FavoritesModalComponent);
  }

  buttonDisabled() {
    if (this.type === 'picture' && this.titleTemp && this.hintTemp) {
        return false;
    } else if (this.type === 'picture-geolocation' && this.titleTemp && this.hintTemp && this.markers.length > 0) {
        return false;
    } else if (this.type === 'geolocation-model' && this.titleTemp && this.hintTemp && this.markers.length > 0 && this.selectedModel) {
        return false;
    } else {
      return true;
    }
  }

  getLocation() {
    window.navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                    console.log(position)
            })
}

addMap() {
     this.map = new google.maps.Map(document.getElementById('taskMap'), {
          center: {lat: this.lat, lng: this.lng},
          zoom: 15,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        let input = document.getElementById('search-input');
        let searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', () => {
          searchBox.setBounds(this.map.getBounds());
        });

        this.map.addListener('click', (event) => {
            this.addMarker(event.latLng);
        });

         let centerControlDiv:any = document.createElement('div');
         let centerControl = this.ResetButton(centerControlDiv, this.map);

        centerControlDiv.index = 1;
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);


        // this.markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', () => {
          let places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
        //   this.markers.forEach((marker) => {
        //     marker.setMap(null);
        //   });
        //   this.markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach((place) => {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            // this.markers.push(new google.maps.Marker({
            //   map: this.map,
            //   icon: icon,
            //   title: place.name,
            //   position: place.geometry.location
            // }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          this.map.fitBounds(bounds);
        });
}

      ResetButton(controlDiv, map) {

        // Set CSS for the control border.
      let controlUI = document.createElement('div');
          controlUI.style.backgroundColor = '#fff';
          controlUI.style.border = '2px solid #fff';
          controlUI.style.borderRadius = '3px';
          controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
          controlUI.style.cursor = 'pointer';
          controlUI.style.marginTop = '10px';
          controlUI.style.marginRight = '10px';
          controlUI.style.textAlign = 'center';
          controlUI.title = 'Click to Remove Button';
          controlDiv.appendChild(controlUI);

          // Set CSS for the control interior.
      let controlText = document.createElement('div');
          controlText.style.color = 'rgb(25,25,25)';
          controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
          controlText.style.fontSize = '11px';
          controlText.style.lineHeight = '25px';
          controlText.style.paddingLeft = '5px';
          controlText.style.paddingRight = '5px';
          controlText.innerHTML = 'Remove Marker';
          controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', () => {
          this.removeMarker();
         
          
        });

      }




addMarker(position) {
    console.log("POSITION", position.lat());
    

    if (this.markers.length < 1) {
        let marker = new google.maps.Marker({
            position: position,
            map: this.map
        });
        // this.labelIterator ++;
        this.markers.push(marker);
        console.log("markers", this.markers)
        this._ngZone.run(() => console.log("zone"));
    }

    // this.markerList.push({lat: position.lat(), lng: position.lng(), label: this.markerList.length + 1})
}

removeMarker() {
    console.log("BEFORE", this.markers);
    this.markers[0].setMap(null);
    console.log("AFTER", this.markers);
    this.markers.splice(0, 1);
    console.log("AFTER AFTER", this.markers);
    
}


getModelID(uid) {
    this.modelService.getModelID(uid)
        .then((modelid: any) => {
            console.log("Model ID", modelid);
            // this.addGeoLocations(modelid.id);
        })
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

selectModel(model, index) {
      console.log("SELECTED MODEL", model);
      this.selectedModelIndex = index;
      this.selectedModel = model;
  }



}
