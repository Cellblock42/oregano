import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IRMAService, IRMASession, IRMAPollResult } from '../../../services/irma.service';

@Component({
  selector: 'app-identity-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  private qrImageURL: string;
  private pollResult: IRMAPollResult

  @Input() session: IRMASession;
  @Output() poll = new EventEmitter<IRMAPollResult>();

  constructor(
    private irma: IRMAService
  ) { }

  ngOnInit() {
    this.qrImageURL = this.irma.getQRImageURL(this.session);
    this.startPolling();
  }

  private startPolling() {
    const subscription = this.irma.pollSessionStatus(this.session)
      .subscribe(result => {
        this.pollResult = result;

        this.poll.emit(this.pollResult)

        if (this.pollResult === IRMAPollResult.Done) {
          subscription.unsubscribe()
          this.poll.complete()
        }
      });
  }
}
