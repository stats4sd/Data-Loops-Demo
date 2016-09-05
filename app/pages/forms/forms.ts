import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {KoboApi} from "../../providers/kobo-api/kobo-api";


@Component({
  templateUrl: 'build/pages/forms/forms.html'
})

export class FormsPage {
  koboApi:KoboApi;
  forms:any;
  constructor(private navCtrl: NavController, koboApi:KoboApi) {
    this.koboApi=koboApi;
    this.forms=this.koboApi.getForms().then(function(){
      console.log(this.forms)
    });
  }
}
