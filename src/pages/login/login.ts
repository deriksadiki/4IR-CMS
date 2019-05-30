import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController ,LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { IrMethodsProvider } from '../../providers/4-ir-methods/4-ir-methods';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public loadingCtrl:LoadingController,public IrMethodsProvider:IrMethodsProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  SignIn(email: string, password: string) {
    console.log(email, password)
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Signing in...',
      duration: 40000
    });
    loading.present();
    this.IrMethodsProvider.loginx(email, password).then((user: any) => {
      // console.log(user);
      this.IrMethodsProvider.checkVerification().then((data: any) => {
        if (data == 0) {
          const alert = this.alertCtrl.create({
            // title: "No Password",
            subTitle: "We have sent you a verification mail, Please activate your account with the link in the mail",
            buttons: ['OK'],
            // cssClass: 'myAlert',
          });
          loading.dismiss()
          alert.present();
        }
        else if (data == 1) {
          loading.dismiss()
          this.navCtrl.setRoot(HomePage);
        }
      })
    }).catch((error) => {
      const alert = this.alertCtrl.create({
        // title: "No Password",
        subTitle: error.message,
        buttons: ['OK'],
        cssClass: 'myAlert',
      });
      loading.dismiss()
      alert.present();
    })
    this.navCtrl.push(HomePage)
  }

  Signup(){
  this.navCtrl.push(RegisterPage)
  }
  
}
