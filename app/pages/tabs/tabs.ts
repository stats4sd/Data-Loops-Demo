import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {FormsPage} from '../forms/forms';
import {ResultsPage} from '../results/results';

@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any;
  private tab2Root: any;
  private tab3Root: any;

  constructor() {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    this.tab1Root = HomePage;
    this.tab2Root = FormsPage;
    this.tab3Root = ResultsPage;
  }
}
