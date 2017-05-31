import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule } from '@ionic/storage';
//native components
import { Camera } from '@ionic-native/camera';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
// app tabs
import { TabsPage } from '../pages/tabs/tabs';
// app pages
import { HomePage } from '../pages/home/home';
import { ResultsOverviewPage } from '../pages/results/results-overview';
import { ResultsImagesPage } from '../pages/results/results-images/results-images';
import { ResultsMapPage } from '../pages/results/results-map/results-map';
import { ResultsRPage } from '../pages/results/results-r/results-r';
import { ResultsVegaPage } from '../pages/results/results-vega/results-vega';
import { FormPopup } from '../pages/sample-forms/form-popup/form-popup';
import { FormsOverviewPage } from '../pages/sample-forms/forms-overview/forms-overview';
//components
import { FormViewComponent } from '../components/form-view/form-view';
//providers
import { PouchdbProvider } from '../providers/pouchdb-provider';
import { KoboApi } from '../providers/kobo-api';
import { MapService } from '../providers/map-provider';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    HomePage,
    ResultsOverviewPage,
    ResultsImagesPage,
    ResultsMapPage,
    ResultsRPage,
    ResultsVegaPage,
    FormPopup,
    FormsOverviewPage,
    FormViewComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    HomePage,
    ResultsOverviewPage,
    ResultsImagesPage,
    ResultsMapPage,
    ResultsRPage,
    ResultsVegaPage,
    FormPopup,
    FormsOverviewPage,
    FormViewComponent
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, PouchdbProvider, KoboApi, MapService, Camera, StatusBar, SplashScreen]
})
export class AppModule { }
