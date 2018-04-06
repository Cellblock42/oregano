import { Component, HostListener, NgZone } from '@angular/core';

import { Web3Service, MetaCoinService, IRMAService, OreganoService } from '../services/services'

import { IdentityModule } from './identity/identity.module';

import { canBeNumber } from '../util/validation';

declare var window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  // TODO add proper types these variables
  account: any;
  accounts: any;

  title = 'Oregano 🌿';

  balance: number;
  sendingAmount: number;
  recipientAddress: string;
  status: string;
  canBeNumber = canBeNumber;

  constructor(
    private _ngZone: NgZone,
    private web3Service: Web3Service,
    private metaCoinService: MetaCoinService,
    private irmaService: IRMAService,
    private oreganoService: OreganoService,
    ) {
    this.onReady();
  }

  onReady = () => {
    console.log('App ready')
    console.log(this.title)
    // Get the initial account balance so it can be displayed.
    this.web3Service.getAccounts().subscribe(accs => {
      this.accounts = accs;
      this.account = this.accounts[0];

      // This is run from window:load and ZoneJS is not aware of it we
      // need to use _ngZone.run() so that the UI updates on promise resolution
      this._ngZone.run(() =>
        this.refreshBalance()
      );
    }, err => alert(err))

    this.oreganoService.getNumProducers().subscribe(num => {
      console.log('numproducers')
      console.log(num)
    })

    this.oreganoService.getProducers().subscribe(p => console.log(p))
  };

  refreshBalance = () => {
    this.metaCoinService.getBalance(this.account)
      .subscribe(value => {
        this.balance = value
      }, e => {this.setStatus('Error getting balance; see log.')})
  };

  setStatus = message => {
    this.status = message;
  };

  sendCoin = () => {
    this.setStatus('Initiating transaction... (please wait)');

    this.metaCoinService.sendCoin(this.account, this.recipientAddress, this.sendingAmount)
      .subscribe(() => {
        this.setStatus('Transaction complete!');
        this.refreshBalance();
      }, e => this.setStatus('Error sending coin; see log.'))
  };
}
