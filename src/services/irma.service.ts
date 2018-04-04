import { Injectable } from '@angular/core';
// import * as IRMA from './irma';

const STATUS_CHECK_INTERVAL = 500;
const DEFAULT_TIMEOUT = 120 * 1000;

enum Action {
    Verifying = "Verifying",
    Issuing = "Issuing",
    Signing = "Signing",
};

enum UserAgent {
    Desktop = "Desktop",
    Android = "Android",
    iOS = "iOS",
};

enum State {
    Initialized = "Initialized",
    PopupReady = "PopupReady",
    SessionStarted = "SessionStarted",
    ClientConnected = "ClientConnected",
    Cancelled = "Cancelled",
    Timeout = "Timeout",
    Done = "Done",
};

@Injectable()
export class IRMAService {
    private state: State = State.Done;
  // var state = State.Done;

  // // Extra state, this flag is set when we timeout locally but the
  // // status socket is still active. After this flag is set, we assume
  // // that errors while polling (if the status socket dies) are due to
  // // a timeout.
  // var sessionTimedOut = false;

  // var ua;

  // var webServer = "";

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
  private 

  constructor(
  	) {
      console.log(this.state)
  	// Bootstrap the MetaCoin abstraction for Use
  }

}
