export type SipRegistrationStatus = 'REGISTERED' | 'REGISTERING' | 'UNREGISTERED' | 'FAILED';

export type SipTransport = 'UDP' | 'TCP' | 'TLS' | 'WSS';

export type SipAudioCodec = 'Opus (HD 48kHz)' | 'G.711a (PCMA 64k)' | 'G.711u (PCMU 64k)' | 'G.722 (Wideband 64k)' | 'G.729 (8kbps)';

export interface SipAccountConfig {
  displayName: string;
  username: string; // e.g. "1001", "alice", "ing-noc"
  authId: string;
  password: string;
  domain: string; // e.g. "sip.linphone.org" or "192.168.1.200" or "pbx.tendry-telecom.mg"
  proxyServer: string;
  port: number;
  transport: SipTransport;
  preferredCodec: SipAudioCodec;
  enableIceStun: boolean;
  stunServer: string;
  registerExpiresSec: number;
  autoAnswer: boolean;
}

export type CallDirection = 'OUTGOING' | 'INCOMING';

export type CallState = 
  | 'IDLE'
  | 'DIALING'
  | 'RINGING_OUTGOING' // SIP 180 Ringing
  | 'RINGING_INCOMING' // SIP INVITE received
  | 'CONNECTED'        // SIP 200 OK + ACK
  | 'ON_HOLD'          // SIP sendonly / recvonly
  | 'TRANSFERRED'
  | 'ENDED';

export interface ActiveCallSession {
  id: string;
  direction: CallDirection;
  remoteUri: string; // e.g. "sip:1002@pbx.local"
  remoteDisplayName: string;
  startTime?: Date;
  connectedTime?: Date;
  durationSeconds: number;
  state: CallState;
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  codec: SipAudioCodec;
  audioLevel: number; // 0 to 100 for visualizer
  // Real-time QoS Metrics
  rttMs: number;
  jitterMs: number;
  packetLossPercent: number;
  bitrateKbps: number;
  mosScore: number;
}

export interface CallLogItem {
  id: string;
  direction: CallDirection;
  number: string;
  name: string;
  timestamp: Date;
  durationSeconds: number;
  status: 'ANSWERED' | 'MISSED' | 'REJECTED' | 'BUSY';
  codec: string;
}

export interface SipContact {
  id: string;
  name: string;
  extension: string;
  department: string;
  status: 'ONLINE' | 'AWAY' | 'BUSY' | 'OFFLINE';
  avatarColor: string;
  favorite?: boolean;
}

export interface SipPacketLog {
  id: string;
  timestamp: string;
  direction: 'TX' | 'RX';
  methodOrCode: string; // e.g. "INVITE", "200 OK", "REGISTER", "BYE", "100 Trying", "180 Ringing"
  from: string;
  to: string;
  rawPayload: string;
}
