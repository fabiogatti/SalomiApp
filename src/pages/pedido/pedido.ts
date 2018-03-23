import { Component } from '@angular/core';
import { ModalController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { App } from 'ionic-angular';
import { PopoverPage } from '../popover/popover';
import { PopoverController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';
import { Help } from '../help/help';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { Toast } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { Settings } from '../settings/settings';
/**
 * Generated class for the PedidoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-pedido',
  templateUrl: 'pedido.html',
})
export class PedidoPage {

  selectedvalue: number;
  quantity: number;
  productos: any[] = [];
  lista: any[] = [];
  total_display: any[] = [];
  totales:  any[] = [];
  display: number;
  disabled_order: Boolean;
  time: string;
  info_price: Boolean;
  info_date: Boolean;
  dir: string;
  //Datos constantes de la base
  horas_minimas: number;
  valor_minimo: number;

  currentTime: Date;

  toastInstance : Toast;

  subscribe1: any;
  subscribe2: any;

  date: Date;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public toastCtrl: ToastController,private app:App,public popoverCtrl: PopoverController,public ApiServiceProvider: ApiServiceProvider,/*private nativePageTransitions: NativePageTransitions,*/private network: Network,public loadingCtrl: LoadingController,public modalCtrl: ModalController,private localNotifications: LocalNotifications) {
    this.productos.push({ value: 0, text: 'Cargando productos', unidades: 0, precio:0 });

  	this.initializeVariables();

  	this.getProductos();

    this.createTime();

    this.date = new Date();
    console.log(this.date);
    console.log(this.date.getHours());
    this.date.setHours(this.date.getHours());
    this.date.setMinutes(this.date.getMinutes()+2);
    //date.setMilliseconds(0);
    console.log(this.date);
    console.log(this.date.getHours());
    /*this.localNotifications.schedule({
       text: 'No te olvides de hacer tu pedido!',
       at: this.date,
       led: 'FF0000',
       sound: null
    });*/

    /*this.localNotifications.registerPermission();

    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      sound: 'file://beep.caf',
    });*/

  	//console.log(localStorage.getItem("user"));
	  //console.log(localStorage.getItem("pass"));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PedidoPage');
  }

  ionViewDidEnter(){
    this.createTime();
  }

  ionViewWillEnter(){
    this.subscribe1 = this.network.onDisconnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="yes"){
        this.toast('Se ha desconectado de internet');
        localStorage.setItem("connection","no");
      }
    });

    this.subscribe2 = this.network.onConnect().subscribe(()=>{
      if(localStorage.getItem("connection")=="no"){
        this.toast('Se ha conectado a internet');
        localStorage.setItem("connection","yes");
      }
    });

  }

  ionViewWillLeave(){
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
  }

  settingsModal(){
    let settingsModal = this.modalCtrl.create(Settings);
    settingsModal.present();
    settingsModal.onDidDismiss(any=>{
      if(any==true){
        this.toast("Se han guardado los ajustes");
      }
    });
  }

  limitNumber(event){
    if(this.quantity>=9999){
      //return false;
      //this.quantity = this.quantity;
      setTimeout(any=>{
        this.quantity = Number(this.quantity.toString().substr(0,this.quantity.toString().length-1));
      },50);
    }
  }

  toast(msg){
    if(this.toastInstance){
      this.toastInstance.dismiss();
    }

    this.toastInstance = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toasted",
    });

    this.toastInstance.present();
  }

  swipeEvent(e){
    if(e.direction==2 && this.network.type != "none"){
      /*let options: NativeTransitionOptions = {
        direction: 'up',
        duration: 250,
        slowdownfactor: 2,
        slidePixels: 20,
        iosdelay: 50,
        androiddelay: 50,
        fixedPixelsTop: 0,
        fixedPixelsBottom: 60
       };
      this.nativePageTransitions.slide(options);*/
      this.navCtrl.parent.select(1);
    }
    /*else{
      this.noInternetAlert();
    }*/
  }

  initializeVariables(){
    this.selectedvalue = 0;
    this.quantity = 1;
    this.display = 0;
    this.totales = [];
    this.totales.push({
      cantidades: 0,
      unidades: 0,
      precios: 0
    });
    this.disabled_order = true;
    let timeD = new Date();
    timeD.setHours(timeD.getHours()-5);
    this.time = timeD.toISOString();
    this.info_price = false;
    this.info_date = false;

    this.lista = [];
    this.total_display = [];

    this.dir = "";
  }

  createTime(){
    this.currentTime = new Date();
    this.currentTime.setSeconds(0);
    this.currentTime.setMilliseconds(0);
    this.currentTime.setHours(this.currentTime.getHours()+this.horas_minimas-5);

    let timeD = new Date();
    timeD.setHours(timeD.getHours()-5+this.horas_minimas);
    this.time = timeD.toISOString();
  }

  logOut(){
  	localStorage.setItem("user","");
  	localStorage.setItem("pass","");
    localStorage.setItem("id","");
    localStorage.setItem("tipo","");

    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();

  	this.app.getRootNav().push(HomePage);
  }

  // Funcion que crea el array de total (Precio, cantitad, nombre y total) y permite verlo en pantalla
  createTotal(){
  	this.display = 1;
  	this.total_display.push({
  		value:			0,
  		texto:			"Total",
  		cantidades:  	this.totales[0].cantidades,
  		unidades:		this.totales[0].unidades,
  		precios:		this.totales[0].precios
  	});
  }

  // Funcion que checkea si se cumplen los requisitos para realizar un pedido
  checkDisabled(){
  	// Colocar la hora futura (+2 horas con 0 segundos)
  	/*let currentTime = new Date();
  	currentTime.setSeconds(0);
    currentTime.setMilliseconds(0);
  	currentTime.setHours(currentTime.getHours()+this.horas_minimas);*/

  	let date = new Date(this.time);
    date.setSeconds(0);
    date.setMilliseconds(0);
    date.setHours(date.getHours());

    //console.log(date.toISOString());
    //console.log(currentTime.toISOString());
  	if(date>=this.currentTime){
  		if(this.lista.length>0 && this.totales[0].precios>=this.valor_minimo && this.verifyDireccion()){
  			this.disabled_order=false;
  		}
  		else{
  			this.disabled_order=true;
  		}
  		this.info_date = true;
  	}
  	else{
  		this.disabled_order = true;
  		this.info_date = false;
  	}
  	/*console.log(date.getHours());
  	console.log(date);
  	console.log(date.getHours()+1);
  	date.setHours(date.getHours()+1);
  	console.log(this.info_date);*/
  }

  // Funcion que verifica si se cumple el precio minimo y si se muestra el boton de informacion en el total
  checkPrice(){
  	if(this.totales[0].precios>=this.valor_minimo){
  		this.info_price = true;
  	}
  	else{
  		this.info_price = false;
  	}
  }

  verifyDireccion(){
  		var format = /^[A-Za-z0-9-_#,.ñÑáéíóúÁÉÍÓÚ ]{1,}$/;
  		if(format.test(this.dir) || this.dir==""){
  			return true;
  		}
  		else{
  			return false;
  		}
  	}

  // Funcion que crea el alert para la información de precio
  minPriceAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Precio mínimo',
      message: 'Favor agregar productos que den una suma mayor a '+this.visualizarPrecio(this.valor_minimo),
      buttons: ['OK']
    });
    alert.present();
  }

  createPopoverPrice(myEvent){
		let popover = this.popoverCtrl.create(PopoverPage,{text:"La suma total debe ser mayor a "+this.visualizarPrecio(this.valor_minimo)},{cssClass: 'popover'});
   		console.log(myEvent);
      setTimeout(()=>{
        popover.present({
          ev: myEvent
        });
      },250);
      /*popover.present({
      		ev: myEvent
    	});*/
	}

  // Funcion que crea el alert para la información de precio
  minDateAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Hora incorrecta',
      message: 'Favor ingresar una hora válida aproximada para la entrega del pedido (Al menos '+this.horas_minimas+' horas adicionales a la hora actual)',
      buttons: ['OK']
    });
    alert.present();
  }

  createPopoverDate(myEvent){
    this.date = new Date();
    //this.date.setHours(this.date.getHours());
    this.date.setSeconds(this.date.getSeconds()+10);
    //date.setMilliseconds(0);
    this.localNotifications.schedule({
      //id: 1,
      //at: this.date,
      text: 'No te olvides de hacer tu pedido!',
      //sound: 'file://beep.caf',
      //led: 'FFFF00',
      //icon: 'res://icon',
      //smallIcon: 'res://small2'
      //at: this.date
    });
    //this.localNotifications.on("click",this.app.getRootNav().push(HomePage));
		let popover = this.popoverCtrl.create(PopoverPage,{text:"Hora mínima de entrega: Hora actual +"+this.horas_minimas+" horas"},{cssClass: 'popover'});
   		console.log(myEvent);
       popover.present({
      		ev: myEvent
    	});
	}

  // Funcion que crea el alert para la minima cantidad de productos
  minProductAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Error',
      message: 'Favor introducir una cantidad válida',
      buttons: ['OK']
    });
    alert.present();
  }

  uniqueProductAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Error',
      message: 'No se puede añadir un mismo producto varias veces',
      //message: 'Favor añadir cada producto una sola vez',
      buttons: ['OK']
    });
    alert.present()
  }

  noInternetAlert(){
    let alert = this.alertCtrl.create({
      title: 'No hay conexión',
      message: 'Favor conectarse a internet',
      buttons: ['OK']
    });
    alert.present();
  }

  helpModal(){
    let helpmodal = this.modalCtrl.create(Help);
    helpmodal.present();
  }

  isDuplicate(value){
  	for (var i = this.lista.length - 1; i >= 0; i--) {
  		if(this.lista[i].producto==value){
  			return true
  		}
  	}
  	return false;
  }

  // Función que añade un item a la lista de total (Entra un nuevo producto a la lista)
  addItem(){
  	if(Number(this.quantity)<=0 || Number(this.quantity) % 1 != 0){
  		this.minProductAlert();
  		return;
  	}
  	if(this.isDuplicate(this.productos[this.selectedvalue].text)){
  		this.uniqueProductAlert();
  		return;
  	}
  	if(this.display==0){
  		this.createTotal();
  	}

  	let cant = Number(this.quantity);

  	this.totales[0].cantidades += cant;
  	this.totales[0].unidades += this.productos[this.selectedvalue].unidades*cant;
  	this.totales[0].precios += this.productos[this.selectedvalue].precio*cant;

  	this.total_display[0].cantidades = this.totales[0].cantidades;
  	this.total_display[0].unidades = this.totales[0].unidades;
  	this.total_display[0].precios = this.totales[0].precios;

  	/*this.total_display[0].cantidades += cant;
  	this.total_display[0].unidades +=  this.productos[this.selectedvalue].unidades*cant;
  	this.total_display[0].precios += this.productos[this.selectedvalue].precio*cant;*/

  	this.lista.push({ 
  		value:    this.productos[this.selectedvalue].value,
      id:       this.productos[this.selectedvalue].id,
  		producto: this.productos[this.selectedvalue].text, 
  		cantidad:	cant,
  		unidades:	this.productos[this.selectedvalue].unidades*cant,
  		precio:		this.productos[this.selectedvalue].precio*cant
  	});
  	this.checkDisabled();
  	this.checkPrice();
    setTimeout(()=>{
      //this.content.scrollToBottom();
      this.addedElementToast();
    },300);
    console.log(this.lista);
  }

  // Función que elimina un item a la lista de total (Quita un producto existente de la lista)
  destroyItem(value){

  	this.totales[0].cantidades -= this.lista[value].cantidad;
  	this.totales[0].unidades -=  this.lista[value].unidades;
  	this.totales[0].precios -= this.lista[value].precio;

  	this.total_display[0].cantidades = this.totales[0].cantidades;
  	this.total_display[0].unidades = this.totales[0].unidades;
  	this.total_display[0].precios = this.totales[0].precios;

  	/*this.total_display[0].cantidades -= this.lista[value].cantidad;
  	this.total_display[0].unidades -=  this.lista[value].unidades;
  	this.total_display[0].precios -= this.lista[value].precio;*/

  	this.lista.splice(value, 1);
  	if(this.lista.length==0){
  		this.display=0;
  		this.total_display.splice(0,1);
  	}
  	this.checkDisabled();
  	this.checkPrice();
    this.removedElementToast();
    console.log(this.lista);
  }

  pedidoExitoso(){
    if(this.toastInstance){
      this.toastInstance.dismiss();
    }
    this.toastInstance = this.toastCtrl.create({
    //let toast = this.toastCtrl.create({
      message: 'Su pedido ha sido enviado con éxito!',
      duration: 3000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toasted",
    });
    this.toastInstance.present();
    //toast.present();
  }

  addedElementToast(){
    if(this.toastInstance){
      this.toastInstance.dismiss();
    }
    this.toastInstance = this.toastCtrl.create({
    //let toast = this.toastCtrl.create({
      message: 'Producto añadido',
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toasted",
    });
    this.toastInstance.present();
    //toast.present();
  }

  removedElementToast(){
    if(this.toastInstance){
      this.toastInstance.dismiss();
    }
    this.toastInstance = this.toastCtrl.create({
    //let toast = this.toastCtrl.create({
      message: 'Producto eliminado',
      duration: 2000,
      //showCloseButton: true,
      //closeButtonText: 'Ok',
      position: "top",
      cssClass: "toasted",
    });
    this.toastInstance.present();
    //toast.present();
  }


  visualizarPrecio(value){
  	let str = value.toString();

  	let m = str.length;
  	if(m<=3){
  		str = '$'+str;
  		return str;
  	}
  	let n=0;
  	for (var i = m - 1; i >= 0; i--) {
  		n=n+1;
  		if(n==3 && i!=0){
  			n=1;
  			/*console.log('Primer slice: '+str.slice(0, i));
  			console.log('Segundo slice: '+str.slice(i,str.length));*/
  			str = str.slice(0, i) + '.' + str.slice(i, str.length);
  			i--;
  		}
  	}
  	str = '$'+str;
  	return(str);
  }

  /* Funcion para realizar el get de los productos */
  /* Establecer hora minima y valor minimo de pedido desde la base de datos aca */
  getProductos(){
    let tipo = Number(localStorage.getItem("tipo"));
    //let productos = [];
    let parsedPrice;
    this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/productos/"+tipo).then(data =>{
      var size = 0, key;
      for (key in data) {
          if (data.hasOwnProperty(key)) size++;
      }
      for (var i = 0; i < size; i++) {
        parsedPrice = JSON.parse(data[i]["Precio"]);
        this.productos.push({ value:    i,
                              id:       Number(data[i]["Id"]),
                              text:     data[i]["Nombre"],
                              unidades: Number(data[i]["Unidades"]),
                              precio:   parsedPrice[tipo-1]});
      }
      this.productos.splice(0,1);
      this.selectedvalue = 0;
      //console.log(this.productos);
    });
  	//this.productos.push({ value: 0, text: 'Empanada coctel', unidades: 50, precio:5000});
  	//this.productos.push({ value: 1, text: 'Empanada media luna', unidades: 25, precio:4500});

  	this.valor_minimo = Number(localStorage.getItem("PrecioMínimo"));
  	this.horas_minimas = Number(localStorage.getItem("HorasMínimas"));

    //Reinicializar la Date
    this.createTime();
  }

  /* Funcion para realizar el post del pedido */
  postPedido(){
    let clienteId = localStorage.getItem("id");
    let tiempoDestino = new Date(this.time);
    //tiempoDestino.setHours(tiempoDestino.getHours());
    let total = this.totales[0].precios;
    let direccionAlterna;
    if(this.dir="")
      direccionAlterna = null;
    else
      direccionAlterna = this.dir;

    /*let productos = [];
    productos.push({ id:1, cantidad:10 });
    productos.push({ id:2, cantidad:15 });
    productos.push({ id:3, cantidad:5 });
    productos.push({ id:4, cantidad:20 });*/
    if(this.network.type == "none"){
      this.noInternetAlert();
      return;
    }
    else{
      let loading = this.loadingCtrl.create({
        //spinner: 'hide',
        content: 'Cargando...'
      });

      loading.present();

      let body = [];
      body.push({ ClienteId:clienteId, TiempoDestino:tiempoDestino.toISOString(), Total:total, DireccionAlterna:direccionAlterna });

      let JsonBody = JSON.stringify(body);
      JsonBody = JsonBody.substr(1,JsonBody.length-2);

      this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/pedidos/add",JsonBody).then(data => {
        this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/pedidos/ultimoPedidoId/"+clienteId).then(data =>{

          let pedidoId = Number(data[0]["Id"]);
          let array = [];
          for (var i = 0 ; i < this.lista.length; i++) {
            array = [];
            array.push({ ProductoId:this.lista[i]["id"], PedidoId:pedidoId, Cantidad:this.lista[i]["cantidad"] });

            let JsonBodyArray = JSON.stringify(array);
            JsonBodyArray = JsonBodyArray.substr(1,JsonBodyArray.length-2);

            this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/productoPedido/add",JsonBodyArray);
          }
          //let productoId = 
          loading.dismiss();
          this.pedidoExitoso();
          this.initializeVariables();
          this.createTime();
          localStorage.setItem("Nuevo pedido","true");
        });
      });
    }

    /*let success=1;
    if(success){
      this.pedidoExitoso();
    }
    else{

    }*/
  }

}
