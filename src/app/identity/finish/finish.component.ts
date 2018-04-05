import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IRMAService, IRMASession } from '../../../services/irma.service';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css']
})
export class FinishComponent implements OnInit {

  private session: IRMASession;
  private proof: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public irma: IRMAService
  ) { }

  ngOnInit() {
    this.session = this.irma.getCurrentSession();

    if (!this.session) {
      this.router.navigate(['..', 'init'], { relativeTo: this.route });
    } else {
      this.irma.getSignatureProof(this.session).subscribe(proof => { this.proof = proof; console.log(proof) })
    }
  }
}
