import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()

export class KoboApi {
    data:any;
    forms:any;

    constructor(private http:Http) {
        console.log('kobo api pipe loaded')
    }

    getForms() {
        return new Promise(resolve => {
            if(this.forms){
                resolve(this.forms)
            }
            else{
                var headers = new Headers();
                let auth = ('Basic '+btoa('ami:ami'));
                headers.append('Authorization', auth);
                console.log('getting forms from server');
                let options = new RequestOptions({headers:headers});
                let body='test body';
                this.http.post('http://kobo-api.stats4sd.org',body,options).subscribe(res=> {
                        var response = res;
                        this.forms=JSON.parse(response['_body']);
                        resolve(this.forms)
                    },
                    err => {
                        console.log('error: '+err)
                    })
            }
        })
    }
}


