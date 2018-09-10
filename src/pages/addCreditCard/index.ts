import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';


@Component({
  selector: 'add-credit-card',
  templateUrl: 'addCreditCard.html'
})
export class AddCreditCardPage {
  @ViewChild('creditCardForm') creditCardForm;
  isSubmitForm: boolean = false;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) { }

  submitForm() {
    this.creditCardForm.submitForm();
  }

  addCard(value: any) {
    if (value) {
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      setTimeout(() => {
        loading.dismiss();
        this.navCtrl.goToRoot(value);
      }, 1000);
    } else {
      this.isSubmitForm = false;
    }
  }
}
