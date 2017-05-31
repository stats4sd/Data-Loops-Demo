import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Observable'
import {ViewController} from "ionic-angular/index";


@Component({
  templateUrl: 'results-images.html',
  selector:'results-images'
})
export class ResultsImagesPage {
  results: any = [];
  anyErrors: boolean;
  finished: boolean;
  private data: Observable<any>;

  constructor( public viewCtrl:ViewController, private storage:Storage) {
    this.storage.get('results').then((results)=> {
      //convert from cached string to json format, use data from form id 69280
      let allResults=JSON.parse(results);
      this.results=allResults[69280];
      console.log(this.results)
    })
  }
  close(){
    this.viewCtrl.dismiss()
  }
}
