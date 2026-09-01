import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneIncoming, 
  PhoneOff, 
  Settings, 
  Users, 
  Clock, 
  Terminal, 
  Grid, 
  ShieldCheck, 
  Radio, 
  Wifi, 
  Volume2, 
  Download,
  Activity,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { 
  SipAccountConfig, 
  SipRegistrationStatus, 
  ActiveCallSession, 
  CallLogItem, 
  SipContact, 
  SipPacketLog,
  CallState
} from '../types/sip';
import { 
  playDtmfTone, 
  startRingbackTone, 
  stopRingbackTone, 
  startIncomingRingtone, 
  stopIncomingRingtone, 
  startHoldMusic, 
  stopHoldMusic,
  startMicrophoneEchoTest,
  stopMicrophoneEchoTest,
  speakIvrPrompt,
  stopSpeech
} from '../lib/sipAudio';
import { SipDialpad } from '../components/sip/SipDialpad';
import { SipActiveCall } from '../components/sip/SipActiveCall';
import { SipAccountSettingsModal } from '../components/sip/SipAccountSettingsModal';
import { SipCallHistory } from '../components/sip/SipCallHistory';
import { SipContacts } from '../components/sip/SipContacts';
import { SipConsole } from '../components/sip/SipConsole';

// Initial Preset Contacts
const INITIAL_CONTACTS: SipContact[] = [
  { id: 'c1', name: 'Echo Test Audio PBX', extension: '*43', department: 'Test Audio Loopback', status: 'ONLINE', avatarColor: 'from-purple-500 to-indigo-600', favorite: true },
  { id: 'c2', name: 'Serveur Vocal IVR Telecom', extension: '9999', department: 'Serveur Automatique', status: 'ONLINE', avatarColor: 'from-cyan-500 to-blue-600', favorite: true },
  { id: 'c3', name: 'Supervision NOC 24/7', extension: '1000', department: 'NOC / Réseau', status: 'ONLINE', avatarColor: 'from-emerald-500 to-teal-600', favorite: true },
  { id: 'c4', name: 'Ingénieur Radio RF (Pylônes)', extension: '1001', department: 'Ingénierie Radio / RF', status: 'ONLINE', avatarColor: 'from-amber-500 to-orange-600' },
  { id: 'c5', name: 'Astreinte Fibre Optique', extension: '1002', department: 'Fibre & Transmission', status: 'ONLINE', avatarColor: 'from-rose-500 to-pink-600' },
  { id: 'c6', name: 'Passerelle GSM / VoLTE Gateway', extension: '1003', department: 'Core Network IMS', status: 'ONLINE', avatarColor: 'from-indigo-500 to-purple-600' }
];

