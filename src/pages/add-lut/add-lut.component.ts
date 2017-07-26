import { Component, NgZone } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { FileUploader } from 'ng2-file-upload';
import { ModelService } from '../../services/models.service';
import { TaskService } from '../../services/task.service';
import { GoogleMapsAPIWrapper, AgmCoreModule } from '@agm/core';
declare var google;
declare var Sketchfab;
declare var jQuery: any;
import * as _ from "lodash";

//$#@$#@$@#$#@$#@   Let Users give the markers a label after map click! $#@$#@$#@$#@$#@$@$#@#@


const IMAGE_REGEX = /^(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/;

@Component({
  // selector: 'customers-page',
  templateUrl: './add-lut.component.html',
  styleUrls: ['./add-lut.component.css']
})
export class AddLutComponent {
  title = 'Add Lut';
  addLutForm: any;
  addLutData: any = {
      locationbased: true,
      timed: false,
      national: false
  };
  minDate = new Date();
  image: any;
  validFile: Boolean;
  map: any;
  lat: Number = 38.8977;
  lng: Number = -77.0365;
  markers: any = [];
  labelIterator = 1;
  modelsPerm: any;
  models: any;
  selectedModel: any;
  filter: String;
  filtered: Boolean = false;
  taskid: any; 
  selectedModelIndex: Number = -1;

constructor(
    private modelService: ModelService,
    private taskService: TaskService,
    private googleMaps: GoogleMapsAPIWrapper, 
    private _ngZone: NgZone
) {
    this.getModels();
}

ngOnInit() {
  this.getLocation();

  this.addLutForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    startDate: new FormControl('', [Validators.required]),
    startTime: new FormControl('', [Validators.required]),
    prize: new FormControl('', [Validators.required]),
    timed: new FormControl('', []),
    locationbased: new FormControl('', []),
    national: new FormControl('', []),
    endDate: new FormControl('', [Validators.required]),
    endTime: new FormControl('', [Validators.required]),
    imageurl: new FormControl('', [Validators.pattern(IMAGE_REGEX) ]),
    // localNational: new FormControl('', [Validators.required]),
  })

  this.addMap();
}

// clicked(event) {
//     console.log("MAP CLICKED", event)
//     let coords = {
//         lat: event.coords.lat,
//         lng: event.coords.lng,
//         label: (this.markers.length + 1).toString(),
//         draggable: true
//     }
//     this.markers.push(coords);
//     console.log(this.markers)
// }

//  markerDragEnd(m, $event: MouseEvent) {
//     console.log('dragEnd', m, $event);
//   }

// clickedMarker(label: string, index: number) {
//     console.log(`clicked the marker: ${label || index}`)
//   }
  

getLocation() {
    window.navigator.geolocation.getCurrentPosition(
            position => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                    console.log(position)
            })
}

addMap() {
     this.map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -33.8688, lng: 151.2195},
          zoom: 13,
          mapTypeId: 'roadmap'
        });

        // Create the search box and link it to the UI element.
        let input = document.getElementById('pac-input');
        let searchBox = new google.maps.places.SearchBox(input);
        this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', () => {
          searchBox.setBounds(this.map.getBounds());
        });

        this.map.addListener('click', (event) => {
            this.addMarker(event.latLng);
        });


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

addMarker(position) {
    console.log("POSITION", position.lat());
  
    let marker = new google.maps.Marker({
        position: position,
        label: this.labelIterator.toString(),
        map: this.map
    });
    this.labelIterator ++;
    this.markers.push(marker);
    console.log("markers", this.markers)
    this._ngZone.run(() => console.log("zone"));
    // this.markerList.push({lat: position.lat(), lng: position.lng(), label: this.markerList.length + 1})
}

removeMarker(index) {
    console.log("BEFORE", this.markers);
    this.markers[index].setMap(null);
    console.log("AFTER", this.markers);
    this.markers.splice(index, 1);
    console.log("AFTER AFTER", this.markers);
    
}

