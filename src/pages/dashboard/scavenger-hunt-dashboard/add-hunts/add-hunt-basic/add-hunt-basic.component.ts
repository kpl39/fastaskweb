import { Component, OnInit } from '@angular/core';
import { HuntService } from '../../../../../services/hunt.service';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-hunt-basic',
  templateUrl: './add-hunt-basic.component.html',
  styleUrls: ['./add-hunt-basic.component.css']
})
export class AddHuntBasicComponent implements OnInit {

  basicData: any;
  basicForm: any;
  minDate = new Date();

  constructor(
    public huntService: HuntService
  ) {
    this.basicForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      endTime: new FormControl('', [Validators.required]),
      startDate: new FormControl('', [Validators.required]),
      startTime: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() {
    this.getData();
  }

  getData() {
     this.huntService.getData('basic')
      .then((data) => {
        if (!data) {
          this.basicData = {};
        } else {
          this.basicData = data;
        }
      })
  }


  setData() {
    this.huntService.setData('basic', this.basicData);
  }

  ngOnDestroy() {
         this.setData();
    }

}
