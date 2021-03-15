import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxFreshChatService } from 'ngx-freshchat';

@Component({
  selector: 'app-pages',
  // template: `
  // <app-header *ngIf="!(router === '/login'|| router === '/reset-password'|| router === '/create-agent-profile'|| router ==='/register')"></app-header>
  // <router-outlet></router-outlet>
  // <app-footer *ngIf="!(router === '/login'|| router === '/reset-password'|| router === '/create-agent-profile'|| router ==='/register')"></app-footer>
  // `,
  template: `
  <router-outlet></router-outlet>
  `,
  styles: [
  ]
})
export class PagesComponent implements OnInit {

  router: string;

  constructor(private _router: Router,private chat: NgxFreshChatService) {
    this.router = this._router.url;
  }

  ngOnInit(): void {
      if(!localStorage.getItem('token'))
      this._router.navigate(['login'])
       this.chat.init({
      token: "d402db20-ffb2-4202-9809-05cea8f405d0",
      host: "https://wchat.in.freshchat.com"
    })
    .subscribe(
        () => console.log('FreshChat is ready!')
    );
  }

}
