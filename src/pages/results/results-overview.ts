import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ModalController} from "ionic-angular"
import {ResultsMapPage} from "./results-map/results-map";
import {ResultsRPage} from "./results-r/results-r";
import {ResultsVegaPage} from "./results-vega/results-vega";
import {ResultsImagesPage} from "./results-images/results-images";
import { Storage } from '@ionic/storage';
import {KoboApi} from "../../providers/kobo-api";

@Component({
  templateUrl: 'results-overview.html',
  selector:'results-overview'
})
export class ResultsOverviewPage {
  results:{}={};
  finished:boolean=true;
  anyErrors:boolean=false;
  cachedResults:boolean[];
  customResults:any;
  forms:any;

  constructor(private koboApi:KoboApi, private navCtrl: NavController, public modal:ModalController, private storage:Storage) {
    this.customResults=customResults;
    this.storage.get('results').then((results)=> {
          if (results) {
            this.results = (JSON.parse(results))
          }
          else {
            this.finished = false;
          }
          this.getResults()
        })
  }

  getResults(){
    console.log('getting results');
    this.anyErrors=false;
    this.storage.get('forms').then((forms)=>{
      this.forms=JSON.parse(forms);
      this.updateResults();
    })
  }

  updateResults(){
    //***need to only mark finished if all forms complete, possibly give progress update - x of y received...possibly also for get forms****
    for (let form of this.forms){
      if(!this.results[form.formid]) {
        this.results[form.formid] = [];
      }
      console.log('getting result data from server');
        this.koboApi.koboRequest('https://kc.kobotoolbox.org/api/v1/data/'+form.formid).subscribe(
            result =>{
              this.results[form.formid] = result
            },
            error =>{
              console.log(error);
              this.anyErrors = true;
              this.finished = true;
            },
            () => {
              console.log('data received for form #'+form.formid+' - '+form.title);
              this.finished = true;
              this.storage.set('results',JSON.stringify(this.results));
            })
      }
  }

  refresh(){
    console.log('refreshing');
    this.finished=false;
    this.updateResults();
  }

  showResult(pageName){
    let pages={map:ResultsMapPage,r:ResultsRPage,vega:ResultsVegaPage, images:ResultsImagesPage};
    let modal = this.modal.create(pages[pageName], {
      showBackdrop: false,
      enableBackdropDismiss: false
    });
    modal.onDidDismiss(data=> {
      console.log(data)
    });
    modal.present();
  }

}

var customResults=[
  {
    Name: 'Images',
    Description: 'This demo provides simple summaries of data using pictures',
    FormData: 'Happiness Survey',
    ImageSrc:'images/results/ImagesDemo.png',
    ResultPageName:'images'
  },
  {
    Name: 'Map',
    Description: 'This demo uses Leaflet to display form data overlaid on a map',
    FormData: '',
    ImageSrc:'images/results/MapDemo.png',
    ResultPageName:'map'
  },
  {
    Name: 'R',
    Description: 'This demo connects to a remote server to process form data using R (internet required)',
    FormData: '',
    ImageSrc:'images/results/RDemo.png',
    ResultPageName:'r'
  },
  {
    Name: 'Charts',
    Description: 'This demo uses Vega to create graphical visualisations of data',
    FormData: '',
    ImageSrc:'images/results/ChartsDemo.png',
    ResultPageName:'vega'
  },

];
