import { Injectable, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
//pouchDB made available to compiler through  @types/pouchdb (npm install @types/pouchdb --save --save-exact)
import PouchDB from 'pouchdb'


@Injectable()
export class PouchdbProvider {

    //declare private variables not available to template
    private isInstantiated: boolean;
    private database: any;
    private listener: EventEmitter<any> = new EventEmitter();
    // private remoteDetails: any;

    constructor(public http: Http) {
        //this.remoteDetails = this.http.get('assets/app-config.json').subscribe(res => this.remoteDetails = (res.json()))
        //setup db to connect to single database
        if (!this.isInstantiated) {
            this.database = new PouchDB("app-database");
            this.database.changes({
                live: true,
                include_docs: true
            }).on('change', change => {
                console.log('db changed')
                this.listener.emit(change);
            });
            this.isInstantiated = true;
            //this.database.sync()
        }
    }
    public get(id: string, options?:any) {
        return this.database.get(id);
    }

    public getAll(options?: any) {
        return this.database.allDocs(options);
    }

    public bulkDocs(docs) {
        return this.database.bulkDocs(docs);
    }
    public remove(id) {
        console.log('removing',id)
        this.database.get(id).then(function (doc) {
            return this.database.remove(doc);
        }.bind(this));
    }

    public put(document: any, id: string) {
        document._id = id;
        return this.get(id).then(result => {
            document._rev = result._rev;
            return this.database.put(document);
        }, error => {
            if (error.status == "404") {
                return this.database.put(document);
            } else {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }
        });
    }

    public getAttachment(id,filename) {
        return this.database.getAttachment(id, filename)
    .then(function (blob) {
        var url = URL.createObjectURL(blob);
        return url
    }).catch(function (err) {
        console.log('err',err);
        return ('assets/images/no-photo.png')
        
    });
}

    public checkExists(id: string) {
    return this.get(id).then(result => {
        return true
    }, error => {
        //not found error message
        if (error.status == "404") {
            return false
        } else {
            //other errors
            return false
        }
    });
}

    public sync(remote ?: string, options: any = {}) {
    console.log('setting up db sync')
    //default connection
    // if (!remote) {
    //     remote = this.remoteDetails['remote-couch-url']
    //     options = {
    //         "auth.username": this.remoteDetails.username,
    //         "auth.password": this.remoteDetails.password
    //     }
    // }
    var remoteSaved = "http://fumagaskiya-db.stats4sd.org/test"
    var optionsSaved = {
        "auth.username": "fumagaskiya-app",
        "auth.password": "AA61E1481D12534A9CABE87465474"
    }
    let remoteDatabase = new PouchDB(remoteSaved, optionsSaved);
    console.log('remoteDB', remoteDatabase)
    this.database.sync(remoteDatabase, {
        live: true,
        retry: true,
        continuous: true
    }).on('change', function (info) {
        //alert(info)
        console.log('change', info)
    }).on('paused', function (err) {
        console.log('paused', err)
    }).on('active', function () {
        // replicate resumed (e.g. new changes replicating, user went back online)
    }).on('denied', function (err) {
        console.log('denied', err)
    }).on('complete', function (info) {
        console.log('complete', info)
    }).on('error', function (err) {
        console.log('error', err)
    });
}

    public getChangeListener() {
    return this.listener;
}

}
