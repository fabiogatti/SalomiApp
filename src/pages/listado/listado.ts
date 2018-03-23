import { Component } from '@angular/core';
import { ModalController,IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { HomePage } from '../home/home'
import { App } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
//import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { ViewChild } from '@angular/core';
import { Content } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';
import { Help } from '../help/help';
import { ToastController,Toast } from 'ionic-angular';

import { Settings } from '../settings/settings';
import { Info } from '../info/info';
/**
 * Generated class for the ListadoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-listado',
  templateUrl: 'listado.html',
})
export class ListadoPage {

  listaPedidos: 	any[] = [];
  listaPedidosVC:	any[] = []; //Lista de pedidos visual completa (sin limite)
  listaPedidosV: 	any[] = []; //Lista de pedidos visual (con limite para carga)

  selectFiltro: 	any[] = [];
  selectedFiltro: 	number;
  selectFiltroF: 	any[] = [];//Hidden select Fecha
  selectFiltroP: 	any[] = [];//Hidden select Precio
  selectedFiltroF:  number;//Hidden selectedFiltro Fecha
  selectedFiltroP:  number;//Hidden selectedFiltro Precio
  filtroOpt1:		string;//Una sola fecha
  filtroOpt2:		string;//Primera fecha
  filtroOpt3:		string;//Segunda fecha
  filtroOpt4:		number;//Precio
  isFiltered:		boolean;
  /*selectOrdenar:	any[] = [];
  selectedOrdenar:	number;*/

  listaSoloPedidos: any[] = [];

  hiddenList: 		any[] = [];

  totalSort: 		number;
  fechaSort:		number;

  pedidosACargar:	number; //Numero de pedidos cargados a la vez (Valor por defecto 15)
  contadorPedidos:	number; //Numero para cargar pedidos de ListaPedidos a ListaPedidosV

  data: any;

  subscribe1: any;
  subscribe2: any;

  toastInstance: Toast;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,private app:App,public ApiServiceProvider: ApiServiceProvider,/*private nativePageTransitions: NativePageTransitions,*/public loadingCtrl: LoadingController,public modalCtrl: ModalController,private network: Network,public toastCtrl: ToastController) {
    localStorage.setItem("sin conexion","false");
    localStorage.setItem("Nuevo pedido","false");
  	this.selectFiltro.push({ value:0, text: "Nada" });
  	this.selectFiltro.push({ value:1, text: "Fecha" });
  	this.selectFiltro.push({ value:2, text: "Precio" });
  	this.selectFiltroF.push({ value:0, text: "Unica fecha"});
  	this.selectFiltroF.push({ value:1, text: "Rango de fechas"});
  	this.selectFiltroP.push({ value:0, text: "Mayor que"});
  	this.selectFiltroP.push({ value:1, text: "Igual que"});
  	this.selectFiltroP.push({ value:2, text: "Menor que"});
  	let date = new Date();
    date.setHours(date.getHours()-5);
    this.filtroOpt1 = date.toISOString();
    this.filtroOpt2 = date.toISOString();
    this.filtroOpt3 = date.toISOString();

    
    /*this.network.onConnect().subscribe(() => {
      setTimeout(() => {
        this.InternetAlert("onConnect Antes");
        if((localStorage.getItem("Nuevo pedido")=="true" || localStorage.getItem("sin conexion")=="true") && localStorage.getItem("CurrentTab")=="1"){
          this.initializeValues();
          this.getPedidos2().then(()=>{
            localStorage.setItem("sin conexion","false");
            localStorage.setItem("Nuevo pedido","false");
          });
        }
        this.InternetAlert("onConnect Despues");
      }, 2000);*/
      /*this.InternetAlert("onConnect Antes");
      if((localStorage.getItem("Nuevo pedido")=="true" || localStorage.getItem("sin conexion")=="true") && localStorage.getItem("CurrentTab")=="1"){
        this.initializeValues();
        this.getPedidos();
        localStorage.setItem("sin conexion","false");
        localStorage.setItem("Nuevo pedido","false");
      }
      this.InternetAlert("onConnect Despues");*/
    //});
    /*if(localStorage.getItem("sin conexion")=="true"){
      this.network.onConnect().subscribe(() => {
        this.InternetAlert();
        
        
      });
    }*/
    //else{
    this.initializeValues();
    this.getPedidos();

    //}
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ListadoPage');
  }

  ionViewWillEnter(){
    localStorage.setItem("CurrentTab","1");
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
    //this.content.scrollToTop();
  }

  ionViewWillLeave(){
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
    localStorage.setItem("CurrentTab","0");
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

  infoModal(item){
    let infoModal = this.modalCtrl.create(Info,{Item: item,Productos:this.listaSoloPedidos[item.value]});
    infoModal.present();
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

  /*ionViewCanEnter(){
    if(this.network.type=="none"){
      this.noInternetAlert();
      return false;
    }
    else{
      return true;
    }
  }*/

  ionViewDidEnter(){
    console.log("Nuevo pedido: "+localStorage.getItem("Nuevo pedido"));
    //this.InternetAlert("ionViewDidEnter Antes");
    //if(localStorage.getItem("Nuevo pedido")=="true" || localStorage.getItem("sin conexion")=="true"){
    if(localStorage.getItem("Nuevo pedido")=="true"){
        //if(this.network.type!="none"){
          this.content.scrollToTop();
          this.initializeValues();
          /*this.selectedFiltro = 0;
          this.selectedFiltroF = 0;
          this.selectedFiltroP = 0;
          this.filtroOpt4 = 0;
          this.isFiltered = false;
          this.totalSort = 0;
          this.fechaSort = 0;
          this.contadorPedidos = 0;
          this.pedidosACargar = 15;*/
          /*this.contadorPedidos = 0;
          this.resetFiltro(true);
          this.isFiltered = false;
          this.fechaSort = 0;
          this.totalSort = 0;*/
          this.getPedidos();
          /*this.getPedidos2().then(()=>{
            localStorage.setItem("sin conexion","false");
            localStorage.setItem("Nuevo pedido","false");
          });*/
          
          //this.InternetAlert("ionViewDidEnter Despues");
      }
      /*else{
        this.noInternetAlert();
      }*/
    }

  initializeValues(){
    this.selectedFiltro = 0;
    this.selectedFiltroF = 0;
    this.selectedFiltroP = 0;
    this.filtroOpt4 = 0;
    this.isFiltered = false;
    this.totalSort = 0;
    this.fechaSort = 0;
    this.contadorPedidos = 0;
    this.pedidosACargar = 15;
  }

  swipeEvent(e){
    if(e.direction==4){
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
      this.navCtrl.parent.select(0);
    }
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

  llenarListaSoloPedidos(){
  	let array;
  	let str;
  	let lenght;
  	this.listaSoloPedidos = [];
  	for (var i = 0; i < this.listaPedidosVC.length; i++) {
  		lenght = Object.keys(this.listaPedidosVC[i]).length;
  		array = [];
  		for (var j = 3; j < lenght; j++) {
  			str = 'producto'+(j-2);

        if(this.listaPedidosVC[i][str] != undefined)
  			  array.push(this.listaPedidosVC[i][str]);
  		}
  		this.listaSoloPedidos.push(array);
  	}
  }

  llenarHiddenList(){
  	this.hiddenList = [];
  	for (var i = 0; i < this.listaPedidosVC.length; i++) {
  		this.hiddenList.push(false);
  	}
  }

  async getPedidos(){
  	/*this.listaPedidos.push({
  		value:		0,
  		fecha:		"2017-05-27",
  		total:		14250,
  		producto1:	{nombre: "Empanada coctel", cantidad: 1, unidades: 50, precio:5000},
  		producto2:	{nombre: "Empanada media luna", cantidad: 1, unidades: 25, precio:4500},
  		producto3:	{nombre: "Empanada pañuelo", cantidad: 1, unidades: 35, precio:4750}
  	});
  	this.listaPedidos.push({
  		value:		1,
  		fecha:		"2017-05-27",
  		total:		50000,
  		producto1:	{nombre: "Empanada coctel", cantidad: 10, unidades: 500, precio:50000}
  	});
  	this.listaPedidos.push({
  		value:		2,
  		fecha:		"2017-05-29",
  		total:		47500,
  		producto1:	{nombre: "Empanada coctel", cantidad: 5, unidades: 250, precio:25000},
  		producto2:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500}
  	});
  	this.listaPedidos.push({
  		value:		3,
  		fecha:		"2017-06-02",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	//Desde aqui
  	this.listaPedidos.push({
  		value:		4,
  		fecha:		"2017-06-03",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		5,
  		fecha:		"2017-06-03",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		6,
  		fecha:		"2017-06-05",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		7,
  		fecha:		"2017-06-07",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		8,
  		fecha:		"2017-06-08",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		9,
  		fecha:		"2017-06-08",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		10,
  		fecha:		"2017-06-09",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		11,
  		fecha:		"2017-06-11",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		12,
  		fecha:		"2017-06-15",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		13,
  		fecha:		"2017-06-15",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		14,
  		fecha:		"2017-06-18",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		15,
  		fecha:		"2017-06-19",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		16,
  		fecha:		"2017-06-19",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		17,
  		fecha:		"2017-06-20",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		18,
  		fecha:		"2017-06-21",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		19,
  		fecha:		"2017-06-22",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		20,
  		fecha:		"2017-06-23",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		21,
  		fecha:		"2017-06-24",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		22,
  		fecha:		"2017-06-25",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		23,
  		fecha:		"2017-06-26",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		24,
  		fecha:		"2017-06-26",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		25,
  		fecha:		"2017-06-27",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		26,
  		fecha:		"2017-06-27",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		27,
  		fecha:		"2017-06-27",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		28,
  		fecha:		"2017-06-28",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		29,
  		fecha:		"2017-06-28",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		30,
  		fecha:		"2017-06-29",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		31,
  		fecha:		"2017-06-29",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		32,
  		fecha:		"2017-06-30",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});
  	this.listaPedidos.push({
  		value:		33,
  		fecha:		"2017-07-01",
  		total:		46250,
  		producto1:	{nombre: "Empanada media luna", cantidad: 5, unidades: 125, precio:22500},
  		producto2:	{nombre: "Empanada pañuelo", cantidad: 5, unidades: 175, precio:23750}
  	});*/
  	//this.listaPedidosV = this.listaPedidos;
    //this.InternetAlert("getPedidos Antes");
    //if(this.network.type == "none"){
      /*if(localStorage.getItem("sin conexion")!="true"){
        this.noInternetAlert();
      }*/
    //  localStorage.setItem("sin conexion","true");
      //this.InternetAlert("getPedidos Despues");
    //  return;
    //}
    //else{
    //  this.getPedidos2();
    //}
    let loading = this.loadingCtrl.create({
      //spinner: 'hide',
      content: 'Cargando...'
    });

    loading.present();

    let id = localStorage.getItem("id");

      this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/pedidos/userid/"+id).then(data => {
        this.data = data;
        //console.log(data);
        //console.log(data["Error"]);
        if(data["Error"]){
          loading.dismiss();
          return;
        }
        
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

            array[index]["producto"+array[index].Contador]=array2;
            array[index].Contador = array[index].Contador+1;
          }
          else{
            array.push({ value:n ,
                         fecha:this.data[i]['TiempoDestino'],
                         TiempoC: this.data[i]["TiempoCreación"],
                         DirAlterna: this.data[i]["DirecciónAlterna"],
                         PedidoId:this.data[i].PedidoId,
                         total:this.data[i].Total,
                         Contador:2,
                         producto1:[] 
                       });
            array2["nombre"] = this.data[i].Nombre;
            array2["cantidad"] = this.data[i].Cantidad;
            array2["unidades"] = this.data[i].Cantidad * this.data[i].Unidades;
            array2["precio"] = this.data[i].Cantidad * this.getPrice(this.data[i]["Precio"]);
            array2["PPID"] = this.data[i].PPID;
            array[array.length-1].producto1 = array2;
            n++;
          }
        }
        this.listaPedidos = array;
        this.listaPedidosVC = this.listaPedidos;
        this.cargarPedidos();
        this.llenarListaSoloPedidos();
        this.llenarHiddenList();
        loading.dismiss();
        /*console.log(this.listaPedidos);
        console.log(this.listaPedidosVC);
        console.log(this.listaPedidosV);*/
        
      });


  	/*this.listaPedidosVC = this.listaPedidos;
  	this.cargarPedidos();
  	this.llenarListaSoloPedidos();
  	this.llenarHiddenList();*/
  }

  /*async getPedidos2(){
    let id = localStorage.getItem("id");

      this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/pedidos/userid/"+id).then(data => {
        this.data = data;

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

            array[index]["producto"+array[index].Contador]=array2;
            array[index].Contador = array[index].Contador+1;
          }
          else{
            array.push({ value:n ,PedidoId:this.data[i].PedidoId, total:this.data[i].Total, fecha:this.data[i].TiempoDestino, Contador:2,producto1:[] });
            array2["nombre"] = this.data[i].Nombre;
            array2["cantidad"] = this.data[i].Cantidad;
            array2["unidades"] = this.data[i].Cantidad * this.data[i].Unidades;
            array2["precio"] = this.data[i].Cantidad * this.getPrice(this.data[i]["Precio"]);
            array2["PPID"] = this.data[i].PPID;
            array[array.length-1].producto1 = array2;
            n++;
          }
        }
        this.listaPedidos = array;
        this.listaPedidosVC = this.listaPedidos;
        this.cargarPedidos();
        this.llenarListaSoloPedidos();
        this.llenarHiddenList();
      });
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
    let tipo = Number(localStorage.getItem("tipo"))-1;
    var array = JSON.parse(str);
    console.log(tipo);
    console.log(array);
    console.log(array[tipo]);
    return array[tipo];
  }

  toggleHiddenList(value){
  	this.hiddenList[value] = !this.hiddenList[value];
  }

  minProductAlert(){
  	let alert = this.alertCtrl.create({
      title: 'Error',
      message: 'No se pueden ingresar valores menores a 1 ni numeros decimales',
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

  InternetAlert(value){
    let alert = this.alertCtrl.create({
      title: 'Hay conexión',
      message: value+"; "+"Sin conexion: "+localStorage.getItem("sin conexion")+" || Nuevo pedido: "+localStorage.getItem("Nuevo pedido")+" || "+localStorage.getItem("CurrentTab"),
      buttons: ['OK']
    });
    alert.present();
  }

  noPedidosAlert(){
    let alert = this.alertCtrl.create({
      title: 'No hay suficientes pedidos',
      message: 'No se puede realizar filtros con la cantidad actual de pedidos',
      buttons: ['OK']/*[{
                text: 'OK',
                role: 'cancel',
                handler: () => {
                  alert.dismiss();
                  return false;
                }
              }]*/
    });
    //setTimeout(()=>{alert.present();},500);
    alert.present();
  }

  helpModal(){
    let helpmodal = this.modalCtrl.create(Help);
    helpmodal.present();
  }

  filtroFecha(){
    if(this.listaPedidos.length<=1){
      this.selectedFiltro = 0;
      this.noPedidosAlert();
      return;
    }
  	let array = [];
  	if(this.selectedFiltroF==0){
  		let fecha;
  		let date = new Date(this.filtroOpt1);
  		/*date.setMilliseconds(0);
  		date.setSeconds(0);
  		date.setMinutes(0);
  		date.setHours(0);*/
  		for (var i = 0; i < this.listaPedidos.length ; i++) {
  			fecha = new Date(this.listaPedidos[i].fecha);
  			/*fecha.setMilliseconds(0);
	  		fecha.setSeconds(0);
	  		fecha.setMinutes(0);
	  		fecha.setHours(0);*/
	  		/*console.log("Fecha:"+fecha);
	  		console.log(fecha.getFullYear());
	  		console.log(fecha.getMonth());
	  		console.log(fecha.getDay());
	  		console.log("Date:"+date);
	  		console.log(date.getFullYear());
	  		console.log(date.getMonth());
	  		console.log(date.getDay());*/
  			//if(fecha.getFullYear()==date.getFullYear() && fecha.getMonth()==date.getMonth() && fecha.getDay()==date.getDay()){
  			//if(fecha.setHours(0,0,0,0)==date.setHours(0,0,0,0)){
        if(fecha.getFullYear()==date.getFullYear() && fecha.getMonth()==date.getMonth() && fecha.getDate()==date.getDate()){
          array.push(this.listaPedidos[i]);
        }

  			/*if(fecha.getUTCFullYear()==date.getUTCFullYear() && fecha.getUTCMonth()==date.getUTCMonth() && fecha.getUTCDay()==date.getUTCDay()){
  				array.push(this.listaPedidos[i]);
  			}*/
  		}
  		this.listaPedidosVC = array;
  		this.contadorPedidos = 0;
  		this.cargarPedidos();

  		this.llenarHiddenList();
  		this.isFiltered=true;
  		return;
  	}
  	else if(this.selectedFiltroF==1){
  		let fecha;
  		let date1 = new Date(this.filtroOpt2);
  		date1.setMilliseconds(0);
  		date1.setSeconds(0);
  		date1.setMinutes(0);
  		date1.setHours(0);
  		let date2 = new Date(this.filtroOpt3);
  		date2.setMilliseconds(0);
  		date2.setSeconds(0);
  		date2.setMinutes(0);
  		date2.setHours(0);
  		for (i = 0; i < this.listaPedidos.length ; i++) {
  			fecha = new Date(this.listaPedidos[i].fecha);
  			fecha.setMilliseconds(0);
  			fecha.setSeconds(0);
  			fecha.setMinutes(0);
  			fecha.setHours(0);
  			if(fecha>=date1){
  				if(fecha<=date2){
  					array.push(this .listaPedidos[i]);
  				}
  			}
  		}
  		this.listaPedidosVC = array;
  		this.contadorPedidos = 0;
  		this.cargarPedidos();

  		this.llenarHiddenList();
  		this.isFiltered=true;
  		return;
  	}
  }

  filtroPrecio(){
    if(this.listaPedidos.length<=1){
      this.selectedFiltro = 0;
      this.noPedidosAlert();
      return;
    }
  	let array = [];
  	if(this.selectedFiltroP==0){
  		for (var i = 0; i < this.listaPedidos.length ; i++) {
  			if(this.listaPedidos[i].total>this.filtroOpt4){
  				array.push(this.listaPedidos[i]);
  			}
  		}
  		this.listaPedidosVC = array;
  		this.contadorPedidos = 0;
  		this.cargarPedidos();

  		this.llenarHiddenList();
  		this.isFiltered=true;
  		return;
  	}
  	else if(this.selectedFiltroP==1){
  		for (i = 0; i < this.listaPedidos.length ; i++) {
  			if(this.listaPedidos[i].total==this.filtroOpt4){
  				array.push(this.listaPedidos[i]);
  			}
  		}
  		this.listaPedidosVC = array;
  		this.contadorPedidos = 0;
  		this.cargarPedidos();

  		this.llenarHiddenList();
  		this.isFiltered=true;
  		return;
  	}
  	else if(this.selectedFiltroP==2){
  		for (i = 0; i < this.listaPedidos.length ; i++) {
  			if(this.listaPedidos[i].total<this.filtroOpt4){
  				array.push(this.listaPedidos[i]);
  			}
  		}
  		this.listaPedidosVC = array;
  		this.contadorPedidos = 0;
  		this.cargarPedidos();

  		this.llenarHiddenList();
  		this.isFiltered=true;
  		return;
  	}
  }

  resetFiltro(value){
  	if(value==true){
  		this.selectedFiltro=0;
  	}
    if(this.isFiltered){
      this.toast('Se ha removido el filtro');
    }
  	this.totalSort = 0;
  	this.fechaSort = 0;
  	this.listaPedidosVC = this.listaPedidos;
	  this.contadorPedidos = 0;
  	this.cargarPedidos();

  	this.llenarHiddenList();
  	this.isFiltered=false;
  }

  checkFiltro(){
    if(this.listaPedidos.length<=1 && this.selectedFiltro!=0){
      //console.log(this.selectedFiltro);
      setTimeout(()=>{
        this.selectedFiltro = 0;
        this.noPedidosAlert();
      },100);
      //console.log(this.selectedFiltro);
      //this.noPedidosAlert();
      return;
    }
  	if(this.selectedFiltro==0){
  		this.resetFiltro(false);
  	}
  }

  realizarFiltro(){
  	if(this.selectedFiltro==1){
		this.totalSort = 0;
  		this.fechaSort = 0;
  		this.filtroFecha();
      this.toast('Se ha aplicado el filtro');
  		return;
  	}
  	else if(this.selectedFiltro==2){
  		if(this.filtroOpt4 <= 0 || this.filtroOpt4 % 1 != 0){
  			this.minProductAlert();
  			return;
  		}
  		this.totalSort = 0;
  		this.fechaSort = 0;
  		this.filtroPrecio();
      this.toast('Se ha aplicado el filtro');
  		return;
  	}
  }

  toggleTotalSort(){
  	this.fechaSort = 0;
  	if(this.totalSort==0 || this.totalSort==1){
  		this.totalSort=2;
  		this.listaPedidosVC.sort(function(a, b) {
    		a = Number(a.total);
        b = Number(b.total);

    		return a < b ? -1 : (a > b ? 1 : 0);
		});
		this.contadorPedidos = 0;
  		this.cargarPedidos();
  		this.llenarHiddenList();
  		return;
  	}
  	else{
  		this.totalSort=1;
  		this.listaPedidosVC.sort(function(a, b) {
    		a = Number(a.total);
        b = Number(b.total);

    		return a > b ? -1 : (a < b ? 1 : 0);
		});
  		this.contadorPedidos = 0;
  		this.cargarPedidos();
  		this.llenarHiddenList();
  		return;
  	}
  }

  toggleFechaSort(){
  	this.totalSort = 0;
  	if(this.fechaSort==0 || this.fechaSort==1){
  		this.fechaSort=2;
  		this.listaPedidosVC.sort(function(a, b) {
    		a = new Date(a.fecha);
    		b = new Date(b.fecha);

    		return a < b ? -1 : (a > b ? 1 : 0);
		});
		this.contadorPedidos = 0;
  		this.cargarPedidos();
  		this.llenarHiddenList();
  		return;
  	}
  	else{
  		this.fechaSort=1;
  		this.listaPedidosVC.sort(function(a, b) {
    		a = new Date(a.fecha);
    		b = new Date(b.fecha);

    		return a > b ? -1 : (a < b ? 1 : 0);
		});
		this.contadorPedidos = 0;
  		this.cargarPedidos();
  		this.llenarHiddenList();
  		return;
  	}
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

  cargarPedidos(){
  	if(this.contadorPedidos==0){
  		this.listaPedidosV = [];
  	}
  	for (let i = 0; i < this.pedidosACargar; i++) {
      	if(this.contadorPedidos+i>=this.listaPedidosVC.length){
      		console.log("Se rompió");
      		break;
      	}
      	else{
          //console.log(i+this.contadorPedidos);
          //console.log(this.listaPedidosVC[i+this.contadorPedidos]);
      		this.listaPedidosV.push(this.listaPedidosVC[i+this.contadorPedidos]);
          //console.log(this.listaPedidosV[i+this.contadorPedidos]);
      	}
      }
    this.contadorPedidos += this.pedidosACargar;
  }

  doInfinite(infiniteScroll) {
  	console.log(this.listaPedidosV);
    if(this.contadorPedidos>=this.listaPedidos.length){
    	infiniteScroll.complete();
    	console.log(this.listaPedidosV);
    	return;
    }
    else{
	    setTimeout(() => {
	      this.cargarPedidos();
	      console.log('Terminaron de cargar los pedidos');
	      infiniteScroll.complete();
	      console.log(this.listaPedidosV);
	    }, 500);
    }

  }

  clicked(){
  	console.log("Clicked");
  }

}
