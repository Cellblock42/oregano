import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { IRMAService, IRMASession } from '../../../services/irma.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-identity-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  public packageCode: string;

  // private currentSession: IRMASession;

  @Input() attributes: string[];
  @Output() init = new EventEmitter<IRMASession>();

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public irma: IRMAService
  ) { }

  ngOnInit() {
    console.log('initialized InitComponent')
  }

  submitForm() {
     const signRequest = {
       data: 'foobar',
       validity: 60,
       timeout: 60,
       request: {
         messageType: 'STRING',
         message: this.packageCode,
         content: []
       }
     };

     const attributes = this.attributes || [
      'irma-demo.MijnOverheid.ageLower.over18',
      'irma-demo.MijnOverheid.address.city'
     ]

     signRequest.request.content = attributes.map(attr => {
       const parts = attr.split('.')
       const label = parts[parts.length - 1]
       return {
         label: label,
         attributes: [attr]
       }
      })

     const apiServer = 'https://demo.irmacard.org/tomcat/irma_api_server/api/v2/'

     const subscription = this.irma.startSignSession(apiServer, signRequest)
                            .subscribe(session => {
                              subscription.unsubscribe()
                              this.init.emit(session)
                              this.init.complete()
                            })
  }
}
