import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {MapService} from "../../../providers/map-provider/map-provider";

//declare L to allow for awesome markers (couldn't figure out how to update typescript index)
declare var L;

@Component({
  templateUrl: 'build/pages/results/results-map/results-map.html',
  providers: [MapService]
})
export class ResultsMapPage {

    mapService:any;

  constructor(private nav: NavController, params:NavParams, mapService:MapService, public viewCtrl:ViewController) {
    this.mapService=mapService;
  }

  //after view loaded add the map
  ionViewLoaded() {
    var map = new L.Map('map', {
      zoomControl: false,
      center: [18,8],
      zoom: 4,
      maxNativeZoom:8,
      minZoom: 1,
      maxZoom: 15,
      layers: [this.mapService.baseMaps.Offline],
      touchZoom: false
    });

    L.control.zoom({position:'topright'}).addTo(map);
    L.control.layers(this.mapService.baseMaps).addTo(map);
    L.control.scale().addTo(map);

    //timeout function needed to recentre map in div
    setTimeout(function(){
      map.invalidateSize({reset:true});
    },0);
    //need to remove then readd as sometimes basemap disappears after navigating away
    map.removeLayer(this.mapService.baseMaps.Offline);
    map.addLayer(this.mapService.baseMaps.Offline);
    var baseMaps=this.mapService.baseMaps;

    map.on('zoomend',function(){
      var z =map.getZoom();
      if (z<12){this.zoomWarning=false}
      if (z>=12){this.zoomWarning=true}
      if (z>12){return baseMaps.Online.addTo(map) }
      //bind this allows to update scope through external callback function
    }.bind(this));

    //add markers
    var redMarker = L.AwesomeMarkers.icon({
      icon: 'shopping-cart',
      markerColor: 'red',
      prefix:'fa'
    });

    this.mapService.map = map;
  }
  close(){
    this.viewCtrl.dismiss()
  }
}
