import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {KoboApi} from "../../providers/kobo-api/kobo-api";
import {Observable} from 'rxjs/Observable'


@Component({
  templateUrl: 'build/pages/forms/forms.html'
})

export class FormsPage {
  forms: any = [];
  anyErrors: boolean;
  finished: boolean;
  private data: Observable<any>;

  constructor(private koboApi:KoboApi) {
    this.koboApi.koboRequest('https://kc.kobotoolbox.org/api/v1/forms?format=json').subscribe(
      result =>this.forms = result,
      error =>this.anyErrors=true,
      () => this.finished = true
    );
  }



}
