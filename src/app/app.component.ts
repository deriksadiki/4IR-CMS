import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IrMethodsProvider } from '../providers/4-ir-methods/4-ir-methods';

import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { LoginPage } from '../pages/login/login';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public IrMethodsProvider:IrMethodsProvider) {
    platform.ready().then(() => {

      IrMethodsProvider.checkstate().then((data: any) => {
        if (data == 1) {
          this.rootPage = HomePage
        }
        else {
          this.rootPage = LoginPage
        }
      })
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

