import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Camera } from '@ionic-native/camera';
import { PouchdbProvider } from '../../providers/pouchdb-provider';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'form-view',
  templateUrl: 'form-view.html'
})

export class FormViewComponent {
  form: any;
  enketoLink: SafeResourceUrl;
  instanceID: String;
  public base64Image: String;
  public showCamera = true;
  local: Storage;
  opened: Boolean = false;
  opacity: Number = 0;
  pointerEvents: String = 'none';
  tabBarElement: any;
  iframeHeight: any;

  // define input properties. assign variable iframSrc from src property
  @Input('src') iframeSrc;
  @Input('form') iframeForm;
  @Output() onFormClosed = new EventEmitter<any>();

  constructor(private params: NavParams, public viewCtrl: ViewController, private sanitizer: DomSanitizer, private database: PouchdbProvider, private camera: Camera) {
    this.tabBarElement = document.querySelector('.tabbar');
    this.iframeHeight=(window.innerHeight-54)+"px"
  }
  ngOnChanges(changes) {
    if (changes.iframeForm && !changes.iframeForm.firstChange && changes.iframeForm.currentValue.doc) {
      this.form = changes.iframeForm.currentValue.doc
      this.open();
    }
  }
  ngAfterViewInit() {


    // console.log('setting iframe source',this.iframeSrc);
    // this.enketoLink = this.sanitizer.bypassSecurityTrustResourceUrl(this.iframeSrc);

    //add event listener for messages sent from enketo iframe
    //note - currently not useful as enketo only correctly firing message on edit start but not submission success
    //https://github.com/kobotoolbox/enketo-express/issues/670
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
      // TODO in real life, check origin! if (event.origin !== "http://enk.to:8080") return;
      console.log('data received from iframe', event);
    }

  }
  ionViewDidLoad() { }
  
  open() {
    this.instanceID = this.setInstanceID();
    var link = this.setIframeLink(this.form.enketoLink);
    this.enketoLink = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    this.opacity = 1;
    this.pointerEvents = 'auto';
    this.opened = true;
    this.tabBarElement.style.display = 'none';
    this.onFormClosed.emit('opened');
  };

  close() {
    this.opacity = 0;
    this.pointerEvents = 'none';
    this.tabBarElement.style.display = 'flex';
    this.onFormClosed.emit('closed');
  }
  takePhoto() {
    // console.log('hacking into enketo storage');
    // this.local = new Storage(['indexeddb', 'websql', 'localstorage'], { name: 'enketo', storeName: 'keyvaluepairs' });
    // this.local.get('properties').then(res => console.log('get request', res))
    // this.local.set('test','hii')
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetWidth: 1000,
      targetHeight: 1500,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      // imageData is a base64 encoded string
      this.base64Image = "data:image/jpeg;base64," + imageData;
      let fileName = this.instanceID + '.jpeg'
      var doc = {
        _attachments: {},
        photoID: this.instanceID,
        timestamp: new Date().toString(),
      }
      doc._attachments[fileName] = {
        content_type: 'image/jpeg',
        data: imageData
      }
      this.database.put(doc, 'photos_' + this.form.id_string + '/' + this.instanceID)
    }, (err) => {
      console.log(err);
    });
  }
  setIframeLink(link) {
    console.log('setting iframe link', link)
    //create autopopulate query parameters (currently only a deprecated instanceID, later could pull multiple)
    //need to make sure field isn't removed in future update. Query logged on other ways to populate a non interactive element (so user can't change it)
    var fillField = "meta/instanceID";
    var fillValue = this.instanceID;
    var fillQueryParam = "[/" + this.form.id_string + '/' + fillField + "]=" + fillValue;
    //add callback window parameter to receive postmessage from enketo iframe
    var origin = window.location.origin
    var originQueryParam = "parentWindowOrigin=" + encodeURI(origin)
    //rewrite url to put query params before id for offline form 
    //more info see https://help.ona.io/faq/prefilling-form-fields-using-enketo and https://github.com/kobotoolbox/enketo-express/issues/386
    //warning - could easily be broken by changes to enketo
    var stringLength = link.length
    var linkPrefix = link.slice(0, stringLength - 7)
    var linkSuffix = link.slice(stringLength - 5)
    return linkPrefix + '_/?d' + fillQueryParam + '&' + originQueryParam + linkSuffix
    // var testLink1= 'https://ee.kobotoolbox.org/_/?d[/fuma-op-membre/nom_Membre]=chris#YPfh'
    // var testLink2= 'https://ee.kobotoolbox.org/_/?parentWindowOrigin=http%3A%2F%2Flocalhost:8100#YPfh'
    //var testLink3= 'https://ee.kobotoolbox.org/::YPfh?parentWindowOrigin=http%3A%2F%2Flocalhost:8100#YPfh'
  }
  setInstanceID() {
    //code used by polymer to create pushid. As not exposed to api (?) running manually
    // https://gist.github.com/mikelehen/3596a30bd69384624c11
    //https://firebase.googleblog.com/2015/02/the-2120-ways-to-ensure-unique_68.html
    // Modeled after base64 web-safe chars, but ordered by ASCII.
    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
    var lastPushTime = 0;
    // We generate 72-bits of randomness which get turned into 12 characters and appended to the
    // timestamp to prevent collisions with other clients.  We store the last characters we
    // generated because in the event of a collision, we'll use those same characters except
    // "incremented" by one.
    var lastRandChars = [];
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;
    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0) throw new Error('We should have converted the entire timestamp.');
    var id = timeStampChars.join('');
    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error('Length should be 20.');
    return id
  };
}




