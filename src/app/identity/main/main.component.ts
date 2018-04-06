import { Component, OnInit } from '@angular/core';
import { IRMASession, IRMAPollResult } from '../../../services/irma.service';

enum State {
  initialized,
  polling,
  finished,
}

@Component({
  selector: 'app-identity-component',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class IdentityComponent implements OnInit {
  state = State.initialized
  currentSession: IRMASession
  proof: any

  private requiredAttributes = ['irma-demo.MijnOverheid.ageLower.over18']

  constructor() { }

  ngOnInit() {
    console.log(this.state)
    console.log('initialized IdentityComponent')
  }

  onInit(session: IRMASession) {
    console.log('initialized session')
    console.log(session);
    this.currentSession = session
    this.state = State.polling
  }

  onCancel() {
    console.log('cancelled!')
    this.currentSession = null
    this.state = State.finished
  }

  onPoll(result: IRMAPollResult) {
    if (result === IRMAPollResult.Done) {
      this.state = State.finished
    }
  }

  onFinish(proof: any) {
    console.log('got proof')
    console.log(proof)

    // TODO
  }

  isInit() {
    return this.state === State.initialized
  }

  isPoll() {
    return this.state === State.polling
  }

  isFinished() {
    return this.state === State.finished
  }

}
