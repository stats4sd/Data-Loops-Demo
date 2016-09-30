import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic-angular';
import {Observable} from 'rxjs/Observable'
import {ViewController} from "ionic-angular/index";


@Component({
  templateUrl: 'build/pages/results//results-images/results-images.html'
})
export class ResultsImagesPage {
  results: any = [];
  storage:Storage;
  anyErrors: boolean;
  finished: boolean;
  private data: Observable<any>;

  constructor( public viewCtrl:ViewController) {
    this.storage = new Storage(SqlStorage);
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
