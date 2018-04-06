import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { IRMAService, IRMASession } from '../../../services/irma.service'

@Component({
  selector: 'app-identity-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.css'],
})
export class FinishComponent implements OnInit {

  @Input() session: IRMASession
  @Output() finish = new EventEmitter<any>()

  private proof: string

  constructor(
    public irma: IRMAService
  ) { }

  ngOnInit() {
    const subscription = this.irma.getSignatureProof(this.session)
      .subscribe(proof => {
        this.proof = proof
        console.log(proof)
        this.finish.emit(proof)
        this.finish.complete()
      })
  }
}
