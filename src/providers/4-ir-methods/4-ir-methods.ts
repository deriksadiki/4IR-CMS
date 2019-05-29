
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
  stayLoggedIn;
  orgArray = new Array();
  detailArray= new Array();
  orgNames = new Array();
  constructor(private ngzone: NgZone,public loadingCtrl: LoadingController,  public alertCtrl: AlertController,) {

    console.log('Hello 4IrMethodsProvider Provider');
  }

  checkstate() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
            this.stayLoggedIn = 1
          }
          else {
            this.stayLoggedIn = 0
          }
          resolve(this.stayLoggedIn)
        })
      })
    })
  }

  register(email, psswrd, lat,long,region,cell,category, Orgname,desc){
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
              .ref("4IR_Hubs/" + user.uid)
              .set({
                name: Orgname,
                email: email,
                contact: cell,
                category: category,
                desc:desc,
                long : long,
                lat : lat,
                region : region,
                downloadurl: "assets/download.png",
              });
              var user = firebase.auth().currentUser;
              user.sendEmailVerification().then(function () {
                // Email sent.
              }).catch(function (error) {
                // An error happened.
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

  checkVerification() {
    return new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user);
        if (user.emailVerified == false) {
          this.logout();
          resolve(0)
        }
        else {
          resolve(1)
        }
      })
    })
  }

  logout() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        firebase.auth().signOut();
        resolve()
      });
    })
  }

  SignIn(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  getAllOrganizations() {
    return new Promise((resolve, reject) => {
      this.ngzone.run(() => {
        var user = firebase.auth().currentUser;
        firebase.database().ref("4IR_Hubs").on("value", (data: any) => {
          if (data.val() != null) {
            this.orgArray.length = 0;
            this.orgNames.length = 0;
            let details = data.val();
            let keys = Object.keys(details);
            for (var x = 0; x < keys.length; x++) {
              let orgObject = {
                orgName: details[keys[x]].name,
                email: details[keys[x]].email,
                region: details[keys[x]].region,
                cell: details[keys[x]].contact,
                long: details[keys[x]].long,
                lat: details[keys[x]].lat,
                img: details[keys[x]].downloadurl,
                category: details[keys[x]].category,
                id: keys[x]
              }
              this.storeOrgNames(details[keys[x]].name);
              this.orgArray.push(orgObject)
            }
            resolve(this.orgArray)
          }
        });
      })
    })
  }


  storeOrgNames(name) {
    this.orgNames.push(name);
    console.log(this.orgNames);

  }

  getOrgNames() {
    return this.orgNames
  }


  getCurrentLocation(lat, lng){
    
    return new Promise ((accpt, rej) =>{
     
       console.log("provider outside getCurPos");
       this.createPositionRadius(lat, lng).then((data:any) =>{
        accpt(data);
      })
     })
     
}
createPositionRadius(latitude, longitude){
  var leftposition, rightposition, downposition, uposititon;
  return new Promise ((accpt, rej) =>{
    
      var downlat = new String(latitude); 
      var latIndex = downlat.indexOf( "." ); 
      var down = parseInt(downlat.substr(latIndex + 1,2)) + 6;
      var down = parseInt(downlat.substr(latIndex + 1,2)) + 12;
      if (down >= 100){
        if (downlat.substr(0,1) == "-"){
          var firstDigits = parseInt(downlat.substr(0,3)) + 1;
        }
        else{
          var firstDigits = parseInt(downlat.substr(0,2)) - 1;
        }
        var remainder = down - 100;
        if (remainder >= 10){
          downposition = firstDigits + "." + remainder;
        }
        else{
          downposition = firstDigits +  ".0" + remainder;
        }
        
      }else{
        if (downlat.substr(0,1) == "-"){
          downposition =  downlat.substr(0,3) + "." + down ;
        }
        else{
          downposition = downlat.substr(0,2) + "." + down;
        }
      
      }
      
      //up  position
      var uplat = new String(latitude); 
      var latIndex = uplat .indexOf( "." ); 
      var up= parseInt(uplat .substr(latIndex + 1,2)) - 6;
      var up= parseInt(uplat .substr(latIndex + 1,2)) - 12;
      if (up <= 0){
        if (uplat.substr(0,1) == "-"){
          var firstDigits = parseInt(uplat.substr(0,3)) + 1;
        }
        else{
          var firstDigits = parseInt(uplat.substr(0,2)) - 1;
        }
        var remainder = down - 100;
        if (remainder >= 10){
          uposititon = firstDigits + "." + remainder;
        }
        else{
          uposititon = firstDigits +  ".0" + remainder;
        }
      }else{
        if (uplat.substr(0,1) == "-"){
          uposititon = uplat.substr(0,3) + "." + up ;
        }
        else{
          uposititon = uplat.substr(0,2) + "." + up ;
        }
        
      }
        //left position
       var leftlat = new String(longitude);
       var longIndex =  leftlat.indexOf(".");
       var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 6;
       var left =  parseInt(leftlat.substr(longIndex + 1,2)) - 12;
       if (left >= 100){
         if (leftlat.substr(0,1) == "-"){
            var firstDigits =  parseInt(leftlat.substr(0,3)) - 1;
         }else{
          var firstDigits =  parseInt(leftlat.substr(0,2)) + 1;
         }
         var remainder = left - 100;
         leftposition= firstDigits +  ".0" + remainder;
       }else{
         if (leftlat.substr(0,1) == "-"){
          var firstDigits= parseInt(leftlat.substr(0,3)) + 1;
         }
         else{
          var firstDigits= parseInt(leftlat.substr(0,2)) - 1;
         }
        
         if (left == 0){
          var remainder = 0;
         }
         else{
          var remainder = left - 12;
         }
         
         leftposition = firstDigits +  ".0" + remainder;
      
       }
          //right position
          var rightlat = new String(longitude);
          var longIndex =  rightlat.indexOf(".");
          var right =  parseInt(rightlat.substr(longIndex + 1,2)) + 6;
          var right =  parseInt(rightlat.substr(longIndex + 1,2)) + 12;
          if (right >= 100){
            if (rightlat.substr(0,1) == "-"){
               var firstDigits =  parseInt(rightlat.substr(0,3)) - 1;
            }else{
             var firstDigits =  parseInt(rightlat.substr(0,2)) + 1;
            }
            var remainder =  right - 100;
            rightposition = firstDigits +  ".0" + remainder;
          }else{
            rightposition = rightlat.substr(0,2) + "." + right;
            if (left == 0){
              var remainder = 0;
             }
             else{
              var remainder = left - 12;
             }
             
             rightposition  = firstDigits +  ".0" + remainder;
          }
      
      
          let radius ={
            left: leftposition,
            right : rightposition,
            up : uposititon,
            down : downposition
          }

          accpt(radius);
    
// down  position

 
  })

}
getOrgProfile(){
  let userID = firebase.auth().currentUser;
  return new Promise ((accpt, rej) =>{
  firebase.database().ref("4IR_Hubs/" + userID.uid).on('value', (data: any) => {
    let details = data.val();
    this.detailArray.push(details);
    console.log(this.detailArray)
  });
})
}

}
