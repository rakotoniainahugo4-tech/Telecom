export type ToolCategory = 
  | 'ALL'
  | 'NETWORK'
  | 'IP'
  | 'MPLS'
  | 'MOBILE'
  | 'FIBER'
  | 'RF'
  | 'TRANSMISSION'
  | 'VOIP'
  | 'QOS'
  | 'POWER'
  | 'DIAGNOSTICS';

export type AvailabilityBadge = 
  | 'REAL TEST'
  | 'LOCAL CALCULATION'
  | 'REFERENCE'
  | 'BACKEND REQUIRED'
  | 'LAB / SIMULATION'
  | 'COURS / LEÇON'
  | 'MODULE PÉDAGOGIQUE';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  badge: AvailabilityBadge;
  description: string;
  iconName: string;
  route: string;
  featured?: boolean;
}

export interface SpeedTestState {
  status: 'READY' | 'CONNECTING' | 'LATENCY_TEST' | 'DOWNLOAD_TEST' | 'UPLOAD_TEST' | 'FINALIZING' | 'COMPLETED' | 'ERROR';
  downloadMbps: number | null;
  uploadMbps: number | null;
  pingMs: number | null;
  jitterMs: number | null;
  packetLossPercent: number | null;
  currentInstantMbps: number;
  serverInfo: {
    name: string;
    endpoint: string;
    protocol: string;
  };
  durationSeconds: number;
  timestamp: string | null;
  errorMessage?: string;
  graphPoints: { time: number; speed: number; phase: 'download' | 'upload' }[];
}

export interface PingResult {
  target: string;
  probeType: string;
  transmitted: number;
  received: number;
  packetLossPercent: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  avgLatencyMs: number;
  jitterMs: number;
  samples: { seq: number; latencyMs: number | null; status: string; error?: string }[];
  timestamp: string;
}

export interface DnsRecord {
  type: string;
  value: string;
  ttl?: number;
  priority?: number;
}

export interface DnsResponse {
  domain: string;
  type: string;
  records: DnsRecord[];
  queryTimeMs?: number;
  server?: string;
  error?: string;
  timestamp: string;
}

export interface PortTestResult {
  host: string;
  port: number;
  status: 'OPEN' | 'CLOSED' | 'TIMEOUT' | 'UNREACHABLE';
  responseTimeMs: number;
  serviceName: string;
  error?: string;
  timestamp: string;
}

export interface HttpTestResult {
  url: string;
  status?: number;
  statusText?: string;
  ok?: boolean;
  responseTimeMs: number;
  contentType?: string;
  contentLength?: string;
  serverHeader?: string;
  protocol?: string;
  redirected?: boolean;
  finalUrl?: string;
  headers?: Record<string, string>;
  error?: string;
  timestamp: string;
}

export interface SubnetCalculationResult {
  ip: string;
  cidr: number;
  subnetMask: string;
  netmask?: string;
  wildcardMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  firstUsableIp?: string;
  lastUsableIp?: string;
  totalAddresses: number;
  totalHosts?: number;
  usableHosts: number;
  ipClass: string;
  isPrivate: boolean;
  scope?: string;
  ipBinary: string;
  maskBinary: string;
  netmaskBinary?: string;
  networkBinary: string;
}

export interface Ipv6CalculationResult {
  address: string;
  prefix: number;
  expanded: string;
  compressed: string;
  networkPrefix: string;
  hostPortion: string;
  type: string;
  totalAddressesNotation: string;
}

export interface RouteSummaryResult {
  inputSubnets: string[];
  summaryRoute: string;
  binaryMatchBits: number;
  commonPrefixBinary: string;
  isContiguous: boolean;
  totalContainedIps?: number;
  supernetCapacityIps?: number;
}

export interface FiberBudgetResult {
  wavelengthNm: number;
  txPowerDbm: number;
  fiberLengthKm: number;
  fiberAttenuationDbPerKm: number;
  totalFiberLossDb: number;
  numSplices: number;
  spliceLossDb: number;
  totalSpliceLossDb: number;
  numConnectors: number;
  connectorLossDb: number;
  totalConnectorLossDb: number;
  splitterRatio: string;
  splitterLossDb: number;
  engineeringMarginDb: number;
  totalLossDb: number;
  rxPowerDbm: number;
  rxPowerMw: number;
  powerMarginDb: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export interface LinkBudgetResult {
  frequencyMhz: number;
  distanceKm: number;
  txPowerDbm: number;
  txAntennaGainDbi: number;
  txCableLossDb: number;
  rxAntennaGainDbi: number;
  rxCableLossDb: number;
  miscLossDb: number;
  fsplDb: number;
  eirpDbm: number;
  rxPowerDbm: number;
  rxSensitivityDbm: number;
  fadeMarginDb: number;
  wavelengthMeters: number;
  fresnelRadiusMeters: number;
  status: 'EXCELLENT' | 'GOOD' | 'MARGINAL' | 'FAIL';
}

export interface VoipBandwidthResult {
  codec: string;
  codecBitrateKbps: number;
  packetizationMs: number;
  payloadBytes: number;
  packetsPerSec: number;
  l2Protocol: string;
  overheadBytesPerPacket: number;
  bandwidthPerCallKbps: number;
  totalCalls: number;
  totalBandwidthKbps: number;
  totalBandwidthMbps: number;
  mosEstimate: number;
}

export interface RackEquipment {
  id: string;
  name: string;
  uHeight: number;
  startU: number;
  powerWatts: number;
  type: 'router' | 'switch' | 'server' | 'patch' | 'pdu' | 'fiber' | 'ups';
}

export interface SavedCalculationItem {
  id: string;
  toolId: string;
  toolName: string;
  timestamp: string;
  inputs: Record<string, any>;
  resultSummary: string;
}
