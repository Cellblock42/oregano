import { Component, OnInit } from '@angular/core';

import { IRMAService, IRMASession, IRMAPollResult } from '../../../services/irma.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-identity-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {

  private session: IRMASession;
  private qrImageURL: string;
  private pollResult: IRMAPollResult

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public irma: IRMAService
  ) { }

  ngOnInit() {
    this.session = this.irma.getCurrentSession();

    if (!this.session) {
      this.router.navigate(['..', 'init'], { relativeTo: this.route });
    }

    this.qrImageURL = this.irma.getQRImageURL(this.session);
    this.poll();
  }

  private poll() {
    const subscription = this.irma.pollSessionStatus(this.session)
      .subscribe(result => {
        this.pollResult = result;

        if (this.pollResult === IRMAPollResult.Done) {
          subscription.unsubscribe();
          this.router.navigate(['..', 'finish'], { relativeTo: this.route });
        }
      });
  }

}
