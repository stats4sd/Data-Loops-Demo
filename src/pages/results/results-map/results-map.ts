import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import {MapService} from "../../../providers/map-provider";
import { Storage } from '@ionic/storage';

//declare L to allow for awesome markers (couldn't figure out how to update typescript index)
declare var L;

@Component({
  templateUrl: 'results-map.html',
  selector:'results-map',
})
export class ResultsMapPage {

  mapService:any;
  results:any;

  constructor(private nav: NavController, params:NavParams, mapService:MapService, public viewCtrl:ViewController, private storage:Storage) {
    this.mapService=mapService;
  }

  //after view loaded add the map
  ionViewLoaded() {
    console.log('loading map');
    var map = new L.Map('map', {
      zoomControl: false,
      center: [18,8],
      zoom: 2,
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
    //need to remove then read as sometimes basemap disappears after navigating away
    map.removeLayer(this.mapService.baseMaps.Offline);
    map.addLayer(this.mapService.baseMaps.Offline);
    var baseMaps=this.mapService.baseMaps;

    //function to change online/offline map and give warning after zoom
    map.on('zoomend',function(){
      var z =map.getZoom();
      if (z<6){this.zoomWarning=false}
      if (z>=6){this.zoomWarning=true}
      if (z>6){return baseMaps.Online.addTo(map) }
      //bind this allows to update scope through external callback function
    }.bind(this));

    //get data and load map points
    this.storage.get('results').then((results)=> {
      //convert from cached string to json format, use data from form id 69280
      let allResults=JSON.parse(results);
      this.results=allResults[69280];
      this.addMapPoints(map,this.results)
    });

    this.mapService.map = map;
  }
  close(){
    this.viewCtrl.dismiss()
  }
  addMapPoints(map,data){
    console.log('adding map points');
    console.log(data);
    var markersClusterGroup=L.markerClusterGroup({
      showCoverageOnHover:false,
    });
    for(let item of data){
      //if gps recorded
      if(item['_geolocation'][0]!=null){
        var iconData = generateIconData(item);
        var icon = L.AwesomeMarkers.icon(iconData);
        var marker = L.marker(item['_geolocation'], {icon: icon});
        var popupContent=
            "<h3>"+item['what_s_your_name_']+"</h3>"
            +"<p>"+item['would_you_like_to_add_a_comment_']+"</p>";
        marker.bindPopup(popupContent);
        markersClusterGroup.addLayer(marker);
        /*marker.addTo(map);*/
      }
    }
    map.addLayer(markersClusterGroup)
  }
}

function generateIconData(item){
  var icon, color;
  if(item['how_do_you_feel_today_']=='Happy'){color='green';icon='smile-o';}
  else if(item['how_do_you_feel_today_']=='Neutral'){color='orange';icon='meh-o';}
  else if(item['how_do_you_feel_today_']=='Unhappy'){color='red';icon='frown-o';}
  var iconData = {
    icon:icon,
    markerColor:color,
    prefix:'fa'
  };
  return iconData
}


