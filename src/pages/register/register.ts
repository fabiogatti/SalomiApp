import { Component } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Network } from '@ionic-native/network';
import { LoadingController } from 'ionic-angular';
import { ViewController,NavParams } from 'ionic-angular';

import { PopoverPage } from '../popover/popover';

@Component({
	templateUrl: 'register.html'
})

export class Register {

	userInfo: {	user: string,	pass: string,	name: string,	email: string,	number: string,	empresa: string,	direccion: string} = 
			  { user: '',		pass: '', 		name: '',		email: '',		number: '',		empresa: '',		direccion: ''};

	fieldError: { user: boolean,	pass: boolean,	name: boolean,	email: boolean,	number: boolean,	empresa: boolean,	direccion: boolean} =
				{ user: false,		pass: false, 	name: false,	email: false,	number: false,		empresa: false,		direccion: false};

  fieldTaken = { user:false, email:false };

  togglePass = false;

  toggleRegister: boolean = true;

	constructor(public params: NavParams,public viewCtrl: ViewController,public alertCtrl: AlertController,public popoverCtrl: PopoverController,public ApiServiceProvider: ApiServiceProvider,private network: Network,public loadingCtrl: LoadingController) {
	}


  dismiss() {
  	this.viewCtrl.dismiss();
	}

  errorList(value){
    if(this.verifyUser() && this.verifyPass() && this.verifyName() && this.verifyEmail() && this.verifyNumber() && this.verifyEmpresa() && this.verifyDirección()){
      this.toggleRegister = false;
    }
    else{
      this.toggleRegister = true;
    }
    if(value=="user" || value=="email"){
      this.fieldTaken[value] = false;
    }
    /*let str = value.charAt(0).toUpperCase() + value.slice(1);
    console.log(value);
    console.log(str);
    console.log(eval(this["verify"+str]));*/
    let bool;
    switch (value) {
      case "user":
        bool = this.verifyUser();
        break;
      case "pass":
        bool = this.verifyPass();
        break;
      case "name":
        bool = this.verifyName();
        break;
      case "email":
        bool = this.verifyEmail();
        break;
      case "number":
        bool = this.verifyNumber();
        break;
      case "empresa":
        bool = this.verifyEmpresa();
        break;
      case "direccion":
        bool = this.verifyDirección();
        break;
      
      default:
        bool = false;
        break;
    }
    if(bool || this.userInfo[value]==""){
      this.fieldError[value] = false;
      return;
    }
    else{
      this.fieldError[value] = true;
      return;
    }
  }

	/*resetError(value){
		//console.log(this.fieldError);
		this.fieldError[value] = false;
    if(value=="user" || value=="email"){
      this.fieldTaken[value] = false;
    }
		//console.log(this.fieldError);
		//console.log(value);
		//console.log("paso");
	}*/

	verifyUser(){
		var format = /^([A-Za-z]+)([0-9_-]{0,})$/;
		if(format.test(this.userInfo.user)){
			console.log("Entro if 1");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.user = true;
			return false;
		}
	}

	verifyPass(){
		var format = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;
		if(format.test(this.userInfo.pass)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.pass = true;
			return false;
		}
	}

	verifyName(){
		var format = /^[A-Za-zñÑáéíóúÁÉÍÓÚ ]{1,}$/;
		if(format.test(this.userInfo.name)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.name = true;
			return false;
		}
	}

	verifyEmail(){
		var format = /^[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})$/;
		if(format.test(this.userInfo.email)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.email = true;
			return false;
		}
	}

	verifyNumber(){
		var format = /^([0-9]{7}|[0-9]{10})$/;
		if(format.test(this.userInfo.number)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.number = true;
			return false;
		}
	}

	verifyEmpresa(){
		var format = /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ ]{1,}$/;
		if(format.test(this.userInfo.empresa)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.empresa = true;
			return false;
		}
	}

	verifyDirección(){
		var format = /^[A-Za-z0-9-_#,.ñÑáéíóúÁÉÍÓÚ ]{1,}$/;
		if(format.test(this.userInfo.direccion)){
			console.log("Entro if");
			return true;
		}
		else{
			console.log("Entro else");
			//this.fieldError.direccion = true;
			return false;
		}
	}

  noInternetAlert(){
    let alert = this.alertCtrl.create({
      title: 'No hay conexión',
      message: 'Favor conectarse a internet',
      buttons: ['OK']
    });
    alert.present();
  }

	register(){
		/*this.verifyUser();this.verifyPass();this.verifyName();this.verifyEmail();this.verifyNumber();this.verifyEmpresa();this.verifyDirección();
    this.clicked = true;
		if(this.verifyUser() && this.verifyPass() && this.verifyName() && this.verifyEmail() && this.verifyNumber() && this.verifyEmpresa() && this.verifyDirección()){
			*/
      let usuario = this.userInfo.user.toLowerCase();
      let email = this.userInfo.email;

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

        this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/usuario/"+usuario).then(data => {
          if(data["Error"] == undefined){
            //userAvailable = true;
            this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/email/"+email).then(data => {
              if(data["Error"] == undefined){
                let body = [];
                body.push({ 
                            nombre:this.userInfo.name,
                            usuario:this.userInfo.user,
                            pass:encodeURIComponent(this.userInfo.pass),
                            email:this.userInfo.email,
                            numero:this.userInfo.number,
                            empresa:this.userInfo.empresa,
                            direccion:this.userInfo.direccion
                         });

                let JsonBody = JSON.stringify(body);
                JsonBody = JsonBody.substr(1,JsonBody.length-2);

                console.log(JsonBody);
                this.ApiServiceProvider.post("http://www.congeladossalomia.com/api/clientes/add",JsonBody);
                console.log("Nuevo usuario creado!");

                setTimeout(() =>{
                  loading.dismiss();
                },2000);
                //loading.dismiss();
                this.inputSuccess();
                this.viewCtrl.dismiss();
              }
              else{
                loading.dismiss();
                console.log("Correo ya registrado");
                this.fieldTaken.email = true;
              }
            });
          }
          else{
            loading.dismiss();
            //userAvailable = false;
            //this.invalidUserAlert();
            console.log("Nombre de usuario no disponible");
            this.fieldTaken.user = true;
            console.log(this.fieldTaken);
            this.ApiServiceProvider.get("http://www.congeladossalomia.com/api/clientes/email/"+email).then(data => {
              if(data["Error"] != undefined){
                this.fieldTaken.email = true;
                console.log("Correo ya registrado");
              }
            });
          }
        });
      }
		/*}
		else{
			this.inputAlert();
			//this.clicked = true;
			console.log(this.fieldError);
		}*/
	}

	inputSuccess(){
	  	let alert = this.alertCtrl.create({
	      title: 'Registro exitoso',
	      message: 'Gracias por registrarse '+this.userInfo.user,
	      buttons: ['OK']
	    });
	    alert.present();
	}

	inputAlert(){
	  	let alert = this.alertCtrl.create({
	      title: 'Campos inválidos',
	      message: 'Por favor llenar todos los campos con información válida (sin carácteres especiales)',
	      buttons: ['OK']
	    });
	    alert.present();
	}

	createPopover(myEvent){
		let popover = this.popoverCtrl.create(PopoverPage,{text:"Esta información solo será utilizada para contactarlo y para entregar sus pedidos"},{cssClass: 'popover'});
   		console.log(myEvent);
       popover.present({
      		ev: myEvent
    	});
	}

}