"use strict";

let touchStartX = 0;
let touchEndX = 0;
let translationRun = 0;
const languagePackCache = {};
const TOPIC_QUIZ_SIZE = 10;
const DAILY_DRILL_SIZE = 10;
const FINAL_EXAM_SIZE = 90;
const FINAL_DOMAIN_PLAN = [
  { id: "general", count: 11, topics: ["principles", "iam", "crypto"] },
  { id: "threats", count: 20, topics: ["network-attacks", "app-attacks", "wireless", "assessment"] },
  { id: "architecture", count: 16, topics: ["network-design", "secure-dev", "endpoint", "cloud-security", "physical"] },
  { id: "operations", count: 25, topics: ["endpoint", "assessment", "incident", "cloud-security", "network-design"] },
  { id: "program", count: 18, topics: ["governance", "risk-privacy", "physical"] }
];

const iconPaths = {
  cloud: '<path d="M17 18H8a5 5 0 1 1 1.3-9.8A7 7 0 0 1 23 10a4 4 0 0 1-1 8h-1"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 18 9 5 9-5"/>',
  server: '<path d="M5 4h14v6H5z"/><path d="M5 14h14v6H5z"/><path d="M8 7h.01"/><path d="M8 17h.01"/>',
  network: '<path d="M12 4v5"/><path d="M6 20v-5h12v5"/><path d="M4 9h16v6H4z"/>',
  database: '<ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v14c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
  shield: '<path d="M12 3 20 7v6c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V7l8-4Z"/><path d="m9 12 2 2 4-5"/>',
  dollar: '<path d="M12 2v20"/><path d="M17 6.5c-1.2-1-2.9-1.5-5-1.5-3 0-5 1.4-5 3.5s2 3 5 3 5 .9 5 3-2 3.5-5 3.5c-2.3 0-4.2-.6-5.5-1.8"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0-5 5L4 17v3h3l5.7-5.7a4 4 0 0 0 5-5l-2.7 2.7-3-3 2.7-2.7Z"/>',
  chart: '<path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5"/><path d="M12 16V8"/><path d="M16 16v-3"/>',
  exam: '<path d="M8 4h10v16H6V6a2 2 0 0 1 2-2Z"/><path d="M9 9h6"/><path d="M9 13h6"/><path d="M9 17h4"/>',
  cards: '<rect x="4" y="7" width="13" height="14" rx="2"/><path d="M8 3h10a2 2 0 0 1 2 2v12"/><path d="M8 12h5"/><path d="M8 16h3"/>',
  star: '<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>',
  back: '<path d="M15 18 9 12l6-6"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 10v6"/><path d="M12 7h.01"/>',
  next: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'
};

const topics = [
  {
    "id": "exam",
    "title": "Security+ Exam Map",
    "icon": "exam",
    "lessons": [
      {
        "title": "What The Test Rewards",
        "body": [
          "Security+ questions usually ask you to identify a control, attack, protocol, risk response, or recovery step from a short business scenario.",
          "Look for clues about confidentiality, integrity, availability, identity, network boundaries, secure development, operations, governance, and incident response.",
          "For pacing, practice answering 90 questions in about 90 minutes. Mark long scenarios, answer the direct recognition questions first, and return to the harder ones."
        ],
        "remember": "Ask what the scenario is really protecting: data, identity, network traffic, an endpoint, a building, or a business process."
      },
      {
        "title": "Fast Answer Pattern",
        "body": [
          "Read the last sentence first. It often names the action: authenticate, encrypt, segment, detect, contain, eradicate, recover, document, or accept risk.",
          "Eliminate answers that solve a different layer. A firewall filters traffic, MFA strengthens login, DLP watches sensitive data, and backups support recovery.",
          "Scenario questions reward exact fit. If a word such as proximity, non-repudiation, sanitization, SIEM, or hot site appears, match that word to the purpose."
        ],
        "remember": "Verb plus asset plus constraint usually points to the answer."
      },
      {
        "title": "Domain Weighting",
        "body": [
          "Spend steady time on attacks and defenses because many questions describe symptoms before asking for the best control.",
          "Identity, network design, endpoint hardening, cloud, incident response, governance, and risk appear repeatedly across chapters.",
          "Do not memorize only definitions. Practice choosing between similar controls such as IDS versus IPS, hashing versus encryption, and hot versus warm recovery sites."
        ],
        "remember": "When two answers seem right, pick the one with the tightest match to the stated requirement."
      },
      {
        "title": "SY0-701 Exam Shape",
        "body": [
          "The Security+ SY0-701 exam is built around five domains: general security concepts, threats and mitigations, architecture, operations, and program oversight.",
          "The real exam can include up to 90 questions in 90 minutes. Treat this app's final practice as a timed stamina set, not just a memory drill.",
          "Questions may be direct multiple choice, multi-response, or PBQ-style scenarios where the best answer depends on sequence, priority, or matching the control to the situation."
        ],
        "remember": "For the final practice, move at about one minute per question and flag long scenarios mentally before answering.",
        "sections": [
          {
            "title": "Domain Weighting",
            "items": [
              "General Security Concepts: about 12 percent.",
              "Threats, Vulnerabilities, and Mitigations: about 22 percent.",
              "Security Architecture: about 18 percent.",
              "Security Operations: about 28 percent.",
              "Security Program Management and Oversight: about 20 percent."
            ]
          }
        ]
      }
    ],
    "color": "#ff85c7"
  },
  {
    "id": "principles",
    "title": "Security Principles",
    "icon": "shield",
    "lessons": [
      {
        "title": "CIA Triad",
        "body": [
          "Confidentiality limits information to authorized people, systems, or processes.",
          "Integrity means data is accurate and changed only in authorized ways.",
          "Availability means authorized users can reach information and services when needed."
        ],
        "remember": "Confidentiality hides, integrity preserves, availability keeps working."
      },
      {
        "title": "Vulnerabilities And Threat Actors",
        "body": [
          "A vulnerability is a weakness that can be exploited. A threat is a potential cause of harm, and risk combines likelihood with impact.",
          "Threat actors include insiders, criminals, nation-states, competitors, activists, and careless users.",
          "Attack vectors include email, removable media, exposed services, social engineering, supply chain compromise, and physical access."
        ],
        "remember": "Weakness plus actor plus path equals a realistic risk scenario."
      },
      {
        "title": "Social Engineering And Malware",
        "body": [
          "Social engineering manipulates people into taking unsafe actions or revealing information.",
          "Phishing uses deceptive messages, vishing uses voice calls, smishing uses texts, and tailgating abuses physical access.",
          "Malware categories include viruses, worms, trojans, ransomware, spyware, rootkits, and logic bombs."
        ],
        "remember": "If the attacker targets human trust, think social engineering before technical exploits."
      },
      {
        "title": "Control Type Examples",
        "body": [],
        "remember": "Controls can be administrative, technical, physical, preventive, detective, corrective, deterrent, or compensating.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A policy requiring annual security training is an administrative control.",
              "A locked server room is a physical control.",
              "An endpoint detection agent is a technical control."
            ]
          }
        ]
      },
      {
        "title": "SY0-701 Control Thinking",
        "body": [
          "Start by naming the control goal: prevent, detect, correct, deter, compensate, or recover.",
          "Then match the control to the asset and layer: identity, endpoint, network, application, data, facility, or business process.",
          "When two answers look right, choose the one that directly reduces the risk described in the last sentence."
        ],
        "remember": "Question stems usually hide the control type in verbs such as block, alert, restore, verify, or discourage."
      }
    ]
  },
  {
    "id": "iam",
    "title": "Identity & Access",
    "icon": "lock",
    "lessons": [
      {
        "title": "Identification, Authentication, Authorization",
        "body": [
          "Identification is a subject claiming an identity, such as a username, certificate, token, or account.",
          "Authentication proves the claimed identity with something you know, have, are, do, or somewhere you are.",
          "Authorization decides what the authenticated subject is allowed to access or perform."
        ],
        "remember": "Identify who, authenticate proof, authorize permissions."
      },
      {
        "title": "MFA And Biometrics",
        "body": [
          "Multifactor authentication uses factors from different categories, such as a password plus a token or biometric.",
          "Biometric systems must balance false acceptance, false rejection, and crossover error rate.",
          "Smart cards, tokens, authenticator apps, certificates, and SSH keys are common authentication methods."
        ],
        "remember": "Two passwords are not true MFA because they are the same factor type."
      },
      {
        "title": "Access Control Models",
        "body": [
          "DAC lets owners control access to their objects, while MAC uses labels and central policy.",
          "RBAC assigns access by job role, and rule-based access evaluates conditions such as time, location, or network.",
          "Least privilege, separation of duties, account reviews, and disabling stale accounts reduce identity risk."
        ],
        "remember": "RBAC is role-based; rule-based access follows conditions."
      },
      {
        "title": "Authentication Protocol Examples",
        "body": [],
        "remember": "Authentication protocols often appear in network access scenarios.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "Kerberos uses tickets to support single sign-on in many enterprise environments.",
              "RADIUS centralizes authentication, authorization, and accounting for network access.",
              "802.1X controls access to a switch port or wireless network before full connectivity is allowed."
            ]
          }
        ]
      },
      {
        "title": "Identity Provider And Federation Clues",
        "body": [
          "Modern cloud and SaaS access often centers on an identity provider that issues tokens to applications.",
          "SAML is common for enterprise browser SSO, while OIDC builds on OAuth concepts for modern web and mobile identity.",
          "Conditional access combines identity signals such as location, device posture, risk score, and MFA status before allowing access."
        ],
        "remember": "Federation means one trusted identity system vouches for users to another service."
      }
    ]
  },
  {
    "id": "crypto",
    "title": "Cryptography",
    "icon": "database",
    "lessons": [
      {
        "title": "Crypto Services",
        "body": [
          "Encryption protects confidentiality by making data unreadable without the correct key.",
          "Hashing supports integrity by producing a fixed-length digest that changes when the data changes.",
          "Digital signatures support authentication, integrity, and non-repudiation."
        ],
        "remember": "Encrypt to hide, hash to detect change, sign to prove origin."
      },
      {
        "title": "Symmetric And Asymmetric",
        "body": [
          "Symmetric encryption uses the same secret key to encrypt and decrypt, so it is fast but needs secure key sharing.",
          "Asymmetric encryption uses a public key and private key pair, which helps with key exchange and digital signatures.",
          "Many secure protocols use asymmetric cryptography to establish trust, then symmetric keys for bulk data."
        ],
        "remember": "Symmetric is fast; asymmetric solves sharing and identity problems."
      },
      {
        "title": "PKI And Certificates",
        "body": [
          "A certificate binds an identity to a public key and is issued by a certificate authority.",
          "PKI includes certificate authorities, registration authorities, certificates, revocation, and trust chains.",
          "Certificate revocation can be checked through CRL or OCSP when a certificate should no longer be trusted."
        ],
        "remember": "Certificates answer: who owns this public key?"
      },
      {
        "title": "Hash, MAC, And Signature Examples",
        "body": [],
        "remember": "Integrity only detects change; non-repudiation ties the action to a sender.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A downloaded file checksum helps detect whether the file changed.",
              "An HMAC proves integrity and uses a shared secret.",
              "A signed contract helps prevent the sender from denying the message later."
            ]
          }
        ]
      },
      {
        "title": "Key Lifecycle And PKI Operations",
        "body": [
          "PKI questions often hinge on trust: who issued the certificate, whether it is expired, and whether it has been revoked.",
          "Keys need generation, storage, rotation, escrow or recovery decisions, revocation, and destruction.",
          "A hardware security module protects high-value keys by keeping private key operations inside tamper-resistant hardware."
        ],
        "remember": "Certificates bind identities to public keys; they do not prove software is safe by themselves."
      }
    ]
  },
  {
    "id": "network-attacks",
    "title": "Network Attacks & Protocols",
    "icon": "network",
    "lessons": [
      {
        "title": "DDoS And DNS Attacks",
        "body": [
          "DoS disrupts a service; DDoS uses many systems to flood or exhaust the target.",
          "Network-based DDoS attacks consume bandwidth, protocol attacks exhaust state, and application attacks overload specific functions.",
          "DNS poisoning and domain hijacking misdirect users by corrupting name resolution or control of a domain."
        ],
        "remember": "DDoS blocks access; DNS attacks redirect trust."
      },
      {
        "title": "Layer 2 And On-Path Attacks",
        "body": [
          "ARP poisoning tricks hosts into sending traffic to the attacker's MAC address.",
          "MAC flooding overwhelms a switch table so the switch may forward frames more broadly.",
          "On-path attacks intercept traffic between parties, while replay attacks resend captured valid traffic."
        ],
        "remember": "If the attacker sits between two parties, think on-path."
      },
      {
        "title": "Secure Protocol Choices",
        "body": [
          "HTTPS protects web traffic with TLS, while LDAPS protects directory queries.",
          "SSH, SFTP, and FTPS provide safer remote administration or file transfer than plaintext options.",
          "SNMPv3 adds authentication and encryption compared with older SNMP versions."
        ],
        "remember": "When a protocol handles credentials or sensitive data, prefer the encrypted version."
      },
      {
        "title": "Protocol Recognition Examples",
        "body": [],
        "remember": "Most protocol questions are asking for the secure version of a familiar service.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A mail client needs encrypted IMAP access. Choose IMAPS.",
              "Voice packets need confidentiality and integrity. Choose SRTP.",
              "An administrator needs secure command-line access to a Linux server. Choose SSH."
            ]
          }
        ]
      },
      {
        "title": "Threat Actor Pattern Recognition",
        "body": [
          "Security+ scenarios often describe behavior instead of naming the attack: login spikes, unusual destinations, encoded commands, or impossible travel.",
          "Map the behavior to attacker goals: initial access, execution, persistence, privilege escalation, lateral movement, exfiltration, or impact.",
          "Indicators of compromise are evidence that something likely happened; tactics, techniques, and procedures explain how attackers operate."
        ],
        "remember": "IoC equals clue; TTP equals behavior pattern."
      }
    ]
  },
  {
    "id": "network-design",
    "title": "Secure Network Design",
    "icon": "server",
    "lessons": [
      {
        "title": "Segmentation And Zones",
        "body": [
          "Network segmentation partitions a network into zones with different trust levels.",
          "A DMZ sits between trusted and untrusted networks and commonly hosts public-facing services.",
          "VLANs separate broadcast domains, while firewalls enforce rules between zones."
        ],
        "remember": "Segment first, then filter traffic between segments."
      },
      {
        "title": "Zero Trust",
        "body": [
          "Zero trust means never automatically trusting a user, device, or network location.",
          "Core ideas include verify explicitly, use least privilege, and assume breach.",
          "Continuous monitoring, device posture, identity signals, and microsegmentation support zero trust."
        ],
        "remember": "Zero trust is a mindset and architecture, not a single product."
      },
      {
        "title": "Firewalls, IDS, IPS, VPN",
        "body": [
          "Firewalls allow or deny traffic based on rules, application context, or inspection capabilities.",
          "IDS detects and alerts, while IPS can detect and block inline traffic.",
          "VPNs create encrypted tunnels for remote access or site-to-site connectivity."
        ],
        "remember": "IDS watches; IPS can stop."
      },
      {
        "title": "Traffic Design Examples",
        "body": [],
        "remember": "Design questions often reveal the answer through where the traffic must be allowed or denied.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A public web server should not sit directly inside the trusted LAN. Place it in a DMZ.",
              "A branch office needs encrypted connectivity to headquarters. Use a site-to-site VPN.",
              "A switch should prevent unknown devices from joining. Use port security or 802.1X."
            ]
          }
        ]
      },
      {
        "title": "Zero Trust And Segmentation",
        "body": [
          "Zero Trust assumes no network location is automatically trusted and requires continuous verification.",
          "Microsegmentation limits lateral movement by placing workloads or users into small policy-controlled zones.",
          "SASE and SSE concepts combine identity-aware access, cloud security controls, and secure connectivity for distributed users."
        ],
        "remember": "Segmentation reduces blast radius; Zero Trust decides access from identity, device, context, and policy."
      }
    ]
  },
  {
    "id": "wireless",
    "title": "Wireless, Mobile & IoT",
    "icon": "cloud",
    "lessons": [
      {
        "title": "Wireless Basics",
        "body": [
          "Wireless communication uses radio frequency bands, channels, antennas, and signal strength.",
          "Common wireless technologies include Wi-Fi, Bluetooth, NFC, RFID, cellular, and GPS.",
          "Frequency, range, interference, and security settings all affect wireless reliability and risk."
        ],
        "remember": "RFID commonly appears with badges, tags, and proximity readers."
      },
      {
        "title": "Wi-Fi Security",
        "body": [
          "Use modern encryption such as WPA3 where available and avoid weak legacy options.",
          "Enterprise wireless commonly uses 802.1X with RADIUS for centralized authentication.",
          "Evil twin access points, rogue APs, jamming, and deauthentication attacks target wireless clients."
        ],
        "remember": "For enterprise Wi-Fi identity, think 802.1X and RADIUS."
      },
      {
        "title": "Mobile And IoT Controls",
        "body": [
          "MDM and UEM tools enforce policies, push updates, manage apps, and remotely wipe lost devices.",
          "Mobile risks include sideloading, jailbreaking, rooting, malicious apps, and lost devices.",
          "IoT devices often need segmentation, default password changes, firmware updates, and restricted network access."
        ],
        "remember": "Treat unmanaged smart devices as low-trust endpoints."
      },
      {
        "title": "Wireless Scenario Examples",
        "body": [],
        "remember": "Wireless questions usually hinge on distance, identity, or device management.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A door badge works when held near a reader. RFID is the likely technology.",
              "A phone should be wiped after being lost at an airport. Use MDM or UEM.",
              "Visitors should use internet access without touching internal systems. Put guest Wi-Fi on a separate segment."
            ]
          }
        ]
      },
      {
        "title": "Wireless And IoT Attack Surface",
        "body": [
          "Wireless security questions often test whether you know the difference between encryption, authentication, and management-plane protection.",
          "WPA3 improves protection, but weak passphrases, evil twins, rogue access points, and poor onboarding still create risk.",
          "IoT devices need inventory, network isolation, firmware updates, and default credential removal because many cannot run full endpoint tools."
        ],
        "remember": "For IoT, isolation and inventory are often the most realistic first controls."
      }
    ]
  },
  {
    "id": "app-attacks",
    "title": "Application Attacks",
    "icon": "tool",
    "lessons": [
      {
        "title": "XSS And Request Forgery",
        "body": [
          "XSS injects client-side script into pages viewed by other users.",
          "CSRF tricks an authenticated browser into sending an unwanted request.",
          "SSRF tricks a server into making requests to internal or external resources chosen by an attacker."
        ],
        "remember": "XSS runs in the victim browser; SSRF sends requests from the server."
      },
      {
        "title": "Injection And Traversal",
        "body": [
          "SQL, XML, LDAP, command, and DLL injection attacks abuse untrusted input as instructions.",
          "Directory traversal uses path tricks to access files outside the intended directory.",
          "Prepared statements, input validation, output encoding, and least privilege reduce many application attacks."
        ],
        "remember": "If input becomes code or a path, validate and constrain it."
      },
      {
        "title": "Memory And Logic Attacks",
        "body": [
          "Buffer overflows write past intended memory boundaries and may crash or execute code.",
          "Race conditions occur when timing changes the security result between check and use.",
          "Privilege escalation, pass-the-hash, replay, and resource exhaustion exploit weaknesses in access or processing."
        ],
        "remember": "Memory flaws break boundaries; logic flaws break assumptions."
      },
      {
        "title": "Attack Clue Examples",
        "body": [],
        "remember": "Name the data being abused: browser script, database query, file path, hash, or timing.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A comment field stores JavaScript that runs for other users. Think stored XSS.",
              "A URL contains ../../ to read a sensitive file. Think directory traversal.",
              "A captured NTLM hash is reused to authenticate. Think pass the hash."
            ]
          }
        ]
      },
      {
        "title": "API And Web Application Clues",
        "body": [
          "Modern application questions often describe APIs, tokens, JSON payloads, and server-side calls rather than only classic web forms.",
          "Input validation, output encoding, parameterized queries, and authorization checks address different parts of the request lifecycle.",
          "SSRF is a server-side request problem; insecure direct object reference is an authorization problem."
        ],
        "remember": "SQL injection needs query separation; XSS needs output safety; IDOR needs authorization checks."
      }
    ]
  },
  {
    "id": "secure-dev",
    "title": "Secure App Development",
    "icon": "layers",
    "lessons": [
      {
        "title": "Environments And Version Control",
        "body": [
          "Development, test, staging, and production environments separate building, validation, release rehearsal, and live use.",
          "Staging should closely mirror production so deployment and migration issues are found before release.",
          "Version control tracks changes, supports rollback, and helps teams review code before merging."
        ],
        "remember": "Do not test risky changes directly in production."
      },
      {
        "title": "Secure Coding Practices",
        "body": [
          "Secure coding uses input validation, output encoding, error handling, safe secrets, and least privilege.",
          "Secrets should be stored in a vault or protected configuration, not hardcoded in source code.",
          "Dependency management checks third-party packages for vulnerabilities and license or supply-chain risk."
        ],
        "remember": "Never trust input, never hardcode secrets, and review dependencies."
      },
      {
        "title": "Testing And Automation",
        "body": [
          "Code review finds logic and design problems before release.",
          "Fuzzing sends unexpected input to discover crashes, memory bugs, and parsing weaknesses.",
          "SAST analyzes source code, DAST tests a running application, and CI/CD automates repeatable checks."
        ],
        "remember": "SAST is before runtime; DAST is against the running app."
      },
      {
        "title": "Secure SDLC Examples",
        "body": [],
        "remember": "Secure development questions often ask where in the pipeline a control belongs.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A final release needs a production-like rehearsal. Use staging.",
              "A scanner examines source code for insecure functions. That is SAST.",
              "Random malformed inputs are sent to an API parser. That is fuzzing."
            ]
          }
        ]
      },
      {
        "title": "Secure Pipeline And Supply Chain",
        "body": [
          "Secure development now includes the pipeline: source control, dependencies, build systems, artifact signing, and deployment approval.",
          "SAST, SCA, secret scanning, container scanning, and DAST answer different questions and are strongest when combined.",
          "A software bill of materials helps identify affected components when a library vulnerability is announced."
        ],
        "remember": "SBOM is inventory for software components."
      }
    ]
  },
  {
    "id": "endpoint",
    "title": "Endpoint Security",
    "icon": "shield",
    "lessons": [
      {
        "title": "Endpoint Protection",
        "body": [
          "Endpoints include laptops, desktops, phones, servers, printers, sensors, and other connected devices.",
          "Anti-malware blocks known malicious software, while EDR collects endpoint telemetry and supports investigation and response.",
          "DLP helps detect or prevent sensitive data from leaving approved locations."
        ],
        "remember": "EDR is deeper endpoint detection and response, not just signature scanning."
      },
      {
        "title": "Hardening",
        "body": [
          "Hardening reduces attack surface by disabling unnecessary services, closing ports, and removing unneeded software.",
          "Patch management keeps operating systems, applications, firmware, and drivers updated against known vulnerabilities.",
          "Baseline configurations, secure registry settings, host firewalls, and strong password policies make endpoints more consistent."
        ],
        "remember": "Turn off what you do not need, patch what you keep."
      },
      {
        "title": "Boot And Disk Protection",
        "body": [
          "Full-disk encryption protects stored data if a device is lost or stolen.",
          "Secure boot and measured boot help ensure trusted components load during startup.",
          "TPM can protect keys and support hardware-backed security operations."
        ],
        "remember": "Disk encryption protects data at rest; secure boot protects startup integrity."
      },
      {
        "title": "Endpoint Control Examples",
        "body": [],
        "remember": "Endpoint questions usually ask how to reduce exposure or investigate a device.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A laptop with customer files is stolen. Full-disk encryption reduces data exposure.",
              "A server exposes an unused service. Disable the service and close the port.",
              "Analysts need endpoint timeline and process data after an alert. Use EDR."
            ]
          }
        ]
      },
      {
        "title": "Endpoint Detection And Response Flow",
        "body": [
          "Endpoint hardening reduces attack surface before compromise; EDR helps detect and investigate suspicious activity after signals appear.",
          "UEM and MDM enforce device posture, encryption, screen locks, application policy, and remote wipe for mobile and BYOD environments.",
          "Application control can use allowlists, deny lists, signatures, hashes, publishers, or behavior rules."
        ],
        "remember": "Hardening prevents; EDR detects and supports response."
      }
    ]
  },
  {
    "id": "cloud-security",
    "title": "Cloud Security",
    "icon": "cloud",
    "lessons": [
      {
        "title": "Cloud Models",
        "body": [
          "IaaS provides virtualized infrastructure, PaaS provides a managed platform, and SaaS provides a finished application.",
          "Public, private, hybrid, and community cloud models differ in ownership, control, and sharing.",
          "Shared responsibility changes depending on the service model, but customers always care about data, identity, and configuration."
        ],
        "remember": "As service models move toward SaaS, the provider manages more."
      },
      {
        "title": "Containers, Serverless, Virtualization",
        "body": [
          "Virtual machines emulate full systems, while containers package applications and dependencies with shared host resources.",
          "Serverless runs code in response to events without managing the underlying servers.",
          "Microservices split applications into smaller services that can be deployed and scaled independently."
        ],
        "remember": "Containers package apps; serverless reacts to events."
      },
      {
        "title": "Cloud Security Controls",
        "body": [
          "Cloud security uses IAM, network controls, encryption, logging, posture management, and secure configuration.",
          "CASB helps enforce policy between users and cloud services.",
          "Infrastructure as Code makes deployments repeatable but requires review to avoid repeating insecure settings."
        ],
        "remember": "Cloud misconfiguration is one of the most common cloud risks."
      },
      {
        "title": "Cloud Scenario Examples",
        "body": [],
        "remember": "Cloud questions often ask what layer the customer still controls.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A company wants managed email with minimal infrastructure duties. SaaS fits.",
              "Developers deploy repeatable network and compute settings from code. Think IaC.",
              "Security needs visibility and policy controls for cloud app usage. Think CASB."
            ]
          }
        ]
      },
      {
        "title": "Cloud Responsibility And Guardrails",
        "body": [
          "Cloud security depends on the service model: the provider manages more in SaaS and less in IaaS.",
          "Guardrails such as policy-as-code, CSPM, least-privilege roles, encryption defaults, and logging help prevent common cloud mistakes.",
          "Cloud-native breaches often begin with exposed storage, leaked keys, excessive permissions, or missing monitoring."
        ],
        "remember": "In cloud scenarios, ask who controls the layer and what guardrail would have prevented the mistake."
      }
    ]
  },
  {
    "id": "physical",
    "title": "Cybersecurity & Physical Security",
    "icon": "lock",
    "lessons": [
      {
        "title": "Data Destruction",
        "body": [
          "Paper can be destroyed by shredding, burning, or pulping depending on sensitivity and requirements.",
          "Media sanitization includes clearing, purging, cryptographic erase, degaussing, and destruction.",
          "Choose destruction when media is damaged, highly sensitive, or should never be reused."
        ],
        "remember": "Sanitize for reuse; destroy for no reuse."
      },
      {
        "title": "Physical Access Controls",
        "body": [
          "Physical controls include locks, guards, cameras, lighting, fencing, mantraps, badges, and visitor logs.",
          "Proximity card readers commonly use RFID to read a badge without direct contact.",
          "Biometrics, smart cards, and PINs can strengthen restricted-area access when used together."
        ],
        "remember": "Proximity badge equals RFID in many exam scenarios."
      },
      {
        "title": "Availability And Restoration",
        "body": [
          "Backups, RAID, redundant power, UPS, generators, and alternate sites support availability.",
          "Hot sites are ready to operate quickly, warm sites have partial resources ready, and cold sites provide basic space and utilities.",
          "RTO is how quickly service must be restored, and RPO is how much data loss is acceptable."
        ],
        "remember": "RTO is time to recover; RPO is data you can afford to lose."
      },
      {
        "title": "Physical Security Examples",
        "body": [],
        "remember": "Physical security questions often hide the answer in the facility or recovery wording.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A recovery facility has power and network circuits arranged but is not a live duplicate. That is closest to a warm site.",
              "A door unlocks when an employee holds a badge near the reader. RFID is the likely technology.",
              "A data center needs protection during a short power outage. Use a UPS."
            ]
          }
        ]
      },
      {
        "title": "Facilities, Environment, And Assets",
        "body": [
          "Physical security questions may involve people flow, environmental protection, equipment inventory, and recovery facilities.",
          "RFID and asset tags support inventory and loss detection; mantraps and access control vestibules reduce tailgating.",
          "Environmental controls include fire suppression, HVAC, humidity, power, UPS, generators, and water detection."
        ],
        "remember": "Physical controls protect availability as much as confidentiality."
      }
    ]
  },
  {
    "id": "assessment",
    "title": "Security Assessment",
    "icon": "chart",
    "lessons": [
      {
        "title": "Vulnerability Scanning",
        "body": [
          "A vulnerability scanner checks systems for known weaknesses, missing patches, misconfigurations, and risky services.",
          "Authenticated scans provide deeper results because the scanner can inspect local configuration.",
          "Findings should be prioritized by severity, exploitability, exposure, and business impact."
        ],
        "remember": "Scanning finds and ranks; remediation fixes."
      },
      {
        "title": "Logging And Event Management",
        "body": [
          "Logs record activity from systems, applications, security tools, and network devices.",
          "SIEM collects, correlates, alerts on, and helps analyze security events.",
          "SOAR automates response playbooks and can coordinate actions across tools."
        ],
        "remember": "SIEM sees and correlates; SOAR automates response."
      },
      {
        "title": "Penetration Testing And Threat Intel",
        "body": [
          "Penetration testing safely attempts to exploit weaknesses to prove real-world impact.",
          "Rules of engagement define scope, timing, allowed techniques, and communication expectations.",
          "Threat intelligence uses indicators, TTPs, advisories, and research to guide defense."
        ],
        "remember": "A scan reports likely weakness; a pen test demonstrates impact."
      },
      {
        "title": "Assessment Examples",
        "body": [],
        "remember": "Assessment questions ask whether you are finding, proving, correlating, or fixing.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A tool correlates firewall, endpoint, and authentication alerts. That is SIEM work.",
              "A tester must know what systems are in scope before exploitation. Use rules of engagement.",
              "A scanner logs into a host to inspect patch level. That is an authenticated scan."
            ]
          }
        ]
      },
      {
        "title": "SOC Triage And Vulnerability Management",
        "body": [
          "SOC analysts start by validating whether an alert is true, identifying affected assets, and estimating severity.",
          "Vulnerability management is a cycle: discover assets, scan, prioritize by risk, remediate or accept, then verify.",
          "CVSS helps describe technical severity, but business criticality, exploitability, exposure, and compensating controls drive priority."
        ],
        "remember": "Patch the riskiest reachable business-critical weaknesses first."
      }
    ]
  },
  {
    "id": "incident",
    "title": "Forensics & Incident Response",
    "icon": "exam",
    "lessons": [
      {
        "title": "IR Lifecycle",
        "body": [
          "Incident response preparation creates the team, plans, tools, playbooks, and communication paths before an incident.",
          "Identification confirms whether an event is an incident and starts triage.",
          "Containment, eradication, recovery, and lessons learned move from limiting damage to restoring operations and improving controls."
        ],
        "remember": "Prepare, identify, contain, eradicate, recover, learn."
      },
      {
        "title": "Containment And Eradication",
        "body": [
          "Containment isolates affected systems or accounts so damage does not spread.",
          "Eradication removes the root cause, such as malware, compromised credentials, or vulnerable services.",
          "Recovery restores systems carefully and monitors for signs that the incident returns."
        ],
        "remember": "Contain first to stop spread; eradicate to remove cause."
      },
      {
        "title": "Digital Forensics",
        "body": [
          "Digital forensics preserves, collects, analyzes, and reports evidence in a defensible way.",
          "Chain of custody documents who handled evidence, when, why, and how it was protected.",
          "Volatile data such as memory and running processes should be collected before less volatile evidence when appropriate."
        ],
        "remember": "Preserve evidence before analyzing it."
      },
      {
        "title": "IR Scenario Examples",
        "body": [],
        "remember": "IR questions often ask which step comes next.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A suspected infected laptop is removed from the network. That is containment.",
              "A malware persistence key is deleted after analysis. That is eradication.",
              "Every evidence transfer is logged with names and times. That supports chain of custody."
            ]
          }
        ]
      },
      {
        "title": "SOC Incident Workflow",
        "body": [
          "Incident response usually moves from preparation to detection, analysis, containment, eradication, recovery, and lessons learned.",
          "Containment should limit damage without destroying evidence needed for investigation.",
          "Chain of custody, time synchronization, and evidence integrity matter when an incident may become legal or regulatory."
        ],
        "remember": "Contain first when damage is active; preserve evidence when investigation matters."
      }
    ]
  },
  {
    "id": "governance",
    "title": "Standards & Policies",
    "icon": "cards",
    "lessons": [
      {
        "title": "Laws, Regulations, Standards",
        "body": [
          "Laws and regulations create mandatory requirements based on jurisdiction, industry, and data type.",
          "Standards and frameworks help organizations structure security programs and demonstrate due diligence.",
          "Non-compliance can lead to fines, sanctions, loss of license, contract issues, and reputation damage."
        ],
        "remember": "Compliance is about meeting required obligations, not just best effort."
      },
      {
        "title": "Frameworks And Configuration Guides",
        "body": [
          "Frameworks such as NIST, ISO, CIS, and COBIT provide organized security practices.",
          "Configuration guides and benchmarks translate policy into specific technical settings.",
          "Documentation supports consistency, audits, training, and incident response."
        ],
        "remember": "Frameworks organize; benchmarks configure."
      },
      {
        "title": "Policies And Training",
        "body": [
          "Policies set expectations, standards define requirements, procedures give steps, and guidelines give recommendations.",
          "Security awareness teaches users how to recognize phishing, protect credentials, report incidents, and handle data.",
          "Change management documents, reviews, approves, tests, and communicates planned changes."
        ],
        "remember": "Policy says what; procedure says how."
      },
      {
        "title": "Governance Examples",
        "body": [],
        "remember": "Governance questions are usually about documentation, approval, or accountability.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "A system must follow a specific hardening checklist. Use a configuration benchmark.",
              "Employees need steps for reporting suspicious email. Write or follow a procedure.",
              "A proposed firewall rule needs approval before production. Use change management."
            ]
          }
        ]
      },
      {
        "title": "Program Oversight And Assurance",
        "body": [
          "Governance questions ask who owns decisions, which policy applies, and how evidence proves the control is working.",
          "Audits, assessments, exceptions, risk registers, and metrics connect technical work to management oversight.",
          "Third-party risk requires due diligence before onboarding and ongoing monitoring after the contract is signed."
        ],
        "remember": "Policy says what; standards say how; procedures say step-by-step."
      }
    ]
  },
  {
    "id": "risk-privacy",
    "title": "Risk, Privacy & Breaches",
    "icon": "star",
    "lessons": [
      {
        "title": "Privacy Breaches",
        "body": [
          "A data breach is unauthorized release, disclosure, or access to protected or non-public information.",
          "Breaches can result from hacking, phishing, stolen devices, employee mistakes, weak policy, or control failure.",
          "Privacy programs protect PII through minimization, consent, notice, access controls, retention, and secure disposal."
        ],
        "remember": "PII needs protection across collection, use, storage, sharing, retention, and disposal."
      },
      {
        "title": "Risk Analysis",
        "body": [
          "Qualitative risk uses categories such as low, medium, and high; quantitative risk uses numbers and formulas.",
          "SLE equals asset value times exposure factor. ALE equals SLE times annual rate of occurrence.",
          "Risk register entries track threats, vulnerabilities, likelihood, impact, owners, and responses."
        ],
        "remember": "SLE is one loss; ALE is expected yearly loss."
      },
      {
        "title": "Risk Management And Continuity",
        "body": [
          "Risk responses include accept, avoid, transfer, mitigate, and sometimes share.",
          "Business continuity planning keeps critical functions operating during disruption.",
          "Disaster recovery focuses on restoring IT systems and data after a disruptive event."
        ],
        "remember": "BCP keeps business running; DR restores technology."
      },
      {
        "title": "Risk Scenario Examples",
        "body": [],
        "remember": "Risk questions often ask what the organization does with the risk, not only what caused it.",
        "sections": [
          {
            "title": "Examples",
            "items": [
              "Buying cyber insurance is risk transfer.",
              "Shutting down a risky legacy service is risk avoidance.",
              "Adding MFA to reduce account takeover is risk mitigation."
            ]
          }
        ]
      },
      {
        "title": "Risk, Privacy, And Business Impact",
        "body": [
          "Risk questions often include asset value, exposure factor, annualized rate of occurrence, RTO, RPO, or legal impact.",
          "Privacy scenarios focus on collection limits, consent, retention, minimization, breach notification, and cross-border transfer.",
          "A business impact analysis identifies critical functions, dependencies, acceptable downtime, and recovery priorities."
        ],
        "remember": "RTO is downtime; RPO is data loss."
      }
    ]
  }
];

const fullQuestionBank = [
  {
    "id": "principles-cia-1",
    "topic": "principles",
    "prompt": "A payroll report is accidentally posted on a public website. Which security principle is most directly violated?",
    "choices": [
      "Confidentiality",
      "Availability",
      "Non-repudiation",
      "Resilience"
    ],
    "answer": 0,
    "explanation": "Sensitive information was disclosed to unauthorized viewers, so confidentiality is the main issue."
  },
  {
    "id": "principles-cia-2",
    "topic": "principles",
    "prompt": "An attacker changes a shipping address in an order database without permission. Which principle is affected?",
    "choices": [
      "Integrity",
      "Availability",
      "Obfuscation",
      "Accounting"
    ],
    "answer": 0,
    "explanation": "Unauthorized modification is an integrity failure."
  },
  {
    "id": "principles-threat-1",
    "topic": "principles",
    "prompt": "Which term best describes a weakness that could be exploited?",
    "choices": [
      "Vulnerability",
      "Control",
      "Impact",
      "Asset"
    ],
    "answer": 0,
    "explanation": "A vulnerability is the weakness; a threat actor may exploit it."
  },
  {
    "id": "principles-social-1",
    "topic": "principles",
    "prompt": "A caller pretends to be help desk staff and asks for a user's MFA code. What attack type is this?",
    "choices": [
      "Vishing",
      "Smishing",
      "Tailgating",
      "Watering hole"
    ],
    "answer": 0,
    "explanation": "Voice-based social engineering is vishing."
  },
  {
    "id": "principles-malware-1",
    "topic": "principles",
    "prompt": "Which malware type commonly encrypts files and demands payment?",
    "choices": [
      "Ransomware",
      "Rootkit",
      "Spyware",
      "Logic bomb"
    ],
    "answer": 0,
    "explanation": "Ransomware denies access to data until a ransom is paid."
  },
  {
    "id": "principles-control-1",
    "topic": "principles",
    "prompt": "True or False: A guard at a building entrance is a physical security control.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Guards, locks, fences, and cameras are physical controls."
  },
  {
    "id": "iam-iaa-1",
    "topic": "iam",
    "prompt": "A username entered at a login prompt is an example of which IAM step?",
    "choices": [
      "Identification",
      "Authorization",
      "Accounting",
      "Federation"
    ],
    "answer": 0,
    "explanation": "The user is claiming an identity. Proof comes during authentication."
  },
  {
    "id": "iam-mfa-1",
    "topic": "iam",
    "prompt": "Which combination is the best example of multifactor authentication?",
    "choices": [
      "Password and authenticator app code",
      "Password and PIN",
      "Two different passwords",
      "Security questions and a password"
    ],
    "answer": 0,
    "explanation": "A password is something you know; an app code is tied to something you have."
  },
  {
    "id": "iam-radius-1",
    "topic": "iam",
    "prompt": "Which protocol commonly centralizes AAA for network access devices?",
    "choices": [
      "RADIUS",
      "SNMPv1",
      "SFTP",
      "SRTP"
    ],
    "answer": 0,
    "explanation": "RADIUS provides centralized authentication, authorization, and accounting."
  },
  {
    "id": "iam-access-1",
    "topic": "iam",
    "prompt": "A company grants permissions based on job titles such as Help Desk and HR Manager. Which model is this?",
    "choices": [
      "RBAC",
      "DAC",
      "MAC",
      "ABAC only"
    ],
    "answer": 0,
    "explanation": "Role-based access control maps permissions to roles."
  },
  {
    "id": "iam-account-1",
    "topic": "iam",
    "prompt": "Which action best supports least privilege for former employees?",
    "choices": [
      "Disable or remove stale accounts",
      "Increase password length only",
      "Add users to a shared group",
      "Turn off logging"
    ],
    "answer": 0,
    "explanation": "Inactive accounts should be disabled or removed so they cannot be abused."
  },
  {
    "id": "iam-bio-1",
    "topic": "iam",
    "prompt": "True or False: Biometric false acceptance means the system incorrectly accepts an unauthorized user.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "False acceptance is the dangerous case where the wrong person is accepted."
  },
  {
    "id": "crypto-service-1",
    "topic": "crypto",
    "prompt": "Which cryptographic service prevents a sender from credibly denying that they sent a signed message?",
    "choices": [
      "Non-repudiation",
      "Obfuscation",
      "Availability",
      "Tokenization"
    ],
    "answer": 0,
    "explanation": "Digital signatures support non-repudiation."
  },
  {
    "id": "crypto-hash-1",
    "topic": "crypto",
    "prompt": "Which control best detects whether a downloaded file changed after publication?",
    "choices": [
      "Hash checksum",
      "Symmetric encryption",
      "Steganography",
      "Key escrow"
    ],
    "answer": 0,
    "explanation": "A hash changes when the file changes."
  },
  {
    "id": "crypto-sym-1",
    "topic": "crypto",
    "prompt": "Which statement best describes symmetric encryption?",
    "choices": [
      "The same secret key encrypts and decrypts",
      "Only a public key is used",
      "No key is required",
      "It only creates digests"
    ],
    "answer": 0,
    "explanation": "Symmetric encryption uses one shared secret key."
  },
  {
    "id": "crypto-cert-1",
    "topic": "crypto",
    "prompt": "What does a digital certificate bind to an identity?",
    "choices": [
      "A public key",
      "A VLAN",
      "A firewall rule",
      "A backup set"
    ],
    "answer": 0,
    "explanation": "Certificates associate a subject identity with a public key."
  },
  {
    "id": "crypto-revoke-1",
    "topic": "crypto",
    "prompt": "Which service can provide near real-time certificate revocation status?",
    "choices": [
      "OCSP",
      "NAT",
      "RADIUS",
      "ARP"
    ],
    "answer": 0,
    "explanation": "OCSP checks certificate status without downloading a full CRL."
  },
  {
    "id": "crypto-sign-1",
    "topic": "crypto",
    "prompt": "True or False: Hashing by itself provides confidentiality.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "Hashing supports integrity, not secrecy. Encryption protects confidentiality."
  },
  {
    "id": "netatt-ddos-1",
    "topic": "network-attacks",
    "prompt": "A website is overwhelmed by traffic from thousands of compromised systems. What attack is this?",
    "choices": [
      "DDoS",
      "ARP poisoning",
      "DNSSEC",
      "Bluejacking"
    ],
    "answer": 0,
    "explanation": "Distributed denial-of-service uses many systems to disrupt availability."
  },
  {
    "id": "netatt-arp-1",
    "topic": "network-attacks",
    "prompt": "An attacker tricks hosts into associating the gateway IP with the attacker's MAC address. What is this?",
    "choices": [
      "ARP poisoning",
      "Domain hijacking",
      "SFTP",
      "DNSSEC"
    ],
    "answer": 0,
    "explanation": "ARP poisoning manipulates IP-to-MAC mappings."
  },
  {
    "id": "netatt-proto-1",
    "topic": "network-attacks",
    "prompt": "Which protocol is the secure replacement for Telnet-style remote shell access?",
    "choices": [
      "SSH",
      "POP3",
      "SNMPv1",
      "HTTP"
    ],
    "answer": 0,
    "explanation": "SSH encrypts remote command-line access."
  },
  {
    "id": "netatt-proto-2",
    "topic": "network-attacks",
    "prompt": "Which protocol protects web browsing with TLS?",
    "choices": [
      "HTTPS",
      "HTTP",
      "TFTP",
      "LDAP"
    ],
    "answer": 0,
    "explanation": "HTTPS is HTTP over TLS."
  },
  {
    "id": "netatt-replay-1",
    "topic": "network-attacks",
    "prompt": "Captured valid authentication traffic is resent later to gain access. What attack is this?",
    "choices": [
      "Replay attack",
      "DNS poisoning",
      "Jamming",
      "Integer overflow"
    ],
    "answer": 0,
    "explanation": "Replay attacks reuse captured valid data."
  },
  {
    "id": "netatt-snmp-1",
    "topic": "network-attacks",
    "prompt": "True or False: SNMPv3 can provide authentication and encryption.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "SNMPv3 adds security features missing from older versions."
  },
  {
    "id": "netdesign-dmz-1",
    "topic": "network-design",
    "prompt": "Where should a public web server commonly be placed to protect the internal LAN?",
    "choices": [
      "DMZ",
      "Trusted user VLAN",
      "Backup network only",
      "Management plane"
    ],
    "answer": 0,
    "explanation": "A DMZ separates public-facing services from the trusted internal network."
  },
  {
    "id": "netdesign-ids-1",
    "topic": "network-design",
    "prompt": "Which tool detects suspicious traffic and alerts but does not block inline by itself?",
    "choices": [
      "IDS",
      "IPS",
      "NAT",
      "Load balancer"
    ],
    "answer": 0,
    "explanation": "An IDS detects and alerts. An IPS can block."
  },
  {
    "id": "netdesign-vpn-1",
    "topic": "network-design",
    "prompt": "A branch office needs encrypted connectivity to headquarters over the internet. What is the best fit?",
    "choices": [
      "Site-to-site VPN",
      "Open guest Wi-Fi",
      "MAC flooding",
      "Cold site"
    ],
    "answer": 0,
    "explanation": "A site-to-site VPN connects networks through an encrypted tunnel."
  },
  {
    "id": "netdesign-zero-1",
    "topic": "network-design",
    "prompt": "Which phrase best matches zero trust?",
    "choices": [
      "Never trust automatically; verify explicitly",
      "Trust anything inside the LAN",
      "Disable identity checks after login",
      "Use one shared admin account"
    ],
    "answer": 0,
    "explanation": "Zero trust continuously verifies identity, device, and context."
  },
  {
    "id": "netdesign-port-1",
    "topic": "network-design",
    "prompt": "Which control can stop unknown laptops from using a switch port?",
    "choices": [
      "802.1X",
      "SRTP",
      "OCSP",
      "Hashing"
    ],
    "answer": 0,
    "explanation": "802.1X can authenticate devices before allowing network access."
  },
  {
    "id": "netdesign-ips-1",
    "topic": "network-design",
    "prompt": "True or False: An IPS is normally positioned inline so it can block malicious traffic.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "IPS devices can prevent traffic because they sit inline."
  },
  {
    "id": "wireless-rfid-1",
    "topic": "wireless",
    "prompt": "Which technology is commonly used by proximity badge readers?",
    "choices": [
      "RFID",
      "SFTP",
      "SAML",
      "BGP"
    ],
    "answer": 0,
    "explanation": "RFID enables contactless badge or tag reading at short range."
  },
  {
    "id": "wireless-mdm-1",
    "topic": "wireless",
    "prompt": "A lost company phone must be remotely wiped. Which tool category is the best fit?",
    "choices": [
      "MDM/UEM",
      "SIEM only",
      "Load balancer",
      "Degaussing wand"
    ],
    "answer": 0,
    "explanation": "MDM or UEM can enforce policy and remotely wipe mobile devices."
  },
  {
    "id": "wireless-evil-1",
    "topic": "wireless",
    "prompt": "A fake access point copies the coffee shop SSID to capture user traffic. What is this called?",
    "choices": [
      "Evil twin",
      "Bluesnarfing",
      "RFID cloning only",
      "Geofencing"
    ],
    "answer": 0,
    "explanation": "An evil twin AP impersonates a legitimate wireless network."
  },
  {
    "id": "wireless-enterprise-1",
    "topic": "wireless",
    "prompt": "Which pairing is common for enterprise Wi-Fi authentication?",
    "choices": [
      "802.1X and RADIUS",
      "HTTP and Telnet",
      "WEP and shared admin",
      "FTP and SNMPv1"
    ],
    "answer": 0,
    "explanation": "802.1X with RADIUS centralizes enterprise wireless authentication."
  },
  {
    "id": "wireless-iot-1",
    "topic": "wireless",
    "prompt": "What is usually the safest first network design choice for unmanaged IoT devices?",
    "choices": [
      "Segment them from trusted systems",
      "Place them on the domain controller subnet",
      "Disable all logging",
      "Give them shared admin credentials"
    ],
    "answer": 0,
    "explanation": "IoT devices should often be isolated because they may be hard to manage or patch."
  },
  {
    "id": "wireless-wpa-1",
    "topic": "wireless",
    "prompt": "True or False: WPA3 is generally preferred over WEP for Wi-Fi security.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "WEP is obsolete and weak; WPA3 is a modern option."
  },
  {
    "id": "appatt-xss-1",
    "topic": "app-attacks",
    "prompt": "A forum stores a script in a comment, and the script runs in other users' browsers. What attack is this?",
    "choices": [
      "Stored XSS",
      "SSRF",
      "Race condition",
      "Degaussing"
    ],
    "answer": 0,
    "explanation": "Stored XSS persists malicious script that executes for later viewers."
  },
  {
    "id": "appatt-sqli-1",
    "topic": "app-attacks",
    "prompt": "Which control best reduces SQL injection risk?",
    "choices": [
      "Prepared statements",
      "Open directory listing",
      "Plaintext cookies",
      "More verbose errors"
    ],
    "answer": 0,
    "explanation": "Prepared statements separate code from data."
  },
  {
    "id": "appatt-ssrf-1",
    "topic": "app-attacks",
    "prompt": "An attacker makes a web server request a private metadata URL. Which attack is most likely?",
    "choices": [
      "SSRF",
      "CSRF",
      "Smishing",
      "Jamming"
    ],
    "answer": 0,
    "explanation": "Server-side request forgery abuses the server to make requests."
  },
  {
    "id": "appatt-dir-1",
    "topic": "app-attacks",
    "prompt": "A URL uses ../../ to reach files outside the web directory. What vulnerability is being exploited?",
    "choices": [
      "Directory traversal",
      "MAC flooding",
      "Bluejacking",
      "Key stretching"
    ],
    "answer": 0,
    "explanation": "Directory traversal manipulates file paths."
  },
  {
    "id": "appatt-race-1",
    "topic": "app-attacks",
    "prompt": "A flaw appears only when two requests hit a balance update at nearly the same time. What is this?",
    "choices": [
      "Race condition",
      "Steganography",
      "Credential stuffing",
      "Cold backup"
    ],
    "answer": 0,
    "explanation": "Race conditions depend on timing between operations."
  },
  {
    "id": "appatt-replay-1",
    "topic": "app-attacks",
    "prompt": "True or False: Pass-the-hash reuses a captured password hash instead of requiring the plaintext password.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Pass-the-hash abuses the hash as an authentication secret."
  },
  {
    "id": "secdev-env-1",
    "topic": "secure-dev",
    "prompt": "Which environment should most closely mirror production for final release rehearsal?",
    "choices": [
      "Staging",
      "Development",
      "Sandbox only",
      "Personal laptop"
    ],
    "answer": 0,
    "explanation": "Staging is the pre-production environment used to validate release readiness."
  },
  {
    "id": "secdev-sast-1",
    "topic": "secure-dev",
    "prompt": "A tool scans source code before the app runs. What testing type is this?",
    "choices": [
      "SAST",
      "DAST",
      "Jamming",
      "Hot site"
    ],
    "answer": 0,
    "explanation": "SAST analyzes static source or binaries before runtime."
  },
  {
    "id": "secdev-dast-1",
    "topic": "secure-dev",
    "prompt": "A scanner tests a running web application from the outside. What is this?",
    "choices": [
      "DAST",
      "SAST",
      "PKI",
      "RTO"
    ],
    "answer": 0,
    "explanation": "DAST tests the running application behavior."
  },
  {
    "id": "secdev-fuzz-1",
    "topic": "secure-dev",
    "prompt": "Random malformed inputs are sent to a parser to find crashes. What technique is this?",
    "choices": [
      "Fuzzing",
      "Hashing",
      "Federation",
      "Tokenization"
    ],
    "answer": 0,
    "explanation": "Fuzzing uses unexpected input to uncover weaknesses."
  },
  {
    "id": "secdev-secret-1",
    "topic": "secure-dev",
    "prompt": "Where should application database passwords usually be stored?",
    "choices": [
      "Secrets manager or vault",
      "Hardcoded in source",
      "Public README",
      "Browser title"
    ],
    "answer": 0,
    "explanation": "Secrets should be protected outside source code."
  },
  {
    "id": "secdev-prod-1",
    "topic": "secure-dev",
    "prompt": "True or False: Production is the safest place to test unreviewed code changes.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "Unreviewed changes should be tested before production."
  },
  {
    "id": "endpoint-edr-1",
    "topic": "endpoint",
    "prompt": "Which tool category provides endpoint telemetry for detection, investigation, and response?",
    "choices": [
      "EDR",
      "NAT",
      "CRL",
      "RA"
    ],
    "answer": 0,
    "explanation": "EDR focuses on endpoint detection and response."
  },
  {
    "id": "endpoint-dlp-1",
    "topic": "endpoint",
    "prompt": "Which control helps prevent sensitive files from being copied to unauthorized locations?",
    "choices": [
      "DLP",
      "DHCP",
      "WEP",
      "SLA"
    ],
    "answer": 0,
    "explanation": "Data loss prevention monitors or blocks sensitive data movement."
  },
  {
    "id": "endpoint-hard-1",
    "topic": "endpoint",
    "prompt": "Which action reduces attack surface on a server?",
    "choices": [
      "Disable unnecessary services",
      "Enable every demo account",
      "Expose all ports",
      "Skip patches"
    ],
    "answer": 0,
    "explanation": "Removing unused services and ports reduces exposure."
  },
  {
    "id": "endpoint-disk-1",
    "topic": "endpoint",
    "prompt": "A laptop containing customer records is stolen. Which control most directly protects the stored data?",
    "choices": [
      "Full-disk encryption",
      "Load balancing",
      "Geofencing only",
      "Open guest Wi-Fi"
    ],
    "answer": 0,
    "explanation": "Full-disk encryption protects data at rest on the device."
  },
  {
    "id": "endpoint-boot-1",
    "topic": "endpoint",
    "prompt": "Which technology helps verify trusted components during startup?",
    "choices": [
      "Secure boot",
      "SSRF",
      "Vishing",
      "Degaussing"
    ],
    "answer": 0,
    "explanation": "Secure boot helps ensure trusted boot components load."
  },
  {
    "id": "endpoint-patch-1",
    "topic": "endpoint",
    "prompt": "True or False: Patch management should include operating systems, applications, firmware, and drivers.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Known vulnerabilities can exist across all of those layers."
  },
  {
    "id": "cloud-model-1",
    "topic": "cloud-security",
    "prompt": "A managed email service used through a browser is which cloud service model?",
    "choices": [
      "SaaS",
      "IaaS",
      "PaaS",
      "VLAN"
    ],
    "answer": 0,
    "explanation": "SaaS delivers a finished application."
  },
  {
    "id": "cloud-shared-1",
    "topic": "cloud-security",
    "prompt": "In most cloud models, which responsibility always remains important for the customer?",
    "choices": [
      "Protecting data and identities",
      "Owning every datacenter",
      "Replacing the provider's generators",
      "Managing all physical disks"
    ],
    "answer": 0,
    "explanation": "Customers retain responsibility for data, accounts, and configuration choices."
  },
  {
    "id": "cloud-container-1",
    "topic": "cloud-security",
    "prompt": "Which option packages an application and its dependencies while sharing the host OS kernel?",
    "choices": [
      "Container",
      "Full physical server",
      "Paper record",
      "Warm site"
    ],
    "answer": 0,
    "explanation": "Containers package apps and dependencies with shared host resources."
  },
  {
    "id": "cloud-serverless-1",
    "topic": "cloud-security",
    "prompt": "Code runs when an event occurs and the team does not manage servers. What model fits?",
    "choices": [
      "Serverless",
      "Cold site",
      "MAC flooding",
      "Degaussing"
    ],
    "answer": 0,
    "explanation": "Serverless functions are event-driven and abstract server management."
  },
  {
    "id": "cloud-casb-1",
    "topic": "cloud-security",
    "prompt": "Which tool category enforces policy between users and cloud applications?",
    "choices": [
      "CASB",
      "UPS",
      "RAID",
      "OCSP"
    ],
    "answer": 0,
    "explanation": "A cloud access security broker mediates policy for cloud service use."
  },
  {
    "id": "cloud-iac-1",
    "topic": "cloud-security",
    "prompt": "True or False: Infrastructure as Code can repeat insecure settings if templates are not reviewed.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "IaC makes deployment repeatable, including mistakes."
  },
  {
    "id": "physical-rfid-1",
    "topic": "physical",
    "prompt": "A door unlocks when an employee holds a badge near a reader. What technology is most likely used?",
    "choices": [
      "RFID",
      "Magnetic stripe only",
      "Biometric iris scan",
      "Infrared camera only"
    ],
    "answer": 0,
    "explanation": "Proximity readers commonly use RFID."
  },
  {
    "id": "physical-site-1",
    "topic": "physical",
    "prompt": "A company arranges a recovery facility with utilities and network links ready, but it is not a fully live duplicate. Which site type is closest?",
    "choices": [
      "Warm site",
      "Hot site",
      "Cold site",
      "MOU site"
    ],
    "answer": 0,
    "explanation": "A warm site has some resources ready but is not fully operational like a hot site."
  },
  {
    "id": "physical-rto-1",
    "topic": "physical",
    "prompt": "Which metric describes how quickly a service must be restored after disruption?",
    "choices": [
      "RTO",
      "RPO",
      "MTBF",
      "SLE"
    ],
    "answer": 0,
    "explanation": "Recovery time objective is the target time to restore service."
  },
  {
    "id": "physical-rpo-1",
    "topic": "physical",
    "prompt": "Which metric describes the maximum acceptable data loss measured in time?",
    "choices": [
      "RPO",
      "RTO",
      "ALE",
      "MTTR"
    ],
    "answer": 0,
    "explanation": "Recovery point objective is about how much data can be lost."
  },
  {
    "id": "physical-ups-1",
    "topic": "physical",
    "prompt": "Which device provides short-term power during an outage until generators or shutdown procedures take over?",
    "choices": [
      "UPS",
      "DLP",
      "CASB",
      "CRL"
    ],
    "answer": 0,
    "explanation": "A UPS provides temporary battery power."
  },
  {
    "id": "physical-destroy-1",
    "topic": "physical",
    "prompt": "True or False: Degaussing is appropriate for all solid-state drives.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "Degaussing targets magnetic media and is not reliable for SSD storage."
  },
  {
    "id": "assessment-scan-1",
    "topic": "assessment",
    "prompt": "What is the main purpose of a vulnerability scanner?",
    "choices": [
      "Identify and prioritize known weaknesses",
      "Guarantee no breaches can happen",
      "Replace all patches automatically",
      "Write security policy"
    ],
    "answer": 0,
    "explanation": "Scanners find and rank likely weaknesses; humans or tools still remediate."
  },
  {
    "id": "assessment-authscan-1",
    "topic": "assessment",
    "prompt": "Why can an authenticated vulnerability scan provide deeper results?",
    "choices": [
      "It can inspect local configuration",
      "It never needs permission",
      "It blocks all attacks inline",
      "It replaces backups"
    ],
    "answer": 0,
    "explanation": "Credentials let the scanner see patch levels and settings more accurately."
  },
  {
    "id": "assessment-siem-1",
    "topic": "assessment",
    "prompt": "Which system correlates events from many sources to alert on suspicious activity?",
    "choices": [
      "SIEM",
      "RFID",
      "UPS",
      "NFC"
    ],
    "answer": 0,
    "explanation": "SIEM collects and correlates logs and events."
  },
  {
    "id": "assessment-soar-1",
    "topic": "assessment",
    "prompt": "Which tool category automates response playbooks across security tools?",
    "choices": [
      "SOAR",
      "SFTP",
      "RAID",
      "NAT"
    ],
    "answer": 0,
    "explanation": "SOAR automates and orchestrates security response."
  },
  {
    "id": "assessment-roe-1",
    "topic": "assessment",
    "prompt": "What document defines penetration test scope, timing, and allowed techniques?",
    "choices": [
      "Rules of engagement",
      "Chain of custody",
      "RPO worksheet",
      "Certificate signing request"
    ],
    "answer": 0,
    "explanation": "Rules of engagement set the boundaries for a penetration test."
  },
  {
    "id": "assessment-pentest-1",
    "topic": "assessment",
    "prompt": "True or False: A penetration test attempts to demonstrate real-world exploitability within an approved scope.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Pen tests safely validate impact under agreed rules."
  },
  {
    "id": "incident-step-1",
    "topic": "incident",
    "prompt": "An analyst disconnects an infected workstation from the network. Which IR phase is this?",
    "choices": [
      "Containment",
      "Preparation",
      "Lessons learned",
      "Risk acceptance"
    ],
    "answer": 0,
    "explanation": "Containment limits spread and damage."
  },
  {
    "id": "incident-erad-1",
    "topic": "incident",
    "prompt": "After containment, the team removes malware persistence and resets compromised credentials. Which phase is this?",
    "choices": [
      "Eradication",
      "Identification only",
      "Tabletop exercise",
      "Data classification"
    ],
    "answer": 0,
    "explanation": "Eradication removes the cause of the incident."
  },
  {
    "id": "incident-chain-1",
    "topic": "incident",
    "prompt": "Which documentation proves who handled evidence and when?",
    "choices": [
      "Chain of custody",
      "Acceptable use policy",
      "RTO",
      "SAML assertion"
    ],
    "answer": 0,
    "explanation": "Chain of custody tracks evidence handling."
  },
  {
    "id": "incident-vol-1",
    "topic": "incident",
    "prompt": "Which evidence is usually more volatile and should often be collected early?",
    "choices": [
      "Memory contents",
      "Archived tape backup",
      "Printed policy",
      "Destroyed drive platter"
    ],
    "answer": 0,
    "explanation": "Memory and running processes can disappear when a system powers off."
  },
  {
    "id": "incident-prep-1",
    "topic": "incident",
    "prompt": "What is the main output of incident response preparation?",
    "choices": [
      "Incident response plan",
      "Encryption key only",
      "Public DNS record",
      "Invoice"
    ],
    "answer": 0,
    "explanation": "Preparation creates the plan, team roles, tools, and procedures."
  },
  {
    "id": "incident-learn-1",
    "topic": "incident",
    "prompt": "True or False: Lessons learned should be skipped once systems are restored.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 1,
    "explanation": "Lessons learned improves future prevention and response."
  },
  {
    "id": "governance-policy-1",
    "topic": "governance",
    "prompt": "Which document type usually states management expectations at a high level?",
    "choices": [
      "Policy",
      "Procedure",
      "Packet capture",
      "Hash digest"
    ],
    "answer": 0,
    "explanation": "Policies state what is required or expected."
  },
  {
    "id": "governance-proc-1",
    "topic": "governance",
    "prompt": "Which document gives step-by-step instructions for completing a task?",
    "choices": [
      "Procedure",
      "Law",
      "Asset value",
      "Certificate"
    ],
    "answer": 0,
    "explanation": "Procedures describe how to perform tasks."
  },
  {
    "id": "governance-bench-1",
    "topic": "governance",
    "prompt": "A server must be configured according to a detailed CIS checklist. What is being used?",
    "choices": [
      "Configuration benchmark",
      "Evil twin",
      "Warm site",
      "Data breach"
    ],
    "answer": 0,
    "explanation": "Benchmarks provide specific secure configuration settings."
  },
  {
    "id": "governance-change-1",
    "topic": "governance",
    "prompt": "Which process reviews and approves a firewall rule before it is deployed?",
    "choices": [
      "Change management",
      "Degaussing",
      "Phishing",
      "Key stretching"
    ],
    "answer": 0,
    "explanation": "Change management controls planned production changes."
  },
  {
    "id": "governance-training-1",
    "topic": "governance",
    "prompt": "Which activity best reduces employee susceptibility to phishing?",
    "choices": [
      "Security awareness training",
      "Turning off all logs",
      "Disabling MFA",
      "Using WEP"
    ],
    "answer": 0,
    "explanation": "Awareness training teaches users to recognize and report suspicious messages."
  },
  {
    "id": "governance-due-1",
    "topic": "governance",
    "prompt": "True or False: Due care is about implementing and maintaining reasonable controls.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "Due care is the action of maintaining appropriate safeguards."
  },
  {
    "id": "risk-breach-1",
    "topic": "risk-privacy",
    "prompt": "Which event is a privacy breach?",
    "choices": [
      "Unauthorized access to customer PII",
      "A scheduled patch window",
      "A successful backup test",
      "A public product brochure"
    ],
    "answer": 0,
    "explanation": "Unauthorized access to protected personal information is a breach."
  },
  {
    "id": "risk-sle-1",
    "topic": "risk-privacy",
    "prompt": "An asset is worth $20,000 and the exposure factor is 25%. What is the SLE?",
    "choices": [
      "$5,000",
      "$20,025",
      "$80,000",
      "$500"
    ],
    "answer": 0,
    "explanation": "SLE equals asset value times exposure factor: 20,000 x 0.25 = 5,000."
  },
  {
    "id": "risk-ale-1",
    "topic": "risk-privacy",
    "prompt": "SLE is $5,000 and the annual rate of occurrence is 4. What is the ALE?",
    "choices": [
      "$20,000",
      "$1,250",
      "$5,004",
      "$4,995"
    ],
    "answer": 0,
    "explanation": "ALE equals SLE times ARO: 5,000 x 4 = 20,000."
  },
  {
    "id": "risk-transfer-1",
    "topic": "risk-privacy",
    "prompt": "Buying cyber insurance is primarily which risk response?",
    "choices": [
      "Transfer",
      "Avoid",
      "Accept",
      "Ignore"
    ],
    "answer": 0,
    "explanation": "Insurance transfers some financial impact to another party."
  },
  {
    "id": "risk-bcp-1",
    "topic": "risk-privacy",
    "prompt": "Which plan focuses on keeping critical business functions operating during a disruption?",
    "choices": [
      "Business continuity plan",
      "Certificate policy",
      "Password blacklist",
      "Vulnerability disclosure only"
    ],
    "answer": 0,
    "explanation": "BCP focuses on business operations during disruption."
  },
  {
    "id": "risk-dr-1",
    "topic": "risk-privacy",
    "prompt": "True or False: Disaster recovery focuses on restoring IT systems and data after a disruptive event.",
    "choices": [
      "True",
      "False"
    ],
    "answer": 0,
    "explanation": "DR is the technology recovery side of resilience."
  },
  {
    "id": "crypto-salt-1",
    "topic": "crypto",
    "prompt": "Before storing password digests, an engineer adds a unique random value to each password. Which protection is being used?",
    "choices": [
      "Salting",
      "Tokenization",
      "Steganography",
      "Code signing"
    ],
    "answer": 0,
    "explanation": "A salt is a unique value added before hashing so identical passwords do not produce identical hashes."
  },
  {
    "id": "crypto-stretch-1",
    "topic": "crypto",
    "prompt": "A password storage system intentionally runs many hash rounds to slow offline cracking attempts. What technique is this?",
    "choices": [
      "Key stretching",
      "Steganography",
      "Quarantine",
      "Degaussing"
    ],
    "answer": 0,
    "explanation": "Key stretching makes each password guess more expensive for an attacker."
  },
  {
    "id": "secdev-fuzz-2",
    "topic": "secure-dev",
    "prompt": "A tester sends malformed strings, long values, and unexpected characters to a running service. Which analysis category best fits?",
    "choices": [
      "Dynamic analysis",
      "Static analysis",
      "Manual code review",
      "Data retention"
    ],
    "answer": 0,
    "explanation": "Fuzzing exercises a running target, so it is a form of dynamic analysis."
  },
  {
    "id": "appatt-input-2",
    "topic": "app-attacks",
    "prompt": "A shopping site wants one control that helps reduce both script injection and database injection risk. What should it emphasize first?",
    "choices": [
      "Input validation",
      "More detailed error messages",
      "Code signing only",
      "A bigger load balancer"
    ],
    "answer": 0,
    "explanation": "Validation and safe handling of input are core defenses against injection-style attacks."
  },
  {
    "id": "secdev-codesign-1",
    "topic": "secure-dev",
    "prompt": "A workstation policy allows only digitally signed installers. What is the main benefit?",
    "choices": [
      "It helps verify the software publisher and integrity",
      "It guarantees the program is malware-free",
      "It makes applications run faster",
      "It replaces patch management"
    ],
    "answer": 0,
    "explanation": "Code signing helps identify the signer and detect tampering, but it is not an absolute malware guarantee."
  },
  {
    "id": "endpoint-ports-2",
    "topic": "endpoint",
    "prompt": "A Linux hardening checklist removes unused daemons and closes their listening ports. What is the main security purpose?",
    "choices": [
      "Reduce attack surface",
      "Speed up port scans",
      "Increase log volume",
      "Consume default ports"
    ],
    "answer": 0,
    "explanation": "Fewer exposed services means fewer entry points for attackers."
  },
  {
    "id": "endpoint-allowlist-1",
    "topic": "endpoint",
    "prompt": "A control permits only approved application hashes to execute on laptops. What type of control is this?",
    "choices": [
      "Application allowlisting",
      "Antivirus quarantine",
      "Blacklisting",
      "Full-disk encryption"
    ],
    "answer": 0,
    "explanation": "Allowlisting defines what is allowed to run instead of only blocking known-bad software."
  },
  {
    "id": "endpoint-legacy-1",
    "topic": "endpoint",
    "prompt": "Why do security teams worry about legacy hardware that is still important to the business?",
    "choices": [
      "Vendor support and security updates may no longer be available",
      "It always has stronger encryption",
      "It cannot connect to networks",
      "It automatically supports modern protocols"
    ],
    "answer": 0,
    "explanation": "Legacy hardware often becomes risky because patches, parts, and vendor support disappear."
  },
  {
    "id": "cloud-edge-1",
    "topic": "cloud-security",
    "prompt": "A factory places compute nodes near production equipment so sensor data can be processed with very low latency. What design is this?",
    "choices": [
      "Edge computing",
      "Hybrid cloud only",
      "Mist computing",
      "Centralized SaaS"
    ],
    "answer": 0,
    "explanation": "Edge computing moves compute close to where data is created or used."
  },
  {
    "id": "wireless-byod-container-1",
    "topic": "wireless",
    "prompt": "A BYOD program needs corporate apps and files kept separate from personal apps on the same phone. Which feature best supports that?",
    "choices": [
      "Mobile containerization",
      "Full public Wi-Fi access",
      "A Faraday cage",
      "A warm site"
    ],
    "answer": 0,
    "explanation": "Mobile containers separate managed business data from personal device space."
  },
  {
    "id": "cloud-thin-client-1",
    "topic": "cloud-security",
    "prompt": "Users receive lightweight workstations that load applications and data from a central server instead of local drives. What model is this?",
    "choices": [
      "Thin clients",
      "Thick clients",
      "Client-as-a-server",
      "Standalone desktops"
    ],
    "answer": 0,
    "explanation": "Thin clients rely on central resources rather than doing most work locally."
  },
  {
    "id": "cloud-container-os-1",
    "topic": "cloud-security",
    "prompt": "An application container includes the app, libraries, and configuration files. What is normally not packaged as a full separate component inside it?",
    "choices": [
      "The full operating system kernel",
      "The application",
      "Needed libraries",
      "Configuration files"
    ],
    "answer": 0,
    "explanation": "Containers share the host OS kernel; they do not bundle a full guest operating system like a VM."
  },
  {
    "id": "cloud-saas-2",
    "topic": "cloud-security",
    "prompt": "Which service model lets customers use a provider's finished application through the internet?",
    "choices": [
      "SaaS",
      "PaaS",
      "IaaS",
      "Hybrid"
    ],
    "answer": 0,
    "explanation": "SaaS is complete software delivered as a service."
  },
  {
    "id": "cloud-paas-2",
    "topic": "cloud-security",
    "prompt": "Which cloud model gives developers a managed place to build and deploy applications without managing the underlying OS?",
    "choices": [
      "PaaS",
      "SaaS",
      "IaaS",
      "IDaaS"
    ],
    "answer": 0,
    "explanation": "PaaS provides a managed application platform."
  },
  {
    "id": "cloud-iaas-2",
    "topic": "cloud-security",
    "prompt": "A Windows-based development team needs temporary Linux servers now and similar Linux servers later in production. Which cloud model best fits?",
    "choices": [
      "IaaS",
      "SaaS",
      "DLP",
      "CASB"
    ],
    "answer": 0,
    "explanation": "IaaS lets the team provision virtual machines and control the operating system."
  },
  {
    "id": "physical-spof-1",
    "topic": "physical",
    "prompt": "All internet traffic for a company depends on one circuit and one router. What risk does this create?",
    "choices": [
      "Single point of failure",
      "Load balancing",
      "Virtualization",
      "Tokenization"
    ],
    "answer": 0,
    "explanation": "If that single dependency fails, the whole connection is affected."
  },
  {
    "id": "physical-vestibule-1",
    "topic": "physical",
    "prompt": "Which physical control is designed to stop tailgating by allowing one person through a controlled space at a time?",
    "choices": [
      "Access control vestibule",
      "Bollards",
      "Video surveillance only",
      "RFID asset tag"
    ],
    "answer": 0,
    "explanation": "An access control vestibule, also called a mantrap, helps prevent tailgating."
  },
  {
    "id": "physical-differential-1",
    "topic": "physical",
    "prompt": "A full backup runs Sunday and differential backups run the other days. On Thursday, how many backup sets are normally needed to restore?",
    "choices": [
      "Two",
      "One",
      "Three",
      "Four"
    ],
    "answer": 0,
    "explanation": "Differential restore uses the last full backup plus the most recent differential backup."
  },
  {
    "id": "physical-faraday-1",
    "topic": "physical",
    "prompt": "A server room must reduce electromagnetic interference against a sensitive key management server. What protection best fits?",
    "choices": [
      "Faraday cage",
      "VLAN",
      "TPM",
      "SDN"
    ],
    "answer": 0,
    "explanation": "A Faraday cage shields equipment from electromagnetic signals."
  },
  {
    "id": "wireless-usb-blocker-1",
    "topic": "wireless",
    "prompt": "A traveler wants to charge a phone from an untrusted USB charger while blocking data pins. What device should she use?",
    "choices": [
      "USB data blocker",
      "Parallel USB cable",
      "HOTP interrogator",
      "Data circuit breaker"
    ],
    "answer": 0,
    "explanation": "A USB data blocker allows power while preventing data transfer."
  },
  {
    "id": "assessment-darkweb-1",
    "topic": "assessment",
    "prompt": "A researcher uses Tor to view breach markets and leaked data posted by criminals. What source is being used?",
    "choices": [
      "The dark web",
      "A formal information-sharing organization",
      "A proprietary vendor report",
      "A firewall log"
    ],
    "answer": 0,
    "explanation": "Hidden services accessed through Tor are commonly associated with dark web research."
  },
  {
    "id": "assessment-known-env-1",
    "topic": "assessment",
    "prompt": "A penetration tester is given full diagrams, accounts, system lists, and configuration details before testing. What test type is this?",
    "choices": [
      "Known environment test",
      "Unknown environment test",
      "Partially known environment test",
      "Third-party test only"
    ],
    "answer": 0,
    "explanation": "A known environment test gives the tester detailed internal knowledge."
  },
  {
    "id": "assessment-footprint-1",
    "topic": "assessment",
    "prompt": "During reconnaissance, a tester gathers domains, IP ranges, phone numbers, and public employee details. What is this called?",
    "choices": [
      "Footprinting",
      "Fingerprinting",
      "Containment",
      "Aggregation only"
    ],
    "answer": 0,
    "explanation": "Footprinting is broad information gathering about a target before deeper testing."
  },
  {
    "id": "assessment-honeynet-1",
    "topic": "assessment",
    "prompt": "A security team builds a nonproduction network of decoy systems to observe attacker behavior. What is it?",
    "choices": [
      "Honeynet",
      "False subnet",
      "IDS",
      "Active detection only"
    ],
    "answer": 0,
    "explanation": "A honeynet is a network of honeypots used to attract and study attackers."
  },
  {
    "id": "endpoint-automation-1",
    "topic": "endpoint",
    "prompt": "A team spends hours repeating the same endpoint hardening steps before deployment. What would best reduce the manual work?",
    "choices": [
      "Automation and scripting",
      "Deploying fewer controls",
      "Ignoring baselines",
      "Moving all devices to guest Wi-Fi"
    ],
    "answer": 0,
    "explanation": "Automation and scripts make repetitive configuration tasks consistent and faster."
  },
  {
    "id": "wireless-wardriving-1",
    "topic": "wireless",
    "prompt": "A tester maps where a wireless network can be reached from a car and from a small aircraft. Which methods are these?",
    "choices": [
      "War driving and war flying",
      "OSINT and phishing",
      "Static analysis and fuzzing",
      "Tailgating and vishing"
    ],
    "answer": 0,
    "explanation": "War driving and war flying map wireless coverage from ground and air."
  },
  {
    "id": "assessment-ioc-2",
    "topic": "assessment",
    "prompt": "Unusual outbound traffic, impossible travel patterns, and sudden database-read spikes are examples of what threat-intel element?",
    "choices": [
      "Indicators of compromise",
      "Threat maps",
      "Predictive analysis",
      "Acceptable use"
    ],
    "answer": 0,
    "explanation": "Those signs can indicate a system or account may already be compromised."
  },
  {
    "id": "endpoint-quarantine-1",
    "topic": "endpoint",
    "prompt": "An anti-malware tool moves infected files into a safe holding area without deleting them immediately. What setting is this?",
    "choices": [
      "Quarantine",
      "Purge",
      "Deep-freeze",
      "Retention"
    ],
    "answer": 0,
    "explanation": "Quarantine isolates suspicious files so they cannot run while preserving them for review."
  },
  {
    "id": "incident-isolation-1",
    "topic": "incident",
    "prompt": "An incident handler places one compromised host in a VLAN with no internet access and no other systems. What mitigation is being applied?",
    "choices": [
      "Isolation",
      "Eradication",
      "Load balancing",
      "Key escrow"
    ],
    "answer": 0,
    "explanation": "Isolation separates the compromised system to stop communication and spread."
  },
  {
    "id": "incident-dd-1",
    "topic": "incident",
    "prompt": "Which Linux command-line tool is commonly used to make a bit-for-bit forensic image of a drive?",
    "choices": [
      "dd",
      "df",
      "cp",
      "ln"
    ],
    "answer": 0,
    "explanation": "The dd command can copy raw blocks to create an exact image."
  },
  {
    "id": "crypto-filehash-1",
    "topic": "crypto",
    "prompt": "An investigator wants to prove that evidence files have not changed since collection. What should be compared?",
    "choices": [
      "File hashes",
      "Only file sizes",
      "Only filenames",
      "Screen brightness"
    ],
    "answer": 0,
    "explanation": "Matching cryptographic hashes provide strong evidence that file contents are unchanged."
  },
  {
    "id": "physical-failover-test-1",
    "topic": "physical",
    "prompt": "A company wants to fully prove that its hot site can take over production during an outage. What test is the most complete?",
    "choices": [
      "Failover test",
      "Tabletop exercise",
      "Paper review",
      "Parallel processing only"
    ],
    "answer": 0,
    "explanation": "A failover test actually shifts operations to validate recovery capability."
  },
  {
    "id": "crypto-fingerprint-1",
    "topic": "crypto",
    "prompt": "A security analyst needs a unique digital fingerprint for a file to compare later. Which should she choose?",
    "choices": [
      "A cryptographic hash",
      "A reversible checksum",
      "A file extension",
      "A VLAN tag"
    ],
    "answer": 0,
    "explanation": "A cryptographic hash is designed to fingerprint file contents and resist collisions."
  },
  {
    "id": "incident-email-header-1",
    "topic": "incident",
    "prompt": "Where should an analyst look to review mail routing metadata and identify servers that handled a message?",
    "choices": [
      "Email headers",
      "Email footer only",
      "The To field only",
      "The From display name only"
    ],
    "answer": 0,
    "explanation": "Email headers contain routing and server metadata such as Received lines."
  },
  {
    "id": "governance-soc-audit-1",
    "topic": "governance",
    "prompt": "A company wants to assess a cloud provider's controls before signing a contract. What is the most realistic evidence to request?",
    "choices": [
      "An existing SOC audit report",
      "Permission to scan production without limits",
      "The provider's private keys",
      "A public marketing page only"
    ],
    "answer": 0,
    "explanation": "Providers commonly share SOC reports or similar attestations instead of allowing customer scans."
  },
  {
    "id": "governance-aup-1",
    "topic": "governance",
    "prompt": "Which policy explains how employees may and may not use company networks, systems, and services?",
    "choices": [
      "Acceptable use policy",
      "Business continuity policy",
      "Incident response policy",
      "Certificate policy"
    ],
    "answer": 0,
    "explanation": "An acceptable use policy defines permitted and prohibited use of organizational resources."
  },
  {
    "id": "governance-state-law-1",
    "topic": "governance",
    "prompt": "A business operates facilities in three states. Which state laws should the security program consider?",
    "choices": [
      "The laws in every state where it operates",
      "Only the headquarters state",
      "Only federal law",
      "Only the state with the largest office"
    ],
    "answer": 0,
    "explanation": "Security and privacy obligations can apply wherever the organization operates or handles residents' data."
  },
  {
    "id": "governance-asset-policy-1",
    "topic": "governance",
    "prompt": "A requirement says every device over a set value must receive an RFID asset tag at intake. Which policy most likely contains it?",
    "choices": [
      "Asset management policy",
      "Incident response policy",
      "Acceptable use policy",
      "Change management policy"
    ],
    "answer": 0,
    "explanation": "Asset management policies define how assets are tracked, tagged, inventoried, and retired."
  },
  {
    "id": "governance-data-policy-1",
    "topic": "governance",
    "prompt": "Which policy should clearly identify who owns organizational information and how that data is governed?",
    "choices": [
      "Data governance policy",
      "Acceptable use policy",
      "Incident response policy",
      "Password policy"
    ],
    "answer": 0,
    "explanation": "Data governance defines ownership, stewardship, classification, and handling expectations."
  },
  {
    "id": "governance-baseline-awareness-1",
    "topic": "governance",
    "prompt": "Before improving security awareness, a manager wants to know the current starting point. What should be done first?",
    "choices": [
      "Conduct a baseline analysis",
      "Run an unrelated penetration test",
      "Skip measurement and train immediately",
      "Disable all user accounts"
    ],
    "answer": 0,
    "explanation": "A baseline analysis measures the initial state so improvement can be tracked."
  },
  {
    "id": "governance-change-principle-1",
    "topic": "governance",
    "prompt": "Which process helps avoid making several uncoordinated system changes at the same time?",
    "choices": [
      "Change management",
      "Due care",
      "Acceptable use",
      "Footprinting"
    ],
    "answer": 0,
    "explanation": "Change management coordinates, reviews, schedules, and documents changes."
  },
  {
    "id": "risk-rto-rpo-2",
    "topic": "risk-privacy",
    "prompt": "A continuity plan sets an RTO of 4 hours and an RPO of 24 hours. What does that mean?",
    "choices": [
      "Restore service within 4 hours and lose at most 24 hours of data",
      "Restore service within 24 hours and lose at most 4 hours of data",
      "Run for 4 hours after restoration and archive 24 hours of logs",
      "Keep systems offline for 24 hours before recovery"
    ],
    "answer": 0,
    "explanation": "RTO is recovery time; RPO is acceptable data-loss window."
  },
  {
    "id": "risk-ef-1",
    "topic": "risk-privacy",
    "prompt": "A database is valued at $1,000,000. A successful breach is expected to cause $500,000 in losses. What is the exposure factor?",
    "choices": [
      "50 percent",
      "5 percent",
      "20 percent",
      "100 percent"
    ],
    "answer": 0,
    "explanation": "Exposure factor is the percentage of asset value lost: 500,000 / 1,000,000 = 50 percent."
  },
  {
    "id": "risk-mitigate-waf-1",
    "topic": "risk-privacy",
    "prompt": "An organization deploys a web application firewall to reduce the likelihood of SQL injection impact. What risk response is this?",
    "choices": [
      "Mitigate",
      "Transfer",
      "Accept",
      "Avoid"
    ],
    "answer": 0,
    "explanation": "Adding a control to reduce likelihood or impact is risk mitigation."
  },
  {
    "id": "risk-rto-3",
    "topic": "risk-privacy",
    "prompt": "A business impact assessment says the main database can be unavailable for no more than two hours. Which metric was identified?",
    "choices": [
      "RTO",
      "RPO",
      "MTBF",
      "MTTR"
    ],
    "answer": 0,
    "explanation": "RTO is the maximum tolerable time to restore service."
  },
  {
    "id": "risk-accept-2",
    "topic": "risk-privacy",
    "prompt": "After reviewing options, leadership decides not to buy insurance and not to add controls for a known risk. What strategy is this?",
    "choices": [
      "Risk acceptance",
      "Risk transference",
      "Risk avoidance",
      "Risk mitigation"
    ],
    "answer": 0,
    "explanation": "Taking no additional action while knowingly living with the risk is acceptance."
  },
  {
    "id": "governance-external-compliance-1",
    "topic": "governance",
    "prompt": "A company hires an outside assessor to evaluate compliance with PCI DSS. What audit type is this?",
    "choices": [
      "External compliance audit",
      "Internal regulatory audit",
      "Internal compliance audit",
      "Penetration test only"
    ],
    "answer": 0,
    "explanation": "A third party checking adherence to a standard is an external compliance audit."
  },
  {
    "id": "risk-mtbf-1",
    "topic": "risk-privacy",
    "prompt": "A storage team wants to estimate the expected useful life between failures for newly purchased SSDs. Which metric helps?",
    "choices": [
      "MTBF",
      "RTO",
      "RPO",
      "SLE"
    ],
    "answer": 0,
    "explanation": "Mean time between failures estimates reliability over time."
  },
  {
    "id": "gen-control-1",
    "topic": "principles",
    "prompt": "A company adds warning signs, lighting, and visible cameras around a restricted entrance. Which control effect is the main goal?",
    "choices": [
      "Deterrent",
      "Corrective",
      "Compensating",
      "Recovery"
    ],
    "explanation": "Visible warnings and cameras are intended to discourage an attempt before it happens.",
    "answer": 0
  },
  {
    "id": "gen-control-2",
    "topic": "principles",
    "prompt": "A backup generator keeps a datacenter running when utility power fails. Which security objective is it primarily supporting?",
    "choices": [
      "Availability",
      "Confidentiality",
      "Non-repudiation",
      "Obfuscation"
    ],
    "explanation": "Power resilience keeps services available.",
    "answer": 0
  },
  {
    "id": "gen-zero-trust-1",
    "topic": "network-design",
    "prompt": "Which choices are core Zero Trust ideas?",
    "choices": [
      "Verify explicitly",
      "Assume internal networks are always safe",
      "Use least privilege",
      "Trust devices after first login"
    ],
    "explanation": "Zero Trust emphasizes explicit verification and least privilege instead of location-based trust.",
    "answers": [
      0,
      2
    ]
  },
  {
    "id": "gen-resilience-1",
    "topic": "risk-privacy",
    "prompt": "A service is designed so that one failed node does not take down the application. Which concept is being applied?",
    "choices": [
      "Resilience",
      "Obfuscation",
      "Tokenization",
      "Due care"
    ],
    "explanation": "Resilience is the ability to continue operating through failure.",
    "answer": 0
  },
  {
    "id": "iam-idp-1",
    "topic": "iam",
    "prompt": "A SaaS app redirects users to the company's identity provider and accepts a signed assertion after login. Which concept is being used?",
    "choices": [
      "Federation",
      "Hashing",
      "NAT",
      "Sandboxing"
    ],
    "explanation": "Federation allows a trusted identity provider to authenticate users for another service.",
    "answer": 0
  },
  {
    "id": "iam-conditional-1",
    "topic": "iam",
    "prompt": "A login is blocked because the user is in a new country, the device is unmanaged, and MFA was not completed. What control made this decision?",
    "choices": [
      "Conditional access",
      "Kerberos preauthentication",
      "RADIUS accounting",
      "Password spraying"
    ],
    "explanation": "Conditional access evaluates context and risk signals before granting access.",
    "answer": 0
  },
  {
    "id": "iam-pam-1",
    "topic": "iam",
    "prompt": "Which two controls best reduce standing administrator privilege?",
    "choices": [
      "Just-in-time elevation",
      "Privileged access management",
      "Shared administrator accounts",
      "Longer password expiration"
    ],
    "explanation": "JIT elevation and PAM reduce persistent privileged access and improve accountability.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "crypto-hsm-1",
    "topic": "crypto",
    "prompt": "A bank wants private keys used for signing transactions to remain inside tamper-resistant hardware. What should it deploy?",
    "choices": [
      "HSM",
      "TPM only",
      "CRL",
      "WAF"
    ],
    "explanation": "A hardware security module protects high-value cryptographic keys and operations.",
    "answer": 0
  },
  {
    "id": "threat-ttp-1",
    "topic": "network-attacks",
    "prompt": "A report says attackers use PowerShell, scheduled tasks, and encoded commands after initial access. What is the report describing?",
    "choices": [
      "TTPs",
      "RTOs",
      "Data owners",
      "Certificate chains"
    ],
    "explanation": "Tactics, techniques, and procedures describe how attackers operate.",
    "answer": 0
  },
  {
    "id": "threat-ioc-2",
    "topic": "assessment",
    "prompt": "A SOC analyst sees a known malicious IP, a suspicious file hash, and a new autorun registry key. What are these?",
    "choices": [
      "Indicators of compromise",
      "Risk appetite statements",
      "Data classifications",
      "Recovery objectives"
    ],
    "explanation": "These are observable clues that compromise may have occurred.",
    "answer": 0
  },
  {
    "id": "threat-phish-1",
    "topic": "network-attacks",
    "prompt": "Several employees receive emails with a fake invoice link that harvests Microsoft 365 credentials. What attack is this?",
    "choices": [
      "Phishing",
      "DNS sinkholing",
      "Bluejacking",
      "Directory traversal"
    ],
    "explanation": "The scenario describes deceptive email used to steal credentials.",
    "answer": 0
  },
  {
    "id": "threat-ransom-1",
    "topic": "incident",
    "prompt": "A workstation shows a ransom note and many files now have a new encrypted extension. What should be prioritized first?",
    "choices": [
      "Contain the affected system",
      "Pay the ransom immediately",
      "Delete all backups",
      "Disable all logging"
    ],
    "explanation": "Containment limits spread while response continues.",
    "answer": 0
  },
  {
    "id": "threat-ddos-2",
    "topic": "network-attacks",
    "prompt": "A public API is overwhelmed by traffic from thousands of hosts. Which controls are most relevant?",
    "choices": [
      "CDN or DDoS scrubbing",
      "Rate limiting",
      "Full disk encryption",
      "RFID badges"
    ],
    "explanation": "DDoS defenses and rate limits help preserve availability during traffic floods.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "threat-pass-spray-1",
    "topic": "iam",
    "prompt": "Authentication logs show one password tried against hundreds of accounts over several hours. What is most likely occurring?",
    "choices": [
      "Password spraying",
      "Credential stuffing",
      "Pass-the-hash",
      "Kerberoasting"
    ],
    "explanation": "Password spraying tries a common password across many accounts to avoid lockouts.",
    "answer": 0
  },
  {
    "id": "threat-ssrf-1",
    "topic": "app-attacks",
    "prompt": "A vulnerable web app can be tricked into requesting the cloud metadata service and returning temporary credentials. What attack is this?",
    "choices": [
      "SSRF",
      "XSS",
      "CSRF",
      "LDAP injection"
    ],
    "explanation": "Server-side request forgery abuses the server into making requests on the attacker's behalf.",
    "answer": 0
  },
  {
    "id": "threat-api-idor-1",
    "topic": "app-attacks",
    "prompt": "Changing an order ID in an API request lets a user view another customer's order. What weakness is present?",
    "choices": [
      "Broken object-level authorization",
      "SQL deadlock",
      "DNS poisoning",
      "Weak hashing"
    ],
    "explanation": "IDOR/BOLA occurs when authorization is not checked for the requested object.",
    "answer": 0
  },
  {
    "id": "arch-shared-1",
    "topic": "cloud-security",
    "prompt": "In an IaaS environment, which tasks are usually the customer's responsibility?",
    "choices": [
      "Guest operating system patching",
      "Identity and access configuration",
      "Physical datacenter security",
      "Hypervisor hardware repair"
    ],
    "explanation": "In IaaS the customer typically manages guest OS and IAM choices, while the provider manages physical facilities.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "arch-cspm-1",
    "topic": "cloud-security",
    "prompt": "A team wants continuous detection of public storage buckets, overly permissive security groups, and missing cloud logging. What tool category fits best?",
    "choices": [
      "CSPM",
      "HSM",
      "NAC",
      "FDE"
    ],
    "explanation": "Cloud security posture management finds risky cloud configurations.",
    "answer": 0
  },
  {
    "id": "arch-casb-1",
    "topic": "cloud-security",
    "prompt": "A company needs visibility and policy enforcement for sanctioned and unsanctioned SaaS use. What should it consider?",
    "choices": [
      "CASB",
      "RAID",
      "NTP",
      "SCADA"
    ],
    "explanation": "A CASB sits between users and cloud applications to enforce policy and visibility.",
    "answer": 0
  },
  {
    "id": "arch-container-1",
    "topic": "cloud-security",
    "prompt": "Which controls are most relevant before deploying containers to production?",
    "choices": [
      "Scan images for vulnerabilities",
      "Use trusted base images",
      "Disable all logging",
      "Store secrets in the image"
    ],
    "explanation": "Container security includes trusted images, scanning, and external secret management.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "arch-segment-1",
    "topic": "network-design",
    "prompt": "A hospital places medical IoT devices on a restricted VLAN with only required server access. What is the primary benefit?",
    "choices": [
      "Reduced lateral movement",
      "Longer certificate lifetime",
      "Higher password entropy",
      "Faster backups"
    ],
    "explanation": "Segmentation reduces the blast radius if a device is compromised.",
    "answer": 0
  },
  {
    "id": "arch-ha-1",
    "topic": "network-design",
    "prompt": "A web application uses two regions, health checks, and automatic failover. Which goal is most directly supported?",
    "choices": [
      "High availability",
      "Data minimization",
      "Tokenization",
      "Non-repudiation"
    ],
    "explanation": "Multi-region failover improves availability.",
    "answer": 0
  },
  {
    "id": "ops-siem-1",
    "topic": "assessment",
    "prompt": "A SIEM rule fires for impossible travel. What should the analyst do first?",
    "choices": [
      "Validate the alert with login context",
      "Erase the user's laptop",
      "Close the ticket as false positive",
      "Rotate all company certificates"
    ],
    "explanation": "Triage starts by validating the alert and gathering context.",
    "answer": 0
  },
  {
    "id": "ops-vuln-1",
    "topic": "assessment",
    "prompt": "A critical vulnerability exists on an internet-facing payroll server and a medium vulnerability exists on an isolated test system. What should be remediated first?",
    "choices": [
      "The internet-facing payroll server",
      "The isolated test system",
      "Whichever scanner listed first",
      "Neither until the annual audit"
    ],
    "explanation": "Exposure and business criticality increase priority.",
    "answer": 0
  },
  {
    "id": "ops-edr-1",
    "topic": "endpoint",
    "prompt": "An endpoint tool records process trees, network connections, and suspicious command lines to support investigation. What is it?",
    "choices": [
      "EDR",
      "UPS",
      "PDU",
      "NAT"
    ],
    "explanation": "EDR collects endpoint telemetry for detection and response.",
    "answer": 0
  },
  {
    "id": "ops-mdm-1",
    "topic": "endpoint",
    "prompt": "A lost BYOD phone contains company email. Which MDM actions are most appropriate?",
    "choices": [
      "Selective wipe of company data",
      "Revoke device access",
      "Disable datacenter HVAC",
      "Publish the user's password"
    ],
    "explanation": "MDM can remove corporate data and revoke access without wiping unrelated personal data when configured.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "ops-logs-1",
    "topic": "assessment",
    "prompt": "Which log sources are most useful for investigating suspected lateral movement?",
    "choices": [
      "Authentication logs",
      "Endpoint process logs",
      "Cafeteria menu logs",
      "Public marketing pages"
    ],
    "explanation": "Authentication and endpoint telemetry help reveal remote logons and tool execution.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "ops-contain-1",
    "topic": "incident",
    "prompt": "A server is actively exfiltrating data. What response phase is most urgent?",
    "choices": [
      "Containment",
      "Lessons learned",
      "Procurement",
      "Policy publishing"
    ],
    "explanation": "Active data loss requires containment to limit damage.",
    "answer": 0
  },
  {
    "id": "ops-chain-1",
    "topic": "incident",
    "prompt": "Which actions support forensic defensibility?",
    "choices": [
      "Document who handled evidence",
      "Hash collected images",
      "Edit original logs to remove noise",
      "Work only from memory"
    ],
    "explanation": "Chain of custody and hashes help prove evidence integrity.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "ops-soar-1",
    "topic": "assessment",
    "prompt": "A SOC wants phishing reports to automatically enrich URLs, isolate confirmed hosts, and open tickets. What capability fits best?",
    "choices": [
      "SOAR",
      "RAID",
      "NFC",
      "PAT"
    ],
    "explanation": "SOAR automates response playbooks and integrations.",
    "answer": 0
  },
  {
    "id": "ops-backup-1",
    "topic": "risk-privacy",
    "prompt": "Backups are encrypted, copied offsite, and periodically restored in a test environment. Which concern is being addressed?",
    "choices": [
      "Recovery confidence",
      "Steganography",
      "Shoulder surfing",
      "RF attenuation"
    ],
    "explanation": "Testing restores proves backups can support recovery.",
    "answer": 0
  },
  {
    "id": "ops-pbq-order-1",
    "topic": "incident",
    "prompt": "PBQ-style: Which incident response order is best after malware is confirmed on one host?",
    "choices": [
      "Contain, eradicate, recover, lessons learned",
      "Recover, ignore, contain, document",
      "Publish lessons learned, then investigate",
      "Delete evidence, then contain"
    ],
    "explanation": "Confirmed malware normally moves through containment, eradication, recovery, and lessons learned.",
    "answer": 0
  },
  {
    "id": "gov-policy-1",
    "topic": "governance",
    "prompt": "A document states employees may not use company systems for illegal activity or personal crypto mining. What is it?",
    "choices": [
      "Acceptable use policy",
      "Data retention schedule",
      "Incident containment plan",
      "Certificate policy only"
    ],
    "explanation": "Acceptable use defines permitted and prohibited use of systems.",
    "answer": 0
  },
  {
    "id": "gov-third-party-1",
    "topic": "governance",
    "prompt": "Before signing with a SaaS provider, a company reviews SOC 2 reports, breach history, and security questionnaire responses. What process is this?",
    "choices": [
      "Vendor due diligence",
      "Password spraying",
      "Data exfiltration",
      "Cryptographic erasure"
    ],
    "explanation": "Third-party risk management includes due diligence before onboarding.",
    "answer": 0
  },
  {
    "id": "gov-exception-1",
    "topic": "governance",
    "prompt": "A system cannot meet a standard for 60 days, so management documents the risk, owner, expiration date, and compensating controls. What is this?",
    "choices": [
      "Exception management",
      "Shadow IT",
      "Key escrow",
      "Packet shaping"
    ],
    "explanation": "Exceptions should be documented, time-bound, owned, and risk-approved.",
    "answer": 0
  },
  {
    "id": "risk-bia-1",
    "topic": "risk-privacy",
    "prompt": "A team identifies critical processes, dependencies, acceptable downtime, and recovery priorities. What activity is this?",
    "choices": [
      "Business impact analysis",
      "Port scan",
      "Certificate pinning",
      "Threat hunting"
    ],
    "explanation": "A BIA identifies business recovery requirements.",
    "answer": 0
  },
  {
    "id": "risk-privacy-1",
    "topic": "risk-privacy",
    "prompt": "An application collects precise location even though approximate city is enough for the service. Which privacy principle is most relevant?",
    "choices": [
      "Data minimization",
      "Non-repudiation",
      "Full backup",
      "Warm site"
    ],
    "explanation": "Data minimization limits collection to what is needed.",
    "answer": 0
  },
  {
    "id": "risk-quant-1",
    "topic": "risk-privacy",
    "prompt": "An asset is worth $200,000 and a scenario would affect 25 percent of its value. What is the SLE?",
    "choices": [
      "$50,000",
      "$25,000",
      "$200,000",
      "$800,000"
    ],
    "explanation": "SLE equals asset value times exposure factor: 200,000 x 0.25 = 50,000.",
    "answer": 0
  },
  {
    "id": "cloud-secret-1",
    "topic": "cloud-security",
    "prompt": "A developer accidentally commits an API key to a public repository. Which actions are best?",
    "choices": [
      "Revoke and rotate the key",
      "Scan for exposed secrets",
      "Leave it because the commit was deleted",
      "Email the key to the team"
    ],
    "explanation": "Exposed secrets should be revoked and rotated; scanning helps find other exposures.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "cloud-logs-1",
    "topic": "cloud-security",
    "prompt": "Which cloud control most directly helps investigate who changed a security group rule?",
    "choices": [
      "Cloud audit logs",
      "Object lifecycle tiering",
      "RAID 10",
      "Screen privacy filter"
    ],
    "explanation": "Cloud audit logs record API activity and identity context.",
    "answer": 0
  },
  {
    "id": "dev-sbom-1",
    "topic": "secure-dev",
    "prompt": "A new vulnerability is announced in a logging library. What artifact helps identify affected applications fastest?",
    "choices": [
      "SBOM",
      "RTO",
      "NDA",
      "Faraday cage"
    ],
    "explanation": "An SBOM lists software components and dependencies.",
    "answer": 0
  },
  {
    "id": "dev-sca-1",
    "topic": "secure-dev",
    "prompt": "Which pipeline controls are most focused on third-party dependency risk?",
    "choices": [
      "Software composition analysis",
      "Dependency pinning and review",
      "Screen locks",
      "Badge readers"
    ],
    "explanation": "SCA and dependency governance help manage library risk.",
    "answers": [
      0,
      1
    ]
  },
  {
    "id": "dev-secret-scan-1",
    "topic": "secure-dev",
    "prompt": "A pre-commit hook blocks hard-coded passwords and tokens from entering source control. What control is this?",
    "choices": [
      "Secret scanning",
      "Fuzzing",
      "Dynamic routing",
      "Token replay"
    ],
    "explanation": "Secret scanning detects credentials before they are committed or deployed.",
    "answer": 0
  },
  {
    "id": "phys-env-1",
    "topic": "physical",
    "prompt": "A datacenter adds water sensors under raised floors and monitors humidity. What risk area is being addressed?",
    "choices": [
      "Environmental controls",
      "Federation",
      "Tokenization",
      "Input validation"
    ],
    "explanation": "Water and humidity monitoring are environmental protections.",
    "answer": 0
  },
  {
    "id": "phys-asset-1",
    "topic": "physical",
    "prompt": "RFID tags are required on equipment above a dollar threshold. Which program does this support most directly?",
    "choices": [
      "Asset management",
      "Password policy",
      "Incident eradication",
      "OCSP stapling"
    ],
    "explanation": "Asset tags support inventory and tracking.",
    "answer": 0
  },
  {
    "id": "soc-escalate-1",
    "topic": "incident",
    "prompt": "A Tier 1 SOC analyst confirms suspicious PowerShell activity and possible credential theft on an executive laptop. What should happen next?",
    "choices": [
      "Escalate according to the runbook",
      "Delete the alert",
      "Wait for the weekly report",
      "Disable the SIEM"
    ],
    "explanation": "Confirmed high-impact activity should be escalated through the documented process.",
    "answer": 0
  },
  {
    "id": "principles-implicit-1",
    "topic": "principles",
    "prompt": "A company relies on employees to report suspicious behavior, but also deploys automated alerting. Which concept best describes using people, process, and technology together?",
    "choices": [
      "Defense in depth",
      "Single point of failure",
      "Implicit deny",
      "Open design"
    ],
    "answer": 0,
    "explanation": "Defense in depth layers administrative, technical, and physical controls."
  },
  {
    "id": "principles-fail-secure-1",
    "topic": "principles",
    "prompt": "An access control system unlocks doors during a life-safety emergency but locks a server cabinet when power is lost. What design idea is being balanced?",
    "choices": [
      "Fail safe versus fail secure",
      "Hashing versus encryption",
      "RTO versus RPO",
      "SaaS versus PaaS"
    ],
    "answer": 0,
    "explanation": "Safety-critical doors may fail open, while asset-protection locks may fail closed."
  },
  {
    "id": "netattack-dns-1",
    "topic": "network-attacks",
    "prompt": "Users are sent to a fake banking site after an attacker corrupts name resolution. What attack category best fits?",
    "choices": [
      "DNS poisoning",
      "Bluejacking",
      "Tailgating",
      "Key stretching"
    ],
    "answer": 0,
    "explanation": "DNS poisoning manipulates name resolution to redirect victims."
  },
  {
    "id": "netdesign-nac-1",
    "topic": "network-design",
    "prompt": "A switch places unmanaged laptops into a remediation VLAN until posture checks pass. What control is being used?",
    "choices": [
      "NAC",
      "HSM",
      "DKIM",
      "RAID"
    ],
    "answer": 0,
    "explanation": "Network access control can evaluate device posture and assign network access dynamically."
  },
  {
    "id": "wireless-site-1",
    "topic": "wireless",
    "prompt": "A technician maps signal bleed into a parking lot and adjusts AP power and placement. What activity is this closest to?",
    "choices": [
      "Wireless site survey",
      "Credential stuffing",
      "Code signing",
      "Tokenization"
    ],
    "answer": 0,
    "explanation": "A wireless site survey measures coverage, interference, and signal leakage."
  },
  {
    "id": "appattacks-csrf-1",
    "topic": "app-attacks",
    "prompt": "A logged-in user is tricked into clicking a link that submits an unwanted account change to a site where she is already authenticated. What attack is this?",
    "choices": [
      "CSRF",
      "SSRF",
      "SQL injection",
      "Race condition"
    ],
    "answer": 0,
    "explanation": "Cross-site request forgery abuses a victim browser and existing session to submit unwanted actions."
  }
];

const flashCardBank = [
  {
    "id": "principles-cia-card",
    "topic": "principles",
    "term": "CIA Triad",
    "definition": "Confidentiality, integrity, and availability: the three core security goals."
  },
  {
    "id": "principles-threat-card",
    "topic": "principles",
    "term": "Threat Actor",
    "definition": "A person, group, or entity that can cause harm to systems or data."
  },
  {
    "id": "principles-vuln-card",
    "topic": "principles",
    "term": "Vulnerability",
    "definition": "A weakness that can be exploited by a threat."
  },
  {
    "id": "principles-phishing-card",
    "topic": "principles",
    "term": "Phishing",
    "definition": "Deceptive messaging that tricks users into unsafe actions or disclosure."
  },
  {
    "id": "principles-ransom-card",
    "topic": "principles",
    "term": "Ransomware",
    "definition": "Malware that denies access to files or systems and demands payment."
  },
  {
    "id": "iam-ident-card",
    "topic": "iam",
    "term": "Identification",
    "definition": "Claiming an identity, such as entering a username."
  },
  {
    "id": "iam-auth-card",
    "topic": "iam",
    "term": "Authentication",
    "definition": "Proving a claimed identity with one or more factors."
  },
  {
    "id": "iam-authz-card",
    "topic": "iam",
    "term": "Authorization",
    "definition": "Determining what an authenticated subject may access or do."
  },
  {
    "id": "iam-mfa-card",
    "topic": "iam",
    "term": "MFA",
    "definition": "Authentication using factors from more than one category."
  },
  {
    "id": "iam-rbac-card",
    "topic": "iam",
    "term": "RBAC",
    "definition": "Access control based on job roles."
  },
  {
    "id": "crypto-encrypt-card",
    "topic": "crypto",
    "term": "Encryption",
    "definition": "Transforms data so only authorized parties with the key can read it."
  },
  {
    "id": "crypto-hash-card",
    "topic": "crypto",
    "term": "Hash",
    "definition": "A fixed-length digest used to detect changes."
  },
  {
    "id": "crypto-sign-card",
    "topic": "crypto",
    "term": "Digital Signature",
    "definition": "Cryptographic proof of origin, integrity, and non-repudiation."
  },
  {
    "id": "crypto-pki-card",
    "topic": "crypto",
    "term": "PKI",
    "definition": "System of certificates, authorities, trust chains, and revocation."
  },
  {
    "id": "crypto-ocsp-card",
    "topic": "crypto",
    "term": "OCSP",
    "definition": "Protocol for checking certificate revocation status."
  },
  {
    "id": "netatt-ddos-card",
    "topic": "network-attacks",
    "term": "DDoS",
    "definition": "Distributed attack that disrupts availability by overwhelming a target."
  },
  {
    "id": "netatt-arp-card",
    "topic": "network-attacks",
    "term": "ARP Poisoning",
    "definition": "Manipulates IP-to-MAC mappings to redirect traffic."
  },
  {
    "id": "netatt-mitm-card",
    "topic": "network-attacks",
    "term": "On-Path Attack",
    "definition": "Interception of traffic between communicating parties."
  },
  {
    "id": "netatt-ssh-card",
    "topic": "network-attacks",
    "term": "SSH",
    "definition": "Encrypted remote administration protocol."
  },
  {
    "id": "netatt-https-card",
    "topic": "network-attacks",
    "term": "HTTPS",
    "definition": "HTTP protected by TLS."
  },
  {
    "id": "netdesign-dmz-card",
    "topic": "network-design",
    "term": "DMZ",
    "definition": "Network zone between trusted and untrusted networks for public services."
  },
  {
    "id": "netdesign-ids-card",
    "topic": "network-design",
    "term": "IDS",
    "definition": "Detects suspicious activity and alerts."
  },
  {
    "id": "netdesign-ips-card",
    "topic": "network-design",
    "term": "IPS",
    "definition": "Detects and can block malicious traffic inline."
  },
  {
    "id": "netdesign-vpn-card",
    "topic": "network-design",
    "term": "VPN",
    "definition": "Encrypted tunnel for remote or site-to-site connectivity."
  },
  {
    "id": "netdesign-zero-card",
    "topic": "network-design",
    "term": "Zero Trust",
    "definition": "Verify explicitly, use least privilege, and assume breach."
  },
  {
    "id": "wireless-rfid-card",
    "topic": "wireless",
    "term": "RFID",
    "definition": "Radio-frequency identification used for tags and proximity badges."
  },
  {
    "id": "wireless-mdm-card",
    "topic": "wireless",
    "term": "MDM",
    "definition": "Mobile device management for policy, app control, and remote wipe."
  },
  {
    "id": "wireless-evil-card",
    "topic": "wireless",
    "term": "Evil Twin",
    "definition": "Fake access point that imitates a legitimate wireless network."
  },
  {
    "id": "wireless-802-card",
    "topic": "wireless",
    "term": "802.1X",
    "definition": "Port or wireless access control using authentication before network access."
  },
  {
    "id": "wireless-iot-card",
    "topic": "wireless",
    "term": "IoT Segmentation",
    "definition": "Isolating smart devices from trusted systems to reduce risk."
  },
  {
    "id": "appatt-xss-card",
    "topic": "app-attacks",
    "term": "XSS",
    "definition": "Injection of client-side script into pages viewed by users."
  },
  {
    "id": "appatt-sqli-card",
    "topic": "app-attacks",
    "term": "SQL Injection",
    "definition": "Untrusted input changes a database query."
  },
  {
    "id": "appatt-ssrf-card",
    "topic": "app-attacks",
    "term": "SSRF",
    "definition": "Tricks a server into making attacker-chosen requests."
  },
  {
    "id": "appatt-dir-card",
    "topic": "app-attacks",
    "term": "Directory Traversal",
    "definition": "Uses path manipulation to access files outside the intended directory."
  },
  {
    "id": "appatt-race-card",
    "topic": "app-attacks",
    "term": "Race Condition",
    "definition": "Timing flaw where outcome changes between check and use."
  },
  {
    "id": "secdev-stage-card",
    "topic": "secure-dev",
    "term": "Staging",
    "definition": "Pre-production environment that closely mirrors production."
  },
  {
    "id": "secdev-sast-card",
    "topic": "secure-dev",
    "term": "SAST",
    "definition": "Static analysis of source code or binaries before runtime."
  },
  {
    "id": "secdev-dast-card",
    "topic": "secure-dev",
    "term": "DAST",
    "definition": "Testing a running application from the outside."
  },
  {
    "id": "secdev-fuzz-card",
    "topic": "secure-dev",
    "term": "Fuzzing",
    "definition": "Unexpected or malformed input testing to find crashes and flaws."
  },
  {
    "id": "secdev-vault-card",
    "topic": "secure-dev",
    "term": "Secrets Vault",
    "definition": "Protected storage for passwords, keys, and tokens."
  },
  {
    "id": "endpoint-edr-card",
    "topic": "endpoint",
    "term": "EDR",
    "definition": "Endpoint detection and response telemetry and investigation."
  },
  {
    "id": "endpoint-dlp-card",
    "topic": "endpoint",
    "term": "DLP",
    "definition": "Controls that detect or prevent sensitive data loss."
  },
  {
    "id": "endpoint-hard-card",
    "topic": "endpoint",
    "term": "Hardening",
    "definition": "Reducing attack surface through secure configuration."
  },
  {
    "id": "endpoint-fde-card",
    "topic": "endpoint",
    "term": "Full-Disk Encryption",
    "definition": "Protection for data at rest on a device."
  },
  {
    "id": "endpoint-secboot-card",
    "topic": "endpoint",
    "term": "Secure Boot",
    "definition": "Startup protection that helps load trusted components."
  },
  {
    "id": "cloud-iaas-card",
    "topic": "cloud-security",
    "term": "IaaS",
    "definition": "Cloud infrastructure such as servers, storage, networking, and virtualization."
  },
  {
    "id": "cloud-paas-card",
    "topic": "cloud-security",
    "term": "PaaS",
    "definition": "Managed platform for application development and deployment."
  },
  {
    "id": "cloud-saas-card",
    "topic": "cloud-security",
    "term": "SaaS",
    "definition": "Finished application delivered over the internet."
  },
  {
    "id": "cloud-casb-card",
    "topic": "cloud-security",
    "term": "CASB",
    "definition": "Policy enforcement point between users and cloud services."
  },
  {
    "id": "cloud-iac-card",
    "topic": "cloud-security",
    "term": "Infrastructure as Code",
    "definition": "Managing infrastructure through repeatable code or templates."
  },
  {
    "id": "physical-warm-card",
    "topic": "physical",
    "term": "Warm Site",
    "definition": "Alternate site with partial resources ready but not fully live."
  },
  {
    "id": "physical-hot-card",
    "topic": "physical",
    "term": "Hot Site",
    "definition": "Alternate site ready to operate with minimal delay."
  },
  {
    "id": "physical-rto-card",
    "topic": "physical",
    "term": "RTO",
    "definition": "Target time to restore a service."
  },
  {
    "id": "physical-rpo-card",
    "topic": "physical",
    "term": "RPO",
    "definition": "Maximum acceptable data loss measured in time."
  },
  {
    "id": "physical-ups-card",
    "topic": "physical",
    "term": "UPS",
    "definition": "Battery-backed short-term power during an outage."
  },
  {
    "id": "assessment-scan-card",
    "topic": "assessment",
    "term": "Vulnerability Scanner",
    "definition": "Tool that identifies and ranks known weaknesses."
  },
  {
    "id": "assessment-siem-card",
    "topic": "assessment",
    "term": "SIEM",
    "definition": "Collects, correlates, alerts on, and analyzes security events."
  },
  {
    "id": "assessment-soar-card",
    "topic": "assessment",
    "term": "SOAR",
    "definition": "Automates and orchestrates security response actions."
  },
  {
    "id": "assessment-roe-card",
    "topic": "assessment",
    "term": "Rules of Engagement",
    "definition": "Scope, timing, and limits for a penetration test."
  },
  {
    "id": "assessment-ioc-card",
    "topic": "assessment",
    "term": "IOC",
    "definition": "Indicator of compromise, such as a malicious hash, IP, or domain."
  },
  {
    "id": "incident-irp-card",
    "topic": "incident",
    "term": "IRP",
    "definition": "Incident response plan used to recognize, respond, and recover."
  },
  {
    "id": "incident-contain-card",
    "topic": "incident",
    "term": "Containment",
    "definition": "Limiting damage and stopping an incident from spreading."
  },
  {
    "id": "incident-erad-card",
    "topic": "incident",
    "term": "Eradication",
    "definition": "Removing the root cause of an incident."
  },
  {
    "id": "incident-chain-card",
    "topic": "incident",
    "term": "Chain of Custody",
    "definition": "Documentation of evidence handling."
  },
  {
    "id": "incident-volatile-card",
    "topic": "incident",
    "term": "Volatile Evidence",
    "definition": "Evidence that can disappear quickly, such as memory contents."
  },
  {
    "id": "governance-policy-card",
    "topic": "governance",
    "term": "Policy",
    "definition": "High-level statement of management expectations."
  },
  {
    "id": "governance-procedure-card",
    "topic": "governance",
    "term": "Procedure",
    "definition": "Step-by-step instructions for completing a task."
  },
  {
    "id": "governance-benchmark-card",
    "topic": "governance",
    "term": "Configuration Benchmark",
    "definition": "Specific secure settings for a system or application."
  },
  {
    "id": "governance-change-card",
    "topic": "governance",
    "term": "Change Management",
    "definition": "Review, approval, testing, and communication of planned changes."
  },
  {
    "id": "governance-due-card",
    "topic": "governance",
    "term": "Due Care",
    "definition": "Implementing and maintaining reasonable security controls."
  },
  {
    "id": "risk-pii-card",
    "topic": "risk-privacy",
    "term": "PII",
    "definition": "Information that can identify a person directly or indirectly."
  },
  {
    "id": "risk-sle-card",
    "topic": "risk-privacy",
    "term": "SLE",
    "definition": "Single loss expectancy: asset value times exposure factor."
  },
  {
    "id": "risk-ale-card",
    "topic": "risk-privacy",
    "term": "ALE",
    "definition": "Annualized loss expectancy: SLE times annual rate of occurrence."
  },
  {
    "id": "risk-transfer-card",
    "topic": "risk-privacy",
    "term": "Risk Transfer",
    "definition": "Moving some risk impact to another party, such as through insurance."
  },
  {
    "id": "risk-bcp-card",
    "topic": "risk-privacy",
    "term": "BCP",
    "definition": "Business continuity planning keeps critical functions operating."
  },
  {
    "id": "ex-warm-site",
    "topic": "physical",
    "term": "A recovery location has utilities and network links ready, but no live duplicate systems.",
    "definition": "Warm site. It is partially prepared but not fully operational.",
    "kind": "example"
  },
  {
    "id": "ex-rfid",
    "topic": "physical",
    "term": "An employee waves a badge near a reader and the door unlocks.",
    "definition": "RFID. Proximity card readers commonly use radio-frequency identification.",
    "kind": "example"
  },
  {
    "id": "ex-xss",
    "topic": "app-attacks",
    "term": "A profile field stores script that runs for every visitor.",
    "definition": "Stored XSS. The malicious script is saved and later executed in browsers.",
    "kind": "example"
  },
  {
    "id": "ex-siem",
    "topic": "assessment",
    "term": "Authentication failures, endpoint alerts, and firewall denies are correlated into one alert.",
    "definition": "SIEM. It collects and correlates events from multiple sources.",
    "kind": "example"
  },
  {
    "id": "ex-mfa",
    "topic": "iam",
    "term": "A password is accepted only after the user approves a push notification.",
    "definition": "MFA. The login uses something known and something possessed.",
    "kind": "example"
  },
  {
    "id": "ex-sle",
    "topic": "risk-privacy",
    "term": "A $10,000 asset would lose 40% of value in one incident.",
    "definition": "SLE is $4,000. Multiply asset value by exposure factor.",
    "kind": "example"
  },
  {
    "id": "card-zero-trust",
    "topic": "network-design",
    "term": "Zero Trust",
    "definition": "Security model that continuously verifies identity, device, context, and policy instead of trusting network location."
  },
  {
    "id": "card-cspm",
    "topic": "cloud-security",
    "term": "CSPM",
    "definition": "Cloud Security Posture Management; finds risky cloud configurations such as public storage or missing logs."
  },
  {
    "id": "card-cwpp",
    "topic": "cloud-security",
    "term": "CWPP",
    "definition": "Cloud Workload Protection Platform; protects workloads such as VMs, containers, and serverless functions."
  },
  {
    "id": "card-casb",
    "topic": "cloud-security",
    "term": "CASB",
    "definition": "Cloud Access Security Broker; gives visibility and policy enforcement for cloud app use."
  },
  {
    "id": "card-sbom",
    "topic": "secure-dev",
    "term": "SBOM",
    "definition": "Software Bill of Materials; inventory of application components and dependencies."
  },
  {
    "id": "card-sca",
    "topic": "secure-dev",
    "term": "SCA",
    "definition": "Software Composition Analysis; scans third-party libraries for vulnerable or risky components."
  },
  {
    "id": "card-soar",
    "topic": "assessment",
    "term": "SOAR",
    "definition": "Security Orchestration, Automation, and Response; automates playbooks and tool integrations."
  },
  {
    "id": "card-ttp",
    "topic": "network-attacks",
    "term": "TTP",
    "definition": "Tactics, techniques, and procedures; the way an attacker behaves and operates."
  },
  {
    "id": "card-ioc",
    "topic": "assessment",
    "term": "Indicator of Compromise",
    "definition": "Observable clue such as a malicious IP, file hash, domain, or registry key."
  },
  {
    "id": "card-bola",
    "topic": "app-attacks",
    "term": "BOLA / IDOR",
    "definition": "Broken object-level authorization; users can access objects they do not own."
  },
  {
    "id": "card-ssrf",
    "topic": "app-attacks",
    "term": "SSRF",
    "definition": "Server-side request forgery; attacker tricks a server into making unintended requests."
  },
  {
    "id": "card-pam",
    "topic": "iam",
    "term": "PAM",
    "definition": "Privileged Access Management; controls, monitors, and limits administrator access."
  },
  {
    "id": "card-conditional",
    "topic": "iam",
    "term": "Conditional Access",
    "definition": "Access decision based on signals such as user, device, location, risk, and MFA."
  },
  {
    "id": "card-hsm",
    "topic": "crypto",
    "term": "HSM",
    "definition": "Hardware Security Module; tamper-resistant protection for high-value cryptographic keys."
  },
  {
    "id": "card-bia",
    "topic": "risk-privacy",
    "term": "BIA",
    "definition": "Business Impact Analysis; identifies critical processes, dependencies, downtime, and recovery needs."
  },
  {
    "id": "card-rto-rpo",
    "topic": "risk-privacy",
    "term": "RTO vs RPO",
    "definition": "RTO is how fast service must be restored; RPO is how much data loss is acceptable."
  },
  {
    "id": "card-edr",
    "topic": "endpoint",
    "term": "EDR",
    "definition": "Endpoint Detection and Response; records endpoint telemetry and supports investigation and containment."
  },
  {
    "id": "card-uem",
    "topic": "endpoint",
    "term": "UEM",
    "definition": "Unified Endpoint Management; manages mobile, desktop, and sometimes IoT device policy."
  },
  {
    "id": "card-runbook",
    "topic": "incident",
    "term": "Runbook",
    "definition": "Documented response steps for common alerts or incidents."
  },
  {
    "id": "card-exception",
    "topic": "governance",
    "term": "Security Exception",
    "definition": "Time-bound approval to deviate from a requirement with documented risk and compensating controls."
  },
  {
    "id": "card-data-min",
    "topic": "risk-privacy",
    "term": "Data Minimization",
    "definition": "Collect and retain only the personal data needed for the stated purpose."
  },
  {
    "id": "card-evil-twin",
    "topic": "wireless",
    "term": "Evil Twin",
    "definition": "Rogue wireless network that impersonates a legitimate SSID."
  },
  {
    "id": "card-microseg",
    "topic": "network-design",
    "term": "Microsegmentation",
    "definition": "Small policy-controlled segments that limit lateral movement between workloads."
  },
  {
    "id": "card-guardrails",
    "topic": "cloud-security",
    "term": "Cloud Guardrails",
    "definition": "Preventive policies, defaults, and automation that keep cloud teams inside safe boundaries."
  }
];

const uploadedMaterialExpansion = {
  lessons: [
    {
      topic: "incident",
      lesson: {
        title: "SOC Triage Workflow",
        body: [
          "A SOC analyst starts by validating whether an alert represents suspicious activity, benign behavior, a duplicate, or a known false positive.",
          "Triage depends on context: asset criticality, user role, alert source, timestamp sequence, recent changes, threat intelligence, and whether the activity matches normal baselines.",
          "Escalation should include a concise summary, affected users or hosts, observed indicators, evidence sources, suspected tactic, business impact, and recommended next action."
        ],
        remember: "Triage is not just noticing an alert; it is deciding priority, confidence, scope, and next owner.",
        sections: [
          {
            title: "Analyst Checklist",
            items: [
              "Confirm the alert source and timestamp.",
              "Identify the affected asset, user, and data sensitivity.",
              "Correlate with authentication, endpoint, DNS, proxy, firewall, and cloud logs.",
              "Decide whether to close, tune, monitor, contain, or escalate."
            ]
          }
        ]
      }
    },
    {
      topic: "incident",
      lesson: {
        title: "Evidence Handling And Legal Hold",
        body: [
          "Evidence handling preserves integrity and admissibility. Document who collected evidence, when it was collected, where it was stored, and every transfer of custody.",
          "A legal hold preserves potentially relevant data when litigation, investigation, or regulatory review is expected. It can pause normal retention or deletion workflows.",
          "Forensics should minimize changes to original evidence. Use hashes, images, write blockers, documented commands, and controlled access where appropriate."
        ],
        remember: "Evidence that cannot be trusted or traced may be useless even if it contains the right facts.",
        sections: [
          {
            title: "Exam Clues",
            items: [
              "Chain of custody means documented evidence handling.",
              "Legal hold means preserve data that might otherwise be deleted.",
              "Hash values help prove evidence did not change."
            ]
          }
        ]
      }
    },
    {
      topic: "assessment",
      lesson: {
        title: "Vulnerability Prioritization",
        body: [
          "Scanner severity is only the starting point. Prioritize using exploitability, exposure, asset criticality, business impact, compensating controls, threat intelligence, and regulatory impact.",
          "Internet-facing exploitable flaws on critical systems usually outrank higher-numbered findings on isolated or low-value systems.",
          "Validation closes the loop. After patching or configuration change, rescan, verify version, check configuration state, or collect audit evidence."
        ],
        remember: "The best remediation order combines technical severity with business exposure.",
        sections: [
          {
            title: "Common Signals",
            items: [
              "CVE identifies the vulnerability.",
              "CVSS estimates technical severity.",
              "Asset criticality and exposure turn severity into practical priority."
            ]
          }
        ]
      }
    },
    {
      topic: "governance",
      lesson: {
        title: "Audit Evidence And Exceptions",
        body: [
          "Audits and assessments need evidence that controls exist, operate, and are reviewed. Evidence can include tickets, screenshots, logs, approvals, reports, configurations, and attestations.",
          "An exception documents an approved deviation from policy or standard. Strong exceptions include owner, reason, risk, compensating controls, approval, expiration date, and review plan.",
          "Attestation is a formal confirmation, often by managers or data owners, that access, controls, or statements remain accurate."
        ],
        remember: "Governance turns security work into accountable, reviewable evidence.",
        sections: [
          {
            title: "Document Match",
            items: [
              "Policy states intent.",
              "Standard defines mandatory requirements.",
              "Procedure gives steps.",
              "Exception records approved noncompliance."
            ]
          }
        ]
      }
    },
    {
      topic: "risk-privacy",
      lesson: {
        title: "Third-Party Risk Lifecycle",
        body: [
          "Third-party risk starts before purchase with due diligence, questionnaires, security evidence, data handling review, and agreement terms.",
          "Contracts should define service levels, breach notification, data protection, right to audit, confidentiality, subcontractor rules, and termination duties.",
          "Monitoring continues after onboarding because vendor access, control maturity, personnel, and service scope can change."
        ],
        remember: "Outsourcing a service does not outsource accountability for the risk.",
        sections: [
          {
            title: "Agreement Clues",
            items: [
              "SLA defines measurable service commitments.",
              "NDA protects confidential information.",
              "Right-to-audit allows agreed review of provider controls.",
              "Rules of engagement define scope and limits for testing."
            ]
          }
        ]
      }
    },
    {
      topic: "cloud-security",
      lesson: {
        title: "Cloud Misconfiguration Patterns",
        body: [
          "Cloud incidents often come from misconfiguration rather than provider failure: public storage, overbroad IAM roles, exposed management ports, permissive security groups, weak logging, or unmanaged secrets.",
          "Guardrails reduce repeat mistakes. Use policy enforcement, secure defaults, infrastructure as code review, least privilege, tagging, logging, and automated detection.",
          "Shared responsibility questions ask which layer the customer controls. Identity, data, access policies, and workload configuration are usually customer responsibilities."
        ],
        remember: "In cloud scenarios, ask whether the risk is identity, exposure, data location, logging, or configuration drift."
      }
    },
    {
      topic: "iam",
      lesson: {
        title: "Provisioning, Reviews, And PAM",
        body: [
          "Provisioning grants accounts and access. Deprovisioning removes or disables access when a user leaves, changes role, or no longer needs a resource.",
          "Access reviews reduce privilege creep by confirming that permissions still match current job duties.",
          "Privileged access management reduces administrator risk with vaulting, approval workflows, just-in-time elevation, session monitoring, break-glass controls, and account discovery."
        ],
        remember: "Standing privilege is convenient for attackers; temporary, approved privilege is easier to defend."
      }
    },
    {
      topic: "secure-dev",
      lesson: {
        title: "Software Supply Chain Defenses",
        body: [
          "Software supply chain attacks target dependencies, build systems, CI/CD secrets, update channels, repositories, or signed packages.",
          "Defenses include dependency pinning, package monitoring, SBOM awareness, code signing, branch protection, secrets scanning, build isolation, and review of third-party libraries.",
          "A trusted update path is powerful. Protecting signing keys and release pipelines is as important as protecting production servers."
        ],
        remember: "If users trust the update, attackers want the build and signing path."
      }
    }
  ],
  questions: [
    {
      id: "incident-soc-triage-1",
      topic: "incident",
      prompt: "A SIEM alert fires for a suspicious login. Which first triage action is best?",
      choices: ["Validate context with related logs and asset details", "Erase the user's mailbox", "Disable every account in the domain", "Publish the incident report immediately"],
      answer: 0,
      explanation: "Triage starts by validating context, scope, and confidence before disruptive response actions."
    },
    {
      id: "incident-soc-escalate-1",
      topic: "incident",
      prompt: "Which detail is most useful in an escalation summary?",
      choices: ["Affected host, user, evidence, impact, and recommended next action", "Only the analyst's shift schedule", "A list of unrelated open tickets", "The vendor's marketing description"],
      answer: 0,
      explanation: "Escalation should give the next owner enough evidence and context to act quickly."
    },
    {
      id: "incident-chain-2",
      topic: "incident",
      prompt: "Which record documents who collected, stored, transferred, and analyzed evidence?",
      choices: ["Chain of custody", "Risk appetite", "SLA", "SPF"],
      answer: 0,
      explanation: "Chain of custody documents evidence handling across its lifecycle."
    },
    {
      id: "incident-legal-hold-1",
      topic: "incident",
      prompt: "A company must pause deletion of mailboxes related to pending litigation. What is required?",
      choices: ["Legal hold", "DNSSEC", "NAT", "Geofencing"],
      answer: 0,
      explanation: "Legal hold preserves data that may be relevant to litigation or investigation."
    },
    {
      id: "incident-hash-evidence-1",
      topic: "incident",
      prompt: "Why hash a forensic disk image immediately after acquisition?",
      choices: ["To prove the image has not changed", "To compress the image", "To decrypt all files", "To classify the data automatically"],
      answer: 0,
      explanation: "A matching hash later supports evidence integrity."
    },
    {
      id: "assessment-priority-1",
      topic: "assessment",
      prompt: "Which vulnerability should usually be prioritized first?",
      choices: ["Exploitable internet-facing flaw on a critical payment server", "Low-risk finding on an isolated lab host", "Informational banner on a retired system", "A patched vulnerability with verified remediation"],
      answer: 0,
      explanation: "Exploitability, exposure, and asset criticality make the payment server finding higher priority."
    },
    {
      id: "assessment-validation-1",
      topic: "assessment",
      prompt: "After a patch is deployed, which step best validates remediation?",
      choices: ["Rescan or verify the fixed version/configuration", "Delete all vulnerability reports", "Disable all future scans", "Accept the risk forever"],
      answer: 0,
      explanation: "Validation proves that remediation worked."
    },
    {
      id: "assessment-cvss-1",
      topic: "assessment",
      prompt: "CVSS is best used to describe what?",
      choices: ["Technical severity of a vulnerability", "The legal owner of evidence", "A mail authentication policy", "A backup retention period"],
      answer: 0,
      explanation: "CVSS provides a standardized technical severity score."
    },
    {
      id: "governance-exception-1",
      topic: "governance",
      prompt: "A system cannot meet a password standard for 60 days, and management approves compensating monitoring. What should document this?",
      choices: ["Policy exception", "Rainbow table", "Packet capture", "Certificate signing request"],
      answer: 0,
      explanation: "A policy exception records approved deviation, risk, compensating controls, owner, and expiration."
    },
    {
      id: "governance-attestation-1",
      topic: "governance",
      prompt: "Managers periodically confirm that their employees still need assigned access. What is this called?",
      choices: ["Attestation", "Vishing", "Tokenization", "Jamming"],
      answer: 0,
      explanation: "Attestation is formal confirmation that access or control statements remain accurate."
    },
    {
      id: "governance-evidence-1",
      topic: "governance",
      prompt: "An auditor asks for proof that quarterly access reviews occurred. What is the best response?",
      choices: ["Provide tickets, approvals, review logs, or signed attestations", "Say the control probably happened", "Disable the access review process", "Send only the network diagram"],
      answer: 0,
      explanation: "Audits rely on evidence showing the control operated."
    },
    {
      id: "risk-vendor-sla-1",
      topic: "risk-privacy",
      prompt: "Which agreement defines measurable uptime or response-time commitments from a service provider?",
      choices: ["SLA", "NDA", "MOU", "CSR"],
      answer: 0,
      explanation: "A service level agreement defines measurable service commitments."
    },
    {
      id: "risk-right-audit-1",
      topic: "risk-privacy",
      prompt: "A customer wants contractual permission to review a vendor's controls. Which clause is most relevant?",
      choices: ["Right-to-audit", "Split tunnel", "MX preference", "DHCP lease"],
      answer: 0,
      explanation: "A right-to-audit clause allows agreed assessment or review of provider controls."
    },
    {
      id: "risk-third-party-ongoing-1",
      topic: "risk-privacy",
      prompt: "Why monitor vendors after onboarding?",
      choices: ["Vendor risk changes as access, services, and controls change", "Contracts remove all future risk", "Monitoring is only needed before purchase", "Vendors cannot affect customer data"],
      answer: 0,
      explanation: "Third-party risk must be monitored through the relationship, not only at selection."
    },
    {
      id: "cloud-misconfig-public-1",
      topic: "cloud-security",
      prompt: "A storage bucket containing customer records is readable by anyone on the internet. What is the most likely issue?",
      choices: ["Cloud misconfiguration", "Certificate revocation", "Bluejacking", "Key stretching"],
      answer: 0,
      explanation: "Public storage exposure is a common cloud configuration failure."
    },
    {
      id: "cloud-guardrail-1",
      topic: "cloud-security",
      prompt: "Which control best prevents teams from creating public storage by mistake?",
      choices: ["Policy guardrail that denies public storage settings", "A printed poster only", "Disabling all logging", "Using default credentials"],
      answer: 0,
      explanation: "Preventive cloud policies can enforce safe configuration at creation time."
    },
    {
      id: "cloud-shared-identity-1",
      topic: "cloud-security",
      prompt: "In most cloud shared-responsibility models, who is responsible for customer IAM policies?",
      choices: ["The customer", "The power company", "The browser vendor only", "No one"],
      answer: 0,
      explanation: "Customers usually own identity, access, data, and workload configuration decisions."
    },
    {
      id: "iam-pam-jit-1",
      topic: "iam",
      prompt: "Which control best reduces standing administrator privilege?",
      choices: ["Just-in-time privileged access", "Shared root passwords", "Permanent global admin for every technician", "Anonymous management access"],
      answer: 0,
      explanation: "JIT privileged access grants elevated rights only when approved and needed."
    },
    {
      id: "iam-deprovision-2",
      topic: "iam",
      prompt: "An employee leaves the company. Which action prevents orphaned access?",
      choices: ["Deprovision accounts and revoke tokens/sessions", "Leave accounts active for convenience", "Remove only the office chair", "Disable log collection"],
      answer: 0,
      explanation: "Deprovisioning removes access after departure or role change."
    },
    {
      id: "securedev-sbom-1",
      topic: "secure-dev",
      prompt: "Which artifact lists software components and dependencies used in an application?",
      choices: ["SBOM", "RPO", "SLA", "ACL"],
      answer: 0,
      explanation: "A software bill of materials lists components and dependencies."
    },
    {
      id: "securedev-signing-key-1",
      topic: "secure-dev",
      prompt: "Why protect code-signing keys carefully?",
      choices: ["A stolen signing key can make malicious updates appear trusted", "Signing keys improve Wi-Fi range", "They replace all testing", "They are only used for printing"],
      answer: 0,
      explanation: "Compromised signing keys can undermine trust in the release process."
    },
    {
      id: "securedev-dependency-1",
      topic: "secure-dev",
      prompt: "A newly disclosed flaw affects a third-party package used by production apps. Which process helps most?",
      choices: ["Dependency monitoring and patch management", "Tailgating", "RF shielding", "Dumpster diving"],
      answer: 0,
      explanation: "Dependency monitoring identifies vulnerable packages so teams can update or mitigate them."
    },
    {
      id: "incident-framework-attck-1",
      topic: "incident",
      prompt: "Which framework helps classify adversary tactics and techniques for detection and hunting?",
      choices: ["MITRE ATT&CK", "SLA", "NDA", "WPS"],
      answer: 0,
      explanation: "MITRE ATT&CK organizes adversary tactics, techniques, and procedures."
    },
    {
      id: "incident-threat-hunt-1",
      topic: "incident",
      prompt: "A team forms a hypothesis that an attacker may be using PowerShell for lateral movement and searches logs proactively. What is this?",
      choices: ["Threat hunting", "Risk transfer", "Data masking", "Port mirroring only"],
      answer: 0,
      explanation: "Threat hunting proactively searches for attacker behavior that automated alerts may miss."
    }
  ],
  flashCards: [
    { id: "card-soc-triage", topic: "incident", term: "SOC Triage", definition: "Process of validating, prioritizing, scoping, and routing alerts for response." },
    { id: "card-escalation-summary", topic: "incident", term: "Escalation Summary", definition: "Concise evidence package with affected assets, indicators, impact, and recommended next action." },
    { id: "card-chain-custody-deep", topic: "incident", term: "Chain of Custody", definition: "Documented history of evidence collection, storage, transfer, and analysis." },
    { id: "card-legal-hold", topic: "incident", term: "Legal Hold", definition: "Requirement to preserve potentially relevant data for investigation or litigation." },
    { id: "card-threat-hunting", topic: "incident", term: "Threat Hunting", definition: "Hypothesis-driven search for attacker activity that alerts may not catch." },
    { id: "card-mitre-attack", topic: "incident", term: "MITRE ATT&CK", definition: "Knowledge base of adversary tactics, techniques, and procedures." },
    { id: "card-cvss", topic: "assessment", term: "CVSS", definition: "Standard scoring system for technical vulnerability severity." },
    { id: "card-vuln-priority", topic: "assessment", term: "Vulnerability Prioritization", definition: "Ranking fixes using severity, exposure, exploitability, asset value, and business impact." },
    { id: "card-remediation-validation", topic: "assessment", term: "Remediation Validation", definition: "Rescan, verify, or audit to prove a vulnerability was fixed." },
    { id: "card-policy-exception", topic: "governance", term: "Policy Exception", definition: "Approved temporary deviation with owner, risk, compensating controls, and expiration." },
    { id: "card-attestation", topic: "governance", term: "Attestation", definition: "Formal confirmation that access, control status, or a statement remains accurate." },
    { id: "card-audit-evidence", topic: "governance", term: "Audit Evidence", definition: "Artifacts proving a control exists and operated, such as logs, tickets, approvals, or reports." },
    { id: "card-sla", topic: "risk-privacy", term: "SLA", definition: "Service level agreement with measurable service commitments." },
    { id: "card-right-to-audit", topic: "risk-privacy", term: "Right-to-Audit", definition: "Contract clause allowing agreed review of a provider's controls." },
    { id: "card-rules-engagement", topic: "risk-privacy", term: "Rules of Engagement", definition: "Scope, limits, authorization, and procedures for testing or assessment." },
    { id: "card-cloud-misconfig", topic: "cloud-security", term: "Cloud Misconfiguration", definition: "Incorrect cloud setting such as public storage, overbroad IAM, exposed ports, or missing logs." },
    { id: "card-shared-responsibility-iam", topic: "cloud-security", term: "Customer Cloud Responsibilities", definition: "Usually identity, data, access policy, workload configuration, and logging choices." },
    { id: "card-pam", topic: "iam", term: "PAM", definition: "Privileged access management for administrator account control and monitoring." },
    { id: "card-jit-access", topic: "iam", term: "JIT Access", definition: "Temporary approved elevation instead of permanent privileged access." },
    { id: "card-sbom", topic: "secure-dev", term: "SBOM", definition: "Software bill of materials listing application components and dependencies." },
    { id: "card-code-signing-key", topic: "secure-dev", term: "Code-Signing Key", definition: "Private key used to sign trusted software releases; high-value supply-chain target." },
    { id: "card-dependency-monitoring", topic: "secure-dev", term: "Dependency Monitoring", definition: "Tracking third-party packages for vulnerabilities, updates, and supply-chain risk." }
  ]
};

uploadedMaterialExpansion.lessons.forEach(({ topic, lesson }) => {
  const target = topics.find((item) => item.id === topic);
  if (target && !target.lessons.some((item) => item.title === lesson.title)) target.lessons.push(lesson);
});

uploadedMaterialExpansion.questions.forEach((question) => {
  if (!fullQuestionBank.some((item) => item.id === question.id)) fullQuestionBank.push(question);
});

uploadedMaterialExpansion.flashCards.forEach((card) => {
  if (!flashCardBank.some((item) => item.id === card.id)) flashCardBank.push(card);
});

const ORIGINAL_DATA = {
  topics: deepClone(topics),
  fullQuestionBank: deepClone(fullQuestionBank),
  flashCardBank: deepClone(flashCardBank)
};

const DATA_TRANSLATION_SKIP_KEYS = new Set(["id", "topic", "icon", "color", "kind"]);
const LANGUAGE_PACK_URLS = {
  es: "./i18n/es.json"
};

const state = {
  screen: "home",
  topicId: null,
  lessonIndex: 0,
  quizIds: [],
  activeQuestions: [],
  quizMode: "topic",
  quizSourceTopic: null,
  quizSourceLessonIndex: null,
  resultSaved: false,
  flashCards: [],
  flashIndex: 0,
  flashFlipped: false,
  flashFilterTopic: "all",
  quizIndex: 0,
  selected: null,
  checked: false,
  answers: {},
  bookmarked: load("secplus-bookmarks", {}),
  flashSaved: load("secplus-saved-flashcards", {}),
  searchQuery: "",
  language: load("psa-language", "en"),
  translating: false,
  translationError: ""
};

const uiTranslations = {
  "English": "English",
  "Español": "Español",
  "lessons": "lecciones",
  "readiness": "preparación",
  "best final": "mejor final",
  "Daily Quick Drill": "Práctica rápida diaria",
  "Search": "Buscar",
  "Flash Cards": "Tarjetas",
  "Bookmarked Lessons": "Lecciones guardadas",
  "Exam Readiness": "Preparación para el examen",
  "Focus Next": "Enfócate después",
  "Take a quiz or quick drill to reveal weak areas.": "Haz un quiz o práctica rápida para ver tus áreas débiles.",
  "Start Practicing": "Empieza a practicar",
  "Keep Practicing": "Sigue practicando",
  "Almost Ready": "Casi listo",
  "Ready": "Listo",
  "Run a quick drill or 90-question final to calibrate.": "Haz una práctica rápida o un final de 90 preguntas para calibrarte.",
  "Use quick drills and review missed answers.": "Usa prácticas rápidas y revisa las respuestas falladas.",
  "Keep drilling missed questions and weaker areas.": "Sigue practicando preguntas falladas y áreas débiles.",
  "Recent final practice is in a strong pass range.": "Tu práctica final reciente está en un rango fuerte para aprobar.",
  "Choose Subject": "Elegir tema",
  "All Flash Cards": "Todas las tarjetas",
  "Saved Flash Cards": "Tarjetas guardadas",
  "All subjects": "Todos los temas",
  "Saved cards": "Tarjetas guardadas",
  "Subject": "Tema",
  "Save": "Guardar",
  "Saved": "Guardada",
  "Shuffle": "Mezclar",
  "Flip": "Voltear",
  "Tap to reveal the answer": "Toca para revelar la respuesta",
  "Tap to see the term": "Toca para ver el término",
  "Tap to see the example": "Toca para ver el ejemplo",
  "Home tile: Study": "Sección: Estudio",
  "Home tile": "Sección",
  "Study": "Estudio",
  "Quiz Results": "Resultados del quiz",
  "Review Missed": "Revisar falladas",
  "Next Lesson": "Siguiente lección",
  "Home": "Inicio",
  "Try Again": "Intentar otra vez",
  "Question": "Pregunta",
  "of": "de",
  "answered": "respondidas",
  "Check": "Revisar",
  "Correct": "Correcto",
  "Review": "Revisar",
  "Reveal": "Mostrar",
  "Prev": "Anterior",
  "Next": "Siguiente",
  "Done": "Listo",
  "Quiz": "Quiz",
  "Answer breakdown": "Desglose de respuestas",
  "Fresh 90 Final": "Final nuevo de 90",
  "Missed Questions": "Preguntas falladas",
  "Search lessons and flash cards by service, term, or exam clue.": "Busca lecciones y tarjetas por servicio, término o pista del examen.",
  "Search CIA, MFA, XSS, RAID...": "Busca CIA, MFA, XSS, RAID...",
  "No matches yet. Try a shorter term.": "Todavía no hay resultados. Prueba un término más corto.",
  "Lesson": "Lección",
  "Flash Card": "Tarjeta",
  "correct": "correctas",
  "Strong pass pace. Review missed questions once, then run another 90-question set.": "Vas a ritmo de aprobación. Revisa las preguntas falladas y luego haz otro set de 90 preguntas.",
  "Keep going. Tap review and focus on the explanations for missed questions.": "Sigue adelante. Toca revisar y enfócate en las explicaciones de las preguntas falladas.",
  "Start 90-question final practice": "Comenzar práctica final de 90 preguntas",
  "Updating language...": "Actualizando idioma...",
  "Spanish translation could not load. Check the language pack, then tap Español again.": "La traducción al español no pudo cargarse. Revisa el paquete de idioma y toca Español otra vez.",
  "True": "Verdadero",
  "False": "Falso",
  "Examples": "Ejemplos",
  "Answer": "Respuesta",
  "Term": "Término",
  "What The Test Rewards": "Qué recompensa el examen",
  "Security+ questions usually ask you to identify a control, attack, protocol, risk response, or recovery step from a short business scenario.": "Las preguntas de Security+ normalmente te piden identificar un control, ataque, protocolo, respuesta al riesgo o paso de recuperación a partir de un escenario breve.",
  "Look for clues about confidentiality, integrity, availability, identity, network boundaries, secure development, operations, governance, and incident response.": "Busca pistas sobre confidencialidad, integridad, disponibilidad, identidad, límites de red, desarrollo seguro, operaciones, gobernanza y respuesta a incidentes.",
  "For pacing, practice answering 90 questions in about 90 minutes. Mark long scenarios, answer the direct recognition questions first, and return to the harder ones.": "Para el ritmo, practica responder 90 preguntas en unos 90 minutos. Marca los escenarios largos, responde primero las preguntas de reconocimiento directo y vuelve a las más difíciles.",
  "Ask what the scenario is really protecting: data, identity, network traffic, an endpoint, a building, or a business process.": "Pregunta qué protege realmente el escenario: datos, identidad, tráfico de red, un endpoint, un edificio o un proceso de negocio.",
  "Fast Answer Pattern": "Patrón de respuesta rápida",
  "Read the last sentence first. It often names the action: authenticate, encrypt, segment, detect, contain, eradicate, recover, document, or accept risk.": "Lee primero la última oración. A menudo nombra la acción: autenticar, cifrar, segmentar, detectar, contener, erradicar, recuperar, documentar o aceptar riesgo.",
  "Eliminate answers that solve a different layer. A firewall filters traffic, MFA strengthens login, DLP watches sensitive data, and backups support recovery.": "Elimina respuestas que resuelven otra capa. Un firewall filtra tráfico, MFA fortalece el inicio de sesión, DLP vigila datos sensibles y los respaldos apoyan la recuperación.",
  "Scenario questions reward exact fit. If a word such as proximity, non-repudiation, sanitization, SIEM, or hot site appears, match that word to the purpose.": "Las preguntas de escenario recompensan el ajuste exacto. Si aparece una palabra como proximidad, no repudio, sanitización, SIEM o sitio caliente, relaciona esa palabra con su propósito.",
  "Verb plus asset plus constraint usually points to the answer.": "Verbo más activo más restricción normalmente señala la respuesta.",
  "Domain Weighting": "Ponderación de dominios",
  "Spend steady time on attacks and defenses because many questions describe symptoms before asking for the best control.": "Dedica tiempo constante a ataques y defensas porque muchas preguntas describen síntomas antes de pedir el mejor control.",
  "Identity, network design, endpoint hardening, cloud, incident response, governance, and risk appear repeatedly across chapters.": "Identidad, diseño de red, endurecimiento de endpoints, nube, respuesta a incidentes, gobernanza y riesgo aparecen repetidamente en los capítulos.",
  "Do not memorize only definitions. Practice choosing between similar controls such as IDS versus IPS, hashing versus encryption, and hot versus warm recovery sites.": "No memorices solo definiciones. Practica elegir entre controles parecidos como IDS frente a IPS, hashing frente a cifrado y sitios de recuperación calientes frente a tibios.",
  "When two answers seem right, pick the one with the tightest match to the stated requirement.": "Cuando dos respuestas parecen correctas, elige la que coincide mejor con el requisito indicado.",
  "Security+ Exam Map": "Mapa del examen Security+",
  "CIA Triad": "Tríada CIA",
  "Confidentiality limits information to authorized people, systems, or processes.": "La confidencialidad limita la información a personas, sistemas o procesos autorizados.",
  "Integrity means data is accurate and changed only in authorized ways.": "La integridad significa que los datos son exactos y se modifican solo de formas autorizadas.",
  "Availability means authorized users can reach information and services when needed.": "La disponibilidad significa que los usuarios autorizados pueden acceder a información y servicios cuando la necesitan.",
  "Confidentiality hides, integrity preserves, availability keeps working.": "La confidencialidad oculta, la integridad preserva y la disponibilidad mantiene el funcionamiento.",
  "Vulnerabilities And Threat Actors": "Vulnerabilidades y actores de amenaza",
  "A vulnerability is a weakness that can be exploited. A threat is a potential cause of harm, and risk combines likelihood with impact.": "Una vulnerabilidad es una debilidad que puede explotarse. Una amenaza es una posible causa de daño, y el riesgo combina probabilidad con impacto.",
  "Threat actors include insiders, criminals, nation-states, competitors, activists, and careless users.": "Los actores de amenaza incluyen internos, criminales, estados-nación, competidores, activistas y usuarios descuidados.",
  "Attack vectors include email, removable media, exposed services, social engineering, supply chain compromise, and physical access.": "Los vectores de ataque incluyen correo electrónico, medios removibles, servicios expuestos, ingeniería social, compromiso de la cadena de suministro y acceso físico.",
  "Weakness plus actor plus path equals a realistic risk scenario.": "Debilidad más actor más ruta equivale a un escenario de riesgo realista.",
  "Social Engineering And Malware": "Ingeniería social y malware",
  "Social engineering manipulates people into taking unsafe actions or revealing information.": "La ingeniería social manipula a las personas para que realicen acciones inseguras o revelen información.",
  "Phishing uses deceptive messages, vishing uses voice calls, smishing uses texts, and tailgating abuses physical access.": "El phishing usa mensajes engañosos, el vishing usa llamadas, el smishing usa textos y el tailgating abusa del acceso físico.",
  "Malware categories include viruses, worms, trojans, ransomware, spyware, rootkits, and logic bombs.": "Las categorías de malware incluyen virus, gusanos, troyanos, ransomware, spyware, rootkits y bombas lógicas.",
  "If the attacker targets human trust, think social engineering before technical exploits.": "Si el atacante apunta a la confianza humana, piensa en ingeniería social antes que en exploits técnicos.",
  "A policy requiring annual security training is an administrative control.": "Una política que exige capacitación anual de seguridad es un control administrativo.",
  "A locked server room is a physical control.": "Una sala de servidores cerrada con llave es un control físico.",
  "An endpoint detection agent is a technical control.": "Un agente de detección en endpoints es un control técnico.",
  "Control Type Examples": "Ejemplos de tipos de controles",
  "Controls can be administrative, technical, physical, preventive, detective, corrective, deterrent, or compensating.": "Los controles pueden ser administrativos, técnicos, físicos, preventivos, detectivos, correctivos, disuasorios o compensatorios.",
  "Security Principles": "Principios de seguridad",
  "Identification, Authentication, Authorization": "Identificación, autenticación y autorización",
  "Identification is a subject claiming an identity, such as a username, certificate, token, or account.": "La identificación es cuando un sujeto afirma una identidad, como un nombre de usuario, certificado, token o cuenta.",
  "Authentication proves the claimed identity with something you know, have, are, do, or somewhere you are.": "La autenticación prueba la identidad afirmada con algo que sabes, tienes, eres, haces o un lugar donde estás.",
  "Authorization decides what the authenticated subject is allowed to access or perform.": "La autorización decide qué puede acceder o realizar el sujeto autenticado.",
  "Identify who, authenticate proof, authorize permissions.": "Identifica quién, autentica la prueba, autoriza permisos.",
  "MFA And Biometrics": "MFA y biometría",
  "Multifactor authentication uses factors from different categories, such as a password plus a token or biometric.": "La autenticación multifactor usa factores de categorías distintas, como contraseña más token o biometría.",
  "Biometric systems must balance false acceptance, false rejection, and crossover error rate.": "Los sistemas biométricos deben equilibrar falsa aceptación, falso rechazo y tasa de error de cruce.",
  "Smart cards, tokens, authenticator apps, certificates, and SSH keys are common authentication methods.": "Tarjetas inteligentes, tokens, aplicaciones autenticadoras, certificados y claves SSH son métodos comunes de autenticación.",
  "Two passwords are not true MFA because they are the same factor type.": "Dos contraseñas no son MFA real porque son el mismo tipo de factor.",
  "Access Control Models": "Modelos de control de acceso",
  "DAC lets owners control access to their objects, while MAC uses labels and central policy.": "DAC permite que los dueños controlen acceso a sus objetos, mientras MAC usa etiquetas y política central.",
  "RBAC assigns access by job role, and rule-based access evaluates conditions such as time, location, or network.": "RBAC asigna acceso por rol laboral, y el acceso basado en reglas evalúa condiciones como hora, ubicación o red.",
  "Least privilege, separation of duties, account reviews, and disabling stale accounts reduce identity risk.": "Mínimo privilegio, separación de funciones, revisiones de cuentas y deshabilitar cuentas antiguas reducen el riesgo de identidad.",
  "RBAC is role-based; rule-based access follows conditions.": "RBAC se basa en roles; el acceso basado en reglas sigue condiciones.",
  "Kerberos uses tickets to support single sign-on in many enterprise environments.": "Kerberos usa tickets para admitir inicio de sesión único en muchos entornos empresariales.",
  "RADIUS centralizes authentication, authorization, and accounting for network access.": "RADIUS centraliza autenticación, autorización y contabilidad para acceso de red.",
  "802.1X controls access to a switch port or wireless network before full connectivity is allowed.": "802.1X controla el acceso a un puerto de switch o red inalámbrica antes de permitir conectividad completa.",
  "Authentication Protocol Examples": "Ejemplos de protocolos de autenticación",
  "Authentication protocols often appear in network access scenarios.": "Los protocolos de autenticación suelen aparecer en escenarios de acceso a red.",
  "Identity & Access": "Identidad y acceso",
  "Crypto Services": "Servicios criptográficos",
  "Encryption protects confidentiality by making data unreadable without the correct key.": "El cifrado protege la confidencialidad al hacer que los datos sean ilegibles sin la clave correcta.",
  "Hashing supports integrity by producing a fixed-length digest that changes when the data changes.": "El hashing apoya la integridad al producir un resumen de longitud fija que cambia cuando cambian los datos.",
  "Digital signatures support authentication, integrity, and non-repudiation.": "Las firmas digitales apoyan autenticación, integridad y no repudio.",
  "Encrypt to hide, hash to detect change, sign to prove origin.": "Cifra para ocultar, hashea para detectar cambios, firma para probar origen.",
  "Symmetric And Asymmetric": "Simétrico y asimétrico",
  "Symmetric encryption uses the same secret key to encrypt and decrypt, so it is fast but needs secure key sharing.": "El cifrado simétrico usa la misma clave secreta para cifrar y descifrar, por eso es rápido pero requiere compartir la clave de forma segura.",
  "Asymmetric encryption uses a public key and private key pair, which helps with key exchange and digital signatures.": "El cifrado asimétrico usa un par de clave pública y privada, lo que ayuda con intercambio de claves y firmas digitales.",
  "Many secure protocols use asymmetric cryptography to establish trust, then symmetric keys for bulk data.": "Muchos protocolos seguros usan criptografía asimétrica para establecer confianza y luego claves simétricas para datos masivos.",
  "Symmetric is fast; asymmetric solves sharing and identity problems.": "Lo simétrico es rápido; lo asimétrico resuelve problemas de intercambio e identidad.",
  "PKI And Certificates": "PKI y certificados",
  "A certificate binds an identity to a public key and is issued by a certificate authority.": "Un certificado vincula una identidad a una clave pública y lo emite una autoridad certificadora.",
  "PKI includes certificate authorities, registration authorities, certificates, revocation, and trust chains.": "PKI incluye autoridades certificadoras, autoridades de registro, certificados, revocación y cadenas de confianza.",
  "Certificate revocation can be checked through CRL or OCSP when a certificate should no longer be trusted.": "La revocación de certificados puede comprobarse mediante CRL u OCSP cuando un certificado ya no debe confiarse.",
  "Certificates answer: who owns this public key?": "Los certificados responden: ¿quién posee esta clave pública?",
  "A downloaded file checksum helps detect whether the file changed.": "Una suma de comprobación de un archivo descargado ayuda a detectar si el archivo cambió.",
  "An HMAC proves integrity and uses a shared secret.": "Un HMAC prueba integridad y usa un secreto compartido.",
  "A signed contract helps prevent the sender from denying the message later.": "Un contrato firmado ayuda a evitar que el remitente niegue el mensaje después.",
  "Hash, MAC, And Signature Examples": "Ejemplos de hash, MAC y firma",
  "Integrity only detects change; non-repudiation ties the action to a sender.": "La integridad solo detecta cambios; el no repudio vincula la acción con un remitente.",
  "Cryptography": "Criptografía",
  "DDoS And DNS Attacks": "DDoS y ataques DNS",
  "DoS disrupts a service; DDoS uses many systems to flood or exhaust the target.": "DoS interrumpe un servicio; DDoS usa muchos sistemas para inundar o agotar el objetivo.",
  "Network-based DDoS attacks consume bandwidth, protocol attacks exhaust state, and application attacks overload specific functions.": "Los DDoS basados en red consumen ancho de banda, los de protocolo agotan estado y los de aplicación sobrecargan funciones específicas.",
  "DNS poisoning and domain hijacking misdirect users by corrupting name resolution or control of a domain.": "El envenenamiento DNS y el secuestro de dominio desvían usuarios al corromper la resolución de nombres o el control del dominio.",
  "DDoS blocks access; DNS attacks redirect trust.": "DDoS bloquea acceso; los ataques DNS redirigen la confianza.",
  "Layer 2 And On-Path Attacks": "Ataques de capa 2 y en ruta",
  "ARP poisoning tricks hosts into sending traffic to the attacker's MAC address.": "El envenenamiento ARP engaña a los hosts para enviar tráfico a la dirección MAC del atacante.",
  "MAC flooding overwhelms a switch table so the switch may forward frames more broadly.": "La inundación MAC satura la tabla de un switch para que pueda reenviar tramas de forma más amplia.",
  "On-path attacks intercept traffic between parties, while replay attacks resend captured valid traffic.": "Los ataques en ruta interceptan tráfico entre partes, mientras los de repetición reenvían tráfico válido capturado.",
  "If the attacker sits between two parties, think on-path.": "Si el atacante se coloca entre dos partes, piensa en ataque en ruta.",
  "Secure Protocol Choices": "Elección de protocolos seguros",
  "HTTPS protects web traffic with TLS, while LDAPS protects directory queries.": "HTTPS protege tráfico web con TLS, mientras LDAPS protege consultas de directorio.",
  "SSH, SFTP, and FTPS provide safer remote administration or file transfer than plaintext options.": "SSH, SFTP y FTPS proporcionan administración remota o transferencia de archivos más seguras que opciones en texto claro.",
  "SNMPv3 adds authentication and encryption compared with older SNMP versions.": "SNMPv3 agrega autenticación y cifrado en comparación con versiones antiguas de SNMP.",
  "When a protocol handles credentials or sensitive data, prefer the encrypted version.": "Cuando un protocolo maneja credenciales o datos sensibles, prefiere la versión cifrada.",
  "A mail client needs encrypted IMAP access. Choose IMAPS.": "Un cliente de correo necesita acceso IMAP cifrado. Elige IMAPS.",
  "Voice packets need confidentiality and integrity. Choose SRTP.": "Los paquetes de voz necesitan confidencialidad e integridad. Elige SRTP.",
  "An administrator needs secure command-line access to a Linux server. Choose SSH.": "Un administrador necesita acceso seguro por línea de comandos a un servidor Linux. Elige SSH.",
  "Protocol Recognition Examples": "Ejemplos de reconocimiento de protocolos",
  "Most protocol questions are asking for the secure version of a familiar service.": "La mayoría de preguntas de protocolos piden la versión segura de un servicio conocido.",
  "Network Attacks & Protocols": "Ataques y protocolos de red",
  "Segmentation And Zones": "Segmentación y zonas",
  "Network segmentation partitions a network into zones with different trust levels.": "La segmentación de red divide una red en zonas con diferentes niveles de confianza.",
  "A DMZ sits between trusted and untrusted networks and commonly hosts public-facing services.": "Una DMZ se ubica entre redes confiables y no confiables y suele alojar servicios públicos.",
  "VLANs separate broadcast domains, while firewalls enforce rules between zones.": "Las VLAN separan dominios de broadcast, mientras los firewalls aplican reglas entre zonas.",
  "Segment first, then filter traffic between segments.": "Segmenta primero y luego filtra tráfico entre segmentos.",
  "Zero Trust": "Zero Trust",
  "Zero trust means never automatically trusting a user, device, or network location.": "Confianza cero significa no confiar automáticamente en un usuario, dispositivo o ubicación de red.",
  "Core ideas include verify explicitly, use least privilege, and assume breach.": "Las ideas centrales incluyen verificar explícitamente, usar mínimo privilegio y asumir compromiso.",
  "Continuous monitoring, device posture, identity signals, and microsegmentation support zero trust.": "Monitoreo continuo, postura del dispositivo, señales de identidad y microsegmentación apoyan confianza cero.",
  "Zero trust is a mindset and architecture, not a single product.": "Confianza cero es una mentalidad y arquitectura, no un solo producto.",
  "Firewalls, IDS, IPS, VPN": "Firewalls, IDS, IPS y VPN",
  "Firewalls allow or deny traffic based on rules, application context, or inspection capabilities.": "Los firewalls permiten o niegan tráfico según reglas, contexto de aplicación o capacidades de inspección.",
  "IDS detects and alerts, while IPS can detect and block inline traffic.": "IDS detecta y alerta, mientras IPS puede detectar y bloquear tráfico en línea.",
  "VPNs create encrypted tunnels for remote access or site-to-site connectivity.": "Las VPN crean túneles cifrados para acceso remoto o conectividad sitio a sitio.",
  "IDS watches; IPS can stop.": "IDS observa; IPS puede detener.",
  "A public web server should not sit directly inside the trusted LAN. Place it in a DMZ.": "Un servidor web público no debe estar directamente dentro de la LAN confiable. Colócalo en una DMZ.",
  "A branch office needs encrypted connectivity to headquarters. Use a site-to-site VPN.": "Una sucursal necesita conectividad cifrada con la sede. Usa una VPN sitio a sitio.",
  "A switch should prevent unknown devices from joining. Use port security or 802.1X.": "Un switch debe evitar que dispositivos desconocidos se unan. Usa seguridad de puertos o 802.1X.",
  "Traffic Design Examples": "Ejemplos de diseño de tráfico",
  "Design questions often reveal the answer through where the traffic must be allowed or denied.": "Las preguntas de diseño suelen revelar la respuesta por dónde debe permitirse o negarse el tráfico.",
  "Secure Network Design": "Diseño de red seguro",
  "Wireless Basics": "Conceptos inalámbricos básicos",
  "Wireless communication uses radio frequency bands, channels, antennas, and signal strength.": "La comunicación inalámbrica usa bandas de radiofrecuencia, canales, antenas y potencia de señal.",
  "Common wireless technologies include Wi-Fi, Bluetooth, NFC, RFID, cellular, and GPS.": "Las tecnologías inalámbricas comunes incluyen Wi-Fi, Bluetooth, NFC, RFID, celular y GPS.",
  "Frequency, range, interference, and security settings all affect wireless reliability and risk.": "Frecuencia, alcance, interferencia y configuración de seguridad afectan la confiabilidad y el riesgo inalámbrico.",
  "RFID commonly appears with badges, tags, and proximity readers.": "RFID suele aparecer con credenciales, etiquetas y lectores de proximidad.",
  "Wi-Fi Security": "Seguridad Wi-Fi",
  "Use modern encryption such as WPA3 where available and avoid weak legacy options.": "Usa cifrado moderno como WPA3 cuando esté disponible y evita opciones antiguas débiles.",
  "Enterprise wireless commonly uses 802.1X with RADIUS for centralized authentication.": "Las redes inalámbricas empresariales suelen usar 802.1X con RADIUS para autenticación centralizada.",
  "Evil twin access points, rogue APs, jamming, and deauthentication attacks target wireless clients.": "Puntos de acceso evil twin, APs no autorizados, interferencia y ataques de desautenticación apuntan a clientes inalámbricos.",
  "For enterprise Wi-Fi identity, think 802.1X and RADIUS.": "Para identidad Wi-Fi empresarial, piensa en 802.1X y RADIUS.",
  "Mobile And IoT Controls": "Controles móviles e IoT",
  "MDM and UEM tools enforce policies, push updates, manage apps, and remotely wipe lost devices.": "Las herramientas MDM y UEM aplican políticas, envían actualizaciones, administran apps y borran dispositivos perdidos de forma remota.",
  "Mobile risks include sideloading, jailbreaking, rooting, malicious apps, and lost devices.": "Los riesgos móviles incluyen sideloading, jailbreak, rooting, apps maliciosas y dispositivos perdidos.",
  "IoT devices often need segmentation, default password changes, firmware updates, and restricted network access.": "Los dispositivos IoT suelen necesitar segmentación, cambio de contraseñas por defecto, actualizaciones de firmware y acceso de red restringido.",
  "Treat unmanaged smart devices as low-trust endpoints.": "Trata los dispositivos inteligentes no administrados como endpoints de baja confianza.",
  "A door badge works when held near a reader. RFID is the likely technology.": "Una credencial de puerta funciona al acercarla al lector. RFID es la tecnología probable.",
  "A phone should be wiped after being lost at an airport. Use MDM or UEM.": "Un teléfono debe borrarse después de perderse en un aeropuerto. Usa MDM o UEM.",
  "Visitors should use internet access without touching internal systems. Put guest Wi-Fi on a separate segment.": "Los visitantes deben usar internet sin tocar sistemas internos. Pon Wi-Fi de invitados en un segmento separado.",
  "Wireless Scenario Examples": "Ejemplos de escenarios inalámbricos",
  "Wireless questions usually hinge on distance, identity, or device management.": "Las preguntas inalámbricas suelen depender de distancia, identidad o administración del dispositivo.",
  "Wireless, Mobile & IoT": "Inalámbrico, móvil e IoT",
  "XSS And Request Forgery": "XSS y falsificación de solicitudes",
  "XSS injects client-side script into pages viewed by other users.": "XSS inyecta script del lado del cliente en páginas vistas por otros usuarios.",
  "CSRF tricks an authenticated browser into sending an unwanted request.": "CSRF engaña a un navegador autenticado para enviar una solicitud no deseada.",
  "SSRF tricks a server into making requests to internal or external resources chosen by an attacker.": "SSRF engaña a un servidor para hacer solicitudes a recursos internos o externos elegidos por un atacante.",
  "XSS runs in the victim browser; SSRF sends requests from the server.": "XSS se ejecuta en el navegador de la víctima; SSRF envía solicitudes desde el servidor.",
  "Injection And Traversal": "Inyección y traversal",
  "SQL, XML, LDAP, command, and DLL injection attacks abuse untrusted input as instructions.": "Los ataques de inyección SQL, XML, LDAP, comandos y DLL abusan de entradas no confiables como instrucciones.",
  "Directory traversal uses path tricks to access files outside the intended directory.": "El traversal de directorios usa trucos de ruta para acceder a archivos fuera del directorio previsto.",
  "Prepared statements, input validation, output encoding, and least privilege reduce many application attacks.": "Sentencias preparadas, validación de entrada, codificación de salida y mínimo privilegio reducen muchos ataques a aplicaciones.",
  "If input becomes code or a path, validate and constrain it.": "Si la entrada se convierte en código o ruta, valídala y limítala.",
  "Memory And Logic Attacks": "Ataques de memoria y lógica",
  "Buffer overflows write past intended memory boundaries and may crash or execute code.": "Los desbordamientos de búfer escriben más allá de límites de memoria previstos y pueden bloquear o ejecutar código.",
  "Race conditions occur when timing changes the security result between check and use.": "Las condiciones de carrera ocurren cuando el tiempo cambia el resultado de seguridad entre comprobación y uso.",
  "Privilege escalation, pass-the-hash, replay, and resource exhaustion exploit weaknesses in access or processing.": "Escalamiento de privilegios, pass-the-hash, repetición y agotamiento de recursos explotan debilidades en acceso o procesamiento.",
  "Memory flaws break boundaries; logic flaws break assumptions.": "Las fallas de memoria rompen límites; las fallas lógicas rompen supuestos.",
  "A comment field stores JavaScript that runs for other users. Think stored XSS.": "Un campo de comentarios guarda JavaScript que se ejecuta para otros usuarios. Piensa en XSS almacenado.",
  "A URL contains ../../ to read a sensitive file. Think directory traversal.": "Una URL contiene ../../ para leer un archivo sensible. Piensa en traversal de directorios.",
  "A captured NTLM hash is reused to authenticate. Think pass the hash.": "Un hash NTLM capturado se reutiliza para autenticarse. Piensa en pass the hash.",
  "Attack Clue Examples": "Ejemplos de pistas de ataque",
  "Name the data being abused: browser script, database query, file path, hash, or timing.": "Nombra el dato que se abusa: script del navegador, consulta de base de datos, ruta de archivo, hash o tiempo.",
  "Application Attacks": "Ataques a aplicaciones",
  "Environments And Version Control": "Entornos y control de versiones",
  "Development, test, staging, and production environments separate building, validation, release rehearsal, and live use.": "Los entornos de desarrollo, prueba, staging y producción separan construcción, validación, ensayo de lanzamiento y uso real.",
  "Staging should closely mirror production so deployment and migration issues are found before release.": "Staging debe parecerse mucho a producción para encontrar problemas de despliegue y migración antes del lanzamiento.",
  "Version control tracks changes, supports rollback, and helps teams review code before merging.": "El control de versiones rastrea cambios, permite rollback y ayuda a los equipos a revisar código antes de fusionarlo.",
  "Do not test risky changes directly in production.": "No pruebes cambios riesgosos directamente en producción.",
  "Secure Coding Practices": "Prácticas de codificación segura",
  "Secure coding uses input validation, output encoding, error handling, safe secrets, and least privilege.": "La codificación segura usa validación de entrada, codificación de salida, manejo de errores, secretos seguros y mínimo privilegio.",
  "Secrets should be stored in a vault or protected configuration, not hardcoded in source code.": "Los secretos deben guardarse en una bóveda o configuración protegida, no codificados en el código fuente.",
  "Dependency management checks third-party packages for vulnerabilities and license or supply-chain risk.": "La administración de dependencias revisa paquetes de terceros por vulnerabilidades y riesgos de licencia o cadena de suministro.",
  "Never trust input, never hardcode secrets, and review dependencies.": "Nunca confíes en entradas, nunca incrustes secretos y revisa dependencias.",
  "Testing And Automation": "Pruebas y automatización",
  "Code review finds logic and design problems before release.": "La revisión de código encuentra problemas de lógica y diseño antes del lanzamiento.",
  "Fuzzing sends unexpected input to discover crashes, memory bugs, and parsing weaknesses.": "El fuzzing envía entradas inesperadas para descubrir bloqueos, errores de memoria y debilidades de parsing.",
  "SAST analyzes source code, DAST tests a running application, and CI/CD automates repeatable checks.": "SAST analiza código fuente, DAST prueba una aplicación en ejecución y CI/CD automatiza comprobaciones repetibles.",
  "SAST is before runtime; DAST is against the running app.": "SAST es antes de la ejecución; DAST es contra la app en ejecución.",
  "A final release needs a production-like rehearsal. Use staging.": "Una versión final necesita un ensayo parecido a producción. Usa staging.",
  "A scanner examines source code for insecure functions. That is SAST.": "Un escáner examina código fuente en busca de funciones inseguras. Eso es SAST.",
  "Random malformed inputs are sent to an API parser. That is fuzzing.": "Entradas aleatorias mal formadas se envían a un parser de API. Eso es fuzzing.",
  "Secure SDLC Examples": "Ejemplos de SDLC seguro",
  "Secure development questions often ask where in the pipeline a control belongs.": "Las preguntas de desarrollo seguro suelen preguntar dónde pertenece un control en la canalización.",
  "Secure App Development": "Desarrollo seguro de aplicaciones",
  "Endpoint Protection": "Protección de endpoints",
  "Endpoints include laptops, desktops, phones, servers, printers, sensors, and other connected devices.": "Los endpoints incluyen laptops, escritorios, teléfonos, servidores, impresoras, sensores y otros dispositivos conectados.",
  "Anti-malware blocks known malicious software, while EDR collects endpoint telemetry and supports investigation and response.": "Antimalware bloquea software malicioso conocido, mientras EDR recopila telemetría del endpoint y apoya investigación y respuesta.",
  "DLP helps detect or prevent sensitive data from leaving approved locations.": "DLP ayuda a detectar o evitar que datos sensibles salgan de ubicaciones aprobadas.",
  "EDR is deeper endpoint detection and response, not just signature scanning.": "EDR es detección y respuesta de endpoint más profunda, no solo escaneo de firmas.",
  "Hardening": "Endurecimiento",
  "Hardening reduces attack surface by disabling unnecessary services, closing ports, and removing unneeded software.": "El endurecimiento reduce la superficie de ataque al deshabilitar servicios innecesarios, cerrar puertos y quitar software no necesario.",
  "Patch management keeps operating systems, applications, firmware, and drivers updated against known vulnerabilities.": "La administración de parches mantiene sistemas operativos, aplicaciones, firmware y controladores actualizados contra vulnerabilidades conocidas.",
  "Baseline configurations, secure registry settings, host firewalls, and strong password policies make endpoints more consistent.": "Configuraciones base, ajustes seguros de registro, firewalls de host y políticas fuertes de contraseñas hacen que los endpoints sean más consistentes.",
  "Turn off what you do not need, patch what you keep.": "Apaga lo que no necesitas, parchea lo que conservas.",
  "Boot And Disk Protection": "Protección de arranque y disco",
  "Full-disk encryption protects stored data if a device is lost or stolen.": "El cifrado de disco completo protege datos almacenados si un dispositivo se pierde o es robado.",
  "Secure boot and measured boot help ensure trusted components load during startup.": "Secure boot y measured boot ayudan a asegurar que componentes confiables se carguen durante el arranque.",
  "TPM can protect keys and support hardware-backed security operations.": "TPM puede proteger claves y apoyar operaciones de seguridad respaldadas por hardware.",
  "Disk encryption protects data at rest; secure boot protects startup integrity.": "El cifrado de disco protege datos en reposo; secure boot protege la integridad del arranque.",
  "A laptop with customer files is stolen. Full-disk encryption reduces data exposure.": "Una laptop con archivos de clientes es robada. El cifrado de disco completo reduce la exposición de datos.",
  "A server exposes an unused service. Disable the service and close the port.": "Un servidor expone un servicio no usado. Deshabilita el servicio y cierra el puerto.",
  "Analysts need endpoint timeline and process data after an alert. Use EDR.": "Los analistas necesitan línea de tiempo y datos de procesos del endpoint tras una alerta. Usa EDR.",
  "Endpoint Control Examples": "Ejemplos de controles de endpoint",
  "Endpoint questions usually ask how to reduce exposure or investigate a device.": "Las preguntas de endpoint suelen preguntar cómo reducir exposición o investigar un dispositivo.",
  "Endpoint Security": "Seguridad de endpoints",
  "Cloud Models": "Modelos de nube",
  "IaaS provides virtualized infrastructure, PaaS provides a managed platform, and SaaS provides a finished application.": "IaaS proporciona infraestructura virtualizada, PaaS proporciona una plataforma administrada y SaaS proporciona una aplicación terminada.",
  "Public, private, hybrid, and community cloud models differ in ownership, control, and sharing.": "Los modelos de nube pública, privada, híbrida y comunitaria difieren en propiedad, control y compartición.",
  "Shared responsibility changes depending on the service model, but customers always care about data, identity, and configuration.": "La responsabilidad compartida cambia según el modelo de servicio, pero los clientes siempre se preocupan por datos, identidad y configuración.",
  "As service models move toward SaaS, the provider manages more.": "A medida que los modelos se acercan a SaaS, el proveedor administra más.",
  "Containers, Serverless, Virtualization": "Contenedores, serverless y virtualización",
  "Virtual machines emulate full systems, while containers package applications and dependencies with shared host resources.": "Las máquinas virtuales emulan sistemas completos, mientras los contenedores empaquetan aplicaciones y dependencias con recursos compartidos del host.",
  "Serverless runs code in response to events without managing the underlying servers.": "Serverless ejecuta código en respuesta a eventos sin administrar los servidores subyacentes.",
  "Microservices split applications into smaller services that can be deployed and scaled independently.": "Los microservicios dividen aplicaciones en servicios más pequeños que pueden desplegarse y escalarse de forma independiente.",
  "Containers package apps; serverless reacts to events.": "Los contenedores empaquetan apps; serverless reacciona a eventos.",
  "Cloud Security Controls": "Controles de seguridad en la nube",
  "Cloud security uses IAM, network controls, encryption, logging, posture management, and secure configuration.": "La seguridad en la nube usa IAM, controles de red, cifrado, registros, administración de postura y configuración segura.",
  "CASB helps enforce policy between users and cloud services.": "CASB ayuda a aplicar políticas entre usuarios y servicios en la nube.",
  "Infrastructure as Code makes deployments repeatable but requires review to avoid repeating insecure settings.": "Infrastructure as Code hace que los despliegues sean repetibles, pero requiere revisión para no repetir configuraciones inseguras.",
  "Cloud misconfiguration is one of the most common cloud risks.": "La mala configuración de nube es uno de los riesgos de nube más comunes.",
  "A company wants managed email with minimal infrastructure duties. SaaS fits.": "Una empresa quiere correo administrado con mínimas tareas de infraestructura. SaaS encaja.",
  "Developers deploy repeatable network and compute settings from code. Think IaC.": "Los desarrolladores despliegan configuraciones repetibles de red y cómputo desde código. Piensa en IaC.",
  "Security needs visibility and policy controls for cloud app usage. Think CASB.": "Seguridad necesita visibilidad y controles de política para uso de apps en la nube. Piensa en CASB.",
  "Cloud Scenario Examples": "Ejemplos de escenarios de nube",
  "Cloud questions often ask what layer the customer still controls.": "Las preguntas de nube suelen preguntar qué capa aún controla el cliente.",
  "Cloud Security": "Seguridad en la nube",
  "Data Destruction": "Destrucción de datos",
  "Paper can be destroyed by shredding, burning, or pulping depending on sensitivity and requirements.": "El papel puede destruirse mediante trituración, incineración o pulpeado según sensibilidad y requisitos.",
  "Media sanitization includes clearing, purging, cryptographic erase, degaussing, and destruction.": "La sanitización de medios incluye borrado lógico, purga, borrado criptográfico, desmagnetización y destrucción.",
  "Choose destruction when media is damaged, highly sensitive, or should never be reused.": "Elige destrucción cuando el medio está dañado, es muy sensible o nunca debe reutilizarse.",
  "Sanitize for reuse; destroy for no reuse.": "Sanitiza para reutilizar; destruye para no reutilizar.",
  "Physical Access Controls": "Controles de acceso físico",
  "Physical controls include locks, guards, cameras, lighting, fencing, mantraps, badges, and visitor logs.": "Los controles físicos incluyen cerraduras, guardias, cámaras, iluminación, cercas, esclusas, credenciales y registros de visitantes.",
  "Proximity card readers commonly use RFID to read a badge without direct contact.": "Los lectores de tarjetas de proximidad comúnmente usan RFID para leer una credencial sin contacto directo.",
  "Biometrics, smart cards, and PINs can strengthen restricted-area access when used together.": "Biometría, tarjetas inteligentes y PINs pueden fortalecer acceso a áreas restringidas cuando se usan juntos.",
  "Proximity badge equals RFID in many exam scenarios.": "Credencial de proximidad equivale a RFID en muchos escenarios de examen.",
  "Availability And Restoration": "Disponibilidad y restauración",
  "Backups, RAID, redundant power, UPS, generators, and alternate sites support availability.": "Respaldos, RAID, energía redundante, UPS, generadores y sitios alternos apoyan disponibilidad.",
  "Hot sites are ready to operate quickly, warm sites have partial resources ready, and cold sites provide basic space and utilities.": "Los sitios calientes están listos para operar rápido, los tibios tienen recursos parciales preparados y los fríos proveen espacio y servicios básicos.",
  "RTO is how quickly service must be restored, and RPO is how much data loss is acceptable.": "RTO es qué tan rápido debe restaurarse el servicio, y RPO es cuánta pérdida de datos es aceptable.",
  "RTO is time to recover; RPO is data you can afford to lose.": "RTO es tiempo para recuperar; RPO son datos que puedes permitirte perder.",
  "A recovery facility has power and network circuits arranged but is not a live duplicate. That is closest to a warm site.": "Una instalación de recuperación tiene energía y circuitos de red preparados pero no es un duplicado activo. Eso se acerca a un sitio tibio.",
  "A door unlocks when an employee holds a badge near the reader. RFID is the likely technology.": "Una puerta se desbloquea cuando un empleado acerca una credencial al lector. RFID es la tecnología probable.",
  "A data center needs protection during a short power outage. Use a UPS.": "Un centro de datos necesita protección durante un apagón breve. Usa un UPS.",
  "Physical Security Examples": "Ejemplos de seguridad física",
  "Physical security questions often hide the answer in the facility or recovery wording.": "Las preguntas de seguridad física suelen esconder la respuesta en la redacción de la instalación o recuperación.",
  "Cybersecurity & Physical Security": "Ciberseguridad y seguridad física",
  "Vulnerability Scanning": "Escaneo de vulnerabilidades",
  "A vulnerability scanner checks systems for known weaknesses, missing patches, misconfigurations, and risky services.": "Un escáner de vulnerabilidades revisa sistemas por debilidades conocidas, parches faltantes, malas configuraciones y servicios riesgosos.",
  "Authenticated scans provide deeper results because the scanner can inspect local configuration.": "Los escaneos autenticados dan resultados más profundos porque el escáner puede inspeccionar configuración local.",
  "Findings should be prioritized by severity, exploitability, exposure, and business impact.": "Los hallazgos deben priorizarse por severidad, explotabilidad, exposición e impacto de negocio.",
  "Scanning finds and ranks; remediation fixes.": "El escaneo encuentra y clasifica; la remediación corrige.",
  "Logging And Event Management": "Registros y administración de eventos",
  "Logs record activity from systems, applications, security tools, and network devices.": "Los registros documentan actividad de sistemas, aplicaciones, herramientas de seguridad y dispositivos de red.",
  "SIEM collects, correlates, alerts on, and helps analyze security events.": "SIEM recopila, correlaciona, alerta y ayuda a analizar eventos de seguridad.",
  "SOAR automates response playbooks and can coordinate actions across tools.": "SOAR automatiza playbooks de respuesta y puede coordinar acciones entre herramientas.",
  "SIEM sees and correlates; SOAR automates response.": "SIEM ve y correlaciona; SOAR automatiza respuesta.",
  "Penetration Testing And Threat Intel": "Pruebas de penetración e inteligencia de amenazas",
  "Penetration testing safely attempts to exploit weaknesses to prove real-world impact.": "Las pruebas de penetración intentan explotar debilidades de forma segura para probar impacto real.",
  "Rules of engagement define scope, timing, allowed techniques, and communication expectations.": "Las reglas de compromiso definen alcance, horario, técnicas permitidas y expectativas de comunicación.",
  "Threat intelligence uses indicators, TTPs, advisories, and research to guide defense.": "La inteligencia de amenazas usa indicadores, TTPs, avisos e investigación para guiar la defensa.",
  "A scan reports likely weakness; a pen test demonstrates impact.": "Un escaneo reporta debilidad probable; una prueba de penetración demuestra impacto.",
  "A tool correlates firewall, endpoint, and authentication alerts. That is SIEM work.": "Una herramienta correlaciona alertas de firewall, endpoint y autenticación. Eso es trabajo de SIEM.",
  "A tester must know what systems are in scope before exploitation. Use rules of engagement.": "Un tester debe saber qué sistemas están en alcance antes de explotar. Usa reglas de compromiso.",
  "A scanner logs into a host to inspect patch level. That is an authenticated scan.": "Un escáner inicia sesión en un host para revisar nivel de parches. Eso es un escaneo autenticado.",
  "Assessment Examples": "Ejemplos de evaluación",
  "Assessment questions ask whether you are finding, proving, correlating, or fixing.": "Las preguntas de evaluación preguntan si estás encontrando, probando, correlacionando o corrigiendo.",
  "Security Assessment": "Evaluación de seguridad",
  "IR Lifecycle": "Ciclo de respuesta a incidentes",
  "Incident response preparation creates the team, plans, tools, playbooks, and communication paths before an incident.": "La preparación de respuesta a incidentes crea equipo, planes, herramientas, playbooks y rutas de comunicación antes de un incidente.",
  "Identification confirms whether an event is an incident and starts triage.": "La identificación confirma si un evento es un incidente e inicia el triage.",
  "Containment, eradication, recovery, and lessons learned move from limiting damage to restoring operations and improving controls.": "Contención, erradicación, recuperación y lecciones aprendidas pasan de limitar daño a restaurar operaciones y mejorar controles.",
  "Prepare, identify, contain, eradicate, recover, learn.": "Preparar, identificar, contener, erradicar, recuperar, aprender.",
  "Containment And Eradication": "Contención y erradicación",
  "Containment isolates affected systems or accounts so damage does not spread.": "La contención aísla sistemas o cuentas afectados para que el daño no se propague.",
  "Eradication removes the root cause, such as malware, compromised credentials, or vulnerable services.": "La erradicación elimina la causa raíz, como malware, credenciales comprometidas o servicios vulnerables.",
  "Recovery restores systems carefully and monitors for signs that the incident returns.": "La recuperación restaura sistemas con cuidado y monitorea señales de que el incidente regresa.",
  "Contain first to stop spread; eradicate to remove cause.": "Contén primero para detener propagación; erradica para eliminar la causa.",
  "Digital Forensics": "Forense digital",
  "Digital forensics preserves, collects, analyzes, and reports evidence in a defensible way.": "La forense digital preserva, recopila, analiza y reporta evidencia de forma defendible.",
  "Chain of custody documents who handled evidence, when, why, and how it was protected.": "La cadena de custodia documenta quién manejó evidencia, cuándo, por qué y cómo se protegió.",
  "Volatile data such as memory and running processes should be collected before less volatile evidence when appropriate.": "Datos volátiles como memoria y procesos en ejecución deben recopilarse antes que evidencia menos volátil cuando corresponda.",
  "Preserve evidence before analyzing it.": "Preserva la evidencia antes de analizarla.",
  "A suspected infected laptop is removed from the network. That is containment.": "Una laptop sospechosa de infección se retira de la red. Eso es contención.",
  "A malware persistence key is deleted after analysis. That is eradication.": "Una clave de persistencia de malware se elimina después del análisis. Eso es erradicación.",
  "Every evidence transfer is logged with names and times. That supports chain of custody.": "Cada transferencia de evidencia se registra con nombres y horas. Eso apoya la cadena de custodia.",
  "IR Scenario Examples": "Ejemplos de respuesta a incidentes",
  "IR questions often ask which step comes next.": "Las preguntas de respuesta a incidentes suelen preguntar qué paso sigue.",
  "Forensics & Incident Response": "Forense y respuesta a incidentes",
  "Laws, Regulations, Standards": "Leyes, regulaciones y estándares",
  "Laws and regulations create mandatory requirements based on jurisdiction, industry, and data type.": "Las leyes y regulaciones crean requisitos obligatorios según jurisdicción, industria y tipo de datos.",
  "Standards and frameworks help organizations structure security programs and demonstrate due diligence.": "Los estándares y marcos ayudan a las organizaciones a estructurar programas de seguridad y demostrar diligencia debida.",
  "Non-compliance can lead to fines, sanctions, loss of license, contract issues, and reputation damage.": "El incumplimiento puede causar multas, sanciones, pérdida de licencia, problemas contractuales y daño reputacional.",
  "Compliance is about meeting required obligations, not just best effort.": "El cumplimiento trata de cumplir obligaciones requeridas, no solo hacer el mejor esfuerzo.",
  "Frameworks And Configuration Guides": "Marcos y guías de configuración",
  "Frameworks such as NIST, ISO, CIS, and COBIT provide organized security practices.": "Marcos como NIST, ISO, CIS y COBIT proporcionan prácticas de seguridad organizadas.",
  "Configuration guides and benchmarks translate policy into specific technical settings.": "Las guías y benchmarks de configuración traducen política en ajustes técnicos específicos.",
  "Documentation supports consistency, audits, training, and incident response.": "La documentación apoya consistencia, auditorías, capacitación y respuesta a incidentes.",
  "Frameworks organize; benchmarks configure.": "Los marcos organizan; los benchmarks configuran.",
  "Policies And Training": "Políticas y capacitación",
  "Policies set expectations, standards define requirements, procedures give steps, and guidelines give recommendations.": "Las políticas establecen expectativas, los estándares definen requisitos, los procedimientos dan pasos y las guías dan recomendaciones.",
  "Security awareness teaches users how to recognize phishing, protect credentials, report incidents, and handle data.": "La concientización de seguridad enseña a reconocer phishing, proteger credenciales, reportar incidentes y manejar datos.",
  "Change management documents, reviews, approves, tests, and communicates planned changes.": "La gestión de cambios documenta, revisa, aprueba, prueba y comunica cambios planificados.",
  "Policy says what; procedure says how.": "La política dice qué; el procedimiento dice cómo.",
  "A system must follow a specific hardening checklist. Use a configuration benchmark.": "Un sistema debe seguir una lista específica de endurecimiento. Usa un benchmark de configuración.",
  "Employees need steps for reporting suspicious email. Write or follow a procedure.": "Los empleados necesitan pasos para reportar correo sospechoso. Escribe o sigue un procedimiento.",
  "A proposed firewall rule needs approval before production. Use change management.": "Una regla de firewall propuesta necesita aprobación antes de producción. Usa gestión de cambios.",
  "Governance Examples": "Ejemplos de gobernanza",
  "Governance questions are usually about documentation, approval, or accountability.": "Las preguntas de gobernanza suelen tratar de documentación, aprobación o responsabilidad.",
  "Standards & Policies": "Normas y políticas",
  "Privacy Breaches": "Brechas de privacidad",
  "A data breach is unauthorized release, disclosure, or access to protected or non-public information.": "Una brecha de datos es la liberación, divulgación o acceso no autorizado a información protegida o no pública.",
  "Breaches can result from hacking, phishing, stolen devices, employee mistakes, weak policy, or control failure.": "Las brechas pueden resultar de hacking, phishing, dispositivos robados, errores de empleados, políticas débiles o fallas de control.",
  "Privacy programs protect PII through minimization, consent, notice, access controls, retention, and secure disposal.": "Los programas de privacidad protegen PII mediante minimización, consentimiento, aviso, controles de acceso, retención y eliminación segura.",
  "PII needs protection across collection, use, storage, sharing, retention, and disposal.": "La PII necesita protección durante recopilación, uso, almacenamiento, compartición, retención y eliminación.",
  "Risk Analysis": "Análisis de riesgo",
  "Qualitative risk uses categories such as low, medium, and high; quantitative risk uses numbers and formulas.": "El riesgo cualitativo usa categorías como bajo, medio y alto; el cuantitativo usa números y fórmulas.",
  "SLE equals asset value times exposure factor. ALE equals SLE times annual rate of occurrence.": "SLE equivale a valor del activo por factor de exposición. ALE equivale a SLE por tasa anual de ocurrencia.",
  "Risk register entries track threats, vulnerabilities, likelihood, impact, owners, and responses.": "Las entradas del registro de riesgos rastrean amenazas, vulnerabilidades, probabilidad, impacto, responsables y respuestas.",
  "SLE is one loss; ALE is expected yearly loss.": "SLE es una pérdida; ALE es la pérdida anual esperada.",
  "Risk Management And Continuity": "Gestión de riesgo y continuidad",
  "Risk responses include accept, avoid, transfer, mitigate, and sometimes share.": "Las respuestas al riesgo incluyen aceptar, evitar, transferir, mitigar y a veces compartir.",
  "Business continuity planning keeps critical functions operating during disruption.": "La planificación de continuidad del negocio mantiene funciones críticas operando durante interrupciones.",
  "Disaster recovery focuses on restoring IT systems and data after a disruptive event.": "La recuperación ante desastres se enfoca en restaurar sistemas de TI y datos después de un evento disruptivo.",
  "BCP keeps business running; DR restores technology.": "BCP mantiene el negocio funcionando; DR restaura tecnología.",
  "Buying cyber insurance is risk transfer.": "Comprar seguro cibernético es transferencia de riesgo.",
  "Shutting down a risky legacy service is risk avoidance.": "Apagar un servicio heredado riesgoso es evitar el riesgo.",
  "Adding MFA to reduce account takeover is risk mitigation.": "Agregar MFA para reducir toma de cuentas es mitigación de riesgo.",
  "Risk Scenario Examples": "Ejemplos de escenarios de riesgo",
  "Risk questions often ask what the organization does with the risk, not only what caused it.": "Las preguntas de riesgo suelen preguntar qué hace la organización con el riesgo, no solo qué lo causó.",
  "Risk, Privacy & Breaches": "Riesgo, privacidad y brechas",
  "A payroll report is accidentally posted on a public website. Which security principle is most directly violated?": "Un reporte de nómina se publica accidentalmente en un sitio web público. ¿Qué principio de seguridad se viola más directamente?",
  "Confidentiality": "Confidencialidad",
  "Availability": "Disponibilidad",
  "Non-repudiation": "No repudio",
  "Resilience": "Resiliencia",
  "Sensitive information was disclosed to unauthorized viewers, so confidentiality is the main issue.": "La información sensible se divulgó a espectadores no autorizados, por eso la confidencialidad es el problema principal.",
  "An attacker changes a shipping address in an order database without permission. Which principle is affected?": "Un atacante cambia sin permiso una dirección de envío en una base de datos de pedidos. ¿Qué principio se ve afectado?",
  "Integrity": "Integridad",
  "Obfuscation": "Ofuscación",
  "Accounting": "Contabilidad",
  "Unauthorized modification is an integrity failure.": "La modificación no autorizada es una falla de integridad.",
  "Which term best describes a weakness that could be exploited?": "¿Qué término describe mejor una debilidad que podría explotarse?",
  "Vulnerability": "Vulnerabilidad",
  "Control": "Control",
  "Impact": "Impacto",
  "Asset": "Activo",
  "A vulnerability is the weakness; a threat actor may exploit it.": "Una vulnerabilidad es la debilidad; un actor de amenaza puede explotarla.",
  "A caller pretends to be help desk staff and asks for a user's MFA code. What attack type is this?": "Una persona llama fingiendo ser soporte técnico y pide el código MFA de un usuario. ¿Qué tipo de ataque es?",
  "Vishing": "Vishing",
  "Smishing": "Smishing",
  "Tailgating": "Tailgating",
  "Watering hole": "Watering hole",
  "Voice-based social engineering is vishing.": "La ingeniería social por voz es vishing.",
  "Which malware type commonly encrypts files and demands payment?": "¿Qué tipo de malware suele cifrar archivos y exigir pago?",
  "Ransomware": "Ransomware",
  "Rootkit": "Rootkit",
  "Spyware": "Spyware",
  "Logic bomb": "Bomba lógica",
  "Ransomware denies access to data until a ransom is paid.": "El ransomware niega acceso a datos hasta que se paga un rescate.",
  "True or False: A guard at a building entrance is a physical security control.": "Verdadero o falso: Un guardia en la entrada de un edificio es un control de seguridad físico.",
  "Guards, locks, fences, and cameras are physical controls.": "Guardias, cerraduras, cercas y cámaras son controles físicos.",
  "A username entered at a login prompt is an example of which IAM step?": "Un nombre de usuario introducido en un inicio de sesión es un ejemplo de qué paso de IAM?",
  "Identification": "Identificación",
  "Authorization": "Autorización",
  "Federation": "Federación",
  "The user is claiming an identity. Proof comes during authentication.": "El usuario está afirmando una identidad. La prueba viene durante la autenticación.",
  "Which combination is the best example of multifactor authentication?": "¿Qué combinación es el mejor ejemplo de autenticación multifactor?",
  "Password and authenticator app code": "Contraseña y código de app autenticadora",
  "Password and PIN": "Contraseña y PIN",
  "Two different passwords": "Dos contraseñas diferentes",
  "Security questions and a password": "Preguntas de seguridad y contraseña",
  "A password is something you know; an app code is tied to something you have.": "Una contraseña es algo que sabes; un código de app se vincula a algo que tienes.",
  "Which protocol commonly centralizes AAA for network access devices?": "¿Qué protocolo suele centralizar AAA para dispositivos de acceso de red?",
  "RADIUS": "RADIUS",
  "SNMPv1": "SNMPv1",
  "SFTP": "SFTP",
  "SRTP": "SRTP",
  "RADIUS provides centralized authentication, authorization, and accounting.": "RADIUS proporciona autenticación, autorización y contabilidad centralizadas.",
  "A company grants permissions based on job titles such as Help Desk and HR Manager. Which model is this?": "Una empresa concede permisos según cargos como Soporte técnico y Gerente de RR. HH. ¿Qué modelo es?",
  "RBAC": "RBAC",
  "DAC": "DAC",
  "MAC": "MAC",
  "ABAC only": "Solo ABAC",
  "Role-based access control maps permissions to roles.": "El control de acceso basado en roles asigna permisos a roles.",
  "Which action best supports least privilege for former employees?": "¿Qué acción apoya mejor el mínimo privilegio para ex empleados?",
  "Disable or remove stale accounts": "Deshabilitar o eliminar cuentas antiguas",
  "Increase password length only": "Solo aumentar longitud de contraseña",
  "Add users to a shared group": "Agregar usuarios a un grupo compartido",
  "Turn off logging": "Apagar registros",
  "Inactive accounts should be disabled or removed so they cannot be abused.": "Las cuentas inactivas deben deshabilitarse o eliminarse para que no se abusen.",
  "True or False: Biometric false acceptance means the system incorrectly accepts an unauthorized user.": "Verdadero o falso: La falsa aceptación biométrica significa que el sistema acepta incorrectamente a un usuario no autorizado.",
  "False acceptance is the dangerous case where the wrong person is accepted.": "La falsa aceptación es el caso peligroso en que se acepta a la persona equivocada.",
  "Which cryptographic service prevents a sender from credibly denying that they sent a signed message?": "¿Qué servicio criptográfico evita que un remitente niegue de forma creíble que envió un mensaje firmado?",
  "Tokenization": "Tokenizacion",
  "Digital signatures support non-repudiation.": "Las firmas digitales apoyan el no repudio.",
  "Which control best detects whether a downloaded file changed after publication?": "¿Qué control detecta mejor si un archivo descargado cambió después de publicarse?",
  "Hash checksum": "Suma hash",
  "Symmetric encryption": "Cifrado simétrico",
  "Steganography": "Esteganografía",
  "Key escrow": "Custodia de claves",
  "A hash changes when the file changes.": "Un hash cambia cuando cambia el archivo.",
  "Which statement best describes symmetric encryption?": "¿Qué afirmación describe mejor el cifrado simétrico?",
  "The same secret key encrypts and decrypts": "La misma clave secreta cifra y descifra",
  "Only a public key is used": "Solo se usa una clave pública",
  "No key is required": "No se requiere clave",
  "It only creates digests": "Solo crea resúmenes",
  "Symmetric encryption uses one shared secret key.": "El cifrado simétrico usa una clave secreta compartida.",
  "What does a digital certificate bind to an identity?": "¿Qué vincula un certificado digital a una identidad?",
  "A public key": "Una clave pública",
  "A VLAN": "Una VLAN",
  "A firewall rule": "Una regla de firewall",
  "A backup set": "Un conjunto de respaldo",
  "Certificates associate a subject identity with a public key.": "Los certificados asocian una identidad de sujeto con una clave pública.",
  "Which service can provide near real-time certificate revocation status?": "¿Qué servicio puede proporcionar estado de revocación de certificados casi en tiempo real?",
  "OCSP": "OCSP",
  "NAT": "NAT",
  "ARP": "ARP",
  "OCSP checks certificate status without downloading a full CRL.": "OCSP comprueba el estado del certificado sin descargar una CRL completa.",
  "True or False: Hashing by itself provides confidentiality.": "Verdadero o falso: El hashing por sí solo proporciona confidencialidad.",
  "Hashing supports integrity, not secrecy. Encryption protects confidentiality.": "El hashing apoya integridad, no secreto. El cifrado protege confidencialidad.",
  "A website is overwhelmed by traffic from thousands of compromised systems. What attack is this?": "Un sitio web se satura con tráfico de miles de sistemas comprometidos. ¿Qué ataque es?",
  "DDoS": "DDoS",
  "ARP poisoning": "Envenenamiento ARP",
  "DNSSEC": "DNSSEC",
  "Bluejacking": "Bluejacking",
  "Distributed denial-of-service uses many systems to disrupt availability.": "El DDoS usa muchos sistemas para interrumpir la disponibilidad.",
  "An attacker tricks hosts into associating the gateway IP with the attacker's MAC address. What is this?": "Un atacante engaña a hosts para asociar la IP de la puerta de enlace con la MAC del atacante. ¿Qué es?",
  "Domain hijacking": "Secuestro de dominio",
  "ARP poisoning manipulates IP-to-MAC mappings.": "El envenenamiento ARP manipula asignaciones IP a MAC.",
  "Which protocol is the secure replacement for Telnet-style remote shell access?": "¿Qué protocolo es el reemplazo seguro para acceso remoto tipo Telnet?",
  "SSH": "SSH",
  "POP3": "POP3",
  "HTTP": "HTTP",
  "SSH encrypts remote command-line access.": "SSH cifra el acceso remoto por línea de comandos.",
  "Which protocol protects web browsing with TLS?": "¿Qué protocolo protege la navegación web con TLS?",
  "HTTPS": "HTTPS",
  "TFTP": "TFTP",
  "LDAP": "LDAP",
  "HTTPS is HTTP over TLS.": "HTTPS es HTTP sobre TLS.",
  "Captured valid authentication traffic is resent later to gain access. What attack is this?": "Tráfico válido de autenticación capturado se reenvía después para obtener acceso. ¿Qué ataque es?",
  "Replay attack": "Ataque de repetición",
  "DNS poisoning": "Envenenamiento DNS",
  "Jamming": "Interferencia",
  "Integer overflow": "Desbordamiento de entero",
  "Replay attacks reuse captured valid data.": "Los ataques de repetición reutilizan datos válidos capturados.",
  "True or False: SNMPv3 can provide authentication and encryption.": "Verdadero o falso: SNMPv3 puede proporcionar autenticación y cifrado.",
  "SNMPv3 adds security features missing from older versions.": "SNMPv3 agrega funciones de seguridad ausentes en versiones antiguas.",
  "Where should a public web server commonly be placed to protect the internal LAN?": "¿Dónde debe colocarse comúnmente un servidor web público para proteger la LAN interna?",
  "DMZ": "DMZ",
  "Trusted user VLAN": "VLAN de usuarios confiables",
  "Backup network only": "Solo red de respaldo",
  "Management plane": "Plano de administración",
  "A DMZ separates public-facing services from the trusted internal network.": "Una DMZ separa servicios públicos de la red interna confiable.",
  "Which tool detects suspicious traffic and alerts but does not block inline by itself?": "¿Qué herramienta detecta tráfico sospechoso y alerta pero no bloquea en línea por sí misma?",
  "IDS": "IDS",
  "IPS": "IPS",
  "Load balancer": "Balanceador de carga",
  "An IDS detects and alerts. An IPS can block.": "Un IDS detecta y alerta. Un IPS puede bloquear.",
  "A branch office needs encrypted connectivity to headquarters over the internet. What is the best fit?": "Una sucursal necesita conectividad cifrada con la sede a través de internet. ¿Cuál encaja mejor?",
  "Site-to-site VPN": "VPN sitio a sitio",
  "Open guest Wi-Fi": "Wi-Fi de invitados abierto",
  "MAC flooding": "Inundación MAC",
  "Cold site": "Sitio frío",
  "A site-to-site VPN connects networks through an encrypted tunnel.": "Una VPN sitio a sitio conecta redes mediante un túnel cifrado.",
  "Which phrase best matches zero trust?": "¿Qué frase coincide mejor con confianza cero?",
  "Never trust automatically; verify explicitly": "Nunca confiar automáticamente; verificar explícitamente",
  "Trust anything inside the LAN": "Confiar en todo dentro de la LAN",
  "Disable identity checks after login": "Deshabilitar verificaciones de identidad tras login",
  "Use one shared admin account": "Usar una cuenta admin compartida",
  "Zero trust continuously verifies identity, device, and context.": "Confianza cero verifica continuamente identidad, dispositivo y contexto.",
  "Which control can stop unknown laptops from using a switch port?": "¿Qué control puede impedir que laptops desconocidas usen un puerto de switch?",
  "802.1X": "802.1X",
  "Hashing": "Hashing",
  "802.1X can authenticate devices before allowing network access.": "802.1X puede autenticar dispositivos antes de permitir acceso a la red.",
  "True or False: An IPS is normally positioned inline so it can block malicious traffic.": "Verdadero o falso: Un IPS normalmente se coloca en línea para poder bloquear tráfico malicioso.",
  "IPS devices can prevent traffic because they sit inline.": "Los dispositivos IPS pueden prevenir tráfico porque están en línea.",
  "Which technology is commonly used by proximity badge readers?": "¿Qué tecnología se usa comúnmente en lectores de credenciales de proximidad?",
  "RFID": "RFID",
  "SAML": "SAML",
  "BGP": "BGP",
  "RFID enables contactless badge or tag reading at short range.": "RFID permite leer credenciales o etiquetas sin contacto a corta distancia.",
  "A lost company phone must be remotely wiped. Which tool category is the best fit?": "Un teléfono corporativo perdido debe borrarse remotamente. ¿Qué categoría de herramienta encaja mejor?",
  "MDM/UEM": "MDM/UEM",
  "SIEM only": "Solo SIEM",
  "Degaussing wand": "Varita de desmagnetización",
  "MDM or UEM can enforce policy and remotely wipe mobile devices.": "MDM o UEM puede aplicar políticas y borrar dispositivos móviles remotamente.",
  "A fake access point copies the coffee shop SSID to capture user traffic. What is this called?": "Un punto de acceso falso copia el SSID de una cafetería para capturar tráfico de usuarios. ¿Cómo se llama?",
  "Evil twin": "Evil twin",
  "Bluesnarfing": "Bluesnarfing",
  "RFID cloning only": "Solo clonación RFID",
  "Geofencing": "Geofencing",
  "An evil twin AP impersonates a legitimate wireless network.": "Un AP evil twin suplanta una red inalámbrica legítima.",
  "Which pairing is common for enterprise Wi-Fi authentication?": "¿Qué combinación es común para autenticación Wi-Fi empresarial?",
  "802.1X and RADIUS": "802.1X y RADIUS",
  "HTTP and Telnet": "HTTP y Telnet",
  "WEP and shared admin": "WEP y admin compartido",
  "FTP and SNMPv1": "FTP y SNMPv1",
  "802.1X with RADIUS centralizes enterprise wireless authentication.": "802.1X con RADIUS centraliza la autenticación inalámbrica empresarial.",
  "What is usually the safest first network design choice for unmanaged IoT devices?": "¿Cuál suele ser la opción de diseño de red más segura para dispositivos IoT no administrados?",
  "Segment them from trusted systems": "Segmentarlos de sistemas confiables",
  "Place them on the domain controller subnet": "Ponerlos en la subred del controlador de dominio",
  "Disable all logging": "Deshabilitar todos los registros",
  "Give them shared admin credentials": "Darles credenciales admin compartidas",
  "IoT devices should often be isolated because they may be hard to manage or patch.": "Los dispositivos IoT suelen aislarse porque pueden ser difíciles de administrar o parchear.",
  "True or False: WPA3 is generally preferred over WEP for Wi-Fi security.": "Verdadero o falso: WPA3 generalmente se prefiere sobre WEP para seguridad Wi-Fi.",
  "WEP is obsolete and weak; WPA3 is a modern option.": "WEP es obsoleto y débil; WPA3 es una opción moderna.",
  "A forum stores a script in a comment, and the script runs in other users' browsers. What attack is this?": "Un foro guarda un script en un comentario y el script se ejecuta en los navegadores de otros usuarios. ¿Qué ataque es?",
  "Stored XSS": "XSS almacenado",
  "SSRF": "SSRF",
  "Race condition": "Condicion de carrera",
  "Degaussing": "Desmagnetización",
  "Stored XSS persists malicious script that executes for later viewers.": "XSS almacenado conserva script malicioso que se ejecuta para visitantes posteriores.",
  "Which control best reduces SQL injection risk?": "¿Qué control reduce mejor el riesgo de inyección SQL?",
  "Prepared statements": "Sentencias preparadas",
  "Open directory listing": "Listado de directorios abierto",
  "Plaintext cookies": "Cookies en texto claro",
  "More verbose errors": "Errores más detallados",
  "Prepared statements separate code from data.": "Las sentencias preparadas separan código de datos.",
  "An attacker makes a web server request a private metadata URL. Which attack is most likely?": "Un atacante hace que un servidor web solicite una URL privada de metadatos. ¿Qué ataque es más probable?",
  "CSRF": "CSRF",
  "Server-side request forgery abuses the server to make requests.": "SSRF abusa del servidor para realizar solicitudes.",
  "A URL uses ../../ to reach files outside the web directory. What vulnerability is being exploited?": "Una URL usa ../../ para llegar a archivos fuera del directorio web. ¿Qué vulnerabilidad se explota?",
  "Directory traversal": "Directory traversal",
  "Key stretching": "Estiramiento de claves",
  "Directory traversal manipulates file paths.": "El traversal de directorios manipula rutas de archivo.",
  "A flaw appears only when two requests hit a balance update at nearly the same time. What is this?": "Una falla aparece solo cuando dos solicitudes llegan a una actualización de saldo casi al mismo tiempo. ¿Qué es?",
  "Credential stuffing": "Credential stuffing",
  "Cold backup": "Respaldo frío",
  "Race conditions depend on timing between operations.": "Las condiciones de carrera dependen del tiempo entre operaciones.",
  "True or False: Pass-the-hash reuses a captured password hash instead of requiring the plaintext password.": "Verdadero o falso: Pass-the-hash reutiliza un hash de contraseña capturado en vez de requerir la contraseña en texto claro.",
  "Pass-the-hash abuses the hash as an authentication secret.": "Pass-the-hash abusa del hash como secreto de autenticación.",
  "Which environment should most closely mirror production for final release rehearsal?": "¿Qué entorno debe parecerse más a producción para el ensayo final de lanzamiento?",
  "Staging": "Staging",
  "Development": "Desarrollo",
  "Sandbox only": "Solo sandbox",
  "Personal laptop": "Laptop personal",
  "Staging is the pre-production environment used to validate release readiness.": "Staging es el entorno preproducción usado para validar preparación de lanzamiento.",
  "A tool scans source code before the app runs. What testing type is this?": "Una herramienta escanea código fuente antes de que la app se ejecute. ¿Qué tipo de prueba es?",
  "SAST": "SAST",
  "DAST": "DAST",
  "Hot site": "Sitio caliente",
  "SAST analyzes static source or binaries before runtime.": "SAST analiza código o binarios estáticos antes de la ejecución.",
  "A scanner tests a running web application from the outside. What is this?": "Un escáner prueba una aplicación web en ejecución desde afuera. ¿Qué es?",
  "PKI": "PKI",
  "RTO": "RTO",
  "DAST tests the running application behavior.": "DAST prueba el comportamiento de la aplicación en ejecución.",
  "Random malformed inputs are sent to a parser to find crashes. What technique is this?": "Entradas aleatorias mal formadas se envían a un parser para encontrar fallos. ¿Qué técnica es?",
  "Fuzzing": "Fuzzing",
  "Fuzzing uses unexpected input to uncover weaknesses.": "El fuzzing usa entradas inesperadas para descubrir debilidades.",
  "Where should application database passwords usually be stored?": "¿Dónde deben guardarse normalmente las contraseñas de base de datos de una aplicación?",
  "Secrets manager or vault": "Administrador de secretos o bóveda",
  "Hardcoded in source": "Codificadas en el código fuente",
  "Public README": "README público",
  "Browser title": "Título del navegador",
  "Secrets should be protected outside source code.": "Los secretos deben protegerse fuera del código fuente.",
  "True or False: Production is the safest place to test unreviewed code changes.": "Verdadero o falso: Producción es el lugar más seguro para probar cambios de código no revisados.",
  "Unreviewed changes should be tested before production.": "Los cambios no revisados deben probarse antes de producción.",
  "Which tool category provides endpoint telemetry for detection, investigation, and response?": "¿Qué categoría de herramienta proporciona telemetría de endpoint para detección, investigación y respuesta?",
  "EDR": "EDR",
  "CRL": "CRL",
  "RA": "RA",
  "EDR focuses on endpoint detection and response.": "EDR se enfoca en detección y respuesta de endpoints.",
  "Which control helps prevent sensitive files from being copied to unauthorized locations?": "¿Qué control ayuda a evitar que archivos sensibles se copien a ubicaciones no autorizadas?",
  "DLP": "DLP",
  "DHCP": "DHCP",
  "WEP": "WEP",
  "SLA": "SLA",
  "Data loss prevention monitors or blocks sensitive data movement.": "DLP monitorea o bloquea movimiento de datos sensibles.",
  "Which action reduces attack surface on a server?": "¿Qué acción reduce la superficie de ataque en un servidor?",
  "Disable unnecessary services": "Deshabilitar servicios innecesarios",
  "Enable every demo account": "Habilitar todas las cuentas demo",
  "Expose all ports": "Exponer todos los puertos",
  "Skip patches": "Omitir parches",
  "Removing unused services and ports reduces exposure.": "Eliminar servicios y puertos no usados reduce exposición.",
  "A laptop containing customer records is stolen. Which control most directly protects the stored data?": "Una laptop con registros de clientes es robada. ¿Qué control protege más directamente los datos almacenados?",
  "Full-disk encryption": "Cifrado de disco completo",
  "Load balancing": "Balanceo de carga",
  "Geofencing only": "Solo geofencing",
  "Full-disk encryption protects data at rest on the device.": "El cifrado de disco completo protege datos en reposo en el dispositivo.",
  "Which technology helps verify trusted components during startup?": "¿Qué tecnología ayuda a verificar componentes confiables durante el arranque?",
  "Secure boot": "Secure boot",
  "Secure boot helps ensure trusted boot components load.": "Secure boot ayuda a asegurar que se carguen componentes de arranque confiables.",
  "True or False: Patch management should include operating systems, applications, firmware, and drivers.": "Verdadero o falso: La administración de parches debe incluir sistemas operativos, aplicaciones, firmware y controladores.",
  "Known vulnerabilities can exist across all of those layers.": "Pueden existir vulnerabilidades conocidas en todas esas capas.",
  "A managed email service used through a browser is which cloud service model?": "Un servicio de correo administrado usado mediante un navegador es qué modelo de servicio en la nube?",
  "SaaS": "SaaS",
  "IaaS": "IaaS",
  "PaaS": "PaaS",
  "VLAN": "VLAN",
  "SaaS delivers a finished application.": "SaaS entrega una aplicación terminada.",
  "In most cloud models, which responsibility always remains important for the customer?": "En la mayoría de modelos de nube, ¿qué responsabilidad sigue siendo importante para el cliente?",
  "Protecting data and identities": "Proteger datos e identidades",
  "Owning every datacenter": "Poseer cada centro de datos",
  "Replacing the provider's generators": "Reemplazar generadores del proveedor",
  "Managing all physical disks": "Administrar todos los discos físicos",
  "Customers retain responsibility for data, accounts, and configuration choices.": "Los clientes conservan responsabilidad sobre datos, cuentas y decisiones de configuración.",
  "Which option packages an application and its dependencies while sharing the host OS kernel?": "¿Qué opción empaqueta una aplicación y sus dependencias mientras comparte el kernel del sistema anfitrión?",
  "Container": "Contenedor",
  "Full physical server": "Servidor físico completo",
  "Paper record": "Registro en papel",
  "Warm site": "Sitio tibio",
  "Containers package apps and dependencies with shared host resources.": "Los contenedores empaquetan apps y dependencias con recursos compartidos del host.",
  "Code runs when an event occurs and the team does not manage servers. What model fits?": "El código se ejecuta cuando ocurre un evento y el equipo no administra servidores. ¿Qué modelo encaja?",
  "Serverless": "Serverless",
  "Serverless functions are event-driven and abstract server management.": "Las funciones serverless son orientadas a eventos y abstraen la administración de servidores.",
  "Which tool category enforces policy between users and cloud applications?": "¿Qué categoría de herramienta aplica políticas entre usuarios y aplicaciones en la nube?",
  "CASB": "CASB",
  "UPS": "UPS",
  "RAID": "RAID",
  "A cloud access security broker mediates policy for cloud service use.": "Un CASB media políticas para el uso de servicios en la nube.",
  "True or False: Infrastructure as Code can repeat insecure settings if templates are not reviewed.": "Verdadero o falso: Infrastructure as Code puede repetir configuraciones inseguras si las plantillas no se revisan.",
  "IaC makes deployment repeatable, including mistakes.": "IaC hace que el despliegue sea repetible, incluidos los errores.",
  "A door unlocks when an employee holds a badge near a reader. What technology is most likely used?": "Una puerta se desbloquea cuando un empleado acerca una credencial al lector. ¿Qué tecnología se usa más probablemente?",
  "Magnetic stripe only": "Solo banda magnética",
  "Biometric iris scan": "Escaneo biométrico de iris",
  "Infrared camera only": "Solo cámara infrarroja",
  "Proximity readers commonly use RFID.": "Los lectores de proximidad comúnmente usan RFID.",
  "A company arranges a recovery facility with utilities and network links ready, but it is not a fully live duplicate. Which site type is closest?": "Una empresa prepara una instalación de recuperación con servicios y enlaces de red listos, pero no es un duplicado totalmente activo. ¿Qué tipo de sitio se acerca más?",
  "MOU site": "Sitio MOU",
  "A warm site has some resources ready but is not fully operational like a hot site.": "Un sitio tibio tiene algunos recursos preparados, pero no está completamente operativo como un sitio caliente.",
  "Which metric describes how quickly a service must be restored after disruption?": "¿Qué métrica describe qué tan rápido debe restaurarse un servicio tras una interrupción?",
  "RPO": "RPO",
  "MTBF": "MTBF",
  "SLE": "SLE",
  "Recovery time objective is the target time to restore service.": "El objetivo de tiempo de recuperación es el tiempo meta para restaurar el servicio.",
  "Which metric describes the maximum acceptable data loss measured in time?": "¿Qué métrica describe la máxima pérdida de datos aceptable medida en tiempo?",
  "ALE": "ALE",
  "MTTR": "MTTR",
  "Recovery point objective is about how much data can be lost.": "El objetivo de punto de recuperación trata de cuántos datos pueden perderse.",
  "Which device provides short-term power during an outage until generators or shutdown procedures take over?": "¿Qué dispositivo proporciona energía a corto plazo durante un apagón hasta que generadores o procedimientos de apagado tomen el relevo?",
  "A UPS provides temporary battery power.": "Un UPS proporciona energía temporal de batería.",
  "True or False: Degaussing is appropriate for all solid-state drives.": "Verdadero o falso: La desmagnetización es apropiada para todas las unidades de estado sólido.",
  "Degaussing targets magnetic media and is not reliable for SSD storage.": "La desmagnetización apunta a medios magnéticos y no es confiable para SSD.",
  "What is the main purpose of a vulnerability scanner?": "¿Cuál es el propósito principal de un escáner de vulnerabilidades?",
  "Identify and prioritize known weaknesses": "Identificar y priorizar debilidades conocidas",
  "Guarantee no breaches can happen": "Garantizar que no ocurran brechas",
  "Replace all patches automatically": "Reemplazar todos los parches automáticamente",
  "Write security policy": "Escribir política de seguridad",
  "Scanners find and rank likely weaknesses; humans or tools still remediate.": "Los escáneres encuentran y clasifican debilidades probables; humanos o herramientas aún remedian.",
  "Why can an authenticated vulnerability scan provide deeper results?": "¿Por qué un escaneo autenticado de vulnerabilidades puede dar resultados más profundos?",
  "It can inspect local configuration": "Puede inspeccionar configuración local",
  "It never needs permission": "Nunca necesita permiso",
  "It blocks all attacks inline": "Bloquea todos los ataques en línea",
  "It replaces backups": "Reemplaza respaldos",
  "Credentials let the scanner see patch levels and settings more accurately.": "Las credenciales permiten al escáner ver niveles de parches y ajustes con más precisión.",
  "Which system correlates events from many sources to alert on suspicious activity?": "¿Qué sistema correlaciona eventos de muchas fuentes para alertar sobre actividad sospechosa?",
  "SIEM": "SIEM",
  "NFC": "NFC",
  "SIEM collects and correlates logs and events.": "SIEM recopila y correlaciona registros y eventos.",
  "Which tool category automates response playbooks across security tools?": "¿Qué categoría de herramienta automatiza playbooks de respuesta entre herramientas de seguridad?",
  "SOAR": "SOAR",
  "SOAR automates and orchestrates security response.": "SOAR automatiza y orquesta la respuesta de seguridad.",
  "What document defines penetration test scope, timing, and allowed techniques?": "¿Qué documento define alcance, horario y técnicas permitidas en una prueba de penetración?",
  "Rules of engagement": "Reglas de compromiso",
  "Chain of custody": "Cadena de custodia",
  "RPO worksheet": "Hoja de RPO",
  "Certificate signing request": "Solicitud de firma de certificado",
  "Rules of engagement set the boundaries for a penetration test.": "Las reglas de compromiso establecen límites para una prueba de penetración.",
  "True or False: A penetration test attempts to demonstrate real-world exploitability within an approved scope.": "Verdadero o falso: Una prueba de penetración intenta demostrar explotabilidad real dentro de un alcance aprobado.",
  "Pen tests safely validate impact under agreed rules.": "Las pruebas de penetración validan impacto de forma segura bajo reglas acordadas.",
  "An analyst disconnects an infected workstation from the network. Which IR phase is this?": "Un analista desconecta una estación infectada de la red. ¿Qué fase de respuesta a incidentes es?",
  "Containment": "Contención",
  "Preparation": "Preparación",
  "Lessons learned": "Lecciones aprendidas",
  "Risk acceptance": "Aceptación del riesgo",
  "Containment limits spread and damage.": "La contención limita propagación y daño.",
  "After containment, the team removes malware persistence and resets compromised credentials. Which phase is this?": "Después de contener, el equipo elimina persistencia de malware y restablece credenciales comprometidas. ¿Qué fase es?",
  "Eradication": "Erradicación",
  "Identification only": "Solo identificación",
  "Tabletop exercise": "Ejercicio tabletop",
  "Data classification": "Clasificación de datos",
  "Eradication removes the cause of the incident.": "La erradicación elimina la causa del incidente.",
  "Which documentation proves who handled evidence and when?": "¿Qué documentación prueba quién manejó evidencia y cuándo?",
  "Acceptable use policy": "Política de uso aceptable",
  "SAML assertion": "Aserción SAML",
  "Chain of custody tracks evidence handling.": "La cadena de custodia rastrea el manejo de evidencia.",
  "Which evidence is usually more volatile and should often be collected early?": "¿Qué evidencia suele ser más volátil y a menudo debe recopilarse temprano?",
  "Memory contents": "Contenido de memoria",
  "Archived tape backup": "Respaldo en cinta archivado",
  "Printed policy": "Política impresa",
  "Destroyed drive platter": "Plato de disco destruido",
  "Memory and running processes can disappear when a system powers off.": "La memoria y procesos en ejecución pueden desaparecer cuando un sistema se apaga.",
  "What is the main output of incident response preparation?": "¿Cuál es el resultado principal de la preparación de respuesta a incidentes?",
  "Incident response plan": "Plan de respuesta a incidentes",
  "Encryption key only": "Solo clave de cifrado",
  "Public DNS record": "Registro DNS público",
  "Invoice": "Factura",
  "Preparation creates the plan, team roles, tools, and procedures.": "La preparación crea el plan, roles del equipo, herramientas y procedimientos.",
  "True or False: Lessons learned should be skipped once systems are restored.": "Verdadero o falso: Las lecciones aprendidas deben omitirse una vez restaurados los sistemas.",
  "Lessons learned improves future prevention and response.": "Lecciones aprendidas mejora prevención y respuesta futuras.",
  "Which document type usually states management expectations at a high level?": "¿Qué tipo de documento suele establecer expectativas de la dirección a alto nivel?",
  "Policy": "Política",
  "Procedure": "Procedimiento",
  "Packet capture": "Captura de paquetes",
  "Hash digest": "Resumen hash",
  "Policies state what is required or expected.": "Las políticas establecen lo requerido o esperado.",
  "Which document gives step-by-step instructions for completing a task?": "¿Qué documento da instrucciones paso a paso para completar una tarea?",
  "Law": "Ley",
  "Asset value": "Valor de activo",
  "Certificate": "Certificado",
  "Procedures describe how to perform tasks.": "Los procedimientos describen cómo realizar tareas.",
  "A server must be configured according to a detailed CIS checklist. What is being used?": "Un servidor debe configurarse según una lista detallada de CIS. ¿Qué se está usando?",
  "Configuration benchmark": "Benchmark de configuración",
  "Data breach": "Brecha de datos",
  "Benchmarks provide specific secure configuration settings.": "Los benchmarks proporcionan ajustes específicos de configuración segura.",
  "Which process reviews and approves a firewall rule before it is deployed?": "¿Qué proceso revisa y aprueba una regla de firewall antes de desplegarla?",
  "Change management": "Gestión de cambios",
  "Phishing": "Phishing",
  "Change management controls planned production changes.": "La gestión de cambios controla cambios planificados en producción.",
  "Which activity best reduces employee susceptibility to phishing?": "¿Qué actividad reduce mejor la susceptibilidad de empleados al phishing?",
  "Security awareness training": "Capacitación de concientización de seguridad",
  "Turning off all logs": "Apagar todos los registros",
  "Disabling MFA": "Deshabilitar MFA",
  "Using WEP": "Usar WEP",
  "Awareness training teaches users to recognize and report suspicious messages.": "La capacitación de concientización enseña a reconocer y reportar mensajes sospechosos.",
  "True or False: Due care is about implementing and maintaining reasonable controls.": "Verdadero o falso: El debido cuidado trata de implementar y mantener controles razonables.",
  "Due care is the action of maintaining appropriate safeguards.": "El debido cuidado es la acción de mantener salvaguardas apropiadas.",
  "Which event is a privacy breach?": "¿Qué evento es una brecha de privacidad?",
  "Unauthorized access to customer PII": "Acceso no autorizado a PII de clientes",
  "A scheduled patch window": "Una ventana programada de parches",
  "A successful backup test": "Una prueba exitosa de respaldo",
  "A public product brochure": "Un folleto público de producto",
  "Unauthorized access to protected personal information is a breach.": "El acceso no autorizado a información personal protegida es una brecha.",
  "An asset is worth $20,000 and the exposure factor is 25%. What is the SLE?": "Un activo vale $20,000 y el factor de exposición es 25%. ¿Cuál es el SLE?",
  "$5,000": "$5,000",
  "$20,025": "$20,025",
  "$80,000": "$80,000",
  "$500": "$500",
  "SLE equals asset value times exposure factor: 20,000 x 0.25 = 5,000.": "SLE equivale a valor del activo por factor de exposición: 20,000 x 0.25 = 5,000.",
  "SLE is $5,000 and the annual rate of occurrence is 4. What is the ALE?": "SLE es $5,000 y la tasa anual de ocurrencia es 4. ¿Cuál es el ALE?",
  "$20,000": "$20,000",
  "$1,250": "$1,250",
  "$5,004": "$5,004",
  "$4,995": "$4,995",
  "ALE equals SLE times ARO: 5,000 x 4 = 20,000.": "ALE equivale a SLE por ARO: 5,000 x 4 = 20,000.",
  "Buying cyber insurance is primarily which risk response?": "Comprar seguro cibernético es principalmente qué respuesta al riesgo?",
  "Transfer": "Transferir",
  "Avoid": "Evitar",
  "Accept": "Aceptar",
  "Ignore": "Ignorar",
  "Insurance transfers some financial impact to another party.": "El seguro transfiere parte del impacto financiero a otra parte.",
  "Which plan focuses on keeping critical business functions operating during a disruption?": "¿Qué plan se enfoca en mantener funciones críticas del negocio operando durante una interrupción?",
  "Business continuity plan": "Plan de continuidad del negocio",
  "Certificate policy": "Política de certificados",
  "Password blacklist": "Lista negra de contraseñas",
  "Vulnerability disclosure only": "Solo divulgación de vulnerabilidades",
  "BCP focuses on business operations during disruption.": "BCP se enfoca en operaciones del negocio durante una interrupción.",
  "True or False: Disaster recovery focuses on restoring IT systems and data after a disruptive event.": "Verdadero o falso: La recuperación ante desastres se enfoca en restaurar sistemas de TI y datos después de un evento disruptivo.",
  "DR is the technology recovery side of resilience.": "DR es el lado de recuperación tecnológica de la resiliencia.",
  "Before storing password digests, an engineer adds a unique random value to each password. Which protection is being used?": "Antes de almacenar resúmenes de contraseñas, un ingeniero agrega un valor aleatorio único a cada contraseña. ¿Qué protección se está usando?",
  "Salting": "Salting",
  "Code signing": "Firma de codigo",
  "A salt is a unique value added before hashing so identical passwords do not produce identical hashes.": "Una sal es un valor único agregado antes del hashing para que contraseñas iguales no produzcan hashes iguales.",
  "A password storage system intentionally runs many hash rounds to slow offline cracking attempts. What technique is this?": "Un sistema de almacenamiento de contraseñas ejecuta intencionalmente muchas rondas de hash para retrasar intentos de cracking sin conexión. ¿Qué técnica es?",
  "Quarantine": "Cuarentena",
  "Key stretching makes each password guess more expensive for an attacker.": "El estiramiento de clave hace que cada intento de contraseña sea más costoso para un atacante.",
  "A tester sends malformed strings, long values, and unexpected characters to a running service. Which analysis category best fits?": "Un tester envía cadenas mal formadas, valores largos y caracteres inesperados a un servicio en ejecución. ¿Qué categoría de análisis encaja mejor?",
  "Dynamic analysis": "Análisis dinámico",
  "Static analysis": "Análisis estático",
  "Manual code review": "Revisión manual de código",
  "Data retention": "Retención de datos",
  "Fuzzing exercises a running target, so it is a form of dynamic analysis.": "El fuzzing ejercita un objetivo en ejecución, por eso es una forma de análisis dinámico.",
  "A shopping site wants one control that helps reduce both script injection and database injection risk. What should it emphasize first?": "Un sitio de compras quiere un control que ayude a reducir riesgos de inyección de scripts y de base de datos. ¿Qué debe enfatizar primero?",
  "Input validation": "Validación de entrada",
  "More detailed error messages": "Mensajes de error más detallados",
  "Code signing only": "Solo firma de código",
  "A bigger load balancer": "Un balanceador de carga más grande",
  "Validation and safe handling of input are core defenses against injection-style attacks.": "La validación y el manejo seguro de entradas son defensas centrales contra ataques de inyección.",
  "A workstation policy allows only digitally signed installers. What is the main benefit?": "Una política de estaciones permite solo instaladores firmados digitalmente. ¿Cuál es el beneficio principal?",
  "It helps verify the software publisher and integrity": "Ayuda a verificar el editor del software y la integridad",
  "It guarantees the program is malware-free": "Garantiza que el programa no tenga malware",
  "It makes applications run faster": "Hace que las aplicaciones corran más rápido",
  "It replaces patch management": "Reemplaza la administración de parches",
  "Code signing helps identify the signer and detect tampering, but it is not an absolute malware guarantee.": "La firma de código ayuda a identificar al firmante y detectar alteración, pero no garantiza absolutamente que no haya malware.",
  "A Linux hardening checklist removes unused daemons and closes their listening ports. What is the main security purpose?": "Una lista de endurecimiento de Linux elimina demonios no usados y cierra sus puertos de escucha. ¿Cuál es el propósito de seguridad principal?",
  "Reduce attack surface": "Reducir superficie de ataque",
  "Speed up port scans": "Acelerar escaneos de puertos",
  "Increase log volume": "Aumentar volumen de registros",
  "Consume default ports": "Consumir puertos predeterminados",
  "Fewer exposed services means fewer entry points for attackers.": "Menos servicios expuestos significa menos puntos de entrada para atacantes.",
  "A control permits only approved application hashes to execute on laptops. What type of control is this?": "Un control permite ejecutar en laptops solo hashes de aplicaciones aprobadas. ¿Qué tipo de control es?",
  "Application allowlisting": "Lista de permitidos de aplicaciones",
  "Antivirus quarantine": "Cuarentena antivirus",
  "Blacklisting": "Lista de bloqueados",
  "Allowlisting defines what is allowed to run instead of only blocking known-bad software.": "La lista de permitidos define qué puede ejecutarse en lugar de solo bloquear software conocido como malo.",
  "Why do security teams worry about legacy hardware that is still important to the business?": "¿Por qué los equipos de seguridad se preocupan por hardware heredado que sigue siendo importante para el negocio?",
  "Vendor support and security updates may no longer be available": "El soporte del proveedor y las actualizaciones de seguridad pueden ya no estar disponibles",
  "It always has stronger encryption": "Siempre tiene cifrado más fuerte",
  "It cannot connect to networks": "No puede conectarse a redes",
  "It automatically supports modern protocols": "Admite protocolos modernos automáticamente",
  "Legacy hardware often becomes risky because patches, parts, and vendor support disappear.": "El hardware heredado suele volverse riesgoso porque desaparecen parches, piezas y soporte del proveedor.",
  "A factory places compute nodes near production equipment so sensor data can be processed with very low latency. What design is this?": "Una fábrica coloca nodos de cómputo cerca del equipo de producción para procesar datos de sensores con latencia muy baja. ¿Qué diseño es?",
  "Edge computing": "Computación en el borde",
  "Hybrid cloud only": "Solo nube híbrida",
  "Mist computing": "Mist computing",
  "Centralized SaaS": "SaaS centralizado",
  "Edge computing moves compute close to where data is created or used.": "La computación en el borde mueve el cómputo cerca de donde los datos se crean o usan.",
  "A BYOD program needs corporate apps and files kept separate from personal apps on the same phone. Which feature best supports that?": "Un programa BYOD necesita mantener apps y archivos corporativos separados de apps personales en el mismo teléfono. ¿Qué función lo apoya mejor?",
  "Mobile containerization": "Contenerización móvil",
  "Full public Wi-Fi access": "Acceso Wi-Fi público completo",
  "A Faraday cage": "Una jaula de Faraday",
  "A warm site": "Un sitio tibio",
  "Mobile containers separate managed business data from personal device space.": "Los contenedores móviles separan datos empresariales administrados del espacio personal del dispositivo.",
  "Users receive lightweight workstations that load applications and data from a central server instead of local drives. What model is this?": "Los usuarios reciben estaciones ligeras que cargan aplicaciones y datos desde un servidor central en vez de discos locales. ¿Qué modelo es?",
  "Thin clients": "Clientes ligeros",
  "Thick clients": "Clientes pesados",
  "Client-as-a-server": "Cliente como servidor",
  "Standalone desktops": "Escritorios independientes",
  "Thin clients rely on central resources rather than doing most work locally.": "Los clientes ligeros dependen de recursos centrales en lugar de hacer la mayor parte del trabajo localmente.",
  "An application container includes the app, libraries, and configuration files. What is normally not packaged as a full separate component inside it?": "Un contenedor de aplicación incluye la app, bibliotecas y archivos de configuración. ¿Qué normalmente no se empaqueta como componente completo separado dentro de él?",
  "The full operating system kernel": "El kernel completo del sistema operativo",
  "The application": "La aplicación",
  "Needed libraries": "Bibliotecas necesarias",
  "Configuration files": "Archivos de configuración",
  "Containers share the host OS kernel; they do not bundle a full guest operating system like a VM.": "Los contenedores comparten el kernel del sistema anfitrión; no incluyen un sistema operativo invitado completo como una VM.",
  "Which service model lets customers use a provider's finished application through the internet?": "¿Qué modelo de servicio permite a los clientes usar una aplicación terminada del proveedor por internet?",
  "Hybrid": "Híbrido",
  "SaaS is complete software delivered as a service.": "SaaS es software completo entregado como servicio.",
  "Which cloud model gives developers a managed place to build and deploy applications without managing the underlying OS?": "¿Qué modelo de nube da a desarrolladores un lugar administrado para crear y desplegar aplicaciones sin administrar el sistema operativo subyacente?",
  "IDaaS": "IDaaS",
  "PaaS provides a managed application platform.": "PaaS proporciona una plataforma de aplicaciones administrada.",
  "A Windows-based development team needs temporary Linux servers now and similar Linux servers later in production. Which cloud model best fits?": "Un equipo de desarrollo basado en Windows necesita servidores Linux temporales ahora y servidores Linux similares después en producción. ¿Qué modelo de nube encaja mejor?",
  "IaaS lets the team provision virtual machines and control the operating system.": "IaaS permite al equipo aprovisionar máquinas virtuales y controlar el sistema operativo.",
  "All internet traffic for a company depends on one circuit and one router. What risk does this create?": "Todo el tráfico de internet de una empresa depende de un circuito y un router. ¿Qué riesgo crea esto?",
  "Single point of failure": "Punto unico de falla",
  "Virtualization": "Virtualización",
  "If that single dependency fails, the whole connection is affected.": "Si esa única dependencia falla, toda la conexión se afecta.",
  "Which physical control is designed to stop tailgating by allowing one person through a controlled space at a time?": "¿Qué control físico está diseñado para detener tailgating permitiendo pasar a una persona por vez en un espacio controlado?",
  "Access control vestibule": "Vestíbulo de control de acceso",
  "Bollards": "Bolardos",
  "Video surveillance only": "Solo videovigilancia",
  "RFID asset tag": "Etiqueta RFID de activo",
  "An access control vestibule, also called a mantrap, helps prevent tailgating.": "Un vestíbulo de control de acceso, también llamado esclusa, ayuda a prevenir tailgating.",
  "A full backup runs Sunday and differential backups run the other days. On Thursday, how many backup sets are normally needed to restore?": "Un respaldo completo corre el domingo y respaldos diferenciales corren los otros días. El jueves, ¿cuántos conjuntos de respaldo normalmente se necesitan para restaurar?",
  "Two": "Dos",
  "One": "Uno",
  "Three": "Tres",
  "Four": "Cuatro",
  "Differential restore uses the last full backup plus the most recent differential backup.": "La restauración diferencial usa el último respaldo completo más el diferencial más reciente.",
  "A server room must reduce electromagnetic interference against a sensitive key management server. What protection best fits?": "Una sala de servidores debe reducir interferencia electromagnética contra un servidor sensible de administración de claves. ¿Qué protección encaja mejor?",
  "Faraday cage": "Jaula de Faraday",
  "TPM": "TPM",
  "SDN": "SDN",
  "A Faraday cage shields equipment from electromagnetic signals.": "Una jaula de Faraday protege equipos contra señales electromagnéticas.",
  "A traveler wants to charge a phone from an untrusted USB charger while blocking data pins. What device should she use?": "Una viajera quiere cargar un teléfono desde un cargador USB no confiable mientras bloquea los pines de datos. ¿Qué dispositivo debe usar?",
  "USB data blocker": "Bloqueador de datos USB",
  "Parallel USB cable": "Cable USB paralelo",
  "HOTP interrogator": "Interrogador HOTP",
  "Data circuit breaker": "Interruptor de circuito de datos",
  "A USB data blocker allows power while preventing data transfer.": "Un bloqueador de datos USB permite energía mientras evita transferencia de datos.",
  "A researcher uses Tor to view breach markets and leaked data posted by criminals. What source is being used?": "Un investigador usa Tor para ver mercados de brechas y datos filtrados publicados por criminales. ¿Qué fuente está usando?",
  "The dark web": "La dark web",
  "A formal information-sharing organization": "Una organización formal de intercambio de información",
  "A proprietary vendor report": "Un informe propietario de proveedor",
  "A firewall log": "Un registro de firewall",
  "Hidden services accessed through Tor are commonly associated with dark web research.": "Los servicios ocultos accedidos mediante Tor se asocian comúnmente con investigación en la dark web.",
  "A penetration tester is given full diagrams, accounts, system lists, and configuration details before testing. What test type is this?": "A una pentester se le dan diagramas completos, cuentas, listas de sistemas y detalles de configuración antes de probar. ¿Qué tipo de prueba es?",
  "Known environment test": "Prueba de entorno conocido",
  "Unknown environment test": "Prueba de entorno desconocido",
  "Partially known environment test": "Prueba de entorno parcialmente conocido",
  "Third-party test only": "Solo prueba de tercero",
  "A known environment test gives the tester detailed internal knowledge.": "Una prueba de entorno conocido da al tester conocimiento interno detallado.",
  "During reconnaissance, a tester gathers domains, IP ranges, phone numbers, and public employee details. What is this called?": "Durante reconocimiento, una tester reúne dominios, rangos IP, teléfonos y datos públicos de empleados. ¿Cómo se llama esto?",
  "Footprinting": "Footprinting",
  "Fingerprinting": "Fingerprinting",
  "Aggregation only": "Solo agregación",
  "Footprinting is broad information gathering about a target before deeper testing.": "Footprinting es la recopilación amplia de información sobre un objetivo antes de pruebas más profundas.",
  "A security team builds a nonproduction network of decoy systems to observe attacker behavior. What is it?": "Un equipo de seguridad crea una red no productiva de sistemas señuelo para observar el comportamiento de atacantes. ¿Qué es?",
  "Honeynet": "Honeynet",
  "False subnet": "Subred falsa",
  "Active detection only": "Solo detección activa",
  "A honeynet is a network of honeypots used to attract and study attackers.": "Una honeynet es una red de honeypots usada para atraer y estudiar atacantes.",
  "A team spends hours repeating the same endpoint hardening steps before deployment. What would best reduce the manual work?": "Un equipo pasa horas repitiendo los mismos pasos de endurecimiento de endpoints antes del despliegue. ¿Qué reduciría mejor el trabajo manual?",
  "Automation and scripting": "Automatización y scripts",
  "Deploying fewer controls": "Desplegar menos controles",
  "Ignoring baselines": "Ignorar líneas base",
  "Moving all devices to guest Wi-Fi": "Mover todos los dispositivos a Wi-Fi de invitados",
  "Automation and scripts make repetitive configuration tasks consistent and faster.": "La automatización y los scripts hacen que tareas repetitivas de configuración sean consistentes y más rápidas.",
  "A tester maps where a wireless network can be reached from a car and from a small aircraft. Which methods are these?": "Un tester mapea desde dónde se puede alcanzar una red inalámbrica usando un auto y una aeronave pequeña. ¿Qué métodos son?",
  "War driving and war flying": "War driving y war flying",
  "OSINT and phishing": "OSINT y phishing",
  "Static analysis and fuzzing": "Análisis estático y fuzzing",
  "Tailgating and vishing": "Tailgating y vishing",
  "War driving and war flying map wireless coverage from ground and air.": "War driving y war flying mapean cobertura inalámbrica desde tierra y aire.",
  "Unusual outbound traffic, impossible travel patterns, and sudden database-read spikes are examples of what threat-intel element?": "Tráfico saliente inusual, patrones de viaje imposible y picos repentinos de lectura de base de datos son ejemplos de qué elemento de inteligencia de amenazas?",
  "Indicators of compromise": "Indicadores de compromiso",
  "Threat maps": "Mapas de amenazas",
  "Predictive analysis": "Análisis predictivo",
  "Acceptable use": "Uso aceptable",
  "Those signs can indicate a system or account may already be compromised.": "Esas señales pueden indicar que un sistema o cuenta ya puede estar comprometido.",
  "An anti-malware tool moves infected files into a safe holding area without deleting them immediately. What setting is this?": "Una herramienta antimalware mueve archivos infectados a un área segura sin eliminarlos de inmediato. ¿Qué configuración es?",
  "Purge": "Purga",
  "Deep-freeze": "Deep-freeze",
  "Retention": "Retención",
  "Quarantine isolates suspicious files so they cannot run while preserving them for review.": "La cuarentena aísla archivos sospechosos para que no se ejecuten mientras los conserva para revisión.",
  "An incident handler places one compromised host in a VLAN with no internet access and no other systems. What mitigation is being applied?": "Un analista de incidentes coloca un host comprometido en una VLAN sin internet ni otros sistemas. ¿Qué mitigación aplica?",
  "Isolation": "Aislamiento",
  "Isolation separates the compromised system to stop communication and spread.": "El aislamiento separa el sistema comprometido para detener comunicación y propagación.",
  "Which Linux command-line tool is commonly used to make a bit-for-bit forensic image of a drive?": "¿Qué herramienta de línea de comandos de Linux se usa comúnmente para hacer una imagen forense bit a bit de una unidad?",
  "dd": "dd",
  "df": "df",
  "cp": "cp",
  "ln": "ln",
  "The dd command can copy raw blocks to create an exact image.": "El comando dd puede copiar bloques sin procesar para crear una imagen exacta.",
  "An investigator wants to prove that evidence files have not changed since collection. What should be compared?": "Un investigador quiere probar que archivos de evidencia no han cambiado desde la recolección. ¿Qué debe comparar?",
  "File hashes": "Hashes de archivos",
  "Only file sizes": "Solo tamaños de archivo",
  "Only filenames": "Solo nombres de archivo",
  "Screen brightness": "Brillo de pantalla",
  "Matching cryptographic hashes provide strong evidence that file contents are unchanged.": "Hashes criptográficos coincidentes proporcionan evidencia sólida de que el contenido no cambió.",
  "A company wants to fully prove that its hot site can take over production during an outage. What test is the most complete?": "Una empresa quiere probar completamente que su sitio caliente puede asumir producción durante una interrupción. ¿Qué prueba es la más completa?",
  "Failover test": "Prueba de failover",
  "Paper review": "Revisión en papel",
  "Parallel processing only": "Solo procesamiento paralelo",
  "A failover test actually shifts operations to validate recovery capability.": "Una prueba de failover traslada operaciones para validar la capacidad de recuperación.",
  "A security analyst needs a unique digital fingerprint for a file to compare later. Which should she choose?": "Una analista de seguridad necesita una huella digital única de un archivo para comparar después. ¿Qué debe elegir?",
  "A cryptographic hash": "Un hash criptográfico",
  "A reversible checksum": "Una suma de comprobación reversible",
  "A file extension": "Una extensión de archivo",
  "A VLAN tag": "Una etiqueta VLAN",
  "A cryptographic hash is designed to fingerprint file contents and resist collisions.": "Un hash criptográfico está diseñado para tomar huella del contenido del archivo y resistir colisiones.",
  "Where should an analyst look to review mail routing metadata and identify servers that handled a message?": "¿Dónde debe mirar un analista para revisar metadatos de enrutamiento de correo e identificar servidores que manejaron un mensaje?",
  "Email headers": "Encabezados del correo",
  "Email footer only": "Solo pie del correo",
  "The To field only": "Solo campo Para",
  "The From display name only": "Solo nombre visible De",
  "Email headers contain routing and server metadata such as Received lines.": "Los encabezados de correo contienen metadatos de enrutamiento y servidores, como líneas Received.",
  "A company wants to assess a cloud provider's controls before signing a contract. What is the most realistic evidence to request?": "Una empresa quiere evaluar controles de un proveedor de nube antes de firmar contrato. ¿Cuál es la evidencia más realista que debe solicitar?",
  "An existing SOC audit report": "Un informe SOC existente",
  "Permission to scan production without limits": "Permiso para escanear producción sin límites",
  "The provider's private keys": "Las claves privadas del proveedor",
  "A public marketing page only": "Solo una página pública de marketing",
  "Providers commonly share SOC reports or similar attestations instead of allowing customer scans.": "Los proveedores suelen compartir informes SOC o atestaciones similares en lugar de permitir escaneos de clientes.",
  "Which policy explains how employees may and may not use company networks, systems, and services?": "¿Qué política explica cómo los empleados pueden y no pueden usar redes, sistemas y servicios de la empresa?",
  "Business continuity policy": "Política de continuidad del negocio",
  "Incident response policy": "Política de respuesta a incidentes",
  "An acceptable use policy defines permitted and prohibited use of organizational resources.": "Una política de uso aceptable define uso permitido y prohibido de recursos organizacionales.",
  "A business operates facilities in three states. Which state laws should the security program consider?": "Una empresa opera instalaciones en tres estados. ¿Qué leyes estatales debe considerar el programa de seguridad?",
  "The laws in every state where it operates": "Las leyes de cada estado donde opera",
  "Only the headquarters state": "Solo el estado de la sede",
  "Only federal law": "Solo ley federal",
  "Only the state with the largest office": "Solo el estado con la oficina más grande",
  "Security and privacy obligations can apply wherever the organization operates or handles residents' data.": "Las obligaciones de seguridad y privacidad pueden aplicar donde la organización opera o maneja datos de residentes.",
  "A requirement says every device over a set value must receive an RFID asset tag at intake. Which policy most likely contains it?": "Un requisito dice que todo dispositivo sobre cierto valor debe recibir una etiqueta RFID de activo al ingresar. ¿Qué política probablemente lo contiene?",
  "Asset management policy": "Política de administración de activos",
  "Change management policy": "Política de gestión de cambios",
  "Asset management policies define how assets are tracked, tagged, inventoried, and retired.": "Las políticas de administración de activos definen cómo se rastrean, etiquetan, inventarían y retiran los activos.",
  "Which policy should clearly identify who owns organizational information and how that data is governed?": "¿Qué política debe identificar claramente quién es dueño de la información organizacional y cómo se gobierna?",
  "Data governance policy": "Política de gobernanza de datos",
  "Password policy": "Política de contraseñas",
  "Data governance defines ownership, stewardship, classification, and handling expectations.": "La gobernanza de datos define propiedad, administración, clasificación y expectativas de manejo.",
  "Before improving security awareness, a manager wants to know the current starting point. What should be done first?": "Antes de mejorar la concientización de seguridad, un gerente quiere conocer el punto de partida actual. ¿Qué debe hacerse primero?",
  "Conduct a baseline analysis": "Realizar un análisis de línea base",
  "Run an unrelated penetration test": "Ejecutar una prueba de penetración no relacionada",
  "Skip measurement and train immediately": "Omitir medición y capacitar de inmediato",
  "Disable all user accounts": "Deshabilitar todas las cuentas",
  "A baseline analysis measures the initial state so improvement can be tracked.": "Un análisis de línea base mide el estado inicial para poder rastrear mejoras.",
  "Which process helps avoid making several uncoordinated system changes at the same time?": "¿Qué proceso ayuda a evitar hacer varios cambios de sistema no coordinados al mismo tiempo?",
  "Due care": "Debido cuidado",
  "Change management coordinates, reviews, schedules, and documents changes.": "La gestión de cambios coordina, revisa, programa y documenta cambios.",
  "A continuity plan sets an RTO of 4 hours and an RPO of 24 hours. What does that mean?": "Un plan de continuidad establece un RTO de 4 horas y un RPO de 24 horas. ¿Qué significa?",
  "Restore service within 4 hours and lose at most 24 hours of data": "Restaurar servicio dentro de 4 horas y perder como máximo 24 horas de datos",
  "Restore service within 24 hours and lose at most 4 hours of data": "Restaurar servicio dentro de 24 horas y perder como máximo 4 horas de datos",
  "Run for 4 hours after restoration and archive 24 hours of logs": "Ejecutar por 4 horas tras restauración y archivar 24 horas de logs",
  "Keep systems offline for 24 hours before recovery": "Mantener sistemas fuera de línea 24 horas antes de recuperar",
  "RTO is recovery time; RPO is acceptable data-loss window.": "RTO es tiempo de recuperación; RPO es la ventana aceptable de pérdida de datos.",
  "A database is valued at $1,000,000. A successful breach is expected to cause $500,000 in losses. What is the exposure factor?": "Una base de datos está valorada en $1,000,000. Se espera que una brecha exitosa cause $500,000 en pérdidas. ¿Cuál es el factor de exposición?",
  "50 percent": "50 por ciento",
  "5 percent": "5 por ciento",
  "20 percent": "20 por ciento",
  "100 percent": "100 por ciento",
  "Exposure factor is the percentage of asset value lost: 500,000 / 1,000,000 = 50 percent.": "El factor de exposición es el porcentaje del valor del activo perdido: 500,000 / 1,000,000 = 50 por ciento.",
  "An organization deploys a web application firewall to reduce the likelihood of SQL injection impact. What risk response is this?": "Una organización despliega un firewall de aplicaciones web para reducir la probabilidad de impacto de inyección SQL. ¿Qué respuesta al riesgo es?",
  "Mitigate": "Mitigar",
  "Adding a control to reduce likelihood or impact is risk mitigation.": "Agregar un control para reducir probabilidad o impacto es mitigación de riesgo.",
  "A business impact assessment says the main database can be unavailable for no more than two hours. Which metric was identified?": "Una evaluación de impacto al negocio dice que la base de datos principal puede estar no disponible por máximo dos horas. ¿Qué métrica se identificó?",
  "RTO is the maximum tolerable time to restore service.": "RTO es el tiempo máximo tolerable para restaurar el servicio.",
  "After reviewing options, leadership decides not to buy insurance and not to add controls for a known risk. What strategy is this?": "Después de revisar opciones, la dirección decide no comprar seguro ni agregar controles para un riesgo conocido. ¿Qué estrategia es?",
  "Risk transference": "Transferencia del riesgo",
  "Risk avoidance": "Evitación del riesgo",
  "Risk mitigation": "Mitigación del riesgo",
  "Taking no additional action while knowingly living with the risk is acceptance.": "No tomar acción adicional mientras se vive conscientemente con el riesgo es aceptación.",
  "A company hires an outside assessor to evaluate compliance with PCI DSS. What audit type is this?": "Una empresa contrata a un evaluador externo para revisar cumplimiento con PCI DSS. ¿Qué tipo de auditoría es?",
  "External compliance audit": "Auditoría externa de cumplimiento",
  "Internal regulatory audit": "Auditoría regulatoria interna",
  "Internal compliance audit": "Auditoría interna de cumplimiento",
  "Penetration test only": "Solo prueba de penetración",
  "A third party checking adherence to a standard is an external compliance audit.": "Un tercero que revisa adherencia a un estándar es una auditoría externa de cumplimiento.",
  "A storage team wants to estimate the expected useful life between failures for newly purchased SSDs. Which metric helps?": "Un equipo de almacenamiento quiere estimar la vida útil esperada entre fallas para SSDs nuevos. ¿Qué métrica ayuda?",
  "Mean time between failures estimates reliability over time.": "El tiempo medio entre fallas estima confiabilidad a lo largo del tiempo.",
  "Confidentiality, integrity, and availability: the three core security goals.": "Confidencialidad, integridad y disponibilidad: los tres objetivos centrales de seguridad.",
  "Threat Actor": "Actor de amenaza",
  "A person, group, or entity that can cause harm to systems or data.": "Persona, grupo o entidad que puede causar daño a sistemas o datos.",
  "A weakness that can be exploited by a threat.": "Debilidad que puede ser explotada por una amenaza.",
  "Deceptive messaging that tricks users into unsafe actions or disclosure.": "Mensajería engañosa que hace que usuarios realicen acciones inseguras o divulguen información.",
  "Malware that denies access to files or systems and demands payment.": "Malware que niega acceso a archivos o sistemas y exige pago.",
  "Claiming an identity, such as entering a username.": "Afirmar una identidad, como introducir un nombre de usuario.",
  "Authentication": "Autenticación",
  "Proving a claimed identity with one or more factors.": "Probar una identidad afirmada con uno o más factores.",
  "Determining what an authenticated subject may access or do.": "Determinar qué puede acceder o hacer un sujeto autenticado.",
  "MFA": "MFA",
  "Authentication using factors from more than one category.": "Autenticación que usa factores de más de una categoría.",
  "Access control based on job roles.": "Control de acceso basado en roles laborales.",
  "Encryption": "Cifrado",
  "Transforms data so only authorized parties with the key can read it.": "Transforma datos para que solo partes autorizadas con la clave puedan leerlos.",
  "Hash": "Hash",
  "A fixed-length digest used to detect changes.": "Resumen de longitud fija usado para detectar cambios.",
  "Digital Signature": "Firma digital",
  "Cryptographic proof of origin, integrity, and non-repudiation.": "Prueba criptográfica de origen, integridad y no repudio.",
  "System of certificates, authorities, trust chains, and revocation.": "Sistema de certificados, autoridades, cadenas de confianza y revocación.",
  "Protocol for checking certificate revocation status.": "Protocolo para comprobar el estado de revocación de certificados.",
  "Distributed attack that disrupts availability by overwhelming a target.": "Ataque distribuido que interrumpe disponibilidad saturando un objetivo.",
  "ARP Poisoning": "Envenenamiento ARP",
  "Manipulates IP-to-MAC mappings to redirect traffic.": "Manipula asignaciones IP a MAC para redirigir tráfico.",
  "On-Path Attack": "Ataque en ruta",
  "Interception of traffic between communicating parties.": "Intercepción de tráfico entre partes que se comunican.",
  "Encrypted remote administration protocol.": "Protocolo cifrado de administración remota.",
  "HTTP protected by TLS.": "HTTP protegido por TLS.",
  "Network zone between trusted and untrusted networks for public services.": "Zona de red entre redes confiables y no confiables para servicios públicos.",
  "Detects suspicious activity and alerts.": "Detecta actividad sospechosa y alerta.",
  "Detects and can block malicious traffic inline.": "Detecta y puede bloquear tráfico malicioso en línea.",
  "VPN": "VPN",
  "Encrypted tunnel for remote or site-to-site connectivity.": "Túnel cifrado para conectividad remota o sitio a sitio.",
  "Verify explicitly, use least privilege, and assume breach.": "Verificar explícitamente, usar mínimo privilegio y asumir compromiso.",
  "Radio-frequency identification used for tags and proximity badges.": "Identificación por radiofrecuencia usada para etiquetas y credenciales de proximidad.",
  "MDM": "MDM",
  "Mobile device management for policy, app control, and remote wipe.": "Administración de dispositivos móviles para políticas, control de apps y borrado remoto.",
  "Evil Twin": "Evil twin",
  "Fake access point that imitates a legitimate wireless network.": "Punto de acceso falso que imita una red inalámbrica legítima.",
  "Port or wireless access control using authentication before network access.": "Control de acceso por puerto o inalámbrico usando autenticación antes del acceso a red.",
  "IoT Segmentation": "Segmentación IoT",
  "Isolating smart devices from trusted systems to reduce risk.": "Aislar dispositivos inteligentes de sistemas confiables para reducir riesgo.",
  "XSS": "XSS",
  "Injection of client-side script into pages viewed by users.": "Inyección de script del lado del cliente en páginas vistas por usuarios.",
  "SQL Injection": "Inyección SQL",
  "Untrusted input changes a database query.": "Entrada no confiable cambia una consulta de base de datos.",
  "Tricks a server into making attacker-chosen requests.": "Engaña a un servidor para hacer solicitudes elegidas por el atacante.",
  "Directory Traversal": "Traversal de directorios",
  "Uses path manipulation to access files outside the intended directory.": "Usa manipulación de rutas para acceder a archivos fuera del directorio previsto.",
  "Race Condition": "Condición de carrera",
  "Timing flaw where outcome changes between check and use.": "Falla de tiempo donde el resultado cambia entre comprobación y uso.",
  "Pre-production environment that closely mirrors production.": "Entorno preproducción que se parece mucho a producción.",
  "Static analysis of source code or binaries before runtime.": "Análisis estático de código fuente o binarios antes de ejecución.",
  "Testing a running application from the outside.": "Prueba de una aplicación en ejecución desde afuera.",
  "Unexpected or malformed input testing to find crashes and flaws.": "Pruebas con entradas inesperadas o mal formadas para encontrar fallas.",
  "Secrets Vault": "Bóveda de secretos",
  "Protected storage for passwords, keys, and tokens.": "Almacenamiento protegido para contraseñas, claves y tokens.",
  "Endpoint detection and response telemetry and investigation.": "Telemetría e investigación de detección y respuesta en endpoints.",
  "Controls that detect or prevent sensitive data loss.": "Controles que detectan o previenen pérdida de datos sensibles.",
  "Reducing attack surface through secure configuration.": "Reducir superficie de ataque mediante configuración segura.",
  "Full-Disk Encryption": "Cifrado de disco completo",
  "Protection for data at rest on a device.": "Protección para datos en reposo en un dispositivo.",
  "Secure Boot": "Secure boot",
  "Startup protection that helps load trusted components.": "Protección de arranque que ayuda a cargar componentes confiables.",
  "Cloud infrastructure such as servers, storage, networking, and virtualization.": "Infraestructura en la nube como servidores, almacenamiento, red y virtualización.",
  "Managed platform for application development and deployment.": "Plataforma administrada para desarrollo y despliegue de aplicaciones.",
  "Finished application delivered over the internet.": "Aplicación terminada entregada por internet.",
  "Policy enforcement point between users and cloud services.": "Punto de aplicación de políticas entre usuarios y servicios en la nube.",
  "Infrastructure as Code": "Infrastructure as Code",
  "Managing infrastructure through repeatable code or templates.": "Administrar infraestructura mediante código o plantillas repetibles.",
  "Warm Site": "Sitio tibio",
  "Alternate site with partial resources ready but not fully live.": "Sitio alterno con recursos parciales listos pero no totalmente activo.",
  "Hot Site": "Sitio caliente",
  "Alternate site ready to operate with minimal delay.": "Sitio alterno listo para operar con demora mínima.",
  "Target time to restore a service.": "Tiempo meta para restaurar un servicio.",
  "Maximum acceptable data loss measured in time.": "Pérdida máxima aceptable de datos medida en tiempo.",
  "Battery-backed short-term power during an outage.": "Energía temporal con batería durante un apagón.",
  "Vulnerability Scanner": "Escáner de vulnerabilidades",
  "Tool that identifies and ranks known weaknesses.": "Herramienta que identifica y clasifica debilidades conocidas.",
  "Collects, correlates, alerts on, and analyzes security events.": "Recopila, correlaciona, alerta y analiza eventos de seguridad.",
  "Automates and orchestrates security response actions.": "Automatiza y orquesta acciones de respuesta de seguridad.",
  "Rules of Engagement": "Reglas de compromiso",
  "Scope, timing, and limits for a penetration test.": "Alcance, horario y límites para una prueba de penetración.",
  "IOC": "IOC",
  "Indicator of compromise, such as a malicious hash, IP, or domain.": "Indicador de compromiso, como hash, IP o dominio malicioso.",
  "IRP": "IRP",
  "Incident response plan used to recognize, respond, and recover.": "Plan de respuesta a incidentes usado para reconocer, responder y recuperar.",
  "Limiting damage and stopping an incident from spreading.": "Limitar daño y evitar que un incidente se propague.",
  "Removing the root cause of an incident.": "Eliminar la causa raíz de un incidente.",
  "Chain of Custody": "Cadena de custodia",
  "Documentation of evidence handling.": "Documentación del manejo de evidencia.",
  "Volatile Evidence": "Evidencia volátil",
  "Evidence that can disappear quickly, such as memory contents.": "Evidencia que puede desaparecer rápido, como contenido de memoria.",
  "High-level statement of management expectations.": "Declaración de alto nivel de expectativas de la dirección.",
  "Step-by-step instructions for completing a task.": "Instrucciones paso a paso para completar una tarea.",
  "Configuration Benchmark": "Benchmark de configuración",
  "Specific secure settings for a system or application.": "Ajustes seguros específicos para un sistema o aplicación.",
  "Change Management": "Gestión de cambios",
  "Review, approval, testing, and communication of planned changes.": "Revisión, aprobación, prueba y comunicación de cambios planificados.",
  "Due Care": "Debido cuidado",
  "Implementing and maintaining reasonable security controls.": "Implementar y mantener controles de seguridad razonables.",
  "PII": "PII",
  "Information that can identify a person directly or indirectly.": "Información que puede identificar a una persona directa o indirectamente.",
  "Single loss expectancy: asset value times exposure factor.": "Expectativa de pérdida única: valor del activo por factor de exposición.",
  "Annualized loss expectancy: SLE times annual rate of occurrence.": "Expectativa anual de pérdida: SLE por tasa anual de ocurrencia.",
  "Risk Transfer": "Transferencia de riesgo",
  "Moving some risk impact to another party, such as through insurance.": "Mover parte del impacto del riesgo a otra parte, como mediante seguro.",
  "BCP": "BCP",
  "Business continuity planning keeps critical functions operating.": "La planificación de continuidad mantiene funciones críticas operando.",
  "A recovery location has utilities and network links ready, but no live duplicate systems.": "Una ubicación de recuperación tiene servicios y enlaces de red listos, pero no sistemas duplicados activos.",
  "Warm site. It is partially prepared but not fully operational.": "Sitio tibio. Está parcialmente preparado pero no totalmente operativo.",
  "An employee waves a badge near a reader and the door unlocks.": "Un empleado acerca una credencial a un lector y la puerta se desbloquea.",
  "RFID. Proximity card readers commonly use radio-frequency identification.": "RFID. Los lectores de proximidad suelen usar identificación por radiofrecuencia.",
  "A profile field stores script that runs for every visitor.": "Un campo de perfil guarda script que se ejecuta para cada visitante.",
  "Stored XSS. The malicious script is saved and later executed in browsers.": "XSS almacenado. El script malicioso se guarda y luego se ejecuta en navegadores.",
  "Authentication failures, endpoint alerts, and firewall denies are correlated into one alert.": "Fallos de autenticación, alertas de endpoint y denegaciones de firewall se correlacionan en una alerta.",
  "SIEM. It collects and correlates events from multiple sources.": "SIEM. Recopila y correlaciona eventos de múltiples fuentes.",
  "A password is accepted only after the user approves a push notification.": "Una contraseña se acepta solo después de que el usuario aprueba una notificación push.",
  "MFA. The login uses something known and something possessed.": "MFA. El inicio usa algo sabido y algo poseído.",
  "A $10,000 asset would lose 40% of value in one incident.": "Un activo de $10,000 perdería 40% de valor en un incidente.",
  "SLE is $4,000. Multiply asset value by exposure factor.": "SLE es $4,000. Multiplica valor del activo por factor de exposición.",
  "Select all that apply": "Selecciona todas las que correspondan",
  "This final practice follows the SY0-701 shape: up to 90 questions, 90 minutes, 750 passing score, and a mix of multiple-choice plus PBQ-style scenarios.": "Esta práctica final sigue la forma de SY0-701: hasta 90 preguntas, 90 minutos, puntuación aprobatoria de 750 y una mezcla de opción múltiple con escenarios tipo PBQ.",
  "Exam target: 90 questions, 90 minutes, 750 passing score.": "Meta del examen: 90 preguntas, 90 minutos, puntuación aprobatoria de 750.",
  "SY0-701 Exam Shape": "Forma del examen SY0-701",
  "The Security+ SY0-701 exam is built around five domains: general security concepts, threats and mitigations, architecture, operations, and program oversight.": "El examen Security+ SY0-701 se organiza en cinco dominios: conceptos generales, amenazas y mitigaciones, arquitectura, operaciones y supervisión del programa.",
  "The real exam can include up to 90 questions in 90 minutes. Treat this app's final practice as a timed stamina set, not just a memory drill.": "El examen real puede incluir hasta 90 preguntas en 90 minutos. Trata la práctica final de esta app como una prueba de resistencia cronometrada, no solo como memorización.",
  "Questions may be direct multiple choice, multi-response, or PBQ-style scenarios where the best answer depends on sequence, priority, or matching the control to the situation.": "Las preguntas pueden ser de opción múltiple directa, respuesta múltiple o escenarios tipo PBQ donde la mejor respuesta depende de la secuencia, prioridad o control adecuado.",
  "For the final practice, move at about one minute per question and flag long scenarios mentally before answering.": "Para la práctica final, avanza a casi un minuto por pregunta y marca mentalmente los escenarios largos antes de responder.",
  "General Security Concepts: about 12 percent.": "Conceptos generales de seguridad: alrededor del 12 por ciento.",
  "Threats, Vulnerabilities, and Mitigations: about 22 percent.": "Amenazas, vulnerabilidades y mitigaciones: alrededor del 22 por ciento.",
  "Security Architecture: about 18 percent.": "Arquitectura de seguridad: alrededor del 18 por ciento.",
  "Security Operations: about 28 percent.": "Operaciones de seguridad: alrededor del 28 por ciento.",
  "Security Program Management and Oversight: about 20 percent.": "Gestión y supervisión del programa de seguridad: alrededor del 20 por ciento.",
  "SY0-701 Control Thinking": "Pensamiento de controles SY0-701",
  "Start by naming the control goal: prevent, detect, correct, deter, compensate, or recover.": "Empieza nombrando el objetivo del control: prevenir, detectar, corregir, disuadir, compensar o recuperar.",
  "Then match the control to the asset and layer: identity, endpoint, network, application, data, facility, or business process.": "Luego relaciona el control con el activo y la capa: identidad, endpoint, red, aplicación, datos, instalación o proceso de negocio.",
  "When two answers look right, choose the one that directly reduces the risk described in the last sentence.": "Cuando dos respuestas parezcan correctas, elige la que reduzca directamente el riesgo descrito en la última frase.",
  "Question stems usually hide the control type in verbs such as block, alert, restore, verify, or discourage.": "Los enunciados suelen esconder el tipo de control en verbos como bloquear, alertar, restaurar, verificar o disuadir.",
  "Identity Provider And Federation Clues": "Pistas de proveedor de identidad y federación",
  "Modern cloud and SaaS access often centers on an identity provider that issues tokens to applications.": "El acceso moderno a nube y SaaS suele centrarse en un proveedor de identidad que emite tokens a las aplicaciones.",
  "SAML is common for enterprise browser SSO, while OIDC builds on OAuth concepts for modern web and mobile identity.": "SAML es común para SSO empresarial en navegador, mientras OIDC usa conceptos de OAuth para identidad web y móvil moderna.",
  "Conditional access combines identity signals such as location, device posture, risk score, and MFA status before allowing access.": "El acceso condicional combina señales como ubicación, postura del dispositivo, puntuación de riesgo y estado de MFA antes de permitir acceso.",
  "Federation means one trusted identity system vouches for users to another service.": "Federación significa que un sistema de identidad confiable responde por usuarios ante otro servicio.",
  "Key Lifecycle And PKI Operations": "Ciclo de vida de claves y operaciones PKI",
  "PKI questions often hinge on trust: who issued the certificate, whether it is expired, and whether it has been revoked.": "Las preguntas de PKI suelen depender de la confianza: quién emitió el certificado, si expiró y si fue revocado.",
  "Keys need generation, storage, rotation, escrow or recovery decisions, revocation, and destruction.": "Las claves necesitan generación, almacenamiento, rotación, decisiones de custodia o recuperación, revocación y destrucción.",
  "A hardware security module protects high-value keys by keeping private key operations inside tamper-resistant hardware.": "Un HSM protege claves de alto valor manteniendo operaciones de clave privada dentro de hardware resistente a manipulación.",
  "Certificates bind identities to public keys; they do not prove software is safe by themselves.": "Los certificados unen identidades a claves públicas; por sí solos no prueban que el software sea seguro.",
  "Threat Actor Pattern Recognition": "Reconocimiento de patrones de actores de amenaza",
  "Security+ scenarios often describe behavior instead of naming the attack: login spikes, unusual destinations, encoded commands, or impossible travel.": "Los escenarios de Security+ suelen describir comportamiento en vez de nombrar el ataque: picos de inicio de sesión, destinos extraños, comandos codificados o viaje imposible.",
  "Map the behavior to attacker goals: initial access, execution, persistence, privilege escalation, lateral movement, exfiltration, or impact.": "Relaciona el comportamiento con objetivos del atacante: acceso inicial, ejecución, persistencia, escalamiento, movimiento lateral, exfiltración o impacto.",
  "Indicators of compromise are evidence that something likely happened; tactics, techniques, and procedures explain how attackers operate.": "Los indicadores de compromiso son evidencia de que algo probablemente ocurrió; las TTP explican cómo operan los atacantes.",
  "IoC equals clue; TTP equals behavior pattern.": "IoC equivale a pista; TTP equivale a patrón de comportamiento.",
  "Zero Trust And Segmentation": "Zero Trust y segmentación",
  "Zero Trust assumes no network location is automatically trusted and requires continuous verification.": "Zero Trust asume que ninguna ubicación de red es confiable automáticamente y requiere verificación continua.",
  "Microsegmentation limits lateral movement by placing workloads or users into small policy-controlled zones.": "La microsegmentación limita el movimiento lateral colocando cargas o usuarios en zonas pequeñas controladas por políticas.",
  "SASE and SSE concepts combine identity-aware access, cloud security controls, and secure connectivity for distributed users.": "SASE y SSE combinan acceso consciente de identidad, controles de seguridad en la nube y conectividad segura para usuarios distribuidos.",
  "Segmentation reduces blast radius; Zero Trust decides access from identity, device, context, and policy.": "La segmentación reduce el radio de impacto; Zero Trust decide acceso por identidad, dispositivo, contexto y política.",
  "Wireless And IoT Attack Surface": "Superficie de ataque inalámbrica e IoT",
  "Wireless security questions often test whether you know the difference between encryption, authentication, and management-plane protection.": "Las preguntas inalámbricas suelen probar si distingues cifrado, autenticación y protección del plano de gestión.",
  "WPA3 improves protection, but weak passphrases, evil twins, rogue access points, and poor onboarding still create risk.": "WPA3 mejora la protección, pero contraseñas débiles, evil twins, AP no autorizados e incorporación deficiente aún crean riesgo.",
  "IoT devices need inventory, network isolation, firmware updates, and default credential removal because many cannot run full endpoint tools.": "Los IoT necesitan inventario, aislamiento de red, actualizaciones de firmware y eliminación de credenciales predeterminadas porque muchos no ejecutan herramientas completas.",
  "For IoT, isolation and inventory are often the most realistic first controls.": "Para IoT, aislamiento e inventario suelen ser los primeros controles más realistas.",
  "API And Web Application Clues": "Pistas de API y aplicaciones web",
  "Modern application questions often describe APIs, tokens, JSON payloads, and server-side calls rather than only classic web forms.": "Las preguntas modernas de aplicaciones suelen describir API, tokens, cargas JSON y llamadas del servidor, no solo formularios clásicos.",
  "Input validation, output encoding, parameterized queries, and authorization checks address different parts of the request lifecycle.": "Validación de entrada, codificación de salida, consultas parametrizadas y controles de autorización cubren partes distintas del ciclo de solicitud.",
  "SSRF is a server-side request problem; insecure direct object reference is an authorization problem.": "SSRF es un problema de solicitudes desde el servidor; IDOR es un problema de autorización.",
  "SQL injection needs query separation; XSS needs output safety; IDOR needs authorization checks.": "SQL injection necesita separación de consultas; XSS necesita salida segura; IDOR necesita autorización.",
  "Secure Pipeline And Supply Chain": "Pipeline seguro y cadena de suministro",
  "Secure development now includes the pipeline: source control, dependencies, build systems, artifact signing, and deployment approval.": "El desarrollo seguro ahora incluye el pipeline: control de código, dependencias, sistemas de compilación, firma de artefactos y aprobación de despliegue.",
  "SAST, SCA, secret scanning, container scanning, and DAST answer different questions and are strongest when combined.": "SAST, SCA, escaneo de secretos, escaneo de contenedores y DAST responden preguntas distintas y son más fuertes combinados.",
  "A software bill of materials helps identify affected components when a library vulnerability is announced.": "Un SBOM ayuda a identificar componentes afectados cuando se anuncia una vulnerabilidad de biblioteca.",
  "SBOM is inventory for software components.": "SBOM es inventario de componentes de software.",
  "Endpoint Detection And Response Flow": "Flujo de detección y respuesta en endpoints",
  "Endpoint hardening reduces attack surface before compromise; EDR helps detect and investigate suspicious activity after signals appear.": "El hardening reduce superficie antes del compromiso; EDR ayuda a detectar e investigar actividad sospechosa cuando aparecen señales.",
  "UEM and MDM enforce device posture, encryption, screen locks, application policy, and remote wipe for mobile and BYOD environments.": "UEM y MDM aplican postura, cifrado, bloqueo de pantalla, políticas de apps y borrado remoto para móviles y BYOD.",
  "Application control can use allowlists, deny lists, signatures, hashes, publishers, or behavior rules.": "El control de aplicaciones puede usar listas permitidas, listas bloqueadas, firmas, hashes, publicadores o reglas de comportamiento.",
  "Hardening prevents; EDR detects and supports response.": "Hardening previene; EDR detecta y apoya la respuesta.",
  "Cloud Responsibility And Guardrails": "Responsabilidad y guardrails en la nube",
  "Cloud security depends on the service model: the provider manages more in SaaS and less in IaaS.": "La seguridad en la nube depende del modelo: el proveedor gestiona más en SaaS y menos en IaaS.",
  "Guardrails such as policy-as-code, CSPM, least-privilege roles, encryption defaults, and logging help prevent common cloud mistakes.": "Guardrails como política como código, CSPM, roles de mínimo privilegio, cifrado predeterminado y registros ayudan a prevenir errores comunes.",
  "Cloud-native breaches often begin with exposed storage, leaked keys, excessive permissions, or missing monitoring.": "Las brechas nativas de nube suelen comenzar con almacenamiento expuesto, claves filtradas, permisos excesivos o falta de monitoreo.",
  "In cloud scenarios, ask who controls the layer and what guardrail would have prevented the mistake.": "En escenarios de nube, pregunta quién controla la capa y qué guardrail habría prevenido el error.",
  "Facilities, Environment, And Assets": "Instalaciones, ambiente y activos",
  "Physical security questions may involve people flow, environmental protection, equipment inventory, and recovery facilities.": "Las preguntas de seguridad física pueden tratar flujo de personas, protección ambiental, inventario de equipos e instalaciones de recuperación.",
  "RFID and asset tags support inventory and loss detection; mantraps and access control vestibules reduce tailgating.": "RFID y etiquetas de activos apoyan inventario y detección de pérdida; mantraps y vestíbulos reducen tailgating.",
  "Environmental controls include fire suppression, HVAC, humidity, power, UPS, generators, and water detection.": "Los controles ambientales incluyen supresión de incendios, HVAC, humedad, energía, UPS, generadores y detección de agua.",
  "Physical controls protect availability as much as confidentiality.": "Los controles físicos protegen la disponibilidad tanto como la confidencialidad.",
  "SOC Triage And Vulnerability Management": "Triaje SOC y gestión de vulnerabilidades",
  "SOC analysts start by validating whether an alert is true, identifying affected assets, and estimating severity.": "Los analistas SOC empiezan validando si una alerta es verdadera, identificando activos afectados y estimando severidad.",
  "Vulnerability management is a cycle: discover assets, scan, prioritize by risk, remediate or accept, then verify.": "La gestión de vulnerabilidades es un ciclo: descubrir activos, escanear, priorizar por riesgo, remediar o aceptar y verificar.",
  "CVSS helps describe technical severity, but business criticality, exploitability, exposure, and compensating controls drive priority.": "CVSS describe gravedad técnica, pero criticidad del negocio, explotabilidad, exposición y controles compensatorios determinan prioridad.",
  "Patch the riskiest reachable business-critical weaknesses first.": "Parchea primero las debilidades alcanzables de mayor riesgo en activos críticos.",
  "SOC Incident Workflow": "Flujo de incidentes SOC",
  "Incident response usually moves from preparation to detection, analysis, containment, eradication, recovery, and lessons learned.": "La respuesta a incidentes suele ir de preparación a detección, análisis, contención, erradicación, recuperación y lecciones aprendidas.",
  "Containment should limit damage without destroying evidence needed for investigation.": "La contención debe limitar daño sin destruir evidencia necesaria para investigar.",
  "Chain of custody, time synchronization, and evidence integrity matter when an incident may become legal or regulatory.": "Cadena de custodia, sincronización de tiempo e integridad de evidencia importan cuando un incidente puede ser legal o regulatorio.",
  "Contain first when damage is active; preserve evidence when investigation matters.": "Contén primero cuando el daño está activo; preserva evidencia cuando la investigación importa.",
  "Program Oversight And Assurance": "Supervisión del programa y aseguramiento",
  "Governance questions ask who owns decisions, which policy applies, and how evidence proves the control is working.": "Las preguntas de gobernanza preguntan quién toma decisiones, qué política aplica y cómo la evidencia prueba que el control funciona.",
  "Audits, assessments, exceptions, risk registers, and metrics connect technical work to management oversight.": "Auditorías, evaluaciones, excepciones, registros de riesgo y métricas conectan trabajo técnico con supervisión administrativa.",
  "Third-party risk requires due diligence before onboarding and ongoing monitoring after the contract is signed.": "El riesgo de terceros requiere diligencia antes de incorporar y monitoreo continuo después del contrato.",
  "Policy says what; standards say how; procedures say step-by-step.": "La política dice qué; los estándares dicen cómo; los procedimientos dicen paso a paso.",
  "Risk, Privacy, And Business Impact": "Riesgo, privacidad e impacto al negocio",
  "Risk questions often include asset value, exposure factor, annualized rate of occurrence, RTO, RPO, or legal impact.": "Las preguntas de riesgo suelen incluir valor del activo, factor de exposición, tasa anual de ocurrencia, RTO, RPO o impacto legal.",
  "Privacy scenarios focus on collection limits, consent, retention, minimization, breach notification, and cross-border transfer.": "Los escenarios de privacidad se enfocan en límites de recopilación, consentimiento, retención, minimización, notificación de brecha y transferencia internacional.",
  "A business impact analysis identifies critical functions, dependencies, acceptable downtime, and recovery priorities.": "Un análisis de impacto al negocio identifica funciones críticas, dependencias, tiempo de inactividad aceptable y prioridades de recuperación.",
  "RTO is downtime; RPO is data loss.": "RTO es tiempo de inactividad; RPO es pérdida de datos.",
  "Deterrent": "Disuasivo",
  "Corrective": "Correctivo",
  "Compensating": "Compensatorio",
  "Recovery": "Recuperación",
  "A company adds warning signs, lighting, and visible cameras around a restricted entrance. Which control effect is the main goal?": "Una empresa agrega letreros de advertencia, iluminación y cámaras visibles alrededor de una entrada restringida. ¿Cuál es el efecto principal del control?",
  "Visible warnings and cameras are intended to discourage an attempt before it happens.": "Las advertencias y cámaras visibles buscan desalentar el intento antes de que ocurra.",
  "A backup generator keeps a datacenter running when utility power fails. Which security objective is it primarily supporting?": "Un generador de respaldo mantiene un centro de datos funcionando cuando falla la energía pública. ¿Qué objetivo de seguridad apoya principalmente?",
  "Power resilience keeps services available.": "La resiliencia de energía mantiene los servicios disponibles.",
  "Verify explicitly": "Verificar explícitamente",
  "Assume internal networks are always safe": "Asumir que redes internas siempre son seguras",
  "Use least privilege": "Usar mínimo privilegio",
  "Trust devices after first login": "Confiar en dispositivos después del primer inicio",
  "Which choices are core Zero Trust ideas?": "¿Qué opciones son ideas centrales de Zero Trust?",
  "Zero Trust emphasizes explicit verification and least privilege instead of location-based trust.": "Zero Trust enfatiza verificación explícita y mínimo privilegio en vez de confianza por ubicación.",
  "A service is designed so that one failed node does not take down the application. Which concept is being applied?": "Un servicio se diseña para que un nodo fallido no detenga la aplicación. ¿Qué concepto se aplica?",
  "Resilience is the ability to continue operating through failure.": "La resiliencia es la capacidad de seguir operando durante fallas.",
  "Sandboxing": "Sandboxing",
  "A SaaS app redirects users to the company's identity provider and accepts a signed assertion after login. Which concept is being used?": "Una app SaaS redirige usuarios al proveedor de identidad de la empresa y acepta una aserción firmada después del inicio. ¿Qué concepto se usa?",
  "Federation allows a trusted identity provider to authenticate users for another service.": "La federación permite que un proveedor de identidad confiable autentique usuarios para otro servicio.",
  "Conditional access": "Acceso condicional",
  "Kerberos preauthentication": "Preautenticación Kerberos",
  "RADIUS accounting": "Contabilidad RADIUS",
  "Password spraying": "Password spraying",
  "A login is blocked because the user is in a new country, the device is unmanaged, and MFA was not completed. What control made this decision?": "Un inicio de sesión se bloquea porque el usuario está en un país nuevo, el dispositivo no está administrado y no completó MFA. ¿Qué control tomó esta decisión?",
  "Conditional access evaluates context and risk signals before granting access.": "El acceso condicional evalúa contexto y señales de riesgo antes de conceder acceso.",
  "Just-in-time elevation": "Elevación justo a tiempo",
  "Privileged access management": "Gestión de acceso privilegiado",
  "Shared administrator accounts": "Cuentas administrativas compartidas",
  "Longer password expiration": "Mayor expiración de contraseña",
  "Which two controls best reduce standing administrator privilege?": "¿Qué dos controles reducen mejor el privilegio administrativo permanente?",
  "JIT elevation and PAM reduce persistent privileged access and improve accountability.": "La elevación JIT y PAM reducen acceso privilegiado persistente y mejoran responsabilidad.",
  "HSM": "HSM",
  "TPM only": "Solo TPM",
  "WAF": "WAF",
  "A bank wants private keys used for signing transactions to remain inside tamper-resistant hardware. What should it deploy?": "Un banco quiere que claves privadas usadas para firmar transacciones permanezcan dentro de hardware resistente a manipulación. ¿Qué debe implementar?",
  "A hardware security module protects high-value cryptographic keys and operations.": "Un HSM protege claves criptográficas y operaciones de alto valor.",
  "TTPs": "TTP",
  "RTOs": "RTO",
  "Data owners": "Dueños de datos",
  "Certificate chains": "Cadenas de certificados",
  "A report says attackers use PowerShell, scheduled tasks, and encoded commands after initial access. What is the report describing?": "Un informe dice que atacantes usan PowerShell, tareas programadas y comandos codificados después del acceso inicial. ¿Qué describe el informe?",
  "Tactics, techniques, and procedures describe how attackers operate.": "Las tácticas, técnicas y procedimientos describen cómo operan atacantes.",
  "Risk appetite statements": "Declaraciones de apetito de riesgo",
  "Data classifications": "Clasificaciones de datos",
  "Recovery objectives": "Objetivos de recuperación",
  "A SOC analyst sees a known malicious IP, a suspicious file hash, and a new autorun registry key. What are these?": "Un analista SOC ve una IP maliciosa conocida, un hash sospechoso y una nueva clave de autorun. ¿Qué son?",
  "These are observable clues that compromise may have occurred.": "Son pistas observables de que pudo ocurrir un compromiso.",
  "DNS sinkholing": "DNS sinkholing",
  "Several employees receive emails with a fake invoice link that harvests Microsoft 365 credentials. What attack is this?": "Varios empleados reciben correos con un enlace de factura falsa que roba credenciales de Microsoft 365. ¿Qué ataque es?",
  "The scenario describes deceptive email used to steal credentials.": "El escenario describe correo engañoso usado para robar credenciales.",
  "Contain the affected system": "Contener el sistema afectado",
  "Pay the ransom immediately": "Pagar el rescate de inmediato",
  "Delete all backups": "Eliminar todos los respaldos",
  "A workstation shows a ransom note and many files now have a new encrypted extension. What should be prioritized first?": "Una estación muestra nota de rescate y muchos archivos tienen una nueva extensión cifrada. ¿Qué se debe priorizar primero?",
  "Containment limits spread while response continues.": "La contención limita la propagación mientras continúa la respuesta.",
  "CDN or DDoS scrubbing": "CDN o limpieza DDoS",
  "Rate limiting": "Limitación de tasa",
  "Full disk encryption": "Cifrado de disco completo",
  "RFID badges": "Credenciales RFID",
  "A public API is overwhelmed by traffic from thousands of hosts. Which controls are most relevant?": "Una API pública es abrumada por tráfico de miles de hosts. ¿Qué controles son más relevantes?",
  "DDoS defenses and rate limits help preserve availability during traffic floods.": "Defensas DDoS y límites de tasa ayudan a preservar disponibilidad durante inundaciones de tráfico.",
  "Pass-the-hash": "Pass-the-hash",
  "Kerberoasting": "Kerberoasting",
  "Authentication logs show one password tried against hundreds of accounts over several hours. What is most likely occurring?": "Los registros muestran una contraseña probada contra cientos de cuentas durante varias horas. ¿Qué ocurre probablemente?",
  "Password spraying tries a common password across many accounts to avoid lockouts.": "Password spraying prueba una contraseña común en muchas cuentas para evitar bloqueos.",
  "LDAP injection": "Inyección LDAP",
  "A vulnerable web app can be tricked into requesting the cloud metadata service and returning temporary credentials. What attack is this?": "Una app vulnerable puede ser engañada para solicitar el servicio de metadatos de nube y devolver credenciales temporales. ¿Qué ataque es?",
  "Server-side request forgery abuses the server into making requests on the attacker's behalf.": "SSRF abusa del servidor para realizar solicitudes por el atacante.",
  "Broken object-level authorization": "Autorización rota a nivel de objeto",
  "SQL deadlock": "Bloqueo SQL",
  "Weak hashing": "Hash débil",
  "Changing an order ID in an API request lets a user view another customer's order. What weakness is present?": "Cambiar el ID de pedido en una solicitud API permite ver el pedido de otro cliente. ¿Qué debilidad existe?",
  "IDOR/BOLA occurs when authorization is not checked for the requested object.": "IDOR/BOLA ocurre cuando no se verifica autorización para el objeto solicitado.",
  "Guest operating system patching": "Parcheo del sistema operativo invitado",
  "Identity and access configuration": "Configuración de identidad y acceso",
  "Physical datacenter security": "Seguridad física del datacenter",
  "Hypervisor hardware repair": "Reparación de hardware del hipervisor",
  "In an IaaS environment, which tasks are usually the customer's responsibility?": "En un entorno IaaS, ¿qué tareas suelen ser responsabilidad del cliente?",
  "In IaaS the customer typically manages guest OS and IAM choices, while the provider manages physical facilities.": "En IaaS el cliente suele gestionar el SO invitado e IAM, mientras el proveedor gestiona instalaciones físicas.",
  "CSPM": "CSPM",
  "NAC": "NAC",
  "FDE": "FDE",
  "A team wants continuous detection of public storage buckets, overly permissive security groups, and missing cloud logging. What tool category fits best?": "Un equipo quiere detección continua de buckets públicos, grupos de seguridad demasiado permisivos y registros de nube faltantes. ¿Qué categoría encaja mejor?",
  "Cloud security posture management finds risky cloud configurations.": "CSPM encuentra configuraciones riesgosas en la nube.",
  "NTP": "NTP",
  "SCADA": "SCADA",
  "A company needs visibility and policy enforcement for sanctioned and unsanctioned SaaS use. What should it consider?": "Una empresa necesita visibilidad y aplicación de políticas para SaaS aprobado y no aprobado. ¿Qué debe considerar?",
  "A CASB sits between users and cloud applications to enforce policy and visibility.": "Un CASB se ubica entre usuarios y aplicaciones en la nube para aplicar política y visibilidad.",
  "Scan images for vulnerabilities": "Escanear imágenes por vulnerabilidades",
  "Use trusted base images": "Usar imágenes base confiables",
  "Store secrets in the image": "Guardar secretos en la imagen",
  "Which controls are most relevant before deploying containers to production?": "¿Qué controles son más relevantes antes de desplegar contenedores a producción?",
  "Container security includes trusted images, scanning, and external secret management.": "La seguridad de contenedores incluye imágenes confiables, escaneo y gestión externa de secretos.",
  "Reduced lateral movement": "Menor movimiento lateral",
  "Longer certificate lifetime": "Mayor vida del certificado",
  "Higher password entropy": "Mayor entropía de contraseña",
  "Faster backups": "Respaldos más rápidos",
  "A hospital places medical IoT devices on a restricted VLAN with only required server access. What is the primary benefit?": "Un hospital coloca dispositivos IoT médicos en una VLAN restringida con solo acceso requerido a servidores. ¿Cuál es el beneficio principal?",
  "Segmentation reduces the blast radius if a device is compromised.": "La segmentación reduce el radio de impacto si se compromete un dispositivo.",
  "High availability": "Alta disponibilidad",
  "Data minimization": "Minimización de datos",
  "A web application uses two regions, health checks, and automatic failover. Which goal is most directly supported?": "Una aplicación web usa dos regiones, chequeos de salud y failover automático. ¿Qué objetivo apoya más directamente?",
  "Multi-region failover improves availability.": "El failover multirregión mejora disponibilidad.",
  "Validate the alert with login context": "Validar la alerta con contexto de inicio",
  "Erase the user's laptop": "Borrar la laptop del usuario",
  "Close the ticket as false positive": "Cerrar el ticket como falso positivo",
  "Rotate all company certificates": "Rotar todos los certificados",
  "A SIEM rule fires for impossible travel. What should the analyst do first?": "Una regla SIEM alerta por viaje imposible. ¿Qué debe hacer primero el analista?",
  "Triage starts by validating the alert and gathering context.": "El triaje empieza validando la alerta y reuniendo contexto.",
  "The internet-facing payroll server": "El servidor de nómina expuesto a Internet",
  "The isolated test system": "El sistema de prueba aislado",
  "Whichever scanner listed first": "Lo que el escáner listó primero",
  "Neither until the annual audit": "Ninguno hasta la auditoría anual",
  "A critical vulnerability exists on an internet-facing payroll server and a medium vulnerability exists on an isolated test system. What should be remediated first?": "Existe una vulnerabilidad crítica en un servidor de nómina expuesto a Internet y una media en un sistema de prueba aislado. ¿Qué se remedia primero?",
  "Exposure and business criticality increase priority.": "La exposición y criticidad del negocio aumentan prioridad.",
  "PDU": "PDU",
  "An endpoint tool records process trees, network connections, and suspicious command lines to support investigation. What is it?": "Una herramienta endpoint registra árboles de procesos, conexiones de red y comandos sospechosos para investigar. ¿Qué es?",
  "EDR collects endpoint telemetry for detection and response.": "EDR recopila telemetría endpoint para detección y respuesta.",
  "Selective wipe of company data": "Borrado selectivo de datos corporativos",
  "Revoke device access": "Revocar acceso del dispositivo",
  "Disable datacenter HVAC": "Deshabilitar HVAC del datacenter",
  "Publish the user's password": "Publicar la contraseña del usuario",
  "A lost BYOD phone contains company email. Which MDM actions are most appropriate?": "Un teléfono BYOD perdido contiene correo de la empresa. ¿Qué acciones MDM son más apropiadas?",
  "MDM can remove corporate data and revoke access without wiping unrelated personal data when configured.": "MDM puede eliminar datos corporativos y revocar acceso sin borrar datos personales no relacionados cuando está configurado.",
  "Authentication logs": "Registros de autenticación",
  "Endpoint process logs": "Registros de procesos endpoint",
  "Cafeteria menu logs": "Registros del menú de cafetería",
  "Public marketing pages": "Páginas públicas de marketing",
  "Which log sources are most useful for investigating suspected lateral movement?": "¿Qué fuentes de registro son más útiles para investigar movimiento lateral sospechoso?",
  "Authentication and endpoint telemetry help reveal remote logons and tool execution.": "La telemetría de autenticación y endpoint revela inicios remotos y ejecución de herramientas.",
  "Procurement": "Compras",
  "Policy publishing": "Publicación de políticas",
  "A server is actively exfiltrating data. What response phase is most urgent?": "Un servidor está exfiltrando datos activamente. ¿Qué fase de respuesta es más urgente?",
  "Active data loss requires containment to limit damage.": "La pérdida activa de datos requiere contención para limitar daño.",
  "Document who handled evidence": "Documentar quién manejó evidencia",
  "Hash collected images": "Calcular hashes de imágenes recolectadas",
  "Edit original logs to remove noise": "Editar registros originales para quitar ruido",
  "Work only from memory": "Trabajar solo de memoria",
  "Which actions support forensic defensibility?": "¿Qué acciones apoyan la defensibilidad forense?",
  "Chain of custody and hashes help prove evidence integrity.": "Cadena de custodia y hashes ayudan a probar integridad de evidencia.",
  "PAT": "PAT",
  "A SOC wants phishing reports to automatically enrich URLs, isolate confirmed hosts, and open tickets. What capability fits best?": "Un SOC quiere que reportes de phishing enriquezcan URLs automáticamente, aíslen hosts confirmados y abran tickets. ¿Qué capacidad encaja mejor?",
  "SOAR automates response playbooks and integrations.": "SOAR automatiza playbooks e integraciones de respuesta.",
  "Recovery confidence": "Confianza de recuperación",
  "Shoulder surfing": "Shoulder surfing",
  "RF attenuation": "Atenuación RF",
  "Backups are encrypted, copied offsite, and periodically restored in a test environment. Which concern is being addressed?": "Los respaldos están cifrados, copiados fuera del sitio y restaurados periódicamente en prueba. ¿Qué preocupación se aborda?",
  "Testing restores proves backups can support recovery.": "Probar restauraciones demuestra que los respaldos apoyan recuperación.",
  "Contain, eradicate, recover, lessons learned": "Contener, erradicar, recuperar, lecciones aprendidas",
  "Recover, ignore, contain, document": "Recuperar, ignorar, contener, documentar",
  "Publish lessons learned, then investigate": "Publicar lecciones y luego investigar",
  "Delete evidence, then contain": "Eliminar evidencia y luego contener",
  "PBQ-style: Which incident response order is best after malware is confirmed on one host?": "Tipo PBQ: ¿Qué orden de respuesta es mejor después de confirmar malware en un host?",
  "Confirmed malware normally moves through containment, eradication, recovery, and lessons learned.": "Malware confirmado normalmente sigue contención, erradicación, recuperación y lecciones aprendidas.",
  "Data retention schedule": "Calendario de retención",
  "Incident containment plan": "Plan de contención de incidentes",
  "Certificate policy only": "Solo política de certificados",
  "A document states employees may not use company systems for illegal activity or personal crypto mining. What is it?": "Un documento indica que empleados no pueden usar sistemas de la empresa para actividad ilegal o minería personal. ¿Qué es?",
  "Acceptable use defines permitted and prohibited use of systems.": "Uso aceptable define usos permitidos y prohibidos de sistemas.",
  "Vendor due diligence": "Diligencia de proveedor",
  "Data exfiltration": "Exfiltración de datos",
  "Cryptographic erasure": "Borrado criptográfico",
  "Before signing with a SaaS provider, a company reviews SOC 2 reports, breach history, and security questionnaire responses. What process is this?": "Antes de firmar con un proveedor SaaS, una empresa revisa reportes SOC 2, historial de brechas y cuestionarios de seguridad. ¿Qué proceso es?",
  "Third-party risk management includes due diligence before onboarding.": "La gestión de terceros incluye diligencia antes de incorporar.",
  "Exception management": "Gestión de excepciones",
  "Shadow IT": "Shadow IT",
  "Packet shaping": "Modelado de paquetes",
  "A system cannot meet a standard for 60 days, so management documents the risk, owner, expiration date, and compensating controls. What is this?": "Un sistema no puede cumplir un estándar por 60 días, así que gerencia documenta riesgo, dueño, fecha de expiración y controles compensatorios. ¿Qué es?",
  "Exceptions should be documented, time-bound, owned, and risk-approved.": "Las excepciones deben documentarse, tener plazo, dueño y aprobación de riesgo.",
  "Business impact analysis": "Análisis de impacto al negocio",
  "Port scan": "Escaneo de puertos",
  "Certificate pinning": "Certificate pinning",
  "Threat hunting": "Caza de amenazas",
  "A team identifies critical processes, dependencies, acceptable downtime, and recovery priorities. What activity is this?": "Un equipo identifica procesos críticos, dependencias, tiempo de inactividad aceptable y prioridades de recuperación. ¿Qué actividad es?",
  "A BIA identifies business recovery requirements.": "Un BIA identifica requisitos de recuperación del negocio.",
  "Full backup": "Respaldo completo",
  "An application collects precise location even though approximate city is enough for the service. Which privacy principle is most relevant?": "Una aplicación recopila ubicación precisa aunque ciudad aproximada basta para el servicio. ¿Qué principio de privacidad es más relevante?",
  "Data minimization limits collection to what is needed.": "La minimización limita la recopilación a lo necesario.",
  "$50,000": "$50,000",
  "$25,000": "$25,000",
  "$200,000": "$200,000",
  "$800,000": "$800,000",
  "An asset is worth $200,000 and a scenario would affect 25 percent of its value. What is the SLE?": "Un activo vale $200,000 y un escenario afectaría 25 por ciento de su valor. ¿Cuál es el SLE?",
  "SLE equals asset value times exposure factor: 200,000 x 0.25 = 50,000.": "SLE equivale a valor del activo por factor de exposición: 200,000 x 0.25 = 50,000.",
  "Revoke and rotate the key": "Revocar y rotar la clave",
  "Scan for exposed secrets": "Escanear secretos expuestos",
  "Leave it because the commit was deleted": "Dejarla porque se borró el commit",
  "Email the key to the team": "Enviar la clave por correo al equipo",
  "A developer accidentally commits an API key to a public repository. Which actions are best?": "Un desarrollador sube accidentalmente una clave API a un repositorio público. ¿Qué acciones son mejores?",
  "Exposed secrets should be revoked and rotated; scanning helps find other exposures.": "Secretos expuestos deben revocarse y rotarse; el escaneo ayuda a encontrar otras exposiciones.",
  "Cloud audit logs": "Registros de auditoría de nube",
  "Object lifecycle tiering": "Ciclo de vida de objetos",
  "RAID 10": "RAID 10",
  "Screen privacy filter": "Filtro de privacidad de pantalla",
  "Which cloud control most directly helps investigate who changed a security group rule?": "¿Qué control de nube ayuda más directamente a investigar quién cambió una regla de grupo de seguridad?",
  "Cloud audit logs record API activity and identity context.": "Los registros de auditoría de nube registran actividad API y contexto de identidad.",
  "SBOM": "SBOM",
  "NDA": "NDA",
  "A new vulnerability is announced in a logging library. What artifact helps identify affected applications fastest?": "Se anuncia una nueva vulnerabilidad en una biblioteca de logging. ¿Qué artefacto ayuda a identificar aplicaciones afectadas más rápido?",
  "An SBOM lists software components and dependencies.": "Un SBOM lista componentes y dependencias de software.",
  "Software composition analysis": "Análisis de composición de software",
  "Dependency pinning and review": "Fijación y revisión de dependencias",
  "Screen locks": "Bloqueos de pantalla",
  "Badge readers": "Lectores de credenciales",
  "Which pipeline controls are most focused on third-party dependency risk?": "¿Qué controles de pipeline se enfocan más en riesgo de dependencias de terceros?",
  "SCA and dependency governance help manage library risk.": "SCA y gobierno de dependencias ayudan a gestionar riesgo de bibliotecas.",
  "Secret scanning": "Escaneo de secretos",
  "Dynamic routing": "Enrutamiento dinámico",
  "Token replay": "Repetición de tokens",
  "A pre-commit hook blocks hard-coded passwords and tokens from entering source control. What control is this?": "Un hook pre-commit bloquea contraseñas y tokens hardcodeados antes de entrar al control de código. ¿Qué control es?",
  "Secret scanning detects credentials before they are committed or deployed.": "El escaneo de secretos detecta credenciales antes de commit o despliegue.",
  "Environmental controls": "Controles ambientales",
  "A datacenter adds water sensors under raised floors and monitors humidity. What risk area is being addressed?": "Un datacenter agrega sensores de agua bajo piso elevado y monitorea humedad. ¿Qué área de riesgo aborda?",
  "Water and humidity monitoring are environmental protections.": "Monitoreo de agua y humedad son protecciones ambientales.",
  "Asset management": "Gestión de activos",
  "Incident eradication": "Erradicación de incidentes",
  "OCSP stapling": "OCSP stapling",
  "RFID tags are required on equipment above a dollar threshold. Which program does this support most directly?": "Se requieren etiquetas RFID en equipos sobre cierto valor. ¿Qué programa apoya más directamente?",
  "Asset tags support inventory and tracking.": "Las etiquetas de activos apoyan inventario y seguimiento.",
  "Escalate according to the runbook": "Escalar según el runbook",
  "Delete the alert": "Eliminar la alerta",
  "Wait for the weekly report": "Esperar el informe semanal",
  "Disable the SIEM": "Deshabilitar el SIEM",
  "A Tier 1 SOC analyst confirms suspicious PowerShell activity and possible credential theft on an executive laptop. What should happen next?": "Un analista SOC Tier 1 confirma PowerShell sospechoso y posible robo de credenciales en la laptop de una ejecutiva. ¿Qué debe ocurrir después?",
  "Confirmed high-impact activity should be escalated through the documented process.": "Actividad confirmada de alto impacto debe escalarse por el proceso documentado.",
  "Security model that continuously verifies identity, device, context, and policy instead of trusting network location.": "Modelo que verifica continuamente identidad, dispositivo, contexto y política en vez de confiar por ubicación de red.",
  "Cloud Security Posture Management; finds risky cloud configurations such as public storage or missing logs.": "Gestión de postura de seguridad en la nube; encuentra configuraciones riesgosas como almacenamiento público o registros faltantes.",
  "CWPP": "CWPP",
  "Cloud Workload Protection Platform; protects workloads such as VMs, containers, and serverless functions.": "Plataforma de protección de cargas de nube; protege VM, contenedores y funciones serverless.",
  "Cloud Access Security Broker; gives visibility and policy enforcement for cloud app use.": "Broker de seguridad de acceso a la nube; da visibilidad y aplica políticas en apps de nube.",
  "Software Bill of Materials; inventory of application components and dependencies.": "Lista de materiales de software; inventario de componentes y dependencias.",
  "SCA": "SCA",
  "Software Composition Analysis; scans third-party libraries for vulnerable or risky components.": "Análisis de composición de software; escanea bibliotecas de terceros por componentes vulnerables o riesgosos.",
  "Security Orchestration, Automation, and Response; automates playbooks and tool integrations.": "Orquestación, automatización y respuesta de seguridad; automatiza playbooks e integraciones.",
  "TTP": "TTP",
  "Tactics, techniques, and procedures; the way an attacker behaves and operates.": "Tácticas, técnicas y procedimientos; la forma en que actúa un atacante.",
  "Indicator of Compromise": "Indicador de compromiso",
  "Observable clue such as a malicious IP, file hash, domain, or registry key.": "Pista observable como IP maliciosa, hash de archivo, dominio o clave de registro.",
  "BOLA / IDOR": "BOLA / IDOR",
  "Broken object-level authorization; users can access objects they do not own.": "Autorización rota a nivel de objeto; usuarios acceden a objetos que no les pertenecen.",
  "Server-side request forgery; attacker tricks a server into making unintended requests.": "Falsificación de solicitudes del lado del servidor; el atacante hace que el servidor realice solicitudes no previstas.",
  "PAM": "PAM",
  "Privileged Access Management; controls, monitors, and limits administrator access.": "Gestión de acceso privilegiado; controla, monitorea y limita acceso administrativo.",
  "Conditional Access": "Acceso condicional",
  "Access decision based on signals such as user, device, location, risk, and MFA.": "Decisión de acceso basada en señales como usuario, dispositivo, ubicación, riesgo y MFA.",
  "Hardware Security Module; tamper-resistant protection for high-value cryptographic keys.": "Módulo de seguridad hardware; protección resistente a manipulación para claves criptográficas de alto valor.",
  "BIA": "BIA",
  "Business Impact Analysis; identifies critical processes, dependencies, downtime, and recovery needs.": "Análisis de impacto al negocio; identifica procesos críticos, dependencias, inactividad y recuperación.",
  "RTO vs RPO": "RTO vs RPO",
  "RTO is how fast service must be restored; RPO is how much data loss is acceptable.": "RTO es qué tan rápido se restaura el servicio; RPO es cuánta pérdida de datos es aceptable.",
  "Endpoint Detection and Response; records endpoint telemetry and supports investigation and containment.": "Detección y respuesta endpoint; registra telemetría y apoya investigación y contención.",
  "UEM": "UEM",
  "Unified Endpoint Management; manages mobile, desktop, and sometimes IoT device policy.": "Gestión unificada de endpoints; gestiona políticas de móviles, escritorios y a veces IoT.",
  "Runbook": "Runbook",
  "Documented response steps for common alerts or incidents.": "Pasos documentados de respuesta para alertas o incidentes comunes.",
  "Security Exception": "Excepción de seguridad",
  "Time-bound approval to deviate from a requirement with documented risk and compensating controls.": "Aprobación temporal para desviarse de un requisito con riesgo y controles compensatorios documentados.",
  "Data Minimization": "Minimización de datos",
  "Collect and retain only the personal data needed for the stated purpose.": "Recopilar y retener solo los datos personales necesarios para el propósito indicado.",
  "Rogue wireless network that impersonates a legitimate SSID.": "Red inalámbrica falsa que suplanta un SSID legítimo.",
  "Microsegmentation": "Microsegmentación",
  "Small policy-controlled segments that limit lateral movement between workloads.": "Segmentos pequeños controlados por política que limitan movimiento lateral.",
  "Cloud Guardrails": "Guardrails de nube",
  "Preventive policies, defaults, and automation that keep cloud teams inside safe boundaries.": "Políticas preventivas, valores predeterminados y automatización que mantienen a equipos de nube en límites seguros.",
  "Defense in depth": "Defensa en profundidad",
  "Implicit deny": "Denegacion implicita",
  "Open design": "Diseno abierto",
  "A company relies on employees to report suspicious behavior, but also deploys automated alerting. Which concept best describes using people, process, and technology together?": "Una empresa depende de empleados para reportar comportamiento sospechoso, pero tambien despliega alertas automaticas. Que concepto describe mejor usar personas, proceso y tecnologia juntos?",
  "Defense in depth layers administrative, technical, and physical controls.": "Defensa en profundidad combina controles administrativos, tecnicos y fisicos.",
  "Fail safe versus fail secure": "Fail safe frente a fail secure",
  "Hashing versus encryption": "Hashing frente a cifrado",
  "RTO versus RPO": "RTO frente a RPO",
  "SaaS versus PaaS": "SaaS frente a PaaS",
  "An access control system unlocks doors during a life-safety emergency but locks a server cabinet when power is lost. What design idea is being balanced?": "Un sistema de control de acceso abre puertas durante una emergencia de vida, pero bloquea un gabinete de servidores cuando se pierde energia. Que idea de diseno se equilibra?",
  "Safety-critical doors may fail open, while asset-protection locks may fail closed.": "Puertas criticas para seguridad humana pueden abrirse ante falla, mientras protecciones de activos pueden cerrarse.",
  "Users are sent to a fake banking site after an attacker corrupts name resolution. What attack category best fits?": "Usuarios llegan a un sitio bancario falso despues de que un atacante corrompe la resolucion de nombres. Que categoria encaja mejor?",
  "DNS poisoning manipulates name resolution to redirect victims.": "El envenenamiento DNS manipula resolucion de nombres para redirigir victimas.",
  "DKIM": "DKIM",
  "A switch places unmanaged laptops into a remediation VLAN until posture checks pass. What control is being used?": "Un switch coloca laptops no administradas en una VLAN de remediacion hasta que pasan verificaciones de postura. Que control se usa?",
  "Network access control can evaluate device posture and assign network access dynamically.": "NAC puede evaluar postura del dispositivo y asignar acceso de red dinamicamente.",
  "Wireless site survey": "Estudio de sitio inalambrico",
  "A technician maps signal bleed into a parking lot and adjusts AP power and placement. What activity is this closest to?": "Un tecnico mapea fuga de senal hacia un estacionamiento y ajusta potencia y ubicacion de AP. A que actividad se parece mas?",
  "A wireless site survey measures coverage, interference, and signal leakage.": "Un estudio de sitio inalambrico mide cobertura, interferencia y fuga de senal.",
  "SQL injection": "Inyeccion SQL",
  "A logged-in user is tricked into clicking a link that submits an unwanted account change to a site where she is already authenticated. What attack is this?": "Una usuaria autenticada es enganada para hacer clic en un enlace que envia un cambio no deseado a un sitio donde ya inicio sesion. Que ataque es?",
  "Cross-site request forgery abuses a victim browser and existing session to submit unwanted actions.": "CSRF abusa del navegador de la victima y una sesion existente para enviar acciones no deseadas."
};

function t(text) {
  return state.language === "es" ? (uiTranslations[text] || text) : text;
}

function q(topic, prompt, choices, answer, explanation) {
  return { id: `${topic}-${Math.random().toString(36).slice(2)}`, topic, prompt, choices, answer, explanation };
}

function tf(topic, prompt, answerIsTrue, explanation) {
  return q(topic, prompt, ["True", "False"], answerIsTrue ? 0 : 1, explanation);
}

function fc(term, definition, topic) {
  return { id: `${topic}-${term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, term, definition, topic };
}

function exampleCard(term, definition, topic) {
  return { ...fc(term, definition, topic), kind: "example" };
}

function exampleLesson(title, examples, remember) {
  return {
    title,
    body: [],
    sections: [
      {
        title: "Examples",
        items: examples.map(([situation, answer]) => `${situation} ${answer}`)
      }
    ],
    remember
  };
}

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function replaceArrayContents(target, source) {
  target.splice(0, target.length, ...deepClone(source));
}

function restoreEnglishData() {
  replaceArrayContents(topics, ORIGINAL_DATA.topics);
  replaceArrayContents(fullQuestionBank, ORIGINAL_DATA.fullQuestionBank);
  replaceArrayContents(flashCardBank, ORIGINAL_DATA.flashCardBank);
}

async function setLanguage(language) {
  state.language = language;
  state.translationError = "";
  save("psa-language", language);
  document.documentElement.lang = language === "es" ? "es" : "en";
  state.translating = true;
  render();
  try {
    await localizeData(language);
  } catch (error) {
    state.translationError = error.message || "Translation failed";
    restoreEnglishData();
  }
  state.translating = false;
  render();
}

async function localizeData(language) {
  if (language !== "es") {
    restoreEnglishData();
    state.translationError = "";
    return;
  }
  const packTranslations = await loadLanguagePack(language);
  if (!packTranslations) throw new Error("Spanish language pack could not load.");
  const localized = applyTranslationMapToDataSet(ORIGINAL_DATA, packTranslations);
  assertSpanishDataLoaded(localized);
  replaceArrayContents(topics, localized.topics);
  replaceArrayContents(fullQuestionBank, localized.fullQuestionBank);
  replaceArrayContents(flashCardBank, localized.flashCardBank);
  state.translationError = "";
}

function applyTranslationMapToDataSet(data, translations) {
  const localized = deepClone(data);
  translateStringsInPlace(localized, translations);
  return localized;
}

async function loadLanguagePack(language) {
  if (!LANGUAGE_PACK_URLS[language]) return null;
  if (languagePackCache[language]) return languagePackCache[language];
  try {
    const response = await fetch(LANGUAGE_PACK_URLS[language], { cache: "force-cache" });
    if (!response.ok) throw new Error("Language pack not found");
    const pack = await response.json();
    languagePackCache[language] = pack.translations || {};
    return languagePackCache[language];
  } catch {
    return null;
  }
}

async function translateDataSet(data, language) {
  const localized = deepClone(data);
  const strings = [];
  collectTranslatableStrings(localized, strings);
  const translations = await getTranslations([...new Set(strings)], language, { throwOnFailure: true });
  translateStringsInPlace(localized, translations);
  return localized;
}

function assertSpanishDataLoaded(localized) {
  const iam = localized.topics.find((topic) => topic.id === "iam");
  const lesson = iam?.lessons?.find((item) => item.title === "Identification, Authentication, Authorization");
  if (lesson || iam?.title === "Identity & Access") {
    throw new Error("Spanish study content was not translated.");
  }
}

function collectTranslatableStrings(value, bucket, key = "") {
  if (typeof value === "string") {
    if (shouldTranslateDataString(value, key)) bucket.push(value);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectTranslatableStrings(item, bucket, key));
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([childKey, childValue]) => {
    collectTranslatableStrings(childValue, bucket, childKey);
  });
}

function translateStringsInPlace(value, translations, key = "") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === "string") {
        if (shouldTranslateDataString(item, key) && translations[item]) value[index] = translations[item];
        return;
      }
      translateStringsInPlace(item, translations, key);
    });
    return;
  }
  if (!value || typeof value !== "object") return;
  Object.entries(value).forEach(([childKey, childValue]) => {
    if (typeof childValue === "string") {
      if (shouldTranslateDataString(childValue, childKey) && translations[childValue]) {
        value[childKey] = translations[childValue];
      }
      return;
    }
    translateStringsInPlace(childValue, translations, childKey);
  });
}

function shouldTranslateDataString(value, key = "") {
  const text = value.trim();
  if (!text || DATA_TRANSLATION_SKIP_KEYS.has(key)) return false;
  if (!/[A-Za-z]/.test(text)) return false;
  return true;
}

function $(selector) {
  return document.querySelector(selector);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isNoTranslateNode(node) {
  const parent = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  return Boolean(parent?.closest("[data-no-translate], svg, script, style"));
}

function collectTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const text = node.nodeValue.trim();
      if (!text || !/[A-Za-z]/.test(text) || isNoTranslateNode(node)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function preserveSpacing(original, translated) {
  const leading = original.match(/^\s*/)?.[0] || "";
  const trailing = original.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}

async function applyLanguage() {
  const root = document.getElementById("app");
  if (!root) return;
  document.documentElement.lang = state.language === "es" ? "es" : "en";
  if (state.language !== "es") return;
  const run = ++translationRun;
  const nodes = collectTextNodes(root);
  const placeholderNodes = [...root.querySelectorAll("input[placeholder]")].filter((node) => !node.closest("[data-no-translate]"));
  const texts = [
    ...nodes.map((node) => node.nodeValue.trim()),
    ...placeholderNodes.map((node) => node.getAttribute("placeholder").trim())
  ];
  const translations = await getTranslations([...new Set(texts)], "es");
  if (run !== translationRun) return;
  nodes.forEach((node) => {
    const original = node.nodeValue;
    const translated = translations[original.trim()];
    if (translated) node.nodeValue = preserveSpacing(original, translated);
  });
  placeholderNodes.forEach((node) => {
    const original = node.getAttribute("placeholder").trim();
    if (translations[original]) node.setAttribute("placeholder", translations[original]);
  });
}

async function getTranslations(texts, language, options = {}) {
  const packTranslations = await loadLanguagePack(language);
  const output = {};
  texts.forEach((text) => {
    if (!text || text.length > 900) return;
    if (language === "es" && uiTranslations[text]) output[text] = uiTranslations[text];
    else if (packTranslations?.[text]) output[text] = packTranslations[text];
  });
  if (options.throwOnFailure) {
    const missingRequiredText = texts.some((text) => text && text.length <= 900 && !output[text]);
    if (missingRequiredText) throw new Error("Language pack is missing required text.");
  }
  return output;
}

function svg(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.cloud}</svg>`;
}

function topicById(id) {
  return topics.find((topic) => topic.id === id);
}

function progress() {
  const complete = load("secplus-complete", {});
  const totalLessons = topics.reduce((sum, topic) => sum + topic.lessons.length, 0);
  const doneLessons = Object.keys(complete).length;
  const bestScore = load("secplus-best-final", 0);
  const readiness = examReadiness();
  return { complete, totalLessons, doneLessons, bestScore, readiness };
}

function render() {
  const app = document.getElementById("app");
  if (state.translating) {
    app.innerHTML = renderLanguageLoading();
    wire();
    return;
  }
  if (state.screen === "home") app.innerHTML = renderHome();
  if (state.screen === "topic") app.innerHTML = renderTopic();
  if (state.screen === "lesson") app.innerHTML = renderLesson();
  if (state.screen === "quiz") app.innerHTML = renderQuiz();
  if (state.screen === "flashcards") app.innerHTML = renderFlashCards();
  if (state.screen === "flashSubjects") app.innerHTML = renderFlashSubjectPicker();
  if (state.screen === "search") app.innerHTML = renderSearch();
  wire();
  applyVisibleSpanishFallback();

  setTimeout(() => {
    document.querySelectorAll(".stat-ring").forEach((ring) => {
      const value = ring.style.getPropertyValue("--value");
      const color = ring.classList.contains("readiness-ready")
        ? "var(--green)"
        : ring.classList.contains("readiness-build") ? "#ffb84d" : "var(--cyan)";
      ring.style.background =
        `conic-gradient(${color} ${value}, rgba(255,255,255,0.08) 0)`;
    });
  }, 100);
}

function topbar(title, right = "info") {
  const back = state.screen === "home" ? `<div></div>` : `<button class="icon-button" data-action="back" aria-label="Back">${svg("back")}</button>`;
  const titleAttr = title === "Check On It Cyber Academy" ? ` data-no-translate="true"` : "";
  return `
    <header class="topbar">
      ${back}
      <div>
        <h1 class="title"${titleAttr}>${escapeHtml(title)}</h1>
      </div>
      <button class="icon-button ${right === "star" ? "gold" : ""}" data-action="${right}" aria-label="${right === "star" ? "Bookmark" : "Info"}">${svg(right)}</button>
    </header>
  `;
}

function renderLanguageToggle() {
  return `
    <div class="language-toggle" data-no-translate="true" aria-label="Language">
      <button class="${state.language === "en" ? "active" : ""}" data-language="en">English</button>
      <span>|</span>
      <button class="${state.language === "es" ? "active" : ""}" data-language="es">Español</button>
    </div>
  `;
}

function renderHome() {
  const p = progress();
  return `
    <main class="screen">
      ${topbar("Check On It Cyber Academy")}
      ${renderLanguageToggle()}
      ${renderTranslationWarning()}
      <section class="hero-stat" aria-label="Study stats">
  <div class="stat-card">
    <div class="stat-ring" style="--value:${Math.round((p.doneLessons / p.totalLessons) * 100)}%;">
      <div class="stat-ring-inner"><strong>${p.doneLessons}/${p.totalLessons}</strong></div>
    </div>
    <span>${escapeHtml(t("lessons"))}</span>
  </div>

  <div class="stat-card">
    <div class="stat-ring readiness-${p.readiness.level}" style="--value:${p.readiness.score}%;">
      <div class="stat-ring-inner"><strong>${p.readiness.score}%</strong></div>
    </div>
    <span>${escapeHtml(t("readiness"))}</span>
  </div>

  <div class="stat-card">
    <div class="stat-ring" style="--value:${p.bestScore}%;">
      <div class="stat-ring-inner"><strong>${p.bestScore}%</strong></div>
    </div>
    <span>${escapeHtml(t("best final"))}</span>
  </div>
</section>
      ${renderStudyDashboard(p)}
      ${renderHomeBookmarks()}
      <section class="topic-grid">
        <button class="topic-card feature-card" data-action="startDailyDrill" aria-label="Daily Quick Drill">
          <span class="topic-icon">${svg("exam")}</span>
          <span>${escapeHtml(t("Daily Quick Drill"))}</span>
        </button>
        <button class="topic-card feature-card" data-action="openSearch" aria-label="Search Study Guide">
          <span class="topic-icon">${svg("tool")}</span>
          <span>${escapeHtml(t("Search"))}</span>
        </button>
        <button class="topic-card feature-card" data-action="startFlashCards" aria-label="Flash Cards">
          <span class="topic-icon">${svg("cards")}</span>
          <span>${escapeHtml(t("Flash Cards"))}</span>
        </button>
        ${topics.map((topic) => `
          <button class="topic-card" data-topic="${topic.id}" aria-label="${escapeHtml(topic.title)}">
            <span class="topic-icon">${svg(topic.icon)}</span>
            <span>${escapeHtml(topic.title)}</span>
          </button>
        `).join("")}
      </section>
      <p class="authorship-notice">© 2026 Bianca Russek. Authored by Bianca Russek. First created May 15, 2026. All rights reserved.</p>
    </main>
  `;
}

function renderStudyDashboard(p) {
  const weak = weakAreas();
  const readiness = p.readiness;
  return `
    <section class="study-dashboard" aria-label="Study dashboard">
      <div class="readiness-card">
        <div>
          <span>${escapeHtml(t("Exam Readiness"))}</span>
          <strong>${escapeHtml(readiness.label)}</strong>
          <small>${escapeHtml(readiness.note)}</small>
        </div>
        <button class="mini-action" data-action="startFinalPractice">90 Q</button>
      </div>
      <div class="weak-panel">
        <div class="section-heading">
          <h2>${escapeHtml(t("Focus Next"))}</h2>
          <span>${weak.length ? weak.length : "0"}</span>
        </div>
        ${weak.length ? weak.map((item) => `
          <button class="weak-row" data-topic="${item.topic.id}">
            <span>${escapeHtml(item.topic.title)}</span>
            <strong>${item.score}%</strong>
          </button>
        `).join("") : `<p class="empty-note">${escapeHtml(t("Take a quiz or quick drill to reveal weak areas."))}</p>`}
      </div>
    </section>
  `;
}

function renderHomeBookmarks() {
  const bookmarks = bookmarkedLessons();
  if (!bookmarks.length) return "";
  return `
    <section class="bookmark-panel" aria-label="Bookmarked lessons">
      <div class="section-heading">
        <h2>${escapeHtml(t("Bookmarked Lessons"))}</h2>
        <span>${bookmarks.length}</span>
      </div>
      <div class="bookmark-list">
        ${bookmarks.map((item) => `
          <button class="bookmark-row" data-bookmark-topic="${item.topic.id}" data-bookmark-lesson="${item.lessonIndex}">
            <span class="bookmark-star">${svg("star")}</span>
            <span>
              <strong>${escapeHtml(item.lesson.title)}</strong>
              <small>${escapeHtml(item.topic.title)}</small>
            </span>
            <span class="chevron">&rsaquo;</span>
          </button>
        `).join("")}
      </div>
    </section>
  `;
}

function bookmarkedLessons() {
  return Object.keys(state.bookmarked)
    .map((key) => {
      const [topicId, lessonIndexText] = key.split(":");
      const topic = topicById(topicId);
      const lessonIndex = Number(lessonIndexText);
      const lesson = topic?.lessons[lessonIndex];
      if (!topic || !lesson) return null;
      return { key, topic, lesson, lessonIndex };
    })
    .filter(Boolean);
}

function examReadiness() {
  const history = load("secplus-final-history", []);
  const recent = history.slice(-3);
  const score = recent.length
    ? Math.round(recent.reduce((sum, item) => sum + item.score, 0) / recent.length)
    : load("secplus-best-final", 0);
  if (score >= 85) return { score, level: "ready", label: t("Ready"), note: t("Recent final practice is in a strong pass range.") };
  if (score >= 70) return { score, level: "close", label: t("Almost Ready"), note: t("Keep drilling missed questions and weaker areas.") };
  if (score > 0) return { score, level: "build", label: t("Keep Practicing"), note: t("Use quick drills and review missed answers.") };
  return { score: 0, level: "build", label: t("Start Practicing"), note: t("Run a quick drill or 90-question final to calibrate.") };
}

function applyVisibleSpanishFallback() {
  if (state.language !== "es" || state.translating) return;
  applyLanguage();
}

function renderLanguageLoading() {
  return `
    <main class="screen">
      ${topbar("Check On It Cyber Academy")}
      ${renderLanguageToggle()}
      <section class="score-card language-loading">
        <div class="score">...</div>
        <p>${escapeHtml(t("Updating language..."))}</p>
      </section>
    </main>
  `;
}

function renderTranslationWarning() {
  if (state.language !== "es" || !state.translationError) return "";
  return `
    <section class="translation-warning">
      <p>${escapeHtml(t("Spanish translation could not load. Check the language pack, then tap Español again."))}</p>
    </section>
  `;
}

function weakAreas() {
  const stats = load("secplus-topic-stats", {});
  return topics
    .filter((topic) => topic.id !== "exam")
    .map((topic) => {
      const item = stats[topic.id];
      if (!item || item.total < 3) return null;
      return { topic, score: Math.round((item.correct / item.total) * 100), total: item.total };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || b.total - a.total)
    .slice(0, 3);
}

function renderTopic() {
  const topic = topicById(state.topicId);
  const rows = topic.lessons.map((lesson, index) => `
    <button class="lesson-row" data-lesson="${index}">
      <span class="mini-icon">${index + 1}</span>
      <strong>${escapeHtml(lesson.title)}</strong>
      <span class="chevron">&rsaquo;</span>
    </button>
  `).join("");
  return `
    <main class="screen topic-screen">
      ${topbar(topic.title)}
      <section class="list">
        ${rows}
        <button class="lesson-row" data-action="topicQuiz">
          <span class="mini-icon">Q</span>
          <strong>${topic.id === "exam" ? escapeHtml(t("Start 90-question final practice")) : `${escapeHtml(t("Quiz"))}: ${escapeHtml(topic.title)}`}</strong>
          <span class="chevron">&rsaquo;</span>
        </button>
      </section>
    </main>
  `;
}

function renderLesson() {
  const topic = topicById(state.topicId);
  const lesson = topic.lessons[state.lessonIndex];
  const key = `${topic.id}:${state.lessonIndex}`;
  const bookmarked = state.bookmarked[key];
  return `
    <main class="screen reader">
      ${topbar(topic.title, "star").replace("gold", bookmarked ? "gold" : "")}
      <article class="reader-card" data-swipe="lesson">
        <h2>${escapeHtml(lesson.title)}</h2>
        ${(lesson.body || []).map((para) => `<p>${escapeHtml(para)}</p>`).join("")}
        ${renderLessonSections(lesson.sections)}
        ${lesson.remember ? `<div class="memory-box">${escapeHtml(lesson.remember)}</div>` : ""}
        ${lesson.code ? `<pre class="code-strip">${escapeHtml(lesson.code)}</pre>` : ""}
      </article>
      ${dots(topic.lessons.length, state.lessonIndex)}
      <nav class="bottom-nav">
        <button class="icon-button" data-action="prevLesson" aria-label="Previous">${svg("back")}</button>
        <button class="pill-button secondary" data-action="markDone">${escapeHtml(t("Done"))}</button>
        <button class="pill-button" data-action="topicQuiz" data-quiz-source-topic="${escapeHtml(topic.id)}" data-quiz-source-lesson="${state.lessonIndex}">${escapeHtml(t("Quiz"))}</button>
        <button class="icon-button" data-action="nextLesson" aria-label="Next">${svg("next")}</button>
      </nav>
    </main>
  `;
}

function renderLessonSections(sections = []) {
  if (!sections.length) return "";
  return `
    <div class="lesson-sections">
      ${sections.map((section) => `
        <section class="lesson-section">
          <h3>${escapeHtml(section.title)}</h3>
          <ul>
            ${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>
        </section>
      `).join("")}
    </div>
  `;
}

function renderQuiz() {
  const questions = state.activeQuestions;
  const current = questions[state.quizIndex];
  if (!current) return renderResults(questions);
  const answerRecord = state.answers[current.id];
  const checked = Boolean(answerRecord);
  const multi = isMultiSelectQuestion(current);
  const selected = checked ? answerRecord.selected : state.selected;
  const answeredCount = Object.keys(state.answers).length;
  const percent = Math.round(((state.quizIndex + 1) / questions.length) * 100);
  return `
    <main class="screen quiz-card" data-swipe="quiz">
      ${topbar(quizTitle())}
      <section class="quiz-panel">
        <div class="quiz-status">
          <span>${escapeHtml(t("Question"))} ${state.quizIndex + 1} ${escapeHtml(t("of"))} ${questions.length}</span>
          <span>${answeredCount} ${escapeHtml(t("answered"))}</span>
        </div>
        <div class="quiz-meter" aria-hidden="true"><span style="width:${percent}%"></span></div>
        ${multi ? `<div class="question-type">${escapeHtml(t("Select all that apply"))}</div>` : ""}
        <p class="question">${escapeHtml(current.prompt)}</p>
        <section class="answer-list">
          ${current.choices.map((choice, index) => {
            const isSelected = multi ? Array.isArray(selected) && selected.includes(index) : selected === index;
            const isCorrect = isCorrectIndex(current, index);
            let cls = isSelected ? "selected" : "";
            if (checked && isCorrect) cls += " correct";
            if (checked && isSelected && !isCorrect) cls += " wrong";
            return `
              <button class="answer ${cls}" data-answer="${index}">
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span class="answer-text">${escapeHtml(choice)}</span>
              </button>
            `;
          }).join("")}
        </section>
        ${checked ? `
          <div class="feedback">${escapeHtml(current.explanation)}</div>
          ${renderChoiceBreakdown(current)}
        ` : ""}
      </section>
      <nav class="quiz-actions">
        <button class="quiz-nav-button" data-action="prevQuestion">${svg("back")}<span>${escapeHtml(t("Prev"))}</span></button>
        <button class="quiz-primary ${checked ? (answerRecord.correct ? "correct" : "wrong") : ""}" data-action="check">${escapeHtml(checked ? (answerRecord.correct ? t("Correct") : t("Review")) : t("Check"))}</button>
        <button class="quiz-ghost" data-action="showAnswer">${escapeHtml(t("Reveal"))}</button>
        <button class="quiz-nav-button" data-action="nextQuestion"><span>${escapeHtml(t("Next"))}</span>${svg("next")}</button>
      </nav>
    </main>
  `;
}

function renderFlashCards() {
  const cards = state.flashCards.length ? state.flashCards : flashCardBank;
  const card = cards[state.flashIndex] || cards[0];
  const topic = topicById(card.topic);
  const filterTitle = flashSubjectTitle(state.flashFilterTopic);
  const isExample = card.kind === "example";
  const saved = Boolean(state.flashSaved[card.id]);
  return `
    <main class="screen flash-screen" data-swipe="flashcards">
      ${topbar(t("Flash Cards"))}
      <div class="flash-meta">
        <span>${state.flashIndex + 1} / ${cards.length}</span>
        <span>${escapeHtml(filterTitle)}</span>
      </div>
      <div class="flash-tools">
        <button class="flash-tool" data-action="chooseFlashSubject">${escapeHtml(t("Subject"))}</button>
        <button class="flash-tool ${saved ? "saved" : ""}" data-action="saveFlashCard">${escapeHtml(saved ? t("Saved") : t("Save"))}</button>
        <button class="flash-tool" data-action="openFlashTopic">${escapeHtml(t("Home tile"))}: ${escapeHtml(topic?.title || t("Study"))}</button>
      </div>
      <button class="flash-card ${state.flashFlipped ? "flipped" : ""} ${isExample ? "example-card" : ""}" data-action="flipFlashCard" aria-label="Flip flash card">
        ${isExample ? "" : `<span class="flash-label">${state.flashFlipped ? "Answer" : "Term"}</span>`}
        <strong>${escapeHtml(state.flashFlipped ? card.definition : card.term)}</strong>
        <small>${escapeHtml(state.flashFlipped ? (isExample ? t("Tap to see the example") : t("Tap to see the term")) : t("Tap to reveal the answer"))}</small>
      </button>
      ${dots(cards.length, state.flashIndex)}
      <nav class="bottom-nav">
        <button class="icon-button" data-action="prevFlashCard" aria-label="Previous">${svg("back")}</button>
        <button class="pill-button secondary" data-action="shuffleFlashCards">${escapeHtml(t("Shuffle"))}</button>
        <button class="pill-button" data-action="flipFlashCard">${escapeHtml(t("Flip"))}</button>
        <button class="icon-button" data-action="nextFlashCard" aria-label="Next">${svg("next")}</button>
      </nav>
    </main>
  `;
}

function renderFlashSubjectPicker() {
  const subjectRows = flashSubjects().map((subject) => `
    <button class="lesson-row flash-subject-row" data-flash-topic="${subject.id}">
      <span class="mini-icon">${subject.id === "all" ? "All" : svg(subject.icon)}</span>
      <strong>${escapeHtml(subject.title)}</strong>
      <span class="subject-count">${subject.count}</span>
    </button>
  `).join("");
  return `
    <main class="screen topic-screen">
      ${topbar(t("Choose Subject"))}
      <section class="list">
        ${subjectRows}
      </section>
    </main>
  `;
}

function renderSearch() {
  return `
    <main class="screen topic-screen">
      ${topbar(t("Search"))}
      <section class="search-panel">
        <input id="searchBox" class="search-input" type="search" value="${escapeHtml(state.searchQuery)}" placeholder="${escapeHtml(t("Search CIA, MFA, XSS, RAID..."))}" autocomplete="off" />
        <div class="search-results">
          ${renderSearchResults(state.searchQuery)}
        </div>
      </section>
    </main>
  `;
}

function renderSearchResults(query) {
  const results = searchItems(query);
  if (!query.trim()) return `<p class="empty-note">${escapeHtml(t("Search lessons and flash cards by service, term, or exam clue."))}</p>`;
  if (!results.length) return `<p class="empty-note">${escapeHtml(t("No matches yet. Try a shorter term."))}</p>`;
  return results.map((item) => {
    if (item.kind === "lesson") {
      return `
        <button class="search-row" data-search-topic="${item.topic.id}" data-search-lesson="${item.lessonIndex}">
          <span>${escapeHtml(t("Lesson"))}</span>
          <strong>${escapeHtml(item.lesson.title)}</strong>
          <small>${escapeHtml(item.topic.title)}</small>
        </button>
      `;
    }
    return `
      <button class="search-row" data-search-card="${item.card.id}">
        <span>${escapeHtml(t("Flash Card"))}</span>
        <strong>${escapeHtml(item.card.term)}</strong>
        <small>${escapeHtml(topicById(item.card.topic)?.title || t("Study"))}</small>
      </button>
    `;
  }).join("");
}

function renderResults(questions) {
  const correct = questions.filter((item) => state.answers[item.id]?.correct).length;
  const score = Math.round((correct / questions.length) * 100);
  const missed = questions.filter((item) => state.answers[item.id] && !state.answers[item.id].correct);
  const nextLesson = resultNextLessonTarget();
  if (!state.resultSaved) {
    recordQuizResult(questions, correct);
    state.resultSaved = true;
  }
  if (state.quizMode === "final") {
    const best = Math.max(load("secplus-best-final", 0), score);
    save("secplus-best-final", best);
  }
  return `
    <main class="screen">
      ${topbar(t("Quiz Results"))}
      <section class="score-card">
        <p>${correct} ${escapeHtml(t("of"))} ${questions.length} ${escapeHtml(t("correct"))}</p>
        <div class="score">${score}%</div>
        <p>${escapeHtml(score >= 80 ? t("Strong pass pace. Review missed questions once, then run another 90-question set.") : t("Keep going. Tap review and focus on the explanations for missed questions."))}</p>
        ${missed.length ? `<button class="pill-button" data-action="reviewMissed">${escapeHtml(t("Review Missed"))} (${missed.length})</button>` : ""}
        ${nextLesson ? `<button class="pill-button" data-action="quizNextLesson">${escapeHtml(t("Next Lesson"))}</button>` : ""}
        <button class="pill-button secondary" data-action="goHome">${escapeHtml(t("Home"))}</button>
        <button class="pill-button secondary" data-action="restartQuiz">${escapeHtml(t("Try Again"))}</button>
      </section>
    </main>
  `;
}

function quizTitle() {
  if (state.quizMode === "final") return t("Fresh 90 Final");
  if (state.quizMode === "daily") return t("Daily Quick Drill");
  if (state.quizMode === "review") return t("Missed Questions");
  return `${topicById(state.topicId)?.title || t("Study")} ${t("Quiz")}`;
}

function renderChoiceBreakdown(question) {
  return `
    <div class="choice-breakdown">
      <strong>${escapeHtml(t("Answer breakdown"))}</strong>
      ${question.choices.map((choice, index) => `
        <p class="${isCorrectIndex(question, index) ? "right" : ""}">
          <span>${String.fromCharCode(65 + index)}.</span>
          ${escapeHtml(isCorrectIndex(question, index) ? `${t("Correct")}: ${question.explanation}` : whyChoiceIsWrong(choice, question))}
        </p>
      `).join("")}
    </div>
  `;
}

function recordQuizResult(questions, correct) {
  const stats = load("secplus-topic-stats", {});
  questions.forEach((question) => {
    const topic = question.topic;
    if (!stats[topic]) stats[topic] = { correct: 0, total: 0, attempts: 0 };
    stats[topic].total += 1;
    stats[topic].attempts += 1;
    if (state.answers[question.id]?.correct) stats[topic].correct += 1;
    stats[topic].lastScore = Math.round((stats[topic].correct / stats[topic].total) * 100);
  });
  save("secplus-topic-stats", stats);

  if (state.quizMode === "final") {
    const score = Math.round((correct / questions.length) * 100);
    const history = load("secplus-final-history", []);
    history.push({ score, date: new Date().toISOString() });
    save("secplus-final-history", history.slice(-10));
  }
}

function resultNextLessonTarget() {
  const sourceTopic = state.quizSourceTopic || state.topicId;
  if (!sourceTopic || sourceTopic === "final" || sourceTopic === "daily") return null;
  if (!["topic", "review"].includes(state.quizMode)) return null;
  if (typeof state.quizSourceLessonIndex === "number") {
    return nextLessonTarget(sourceTopic, state.quizSourceLessonIndex);
  }
  return firstOpenLessonTarget(sourceTopic);
}

function nextLessonTarget(topicId, lessonIndex) {
  const topicIndex = topics.findIndex((topic) => topic.id === topicId);
  if (topicIndex < 0) return null;
  const topic = topics[topicIndex];
  const nextIndex = lessonIndex + 1;
  if (nextIndex < topic.lessons.length) return { topicId, lessonIndex: nextIndex };
  for (let index = topicIndex + 1; index < topics.length; index += 1) {
    if (topics[index].id !== "exam" && topics[index].lessons.length) {
      return { topicId: topics[index].id, lessonIndex: 0 };
    }
  }
  return null;
}

function firstOpenLessonTarget(topicId) {
  const topic = topicById(topicId);
  if (!topic?.lessons?.length) return null;
  const complete = load("secplus-complete", {});
  const openIndex = topic.lessons.findIndex((_, index) => !complete[`${topicId}:${index}`]);
  if (openIndex >= 0) return { topicId, lessonIndex: openIndex };
  return nextLessonTarget(topicId, topic.lessons.length - 1) || { topicId, lessonIndex: 0 };
}

function whyChoiceIsWrong(choice, question) {
  const hint = serviceHint(choice);
  if (state.language === "es") {
    if (hint) return `${choice} no es la mejor respuesta aquí.`;
    if (isTrueFalseQuestion(question)) return `${choice} no coincide con la afirmación. ${question.explanation}`;
    return `${choice} no coincide con el requisito principal de esta pregunta.`;
  }
  if (hint) return `${choice} is not the best match here. ${hint}`;
  if (isTrueFalseQuestion(question)) return `${choice} does not match the statement. ${question.explanation}`;
  return `${choice} does not match the main requirement in this question.`;
}

function dots(total, active) {
  return `<div class="progress-strip">${Array.from({ length: total }, (_, index) => `<span class="progress-dot ${index === active ? "active" : ""}"></span>`).join("")}</div>`;
}

function startQuiz(topicId, options = {}) {
  state.screen = "quiz";
  state.topicId = topicId;
  state.quizSourceTopic = options.sourceTopic || topicId;
  state.quizSourceLessonIndex = typeof options.sourceLessonIndex === "number" ? options.sourceLessonIndex : null;
  state.quizMode = options.mode || (topicId === "final" ? "final" : "topic");
  state.quizIndex = 0;
  state.selected = null;
  state.answers = {};
  state.resultSaved = false;
  const source = options.questions || pickQuizSource(topicId);
  state.activeQuestions = source.map(randomizeQuestion);
  state.quizIds = state.activeQuestions.map((item) => item.id);
  render();
}

function startDailyDrill() {
  startQuiz("daily", {
    mode: "daily",
    sourceTopic: "daily",
    questions: pickWithRecent(fullQuestionBank, DAILY_DRILL_SIZE, "daily")
  });
}

function startReviewMissed() {
  const missed = state.activeQuestions.filter((item) => state.answers[item.id] && !state.answers[item.id].correct);
  if (!missed.length) return;
  startQuiz("review", {
    mode: "review",
    sourceTopic: state.quizSourceTopic || state.topicId,
    sourceLessonIndex: state.quizSourceLessonIndex,
    questions: missed
  });
}

function startFlashCards(topicId = "all") {
  const source = topicId === "saved"
    ? flashCardBank.filter((card) => state.flashSaved[card.id])
    : topicId === "all" ? flashCardBank : flashCardBank.filter((card) => card.topic === topicId);
  state.screen = "flashcards";
  state.flashCards = shuffle(source);
  state.flashIndex = 0;
  state.flashFlipped = false;
  state.flashFilterTopic = topicId;
  render();
}

function flashSubjects() {
  const subjects = [{
    id: "all",
    title: t("All Flash Cards"),
    icon: "cards",
    count: flashCardBank.length
  }];
  const savedCount = flashCardBank.filter((card) => state.flashSaved[card.id]).length;
  if (savedCount) {
    subjects.push({
      id: "saved",
      title: t("Saved Flash Cards"),
      icon: "star",
      count: savedCount
    });
  }
  topics
    .filter((topic) => topic.id !== "exam")
    .forEach((topic) => {
      const count = flashCardBank.filter((card) => card.topic === topic.id).length;
      if (count) subjects.push({ id: topic.id, title: topic.title, icon: topic.icon, count });
    });
  return subjects;
}

function flashSubjectTitle(topicId) {
  if (topicId === "all") return t("All subjects");
  if (topicId === "saved") return t("Saved cards");
  return topicById(topicId)?.title || t("Study");
}

function searchItems(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const results = [];
  topics.forEach((topic) => {
    topic.lessons.forEach((lesson, lessonIndex) => {
      const haystack = [
        lesson.title,
        ...(lesson.body || []),
        lesson.remember || "",
        ...(lesson.sections || []).flatMap((section) => [section.title, ...(section.items || [])])
      ].join(" ").toLowerCase();
      if (haystack.includes(needle)) results.push({ kind: "lesson", topic, lesson, lessonIndex });
    });
  });
  flashCardBank.forEach((card) => {
    const haystack = `${card.term} ${card.definition} ${topicById(card.topic)?.title || ""}`.toLowerCase();
    if (haystack.includes(needle)) results.push({ kind: "flash", card });
  });
  return results.slice(0, 24);
}

function shuffle(items) {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function randomIndex(max) {
  if (window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function pickWithRecent(items, count, scope) {
  const shuffled = shuffle(items);
  const recentKey = `secplus-recent-${scope}`;
  const recent = new Set(load(recentKey, []));
  const fresh = shuffled.filter((item) => !recent.has(item.id));
  const repeats = shuffled.filter((item) => recent.has(item.id));
  const picked = [...fresh, ...repeats].slice(0, count);
  const nextRecent = [...picked.map((item) => item.id), ...recent].slice(0, Math.max(count * 4, 80));
  save(recentKey, nextRecent);
  return picked;
}

function pickQuizSource(topicId) {
  if (topicId === "final") {
    return balancedFinalQuestions();
  }
  if (topicId === "daily") {
    return pickWithRecent(fullQuestionBank, DAILY_DRILL_SIZE, "daily");
  }
  const topicQuestions = fullQuestionBank.filter((item) => item.topic === topicId);
  const limit = Math.min(TOPIC_QUIZ_SIZE, topicQuestions.length);
  const trueFalse = topicQuestions.filter(isTrueFalseQuestion);
  if (trueFalse.length && limit > 1) {
    const required = pickWithRecent(trueFalse, 1, `${topicId}-tf`);
    const rest = pickWithRecent(topicQuestions.filter((item) => !required.some((picked) => picked.id === item.id)), limit - 1, topicId);
    return shuffle([...required, ...rest]);
  }
  return pickWithRecent(topicQuestions, limit, topicId);
}

function balancedFinalQuestions() {
  const picked = [];
  const seen = new Set();
  FINAL_DOMAIN_PLAN.forEach((domain) => {
    const candidates = fullQuestionBank.filter((item) => domain.topics.includes(item.topic) && !seen.has(item.id));
    const selected = pickWithRecent(candidates, domain.count, `final-${domain.id}`);
    selected.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        picked.push(item);
      }
    });
  });
  if (picked.length < FINAL_EXAM_SIZE) {
    const fill = pickWithRecent(fullQuestionBank.filter((item) => !seen.has(item.id)), FINAL_EXAM_SIZE - picked.length, "final-fill");
    fill.forEach((item) => {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        picked.push(item);
      }
    });
  }
  return shuffle(picked).slice(0, FINAL_EXAM_SIZE);
}

function pickFromTopics(topicIds, count) {
  const items = fullQuestionBank.filter((item) => topicIds.includes(item.topic));
  return pickWithRecent(items, count, `topics-${topicIds.join("-")}`);
}

function randomizeQuestion(item) {
  if (isTrueFalseQuestion(item)) return { ...item };
  const originalCorrect = Array.isArray(item.answers) ? item.answers : [item.answer];
  const choices = item.choices.map((text, index) => ({ text, isCorrect: originalCorrect.includes(index) }));
  const shuffledChoices = shuffle(choices);
  const randomized = {
    ...item,
    choices: shuffledChoices.map((choice) => choice.text)
  };
  const correct = shuffledChoices
    .map((choice, index) => choice.isCorrect ? index : -1)
    .filter((index) => index >= 0);
  if (Array.isArray(item.answers)) randomized.answers = correct;
  else randomized.answer = correct[0];
  return randomized;
}

function isTrueFalseQuestion(item) {
  return !Array.isArray(item.answers) && item.choices.length === 2 && item.choices.includes("True") && item.choices.includes("False");
}

function isMultiSelectQuestion(item) {
  return Array.isArray(item.answers);
}

function correctIndexes(item) {
  return isMultiSelectQuestion(item) ? item.answers : [item.answer];
}

function isCorrectIndex(item, index) {
  return correctIndexes(item).includes(index);
}

function sameAnswerSet(selected, correct) {
  const left = [...selected].sort((a, b) => a - b);
  const right = [...correct].sort((a, b) => a - b);
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function serviceHint(choice) {
  const text = choice.toLowerCase();
  const hints = [
    ["mfa", "MFA requires factors from different categories."],
    ["radius", "RADIUS centralizes authentication, authorization, and accounting."],
    ["kerberos", "Kerberos uses tickets for enterprise authentication and SSO."],
    ["hash", "A hash detects change; encryption protects confidentiality."],
    ["certificate", "A certificate binds an identity to a public key."],
    ["ocsp", "OCSP checks certificate revocation status."],
    ["ddos", "DDoS disrupts availability by overwhelming a target."],
    ["arp", "ARP poisoning manipulates IP-to-MAC mappings."],
    ["ssh", "SSH provides encrypted remote administration."],
    ["https", "HTTPS protects web traffic with TLS."],
    ["dmz", "A DMZ separates public-facing services from the trusted LAN."],
    ["ids", "IDS detects and alerts; IPS can block inline."],
    ["ips", "IPS detects and can block malicious inline traffic."],
    ["vpn", "VPNs create encrypted tunnels."],
    ["rfid", "RFID is common for proximity badges and tags."],
    ["mdm", "MDM or UEM manages mobile policy and remote wipe."],
    ["xss", "XSS runs malicious script in a user's browser."],
    ["sql injection", "Prepared statements reduce SQL injection risk."],
    ["ssrf", "SSRF tricks a server into making requests."],
    ["sast", "SAST analyzes source before runtime."],
    ["dast", "DAST tests a running application."],
    ["edr", "EDR provides endpoint detection and response telemetry."],
    ["dlp", "DLP helps prevent sensitive data loss."],
    ["casb", "CASB enforces policy between users and cloud apps."],
    ["warm site", "A warm site is partially prepared but not fully live."],
    ["hot site", "A hot site is ready to operate with minimal delay."],
    ["rto", "RTO is the target time to restore service."],
    ["rpo", "RPO is the acceptable data loss window."],
    ["siem", "SIEM collects and correlates security events."],
    ["soar", "SOAR automates security response playbooks."],
    ["chain of custody", "Chain of custody documents evidence handling."],
    ["sle", "SLE equals asset value times exposure factor."],
    ["ale", "ALE equals SLE times annual rate of occurrence."]
  ];
  return hints.find(([key]) => text.includes(key))?.[1] || "";
}

function markDone() {
  const complete = load("secplus-complete", {});
  complete[`${state.topicId}:${state.lessonIndex}`] = true;
  save("secplus-complete", complete);
}

function wire() {
  document.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = "topic";
      state.topicId = button.dataset.topic;
      render();
    });
  });


  document.querySelectorAll("[data-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = "lesson";
      state.lessonIndex = Number(button.dataset.lesson);
      render();
    });
  });

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = currentQuestion();
      if (state.answers[current.id]) return;
      const index = Number(button.dataset.answer);
      if (isMultiSelectQuestion(current)) {
        const selected = Array.isArray(state.selected) ? [...state.selected] : [];
        state.selected = selected.includes(index)
          ? selected.filter((item) => item !== index)
          : [...selected, index];
      } else {
        state.selected = index;
      }
      render();
    });
  });

  document.querySelectorAll("[data-flash-topic]").forEach((button) => {
    button.addEventListener("click", () => startFlashCards(button.dataset.flashTopic));
  });

  document.querySelectorAll("[data-bookmark-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = "lesson";
      state.topicId = button.dataset.bookmarkTopic;
      state.lessonIndex = Number(button.dataset.bookmarkLesson);
      render();
    });
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", async () => {
      await setLanguage(button.dataset.language);
    });
  });

  document.querySelectorAll("[data-search-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = "lesson";
      state.topicId = button.dataset.searchTopic;
      state.lessonIndex = Number(button.dataset.searchLesson);
      render();
    });
  });

  document.querySelectorAll("[data-search-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = flashCardBank.find((item) => item.id === button.dataset.searchCard);
      if (!card) return;
      state.screen = "flashcards";
      state.flashCards = [card];
      state.flashIndex = 0;
      state.flashFlipped = false;
      state.flashFilterTopic = card.topic;
      render();
    });
  });

  const searchBox = document.getElementById("searchBox");
  if (searchBox) {
    searchBox.addEventListener("input", () => {
      state.searchQuery = searchBox.value;
      const results = document.querySelector(".search-results");
      if (results) results.innerHTML = renderSearchResults(state.searchQuery);
      wireSearchResults();
    });
  }

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => act(button.dataset.action, button.dataset));
  });

  document.querySelectorAll("[data-swipe]").forEach(addSwipe);
}

function wireSearchResults() {
  document.querySelectorAll("[data-search-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = "lesson";
      state.topicId = button.dataset.searchTopic;
      state.lessonIndex = Number(button.dataset.searchLesson);
      render();
    });
  });
  document.querySelectorAll("[data-search-card]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = flashCardBank.find((item) => item.id === button.dataset.searchCard);
      if (!card) return;
      state.screen = "flashcards";
      state.flashCards = [card];
      state.flashIndex = 0;
      state.flashFlipped = false;
      state.flashFilterTopic = card.topic;
      render();
    });
  });
}

function currentQuestion() {
  return state.activeQuestions[state.quizIndex];
}

function act(action, dataset = {}) {
  if (action === "back") return back();
  if (action === "info") return alert("Swipe left or right on lesson and quiz screens. This app stores progress only on this device.");
  if (action === "star") return toggleBookmark();
  if (action === "startFlashCards") return startFlashCards();
  if (action === "startDailyDrill") return startDailyDrill();
  if (action === "startFinalPractice") return startQuiz("final");
  if (action === "openSearch") {
    state.screen = "search";
    state.searchQuery = "";
    return render();
  }
  if (action === "chooseFlashSubject") return chooseFlashSubject();
  if (action === "openFlashTopic") return openFlashTopic();
  if (action === "flipFlashCard") return flipFlashCard();
  if (action === "saveFlashCard") return toggleSaveFlashCard();
  if (action === "shuffleFlashCards") return startFlashCards(state.flashFilterTopic);
  if (action === "prevFlashCard") return moveFlashCard(-1);
  if (action === "nextFlashCard") return moveFlashCard(1);
  if (action === "topicQuiz") {
    const quizTopic = state.topicId === "exam" ? "final" : state.topicId;
    const sourceLessonIndex = dataset.quizSourceLesson !== undefined ? Number(dataset.quizSourceLesson) : state.lessonIndex;
    const options = dataset.quizSourceTopic || state.screen === "lesson"
      ? {
          sourceTopic: dataset.quizSourceTopic || state.topicId,
          sourceLessonIndex
        }
      : {};
    return startQuiz(quizTopic, options);
  }
  if (action === "prevLesson") return moveLesson(-1);
  if (action === "nextLesson") return moveLesson(1);
  if (action === "markDone") {
    markDone();
    return moveLesson(1);
  }
  if (action === "check") return checkAnswer();
  if (action === "showAnswer") return showAnswer();
  if (action === "prevQuestion") return moveQuestion(-1);
  if (action === "nextQuestion") return moveQuestion(1);
  if (action === "reviewMissed") return startReviewMissed();
  if (action === "quizNextLesson") return openQuizNextLesson();
  if (action === "goHome") {
    state.screen = "home";
    return render();
  }
  if (action === "restartQuiz") {
    if (state.quizMode === "daily") return startDailyDrill();
    return startQuiz(state.quizSourceTopic || state.topicId, {
      sourceTopic: state.quizSourceTopic || state.topicId,
      sourceLessonIndex: state.quizSourceLessonIndex
    });
  }
}

function back() {
  if (state.screen === "topic") {
    state.screen = "home";
    return render();
  }
  if (state.screen === "lesson") {
    state.screen = "topic";
    return render();
  }
  if (state.screen === "quiz") {
    state.screen = ["final", "daily", "review"].includes(state.quizMode) ? "home" : "topic";
    return render();
  }
  if (state.screen === "flashcards") {
    state.screen = "home";
    return render();
  }
  if (state.screen === "flashSubjects") {
    state.screen = "flashcards";
    return render();
  }
  if (state.screen === "search") {
    state.screen = "home";
    return render();
  }
}

function toggleBookmark() {
  if (state.screen !== "lesson") return;
  const key = `${state.topicId}:${state.lessonIndex}`;
  if (state.bookmarked[key]) delete state.bookmarked[key];
  else state.bookmarked[key] = true;
  save("secplus-bookmarks", state.bookmarked);
  render();
}

function moveLesson(delta) {
  const topic = topicById(state.topicId);
  const next = state.lessonIndex + delta;
  if (next < 0) {
    state.screen = "topic";
  } else if (next >= topic.lessons.length) {
    startQuiz(state.topicId, {
      sourceTopic: state.topicId,
      sourceLessonIndex: state.lessonIndex
    });
    return;
  } else {
    state.lessonIndex = next;
  }
  render();
}

function checkAnswer() {
  const current = currentQuestion();
  if (!current || state.answers[current.id]) return;
  if (isMultiSelectQuestion(current)) {
    if (!Array.isArray(state.selected) || !state.selected.length) return;
    const selected = [...state.selected].sort((a, b) => a - b);
    state.answers[current.id] = {
      selected,
      correct: sameAnswerSet(selected, current.answers)
    };
  } else {
    if (state.selected === null) return;
    state.answers[current.id] = {
      selected: state.selected,
      correct: state.selected === current.answer
    };
  }
  render();
}

function showAnswer() {
  const current = currentQuestion();
  if (!current || state.answers[current.id]) return;
  if (isMultiSelectQuestion(current)) {
    state.selected = [...current.answers];
    state.answers[current.id] = { selected: [...current.answers], correct: true };
  } else {
    state.selected = current.answer;
    state.answers[current.id] = { selected: current.answer, correct: true };
  }
  render();
}

function moveQuestion(delta) {
  const next = state.quizIndex + delta;
  if (next < 0) return;
  state.quizIndex = next;
  state.selected = null;
  render();
}

function openQuizNextLesson() {
  const target = resultNextLessonTarget();
  if (!target) return;
  state.screen = "lesson";
  state.topicId = target.topicId;
  state.lessonIndex = target.lessonIndex;
  render();
}

function flipFlashCard() {
  state.flashFlipped = !state.flashFlipped;
  render();
}

function toggleSaveFlashCard() {
  const cards = state.flashCards.length ? state.flashCards : flashCardBank;
  const card = cards[state.flashIndex] || cards[0];
  if (!card) return;
  if (state.flashSaved[card.id]) delete state.flashSaved[card.id];
  else state.flashSaved[card.id] = true;
  save("secplus-saved-flashcards", state.flashSaved);
  render();
}

function moveFlashCard(delta) {
  const total = state.flashCards.length || flashCardBank.length;
  state.flashIndex = (state.flashIndex + delta + total) % total;
  state.flashFlipped = false;
  render();
}

function chooseFlashSubject() {
  state.screen = "flashSubjects";
  render();
}

function openFlashTopic() {
  const cards = state.flashCards.length ? state.flashCards : flashCardBank;
  const card = cards[state.flashIndex] || cards[0];
  state.topicId = card.topic;
  state.screen = "topic";
  state.flashFlipped = false;
  render();
}

function addSwipe(node) {
  let startX = 0;
  let startY = 0;
  node.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
  }, { passive: true });
  node.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) < 52 || Math.abs(dx) < Math.abs(dy)) return;
    if (node.dataset.swipe === "lesson") moveLesson(dx < 0 ? 1 : -1);
    if (node.dataset.swipe === "quiz") moveQuestion(dx < 0 ? 1 : -1);
    if (node.dataset.swipe === "flashcards") moveFlashCard(dx < 0 ? 1 : -1);
  }, { passive: true });
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

async function initializeApp() {
  document.documentElement.lang = state.language === "es" ? "es" : "en";
  try {
    await localizeData(state.language);
  } catch (error) {
    state.translationError = error.message || "Translation failed";
    restoreEnglishData();
  }
  render();
}

initializeApp();
