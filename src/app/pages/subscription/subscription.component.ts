import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../core/services/common.service';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss'
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'Subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class Subscription implements OnInit {
  stripeTest: FormGroup;
  stripeTestError = {
    'name': '',
    'email': '',
    'card': '',
  }
  plans = []
  currentPlan = ''
  FullName = ''
  userId
  planId
  stripeToken
  planPrice
  planDuration
  plandata: any
  // stripe
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: 'red',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };


  //
  constructor(private commonService: CommonService, private fb: FormBuilder, private stripeService: StripeService, private spinner: NgxSpinnerService) {  }
  ngOnInit(): void {
    this.getPlans()
    this.getUser()
    this.paymentForm()
    this.getTransparentPricing()
  }
  paymentFormvalidationMessages = {
    'name': {
      'required': 'Name is required',
      'minlength': 'minimum 3 characters required'
    },
    'email': {
      'required': 'email is required',
      'pattern': 'email not in valid format'
    },
    'card': {
      'required': 'card number is required',
      'minlength': 'minimum 16 digit required',
      'maxlength': 'minimum 16 digit required'

    }
  }
  paymentForm() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')]],
      card: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16),]]
    })
    this.stripeTest.valueChanges.subscribe(data => this.onValueChanges(data))

  }
  onValueChanges(data?: any) {
    if (!this.stripeTest)
      return
    const form = this.stripeTest;
    for (const field in this.stripeTestError) {
      if (this.stripeTestError.hasOwnProperty(field)) {
        this.stripeTestError[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.paymentFormvalidationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.stripeTestError[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  getUser() {
    this.commonService.get(`getUser`).subscribe((data: any) => {
      if (data.status == 200) {
        this.currentPlan = data.result.currentPlan
        this.userId = data.result.id
        this.FullName = data.result.fullName
        // this.stripeTest.value.name = this.FullName
      }
    })
  }
  getTransparentPricing() {

    this.commonService.get(`getTransparentPricing`).subscribe((data: any) => {
      if (data.status == 200) {
        this.plandata = data.result
        // console.log("plandata.currentPlan.noteUsage", this.plandata.currentPlan.noteUsage)
      }
    })
  }
  getPlans() {
    this.commonService.get(`getSubscriptionPlan`).subscribe((data: any) => {
      // console.log(data)
      if (data.result.length > 0) {
        // console.log("data", data)
        this.plans = data.result
        setTimeout(() => {
          document.getElementById(this.currentPlan).classList.add("PayButton")
        }, 1000);
      } else {
        this.plans = []
      }
    })
  }
  onChoosePlan(id, price, duration) {
    console.log("plan id", id, price, duration)
    this.planId = id
    this.planPrice = price
    this.planDuration = duration
  }
  onPayment() {
    let body = {
      userId: this.userId,
      amount: this.planPrice,
    }
    console.log("payment data", body)
    this.commonService.post(`payment`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.data.length > 0) {
        console.log("paymen responce", data)
        this.onSubscription()
      } else {
        this.spinner.hide();
      }
    })
  }
  createToken(): void {
    this.spinner.show();
    const name = this.stripeTest.get('name').value;
    const email = this.stripeTest.get('name').value;

    this.stripeService
      .createToken(this.card.element, { name, })
      .subscribe((result) => {
        if (result.token) {

          // this.onpaymentStore(result)
          this.onpaymentDone(result)
          console.log("result.token.id", result);
        } else if (result.error) {
          // Error creating the token
          console.log("error", result.error.message);
          this.spinner.hide();

        }
      });
  }
  onpaymentDone(result) {
    let body = {
      stripeToken: result.token.id,
      status: "success",
      planPrice: this.planPrice,
    }
    console.log("payment data", body)
    this.commonService.post(`create-payment`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.status == 200) {
        console.log("paymen responce", data)
 this.onpaymentStore(result)
      } else {
        this.spinner.hide();
      }
    })
  }
  onSubscription() {

    let body = {
      "userId": this.userId,
      "subscriptionId": this.planId,
      "planDuration": this.planDuration
    }
    console.log("data,body", body)

    this.commonService.post(`subscribePlan`, body).subscribe((data: any) => {
      console.log("data,data0", data)
      if (data.status == 200) {
        console.log("data", data)
        this.spinner.hide();
        document.getElementById("onPay").click();
        Swal.fire('Hurray!!',
          'Your subscription begins now',
          'success');
      } else {
        this.spinner.hide();
        document.getElementById("onPay").click();
      }
    })
  }

  onpaymentStore(result) {
    let body = {
      userId: this.userId,
      token: result.token.id,
      subscriptionId: this.planId,
      status: "success",
      amount: this.planPrice,
    }
    console.log("payment data", body)
    this.commonService.post(`payment`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.status == 200) {
        console.log("paymen responce", data)
        this.onSubscription()
      } else {
        this.spinner.hide();
      }
    })
  }
  onCancel() {
    Swal.fire({
      title: "Are you sure?",
      text: "Once Cancel, you need to subscribe again!",
      showConfirmButton: true,
      showCancelButton: true ,
      confirmButtonText:'Yes!'
    })
    .then((willDelete) => {
        if(willDelete.value){
             this.planCancel()
        }else{
          // Swal.fire("Fail");
        }
      console.log(willDelete)
    });
  }
  planCancel(){
    let body={
      planStatus:1
    }
    this.commonService.post(`planCancel`, body).subscribe((data: any) => {
      // console.log(data)
      if (data.status == 200) {
        this.getUser()
        Swal.fire('subscription Cancel!',
        'You need to subscription again.',
        'success');
      } else {
        this.spinner.hide();
      }
    })
  }

}
