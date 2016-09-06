import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import {Observable} from 'rxjs/Rx'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()

export class KoboApi {
  data:any;
  forms:any;

  constructor(private http:Http) {
    console.log('kobo api pipe loaded')
  }

  koboRequest(url):Observable<any> {
    var headers = new Headers();
    let auth = ('Basic ' + btoa('chrismclarke:nra4ever'));
    headers.append('Authorization', auth);
    let options = new RequestOptions({headers: headers});
    let body = {url: url};
    return this.http.post('http://kobo-api.stats4sd.org', body, options)
      .map(function(res){
        let result = JSON.parse(res['_body']);
        console.log(result)
        return result
      })
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'))
  }

}



