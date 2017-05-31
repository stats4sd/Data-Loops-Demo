import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

declare var vg;
@Component({
  templateUrl: 'results-vega.html',
  selector:'results-vega'
})
export class ResultsVegaPage {
  platformHeight:number;
  platformWidth:number;
  results;

  constructor(private nav: NavController, params:NavParams, public viewCtrl:ViewController, public platform:Platform, private storage:Storage) {
    this.storage.get('results').then((results)=> {
      //convert from cached string to json format, use data from form id 69280
      let allResults=JSON.parse(results);
      this.results=allResults[69280];
      console.log(JSON.stringify(this.results));
      var embedSpec = {
        mode: "vega-lite",
        spec: generateSpec(this.results, platform.width(), platform.height())
      };
      var embedSpec2 = {
        mode: "vega-lite",
        spec: generateSpec2(this.results, platform.width(), platform.height())
    };
      var embedSpec3 = {
        mode: "vega",
        spec: generateSpec3(this.results, platform.width(), platform.height())
      };

      vg.embed("#vegaVis", embedSpec3, function(error, result) {
        console.log(error);
      });
      vg.embed("#vegaVis2", embedSpec2, function(error, result) {
        console.log(error);
      });
    });


  }

  close(){
    this.viewCtrl.dismiss();
  }

}

function generateSpec(data,width,height) {
  console.log(width);
  console.log(height);
  var barSpec = {
    "width": width,
    "height": height / 2,
    "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
    "data": {
      "values": data
    },
    "mark": "point",
    "encoding": {
      "x": {"field": "how_do_you_feel_today_", "type": "nominal"},
      "y": {"aggregate": "average", "field": "what_is_your_favourite_number_", "type": "quantitative"}
    }
  }
  return barSpec
}

function generateSpec2(data,width,height) {
  console.log(width);
  console.log(height);
  var barSpec = {
    "width": width,
    "height": height / 2,
    "padding": {"top": 10, "left": 30, "bottom": 30, "right": 10},
    "data": {
      "values": data
    },
    "mark": "bar",
    "transform": {
      "filter": "datum.what_is_your_favourite_number_ <= 100"
    },
    "encoding": {
      "x": {"field": "what_is_your_favourite_number_", "type": "quantitative", "bin": {"maxbins": 10}},
      "y": {"aggregate": "count", "field": "what_is_your_favourite_number_", "type": "quantitative"}
    }
  }
  return barSpec
}

function generateSpec3(data,deviceWidth,deviceHeight) {
  var specWidth=Math.min(deviceWidth-100,300);
  var specHeight=Math.min(deviceHeight-100,300);
  console.log(specWidth.toString())
  var barSpec = {
    "width": 1,
    "height": 1,
    "padding": "auto",
    /*"signals": [
      {
        "name": "tooltip",
        "init": {},
        "streams": [
          {"type": "symbol:mouseover", "expr": "datum"},
          {"type": "symbol:mouseout", "expr": "{}"}
        ]
      }
    ],*/
    "data": [
      {
        "name": "form-data",
        "values": data,
        "format": {
          "type": "json",
          "parse": {"what_is_your_favourite_number_": "number"}
        },
        "transform": [
          {
            "type": "filter",
            "test": "datum[\"what_is_your_favourite_number_\"] !== null && !isNaN(datum[\"what_is_your_favourite_number_\"])"
          }
        ]
      },
      {
        "name": "layout",
        "source": "form-data",
        "transform": [
          {
            "type": "aggregate",
            "summarize": [
              {
                "field": "how_do_you_feel_today_",
                "ops": ["distinct"]
              }
            ]
          },
          {"type": "formula","field": "width","expr": specWidth.toString()},
          {"type": "formula","field": "height","expr": specHeight.toString()}
        ]
      }
    ],
    "marks": [
      {
        "name": "root",
        "type": "group",
        "from": {"data": "layout"},
        "properties": {
          "update": {
            "width": {"field": "width"},
            "height": {"field": "height"}
          }
        },
        "marks": [
          {
            "name": "marks",
            "type": "symbol",
            "from": {"data": "form-data"},
            "properties": {
              "enter": {
                "x": {
                  "scale": "x",
                  "field": "how_do_you_feel_today_"
                },
                "y": {
                  "scale": "y",
                  "field": "what_is_your_favourite_number_"
                },
                "size": {"value": 30},
                "shape": {"value": "circle"},
                "strokeWidth": {"value": 2},
                "opacity": {"value": 0.7},
                "stroke": {"value": "#4682b4"},
                "fill": {"value": "transparent"}
              },
            }
          },
          /*{
            "type": "text",
            "properties": {
              "enter": {
                "align": {"value": "center"},
                "fill": {"value": "#333"}
              },
              "update": {
                "x": {"scale": "x", "signal": "tooltip.what_is_your_favourite_number_"},
                "dx": {"scale": "x", "band": true, "mult": 0.5},
                "y": {"scale": "y", "signal": "tooltip.y", "offset": -5},
                "text": {"signal": "tooltip.y"},
                "fillOpacity": [
                  { "test": "!tooltip._id",
                    "value": 0
                  },
                  {"value": 1}
                ]
              }
            }
          }*/
        ],
        "scales": [
          {
            "name": "x",
            "type": "ordinal",
            "domain": {
              "data": "form-data",
              "field": "how_do_you_feel_today_",
              "sort": true
            },
            "rangeMin": 0,
            "rangeMax": specWidth,
            "round": true,
            "points": true,
            "padding": 1
          },
          {
            "name": "y",
            "type": "linear",
            "domain": {
              "data": "form-data",
              "field": "what_is_your_favourite_number_"
            },
            "rangeMin": specHeight,
            "rangeMax": 0,
            "round": true,
            "nice": true,
            "zero": true
          }
        ],
        "axes": [
          {
            "type": "x",
            "scale": "x",
            "grid": false,
            "ticks": 5,
            "title": "how_do_you_feel_today_",
            "properties": {
              "labels": {
                "text": {
                  "template": "{{ datum[\"data\"] | truncate:25 }}"
                },
                "angle": {"value": 270},
                "align": {"value": "right"},
                "baseline": {"value": "middle"}
              }
            }
          },
          {
            "type": "y",
            "scale": "y",
            "format": "s",
            "grid": true,
            "layer": "back",
            "title": "what_is_your_favourite_number_"
          }
        ]
      }
    ]
  }
  return barSpec
}


