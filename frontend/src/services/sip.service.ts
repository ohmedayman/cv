import { UserAgent, Registerer, Inviter, SessionState, UserAgentOptions } from 'sip.js';

export interface CallSession {
  id: string;
  remoteNumber: string;
  remoteName: string;
  direction: 'incoming' | 'outgoing';
  state: 'ringing' | 'answered' | 'held' | 'ended';
  startTime?: Date;
  session: any;
}

export interface SIPConfig {
  uri: string;        // e.g. "sip:100@192.168.1.100"
  wsServer: string;   // e.g. "wss://192.168.1.100:8089/ws"
  authorizationUsername: string;
  authorizationPassword: string;
  displayName: string;
}

export class SIPService {
  private userAgent: UserAgent | null = null;
  private registerer: Registerer | null = null;
  private currentSession: CallSession | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private ringtoneElement: HTMLAudioElement | null = null;

  // Event callbacks
  public onIncomingCall: ((call: CallSession) => void) | null = null;
  public onCallStateChanged: ((state: string) => void) | null = null;
  public onRegistered: ((registered: boolean) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  async initialize(config: SIPConfig): Promise<void> {
    const userAgentOptions: UserAgentOptions = {
      uri: UserAgent.makeURI(config.uri),
      authorizationUsername: config.authorizationUsername,
      authorizationPassword: config.authorizationPassword,
      transportOptions: {
        server: config.wsServer,
        connectionTimeout: 10,
      },
      sessionDescriptionHandlerFactoryOptions: {
        peerConnectionConfiguration: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
          ],
        },
      },
      delegate: {
        onInvite: (invitation: any) => this.handleIncomingCall(invitation),
      },
      logLevel: 'error',
    };

    this.userAgent = new UserAgent(userAgentOptions);

    // Handle registration status
    this.userAgent.transport.onConnect = () => {
      console.log('SIP WebSocket connected');
    };

    this.userAgent.transport.onDisconnect = () => {
      console.log('SIP WebSocket disconnected');
      this.onRegistered?.(false);
    };

    // Create audio elements
    this.audioElement = document.createElement('audio');
    this.audioElement.autoplay = true;
    this.audioElement.id = 'sip-remote-audio';

    this.ringtoneElement = document.createElement('audio');
    this.ringtoneElement.loop = true;
    this.ringtoneElement.id = 'sip-ringtone';

    // Start user agent
    await this.userAgent.start();

    // Register with SIP server
    this.registerer = new Registerer(this.userAgent);
    await this.registerer.register();

    this.registerer.stateChange.addListener((newState) => {
      console.log('Registration state:', newState);
      this.onRegistered?.(newState === 'Registered');
    });
  }

  private async handleIncomingCall(invitation: any): Promise<void> {
    const remoteIdentity = invitation.remoteIdentity;
    const callSession: CallSession = {
      id: invitation.id,
      remoteNumber: remoteIdentity.uri.user || 'Unknown',
      remoteName: remoteIdentity.displayName || 'Unknown Caller',
      direction: 'incoming',
      state: 'ringing',
      session: invitation,
    };

    this.currentSession = callSession;
    this.playRingtone();
    this.onIncomingCall?.(callSession);
  }

  async acceptCall(): Promise<void> {
    if (!this.currentSession || !this.userAgent) return;

    this.stopRingtone();

    const session = this.currentSession.session;
    const acceptOptions = {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    };

    await session.accept(acceptOptions);
    this.currentSession.state = 'answered';
    this.currentSession.startTime = new Date();

    this.setupMediaHandler(session);
    this.onCallStateChanged?.('answered');
  }

  async declineCall(): Promise<void> {
    if (!this.currentSession) return;

    this.stopRingtone();
    await this.currentSession.session.reject();
    this.currentSession.state = 'ended';
    this.onCallStateChanged?.('ended');
    this.currentSession = null;
  }

  async makeCall(number: string): Promise<void> {
    if (!this.userAgent) return;

    const target = UserAgent.makeURI(`sip:${number}@${this.getDomain()}`);
    if (!target) {
      this.onError?.('Invalid phone number');
      return;
    }

    const inviter = new Inviter(this.userAgent, target, {
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false,
        },
      },
    });

    const callSession: CallSession = {
      id: inviter.id,
      remoteNumber: number,
      remoteName: number,
      direction: 'outgoing',
      state: 'ringing',
      session: inviter,
    };

    this.currentSession = callSession;
    this.onCallStateChanged?.('ringing');

    await inviter.invite();

    inviter.stateChange.addListener((newState: SessionState) => {
      switch (newState) {
        case SessionState.Established:
          this.currentSession!.state = 'answered';
          this.currentSession!.startTime = new Date();
          this.setupMediaHandler(inviter);
          this.onCallStateChanged?.('answered');
          break;
        case SessionState.Terminated:
          this.currentSession!.state = 'ended';
          this.onCallStateChanged?.('ended');
          this.currentSession = null;
          break;
      }
    });
  }

  async hangup(): Promise<void> {
    if (!this.currentSession) return;

    const session = this.currentSession.session;
    if (session.state === SessionState.Established) {
      await session.bye();
    } else if (session.state === SessionState.Initial || session.state === SessionState.Progressing) {
      await session.cancel();
    }

    this.currentSession.state = 'ended';
    this.onCallStateChanged?.('ended');
    this.currentSession = null;
  }

  async holdCall(): Promise<void> {
    if (!this.currentSession || this.currentSession.state !== 'answered') return;

    const session = this.currentSession.session;
    await session.hold();
    this.currentSession.state = 'held';
    this.onCallStateChanged?.('held');
  }

  async unholdCall(): Promise<void> {
    if (!this.currentSession || this.currentSession.state !== 'held') return;

    const session = this.currentSession.session;
    await session.unhold();
    this.currentSession.state = 'answered';
    this.onCallStateChanged?.('answered');
  }

  async sendDTMF(tone: string): Promise<void> {
    if (!this.currentSession || this.currentSession.state !== 'answered') return;

    const session = this.currentSession.session;
    session.sessionDescriptionHandler.sendDtmf(tone);
  }

  private setupMediaHandler(session: any): void {
    session.sessionDescriptionHandler.mediaStreamFactory
      .then((stream: MediaStream) => {
        if (this.audioElement) {
          this.audioElement.srcObject = stream;
        }
      })
      .catch((error: any) => {
        console.error('Failed to get media stream:', error);
      });
  }

  private playRingtone(): void {
    if (this.ringtoneElement) {
      this.ringtoneElement.src = '/sounds/ringtone.mp3';
      this.ringtoneElement.play().catch(() => {});
    }
  }

  private stopRingtone(): void {
    if (this.ringtoneElement) {
      this.ringtoneElement.pause();
      this.ringtoneElement.currentTime = 0;
    }
  }

  private getDomain(): string {
    if (this.userAgent) {
      const uri = this.userAgent.options.uri;
      return uri?.host || '';
    }
    return '';
  }

  getCurrentSession(): CallSession | null {
    return this.currentSession;
  }

  isRegistered(): boolean {
    return this.registerer?.state === 'Registered';
  }

  async destroy(): Promise<void> {
    if (this.registerer) {
      await this.registerer.unregister();
    }
    if (this.userAgent) {
      await this.userAgent.stop();
    }
  }
}

// Singleton instance
export const sipService = new SIPService();
