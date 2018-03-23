import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PedidoPage } from './pedido';

@NgModule({
  declarations: [
    PedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(PedidoPage),
  ],
  exports: [
    PedidoPage
  ]
})
export class PedidoPageModule {}
