import { Component, OnInit } from '@angular/core';
import { IRMAService, IRMASession } from '../../../services/irma.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-identity-init',
  templateUrl: './init.component.html',
  styleUrls: ['./init.component.css']
})
export class InitComponent implements OnInit {

  public packageCode: string;

  private currentSession: IRMASession;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public irma: IRMAService
  ) { }

  ngOnInit() {
  }

  submitForm() {
     const signRequest = {
       data: 'foobar',
       validity: 60,
       timeout: 60,
       request: {
         messageType: 'STRING',
         message: this.packageCode,
         content: [
           {
             label: 'over18',
             attributes: ['irma-demo.MijnOverheid.ageLower.over18']
           },
           {
             label: 'city',
             attributes: ['irma-demo.MijnOverheid.address.city']
           }
         ]
       }
     };

     const apiServer = 'https://demo.irmacard.org/tomcat/irma_api_server/api/v2/';

     this.irma.startSignSession(apiServer, signRequest)
         .subscribe(session => {
          //  this.pollSessionResult(session).subscribe(res => {
          //   console.log(res)
          //  })
          console.log(session)
          this.router.navigate(['..', 'poll'], { relativeTo: this.route });
         })
    // this.magic.submitForm(this.inputValue)
    // .subscribe((resultingJson)=>{
    //   // success, navigate
    //   this.router.navigate(['..','step2'],{relativeTo:this.route});
    // })
  }

}