export const VoipBandwidthView: React.FC = () => {
  // Navigation tab in the softphone
  const [activeTab, setActiveTab] = useState<'DIALPAD' | 'CONTACTS' | 'HISTORY' | 'SIP_CONSOLE'>('DIALPAD');

  // SIP Account State
  const [sipConfig, setSipConfig] = useState<SipAccountConfig>({
    displayName: 'Ingénieur Télécom NOC',
    username: '1001',
    authId: '1001',
    password: 'password123',
    domain: 'ims.orange.mg',
    proxyServer: 'ims.orange.mg',
    port: 5060,
    transport: 'TLS',
    preferredCodec: 'Opus (HD 48kHz)',
    enableIceStun: true,
    stunServer: 'stun.l.google.com:19302',
    registerExpiresSec: 3600,
    autoAnswer: false
  });

  const [regStatus, setRegStatus] = useState<SipRegistrationStatus>('REGISTERED');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState('');

  // Call States & Sessions
  const [activeSession, setActiveSession] = useState<ActiveCallSession | null>(null);
  const [incomingCall, setIncomingCall] = useState<{ callerNumber: string; callerName: string } | null>(null);
  const [callHistory, setCallHistory] = useState<CallLogItem[]>([
    {
      id: 'h1',
      direction: 'INCOMING',
      name: 'Supervision NOC 24/7',
      number: '1000',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      durationSeconds: 142,
      status: 'ANSWERED',
      codec: 'Opus (HD 48kHz)'
    },
    {
      id: 'h2',
      direction: 'OUTGOING',
      name: 'Echo Test Audio PBX',
      number: '*43',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      durationSeconds: 38,
      status: 'ANSWERED',
      codec: 'Opus (HD 48kHz)'
    }
  ]);
  const [contacts, setContacts] = useState<SipContact[]>(INITIAL_CONTACTS);
  const [sipLogs, setSipLogs] = useState<SipPacketLog[]>([]);

  const callTimerRef = useRef<any>(null);

  // Helper to append SIP message to console
  const logSipPacket = (direction: 'TX' | 'RX', methodOrCode: string, from: string, to: string, payload: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 } as any);
    const newPacket: SipPacketLog = {
      id: `sip-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      direction,
      methodOrCode,
      from,
      to,
      rawPayload: payload
    };
    setSipLogs(prev => [newPacket, ...prev]);
  };

  // Initial SIP REGISTER log on mount
  useEffect(() => {
    const callId = `reg-${Math.random().toString(36).substr(2, 9)}@${sipConfig.domain}`;
    const registerPayload = `REGISTER sip:${sipConfig.domain} SIP/2.0\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port};branch=z9hG4bK-${Date.now()}\r\nMax-Forwards: 70\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>;tag=${Date.now()}\r\nTo: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nCall-ID: ${callId}\r\nCSeq: 1 REGISTER\r\nContact: <sip:${sipConfig.username}@192.168.1.55:${sipConfig.port};transport=${sipConfig.transport.toLowerCase()}>\r\nExpires: ${sipConfig.registerExpiresSec}\r\nUser-Agent: Linphone-Web/5.2.0 (Tendry-SIP-Engine)\r\nContent-Length: 0`;
    
    logSipPacket('TX', 'REGISTER', `sip:${sipConfig.username}@${sipConfig.domain}`, `sip:${sipConfig.domain}`, registerPayload);

    const okTimer = setTimeout(() => {
      const okPayload = `SIP/2.0 200 OK\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port};branch=z9hG4bK-${Date.now()}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>;tag=${Date.now()}\r\nTo: <sip:${sipConfig.username}@${sipConfig.domain}>;tag=srv-${Date.now()}\r\nCall-ID: ${callId}\r\nCSeq: 1 REGISTER\r\nContact: <sip:${sipConfig.username}@192.168.1.55:${sipConfig.port}>;expires=${sipConfig.registerExpiresSec}\r\nContent-Length: 0`;
      logSipPacket('RX', '200 OK', `sip:${sipConfig.domain}`, `sip:${sipConfig.username}@${sipConfig.domain}`, okPayload);
    }, 400);

    return () => clearTimeout(okTimer);
  }, [sipConfig.domain, sipConfig.username]);

  // In-Call Timer and dynamic Audio Visualizer simulation
  useEffect(() => {
    if (activeSession && (activeSession.state === 'CONNECTED' || activeSession.state === 'ON_HOLD')) {
      callTimerRef.current = setInterval(() => {
        setActiveSession(prev => {
          if (!prev) return null;
          const newDuration = prev.durationSeconds + 1;
          const randomAudio = prev.isOnHold || prev.isMuted ? 0 : Math.floor(Math.random() * 55) + 30;
          return {
            ...prev,
            durationSeconds: newDuration,
            audioLevel: randomAudio,
            jitterMs: Math.max(1, +(prev.jitterMs + (Math.random() * 0.8 - 0.4)).toFixed(1)),
            rttMs: Math.max(12, +(prev.rttMs + (Math.random() * 2 - 1)).toFixed(0)),
            mosScore: +(4.35 + (Math.random() * 0.1 - 0.05)).toFixed(2)
          };
        });
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [activeSession?.state]);

  // Clean up all audio nodes on unmount
  useEffect(() => {
    return () => {
      stopRingbackTone();
      stopIncomingRingtone();
      stopHoldMusic();
      stopMicrophoneEchoTest();
      stopSpeech();
    };
  }, []);

  // START OUTGOING CALL
  const handleStartCall = (targetNum?: string) => {
    const destination = (targetNum || dialNumber).trim();
    if (!destination) return;

    const matchedContact = contacts.find(c => c.extension === destination || c.name.toLowerCase() === destination.toLowerCase());
    const displayName = matchedContact ? matchedContact.name : `Poste ${destination}`;
    const remoteUri = destination.includes('@') ? destination : `sip:${destination}@${sipConfig.domain}`;

    const newSession: ActiveCallSession = {
      id: `call-${Date.now()}`,
      direction: 'OUTGOING',
      remoteUri,
      remoteDisplayName: displayName,
      startTime: new Date(),
      durationSeconds: 0,
      state: 'RINGING_OUTGOING',
      isMuted: false,
      isOnHold: false,
      isRecording: false,
      codec: sipConfig.preferredCodec,
      audioLevel: 10,
      rttMs: 24,
      jitterMs: 2.1,
      packetLossPercent: 0.0,
      bitrateKbps: sipConfig.preferredCodec.includes('Opus') ? 48 : 64,
      mosScore: 4.38
    };

    setActiveSession(newSession);

    // SIP INVITE packet
    const callId = `invite-${Math.random().toString(36).substr(2, 9)}@${sipConfig.domain}`;
    const invitePayload = `INVITE ${remoteUri} SIP/2.0\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port};branch=z9hG4bK-${Date.now()}\r\nMax-Forwards: 70\r\nFrom: "${sipConfig.displayName}" <sip:${sipConfig.username}@${sipConfig.domain}>;tag=${Date.now()}\r\nTo: <${remoteUri}>\r\nCall-ID: ${callId}\r\nCSeq: 100 INVITE\r\nContact: <sip:${sipConfig.username}@192.168.1.55:${sipConfig.port}>\r\nContent-Type: application/sdp\r\n\r\nv=0\r\no=${sipConfig.username} 123456 123456 IN IP4 192.168.1.55\r\ns=Linphone Session\r\nc=IN IP4 192.168.1.55\r\nt=0 0\r\nm=audio 7078 RTP/AVP 111 0 8\r\na=rtpmap:111 opus/48000/2\r\na=rtpmap:0 PCMU/8000\r\na=rtpmap:8 PCMA/8000\r\na=sendrecv`;
    logSipPacket('TX', 'INVITE', `sip:${sipConfig.username}@${sipConfig.domain}`, remoteUri, invitePayload);

    // Play Ringback Tone
    startRingbackTone();

    // 100 Trying & 180 Ringing simulation
    setTimeout(() => {
      const tryingPayload = `SIP/2.0 100 Trying\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${remoteUri}>\r\nCall-ID: ${callId}\r\nCSeq: 100 INVITE`;
      logSipPacket('RX', '100 Trying', remoteUri, `sip:${sipConfig.username}@${sipConfig.domain}`, tryingPayload);
    }, 400);

    setTimeout(() => {
      const ringingPayload = `SIP/2.0 180 Ringing\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${remoteUri}>;tag=remote-${Date.now()}\r\nCall-ID: ${callId}\r\nCSeq: 100 INVITE`;
      logSipPacket('RX', '180 Ringing', remoteUri, `sip:${sipConfig.username}@${sipConfig.domain}`, ringingPayload);
    }, 1100);

    // Remote party answers after 2.5s
    setTimeout(() => {
      stopRingbackTone();
      const okPayload = `SIP/2.0 200 OK\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${remoteUri}>;tag=remote-${Date.now()}\r\nCall-ID: ${callId}\r\nCSeq: 100 INVITE\r\nContent-Type: application/sdp\r\n\r\nv=0\r\no=asterisk 654321 654321 IN IP4 10.244.1.1\r\ns=Asterisk PBX\r\nc=IN IP4 10.244.1.1\r\nt=0 0\r\nm=audio 10024 RTP/AVP 111\r\na=rtpmap:111 opus/48000/2\r\na=sendrecv`;
      logSipPacket('RX', '200 OK (SDP)', remoteUri, `sip:${sipConfig.username}@${sipConfig.domain}`, okPayload);

      // Send ACK
      const ackPayload = `ACK ${remoteUri} SIP/2.0\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${remoteUri}>\r\nCall-ID: ${callId}\r\nCSeq: 100 ACK`;
      logSipPacket('TX', 'ACK', `sip:${sipConfig.username}@${sipConfig.domain}`, remoteUri, ackPayload);

      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          state: 'CONNECTED',
          connectedTime: new Date()
        };
      });

      // Special handling for Echo Test (*43) or IVR (9999) or NOC (1000)
      if (destination === '*43') {
        startMicrophoneEchoTest().then(micSuccess => {
          if (!micSuccess) {
            speakIvrPrompt("Bienvenue sur le test d'écho audio Tendry Telecom. Parlez après le bip pour tester votre retour voix.");
          }
        });
      } else if (destination === '9999') {
        speakIvrPrompt("Bienvenue sur le serveur vocal interactif. Tapez 1 pour l'état du réseau, 2 pour le support technique radio, ou 3 pour joindre le superviseur NOC.");
      } else if (destination === '1000') {
        speakIvrPrompt("Supervision NOC Tendry Télécom, bonjour. Votre ligne est connectée en qualité Haute Définition.");
      }
    }, 2800);
  };

  // HANGUP ACTIVE CALL
  const handleHangup = () => {
    stopRingbackTone();
    stopIncomingRingtone();
    stopHoldMusic();
    stopMicrophoneEchoTest();
    stopSpeech();

    if (activeSession) {
      // SIP BYE
      const byePayload = `BYE ${activeSession.remoteUri} SIP/2.0\r\nVia: SIP/2.0/${sipConfig.transport} 192.168.1.55:${sipConfig.port}\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${activeSession.remoteUri}>\r\nCall-ID: call-${Date.now()}\r\nCSeq: 200 BYE\r\nUser-Agent: Linphone-Web/5.2.0`;
      logSipPacket('TX', 'BYE', `sip:${sipConfig.username}@${sipConfig.domain}`, activeSession.remoteUri, byePayload);

      // Append to Call History
      const logItem: CallLogItem = {
        id: `call-log-${Date.now()}`,
        direction: activeSession.direction,
        name: activeSession.remoteDisplayName,
        number: activeSession.remoteUri.replace('sip:', '').split('@')[0],
        timestamp: activeSession.startTime || new Date(),
        durationSeconds: activeSession.durationSeconds,
        status: activeSession.durationSeconds > 0 ? 'ANSWERED' : 'REJECTED',
        codec: activeSession.codec
      };
      setCallHistory(prev => [logItem, ...prev]);
    }

    setActiveSession(null);
  };

  // TOGGLE MUTE
  const handleToggleMute = () => {
    setActiveSession(prev => {
      if (!prev) return null;
      return { ...prev, isMuted: !prev.isMuted };
    });
  };

  // TOGGLE HOLD
  const handleToggleHold = () => {
    setActiveSession(prev => {
      if (!prev) return null;
      const nextHold = !prev.isOnHold;
      if (nextHold) {
        startHoldMusic();
        // SIP re-INVITE (sendonly / on hold)
        const reInvitePayload = `INVITE ${prev.remoteUri} SIP/2.0\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${prev.remoteUri}>\r\nContent-Type: application/sdp\r\n\r\na=sendonly`;
        logSipPacket('TX', 'INVITE (HOLD)', `sip:${sipConfig.username}@${sipConfig.domain}`, prev.remoteUri, reInvitePayload);
      } else {
        stopHoldMusic();
        const reInviteResume = `INVITE ${prev.remoteUri} SIP/2.0\r\nFrom: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nTo: <${prev.remoteUri}>\r\nContent-Type: application/sdp\r\n\r\na=sendrecv`;
        logSipPacket('TX', 'INVITE (RESUME)', `sip:${sipConfig.username}@${sipConfig.domain}`, prev.remoteUri, reInviteResume);
      }
      return {
        ...prev,
        isOnHold: nextHold,
        state: nextHold ? 'ON_HOLD' : 'CONNECTED'
      };
    });
  };

  // TOGGLE RECORDING
  const handleToggleRecord = () => {
    setActiveSession(prev => {
      if (!prev) return null;
      return { ...prev, isRecording: !prev.isRecording };
    });
  };

  // IN-CALL DTMF SEND
  const handleSendDtmf = (digit: string) => {
    if (!activeSession) return;
    const infoPayload = `INFO ${activeSession.remoteUri} SIP/2.0\r\nContent-Type: application/dtmf-relay\r\n\r\nSignal=${digit}\r\nDuration=160`;
    logSipPacket('TX', `INFO (DTMF ${digit})`, `sip:${sipConfig.username}@${sipConfig.domain}`, activeSession.remoteUri, infoPayload);

    // Interactive IVR feedback if calling 9999
    if (activeSession.remoteDisplayName.includes('IVR') || activeSession.remoteUri.includes('9999')) {
      if (digit === '1') {
        speakIvrPrompt("Menu État du Réseau : Tous les cœurs IMS et relais cellulaires 4G et 5G fonctionnent normalement. Aucune alarme critique.");
      } else if (digit === '2') {
        speakIvrPrompt("Menu Support Radio : Votre appel est mis en priorité pour l'équipe d'ingénierie pylônes et drive-test.");
      } else if (digit === '3') {
        speakIvrPrompt("Transfert vers le Superviseur NOC 24/7 en cours. Veuillez patienter.");
      } else {
        speakIvrPrompt(`Touche ${digit} reçue.`);
      }
    }
  };

  // SIMULATE INCOMING CALL
  const handleSimulateIncomingCall = (callerNumber = '1000', callerName = 'Supervision NOC 24/7') => {
    if (activeSession || incomingCall) return;

    setIncomingCall({ callerNumber, callerName });
    startIncomingRingtone();

    // SIP INVITE RX
    const invitePayload = `INVITE sip:${sipConfig.username}@192.168.1.55:${sipConfig.port} SIP/2.0\r\nVia: SIP/2.0/${sipConfig.transport} ${sipConfig.proxyServer}:5060\r\nFrom: "${callerName}" <sip:${callerNumber}@${sipConfig.domain}>;tag=inc-${Date.now()}\r\nTo: <sip:${sipConfig.username}@${sipConfig.domain}>\r\nCall-ID: inc-call-${Date.now()}@${sipConfig.domain}\r\nCSeq: 1 INVITE\r\nContact: <sip:${callerNumber}@${sipConfig.proxyServer}:5060>\r\nContent-Type: application/sdp\r\n\r\nv=0\r\nm=audio 16400 RTP/AVP 111\r\na=rtpmap:111 opus/48000/2`;
    logSipPacket('RX', 'INVITE', `sip:${callerNumber}@${sipConfig.domain}`, `sip:${sipConfig.username}@${sipConfig.domain}`, invitePayload);
  };

  // ANSWER INCOMING CALL
  const handleAnswerIncomingCall = () => {
    if (!incomingCall) return;
    stopIncomingRingtone();

    const newSession: ActiveCallSession = {
      id: `call-${Date.now()}`,
      direction: 'INCOMING',
      remoteUri: `sip:${incomingCall.callerNumber}@${sipConfig.domain}`,
      remoteDisplayName: incomingCall.callerName,
      startTime: new Date(),
      durationSeconds: 0,
      state: 'CONNECTED',
      isMuted: false,
      isOnHold: false,
      isRecording: false,
      codec: sipConfig.preferredCodec,
      audioLevel: 25,
      rttMs: 18,
      jitterMs: 1.8,
      packetLossPercent: 0.0,
      bitrateKbps: 48,
      mosScore: 4.41
    };

    // Send 200 OK
    const okPayload = `SIP/2.0 200 OK\r\nVia: SIP/2.0/${sipConfig.transport} ${sipConfig.proxyServer}:5060\r\nFrom: "${incomingCall.callerName}" <sip:${incomingCall.callerNumber}@${sipConfig.domain}>\r\nTo: <sip:${sipConfig.username}@${sipConfig.domain}>;tag=answ-${Date.now()}\r\nCall-ID: inc-call-${Date.now()}\r\nCSeq: 1 INVITE\r\nContent-Type: application/sdp\r\n\r\nm=audio 7078 RTP/AVP 111\r\na=rtpmap:111 opus/48000/2`;
    logSipPacket('TX', '200 OK (Answer)', `sip:${sipConfig.username}@${sipConfig.domain}`, `sip:${incomingCall.callerNumber}@${sipConfig.domain}`, okPayload);

    setIncomingCall(null);
    setActiveSession(newSession);

    speakIvrPrompt("Appel connecté avec le centre de supervision.");
  };

  // REJECT INCOMING CALL
  const handleRejectIncomingCall = () => {
    if (!incomingCall) return;
    stopIncomingRingtone();

    // Send 486 Busy Here
    const busyPayload = `SIP/2.0 486 Busy Here\r\nFrom: "${incomingCall.callerName}" <sip:${incomingCall.callerNumber}@${sipConfig.domain}>\r\nTo: <sip:${sipConfig.username}@${sipConfig.domain}>;tag=busy-${Date.now()}\r\nCSeq: 1 INVITE`;
    logSipPacket('TX', '486 Busy Here', `sip:${sipConfig.username}@${sipConfig.domain}`, `sip:${incomingCall.callerNumber}@${sipConfig.domain}`, busyPayload);

    // Call history missed
    setCallHistory(prev => [
      {
        id: `missed-${Date.now()}`,
        direction: 'INCOMING',
        name: incomingCall.callerName,
        number: incomingCall.callerNumber,
        timestamp: new Date(),
        durationSeconds: 0,
        status: 'MISSED',
        codec: sipConfig.preferredCodec
      },
      ...prev
    ]);

    setIncomingCall(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-3 sm:px-6 max-w-6xl mx-auto space-y-6">
      {/* Softphone Main Shell & Top Bar */}
      <div className="bg-[#090914] border-2 border-purple-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400" />

        {/* Top Softphone Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 border-2 border-purple-400/50 flex items-center justify-center text-white shadow-lg shadow-purple-950/60 shrink-0">
              <Phone className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  SIP SOFTPHONE CLIENT &bull; LINPHONE WEBRTC CORE
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  {regStatus}
                </span>
              </div>
              <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
                <span>{sipConfig.displayName}</span>
                <span className="text-sm font-mono text-purple-300 font-normal">
                  ({sipConfig.username}@{sipConfig.domain})
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Actions & Account Settings */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleSimulateIncomingCall('1000', 'Supervision NOC 24/7')}
              disabled={!!activeSession || !!incomingCall}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-mono font-bold transition active:scale-95 disabled:opacity-40"
            >
              <PhoneIncoming className="w-4 h-4 text-cyan-300 animate-bounce" />
              <span>Simuler Appel Entrant</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold transition active:scale-95"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              <span>Paramètres SIP</span>
            </button>
          </div>
        </div>

        {/* INCOMING CALL MODAL BANNER */}
        {incomingCall && (
          <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 border-2 border-cyan-400 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in bounce-in duration-200">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center animate-bounce shrink-0">
                <PhoneIncoming className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold bg-cyan-500/20 px-2 py-0.5 rounded">
                  APPEL SIP ENTRANT (INVITE)
                </span>
                <h3 className="text-xl font-heading font-black text-white">{incomingCall.callerName}</h3>
                <p className="text-xs font-mono text-slate-300">Poste {incomingCall.callerNumber} &bull; Codec {sipConfig.preferredCodec}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleRejectIncomingCall}
                className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Rejeter (486 Busy)</span>
              </button>

              <button
                onClick={handleAnswerIncomingCall}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition active:scale-95 animate-pulse"
              >
                <Phone className="w-4 h-4" />
                <span>Répondre (200 OK)</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Phone View: Dialpad / Active Call vs Contacts / History / Console */}
        {activeSession ? (
          /* Active In-Call Screen */
          <SipActiveCall
            session={activeSession}
            onHangup={handleHangup}
            onToggleMute={handleToggleMute}
            onToggleHold={handleToggleHold}
            onToggleRecord={handleToggleRecord}
            onSendDtmf={handleSendDtmf}
          />
        ) : (
          /* Main Softphone Navigation Tabs */
          <div className="space-y-6">
            {/* Tabs Selector */}
            <div className="flex items-center justify-center">
              <div className="flex items-center p-1.5 rounded-2xl bg-slate-950 border border-white/10 gap-1">
                <button
                  onClick={() => setActiveTab('DIALPAD')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'DIALPAD'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Clavier Linphone</span>
                </button>

                <button
                  onClick={() => setActiveTab('CONTACTS')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'CONTACTS'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Contacts ({contacts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('HISTORY')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'HISTORY'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Journal ({callHistory.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('SIP_CONSOLE')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    activeTab === 'SIP_CONSOLE'
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-950'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-4 h-4" />
                  <span>Signaux SIP ({sipLogs.length})</span>
                </button>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'DIALPAD' && (
                <div className="animate-in fade-in duration-150">
                  <SipDialpad
                    dialNumber={dialNumber}
                    onNumberChange={setDialNumber}
                    onStartCall={handleStartCall}
                  />
                </div>
              )}

              {activeTab === 'CONTACTS' && (
                <div className="animate-in fade-in duration-150">
                  <SipContacts
                    contacts={contacts}
                    onCallNumber={(num) => {
                      setDialNumber(num);
                      handleStartCall(num);
                    }}
                    onAddContact={(newC) => setContacts(prev => [newC, ...prev])}
                  />
                </div>
              )}

              {activeTab === 'HISTORY' && (
                <div className="animate-in fade-in duration-150">
                  <SipCallHistory
                    logs={callHistory}
                    onCallNumber={(num) => {
                      setDialNumber(num);
                      handleStartCall(num);
                    }}
                    onClearHistory={() => setCallHistory([])}
                  />
                </div>
              )}

              {activeTab === 'SIP_CONSOLE' && (
                <div className="animate-in fade-in duration-150">
                  <SipConsole
                    logs={sipLogs}
                    onClearLogs={() => setSipLogs([])}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SIP Account Settings Modal */}
      {isSettingsOpen && (
        <SipAccountSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={sipConfig}
          onSaveConfig={(newCfg) => {
            setSipConfig(newCfg);
            setRegStatus('REGISTERED');
          }}
        />
      )}
    </div>
  );
};
