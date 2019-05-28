import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { LoginPageModule } from '../login/login.module';
import { LoginPage } from '../login/login';
import { IrMethodsProvider } from '../../providers/4-ir-methods/4-ir-methods';
import { OrganizationProfilePage } from '../organization-profile/organization-profile';


declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  orgArray = new Array();
  lat = -26.2620;
  map;
  lng=27.9503;
  marker;
  showMultipleMarker;
  constructor(public loadingCtrl: LoadingController, public navCtrl: NavController, public IRmethods: IrMethodsProvider) {
    this.IRmethods.getAllOrganizations().then((data: any) => {
      this.orgArray = data;

      console.log(data);
      // setTimeout(() => {
      //   this.loading.dismiss()
      // }, 2500);
    })

    setTimeout(() => {
      this.IRmethods.getCurrentLocation(this.lat , this.lng).then((radius:any)=>{
       
        console.log(this.lat);
       console.log(this.lng);
        console.log(radius);
        
     
      })
      
    }, 5000);
      
    
      
  }
  ionViewWillEnter() {
    // let loading = this.loadingCtrl.create({
    //   spinner: "bubbles",
    //   content: "Please wait....",
    //   duration: 4000
    // });
    // loading.present();

  }

  ngOnInit() {
    this.initMap()
  }


  logOut() {
    this.IRmethods.logout().then(() => {
      this.navCtrl.push(LoginPage, { out: 'logout' });
    }, (error) => {
      console.log(error.message);
    })
  }
  initMap() {
console.log(this.lng)
    const options = {
      center: { lat: this.lat, lng: this.lng },
      zoom: 14,
      disableDefaultUI: true,
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);

    // adding user marker to the map 
    this.marker = new google.maps.Marker({
      map: this.map,
      zoom: 10,
      position: this.map.getCenter()
      //animation: google.maps.Animation.DROP,
    });

    setTimeout(() => {
      this.markers();
    }, 4000)


    console.log("test");


  }


  
  markers() {
    console.log(this.orgArray);
    for (let index = 0; index < this.orgArray.length; index++) {
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/'
      this.showMultipleMarker = new google.maps.Marker({
        map: this.map,
        //  icon: this.icon,
        position: { lat: parseFloat(this.orgArray[index].lat), lng: parseFloat(this.orgArray[index].long) },
        label: name,
        zoom: 8,

      });

    }
  }

  GoToOrgProfile(){

    this.navCtrl.push(OrganizationProfilePage);
  }
}
