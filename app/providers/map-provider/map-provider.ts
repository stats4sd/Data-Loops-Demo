/// <reference path="../../../typings/globals/leaflet/index.d.ts"/>
import {Injectable} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {Map, TileLayer} from 'leaflet';

@Injectable()
export class MapService {
  map: Map;
  baseMaps: any;

  constructor() {
    //initiatae map - required to define global variable L for some reason...works equally with console log
    var mapInit = Map;
    this.baseMaps = {
      Online: new L.TileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
      }),
      Offline: new L.TileLayer('img/mapTiles/{z}/{x}/{y}.png', {
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
