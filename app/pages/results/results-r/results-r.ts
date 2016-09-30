import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {ViewController} from "ionic-angular/index";
import {Storage, SqlStorage} from 'ionic-angular';


declare var ocpu, $;

@Component({
  templateUrl: 'build/pages/results/results-r/results-r.html',
})
export class ResultsRPage {
  numberList:number[]=[];
  factorList:string[]=[];
  statMethods:string[];
  plotMethods:string[];
  output:any;
  storage:Storage;
  results:any;
  showPlot:boolean;


  constructor(private navCtrl: NavController, public viewCtrl:ViewController) {
    this.storage = new Storage(SqlStorage);
    this.storage.get('results').then((results)=> {
      //convert from cached string to json format, use data from form id 69280
      let allResults=JSON.parse(results);
      this.results=allResults[69280];
      console.log(this.results);
      for(let result of this.results){
        this.numberList.push(parseInt(result['what_is_your_favourite_number_']));
        this.factorList.push(result['how_do_you_feel_today_']);
      }
    });
    this.statMethods=['sd','median','weighted.mean'];
    this.plotMethods=['qplot'];

  }
  calculate(method){
    console.log(method);
    console.log(this.numberList)
    this.output='calculating';
    var callback = function(output){
      this.output=output;
    }.bind(this);
    var stat=method;
    var x = this.numberList;
    ocpu.seturl("http://public.opencpu.org/ocpu/library/stats/R");
    var req = ocpu.rpc(stat,{
      x : x
    }, callback);

//optional
    req.fail(function(){
      alert("R returned an error: " + req.responseText);
    });
  }

  makePlot(plotType){
    this.showPlot=true;
    ocpu.seturl("http://public.opencpu.org/ocpu/library/ggplot2/R");

    var req = $('#plot').rplot(plotType,{
      x : this.factorList,
      y: this.numberList
    });

//optional
    req.fail(function(){
      alert("R returned an error: " + req.responseText);
    });
  }


  close(){
    this.viewCtrl.dismiss()
  }

}
