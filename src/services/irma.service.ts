import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebSocketService } from './websocket.service';
// import * as IRMA from './irma';

function base64url(src) {
  let res = btoa(src);

  // Remove padding characters
  res = res.replace(/=+$/, '');

  // Replace non-url characters
  res = res.replace(/\+/g, '-');
  res = res.replace(/\//g, '_');

  return res;
}

const STATUS_CHECK_INTERVAL = 500;
const DEFAULT_TIMEOUT = 120 * 1000;

enum Action {
  Verifying = 'Verifying',
  Issuing = 'Issuing',
  Signing = 'Signing'
}

enum UserAgent {
  Desktop = 'Desktop',
  Android = 'Android',
  iOS = 'iOS'
}

enum State {
  Initialized = 'Initialized',
  PopupReady = 'PopupReady',
  SessionStarted = 'SessionStarted',
  ClientConnected = 'ClientConnected',
  Cancelled = 'Cancelled',
  Timeout = 'Timeout',
  Done = 'Done'
}

@Injectable()
export class IRMAService {
  private state: State = State.Done;

  private sessionPackage: any = {};
  private sessionCounter = 0;
  private sessionTimedOut = false;
  // var state = State.Done;

  // // Extra state, this flag is set when we timeout locally but the
  // // status socket is still active. After this flag is set, we assume
  // // that errors while polling (if the status socket dies) are due to
  // // a timeout.
  // var sessionTimedOut = false;

  // var ua;

  // var webServer = '';

  // var sessionPackage;
  // var sessionCounter = 0;

  // var successCallback;
  // var cancelCallback;
  // var failureCallback;

  // var sessionId;
  // var apiServer;
  // var action;
  // var actionPath;

  // var statusWebsocket;

  // var fallbackTimer;
  // var timeoutTimer;
  constructor(private http: HttpClient, private websocket: WebSocketService) {
    console.log(this.state);
    console.log(this.http);

    const sigrequest = {
      data: 'foobar',
      validity: 60,
      timeout: 60,
      request: {
        messageType: 'STRING',
        message: 'Just testing',
        content: [
          {
            label: 'over12',
            attributes: ['irma-demo.MijnOverheid.ageLower.over12']
          },
          {
            label: 'name',
            attributes: ['irma-demo.MijnOverheid.fullName.firstname']
          }
        ]
      }
    };

    const apiServer = 'https://demo.irmacard.org/tomcat/irma_api_server/api/v2/';

    this.sign(apiServer, sigrequest);
  }

  sign(apiServer: string, signatureRequest: any) {
    const actionUrl = this.actionPath(apiServer, Action.Signing);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    };

    const jwt = this.createUnsignedSignatureJWT(signatureRequest);

    this.http
      .post(actionUrl, jwt, httpOptions)
      .subscribe(data => console.log(data), error => console.error(error));
  }

  private actionPath(apiServer: string, action: Action): string {
    switch (action) {
      case Action.Signing:
        return apiServer + 'signature/';
    }
    throw new Error('Not implemented');
  }

  private clearState() {
    if (
      this.state !== State.Cancelled &&
      this.state !== State.Timeout &&
      this.state !== State.Done
    ) {
      console.log('Found previously active session, cancelling that one first');
      // cancelSession(true);
    }
    this.state = State.Initialized;
    this.sessionCounter++;
    this.sessionPackage = {};
    this.sessionTimedOut = false;
  }

  private createUnsignedSignatureJWT(absrequest) {
    return this.createJWT(absrequest, 'absrequest', 'signature_request', 'testsigclient');
  }

  private createJWT(request, requesttype, subject, issuer) {
    console.log('Creating unsigned JWT!!!');
    const header = {
        alg: 'none',
        typ: 'JWT',
    };

    const payload = {
        sub: subject,
        iss: issuer,
        iat: Math.floor(Date.now() / 1000),
    };

    payload[requesttype] = request;

    return base64url(JSON.stringify(header)) + '.' +
           base64url(JSON.stringify(payload)) + '.';
  }

}