uploadFile(files) {
    console.log("FILES", files);
    let reader:FileReader = new FileReader();

    if (files[0].type === 'image/png' || files[0].type === 'image/gif' || files[0].type === 'image/jpg') {
        this.validFile = true;
        reader.onloadend = (e) => {
            this.image = reader.result;
        }

        reader.readAsDataURL(files[0]);
    }  else {
        this.validFile = false;
    }
}

imageUrl() {
     if (this.addLutForm.controls.imageurl.valid) {
         console.log("image valid");
         this.image = this.addLutData.imageurl;
     } else {
         console.log("invalid image")
     }
}

onSubmit() {
    console.log("FORM DATA", this.addLutData);
    let startTimeSplit = this.addLutData.startTime.split(':');
    let startHours = startTimeSplit[0];
    let startMinutes = startTimeSplit[1];
    this.addLutData.startDate.setHours(startHours);
    this.addLutData.startDate.setMinutes(startMinutes);
    console.log("FINISHED DATE", this.addLutData.startDate);

    let endTimeSplit = this.addLutData.endTime.split(':');
    let endHours = endTimeSplit[0];
    let endMinutes = endTimeSplit[1];
    this.addLutData.endDate.setHours(endHours);
    this.addLutData.endDate.setMinutes(endMinutes);
    console.log("FINISHED END DATE", this.addLutData.endDate);


    let pkg: any = {
        title: this.addLutData.title,
        description: this.addLutData.description,
        active: false,
        starttime: this.addLutData.startDate.toISOString(),
        prize: this.addLutData.prize,
        entrydate: new Date().toISOString(),
        timed: this.addLutData.timed,
        locationbased: this.addLutData.locationbased,
        wikitude_file: null,
        endtime: this.addLutData.endDate.toISOString(),
        ended: false,
        national: this.addLutData.national,
        vendorid: 1
    }

    console.log("PACKAGE", pkg);

    if (this.validFile) {
        console.log("valid file")
        this.taskService.uploadTaskImage(this.image)
            .then((url:any) => {
                console.log("RES from AWS", url);
                pkg.imageurl = url.data;
                this.taskService.addTask(pkg)
                    .then((taskid: any) => {
                        console.log("RES FROM ADD TASK", taskid);
                        this.taskid = taskid.id;
                        this.getModelID(this.selectedModel);
                        this.addPromotion();
                    })

            })
    } else if (this.image) {
        pkg.imageurl = this.image;
        this.taskService.addTask(pkg)
            .then((taskid: any) => {
                console.log("RES FROM ADD TASK", taskid);
                this.taskid = taskid.id;
                this.getModelID(this.selectedModel);
                this.addPromotion();
            })
    }
    
}

addGeoLocations(modelid) {   
    let geolocations = [];
    this.markers.forEach((marker) => {
        let location = {
            taskid: this.taskid, 
            model_id: modelid, 
            latitude: marker.position.lat(),
            longitude: marker.position.lng(),
            discovered: false
        };
        geolocations.push(location);
    })
    console.log("GEOLOCATIONS", geolocations);
    this.taskService.addGeoLocations(geolocations)
        .then((res) => {
            console.log("RES FROM ADD GEOLOCATIONS", res);
        })
}

getModelID(uid) {
    this.modelService.getModelID(uid)
        .then((modelid: any) => {
            console.log("Model ID", modelid);
            this.addGeoLocations(modelid.id);
        })
}

typeChecked() {
    return this.addLutData.timed || this.addLutData.locationbased ? true : false;
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
// isInvalid() {
//     console.log(!this.addLutForm.valid)
//     return !this.addLutForm.valid
// }


addPromotion() {
    let pkg = {
        vendorid: 1,
        taskid: this.taskid,
        prize: this.addLutData.prize
    };

    this.taskService.addPromotion(pkg)
        .then((res) => {
            console.log("RES FROM ADD PROMO", res);
        })
}


}
