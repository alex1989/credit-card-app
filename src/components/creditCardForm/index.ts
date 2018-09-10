import { Component, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core'; // HostListener,
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import cardValidator from 'card-validator';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'credit-card-form',
  templateUrl: 'creditCardForm.html'
})
export class CreditCardForm {
  @Output() onFormSubmit = new EventEmitter<any>();
  // html elements
  @ViewChild('creditCardInput') creditCardInput;
  @ViewChild('expirationInput') expInput;
  @ViewChild('cvcInput') cvcInput;

  //listeners
  clickListener: Function;
  touchDownListener: Function;
  touchEndListener: Function;

  // masks
  creditCardMask = "0000 0000 0000 0000";
  expirationMask = "00/00";
  cvcMask = "000";
  card: any;

  // form group
  creditCardForm: FormGroup;

  constructor(private fb: FormBuilder, private renderer: Renderer2) {}

  ngOnInit() {
    this.creditCardForm = this.fb.group({
      creditCard: this.fb.control('', [
        (creditCardNumber) => {
          const numberValidation = cardValidator.number(creditCardNumber.value);
          this.card = numberValidation.card;
          if (this.card) {
            let length = Math.min(...this.card.lengths);
            const { gaps } = this.card;
            let { code: { size: cvvSize } } = this.card;
            let creditCardMaskTemplate = gaps.reduce((mask, gapIndex, idx) => {

              gapIndex -= idx > 0 ? gaps[idx-1] : 0;
              while(gapIndex--) {
                mask += '0';
              }
              return `${mask} `;
            }, '');
            length -= gaps[gaps.length - 1];
            while (length--) {
              creditCardMaskTemplate += '0';
            }
            this.creditCardMask = creditCardMaskTemplate.trim();
            let cvvMaskTemplate = '';
            while(cvvSize--) {
              cvvMaskTemplate += '0';
            }
            this.cvcMask = cvvMaskTemplate;
          } else {
            // restore default
            this.creditCardMask = "0000 0000 0000 0000";
            this.cvcMask = "000";
          }
          if (numberValidation.isValid) {
            this.expInput.nativeElement.focus();
          }
          return creditCardNumber.value ? (
            !numberValidation.isValid ? ['invalid'] : null
          ) : null;
        },
      ]),
      exp: this.fb.control('', [
        (expController) => {
          let { value } = expController;
          value = `${value.substr(0, 2)} ${value.substr(2, 4)}`;
          const expirationValidation = cardValidator.expirationDate(value);
          if (expirationValidation.isValid) {
            this.cvcInput.nativeElement.focus();
          }
          return !expirationValidation.isValid ? ['invalid'] : null;
        }
      ]),
      cvc: this.fb.control('', [
        (cvvController) => {
          const cvvValidation = cardValidator.cvv(cvvController.value, this.card ? this.card.code.size : 3);
          return !cvvValidation.isValid ? ['invalid'] : null;
        }
      ]),
    });

  }

  clickout(event) {
    if (
      event.target.tagName.toLowerCase() !== 'input' &&
      document.activeElement.tagName.toLocaleLowerCase() !== 'input'
    ) {
      this.creditCardInput.nativeElement.focus();
    }
  }

  submitForm() {
    if (this.creditCardForm.valid) {
      this.onFormSubmit.emit(this.creditCardForm.value)
    } else {
      const inputs = ['creditCard', 'exp', 'cvc'];
      for(let i = 0; i < inputs.length; i++) {
        let inputController = this.creditCardForm.get(inputs[i]);
        if (inputController.errors) {
          setTimeout(() => this[`${inputs[i]}Input`].nativeElement.focus(), 0);
          break;
        }
      }
    }
  }

  // getters
  get creditCard() { return this.creditCardForm.get('creditCard'); }
  get exp() { return this.creditCardForm.get('exp'); }
  get cvc() { return this.creditCardForm.get('cvc'); }
  get cardType() {
    const cardIcons = {
      visa: "fa fa-cc-visa",
      mastercard: "fa fa-cc-mastercard",
      'american-express': "fa fa-cc-amex",
      discover: "fa fa-cc-discover",
      jcb: "fa fa-cc-jcb"
    };
    return this.card && cardIcons[this.card.type] != null  ? cardIcons[this.card.type] : "fa fa-credit-card";
  }

  ngAfterViewInit() {
    const clickout = this.clickout.bind(this);
    setTimeout(() => {
      this.creditCardInput.nativeElement.focus();
      this.clickListener = this.renderer.listen('document', 'click', clickout);
      this.touchDownListener = this.renderer.listen('document', 'press', clickout);
      this.touchEndListener = this.renderer.listen('document', 'tap', clickout);
    }, 600);
  }

  ngOnDestroy() {
    this.clickListener();
    this.touchDownListener();
    this.touchEndListener();
  }
}
