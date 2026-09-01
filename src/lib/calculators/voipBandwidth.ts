import { VoipBandwidthResult } from '../../types';

export interface CodecInfo {
  name: string;
  bitrateKbps: number;
  sampleBytesPerMs: number;
  defaultIntervalMs: number;
  mos: number;
}

export const VOIP_CODECS: Record<string, CodecInfo> = {
  'G.711': { name: 'G.711', bitrateKbps: 64, sampleBytesPerMs: 8, defaultIntervalMs: 20, mos: 4.1 },
  'G.711 (u-law/a-law)': { name: 'G.711', bitrateKbps: 64, sampleBytesPerMs: 8, defaultIntervalMs: 20, mos: 4.1 },
  'G.729': { name: 'G.729', bitrateKbps: 8, sampleBytesPerMs: 1, defaultIntervalMs: 20, mos: 3.92 },
  'G.729 (Annex A)': { name: 'G.729', bitrateKbps: 8, sampleBytesPerMs: 1, defaultIntervalMs: 20, mos: 3.92 },
  'G.722': { name: 'G.722', bitrateKbps: 64, sampleBytesPerMs: 8, defaultIntervalMs: 20, mos: 4.25 },
  'G.722 (HD Voice)': { name: 'G.722', bitrateKbps: 64, sampleBytesPerMs: 8, defaultIntervalMs: 20, mos: 4.25 },
  'Opus': { name: 'Opus', bitrateKbps: 24, sampleBytesPerMs: 3, defaultIntervalMs: 20, mos: 4.35 },
  'Opus (Wideband)': { name: 'Opus', bitrateKbps: 32, sampleBytesPerMs: 4, defaultIntervalMs: 20, mos: 4.35 },
  'iLBC': { name: 'iLBC', bitrateKbps: 15.2, sampleBytesPerMs: 1.9, defaultIntervalMs: 20, mos: 3.8 }
};

export const L2_OVERHEADS: Record<string, number> = {
  'ETHERNET': 18,
  'Ethernet (with FCS + Preamble)': 38,
  'Ethernet + 802.1Q VLAN Tag': 42,
  'PPPOE': 26,
  'PPP / PPPoE': 8,
  'MPLS': 22,
  'MPLS (Single 4B Label)': 4,
  'MPLS (Dual 8B Labels)': 8
};

export interface VoipBandwidthOptions {
  codec: string;
  concurrentCalls?: number;
  numCalls?: number;
  ptimeMs?: number;
  packetizationMs?: number;
  layer2Protocol?: string;
  l2Protocol?: string;
  headerCompression?: boolean;
  cRTPEnabled?: boolean;
}

export interface DetailedVoipResult extends VoipBandwidthResult {
  totalBandwidthMbps: number;
  bandwidthPerCallKbps: number;
  totalPps: number;
  ppsPerCall: number;
  totalPacketSizeBytes: number;
  payloadSizeBytes: number;
  headerSizeBytes: number;
}

export function calculateVoipBandwidth(
  codecOrOptions: string | VoipBandwidthOptions,
  packetizationMsParam: number = 20,
  numCallsParam: number = 1,
  l2ProtocolParam: string = 'ETHERNET',
  cRTPEnabledParam: boolean = false
): DetailedVoipResult {
  let codecKey = 'G.711';
  let ptime = 20;
  let calls = 1;
  let l2Proto = 'ETHERNET';
  let compressed = false;

  if (typeof codecOrOptions === 'string') {
    codecKey = codecOrOptions || 'G.711';
    ptime = packetizationMsParam;
    calls = numCallsParam;
    l2Proto = l2ProtocolParam;
    compressed = cRTPEnabledParam;
  } else if (codecOrOptions && typeof codecOrOptions === 'object') {
    codecKey = codecOrOptions.codec || 'G.711';
    ptime = codecOrOptions.ptimeMs ?? codecOrOptions.packetizationMs ?? 20;
    calls = codecOrOptions.concurrentCalls ?? codecOrOptions.numCalls ?? 1;
    l2Proto = codecOrOptions.layer2Protocol ?? codecOrOptions.l2Protocol ?? 'ETHERNET';
    compressed = Boolean(codecOrOptions.headerCompression ?? codecOrOptions.cRTPEnabled);
  }

  // Match codec
  const safeCodecKey = String(codecKey || 'G.711').trim();
  let matchedCodec = VOIP_CODECS[safeCodecKey];
  if (!matchedCodec) {
    for (const k of Object.keys(VOIP_CODECS)) {
      if (k.toLowerCase().startsWith(safeCodecKey.toLowerCase()) || safeCodecKey.toLowerCase().startsWith(k.toLowerCase())) {
        matchedCodec = VOIP_CODECS[k];
        break;
      }
    }
  }
  if (!matchedCodec) {
    matchedCodec = VOIP_CODECS['G.711'];
  }

  // Match L2 overhead
  let l2Bytes = L2_OVERHEADS[l2Proto];
  if (l2Bytes === undefined) {
    const upper = l2Proto.toUpperCase();
    if (upper.includes('PPPOE') || upper.includes('PPP')) l2Bytes = 26;
    else if (upper.includes('MPLS')) l2Bytes = 22;
    else l2Bytes = 18;
  }

  const payloadSizeBytes = Math.round(matchedCodec.sampleBytesPerMs * ptime);
  const ppsPerCall = Math.round(1000 / ptime);
  const totalPps = ppsPerCall * calls;

  // L3 (20B IP) + L4 (8B UDP) + L4 (12B RTP) = 40B. With cRTP = 4B.
  const ipUdpRtpHdrBytes = compressed ? 4 : 40;
  const headerSizeBytes = l2Bytes + ipUdpRtpHdrBytes;
  const totalPacketSizeBytes = payloadSizeBytes + headerSizeBytes;

  const bitsPerPacket = totalPacketSizeBytes * 8;
  const bandwidthPerCallKbps = Math.round(((bitsPerPacket * ppsPerCall) / 1000) * 10) / 10;
  const totalBandwidthKbps = Math.round(bandwidthPerCallKbps * calls * 10) / 10;
  const totalBandwidthMbps = Math.round((totalBandwidthKbps / 1000) * 100) / 100;

  return {
    codec: matchedCodec.name,
    codecBitrateKbps: matchedCodec.bitrateKbps,
    packetizationMs: ptime,
    payloadBytes: payloadSizeBytes,
    payloadSizeBytes,
    headerSizeBytes,
    totalPacketSizeBytes,
    packetsPerSec: ppsPerCall,
    ppsPerCall,
    totalPps,
    l2Protocol: l2Proto,
    overheadBytesPerPacket: headerSizeBytes,
    bandwidthPerCallKbps,
    totalCalls: calls,
    totalBandwidthKbps,
    totalBandwidthMbps,
    mosEstimate: matchedCodec.mos
  };
}
