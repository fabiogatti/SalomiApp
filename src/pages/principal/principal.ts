import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Network } from '@ionic-native/network';
//import { LocalNotifications } from '@ionic-native/local-notifications';
//import { ToastController } from 'ionic-angular';
/**
 * Generated class for the PrincipalPage tabs.
 *
 * See https://angular.io/docs/ts/latest/guide/dependency-injection.html for
 * more info on providers and Angular DI.
 */
@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html'
})

@IonicPage()
export class PrincipalPage {

  pedidoRoot = 'PedidoPage'
  listadoRoot = 'ListadoPage'
  listenabled : boolean;
  date: Date;


  constructor(public navCtrl: NavController/*,private nativePageTransitions: NativePageTransitions*/,private network: Network,/*private localNotifications: LocalNotifications*/) {
    if(this.network.type=="none"){
      this.listenabled = false;
    }
    else{
      this.listenabled = true;
    }
    
    this.network.onDisconnect().subscribe(()=>{
      //setTimeout(()=>{this.listenabled = false;},500);
      this.listenabled = false;
      //this.toast(1);
    });

    this.network.onConnect().subscribe(()=>{
      //setTimeout(()=>{this.listenabled = true;},500);
      this.listenabled = true;
      //this.toast(2);
    });

    /*this.date = new Date();
    console.log(this.date);
    console.log(this.date.getHours());
    this.date.setHours(this.date.getHours()-5);
    this.date.setMinutes(this.date.getMinutes()+1);
    //date.setMilliseconds(0);
    console.log(this.date);
    console.log(this.date.getHours());
    this.localNotifications.schedule({
       text: 'No te olvides de hacer tu pedido!',
       at: this.date,
       led: 'FF0000',
       sound: null
    });*/

    /*this.localNotifications.schedule({
       text: 'Delayed ILocalNotification',
       at: new Date(new Date().getTime() + 3600),
       led: 'FF0000',
       sound: null
    });*/

  }

  /*toast(value){
    let msg;
    if(value == 1){
      msg='Se ha desconectado de internet';
    }
    else{
      msg='Se ha conectado a internet';
    }
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toasted",
    });
    toast.present();
  }*/

  transition(){
  	/*let options: NativeTransitionOptions = {
        direction: 'up',
        duration: 250,
        slowdownfactor: 2,
        slidePixels: 20,
        iosdelay: 150,
        androiddelay: 150,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
       };
    this.nativePageTransitions.slide(options);
    console.log("click");*/
  }
}
