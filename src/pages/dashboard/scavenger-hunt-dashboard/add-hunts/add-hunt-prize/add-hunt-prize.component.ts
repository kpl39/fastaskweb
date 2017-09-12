import { Component, OnInit } from '@angular/core';
import { HuntService } from '../../../../../services/hunt.service';


@Component({
  selector: 'app-add-hunt-prize',
  templateUrl: './add-hunt-prize.component.html',
  styleUrls: ['./add-hunt-prize.component.css']
})
export class AddHuntPrizeComponent implements OnInit {

  prize: string;

  constructor(
    private hunt: HuntService
  ) { }

  ngOnInit() {
    console.log("PRIZE PAGE")
  }

  getData() {
    this.hunt.getData('prize')
      .then((data:any) => {
        console.log("PRIZE DATA", data);
        this.prize = data.prize;
      }) 
  }

  setData() {
    let pkg = {
      prize: this.prize
    }
    this.hunt.setData('prize', pkg);
  }

  ngOnDestroy() {
    this.setData();
  }

}
