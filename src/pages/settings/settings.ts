import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ViewController,NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Platform } from 'ionic-angular';

@Component({
  templateUrl: 'settings.html'
})

export class Settings {

  notifications: boolean = true;
  enabled: boolean = true;
  time: string;

  schedule: string;

  time2 = new Date();

  dias: any[];

  constructor(public params: NavParams,public viewCtrl: ViewController,public alertCtrl: AlertController,private localNotifications: LocalNotifications,public plt: Platform){

    /*if(!this.localNotifications.hasPermission()){
      this.notifications = false;
    }*/

    if(localStorage.getItem("notifications")=="true"){
      //PONER PARAMETROS GUARDADOS DE NOTIFICACIONES
      let x = new Date(localStorage.getItem("notificationtime"));
      let y = new Date();
      y.setHours(x.getHours());
      y.setMinutes(x.getMinutes());
      y.setSeconds(0);
      this.time = y.toISOString();
    }
    else if(localStorage.getItem("notifications")=="false"){
      let timeD = new Date();
      timeD.setHours(3);
      timeD.setMilliseconds(0);
      timeD.setSeconds(0);
      timeD.setMinutes(0);
      this.time = timeD.toISOString();
      this.notifications = false;
    }
    else{
      let timeD = new Date();
      timeD.setHours(3);
      timeD.setMilliseconds(0);
      timeD.setSeconds(0);
      timeD.setMinutes(0);
      this.time = timeD.toISOString();
    }

    if(localStorage.getItem("notificationdays")){
      this.dias = JSON.parse('[' + localStorage.getItem("notificationdays") + ']');
    }
    else{
      this.dias = [true,true,true,true,true,true,true];
    }

    //this.dias = [true,true,true,true,true,true,true];
    console.log(this.dias);
    console.log(this.dias.toString());
    console.log(JSON.parse('[' + this.dias.toString() + ']'));

  }

  dismiss(){
    this.viewCtrl.dismiss(false);
  }

  toggle(id){
    this.dias[id]?this.dias[id]=false:this.dias[id]=true;
    /*if(this.dias[id]){
      this.dias[id]=false;
    }
    else{
      this.dias[id]=true;
    }*/
  }

  ningunDia(){
    for (var i = this.dias.length - 1; i >= 0; i--) {
      if(this.dias[i]){
        return false;
      }
    }
    return true;
  }

  save(){
    if(this.ningunDia() && this.notifications){
      let alert = this.alertCtrl.create({
        title: "Ningun día seleccionado",
        message: "Favor seleccionar al menos un dia para incluir el recordatorio",
       buttons: ['OK']
      });
      alert.present();
      return;
    }
    if(this.notifications){
      this.scheduleNotifications();
    }
    else{
      for (var i = 0; i <7; i++) {
        this.localNotifications.cancel(i);
      }
      this.localNotifications.cancelAll();
    }
    /*if(!this.localNotifications.hasPermission()){
      let x = this.localNotifications.registerPermission();
      if(!x){
        this.notifications=false;
        return;
      }
    }*/
    

    
    /*this.localNotifications.cancelAll().then(any=>{
      this.scheduleNotifications();
    });*/


    /*this.localNotifications.cancel(1).then(any=>{
      if(this.notifications){
        let date = new Date(this.time);
        this.localNotifications.schedule({
          id: 1,
          //at: this.date,
          text: 'No te olvides de hacer tu pedido!',
          //sound: 'file://beep.caf',
          led: 'FFFF00',
          icon: 'res://logo9',
          smallIcon: 'res://logo7',
          color: 'FECE18',
          at: date,
          every: 'day'
        });
      }
    });*/



    //this.localNotifications.clear(1);

    /*if(this.notifications){
      let date = new Date(this.time);
      this.localNotifications.schedule({
        id: 1,
        //at: this.date,
        text: 'No te olvides de hacer tu pedido!',
        //sound: 'file://beep.caf',
        led: 'FFFF00',
        icon: 'res://logo9',
        smallIcon: 'res://icon',
        color: 'FECE18',
        at: date,
        every: 'day'
      });
    }*/

    /*else{
      this.localNotifications.cancelAll();
    }*/
    localStorage.setItem("notificationdays",this.dias.toString());
    localStorage.setItem("notificationtime",this.time);
    localStorage.setItem("notifications",String(this.notifications));
    
    console.log(this.time);

    this.viewCtrl.dismiss(true);
  }

  scheduleNotifications(){
    let date = new Date(this.time);
    date.setHours(date.getHours()+5);
    let x;
    this.localNotifications.cancelAll();
    for (var i = 0; i < 7; i++) {
      x = date.getDay();

      /*console.log(x);
      console.log(date);
      console.log(date.getDate());

      let alert = this.alertCtrl.create({
        title: "Dia "+x,
        message: "Date: "+date,
       buttons: ['OK']
      });
      alert.present();*/

      this.localNotifications.cancel(this.dias[x]);

      if(this.dias[x]){
        this.localNotifications.schedule({
          id: i,
          //at: this.date,
          text: 'No te olvides de hacer tu pedido!',
          //sound: 'file://beep.caf',
          //sound:'res://platform_default',
          //sound: this.plt.is('android')? 'file://sound.mp3': 'file://beep.caf',
          sound: 'res://platform_default',
          led: 'FFFF00',
          icon: 'res://logo9',
          smallIcon: 'res://logo7',
          color: 'FECE18',
          at: date,
          every: 'week'
        });
      }
      
      date.setDate(date.getDate() + 1);
      //date.setHours(date.getHours()+24);
    }
  }
}

