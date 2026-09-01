export interface CommandItem {
  id: string;
  platform: 'Cisco IOS' | 'Nokia SR OS' | 'Linux' | 'Asterisk';
  category: 'Routing' | 'Interfaces' | 'MPLS' | 'BGP' | 'System' | 'VoIP' | 'Diagnostics';
  command: string;
  description: string;
  exampleOutput?: string;
}

export const COMMAND_REFERENCE_LIST: CommandItem[] = [
  // CISCO IOS / IOS-XR
  {
    id: 'cisco-1',
    platform: 'Cisco IOS',
    category: 'Routing',
    command: 'show ip route',
    description: 'Displays the complete IPv4 Routing Information Base (RIB) table and active next-hops.',
    exampleOutput: `Gateway of last resort is 198.51.100.1 to network 0.0.0.0\nO    10.10.0.0/16 [110/2] via 10.0.0.1, 00:14:22, GigabitEthernet0/0\nC    192.168.1.0/24 is directly connected, GigabitEthernet0/1`
  },
  {
    id: 'cisco-2',
    platform: 'Cisco IOS',
    category: 'Interfaces',
    command: 'show ip interface brief',
    description: 'Summarizes IP address assignments and Layer 1/2 operational states for all interfaces.',
    exampleOutput: `Interface              IP-Address      OK? Method Status                Protocol\nGigabitEthernet0/0     10.0.0.2        YES manual up                    up      \nGigabitEthernet0/1     192.168.1.1     YES manual up                    up      \nLoopback0              10.255.255.1    YES manual up                    up      `
  },
  {
    id: 'cisco-3',
    platform: 'Cisco IOS',
    category: 'Routing',
    command: 'show ip ospf neighbor',
    description: 'Lists all discovered OSPF adjacency neighbors, router IDs, states (FULL/2-WAY), and dead timers.',
    exampleOutput: `Neighbor ID     Pri   State           Dead Time   Address         Interface\n10.255.255.2      1   FULL/BDR        00:00:34    10.0.0.1        GigabitEthernet0/0`
  },
  {
    id: 'cisco-4',
    platform: 'Cisco IOS',
    category: 'MPLS',
    command: 'show mpls forwarding-table',
    description: 'Displays MPLS Label Forwarding Information Base (LFIB), local labels, outgoing labels, and prefixes.',
    exampleOutput: `Local  Outgoing   Prefix           Bytes Label   Outgoing   Next Hop\nLabel  Label      or Tunnel Id     Switched      interface\n16     Pop Label  10.255.255.2/32  284102        Gi0/0      10.0.0.1\n17     19         10.255.255.3/32  1940120       Gi0/0      10.0.0.1`
  },
  {
    id: 'cisco-5',
    platform: 'Cisco IOS',
    category: 'BGP',
    command: 'show bgp vpnv4 unicast all summary',
    description: 'Displays status of all MP-BGP VPNv4 address-family peering sessions and received prefixes across VRFs.'
  },

  // NOKIA SR OS
  {
    id: 'nokia-1',
    platform: 'Nokia SR OS',
    category: 'Routing',
    command: 'show router route-table',
    description: 'Displays the Nokia 7750 SR / 7950 XRS active routing table for the Base router instance.',
    exampleOutput: `===============================================================================\nRoute Table (Router: Base)\n===============================================================================\nDest Prefix[Flags]                   Type    Proto    Age         Pref   Metric\n   Next Hop[Interface Name]                                        \n-------------------------------------------------------------------------------\n10.0.0.0/30                          Local   Local    01d04h      0      0\n   system                                                          \n10.255.255.2/32                      Remote  OSPF     01d02h      10     100\n   10.0.0.2 [to-PE-2]`
  },
  {
    id: 'nokia-2',
    platform: 'Nokia SR OS',
    category: 'Interfaces',
    command: 'show router interface',
    description: 'Displays all configured network and system interfaces with IP addresses and admin/operational states.'
  },
  {
    id: 'nokia-3',
    platform: 'Nokia SR OS',
    category: 'Routing',
    command: 'show router ospf neighbor',
    description: 'Displays OSPF neighbors, area IDs, operational states, and DR/BDR election details on Nokia SR OS.'
  },
  {
    id: 'nokia-4',
    platform: 'Nokia SR OS',
    category: 'Routing',
    command: 'show router isis adjacency',
    description: 'Displays IS-IS Level 1 / Level 2 neighbor adjacencies, circuit types, and hold timers.'
  },
  {
    id: 'nokia-5',
    platform: 'Nokia SR OS',
    category: 'MPLS',
    command: 'show router ldp session',
    description: 'Displays active LDP label distribution sessions with peer LSR-IDs and transport addresses.'
  },
  {
    id: 'nokia-6',
    platform: 'Nokia SR OS',
    category: 'MPLS',
    command: 'show service service-using vprn',
    description: 'Lists all provisioned VPRN (Layer 3 Virtual Private Routed Network) customer instances.'
  },

  // LINUX NETWORKING
  {
    id: 'linux-1',
    platform: 'Linux',
    category: 'Interfaces',
    command: 'ip -br addr show',
    description: 'Prints a clean, brief summary of all network interfaces, operational flags, and IPv4/IPv6 addresses.'
  },
  {
    id: 'linux-2',
    platform: 'Linux',
    category: 'Routing',
    command: 'ip route show',
    description: 'Displays the Linux kernel IPv4 routing table and default gateway.'
  },
  {
    id: 'linux-3',
    platform: 'Linux',
    category: 'Diagnostics',
    command: 'ss -tulpn',
    description: 'Lists all listening TCP/UDP sockets with process names and port numbers.'
  },
  {
    id: 'linux-4',
    platform: 'Linux',
    category: 'Diagnostics',
    command: 'dig +trace example.com',
    description: 'Performs hierarchical iterative DNS resolution starting from the root DNS servers down to the authoritative zone.'
  },
  {
    id: 'linux-5',
    platform: 'Linux',
    category: 'Diagnostics',
    command: 'tcpdump -ni eth0 -c 10 "port 5060 or port 5061"',
    description: 'Captures live SIP signaling packets on network interface eth0.'
  },

  // ASTERISK IP TELEPHONY
  {
    id: 'asterisk-1',
    platform: 'Asterisk',
    category: 'VoIP',
    command: 'core show channels',
    description: 'Displays all active VoIP telephone calls, bridged channels, and call durations.'
  },
  {
    id: 'asterisk-2',
    platform: 'Asterisk',
    category: 'VoIP',
    command: 'pjsip show endpoints',
    description: 'Lists all registered PJSIP SIP endpoints, trunks, codecs, and current connection states.'
  },
  {
    id: 'asterisk-3',
    platform: 'Asterisk',
    category: 'VoIP',
    command: 'pjsip set logger on',
    description: 'Enables live SIP packet debug logging in Asterisk console for troubleshooting call signaling.'
  },
  {
    id: 'asterisk-4',
    platform: 'Asterisk',
    category: 'VoIP',
    command: 'rtp set debug on',
    description: 'Enables real-time RTP audio packet flow tracing to diagnose audio dropouts and codec negotiation.'
  }
];
