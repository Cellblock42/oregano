import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IdentityComponent } from './main/main.component';
import { InitComponent } from './init/init.component';
import { IRMAService } from '../../services/irma.service';
import { PollComponent } from './poll/poll.component';
import { FinishComponent } from './finish/finish.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    IdentityComponent,
    InitComponent,
    PollComponent,
    FinishComponent,
  ],
  exports: [
    IdentityComponent
  ],
  providers: [
    IRMAService
  ]
})
export class IdentityModule { }
