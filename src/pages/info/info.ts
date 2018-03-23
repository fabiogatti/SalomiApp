import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ViewController,NavParams } from 'ionic-angular';

@Component({
  templateUrl: 'info.html'
})

export class Info {

  item: any[] = [];
  productos: any[] = [];

  constructor(public params: NavParams,public viewCtrl: ViewController,public alertCtrl: AlertController){
    
    console.log(params.get("Item"));
    console.log(params.get("Productos"));
    this.item = params.get("Item");
    this.productos = params.get("Productos");
    this.item["Dir"] = localStorage.getItem("dir");
    
    //this.item["Cliente"] = params.get("Item")["Cliente"];
    //console.log(this.item["total"]);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  visualizarPrecio(value){
    //console.log(this.item["total"]);

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

  sumaUnidades(){
    let sum = 0;
    for (var i = this.productos.length - 1; i >= 0; i--) {
      sum = sum + Number(this.productos[i]["unidades"]);
    }
    return sum;
  }

  sumaCantidades(){
    let sum = 0;
    for (var i = this.productos.length - 1; i >= 0; i--) {
      sum = sum + Number(this.productos[i]["cantidad"]);
    }
    return sum;
  }
}