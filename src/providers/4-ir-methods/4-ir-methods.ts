
import { Injectable,NgZone } from '@angular/core';
import { LoadingController, AlertController, UrlSerializer, registerModeConfigs} from "ionic-angular";
declare var firebase;
/*
  Generated class for the 4IrMethodsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IrMethodsProvider {

  constructor(private ngzone: NgZone,public loadingCtrl: LoadingController,  public alertCtrl: AlertController,) {

    console.log('Hello 4IrMethodsProvider Provider');
  }

  register(email, psswrd, lat,long,region,cell,category, Orgname){
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        let loading = this.loadingCtrl.create({
          spinner: "bubbles",
          content: "Signing in....",
        });
        loading.present();
        return firebase.auth().createUserWithEmailAndPassword(email, psswrd).then(newUser => {
            var user = firebase.auth().currentUser;
            firebase
              .database()
              .ref("Organizations/" + user.uid)
              .set({
                name: Orgname,
                email: email,
                contact: cell,
                category: category,
                long : long,
                lat : lat,
                region : region,
                downloadurl: "assets/download.png",
              });
            resolve();
            setTimeout(() => {
              loading.dismiss();
            }, 100);
          })
          .catch(error => {
            loading.dismiss();
            const alert = this.alertCtrl.create({
              subTitle: error.message,
              buttons: [
                {
                  text: "OK",
                  handler: data => {
                    console.log("Cancel clicked");
                  }
                }
              ]
            });
            alert.present();
            console.log(error);
          });
      });
    });
  }

}
