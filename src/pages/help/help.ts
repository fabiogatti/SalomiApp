import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number';
import { AlertController } from 'ionic-angular';
import { ViewController,NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'help.html'
})

export class Help {


  constructor(public params: NavParams,public viewCtrl: ViewController,private callNumber: CallNumber,public alertCtrl: AlertController){

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  call(){
    this.callNumber.callNumber("0325579668", true)
      .then(() => {this.viewCtrl.dismiss();})
      .catch(() => {this.errorCallAlert()});
  }

  errorCallAlert(){
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: 'No se pudo realizar la llamada',
      buttons: ['OK']
    });
    alert.present();
  }

  openBrowser(){
    window.open('http://www.congeladossalomia.com', '_system');
  }
}