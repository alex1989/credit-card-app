import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddCreditCardPage } from '../pages/addCreditCard';
import { CreditCardForm } from '../components/creditCardForm';

// Import your library
import { NgxMaskModule } from 'ngx-mask'



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddCreditCardPage,
    CreditCardForm
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    NgxMaskModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddCreditCardPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    }
  ]
})
export class AppModule {}
