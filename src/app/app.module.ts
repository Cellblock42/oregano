import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { QRCodeModule } from 'angularx-qrcode';

import { IdentityModule } from './identity/identity.module';

import { AppComponent } from './app.component';

import { MetaCoinService, Web3Service, IRMAService, WebSocketService, OreganoService } from '../services/services';
import { AppRoutingModule } from './app-routing.module'

const SERVICES = [
  MetaCoinService,
  Web3Service,
  IRMAService,
  WebSocketService,
  OreganoService,
]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    QRCodeModule,
    AppRoutingModule,
    IdentityModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
