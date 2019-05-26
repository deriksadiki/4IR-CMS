import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController) {

  }
  ionViewWillEnter(){
    let loading = this.loadingCtrl.create({
      spinner: "bubbles",
      content: "Please wait....",
      duration: 4000
    });
    loading.present();
  }
}
