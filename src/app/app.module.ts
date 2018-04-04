import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

import {MetaCoinService, Web3Service, IRMAService, WebSocketService} from '../services/services'

const SERVICES = [
  MetaCoinService,
  Web3Service,
  IRMAService,
  WebSocketService,
]

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [SERVICES],
  bootstrap: [AppComponent]
})
export class AppModule { }
