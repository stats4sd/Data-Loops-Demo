import {Injectable} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import  'leaflet';
import  'leaflet.markercluster';
// import  'leaflet.awesome-markers';

@Injectable()
export class MapService {
  baseMaps: any;

  constructor() {
    //initiatae map - required to define global variable L for some reason...works equally with console log
    var map=L.map('map')
    var mapInit = Map;
    this.baseMaps = {
      Online: new L.TileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
      Offline: new L.TileLayer('images/mapTiles/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    };
  }

  disableMouseEvent(tag: string) {
    var html = L.DomUtil.get(tag);

    L.DomEvent.disableClickPropagation(html);
    L.DomEvent.on(html, 'mousewheel', L.DomEvent.stopPropagation);
  };
}
