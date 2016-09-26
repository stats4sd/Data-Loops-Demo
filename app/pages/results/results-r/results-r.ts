import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";

/*
  Generated class for the ResultsRPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/results/results-r/results-r.html',
})
export class ResultsRPage {

  constructor(private navCtrl: NavController, public viewCtrl:ViewController) {

  }
  close(){
    this.viewCtrl.dismiss()
  }

}
