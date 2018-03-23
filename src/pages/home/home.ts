import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal'
import { AlertController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Network } from '@ionic-native/network';
import { ToastController,Toast } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HeaderColor } from '@ionic-native/header-color';

import { Help } from '../help/help';
import { Register } from '../register/register';
//import { Register } from '../register/register';
//import { Register } from './register';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  user: string = "";
  pass: string = "";
  data: any;
  disabledLogin: boolean;
  togglePass = false;

  toastInstance: Toast;

  subscribe1: any;
  subscribe2: any;

  date: Date;
  //toastInstance2: Toast;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public modalCtrl: ModalController,public ApiServiceProvider: ApiServiceProvider,private network: Network,public toastCtrl: ToastController,public loadingCtrl: LoadingController,public plt: Platform,private statusBar: StatusBar,private localNotifications: LocalNotifications,private headerColor: HeaderColor) {
  	//this.user="";
  	//this.pass="";
    //this.statusBar.overlaysWebView(true);

    this.headerColor.tint('#ff9800');

    this.localNotifications.on("click",(notification,state)=>{
      let alert = alertCtrl.create({
        title: "Bienvenido",
        message: "Sea bienvenido para hacer su pedido!",
     	buttons: ['OK']
      });
      alert.present();
    });

    try{
      this.localNotifications.clearAll();
    }
    catch(e){}

    this.plt.resume.subscribe(any=>{
      try{
        this.localNotifications.clearAll();
      }
      catch(e){}
    });

    // set status bar to color
    //this.statusBar.backgroundColorByHexString('#ff9800');
    this.statusBar.backgroundColorByHexString('#e68900');
    

  	let localU = localStorage.getItem("user");
  	let localP = localStorage.getItem("pass");
    let localId = localStorage.getItem("id");
    let localTipo = localStorage.getItem("tipo");

    //Deshabilita el boton de atrás para android en toda la app (evitando que visite paginas anteriores)
    this.plt.registerBackButtonAction(function(){
      event.preventDefault();
    }, 100);

    if(this.network.type=="none"){
      localStorage.setItem("connection","no");
    }
    else{
      localStorage.setItem("connection","yes");
    }

    /*this.network.onDisconnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="yes"){
        this.toast(1);
        localStorage.setItem("connection","no");
      }
    });

    this.network.onConnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="no"){
        this.toast(2);
        localStorage.setItem("connection","yes");
      }
    });*/

  	if(localU != ""   && localU != undefined &&
       localP != ""   && localP != undefined &&
       localId != ""  && localId != undefined && 
       localTipo!=""  && localTipo!=undefined){
      this.user = localU;
      this.pass = localP;
      this.login();
  		//localStorage.setItem("session","true");
  		//console.log(this.navCtrl);
  		//this.navCtrl.push(PrincipalPage);
  		//console.log(this.navCtrl);
  	}
    if(this.verifyUser() && this.verifyPass()){
      this.disabledLogin = false;
    }
    else{
      this.disabledLogin = true;
    }

  }

  ionViewWillEnter(){

    this.subscribe1 = this.network.onDisconnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="yes"){
        this.toast(1);
        localStorage.setItem("connection","no");
        //console.log("Entro al home");
      }
    });

    this.subscribe2 = this.network.onConnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="no"){
        this.toast(2);
        localStorage.setItem("connection","yes");
        //console.log("Entro al home");
      }
    });

  }

  ionViewWillLeave(){
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
  }

  toast(value){
    if(this.toastInstance){
      this.toastInstance.dismiss();
    }

    let msg;
    if(value == 1){
      msg='Se ha desconectado de internet';
    }
    else{
      msg='Se ha conectado a internet';
    }

    this.toastInstance = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toastedHome",
    });

    this.toastInstance.present();
  }

  /*toast2(){
    try{
      this.toastInstance2.dismiss();
    }
    catch(e){}
      this.toastInstance2 = this.toastCtrl.create({
        message: 'Se ha conectado a internet',
        duration: 2000,
        //showCloseButton: true,
        //closeButtonText: 'Ok',
        position: "top",
        cssClass: "toasted",
      });

    this.toastInstance2.present();
  }*/

  searchId(array,Id){
    if(array == null){
      return -1;
    }
    if(array.length == 0){
      return -1;
    }
    for(var i = 0; i < array.length; i++){
      //if(array[i].PedidoId==Id){
      if(array[i].PedidoId==Id){
        return i;
      }
    }
    return -1;
  }

 getPrice(str){
   let tipo = 0;
   var array = JSON.parse(str);
   return array[tipo];
 }

  httpGet(){
	//let date = new Date(localStorage.getItem("notificationtime"));
	this.date = new Date();
    //this.date.setHours(this.date.getHours());
    this.date.setSeconds(this.date.getSeconds()+10);
    //date.setMilliseconds(0);
    this.localNotifications.schedule({
      id: 1,
      //at: this.date,
      text: 'No te olvides de hacer tu pedido!',
      //sound: 'file://beep.caf',
      //sound:'res://platform_default',
      //sound: isAndroid? 'file://sound.mp3': 'file://beep.caf',
      sound: 'res://platform_default',
      led: 'FFFF00',
      icon: 'res://logo9',
      smallIcon: 'res://icon',
      color: 'FECE18',
      at: this.date,
      every: 'day'
    });

    

    //Get la lista de productos para listado 
    /*
      -----------------------------------------FALTA SOLO ESTEEEEEE Y LOS VALORES DE LA APP!--------------------------------------------
      this.listaPedidos.push({
      value:    0,
      fecha:    "2017-05-27",
      total:    14250,
      producto1:  {nombre: "Empanada coctel", cantidad: 1, unidades: 50, precio:5000},
      producto2:  {nombre: "Empanada media luna", cantidad: 1, unidades: 25, precio:4500},
      producto3:  {nombre: "Empanada pañuelo", cantidad: 1, unidades: 35, precio:4750}
      });
    */

    /*this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/pedidos/userid/1").then(data => {
      console.log(data);
      this.data = data;
      console.log(this.data);

      let array:any[] = [];
      let index;
      let array2;
      let n = 0;
      for (var i = 0; i < this.data.length; i++) {
        //index = this.searchId(array,this.data[i].Id);
        index = this.searchId(array,this.data[i].PedidoId);
        array2 = [];
        if(index!=-1){
          array2["nombre"] = this.data[i].Nombre;
          array2["cantidad"] = this.data[i].Cantidad;
          array2["unidades"] = this.data[i].Cantidad * this.data[i].Unidades;
          array2["precio"] = this.data[i].Cantidad * this.getPrice(this.data[i]["Precio"]);
          array2["PPID"] = this.data[i].PPID;

          //array[index].push(array2);
          //console.log(array2);
          array[index]["Producto"+array[index].Contador]=array2;
          array[index].Contador = array[index].Contador+1;
        }
        else{
          //array.push({ Id:this.data[i].Id, Total:this.data[i].Total, Fecha:this.data[i].TiempoDestino, Contador:2,Producto1:[] });
          array.push({ value:n ,PedidoId:this.data[i].PedidoId, Total:this.data[i].Total, Fecha:this.data[i].TiempoDestino, Contador:2,Producto1:[] });
          array2["nombre"] = this.data[i].Nombre;
          array2["cantidad"] = this.data[i].Cantidad;
          array2["unidades"] = this.data[i].Cantidad * this.data[i].Unidades;
          array2["precio"] = this.data[i].Cantidad * this.getPrice(this.data[i]["Precio"]);
          array2["PPID"] = this.data[i].PPID;
          array[array.length-1].Producto1 = array2;
          n++;
          //array[array.length-1].push({ "Producto1":array2 });
        }
      }
      console.log(array);
    });*/

    //Get authentication para el usuario (Retorna el Id) !ALMACENARLO TODO INTERNAMENTE!
    
    /*let usuario = "lambler0";
    let pass = "58p8L1UL1EX";
    let id;
    let base64enc = btoa(usuario)+":"+btoa(pass);
    this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/auth",1,base64enc).then(data => {
      if(data["Error"]==undefined){
        id = data[0]["Id"];
        //localStorage.setItem("user",usuario);
        //localStorage.setItem("pass",pass);
        //localStorage.setItem("id",id);
      }
      else{
        this.invalidAuthAlert();
      }
    });*/
    
    

    //Post de nuevo usuario para el register 
    /*let usuario = "lambler03";
    let email = "lambler0@umn.edu3";
    let userAvailable: boolean;
    let emailAvailable: boolean;

    this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/usuario/"+usuario).then(data => {
      if(data["Error"] == undefined){
        //userAvailable = true;
        this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/email/"+email).then(data => {
          if(data["Error"] == undefined){
            let body = [];
            body.push({ nombre:"Alejandro2", usuario:usuario, pass:"superalejo2", email:email, numero:"5579669" , empresa:"Empresa de alejo 2", direccion:"Carrera 53 #24-18" });

            let JsonBody = JSON.stringify(body);
            JsonBody = JsonBody.substr(1,JsonBody.length-2);

            console.log(JsonBody);
            this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/clientes/add",JsonBody);
            console.log("Nuevo usuario creado!");
          }
          else{
            console.log("Correo ya registrado");
          }
        });
      }
      else{
        //userAvailable = false;
        //this.invalidUserAlert();
        console.log("Nombre de usuario no disponible");
        this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/email/"+email).then(data => {
          if(data["Error"] != undefined){
            console.log("Correo ya registrado");
          }
        });
      }
    });*/

    //Post de pedido (TABLA PEDIDO Y PRODUCTOPEDIDO)
    /*let clienteId = 1;
    let tiempoDestino = new Date();
    let total = 75000;
    let direccionAlterna = null;

    let productos = [];
    productos.push({ id:1, cantidad:10 });
    productos.push({ id:2, cantidad:15 });
    productos.push({ id:3, cantidad:5 });
    productos.push({ id:4, cantidad:20 });

    let body = [];
    body.push({ ClienteId:clienteId, TiempoDestino:tiempoDestino.toISOString(), Total:total, DireccionAlterna:direccionAlterna });

    let JsonBody = JSON.stringify(body);
    JsonBody = JsonBody.substr(1,JsonBody.length-2);

    this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/pedidos/add",JsonBody).then(data => {
      this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/pedidos/ultimoPedidoId/"+clienteId).then(data =>{

        let pedidoId = Number(data[0]["Id"]);
        let array = [];
        for (var i = 0 ; i < productos.length; i++) {
          array = [];
          array.push({ ProductoId:productos[i]["id"], PedidoId:pedidoId, Cantidad:productos[i]["cantidad"] });

          let JsonBodyArray = JSON.stringify(array);
          JsonBodyArray = JsonBodyArray.substr(1,JsonBodyArray.length-2);

          this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/productoPedido/add",JsonBodyArray);
        }
        //let productoId = 

      });
    });*/


    //this.productos.push({ value: 0, text: 'Empanada coctel', unidades: 50, precio:5000});
    /*//let tipo = localStorage.getItem("tipo");
    let tipo = 1;
    let productos = [];
    let parsedPrice;
    this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/productos/"+tipo).then(data =>{
      var size = 0, key;
      for (key in data) {
          if (data.hasOwnProperty(key)) size++;
      }
      for (var i = 0; i < size; i++) {
        parsedPrice = JSON.parse(data[i]["Precio"]);
        productos.push({ value:    data[i]["Id"],
                         text:     data[i]["Nombre"],
                         unidades: data[i]["Unidades"],
                         precio:   parsedPrice[tipo-1]});
      }
      console.log(productos);
    });*/

    // FALTA TOMAR TODOS LOS DATOS DE LA APP!!!!

    /*let helpmodal = this.modalCtrl.create(Help);
    helpmodal.present();*/
  }

  helpModal(){
    let helpmodal = this.modalCtrl.create(Help);
    helpmodal.present();
  }

  registerModal(){
	  let registerModal = this.modalCtrl.create(Register/*, { userId: 8675309 }*/);
	  registerModal.present();
  } 

  inputAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Campos inválidos',
      message: 'Favor ingresar un nombre de usuario y una contraseña validos (Sin carácteres especiales)',
      buttons: ['OK']
    });
    alert.present();
  }

  invalidAuthAlert(){
    let alert = this.alertCtrl.create({
      title: 'Campos inválidos',
      message: 'El nombre de usuario o contraseña no son válidos',
      buttons: ['OK']
    });
    alert.present();
  }

  notAllowedUserAlert(){
    let alert = this.alertCtrl.create({
      title: 'Usuario no permitido',
      message: 'La cuenta registrada no permite el ingreso a la aplicación',
      buttons: ['OK']
    });
    alert.present();
  }

  noInternetAlert(){
    let alert = this.alertCtrl.create({
      title: 'No hay conexión',
      message: 'Favor conectarse a internet',
      buttons: ['OK']
    });
    alert.present();
  }

  checkDisabled(){
    if(this.verifyUser() && this.verifyPass()){
      this.disabledLogin=false;
    }
    else{
      this.disabledLogin=true;
    }
  }

  verifyUser(){
  	var format = /^([A-Za-z]+)([0-9_-]{0,})$/;
  	if(format.test(this.user)){
  		return true;
  	}
  	else{
  		return false;
  	}
  }

  verifyPass(){
  	var format = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;
  	if(format.test(this.pass)){
  		return true;
  	}
  	else{
  		return false;
  	}
  }


  login(){
  	if(!this.verifyUser() || !this.verifyPass()){
  		this.inputAlert();
		  return;
  	}
    else if(this.network.type == "none"){
      this.noInternetAlert();
      return;
    }
  	else{
      let loading = this.loadingCtrl.create({
        //spinner: 'hide',
        content: 'Cargando...'
      });

      loading.present();

      let usuario = this.user.toLowerCase();
      let pass = this.pass;
      let id;
      let tipo;
      let dir;
      let base64enc = btoa(usuario)+":"+btoa(encodeURIComponent(pass));
      console.log(base64enc);
      this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/auth",1,base64enc).then(data => {
        if(data["Error"]==undefined){
          id = data[0]["Id"];
          tipo = data[0]["Tipo"];
          dir = data[0]["Dirección"];
          if(tipo==0){
          	loading.dismiss();
          	this.notAllowedUserAlert();
          	return;
          }
          localStorage.setItem("user",usuario);
          localStorage.setItem("pass",pass);
          localStorage.setItem("id",id);
          localStorage.setItem("tipo",tipo);
          localStorage.setItem("dir",dir);
          this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/app").then(data=>{
            //console.log(data);
            //console.log(data[0]["HorasMínimas"]);
            //console.log(data[0]["PrecioMínimo"]);
            localStorage.setItem("HorasMínimas",data[0]["HorasMínimas"]);
            localStorage.setItem("PrecioMínimo",data[0]["PrecioMínimo"]);

            if(!localStorage.getItem("notifications")){
              let str = localStorage.getItem("notificationdays");
              let dias;
              if(!str){
                dias = [true,true,true,true,true,true,true];
              }
              else{
                dias = JSON.parse('[' + str + ']');
              }

              let time = new Date();
              time.setHours(8);
              time.setMinutes(0);
              time.setSeconds(0);
              time.setMilliseconds(0);

              this.localNotifications.cancelAll().then(any=>{
                this.scheduleNotifications(time,dias);
              });

            	
    			    /*this.localNotifications.schedule({
    			        id: 1,
    			        //at: this.date,
    			        text: 'No te olvides de hacer tu pedido!',
    			        //sound: 'file://beep.caf',
    			        led: 'FFFF00',
    			        icon: 'res://logo9',
    			        smallIcon: 'res://logo7',
    			        color: 'FECE18',
    			        at: time,
    			        every: 'day'
    			      });*/
              //time.setHours(time.getHours()-5);
              localStorage.setItem("notificationdays",dias.toString());
    			    localStorage.setItem("notificationtime",time.toISOString());
        			localStorage.setItem("notifications","true");
            }
            /*else if(localStorage.getItem("notifications")=="true"){
              let str = localStorage.getItem("notificationdays");
              let dias;
              if(!str){
                dias = [true,true,true,true,true,true,true];
              }
              else{
                dias = JSON.parse('[' + str + ']');
              }

              let time;
              time=localStorage.getItem("notificationtime");
              if(!time){
                time = new Date();
                time.setHours(8);
                time.setMinutes(0);
                time.setSeconds(0);
                time.setMilliseconds(0);
              }

              this.localNotifications.cancelAll().then(any=>{
                this.scheduleNotifications(time,dias);
              });
            }*/

            /*if(localStorage.getItem("notifications")=="true"){
              if(!this.localNotifications.isScheduled(1)){
				let date = new Date(localStorage.getItem("notificationtime"));
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
              }
		    }*/

            loading.dismiss();
            this.navCtrl.push(PrincipalPage);
          });
        }
        else{
          loading.dismiss();
          this.invalidAuthAlert();
        }
      });
  		/*localStorage.setItem("user",this.user);
  	  localStorage.setItem("pass",this.pass);
  	  //localStorage.setItem("session","true");
  	  console.log(this.navCtrl);
    	this.navCtrl.push(PrincipalPage);
    	console.log(this.navCtrl);
  	  return;*/
  	}
  }

  scheduleNotifications(time,dias){
    let x;
    this.localNotifications.cancelAll();
    for (var i = 0; i < 7; i++) {
      /*console.log(date);
      console.log(i);*/
      x = time.getDay();
      if(dias[x]){
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
          at: time,
          every: 'week'
        });
      }
      time.setDate(time.getDate() + 1);
      //time.setHours(time.getHours()+24);
    }
  }

}