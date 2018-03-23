import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Info } from '../pages/info/info';

import { PrincipalPage } from '../pages/principal/principal';
import { Register } from '../pages/register/register';
import { PopoverPage } from '../pages/popover/popover';
import { ApiServiceProvider } from '../providers/api-service/api-service';
import { HttpModule } from '@angular/http';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { Network } from '@ionic-native/network';
import { Help } from '../pages/help/help';
import { CallNumber } from '@ionic-native/call-number';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { HeaderColor } from '@ionic-native/header-color';

import { Settings } from '../pages/settings/settings';

import { CloudSettings, CloudModule } from '@ionic/cloud-angular';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'a2b04037'
  }
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PrincipalPage,
    Register,
    PopoverPage,
    Help,
    Settings,
    Info
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PrincipalPage,
    Register,
    PopoverPage,
    Help,
    Settings,
    Info
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServiceProvider,
    NativePageTransitions,
    Network,
    CallNumber,
    LocalNotifications,
    HeaderColor
  ]
})
export class AppModule {}
