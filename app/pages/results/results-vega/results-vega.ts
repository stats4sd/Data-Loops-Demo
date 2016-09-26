import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

declare var vg;
@Component({
  templateUrl: 'build/pages/results/results-vega/results-vega.html',
})
export class ResultsVegaPage {

  constructor(private nav: NavController, params:NavParams, public viewCtrl:ViewController) {
    visValues=this.generateVisValues();
    var vlSpec = getSpec();
    var embedSpec = {
      mode: "vega-lite",
      spec: vlSpec
    };

    vg.embed("#vegaVis", demoSpec, function(error, result) {
    });
  }

  generateVisValues(){
    var vals=[];

    return vals
  }

  close(){
    this.viewCtrl.dismiss();
  }

}

var visValues;

function getSpec(){
  console.log(visValues);
  var spec = {
    "description": "The Trellis display by Becker et al. helped establish small multiples as a “powerful mechanism for understanding interactions in studies of how a response depends on explanatory variables”. Here we reproduce a trellis of Barley yields from the 1930s, complete with main-effects ordering to facilitate comparison.",
    "data": {
      "values": visValues
    },
    "mark": "point",
    "encoding": {
      "row": {"field": "site", "type": "ordinal"},
      "x": {"aggregate": "mean", "field": "grain yield", "type": "quantitative"},
      "y": {
        "field": "variety", "type": "ordinal",
        "sort": {"field": "grain yield","op": "mean"},
        "scale": {"bandSize": 12}
      },
      "color": {"field": "year", "type": "nominal"}
    }
  };
  return spec
}

var demoSpec={
  "width": 400,
  "height": 200,
  "padding": {"top": 10,"left": 30,"bottom": 30,"right": 10},
  "data": [
    {
      "name": "table",
      "values": [
        {"x": 1,"y": 28},
        {"x": 2,"y": 55},
        {"x": 3,"y": 43},
        {"x": 4,"y": 91},
        {"x": 5,"y": 81},
        {"x": 6,"y": 53},
        {"x": 7,"y": 19},
        {"x": 8,"y": 87},
        {"x": 9,"y": 52},
        {"x": 10,"y": 48},
        {"x": 11,"y": 24},
        {"x": 12,"y": 49},
        {"x": 13,"y": 87},
        {"x": 14,"y": 66},
        {"x": 15,"y": 17},
        {"x": 16,"y": 27},
        {"x": 17,"y": 68},
        {"x": 18,"y": 16},
        {"x": 19,"y": 49},
        {"x": 20,"y": 15}
      ]
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "ordinal",
      "range": "width",
      "domain": {"data": "table","field": "x"}
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "domain": {"data": "table","field": "y"},
      "nice": true
    }
  ],
  "axes": [{"type": "x","scale": "x"},{"type": "y","scale": "y"}],
  "marks": [
    {
      "type": "rect",
      "from": {"data": "table"},
      "properties": {
        "enter": {
          "x": {"scale": "x","field": "x"},
          "width": {"scale": "x","band": true,"offset": -1},
          "y": {"scale": "y","field": "y"},
          "y2": {"scale": "y","value": 0}
        },
        "update": {"fill": {"value": "steelblue"}},
        "hover": {"fill": {"value": "red"}}
      }
    }
  ]
};


