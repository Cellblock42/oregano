import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

function base64url(src: string): string {
  let res = btoa(src);

  // Remove padding characters
  res = res.replace(/=+$/, '');

  // Replace non-url characters
  res = res.replace(/\+/g, '-');
  res = res.replace(/\//g, '_');

  return res;
}

function debase64url(src: string): string {
  let output = src.replace(/-/g, '+').replace(/_/g, '/');

  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Illegal base64url string!');
  }

  return atob(output);
}

function jwtDecode(token: string) {
  return debase64url(token.split('.')[1]);
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

export enum IRMAPollResult {
  Initialized = 'INITIALIZED',
  Done = 'DONE',
  Connected = 'CONNECTED',
}

interface IIRMASession {
  u: string;
  v: string;
  vmax: string;
  irmaqr: string;
}

export class IRMASession implements IIRMASession  {
  constructor(public u: string, public v: string, public vmax: string, public irmaqr: string) {
  }
}

@Injectable()
export class IRMAService {
  private state: State = State.Done;

  private sessionPackage: any = {};
  private sessionCounter = 0;
  private sessionTimedOut = false;

  private currentSession: IRMASession;

  public isInitialized = false;

  constructor(private http: HttpClient) {}

  startSignSession(apiServer: string, signatureRequest: any): Observable<IRMASession> {
    const actionUrl = this.actionPath(apiServer, Action.Signing);
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
    };

    const jwt = this.createUnsignedSignatureJWT(signatureRequest);

    return this.http
      .post<IIRMASession>(actionUrl, jwt, httpOptions)
      .map(session => {
        this.currentSession = new IRMASession(actionUrl + session.u,
                                              session.v,
                                              session.vmax,
                                              session.irmaqr);
        this.isInitialized = true;
        return this.currentSession;
      });
  }

  fetchSessionStatus(session: IRMASession): Observable<IRMAPollResult> {
    return this.http.get<IRMAPollResult>(session.u + '/status?' + Math.random())
  }

  pollSessionStatus(session: IRMASession): Observable<IRMAPollResult> {
    return Observable.interval(500).flatMap(_ =>  this.fetchSessionStatus(session))
  }

  getCurrentSession(): IRMASession {
    return this.currentSession;
  }

  getQRImageURL(session: IRMASession): string {
    return 'https://api.qrserver.com/v1/create-qr-code/?size=230x230&data=' + JSON.stringify(session);
  }

  getSignatureProof(session: IRMASession): Observable<any> {
    return this.http.get(session.u + '/getsignature', { responseType: 'text' })
              .map(token => {
                const decoded = jwtDecode(token);
                const stringified = decoded.replace(/:(\d+)([,}])/g, ':"$1"$2');

                return JSON.parse(stringified)['signature'];
              })
  }

  private actionPath(apiServer: string, action: Action): string {
    switch (action) {
      case Action.Signing:
        return apiServer + 'signature/';
    }
    console.error('Can\'t handle this session type yet')
    throw new Error('Not implemented');
  }

  // private clearState() {
  //   if (
  //     this.state !== State.Cancelled &&
  //     this.state !== State.Timeout &&
  //     this.state !== State.Done
  //   ) {
  //     console.log('Found previously active session, cancelling that one first');
  //     // cancelSession(true);
  //   }
  //   this.state = State.Initialized;
  //   this.sessionCounter++;
  //   this.sessionPackage = {};
  //   this.sessionTimedOut = false;
  // }

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
