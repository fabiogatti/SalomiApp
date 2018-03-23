import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrincipalPage } from './principal';
import { PedidoPage } from '../pedido/pedido';
import { ListadoPage } from '../listado/listado';

@NgModule({
  declarations: [
    PrincipalPage,
    PedidoPage,
    ListadoPage
  ],
  imports: [
    IonicPageModule.forChild(PrincipalPage),
  ],
  exports: [
  	PrincipalPage,
    ListadoPage,
    PedidoPage
  ]
})
export class PrincipalPageModule {}
