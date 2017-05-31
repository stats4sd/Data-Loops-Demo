import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser'



@Component({
  templateUrl: 'form-popup.html',
  selector:'form-popup'
})

export class FormPopup {
  form:any;
  enketoLink:SafeResourceUrl;

  constructor(private params:NavParams, public viewCtrl:ViewController, private sanitizer:DomSanitizer) {
    this.form=params.data.form;
    //use sanitizer to avoid error unsafe resource url (trusted)
    this.enketoLink=this.sanitizer.bypassSecurityTrustResourceUrl(this.form.enketoLink);
    console.log(this.form);
  }
  close(){
    //attempts to retrieve info from loaded iframe .... not working - need to access iframe.contents which requires same domain (check on mobile?)
   /* var iframe:any = document.getElementById('form-iframe');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    console.log(innerDoc);
    let pending=document.getElementsByClassName('offline-enabled__queue-length');
    console.log(pending);
    this.viewCtrl.dismiss(pending)
    */
    this.viewCtrl.dismiss()
  }



}
