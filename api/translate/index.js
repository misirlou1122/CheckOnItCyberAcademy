"use strict";

const endpoint = (process.env.TRANSLATOR_ENDPOINT || "https://api.cognitive.microsofttranslator.com").trim().replace(/\/+$/, "");
const key = (process.env.TRANSLATOR_KEY || "").trim();
const region = (process.env.TRANSLATOR_REGION || "").trim().toLowerCase();
const protectedTerms = [
  "Check On It Cyber Academy",
  "Security+",
  "CompTIA",
  "CIA",
  "InfoSec",
  "IAM",
  "IdM",
  "MFA",
  "SSO",
  "RBAC",
  "DAC",
  "MAC",
  "ABAC",
  "PAP",
  "CHAP",
  "EAP",
  "RADIUS",
  "TACACS+",
  "Kerberos",
  "PKI",
  "CA",
  "RA",
  "CRL",
  "OCSP",
  "HMAC",
  "DDoS",
  "DoS",
  "DNS",
  "ARP",
  "MAC",
  "HTTPS",
  "LDAPS",
  "SFTP",
  "FTPS",
  "SRTP",
  "SNMPv3",
  "IPSec",
  "DMZ",
  "VLAN",
  "VPN",
  "IDS",
  "IPS",
  "NAT",
  "802.1X",
  "Wi-Fi",
  "WPA3",
  "WEP",
  "RFID",
  "NFC",
  "GPS",
  "MDM",
  "UEM",
  "IoT",
  "XSS",
  "CSRF",
  "SSRF",
  "SQL",
  "XML",
  "LDAP",
  "DLL",
  "OWASP",
  "SAST",
  "DAST",
  "CI/CD",
  "EDR",
  "DLP",
  "TPM",
  "IaaS",
  "PaaS",
  "SaaS",
  "XaaS",
  "CASB",
  "IaC",
  "RAID",
  "UPS",
  "RTO",
  "RPO",
  "MTBF",
  "MTTR",
  "SIEM",
  "SOAR",
  "TTP",
  "IOC",
  "IR",
  "IRP",
  "NIST",
  "ISO",
  "CIS",
  "COBIT",
  "HIPAA",
  "SOX",
  "CCPA",
  "FISMA",
  "PII",
  "SLE",
  "ALE",
  "ARO",
  "IaaS",
  "PaaS",
  "SaaS",
  "CapEx",
  "OpEx",
  "Zero Trust"
].sort((a, b) => b.length - a.length);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function protectTerms(text) {
  return protectedTerms.reduce((result, term) => {
    const pattern = new RegExp(`\\b${escapeRegExp(term)}\\b`, "g");
    return result.replace(pattern, `<span class="notranslate">${term}</span>`);
  }, text);
}

function restoreTerms(text) {
  return text.replace(/<span class="notranslate">(.*?)<\/span>/g, "$1");
}

module.exports = async function translate(context, req) {
  if (!key || !region) {
    context.res = {
      status: 500,
      body: { error: "Translator is not configured." }
    };
    return;
  }

  const texts = Array.isArray(req.body?.texts)
    ? req.body.texts.filter((text) => typeof text === "string" && text.trim()).slice(0, 100)
    : [];
  const to = typeof req.body?.to === "string" ? req.body.to : "es";

  if (!texts.length) {
    context.res = { status: 200, body: { translations: {} } };
    return;
  }

  try {
    const response = await fetch(`${endpoint}/translate?api-version=3.0&to=${encodeURIComponent(to)}&textType=html`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": key,
        "Ocp-Apim-Subscription-Region": region
      },
      body: JSON.stringify(texts.map((text) => ({ Text: protectTerms(text) })))
    });

    if (!response.ok) {
      context.res = {
        status: response.status,
        body: { error: "Translator request failed." }
      };
      return;
    }

    const translated = await response.json();
    const translations = {};
    texts.forEach((text, index) => {
      translations[text] = restoreTerms(translated[index]?.translations?.[0]?.text || text);
    });

    context.res = {
      status: 200,
      headers: { "Cache-Control": "public, max-age=86400" },
      body: { translations }
    };
  } catch (error) {
    context.log(error);
    context.res = {
      status: 500,
      body: { error: "Translator request failed." }
    };
  }
};
