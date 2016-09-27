import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {KoboApi} from "../../../providers/kobo-api/kobo-api";
import {Observable} from 'rxjs/Observable'
import {Modal} from "ionic-angular/index";
import {ModalController} from "ionic-angular"
import {Storage, SqlStorage} from 'ionic-angular'
import {FormPopup} from "../form-popup/form-popup";



@Component({
  templateUrl: 'build/pages/sample-forms/forms-overview/forms-overview.html',
})
export class FormsOverviewPage {
  results: any = [];
  anyErrors: boolean;
  finished: boolean=true;
  forms:any;
  generating:boolean;
  enketoLink:any;
  storage:Storage;
  private data: Observable<any>;

  constructor(private koboApi:KoboApi, public nav:NavController, public modal:ModalController) {

   this.storage = new Storage(SqlStorage);
    this.storage.get('forms').then((forms)=>{
      if(forms){this.forms=(JSON.parse(forms))}
      else{this.finished=false;this.getResults()}
      console.log(this.forms)}
    )


  }

  getResults(){
    this.anyErrors=false;
    this.koboApi.koboRequest('https://kc.kobotoolbox.org/api/v1/forms').subscribe(
        result =>this.forms = result,
        error => {
          console.log(error);
          this.anyErrors = true;
          this.finished = true;
        },
        () => {
          this.finished = true;
          let i=0;
          this.storage.set('forms',JSON.stringify(this.forms));
          for(let form of this.forms){
            this.getLinks(form, i);
            i++
          }}
    );
  }

  getLinks(form, index){
    this.koboApi.koboRequest(form.url + '/enketo').subscribe(
        //**need to also save link to cache
        result =>{
          this.forms[index].enketoLink = result['enketo_url'].replace('https://','http://')
        },
              error =>{console.log(error)},
              () => {
                this.storage.set('forms',JSON.stringify(this.forms));
              })
        }

  openForm(form) {
    let modal = this.modal.create(FormPopup, {form: form}, {
      showBackdrop: false,
      enableBackdropDismiss: false
    });
    modal.onDidDismiss(data=> {
      console.log(data)
    });
    modal.present();
  }


  refresh(){
    console.log('refreshing');
    this.finished=false;
    this.getResults();
  }



}
