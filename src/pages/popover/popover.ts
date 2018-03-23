import { Component } from '@angular/core';
import { ViewController,NavParams } from 'ionic-angular';

@Component({
  template: `<p style="padding:7px;margin:0px"> {{text}} </p>`
})
export class PopoverPage {
	text: string = "";
  constructor(public viewCtrl: ViewController,public params: NavParams) {
  	this.text = params.get("text");
    setTimeout(()=>{this.viewCtrl.dismiss()},3500);
  }

  close() {
    this.viewCtrl.dismiss();
  }
}