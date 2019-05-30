import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { IrMethodsProvider } from '../../providers/4-ir-methods/4-ir-methods';
import { HomePage } from '../home/home';
declare var google;
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  //variables
  category;
  password;
  email;
  orgName;
  address;
  orgAddressObject;
  cell;
  image;
  description;
  items = new Array();
  serviceArray = new Array();

  HighEducationInstitution = ["Testing and Analysis", "Rapid prototype", "Consultation", "Reseach", "Applied Research"];

  Library = ["Research ", "Training "];
  constructor(public IRmethods: IrMethodsProvider, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, private _ngZone: NgZone) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');


    console.log(this.category);

  }
  //register method
  Reg() {

    console.log(this.orgName);
    console.log(this.cell);
    console.log(this.address);
    console.log(this.description);
    console.log(this.email);
    console.log(this.password);
    console.log(this.category);

    // this.IRmethods.register(this.email, this.password,this.orgAddressObject.lat, this.orgAddressObject.lng, this.orgAddressObject.city,this.cell,this.category, this.orgName).then(()=>{
    //   this.navCtrl.push(HomePage)
    // })
  }

  //this method will automatically set the address(long,lat,region) from the address the user enters
  setAddress(event) {
    this.getcoo(this.address).then((data: any) => {
      this.orgAddressObject = data;
      console.log(this.orgAddressObject);
    }, Error => {
      const alert = this.alertCtrl.create({
        subTitle: 'The address you have entered is invalid, please enter a valid address',
        buttons: [
          {
            text: 'OK',
            handler: data => {
              this.address = ""
            }
          },
        ]
      });
      alert.present();
    })
  }

  //this method takes the address and converts it into long,lat and region
  getcoo(address) {
    return new Promise((accpt, rej) => {
      this._ngZone.run(() => {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var arr = results[0].address_components;
            var arr2 = arr[3];
            this.latitude = results[0].geometry.location.lat();
            this.longitude = results[0].geometry.location.lng();
            let position = {
              lat: results[0].geometry.location.lat(),
              lng: results[0].geometry.location.lng(),
              city: arr2.long_name
            };
            accpt(position);
          }
          else {
            rej('')
          }
        });
      });
    });
  }


  selectCategory() {
   console.log(this.category);
   

  }


  selectedServices(item) {
    console.log(item);
    this.serviceArray.push(item);
    console.log(this.serviceArray);

  }

  getItems(ev: any) {
    // Reset items back to all of the items

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}