import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import 'rxjs';
import { Observable } from 'rxjs/Observable';





@Injectable()
export class HuntService {

    huntData: any = {};

constructor(
     private http: Http
    ) {}



  getData(type) {
      return new Promise(resolve => {
          if (type === 'all') {
              resolve(this.huntData);
          } else {
              if (this.huntData[type]) {
                resolve(this.huntData[type]);
              } else {
                  resolve(null);
              }
          };
      })
  }

  setData(type, pkg) {
      this.huntData[type] = pkg;
      console.log("SET DATA", this.huntData[type]);
  }

  clearData() {
      this.huntData = {};
  }



}