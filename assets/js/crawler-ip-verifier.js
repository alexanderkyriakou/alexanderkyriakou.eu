/*
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://alexanderkyriakou.eu/assets/licenses/CPAL-1-0.txt. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is the Crawler IP Verifier, including its input parsing, IP address and CIDR matching, user-agent interpretation, evidence assessment, filtering and export logic, dedicated HTML, CSS and JavaScript interface code, and project-specific dataset publishing and DNS verification code identified as part of this project, originally published at https://alexanderkyriakou.eu/ak/crawler-ip-verifier.
 *
 * The Original Developer is not the Initial Developer and is __________. If left blank, the Original Developer is the Initial Developer.
 *
 * The Initial Developer of the Original Code is Alexander Kyriakou. All portions of the code written by Alexander Kyriakou are Copyright (c) 2026 Alexander Kyriakou. All Rights Reserved.
 *
 * Contributor ______________________.
 *
 * No alternative license is offered by the Initial Developer for the Original Code under this source notice.
 *
 * Section 14 Attribution Information (Exhibit B):
 * Attribution Copyright Notice: Copyright (c) 2026 Alexander Kyriakou.
 * Attribution Phrase (not exceeding 10 words): Based on the Crawler IP Verifier by Alexander Kyriakou
 * Attribution URL: https://alexanderkyriakou.eu/ak/crawler-ip-verifier
 * Graphic Image as provided in the Covered Code, if any: None.
 * Display of Attribution Information is required in Larger Works which are defined in the CPAL as a work which combines Covered Code or portions thereof with code not governed by the terms of the CPAL.
 *
 * SPDX-License-Identifier: CPAL-1.0
 */
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ipaddr.js/lib/ipaddr.js
var require_ipaddr = __commonJS({
  "node_modules/ipaddr.js/lib/ipaddr.js"(exports, module) {
    (function(root) {
      "use strict";
      const ipv4Part = "(0?\\d+|0x[a-f0-9]+)";
      const ipv4Regexes = {
        fourOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        threeOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}$`, "i"),
        twoOctet: new RegExp(`^${ipv4Part}\\.${ipv4Part}$`, "i"),
        longValue: new RegExp(`^${ipv4Part}$`, "i")
      };
      const octalRegex = new RegExp(`^0[0-7]+$`, "i");
      const hexRegex = new RegExp(`^0x[a-f0-9]+$`, "i");
      const zoneIndex = "%[0-9a-z]{1,}";
      const ipv6Part = "(?:[0-9a-f]+::?)+";
      const ipv6Regexes = {
        zoneIndex: new RegExp(zoneIndex, "i"),
        "native": new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, "i"),
        deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?)$`, "i"),
        transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}\\.${ipv4Part}(${zoneIndex})?$`, "i")
      };
      function expandIPv6(string, parts) {
        if (string.indexOf("::") !== string.lastIndexOf("::")) {
          return null;
        }
        let colonCount = 0;
        let lastColon = -1;
        let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];
        let replacement, replacementCount;
        if (zoneId) {
          zoneId = zoneId.substring(1);
          string = string.replace(/%.+$/, "");
        }
        while ((lastColon = string.indexOf(":", lastColon + 1)) >= 0) {
          colonCount++;
        }
        if (string.substr(0, 2) === "::") {
          colonCount--;
        }
        if (string.substr(-2, 2) === "::") {
          colonCount--;
        }
        if (colonCount >= parts) {
          return null;
        }
        replacementCount = parts - colonCount;
        replacement = ":";
        while (replacementCount--) {
          replacement += "0:";
        }
        string = string.replace("::", replacement);
        if (string[0] === ":") {
          string = string.slice(1);
        }
        if (string[string.length - 1] === ":") {
          string = string.slice(0, -1);
        }
        parts = (function() {
          const ref = string.split(":");
          const results = [];
          for (let i = 0; i < ref.length; i++) {
            results.push(ref[i].length > 4 ? NaN : parseInt(ref[i], 16));
          }
          return results;
        })();
        return {
          parts,
          zoneId
        };
      }
      function matchCIDR(first, second, partSize, cidrBits) {
        if (first.length !== second.length) {
          throw new Error("ipaddr: cannot match CIDR for objects with different lengths");
        }
        let part = 0;
        let shift;
        while (cidrBits > 0) {
          shift = partSize - cidrBits;
          if (shift < 0) {
            shift = 0;
          }
          if (first[part] >> shift !== second[part] >> shift) {
            return false;
          }
          cidrBits -= partSize;
          part += 1;
        }
        return true;
      }
      function parseIntAuto(string) {
        if (hexRegex.test(string)) {
          return parseInt(string, 16);
        }
        if (string[0] === "0" && !isNaN(parseInt(string[1], 10))) {
          if (octalRegex.test(string)) {
            return parseInt(string, 8);
          }
          throw new Error(`ipaddr: cannot parse ${string} as octal`);
        }
        return parseInt(string, 10);
      }
      function padPart(part, length) {
        while (part.length < length) {
          part = `0${part}`;
        }
        return part;
      }
      const ipaddr2 = {};
      ipaddr2.IPv4 = (function() {
        function IPv4(octets) {
          if (octets.length !== 4) {
            throw new Error("ipaddr: ipv4 octet count should be 4");
          }
          let i, octet;
          for (i = 0; i < octets.length; i++) {
            octet = octets[i];
            if (!(0 <= octet && octet <= 255)) {
              throw new Error("ipaddr: ipv4 octet should fit in 8 bits");
            }
          }
          this.octets = octets;
        }
        IPv4.prototype.SpecialRanges = {
          unspecified: [[new IPv4([0, 0, 0, 0]), 8]],
          broadcast: [[new IPv4([255, 255, 255, 255]), 32]],
          // RFC3171
          multicast: [[new IPv4([224, 0, 0, 0]), 4]],
          // RFC3927
          linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],
          // RFC5735
          loopback: [[new IPv4([127, 0, 0, 0]), 8]],
          // RFC6598
          carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],
          // RFC1918
          "private": [
            [new IPv4([10, 0, 0, 0]), 8],
            [new IPv4([172, 16, 0, 0]), 12],
            [new IPv4([192, 168, 0, 0]), 16]
          ],
          // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700
          reserved: [
            [new IPv4([192, 0, 0, 0]), 24],
            [new IPv4([192, 0, 2, 0]), 24],
            [new IPv4([192, 88, 99, 0]), 24],
            [new IPv4([198, 18, 0, 0]), 15],
            [new IPv4([198, 51, 100, 0]), 24],
            [new IPv4([203, 0, 113, 0]), 24],
            [new IPv4([240, 0, 0, 0]), 4]
          ],
          // RFC7534, RFC7535
          as112: [
            [new IPv4([192, 175, 48, 0]), 24],
            [new IPv4([192, 31, 196, 0]), 24]
          ],
          // RFC7450
          amt: [
            [new IPv4([192, 52, 193, 0]), 24]
          ]
        };
        IPv4.prototype.kind = function() {
          return "ipv4";
        };
        IPv4.prototype.match = function(other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv4") {
            throw new Error("ipaddr: cannot match ipv4 address with non-ipv4 one");
          }
          return matchCIDR(this.octets, other.octets, 8, cidrRange);
        };
        IPv4.prototype.prefixLengthFromSubnetMask = function() {
          let cidr = 0;
          let stop2 = false;
          const zerotable = {
            0: 8,
            128: 7,
            192: 6,
            224: 5,
            240: 4,
            248: 3,
            252: 2,
            254: 1,
            255: 0
          };
          let i, octet, zeros;
          for (i = 3; i >= 0; i -= 1) {
            octet = this.octets[i];
            if (octet in zerotable) {
              zeros = zerotable[octet];
              if (stop2 && zeros !== 0) {
                return null;
              }
              if (zeros !== 8) {
                stop2 = true;
              }
              cidr += zeros;
            } else {
              return null;
            }
          }
          return 32 - cidr;
        };
        IPv4.prototype.range = function() {
          return ipaddr2.subnetMatch(this, this.SpecialRanges);
        };
        IPv4.prototype.toByteArray = function() {
          return this.octets.slice(0);
        };
        IPv4.prototype.toIPv4MappedAddress = function() {
          return ipaddr2.IPv6.parse(`::ffff:${this.toString()}`);
        };
        IPv4.prototype.toNormalizedString = function() {
          return this.toString();
        };
        IPv4.prototype.toString = function() {
          return this.octets.join(".");
        };
        return IPv4;
      })();
      ipaddr2.IPv4.broadcastAddressFromCIDR = function(string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 4) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
        }
      };
      ipaddr2.IPv4.isIPv4 = function(string) {
        return this.parser(string) !== null;
      };
      ipaddr2.IPv4.isValid = function(string) {
        try {
          new this(this.parser(string));
          return true;
        } catch {
          return false;
        }
      };
      ipaddr2.IPv4.isValidCIDR = function(string) {
        try {
          this.parseCIDR(string);
          return true;
        } catch {
          return false;
        }
      };
      ipaddr2.IPv4.isValidFourPartDecimal = function(string) {
        if (ipaddr2.IPv4.isValid(string) && string.match(/^(0|[1-9]\d*)(\.(0|[1-9]\d*)){3}$/)) {
          return true;
        } else {
          return false;
        }
      };
      ipaddr2.IPv4.isValidCIDRFourPartDecimal = function(string) {
        const match = string.match(/^(.+)\/(\d+)$/);
        if (!ipaddr2.IPv4.isValidCIDR(string) || !match) {
          return false;
        }
        return ipaddr2.IPv4.isValidFourPartDecimal(match[1]);
      };
      ipaddr2.IPv4.networkAddressFromCIDR = function(string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 4) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv4 CIDR format", { cause: e });
        }
      };
      ipaddr2.IPv4.parse = function(string) {
        const parts = this.parser(string);
        if (parts === null) {
          throw new Error("ipaddr: string is not formatted like an IPv4 Address");
        }
        return new this(parts);
      };
      ipaddr2.IPv4.parseCIDR = function(string) {
        let match;
        if (match = string.match(/^(.+)\/(\d+)$/)) {
          const maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 32) {
            const parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function() {
                return this.join("/");
              }
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv4 CIDR range");
      };
      ipaddr2.IPv4.parser = function(string) {
        let match, part, value;
        if (match = string.match(ipv4Regexes.fourOctet)) {
          return (function() {
            const ref = match.slice(1, 6);
            const results = [];
            for (let i = 0; i < ref.length; i++) {
              part = ref[i];
              results.push(parseIntAuto(part));
            }
            return results;
          })();
        } else if (match = string.match(ipv4Regexes.longValue)) {
          value = parseIntAuto(match[1]);
          if (value > 4294967295 || value < 0) {
            throw new Error("ipaddr: address outside defined range");
          }
          return (function() {
            const results = [];
            let shift;
            for (shift = 0; shift <= 24; shift += 8) {
              results.push(value >> shift & 255);
            }
            return results;
          })().reverse();
        } else if (match = string.match(ipv4Regexes.twoOctet)) {
          return (function() {
            const ref = match.slice(1, 4);
            const results = [];
            value = parseIntAuto(ref[1]);
            if (value > 16777215 || value < 0) {
              throw new Error("ipaddr: address outside defined range");
            }
            results.push(parseIntAuto(ref[0]));
            results.push(value >> 16 & 255);
            results.push(value >> 8 & 255);
            results.push(value & 255);
            return results;
          })();
        } else if (match = string.match(ipv4Regexes.threeOctet)) {
          return (function() {
            const ref = match.slice(1, 5);
            const results = [];
            value = parseIntAuto(ref[2]);
            if (value > 65535 || value < 0) {
              throw new Error("ipaddr: address outside defined range");
            }
            results.push(parseIntAuto(ref[0]));
            results.push(parseIntAuto(ref[1]));
            results.push(value >> 8 & 255);
            results.push(value & 255);
            return results;
          })();
        } else {
          return null;
        }
      };
      ipaddr2.IPv4.subnetMaskFromPrefixLength = function(prefix) {
        prefix = parseInt(prefix);
        if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) {
          throw new Error("ipaddr: invalid IPv4 prefix length");
        }
        const octets = [0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 4) {
          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
        }
        return new this(octets);
      };
      ipaddr2.IPv6 = (function() {
        function IPv6(parts, zoneId) {
          let i, part;
          if (parts.length === 16) {
            this.parts = [];
            for (i = 0; i <= 14; i += 2) {
              this.parts.push(parts[i] << 8 | parts[i + 1]);
            }
          } else if (parts.length === 8) {
            this.parts = parts;
          } else {
            throw new Error("ipaddr: ipv6 part count should be 8 or 16");
          }
          for (i = 0; i < this.parts.length; i++) {
            part = this.parts[i];
            if (!(0 <= part && part <= 65535)) {
              throw new Error("ipaddr: ipv6 part should fit in 16 bits");
            }
          }
          if (zoneId) {
            this.zoneId = zoneId;
          }
        }
        IPv6.prototype.SpecialRanges = {
          // RFC4291, here and after
          unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],
          linkLocal: [new IPv6([65152, 0, 0, 0, 0, 0, 0, 0]), 10],
          multicast: [new IPv6([65280, 0, 0, 0, 0, 0, 0, 0]), 8],
          loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],
          uniqueLocal: [new IPv6([64512, 0, 0, 0, 0, 0, 0, 0]), 7],
          ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 65535, 0, 0]), 96],
          // RFC3879
          deprecatedSiteLocal: [new IPv6([65216, 0, 0, 0, 0, 0, 0, 0]), 10],
          // RFC6666
          discard: [new IPv6([256, 0, 0, 0, 0, 0, 0, 0]), 64],
          // RFC6145
          rfc6145: [new IPv6([0, 0, 0, 0, 65535, 0, 0, 0]), 96],
          rfc6052: [
            // RFC6052
            [new IPv6([100, 65435, 0, 0, 0, 0, 0, 0]), 96],
            // RFC8215
            [new IPv6([100, 65435, 1, 0, 0, 0, 0, 0]), 48]
          ],
          // RFC3056
          "6to4": [new IPv6([8194, 0, 0, 0, 0, 0, 0, 0]), 16],
          // RFC6052, RFC6146
          teredo: [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 32],
          // RFC5180
          benchmarking: [new IPv6([8193, 2, 0, 0, 0, 0, 0, 0]), 48],
          // RFC7450
          amt: [new IPv6([8193, 3, 0, 0, 0, 0, 0, 0]), 32],
          as112v6: [
            // RFC7535
            [new IPv6([8193, 4, 274, 0, 0, 0, 0, 0]), 48],
            // RFC7534
            [new IPv6([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]
          ],
          // RFC4843
          deprecatedOrchid: [new IPv6([8193, 16, 0, 0, 0, 0, 0, 0]), 28],
          // RFC7343
          orchid2: [new IPv6([8193, 32, 0, 0, 0, 0, 0, 0]), 28],
          // RFC9374
          droneRemoteIdProtocolEntityTags: [new IPv6([8193, 48, 0, 0, 0, 0, 0, 0]), 28],
          // RFC9602
          segmentRouting: [new IPv6([24320, 0, 0, 0, 0, 0, 0, 0]), 16],
          reserved: [
            // RFC3849
            [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 23],
            // RFC2928
            [new IPv6([8193, 3512, 0, 0, 0, 0, 0, 0]), 32],
            // RFC9637
            [new IPv6([16383, 0, 0, 0, 0, 0, 0, 0]), 20]
          ]
        };
        IPv6.prototype.isIPv4MappedAddress = function() {
          return this.range() === "ipv4Mapped";
        };
        IPv6.prototype.kind = function() {
          return "ipv6";
        };
        IPv6.prototype.match = function(other, cidrRange) {
          let ref;
          if (cidrRange === void 0) {
            ref = other;
            other = ref[0];
            cidrRange = ref[1];
          }
          if (other.kind() !== "ipv6") {
            throw new Error("ipaddr: cannot match ipv6 address with non-ipv6 one");
          }
          return matchCIDR(this.parts, other.parts, 16, cidrRange);
        };
        IPv6.prototype.prefixLengthFromSubnetMask = function() {
          let cidr = 0;
          let stop2 = false;
          const zerotable = {
            0: 16,
            32768: 15,
            49152: 14,
            57344: 13,
            61440: 12,
            63488: 11,
            64512: 10,
            65024: 9,
            65280: 8,
            65408: 7,
            65472: 6,
            65504: 5,
            65520: 4,
            65528: 3,
            65532: 2,
            65534: 1,
            65535: 0
          };
          let part, zeros;
          for (let i = 7; i >= 0; i -= 1) {
            part = this.parts[i];
            if (part in zerotable) {
              zeros = zerotable[part];
              if (stop2 && zeros !== 0) {
                return null;
              }
              if (zeros !== 16) {
                stop2 = true;
              }
              cidr += zeros;
            } else {
              return null;
            }
          }
          return 128 - cidr;
        };
        IPv6.prototype.range = function() {
          return ipaddr2.subnetMatch(this, this.SpecialRanges);
        };
        IPv6.prototype.toByteArray = function() {
          let part;
          const bytes = [];
          const ref = this.parts;
          for (let i = 0; i < ref.length; i++) {
            part = ref[i];
            bytes.push(part >> 8);
            bytes.push(part & 255);
          }
          return bytes;
        };
        IPv6.prototype.toFixedLengthString = function() {
          const addr = (function() {
            const results = [];
            for (let i = 0; i < this.parts.length; i++) {
              results.push(padPart(this.parts[i].toString(16), 4));
            }
            return results;
          }).call(this).join(":");
          let suffix = "";
          if (this.zoneId) {
            suffix = `%${this.zoneId}`;
          }
          return addr + suffix;
        };
        IPv6.prototype.toIPv4Address = function() {
          if (!this.isIPv4MappedAddress()) {
            throw new Error("ipaddr: trying to convert a generic ipv6 address to ipv4");
          }
          const ref = this.parts.slice(-2);
          const high = ref[0];
          const low = ref[1];
          return new ipaddr2.IPv4([high >> 8, high & 255, low >> 8, low & 255]);
        };
        IPv6.prototype.toNormalizedString = function() {
          const addr = (function() {
            const results = [];
            for (let i = 0; i < this.parts.length; i++) {
              results.push(this.parts[i].toString(16));
            }
            return results;
          }).call(this).join(":");
          let suffix = "";
          if (this.zoneId) {
            suffix = `%${this.zoneId}`;
          }
          return addr + suffix;
        };
        IPv6.prototype.toRFC5952String = function() {
          const regex = /((^|:)(0(:|$)){2,})/g;
          let suffix = "";
          if (this.zoneId) {
            suffix = `%${this.zoneId}`;
          }
          const normalized = this.toNormalizedString();
          const string = normalized.slice(0, normalized.length - suffix.length);
          let bestMatchIndex = 0;
          let bestMatchLength = -1;
          let bestMatchGroups = -1;
          let match;
          while (match = regex.exec(string)) {
            const groups = (match[0].match(/0/g) || []).length;
            if (groups > bestMatchGroups) {
              bestMatchGroups = groups;
              bestMatchIndex = match.index;
              bestMatchLength = match[0].length;
            }
          }
          if (bestMatchLength < 0) {
            return string + suffix;
          }
          return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}${suffix}`;
        };
        IPv6.prototype.toString = function() {
          return this.toRFC5952String();
        };
        return IPv6;
      })();
      ipaddr2.IPv6.broadcastAddressFromCIDR = function(string) {
        try {
          const cidr = this.parseCIDR(string);
          const ipInterfaceOctets = cidr[0].toByteArray();
          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          const octets = [];
          let i = 0;
          while (i < 16) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
        }
      };
      ipaddr2.IPv6.isIPv6 = function(string) {
        return this.parser(string) !== null;
      };
      ipaddr2.IPv6.isValid = function(string) {
        if (typeof string === "string" && string.indexOf(":") === -1) {
          return false;
        }
        try {
          const addr = this.parser(string);
          new this(addr.parts, addr.zoneId);
          return true;
        } catch {
          return false;
        }
      };
      ipaddr2.IPv6.isValidCIDR = function(string) {
        if (typeof string === "string" && string.indexOf(":") === -1) {
          return false;
        }
        try {
          this.parseCIDR(string);
          return true;
        } catch {
          return false;
        }
      };
      ipaddr2.IPv6.networkAddressFromCIDR = function(string) {
        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;
        try {
          cidr = this.parseCIDR(string);
          ipInterfaceOctets = cidr[0].toByteArray();
          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();
          octets = [];
          i = 0;
          while (i < 16) {
            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));
            i++;
          }
          return new this(octets);
        } catch (e) {
          throw new Error("ipaddr: the address does not have IPv6 CIDR format", { cause: e });
        }
      };
      ipaddr2.IPv6.parse = function(string) {
        const addr = this.parser(string);
        if (addr === null) {
          throw new Error("ipaddr: string is not formatted like an IPv6 Address");
        }
        return new this(addr.parts, addr.zoneId);
      };
      ipaddr2.IPv6.parseCIDR = function(string) {
        let maskLength, match, parsed;
        if (match = string.match(/^(.+)\/(\d+)$/)) {
          maskLength = parseInt(match[2]);
          if (maskLength >= 0 && maskLength <= 128) {
            parsed = [this.parse(match[1]), maskLength];
            Object.defineProperty(parsed, "toString", {
              value: function() {
                return this.join("/");
              }
            });
            return parsed;
          }
        }
        throw new Error("ipaddr: string is not formatted like an IPv6 CIDR range");
      };
      ipaddr2.IPv6.parser = function(string) {
        let addr, i, match, octet, octets, zoneId;
        if (match = string.match(ipv6Regexes.deprecatedTransitional)) {
          return this.parser(`::ffff:${match[1]}`);
        }
        if (ipv6Regexes.native.test(string)) {
          return expandIPv6(string, 8);
        }
        if (match = string.match(ipv6Regexes.transitional)) {
          zoneId = match[6] || "";
          addr = match[1];
          if (!match[1].endsWith("::")) {
            addr = addr.slice(0, -1);
          }
          addr = expandIPv6(addr + zoneId, 6);
          if (addr && addr.parts) {
            octets = [
              parseInt(match[2]),
              parseInt(match[3]),
              parseInt(match[4]),
              parseInt(match[5])
            ];
            for (i = 0; i < octets.length; i++) {
              octet = octets[i];
              if (!(0 <= octet && octet <= 255)) {
                return null;
              }
            }
            addr.parts.push(octets[0] << 8 | octets[1]);
            addr.parts.push(octets[2] << 8 | octets[3]);
            return {
              parts: addr.parts,
              zoneId: addr.zoneId
            };
          }
        }
        return null;
      };
      ipaddr2.IPv6.subnetMaskFromPrefixLength = function(prefix) {
        prefix = parseInt(prefix);
        if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) {
          throw new Error("ipaddr: invalid IPv6 prefix length");
        }
        const octets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        let j = 0;
        const filledOctetCount = Math.floor(prefix / 8);
        while (j < filledOctetCount) {
          octets[j] = 255;
          j++;
        }
        if (filledOctetCount < 16) {
          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;
        }
        return new this(octets);
      };
      ipaddr2.fromByteArray = function(bytes) {
        const length = bytes.length;
        if (length === 4) {
          return new ipaddr2.IPv4(bytes);
        } else if (length === 16) {
          return new ipaddr2.IPv6(bytes);
        } else {
          throw new Error("ipaddr: the binary input is neither an IPv6 nor IPv4 address");
        }
      };
      ipaddr2.isValid = function(string) {
        return ipaddr2.IPv6.isValid(string) || ipaddr2.IPv4.isValid(string);
      };
      ipaddr2.isValidCIDR = function(string) {
        return ipaddr2.IPv6.isValidCIDR(string) || ipaddr2.IPv4.isValidCIDR(string);
      };
      ipaddr2.parse = function(string) {
        if (ipaddr2.IPv6.isValid(string)) {
          return ipaddr2.IPv6.parse(string);
        } else if (ipaddr2.IPv4.isValid(string)) {
          return ipaddr2.IPv4.parse(string);
        } else {
          throw new Error("ipaddr: the address has neither IPv6 nor IPv4 format");
        }
      };
      ipaddr2.parseCIDR = function(string) {
        try {
          return ipaddr2.IPv6.parseCIDR(string);
        } catch {
          try {
            return ipaddr2.IPv4.parseCIDR(string);
          } catch (e) {
            throw new Error("ipaddr: the address has neither IPv6 nor IPv4 CIDR format", { cause: e });
          }
        }
      };
      ipaddr2.process = function(string) {
        const addr = this.parse(string);
        if (addr.kind() === "ipv6" && addr.isIPv4MappedAddress()) {
          return addr.toIPv4Address();
        } else {
          return addr;
        }
      };
      ipaddr2.subnetMatch = function(address, rangeList, defaultName) {
        let i, rangeName, rangeSubnets, subnet;
        if (defaultName === void 0 || defaultName === null) {
          defaultName = "unicast";
        }
        for (rangeName in rangeList) {
          if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {
            rangeSubnets = rangeList[rangeName];
            if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {
              rangeSubnets = [rangeSubnets];
            }
            for (i = 0; i < rangeSubnets.length; i++) {
              subnet = rangeSubnets[i];
              if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) {
                return rangeName;
              }
            }
          }
        }
        return defaultName;
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = ipaddr2;
      } else {
        root.ipaddr = ipaddr2;
      }
    })(exports);
  }
});

// web/src/ip/address.js
var import_ipaddr = __toESM(require_ipaddr(), 1);
var addresses = /* @__PURE__ */ new WeakSet();
var networks = /* @__PURE__ */ new WeakSet();
var decimalV4 = /^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/;
var AddressError = class extends TypeError {
  constructor(code, message) {
    super(message);
    this.name = "AddressError";
    this.code = code;
  }
};
function fromLibrary(parsed) {
  const family = parsed.kind() === "ipv4" ? 4 : 6;
  const isIPv4Mapped = family === 6 && parsed.isIPv4MappedAddress();
  const embeddedIPv4 = isIPv4Mapped ? parsed.toIPv4Address().toString() : null;
  const normalized = isIPv4Mapped ? `::ffff:${embeddedIPv4}` : parsed.toString();
  const address = Object.freeze({
    family,
    bits: family === 4 ? 32 : 128,
    normalized,
    value: parsed.toByteArray().reduce((value, byte) => value << 8n | BigInt(byte), 0n),
    key: `${family}:${normalized}`,
    isIPv4Mapped,
    embeddedIPv4
  });
  addresses.add(address);
  return address;
}
function parseIP(input) {
  if (addresses.has(input)) return input;
  if (typeof input !== "string" || input.length === 0 || input.length > 45 || !/^[0-9a-fA-F:.]+$/.test(input)) {
    throw new AddressError("invalid-ip", "Supply an IPv4 or IPv6 address literal without a port, zone ID, or whitespace.");
  }
  const hasColon = input.includes(":");
  if (!hasColon && !decimalV4.test(input) || hasColon && input.includes(".") && !decimalV4.test(input.slice(input.lastIndexOf(":") + 1))) {
    throw new AddressError("invalid-ip", "IPv4 components must use four decimal octets without leading zeros.");
  }
  let literal = input;
  if (hasColon && input.includes(".")) {
    const boundary = input.lastIndexOf(":") + 1;
    const octets = input.slice(boundary).split(".").map(Number);
    if (octets.some((octet) => octet > 255)) {
      throw new AddressError("invalid-ip", "An embedded IPv4 octet exceeds 255.");
    }
    literal = input.slice(0, boundary) + `${(octets[0] << 8 | octets[1]).toString(16)}:${(octets[2] << 8 | octets[3]).toString(16)}`;
  }
  try {
    const parsed = import_ipaddr.default.parse(literal);
    if (hasColon !== (parsed.kind() === "ipv6")) throw new Error("Address family changed");
    return fromLibrary(parsed);
  } catch {
    throw new AddressError("invalid-ip", "The address is not a valid IPv4 or IPv6 literal.");
  }
}
function formatIP(value, family) {
  if (![4, 6].includes(family) || typeof value !== "bigint" || value < 0n || value >= 1n << BigInt(family === 4 ? 32 : 128)) {
    throw new AddressError("invalid-value", "The integer must fit the specified address family.");
  }
  const bytes = Array(family === 4 ? 4 : 16);
  for (let i = bytes.length - 1; i >= 0; i--) {
    bytes[i] = Number(value & 255n);
    value >>= 8n;
  }
  return fromLibrary(import_ipaddr.default.fromByteArray(bytes)).normalized;
}
function parseCIDR(input, { strict = true } = {}) {
  if (networks.has(input)) return input;
  if (typeof input !== "string" || input.length > 49) {
    throw new AddressError("invalid-cidr", "A CIDR must be a bounded address/prefix string.");
  }
  const parts = input.split("/");
  if (parts.length !== 2 || !/^(0|[1-9]\d{0,2})$/.test(parts[1])) {
    throw new AddressError("invalid-prefix", "Use an IP address followed by an integer prefix length.");
  }
  const address = parseIP(parts[0]);
  const prefixLength = Number(parts[1]);
  if (prefixLength > address.bits) {
    throw new AddressError("invalid-prefix", "The prefix length exceeds the address-family width.");
  }
  const hostBits = BigInt(address.bits - prefixLength);
  const network = address.value >> hostBits << hostBits;
  if (strict && address.value !== network) {
    throw new AddressError("host-bits-set", "The CIDR contains host bits; supply the network address.");
  }
  const parsed = Object.freeze({
    family: address.family,
    bits: address.bits,
    prefixLength,
    network,
    last: network | (1n << hostBits) - 1n,
    canonical: `${formatIP(network, address.family)}/${prefixLength}`
  });
  networks.add(parsed);
  return parsed;
}

// web/src/identity/timestamps.js
var months = new Map(["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((name, i) => [name.toLowerCase(), i + 1]));

// web/src/import/limits.js
var DEFAULT_LIMITS = Object.freeze({
  rawBytes: 10 * 1024 * 1024,
  rows: 2e4,
  userAgentLength: 8192,
  recordLength: 32768,
  distinctIPs: 1e4,
  columns: 64
});
var ImportError = class extends Error {
  constructor(code, message, reference = null) {
    super(message);
    this.name = "ImportError";
    this.code = code;
    this.reference = reference;
  }
};

// web/src/import/records.js
function delimitedRecords(text, delimiter, limits) {
  const records = [];
  let fields2 = [], field = "", state = "start", line = 1, startLine = 1, start3 = 0, blankRows = 0;
  const finishField = () => {
    fields2.push(field);
    field = "";
    state = "start";
    if (fields2.length > limits.columns) throw new ImportError("column-limit", `At most ${limits.columns} columns are supported.`, { line });
  };
  const finishRecord = (end) => {
    const rawRecord = text.slice(start3, end);
    if (rawRecord.length > limits.recordLength) throw new ImportError("record-limit", `A record exceeds ${limits.recordLength} characters.`, { line: startLine });
    if (rawRecord.trim()) records.push({ fields: fields2, rawRecord, lineStart: startLine, lineEnd: line });
    else blankRows++;
    fields2 = [];
    if (records.length > limits.rows + 1) throw new ImportError("row-limit", `At most ${limits.rows} data rows are supported. Filter or split the input.`);
  };
  for (let i = 0; i < text.length; i++) {
    if (i - start3 > limits.recordLength) throw new ImportError("record-limit", `A record exceeds ${limits.recordLength} characters.`, { line: startLine });
    const char = text[i];
    const newline = char === "\r" || char === "\n";
    if (state === "quoted") {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else state = "closed";
      } else {
        field += char;
        if (newline) {
          if (char === "\r" && text[i + 1] === "\n") field += text[++i];
          line++;
        }
      }
      continue;
    }
    if (char === delimiter) {
      finishField();
      continue;
    }
    if (newline) {
      finishField();
      finishRecord(i);
      if (char === "\r" && text[i + 1] === "\n") i++;
      line++;
      startLine = line;
      start3 = i + 1;
      continue;
    }
    if (state === "closed" || char === '"' && state !== "start") {
      throw new ImportError("malformed-delimited", "A quote is misplaced. Use double quotes around fields and double an embedded quote.", { line });
    }
    if (char === '"') state = "quoted";
    else {
      field += char;
      state = "plain";
    }
  }
  if (state === "quoted") throw new ImportError("malformed-delimited", "A quoted field is not closed. No partial import was accepted.", { line: startLine });
  if (start3 < text.length) {
    finishField();
    finishRecord(text.length);
  }
  return { records, blankRows, physicalLines: text.length ? line - (start3 === text.length ? 1 : 0) : 0 };
}

// web/src/import/http-status.js
function responseStatusLabel(code) {
  return code === null || code === "missing" ? "Not supplied" : code === "0" ? "0 \u2014 No response" : code === "unrecognized" ? "Unrecognized value" : code;
}

// web/src/import/parse.js
var SIMPLE_FIELDS = ["ip", "userAgent", "status"];
var normalizeHeader = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
var forwardedColumn = (name) => /(?:forwarded|trueclient)/i.test(normalizeHeader(name));

// web/templates/crawler-import.csv
var crawler_import_default = "ClientIP,ClientRequestUserAgent\n66.249.64.1,Googlebot/2.1\n104.208.184.198,ChatGPT-User\n1.1.1.1,\n";

// data/source-registry.json
var source_registry_default = {
  schemaVersion: 1,
  auditedOn: "2026-10-20",
  sources: [
    {
      id: "google-common",
      provider: {
        id: "google",
        name: "Google"
      },
      scope: "provider-category",
      category: "common-crawlers",
      purpose: "Search indexing, product-specific crawling and analysis.",
      identities: [
        {
          id: "googlebot",
          name: "Googlebot",
          httpTokens: [
            "Googlebot"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "googlebot-image",
          name: "Googlebot-Image",
          httpTokens: [
            "Googlebot-Image"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "googlebot-video",
          name: "Googlebot-Video",
          httpTokens: [
            "Googlebot-Video"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "storebot-google",
          name: "Storebot-Google",
          httpTokens: [
            "Storebot-Google"
          ],
          purposes: [
            "advertising-related-crawling"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "google-inspectiontool",
          name: "Google-InspectionTool",
          httpTokens: [
            "Google-InspectionTool"
          ],
          purposes: [
            "site-verification"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "googleother",
          name: "GoogleOther",
          httpTokens: [
            "GoogleOther"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "googleother-image",
          name: "GoogleOther-Image",
          httpTokens: [
            "GoogleOther-Image"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "googleother-video",
          name: "GoogleOther-Video",
          httpTokens: [
            "GoogleOther-Video"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        },
        {
          id: "google-cloudvertexbot",
          name: "Google-CloudVertexBot",
          httpTokens: [
            "Google-CloudVertexBot"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
        }
      ],
      documentationUrls: [
        "https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers"
      ],
      limitations: [
        "Shared category ranges do not establish an exact Googlebot subtype.",
        "Googlebot-News and Google-Extended are not separate HTTP identities; Google-Extended is a robots control token.",
        "Documentation says common crawlers generally use these ranges, not a guarantee of exhaustive coverage for negative verdicts."
      ],
      feedUrl: "https://developers.google.com/static/crawling/ipranges/common-crawlers.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:12:17.573988Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/google-common.json",
        fixtureSha256: "c1d5617bbadb9e1a13174744848bde0de543f634d5cfda3ff0383d2f8ab00b88",
        publisherTimestampRaw: "2026-10-20T14:46:18.000000",
        rangeCounts: {
          ipv4: 170,
          ipv6: 147
        },
        bytes: 21768
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "google-special",
      provider: {
        id: "google",
        name: "Google"
      },
      scope: "provider-category",
      category: "special-case-crawlers",
      purpose: "Product-specific and agreed crawling, including advertising and safety functions.",
      identities: [
        {
          id: "adsbot-google",
          name: "AdsBot-Google",
          httpTokens: [
            "AdsBot-Google"
          ],
          purposes: [
            "advertising-related-crawling"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
        },
        {
          id: "adsbot-google-mobile",
          name: "AdsBot-Google-Mobile",
          httpTokens: [
            "AdsBot-Google-Mobile"
          ],
          purposes: [
            "advertising-related-crawling"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
        },
        {
          id: "apis-google",
          name: "APIs-Google",
          httpTokens: [
            "APIs-Google"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
        },
        {
          id: "google-safety",
          name: "Google-Safety",
          httpTokens: [
            "Google-Safety"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
        },
        {
          id: "mediapartners-google",
          name: "Mediapartners-Google",
          httpTokens: [
            "Mediapartners-Google"
          ],
          purposes: [
            "advertising-related-crawling"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
        }
      ],
      documentationUrls: [
        "https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers"
      ],
      limitations: [
        "Category-wide ranges cannot independently identify AdsBot or another specific fetcher.",
        "No blanket claim that all special-case crawlers obey robots.txt."
      ],
      feedUrl: "https://developers.google.com/static/crawling/ipranges/special-crawlers.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:12:17.556843Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/google-special.json",
        fixtureSha256: "a8527b5b3c0fd2b8ebb89291f9f4e4b57c135448889257281e677375fb127be6",
        publisherTimestampRaw: "2026-10-20T14:46:18.000000",
        rangeCounts: {
          ipv4: 136,
          ipv6: 136
        },
        bytes: 19109
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "google-user-triggered",
      provider: {
        id: "google",
        name: "Google"
      },
      scope: "customer-platform",
      category: "user-triggered-fetchers",
      purpose: "User-triggered fetching from Google-hosted customer applications.",
      identities: [],
      documentationUrls: [
        "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers",
        "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests"
      ],
      limitations: [
        "Can include customer-controlled applications on Google Cloud; not proof of a Google-owned crawler or a known HTTP identity.",
        "No per-product UA mapping is assigned to this dataset."
      ],
      feedUrl: "https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:12:17.475558Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/google-user-triggered.json",
        fixtureSha256: "707b0b95ec3f5cbbbf8202ff48b24c1448291a8d46acf26150da773c37536dee",
        publisherTimestampRaw: "2026-10-20T14:46:17.000000",
        rangeCounts: {
          ipv4: 534,
          ipv6: 534
        },
        bytes: 72503
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "google-user-triggered-google",
      provider: {
        id: "google",
        name: "Google"
      },
      scope: "provider-category",
      category: "user-triggered-fetchers-google",
      purpose: "User-triggered fetching controlled by Google.",
      identities: [
        {
          id: "google-cws",
          name: "Google-CWS",
          httpTokens: [
            "Google-CWS"
          ],
          purposes: [
            "other-documented-automation"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "feedfetcher-google",
          name: "FeedFetcher-Google",
          httpTokens: [
            "FeedFetcher-Google"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "google-gemininotebook",
          name: "Google-GeminiNotebook",
          httpTokens: [
            "Google-GeminiNotebook"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "googlemessages",
          name: "GoogleMessages",
          httpTokens: [
            "GoogleMessages"
          ],
          purposes: [
            "link-preview"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "google-pinpoint",
          name: "Google-Pinpoint",
          httpTokens: [
            "Google-Pinpoint"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "googleproducer",
          name: "GoogleProducer",
          httpTokens: [
            "GoogleProducer"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "google-read-aloud",
          name: "Google-Read-Aloud",
          httpTokens: [
            "Google-Read-Aloud"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        },
        {
          id: "google-site-verification",
          name: "Google-Site-Verification",
          httpTokens: [
            "Google-Site-Verification"
          ],
          purposes: [
            "site-verification"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        }
      ],
      documentationUrls: [
        "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
      ],
      limitations: [
        "Listed identities are category candidates; documentation does not provide a separate feed per identity.",
        "Google-NotebookLM and google-speakr are documented former agents; current-token recognition does not imply historical verification."
      ],
      feedUrl: "https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers-google.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:12:17.611423Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/google-user-triggered-google.json",
        fixtureSha256: "8a2063b2b23a4aafa133c0b772bb20d3947dcfb2e2336b4900fcc97519d42323",
        publisherTimestampRaw: "2026-10-20T14:46:18.000000",
        rangeCounts: {
          ipv4: 252,
          ipv6: 252
        },
        bytes: 35317
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "google-user-triggered-agents",
      provider: {
        id: "google",
        name: "Google"
      },
      scope: "provider-category",
      category: "user-triggered-agents",
      purpose: "Agents hosted on Google infrastructure navigating and acting at user request.",
      identities: [
        {
          id: "google-agent",
          name: "Google-Agent",
          httpTokens: [
            "Google-Agent"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
        }
      ],
      documentationUrls: [
        "https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers"
      ],
      limitations: [
        "Documentation explicitly connects Google-Agent to this feed, but an IP match does not authenticate an individual request.",
        "Web Bot Auth is documented separately and is not implemented in this release."
      ],
      feedUrl: "https://developers.google.com/static/crawling/ipranges/user-triggered-agents.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:12:17.346096Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/google-user-triggered-agents.json",
        fixtureSha256: "7ef5b40b81cc715c9181e0899ab448583ae9b0a462bbb4bd907beb1f90d9df82",
        publisherTimestampRaw: "2026-10-20T14:46:17.000000",
        rangeCounts: {
          ipv4: 12,
          ipv6: 8
        },
        bytes: 1413
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "bing",
      provider: {
        id: "microsoft",
        name: "Microsoft Bing"
      },
      scope: "provider-category",
      category: "search-crawlers",
      purpose: "Bing search crawling.",
      identities: [
        {
          id: "bingbot",
          name: "bingbot",
          httpTokens: [
            "bingbot"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/"
        }
      ],
      documentationUrls: [
        "https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26",
        "https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/",
        "https://www.bing.com/webmasters/api/help/htmlcontent?ArticleId=3905dc26"
      ],
      limitations: [
        "Official article retrieved through its public help API; publisher instructs daily refresh for Bing.",
        "Official Bing UA announcement also says URL Inspection uses the desktop UA; do not infer the originating product from the token.",
        "Feed publisher timestamp is old; successful retrieval does not establish when ranges last changed or exhaustive coverage.",
        "DNS verification described in the article is not implemented; feed membership is the only supported verification method."
      ],
      feedUrl: "https://www.bing.com/toolbox/bingbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:44.882010Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/bing.json",
        fixtureSha256: "a2d1cf229544205a24c61fb7c459408b1afe18f9fd5b172fe181f0eb73c1594d",
        publisherTimestampRaw: "2024-01-03T10:00:00.121331",
        rangeCounts: {
          ipv4: 28,
          ipv6: 0
        },
        bytes: 1580
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "openai-gptbot",
      provider: {
        id: "openai",
        name: "OpenAI"
      },
      scope: "crawler-specific",
      category: "ai-training",
      purpose: "Collection of content that may be used for training generative AI foundation models.",
      identities: [
        {
          id: "gptbot",
          name: "GPTBot",
          httpTokens: [
            "GPTBot"
          ],
          purposes: [
            "ai-training"
          ],
          documentationUrl: "https://developers.openai.com/api/docs/bots"
        }
      ],
      documentationUrls: [
        "https://developers.openai.com/api/docs/bots"
      ],
      limitations: [
        "Published infrastructure association is not individual-request authentication or proof of request intent.",
        "Shared IP prefixes with other OpenAI feeds must return all applicable evidence."
      ],
      feedUrl: "https://openai.com/gptbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.479414Z",
        httpStatus: 200,
        contentType: "application/json; charset=utf-8",
        fixturePath: "fixtures/openai-gptbot.json",
        fixtureSha256: "a24d1fa34f094d303400bdf13c45c5e9726e0b553780d16a52f9ba1b790acc72",
        publisherTimestampRaw: "2026-09-22T02:00:07.000000",
        rangeCounts: {
          ipv4: 18,
          ipv6: 0
        },
        bytes: 977
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "openai-searchbot",
      provider: {
        id: "openai",
        name: "OpenAI"
      },
      scope: "crawler-specific",
      category: "ai-search",
      purpose: "Discovery for ChatGPT search results.",
      identities: [
        {
          id: "oai-searchbot",
          name: "OAI-SearchBot",
          httpTokens: [
            "OAI-SearchBot"
          ],
          purposes: [
            "ai-search"
          ],
          documentationUrl: "https://developers.openai.com/api/docs/bots"
        }
      ],
      documentationUrls: [
        "https://developers.openai.com/api/docs/bots"
      ],
      limitations: [
        "Published infrastructure association is not individual-request authentication or proof of request intent.",
        "Shared IP prefixes with other OpenAI feeds must return all applicable evidence."
      ],
      feedUrl: "https://openai.com/searchbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.579422Z",
        httpStatus: 200,
        contentType: "application/json; charset=utf-8",
        fixturePath: "fixtures/openai-searchbot.json",
        fixtureSha256: "81806b1665e9bbbc5e0f307b847ad34f7027abc19e0d2d5d3eca1864bf361be6",
        publisherTimestampRaw: "2026-01-02T11:00:00.000000",
        rangeCounts: {
          ipv4: 39,
          ipv6: 0
        },
        bytes: 2080
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "openai-chatgpt-user",
      provider: {
        id: "openai",
        name: "OpenAI"
      },
      scope: "crawler-specific",
      category: "user-triggered-fetching",
      purpose: "Certain ChatGPT and Custom GPT user actions; not automatic web crawling.",
      identities: [
        {
          id: "chatgpt-user",
          name: "ChatGPT-User",
          httpTokens: [
            "ChatGPT-User"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://developers.openai.com/api/docs/bots"
        }
      ],
      documentationUrls: [
        "https://developers.openai.com/api/docs/bots"
      ],
      limitations: [
        "Published infrastructure association is not individual-request authentication or proof of request intent.",
        "Shared IP prefixes with other OpenAI feeds must return all applicable evidence.",
        "Observed content type application/octet-stream; allow this explicitly for this source while requiring valid JSON/schema."
      ],
      feedUrl: "https://openai.com/chatgpt-user.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.743327Z",
        httpStatus: 200,
        contentType: "application/octet-stream",
        fixturePath: "fixtures/openai-chatgpt-user.json",
        fixtureSha256: "e03a9f75b53619286d990e028043ce43d223d93269f3679b28d78142b8f0e7ab",
        publisherTimestampRaw: "2026-10-20T17:07:39.673498",
        rangeCounts: {
          ipv4: 234,
          ipv6: 0
        },
        bytes: 8467
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "openai-adsbot",
      provider: {
        id: "openai",
        name: "OpenAI"
      },
      scope: "crawler-specific",
      category: "advertising-related-crawling",
      purpose: "Safety validation and relevance assessment of pages submitted as ChatGPT ads; not foundation-model training.",
      identities: [
        {
          id: "oai-adsbot",
          name: "OAI-AdsBot",
          httpTokens: [
            "OAI-AdsBot"
          ],
          purposes: [
            "advertising-related-crawling"
          ],
          documentationUrl: "https://developers.openai.com/api/docs/bots"
        }
      ],
      documentationUrls: [
        "https://developers.openai.com/api/docs/bots"
      ],
      limitations: [
        "Published infrastructure association is not individual-request authentication or proof of request intent.",
        "Shared IP prefixes with other OpenAI feeds must return all applicable evidence."
      ],
      feedUrl: "https://openai.com/adsbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.602788Z",
        httpStatus: 200,
        contentType: "application/json; charset=utf-8",
        fixturePath: "fixtures/openai-adsbot.json",
        fixtureSha256: "460b800ffb026c5ec1b9540d285f2ade8e1c4a654e65dae315e2bae650b5d74d",
        publisherTimestampRaw: "2026-05-12T03:00:00.000000",
        rangeCounts: {
          ipv4: 2,
          ipv6: 0
        },
        bytes: 177
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "anthropic-shared",
      provider: {
        id: "anthropic",
        name: "Anthropic / Claude"
      },
      scope: "provider-shared",
      category: "shared-crawlers",
      purpose: "Infrastructure shared across documented Claude bots.",
      identities: [
        {
          id: "claudebot",
          name: "ClaudeBot",
          httpTokens: [
            "ClaudeBot"
          ],
          purposes: [
            "ai-training"
          ],
          documentationUrl: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
        },
        {
          id: "claude-searchbot",
          name: "Claude-SearchBot",
          httpTokens: [
            "Claude-SearchBot"
          ],
          purposes: [
            "ai-search"
          ],
          documentationUrl: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
        },
        {
          id: "claude-user",
          name: "Claude-User",
          httpTokens: [
            "Claude-User"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
        }
      ],
      documentationUrls: [
        "https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler"
      ],
      limitations: [
        "Single feed has no per-crawler labels; preserve all three purposes without attributing any individual request to one.",
        "Documentation establishes that listed IPs indicate Anthropic; it does not prove out-of-range traffic cannot be Anthropic."
      ],
      feedUrl: "https://claude.com/crawling/bots.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-21T11:27:03.593Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/anthropic-shared.json",
        fixtureSha256: "c960bb55504c3c478d0335bc7153e9ca871c26388a69e403cbad121a5bb5c5dd",
        publisherTimestampRaw: "2026-10-20T00:00:00Z",
        rangeCounts: {
          ipv4: 14,
          ipv6: 0
        },
        bytes: 653
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "ahrefs-shared",
      provider: {
        id: "ahrefs",
        name: "Ahrefs"
      },
      scope: "provider-shared",
      category: "seo-crawlers",
      purpose: "Ahrefs marketing intelligence/Yep indexing and user-requested technical site audits.",
      identities: [
        {
          id: "ahrefsbot",
          name: "AhrefsBot",
          httpTokens: [
            "AhrefsBot"
          ],
          purposes: [
            "seo-analysis",
            "web-indexing"
          ],
          documentationUrl: "https://ahrefs.com/robot"
        },
        {
          id: "ahrefssiteaudit",
          name: "AhrefsSiteAudit",
          httpTokens: [
            "AhrefsSiteAudit"
          ],
          purposes: [
            "seo-analysis"
          ],
          documentationUrl: "https://ahrefs.com/robot"
        }
      ],
      documentationUrls: [
        "https://ahrefs.com/robot"
      ],
      limitations: [
        "Feed has no publisher timestamp; record retrieval time separately without fabricating creationTime.",
        "Shared feed does not distinguish AhrefsBot from AhrefsSiteAudit."
      ],
      feedUrl: "https://api.ahrefs.com/v3/public/crawler-ip-ranges",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: false,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.762902Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/ahrefs-shared.json",
        fixtureSha256: "4246eee9407d58fb030ee9f12776f974f628db4b4f91f8111847dd565fc63d45",
        publisherTimestampRaw: null,
        rangeCounts: {
          ipv4: 81,
          ipv6: 0
        },
        bytes: 3350
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "duckduckbot",
      provider: {
        id: "duckduckgo",
        name: "DuckDuckGo"
      },
      scope: "provider-shared",
      category: "web-indexing",
      purpose: "Improve DuckDuckGo search results.",
      identities: [
        {
          id: "duckduckbot",
          name: "DuckDuckBot",
          httpTokens: [
            "DuckDuckBot"
          ],
          purposes: [
            "web-indexing"
          ],
          documentationUrl: "https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot"
        }
      ],
      documentationUrls: [
        "https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot"
      ],
      limitations: [
        "DuckDuckBot and DuckAssistBot feeds are byte-identical in this audit; an IP cannot distinguish their identities or purposes.",
        "Identity consistency requires the declared token, and remains consistency rather than request authentication."
      ],
      feedUrl: "https://duckduckgo.com/duckduckbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:44.073146Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/duckduckbot.json",
        fixtureSha256: "fd9039362dfaaad236d50c07ddd12bf0cc7f0d530fbff59b8feb1b22e0db2459",
        publisherTimestampRaw: "2026-09-01T12:44:58.000000",
        rangeCounts: {
          ipv4: 486,
          ipv6: 0
        },
        bytes: 32101
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "duckassistbot",
      provider: {
        id: "duckduckgo",
        name: "DuckDuckGo"
      },
      scope: "provider-shared",
      category: "ai-search",
      purpose: "Real-time retrieval for cited AI-assisted answers; documentation excludes AI model training.",
      identities: [
        {
          id: "duckassistbot",
          name: "DuckAssistBot",
          httpTokens: [
            "DuckAssistBot"
          ],
          purposes: [
            "ai-search"
          ],
          documentationUrl: "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot"
        }
      ],
      documentationUrls: [
        "https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot"
      ],
      limitations: [
        "DuckDuckBot and DuckAssistBot feeds are byte-identical in this audit; an IP cannot distinguish their identities or purposes.",
        "Identity consistency requires the declared token, and remains consistency rather than request authentication."
      ],
      feedUrl: "https://duckduckgo.com/duckassistbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:43.967221Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/duckassistbot.json",
        fixtureSha256: "fd9039362dfaaad236d50c07ddd12bf0cc7f0d530fbff59b8feb1b22e0db2459",
        publisherTimestampRaw: "2026-09-01T12:44:58.000000",
        rangeCounts: {
          ipv4: 486,
          ipv6: 0
        },
        bytes: 32101
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "commoncrawl",
      provider: {
        id: "commoncrawl",
        name: "Common Crawl"
      },
      scope: "crawler-specific",
      category: "open-web-crawl",
      purpose: "Build a publicly accessible repository of web crawl data.",
      identities: [
        {
          id: "ccbot",
          name: "CCBot",
          httpTokens: [
            "CCBot"
          ],
          purposes: [
            "open-web-data"
          ],
          documentationUrl: "https://commoncrawl.org/ccbot"
        }
      ],
      documentationUrls: [
        "https://commoncrawl.org/ccbot"
      ],
      limitations: [
        "Feed recommends FCrDNS for IPv4; this release performs IP verification only.",
        "Operator states reverse DNS is not yet supported over IPv6; retain this limitation without implementing DNS."
      ],
      feedUrl: "https://index.commoncrawl.org/ccbot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4,
        6
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:43.507289Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/commoncrawl.json",
        fixtureSha256: "0a4c3b6707326d7f083139a979062604a57edfbb251bd29f23f5a86c5107ea30",
        publisherTimestampRaw: "2026-08-11T13:40:00Z",
        rangeCounts: {
          ipv4: 4,
          ipv6: 1
        },
        bytes: 540
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "perplexity-bot",
      provider: {
        id: "perplexity",
        name: "Perplexity"
      },
      scope: "crawler-specific",
      category: "ai-search",
      purpose: "Surface and link websites in Perplexity search; not foundation-model training.",
      identities: [
        {
          id: "perplexitybot",
          name: "PerplexityBot",
          httpTokens: [
            "PerplexityBot"
          ],
          purposes: [
            "ai-search"
          ],
          documentationUrl: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers"
        }
      ],
      documentationUrls: [
        "https://docs.perplexity.ai/docs/resources/perplexity-crawlers"
      ],
      limitations: [
        "Current documentation links www.perplexity.com JSON URLs, which redirect to these www.perplexity.ai URLs; register only the final feed.",
        "Old publisher timestamps do not measure freshness of the HTTP retrieval."
      ],
      feedUrl: "https://www.perplexity.ai/perplexitybot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:42.871549Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/perplexity-bot.json",
        fixtureSha256: "2688b50802b42611b412f8ac3bc614248d0eab00d74f4ceda41cb78526bde6b2",
        publisherTimestampRaw: "2025-02-07T16:56:00.000000",
        rangeCounts: {
          ipv4: 8,
          ipv6: 0
        },
        bytes: 482
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "perplexity-user",
      provider: {
        id: "perplexity",
        name: "Perplexity"
      },
      scope: "crawler-specific",
      category: "user-triggered-fetching",
      purpose: "User-requested page retrieval for answers with links; not automatic crawling or foundation-model training.",
      identities: [
        {
          id: "perplexity-user",
          name: "Perplexity-User",
          httpTokens: [
            "Perplexity-User"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://docs.perplexity.ai/docs/resources/perplexity-crawlers"
        }
      ],
      documentationUrls: [
        "https://docs.perplexity.ai/docs/resources/perplexity-crawlers"
      ],
      limitations: [
        "Current documentation links www.perplexity.com JSON URLs, which redirect to these www.perplexity.ai URLs; register only the final feed.",
        "Old publisher timestamps do not measure freshness of the HTTP retrieval."
      ],
      feedUrl: "https://www.perplexity.ai/perplexity-user.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:43.190819Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/perplexity-user.json",
        fixtureSha256: "23e55350c44ac51a8a6e7ed786d861db8bc62886fd1cfc228dfa467127223e48",
        publisherTimestampRaw: "2025-10-17T10:17:00.000000",
        rangeCounts: {
          ipv4: 4,
          ipv6: 0
        },
        bytes: 276
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "applebot",
      provider: {
        id: "apple",
        name: "Apple"
      },
      scope: "provider-category",
      category: "search-crawlers",
      purpose: "Apple search discovery; documentation also describes training and AI-answer uses with separate publisher controls.",
      identities: [
        {
          id: "applebot",
          name: "Applebot",
          httpTokens: [
            "Applebot"
          ],
          purposes: [
            "web-indexing",
            "ai-training",
            "ai-search"
          ],
          documentationUrl: "https://support.apple.com/en-us/119829"
        }
      ],
      documentationUrls: [
        "https://support.apple.com/en-us/119829"
      ],
      limitations: [
        "Applebot-Extended does not crawl webpages and is not registered as an HTTP crawler identity.",
        "Apple describes other user agents such as iTMS; the Applebot match must not imply a specific product."
      ],
      feedUrl: "https://search.developer.apple.com/applebot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient."
      },
      audit: {
        checkedAt: "2026-10-20T19:11:46.408011Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/applebot.json",
        fixtureSha256: "5a5e12188891d998341f4fb50d2b31c80aba5002f5cff9d0fa110c13e4e2edd0",
        publisherTimestampRaw: "2026-09-15T10:00:00.000000",
        rangeCounts: {
          ipv4: 24,
          ipv6: 0
        },
        bytes: 1640
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "mistral-user",
      provider: {
        id: "mistral",
        name: "Mistral"
      },
      scope: "crawler-specific",
      category: "user-triggered-fetching",
      purpose: "User-requested page retrieval in Mistral products; not automated crawling or model training.",
      identities: [
        {
          id: "mistralai-user",
          name: "MistralAI-User",
          httpTokens: [
            "MistralAI-User"
          ],
          purposes: [
            "user-triggered-fetching"
          ],
          documentationUrl: "https://docs.mistral.ai/robots"
        }
      ],
      documentationUrls: [
        "https://docs.mistral.ai/robots"
      ],
      limitations: [
        "Published range membership does not authenticate an individual request.",
        "No negative verdicts are enabled."
      ],
      feedUrl: "https://mistral.ai/mistralai-user-ips.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Publisher feed inclusion alone does not establish complete identity/family coverage."
      },
      audit: {
        checkedAt: "2026-10-21T12:55:10.554Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/mistral-user.json",
        fixtureSha256: "6226c5829c7edb91995769a9f3f0a52b686b4a18cc5a8d6d92479d2908f793f6",
        publisherTimestampRaw: "2025-02-19T12:00:00.000000",
        rangeCounts: {
          ipv4: 4,
          ipv6: 0
        },
        bytes: 279
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "mistral-index",
      provider: {
        id: "mistral",
        name: "Mistral"
      },
      scope: "crawler-specific",
      category: "ai-search",
      purpose: "Automated web indexing for Mistral search; not model training.",
      identities: [
        {
          id: "mistralai-index",
          name: "MistralAI-Index",
          httpTokens: [
            "MistralAI-Index"
          ],
          purposes: [
            "ai-search"
          ],
          documentationUrl: "https://docs.mistral.ai/robots"
        }
      ],
      documentationUrls: [
        "https://docs.mistral.ai/robots"
      ],
      limitations: [
        "Published range membership does not authenticate an individual request.",
        "No negative verdicts are enabled."
      ],
      feedUrl: "https://mistral.ai/mistralai-index-ips.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Publisher feed inclusion alone does not establish complete identity/family coverage."
      },
      audit: {
        checkedAt: "2026-10-21T12:55:10.554Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/mistral-index.json",
        fixtureSha256: "35bf7aede93ea6a24b12606cf0abb809d8fe9846b2e054e0174dc53f91921c20",
        publisherTimestampRaw: "2026-04-19T12:00:00.000000",
        rangeCounts: {
          ipv4: 2,
          ipv6: 0
        },
        bytes: 176
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    },
    {
      id: "kimi-shared",
      provider: {
        id: "kimi",
        name: "Kimi / Moonshot AI"
      },
      scope: "provider-shared",
      category: "shared-crawlers",
      purpose: "Publisher-listed Kimi infrastructure; the feed does not distinguish crawler identities or purposes.",
      identities: [],
      documentationUrls: [
        "https://www.kimi.ai/policies/kimibot.json"
      ],
      limitations: [
        "Published range membership does not authenticate an individual request.",
        "No negative verdicts are enabled.",
        "Official JSON is available, but supporting per-identity documentation could not be verified; do not infer KimiBot, Kimi-SearchBot or Kimi-User from an IP match."
      ],
      feedUrl: "https://www.kimi.ai/policies/kimibot.json",
      sourceType: "json-cidr-prefixes",
      feedSchema: "publisher-prefixes-v1",
      requiresPublisherTimestamp: true,
      addressFamilies: [
        4
      ],
      verificationStatus: "included",
      negativeVerification: {
        allowed: false,
        reason: "Publisher feed inclusion alone does not establish complete identity/family coverage."
      },
      audit: {
        checkedAt: "2026-10-21T12:55:10.554Z",
        httpStatus: 200,
        contentType: "application/json",
        fixturePath: "fixtures/kimi-shared.json",
        fixtureSha256: "cc2df677a3164de0b0eaa5c6fad21cac1ecb03a905743b3bf23db347f0b058c4",
        publisherTimestampRaw: "2026-05-18T10:04:07Z",
        rangeCounts: {
          ipv4: 4,
          ipv6: 0
        },
        bytes: 186
      },
      runtime: {
        lastAttemptedRefresh: null,
        lastSuccessfulRefresh: null,
        publisherTimestampRaw: null,
        lastKnownGoodVersion: null,
        lastRefreshError: null,
        rangeCounts: {
          ipv4: 0,
          ipv6: 0
        }
      },
      refreshIntervalHours: 24
    }
  ],
  excludedHttpTokens: [
    {
      token: "Google-Extended",
      reason: "Robots control token; no separate HTTP crawler."
    },
    {
      token: "Googlebot-News",
      reason: "Robots token; Google documents no separate HTTP request user agent."
    },
    {
      token: "Applebot-Extended",
      reason: "Data-use control; Apple states it does not crawl webpages."
    }
  ],
  rejectedOrAliasedUrls: [
    {
      url: "https://www.gstatic.com/ipranges/common-crawlers.json",
      httpStatus: 404,
      finalUrl: "https://www.gstatic.com/ipranges/common-crawlers.json",
      decision: "excluded-404"
    },
    {
      url: "https://www.gstatic.com/ipranges/special-crawlers.json",
      httpStatus: 404,
      finalUrl: "https://www.gstatic.com/ipranges/special-crawlers.json",
      decision: "excluded-404"
    },
    {
      url: "https://www.gstatic.com/ipranges/user-triggered-fetchers.json",
      httpStatus: 404,
      finalUrl: "https://www.gstatic.com/ipranges/user-triggered-fetchers.json",
      decision: "excluded-404"
    },
    {
      url: "https://www.gstatic.com/ipranges/user-triggered-fetchers-google.json",
      httpStatus: 404,
      finalUrl: "https://www.gstatic.com/ipranges/user-triggered-fetchers-google.json",
      decision: "excluded-404"
    },
    {
      url: "https://www.gstatic.com/ipranges/user-triggered-agents.json",
      httpStatus: 404,
      finalUrl: "https://www.gstatic.com/ipranges/user-triggered-agents.json",
      decision: "excluded-404"
    },
    {
      url: "https://developers.google.com/search/apis/ipranges/googlebot.json",
      httpStatus: 200,
      finalUrl: "https://developers.google.com/static/crawling/ipranges/common-crawlers.json",
      decision: "alias-only"
    },
    {
      url: "https://www.perplexity.com/perplexitybot.json",
      httpStatus: 200,
      finalUrl: "https://www.perplexity.ai/perplexitybot.json",
      decision: "alias-only"
    },
    {
      url: "https://www.perplexity.com/perplexity-user.json",
      httpStatus: 200,
      finalUrl: "https://www.perplexity.ai/perplexity-user.json",
      decision: "alias-only"
    }
  ]
};

// data/dataset-contract.js
var sources = source_registry_default.sources;
var sourceById = new Map(sources.map((source) => [source.id, source]));
var MAX_BYTES = 256 * 1024;
var encoder = new TextEncoder();

// web/src/identity/catalog.js
var PURPOSES = Object.freeze({
  "web-indexing": "Web indexing",
  "ai-search": "AI search discovery and answers",
  "ai-training": "AI training/data collection",
  "user-triggered-fetching": "User-triggered fetching",
  "seo-analysis": "SEO analysis/crawling",
  "advertising-related-crawling": "Advertising-related crawling",
  "site-verification": "Site verification/testing",
  "link-preview": "Link preview/metadata retrieval",
  "open-web-data": "Open web crawl data",
  "other-documented-automation": "Other documented automated operations"
});

// web/src/results/assessment.js
var FINDING_LABELS = Object.freeze({
  "official-infrastructure-match": "Official infrastructure match",
  "could-not-verify": "Could not verify",
  "unverified-crawler-claim": "Unverified crawler claim",
  "no-published-range-match": "No published range match",
  "claimed-identity-mismatch": "Crawler claim mismatch - review",
  "invalid-nonpublic": "Nonpublic / special-use IP",
  "invalid-input": "Invalid input"
});
function assessmentFinding(result) {
  const status = result.assessment.status, infra = result.infrastructure;
  const claims = result.client?.claims ?? [];
  let id;
  if (["invalid-input", "invalid-nonpublic"].includes(status)) id = status;
  else if (claims.length && !infra.observedMatches.length) id = "unverified-crawler-claim";
  else if (status === "claimed-identity-mismatch") id = status;
  else if (["claim-consistent", "provider-identified", "official-infrastructure-match"].includes(status) && infra.currentMatches.length) id = "official-infrastructure-match";
  else if (status === "inconclusive" || infra.observedMatches.length || !infra.sourceStates.some((source) => source.current)) id = "could-not-verify";
  else id = "no-published-range-match";
  const investigation = id === "unverified-crawler-claim"
    ? "The user-agent claims a recognized crawler, but the available published IP-range evidence does not establish its provider. This alone does not indicate impersonation or abuse. Check the source health and assessment explanation below for the reason verification was not possible."
    : claims.length && !infra.currentMatches.length && !["invalid-input", "invalid-nonpublic"].includes(id)
      ? "The crawler claim is not confirmed by current published range evidence. Review the observed ranges, source health and assessment explanation. This alone does not indicate impersonation or abuse."
      : null;
  return { id, label: FINDING_LABELS[id], ...investigation ? { investigation } : {} };
}

// web/src/results/model.js
var categoryLabel = (category) => PURPOSES[category] ?? {
  "common-crawlers": "Common crawlers",
  "special-case-crawlers": "Special-case crawlers",
  "user-triggered-fetchers": "User-triggered fetchers",
  "user-triggered-fetchers-google": "Google user-triggered fetchers",
  "user-triggered-agents": "User-triggered agents",
  "search-crawlers": "Search crawlers",
  "shared-crawlers": "Shared crawler infrastructure",
  "seo-crawlers": "SEO crawlers",
  "open-web-crawl": "Open web crawl"
}[category] ?? category;
var assessmentBadgeClass = (status) => `badge${status === "unverified-crawler-claim" ? " unverified" : status === "claimed-identity-mismatch" ? " review" : ["claim-consistent", "official-infrastructure-match"].includes(status) ? " match" : ""}`;
var STATUS_LABELS = Object.freeze({
  "claim-consistent": "Claim consistent",
  "provider-identified": "Provider identified; crawler unresolved",
  "official-infrastructure-match": "Official infrastructure match",
  "claimed-identity-mismatch": "Claimed identity mismatch \u2014 review",
  inconclusive: "Inconclusive",
  "browser-like": "Browser-like",
  "automation-like": "Automation-like",
  unknown: "Unknown",
  "invalid-nonpublic": "Special-use / nonpublic",
  "invalid-input": "Invalid input"
});
var CLIENT_LABELS = Object.freeze({
  "recognized-crawler": "Recognized crawler claim",
  "other-crawler-claim": "Other crawler claim",
  "browser-like": "Browser-like",
  "automation-like": "Automation-like",
  unknown: "Unknown client",
  missing: "Missing User-Agent",
  malformed: "Malformed User-Agent"
});
var unique = (values) => [...new Set(values)];
var sourcePurposes = new Map(sources.map((source) => [
  source.id,
  unique(source.identities.flatMap((identity) => identity.purposes))
]));
function resultRows(report3) {
  return [...report3.groups.map((group) => {
    const { client, infrastructure: infra, assessment } = group.result;
    const matches = infra.observedMatches;
    const applicable = matches.length ? matches.map((match) => match.health) : assessment.checkedSourceIds.length ? infra.sourceStates.filter((state) => assessment.checkedSourceIds.includes(state.sourceId)) : infra.sourceStates;
    const row = {
      id: `g-${group.id}`,
      kind: "group",
      group,
      ip: group.ip,
      family: group.result.address.family,
      numericIP: parseIP(group.ip).value,
      client: client.category,
      claimIds: client.claims.map((claim) => claim.id),
      claimNames: client.claims.map((claim) => claim.name),
      providerIds: unique(matches.map((match) => match.providerId)),
      providerNames: unique(matches.map((match) => match.providerName)),
      purposes: unique([...client.claims.flatMap((claim) => claim.purposes), ...matches.flatMap((match) => sourcePurposes.get(match.sourceId) ?? [])]),
      status: assessment.status,
      finding: assessmentFinding(group.result),
      states: unique(applicable.map((state) => state.state)),
      httpStatus: group.responseStatus ?? null,
      cidrs: unique(matches.map((match) => match.cidr)),
      count: group.requestCount,
      historical: group.historyPolicy.timestampedOccurrences > 0
    };
    row.search = [
      row.ip,
      ...group.occurrences.map((record) => record.rawIp),
      client.raw,
      CLIENT_LABELS[row.client],
      ...row.claimNames,
      ...row.providerNames,
      ...row.cidrs,
      ...row.purposes,
      row.finding.label,
      row.httpStatus
    ].filter(Boolean).join("\n").toLowerCase();
    return row;
  }), ...report3.invalidRows.map((invalid, index2) => ({
    id: `i-${index2}`,
    kind: "invalid",
    invalid,
    ip: `Invalid row ${invalid.reference.record}`,
    family: "invalid",
    numericIP: 0n,
    client: "not-parsed",
    claimIds: [],
    claimNames: [],
    providerIds: [],
    providerNames: [],
    purposes: [],
    status: "invalid-input",
    finding: { id: "invalid-input", label: FINDING_LABELS["invalid-input"] },
    states: ["unavailable"],
    cidrs: [],
    count: 0,
    historical: false,
    search: `${invalid.rawRecord}
    ${invalid.message}
    Not parsed`.toLowerCase()
  }))];
}
var KNOWN = "@known";
var UNKNOWN = "@unknown";
var namedMatch = (ids, filter) => !filter || (filter === KNOWN ? ids.length > 0 : filter === UNKNOWN ? ids.length === 0 : ids.includes(filter));
function queryRows(rows, filters = {}, { sort = "input", direction = "asc", page = 1, pageSize = 50 } = {}) {
  const query = (filters.search ?? "").trim().toLowerCase();
  let selected = rows.filter((row) => (!query || row.search.includes(query)) && (!filters.status || row.status === filters.status) && (!filters.finding || row.finding.id === filters.finding) && (!filters.family || String(row.family) === filters.family) && (!filters.http || row.kind === "group" && (row.httpStatus ?? "missing") === filters.http) && (!filters.client || row.client === filters.client) && namedMatch(row.providerIds, filters.provider) && namedMatch(row.claimIds, filters.claim) && (!filters.purpose || row.purposes.includes(filters.purpose)) && (!filters.freshness || row.states.includes(filters.freshness)) && (!filters.focus || (["unverified", "mismatch"].includes(filters.focus) ? row.finding.id === "unverified-crawler-claim" : filters.focus === "unknown" ? ["unknown", "missing", "other-crawler-claim", "malformed"].includes(row.client) : filters.focus === "special" ? ["invalid-input", "invalid-nonpublic"].includes(row.status) : filters.focus === "historical" ? row.historical : false)));
  if (sort !== "input") {
    const sign = direction === "desc" ? -1 : 1;
    selected = selected.map((row, index2) => ({ row, index: index2 })).sort((a, b) => {
      let comparison;
      if (sort === "ip") comparison = a.row.family === b.row.family ? a.row.numericIP < b.row.numericIP ? -1 : a.row.numericIP > b.row.numericIP ? 1 : 0 : String(a.row.family).localeCompare(String(b.row.family));
      else if (sort === "count") comparison = a.row.count - b.row.count;
      else comparison = String(sort === "status" ? a.row.finding.label : a.row[sort] ?? "").localeCompare(String(sort === "status" ? b.row.finding.label : b.row[sort] ?? ""));
      return comparison * sign || a.index - b.index;
    }).map((item) => item.row);
  }
  const pages = Math.max(1, Math.ceil(selected.length / pageSize));
  const current = Math.max(1, Math.min(page, pages));
  return {
    rows: selected.slice((current - 1) * pageSize, current * pageSize),
    total: selected.length,
    page: current,
    pages,
    start: selected.length ? (current - 1) * pageSize + 1 : 0,
    end: Math.min(current * pageSize, selected.length)
  };
}

// node_modules/@lucasmarkes/hairline/dist/index.js
var LIGHT = { plate: "#ffffff", hi: "#232327", edge: "#a4a4ac", mid: "#c3c3c9", lo: "#e0e0e4" };
var DARK = { plate: "#08090a", hi: "#d0d6e0", edge: "#5b5d64", mid: "#3e3e44", lo: "#29292d" };
var KEYS = ["plate", "hi", "edge", "mid", "lo"];
var vars = (p) => KEYS.map((k) => `--hl-${k}:var(--hairline-${k},${p[k]});`).join("");
var EASE = "cubic-bezier(0.5,0,0.1,1)";
var SVG = ":where([data-hairline]>svg)";
function css(lightDark) {
  const both = Object.fromEntries(KEYS.map((k) => [k, `light-dark(${LIGHT[k]},${DARK[k]})`]));
  return [
    // the box, and the palette: light unless something below says otherwise
    `:where([data-hairline]){display:block;position:relative;aspect-ratio:5/4;touch-action:pan-y;user-select:none;-webkit-user-select:none;--hl-sw:var(--hairline-stroke,0.9);${vars(LIGHT)}}`,
    // the page's color-scheme
    lightDark ? `:where([data-hairline]){${vars(both)}}` : "",
    // an ancestor that says dark
    `:where(.dark,[data-theme="dark"]) :where([data-hairline]){${vars(DARK)}}`,
    // the figure's own theme option
    `:where([data-hairline][data-hairline-theme="light"]){${vars(LIGHT)}}`,
    `:where([data-hairline][data-hairline-theme="dark"]){${vars(DARK)}}`,
    `:where([data-hairline]:focus-visible){outline:1.5px solid var(--hl-hi);outline-offset:2px}`,
    `${SVG}{position:absolute;inset:0;width:100%;height:100%;display:block}`,
    // Riffle's live region: read, not seen
    `:where([data-hairline]>[data-hairline-live]){position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`,
    // the drawing: plates are filled with the plate colour and painted back to front
    `${SVG} :where(path,polygon,ellipse,line){fill:var(--hl-plate);stroke:var(--hl-mid);stroke-width:var(--hl-sw);vector-effect:non-scaling-stroke;stroke-linejoin:round;stroke-linecap:round;transition:stroke 260ms ${EASE}}`,
    `${SVG} :where(.nf){fill:none}`,
    `${SVG} :where(.fo){stroke:none}`,
    `${SVG} :where(.sil){stroke:var(--hl-edge)}`,
    `${SVG} :where(.hi){stroke:var(--hl-hi)}`,
    `${SVG} :where(.lo){stroke:var(--hl-lo)}`,
    `${SVG} :where(.dash){stroke-dasharray:1 3}`,
    `${SVG} :where(.dot){stroke:none;fill:var(--hl-hi);transition:fill 260ms ${EASE}}`,
    `${SVG} :where(.dot.m){fill:var(--hl-edge)}`,
    `${SVG} :where(.dot.off){fill:var(--hl-lo)}`,
    `${SVG} :where(.ghost path){fill:none;stroke:var(--hl-mid)}`
  ].join("");
}
var done = /* @__PURE__ */ new WeakSet();
function inject(root) {
  if (done.has(root)) return;
  done.add(root);
  const doc = root.nodeType === 9 ? root : root.ownerDocument;
  const win = doc.defaultView;
  const text = css(!!win?.CSS?.supports?.("color", "light-dark(#000,#fff)"));
  if (win && "adoptedStyleSheets" in root) {
    try {
      const sheet = new win.CSSStyleSheet();
      sheet.replaceSync(text);
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      return;
    } catch {
    }
  }
  const style = doc.createElement("style");
  style.setAttribute("data-hairline-style", "");
  style.textContent = text;
  (root.nodeType === 9 ? doc.head ?? doc.documentElement : root).appendChild(style);
}
var clamp = (v, a, b) => Math.max(a, Math.min(b, v));
var rad = (d) => d * Math.PI / 180;
var r2 = (n) => Math.round(n * 100) / 100;
var poly = (pts) => "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
var seg = (a, b) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
var open = (pts) => pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");
var Cam = (azDeg, k, S9) => ({ az: rad(azDeg), k, S: S9, ox: 0, oy: 0 });
function proj(C) {
  const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
  return (x, y, z) => {
    const X = x * c - y * s, Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}
function unproj(C, sx, sy, z) {
  const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
  const X = (sx - C.ox) / C.S, Y = ((sy - C.oy) / C.S + z * zf) / C.k;
  return [X * c + Y * s, -X * s + Y * c];
}
function fit(C, pts, cx, cy) {
  C.ox = 0;
  C.oy = 0;
  const P = proj(C);
  let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]);
    b = Math.max(b, q[0]);
    c = Math.min(c, q[1]);
    d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2;
  C.oy = cy - (c + d) / 2;
}
function rrect(u0, v0, u1, v1, r, n = 4) {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out = [];
  for (const [cu, cv, a0] of [[u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180], [u1 - r, v0 + r, 270]])
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + 90 * k / n), ca = Math.cos(a), sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  return out;
}
function hull(input) {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of pts) {
    while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop();
    lo.push(p);
  }
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop();
    up.push(p);
  }
  lo.pop();
  up.pop();
  return lo.concat(up);
}
var ringAt = (P, ring, z) => ring.map((q) => P(q.u, q.v, z));
var facing = (C) => {
  const s = Math.sin(C.az), c = Math.cos(C.az);
  return (q) => q.nu * s + q.nv * c >= -1e-6;
};
function run(ring, keep) {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) {
    s = i;
    break;
  }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
  return out;
}
function prism(P, front2, ring, inner3, z0, z1) {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner3 ? open(ringAt(P, run(inner3, front2), z1)) : ""
  };
}
var rings = (x0, y0, x1, y1, r, b) => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b))
];
function fillet(pts, rs, n = 4) {
  const m = pts.length, out = [];
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m], p = pts[i], b = pts[(i + 1) % m];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t = Math.min(rs[i], la / 2, lb / 2);
    const p1 = [p[0] + (a[0] - p[0]) / la * t, p[1] + (a[1] - p[1]) / la * t];
    const p2 = [p[0] + (b[0] - p[0]) / lb * t, p[1] + (b[1] - p[1]) / lb * t];
    for (let k = 0; k <= n; k++) {
      const s = k / n, w = 1 - s;
      out.push([w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]);
    }
  }
  return out;
}
var reduced = false;
var setReducedMotion = (on) => {
  reduced = on;
};
var reducedMotion = () => reduced;
function spring(x, o = {}) {
  return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 };
}
function stepS(sp, dt) {
  if (reduced) {
    sp.x = sp.t;
    sp.v = 0;
    return false;
  }
  const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
  for (let i = 0; i < n; i++) {
    const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
    sp.v += a * h;
    sp.x += sp.v * h;
  }
  if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) {
    sp.x = sp.t;
    sp.v = 0;
    return false;
  }
  return true;
}
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax2 = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (u) => ((ax2 * u + bx) * u + cx) * u;
  const Y = (u) => ((ay * u + by) * u + cy) * u;
  const dX = (u) => (3 * ax2 * u + 2 * bx) * u + cx;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const e = X(u) - t;
      if (Math.abs(e) < 1e-5) break;
      const d = dX(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
      let lo = 0, hi = 1;
      u = t;
      for (let i = 0; i < 24; i++) {
        if (X(u) < t) lo = u;
        else hi = u;
        u = (lo + hi) / 2;
      }
    }
    return Y(u);
  };
}
var EASE_LIFT = bezier(0.32, 0.72, 0, 1);
var NS = "http://www.w3.org/2000/svg";
function mk(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e;
}
function solid(parent) {
  const g = mk("g", {}, parent);
  return { g, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
}
var put = (el, s) => {
  el.sil.setAttribute("d", s.sil);
  el.cr.setAttribute("d", s.crease);
};
var flatDot = (parent, C, r, cls) => mk("ellipse", { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent);
var place = (el, q) => {
  el.setAttribute("cx", String(r2(q[0])));
  el.setAttribute("cy", String(r2(q[1])));
};
var boards = [];
var byStage = /* @__PURE__ */ new Map();
var raf = 0;
var last = 0;
var io = null;
var rm = null;
function frame() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1e3));
  last = now;
  let any = false;
  for (const b of boards.slice()) if (b.vis && b.awake) {
    try {
      b.awake = !!b.tick(dt, now);
    } catch (err) {
      b.awake = false;
      setTimeout(() => {
        throw err;
      });
    }
    any = any || b.awake;
  }
  raf = any ? requestAnimationFrame(frame) : 0;
}
function wake(b) {
  b.awake = true;
  if (!raf) {
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
}
var onMotion = () => {
  setReducedMotion(!!rm?.matches);
  boards.forEach(wake);
};
function start() {
  if (io) return;
  io = new IntersectionObserver((es) => {
    for (const e of es) {
      const set = byStage.get(e.target);
      if (!set) continue;
      for (const b of set) {
        b.vis = e.isIntersecting;
        if (b.vis) wake(b);
      }
    }
  }, { rootMargin: "80px" });
  rm = matchMedia("(prefers-reduced-motion: reduce)");
  setReducedMotion(rm.matches);
  rm.addEventListener("change", onMotion);
}
function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  io?.disconnect();
  io = null;
  rm?.removeEventListener("change", onMotion);
  rm = null;
}
function register(stage, tick) {
  start();
  const b = { stage, tick, vis: false, awake: true };
  boards.push(b);
  const peers = byStage.get(stage);
  if (peers) {
    for (const p of peers) b.vis = p.vis;
    peers.add(b);
    if (b.vis) wake(b);
  } else {
    byStage.set(stage, /* @__PURE__ */ new Set([b]));
    io.observe(stage);
  }
  tick(0, performance.now());
  let gone = false;
  return {
    wake: () => {
      if (!gone) wake(b);
    },
    unregister: () => {
      if (gone) return;
      gone = true;
      boards = boards.filter((x) => x !== b);
      const set = byStage.get(stage);
      if (set) {
        set.delete(b);
        if (!set.size) {
          byStage.delete(stage);
          io?.unobserve(stage);
        }
      }
      if (!boards.length) stop();
    }
  };
}
var handlers = /* @__PURE__ */ new WeakMap();
var touring = /* @__PURE__ */ new WeakMap();
function pointer(stage, on) {
  handlers.set(stage, on);
  let tm = 0;
  const pt = (e) => {
    const r = stage.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    return [
      (stage.id === "hero-figure" ? 1 - x : x) * 400,
      y * 320
    ];
  };
  const move = (e) => {
    clearTimeout(tm);
    touring.get(stage)?.hold();
    on.move(pt(e), e);
  };
  const down = (e) => {
    clearTimeout(tm);
    touring.get(stage)?.hold();
    if (e.pointerType !== "mouse") stage.releasePointerCapture?.(e.pointerId);
    if (on.down) on.down(pt(e), e);
    else on.move(pt(e), e);
  };
  const leave = (e) => {
    clearTimeout(tm);
    tm = window.setTimeout(() => {
      on.leave(e);
      touring.get(stage)?.release();
    }, e.pointerType === "mouse" ? 0 : 1400);
  };
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerdown", down);
  stage.addEventListener("pointerleave", leave);
  return () => {
    clearTimeout(tm);
    if (handlers.get(stage) === on) handlers.delete(stage);
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerdown", down);
    stage.removeEventListener("pointerleave", leave);
  };
}
var LAP = [[128, 150], [200, 118], [272, 150], [200, 206], null];
var TRAVEL = 900;
var DWELL = 1200;
var REST = 1800;
var RESUME = 1200;
var STAGGER = 450;
var GHOST = { pointerType: "ghost" };
var started = 0;
function entry([x, y]) {
  const dx = x - 200, dy = y - 160;
  if (!dx && !dy) return [200, 320];
  const k = Math.min(dx ? (dx > 0 ? 200 : -200) / dx : Infinity, dy ? (dy > 0 ? 160 : -160) / dy : Infinity);
  return [200 + dx * k, 160 + dy * k];
}
function tour(stage, stops, onStop) {
  let i = 0;
  let wait = RESUME + STAGGER * (started++ % 4);
  let t = -1;
  let at2 = null;
  let origin = [200, 320];
  let hand = false, keys2 = stage.contains(stage.ownerDocument.activeElement);
  let gone = false;
  const leave = () => {
    at2 = null;
    t = -1;
    handlers.get(stage)?.leave(GHOST);
  };
  const tick = (dt) => {
    if (hand || keys2 || !stops.length) return false;
    if (reducedMotion()) {
      if (at2) leave();
      return false;
    }
    if (wait > 0) {
      wait -= dt * 1e3;
      return true;
    }
    const stop2 = stops[i];
    if (stop2 === null) {
      if (at2) leave();
      onStop?.(i);
      i = (i + 1) % stops.length;
      wait = REST;
      return true;
    }
    const h = handlers.get(stage);
    if (!h) return true;
    if (t < 0) {
      origin = at2 ?? entry(stop2);
      t = 0;
    }
    t = Math.min(TRAVEL, t + dt * 1e3);
    const k = EASE_LIFT(t / TRAVEL);
    at2 = [origin[0] + (stop2[0] - origin[0]) * k, origin[1] + (stop2[1] - origin[1]) * k];
    h.move(at2, GHOST);
    if (t < TRAVEL) return true;
    onStop?.(i);
    i = (i + 1) % stops.length;
    t = -1;
    wait = DWELL;
    return true;
  };
  const take = () => {
    at2 = null;
    t = -1;
  };
  const give = () => {
    if (hand || keys2) return;
    i = 0;
    t = -1;
    wait = RESUME;
    board.wake();
  };
  const me = {
    hold: () => {
      hand = true;
      take();
    },
    release: () => {
      if (!hand) return;
      hand = false;
      give();
    }
  };
  const focusIn = () => {
    keys2 = true;
    take();
  };
  const focusOut = (e) => {
    if (keys2 && !stage.contains(e.relatedTarget)) {
      keys2 = false;
      give();
    }
  };
  stage.addEventListener("focusin", focusIn);
  stage.addEventListener("focusout", focusOut);
  touring.set(stage, me);
  const board = register(stage, tick);
  return {
    stop: () => {
      if (gone) return;
      gone = true;
      board.unregister();
      stage.removeEventListener("focusin", focusIn);
      stage.removeEventListener("focusout", focusOut);
      if (touring.get(stage) === me) touring.delete(stage);
      if (at2) leave();
    }
  };
}
function disposer() {
  let fns = [];
  return {
    add: (fn) => {
      fns.push(fn);
    },
    on: (target, type, fn, opts) => {
      const h = fn;
      target.addEventListener(type, h, opts);
      fns.push(() => target.removeEventListener(type, h, opts));
    },
    dispose: () => {
      const run2 = fns;
      fns = [];
      for (let i = run2.length - 1; i >= 0; i--) run2[i]();
    }
  };
}
var TABLE = {
  riffle: [0, 40, 90],
  // stagger, ms
  terrain: [1.5, 3, 5],
  // radius, cells
  exploded: [12, 28, 40],
  // gap, viewBox units
  phosphor: [150, 520, 1500],
  // afterglow, ms
  slow: [0.6, 0.2, 0.05],
  // rate, × normal speed
  turntable: [200, 650, 1500],
  // coast, ms
  keyboard: [1, 2, 3.5],
  // radius, keys
  elevator: [40, 100, 220],
  // stiffness, spring units
  phone: [16, 28, 40],
  // gap, viewBox units
  laptop: [100, 125, 150],
  // lid, degrees
  terminal: [1, 2, 3.5],
  // spread, lines
  cabinet: [1.5, 3, 5],
  // reach, blades
  branches: [1, 3, 6],
  // reach, commits
  vault: [250, 600, 1500],
  // coast, ms
  lockers: [55, 90, 120],
  // opening, degrees
  padlock: [45, 90, 100],
  // swing, degrees
  patch: [1, 2.5, 5],
  // radius, ports
  dish: [30, 50, 70],
  // reach, degrees
  router: [0.5, 1.5, 3],
  // spread, antennas
  loupe: [1.3, 1.8, 2.6],
  // magnification, ×
  sieve: [6, 14, 24],
  // gap, viewBox units
  rail: [1, 2, 3.5],
  // radius, hangers
  plug: [0.35, 0.6, 0.9],
  // pull, fraction of the way to the socket
  query: [20, 40, 55],
  // turn, degrees; past 55 the hook folds over itself and stops reading as one
  drawer: [12, 22, 34],
  // pull, viewBox units
  basket: [8, 16, 28],
  // tilt, degrees
  plot: [3, 6, 12],
  // lift, viewBox units
  hub: [10, 16, 24],
  // rise, viewBox units
  relay: [40, 120, 220],
  // delay, ms per hop
  settle: [90, 120, 150],
  // reach, viewBox units from the hub
  format: [9, 12, 14],
  // disorder, degrees of the worst skew
  rebuild: [8, 14, 20],
  // rise, viewBox units
  stack: [22, 34, 46]
  // lift, viewBox units
};
var DEFAULT = 0.5;
function intensity(value) {
  const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) return DEFAULT;
  return Math.min(1, Math.max(0, n));
}
function parameter(figure2, value) {
  const [lo, mid, hi] = TABLE[figure2];
  const i = intensity(value);
  const v = i <= 0.5 ? lo + i / 0.5 * (mid - lo) : mid + (i - 0.5) / 0.5 * (hi - mid);
  return Math.round(v * 1e3) / 1e3;
}
var NS2 = "http://www.w3.org/2000/svg";
var mounted = /* @__PURE__ */ new WeakMap();
var report = (err) => {
  if (typeof reportError === "function") reportError(err);
  else setTimeout(() => {
    throw err;
  });
};
function create(spec, el, options2) {
  if (typeof document === "undefined") {
    throw new Error(`hairline: ${spec.id}() needs a DOM. Call it in the browser, once the element exists: in an effect, in onMount, or in a script after the element.`);
  }
  if (!el || el.nodeType !== 1) {
    throw new TypeError(`hairline: ${spec.id}() takes an element as its first argument, and got ${el === null ? "null" : typeof el}.`);
  }
  mounted.get(el)?.();
  const opts = { ...options2 };
  const doc = el.ownerDocument;
  const root = el.getRootNode();
  inject(root.nodeType === 9 || "host" in root ? root : doc);
  const owned = /* @__PURE__ */ new Set();
  const attr = (name, value2) => {
    if (!owned.has(name) && el.hasAttribute(name)) return;
    if (value2 === null) {
      el.removeAttribute(name);
      owned.delete(name);
    } else {
      el.setAttribute(name, value2);
      owned.add(name);
    }
  };
  const dress = () => {
    attr("data-hairline-theme", opts.theme === "light" || opts.theme === "dark" ? opts.theme : null);
    attr("aria-label", el.hasAttribute("aria-labelledby") ? null : typeof opts.label === "string" ? opts.label : spec.label);
  };
  attr("data-hairline", spec.id);
  attr("role", spec.focusable ? "group" : "img");
  if (spec.focusable) attr("tabindex", "0");
  dress();
  const svg = doc.createElementNS(NS2, "svg");
  svg.setAttribute("viewBox", "0 0 400 320");
  svg.setAttribute("aria-hidden", "true");
  el.appendChild(svg);
  let live = null;
  if (spec.focusable) {
    live = doc.createElement("span");
    live.setAttribute("data-hairline-live", "");
    live.setAttribute("aria-live", "polite");
    el.appendChild(live);
  }
  let text = null;
  let playing = null;
  const read = {
    get textContent() {
      return text;
    },
    set textContent(value2) {
      const next = value2 ?? "";
      if (next === text) return;
      text = next;
      if (live && live.textContent !== next && (!playing || next === spec.rest || el.matches(":hover, :focus-within"))) live.textContent = next;
      const fn = opts.onRead;
      if (typeof fn === "function") try {
        fn(next);
      } catch (err) {
        report(err);
      }
    }
  };
  let value = parameter(spec.id, opts.intensity);
  playing = opts.play === true ? tour(el, spec.tour ?? LAP) : null;
  let engine;
  try {
    engine = spec.engine({ stage: el, svg, read }, value);
  } catch (err) {
    playing?.stop();
    throw err;
  }
  if (text === null) read.textContent = spec.rest;
  let dead = false;
  const destroy = () => {
    if (dead) return;
    dead = true;
    if (mounted.get(el) === destroy) mounted.delete(el);
    playing?.stop();
    playing = null;
    engine.destroy();
    svg.remove();
    live?.remove();
    for (const name of owned) el.removeAttribute(name);
    owned.clear();
  };
  mounted.set(el, destroy);
  return {
    update(next) {
      if (dead || !next) return;
      const own = opts, given = next;
      for (const k in given) {
        if (given[k] === void 0) delete own[k];
        else own[k] = given[k];
      }
      const v = parameter(spec.id, opts.intensity);
      if (v !== value) {
        value = v;
        engine.set(v);
      }
      const play = opts.play === true;
      if (play !== !!playing) {
        playing?.stop();
        playing = play ? tour(el, spec.tour ?? LAP) : null;
      }
      dress();
    },
    destroy
  };
}
var HH = 30;
var GRIP = 9;
var GRIPS = [[-GRIP, HH], [GRIP, HH]];
var D = 30;
var FY = 58;
var RT2 = 2.6;
var PH = 2.4;
var CH = 6;
var BX1 = 7 * D + 15;
var BY1 = FY + 14;
var ZTOP = RT2 + PH + CH;
var N2 = 12;
var U = 10.4;
var BH = 9.6;
var W = 84;
var X1 = W + 10;
var ZB = 11;
var ZT = ZB + (N2 - 1) * U + BH;
var H2 = ZT + 6;
var R = 26;
var FOC = 17;
var DEP = R * R / (4 * FOC);
var N3 = 3;
var Z02 = 5;
var M = 3;
var PITCH = 26;
var ZB3 = Z02 + M;
var H3 = ZB3 + N3 * PITCH + M;
var SY = 34;
var FH = 36;
var CH2 = 25;
var TOP = 3 * FH + CH2 + 7;
var RX = 16.5;
var CW = [-8, 11, -2, 23];
var BASE = fillet([[-16, -2], [33, -2], [33, -56], [76, -56], [76, 38], [-16, 38]], [3, 2, 4, 6, 6, 6]);
var FLOOR = fillet([[33, -56], [72, -56], [72, -6], [43, -6], [43, 34], [33, 34]], [4, 4, 4, 3, 3, 3]);
var CWX = (CW[0] + CW[2]) / 2;
var SR = (RX - CWX) / 2;
var SC = [CWX + SR, SY / 2, TOP + 3 + SR + 2];
var REST_Z = 1.5 * FH - 4;
var G2 = 12;
var WD = 5.5;
var BY12 = 9 * G2 + WD + 8;
var LINES = [
  [0, 56, 0.3, -8, -2, 0],
  [1, 40, 0.75, 8, -1.9, 0],
  [1, 58, 0.3, -8, -0.8, 0],
  [2, 74, 1, -8, -1.9, 0],
  [2, 48, 1, 8, 1.3, 0],
  [1, 34, 0.3, 8, 2, 0],
  [1, 66, 1, -8, -2, 0],
  [2, 52, 1, -8, -0.8, 0],
  [1, 30, 0.45, 8, 2, 0],
  [0, 22, 1, -8, 1.6, 0]
];
var N4 = LINES.length;
var L = (s) => s.split(" ").map((c) => [1, "key " + c]);
var ROWS = [
  [[1, "esc"], ...L("1 2 3 4 5 6 7 8 9 0 - ="), [2, "bksp"]],
  [[1.5, "tab"], ...L("q w e r t y u i o p [ ]"), [1.5, "key \\"]],
  [[1.75, "caps"], ...L("a s d f g h j k l ; '"), [2.25, "enter"]],
  [[2.25, "shift l"], ...L("z x c v b n m , . /"), [2.75, "shift r"]],
  [[1.5, "ctrl l"], [1, "super"], [1.5, "alt l"], [7, "space"], [1.5, "alt r"], [1, "fn"], [1.5, "ctrl r"]]
];
var HB = 4;
var T6 = 2.4;
var HZ = HB + T6 / 2;
var COLS = 6;
var ROWS2 = 2;
var W6 = 24;
var HR2 = 38;
var GAP = 1.2;
var FM = 3;
var BW = COLS * W6 + 2 * FM;
var BH2 = ROWS2 * HR2 + 2 * FM;
var DW = W6 - 2 * GAP;
var DH = HR2 - 2 * GAP;
var OUTLINE = rrect(0, 0, DW, DH, 1.8, 4);
var VENTS = [0, 1, 2].map((k) => rrect(4, DH - 6.6 - k * 3.2, DW - 4, DH - 5.2 - k * 3.2, 0.7, 2));
var PLATE = rrect(DW / 2 - 4.5, DH - 19, DW / 2 + 4.5, DH - 15, 1, 3);
var CUP = rrect(DW - 5.6, DH / 2 - 7, DW - 2.8, DH / 2 + 2, 1.2, 3);
var FRAME = rrect(2.6, 2.6, DW - 2.6, DH - 2.6, 1.4, 3);
var ML = 26;
var R3 = 27;
var GLASS = R3 - 1.4;
var REST7 = [ML + 9, 46];
var D7 = 20;
var YC = D7 / 2;
var VX = Math.SQRT1_2 * Math.sqrt(3);
var NC = 12;
var PITCH2 = 15;
var GAP2 = 8;
var EAR2 = 15;
var MAR = 5;
var X03 = EAR2 + MAR;
var W8 = 2 * X03 + NC * PITCH2 + GAP2;
var W9 = 68;
var L2 = 140;
var TG = 2;
var TB = 1.6;
var TC = 1.8;
var TBAT = 7;
var TS = 6;
var TBUMP = 2.2;
var TL = 0.9;
var STACK = TG + TB + TC + TBAT + TS + TBUMP + TL;
var BOARD = [[4, L2 - 44], [W9 - 4, L2 - 44], [W9 - 4, L2 - 5], [36, L2 - 5], [36, L2 - 30], [4, L2 - 30]];
var BAT = [9, 12, W9 - 9, L2 - 48];
var CHIPS = [
  [10, L2 - 41, 26, L2 - 34, 1.4],
  [45, L2 - 40, 54, L2 - 35, 1.2],
  [57, L2 - 42, 62, L2 - 36, 1.2],
  [42, L2 - 27, 56, L2 - 13, 1.8]
];
var RECT = [[0, 0], [W9, 0], [W9, L2], [0, L2]];
var FOOT2 = [RECT, BOARD, [[BAT[0], BAT[1]], [BAT[2], BAT[1]], [BAT[2], BAT[3]], [BAT[0], BAT[3]]], RECT];
var N5 = 7;
var PITCH3 = 10;
var M2 = 8;
var EXT = M2 * 2 + PITCH3 * (N5 - 1);
var N6 = 7;
var X04 = 13;
var DX = 10;
var L3 = 2 * X04 + (N6 - 1) * DX;
var HP = 34;
var ARC = 5;
var FACE = /* @__PURE__ */ fillet([[L3 - 2, 0], [L3 - 2, HP], [2, HP], [2, 0]], [0.6, 4, 4, 0.6], ARC);
var EDGE = [ARC, 3 * (ARC + 1)];
var LIGHT2 = [-Math.SQRT1_2, -Math.SQRT1_2];
var N8 = 8;
var W10 = 84;
var G3 = 13;
var X12 = W10 + 5;
var Y1 = (N8 - 1) * G3 + 9;
var R12 = 2.1;
var STOP = R12 + 1;
var D9 = [Math.SQRT1_2, -Math.SQRT1_2];
var L6 = 210;
var BW3 = 26;
var BT2 = 5;
var CUBE = 15;
var NC2 = 6;
var SPEED = 1 / 9;
var GATE = L6 * 0.62;
var GH = 38;
var size = (u) => {
  const a = clamp(Math.min(u, 1 - u) / 0.10, 0, 1);
  return a * a * (3 - 2 * a);
};
var RISE2 = L6 / NC2 / 2;
var FALL3 = RISE2 / 2;
var glow = (x) => {
  const d = x - GATE, w = d < 0 ? RISE2 : FALL3;
  return Math.abs(d) >= w ? 0 : Math.cos(Math.PI / 2 * (Math.abs(d) / w)) ** 2;
};
var mount28 = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let slow2 = value, over = null, clock = 2.4;
  const rate = spring(1, { eps: 2e-3 });
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [L6, BW3, 0], [L6, 0, 0], [0, BW3, 0], [0, 0, GH], [GATE, -8, GH]], 200, 168);
  const P = proj(C), front2 = facing(C);
  const g = mk("g", {}, svg);
  const [bR, bI] = rings(0, 0, L6, BW3, 5, 1.3);
  put(solid(g), prism(P, front2, bR, bI, 0, BT2));
  const slats = mk("path", { class: "nf lo" }, g);
  const layer = mk("g", {}, g);
  const pool = [];
  for (let j = 0; j < NC2; j++) {
    const el = { ...solid(layer), dots: [] };
    for (let k = 0; k < 9; k++) el.dots.push(flatDot(el.g, C, 1, "dot off"));
    pool.push(el);
  }
  const gate = [[-8, -3, 0, GH - 4, GATE - 5.5], [BW3 + 3, BW3 + 8, 0, GH - 4, GATE + BW3 + 5.5], [-8, BW3 + 8, GH - 4, GH, GATE + BW3 + 8.5]].map(([y0, y1, z0, z1, key]) => {
    const el = solid(layer), [rg, ig] = rings(GATE - 1.6, y0, GATE + 1.6, y1, 1.4, 0.6);
    put(el, prism(P, front2, rg, ig, z0, z1));
    el.sil.style.transition = "none";
    return { el, key };
  });
  const lifts = Array.from({ length: NC2 }, () => spring(0, { eps: 0.03 }));
  let hot = -1, order2 = "", gatePct = 0;
  const B6 = register(stage, (dt) => {
    let m = stepS(rate, dt);
    const base = reducedMotion() ? 0 : 1;
    if (!over) rate.t = base;
    clock += dt * rate.x;
    const items = [];
    for (let j = 0; j < NC2; j++) {
      const q = j / NC2 + clock * SPEED, u = q - Math.floor(q), lap = Math.floor(q);
      items.push({ j, x: u * L6, s: size(u), serial: 141 + lap * NC2 + j });
    }
    let want = -1;
    if (over) {
      let best = 34;
      for (const it of items) if (it.s > 0.6 && Math.abs(it.x - over[0]) < best) {
        best = Math.abs(it.x - over[0]);
        want = it.j;
      }
    }
    hot = want;
    lifts.forEach((sp, j) => {
      sp.t = j === hot ? 11 : 0;
      if (stepS(sp, dt)) m = true;
    });
    items.sort((a, b) => a.x - b.x);
    let gateGlow = 0, hotSerial = 0;
    const draw = gate.map((p, i) => ({ id: "g" + i, key: p.key, g: p.el.g }));
    items.forEach((it, k) => {
      const el = pool[k], sz = CUBE * it.s, x0 = it.x - sz / 2, x1 = it.x + sz / 2, y0 = BW3 / 2 - sz / 2, y1 = BW3 / 2 + sz / 2;
      const z0 = BT2 + lifts[it.j].x, z1 = z0 + sz;
      draw.push({ id: k, key: it.x + BW3 / 2, g: el.g });
      if (sz < 0.3) {
        el.g.setAttribute("visibility", "hidden");
        return;
      }
      el.g.removeAttribute("visibility");
      const [rg, ig] = rings(x0, y0, x1, y1, 2.6 * it.s, 0.9 * it.s);
      put(el, prism(P, front2, rg, ig, z0, z1));
      const isHot = it.j === hot;
      el.sil.classList.toggle("hi", isHot);
      const pitch = sz * 0.2, rr = r2(0.55 * it.s * C.S);
      el.dots.forEach((d, b) => {
        place(d, P(it.x + (b % 3 - 1) * pitch, BW3 / 2 + (Math.floor(b / 3) - 1) * pitch, z1));
        d.setAttribute("rx", String(rr));
        d.setAttribute("ry", String(r2(rr * C.k)));
        d.setAttribute("class", it.serial >> b & 1 ? isHot ? "dot" : "dot m" : "dot off");
      });
      if (isHot) hotSerial = it.serial;
      gateGlow = Math.max(gateGlow, glow(it.x) * it.s);
    });
    draw.sort((a, b) => a.key - b.key);
    const sig = draw.map((d) => d.id).join();
    if (sig !== order2) {
      order2 = sig;
      draw.forEach((d) => layer.appendChild(d.g));
    }
    const pct = Math.round(gateGlow * 100);
    if (pct !== gatePct) {
      gatePct = pct;
      const stroke = pct ? `color-mix(in srgb, var(--hl-hi) ${pct}%, var(--hl-edge))` : "";
      gate.forEach((p) => {
        p.el.sil.style.stroke = stroke;
      });
    }
    const off = (clock * SPEED * L6 % 21 + 21) % 21, sl = [];
    for (let x = off; x < L6; x += 21) if (x > 5 && x < L6 - 5) sl.push(seg(P(x, 4, BT2), P(x, BW3 - 4, BT2)));
    slats.setAttribute("d", sl.join(""));
    read.textContent = `rate ${rate.x.toFixed(2)}\xD7` + (hot >= 0 ? ` \xB7 #${String(hotSerial).padStart(4, "0")}` : "");
    if (reducedMotion() && !over && rate.x === 0) return m;
    return true;
  });
  bag.add(B6.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      over = unproj(C, p[0], p[1], BT2);
      rate.t = slow2;
      B6.wake();
    },
    leave: () => {
      over = null;
      B6.wake();
    }
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => {
    slow2 = v;
    if (over) rate.t = v;
    B6.wake();
  }, destroy: bag.dispose };
};
var N11 = 24;
var V = 7;
var G4 = 11;
var TB2 = 17;
var PB3 = 17;
var VA = PB3 + V * G4;
var H9 = VA + TB2;
var REST_TOP = N11 - V - 2.6;
var N12 = 9;
var CELL = 14;
var EXT2 = N12 * CELL;
var R8 = 40;
var HX = -R8 - 8;
var V2 = [Math.SQRT1_2 * Math.sqrt(0.75), Math.SQRT1_2 * Math.sqrt(0.75), 0.5];
function slow(el, options2) {
  return create({
    id: "slow",
    label: "Crates riding a belt through a gate. Hovering slows the clock without stopping it.",
    rest: "rate 1.00\xD7",
    engine: mount28
  }, el, options2);
}

// web/src/provider-logos.json
var provider_logos_default = {
  google: {
    data: "data:image/x-icon;base64,AAABAAIAEBAAAAEAIABoBAAAJgAAACAgAAABACAAqBAAAI4EAAAoAAAAEAAAACAAAAABACAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zD9/f2W/f392P39/fn9/f35/f391/39/ZT+/v4uAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Cf39/Zn///////////////////////////////////////////39/ZX///8IAAAAAAAAAAAAAAAA/v7+Cf39/cH/////+v35/7TZp/92ul3/WKs6/1iqOv9yuFn/rNWd//j79v///////f39v////wgAAAAAAAAAAP39/Zn/////7PXp/3G3WP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP+Or1j//vDo///////9/f2VAAAAAP///zD/////+vz5/3G3V/9TqDT/WKo6/6LQkf/U6cz/1urO/6rUm/+Zo0r/8IZB//adZ////v7///////7+/i79/f2Y/////4nWzf9Lqkj/Vqo4/9Xqzv///////////////////////ebY//SHRv/0hUL//NjD///////9/f2U/f392v////8sxPH/Ebzt/43RsP/////////////////////////////////4roL/9IVC//i1jf///////f391/39/fr/////Cr37/wW8+/+16/7/////////////////9IVC//SFQv/0hUL/9IVC//SFQv/3pnX///////39/fn9/f36/////wu++/8FvPv/tuz+//////////////////SFQv/0hUL/9IVC//SFQv/0hUL/96p7///////9/f35/f392/////81yfz/CrL5/2uk9v///////////////////////////////////////////////////////f392P39/Zn/////ks/7/zdS7P84Rur/0NT6///////////////////////9/f////////////////////////39/Zb+/v4y//////n5/v9WYu3/NUPq/ztJ6/+VnPT/z9L6/9HU+v+WnfT/Ul7t/+Hj/P////////////////////8wAAAAAP39/Z3/////6Or9/1hj7v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9sdvD////////////9/f2YAAAAAAAAAAD///8K/f39w//////5+f7/paz2/11p7v88Suv/Okfq/1pm7v+iqfX/+fn+///////9/f3B/v7+CQAAAAAAAAAAAAAAAP///wr9/f2d///////////////////////////////////////////9/f2Z/v7+CQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f2Z/f392/39/fr9/f36/f392v39/Zj///8wAAAAAAAAAAAAAAAAAAAAAPAPAADAAwAAgAEAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAACAAQAAwAMAAPAPAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/g3+/v5X/f39mf39/cj9/f3q/f39+f39/fn9/f3q/f39yP39/Zn+/v5W////DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f2c/f399f/////////////////////////////////////////////////////9/f31/f39mv7+/iMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gn9/f2K/f39+////////////////////////////////////////////////////////////////////////////f39+v39/Yf///8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4k/f390v////////////////////////////////////////////////////////////////////////////////////////////////39/dD///8iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////MP39/er//////////////////////////+r05v+v16H/gsBs/2WxSf9Wqjj/Vqk3/2OwRv99vWX/pdKV/97u2P////////////////////////////39/ej+/v4vAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/iT9/f3q/////////////////////+v15/+Pxnv/VKk2/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/36+Z//d7tf///////////////////////39/ej///8iAAAAAAAAAAAAAAAAAAAAAAAAAAD///8K/f390//////////////////////E4bn/XKw+/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1apN/+x0pv///////////////////////39/dD///8IAAAAAAAAAAAAAAAAAAAAAP39/Yv/////////////////////sdij/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9TqDT/YKU1/8qOPv/5wZ////////////////////////39/YcAAAAAAAAAAAAAAAD+/v4l/f39+////////////////8Lgt/9TqDT/U6g0/1OoNP9TqDT/U6g0/1OoNP9utlT/n86N/7faqv+426v/pdKV/3u8ZP9UqDX/U6g0/3egN//jiUH/9IVC//SFQv/82MP//////////////////f39+v7+/iMAAAAAAAAAAP39/Z3////////////////q9Ob/W6w+/1OoNP9TqDT/U6g0/1OoNP9nskz/zOXC/////////////////////////////////+Dv2v+osWP/8YVC//SFQv/0hUL/9IVC//WQVP/++fb//////////////////f39mgAAAAD+/v4O/f399v///////////////4LHj/9TqDT/U6g0/1OoNP9TqDT/dblc//L58P/////////////////////////////////////////////8+v/3p3f/9IVC//SFQv/0hUL/9IVC//rIqf/////////////////9/f31////DP7+/ln////////////////f9v7/Cbz2/zOwhv9TqDT/U6g0/2KwRv/v9+z///////////////////////////////////////////////////////738//1kFT/9IVC//SFQv/0hUL/9plg///////////////////////+/v5W/f39nP///////////////4jf/f8FvPv/Bbz7/yG1s/9QqDz/vN2w//////////////////////////////////////////////////////////////////rHqP/0hUL/9IVC//SFQv/0hUL//vDn//////////////////39/Zn9/f3L////////////////R878/wW8+/8FvPv/Bbz7/y7C5P/7/fr//////////////////////////////////////////////////////////////////ere//SFQv/0hUL/9IVC//SFQv/718H//////////////////f39yP39/ez///////////////8cwvv/Bbz7/wW8+/8FvPv/WNL8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//rIqv/////////////////9/f3q/f39+v///////////////we9+/8FvPv/Bbz7/wW8+/993P3///////////////////////////////////////SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/+cGf//////////////////39/fn9/f36////////////////B737/wW8+/8FvPv/Bbz7/33c/f//////////////////////////////////////9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/6xaX//////////////////f39+f39/e3///////////////8cwvv/Bbz7/wW8+/8FvPv/WdP8///////////////////////////////////////0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//SFQv/0hUL/9IVC//vVv//////////////////9/f3q/f39y////////////////0bN/P8FvPv/Bbz7/wW8+/8hrvn/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////39/cj9/f2c////////////////ht/9/wW8+/8FvPv/FZP1/zRJ6/+zuPf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39mf7+/lr////////////////d9v7/B7n7/yB38f81Q+r/NUPq/0hV7P/u8P3////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v5X////D/39/ff///////////////9tkPT/NUPq/zVD6v81Q+r/NUPq/2Fs7//y8v7////////////////////////////////////////////09f7//////////////////////////////////////////////////f399f7+/g0AAAAA/f39n////////////////+Tm/P89Suv/NUPq/zVD6v81Q+r/NUPq/1Bc7f/IzPn/////////////////////////////////x8v5/0xY7P+MlPP////////////////////////////////////////////9/f2cAAAAAAAAAAD+/v4n/f39/P///////////////7W69/81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v9ZZe7/k5v0/6609/+vtff/lJv0/1pm7v81Q+r/NUPq/zVD6v+GjvL//v7//////////////////////////////f39+/7+/iQAAAAAAAAAAAAAAAD9/f2N/////////////////////6Cn9f81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v+BivL////////////////////////////9/f2KAAAAAAAAAAAAAAAAAAAAAP7+/gv9/f3V/////////////////////7W69/8+S+v/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/P0zr/7q/+P///////////////////////f390v7+/gkAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3r/////////////////////+Xn/P94gfH/NkTq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NUPq/zVD6v81Q+r/NkTq/3Z/8f/l5/z///////////////////////39/er+/v4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/jL9/f3r///////////////////////////k5vz/nqX1/2p08P9IVez/OEbq/zdF6v9GU+z/aHLv/5qh9f/i5Pz////////////////////////////9/f3q////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/ib9/f3V/////////////////////////////////////////////////////////////////////////////////////////////////f390v7+/iQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wr9/f2N/f39/P///////////////////////////////////////////////////////////////////////////f39+/39/Yv+/v4JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+/v4n/f39n/39/ff//////////////////////////////////////////////////////f399v39/Z3+/v4lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/v7+Dv7+/lr9/f2c/f39y/39/e39/f36/f39+v39/ez9/f3L/f39nP7+/ln+/v4OAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AA///AAD//AAAP/gAAB/wAAAP4AAAB8AAAAPAAAADgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/8AAP//wAP/",
    sourceURL: "https://www.google.com/favicon.ico"
  },
  microsoft: {
    data: "data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAABILAAASCwAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD+0k4S/NFTevzNUtb6yFL/98JQ//W8Tv/ytEz/76tIuO6hREf///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A/tVSNv7UVeT80VX/+81T//rIUv/3wlD/9bxO//K0TP/vq0n/76JG/++YQrjwijcS////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP/WUzb+1lby/tRW//zRVf/7zVP/+shS//fCUP/1vE7/8rRM/++rSf/uokb/75hD//COP/Lxgzp6////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD/108S/9dX8v7WVv/+1Fb//NFV//vNU//6yFL/98JQ//S8Tv/ytEz/7qtJ/+6hRf/umEP/8I4///CEO//xezfH8HEyJP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP/YVInrk0Tz310u6dxTKffjcDbn8adK9vrIUv/3wlD/9LxO//K0TP/uq0n/7qFF/+6XQv/vjT7/74M7/+96N//ucDLy7mYsWP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A64RB7N9PI//fTiH/304h/99OIf/fUCT/5XE67vfCUP/0vE7/8bNL/+6qSf/toUX/7ZZB/+6MPf/ugjn/7ng1/+xuMP/qZSz/4381vf///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APerRWHkWiz/41Qk/+NUJP/jVCT/41Qk/+NUJP/jVCT/98JPR/S7TOTxs0v/7apI/+ygRP/slkH/7Ys8/+yAN//rdjP/6Wwt/+dhKP/jWyT31NxgQP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A6nAwUudbJ//nWyf/51sn/+dbJ//nWyf/51sn/+dbJ/////8A////APGySInsqUfy7J9D/+uUP//riTr/6n41/+lzMP/maCr/410k/95THv/V212w////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDqYStF6mEr/+phK//qYSv/6mEr/+phK//qYSv/6mEr/////wD///8A////AOynRCTqnUC46ZI9/+mHOP/nezP/5XAt/+JkJv/eWB//2FAZ99bbWv/V3F8Q////AP///wD///8A////AP///wD///8A////AP///wD///8A////AO1oLUXtaC3/7Wgt/+1oLf/taC3/7Wgt/+1oLf/taC3/////AP///wD///8A////AP///wDnkDpH5oQ01uR4L//hbCn/3V8h/9hTGv/VbyHq19pV/9XbXED///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A724vRe9uL//vbi//724v/+9uL//vbi//724v/+9uL/////8A////AP///wD///8A////AP///wD///8A4HMqetxnJPLXWRv/1GMZ7dvOQv/Z2k//1ttYQP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wDyczFF8nMx//JzMf/yczH/8nMx//JzMf/yczH/8nMx/////wD///8A////AP///wD///8A////AO3NGxDp0BRg5MYctt2wIv/f1jT/3NhA/9rZSv/Y2lNA////AP///wD///8A////AP///wD///8A////AP///wD///8A////APR6MkX0ejL/9Hoy//R6Mv/0ejL/9Hoy//R6Mv/0ejL/////AP///wD///8A////APbEKhDzxyWQ78of/+vOGP/n0RT/5NMh/+HVLf/e1zn/29hF/9naTjD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A9YAzRfWAM//1gDP/9YAz//WAM//1gDP/9YAz//WAM/////8A////AP///wD///8A+MMswPXFKP/xyCL/7cwc/+nQFf/l0hr/49Qm/+DWMv/d1z/g////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD3hzRF94c0//eHNP/3hzT/94c0//eHNP/3hzT/94c0/////wD///8A////APzAMiD5wi7/98Qq//TGJv/wyiD/7M4Z/+fREv/k0h//4dQr/97WN4D///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APiNNUX4jTX/+I01//iNNf/4jTX/+I01//iNNf/4jTX/////AP///wD///8A/b8zkPvBMP/4wyz/9sUp//LII//uyx3/6s8W/+bSGP/j0yTQ4NUwEP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A+pI2RfqSNv/6kjb/+pI2//qSNv/6kjb/+pI2//qSNv////8A////AP///wD9vzTw/L8y//rBL//3wyv/9MYn//DJIP/szRr/6NET8OXSHTD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD7mDdF+5g3//uYN//7mDf/+5g3//uYN//7mDf/+5g3/////wD///8A/r42UP6+Nf/9vzP/+8Ax//nCLf/2xCn/88ck/+/LHsDrzxcQ////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APudN0X7nTf/+503//udN//7nTf/+503//udN//7nTf/////AP///wD/vTew/r41//6+NP/9vzP/+sEv//jDLMD1xShA////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A+qA4RfqgOP/6oDj/+qA4//qgOP/6oDj/+qA4//qgOP////8A////AP+9N/D/vTb//r41//2/NOD8wDFQ////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD5ozhF+aM4//mjOP/5ozj/+aM4//mjOP/5ozj/+aM4/////wD///8A/703MP+9N8D+vjZg////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APmnOUX5pzn/+ac5//mnOf/5pzn/+ac5//mnOf/5pzn/////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A+ao5RfmqOf/5qjn/+ao5//mqOf/5qjn/+ao5//mqOf////8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD5rTlF+a05//mtOf/5rTn/+a05//mtOf/5rTn/+a05/////wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APixOkX4sTr/+LE6//ixOv/4sTr/+LE6//ixOv/4sTr/////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A97M6RfezOv/3szr/97M6//ezOv/3szr/97M6//ezOfH///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD3tztF97c7//e3O//3tzv/97c7//e3O//3tzv/97c6hv///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////APa6O0X2ujv/9ro7//a6O//2ujv/9ro7//a6Oob///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A9b08RfW9PP/1vTz/9b08//W9O9T1vTs0////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD1wD4S9b871PW/O/H1vzp2////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A///////AH///gAf//wAD//4AAP/+AAB//gAAP/wAAB/8AwAf/AOAD/wD4A/8A/gP/APwD/wDwA/8A8Af/AOAH/wDgB/8A4A//AMAf/wDAf/8Awf//AMf//wD///8A////AP///wD///8A////AP///wH///8D////D////////8=",
    sourceURL: "https://www.bing.com/favicon.ico"
  },
  openai: {
    data: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIABoJgAANgAAACAgAAABACAAKBEAAJ4mAAAQEAAAAQAgAGgEAADGNwAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////I////5D////S////7f////r////9///////////////9////+v///+3////S////kP///yMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////EP///6D////v///////////////////////////////////////////////////////////////////////////////v////oP///xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL///+7/////f////////////////////////////////////////////////////////////////////////////////////////////////////3///+7////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////if////v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+////4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL////c///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////c////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Mf////f/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////zEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9F////+///////////////////////////////////////////////////////////////////////////n5+f/0BAQP8QEBD/AAAA/xAQEP9AQED/f39//+/v7/////////////////////////////////////////////////v///9FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zH////7/////////////////////////////////////////////////////////////////////8/Pz/8gICD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/xAQEP+Pj4/////////////////////////////////////////////////7////MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Ev////f/////////////////////////////////////39/f/2BgYP8wMDD/AAAA/wAAAP8gICD/UFBQ/wAAAP8AAAD/ICAg/6CgoP/Pz8///////+/v7/+/v7//YGBg/wAAAP8AAAD/X19f////////////////////////////////////////////////9////xIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////3P///////////////////////////////9/f3/9gYGD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8QEBD/v7+//////////////////////////////////8/Pz/8gICD/AAAA/39/f////////////////////////////////////////////////9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+J////////////////////////////////39/f/yAgIP8AAAD/AAAA/2BgYP+/v7//7+/v///////f39//kJCQ/yAgIP8AAAD/AAAA/1BQUP/f39/////////////////////////////f39//EBAQ/wAAAP/f39////////////////////////////////////////////////+JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL////7////////////////////////////////QEBA/wAAAP8gICD/39/f/////////////////////////////////+/v7/+AgID/EBAQ/wAAAP8QEBD/f39//+/v7///////////////////////kJCQ/wAAAP9gYGD////////////////////////////////////////////////7////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///7v///////////////////////////////+Pj4//AAAA/yAgIP/f39//////////////////////////////////////////////////7+/v/2BgYP8AAAD/AAAA/yAgIP+fn5//////////////////39/f/wAAAP8gICD/7+/v////////////////////////////////////////////////uwAAAAAAAAAAAAAAAAAAAAAAAAAA////EP////3///////////////////////////////8wMDD/AAAA/6CgoP//////////////////////39/f/2BgYP9wcHD/39/f//////////////////////+/v7//QEBA/wAAAP8AAAD/QEBA/////////////////zAwMP8AAAD/AAAA/2BgYP/f39///////////////////////////////////////f///xAAAAAAAAAAAAAAAAAAAAAA////oP///////////////////////////////9/f3/8AAAD/EBAQ//////////////////////9/f3//AAAA/wAAAP8AAAD/EBAQ/39/f//v7+///////////////////////5+fn/8AAAD/AAAA/9/f3////////////0BAQP8AAAD/AAAA/wAAAP8QEBD/z8/P/////////////////////////////////////6AAAAAAAAAAAAAAAAAAAAAA////7////////////////////////////////5+fn/8AAAD/UFBQ////////////n5+f/yAgIP8AAAD/AAAA/2BgYP9AQED/AAAA/wAAAP8gICD/r6+v//////////////////////8gICD/AAAA/9/f3////////////0BAQP8AAAD/n5+f/0BAQP8AAAD/EBAQ/9/f3////////////////////////////////+8AAAAAAAAAAAAAAAD///8j/////////////////////////////////////5+fn/8AAAD/YGBg/9/f3/8wMDD/AAAA/wAAAP8gICD/z8/P////////////v7+//0BAQP8AAAD/AAAA/0BAQP+/v7////////////8gICD/AAAA/9/f3////////////0BAQP8AAAD/v7+///////9wcHD/AAAA/yAgIP////////////////////////////////////8jAAAAAAAAAAD///+Q/////////////////////////////////////7CwsP8AAAD/EBAQ/wAAAP8AAAD/ICAg/6CgoP///////////////////////////39/f/8AAAD/AAAA/wAAAP8AAAD/b29v/+/v7/8gICD/AAAA/9/f3////////////0BAQP8AAAD/v7+/////////////ICAg/wAAAP+fn5////////////////////////////////+QAAAAAAAAAAD////S/////////////////////////////////////7+/v/8AAAD/AAAA/wAAAP+AgID/7+/v//////////////////////+fn5//ICAg/wAAAP8AAAD/YGBg/4CAgP8QEBD/AAAA/xAQEP8QEBD/AAAA/9/f3////////////0BAQP8AAAD/v7+/////////////n5+f/wAAAP9AQED////////////////////////////////SAAAAAAAAAAD////t////////////////////////////////39/f/yAgIP8AAAD/MDAw/9/f3///////////////////////39/f/zAwMP8AAAD/AAAA/zAwMP/f39/////////////f39//YGBg/wAAAP8AAAD/AAAA/9/f3////////////0BAQP8AAAD/v7+/////////////7+/v/wAAAP8AAAD////////////////////////////////tAAAAAAAAAAD////6////////////////////////////////QEBA/wAAAP9AQED//////////////////////9/f3/9gYGD/AAAA/wAAAP8AAAD/kJCQ/////////////////////////////////7+/v/8QEBD/AAAA/9/f3////////////0BAQP8AAAD/v7+//////////////////yAgIP8AAAD/39/f///////////////////////////6AAAAAAAAAAD////9//////////////////////////+/v7//AAAA/xAQEP/v7+//////////////////j4+P/yAgIP8AAAD/AAAA/wAAAP8AAAD/39/f//////////////////////////////////////8gICD/AAAA/9/f3////////////0BAQP8AAAD/v7+//////////////////yAgIP8AAAD/39/f///////////////////////////9AAAAAAAAAAD///////////////////////////////9wcHD/AAAA/4CAgP////////////////9AQED/AAAA/wAAAP9gYGD/39/f/yAgIP8AAAD/39/f//////////////////////////////////////8gICD/AAAA/9/f3///////n5+f/xAQEP8AAAD/z8/P////////////7+/v/wAAAP8QEBD/////////////////////////////////AAAAAAAAAAD///////////////////////////////8gICD/AAAA/7+/v/////////////////8AAAD/AAAA/5CQkP///////////yAgIP8AAAD/39/f//////////////////////////////////////8gICD/AAAA/7+/v/8gICD/AAAA/wAAAP9AQED/7+/v////////////gICA/wAAAP9AQED/////////////////////////////////AAAAAAAAAAD////9//////////////////////////8QEBD/AAAA/9/f3/////////////////8AAAD/AAAA/////////////////yAgIP8AAAD/39/f//////////////////////////////////////8gICD/AAAA/wAAAP8AAAD/ICAg/6CgoP/////////////////v7+//EBAQ/wAAAP+/v7/////////////////////////////////9AAAAAAAAAAD////6//////////////////////////8QEBD/AAAA/9/f3/////////////////8AAAD/AAAA/////////////////yAgIP8AAAD/b29v/+/v7////////////////////////////5+fn/8QEBD/AAAA/wAAAP+AgID///////////////////////////9QUFD/AAAA/0BAQP/////////////////////////////////////6AAAAAAAAAAD////t//////////////////////////9AQED/AAAA/7+/v/////////////////8AAAD/AAAA/////////////////yAgIP8AAAD/AAAA/xAQEP+Pj4////////////+fn5//ICAg/wAAAP8AAAD/YGBg/9/f3///////////////////////39/f/yAgIP8AAAD/ICAg/9/f3//////////////////////////////////////tAAAAAAAAAAD////S//////////////////////////9wcHD/AAAA/2BgYP////////////////8AAAD/AAAA/////////////////yAgIP8AAAD/MDAw/wAAAP8AAAD/MDAw/1BQUP8AAAD/AAAA/yAgIP+vr6///////////////////////9/f3/9gYGD/AAAA/wAAAP8AAAD/oKCg///////////////////////////////////////////SAAAAAAAAAAD///+Q///////////////////////////f39//AAAA/wAAAP/f39////////////8AAAD/AAAA/////////////////yAgIP8AAAD/39/f/7+/v/8gICD/AAAA/wAAAP8AAAD/gICA////////////////////////////f39//yAgIP8AAAD/AAAA/yAgIP8AAAD/gICA//////////////////////////////////////////+QAAAAAAAAAAD///8j////////////////////////////////cHBw/wAAAP8gICD/39/f//////8AAAD/AAAA/////////////////yAgIP8AAAD/39/f////////////gICA/xAQEP8AAAD/AAAA/39/f//v7+///////5+fn/8gICD/AAAA/wAAAP9gYGD/39/f/4CAgP8AAAD/YGBg//////////////////////////////////////////8jAAAAAAAAAAAAAAAA////7////////////////////////////////zAwMP8AAAD/EBAQ/39/f/8AAAD/AAAA/////////////////yAgIP8AAAD/39/f/////////////////+/v7/9gYGD/AAAA/wAAAP8QEBD/QEBA/wAAAP8AAAD/ICAg/6CgoP///////////3BwcP8AAAD/gICA/////////////////////////////////////+8AAAAAAAAAAAAAAAAAAAAA////oP///////////////////////////////+/v7/9AQED/AAAA/wAAAP8AAAD/AAAA/////////////////zAwMP8AAAD/UFBQ/9/f3///////////////////////v7+//0BAQP8AAAD/AAAA/yAgIP+QkJD//////////////////////zAwMP8AAAD/r6+v/////////////////////////////////////6AAAAAAAAAAAAAAAAAAAAAA////EP////3/////////////////////////////////////n5+f/0BAQP8AAAD/AAAA/8/Pz////////////5CQkP8QEBD/AAAA/xAQEP9/f3//7+/v//////////////////////+fn5//cHBw/9/f3///////////////////////v7+//wAAAP8QEBD/7+/v/////////////////////////////////f///xAAAAAAAAAAAAAAAAAAAAAAAAAAAP///7v///////////////////////////////////////////////9gYGD/AAAA/5+fn//////////////////v7+//cHBw/wAAAP8AAAD/EBAQ/5+fn//////////////////////////////////////////////////f39//ICAg/wAAAP+AgID/////////////////////////////////////uwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL////7//////////////////////////////////////////+wsLD/AAAA/yAgIP///////////////////////////7+/v/9AQED/AAAA/wAAAP9AQED/v7+//////////////////////////////////9/f3/8gICD/AAAA/zAwMP/v7+/////////////////////////////////7////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+J////////////////////////////////////////////////ICAg/wAAAP9/f3//////////////////////////////////n5+f/yAgIP8AAAD/AAAA/0BAQP+fn5//v7+//7+/v/+fn5//UFBQ/wAAAP8AAAD/ICAg/9/f3/////////////////////////////////////+JAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////3P//////////////////////////////////////////39/f/xAQEP8AAAD/b29v/+/v7////////////////////////////8/Pz/8gICD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9wcHD/7+/v/////////////////////////////////////9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Ev////f//////////////////////////////////////////8/Pz/8QEBD/AAAA/xAQEP9wcHD/r6+v/7+/v/+vr6//YGBg/yAgIP8AAAD/AAAA/4CAgP9gYGD/QEBA/0BAQP9QUFD/kJCQ/9/f3///////////////////////////////////////////9////xIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zH////7///////////////////////////////////////////f39//QEBA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8gICD/39/f///////////////////////////////////////////////////////////////////////////7////MQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///9F////+////////////////////////////////////////////////7+/v/9wcHD/UFBQ/0BAQP9AQED/cHBw/7+/v/////////////////////////////////////////////////////////////////////////////////v///9FAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Mf////f/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9////zEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL////c///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////c////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////if////v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+////4kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xL///+7/////f////////////////////////////////////////////////////////////////////////////////////////////////////3///+7////EgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////EP///6D////v///////////////////////////////////////////////////////////////////////////////v////oP///xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////I////5D////S////7f////r////9///////////////9////+v///+3////S////kP///yMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8V////J////yv///8s////LP///yv///8n////FQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wL///9e////mv///9f////5//////////////////////////n////X////mv///17///8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wf///9S////zP////v/////////////////////////////////////////////////////////+////8z///9S////BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8h////tv////////////////////////////////////////////////////////////////////////////////////////+2////IQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////NP///9X///////////////////////////////////////////v7+//X19f/ysrK/9DQ0P/p6en////////////////////////////////V////NAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zP////l///////////////////////////////////////////Gxsb/R0dH/wwMDP8AAAD/BAQE/ygoKP+AgID/8/Pz///////////////////////////l////MwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8e////1v////////////////v7+/+/v7//V1dX/xoaGv8UFBT/Pj4+/xAQEP8vLy//ra2t/9ra2v/Ozs7/fX19/xgYGP9PT0//8fHx///////////////////////////W////HgAAAAAAAAAAAAAAAAAAAAAAAAAA////Cf///7b////////////////19fX/Y2Nj/wMDA/8/Pz//iIiI/5eXl/9iYmL/DQ0N/zU1Nf+vr6//////////////////2NjY/x8fH/9ubm7///////////////////////////////+2////CQAAAAAAAAAAAAAAAAAAAAD///9S/////v///////////Pz8/35+fv8HBwf/n5+f//X19f/////////////////MzMz/UVFR/w4ODv9WVlb/zc3N////////////oKCg/xUVFf/k5OT///////////////////////////7///9SAAAAAAAAAAAAAAAA////BP///83////////////////c3Nz/ERER/4ODg////////////+7u7v+bm5v/0dHR////////////s7Oz/zk5Of8SEhL/e3t7//7+/v/n5+f/FhYW/0NDQ/+1tbX//////////////////////////83///8EAAAAAAAAAAD///9d////+v///////////////6Wlpf8NDQ3/7u7u//r6+v+zs7P/JSUl/w8PD/8PDw//d3d3/+fn5///////9vb2/3Fxcf8FBQX/6Ojo//T09P8qKir/ERER/wkJCf+Ojo7/////////////////////+v///10AAAAAAAAAAP///5r/////////////////////f39//zU1Nf/Dw8P/RERE/wQEBP9eXl7/xcXF/5aWlv8dHR3/KCgo/5SUlP/+/v7/vr6+/w0NDf/l5eX/8/Pz/yQkJP+Ojo7/lpaW/woKCv+fn5//////////////////////mgAAAAD///8V////1/////////////////////+YmJj/BQUF/wcHB/87Ozv/t7e3////////////09PT/z4+Pv8EBAT/ExMT/0hISP9+fn7/EBAQ/+Xl5f/z8/P/IyMj/5aWlv//////V1dX/y0tLf/u7u7////////////////X////Ff///yf////5////////////////8vLy/05OTv8UFBT/mJiY//n5+f//////6enp/2tra/8RERH/QUFB/8TExP/Ly8v/U1NT/wEBAf8RERH/5ubm//Pz8/8jIyP/k5OT///////IyMj/BAQE/83Nzf////////////////n///8n////K/////////////////////99fX3/CgoK/8TExP//////9fX1/5WVlf8WFhb/AAAA/2lpaf/5+fn////////////9/f3/ioqK/wsLC//m5ub/9/f3/yUlJf+SkpL//////+np6f8LCwv/srKy/////////////////////yv///8s////////////////7e3t/yoqKv9xcXH//////+Dg4P9AQED/Dw8P/3p6ev8VFRX/lpaW//////////////////////+2trb/Dg4O/+jo6P+7u7v/BQUF/5ycnP//////2tra/wMDA//ExMT/////////////////////LP///yz////////////////R0dH/BAQE/729vf//////v7+//wAAAP+wsLD//////x0dHf+VlZX//////////////////////7i4uP8MDAz/Wlpa/wYGBv9ERET/2dnZ//////90dHT/HBwc/+Xl5f////////////////////8s////K////////////////87Ozv8AAAD/zc3N//////+/v7//AAAA/+3t7f/8/Pz/ICAg/1paWv/r6+v////////////29vb/fX19/wAAAP8gICD/qqqq//n5+f//////x8fH/w4ODv9+fn7//////////////////////////yv///8n////+f//////////3d3d/xYWFv+ioqL//////7+/v/8AAAD/6enp//z8/P8nJyf/BAQE/x8fH/+lpaX/sbGx/y4uLv8UFBT/gYGB/+zs7P//////7+/v/5OTk/8ODg7/SUlJ//Ly8v/////////////////////5////J////xX////X///////////5+fn/SUlJ/zIyMv/+/v7/xsbG/wAAAP/p6en//Pz8/x4eHv9zc3P/dHR0/woKCv8AAAD/OTk5/9DQ0P///////Pz8/6qqqv81NTX/CAgI/w0NDf95eXn//////////////////////////9f///8VAAAAAP///5r////////////////Hx8f/Dw8P/2lpaf+goKD/AAAA/+np6f/8/Pz/Ghoa/5qamv//////v7+//0lJSf8GBgb/bGxs/7a2tv9MTEz/AgIC/1FRUf/R0dH/SUlJ/1xcXP//////////////////////////mgAAAAAAAAAA////Xf////r///////////////+urq7/FhYW/w0NDf8BAQH/6Ojo//7+/v8oKCj/QUFB/9zc3P///////v7+/6Ghof8mJib/BgYG/zc3N/+2trb/+fn5//X19f8eHh7/iIiI//////////////////////r///9dAAAAAAAAAAD///8E////zf/////////////////////Y2Nj/b29v/wkJCf/BwcH//////6ioqP8yMjL/FRUV/4eHh//t7e3//////+zs7P+srKz/7+/v////////////kZGR/woKCv/Ozs7/////////////////////zf///wQAAAAAAAAAAAAAAAD///9S/////v/////////////////////6+vr/MjIy/11dXf///////////+3t7f+AgID/Dw8P/ywsLP+np6f/9fX1////////////8/Pz/5+fn/8GBgb/cXFx//z8/P////////////////7///9SAAAAAAAAAAAAAAAAAAAAAP///wn///+2//////////////////////////+dnZ3/DAwM/6Ghof/////////////////Z2dn/S0tL/wAAAP80NDT/b29v/21tbf8zMzP/BgYG/2pqav/09PT/////////////////////tv///wkAAAAAAAAAAAAAAAAAAAAAAAAAAP///x7////W//////////////////////////+NjY3/Dw8P/0VFRf+dnZ3/tLS0/4eHh/8uLi7/FBQU/2RkZP9CQkL/Pz8//3BwcP/Dw8P//////////////////////////9b///8eAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zP////l//////////////////////////+rq6v/Pz8//xsbG/8RERH/Hx8f/1FRUf/MzMz////////////////////////////////////////////////l////MwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///zT////V///////////////////////////4+Pj/4ODg/9ra2v/k5OT/////////////////////////////////////////////////////1f///zQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///yH///+2/////////////////////////////////////////////////////////////////////////////////////////7b///8hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wf///9S////zP////v/////////////////////////////////////////////////////////+////8z///9S////BwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8C////Xv///5r////X////+f/////////////////////////5////1////5r///9e////AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xX///8n////K////yz///8s////K////yf///8VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xD///9E////V////1f///9E////EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////D////4D////f/////////////////////////+H///+A////DwAAAAAAAAAAAAAAAAAAAAAAAAAA////H////8f////////////////d3d3/l5eX/6Wlpf/09PT//////////8f///8fAAAAAAAAAAAAAAAA////D////8n/////tbW1/2pqav9nZ2f/MDAw/52dnf+mpqb/Z2dn/+zs7P//////////yf///w8AAAAAAAAAAP///4H/////wsLC/2lpaf/h4eH/0NDQ/66urv9qamr/v7+//7e3t/93d3f/9/f3//////////+BAAAAAP///xH////j/////4CAgP+fn5//dnZ2/2VlZf+CgoL/zs7O/15eXv/Ly8v/OTk5/3Jycv/39/f/////5P///xH///9E//////////9iYmL/YWFh/8nJyf+fn5//SUlJ/2lpaf9FRUX/xsbG/4aGhv+YmJj/p6en//////////9E////WP/////FxcX/d3d3/9bW1v9hYWH/Pz8///r6+v/6+vr/ZGRk/6ampv98fHz/yMjI/4qKiv//////////WP///1j/////kpKS/76+vv+Dg4P/qqqq/2FhYf/t7e3/9/f3/0lJSf9fX1//1dXV/3h4eP/BwcH//////////1j///9E/////7a2tv+NjY3/iIiI/8TExP9OTk7/Y2Nj/z09Pf+dnZ3/yMjI/2BgYP9aWlr///////////////9E////Ef///+T6+vr/fX19/y4uLv/Jycn/YmJi/8nJyf+UlJT/YWFh/3Z2dv+pqan/d3d3///////////j////EQAAAAD///+B//////7+/v+Li4v/nZ2d/9LS0v9ra2v/nJyc/8rKyv/c3Nz/aWlp/7u7u///////////gQAAAAAAAAAA////D////8n/////9fX1/3BwcP+NjY3/mpqa/zMzM/9tbW3/cnJy/7i4uP//////////yf///w8AAAAAAAAAAAAAAAD///8f////x//////9/f3/s7Oz/6SkpP/h4eH/////////////////////x////x8AAAAAAAAAAAAAAAAAAAAAAAAAAP///w////+A////4P/////////////////////////f////gP///w8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///xD///9E////V////1f///9E////EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==",
    sourceURL: "https://openai.com/favicon.ico"
  },
  anthropic: {
    data: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFWA1QZWd9iLV3bYill63hcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFh42YZXd9n/V3fZ/1d32LkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFd42eBXd9n/V3fZ/1Z32eMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAElt2weAgP8CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA///8////AAD///h///8AAP//+H///wAA///4f///AAD/4/h/j/8AAP/h/H+P/wAA//D8fw//AAD/+Hx+D/8AAP/8PH4ePwAA//w+PBx/AAD+fh44OP8AAPwfDjhh/wAA/A+OMEP/AAD+A8Ygh/8AAP+BwiEP/wAA/8BhAB//AAD/8DAAP+cAAP/8CAB+AwAA//8AAOABAAD//4AAAAMAAP//4AAADwAA/8AAAP//AADAAAAAH/8AAIAAIAAA/wAAx//AAAAHAAD//4AAAAMAAP/+AAB4AQAA//wAAD/jAAD/8AAAP/8AAP/gIIAf/wAA/4BBiA//AAD/AcGID/8AAP4Dg4wH/wAA+AeDjgP/AAD4HwePAf8AAPg/B4cB/wAA+H4Ph4D/AAD//A+HwP8AAP/8H4fgfwAA//gfh/D/AAD/+B/H+f8AAP/wP8P//wAA//A/w///AAD/8H/D//8AAP/wf+f//wAA//j/////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABZc9kUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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",
    sourceURL: "https://claude.com/favicon.ico"
  },
  ahrefs: {
    data: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIz/UACM/5AAjv+/AI7/3wCN//8Ajf//AI3//wCO/+8Ajv/fAI3/rwCN/3AAj/8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI//IACL/4AAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI7/vwCL/0AAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAi/9AAI7/3wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf+vAI//EAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACN/2AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI7/3wCP/zAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIv/QACN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCO/+8Ajf+vAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/8QAI7/3wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/7wCO/78Ajv+/AI7/vwCN/+8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/zAAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN/58Aj/8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/8wAI//fwCN/+8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACN/3AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/jwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/yAAjf/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO/6AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf/vAI//EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/8gAI3/3wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACN/68Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI//IACN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO/78Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajv+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACN/58Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO/78Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajv+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/0AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO/78Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf/vAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACO/6AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf/vAI//IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv+/AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACN/3AAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AIz/kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv+QAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/zAAjf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCO/78Ai/9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI7/7wCO/88Ajv+/AI7/vwCO/78Ajv+/AI7/vwCO/78Ajv+/AI7/vwCO/78Ajv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf9gAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI3/3wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI//IACN/+8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/zAAjf/vAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/8gAI7/vwCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/0AAjv+/AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI//EACP/1AAjf9wAI3/nwCN/58Ajf+vAI7/vwCO/78Ajv+/AI7/vwCO/78Ajv+/AI7/vwCO/78Ajv+/AI7/vwCO/78Ajf/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf+AAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjP9QAI3/YACN/2AAjf9gAI3/YACN/2AAjf9gAI3/YACN/2AAjf9gAI3/YACN/2AAjf9gAI3/YACN/2AAjf9gAI3/YACN/2AAjf9gAI3/YACN/2AAjf+vAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv/fAI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3//wCN//8Ajf//AI3/3wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjf9wAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/gACN/4AAjf+AAI3/cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///////wAA////////AAD///////8AAP/8AD///wAA/+AADgA/AAD/wAACAD8AAP+AAAAAPwAA/wAAAAA/AAD+AAAAAD8AAP4AAAAAPwAA/gAAAAA/AAD8AA+AAD8AAPwAP+AAPwAA/AA/8AA/AAD8AH/4AD8AAPwAf/wAPwAA/AB//AA/AAD8AH/+AD8AAPwAP/4APwAA/AA//gA/AAD8AA/+AD8AAP4AAAAAPwAA/gAAAAA/AAD/AAAAAD8AAP8AAAAAPwAA/4AAAAA/AAD/wAAAAD8AAP/wAAAAPwAA//wAAAA/AAD////+AD8AAP////4APwAA/////gA/AAD////+AD8AAP////4APwAA/////gA/AAD////+AD8AAP////4APwAA/8AAAAA/AAD/wAAAAD8AAP/AAAAAPwAA/8AAAAA/AAD/wAAAAD8AAP/AAAAAPwAA/8AAAAA/AAD/wAAAAD8AAP/AAAAAPwAA////////AAD///////8AACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABV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",
    sourceURL: "https://ahrefs.com/favicon.ico"
  },
  duckduckgo: {
    data: "data:image/x-icon;base64,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",
    sourceURL: "https://duckduckgo.com/favicon.ico"
  },
  commoncrawl: {
    data: "data:image/png;base64,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",
    sourceURL: "https://cdn.prod.website-files.com/6479b8d98bf5dcb4a69c4f31/648962c357c8113a871e3378_Common_Crawl_Rev3_LPX_Logo%20Gradient%20BG.png"
  },
  perplexity: {
    data: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsAAAApwAAAOgAAAD5AAAA/gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP4AAAD5AAAA6AAAAKUAAAArAAAAAAAAACsAAADHAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAADHAAAALAAAAKUAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAApgAAAOYAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA5wAAAPkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8CAgL/CgoK/woKCv8CAgL/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAP4AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/DA0N/wUFBf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8nJyf/tLa2/7S2tv8nJyf/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/BQUF/w0ODv8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/WFlZ/3Bycv8HBwf/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8zNDT/7vDw/+7w8P80NDT/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/cHJy/1xdXf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/aGlp//P29v+Ehob/DQ0N/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8zMzP/6u3t/+vt7f8zMzP/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/w0NDf+DhYX/8/b2/21ubv8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/Z2ho//v+/v/3+vr/mZub/xYWFv8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8zMzP/6u3t/+vt7f8zMzP/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/FRUV/5iamv/3+fn//P///2ttbf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAA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Av9JSkr/1NbW/25vb/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP4AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/OTo6/zAxMf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8jJCT/pKam/6Smpv8jJCT/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/MDEx/zo6Ov8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/gAAAPkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AQEB/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAQH/BQUF/wUFBf8BAQH/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wEBAf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAOcAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA5gAAAKYAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAApQAAACwAAADHAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAADHAAAAKwAAAAAAAAArAAAApQAAAOgAAAD5AAAA/gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP4AAAD5AAAA6AAAAKcAAAAsAAAAAMAAAAAAAwAAgAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAABAADAAAAAAAMAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlAAAArAAAAPQAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/gAAAPQAAACrAAAAJQAAAKsAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP4AAACsAAAA8gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPIAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/CAgI/wUFBf8AAAD/AAAA/wAAAP8AAAD/AAAA/wMDA/9jZGT/Y2Rk/wMDA/8AAAD/AAAA/wAAAP8AAAD/AAAA/wUFBf8ICAj/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/gAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9AQUH/c3R0/wkJCf8AAAD/AAAA/wAAAP8AAAD/BgYG/7m7u/+5u7v/BgYG/wAAAP8AAAD/AAAA/wAAAP8JCQn/c3R0/0JDQ/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xNTf/w8vL/jI6O/xAQEP8AAAD/AAAA/wAAAP8GBgb/trm5/7a5uf8GBgb/AAAA/wAAAP8AAAD/EBAQ/4yNjf/w8/P/T1BQ/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/S0xM//X4+P/5+/v/oaOj/xkZGf8AAAD/AAAA/wYGBv+2ubn/trm5/wYGBv8AAAD/AAAA/xkZGf+ho6P/+fv7//b5+f9OT0//AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9LTEz/7vHx/6aoqP/m6Oj/tri4/yUmJv8AAAD/BgYG/7a5uf+2ubn/BgYG/wAAAP8lJSX/tbe3/+bo6P+kpqb/7vHx/05PT/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0tMTP/u8fH/SElJ/05P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",
    sourceURL: "https://www.perplexity.ai/favicon.ico"
  },
  apple: {
    data: "data:image/x-icon;base64,AAABAAMAEBAAAAEAIABoBAAANgAAACAgAAABACAAqBAAAJ4EAABAQAAAAQAgAChCAABGFQAAKAAAABAAAAAgAAAAAQAgAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAANfS0gDX0tIA19LSANfS0gDX0tIG19LSUdfS0pXX0tK019LStNfS0pbX0tJR19LSBtfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tJM19LS3OTg4P/u7Oz/8/Ly//Py8v/v7Oz/5ODg/9fS0tzX0tJM19LSANfS0gDX0tIA19LSANfS0gDX0tJw19LS/fPy8v/////////////////////////////////z8vL/19LS/dfS0nDX0tIA19LSANfS0gDX0tJJ19LS/vn4+P////////////////////////////////////////////n4+P/X0tL+19LSSdfS0gDX0tIG19LS3fPx8f///////////+Tk5P9qaGj/paSk/8fGxv9ramr/ra2t////////////8/Hx/9fS0t3X0tIG19LSUOTg4P////////////v7+/9NS0v/Hx0d/x8dHf8fHR3/Hx0d/x8dHf/Kysr////////////k4OD/19LSUNfS0pbv7Oz///////////+3trb/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/nZ2d////////////7+3t/9fS0pjX0tK18/Ly////////////dXR0/x8dHf8fHR3/Hx0d/x8dHf8fHR3/a2lp//////////////////Tz8//X0tK719LStfPy8v///////////3Nycv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/5WUlP/////////////////08/P/19LSu9fS0pbv7Oz///////////+4t7f/Hx0d/x8dHf8fHR3/Hx0d/x8dHf81MzP/yMfH////////////7+3t/9fS0pfX0tJQ5ODg/////////////////4uKiv9LSUn/nJub/7Oysv9TUVH/YmBg/+fn5////////////+Tg4P/X0tJQ19LSBtfS0tzz8fH///////////////////////////9mZWX/19fX//////////////////Px8f/X0tLd19LSBtfS0gDX0tJJ19LS/fn4+P//////////////////////v76+/1tZWf////////////n4+P/X0tL919LSSdfS0gDX0tIA19LSANfS0nDX0tL98/Ly//////////////////////////////////Py8v/X0tL919LSb9fS0gDX0tIA19LSANfS0gDX0tIA19LSTNfS0tzj4OD/7uzs//Py8v/z8vL/7uzs/+Pg4P/X0tLc19LSTNfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIG19LST9fS0pXX0tK019LStNfS0pXX0tJP19LSBtfS0gDX0tIA19LSANfS0gDwDwAA4AcAAMADAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAwAMAAOAHAADwDwAAKAAAACAAAABAAAAAAQAgAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0hzX0tJN19LScdfS0n/X0tJ/19LScdfS0k3X0tIc19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSG9fS0oDX0tLY29fX/+Pg4P/p5ub/6+jo/+vo6P/p5ub/4+Dg/9vX1//X0tLY19LSgNfS0hvX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSENfS0pTX0tL56+np//n4+P////////////////////////////////////////////n4+P/r6en/19LS+dfS0pTX0tIQ19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0kPX0tLn6ufn//7+/v/////////////////////////////////////////////////////////////////+/v7/6ufn/9fS0ufX0tJE19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tJn19LS/PLw8P//////////////////////////////////////////////////////////////////////////////////////8vHx/9fS0vzX0tJq19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSaefk5P/49/f/////////////////////////////////////////////////////////////////////////////////////////////////+Pf3/+fl5f/X0tJp19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0kPX0tL8+Pf3////////////////////////////////////////////////////////////////////////////////////////////////////////////+Pf3/9fS0vzX0tJD19LSANfS0gDX0tIA19LSANfS0gDX0tIQ19LS6PLw8P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8vDw/9fS0ufX0tIQ19LSANfS0gDX0tIA19LSANfS0pTq5+f//////////////////////////////////////+Pj4/9fXl7/Pz09/29ubv+4t7f/zs3N/6qpqf9cW1v/QUBA/3t6ev/39/f/////////////////////////////////6ufn/9fS0pPX0tIA19LSANfS0gDX0tIe19LS+v7+/v/////////////////////////////////z8/P/Q0FB/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/2poaP/////////////////////////////////+/v7/19LS+dfS0hvX0tIA19LSANfS0n/r6Oj//////////////////////////////////////3JwcP8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/6WkpP/////////////////////////////////r6en/19LSgNfS0gDX0tIA19LS1/n4+P/////////////////////////////////MzMz/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/MC4u//Dw8P////////////////////////////n4+P/X0tLZ19LSANfS0hzb19f//////////////////////////////////////2RjY/8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/oJ+f/////////////////////////////////9vX1//X0tIc19LSTOPf3//////////////////////////////////m5ub/JyUl/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/2JgYP/h4eH/////////////////////////////////49/f/9fS0kzX0tJx6ebm/////////////////////////////////7Kxsf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf9OTEz/+/v7///////////////////////////////////////p5ub/19LSctfS0n7r6Oj/////////////////////////////////h4aG/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/7m4uP///////////////////////////////////////////+vo6P/X0tJ+19LSfuvo6P////////////////////////////////92dXX/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8gHh7/39/f////////////////////////////////////////////6+jo/9fS0n7X0tJx6ebm/////////////////////////////////4OCgv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf/X19f////////////////////////////////////////////p5ub/19LSctfS0kzj39//////////////////////////////////trW1/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/4+Ojv///////////////////////////////////////////+Pf3//X0tJM19LSHNvX1//////////////////////////////////09PT/Ojg4/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Kigo/8nIyP/+/v7/////////////////////////////////29fX/9fS0hzX0tIA19LS1/n4+P/////////////////////////////////Av7//IiAg/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/REJC//j4+P////////////////////////////n4+P/X0tLY19LSANfS0gDX0tJ/6+jo///////////////////////////////////////CwcH/T05O/yMhIf8hHx//R0ZG/5KRkf+tra3/ZWRk/ygmJv8fHR3/JSMj/19eXv/a2tr/////////////////////////////////6+jo/9fS0n/X0tIA19LSANfS0h7X0tL5/v7+////////////////////////////////////////////3t3d/9vb2//8/Pz//////4+Ojv/Dw8P/5+fn/8/Ozv/g4OD///////////////////////////////////////7+/v/X0tL519LSG9fS0gDX0tIA19LSANfS0pPq5+f////////////////////////////////////////////////////////////39/f/JyUl/x8dHf+KiYn/////////////////////////////////////////////////6ufn/9fS0pLX0tIA19LSANfS0gDX0tIA19LSENfS0ujy8PD///////////////////////////////////////////////////////////+KiYn/Hx0d/x8dHf+/vr7///////////////////////////////////////Lw8P/X0tLn19LSENfS0gDX0tIA19LSANfS0gDX0tIA19LSQ9fS0vz49/f///////////////////////////////////////////////////////f39/9gX1//Hx0d/2BfX//////////////////////////////////49/f/19LS/NfS0kPX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSaefk5P/39/f///////////////////////////////////////////////////////39/f+mpaX/jYyM////////////////////////////+Pf3/+fk5P/X0tJp19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSZtfS0vzy8PD///////////////////////////////////////////////////////////////////////////////////////Lw8P/X0tL819LSZ9fS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSQtfS0ufq5+f//v7+//////////////////////////////////////////////////////////////////7+/v/q5+f/19LS59fS0kPX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSENfS0pLX0tL46+jo//n4+P////////////////////////////////////////////n4+P/r6Oj/19LS+NfS0pLX0tIQ19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0hvX0tJ919LS1tvX1//j39//6ebm/+vo6P/r6Oj/6ebm/+Pf3//b19f/19LS19fS0n7X0tIb19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSGtfS0kzX0tJx19LSfdfS0n3X0tJx19LSTNfS0hvX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gD/8A///4AB//4AAH/8AAA/+AAAH/AAAA/gAAAHwAAAA8AAAAOAAAABgAAAAYAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAGAAAABgAAAAcAAAAPAAAAD4AAAB/AAAA/4AAAf/AAAP/4AAH//gAH///AP/ygAAABAAAAAgAAAAAEAIAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAADX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0g7X0tI319LSV9fS0m/X0tKC19LSiNfS0oTX0tJ319LSaNfS0lfX0tI319LSDtfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0hfX0tJZ19LSm9fS0tvZ1NT/4Nzc/+Xh4f/o5ub/6+np/+zq6v/s6en/6ufn/+fk5P/l4eH/4Nzc/9nU1P/X0tLb19LSm9fS0lnX0tIX19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIJ19LSXtfS0r7X0tL85eLi/+/t7f/5+fn/////////////////////////////////////////////////////////////////+fn5/+/t7f/l4uL/19LS/NfS0r7X0tJf19LSCdfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0g7X0tJ619LS6ebj4//19PT///7+///////////////////////////////////////////////////////////////////////////////////////////////////+/v/19PT/5uPj/9fS0unX0tJ619LSDtfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSBNfS0nPX0tLu6ufn//v6+v/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7+vr/6ufn/9fS0u7X0tJz19LSBNfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSPdfS0tPo5eX/+vn5///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+fn/6OXl/9fS0tPX0tI919LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tID19LSgtfS0v3x7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////x7+//19LS/dfS0oLX0tID19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIW19LSvujl5f/8+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////z7+//o5eX/19LSvtfS0hbX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIg19LS2evo6P///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vo6P/X0tLb19LSINfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIr19LS5uzq6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7Orq/9fS0ubX0tIr19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIk19LS4+7s7P/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////u7Oz/19LS5NfS0iTX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIV19LS2+3r6////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+3r6//X0tLb19LSFdfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIF19LSwuvo6P//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+jo/9fS0sPX0tIG19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSiejl5f/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////o5ub/19LSidfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSPNfS0v39/f3//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////f39/9fS0v3X0tI819LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSBNfS0tPx7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////x7+//19LS0tfS0gTX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0nPo5eX//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+jl5f/X0tJz19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0g7X0tLv+vn5//////////////////////////////////////////////////////////////////////////////////////////////////////+1tbX/eXh4/3Rzc/+amZn/3t7e/////////////////////////////v7+/8LCwv+JiIj/eXd3/5CPj//b29v////////////////////////////////////////////////////////////////////////////////////////////6+fn/19LS79fS0g7X0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tJ46ufn//////////////////////////////////////////////////////////////////////////////////////////////////z8/P9ycHD/Hx0d/x8dHf8fHR3/Hx0d/yooKP9tbGz/qqmp/8bFxf/Av7//mZiY/1BPT/8fHR3/Hx0d/x8dHf8fHR3/Kikp/7Cvr////////////////////////////////////////////////////////////////////////////////////////////+rn5//X0tJ419LSANfS0gDX0tIA19LSANfS0gDX0tIJ19LS6vr6+v////////////////////////////////////////////////////////////////////////////////////////////////97enr/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8jISH/urm5///////////////////////////////////////////////////////////////////////////////////////6+vr/19LS6dfS0gnX0tIA19LSANfS0gDX0tIA19LSWOXi4v////////////////////////////////////////////////////////////////////////////////////////////////+Yl5f/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/yopKf/U1NT//////////////////////////////////////////////////////////////////////////////////////+Xi4v/X0tJY19LSANfS0gDX0tIA19LSANfS0rb08vL////////////////////////////////////////////////////////////////////////////////////////////MzMz/IyEh/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/SEdH//b29v/////////////////////////////////////////////////////////////////////////////////08vL/19LSttfS0gDX0tIA19LSANfS0hXX0tL7/v7+///////////////////////////////////////////////////////////////////////////////////////7+/v/S0lJ/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf+ZmJj//////////////////////////////////////////////////////////////////////////////////v7+/9fS0vvX0tIW19LSANfS0gDX0tJY5eLi////////////////////////////////////////////////////////////////////////////////////////////paWl/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/MS8v/+jo6P/////////////////////////////////////////////////////////////////////////////////l4uL/19LSWdfS0gDX0tIA19LSmu/t7f//////////////////////////////////////////////////////////////////////////////////////9fX1/zw6Ov8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf+Mi4v/////////////////////////////////////////////////////////////////////////////////7+3t/9fS0prX0tIA19LSANfS0tv5+fn//////////////////////////////////////////////////////////////////////////////////////66trf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/NzU1//////////////////////////////////////////////////////////////////////////////////n5+f/X0tLb19LSANfS0grX0tL9//////////////////////////////////////////////////////////////////////////////////////////9WVVX/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/zs5Of//////////////////////////////////////////////////////////////////////////////////////19LS/dfS0gnX0tIu3tra///////////////////////////////////////////////////////////////////////////////////////f39//JCIi/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/2JgYP/k5OT//////////////////////////////////////////////////////////////////////////////////////97a2v/X0tIu19LSVuTh4f//////////////////////////////////////////////////////////////////////////////////////pqWl/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/2VkZP/6+vr////////////////////////////////////////////////////////////////////////////////////////////k4eH/19LSVNfS0mnn5eX//////////////////////////////////////////////////////////////////////////////////////29ubv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/0ZERP/19fX/////////////////////////////////////////////////////////////////////////////////////////////////5+Xl/9fS0mnX0tJ36ufn//////////////////////////////////////////////////////////////////////////////////////9OTU3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf+1tbX//////////////////////////////////////////////////////////////////////////////////////////////////////+rn5//X0tJ319LShOzp6f//////////////////////////////////////////////////////////////////////////////////////Pz09/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf83NTX/9fX1///////////////////////////////////////////////////////////////////////////////////////////////////////s6en/19LSg9fS0ofs6ur//////////////////////////////////////////////////////////////////////////////////////zQyMv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/X15e////////////////////////////////////////////////////////////////////////////////////////////////////////////7Orq/9fS0ofX0tKA6+np//////////////////////////////////////////////////////////////////////////////////////8yMDD/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/3Fvb////////////////////////////////////////////////////////////////////////////////////////////////////////////+vo6P/X0tJ/19LSb+jm5v//////////////////////////////////////////////////////////////////////////////////////ODc3/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf9nZmb////////////////////////////////////////////////////////////////////////////////////////////////////////////o5eX/19LSbtfS0lbk4eH//////////////////////////////////////////////////////////////////////////////////////0dFRf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/REJC//z8/P//////////////////////////////////////////////////////////////////////////////////////////////////////5OHh/9fS0lXX0tIu3tra//////////////////////////////////////////////////////////////////////////////////////9mZWX/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/yIgIP/R0dH//////////////////////////////////////////////////////////////////////////////////////////////////////97a2v/X0tIu19LSCtfS0v3/////////////////////////////////////////////////////////////////////////////////////qaio/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/ZWRk///////////////////////////////////////////////////////////////////////////////////////////////////////X0tL919LSCdfS0gDX0tLb+fn5//////////////////////////////////////////////////////////////////////////////////Hx8f81MzP/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf+dnJz////////////////////////////////////////////////////////////////////////////////////////////5+Pj/19LS2tfS0gDX0tIA19LSmu/t7f//////////////////////////////////////////////////////////////////////////////////////oJ+f/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/IB4e/6WkpP/7+/v/////////////////////////////////////////////////////////////////////////////////7+3t/9fS0prX0tIA19LSANfS0ljl4uL///////////////////////////////////////////////////////////////////////////////////////z8/P9pZ2f/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8hHx//2NjY/////////////////////////////////////////////////////////////////////////////////+Xi4v/X0tJY19LSANfS0gDX0tIV19LS+/7+/v//////////////////////////////////////////////////////////////////////////////////////+Pj4/2RiYv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf8fHR3/pKOj//////////////////////////////////////////////////////////////////////////////////7+/v/X0tL719LSFdfS0gDX0tIA19LSANfS0rXz8vL////////////////////////////////////////////////////////////////////////////////////////////7+/v/lpWV/zUzM/8fHR3/Hx0d/x8dHf8fHR3/Hx0d/yclJf9pZ2f/s7Oz/8/Ozv+ioaH/VVNT/yAeHv8fHR3/Hx0d/x8dHf8fHR3/Hx0d/x8dHf9HRUX/u7u7///////////////////////////////////////////////////////////////////////////////////////z8vL/19LStdfS0gDX0tIA19LSANfS0gDX0tJY5eLi///////////////////////////////////////////////////////////////////////////////////////////////////////s7Oz/qKen/3t6ev9raWn/dHNz/52cnP/d3Nz////////////////////////////T09P/j46O/2lnZ/9cW1v/ZGJi/318fP+3trb/+Pj4////////////////////////////////////////////////////////////////////////////////////////////5eHh/9fS0lfX0tIA19LSANfS0gDX0tIA19LSCdfS0un6+vr////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4+Pj/W1lZ/1hXV/+fnp7/+/v7////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6/9fS0unX0tII19LSANfS0gDX0tIA19LSANfS0gDX0tJ46ufn////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+vr6/zk4OP8fHR3/Hx0d/0VDQ//Pzs7//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+rn5//X0tJ419LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSDtfS0u/6+fn///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9pZ2f/Hx0d/x8dHf8fHR3/LCoq/8XFxf////////////////////////////////////////////////////////////////////////////////////////////////////////////n5+f/X0tLv19LSDtfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tJz6OXl////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////s7Oz/x8dHf8fHR3/Hx0d/x8dHf84Njb/7e3t///////////////////////////////////////////////////////////////////////////////////////////////////////o5eX/19LSctfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSBNfS0tLx7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////j4+P9MSkr/Hx0d/x8dHf8fHR3/Hx0d/52dnf/////////////////////////////////////////////////////////////////////////////////////////////////x7+//19LS0tfS0gTX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tI819LS/f39/f//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2tra/zc1Nf8fHR3/Hx0d/x8dHf9RUFD//f39///////////////////////////////////////////////////////////////////////////////////////9/f3/19LS/dfS0jzX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0ojo5eX////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Z2dn/S0lJ/x8dHf8fHR3/Kigo/+vr6///////////////////////////////////////////////////////////////////////////////////////6OXl/9fS0ojX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIF19LSwuvo6P////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Tz8/+RkJD/QD8//yUjI//e3t7/////////////////////////////////////////////////////////////////////////////////6+jo/9fS0sLX0tIF19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0hXX0tLb7evr////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7evr/9fS0tvX0tIV19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSI9fS0uPu7Oz/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7uzs/9fS0uPX0tIk19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIr19LS5uzq6v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7Orq/9fS0ubX0tIr19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0iDX0tLZ6+jo////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////6+jo/9fS0tnX0tIg19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSFdfS0r7o5eX//Pv7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8+/v/6OXl/9fS0r7X0tIV19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tID19LSgdfS0vzx7+/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////x7+//19LS/NfS0oLX0tID19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tI719LS0ujl5f/5+Pj///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////n5+f/o5eX/19LS0tfS0jzX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gTX0tJx19LS7+ro6P/8+/v//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pv7/+ro6P/X0tLv19LSctfS0gTX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0hHX0tKA19LS6+bi4v/08/P///7+///////////////////////////////////////////////////////////////////////////////////////////////////+/v/08/P/5uLi/9fS0uvX0tKA19LSEdfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gnX0tJd19LSvNfS0vzl4uL/7+3t//n4+P/////////////////////////////////////////////////////////////////5+Pj/7+3t/+Xi4v/X0tL819LSvNfS0l3X0tIJ19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIV19LSWNfS0pnX0tLa19LS/t/c3P/l4eH/6OXl/+vp6f/s6ur/7Onp/+rn5//n5OT/5eHh/9/c3P/X0tL+19LS2tfS0prX0tJZ19LSFdfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0g7X0tI219LSV9fS0m7X0tKA19LSiNfS0oTX0tJ319LSaNfS0lfX0tI219LSDtfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA19LSANfS0gDX0tIA////wAP///////wAAD//////4AAAB/////+AAAAB/////gAAAAB////8AAAAAD////AAAAAAD///4AAAAAAH///AAAAAAAP//4AAAAAAAf//AAAAAAAA//4AAAAAAAB//AAAAAAAAD/8AAAAAAAAP/gAAAAAAAAf8AAAAAAAAA/wAAAAAAAAD+AAAAAAAAAH4AAAAAAAAAfAAAAAAAAAA8AAAAAAAAADwAAAAAAAAAOAAAAAAAAAAYAAAAAAAAABgAAAAAAAAAGAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAABgAAAAAAAAAGAAAAAAAAAAYAAAAAAAAABwAAAAAAAAAPAAAAAAAAAA8AAAAAAAAAD4AAAAAAAAAfgAAAAAAAAB/AAAAAAAAAP8AAAAAAAAA/4AAAAAAAAH/wAAAAAAAA//AAAAAAAAD/+AAAAAAAAf/8AAAAAAAD//4AAAAAAAf//wAAAAAAD///gAAAAAAf///AAAAAAD////AAAAAA////+AAAAAH////+AAAAB/////+AAAAf//////AAAP///////wAP///8=",
    sourceURL: "https://www.apple.com/favicon.ico"
  },
  mistral: {
    data: "data:image/x-icon;base64,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",
    sourceURL: "https://mistral.ai/favicon.ico"
  },
  kimi: {
    data: "data:image/x-icon;base64,AAABAAMAMDAAAAEAIACoJQAANgAAACAgAAABACAAqBAAAN4lAAAQEAAAAQAgAGgEAACGNgAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8A////AP///wAAAAABAAAABAAAABUAAABKAAAAhQAAAMIAAADoAAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPwAAADoAAAAwAAAAIgAAABIAAAAFQAAAAQAAAAB////AP///wD///8A////AP///wD///8A////AAAAAAMAAAAPAAAALgAAAL0AAAD3AAAA+wAAAP0AAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD+AAAA/QAAAPsAAAD3AAAAugAAAC4AAAAPAAAAA////wD///8A////AP///wD///8AAAAABQAAABUAAABzAAAA5wAAAP0AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/QAAAOcAAABzAAAAFQAAAAX///8A////AP///wAAAAADAAAAFQAAAIMAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAgwAAABUAAAAD////AAAAAAEAAAAPAAAAcwAAAPkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAHMAAAAPAAAAAQAAAAQAAAAuAAAA5wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOcAAAAuAAAABAAAABUAAAC6AAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP0AAAC9AAAAFQAAAEgAAAD3AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD3AAAASgAAAIgAAAD7AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD7AAAAhQAAAMAAAAD9AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD9AAAAwgAAAOgAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAQH/BQUF/wsLC/8MDAz/DAwM/wgICP8DAwP/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wEBAf8DAwP/BgYG/wgICP8GBgb/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD+AAAA6AAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8EBAT/LCws/7W1tf+4uLj/uLi4/6mpqf8SEhL/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AgIC/wYGBv8QEBD/RkZG/4uLi/86Ojr/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/R0dH//n5+f/9/f3//f39/+np6f8fHx//AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8FBQX/IyMj/5WVlf/e3t7/+vr6//X19f9bW1v/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+////////////+rq6v8gICD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AgIC/wwMDP9WVlb/4ODg//n5+f/9/f3///////f39/9cXFz/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+////////////+rq6v8gICD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8FBQX/FxcX/5iYmP/w8PD//f39//////////////////f39/9cXFz/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+////////////+vr6/8iIiL/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AQEB/wkJCf86Ojr/vr6+//b29v/+/v7////////////+/v7/+/v7//Hx8f9VVVX/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+/////////////Hx8f9KSkr/BAQE/wAAAP8AAAD/AAAA/wEBAf8DAwP/Dw8P/15eXv/h4eH/+/v7//////////////////z8/P/z8/P/y8vL/5KSkv8pKSn/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+/////////////z8/P/e3t7/IiIi/wMDA/8AAAD/AQEB/wQEBP8WFhb/nZ2d//n5+f/+/v7////////////+/v7//Pz8/+7u7v9jY2P/DQ0N/wMDA/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+//////////////////7+/v/4eHh/zc3N/8FBQX/BwcH/z4+Pv/Ly8v/+/v7//7+/v////////////7+/v/4+Pj/v7+//y4uLv8GBgb/AQEB/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+//////////////////+/v7/+/v7/9ra2v9PT0//cXFx/+bm5v/7+/v//////////////////Pz8/+7u7v+Hh4f/FBQU/wQEBP8BAQH/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+/////////////////////////////z8/P/z8/P/9/f3//39/f/////////////////4+Pj/2NjY/0BAQP8LCwv/AQEB/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+////////////////////////////////////////////////////////f39//T09P+mpqb/KCgo/wYGBv8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8HBwf/SEhI//v7+/////////////7+/v/8/Pz//v7+///////////////////////8/Pz/6Ojo/3Z2dv8SEhL/AgIC/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAA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AOgAAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8CAQD/MBgE//F7Fv/8ghf//4MX//+DF//2fhb/ViwI/wMCAP8AAAD/AAAA/wAAAP8AAAD+AAAA6AAAAMIAAAD9AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAAD/DgcB/71hEf/3fxb//oIX//yBF//WbhP/IBAD/wIBAP8AAAD/AAAA/wAAAP8AAAD9AAAAwAAAAIUAAAD7AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AgEA/xoNAv+pVg//0mwT/7pgEf8wGAT/BwMA/wEAAP8AAAD/AAAA/wAAAP8AAAD7AAAAiAAAAEoAAAD3AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wEBAP8KBQH/FQsC/w4HAf8FAwH/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD3AAAASAAAABUAAAC9AAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP0AAAC6AAAAFQAAAAQAAAAuAAAA5wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAOcAAAAuAAAABAAAAAEAAAAPAAAAcwAAAPkAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA+QAAAHMAAAAPAAAAAf///wAAAAADAAAAFQAAAIMAAAD5AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD5AAAAgwAAABUAAAAD////AP///wD///8AAAAABQAAABUAAABzAAAA5wAAAP0AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/QAAAOcAAABzAAAAFQAAAAX///8A////AP///wD///8A////AAAAAAMAAAAPAAAALgAAALoAAAD3AAAA+wAAAP0AAAD+AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD+AAAA/QAAAPsAAAD3AAAAvQAAAC4AAAAPAAAAA////wD///8A////AP///wD///8A////AP///wAAAAABAAAABAAAABUAAABIAAAAhwAAAMAAAADoAAAA/AAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP0AAADoAAAAwgAAAIUAAABKAAAAFQAAAAQAAAAB////AP///wD///8A////APAAAAAADwAA4AAAAAAHAADAAAAAAAMAAIAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAEAAMAAAAAAAwAA4AAAAAAHAADwAAAAAA8AACgAAAAgAAAAQAAAAAEAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8A////AAAAAAMAAAAWAAAAXQAAAMEAAADsAAAA/AAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD8AAAA6wAAAMEAAABcAAAAFgAAAAP///8A////AP///wAAAAAHAAAAPgAAALgAAAD7AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPoAAAC4AAAAPgAAAAf///8AAAAAAwAAAD4AAADPAAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP0AAADPAAAAPgAAAAMAAAAWAAAAuAAAAP0AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP0AAAC4AAAAFgAAAFwAAAD6AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAPsAAABdAAAAwQAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAMEAAADrAAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA7AAAAPwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8pKSn/jIyM/4yMjP9TU1P/BQUF/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/CwsL/z09Pf9hYWH/CwsL/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xMTP///////////52dnf8JCQn/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAQH/CgoK/0NDQ//Kysr/+Pj4/9zc3P8VFRX/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/TExM////////////nZ2d/wkJCf8AAAD/AAAA/wAAAP8AAAD/AgIC/yAgIP+Dg4P/7Ozs////////////3Nzc/xUVFf8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9MTEz///////////+lpaX/CgoK/wAAAP8AAAD/AAAA/wICAv83Nzf/t7e3//T09P///////v7+//Pz8/+5ubn/EBAQ/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xMTP///////////+bm5v9MTEz/AAAA/wAAAP8ICAj/YmJi/+Pj4//8/Pz///////7+/v/T09P/U1NT/xUVFf8CAgL/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/TExM/////////////////+rq6v9JSUn/ICAg/5CQkP/19fX///////7+/v/y8vL/p6en/xsbG/8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9MTEz//////////////////////+fn5//Kysr/+Pj4///////8/Pz/2dnZ/2tra/8ODg7/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xMTP//////////////////////////////////////+vr6/7m5uf88PDz/CAgI/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/TExM////////////6enp//X19f////////////////+bm5v/FBQU/wICAv8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9MTEz///////////+hoaH/ZmZm/+3t7f/+/v7//////9bW1v8tLS3/AgIC/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xMTP///////////52dnf8MDAz/Wlpa/+Hh4f/+/v7//v7+/8/Pz/86Ojr/BQUF/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/TExM////////////nZ2d/wkJCf8ICAj/W1tb/+Dg4P/+/v7//Pz8/8zMzP8/Pz//AwMD/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9MTEz///////////+dnZ3/CQkJ/wAAAP8HBwf/VlZW/+zs7P///////f39/9XV1f8yMjL/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/0xMTP///////////52dnf8JCQn/AAAA/wAAAP8DAwP/WFhY/+zs7P/+/v7//////9zc3P80NDT/AwMD/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/TExM////////////nZ2d/wkJCf8AAAD/AAAA/wAAAP8DAwP/VlZW/97e3v/9/f3//////9XV1f9AQED/BgYG/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP9HR0f/8fHx//Ly8v+VlZX/CAgI/wAAAP8AAAD/AAAA/wAAAP8HBwf/UlJS/9XV1f/x8fH/8PDw/8TExP81NTX/BQMB/x8QA/8iEQP/EwoC/wEBAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/xAQEP83Nzf/Nzc3/x8fH/8CAgL/AAAA/wAAAP8AAAD/AAAA/wAAAP8GBgb/JSUl/zc3N/83Nzf/NDQ0/xYWFv8ZDQP/1m4T/+h3Ff/JZxL/KxYE/wAAAP8AAAD/AAAA/wAAAP8AAAD8AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/xoNAv/pdxX//4MX//6CF/+NSAz/AAAA/wAAAP8AAAD/AAAA/AAAAOwAAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/DQcB/8ZmEv/9ghf/9n4W/2w3Cf8AAAD/AAAA/wAAAP8AAADrAAAAwQAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8BAAD/OBwF/4hGDP9yOgr/GAwC/wAAAP8AAAD/AAAA/wAAAMEAAABdAAAA+wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8CAQD/CAQB/wYDAf8AAAD/AAAA/wAAAP8AAAD6AAAAXAAAABYAAAC4AAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/QAAALgAAAAWAAAAAwAAAD4AAADPAAAA/QAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAA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",
    sourceURL: "https://www.kimi.ai/favicon.ico"
  }
};

// web/src/site-chrome.js
function providerLogo(providerId) {
  const source = provider_logos_default[providerId];
  if (!source) return null;
  const image = document.createElement("img");
  image.src = source.data;
  image.alt = "";
  image.width = image.height = 21;
  image.className = "provider-logo";
  image.decoding = "async";
  return image;
}
var figure = document.getElementById("hero-figure");
if (figure) {
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = motionPreference.matches;
  let busy2 = false;
  let animation;
  const mount = () => {
    animation?.destroy();
    figure.replaceChildren();
    animation = slow(figure, {
      theme: "light",
      intensity: 0.2,
      label: "Crates moving slowly through a gate \u2014 Hairline by Lucas Marques"
    });
    if (paused || busy2) {
      const theme = figure.getAttribute("data-hairline-theme");
      const svg = figure.querySelector("svg")?.cloneNode(true);
      animation.destroy();
      figure.setAttribute("data-hairline", "slow");
      if (theme) figure.setAttribute("data-hairline-theme", theme);
      if (svg) {
        svg.setAttribute("role", "img");
        svg.setAttribute("aria-label", "Crates on a conveyor belt");
        figure.append(svg);
      }
    }
  };
  mount();
  motionPreference.addEventListener("change", (event) => {
    paused = event.matches;
    mount();
  });
  window.addEventListener("verifier-busy", (event) => {
    busy2 = event.detail === true;
    mount();
  });
  window.addEventListener("pagehide", () => animation?.destroy());
}
var strip = document.getElementById("provider-strip");
if (strip) {
  const label = document.createElement("span");
  label.textContent = "Published sources";
  strip.append(label);
  for (const source of new Map(sources.map((source2) => [source2.provider.id, source2])).values()) {
    const item = document.createElement("a");
    item.href = source.documentationUrls[0];
    item.title = source.provider.name;
    item.className = "provider-mark";
    const logo = providerLogo(source.provider.id);
    if (logo) item.append(logo);
    const name = document.createElement("span");
    name.textContent = source.provider.name;
    item.append(name);
    strip.append(item);
  }
}
var year = document.getElementById("copy-year");
if (year) year.textContent = (/* @__PURE__ */ new Date()).getFullYear();
var share = document.querySelector(".postfooter-share button");
if (share) share.onclick = async () => {
  try {
    await navigator.clipboard.writeText(document.querySelector("link[rel=canonical]").href);
    share.classList.add("copied");
    setTimeout(() => share.classList.remove("copied"), 2500);
  } catch {
    share.title = "Copy the page URL from your address bar.";
  }
};

// web/src/results/original-record.js
function readableJSON(raw) {
  let output = "", depth = 0, quoted = false, escaped = false;
  const newline = () => {
    output += "\n" + "  ".repeat(depth);
  };
  let previous = "";
  for (let index2 = 0; index2 < raw.length; index2++) {
    const char = raw[index2];
    if (quoted) {
      output += char;
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === '"') quoted = false;
      continue;
    }
    if (/\s/.test(char)) continue;
    if (char === '"') {
      quoted = true;
      output += char;
    } else if (char === "{" || char === "[") {
      output += char;
      depth++;
      if (!/^[\s]*[}\]]/.test(raw.slice(index2 + 1))) newline();
    } else if (char === "}" || char === "]") {
      depth--;
      if (previous !== "{" && previous !== "[") newline();
      output += char;
    } else if (char === ",") {
      output += char;
      newline();
    } else if (char === ":") output += ": ";
    else output += char;
    previous = char;
  }
  return output;
}

// web/src/results/view.js
var $ = (id) => document.getElementById(id);
var auditedURLs = new Set(sources.flatMap((source) => [source.feedUrl, ...source.documentationUrls]));
var providerNames = new Map(sources.map((source) => [source.provider.id, source.provider.name]));
var sourceById2 = new Map(sources.map((source) => [source.id, source]));
var stateLabel = (state) => ({
  fresh: "Fresh",
  aging: "Aging",
  stale: "Stale",
  "refresh-failed": "Refresh failed",
  "never-successful": "Never retrieved",
  unavailable: "Unavailable",
  "publisher-future-dated": "Future publisher timestamp",
  "future-dated": "Future retrieval timestamp"
})[state] ?? String(state).replaceAll("-", " ");
var node = (tag, text, className) => {
  const value = document.createElement(tag);
  if (text !== void 0) value.textContent = text;
  if (className) value.className = className;
  return value;
};
var localInstant = (instant) => instant ? new Date(instant).toLocaleString(void 0, { timeZoneName: "short" }) : "Never";
function fields(container, values) {
  const dl = node("dl");
  for (const [label, value] of Object.entries(values)) {
    dl.append(node("dt", label), node("dd", value === null || value === void 0 || value === "" ? "Not supplied" : String(value)));
  }
  container.append(dl);
}
function links(container, urls) {
  for (const url of [...new Set(urls)]) {
    if (!auditedURLs.has(url)) continue;
    const p = node("p"), a = node("a", url);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    p.append(a);
    container.append(p);
  }
}
function sourceDetails(container, source, health, cidrs = []) {
  const definition = sourceById2.get(source.sourceId);
  const details = node("details");
  details.append(node("summary", `${definition?.provider.name ?? source.sourceId} \u2014 ${source.sourceId}: ${stateLabel(health?.state ?? "unavailable")}`));
  fields(details, {
    "Source scope": source.scope ?? definition?.scope,
    "Published category": PURPOSES[definition?.category] ?? definition?.category,
    "Published purpose": definition?.purpose,
    "Matched CIDRs": cidrs.join(", ") || "No matched range",
    "Source health": stateLabel(health?.state ?? "unavailable"),
    "Retrieved (UTC)": health?.retrievedAt,
    "Publisher timestamp (verbatim)": health?.publisherTimestampRaw,
    "Snapshot version (SHA-256)": health?.version,
    "Refresh error": health?.error
  });
  links(details, [definition?.feedUrl, ...definition?.documentationUrls ?? []]);
  const limitations = node("ul");
  for (const text of definition?.limitations ?? []) limitations.append(node("li", text));
  details.append(limitations);
  container.append(details);
}
function renderDataset(dataset) {
  const states = dataset.sourceStates ?? [], current = states.filter((source) => source.current).length;
  const available = states.filter((source) => source.available).length;
  const stateCounts = /* @__PURE__ */ new Map();
  for (const source of states) stateCounts.set(stateLabel(source.state), (stateCounts.get(stateLabel(source.state)) ?? 0) + 1);
  const label = dataset.status === "cached" ? "Offline / fallback dataset: noncurrent evidence" : dataset.status === "ready" ? "Validated dataset loaded" : "Dataset unavailable";
  const help = dataset.status !== "unavailable" ? "" : dataset.error === "dataset-not-configured" ? " This copy has no dataset service configured. Replace the HTML and JavaScript with the current site build." : " Click Reload published dataset. If it still fails, check the browser Console and Network panels for blocked or failed dataset requests. Local access must use the configured localhost address and port.";
  $("dataset-status").textContent = `${label}. ${current} of ${sources.length} sources current.${available > current ? ` ${available - current} additional sources available as noncurrent evidence.` : ""} ${current < sources.length ? [...stateCounts].map(([state, count]) => `${state}: ${count}`).join("; ") + "." : ""}${dataset.error ? ` ${dataset.error}.` : ""}${help}`;
  const latest = states.filter((source) => source.available && source.retrievedAt && Number.isFinite(Date.parse(source.retrievedAt))).map((source) => source.retrievedAt).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  const attention = states.filter((source) => !source.current);
  const attentionText = attention.slice(0, 2).map((source) => `${sourceById2.get(source.sourceId)?.provider.name ?? source.sourceId}: ${stateLabel(source.state).toLowerCase()}`).join("; ") + (attention.length > 2 ? `; ${attention.length - 2} more \u2014 see source health` : "");
  $("dataset-compact").textContent = `${current}/${sources.length} sources current \xB7 ${available}/${sources.length} loaded${attentionText ? ` \xB7 ${attentionText}` : ""}${dataset.status === "cached" ? " \xB7 Offline fallback" : ""}`;
  $("dataset-latest").hidden = !latest;
  $("dataset-latest").textContent = `Latest successful source refresh: ${localInstant(latest)}`;
  $("dataset-evaluated").textContent = `Health evaluated ${localInstant(dataset.evaluatedAt)}. Public dataset cache: ${dataset.persistence ?? "none"}. Source dates below preserve UTC and publisher spelling.`;
  $("dataset-sources").replaceChildren();
  for (const state of [...states].sort((a, b) => Number(a.current) - Number(b.current))) {
    const entry2 = dataset.manifest?.sources.find((source2) => source2.sourceId === state.sourceId);
    const source = sourceById2.get(state.sourceId);
    const li = node("li", void 0, state.current ? "" : "source-attention");
    const detail = node("details"), heading = node("summary");
    const logo = providerLogo(source.provider.id);
    if (logo) heading.append(logo);
    heading.append(node("strong", `${source.provider.name} / ${state.sourceId}`), node("span", stateLabel(state.state), "source-state"));
    detail.append(heading);
    fields(detail, {
      "Last successful refresh": localInstant(state.retrievedAt),
      "Last attempt": localInstant(entry2?.lastAttemptedRefresh),
      "Publisher timestamp": state.publisherTimestampRaw,
      "Snapshot (SHA-256)": state.version,
      ...entry2?.lastRefreshError ?? state.error ? { "Refresh error": entry2?.lastRefreshError ?? state.error } : {}
    });
    if (state.available && !state.current) detail.append(node("p", "Previous validated ranges are loaded as noncurrent evidence.", "source-refresh-help"));
    const feed = node("a", "Published IP feed");
    feed.href = source.feedUrl;
    feed.target = "_blank";
    feed.rel = "noopener noreferrer";
    const reference = node("p");
    reference.append(feed);
    detail.append(reference);
    li.append(detail);
    $("dataset-sources").append(li);
  }
}
function createResultsView(onSelectionChange = () => {
}) {
  let rows = [], page = 1, returnFocus = null, searchTimer, filteredIds = [];
  let simple = false;
  let inputSource;
  const selected = /* @__PURE__ */ new Set();
  const ids = ["status", "http", "provider", "claim", "purpose", "client", "family", "freshness", "focus"];
  function select(id, values, label) {
    const control = $(id);
    control.replaceChildren();
    const empty = node("option", label);
    empty.value = "";
    control.append(empty);
    for (const [value, text] of values) {
      const option = node("option", text);
      option.value = value;
      control.append(option);
    }
  }
  function details(row, opener) {
    returnFocus = opener;
    const body = $("evidence-body");
    body.replaceChildren();
    $("evidence-title").textContent = `Evidence: ${row.ip}`;
    if (row.kind === "invalid") {
      body.append(node("p", row.invalid.message), node("p", `Record ${row.invalid.reference.record}; physical lines ${row.invalid.reference.lineStart}\u2013${row.invalid.reference.lineEnd}. No infrastructure assessment was performed.`), node("pre", row.invalid.rawRecord));
    } else {
      const group = row.group, result = group.result;
      body.append(node("p", row.finding.label, assessmentBadgeClass(row.finding.id)), node("p", result.assessment.explanation));
      if (row.finding.investigation) body.append(node("p", row.finding.investigation, "notice"));
      fields(body, {
        "Normalized IP": row.ip,
        "Address family": `IPv${row.family}`,
        "Client interpretation": CLIENT_LABELS[row.client],
        "Claimed crawler": row.claimNames.join(", ") || "No recognized claim",
        "Published providers (observed ranges)": row.providerNames.join(", ") || "None established",
        "Documented purposes (claims or ranges)": row.purposes.map((purpose) => PURPOSES[purpose] ?? purpose).join(", "),
        "Assessment time": result.infrastructure.observationTime,
        "Input entries": group.occurrences.length,
        ...inputSource.mapping.status !== null && inputSource.mapping.status !== void 0 ? { "HTTP response status": responseStatusLabel(row.httpStatus) } : {},
        ...simple ? {} : { "Represented count": group.requestCount },
        ...simple ? {} : { "Observed requests": group.countsRepresentRequests ? group.requestCount : "Not established" },
        "Infrastructure state": result.infrastructure.status,
        "Missing User-Agent": row.client === "missing" ? "Yes; infrastructure evidence only" : "No"
      });
      body.append(node("h3", "Raw User-Agent and parsed components"), node("pre", group.userAgent ?? "(not supplied / IP-only mode)"));
      fields(body, {
        Products: result.client.products.map((product) => `${product.name}${product.version ? `/${product.version}` : ""}`).join(", "),
        "Advertised browser": result.client.browser ? `${result.client.browser.family} ${result.client.browser.version ?? ""}` : null,
        Automation: result.client.automation.map((value) => typeof value === "string" ? value : JSON.stringify(value)).join(", "),
        Platforms: result.client.platforms.map((value) => typeof value === "string" ? value : JSON.stringify(value)).join(", "),
        "Ambiguous client claims": result.client.ambiguous ? "Yes" : "No"
      });
      for (const warning of [...result.client.warnings, ...result.client.limitations]) body.append(node("p", warning, "note"));
      if (result.client.declaredReferences.length) {
        body.append(node("p", "Untrusted references supplied by the User-Agent \u2014 display only:"), node("pre", result.client.declaredReferences.map((reference) => reference.raw).join("\n")));
      }
      body.append(node("h3", "Published source evidence"));
      const ids2 = [.../* @__PURE__ */ new Set([...result.infrastructure.observedMatches.map((match) => match.sourceId), ...result.assessment.checkedSourceIds])];
      if (!ids2.length) body.append(node("p", "No matching or claim-applicable source was established. See dataset health for registry-wide availability."));
      for (const id of ids2) {
        const match = result.infrastructure.observedMatches.find((value) => value.sourceId === id);
        const checked = result.assessment.checkedSources.find((value) => value.sourceId === id);
        sourceDetails(
          body,
          match ?? checked ?? { sourceId: id },
          result.infrastructure.sourceStates.find((value) => value.sourceId === id),
          result.infrastructure.observedMatches.filter((value) => value.sourceId === id).map((value) => `${value.publishedCidr} (${value.matchedVia})`)
        );
      }
      body.append(node("h3", simple ? "Investigation" : "History and investigation"));
      body.append(node("p", result.history.warning ?? "No request timestamp was supplied; this is an assessment against the currently available dataset."));
      if (group.historyPolicy.explanation) body.append(node("p", group.historyPolicy.explanation));
      if (result.history.supplied) fields(body, {
        "Representative raw timestamp": result.history.raw,
        "Parsed UTC": result.history.utc,
        "Timestamp interpretation": result.history.status,
        "Representative source row": group.historyPolicy.representativeSourceRow?.lineStart
      });
      body.append(node("p", result.assessment.suggestedAction));
      for (const limitation of result.assessment.limitations) body.append(node("p", limitation, "note"));
      body.append(node("h3", "Original occurrences"));
      let occurrence = 0;
      const controls = node("div", void 0, "pager"), previous = node("button", "Previous occurrence"), next = node("button", "Next occurrence"), position = node("span"), raw = node("div");
      previous.type = next.type = "button";
      controls.append(previous, position, next);
      body.append(controls, raw);
      const renderOccurrence = () => {
        const value = group.occurrences[occurrence];
        raw.replaceChildren();
        position.textContent = `${occurrence + 1} of ${group.occurrences.length}`;
        previous.disabled = occurrence === 0;
        next.disabled = occurrence === group.occurrences.length - 1;
        fields(raw, simple ? {
          "Source record": value.reference.record,
          "Original IP": value.rawIp,
          "IP provenance": value.ipProvenance
        } : {
          "Source record": value.reference.record,
          "Physical lines": `${value.reference.lineStart}\u2013${value.reference.lineEnd}`,
          "Original IP": value.rawIp,
          "Raw timestamp": value.rawTimestamp,
          "UTC timestamp": value.timestamp.utc,
          "Timestamp status": value.timestamp.status,
          "Raw count": value.rawRequestCount,
          "Count provenance": value.requestCountKnown ? "Imported count / access-log request" : "Input occurrence; request frequency unknown",
          "HTTP status": value.status,
          Method: value.method,
          Path: value.path,
          "IP provenance": value.ipProvenance
        });
        raw.append(node("p", "Occurrence User-Agent"), node("pre", value.rawUserAgent ?? "(not supplied)"), node("h3", "Original record"));
        if (["csv", "tsv"].includes(inputSource.format)) {
          const values = delimitedRecords(value.rawRecord, inputSource.format === "csv" ? "," : "	", DEFAULT_LIMITS).records[0].fields;
          const record = node("dl");
          values.forEach((field, index2) => record.append(node("dt", inputSource.headers[index2]), node("dd", field || "(empty)")));
          raw.append(record);
        } else {
          const text = ["json", "jsonl"].includes(inputSource.format) ? readableJSON(value.rawRecord) : value.rawRecord;
          raw.append(node("pre", text, "original-record"));
        }
      };
      previous.onclick = () => {
        occurrence--;
        renderOccurrence();
      };
      next.onclick = () => {
        occurrence++;
        renderOccurrence();
      };
      renderOccurrence();
    }
    $("evidence-dialog").showModal();
  }
  function render() {
    const filters = Object.fromEntries(ids.map((id) => [id, $(`filter-${id}`).value]));
    filters.search = $("search-results").value;
    filters.finding = filters.status;
    delete filters.status;
    const result = queryRows(rows, filters, { page, pageSize: Number($("page-size").value), sort: $("sort-results").value, direction: $("sort-direction").value });
    const filteredRows = queryRows(rows, filters, {
      pageSize: Math.max(1, rows.length),
      sort: $("sort-results").value,
      direction: $("sort-direction").value
    }).rows;

    filteredIds = filteredRows.map((row) => row.id);
    page = result.page;
    $("result-rows").replaceChildren();
    const advanced = $("advanced-columns").checked;
    document.querySelectorAll("#result-table th.advanced").forEach((header) => {
      header.hidden = !advanced;
    });
    for (const row of result.rows) {
      const tr = node("tr");
      const cell = (value, className, extra = false) => {
        const td = node("td", value, className);
        td.hidden = extra && !advanced;
        tr.append(td);
        return td;
      };
      const selection = cell(), checkbox = node("input");
      checkbox.type = "checkbox";
      checkbox.checked = selected.has(row.id);
      checkbox.setAttribute("aria-label", row.kind === "group" ? `Select result ${row.group.id}: ${row.ip}` : `Select invalid source row ${row.invalid.reference.record}`);
      checkbox.onchange = () => {
        if (checkbox.checked) selected.add(row.id);
        else selected.delete(row.id);
        updateSelection();
      };
      selection.append(checkbox);
      cell(row.ip, row.kind === "group" ? "ip" : "");
      cell(row.family === "invalid" ? "Invalid" : `IPv${row.family}`, "", true);
      cell(row.claimNames.join(", ") || "No recognized claim");
      const provider = cell(row.providerNames.join(", ") || "None established");
      for (const id of row.providerIds) {
        const logo = providerLogo(id);
        if (logo) provider.prepend(logo);
      }
      if (row.kind === "group") provider.append(node("span", [...new Set(row.group.result.infrastructure.observedMatches.map((match) => categoryLabel(match.category)))].join(", "), "secondary"));
      if (row.kind === "group" && row.providerIds.length && !row.group.result.infrastructure.currentMatches.length) provider.append(node("span", "Noncurrent observation", "secondary"));
      const status = cell();
      status.append(node(
        "span",
        row.finding.label,
        assessmentBadgeClass(row.finding.id)
      ));
      cell(row.kind === "group" ? responseStatusLabel(row.httpStatus) : "Not assessed", "center").hidden = $("http-status-heading").hidden;
      cell(row.cidrs.join(", ") || "No match", "", true);
      const countLabel = row.kind === "invalid" ? "Not counted" : simple ? `${row.group.occurrences.length} input ${row.group.occurrences.length === 1 ? "entry" : "entries"}` : `${row.group.occurrences.length} ${row.group.occurrences.length === 1 ? "row" : "rows"} / ${row.count} ${row.group.countsRepresentRequests ? row.count === 1 ? "request" : "requests" : row.count === 1 ? "represented occurrence" : "represented occurrences"}`;
      cell(countLabel);
      cell(`${row.historical ? "Historical; " : ""}${row.states.map(stateLabel).join(", ")}`, "", true);
      const action = cell(void 0, "center"), button = node("button", "Details", "link-button");
      button.type = "button";
      button.setAttribute("aria-label", `View evidence for ${row.ip}`);
      button.onclick = () => details(row, button);
      action.append(button);
      $("result-rows").append(tr);
    }
    $("result-count").textContent = `${result.total.toLocaleString()} of ${rows.length.toLocaleString()} rows match. Invalid source records are included as separate rows.`;
    const countEntries = (items) => items.reduce(
      (total, row) => total + (
        row.kind === "group" ? row.group.occurrences.length : 0
      ),
      0
    );

    const totalEntries = countEntries(filteredRows);
    const pageEntries = countEntries(result.rows);

    $("entries-counter").hidden = totalEntries <= 1;
    $("entries-count").textContent = result.pages > 1
      ? `${pageEntries.toLocaleString()} / ${totalEntries.toLocaleString()}`
      : totalEntries.toLocaleString();
    $("current-page").textContent = page;
    $("page-info").textContent = `Page ${page} / ${result.pages} • ${result.start}\u2013${result.end} / ${result.total.toLocaleString()}`;
    $("previous-page").disabled = page === 1;
    $("next-page").disabled = page === result.pages;
    $("no-results").hidden = result.total !== 0;
    updateSelection();
  }
  function updateSelection() {
    const count = filteredIds.filter((id) => selected.has(id)).length;
    $("select-all-results").checked = filteredIds.length > 0 && count === filteredIds.length;
    $("select-all-results").indeterminate = count > 0 && count < filteredIds.length;
    $("select-all-results").disabled = filteredIds.length === 0;
    $("selected-count").textContent = `${selected.size.toLocaleString()} results selected across all pages. ${filteredIds.filter((id) => selected.has(id)).length.toLocaleString()} are in the current filter.`;
    onSelectionChange();
  }
  $("select-all-results").onchange = () => {
    for (const id of filteredIds) {
      if ($("select-all-results").checked) selected.add(id);
      else selected.delete(id);
    }
    render();
  };
  $("select-filtered").onclick = () => {
    for (const id of filteredIds) selected.add(id);
    render();
  };
  $("clear-selection").onclick = () => {
    selected.clear();
    render();
  };
  for (const id of ids) $(`filter-${id}`).addEventListener("change", () => {
    page = 1;
    render();
  });
  $("search-results").addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      page = 1;
      render();
    }, 120);
  });
  for (const id of ["sort-results", "sort-direction", "page-size"]) $(id).addEventListener("change", () => {
    page = 1;
    render();
  });
  $("advanced-columns").addEventListener("change", render);
  $("previous-page").onclick = () => {
    page--;
    render();
  };
  $("next-page").onclick = () => {
    page++;
    render();
  };
  $("clear-filters").onclick = () => {
    for (const id of ids) $(`filter-${id}`).value = "";
    $("search-results").value = "";
    page = 1;
    render();
  };
  $("filters-toggle").onclick = () => {
    const expanded = $("filters-toggle").getAttribute("aria-expanded") !== "true";
    $("filters-toggle").setAttribute("aria-expanded", String(expanded));
    $("filters-toggle").textContent = expanded ? "Hide filters" : "Show filters";
    $("filters").dataset.collapsed = String(!expanded);
  };
  $("close-evidence").onclick = () => $("evidence-dialog").close();
  let backdropStart = false;
  const outside = (event) => {
    const rect = $("evidence-dialog").getBoundingClientRect();
    return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  };
  $("evidence-dialog").addEventListener("pointerdown", (event) => {
    backdropStart = event.target === $("evidence-dialog") && outside(event);
  });
  $("evidence-dialog").addEventListener("click", (event) => {
    if (backdropStart && event.target === $("evidence-dialog") && outside(event)) $("evidence-dialog").close();
    backdropStart = false;
  });
  $("evidence-dialog").addEventListener("close", () => {
    if (returnFocus?.isConnected) returnFocus.focus();
    else if (!$("results").hidden) $("results-title").focus();
  });
  return {
    clear() {
      clearTimeout(searchTimer);
      rows = [];
      selected.clear();
      filteredIds = [];
      $("result-rows").replaceChildren();
      if ($("evidence-dialog").open) $("evidence-dialog").close();
      updateSelection();
    },
    exportScope(scope) {
      return { scope, ids: scope === "selected" ? [...selected] : scope === "filtered" ? [...filteredIds] : [] };
    },
    selectedIPs() {
      return [...new Set(rows.filter((row) => selected.has(row.id)).map((row) => row.kind === "group" ? row.ip : null))];
    },
    show(report3) {
      simple = report3.source.profile === "ip-ua-only";
      inputSource = report3.source;
      rows = resultRows(report3);
      selected.clear();
      page = 1;
      $("search-results").value = "";
      $("selection-note").textContent = "";
      const values = (key) => [...new Set(rows.flatMap((row) => Array.isArray(row[key]) ? row[key] : [row[key]]))].sort();
      select("filter-status", Object.entries(FINDING_LABELS).filter(([id]) => id !== "claimed-identity-mismatch" || rows.some((row) => row.finding.id === id)), "All findings");
      const unverifiedOption = $("filter-focus").querySelector('option[value="mismatch"], option[value="unverified"]');
      if (unverifiedOption) {
        unverifiedOption.value = "unverified";
        unverifiedOption.textContent = FINDING_LABELS["unverified-crawler-claim"];
      }
      for (const [key, field, rowKey, heading] of [["http", "status", "httpStatus", "http-status-heading"]]) {
        const supplied = inputSource.mapping[field] !== null && inputSource.mapping[field] !== void 0;
        $(`filter-${key}`).closest(".filter-field").hidden = !supplied;
        $(heading).hidden = !supplied;
        const codes = [...new Set(rows.filter((row) => row.kind === "group").map((row) => row[rowKey] ?? "missing"))].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
        select(`filter-${key}`, codes.map((code) => [code, responseStatusLabel(code)]), "All response statuses");
      }
      $("http-filter-help").hidden = inputSource.mapping.status == null;
      select("filter-client", [...Object.entries(CLIENT_LABELS), ["not-parsed", "Not parsed"]], "All client categories");
      select("filter-provider", [[KNOWN, "Known providers"], [UNKNOWN, "Unknown providers"], ...values("providerIds").map((id) => [id, providerNames.get(id) ?? id])], "All published providers");
      const claims = new Map(report3.groups.flatMap((group) => group.result.client.claims.map((claim) => [claim.id, claim.name])));
      select("filter-claim", [[KNOWN, "Known crawler claims"], [UNKNOWN, "Unknown crawler claims"], ...claims], "All crawler claims");
      select("filter-purpose", values("purposes").map((id) => [id, PURPOSES[id] ?? id]), "All purposes");
      select("filter-freshness", values("states").map((state) => [state, stateLabel(state)]), "All source health states");
      for (const id of ["family", "focus"]) $(`filter-${id}`).value = "";
      render();
    }
  };
}

// web/src/export/view.js
var $2 = (id) => document.getElementById(id);
function createExportView({ scope, request }) {
  let ready = false, busy2 = false;
  const urls = /* @__PURE__ */ new Set();
  const ids = ["quick-export-csv", "quick-export-json", "download-export", "export-format", "export-scope"];
  function update() {
    for (const id of ids) $2(id).disabled = !ready || busy2;
    $2("export-scope").disabled = !ready || busy2 || $2("export-format").value === "candidates";
  }
  $2("export-format").addEventListener("change", update);
  $2("download-export").onclick = () => {
    const format = $2("export-format").value;
    if (ready && !busy2) request({ format, ...scope(format === "candidates" ? "selected" : $2("export-scope").value) });
  };
  for (const format of ["csv", "json"]) $2(`quick-export-${format}`).onclick = () => {
    if (ready && !busy2) request({ format, ...scope("all") });
  };
  window.addEventListener("pagehide", () => {
    for (const url of urls) URL.revokeObjectURL(url);
    urls.clear();
  });
  update();
  return {
    setReady(value) {
      ready = value;
      update();
    },
    setBusy(value) {
      busy2 = value;
      update();
    },
    error(message) {
      $2("export-status").textContent = `Export stopped: ${message}`;
    },
    receive(output) {
      const url = URL.createObjectURL(output.blob);
      urls.add(url);
      const link = document.createElement("a");
      link.href = url;
      link.download = output.filename;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        urls.delete(url);
      }, 3e4);
      $2("export-status").textContent = `${output.filename} generated locally (${output.bytes.toLocaleString()} bytes; scope: ${output.scope}).${output.format === "csv" ? " One record per source occurrence; spreadsheet-sensitive cells are prefixed safely." : ""}${output.excluded?.length ? ` ${output.excluded.length} invalid/nonpublic entries excluded from selected IPs.` : ""}`;
    }
  };
}

// worker/src/dns-providers.js
var google = "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests";
var DNS_PROVIDERS = Object.freeze([
  { id: "google", name: "Google", suffix: "googlebot.com", scope: "Common crawler infrastructure", documentationUrl: google },
  { id: "google", name: "Google", suffix: "google.com", scope: "Google crawler/fetcher infrastructure; subtype unresolved", documentationUrl: google },
  { id: "google", name: "Google", suffix: "googleusercontent.com", scope: "Google-hosted infrastructure; may be customer-controlled fetching", documentationUrl: google },
  { id: "microsoft", name: "Microsoft Bing", suffix: "search.msn.com", scope: "Bing crawler infrastructure", documentationUrl: "https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26" },
  { id: "apple", name: "Apple", suffix: "applebot.apple.com", scope: "Applebot infrastructure; subtype unresolved", documentationUrl: "https://support.apple.com/en-us/119829" },
  ...["ahrefs.com", "ahrefs.net"].map((suffix) => ({
    id: "ahrefs",
    name: "Ahrefs",
    suffix,
    scope: "Ahrefs crawler infrastructure; subtype unresolved",
    documentationUrl: "https://ahrefs.com/robot"
  })),
  {
    id: "commoncrawl",
    name: "Common Crawl",
    suffix: "crawl.commoncrawl.org",
    family: 4,
    scope: "CCBot infrastructure (IPv4 only)",
    documentationUrl: "https://www.commoncrawl.org/ccbot"
  },
  ...["yandex.ru", "yandex.net", "yandex.com"].map((suffix) => ({
    id: "yandex",
    name: "Yandex",
    suffix,
    scope: "Yandex robot infrastructure; subtype unresolved",
    documentationUrl: "https://yandex.com/support/webmaster/en/robot-workings/check-yandex-robots"
  }))
]);
function dnsProvider(host, forwardConfirmed, family) {
  if (!forwardConfirmed || typeof host !== "string") return null;
  const name = host.toLowerCase().replace(/\.$/, "");
  if (name.length > 253 || !name.split(".").every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) return null;
  const rule = DNS_PROVIDERS.find((provider) => name.endsWith(`.${provider.suffix}`) && (!provider.family || provider.family === family));
  return rule ? { ...rule } : null;
}

// data/iana/special-purpose.json
var special_purpose_default = {
  schemaVersion: 1,
  observedOn: "2026-10-20",
  sources: [
    {
      url: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      fixture: "ipv4-special.csv",
      sha256: "cbc4b7653c8bc640ba1e8e5d4ebbf11e7c7a1d867e7f1593aad001d3f8632aac",
      observedOn: "2026-10-20"
    },
    {
      url: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      fixture: "ipv6-special.csv",
      sha256: "bf56772aef97fbf9b4a27c98b8511f2bb1ba96da4b9ccc12ab203a2496faba66",
      observedOn: "2026-10-20"
    }
  ],
  ranges: [
    {
      cidr: "0.0.0.0/8",
      name: '"This network"',
      category: "this-network",
      globallyReachable: false,
      reference: "[RFC 791, Section 3.2]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "0.0.0.0/32",
      name: '"This host on this network"',
      category: "unspecified",
      globallyReachable: false,
      reference: "[RFC 1122, Section 3.2.1.3]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "10.0.0.0/8",
      name: "Private-Use",
      category: "private",
      globallyReachable: false,
      reference: "[RFC 1918]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "100.64.0.0/10",
      name: "Shared Address Space",
      category: "shared-address-space",
      globallyReachable: false,
      reference: "[RFC 6598]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "127.0.0.0/8",
      name: "Loopback",
      category: "loopback",
      globallyReachable: false,
      reference: "[RFC 1122, Section 3.2.1.3]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "169.254.0.0/16",
      name: "Link Local",
      category: "link-local",
      globallyReachable: false,
      reference: "[RFC 3927]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "172.16.0.0/12",
      name: "Private-Use",
      category: "private",
      globallyReachable: false,
      reference: "[RFC 1918]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.0/24",
      name: "IETF Protocol Assignments",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 6890, Section 2.1]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.0/29",
      name: "IPv4 Service Continuity Prefix",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 7335]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.8/32",
      name: "IPv4 dummy address",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 7600]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.9/32",
      name: "Port Control Protocol Anycast",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7723]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.10/32",
      name: "Traversal Using Relays around NAT Anycast",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 8155]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.170/32",
      name: "NAT64/DNS64 Discovery",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 8880]; [RFC 7050, Section 2.2]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.0.171/32",
      name: "NAT64/DNS64 Discovery",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 8880]; [RFC 7050, Section 2.2]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.0.2.0/24",
      name: "Documentation (TEST-NET-1)",
      category: "documentation",
      globallyReachable: false,
      reference: "[RFC 5737]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.31.196.0/24",
      name: "AS112-v4",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7535]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.52.193.0/24",
      name: "AMT",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7450]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.88.99.0/24",
      name: "Deprecated (6to4 Relay Anycast)",
      category: "protocol-assignment",
      globallyReachable: null,
      reference: "[RFC 7526]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "2015-03"
    },
    {
      cidr: "192.88.99.2/32",
      name: "6a44-relay anycast address",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 6751]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.168.0.0/16",
      name: "Private-Use",
      category: "private",
      globallyReachable: false,
      reference: "[RFC 1918]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "192.175.48.0/24",
      name: "Direct Delegation AS112 Service",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7534]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "198.18.0.0/15",
      name: "Benchmarking",
      category: "benchmarking",
      globallyReachable: false,
      reference: "[RFC 2544]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "198.51.100.0/24",
      name: "Documentation (TEST-NET-2)",
      category: "documentation",
      globallyReachable: false,
      reference: "[RFC 5737]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "203.0.113.0/24",
      name: "Documentation (TEST-NET-3)",
      category: "documentation",
      globallyReachable: false,
      reference: "[RFC 5737]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "240.0.0.0/4",
      name: "Reserved",
      category: "reserved",
      globallyReachable: false,
      reference: "[RFC 1112, Section 4]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "255.255.255.255/32",
      name: "Limited Broadcast",
      category: "limited-broadcast",
      globallyReachable: false,
      reference: "[RFC 8190]; [RFC 919, Section 7]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "::1/128",
      name: "Loopback Address",
      category: "loopback",
      globallyReachable: false,
      reference: "[RFC 4291]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "::/128",
      name: "Unspecified Address",
      category: "unspecified",
      globallyReachable: false,
      reference: "[RFC 4291]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "::ffff:0:0/96",
      name: "IPv4-mapped Address",
      category: "ipv4-mapped",
      globallyReachable: false,
      reference: "[RFC 4291]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "64:ff9b::/96",
      name: "IPv4-IPv6 Translat.",
      category: "translation",
      globallyReachable: true,
      reference: "[RFC 6052]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "64:ff9b:1::/48",
      name: "IPv4-IPv6 Translat.",
      category: "translation-local",
      globallyReachable: false,
      reference: "[RFC 8215]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "100::/64",
      name: "Discard-Only Address Block",
      category: "discard-only",
      globallyReachable: false,
      reference: "[RFC 6666]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "100:0:0:1::/64",
      name: "Dummy IPv6 Prefix",
      category: "dummy-prefix",
      globallyReachable: false,
      reference: "[RFC 9780]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001::/23",
      name: "IETF Protocol Assignments",
      category: "protocol-assignment",
      globallyReachable: false,
      reference: "[RFC 2928]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001::/32",
      name: "TEREDO",
      category: "teredo",
      globallyReachable: null,
      reference: "[RFC 4380]; [RFC 8190]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:1::1/128",
      name: "Port Control Protocol Anycast",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7723]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:1::2/128",
      name: "Traversal Using Relays around NAT Anycast",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 8155]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:1::3/128",
      name: "DNS-SD Service Registration Protocol Anycast",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 9665]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:2::/48",
      name: "Benchmarking",
      category: "benchmarking",
      globallyReachable: false,
      reference: "[RFC 5180]; [RFC Errata 1752]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:3::/32",
      name: "AMT",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7450]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:4:112::/48",
      name: "AS112-v6",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7535]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:10::/28",
      name: "Deprecated (previously ORCHID)",
      category: "protocol-assignment",
      globallyReachable: null,
      reference: "[RFC 4843]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "2014-03"
    },
    {
      cidr: "2001:20::/28",
      name: "ORCHIDv2",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7343]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:30::/28",
      name: "Drone Remote ID Protocol Entity Tags (DETs) Prefix",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 9374]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2001:db8::/32",
      name: "Documentation",
      category: "documentation",
      globallyReachable: false,
      reference: "[RFC 3849]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2002::/16",
      name: "6to4",
      category: "six-to-four",
      globallyReachable: null,
      reference: "[RFC 3056]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "2620:4f:8000::/48",
      name: "Direct Delegation AS112 Service",
      category: "global-special-purpose",
      globallyReachable: true,
      reference: "[RFC 7534]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "3fff::/20",
      name: "Documentation",
      category: "documentation",
      globallyReachable: false,
      reference: "[RFC 9637]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "5f00::/16",
      name: "Segment Routing (SRv6) SIDs",
      category: "segment-routing",
      globallyReachable: false,
      reference: "[RFC 9602]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "fc00::/7",
      name: "Unique-Local",
      category: "unique-local",
      globallyReachable: false,
      reference: "[RFC 4193]; [RFC 8190]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "fe80::/10",
      name: "Link-Local Unicast",
      category: "link-local",
      globallyReachable: false,
      reference: "[RFC 4291]",
      registryUrl: "https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv",
      terminationDate: "N/A"
    },
    {
      cidr: "224.0.0.0/4",
      name: "IPv4 multicast",
      category: "multicast",
      globallyReachable: false,
      reference: "https://www.rfc-editor.org/rfc/rfc5771",
      registryUrl: "https://www.rfc-editor.org/rfc/rfc5771",
      terminationDate: "N/A"
    },
    {
      cidr: "ff00::/8",
      name: "IPv6 multicast",
      category: "multicast",
      globallyReachable: false,
      reference: "https://www.rfc-editor.org/rfc/rfc4291",
      registryUrl: "https://www.rfc-editor.org/rfc/rfc4291",
      terminationDate: "N/A"
    },
    {
      cidr: "::/96",
      name: "Deprecated IPv4-compatible representation",
      category: "ipv4-compatible",
      globallyReachable: false,
      reference: "https://www.rfc-editor.org/rfc/rfc4291#section-2.5.5.1",
      registryUrl: "https://www.rfc-editor.org/rfc/rfc4291#section-2.5.5.1",
      terminationDate: "N/A"
    }
  ]
};

// web/src/ip/prefix-index.js
var PrefixIndex = class {
  #families = /* @__PURE__ */ new Map([[4, /* @__PURE__ */ new Map()], [6, /* @__PURE__ */ new Map()]]);
  #lengths;
  #size = 0;
  constructor(entries = []) {
    if (!Array.isArray(entries)) throw new TypeError("Range entries must be an array.");
    const seen = /* @__PURE__ */ new Set();
    for (const entry2 of entries) {
      if (!entry2 || typeof entry2.sourceId !== "string" || !entry2.sourceId || typeof entry2.cidr !== "string") {
        throw new TypeError("Every range entry needs a stable sourceId and a CIDR string.");
      }
      const cidr = parseCIDR(entry2.cidr);
      const dedupKey = JSON.stringify([entry2.sourceId, cidr.canonical]);
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);
      const record = Object.freeze({
        ...structuredClone(entry2),
        cidr: cidr.canonical,
        publishedCidr: entry2.cidr
      });
      const prefixes = this.#families.get(cidr.family);
      if (!prefixes.has(cidr.prefixLength)) prefixes.set(cidr.prefixLength, /* @__PURE__ */ new Map());
      const networks2 = prefixes.get(cidr.prefixLength);
      if (!networks2.has(cidr.network)) networks2.set(cidr.network, []);
      networks2.get(cidr.network).push(record);
      this.#size++;
    }
    this.#lengths = new Map([...this.#families].map(([family, prefixes]) => [family, [...prefixes.keys()].sort((a, b) => b - a)]));
  }
  get size() {
    return this.#size;
  }
  get prefixLengths() {
    return { ipv4: [...this.#lengths.get(4)], ipv6: [...this.#lengths.get(6)] };
  }
  lookup(input, { includeMappedIPv4 = false } = {}) {
    const address = parseIP(input);
    const matches = [];
    const find = (ip, matchedVia) => {
      for (const prefix of this.#lengths.get(ip.family)) {
        const shift = BigInt(ip.bits - prefix);
        const network = ip.value >> shift << shift;
        const records = this.#families.get(ip.family).get(prefix).get(network);
        if (records) for (const record of records) {
          matches.push({ ...structuredClone(record), matchedVia });
        }
      }
    };
    find(address, "native");
    if (includeMappedIPv4 && address.isIPv4Mapped) find(parseIP(address.embeddedIPv4), "ipv4-mapped");
    return matches;
  }
};

// web/src/ip/special-use.js
var index = new PrefixIndex(special_purpose_default.ranges.map((range) => ({ ...range, sourceId: "iana-special-purpose" })));
function classifyIP(input) {
  const address = parseIP(input);
  const ranges = index.lookup(address);
  const selected = ranges[0];
  if (address.isIPv4Mapped) {
    const embedded = classifyIP(address.embeddedIPv4);
    return {
      kind: "ipv4-mapped",
      globallyReachable: false,
      matchingAllowed: embedded.matchingAllowed,
      ranges,
      embeddedIPv4: { address: address.embeddedIPv4, classification: embedded },
      explanation: "IPv4-mapped IPv6 representation; IPv4 matching is explicitly projected to the embedded address."
    };
  }
  return {
    kind: selected?.category ?? "public-candidate",
    globallyReachable: selected ? selected.globallyReachable : null,
    matchingAllowed: selected ? selected.globallyReachable === true : true,
    ranges,
    explanation: selected ? `${selected.name}; this is special-purpose address space, not an ordinary public address.` : "No special-purpose assignment in the bundled registry. This does not prove routability, ownership, or human activity."
  };
}

// web/src/dns-ui.js
function createDNSView({ selectedIPs, baseUrl }) {
  const button = document.getElementById("check-dns"), status = document.getElementById("dns-status");
  const output = document.getElementById("dns-results");
  let controller;
  button.onclick = async () => {
    const ips = selectedIPs();
    try {
      if (!ips.length || ips.length > 5) throw new Error("Select one to five distinct public IPs in the results table.");
      if (!document.getElementById("dns-consent").checked) throw new Error("Acknowledge sharing these selected IPs before checking DNS.");
      if (!baseUrl) throw new Error("The lookup service is not configured in this build.");
      for (const ip of ips) {
        const address = parseIP(ip);
        if (address.isIPv4Mapped || !classifyIP(address).matchingAllowed) throw new Error("DNS checks accept public IPs only. Remove invalid, nonpublic or IPv4-mapped selections.");
      }
    } catch (error) {
      status.textContent = error.message;
      return;
    }
    controller?.abort();
    const active = controller = new AbortController();
    output.replaceChildren();
    button.disabled = true;
    try {
      try {
        const probe = await fetch(new URL("/v1/dns/check", baseUrl), {
          method: "GET",
          credentials: "omit",
          referrerPolicy: "no-referrer",
          redirect: "error",
          signal: active.signal
        });
        if (probe.status !== 405) throw new Error("dns-backend-missing");
      } catch (error) {
        if (active.signal.aborted) throw error;
        throw new Error("The DNS service is unavailable or its backend is outdated. Deploy the current dataset-worker.js and confirm the exact frontend origin is allowed.");
      }
      let live = 0, reused = 0;
      for (const [index2, ip] of ips.entries()) {
        status.textContent = `Checking DNS ${index2 + 1} of ${ips.length}\u2026`;
        const response = await fetch(new URL("/v1/dns/check", baseUrl), {
          method: "POST",
          credentials: "omit",
          referrerPolicy: "no-referrer",
          redirect: "error",
          signal: active.signal,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ip })
        });
        if (!response.ok) {
          if (response.status === 429) throw new Error("Fresh DNS lookup limit reached. Wait at least one minute and try again; the service also has a daily budget. Unexpired cached results remain available.");
          throw new Error("DNS lookup unavailable. Confirm the updated backend is deployed, or try again later.");
        }
        const result = await response.json();
        if (active !== controller) return;
        if (result.cache?.hit || result.cache?.coalesced) reused++;
        else live++;
        const item = document.createElement("li"), header = document.createElement("div"), title = document.createElement("strong"), state = document.createElement("span");
        header.className = "dns-result-header";
        title.textContent = ip;
        state.className = "dns-result-state";
        state.textContent = result.status === "forward-confirmed" ? "Forward-confirmed hostname" : result.status === "no-ptr" ? "No PTR record" : "Forward confirmation not established";
        header.append(title, state);
        item.append(header);
        const more = document.createElement("details"), summary = document.createElement("summary");
        more.className = "dns-result-more";
        summary.textContent = "Lookup details";
        more.append(summary);
        for (const host of result.hosts) {
          const p = document.createElement("p");
          p.textContent = `${host.hostname} \u2014 ${host.forwardConfirmed ? "resolves back to this IP" : "forward check not confirmed"}.`;
          item.append(p);
          const addresses2 = document.createElement("p");
          addresses2.textContent = `Addresses: ${host.addresses.join(", ") || "none"}.`;
          more.append(addresses2);
          const provider = dnsProvider(host.hostname, host.forwardConfirmed, parseIP(ip).family);
          if (provider) {
            const evidence = document.createElement("p"), logo = providerLogo(provider.id);
            evidence.append("DNS provider evidence: ");
            if (logo) evidence.append(logo);
            evidence.append(`${provider.name} \u2014 ${provider.scope}. `);
            const reference = document.createElement("a");
            reference.href = provider.documentationUrl;
            reference.target = "_blank";
            reference.rel = "noopener noreferrer";
            reference.textContent = `Documented .${provider.suffix} domain + forward confirmation`;
            evidence.append(reference);
            item.append(evidence);
          }
        }
        if (!result.hosts.some((host) => dnsProvider(host.hostname, host.forwardConfirmed, parseIP(ip).family))) {
          const noProvider = document.createElement("p");
          noProvider.className = "note";
          noProvider.textContent = "No supported provider identified by DNS. A missing PTR, an unsupported domain or a failed forward check does not establish spoofing.";
          more.append(noProvider);
        }
        const note = document.createElement("p");
        note.className = "note";
        const delivery = result.cache?.hit ? "Cached DNS result" : result.cache?.coalesced ? "Shared DNS lookup" : "Live DNS lookup";
        const expiry = result.cache?.expiresAt ? ` Expires ${result.cache.expiresAt}.` : result.cache ? " Not cached: no reusable DNS lifetime remains." : "";
        note.textContent = `${delivery}. Checked ${result.checkedAt}.${expiry}${result.cache?.hit || result.cache?.coalesced ? " No additional DNS lookup used." : ""} ${result.limitation}${result.uncheckedHosts ? ` ${result.uncheckedHosts} additional PTR names were not checked.` : ""}`;
        more.append(note);
        item.append(more);
        output.append(item);
      }
      status.textContent = `DNS investigation complete. ${live} live ${live === 1 ? "lookup" : "lookups"}; ${reused} reused ${reused === 1 ? "result" : "results"}. Published-range findings remain separate.`;
    } catch (error) {
      if (!active.signal.aborted) status.textContent = error instanceof TypeError ? "The browser could not reach the DNS service. Check the deployed backend, frontend origin and browser Network panel. No DNS result was returned." : error.message;
    } finally {
      if (active === controller) button.disabled = false;
    }
  };
  return { reset() {
    controller?.abort();
    controller = null;
    button.disabled = false;
    output.replaceChildren();
    status.textContent = "Select rows in the results table, then check up to five public IPs.";
    document.getElementById("dns-consent").checked = false;
  } };
}

// web/src/results/overview.js
var unique2 = (values) => [...new Set(values)];
function summarizeFindings(report3, dataset) {
  const groups = report3.groups;
  const ips = unique2(groups.map((group) => group.ip));
  const current = groups.flatMap((group) => group.result.infrastructure.currentMatches);
  const observed = groups.flatMap((group) => group.result.infrastructure.observedMatches);
  const providers = unique2(current.map((match) => match.providerName));
  const observedProviders = unique2(observed.map((match) => match.providerName));
  const single = ips.length === 1;
  const findings = groups.map((group) => assessmentFinding(group.result));
  const findingIds = unique2(findings.map((finding) => finding.id));
  const singleFinding = single && findingIds.length === 1 ? findings[0] : null;
  let title, description;
  if (!groups.length) {
    title = "No valid IP addresses";
    description = "Check Analysis summary for invalid input, correct it, then analyze again.";
  } else if (single) {
    title = singleFinding?.label ?? "Review this IP\u2019s findings";
    description = current.length ? singleFinding?.id === "official-infrastructure-match" ? "Matches the available public infrastructure." : "Published infrastructure matches; review the crawler claim in the results." : observed.length ? "Only noncurrent infrastructure evidence is available." : singleFinding?.id === "invalid-nonpublic" ? "This is a nonpublic or special-use address." : singleFinding?.id === "unverified-crawler-claim" ? "A recognized crawler is claimed, but its provider is not established by the available published ranges. See the evidence details." : singleFinding?.id === "could-not-verify" ? "The available evidence is insufficient. See Analysis summary." : "No match in the available public ranges.";
  } else if (findingIds.every((id) => id === "official-infrastructure-match")) {
    title = "Published infrastructure found";
    description = "Matches the available public infrastructure.";
  } else if (current.length) {
    title = "Matches and unconfirmed entries";
    description = "Published matches and unverified entries. See traffic results.";
  } else if (findingIds.every((id) => id === "unverified-crawler-claim")) {
    title = FINDING_LABELS["unverified-crawler-claim"];
    description = "Recognized crawler claims have no observed published provider match. Review the evidence details; this does not establish impersonation or abuse.";
  } else if (findingIds.includes("could-not-verify")) {
    title = "Current evidence is incomplete";
    description = "Current evidence is incomplete. See Analysis summary.";
  } else {
    title = "No published range match";
    description = "No match in the available public ranges.";
  }
  const claimCounts = /* @__PURE__ */ new Map();
  for (const group of groups) for (const claim of new Map(group.result.client.claims.map((claim2) => [claim2.id, claim2])).values()) {
    const entry2 = claimCounts.get(claim.id) ?? { id: claim.id, name: claim.name, providerId: claim.providerId, count: 0 };
    entry2.count += group.occurrences.length;
    claimCounts.set(claim.id, entry2);
  }
  const topClaims = [...claimCounts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 3);
  const displayMatches = current.length ? current : observed;
  return {
    topClaims,
    single,
    ip: single ? ips[0] : null,
    title,
    description,
    badgeStatus: singleFinding?.id ?? null,
    currentProvider: current.length > 0,
    providers: unique2(displayMatches.map((match) => match.providerId)).map((id) => ({ id, name: displayMatches.find((match) => match.providerId === id).providerName })),
    categories: unique2(displayMatches.map((match) => categoryLabel(match.category))).filter(Boolean),
    providerLabel: providers.length ? "Published provider" : observedProviders.length ? "Observed provider (noncurrent)" : "Published provider",
    providerNames: providers.length ? providers : observedProviders,
    showResultsLink: groups.length > 0 && (!single || groups.length > 1),
    providerNotes: unique2(observed.map((match) => `${match.providerName} \xB7 ${match.sourceId} \xB7 ${match.publishedCidr ?? match.cidr}${match.health?.current ? "" : " \xB7 noncurrent evidence"}`))
  };
}

// web/src/import-ui.js
var $3 = (id) => document.getElementById(id);
var datasetOrigin = "https://crawler-ip-verifier-dataset.alexanderkyriakou.workers.dev";
var workerSource = "var __create = Object.create;\nvar __defProp = Object.defineProperty;\nvar __getOwnPropDesc = Object.getOwnPropertyDescriptor;\nvar __getOwnPropNames = Object.getOwnPropertyNames;\nvar __getProtoOf = Object.getPrototypeOf;\nvar __hasOwnProp = Object.prototype.hasOwnProperty;\nvar __commonJS = (cb, mod) => function __require() {\n  try {\n    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;\n  } catch (e) {\n    throw mod = 0, e;\n  }\n};\nvar __copyProps = (to, from, except, desc) => {\n  if (from && typeof from === \"object\" || typeof from === \"function\") {\n    for (let key of __getOwnPropNames(from))\n      if (!__hasOwnProp.call(to, key) && key !== except)\n        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });\n  }\n  return to;\n};\nvar __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(\n  // If the importer is in node compatibility mode or this is not an ESM\n  // file that has been converted to a CommonJS file using a Babel-\n  // compatible transform (i.e. \"__esModule\" has not been set), then set\n  // \"default\" to the CommonJS \"module.exports\" for node compatibility.\n  isNodeMode || !mod || !mod.__esModule ? __defProp(target, \"default\", { value: mod, enumerable: true }) : target,\n  mod\n));\n\n// node_modules/ipaddr.js/lib/ipaddr.js\nvar require_ipaddr = __commonJS({\n  \"node_modules/ipaddr.js/lib/ipaddr.js\"(exports, module) {\n    (function(root) {\n      \"use strict\";\n      const ipv4Part = \"(0?\\\\d+|0x[a-f0-9]+)\";\n      const ipv4Regexes = {\n        fourOctet: new RegExp(`^${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}$`, \"i\"),\n        threeOctet: new RegExp(`^${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}$`, \"i\"),\n        twoOctet: new RegExp(`^${ipv4Part}\\\\.${ipv4Part}$`, \"i\"),\n        longValue: new RegExp(`^${ipv4Part}$`, \"i\")\n      };\n      const octalRegex = new RegExp(`^0[0-7]+$`, \"i\");\n      const hexRegex = new RegExp(`^0x[a-f0-9]+$`, \"i\");\n      const zoneIndex = \"%[0-9a-z]{1,}\";\n      const ipv6Part = \"(?:[0-9a-f]+::?)+\";\n      const ipv6Regexes = {\n        zoneIndex: new RegExp(zoneIndex, \"i\"),\n        \"native\": new RegExp(`^(::)?(${ipv6Part})?([0-9a-f]+)?(::)?(${zoneIndex})?$`, \"i\"),\n        deprecatedTransitional: new RegExp(`^(?:::)(${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}(${zoneIndex})?)$`, \"i\"),\n        transitional: new RegExp(`^((?:${ipv6Part})|(?:::)(?:${ipv6Part})?)${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}\\\\.${ipv4Part}(${zoneIndex})?$`, \"i\")\n      };\n      function expandIPv6(string, parts) {\n        if (string.indexOf(\"::\") !== string.lastIndexOf(\"::\")) {\n          return null;\n        }\n        let colonCount = 0;\n        let lastColon = -1;\n        let zoneId = (string.match(ipv6Regexes.zoneIndex) || [])[0];\n        let replacement, replacementCount;\n        if (zoneId) {\n          zoneId = zoneId.substring(1);\n          string = string.replace(/%.+$/, \"\");\n        }\n        while ((lastColon = string.indexOf(\":\", lastColon + 1)) >= 0) {\n          colonCount++;\n        }\n        if (string.substr(0, 2) === \"::\") {\n          colonCount--;\n        }\n        if (string.substr(-2, 2) === \"::\") {\n          colonCount--;\n        }\n        if (colonCount >= parts) {\n          return null;\n        }\n        replacementCount = parts - colonCount;\n        replacement = \":\";\n        while (replacementCount--) {\n          replacement += \"0:\";\n        }\n        string = string.replace(\"::\", replacement);\n        if (string[0] === \":\") {\n          string = string.slice(1);\n        }\n        if (string[string.length - 1] === \":\") {\n          string = string.slice(0, -1);\n        }\n        parts = (function() {\n          const ref = string.split(\":\");\n          const results = [];\n          for (let i = 0; i < ref.length; i++) {\n            results.push(ref[i].length > 4 ? NaN : parseInt(ref[i], 16));\n          }\n          return results;\n        })();\n        return {\n          parts,\n          zoneId\n        };\n      }\n      function matchCIDR(first, second, partSize, cidrBits) {\n        if (first.length !== second.length) {\n          throw new Error(\"ipaddr: cannot match CIDR for objects with different lengths\");\n        }\n        let part = 0;\n        let shift;\n        while (cidrBits > 0) {\n          shift = partSize - cidrBits;\n          if (shift < 0) {\n            shift = 0;\n          }\n          if (first[part] >> shift !== second[part] >> shift) {\n            return false;\n          }\n          cidrBits -= partSize;\n          part += 1;\n        }\n        return true;\n      }\n      function parseIntAuto(string) {\n        if (hexRegex.test(string)) {\n          return parseInt(string, 16);\n        }\n        if (string[0] === \"0\" && !isNaN(parseInt(string[1], 10))) {\n          if (octalRegex.test(string)) {\n            return parseInt(string, 8);\n          }\n          throw new Error(`ipaddr: cannot parse ${string} as octal`);\n        }\n        return parseInt(string, 10);\n      }\n      function padPart(part, length) {\n        while (part.length < length) {\n          part = `0${part}`;\n        }\n        return part;\n      }\n      const ipaddr2 = {};\n      ipaddr2.IPv4 = (function() {\n        function IPv4(octets) {\n          if (octets.length !== 4) {\n            throw new Error(\"ipaddr: ipv4 octet count should be 4\");\n          }\n          let i, octet;\n          for (i = 0; i < octets.length; i++) {\n            octet = octets[i];\n            if (!(0 <= octet && octet <= 255)) {\n              throw new Error(\"ipaddr: ipv4 octet should fit in 8 bits\");\n            }\n          }\n          this.octets = octets;\n        }\n        IPv4.prototype.SpecialRanges = {\n          unspecified: [[new IPv4([0, 0, 0, 0]), 8]],\n          broadcast: [[new IPv4([255, 255, 255, 255]), 32]],\n          // RFC3171\n          multicast: [[new IPv4([224, 0, 0, 0]), 4]],\n          // RFC3927\n          linkLocal: [[new IPv4([169, 254, 0, 0]), 16]],\n          // RFC5735\n          loopback: [[new IPv4([127, 0, 0, 0]), 8]],\n          // RFC6598\n          carrierGradeNat: [[new IPv4([100, 64, 0, 0]), 10]],\n          // RFC1918\n          \"private\": [\n            [new IPv4([10, 0, 0, 0]), 8],\n            [new IPv4([172, 16, 0, 0]), 12],\n            [new IPv4([192, 168, 0, 0]), 16]\n          ],\n          // Reserved and testing-only ranges; RFCs 5735, 5737, 2544, 1700\n          reserved: [\n            [new IPv4([192, 0, 0, 0]), 24],\n            [new IPv4([192, 0, 2, 0]), 24],\n            [new IPv4([192, 88, 99, 0]), 24],\n            [new IPv4([198, 18, 0, 0]), 15],\n            [new IPv4([198, 51, 100, 0]), 24],\n            [new IPv4([203, 0, 113, 0]), 24],\n            [new IPv4([240, 0, 0, 0]), 4]\n          ],\n          // RFC7534, RFC7535\n          as112: [\n            [new IPv4([192, 175, 48, 0]), 24],\n            [new IPv4([192, 31, 196, 0]), 24]\n          ],\n          // RFC7450\n          amt: [\n            [new IPv4([192, 52, 193, 0]), 24]\n          ]\n        };\n        IPv4.prototype.kind = function() {\n          return \"ipv4\";\n        };\n        IPv4.prototype.match = function(other, cidrRange) {\n          let ref;\n          if (cidrRange === void 0) {\n            ref = other;\n            other = ref[0];\n            cidrRange = ref[1];\n          }\n          if (other.kind() !== \"ipv4\") {\n            throw new Error(\"ipaddr: cannot match ipv4 address with non-ipv4 one\");\n          }\n          return matchCIDR(this.octets, other.octets, 8, cidrRange);\n        };\n        IPv4.prototype.prefixLengthFromSubnetMask = function() {\n          let cidr = 0;\n          let stop = false;\n          const zerotable = {\n            0: 8,\n            128: 7,\n            192: 6,\n            224: 5,\n            240: 4,\n            248: 3,\n            252: 2,\n            254: 1,\n            255: 0\n          };\n          let i, octet, zeros;\n          for (i = 3; i >= 0; i -= 1) {\n            octet = this.octets[i];\n            if (octet in zerotable) {\n              zeros = zerotable[octet];\n              if (stop && zeros !== 0) {\n                return null;\n              }\n              if (zeros !== 8) {\n                stop = true;\n              }\n              cidr += zeros;\n            } else {\n              return null;\n            }\n          }\n          return 32 - cidr;\n        };\n        IPv4.prototype.range = function() {\n          return ipaddr2.subnetMatch(this, this.SpecialRanges);\n        };\n        IPv4.prototype.toByteArray = function() {\n          return this.octets.slice(0);\n        };\n        IPv4.prototype.toIPv4MappedAddress = function() {\n          return ipaddr2.IPv6.parse(`::ffff:${this.toString()}`);\n        };\n        IPv4.prototype.toNormalizedString = function() {\n          return this.toString();\n        };\n        IPv4.prototype.toString = function() {\n          return this.octets.join(\".\");\n        };\n        return IPv4;\n      })();\n      ipaddr2.IPv4.broadcastAddressFromCIDR = function(string) {\n        try {\n          const cidr = this.parseCIDR(string);\n          const ipInterfaceOctets = cidr[0].toByteArray();\n          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();\n          const octets = [];\n          let i = 0;\n          while (i < 4) {\n            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);\n            i++;\n          }\n          return new this(octets);\n        } catch (e) {\n          throw new Error(\"ipaddr: the address does not have IPv4 CIDR format\", { cause: e });\n        }\n      };\n      ipaddr2.IPv4.isIPv4 = function(string) {\n        return this.parser(string) !== null;\n      };\n      ipaddr2.IPv4.isValid = function(string) {\n        try {\n          new this(this.parser(string));\n          return true;\n        } catch {\n          return false;\n        }\n      };\n      ipaddr2.IPv4.isValidCIDR = function(string) {\n        try {\n          this.parseCIDR(string);\n          return true;\n        } catch {\n          return false;\n        }\n      };\n      ipaddr2.IPv4.isValidFourPartDecimal = function(string) {\n        if (ipaddr2.IPv4.isValid(string) && string.match(/^(0|[1-9]\\d*)(\\.(0|[1-9]\\d*)){3}$/)) {\n          return true;\n        } else {\n          return false;\n        }\n      };\n      ipaddr2.IPv4.isValidCIDRFourPartDecimal = function(string) {\n        const match = string.match(/^(.+)\\/(\\d+)$/);\n        if (!ipaddr2.IPv4.isValidCIDR(string) || !match) {\n          return false;\n        }\n        return ipaddr2.IPv4.isValidFourPartDecimal(match[1]);\n      };\n      ipaddr2.IPv4.networkAddressFromCIDR = function(string) {\n        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;\n        try {\n          cidr = this.parseCIDR(string);\n          ipInterfaceOctets = cidr[0].toByteArray();\n          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();\n          octets = [];\n          i = 0;\n          while (i < 4) {\n            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));\n            i++;\n          }\n          return new this(octets);\n        } catch (e) {\n          throw new Error(\"ipaddr: the address does not have IPv4 CIDR format\", { cause: e });\n        }\n      };\n      ipaddr2.IPv4.parse = function(string) {\n        const parts = this.parser(string);\n        if (parts === null) {\n          throw new Error(\"ipaddr: string is not formatted like an IPv4 Address\");\n        }\n        return new this(parts);\n      };\n      ipaddr2.IPv4.parseCIDR = function(string) {\n        let match;\n        if (match = string.match(/^(.+)\\/(\\d+)$/)) {\n          const maskLength = parseInt(match[2]);\n          if (maskLength >= 0 && maskLength <= 32) {\n            const parsed = [this.parse(match[1]), maskLength];\n            Object.defineProperty(parsed, \"toString\", {\n              value: function() {\n                return this.join(\"/\");\n              }\n            });\n            return parsed;\n          }\n        }\n        throw new Error(\"ipaddr: string is not formatted like an IPv4 CIDR range\");\n      };\n      ipaddr2.IPv4.parser = function(string) {\n        let match, part, value;\n        if (match = string.match(ipv4Regexes.fourOctet)) {\n          return (function() {\n            const ref = match.slice(1, 6);\n            const results = [];\n            for (let i = 0; i < ref.length; i++) {\n              part = ref[i];\n              results.push(parseIntAuto(part));\n            }\n            return results;\n          })();\n        } else if (match = string.match(ipv4Regexes.longValue)) {\n          value = parseIntAuto(match[1]);\n          if (value > 4294967295 || value < 0) {\n            throw new Error(\"ipaddr: address outside defined range\");\n          }\n          return (function() {\n            const results = [];\n            let shift;\n            for (shift = 0; shift <= 24; shift += 8) {\n              results.push(value >> shift & 255);\n            }\n            return results;\n          })().reverse();\n        } else if (match = string.match(ipv4Regexes.twoOctet)) {\n          return (function() {\n            const ref = match.slice(1, 4);\n            const results = [];\n            value = parseIntAuto(ref[1]);\n            if (value > 16777215 || value < 0) {\n              throw new Error(\"ipaddr: address outside defined range\");\n            }\n            results.push(parseIntAuto(ref[0]));\n            results.push(value >> 16 & 255);\n            results.push(value >> 8 & 255);\n            results.push(value & 255);\n            return results;\n          })();\n        } else if (match = string.match(ipv4Regexes.threeOctet)) {\n          return (function() {\n            const ref = match.slice(1, 5);\n            const results = [];\n            value = parseIntAuto(ref[2]);\n            if (value > 65535 || value < 0) {\n              throw new Error(\"ipaddr: address outside defined range\");\n            }\n            results.push(parseIntAuto(ref[0]));\n            results.push(parseIntAuto(ref[1]));\n            results.push(value >> 8 & 255);\n            results.push(value & 255);\n            return results;\n          })();\n        } else {\n          return null;\n        }\n      };\n      ipaddr2.IPv4.subnetMaskFromPrefixLength = function(prefix) {\n        prefix = parseInt(prefix);\n        if (Number.isNaN(prefix) || prefix < 0 || prefix > 32) {\n          throw new Error(\"ipaddr: invalid IPv4 prefix length\");\n        }\n        const octets = [0, 0, 0, 0];\n        let j = 0;\n        const filledOctetCount = Math.floor(prefix / 8);\n        while (j < filledOctetCount) {\n          octets[j] = 255;\n          j++;\n        }\n        if (filledOctetCount < 4) {\n          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;\n        }\n        return new this(octets);\n      };\n      ipaddr2.IPv6 = (function() {\n        function IPv6(parts, zoneId) {\n          let i, part;\n          if (parts.length === 16) {\n            this.parts = [];\n            for (i = 0; i <= 14; i += 2) {\n              this.parts.push(parts[i] << 8 | parts[i + 1]);\n            }\n          } else if (parts.length === 8) {\n            this.parts = parts;\n          } else {\n            throw new Error(\"ipaddr: ipv6 part count should be 8 or 16\");\n          }\n          for (i = 0; i < this.parts.length; i++) {\n            part = this.parts[i];\n            if (!(0 <= part && part <= 65535)) {\n              throw new Error(\"ipaddr: ipv6 part should fit in 16 bits\");\n            }\n          }\n          if (zoneId) {\n            this.zoneId = zoneId;\n          }\n        }\n        IPv6.prototype.SpecialRanges = {\n          // RFC4291, here and after\n          unspecified: [new IPv6([0, 0, 0, 0, 0, 0, 0, 0]), 128],\n          linkLocal: [new IPv6([65152, 0, 0, 0, 0, 0, 0, 0]), 10],\n          multicast: [new IPv6([65280, 0, 0, 0, 0, 0, 0, 0]), 8],\n          loopback: [new IPv6([0, 0, 0, 0, 0, 0, 0, 1]), 128],\n          uniqueLocal: [new IPv6([64512, 0, 0, 0, 0, 0, 0, 0]), 7],\n          ipv4Mapped: [new IPv6([0, 0, 0, 0, 0, 65535, 0, 0]), 96],\n          // RFC3879\n          deprecatedSiteLocal: [new IPv6([65216, 0, 0, 0, 0, 0, 0, 0]), 10],\n          // RFC6666\n          discard: [new IPv6([256, 0, 0, 0, 0, 0, 0, 0]), 64],\n          // RFC6145\n          rfc6145: [new IPv6([0, 0, 0, 0, 65535, 0, 0, 0]), 96],\n          rfc6052: [\n            // RFC6052\n            [new IPv6([100, 65435, 0, 0, 0, 0, 0, 0]), 96],\n            // RFC8215\n            [new IPv6([100, 65435, 1, 0, 0, 0, 0, 0]), 48]\n          ],\n          // RFC3056\n          \"6to4\": [new IPv6([8194, 0, 0, 0, 0, 0, 0, 0]), 16],\n          // RFC6052, RFC6146\n          teredo: [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 32],\n          // RFC5180\n          benchmarking: [new IPv6([8193, 2, 0, 0, 0, 0, 0, 0]), 48],\n          // RFC7450\n          amt: [new IPv6([8193, 3, 0, 0, 0, 0, 0, 0]), 32],\n          as112v6: [\n            // RFC7535\n            [new IPv6([8193, 4, 274, 0, 0, 0, 0, 0]), 48],\n            // RFC7534\n            [new IPv6([9760, 79, 32768, 0, 0, 0, 0, 0]), 48]\n          ],\n          // RFC4843\n          deprecatedOrchid: [new IPv6([8193, 16, 0, 0, 0, 0, 0, 0]), 28],\n          // RFC7343\n          orchid2: [new IPv6([8193, 32, 0, 0, 0, 0, 0, 0]), 28],\n          // RFC9374\n          droneRemoteIdProtocolEntityTags: [new IPv6([8193, 48, 0, 0, 0, 0, 0, 0]), 28],\n          // RFC9602\n          segmentRouting: [new IPv6([24320, 0, 0, 0, 0, 0, 0, 0]), 16],\n          reserved: [\n            // RFC3849\n            [new IPv6([8193, 0, 0, 0, 0, 0, 0, 0]), 23],\n            // RFC2928\n            [new IPv6([8193, 3512, 0, 0, 0, 0, 0, 0]), 32],\n            // RFC9637\n            [new IPv6([16383, 0, 0, 0, 0, 0, 0, 0]), 20]\n          ]\n        };\n        IPv6.prototype.isIPv4MappedAddress = function() {\n          return this.range() === \"ipv4Mapped\";\n        };\n        IPv6.prototype.kind = function() {\n          return \"ipv6\";\n        };\n        IPv6.prototype.match = function(other, cidrRange) {\n          let ref;\n          if (cidrRange === void 0) {\n            ref = other;\n            other = ref[0];\n            cidrRange = ref[1];\n          }\n          if (other.kind() !== \"ipv6\") {\n            throw new Error(\"ipaddr: cannot match ipv6 address with non-ipv6 one\");\n          }\n          return matchCIDR(this.parts, other.parts, 16, cidrRange);\n        };\n        IPv6.prototype.prefixLengthFromSubnetMask = function() {\n          let cidr = 0;\n          let stop = false;\n          const zerotable = {\n            0: 16,\n            32768: 15,\n            49152: 14,\n            57344: 13,\n            61440: 12,\n            63488: 11,\n            64512: 10,\n            65024: 9,\n            65280: 8,\n            65408: 7,\n            65472: 6,\n            65504: 5,\n            65520: 4,\n            65528: 3,\n            65532: 2,\n            65534: 1,\n            65535: 0\n          };\n          let part, zeros;\n          for (let i = 7; i >= 0; i -= 1) {\n            part = this.parts[i];\n            if (part in zerotable) {\n              zeros = zerotable[part];\n              if (stop && zeros !== 0) {\n                return null;\n              }\n              if (zeros !== 16) {\n                stop = true;\n              }\n              cidr += zeros;\n            } else {\n              return null;\n            }\n          }\n          return 128 - cidr;\n        };\n        IPv6.prototype.range = function() {\n          return ipaddr2.subnetMatch(this, this.SpecialRanges);\n        };\n        IPv6.prototype.toByteArray = function() {\n          let part;\n          const bytes = [];\n          const ref = this.parts;\n          for (let i = 0; i < ref.length; i++) {\n            part = ref[i];\n            bytes.push(part >> 8);\n            bytes.push(part & 255);\n          }\n          return bytes;\n        };\n        IPv6.prototype.toFixedLengthString = function() {\n          const addr = (function() {\n            const results = [];\n            for (let i = 0; i < this.parts.length; i++) {\n              results.push(padPart(this.parts[i].toString(16), 4));\n            }\n            return results;\n          }).call(this).join(\":\");\n          let suffix = \"\";\n          if (this.zoneId) {\n            suffix = `%${this.zoneId}`;\n          }\n          return addr + suffix;\n        };\n        IPv6.prototype.toIPv4Address = function() {\n          if (!this.isIPv4MappedAddress()) {\n            throw new Error(\"ipaddr: trying to convert a generic ipv6 address to ipv4\");\n          }\n          const ref = this.parts.slice(-2);\n          const high = ref[0];\n          const low = ref[1];\n          return new ipaddr2.IPv4([high >> 8, high & 255, low >> 8, low & 255]);\n        };\n        IPv6.prototype.toNormalizedString = function() {\n          const addr = (function() {\n            const results = [];\n            for (let i = 0; i < this.parts.length; i++) {\n              results.push(this.parts[i].toString(16));\n            }\n            return results;\n          }).call(this).join(\":\");\n          let suffix = \"\";\n          if (this.zoneId) {\n            suffix = `%${this.zoneId}`;\n          }\n          return addr + suffix;\n        };\n        IPv6.prototype.toRFC5952String = function() {\n          const regex = /((^|:)(0(:|$)){2,})/g;\n          let suffix = \"\";\n          if (this.zoneId) {\n            suffix = `%${this.zoneId}`;\n          }\n          const normalized = this.toNormalizedString();\n          const string = normalized.slice(0, normalized.length - suffix.length);\n          let bestMatchIndex = 0;\n          let bestMatchLength = -1;\n          let bestMatchGroups = -1;\n          let match;\n          while (match = regex.exec(string)) {\n            const groups = (match[0].match(/0/g) || []).length;\n            if (groups > bestMatchGroups) {\n              bestMatchGroups = groups;\n              bestMatchIndex = match.index;\n              bestMatchLength = match[0].length;\n            }\n          }\n          if (bestMatchLength < 0) {\n            return string + suffix;\n          }\n          return `${string.substring(0, bestMatchIndex)}::${string.substring(bestMatchIndex + bestMatchLength)}${suffix}`;\n        };\n        IPv6.prototype.toString = function() {\n          return this.toRFC5952String();\n        };\n        return IPv6;\n      })();\n      ipaddr2.IPv6.broadcastAddressFromCIDR = function(string) {\n        try {\n          const cidr = this.parseCIDR(string);\n          const ipInterfaceOctets = cidr[0].toByteArray();\n          const subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();\n          const octets = [];\n          let i = 0;\n          while (i < 16) {\n            octets.push(parseInt(ipInterfaceOctets[i], 10) | parseInt(subnetMaskOctets[i], 10) ^ 255);\n            i++;\n          }\n          return new this(octets);\n        } catch (e) {\n          throw new Error(\"ipaddr: the address does not have IPv6 CIDR format\", { cause: e });\n        }\n      };\n      ipaddr2.IPv6.isIPv6 = function(string) {\n        return this.parser(string) !== null;\n      };\n      ipaddr2.IPv6.isValid = function(string) {\n        if (typeof string === \"string\" && string.indexOf(\":\") === -1) {\n          return false;\n        }\n        try {\n          const addr = this.parser(string);\n          new this(addr.parts, addr.zoneId);\n          return true;\n        } catch {\n          return false;\n        }\n      };\n      ipaddr2.IPv6.isValidCIDR = function(string) {\n        if (typeof string === \"string\" && string.indexOf(\":\") === -1) {\n          return false;\n        }\n        try {\n          this.parseCIDR(string);\n          return true;\n        } catch {\n          return false;\n        }\n      };\n      ipaddr2.IPv6.networkAddressFromCIDR = function(string) {\n        let cidr, i, ipInterfaceOctets, octets, subnetMaskOctets;\n        try {\n          cidr = this.parseCIDR(string);\n          ipInterfaceOctets = cidr[0].toByteArray();\n          subnetMaskOctets = this.subnetMaskFromPrefixLength(cidr[1]).toByteArray();\n          octets = [];\n          i = 0;\n          while (i < 16) {\n            octets.push(parseInt(ipInterfaceOctets[i], 10) & parseInt(subnetMaskOctets[i], 10));\n            i++;\n          }\n          return new this(octets);\n        } catch (e) {\n          throw new Error(\"ipaddr: the address does not have IPv6 CIDR format\", { cause: e });\n        }\n      };\n      ipaddr2.IPv6.parse = function(string) {\n        const addr = this.parser(string);\n        if (addr === null) {\n          throw new Error(\"ipaddr: string is not formatted like an IPv6 Address\");\n        }\n        return new this(addr.parts, addr.zoneId);\n      };\n      ipaddr2.IPv6.parseCIDR = function(string) {\n        let maskLength, match, parsed;\n        if (match = string.match(/^(.+)\\/(\\d+)$/)) {\n          maskLength = parseInt(match[2]);\n          if (maskLength >= 0 && maskLength <= 128) {\n            parsed = [this.parse(match[1]), maskLength];\n            Object.defineProperty(parsed, \"toString\", {\n              value: function() {\n                return this.join(\"/\");\n              }\n            });\n            return parsed;\n          }\n        }\n        throw new Error(\"ipaddr: string is not formatted like an IPv6 CIDR range\");\n      };\n      ipaddr2.IPv6.parser = function(string) {\n        let addr, i, match, octet, octets, zoneId;\n        if (match = string.match(ipv6Regexes.deprecatedTransitional)) {\n          return this.parser(`::ffff:${match[1]}`);\n        }\n        if (ipv6Regexes.native.test(string)) {\n          return expandIPv6(string, 8);\n        }\n        if (match = string.match(ipv6Regexes.transitional)) {\n          zoneId = match[6] || \"\";\n          addr = match[1];\n          if (!match[1].endsWith(\"::\")) {\n            addr = addr.slice(0, -1);\n          }\n          addr = expandIPv6(addr + zoneId, 6);\n          if (addr && addr.parts) {\n            octets = [\n              parseInt(match[2]),\n              parseInt(match[3]),\n              parseInt(match[4]),\n              parseInt(match[5])\n            ];\n            for (i = 0; i < octets.length; i++) {\n              octet = octets[i];\n              if (!(0 <= octet && octet <= 255)) {\n                return null;\n              }\n            }\n            addr.parts.push(octets[0] << 8 | octets[1]);\n            addr.parts.push(octets[2] << 8 | octets[3]);\n            return {\n              parts: addr.parts,\n              zoneId: addr.zoneId\n            };\n          }\n        }\n        return null;\n      };\n      ipaddr2.IPv6.subnetMaskFromPrefixLength = function(prefix) {\n        prefix = parseInt(prefix);\n        if (Number.isNaN(prefix) || prefix < 0 || prefix > 128) {\n          throw new Error(\"ipaddr: invalid IPv6 prefix length\");\n        }\n        const octets = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];\n        let j = 0;\n        const filledOctetCount = Math.floor(prefix / 8);\n        while (j < filledOctetCount) {\n          octets[j] = 255;\n          j++;\n        }\n        if (filledOctetCount < 16) {\n          octets[filledOctetCount] = Math.pow(2, prefix % 8) - 1 << 8 - prefix % 8;\n        }\n        return new this(octets);\n      };\n      ipaddr2.fromByteArray = function(bytes) {\n        const length = bytes.length;\n        if (length === 4) {\n          return new ipaddr2.IPv4(bytes);\n        } else if (length === 16) {\n          return new ipaddr2.IPv6(bytes);\n        } else {\n          throw new Error(\"ipaddr: the binary input is neither an IPv6 nor IPv4 address\");\n        }\n      };\n      ipaddr2.isValid = function(string) {\n        return ipaddr2.IPv6.isValid(string) || ipaddr2.IPv4.isValid(string);\n      };\n      ipaddr2.isValidCIDR = function(string) {\n        return ipaddr2.IPv6.isValidCIDR(string) || ipaddr2.IPv4.isValidCIDR(string);\n      };\n      ipaddr2.parse = function(string) {\n        if (ipaddr2.IPv6.isValid(string)) {\n          return ipaddr2.IPv6.parse(string);\n        } else if (ipaddr2.IPv4.isValid(string)) {\n          return ipaddr2.IPv4.parse(string);\n        } else {\n          throw new Error(\"ipaddr: the address has neither IPv6 nor IPv4 format\");\n        }\n      };\n      ipaddr2.parseCIDR = function(string) {\n        try {\n          return ipaddr2.IPv6.parseCIDR(string);\n        } catch {\n          try {\n            return ipaddr2.IPv4.parseCIDR(string);\n          } catch (e) {\n            throw new Error(\"ipaddr: the address has neither IPv6 nor IPv4 CIDR format\", { cause: e });\n          }\n        }\n      };\n      ipaddr2.process = function(string) {\n        const addr = this.parse(string);\n        if (addr.kind() === \"ipv6\" && addr.isIPv4MappedAddress()) {\n          return addr.toIPv4Address();\n        } else {\n          return addr;\n        }\n      };\n      ipaddr2.subnetMatch = function(address, rangeList, defaultName) {\n        let i, rangeName, rangeSubnets, subnet;\n        if (defaultName === void 0 || defaultName === null) {\n          defaultName = \"unicast\";\n        }\n        for (rangeName in rangeList) {\n          if (Object.prototype.hasOwnProperty.call(rangeList, rangeName)) {\n            rangeSubnets = rangeList[rangeName];\n            if (rangeSubnets[0] && !(rangeSubnets[0] instanceof Array)) {\n              rangeSubnets = [rangeSubnets];\n            }\n            for (i = 0; i < rangeSubnets.length; i++) {\n              subnet = rangeSubnets[i];\n              if (address.kind() === subnet[0].kind() && address.match.apply(address, subnet)) {\n                return rangeName;\n              }\n            }\n          }\n        }\n        return defaultName;\n      };\n      if (typeof module !== \"undefined\" && module.exports) {\n        module.exports = ipaddr2;\n      } else {\n        root.ipaddr = ipaddr2;\n      }\n    })(exports);\n  }\n});\n\n// web/src/ip/address.js\nvar import_ipaddr = __toESM(require_ipaddr(), 1);\nvar addresses = /* @__PURE__ */ new WeakSet();\nvar networks = /* @__PURE__ */ new WeakSet();\nvar decimalV4 = /^(0|[1-9]\\d{0,2})(\\.(0|[1-9]\\d{0,2})){3}$/;\nvar AddressError = class extends TypeError {\n  constructor(code, message) {\n    super(message);\n    this.name = \"AddressError\";\n    this.code = code;\n  }\n};\nfunction fromLibrary(parsed) {\n  const family = parsed.kind() === \"ipv4\" ? 4 : 6;\n  const isIPv4Mapped = family === 6 && parsed.isIPv4MappedAddress();\n  const embeddedIPv4 = isIPv4Mapped ? parsed.toIPv4Address().toString() : null;\n  const normalized = isIPv4Mapped ? `::ffff:${embeddedIPv4}` : parsed.toString();\n  const address = Object.freeze({\n    family,\n    bits: family === 4 ? 32 : 128,\n    normalized,\n    value: parsed.toByteArray().reduce((value, byte) => value << 8n | BigInt(byte), 0n),\n    key: `${family}:${normalized}`,\n    isIPv4Mapped,\n    embeddedIPv4\n  });\n  addresses.add(address);\n  return address;\n}\nfunction parseIP(input) {\n  if (addresses.has(input)) return input;\n  if (typeof input !== \"string\" || input.length === 0 || input.length > 45 || !/^[0-9a-fA-F:.]+$/.test(input)) {\n    throw new AddressError(\"invalid-ip\", \"Supply an IPv4 or IPv6 address literal without a port, zone ID, or whitespace.\");\n  }\n  const hasColon = input.includes(\":\");\n  if (!hasColon && !decimalV4.test(input) || hasColon && input.includes(\".\") && !decimalV4.test(input.slice(input.lastIndexOf(\":\") + 1))) {\n    throw new AddressError(\"invalid-ip\", \"IPv4 components must use four decimal octets without leading zeros.\");\n  }\n  let literal = input;\n  if (hasColon && input.includes(\".\")) {\n    const boundary = input.lastIndexOf(\":\") + 1;\n    const octets = input.slice(boundary).split(\".\").map(Number);\n    if (octets.some((octet) => octet > 255)) {\n      throw new AddressError(\"invalid-ip\", \"An embedded IPv4 octet exceeds 255.\");\n    }\n    literal = input.slice(0, boundary) + `${(octets[0] << 8 | octets[1]).toString(16)}:${(octets[2] << 8 | octets[3]).toString(16)}`;\n  }\n  try {\n    const parsed = import_ipaddr.default.parse(literal);\n    if (hasColon !== (parsed.kind() === \"ipv6\")) throw new Error(\"Address family changed\");\n    return fromLibrary(parsed);\n  } catch {\n    throw new AddressError(\"invalid-ip\", \"The address is not a valid IPv4 or IPv6 literal.\");\n  }\n}\nfunction formatIP(value, family) {\n  if (![4, 6].includes(family) || typeof value !== \"bigint\" || value < 0n || value >= 1n << BigInt(family === 4 ? 32 : 128)) {\n    throw new AddressError(\"invalid-value\", \"The integer must fit the specified address family.\");\n  }\n  const bytes = Array(family === 4 ? 4 : 16);\n  for (let i = bytes.length - 1; i >= 0; i--) {\n    bytes[i] = Number(value & 255n);\n    value >>= 8n;\n  }\n  return fromLibrary(import_ipaddr.default.fromByteArray(bytes)).normalized;\n}\nfunction parseCIDR(input, { strict = true } = {}) {\n  if (networks.has(input)) return input;\n  if (typeof input !== \"string\" || input.length > 49) {\n    throw new AddressError(\"invalid-cidr\", \"A CIDR must be a bounded address/prefix string.\");\n  }\n  const parts = input.split(\"/\");\n  if (parts.length !== 2 || !/^(0|[1-9]\\d{0,2})$/.test(parts[1])) {\n    throw new AddressError(\"invalid-prefix\", \"Use an IP address followed by an integer prefix length.\");\n  }\n  const address = parseIP(parts[0]);\n  const prefixLength = Number(parts[1]);\n  if (prefixLength > address.bits) {\n    throw new AddressError(\"invalid-prefix\", \"The prefix length exceeds the address-family width.\");\n  }\n  const hostBits = BigInt(address.bits - prefixLength);\n  const network = address.value >> hostBits << hostBits;\n  if (strict && address.value !== network) {\n    throw new AddressError(\"host-bits-set\", \"The CIDR contains host bits; supply the network address.\");\n  }\n  const parsed = Object.freeze({\n    family: address.family,\n    bits: address.bits,\n    prefixLength,\n    network,\n    last: network | (1n << hostBits) - 1n,\n    canonical: `${formatIP(network, address.family)}/${prefixLength}`\n  });\n  networks.add(parsed);\n  return parsed;\n}\n\n// web/src/identity/timestamps.js\nvar months = new Map([\"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\"].map((name, i) => [name.toLowerCase(), i + 1]));\nfunction parseTimestamp(input) {\n  const raw = typeof input === \"string\" ? input : null;\n  if (input == null || raw !== null && raw.trim() === \"\") return { raw, status: \"missing\", utc: null, milliseconds: null };\n  const invalid = (reason) => ({ raw, status: \"unparseable\", utc: null, milliseconds: null, reason });\n  if (raw === null || raw.length > 128) return invalid(\"Expected a bounded timestamp string.\");\n  const text = raw.trim();\n  let fields = text.match(/^(\\d{4})-(\\d{2})-(\\d{2})[Tt](\\d{2}):(\\d{2}):(\\d{2})(?:\\.(\\d{1,3}))?([Zz]|[+-]\\d{2}:\\d{2})$/);\n  if (!fields) {\n    const apache = text.match(/^(\\[?)(\\d{2})\\/([A-Za-z]{3})\\/(\\d{4}):(\\d{2}):(\\d{2}):(\\d{2}) ([+-]\\d{2})(\\d{2})(\\]?)$/);\n    if (!apache || Boolean(apache[1]) !== Boolean(apache[10]) || !months.has(apache[3].toLowerCase())) {\n      return invalid(\"Unsupported timestamp or missing explicit timezone; the original value was preserved.\");\n    }\n    fields = [\n      null,\n      apache[4],\n      String(months.get(apache[3].toLowerCase())).padStart(2, \"0\"),\n      apache[2],\n      apache[5],\n      apache[6],\n      apache[7],\n      \"\",\n      `${apache[8]}:${apache[9]}`\n    ];\n  }\n  const [, year, month, day, hour, minute, second, fraction, zone] = fields;\n  const y = Number(year), m = Number(month), d = Number(day);\n  const leap = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);\n  const maxDay = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];\n  if (!maxDay || d < 1 || d > maxDay || Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) {\n    return invalid(\"Invalid calendar date or time; no rollover or leap-second approximation was applied.\");\n  }\n  const offset = /^[Zz]$/.test(zone) ? 0 : (Number(zone.slice(1, 3)) * 60 + Number(zone.slice(4))) * (zone[0] === \"-\" ? -1 : 1);\n  if (!/^[Zz]$/.test(zone) && (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59 || zone === \"-00:00\")) {\n    return invalid(\"Invalid or explicitly unknown timezone offset.\");\n  }\n  const iso = `${year}-${month}-${day}T${hour}:${minute}:${second}${fraction ? `.${fraction}` : \"\"}${/^[Zz]$/.test(zone) ? \"Z\" : zone}`;\n  const milliseconds = Date.parse(iso);\n  if (!Number.isFinite(milliseconds)) return invalid(\"Timestamp cannot be represented.\");\n  return { raw, status: \"parsed\", utc: new Date(milliseconds).toISOString(), milliseconds, offsetMinutes: offset };\n}\n\n// web/src/import/limits.js\nvar DEFAULT_LIMITS = Object.freeze({\n  rawBytes: 10 * 1024 * 1024,\n  rows: 2e4,\n  userAgentLength: 8192,\n  recordLength: 32768,\n  distinctIPs: 1e4,\n  columns: 64\n});\nvar ImportError = class extends Error {\n  constructor(code, message, reference = null) {\n    super(message);\n    this.name = \"ImportError\";\n    this.code = code;\n    this.reference = reference;\n  }\n};\nfunction importLimits(overrides = {}) {\n  if (!overrides || typeof overrides !== \"object\" || Array.isArray(overrides) || Object.keys(overrides).some((key) => !Object.hasOwn(DEFAULT_LIMITS, key))) throw new TypeError(\"Unknown input limit.\");\n  const limits2 = { ...DEFAULT_LIMITS, ...overrides };\n  for (const [key, value] of Object.entries(limits2)) {\n    if (!Number.isSafeInteger(value) || value < 1 || value > DEFAULT_LIMITS[key]) {\n      throw new TypeError(`The ${key} limit must be a positive integer no larger than ${DEFAULT_LIMITS[key]}.`);\n    }\n  }\n  return limits2;\n}\nfunction checkText(text, limits2) {\n  if (typeof text !== \"string\") throw new TypeError(\"Supply input text.\");\n  if (text.length > limits2.rawBytes || new TextEncoder().encode(text).length > limits2.rawBytes) {\n    throw new ImportError(\"raw-size-limit\", `Input exceeds ${limits2.rawBytes} UTF-8 bytes. Reduce the file or filter the log first.`);\n  }\n  if (text.includes(\"\\0\")) throw new ImportError(\"unsupported-encoding\", \"NUL bytes are not supported. Export UTF-8 text rather than binary or UTF-16.\");\n}\nasync function readInputFile(file, overrides) {\n  const limits2 = importLimits(overrides);\n  if (!file || !Number.isSafeInteger(file.size) || typeof file.arrayBuffer !== \"function\") throw new TypeError(\"Select a local file.\");\n  if (file.size > limits2.rawBytes) throw new ImportError(\"raw-size-limit\", `File exceeds ${limits2.rawBytes} bytes. Filter or split it before importing.`);\n  let text;\n  try {\n    text = new TextDecoder(\"utf-8\", { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());\n  } catch {\n    throw new ImportError(\"unsupported-encoding\", \"The file is not valid UTF-8. Re-export it as UTF-8 text.\");\n  }\n  checkText(text, limits2);\n  return text;\n}\n\n// web/src/import/records.js\nfunction delimitedRecords(text, delimiter, limits2) {\n  const records = [];\n  let fields = [], field = \"\", state = \"start\", line = 1, startLine = 1, start = 0, blankRows = 0;\n  const finishField = () => {\n    fields.push(field);\n    field = \"\";\n    state = \"start\";\n    if (fields.length > limits2.columns) throw new ImportError(\"column-limit\", `At most ${limits2.columns} columns are supported.`, { line });\n  };\n  const finishRecord = (end) => {\n    const rawRecord = text.slice(start, end);\n    if (rawRecord.length > limits2.recordLength) throw new ImportError(\"record-limit\", `A record exceeds ${limits2.recordLength} characters.`, { line: startLine });\n    if (rawRecord.trim()) records.push({ fields, rawRecord, lineStart: startLine, lineEnd: line });\n    else blankRows++;\n    fields = [];\n    if (records.length > limits2.rows + 1) throw new ImportError(\"row-limit\", `At most ${limits2.rows} data rows are supported. Filter or split the input.`);\n  };\n  for (let i = 0; i < text.length; i++) {\n    if (i - start > limits2.recordLength) throw new ImportError(\"record-limit\", `A record exceeds ${limits2.recordLength} characters.`, { line: startLine });\n    const char = text[i];\n    const newline = char === \"\\r\" || char === \"\\n\";\n    if (state === \"quoted\") {\n      if (char === '\"') {\n        if (text[i + 1] === '\"') {\n          field += '\"';\n          i++;\n        } else state = \"closed\";\n      } else {\n        field += char;\n        if (newline) {\n          if (char === \"\\r\" && text[i + 1] === \"\\n\") field += text[++i];\n          line++;\n        }\n      }\n      continue;\n    }\n    if (char === delimiter) {\n      finishField();\n      continue;\n    }\n    if (newline) {\n      finishField();\n      finishRecord(i);\n      if (char === \"\\r\" && text[i + 1] === \"\\n\") i++;\n      line++;\n      startLine = line;\n      start = i + 1;\n      continue;\n    }\n    if (state === \"closed\" || char === '\"' && state !== \"start\") {\n      throw new ImportError(\"malformed-delimited\", \"A quote is misplaced. Use double quotes around fields and double an embedded quote.\", { line });\n    }\n    if (char === '\"') state = \"quoted\";\n    else {\n      field += char;\n      state = \"plain\";\n    }\n  }\n  if (state === \"quoted\") throw new ImportError(\"malformed-delimited\", \"A quoted field is not closed. No partial import was accepted.\", { line: startLine });\n  if (start < text.length) {\n    finishField();\n    finishRecord(text.length);\n  }\n  return { records, blankRows, physicalLines: text.length ? line - (start === text.length ? 1 : 0) : 0 };\n}\nfunction lineRecords(text, limits2) {\n  const records = [];\n  let blankRows = 0, line = 1, start = 0;\n  for (let i = 0; i <= text.length; i++) {\n    if (i < text.length && text[i] !== \"\\r\" && text[i] !== \"\\n\") {\n      if (i - start >= limits2.recordLength) throw new ImportError(\"record-limit\", `A record exceeds ${limits2.recordLength} characters.`, { line });\n      continue;\n    }\n    if (start < text.length) {\n      const rawRecord = text.slice(start, i);\n      if (rawRecord.trim()) records.push({ rawRecord, lineStart: line, lineEnd: line });\n      else blankRows++;\n    }\n    if (records.length > limits2.rows) throw new ImportError(\"row-limit\", `At most ${limits2.rows} data rows are supported. Filter or split the input.`);\n    if (text[i] === \"\\r\" && text[i + 1] === \"\\n\") i++;\n    start = i + 1;\n    line++;\n  }\n  return { records, blankRows, physicalLines: text.length ? line - 1 - (/\\r$|\\n$/.test(text) ? 1 : 0) : 0 };\n}\nfunction quoted(input, offset) {\n  if (input[offset] !== '\"') throw new Error(\"Expected quoted log field.\");\n  const bytes = [], encoder2 = new TextEncoder();\n  let segment = \"\";\n  const flush = () => {\n    for (const byte of encoder2.encode(segment)) bytes.push(byte);\n    segment = \"\";\n  };\n  for (let i = offset + 1; i < input.length; i++) {\n    if (input[i] === '\"') {\n      flush();\n      return { value: new TextDecoder(\"utf-8\", { fatal: true }).decode(new Uint8Array(bytes)), end: i + 1 };\n    }\n    if (input[i] !== \"\\\\\") {\n      segment += input[i];\n      continue;\n    }\n    const next = input[++i];\n    if (next === '\"' || next === \"\\\\\") segment += next;\n    else if (next === \"x\" && /^[a-fA-F0-9]{2}$/.test(input.slice(i + 1, i + 3))) {\n      flush();\n      bytes.push(parseInt(input.slice(i + 1, i + 3), 16));\n      i += 2;\n    } else if ({ n: \"\\n\", r: \"\\r\", t: \"\t\", b: \"\\b\", v: \"\\v\" }[next]) {\n      segment += { n: \"\\n\", r: \"\\r\", t: \"\t\", b: \"\\b\", v: \"\\v\" }[next];\n    } else throw new Error(\"Unsupported log escape.\");\n  }\n  throw new Error(\"Unclosed log field.\");\n}\nfunction parseAccessLog(input) {\n  const prefix = /^(\\S+)\\s+\\S+\\s+\\S+\\s+\\[([^\\]\\r\\n]+)\\]\\s+/.exec(input);\n  if (!prefix) throw new Error(\"Expected client ident user [timestamp] followed by a quoted request.\");\n  const request = quoted(input, prefix[0].length);\n  const rest = /^\\s+(\\d{3})\\s+(\\d+|-)(?:\\s+|$)/.exec(input.slice(request.end));\n  if (!rest) throw new Error(\"Expected numeric status and bytes after the request.\");\n  let offset = request.end + rest[0].length;\n  let userAgent = null;\n  if (offset < input.length) {\n    const referer = quoted(input, offset);\n    offset = referer.end;\n    const separator = /^\\s+/.exec(input.slice(offset));\n    if (!separator) throw new Error(\"Combined logs require a quoted User-Agent after the referer.\");\n    const agent = quoted(input, offset + separator[0].length);\n    if (input.slice(agent.end).trim()) throw new Error(\"Extra custom log fields are not supported; export CSV/TSV for mapping.\");\n    userAgent = agent.value === \"-\" ? null : agent.value;\n  }\n  const parts = request.value === \"-\" ? null : /^(\\S+) (.*) (HTTP\\/\\d(?:\\.\\d)?)$/.exec(request.value);\n  if (request.value !== \"-\" && !parts) throw new Error(\"Expected method path HTTP/version inside the request.\");\n  return {\n    ip: prefix[1],\n    userAgent,\n    timestamp: prefix[2],\n    count: \"1\",\n    status: rest[1],\n    method: parts?.[1] ?? null,\n    path: parts?.[2] ?? null\n  };\n}\n\n// web/src/import/json.js\nvar invalidJSON = () => new ImportError(\n  \"malformed-json\",\n  \"Invalid JSON. Use an array of records, a single record, or one complete JSON object per line (JSONL). No partial import was accepted.\"\n);\nfunction arrayRecords(text, values) {\n  const records = [];\n  let start = text.indexOf(\"[\") + 1, depth = 0, quoted2 = false, escaped = false, line = 1;\n  for (let i = 0; i < start; i++) if (text[i] === \"\\n\" || text[i] === \"\\r\" && text[i + 1] !== \"\\n\") line++;\n  let startLine = line;\n  for (let i = start; i < text.length; i++) {\n    const char = text[i];\n    if (char === \"\\n\" || char === \"\\r\" && text[i + 1] !== \"\\n\") line++;\n    if (quoted2) {\n      if (escaped) escaped = false;\n      else if (char === \"\\\\\") escaped = true;\n      else if (char === '\"') quoted2 = false;\n      continue;\n    }\n    if (char === '\"') quoted2 = true;\n    else if (char === \"{\" || char === \"[\") depth++;\n    else if (char === \"}\" || char === \"]\" && depth) depth--;\n    else if ((char === \",\" || char === \"]\") && depth === 0) {\n      const segment = text.slice(start, i), leading = segment.match(/^\\s*/)[0];\n      if (segment.trim()) records.push({\n        value: values[records.length],\n        rawRecord: segment.trim(),\n        lineStart: startLine + (leading.match(/\\r\\n|\\r|\\n/g)?.length ?? 0),\n        lineEnd: line - (segment.match(/\\s*$/)[0].match(/\\r\\n|\\r|\\n/g)?.length ?? 0)\n      });\n      if (char === \"]\") break;\n      start = i + 1;\n      startLine = line;\n    }\n  }\n  return records;\n}\nfunction jsonRecords(text, limits2, forceLines = false) {\n  let records;\n  if (!forceLines) {\n    let value;\n    try {\n      value = JSON.parse(text);\n    } catch {\n      if (!text.trimStart().startsWith(\"{\")) throw invalidJSON();\n    }\n    if (value !== void 0) {\n      if (Array.isArray(value)) records = arrayRecords(text, value);\n      else {\n        const leading = text.match(/^\\s*/)[0];\n        records = [{\n          value,\n          rawRecord: text.trim(),\n          lineStart: 1 + (leading.match(/\\r\\n|\\r|\\n/g)?.length ?? 0),\n          lineEnd: text.trimEnd().split(/\\r\\n|\\r|\\n/).length\n        }];\n      }\n    }\n  }\n  if (!records) {\n    records = lineRecords(text, limits2).records.map((record) => {\n      try {\n        return { ...record, value: JSON.parse(record.rawRecord) };\n      } catch {\n        throw invalidJSON();\n      }\n    });\n  }\n  if (records.length > limits2.rows) throw new ImportError(\"row-limit\", `At most ${limits2.rows} data rows are supported. Filter or split the input.`);\n  if (records.some((record) => record.rawRecord.length > limits2.recordLength)) throw new ImportError(\"record-limit\", `A record exceeds ${limits2.recordLength} characters.`);\n  const object = (value) => value !== null && typeof value === \"object\" && !Array.isArray(value);\n  const strings = records.length > 0 && records.every((record) => typeof record.value === \"string\");\n  if (!strings && records.some((record) => !object(record.value))) throw new ImportError(\n    \"json-records\",\n    \"JSON must contain objects with an IP field, or an array of IP strings. Do not mix record types.\"\n  );\n  for (const record of records) {\n    const pending = [[record.value, 0]];\n    while (pending.length) {\n      const [value, depth] = pending.pop();\n      if (value === null || typeof value !== \"object\") continue;\n      if (depth >= 64) throw new ImportError(\"json-nesting\", \"JSON nesting exceeds 64 levels. Flatten the export before importing.\");\n      for (const child of Object.values(value)) pending.push([child, depth + 1]);\n    }\n  }\n  const headers = strings ? [\"ip\"] : [...new Set(records.flatMap((record) => Object.keys(record.value)))];\n  if (headers.length > limits2.columns) throw new ImportError(\"column-limit\", `At most ${limits2.columns} fields are supported.`);\n  for (const record of records) {\n    record.fields = strings ? [record.value] : headers.map((header) => Object.hasOwn(record.value, header) ? record.value[header] : null);\n    delete record.value;\n  }\n  return {\n    records,\n    headers,\n    hasHeader: !strings,\n    blankRows: 0,\n    physicalLines: text.trimEnd().split(/\\r\\n|\\r|\\n/).length\n  };\n}\n\n// web/src/import/http-status.js\nfunction responseStatus(value) {\n  if (value === null || value === void 0 || value === \"\" || value === \"-\") return null;\n  if (![\"string\", \"number\"].includes(typeof value)) return \"unrecognized\";\n  const text = typeof value === \"string\" ? value.trim() : String(value);\n  if (!text || text === \"-\") return null;\n  return text === \"0\" || /^[1-5]\\d\\d$/.test(text) ? text : \"unrecognized\";\n}\n\n// web/src/import/parse.js\nvar MAPPING_FIELDS = [\"ip\", \"userAgent\", \"timestamp\", \"count\", \"status\", \"path\", \"method\"];\nvar SIMPLE_FIELDS = [\"ip\", \"userAgent\", \"status\"];\nvar normalizeHeader = (name) => name.trim().toLowerCase().replace(/[^a-z0-9]/g, \"\");\nvar aliases = {\n  ip: [\"ip\", \"ipaddress\", \"clientip\", \"remoteaddr\", \"remoteaddress\", \"cfconnectingip\", \"cip\"],\n  userAgent: [\"useragent\", \"ua\", \"httpuseragent\", \"clientrequestuseragent\", \"csuseragent\"],\n  timestamp: [\"timestamp\", \"time\", \"date\", \"datetime\", \"edgestarttimestamp\", \"requesttimestamp\", \"timelocal\", \"timeiso8601\"],\n  count: [\"count\", \"requests\", \"frequency\", \"requestcount\"],\n  status: [\"status\", \"httpstatus\", \"edgeresponsestatus\", \"httpresponsestatus\", \"responsestatus\", \"responsecode\"],\n  path: [\"path\", \"uri\", \"requestpath\", \"clientrequesturi\"],\n  method: [\"method\", \"requestmethod\", \"clientrequestmethod\"]\n};\nvar forwardedColumn = (name) => /(?:forwarded|trueclient)/i.test(normalizeHeader(name));\nfunction guessMapping(headers, fields = MAPPING_FIELDS) {\n  return Object.fromEntries(fields.map((field) => {\n    const candidates = headers.flatMap((header, index2) => aliases[field].includes(normalizeHeader(header)) ? [index2] : []);\n    return [field, candidates.length === 1 ? candidates[0] : null];\n  }));\n}\nfunction validIP(value) {\n  try {\n    parseIP(value.trim());\n    return true;\n  } catch {\n    return false;\n  }\n}\nfunction prepareInput(rawText, options = {}) {\n  const simple = options.profile === \"ip-ua-only\";\n  const fields = simple ? SIMPLE_FIELDS : MAPPING_FIELDS;\n  const limits2 = importLimits(options.limits);\n  checkText(rawText, limits2);\n  const text = rawText.replace(/^\\uFEFF/, \"\");\n  let format = options.format ?? \"auto\";\n  if (![\"auto\", \"txt\", \"csv\", \"tsv\", \"json\", \"jsonl\", \"access-log\"].includes(format)) throw new ImportError(\"unsupported-format\", \"Choose TXT, CSV, TSV, JSON or JSONL.\");\n  if (format === \"auto\") {\n    const first = text.match(/[^\\r\\n]+/)?.[0] ?? \"\";\n    format = [\"{\", \"[\"].includes(text.trimStart()[0]) ? \"json\" : /^\\S+\\s+\\S+\\s+\\S+\\s+\\[/.test(first) ? \"access-log\" : first.includes(\"\t\") ? \"tsv\" : first.includes(\",\") ? \"csv\" : \"txt\";\n    if (simple && aliases.ip.includes(normalizeHeader(first))) format = \"csv\";\n  }\n  if (simple && format === \"access-log\") throw new ImportError(\n    \"unsupported-format\",\n    \"Use one IP per line, or a CSV/TSV/JSON export with IP and optional User-Agent fields. Full access logs are not accepted.\"\n  );\n  const json2 = [\"json\", \"jsonl\"].includes(format);\n  const parsed = json2 ? jsonRecords(text, limits2, format === \"jsonl\") : [\"csv\", \"tsv\"].includes(format) ? delimitedRecords(text, format === \"csv\" ? \",\" : \"\t\", limits2) : lineRecords(text, limits2);\n  let hasHeader = false, headers = [], mapping = Object.fromEntries(fields.map((field) => [field, null]));\n  if (json2) {\n    headers = parsed.headers;\n    hasHeader = parsed.hasHeader;\n    mapping = guessMapping(headers, fields);\n  } else if ([\"csv\", \"tsv\"].includes(format) && parsed.records.length) {\n    const first = parsed.records[0].fields;\n    const inferred = guessMapping(first, fields);\n    if (options.header !== void 0 && typeof options.header !== \"boolean\") throw new TypeError(\"header must be true or false.\");\n    hasHeader = options.header ?? (!first.some(validIP) && first.some((header) => fields.some((field) => aliases[field].includes(normalizeHeader(header)))));\n    if (hasHeader) {\n      headers = [...first];\n      mapping = inferred;\n      parsed.records.shift();\n    } else {\n      headers = first.map((_, index2) => `Column ${index2 + 1}`);\n      const candidates = first.flatMap((_, index2) => parsed.records.slice(0, 10).every((record) => record.fields[index2] !== void 0 && validIP(record.fields[index2])) ? [index2] : []);\n      if (candidates.length === 1) mapping.ip = candidates[0];\n      if (simple && first.length === 2 && mapping.ip !== null) mapping.userAgent = 1 - mapping.ip;\n    }\n  }\n  if (parsed.records.length > limits2.rows) throw new ImportError(\"row-limit\", `At most ${limits2.rows} data rows are supported. Filter or split the input.`);\n  const supplied = options.mapping ?? {};\n  if (typeof supplied !== \"object\" || supplied === null || Array.isArray(supplied) || Object.keys(supplied).some((field) => !fields.includes(field))) throw new TypeError(\"Unknown column mapping field.\");\n  mapping = { ...mapping, ...supplied };\n  const selected = [];\n  for (const [field, index2] of Object.entries(mapping)) {\n    if (index2 !== null && (!Number.isInteger(index2) || index2 < 0 || index2 >= headers.length || selected.includes(index2))) {\n      throw new ImportError(\"invalid-mapping\", \"Choose a distinct existing column for each field.\");\n    }\n    if (index2 !== null) selected.push(index2);\n  }\n  const trustRequired = mapping.ip !== null && forwardedColumn(headers[mapping.ip]);\n  return {\n    ...parsed,\n    headers,\n    hasHeader,\n    mapping,\n    trustRequired,\n    format,\n    limits: limits2,\n    profile: simple ? \"ip-ua-only\" : \"traffic\",\n    rawBytes: new TextEncoder().encode(rawText).length\n  };\n}\nfunction describeInput(prepared) {\n  return {\n    format: prepared.format,\n    hasHeader: prepared.hasHeader,\n    headers: prepared.headers,\n    userAgentValuesPresent: prepared.mapping.userAgent === null ? 0 : prepared.records.filter((row) => {\n      const value = row.fields?.[prepared.mapping.userAgent];\n      return typeof value === \"string\" && value.trim().length > 0;\n    }).length,\n    mapping: prepared.mapping,\n    trustRequired: prepared.trustRequired,\n    records: prepared.records.length,\n    preview: prepared.records.slice(0, 5).map((row) => ({\n      lineStart: row.lineStart,\n      fields: row.fields?.map((field) => (field === null ? \"\" : typeof field === \"string\" ? field : JSON.stringify(field)).slice(0, 160)) ?? [row.rawRecord.slice(0, 160)]\n    }))\n  };\n}\nfunction parseInput(text, options = {}, onProgress = () => {\n}) {\n  const prepared = prepareInput(text, options);\n  const { format, mapping, headers, limits: limits2, records } = prepared;\n  if ([\"csv\", \"tsv\", \"json\", \"jsonl\"].includes(format) && records.length && mapping.ip === null) {\n    throw new ImportError(\"mapping-required\", \"Select the client IP column. Ambiguous or unknown columns are not guessed.\");\n  }\n  if (prepared.trustRequired && options.trustForwarded !== true) {\n    throw new ImportError(\"forwarded-trust-required\", \"This is a forwarded-IP column. Confirm its trusted proxy configuration before using it.\");\n  }\n  const rows = [], invalidRows = [];\n  for (let i = 0; i < records.length; i++) {\n    const record = records[i];\n    const reference = { record: i + 1, lineStart: record.lineStart, lineEnd: record.lineEnd };\n    let row;\n    try {\n      if (format === \"txt\") row = { ip: record.rawRecord, count: \"1\" };\n      else if (format === \"access-log\") row = parseAccessLog(record.rawRecord);\n      else {\n        if (record.fields.length !== headers.length) throw new Error(\"Column count differs from the header/first record.\");\n        row = Object.fromEntries(MAPPING_FIELDS.map((field) => [field, mapping[field] === null || mapping[field] === void 0 ? null : record.fields[mapping[field]]]));\n      }\n      const rawUserAgent = row.userAgent ?? null;\n      if (typeof row.ip !== \"string\") throw new Error(\"The IP field must be a string.\");\n      if (rawUserAgent !== null && typeof rawUserAgent !== \"string\") throw new Error(\"The User-Agent field must be a string or null.\");\n      if (rawUserAgent !== null && rawUserAgent.length > limits2.userAgentLength) {\n        throw new ImportError(\"user-agent-limit\", `A User-Agent exceeds ${limits2.userAgentLength} characters. No partial import was accepted.`, reference);\n      }\n      const address = parseIP(row.ip.trim());\n      const rawCount = row.count;\n      const requestCount = rawCount === null || rawCount === void 0 || rawCount === \"\" ? 1 : /^(0|[1-9]\\d*)$/.test(rawCount.trim()) ? Number(rawCount.trim()) : NaN;\n      if (!Number.isSafeInteger(requestCount) || requestCount < 1) throw new Error(\"Request counts must be positive safe integers.\");\n      if (prepared.profile !== \"ip-ua-only\" && row.status && row.status !== \"-\" && !/^[1-5]\\d\\d$/.test(row.status)) throw new Error(\"HTTP status must be 100\\u2013599, blank or -.\");\n      if (row.method && !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(row.method)) throw new Error(\"HTTP method is not a token.\");\n      rows.push({\n        reference,\n        rawRecord: record.rawRecord,\n        rawIp: row.ip,\n        ip: address.normalized,\n        ipKey: address.key,\n        family: address.family,\n        rawUserAgent,\n        rawTimestamp: row.timestamp ?? null,\n        timestamp: parseTimestamp(row.timestamp ?? null),\n        requestCount,\n        rawRequestCount: rawCount ?? null,\n        requestCountKnown: format === \"access-log\" || [\"csv\", \"tsv\"].includes(format) && rawCount !== null && rawCount !== void 0 && rawCount !== \"\",\n        status: prepared.profile === \"ip-ua-only\" ? responseStatus(row.status) : row.status ?? null,\n        path: row.path ?? null,\n        method: row.method ?? null,\n        ipProvenance: prepared.trustRequired ? \"operator-selected-forwarded-column\" : \"selected-log-client-field\"\n      });\n    } catch (error) {\n      if (error instanceof ImportError) throw error;\n      invalidRows.push({ reference, rawRecord: record.rawRecord, code: \"invalid-record\", message: error.message });\n    }\n    if ((i + 1) % 250 === 0 || i + 1 === records.length) onProgress({ stage: \"parse\", completed: i + 1, total: records.length });\n  }\n  return { rows, invalidRows, source: {\n    format,\n    profile: prepared.profile,\n    hasHeader: prepared.hasHeader,\n    headers,\n    mapping,\n    rawBytes: prepared.rawBytes,\n    blankRows: prepared.blankRows,\n    physicalLines: prepared.physicalLines,\n    inputRecords: records.length,\n    forwardedIP: prepared.trustRequired\n  }, limits: limits2 };\n}\n\n// data/source-registry.json\nvar source_registry_default = {\n  schemaVersion: 1,\n  auditedOn: \"2026-10-20\",\n  sources: [\n    {\n      id: \"google-common\",\n      provider: {\n        id: \"google\",\n        name: \"Google\"\n      },\n      scope: \"provider-category\",\n      category: \"common-crawlers\",\n      purpose: \"Search indexing, product-specific crawling and analysis.\",\n      identities: [\n        {\n          id: \"googlebot\",\n          name: \"Googlebot\",\n          httpTokens: [\n            \"Googlebot\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"googlebot-image\",\n          name: \"Googlebot-Image\",\n          httpTokens: [\n            \"Googlebot-Image\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"googlebot-video\",\n          name: \"Googlebot-Video\",\n          httpTokens: [\n            \"Googlebot-Video\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"storebot-google\",\n          name: \"Storebot-Google\",\n          httpTokens: [\n            \"Storebot-Google\"\n          ],\n          purposes: [\n            \"advertising-related-crawling\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"google-inspectiontool\",\n          name: \"Google-InspectionTool\",\n          httpTokens: [\n            \"Google-InspectionTool\"\n          ],\n          purposes: [\n            \"site-verification\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"googleother\",\n          name: \"GoogleOther\",\n          httpTokens: [\n            \"GoogleOther\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"googleother-image\",\n          name: \"GoogleOther-Image\",\n          httpTokens: [\n            \"GoogleOther-Image\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"googleother-video\",\n          name: \"GoogleOther-Video\",\n          httpTokens: [\n            \"GoogleOther-Video\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        },\n        {\n          id: \"google-cloudvertexbot\",\n          name: \"Google-CloudVertexBot\",\n          httpTokens: [\n            \"Google-CloudVertexBot\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers\"\n      ],\n      limitations: [\n        \"Shared category ranges do not establish an exact Googlebot subtype.\",\n        \"Googlebot-News and Google-Extended are not separate HTTP identities; Google-Extended is a robots control token.\",\n        \"Documentation says common crawlers generally use these ranges, not a guarantee of exhaustive coverage for negative verdicts.\"\n      ],\n      feedUrl: \"https://developers.google.com/static/crawling/ipranges/common-crawlers.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:12:17.573988Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/google-common.json\",\n        fixtureSha256: \"c1d5617bbadb9e1a13174744848bde0de543f634d5cfda3ff0383d2f8ab00b88\",\n        publisherTimestampRaw: \"2026-10-20T14:46:18.000000\",\n        rangeCounts: {\n          ipv4: 170,\n          ipv6: 147\n        },\n        bytes: 21768\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"google-special\",\n      provider: {\n        id: \"google\",\n        name: \"Google\"\n      },\n      scope: \"provider-category\",\n      category: \"special-case-crawlers\",\n      purpose: \"Product-specific and agreed crawling, including advertising and safety functions.\",\n      identities: [\n        {\n          id: \"adsbot-google\",\n          name: \"AdsBot-Google\",\n          httpTokens: [\n            \"AdsBot-Google\"\n          ],\n          purposes: [\n            \"advertising-related-crawling\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n        },\n        {\n          id: \"adsbot-google-mobile\",\n          name: \"AdsBot-Google-Mobile\",\n          httpTokens: [\n            \"AdsBot-Google-Mobile\"\n          ],\n          purposes: [\n            \"advertising-related-crawling\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n        },\n        {\n          id: \"apis-google\",\n          name: \"APIs-Google\",\n          httpTokens: [\n            \"APIs-Google\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n        },\n        {\n          id: \"google-safety\",\n          name: \"Google-Safety\",\n          httpTokens: [\n            \"Google-Safety\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n        },\n        {\n          id: \"mediapartners-google\",\n          name: \"Mediapartners-Google\",\n          httpTokens: [\n            \"Mediapartners-Google\"\n          ],\n          purposes: [\n            \"advertising-related-crawling\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-special-case-crawlers\"\n      ],\n      limitations: [\n        \"Category-wide ranges cannot independently identify AdsBot or another specific fetcher.\",\n        \"No blanket claim that all special-case crawlers obey robots.txt.\"\n      ],\n      feedUrl: \"https://developers.google.com/static/crawling/ipranges/special-crawlers.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:12:17.556843Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/google-special.json\",\n        fixtureSha256: \"a8527b5b3c0fd2b8ebb89291f9f4e4b57c135448889257281e677375fb127be6\",\n        publisherTimestampRaw: \"2026-10-20T14:46:18.000000\",\n        rangeCounts: {\n          ipv4: 136,\n          ipv6: 136\n        },\n        bytes: 19109\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"google-user-triggered\",\n      provider: {\n        id: \"google\",\n        name: \"Google\"\n      },\n      scope: \"customer-platform\",\n      category: \"user-triggered-fetchers\",\n      purpose: \"User-triggered fetching from Google-hosted customer applications.\",\n      identities: [],\n      documentationUrls: [\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\",\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests\"\n      ],\n      limitations: [\n        \"Can include customer-controlled applications on Google Cloud; not proof of a Google-owned crawler or a known HTTP identity.\",\n        \"No per-product UA mapping is assigned to this dataset.\"\n      ],\n      feedUrl: \"https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:12:17.475558Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/google-user-triggered.json\",\n        fixtureSha256: \"707b0b95ec3f5cbbbf8202ff48b24c1448291a8d46acf26150da773c37536dee\",\n        publisherTimestampRaw: \"2026-10-20T14:46:17.000000\",\n        rangeCounts: {\n          ipv4: 534,\n          ipv6: 534\n        },\n        bytes: 72503\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"google-user-triggered-google\",\n      provider: {\n        id: \"google\",\n        name: \"Google\"\n      },\n      scope: \"provider-category\",\n      category: \"user-triggered-fetchers-google\",\n      purpose: \"User-triggered fetching controlled by Google.\",\n      identities: [\n        {\n          id: \"google-cws\",\n          name: \"Google-CWS\",\n          httpTokens: [\n            \"Google-CWS\"\n          ],\n          purposes: [\n            \"other-documented-automation\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"feedfetcher-google\",\n          name: \"FeedFetcher-Google\",\n          httpTokens: [\n            \"FeedFetcher-Google\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"google-gemininotebook\",\n          name: \"Google-GeminiNotebook\",\n          httpTokens: [\n            \"Google-GeminiNotebook\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"googlemessages\",\n          name: \"GoogleMessages\",\n          httpTokens: [\n            \"GoogleMessages\"\n          ],\n          purposes: [\n            \"link-preview\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"google-pinpoint\",\n          name: \"Google-Pinpoint\",\n          httpTokens: [\n            \"Google-Pinpoint\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"googleproducer\",\n          name: \"GoogleProducer\",\n          httpTokens: [\n            \"GoogleProducer\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"google-read-aloud\",\n          name: \"Google-Read-Aloud\",\n          httpTokens: [\n            \"Google-Read-Aloud\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        },\n        {\n          id: \"google-site-verification\",\n          name: \"Google-Site-Verification\",\n          httpTokens: [\n            \"Google-Site-Verification\"\n          ],\n          purposes: [\n            \"site-verification\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n      ],\n      limitations: [\n        \"Listed identities are category candidates; documentation does not provide a separate feed per identity.\",\n        \"Google-NotebookLM and google-speakr are documented former agents; current-token recognition does not imply historical verification.\"\n      ],\n      feedUrl: \"https://developers.google.com/static/crawling/ipranges/user-triggered-fetchers-google.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:12:17.611423Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/google-user-triggered-google.json\",\n        fixtureSha256: \"8a2063b2b23a4aafa133c0b772bb20d3947dcfb2e2336b4900fcc97519d42323\",\n        publisherTimestampRaw: \"2026-10-20T14:46:18.000000\",\n        rangeCounts: {\n          ipv4: 252,\n          ipv6: 252\n        },\n        bytes: 35317\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"google-user-triggered-agents\",\n      provider: {\n        id: \"google\",\n        name: \"Google\"\n      },\n      scope: \"provider-category\",\n      category: \"user-triggered-agents\",\n      purpose: \"Agents hosted on Google infrastructure navigating and acting at user request.\",\n      identities: [\n        {\n          id: \"google-agent\",\n          name: \"Google-Agent\",\n          httpTokens: [\n            \"Google-Agent\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.google.com/crawling/docs/crawlers-fetchers/google-user-triggered-fetchers\"\n      ],\n      limitations: [\n        \"Documentation explicitly connects Google-Agent to this feed, but an IP match does not authenticate an individual request.\",\n        \"Web Bot Auth is documented separately and is not implemented in this release.\"\n      ],\n      feedUrl: \"https://developers.google.com/static/crawling/ipranges/user-triggered-agents.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:12:17.346096Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/google-user-triggered-agents.json\",\n        fixtureSha256: \"7ef5b40b81cc715c9181e0899ab448583ae9b0a462bbb4bd907beb1f90d9df82\",\n        publisherTimestampRaw: \"2026-10-20T14:46:17.000000\",\n        rangeCounts: {\n          ipv4: 12,\n          ipv6: 8\n        },\n        bytes: 1413\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"bing\",\n      provider: {\n        id: \"microsoft\",\n        name: \"Microsoft Bing\"\n      },\n      scope: \"provider-category\",\n      category: \"search-crawlers\",\n      purpose: \"Bing search crawling.\",\n      identities: [\n        {\n          id: \"bingbot\",\n          name: \"bingbot\",\n          httpTokens: [\n            \"bingbot\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/\"\n        }\n      ],\n      documentationUrls: [\n        \"https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26\",\n        \"https://blogs.bing.com/webmaster/2022/4/Announcing-user-agent-change-for-Bing-crawler-bingbot/\",\n        \"https://www.bing.com/webmasters/api/help/htmlcontent?ArticleId=3905dc26\"\n      ],\n      limitations: [\n        \"Official article retrieved through its public help API; publisher instructs daily refresh for Bing.\",\n        \"Official Bing UA announcement also says URL Inspection uses the desktop UA; do not infer the originating product from the token.\",\n        \"Feed publisher timestamp is old; successful retrieval does not establish when ranges last changed or exhaustive coverage.\",\n        \"DNS verification described in the article is not implemented; feed membership is the only supported verification method.\"\n      ],\n      feedUrl: \"https://www.bing.com/toolbox/bingbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:44.882010Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/bing.json\",\n        fixtureSha256: \"a2d1cf229544205a24c61fb7c459408b1afe18f9fd5b172fe181f0eb73c1594d\",\n        publisherTimestampRaw: \"2024-01-03T10:00:00.121331\",\n        rangeCounts: {\n          ipv4: 28,\n          ipv6: 0\n        },\n        bytes: 1580\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"openai-gptbot\",\n      provider: {\n        id: \"openai\",\n        name: \"OpenAI\"\n      },\n      scope: \"crawler-specific\",\n      category: \"ai-training\",\n      purpose: \"Collection of content that may be used for training generative AI foundation models.\",\n      identities: [\n        {\n          id: \"gptbot\",\n          name: \"GPTBot\",\n          httpTokens: [\n            \"GPTBot\"\n          ],\n          purposes: [\n            \"ai-training\"\n          ],\n          documentationUrl: \"https://developers.openai.com/api/docs/bots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.openai.com/api/docs/bots\"\n      ],\n      limitations: [\n        \"Published infrastructure association is not individual-request authentication or proof of request intent.\",\n        \"Shared IP prefixes with other OpenAI feeds must return all applicable evidence.\"\n      ],\n      feedUrl: \"https://openai.com/gptbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.479414Z\",\n        httpStatus: 200,\n        contentType: \"application/json; charset=utf-8\",\n        fixturePath: \"fixtures/openai-gptbot.json\",\n        fixtureSha256: \"a24d1fa34f094d303400bdf13c45c5e9726e0b553780d16a52f9ba1b790acc72\",\n        publisherTimestampRaw: \"2026-09-22T02:00:07.000000\",\n        rangeCounts: {\n          ipv4: 18,\n          ipv6: 0\n        },\n        bytes: 977\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"openai-searchbot\",\n      provider: {\n        id: \"openai\",\n        name: \"OpenAI\"\n      },\n      scope: \"crawler-specific\",\n      category: \"ai-search\",\n      purpose: \"Discovery for ChatGPT search results.\",\n      identities: [\n        {\n          id: \"oai-searchbot\",\n          name: \"OAI-SearchBot\",\n          httpTokens: [\n            \"OAI-SearchBot\"\n          ],\n          purposes: [\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://developers.openai.com/api/docs/bots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.openai.com/api/docs/bots\"\n      ],\n      limitations: [\n        \"Published infrastructure association is not individual-request authentication or proof of request intent.\",\n        \"Shared IP prefixes with other OpenAI feeds must return all applicable evidence.\"\n      ],\n      feedUrl: \"https://openai.com/searchbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.579422Z\",\n        httpStatus: 200,\n        contentType: \"application/json; charset=utf-8\",\n        fixturePath: \"fixtures/openai-searchbot.json\",\n        fixtureSha256: \"81806b1665e9bbbc5e0f307b847ad34f7027abc19e0d2d5d3eca1864bf361be6\",\n        publisherTimestampRaw: \"2026-01-02T11:00:00.000000\",\n        rangeCounts: {\n          ipv4: 39,\n          ipv6: 0\n        },\n        bytes: 2080\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"openai-chatgpt-user\",\n      provider: {\n        id: \"openai\",\n        name: \"OpenAI\"\n      },\n      scope: \"crawler-specific\",\n      category: \"user-triggered-fetching\",\n      purpose: \"Certain ChatGPT and Custom GPT user actions; not automatic web crawling.\",\n      identities: [\n        {\n          id: \"chatgpt-user\",\n          name: \"ChatGPT-User\",\n          httpTokens: [\n            \"ChatGPT-User\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://developers.openai.com/api/docs/bots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.openai.com/api/docs/bots\"\n      ],\n      limitations: [\n        \"Published infrastructure association is not individual-request authentication or proof of request intent.\",\n        \"Shared IP prefixes with other OpenAI feeds must return all applicable evidence.\",\n        \"Observed content type application/octet-stream; allow this explicitly for this source while requiring valid JSON/schema.\"\n      ],\n      feedUrl: \"https://openai.com/chatgpt-user.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.743327Z\",\n        httpStatus: 200,\n        contentType: \"application/octet-stream\",\n        fixturePath: \"fixtures/openai-chatgpt-user.json\",\n        fixtureSha256: \"e03a9f75b53619286d990e028043ce43d223d93269f3679b28d78142b8f0e7ab\",\n        publisherTimestampRaw: \"2026-10-20T17:07:39.673498\",\n        rangeCounts: {\n          ipv4: 234,\n          ipv6: 0\n        },\n        bytes: 8467\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"openai-adsbot\",\n      provider: {\n        id: \"openai\",\n        name: \"OpenAI\"\n      },\n      scope: \"crawler-specific\",\n      category: \"advertising-related-crawling\",\n      purpose: \"Safety validation and relevance assessment of pages submitted as ChatGPT ads; not foundation-model training.\",\n      identities: [\n        {\n          id: \"oai-adsbot\",\n          name: \"OAI-AdsBot\",\n          httpTokens: [\n            \"OAI-AdsBot\"\n          ],\n          purposes: [\n            \"advertising-related-crawling\"\n          ],\n          documentationUrl: \"https://developers.openai.com/api/docs/bots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://developers.openai.com/api/docs/bots\"\n      ],\n      limitations: [\n        \"Published infrastructure association is not individual-request authentication or proof of request intent.\",\n        \"Shared IP prefixes with other OpenAI feeds must return all applicable evidence.\"\n      ],\n      feedUrl: \"https://openai.com/adsbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.602788Z\",\n        httpStatus: 200,\n        contentType: \"application/json; charset=utf-8\",\n        fixturePath: \"fixtures/openai-adsbot.json\",\n        fixtureSha256: \"460b800ffb026c5ec1b9540d285f2ade8e1c4a654e65dae315e2bae650b5d74d\",\n        publisherTimestampRaw: \"2026-05-12T03:00:00.000000\",\n        rangeCounts: {\n          ipv4: 2,\n          ipv6: 0\n        },\n        bytes: 177\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"anthropic-shared\",\n      provider: {\n        id: \"anthropic\",\n        name: \"Anthropic / Claude\"\n      },\n      scope: \"provider-shared\",\n      category: \"shared-crawlers\",\n      purpose: \"Infrastructure shared across documented Claude bots.\",\n      identities: [\n        {\n          id: \"claudebot\",\n          name: \"ClaudeBot\",\n          httpTokens: [\n            \"ClaudeBot\"\n          ],\n          purposes: [\n            \"ai-training\"\n          ],\n          documentationUrl: \"https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler\"\n        },\n        {\n          id: \"claude-searchbot\",\n          name: \"Claude-SearchBot\",\n          httpTokens: [\n            \"Claude-SearchBot\"\n          ],\n          purposes: [\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler\"\n        },\n        {\n          id: \"claude-user\",\n          name: \"Claude-User\",\n          httpTokens: [\n            \"Claude-User\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler\"\n        }\n      ],\n      documentationUrls: [\n        \"https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler\"\n      ],\n      limitations: [\n        \"Single feed has no per-crawler labels; preserve all three purposes without attributing any individual request to one.\",\n        \"Documentation establishes that listed IPs indicate Anthropic; it does not prove out-of-range traffic cannot be Anthropic.\"\n      ],\n      feedUrl: \"https://claude.com/crawling/bots.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-21T11:27:03.593Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/anthropic-shared.json\",\n        fixtureSha256: \"c960bb55504c3c478d0335bc7153e9ca871c26388a69e403cbad121a5bb5c5dd\",\n        publisherTimestampRaw: \"2026-10-20T00:00:00Z\",\n        rangeCounts: {\n          ipv4: 14,\n          ipv6: 0\n        },\n        bytes: 653\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"ahrefs-shared\",\n      provider: {\n        id: \"ahrefs\",\n        name: \"Ahrefs\"\n      },\n      scope: \"provider-shared\",\n      category: \"seo-crawlers\",\n      purpose: \"Ahrefs marketing intelligence/Yep indexing and user-requested technical site audits.\",\n      identities: [\n        {\n          id: \"ahrefsbot\",\n          name: \"AhrefsBot\",\n          httpTokens: [\n            \"AhrefsBot\"\n          ],\n          purposes: [\n            \"seo-analysis\",\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://ahrefs.com/robot\"\n        },\n        {\n          id: \"ahrefssiteaudit\",\n          name: \"AhrefsSiteAudit\",\n          httpTokens: [\n            \"AhrefsSiteAudit\"\n          ],\n          purposes: [\n            \"seo-analysis\"\n          ],\n          documentationUrl: \"https://ahrefs.com/robot\"\n        }\n      ],\n      documentationUrls: [\n        \"https://ahrefs.com/robot\"\n      ],\n      limitations: [\n        \"Feed has no publisher timestamp; record retrieval time separately without fabricating creationTime.\",\n        \"Shared feed does not distinguish AhrefsBot from AhrefsSiteAudit.\"\n      ],\n      feedUrl: \"https://api.ahrefs.com/v3/public/crawler-ip-ranges\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: false,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.762902Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/ahrefs-shared.json\",\n        fixtureSha256: \"4246eee9407d58fb030ee9f12776f974f628db4b4f91f8111847dd565fc63d45\",\n        publisherTimestampRaw: null,\n        rangeCounts: {\n          ipv4: 81,\n          ipv6: 0\n        },\n        bytes: 3350\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"duckduckbot\",\n      provider: {\n        id: \"duckduckgo\",\n        name: \"DuckDuckGo\"\n      },\n      scope: \"provider-shared\",\n      category: \"web-indexing\",\n      purpose: \"Improve DuckDuckGo search results.\",\n      identities: [\n        {\n          id: \"duckduckbot\",\n          name: \"DuckDuckBot\",\n          httpTokens: [\n            \"DuckDuckBot\"\n          ],\n          purposes: [\n            \"web-indexing\"\n          ],\n          documentationUrl: \"https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot\"\n        }\n      ],\n      documentationUrls: [\n        \"https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot\"\n      ],\n      limitations: [\n        \"DuckDuckBot and DuckAssistBot feeds are byte-identical in this audit; an IP cannot distinguish their identities or purposes.\",\n        \"Identity consistency requires the declared token, and remains consistency rather than request authentication.\"\n      ],\n      feedUrl: \"https://duckduckgo.com/duckduckbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:44.073146Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/duckduckbot.json\",\n        fixtureSha256: \"fd9039362dfaaad236d50c07ddd12bf0cc7f0d530fbff59b8feb1b22e0db2459\",\n        publisherTimestampRaw: \"2026-09-01T12:44:58.000000\",\n        rangeCounts: {\n          ipv4: 486,\n          ipv6: 0\n        },\n        bytes: 32101\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"duckassistbot\",\n      provider: {\n        id: \"duckduckgo\",\n        name: \"DuckDuckGo\"\n      },\n      scope: \"provider-shared\",\n      category: \"ai-search\",\n      purpose: \"Real-time retrieval for cited AI-assisted answers; documentation excludes AI model training.\",\n      identities: [\n        {\n          id: \"duckassistbot\",\n          name: \"DuckAssistBot\",\n          httpTokens: [\n            \"DuckAssistBot\"\n          ],\n          purposes: [\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot\"\n        }\n      ],\n      documentationUrls: [\n        \"https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot\"\n      ],\n      limitations: [\n        \"DuckDuckBot and DuckAssistBot feeds are byte-identical in this audit; an IP cannot distinguish their identities or purposes.\",\n        \"Identity consistency requires the declared token, and remains consistency rather than request authentication.\"\n      ],\n      feedUrl: \"https://duckduckgo.com/duckassistbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:43.967221Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/duckassistbot.json\",\n        fixtureSha256: \"fd9039362dfaaad236d50c07ddd12bf0cc7f0d530fbff59b8feb1b22e0db2459\",\n        publisherTimestampRaw: \"2026-09-01T12:44:58.000000\",\n        rangeCounts: {\n          ipv4: 486,\n          ipv6: 0\n        },\n        bytes: 32101\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"commoncrawl\",\n      provider: {\n        id: \"commoncrawl\",\n        name: \"Common Crawl\"\n      },\n      scope: \"crawler-specific\",\n      category: \"open-web-crawl\",\n      purpose: \"Build a publicly accessible repository of web crawl data.\",\n      identities: [\n        {\n          id: \"ccbot\",\n          name: \"CCBot\",\n          httpTokens: [\n            \"CCBot\"\n          ],\n          purposes: [\n            \"open-web-data\"\n          ],\n          documentationUrl: \"https://commoncrawl.org/ccbot\"\n        }\n      ],\n      documentationUrls: [\n        \"https://commoncrawl.org/ccbot\"\n      ],\n      limitations: [\n        \"Feed recommends FCrDNS for IPv4; this release performs IP verification only.\",\n        \"Operator states reverse DNS is not yet supported over IPv6; retain this limitation without implementing DNS.\"\n      ],\n      feedUrl: \"https://index.commoncrawl.org/ccbot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4,\n        6\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:43.507289Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/commoncrawl.json\",\n        fixtureSha256: \"0a4c3b6707326d7f083139a979062604a57edfbb251bd29f23f5a86c5107ea30\",\n        publisherTimestampRaw: \"2026-08-11T13:40:00Z\",\n        rangeCounts: {\n          ipv4: 4,\n          ipv6: 1\n        },\n        bytes: 540\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"perplexity-bot\",\n      provider: {\n        id: \"perplexity\",\n        name: \"Perplexity\"\n      },\n      scope: \"crawler-specific\",\n      category: \"ai-search\",\n      purpose: \"Surface and link websites in Perplexity search; not foundation-model training.\",\n      identities: [\n        {\n          id: \"perplexitybot\",\n          name: \"PerplexityBot\",\n          httpTokens: [\n            \"PerplexityBot\"\n          ],\n          purposes: [\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://docs.perplexity.ai/docs/resources/perplexity-crawlers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://docs.perplexity.ai/docs/resources/perplexity-crawlers\"\n      ],\n      limitations: [\n        \"Current documentation links www.perplexity.com JSON URLs, which redirect to these www.perplexity.ai URLs; register only the final feed.\",\n        \"Old publisher timestamps do not measure freshness of the HTTP retrieval.\"\n      ],\n      feedUrl: \"https://www.perplexity.ai/perplexitybot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:42.871549Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/perplexity-bot.json\",\n        fixtureSha256: \"2688b50802b42611b412f8ac3bc614248d0eab00d74f4ceda41cb78526bde6b2\",\n        publisherTimestampRaw: \"2025-02-07T16:56:00.000000\",\n        rangeCounts: {\n          ipv4: 8,\n          ipv6: 0\n        },\n        bytes: 482\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"perplexity-user\",\n      provider: {\n        id: \"perplexity\",\n        name: \"Perplexity\"\n      },\n      scope: \"crawler-specific\",\n      category: \"user-triggered-fetching\",\n      purpose: \"User-requested page retrieval for answers with links; not automatic crawling or foundation-model training.\",\n      identities: [\n        {\n          id: \"perplexity-user\",\n          name: \"Perplexity-User\",\n          httpTokens: [\n            \"Perplexity-User\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://docs.perplexity.ai/docs/resources/perplexity-crawlers\"\n        }\n      ],\n      documentationUrls: [\n        \"https://docs.perplexity.ai/docs/resources/perplexity-crawlers\"\n      ],\n      limitations: [\n        \"Current documentation links www.perplexity.com JSON URLs, which redirect to these www.perplexity.ai URLs; register only the final feed.\",\n        \"Old publisher timestamps do not measure freshness of the HTTP retrieval.\"\n      ],\n      feedUrl: \"https://www.perplexity.ai/perplexity-user.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:43.190819Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/perplexity-user.json\",\n        fixtureSha256: \"23e55350c44ac51a8a6e7ed786d861db8bc62886fd1cfc228dfa467127223e48\",\n        publisherTimestampRaw: \"2025-10-17T10:17:00.000000\",\n        rangeCounts: {\n          ipv4: 4,\n          ipv6: 0\n        },\n        bytes: 276\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"applebot\",\n      provider: {\n        id: \"apple\",\n        name: \"Apple\"\n      },\n      scope: \"provider-category\",\n      category: \"search-crawlers\",\n      purpose: \"Apple search discovery; documentation also describes training and AI-answer uses with separate publisher controls.\",\n      identities: [\n        {\n          id: \"applebot\",\n          name: \"Applebot\",\n          httpTokens: [\n            \"Applebot\"\n          ],\n          purposes: [\n            \"web-indexing\",\n            \"ai-training\",\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://support.apple.com/en-us/119829\"\n        }\n      ],\n      documentationUrls: [\n        \"https://support.apple.com/en-us/119829\"\n      ],\n      limitations: [\n        \"Applebot-Extended does not crawl webpages and is not registered as an HTTP crawler identity.\",\n        \"Apple describes other user agents such as iTMS; the Applebot match must not imply a specific product.\"\n      ],\n      feedUrl: \"https://search.developer.apple.com/applebot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Completeness, identity/family scope, freshness and historical applicability must be established before enabling negative verdicts; inclusion alone is insufficient.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-20T19:11:46.408011Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/applebot.json\",\n        fixtureSha256: \"5a5e12188891d998341f4fb50d2b31c80aba5002f5cff9d0fa110c13e4e2edd0\",\n        publisherTimestampRaw: \"2026-09-15T10:00:00.000000\",\n        rangeCounts: {\n          ipv4: 24,\n          ipv6: 0\n        },\n        bytes: 1640\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"mistral-user\",\n      provider: {\n        id: \"mistral\",\n        name: \"Mistral\"\n      },\n      scope: \"crawler-specific\",\n      category: \"user-triggered-fetching\",\n      purpose: \"User-requested page retrieval in Mistral products; not automated crawling or model training.\",\n      identities: [\n        {\n          id: \"mistralai-user\",\n          name: \"MistralAI-User\",\n          httpTokens: [\n            \"MistralAI-User\"\n          ],\n          purposes: [\n            \"user-triggered-fetching\"\n          ],\n          documentationUrl: \"https://docs.mistral.ai/robots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://docs.mistral.ai/robots\"\n      ],\n      limitations: [\n        \"Published range membership does not authenticate an individual request.\",\n        \"No negative verdicts are enabled.\"\n      ],\n      feedUrl: \"https://mistral.ai/mistralai-user-ips.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Publisher feed inclusion alone does not establish complete identity/family coverage.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-21T12:55:10.554Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/mistral-user.json\",\n        fixtureSha256: \"6226c5829c7edb91995769a9f3f0a52b686b4a18cc5a8d6d92479d2908f793f6\",\n        publisherTimestampRaw: \"2025-02-19T12:00:00.000000\",\n        rangeCounts: {\n          ipv4: 4,\n          ipv6: 0\n        },\n        bytes: 279\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"mistral-index\",\n      provider: {\n        id: \"mistral\",\n        name: \"Mistral\"\n      },\n      scope: \"crawler-specific\",\n      category: \"ai-search\",\n      purpose: \"Automated web indexing for Mistral search; not model training.\",\n      identities: [\n        {\n          id: \"mistralai-index\",\n          name: \"MistralAI-Index\",\n          httpTokens: [\n            \"MistralAI-Index\"\n          ],\n          purposes: [\n            \"ai-search\"\n          ],\n          documentationUrl: \"https://docs.mistral.ai/robots\"\n        }\n      ],\n      documentationUrls: [\n        \"https://docs.mistral.ai/robots\"\n      ],\n      limitations: [\n        \"Published range membership does not authenticate an individual request.\",\n        \"No negative verdicts are enabled.\"\n      ],\n      feedUrl: \"https://mistral.ai/mistralai-index-ips.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Publisher feed inclusion alone does not establish complete identity/family coverage.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-21T12:55:10.554Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/mistral-index.json\",\n        fixtureSha256: \"35bf7aede93ea6a24b12606cf0abb809d8fe9846b2e054e0174dc53f91921c20\",\n        publisherTimestampRaw: \"2026-04-19T12:00:00.000000\",\n        rangeCounts: {\n          ipv4: 2,\n          ipv6: 0\n        },\n        bytes: 176\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    },\n    {\n      id: \"kimi-shared\",\n      provider: {\n        id: \"kimi\",\n        name: \"Kimi / Moonshot AI\"\n      },\n      scope: \"provider-shared\",\n      category: \"shared-crawlers\",\n      purpose: \"Publisher-listed Kimi infrastructure; the feed does not distinguish crawler identities or purposes.\",\n      identities: [],\n      documentationUrls: [\n        \"https://www.kimi.ai/policies/kimibot.json\"\n      ],\n      limitations: [\n        \"Published range membership does not authenticate an individual request.\",\n        \"No negative verdicts are enabled.\",\n        \"Official JSON is available, but supporting per-identity documentation could not be verified; do not infer KimiBot, Kimi-SearchBot or Kimi-User from an IP match.\"\n      ],\n      feedUrl: \"https://www.kimi.ai/policies/kimibot.json\",\n      sourceType: \"json-cidr-prefixes\",\n      feedSchema: \"publisher-prefixes-v1\",\n      requiresPublisherTimestamp: true,\n      addressFamilies: [\n        4\n      ],\n      verificationStatus: \"included\",\n      negativeVerification: {\n        allowed: false,\n        reason: \"Publisher feed inclusion alone does not establish complete identity/family coverage.\"\n      },\n      audit: {\n        checkedAt: \"2026-10-21T12:55:10.554Z\",\n        httpStatus: 200,\n        contentType: \"application/json\",\n        fixturePath: \"fixtures/kimi-shared.json\",\n        fixtureSha256: \"cc2df677a3164de0b0eaa5c6fad21cac1ecb03a905743b3bf23db347f0b058c4\",\n        publisherTimestampRaw: \"2026-05-18T10:04:07Z\",\n        rangeCounts: {\n          ipv4: 4,\n          ipv6: 0\n        },\n        bytes: 186\n      },\n      runtime: {\n        lastAttemptedRefresh: null,\n        lastSuccessfulRefresh: null,\n        publisherTimestampRaw: null,\n        lastKnownGoodVersion: null,\n        lastRefreshError: null,\n        rangeCounts: {\n          ipv4: 0,\n          ipv6: 0\n        }\n      },\n      refreshIntervalHours: 24\n    }\n  ],\n  excludedHttpTokens: [\n    {\n      token: \"Google-Extended\",\n      reason: \"Robots control token; no separate HTTP crawler.\"\n    },\n    {\n      token: \"Googlebot-News\",\n      reason: \"Robots token; Google documents no separate HTTP request user agent.\"\n    },\n    {\n      token: \"Applebot-Extended\",\n      reason: \"Data-use control; Apple states it does not crawl webpages.\"\n    }\n  ],\n  rejectedOrAliasedUrls: [\n    {\n      url: \"https://www.gstatic.com/ipranges/common-crawlers.json\",\n      httpStatus: 404,\n      finalUrl: \"https://www.gstatic.com/ipranges/common-crawlers.json\",\n      decision: \"excluded-404\"\n    },\n    {\n      url: \"https://www.gstatic.com/ipranges/special-crawlers.json\",\n      httpStatus: 404,\n      finalUrl: \"https://www.gstatic.com/ipranges/special-crawlers.json\",\n      decision: \"excluded-404\"\n    },\n    {\n      url: \"https://www.gstatic.com/ipranges/user-triggered-fetchers.json\",\n      httpStatus: 404,\n      finalUrl: \"https://www.gstatic.com/ipranges/user-triggered-fetchers.json\",\n      decision: \"excluded-404\"\n    },\n    {\n      url: \"https://www.gstatic.com/ipranges/user-triggered-fetchers-google.json\",\n      httpStatus: 404,\n      finalUrl: \"https://www.gstatic.com/ipranges/user-triggered-fetchers-google.json\",\n      decision: \"excluded-404\"\n    },\n    {\n      url: \"https://www.gstatic.com/ipranges/user-triggered-agents.json\",\n      httpStatus: 404,\n      finalUrl: \"https://www.gstatic.com/ipranges/user-triggered-agents.json\",\n      decision: \"excluded-404\"\n    },\n    {\n      url: \"https://developers.google.com/search/apis/ipranges/googlebot.json\",\n      httpStatus: 200,\n      finalUrl: \"https://developers.google.com/static/crawling/ipranges/common-crawlers.json\",\n      decision: \"alias-only\"\n    },\n    {\n      url: \"https://www.perplexity.com/perplexitybot.json\",\n      httpStatus: 200,\n      finalUrl: \"https://www.perplexity.ai/perplexitybot.json\",\n      decision: \"alias-only\"\n    },\n    {\n      url: \"https://www.perplexity.com/perplexity-user.json\",\n      httpStatus: 200,\n      finalUrl: \"https://www.perplexity.ai/perplexity-user.json\",\n      decision: \"alias-only\"\n    }\n  ]\n};\n\n// web/src/identity/catalog.js\nvar PURPOSES = Object.freeze({\n  \"web-indexing\": \"Web indexing\",\n  \"ai-search\": \"AI search discovery and answers\",\n  \"ai-training\": \"AI training/data collection\",\n  \"user-triggered-fetching\": \"User-triggered fetching\",\n  \"seo-analysis\": \"SEO analysis/crawling\",\n  \"advertising-related-crawling\": \"Advertising-related crawling\",\n  \"site-verification\": \"Site verification/testing\",\n  \"link-preview\": \"Link preview/metadata retrieval\",\n  \"open-web-data\": \"Open web crawl data\",\n  \"other-documented-automation\": \"Other documented automated operations\"\n});\nvar historicalAliases = [\n  {\n    token: \"Google-NotebookLM\",\n    identityId: \"google-gemininotebook\",\n    note: \"Former agent documented as supported until August 2026; current ranges do not prove historical identity.\"\n  },\n  {\n    token: \"google-speakr\",\n    identityId: \"google-read-aloud\",\n    note: \"Deprecated Google Read Aloud agent; current ranges do not prove historical identity.\"\n  }\n];\nfunction createIdentityCatalog(registry = source_registry_default) {\n  if (registry?.schemaVersion !== 1 || !Array.isArray(registry.sources)) {\n    throw new TypeError(\"Supply a version 1 audited source registry.\");\n  }\n  const snapshot = structuredClone(registry);\n  const sources2 = /* @__PURE__ */ new Map();\n  const identities = /* @__PURE__ */ new Map();\n  const tokens = /* @__PURE__ */ new Map();\n  const controls = new Map((snapshot.excludedHttpTokens ?? []).map((item) => [item.token.toLowerCase(), item]));\n  const addToken = (token2, identityId, historical = false, note = null) => {\n    const key = token2.toLowerCase();\n    if (controls.has(key)) throw new TypeError(\"A control-only token cannot be an HTTP identity.\");\n    const entries = tokens.get(key) ?? [];\n    if (!entries.some((e) => e.identityId === identityId)) entries.push({ identityId, historical, note });\n    tokens.set(key, entries);\n  };\n  for (const source of snapshot.sources) {\n    if (!source.id || sources2.has(source.id)) throw new TypeError(\"Source IDs must be unique.\");\n    sources2.set(source.id, source);\n    if (source.verificationStatus !== \"included\") continue;\n    for (const identity of source.identities) {\n      if (identity.purposes.some((p) => !Object.hasOwn(PURPOSES, p))) {\n        throw new TypeError(\"An identity has an undefined documented purpose.\");\n      }\n      let merged = identities.get(identity.id);\n      if (!merged) {\n        merged = {\n          id: identity.id,\n          name: identity.name,\n          providerId: source.provider.id,\n          providerName: source.provider.name,\n          sourceIds: [],\n          purposes: [],\n          documentationUrls: []\n        };\n        identities.set(identity.id, merged);\n      }\n      if (merged.providerId !== source.provider.id) throw new TypeError(\"Conflicting provider identity mapping.\");\n      merged.sourceIds.push(source.id);\n      merged.purposes = [.../* @__PURE__ */ new Set([...merged.purposes, ...identity.purposes])];\n      merged.documentationUrls = [.../* @__PURE__ */ new Set([...merged.documentationUrls, identity.documentationUrl])];\n      for (const token2 of identity.httpTokens) addToken(token2, identity.id);\n    }\n  }\n  for (const alias of historicalAliases) {\n    if (identities.has(alias.identityId)) addToken(alias.token, alias.identityId, true, alias.note);\n  }\n  return { sources: sources2, identities, tokens, controls };\n}\n\n// web/src/identity/user-agent.js\nvar MAX_USER_AGENT_LENGTH = 8192;\nvar defaultCatalog = createIdentityCatalog();\nvar token = \"[!#$%&'*+.^_`|~0-9A-Za-z-]+\";\nvar productPattern = new RegExp(`(^|[ \\\\t();,])(${token})(?:/(${token}))?(?=$|[ \\\\t();,])`, \"g\");\nvar automationNames = /* @__PURE__ */ new Map([\n  [\"curl\", \"curl\"],\n  [\"wget\", \"Wget\"],\n  [\"python-requests\", \"Python Requests\"],\n  [\"python-urllib\", \"Python urllib\"],\n  [\"aiohttp\", \"aiohttp\"],\n  [\"httpx\", \"HTTPX\"],\n  [\"go-http-client\", \"Go HTTP client\"],\n  [\"java\", \"Java HTTP client\"],\n  [\"okhttp\", \"OkHttp\"],\n  [\"libwww-perl\", \"libwww-perl\"],\n  [\"apache-httpclient\", \"Apache HttpClient\"],\n  [\"node-fetch\", \"node-fetch\"],\n  [\"undici\", \"Undici\"],\n  [\"axios\", \"Axios\"],\n  [\"postmanruntime\", \"Postman Runtime\"],\n  [\"httpie\", \"HTTPie\"],\n  [\"headlesschrome\", \"Headless Chrome\"],\n  [\"phantomjs\", \"PhantomJS\"],\n  [\"playwright\", \"Playwright\"],\n  [\"puppeteer\", \"Puppeteer\"],\n  [\"selenium\", \"Selenium\"]\n]);\nfunction maskQuotedTextAndCheckComments(raw) {\n  const chars = raw.split(\"\");\n  let quoted2 = false;\n  const commentStarts = [];\n  const claimStarts = /* @__PURE__ */ new Set();\n  for (let i = 0; i < raw.length; i++) {\n    if (raw[i] === \"\\\\\") {\n      if (commentStarts.length) commentStarts[commentStarts.length - 1] = false;\n      if (quoted2) {\n        chars[i] = \" \";\n        if (i + 1 < raw.length) chars[i + 1] = \" \";\n      }\n      i++;\n      continue;\n    }\n    if (raw[i] === '\"') {\n      if (commentStarts.length) commentStarts[commentStarts.length - 1] = false;\n      quoted2 = !quoted2;\n      chars[i] = \" \";\n      continue;\n    }\n    if (quoted2) {\n      chars[i] = \" \";\n      continue;\n    }\n    if (raw[i] === \"(\") {\n      commentStarts.push(true);\n      continue;\n    }\n    if (raw[i] === \")\") {\n      if (!commentStarts.length) return null;\n      commentStarts.pop();\n      if (commentStarts.length) commentStarts[commentStarts.length - 1] = false;\n      continue;\n    }\n    if (raw[i] === \";\" && commentStarts.length) {\n      commentStarts[commentStarts.length - 1] = true;\n    } else if (!/[ \\t]/.test(raw[i])) {\n      if (!commentStarts.length || commentStarts.at(-1)) claimStarts.add(i);\n      if (commentStarts.length) commentStarts[commentStarts.length - 1] = false;\n    }\n  }\n  return quoted2 || commentStarts.length ? null : { masked: chars.join(\"\"), claimStarts };\n}\nfunction browserFrom(products) {\n  const find = (names) => products.find((p) => names.includes(p.name.toLowerCase()));\n  for (const [family, names] of [\n    [\"Edge\", [\"edg\", \"edga\", \"edgios\", \"edge\"]],\n    [\"Opera\", [\"opr\", \"opera\"]],\n    [\"Firefox\", [\"firefox\", \"fxios\"]],\n    [\"Chrome\", [\"chrome\", \"crios\", \"headlesschrome\"]]\n  ]) {\n    const product = find(names);\n    if (product) return { family, version: product.version, advertisedToken: product.name };\n  }\n  const safari = find([\"safari\"]);\n  const version = find([\"version\"]);\n  return safari && version ? { family: \"Safari\", version: version.version, advertisedToken: safari.name } : null;\n}\nfunction parseUserAgent(input, catalog = defaultCatalog) {\n  const raw = typeof input === \"string\" ? input : null;\n  const result = {\n    raw,\n    normalized: null,\n    category: \"unknown\",\n    products: [],\n    claims: [],\n    otherCrawlerClaims: [],\n    ambiguous: false,\n    browser: null,\n    automation: [],\n    compatibilityTokens: [],\n    platforms: [],\n    declaredReferences: [],\n    controlTokens: [],\n    warnings: [],\n    limitations: [\n      \"User-Agent strings are self-declared and can be spoofed.\",\n      \"Documented purpose does not establish the intent or behavior of an individual request.\"\n    ]\n  };\n  if (input == null) return { ...result, category: \"missing\" };\n  if (raw === null) return { ...result, category: \"malformed\", warnings: [\"User-Agent must be a string.\"] };\n  if (raw.length > MAX_USER_AGENT_LENGTH) {\n    return { ...result, category: \"malformed\", warnings: [`User-Agent exceeds ${MAX_USER_AGENT_LENGTH} UTF-16 code units; it was not silently truncated.`] };\n  }\n  result.normalized = raw.trim();\n  if (result.normalized === \"\") return { ...result, category: \"missing\" };\n  if (/[\\u0000-\\u0008\\u000a-\\u001f\\u007f]/.test(raw)) {\n    return { ...result, category: \"malformed\", warnings: [\"User-Agent contains header control characters.\"] };\n  }\n  const masked = maskQuotedTextAndCheckComments(raw);\n  if (masked === null) return { ...result, category: \"malformed\", warnings: [\"User-Agent has unbalanced comments or quoted text.\"] };\n  const uriPattern = /(^|[\\s(+;\"'])([A-Za-z][A-Za-z0-9+.-]*:[^\\s<>\"']+)/g;\n  result.declaredReferences = [...raw.matchAll(uriPattern)].map((match) => ({\n    raw: match[2],\n    trusted: false,\n    handling: \"display-only\"\n  }));\n  const interpretation = masked.masked.replace(uriPattern, (_, prefix, uri) => prefix + \" \".repeat(uri.length));\n  const products = [...interpretation.matchAll(productPattern)].map((match) => ({\n    name: match[2],\n    version: match[3] ?? null,\n    claimPosition: masked.claimStarts.has(match.index + match[1].length)\n  }));\n  result.products = products;\n  const claims = /* @__PURE__ */ new Map();\n  const claimProducts = products.filter((p) => p.claimPosition);\n  for (const product of claimProducts) {\n    const key = product.name.toLowerCase();\n    const control = catalog.controls.get(key);\n    if (control) result.controlTokens.push({ token: product.name, reason: control.reason });\n    for (const mapping of catalog.tokens.get(key) ?? []) {\n      const identity = catalog.identities.get(mapping.identityId);\n      const claim = claims.get(identity.id) ?? {\n        ...structuredClone(identity),\n        matchedProducts: [],\n        historicalClaim: false,\n        documentedPurposes: identity.purposes.map((id) => ({ id, label: PURPOSES[id] }))\n      };\n      claim.matchedProducts.push({ ...product, historical: mapping.historical });\n      claim.historicalClaim ||= mapping.historical;\n      if (mapping.note) result.warnings.push(mapping.note);\n      claims.set(identity.id, claim);\n    }\n  }\n  result.claims = [...claims.values()];\n  result.otherCrawlerClaims = claimProducts.filter((p) => !catalog.controls.has(p.name.toLowerCase()) && !catalog.tokens.has(p.name.toLowerCase()) && p.name.toLowerCase() !== \"robots.txt\" && /bot|crawler|spider|scraper/i.test(p.name));\n  result.ambiguous = (/* @__PURE__ */ new Set([\n    ...result.claims.map((c) => c.id),\n    ...result.otherCrawlerClaims.map((p) => `unknown:${p.name.toLowerCase()}`)\n  ])).size > 1;\n  result.browser = browserFrom(claimProducts);\n  result.automation = claimProducts.filter((p) => automationNames.has(p.name.toLowerCase())).map((p) => ({ ...p, family: automationNames.get(p.name.toLowerCase()) }));\n  result.compatibilityTokens = products.filter((p) => [\"mozilla\", \"compatible\", \"applewebkit\", \"khtml\", \"gecko\", \"safari\", \"robots.txt\"].includes(p.name.toLowerCase()));\n  for (const [label, expression] of [\n    [\"Windows\", /\\bWindows(?: NT [\\d.]+)?\\b/],\n    [\"Android\", /\\bAndroid(?: [\\d.]+)?\\b/],\n    [\"iOS\", /\\b(?:iPhone|iPad|CPU (?:iPhone )?OS)\\b/],\n    [\"macOS\", /\\b(?:Macintosh|Mac OS X)\\b/],\n    [\"Linux\", /\\bLinux\\b/]\n  ]) if (expression.test(interpretation)) result.platforms.push(label);\n  const otherBot = result.otherCrawlerClaims.length > 0;\n  result.category = result.claims.length ? \"recognized-crawler\" : otherBot ? \"other-crawler-claim\" : result.automation.length ? \"automation-like\" : result.browser ? \"browser-like\" : products.length ? \"unknown\" : \"malformed\";\n  if (result.browser) result.limitations.push(\"A browser-like header does not prove human activity or exclude automation.\");\n  if (result.automation.length) result.limitations.push(\"Automation is not automatically malicious.\");\n  if (result.ambiguous) result.warnings.push(\"Multiple crawler identities are claimed; none was selected as authoritative.\");\n  if (result.controlTokens.length) result.warnings.push(\"Robots control tokens do not establish HTTP crawler identities.\");\n  if (!products.length) result.warnings.push(\"No interpretable product tokens were found.\");\n  return result;\n}\n\n// web/src/ip/prefix-index.js\nvar PrefixIndex = class {\n  #families = /* @__PURE__ */ new Map([[4, /* @__PURE__ */ new Map()], [6, /* @__PURE__ */ new Map()]]);\n  #lengths;\n  #size = 0;\n  constructor(entries = []) {\n    if (!Array.isArray(entries)) throw new TypeError(\"Range entries must be an array.\");\n    const seen = /* @__PURE__ */ new Set();\n    for (const entry of entries) {\n      if (!entry || typeof entry.sourceId !== \"string\" || !entry.sourceId || typeof entry.cidr !== \"string\") {\n        throw new TypeError(\"Every range entry needs a stable sourceId and a CIDR string.\");\n      }\n      const cidr = parseCIDR(entry.cidr);\n      const dedupKey = JSON.stringify([entry.sourceId, cidr.canonical]);\n      if (seen.has(dedupKey)) continue;\n      seen.add(dedupKey);\n      const record = Object.freeze({\n        ...structuredClone(entry),\n        cidr: cidr.canonical,\n        publishedCidr: entry.cidr\n      });\n      const prefixes = this.#families.get(cidr.family);\n      if (!prefixes.has(cidr.prefixLength)) prefixes.set(cidr.prefixLength, /* @__PURE__ */ new Map());\n      const networks2 = prefixes.get(cidr.prefixLength);\n      if (!networks2.has(cidr.network)) networks2.set(cidr.network, []);\n      networks2.get(cidr.network).push(record);\n      this.#size++;\n    }\n    this.#lengths = new Map([...this.#families].map(([family, prefixes]) => [family, [...prefixes.keys()].sort((a, b) => b - a)]));\n  }\n  get size() {\n    return this.#size;\n  }\n  get prefixLengths() {\n    return { ipv4: [...this.#lengths.get(4)], ipv6: [...this.#lengths.get(6)] };\n  }\n  lookup(input, { includeMappedIPv4 = false } = {}) {\n    const address = parseIP(input);\n    const matches = [];\n    const find = (ip, matchedVia) => {\n      for (const prefix of this.#lengths.get(ip.family)) {\n        const shift = BigInt(ip.bits - prefix);\n        const network = ip.value >> shift << shift;\n        const records = this.#families.get(ip.family).get(prefix).get(network);\n        if (records) for (const record of records) {\n          matches.push({ ...structuredClone(record), matchedVia });\n        }\n      }\n    };\n    find(address, \"native\");\n    if (includeMappedIPv4 && address.isIPv4Mapped) find(parseIP(address.embeddedIPv4), \"ipv4-mapped\");\n    return matches;\n  }\n};\n\n// data/iana/special-purpose.json\nvar special_purpose_default = {\n  schemaVersion: 1,\n  observedOn: \"2026-10-20\",\n  sources: [\n    {\n      url: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      fixture: \"ipv4-special.csv\",\n      sha256: \"cbc4b7653c8bc640ba1e8e5d4ebbf11e7c7a1d867e7f1593aad001d3f8632aac\",\n      observedOn: \"2026-10-20\"\n    },\n    {\n      url: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      fixture: \"ipv6-special.csv\",\n      sha256: \"bf56772aef97fbf9b4a27c98b8511f2bb1ba96da4b9ccc12ab203a2496faba66\",\n      observedOn: \"2026-10-20\"\n    }\n  ],\n  ranges: [\n    {\n      cidr: \"0.0.0.0/8\",\n      name: '\"This network\"',\n      category: \"this-network\",\n      globallyReachable: false,\n      reference: \"[RFC 791, Section 3.2]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"0.0.0.0/32\",\n      name: '\"This host on this network\"',\n      category: \"unspecified\",\n      globallyReachable: false,\n      reference: \"[RFC 1122, Section 3.2.1.3]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"10.0.0.0/8\",\n      name: \"Private-Use\",\n      category: \"private\",\n      globallyReachable: false,\n      reference: \"[RFC 1918]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"100.64.0.0/10\",\n      name: \"Shared Address Space\",\n      category: \"shared-address-space\",\n      globallyReachable: false,\n      reference: \"[RFC 6598]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"127.0.0.0/8\",\n      name: \"Loopback\",\n      category: \"loopback\",\n      globallyReachable: false,\n      reference: \"[RFC 1122, Section 3.2.1.3]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"169.254.0.0/16\",\n      name: \"Link Local\",\n      category: \"link-local\",\n      globallyReachable: false,\n      reference: \"[RFC 3927]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"172.16.0.0/12\",\n      name: \"Private-Use\",\n      category: \"private\",\n      globallyReachable: false,\n      reference: \"[RFC 1918]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.0/24\",\n      name: \"IETF Protocol Assignments\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 6890, Section 2.1]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.0/29\",\n      name: \"IPv4 Service Continuity Prefix\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 7335]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.8/32\",\n      name: \"IPv4 dummy address\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 7600]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.9/32\",\n      name: \"Port Control Protocol Anycast\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7723]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.10/32\",\n      name: \"Traversal Using Relays around NAT Anycast\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 8155]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.170/32\",\n      name: \"NAT64/DNS64 Discovery\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 8880]; [RFC 7050, Section 2.2]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.0.171/32\",\n      name: \"NAT64/DNS64 Discovery\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 8880]; [RFC 7050, Section 2.2]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.0.2.0/24\",\n      name: \"Documentation (TEST-NET-1)\",\n      category: \"documentation\",\n      globallyReachable: false,\n      reference: \"[RFC 5737]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.31.196.0/24\",\n      name: \"AS112-v4\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7535]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.52.193.0/24\",\n      name: \"AMT\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7450]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.88.99.0/24\",\n      name: \"Deprecated (6to4 Relay Anycast)\",\n      category: \"protocol-assignment\",\n      globallyReachable: null,\n      reference: \"[RFC 7526]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"2015-03\"\n    },\n    {\n      cidr: \"192.88.99.2/32\",\n      name: \"6a44-relay anycast address\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 6751]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.168.0.0/16\",\n      name: \"Private-Use\",\n      category: \"private\",\n      globallyReachable: false,\n      reference: \"[RFC 1918]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"192.175.48.0/24\",\n      name: \"Direct Delegation AS112 Service\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7534]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"198.18.0.0/15\",\n      name: \"Benchmarking\",\n      category: \"benchmarking\",\n      globallyReachable: false,\n      reference: \"[RFC 2544]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"198.51.100.0/24\",\n      name: \"Documentation (TEST-NET-2)\",\n      category: \"documentation\",\n      globallyReachable: false,\n      reference: \"[RFC 5737]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"203.0.113.0/24\",\n      name: \"Documentation (TEST-NET-3)\",\n      category: \"documentation\",\n      globallyReachable: false,\n      reference: \"[RFC 5737]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"240.0.0.0/4\",\n      name: \"Reserved\",\n      category: \"reserved\",\n      globallyReachable: false,\n      reference: \"[RFC 1112, Section 4]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"255.255.255.255/32\",\n      name: \"Limited Broadcast\",\n      category: \"limited-broadcast\",\n      globallyReachable: false,\n      reference: \"[RFC 8190]; [RFC 919, Section 7]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"::1/128\",\n      name: \"Loopback Address\",\n      category: \"loopback\",\n      globallyReachable: false,\n      reference: \"[RFC 4291]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"::/128\",\n      name: \"Unspecified Address\",\n      category: \"unspecified\",\n      globallyReachable: false,\n      reference: \"[RFC 4291]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"::ffff:0:0/96\",\n      name: \"IPv4-mapped Address\",\n      category: \"ipv4-mapped\",\n      globallyReachable: false,\n      reference: \"[RFC 4291]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"64:ff9b::/96\",\n      name: \"IPv4-IPv6 Translat.\",\n      category: \"translation\",\n      globallyReachable: true,\n      reference: \"[RFC 6052]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"64:ff9b:1::/48\",\n      name: \"IPv4-IPv6 Translat.\",\n      category: \"translation-local\",\n      globallyReachable: false,\n      reference: \"[RFC 8215]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"100::/64\",\n      name: \"Discard-Only Address Block\",\n      category: \"discard-only\",\n      globallyReachable: false,\n      reference: \"[RFC 6666]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"100:0:0:1::/64\",\n      name: \"Dummy IPv6 Prefix\",\n      category: \"dummy-prefix\",\n      globallyReachable: false,\n      reference: \"[RFC 9780]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001::/23\",\n      name: \"IETF Protocol Assignments\",\n      category: \"protocol-assignment\",\n      globallyReachable: false,\n      reference: \"[RFC 2928]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001::/32\",\n      name: \"TEREDO\",\n      category: \"teredo\",\n      globallyReachable: null,\n      reference: \"[RFC 4380]; [RFC 8190]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:1::1/128\",\n      name: \"Port Control Protocol Anycast\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7723]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:1::2/128\",\n      name: \"Traversal Using Relays around NAT Anycast\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 8155]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:1::3/128\",\n      name: \"DNS-SD Service Registration Protocol Anycast\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 9665]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:2::/48\",\n      name: \"Benchmarking\",\n      category: \"benchmarking\",\n      globallyReachable: false,\n      reference: \"[RFC 5180]; [RFC Errata 1752]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:3::/32\",\n      name: \"AMT\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7450]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:4:112::/48\",\n      name: \"AS112-v6\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7535]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:10::/28\",\n      name: \"Deprecated (previously ORCHID)\",\n      category: \"protocol-assignment\",\n      globallyReachable: null,\n      reference: \"[RFC 4843]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"2014-03\"\n    },\n    {\n      cidr: \"2001:20::/28\",\n      name: \"ORCHIDv2\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7343]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:30::/28\",\n      name: \"Drone Remote ID Protocol Entity Tags (DETs) Prefix\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 9374]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2001:db8::/32\",\n      name: \"Documentation\",\n      category: \"documentation\",\n      globallyReachable: false,\n      reference: \"[RFC 3849]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2002::/16\",\n      name: \"6to4\",\n      category: \"six-to-four\",\n      globallyReachable: null,\n      reference: \"[RFC 3056]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"2620:4f:8000::/48\",\n      name: \"Direct Delegation AS112 Service\",\n      category: \"global-special-purpose\",\n      globallyReachable: true,\n      reference: \"[RFC 7534]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"3fff::/20\",\n      name: \"Documentation\",\n      category: \"documentation\",\n      globallyReachable: false,\n      reference: \"[RFC 9637]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"5f00::/16\",\n      name: \"Segment Routing (SRv6) SIDs\",\n      category: \"segment-routing\",\n      globallyReachable: false,\n      reference: \"[RFC 9602]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"fc00::/7\",\n      name: \"Unique-Local\",\n      category: \"unique-local\",\n      globallyReachable: false,\n      reference: \"[RFC 4193]; [RFC 8190]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"fe80::/10\",\n      name: \"Link-Local Unicast\",\n      category: \"link-local\",\n      globallyReachable: false,\n      reference: \"[RFC 4291]\",\n      registryUrl: \"https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry-1.csv\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"224.0.0.0/4\",\n      name: \"IPv4 multicast\",\n      category: \"multicast\",\n      globallyReachable: false,\n      reference: \"https://www.rfc-editor.org/rfc/rfc5771\",\n      registryUrl: \"https://www.rfc-editor.org/rfc/rfc5771\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"ff00::/8\",\n      name: \"IPv6 multicast\",\n      category: \"multicast\",\n      globallyReachable: false,\n      reference: \"https://www.rfc-editor.org/rfc/rfc4291\",\n      registryUrl: \"https://www.rfc-editor.org/rfc/rfc4291\",\n      terminationDate: \"N/A\"\n    },\n    {\n      cidr: \"::/96\",\n      name: \"Deprecated IPv4-compatible representation\",\n      category: \"ipv4-compatible\",\n      globallyReachable: false,\n      reference: \"https://www.rfc-editor.org/rfc/rfc4291#section-2.5.5.1\",\n      registryUrl: \"https://www.rfc-editor.org/rfc/rfc4291#section-2.5.5.1\",\n      terminationDate: \"N/A\"\n    }\n  ]\n};\n\n// web/src/ip/special-use.js\nvar index = new PrefixIndex(special_purpose_default.ranges.map((range) => ({ ...range, sourceId: \"iana-special-purpose\" })));\nfunction classifyIP(input) {\n  const address = parseIP(input);\n  const ranges = index.lookup(address);\n  const selected = ranges[0];\n  if (address.isIPv4Mapped) {\n    const embedded = classifyIP(address.embeddedIPv4);\n    return {\n      kind: \"ipv4-mapped\",\n      globallyReachable: false,\n      matchingAllowed: embedded.matchingAllowed,\n      ranges,\n      embeddedIPv4: { address: address.embeddedIPv4, classification: embedded },\n      explanation: \"IPv4-mapped IPv6 representation; IPv4 matching is explicitly projected to the embedded address.\"\n    };\n  }\n  return {\n    kind: selected?.category ?? \"public-candidate\",\n    globallyReachable: selected ? selected.globallyReachable : null,\n    matchingAllowed: selected ? selected.globallyReachable === true : true,\n    ranges,\n    explanation: selected ? `${selected.name}; this is special-purpose address space, not an ordinary public address.` : \"No special-purpose assignment in the bundled registry. This does not prove routability, ownership, or human activity.\"\n  };\n}\n\n// web/src/ip/verify.js\nfunction verifyIP(input, index2) {\n  if (!(index2 instanceof PrefixIndex)) throw new TypeError(\"Supply a PrefixIndex.\");\n  let address;\n  try {\n    address = parseIP(input);\n  } catch (error) {\n    if (!(error instanceof AddressError)) throw error;\n    return {\n      input: typeof input === \"string\" ? input : null,\n      status: \"invalid\",\n      address: null,\n      classification: null,\n      matches: [],\n      error: { code: error.code, message: error.message },\n      explanation: \"The input is malformed; no infrastructure check was performed.\"\n    };\n  }\n  const classification = classifyIP(address);\n  const matches = classification.matchingAllowed ? index2.lookup(address, { includeMappedIPv4: true }) : [];\n  const sourceIds = [...new Set(matches.map((match) => match.sourceId))];\n  const providerIds = [...new Set(matches.map((match) => match.providerId).filter(Boolean))];\n  const status = !classification.matchingAllowed ? \"special-use\" : index2.size === 0 ? \"dataset-unavailable\" : matches.length ? \"range-match\" : \"no-range-match\";\n  const explanations = {\n    \"special-use\": \"Valid special-purpose input; ordinary public crawler matching was not performed.\",\n    \"dataset-unavailable\": \"No usable ranges were supplied. Missing data cannot establish a negative match.\",\n    \"range-match\": \"The address matches the supplied ranges. Membership does not authenticate a request or establish an exact crawler identity or purpose; source trust and freshness must be assessed separately.\",\n    \"no-range-match\": \"No match in the supplied ranges. This is not an identity-mismatch or malicious-traffic verdict; completeness, freshness and historical applicability have not been assessed.\"\n  };\n  return {\n    input: typeof input === \"string\" ? input : address.normalized,\n    status,\n    address: {\n      family: address.family,\n      normalized: address.normalized,\n      key: address.key,\n      isIPv4Mapped: address.isIPv4Mapped,\n      embeddedIPv4: address.embeddedIPv4\n    },\n    classification,\n    matches,\n    sourceIds,\n    providerIds,\n    ambiguity: providerIds.length > 1 ? \"multiple-providers\" : sourceIds.length > 1 ? \"multiple-sources\" : null,\n    explanation: explanations[status]\n  };\n}\n\n// web/src/identity/decision.js\nvar labels = {\n  \"official-infrastructure-match\": \"Official infrastructure match\",\n  \"claim-consistent\": \"Claim consistent with official evidence\",\n  \"claimed-identity-mismatch\": \"Claimed identity mismatch\",\n  \"provider-identified\": \"Provider identified; specific crawler unresolved\",\n  \"browser-like\": \"Browser-like / no crawler claim\",\n  \"automation-like\": \"Automation-like / no verified crawler identity\",\n  unknown: \"Unknown\",\n  inconclusive: \"Inconclusive\",\n  \"invalid-nonpublic\": \"Invalid or nonpublic/special-use input\"\n};\nvar limits = [\n  \"A User-Agent is a spoofable claim, not authentication.\",\n  \"Published infrastructure membership does not prove benign behavior or individual request intent.\",\n  \"Unsupported or missing evidence is not proof of malicious behavior.\"\n];\nfunction health(record, now) {\n  if (!record) return {\n    state: \"never-successful\",\n    freshness: \"unknown\",\n    current: false,\n    available: false,\n    validated: false,\n    ageMs: null,\n    retrievedAtRaw: null,\n    retrievedAt: null,\n    publisherTimestampRaw: null,\n    version: null,\n    error: null\n  };\n  const timestamp = parseTimestamp(record.snapshot.retrievedAt);\n  const publisherTime = parseTimestamp(record.snapshot.publisherTimestampRaw);\n  const ageMs = timestamp.status === \"parsed\" ? now - timestamp.milliseconds : null;\n  const intervalMs = record.source.refreshIntervalHours * 36e5;\n  const freshness = ageMs === null ? \"unknown\" : ageMs < 0 ? \"future-dated\" : ageMs <= intervalMs ? \"fresh\" : ageMs <= 2 * intervalMs ? \"aging\" : \"stale\";\n  const validated = record.snapshot.evidenceKind === \"validated\" && typeof record.snapshot.version === \"string\" && record.snapshot.version.length > 0;\n  const state = record.source.verificationStatus !== \"included\" ? \"unsupported\" : record.invalidReason ? \"invalid\" : record.snapshot.evidenceKind === \"audit-fixture\" ? \"audit-fixture\" : !validated ? \"unvalidated\" : record.snapshot.refreshError ? \"refresh-failed\" : publisherTime.status === \"parsed\" && publisherTime.milliseconds > now ? \"publisher-future-dated\" : timestamp.status !== \"parsed\" ? \"timestamp-unusable\" : freshness;\n  return {\n    state,\n    freshness,\n    current: state === \"fresh\",\n    available: !record.invalidReason,\n    validated: validated && !record.invalidReason && state !== \"unsupported\",\n    ageMs,\n    retrievedAtRaw: record.snapshot.retrievedAt ?? null,\n    retrievedAt: timestamp.utc,\n    publisherTimestampRaw: record.snapshot.publisherTimestampRaw ?? null,\n    version: record.snapshot.version ?? null,\n    error: record.invalidReason ?? record.snapshot.refreshError ?? null\n  };\n}\nfunction historyFor(raw, states, now) {\n  const parsed = parseTimestamp(raw);\n  return {\n    ...parsed,\n    supplied: parsed.status !== \"missing\",\n    future: parsed.status === \"parsed\" && parsed.milliseconds > now,\n    comparisons: parsed.status === \"parsed\" ? states.filter((s) => s.retrievedAt).map((s) => {\n      const publisher = parseTimestamp(s.publisherTimestampRaw);\n      return {\n        sourceId: s.sourceId,\n        retrievedAt: s.retrievedAt,\n        requestPrecedesRetrieval: parsed.milliseconds < Date.parse(s.retrievedAt),\n        publisherTimestampRaw: s.publisherTimestampRaw,\n        publisherTimestampStatus: publisher.status,\n        requestPrecedesPublisherTimestamp: publisher.status === \"parsed\" ? parsed.milliseconds < publisher.milliseconds : null\n      };\n    }) : [],\n    warning: parsed.status === \"missing\" ? null : \"Current range matches do not prove historical membership; current nonmatches do not prove historical impersonation. No historical range archive is available.\"\n  };\n}\nfunction assessment(status, reason, explanation, checkedSourceIds = []) {\n  const candidate = status === \"claimed-identity-mismatch\";\n  return {\n    status,\n    label: labels[status],\n    reasons: [reason],\n    explanation,\n    checkedSourceIds,\n    investigationCandidate: candidate,\n    suggestedAction: candidate ? \"Review the source evidence, original client IP and request context before considering any blocking action.\" : \"Inspect the available evidence and limitations; no automatic blocking recommendation is made.\",\n    limitations: [...limits]\n  };\n}\nvar IdentityVerifier = class {\n  #catalog;\n  #records = /* @__PURE__ */ new Map();\n  #index;\n  #coverage;\n  #clock;\n  constructor({ registry, snapshots = [], negativeCoverage = [], clock = Date.now } = {}) {\n    this.#catalog = createIdentityCatalog(registry);\n    if (!Array.isArray(snapshots) || !Array.isArray(negativeCoverage) || typeof clock !== \"function\") {\n      throw new TypeError(\"Supply snapshot/coverage arrays and a clock function.\");\n    }\n    this.#clock = clock;\n    const entries = [];\n    for (const snapshot of structuredClone(snapshots)) {\n      const source = this.#catalog.sources.get(snapshot.sourceId);\n      if (!source || this.#records.has(source.id)) throw new TypeError(\"Unknown or duplicate snapshot source.\");\n      const record = { source, snapshot, invalidReason: null, rangeCounts: { ipv4: 0, ipv6: 0 } };\n      this.#records.set(source.id, record);\n      if (source.verificationStatus !== \"included\") continue;\n      try {\n        if (!Array.isArray(snapshot.prefixes) || snapshot.prefixes.length === 0) throw new TypeError(\"No prefix data.\");\n        const rangeCounts = { ipv4: 0, ipv6: 0 };\n        const sourceEntries = snapshot.prefixes.map((cidr) => {\n          if (typeof cidr !== \"string\") throw new TypeError(\"A prefix must be a CIDR string.\");\n          const parsed = parseCIDR(cidr);\n          rangeCounts[`ipv${parsed.family}`]++;\n          return {\n            cidr,\n            sourceId: source.id,\n            providerId: source.provider.id,\n            providerName: source.provider.name,\n            category: source.category,\n            scope: source.scope,\n            sourceUrl: source.feedUrl,\n            documentationUrls: source.documentationUrls,\n            sourceLimitations: source.limitations\n          };\n        });\n        record.rangeCounts = rangeCounts;\n        entries.push(...sourceEntries);\n      } catch {\n        record.invalidReason = \"The source snapshot is empty or contains invalid CIDRs; no partial source was indexed.\";\n      }\n    }\n    this.#index = new PrefixIndex(entries);\n    this.#coverage = structuredClone(negativeCoverage);\n    for (const policy of this.#coverage) {\n      const source = this.#catalog.sources.get(policy.sourceId);\n      const identities = source?.identities.map((i) => i.id) ?? [];\n      if (!source || !Array.isArray(policy.identityIds) || policy.identityIds.length === 0 || policy.identityIds.some((id) => !identities.includes(id)) || !Array.isArray(policy.addressFamilies) || policy.addressFamilies.length === 0 || policy.addressFamilies.some((f) => ![4, 6].includes(f)) || !source.documentationUrls.includes(policy.documentationUrl) || policy.limitationsResolved !== true || parseTimestamp(policy.reviewedAt).status !== \"parsed\") {\n        throw new TypeError(\"Negative coverage needs audited identity/family scope, publisher documentation and an explicit review time.\");\n      }\n    }\n  }\n  analyze({ ip, userAgent = null, timestamp = null } = {}) {\n    const now = this.#clock();\n    if (!Number.isFinite(now) || !Number.isFinite(new Date(now).getTime())) throw new TypeError(\"Clock must return valid epoch milliseconds.\");\n    const client = parseUserAgent(userAgent, this.#catalog);\n    const membership = verifyIP(ip, this.#index);\n    const states = [...this.#catalog.sources.values()].filter((s) => s.verificationStatus === \"included\").map((source) => ({\n      sourceId: source.id,\n      rangeCounts: { ...this.#records.get(source.id)?.rangeCounts ?? { ipv4: 0, ipv6: 0 } },\n      ...health(this.#records.get(source.id), now)\n    }));\n    const byId2 = new Map(states.map((s) => [s.sourceId, s]));\n    const observedMatches = membership.matches.map((match) => ({ ...match, health: byId2.get(match.sourceId) }));\n    const currentMatches = observedMatches.filter((match) => match.health?.current);\n    const currentSources = states.filter((s) => s.current);\n    const providers = [...new Set(currentMatches.map((m) => m.providerId))];\n    const history = historyFor(timestamp, states, now);\n    const infrastructure = {\n      method: \"published-cidr-membership\",\n      observationTime: new Date(now).toISOString(),\n      status: membership.status === \"invalid\" ? \"invalid\" : membership.status === \"special-use\" ? \"special-use\" : currentMatches.length ? \"current-match\" : observedMatches.length ? \"noncurrent-match\" : currentSources.length ? \"no-current-match\" : \"unavailable\",\n      observedMatches,\n      currentMatches,\n      sourceStates: states,\n      providerIds: providers,\n      currentSourceIds: currentSources.map((s) => s.sourceId),\n      incompleteRegistry: currentSources.length !== states.length,\n      sourceIdsWithoutCurrentEvidence: states.filter((s) => !s.current).map((s) => s.sourceId),\n      classification: membership.classification\n    };\n    let verdict;\n    const inconclusive = (reason, explanation, ids = []) => assessment(\"inconclusive\", reason, explanation, ids);\n    if ([\"invalid\", \"special-use\"].includes(membership.status)) {\n      verdict = assessment(\"invalid-nonpublic\", membership.status, membership.explanation);\n    } else if (client.category === \"malformed\") {\n      verdict = inconclusive(\"malformed-user-agent\", \"The User-Agent cannot be interpreted reliably; infrastructure observations remain available separately.\");\n    } else if (client.ambiguous) {\n      verdict = inconclusive(\"multiple-crawler-claims\", \"Multiple crawler identities occur in the header; none can be selected as the authenticated requester.\");\n    } else if (history.supplied) {\n      verdict = inconclusive(\n        history.future ? \"future-request-timestamp\" : history.status === \"parsed\" ? \"historical-uncertainty\" : \"timestamp-unusable\",\n        history.future ? `The request timestamp is after the observation time. ${history.warning}` : history.warning\n      );\n    } else if (client.claims.some((c) => c.historicalClaim)) {\n      verdict = inconclusive(\"historical-crawler-token\", \"A documented former crawler token was recognized; current infrastructure cannot verify its historical use.\");\n    } else if (providers.length > 1) {\n      verdict = inconclusive(\"multiple-provider-matches\", \"Multiple providers have current matching ranges; retain all evidence rather than selecting one attribution.\", currentMatches.map((m) => m.sourceId));\n    } else if (client.claims.length === 1) {\n      const claim = client.claims[0];\n      const applicable = claim.sourceIds.map((id) => ({ source: this.#catalog.sources.get(id), state: byId2.get(id) }));\n      const directMatches = currentMatches.filter((m) => claim.sourceIds.includes(m.sourceId));\n      if (applicable.some((s) => !s.state?.current)) {\n        verdict = inconclusive(\"applicable-source-not-current\", \"At least one applicable identity source is missing, unvalidated, aging, stale, future-dated or has a refresh failure.\", claim.sourceIds);\n      } else if (directMatches.some((m) => m.scope === \"crawler-specific\")) {\n        verdict = assessment(\"claim-consistent\", \"applicable-crawler-range-match\", \"The declared identity is consistent with its current crawler-specific published range. This is not individual request authentication.\", claim.sourceIds);\n      } else if (directMatches.length) {\n        verdict = assessment(\"provider-identified\", \"shared-or-category-range\", \"The claim is compatible with provider/category infrastructure, but shared ranges do not resolve the specific crawler.\", claim.sourceIds);\n      } else {\n        const family = membership.address.isIPv4Mapped ? 4 : membership.address.family;\n        const complete = applicable.length > 0 && applicable.every(({ source }) => source.scope !== \"customer-platform\" && source.negativeVerification?.allowed === true && this.#coverage.some((policy) => policy.sourceId === source.id && policy.identityIds.includes(claim.id) && policy.addressFamilies.includes(family) && parseTimestamp(policy.reviewedAt).milliseconds <= now));\n        const familyPresent = applicable.every(({ source }) => this.#records.get(source.id).rangeCounts[`ipv${family}`] > 0);\n        if (complete && familyPresent) {\n          verdict = assessment(\"claimed-identity-mismatch\", \"outside-reviewed-complete-current-ranges\", \"The recognized claim is outside every applicable, current published range with explicitly reviewed complete identity/address-family coverage. Review the evidence and request context before taking action.\", claim.sourceIds);\n        } else {\n          verdict = inconclusive(\"negative-coverage-not-established\", \"No applicable range matched, but complete current coverage for this identity and address family is not established. No impersonation verdict is justified.\", claim.sourceIds);\n        }\n      }\n    } else if (currentMatches.length) {\n      verdict = assessment(\"official-infrastructure-match\", \"current-published-range-match\", \"The address matches current published infrastructure. No specific HTTP crawler identity, request intent or benign behavior is established.\", currentMatches.map((m) => m.sourceId));\n    } else if (!currentSources.length || observedMatches.length) {\n      verdict = inconclusive(\"no-current-infrastructure-evidence\", \"Current applicable infrastructure evidence is unavailable; cached or incomplete observations cannot establish a negative verdict.\");\n    } else if (client.category === \"browser-like\") {\n      verdict = assessment(\"browser-like\", \"browser-header-without-crawler-claim\", \"The header resembles a browser. Automation and spoofing remain possible; human activity was not verified.\");\n    } else if (client.category === \"automation-like\") {\n      verdict = assessment(\"automation-like\", \"automation-header-without-verified-identity\", \"The header identifies an automation/client library; this does not establish malicious behavior.\");\n    } else {\n      verdict = assessment(\"unknown\", \"no-supported-authoritative-association\", \"No supported authoritative crawler association was established. Unknown or unsupported traffic is not automatically malicious.\");\n    }\n    verdict.checkedSources = [...new Set(verdict.checkedSourceIds)].map((sourceId) => {\n      const source = this.#catalog.sources.get(sourceId);\n      return {\n        sourceId,\n        providerId: source.provider.id,\n        providerName: source.provider.name,\n        scope: source.scope,\n        sourceUrl: source.feedUrl,\n        documentationUrls: [...source.documentationUrls],\n        limitations: [...source.limitations],\n        health: structuredClone(byId2.get(sourceId)),\n        negativeVerificationAllowed: source.negativeVerification?.allowed === true,\n        reviewedCoverage: structuredClone(this.#coverage.filter((policy) => policy.sourceId === sourceId))\n      };\n    });\n    if (history.warning) verdict.limitations.push(history.warning);\n    return {\n      schemaVersion: 1,\n      address: membership.address,\n      input: membership.input,\n      client,\n      infrastructure,\n      assessment: verdict,\n      history\n    };\n  }\n};\n\n// web/src/bulk/analyze.js\nfunction aggregateRows(parsed, { mode = \"ip-ua\" } = {}) {\n  if (![\"ip\", \"ip-ua\"].includes(mode)) throw new TypeError(\"Choose IP-only or IP + User-Agent mode.\");\n  const ips = /* @__PURE__ */ new Set(), claims = /* @__PURE__ */ new Set(), groups = /* @__PURE__ */ new Map();\n  const responseMetadata = parsed.source.profile === \"ip-ua-only\" && parsed.source.mapping.status != null;\n  let totalRequests = 0;\n  for (const row of parsed.rows) {\n    ips.add(row.ipKey);\n    if (ips.size > parsed.limits.distinctIPs) throw new ImportError(\n      \"distinct-ip-limit\",\n      `More than ${parsed.limits.distinctIPs} distinct normalized IPs. Filter or split this analysis; nothing was truncated.`,\n      row.reference\n    );\n    totalRequests += row.requestCount;\n    if (!Number.isSafeInteger(totalRequests)) throw new ImportError(\"request-count-overflow\", \"The request total exceeds the safe integer range. Reduce aggregated counts.\");\n    const claimKey = JSON.stringify([row.ipKey, row.rawUserAgent]);\n    claims.add(claimKey);\n    const identityKey = mode === \"ip\" ? row.ipKey : claimKey;\n    const key = responseMetadata ? JSON.stringify([identityKey, row.status]) : identityKey;\n    let group = groups.get(key);\n    if (!group) {\n      group = {\n        id: groups.size + 1,\n        ip: row.ip,\n        ipKey: row.ipKey,\n        userAgent: mode === \"ip\" ? null : row.rawUserAgent,\n        requestCount: 0,\n        countsRepresentRequests: true,\n        occurrences: [],\n        ...responseMetadata ? { responseStatus: row.status } : {}\n      };\n      groups.set(key, group);\n    }\n    group.requestCount += row.requestCount;\n    group.countsRepresentRequests &&= row.requestCountKnown;\n    group.occurrences.push(row);\n  }\n  return { groups: [...groups.values()], summary: {\n    originalRows: parsed.source.inputRecords,\n    parsedRows: parsed.rows.length,\n    invalidRows: parsed.invalidRows.length,\n    uniqueIPs: ips.size,\n    uniqueIPUserAgentGroups: claims.size,\n    resultGroups: groups.size,\n    omittedDuplicateRows: parsed.rows.length - groups.size,\n    totalRepresentedOccurrences: totalRequests,\n    totalObservedRequests: parsed.rows.length && parsed.rows.every((row) => row.requestCountKnown) ? totalRequests : null,\n    blankRows: parsed.source.blankRows\n  } };\n}\nfunction analyzeInput({ text, options = {}, snapshots = [], now = Date.now() }, onProgress = () => {\n}) {\n  const parsed = parseInput(text, options, onProgress);\n  const { groups, summary } = aggregateRows(parsed, options);\n  const verifier = new IdentityVerifier({ snapshots, clock: () => now });\n  const sourceEvidence = /* @__PURE__ */ new Map(), clients = /* @__PURE__ */ new Map(), matches = /* @__PURE__ */ new Map();\n  let shared = null;\n  const statuses = {};\n  for (let i = 0; i < groups.length; i++) {\n    const group = groups[i];\n    const representative = group.occurrences.find((row) => row.timestamp.status !== \"missing\");\n    const result = verifier.analyze({\n      ip: group.ip,\n      userAgent: group.userAgent,\n      timestamp: representative?.rawTimestamp ?? null\n    });\n    if (!shared) shared = {\n      observationTime: result.infrastructure.observationTime,\n      sourceStates: result.infrastructure.sourceStates,\n      currentSourceIds: result.infrastructure.currentSourceIds,\n      sourceIdsWithoutCurrentEvidence: result.infrastructure.sourceIdsWithoutCurrentEvidence\n    };\n    Object.assign(result.infrastructure, shared);\n    const states = new Map(shared.sourceStates.map((state) => [state.sourceId, state]));\n    for (const name of [\"observedMatches\", \"currentMatches\"]) {\n      result.infrastructure[name] = result.infrastructure[name].map((match) => {\n        const key = JSON.stringify([match.sourceId, match.cidr, match.matchedVia]);\n        if (!matches.has(key)) matches.set(key, { ...match, health: states.get(match.sourceId) });\n        return matches.get(key);\n      });\n    }\n    result.assessment.checkedSources = result.assessment.checkedSources.map((source) => {\n      if (!sourceEvidence.has(source.sourceId)) sourceEvidence.set(source.sourceId, source);\n      return sourceEvidence.get(source.sourceId);\n    });\n    const clientKey = group.userAgent;\n    if (!clients.has(clientKey)) clients.set(clientKey, result.client);\n    result.client = clients.get(clientKey);\n    group.result = result;\n    group.historyPolicy = {\n      timestampedOccurrences: group.occurrences.filter((row) => row.timestamp.status !== \"missing\").length,\n      representativeSourceRow: representative?.reference ?? null,\n      explanation: representative ? \"Any timestamped occurrence makes this grouping historically uncertain. Every raw timestamp is preserved; comparisons describe the referenced representative row only.\" : null\n    };\n    statuses[result.assessment.status] = (statuses[result.assessment.status] ?? 0) + 1;\n    if ((i + 1) % 100 === 0 || i + 1 === groups.length) onProgress({ stage: \"analyze\", completed: i + 1, total: groups.length });\n  }\n  return {\n    schemaVersion: 1,\n    mode: options.mode ?? \"ip-ua\",\n    analyzedAt: new Date(now).toISOString(),\n    source: parsed.source,\n    limits: parsed.limits,\n    summary,\n    statuses,\n    groups,\n    invalidRows: parsed.invalidRows,\n    warnings: [\n      \"The selected log client address may belong to a proxy/CDN; confirm the original visitor IP at collection time.\",\n      ...parsed.source.forwardedIP ? [\"A forwarded-IP column was explicitly selected by the operator; its trust is not established by this tool.\"] : [],\n      ...groups.some((group) => group.historyPolicy.timestampedOccurrences) ? [\"Current datasets cannot prove historical membership or impersonation.\"] : []\n    ]\n  };\n}\n\n// data/dataset-contract.js\nvar sources = source_registry_default.sources;\nvar sourceById = new Map(sources.map((source) => [source.id, source]));\nvar MAX_BYTES = 256 * 1024;\nvar MAX_PREFIXES = 8192;\nvar hashPattern = /^[a-f0-9]{64}$/;\nvar encoder = new TextEncoder();\nvar byteLength = (text) => encoder.encode(text).byteLength;\nasync function sha256(text) {\n  return [...new Uint8Array(await crypto.subtle.digest(\"SHA-256\", encoder.encode(text)))].map((byte) => byte.toString(16).padStart(2, \"0\")).join(\"\");\n}\nfunction instant(value) {\n  return typeof value === \"string\" && /^\\d{4}-\\d\\d-\\d\\dT\\d\\d:\\d\\d:\\d\\d\\.\\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;\n}\nfunction keys(value, allowed, required = allowed) {\n  if (!value || typeof value !== \"object\" || Array.isArray(value) || Object.keys(value).some((key) => !allowed.includes(key)) || required.some((key) => !Object.hasOwn(value, key))) throw new Error(\"invalid-schema\");\n}\nfunction validatePrefixes(prefixes) {\n  if (!Array.isArray(prefixes) || !prefixes.length || prefixes.length > MAX_PREFIXES) {\n    throw new Error(\"invalid-prefix-count\");\n  }\n  const seen = /* @__PURE__ */ new Set();\n  const rangeCounts = { ipv4: 0, ipv6: 0 };\n  for (const value of prefixes) {\n    const parsed = parseCIDR(value);\n    if (seen.has(parsed.canonical)) throw new Error(\"duplicate-prefix\");\n    seen.add(parsed.canonical);\n    rangeCounts[`ipv${parsed.family}`]++;\n  }\n  return rangeCounts;\n}\nfunction validateSnapshot(value, sourceId) {\n  keys(value, [\"schemaVersion\", \"sourceId\", \"retrievedAt\", \"publisherTimestampRaw\", \"prefixes\"]);\n  if (value.schemaVersion !== 1 || value.sourceId !== sourceId || !sourceById.has(sourceId) || !instant(value.retrievedAt) || !(value.publisherTimestampRaw === null || typeof value.publisherTimestampRaw === \"string\" && value.publisherTimestampRaw.length > 0 && value.publisherTimestampRaw.length <= 256)) throw new Error(\"invalid-snapshot\");\n  return validatePrefixes(value.prefixes);\n}\nfunction validateManifest(value) {\n  keys(value, [\"schemaVersion\", \"generatedAt\", \"sources\"]);\n  if (value.schemaVersion !== 1 || !instant(value.generatedAt) || !Array.isArray(value.sources) || !value.sources.length || value.sources.length > sources.length) throw new Error(\"invalid-manifest\");\n  const seen = /* @__PURE__ */ new Set();\n  for (const entry of value.sources) {\n    keys(entry, [\"sourceId\", \"lastAttemptedRefresh\", \"lastRefreshError\", \"current\", \"previous\"]);\n    if (!sourceById.has(entry.sourceId) || seen.has(entry.sourceId) || !(entry.lastAttemptedRefresh === null || instant(entry.lastAttemptedRefresh)) || !(entry.lastRefreshError === null || typeof entry.lastRefreshError === \"string\" && /^[a-z0-9-]{1,80}$/.test(entry.lastRefreshError))) throw new Error(\"invalid-source-state\");\n    seen.add(entry.sourceId);\n    for (const name of [\"current\", \"previous\"]) {\n      const descriptor = entry[name];\n      if (descriptor === null) continue;\n      keys(descriptor, [\"version\", \"bytes\", \"retrievedAt\", \"rangeCounts\"]);\n      keys(descriptor.rangeCounts, [\"ipv4\", \"ipv6\"]);\n      if (!hashPattern.test(descriptor.version) || !instant(descriptor.retrievedAt) || !Number.isInteger(descriptor.bytes) || descriptor.bytes < 1 || descriptor.bytes > MAX_BYTES || Object.values(descriptor.rangeCounts).some((count) => !Number.isInteger(count) || count < 0) || descriptor.rangeCounts.ipv4 + descriptor.rangeCounts.ipv6 < 1 || descriptor.rangeCounts.ipv4 + descriptor.rangeCounts.ipv6 > MAX_PREFIXES) throw new Error(\"invalid-descriptor\");\n    }\n    if (entry.previous && !entry.current) throw new Error(\"invalid-history\");\n  }\n  return { ...value, sources: sources.map((source) => value.sources.find((entry) => entry.sourceId === source.id) ?? { sourceId: source.id, lastAttemptedRefresh: null, lastRefreshError: null, current: null, previous: null }) };\n}\nasync function boundedText(response, limit = MAX_BYTES) {\n  const declared = response.headers.get(\"content-length\");\n  if (declared !== null && (!/^\\d+$/.test(declared) || Number(declared) > limit)) {\n    await response.body?.cancel();\n    throw new Error(\"response-too-large\");\n  }\n  if (!response.body) throw new Error(\"empty-response\");\n  const reader = response.body.getReader();\n  const decoder = new TextDecoder(\"utf-8\", { fatal: true });\n  let size = 0;\n  let text = \"\";\n  try {\n    for (; ; ) {\n      const { value, done } = await reader.read();\n      if (done) break;\n      size += value.byteLength;\n      if (size > limit) throw new Error(\"response-too-large\");\n      text += decoder.decode(value, { stream: true });\n    }\n    return text + decoder.decode();\n  } catch (error) {\n    await reader.cancel().catch(() => {\n    });\n    throw error;\n  } finally {\n    reader.releaseLock();\n  }\n}\n\n// web/src/dataset/client.js\nasync function validateBundle(bundle) {\n  validateManifest(bundle.manifest);\n  if (!bundle.bodies || typeof bundle.bodies !== \"object\") throw new Error(\"invalid-cache\");\n  const snapshots = [];\n  for (const entry of bundle.manifest.sources) {\n    if (!entry.current) continue;\n    const body = bundle.bodies[entry.sourceId];\n    if (typeof body !== \"string\" || byteLength(body) !== entry.current.bytes || await sha256(body) !== entry.current.version) throw new Error(\"snapshot-integrity\");\n    const snapshot = JSON.parse(body);\n    const counts = validateSnapshot(snapshot, entry.sourceId);\n    if (snapshot.retrievedAt !== entry.current.retrievedAt || counts.ipv4 !== entry.current.rangeCounts.ipv4 || counts.ipv6 !== entry.current.rangeCounts.ipv6) {\n      throw new Error(\"snapshot-descriptor-mismatch\");\n    }\n    snapshots.push({\n      ...snapshot,\n      version: entry.current.version,\n      evidenceKind: \"validated\",\n      refreshError: entry.lastRefreshError\n    });\n  }\n  if (!snapshots.length) throw new Error(\"dataset-never-retrieved\");\n  return snapshots;\n}\nfunction createDatasetClient({ baseUrl, fetcher = fetch, cache = null, allowLocalhost = false } = {}) {\n  const base = new URL(baseUrl);\n  if (base.protocol !== \"https:\" && !(allowLocalhost && base.protocol === \"http:\" && [\"localhost\", \"127.0.0.1\"].includes(base.hostname)) || base.username || base.password || base.search || base.hash || base.pathname !== \"/\") throw new Error(\"invalid-dataset-origin\");\n  let memory = null;\n  const getText = async (path, refresh) => {\n    const controller = new AbortController();\n    const timer = setTimeout(() => controller.abort(), 1e4);\n    try {\n      const response = await fetcher(new URL(path, base), {\n        method: \"GET\",\n        credentials: \"omit\",\n        referrerPolicy: \"no-referrer\",\n        redirect: \"error\",\n        cache: refresh ? \"reload\" : \"default\",\n        signal: controller.signal,\n        ...refresh && path === \"/v1/manifest\" ? { headers: { \"Cache-Control\": \"no-cache\" } } : {}\n      });\n      if (!response.ok || response.headers.get(\"content-type\")?.split(\";\")[0].trim() !== \"application/json\") {\n        await response.body?.cancel();\n        throw new Error(\"dataset-http\");\n      }\n      const text = await boundedText(response);\n      if (path === \"/v1/manifest\" && response.headers.get(\"etag\")?.replace(/^W\\//, \"\") !== `\"${await sha256(text)}\"`) {\n        throw new Error(\"manifest-integrity\");\n      }\n      return text;\n    } finally {\n      clearTimeout(timer);\n    }\n  };\n  return {\n    async load({ refresh = false } = {}) {\n      let previous = memory;\n      if (!previous && cache) {\n        try {\n          previous = await cache.get();\n          await validateBundle(previous);\n        } catch {\n          previous = null;\n        }\n      }\n      try {\n        const manifest = validateManifest(JSON.parse(await getText(\"/v1/manifest\", refresh)));\n        const bodies = {};\n        const pending = manifest.sources.filter((entry) => entry.current);\n        await Promise.all(Array.from({ length: Math.min(4, pending.length) }, async () => {\n          for (; ; ) {\n            const entry = pending.shift();\n            if (!entry) break;\n            const reusable = previous?.manifest.sources.find((item) => item.sourceId === entry.sourceId);\n            bodies[entry.sourceId] = reusable?.current?.version === entry.current.version ? previous.bodies[entry.sourceId] : await getText(`/v1/sources/${entry.sourceId}/${entry.current.version}.json`, refresh);\n          }\n        }));\n        const bundle = { manifest, bodies };\n        const snapshots = await validateBundle(bundle);\n        memory = structuredClone(bundle);\n        let persistence = cache ? \"saved\" : \"memory\";\n        if (cache) {\n          try {\n            await cache.put(structuredClone(bundle));\n          } catch {\n            persistence = \"memory\";\n          }\n        }\n        return { status: \"ready\", snapshots, manifest, persistence, error: null, totalSources: sources.length };\n      } catch (failure) {\n        if (previous) {\n          try {\n            const snapshots = (await validateBundle(previous)).map((snapshot) => ({\n              ...snapshot,\n              refreshError: snapshot.refreshError ?? \"dataset-download-failed\"\n            }));\n            memory = structuredClone(previous);\n            return {\n              status: \"cached\",\n              snapshots,\n              manifest: structuredClone(previous.manifest),\n              persistence: \"fallback\",\n              error: \"dataset-download-failed\",\n              totalSources: sources.length\n            };\n          } catch {\n          }\n        }\n        const diagnostics = /* @__PURE__ */ new Set([\n          \"dataset-http\",\n          \"manifest-integrity\",\n          \"snapshot-integrity\",\n          \"snapshot-descriptor-mismatch\",\n          \"dataset-never-retrieved\",\n          \"invalid-manifest\",\n          \"invalid-source-state\",\n          \"invalid-descriptor\",\n          \"invalid-schema\",\n          \"invalid-snapshot\",\n          \"response-too-large\",\n          \"empty-response\"\n        ]);\n        const reason = failure?.name === \"AbortError\" ? \"dataset-timeout\" : diagnostics.has(failure?.message) ? failure.message : \"dataset-network-or-validation\";\n        return {\n          status: \"unavailable\",\n          snapshots: [],\n          manifest: null,\n          persistence: \"none\",\n          error: reason,\n          totalSources: sources.length\n        };\n      }\n    }\n  };\n}\n\n// web/src/dataset/cache.js\nfunction browserDatasetCache(origin) {\n  const run = (mode, value) => new Promise((resolve, reject) => {\n    let database, settled = false;\n    const timer = setTimeout(() => {\n      settled = true;\n      database?.close();\n      reject(new Error(\"cache-timeout\"));\n    }, 2e3);\n    const fail = () => {\n      settled = true;\n      clearTimeout(timer);\n      database?.close();\n      reject(new Error(\"cache-unavailable\"));\n    };\n    let opening;\n    try {\n      opening = indexedDB.open(\"crawler-public-datasets\", 1);\n    } catch {\n      fail();\n      return;\n    }\n    opening.onupgradeneeded = () => opening.result.createObjectStore(\"bundles\");\n    opening.onerror = fail;\n    opening.onblocked = fail;\n    opening.onsuccess = () => {\n      database = opening.result;\n      if (settled) {\n        database.close();\n        return;\n      }\n      let transaction;\n      try {\n        transaction = database.transaction(\"bundles\", mode);\n      } catch {\n        fail();\n        return;\n      }\n      const store = transaction.objectStore(\"bundles\");\n      const request = mode === \"readonly\" ? store.get(origin) : store.put(value, origin);\n      transaction.oncomplete = () => {\n        settled = true;\n        clearTimeout(timer);\n        database.close();\n        resolve(request.result);\n      };\n      transaction.onerror = fail;\n      transaction.onabort = fail;\n    };\n  });\n  return { get: () => run(\"readonly\"), put: (value) => run(\"readwrite\", value) };\n}\n\n// web/src/results/assessment.js\nvar FINDING_LABELS = Object.freeze({\n  \"official-infrastructure-match\": \"Official infrastructure match\",\n  \"could-not-verify\": \"Could not verify\",\n  \"no-published-range-match\": \"No published range match\",\n  \"unverified-crawler-claim\": \"Unverified crawler claim\",\n  \"claimed-identity-mismatch\": \"Crawler claim mismatch - review\",\n  \"invalid-nonpublic\": \"Nonpublic / special-use IP\",\n  \"invalid-input\": \"Invalid input\"\n});\nfunction assessmentFinding(result) {\n  const status = result.assessment.status, infra = result.infrastructure;\n  const claims = result.client?.claims ?? [];\n  let id;\n  if ([\"invalid-input\", \"invalid-nonpublic\"].includes(status)) id = status;\n  else if (claims.length && !infra.observedMatches.length) id = \"unverified-crawler-claim\";\n  else if (status === \"claimed-identity-mismatch\") id = status;\n  else if ([\"claim-consistent\", \"provider-identified\", \"official-infrastructure-match\"].includes(status) && infra.currentMatches.length) id = \"official-infrastructure-match\";\n  else if (status === \"inconclusive\" || infra.observedMatches.length || !infra.sourceStates.some((source) => source.current)) id = \"could-not-verify\";\n  else id = \"no-published-range-match\";\n  const investigation = id === \"unverified-crawler-claim\"\n    ? \"The user-agent claims a recognized crawler, but the available published IP-range evidence does not establish its provider. This alone does not indicate impersonation or abuse. Check the source health and assessment explanation below for the reason verification was not possible.\"\n    : claims.length && !infra.currentMatches.length && ![\"invalid-input\", \"invalid-nonpublic\"].includes(id)\n      ? \"The crawler claim is not confirmed by current published range evidence. Review the observed ranges, source health and assessment explanation. This alone does not indicate impersonation or abuse.\"\n      : null;\n  return { id, label: FINDING_LABELS[id], ...investigation ? { investigation } : {} };\n}\n\n// web/src/export/scope.js\nfunction investigationCandidate(group, { sourceRegistry = source_registry_default, now = Date.now() } = {}) {\n  const { assessment: assessment2, client, history, address, infrastructure } = group.result;\n  if (assessment2.status !== \"claimed-identity-mismatch\" || assessment2.investigationCandidate !== true || client.claims.length !== 1 || client.ambiguous || client.claims[0].historicalClaim || history.supplied || group.historyPolicy.timestampedOccurrences || !infrastructure.classification.matchingAllowed) return false;\n  const claim = client.claims[0], family = address.isIPv4Mapped ? 4 : address.family;\n  const byId2 = new Map(sourceRegistry.sources.map((source) => [source.id, source]));\n  return claim.sourceIds.length > 0 && claim.sourceIds.every((id) => {\n    const definition = byId2.get(id), checked = assessment2.checkedSources.find((source) => source.sourceId === id);\n    const health2 = checked?.health, retrieved = parseTimestamp(health2?.retrievedAt);\n    if (!definition?.negativeVerification.allowed || definition.scope === \"customer-platform\" || checked?.negativeVerificationAllowed !== true || !health2?.current || !health2.validated || health2.state !== \"fresh\" || health2.error || retrieved.status !== \"parsed\" || retrieved.milliseconds > now || now - retrieved.milliseconds > definition.refreshIntervalHours * 36e5 || !(health2.rangeCounts?.[`ipv${family}`] > 0)) return false;\n    return checked.reviewedCoverage.some((policy) => policy.limitationsResolved === true && policy.identityIds.includes(claim.id) && policy.addressFamilies.includes(family) && definition.documentationUrls.includes(policy.documentationUrl) && parseTimestamp(policy.reviewedAt).status === \"parsed\" && parseTimestamp(policy.reviewedAt).milliseconds <= now);\n  });\n}\nfunction reportSelection(report, { scope = \"all\", ids = [] } = {}, candidateOptions) {\n  if (![\"all\", \"filtered\", \"selected\", \"shortlist\"].includes(scope)) throw new Error(\"Choose a supported export scope.\");\n  const known = /* @__PURE__ */ new Set([...report.groups.map((group) => `g-${group.id}`), ...report.invalidRows.map((_, index2) => `i-${index2}`)]);\n  if (!Array.isArray(ids) || ids.some((id) => !known.has(id))) throw new Error(\"Selection contains an unknown result. Re-analyze before exporting.\");\n  const selected = new Set(ids);\n  const groups = report.groups.filter((group) => scope === \"all\" || (scope === \"shortlist\" ? investigationCandidate(group, candidateOptions) : selected.has(`g-${group.id}`)));\n  const invalidRows = report.invalidRows.filter((_, index2) => scope === \"all\" || scope !== \"shortlist\" && selected.has(`i-${index2}`));\n  const includedInvalid = new Set(invalidRows);\n  const occurrences = groups.flatMap((group) => group.occurrences), uniqueIPs = new Set(groups.map((group) => group.ipKey));\n  return {\n    scope,\n    groups,\n    invalidRows,\n    ids: [\n      ...groups.map((group) => `g-${group.id}`),\n      ...report.invalidRows.flatMap((row, index2) => includedInvalid.has(row) ? [`i-${index2}`] : [])\n    ],\n    summary: {\n      resultGroups: groups.length,\n      invalidRows: invalidRows.length,\n      sourceRows: occurrences.length,\n      uniqueIPs: uniqueIPs.size,\n      totalRepresentedOccurrences: groups.reduce((sum, group) => sum + group.requestCount, 0),\n      totalObservedRequests: groups.length && groups.every((group) => group.countsRepresentRequests) ? groups.reduce((sum, group) => sum + group.requestCount, 0) : null\n    }\n  };\n}\n\n// web/src/export/candidates.js\nvar OPERATIONAL_WARNINGS = Object.freeze([\n  \"Candidate IPs for manual investigation or blocking review. These are operator selections, not confirmed malicious IPs.\",\n  \"Shared IP infrastructure can serve unrelated requests. Blocking an address can affect other users and legitimate crawlers.\",\n  \"Unknown, browser-like, automation-like, historical, stale and inconclusive results are not automatic blocking recommendations.\"\n]);\nfunction selectedCandidates(selection) {\n  if (selection.scope !== \"selected\") throw new Error(\"Select results explicitly before generating selected IPs.\");\n  const excluded = selection.invalidRows.map((row) => ({ sourceRecord: row.reference.record, reason: \"invalid-input\" }));\n  const addresses2 = /* @__PURE__ */ new Map(), groups = [];\n  for (const group of selection.groups) {\n    let address;\n    try {\n      address = parseIP(group.ip);\n    } catch {\n      excluded.push({ groupId: group.id, reason: \"invalid-ip\" });\n      continue;\n    }\n    if (!classifyIP(address).matchingAllowed) {\n      excluded.push({ groupId: group.id, reason: \"nonpublic-special-use\" });\n      continue;\n    }\n    addresses2.set(address.key, address);\n    groups.push(group);\n  }\n  const sorted = [...addresses2.values()].sort((a, b) => a.family - b.family || (a.value < b.value ? -1 : a.value > b.value ? 1 : 0));\n  return { ips: sorted.map((address) => address.normalized), addresses: sorted, groups, excluded, warnings: [...OPERATIONAL_WARNINGS] };\n}\n\n// web/src/export/serialize.js\nvar MAX_EXPORT_BYTES = 64 * 1024 * 1024;\nfunction csvCell(value) {\n  let text = value === null || value === void 0 ? \"\" : String(value);\n  const protectedCell = /^[\\s\\p{Cf}\\u0000-\\u001f]*[=+\\-@]/u.test(text) || /^[\\u0000-\\u001f]/.test(text);\n  if (protectedCell) text = `'${text}`;\n  return { text: `\"${text.replaceAll('\"', '\"\"')}\"`, protectedCell };\n}\nfunction writer(mime, maxBytes = MAX_EXPORT_BYTES) {\n  let bytes = 0;\n  const chunks = [];\n  return { append(text) {\n    const chunk = new TextEncoder().encode(text);\n    bytes += chunk.length;\n    if (bytes > maxBytes) throw new Error(`Export exceeds ${maxBytes.toLocaleString()} bytes. No partial download was created. Filter or select fewer records.`);\n    chunks.push(chunk);\n  }, finish() {\n    return { blob: new Blob(chunks, { type: mime }), bytes };\n  } };\n}\nvar unique = (values) => [...new Set(values)];\nvar byId = new Map(sources.map((source) => [source.id, source]));\nvar CSV_COLUMNS = [\n  \"export_scope\",\n  \"analysis_time\",\n  \"row_kind\",\n  \"group_id\",\n  \"source_record\",\n  \"line_start\",\n  \"line_end\",\n  \"original_ip\",\n  \"normalized_ip\",\n  \"address_family\",\n  \"original_user_agent\",\n  \"client_category\",\n  \"parsed_client_identity\",\n  \"claimed_crawler\",\n  \"observed_providers\",\n  \"crawler_categories\",\n  \"documented_purposes\",\n  \"finding\",\n  \"verification_status\",\n  \"matched_cidrs\",\n  \"evidence_sources\",\n  \"source_versions\",\n  \"source_retrieved_at\",\n  \"publisher_timestamps_raw\",\n  \"source_health\",\n  \"dataset_manifest_sha256\",\n  \"dataset_manifest_generated_at\",\n  \"dataset_delivery_state\",\n  \"historical_uncertainty\",\n  \"raw_timestamp\",\n  \"timestamp_status\",\n  \"timestamp_utc\",\n  \"occurrence_count\",\n  \"request_count_known\",\n  \"group_input_rows\",\n  \"group_represented_count\",\n  \"group_requests_known\",\n  \"explanation\",\n  \"raw_record\",\n  \"http_status\",\n  \"request_path\",\n  \"request_method\",\n  \"csv_safety_prefixed_fields\"\n];\nfunction csv(report, selection, dataset, digest, maxBytes, progress) {\n  const columns = report.source.profile === \"ip-ua-only\" ? [\n    \"export_scope\",\n    \"analysis_time\",\n    \"source_record\",\n    \"original_ip\",\n    \"normalized_ip\",\n    \"original_user_agent\",\n    \"observed_providers\",\n    \"claimed_crawler\",\n    \"finding\",\n    \"verification_status\",\n    \"matched_cidrs\",\n    \"evidence_sources\",\n    \"source_versions\",\n    \"source_retrieved_at\",\n    \"source_health\",\n    \"explanation\",\n    \"raw_record\",\n    \"http_status\",\n    \"csv_safety_prefixed_fields\"\n  ] : CSV_COLUMNS;\n  const output = writer(\"text/csv;charset=utf-8\", maxBytes);\n  output.append(\"\\uFEFF\" + columns.map((column) => csvCell(column).text).join(\",\") + \"\\r\\n\");\n  let count = 0;\n  const emit = (record) => {\n    record.export_scope = selection.scope;\n    record.analysis_time = report.analyzedAt;\n    const protectedFields = columns.filter((column) => column !== \"csv_safety_prefixed_fields\" && csvCell(record[column]).protectedCell);\n    record.csv_safety_prefixed_fields = JSON.stringify(protectedFields);\n    output.append(columns.map((column) => csvCell(record[column]).text).join(\",\") + \"\\r\\n\");\n    count++;\n    if (count % 250 === 0) progress({ stage: \"export\", completed: count, total: selection.summary.sourceRows + selection.invalidRows.length });\n  };\n  for (const group of selection.groups) {\n    const result = group.result, matches = result.infrastructure.observedMatches;\n    const sourceIds = unique([...matches.map((match) => match.sourceId), ...result.assessment.checkedSourceIds]);\n    const states = result.infrastructure.sourceStates.filter((state) => sourceIds.includes(state.sourceId));\n    const purposeIds = unique([\n      ...result.client.claims.flatMap((claim) => claim.purposes),\n      ...sourceIds.flatMap((id) => byId.get(id)?.identities.flatMap((identity) => identity.purposes) ?? [])\n    ]);\n    const common = {\n      row_kind: \"result-occurrence\",\n      group_id: group.id,\n      normalized_ip: group.ip,\n      address_family: result.address.family,\n      client_category: result.client.category,\n      parsed_client_identity: JSON.stringify({ browser: result.client.browser, automation: result.client.automation, products: result.client.products }),\n      claimed_crawler: JSON.stringify(result.client.claims.map((claim) => claim.name)),\n      observed_providers: JSON.stringify(unique(matches.map((match) => match.providerName))),\n      crawler_categories: JSON.stringify(unique(matches.map((match) => match.category))),\n      documented_purposes: JSON.stringify(purposeIds),\n      finding: assessmentFinding(result).label,\n      verification_status: result.assessment.status,\n      matched_cidrs: JSON.stringify(matches.map((match) => ({ sourceId: match.sourceId, publishedCidr: match.publishedCidr, canonicalCidr: match.cidr, matchedVia: match.matchedVia }))),\n      evidence_sources: JSON.stringify(sourceIds.map((id) => ({ sourceId: id, url: byId.get(id)?.feedUrl }))),\n      source_versions: JSON.stringify(Object.fromEntries(states.map((state) => [state.sourceId, state.version]))),\n      source_retrieved_at: JSON.stringify(Object.fromEntries(states.map((state) => [state.sourceId, state.retrievedAt]))),\n      publisher_timestamps_raw: JSON.stringify(Object.fromEntries(states.map((state) => [state.sourceId, state.publisherTimestampRaw]))),\n      source_health: JSON.stringify(Object.fromEntries(states.map((state) => [state.sourceId, state.state]))),\n      dataset_manifest_sha256: digest,\n      dataset_manifest_generated_at: dataset?.manifest?.generatedAt ?? null,\n      dataset_delivery_state: dataset?.status ?? \"not-supplied\",\n      historical_uncertainty: result.history.supplied,\n      group_input_rows: group.occurrences.length,\n      group_represented_count: group.requestCount,\n      group_requests_known: group.countsRepresentRequests,\n      explanation: result.assessment.explanation\n    };\n    for (const row of group.occurrences) emit({\n      ...common,\n      source_record: row.reference.record,\n      line_start: row.reference.lineStart,\n      line_end: row.reference.lineEnd,\n      original_ip: row.rawIp,\n      original_user_agent: row.rawUserAgent,\n      raw_timestamp: row.rawTimestamp,\n      timestamp_status: row.timestamp.status,\n      timestamp_utc: row.timestamp.utc,\n      occurrence_count: row.requestCount,\n      request_count_known: row.requestCountKnown,\n      raw_record: row.rawRecord,\n      http_status: row.status,\n      request_path: row.path,\n      request_method: row.method\n    });\n  }\n  for (const row of selection.invalidRows) emit({\n    row_kind: \"invalid-input\",\n    source_record: row.reference.record,\n    line_start: row.reference.lineStart,\n    line_end: row.reference.lineEnd,\n    finding: FINDING_LABELS[\"invalid-input\"],\n    verification_status: \"invalid-input\",\n    explanation: row.message,\n    raw_record: row.rawRecord,\n    dataset_manifest_sha256: digest,\n    dataset_delivery_state: dataset?.status ?? \"not-supplied\"\n  });\n  return { ...output.finish(), records: count };\n}\nfunction json(report, selection, dataset, digest, now, maxBytes, progress, kind = \"crawler-ip-verifier-results\") {\n  const clientPool = {}, matchPool = {}, sourceEvidence = {}, clients = /* @__PURE__ */ new Map(), matches = /* @__PURE__ */ new Map();\n  const references = selection.groups.map((group) => {\n    const result = group.result;\n    const clientKey = result.client.raw;\n    if (!clients.has(clientKey)) {\n      const ref = `c${clients.size + 1}`;\n      clients.set(clientKey, ref);\n      clientPool[ref] = result.client;\n    }\n    const matchRef = (match) => {\n      const key = JSON.stringify([match.sourceId, match.cidr, match.matchedVia]);\n      if (!matches.has(key)) {\n        const ref = `m${matches.size + 1}`;\n        matches.set(key, ref);\n        const { health: health2, ...evidence } = match;\n        matchPool[ref] = { ...evidence, healthSourceId: health2.sourceId };\n      }\n      return matches.get(key);\n    };\n    for (const source of result.assessment.checkedSources) sourceEvidence[source.sourceId] = source;\n    return {\n      clientRef: clients.get(clientKey),\n      observedMatchRefs: result.infrastructure.observedMatches.map(matchRef),\n      currentMatchRefs: result.infrastructure.currentMatches.map(matchRef)\n    };\n  });\n  const output = writer(\"application/json;charset=utf-8\", maxBytes);\n  const metadata = {\n    schemaVersion: 1,\n    kind,\n    exportedAt: new Date(now).toISOString(),\n    scope: { name: selection.scope, ids: selection.ids, summary: selection.summary },\n    analysis: {\n      analyzedAt: report.analyzedAt,\n      inputMode: report.mode,\n      summary: report.summary,\n      statuses: report.statuses,\n      source: report.source,\n      limits: report.limits,\n      warnings: report.warnings\n    },\n    dataset: dataset ? { ...dataset, manifestSha256: digest } : {\n      status: \"not-supplied\",\n      manifest: null,\n      manifestSha256: null,\n      sourceStates: report.groups[0]?.result.infrastructure.sourceStates ?? []\n    },\n    sourceEvidence,\n    clients: clientPool,\n    matches: matchPool,\n    limitations: [\n      ...report.warnings,\n      \"Analysis summary describes the full batch; scope summary describes exported rows only.\",\n      \"User-Agent strings are spoofable. Infrastructure membership does not authenticate a request or establish intent.\",\n      \"Current datasets do not establish historical membership; missing/incomplete/stale data cannot justify mismatch.\",\n      ...selection.scope === \"shortlist\" ? [\"Only currently evidence-supported mismatch candidates are included. Disabled real completeness policies can correctly leave this shortlist empty.\"] : []\n    ]\n  };\n  const start = JSON.stringify(metadata);\n  output.append(start.slice(0, -1) + ',\"results\":[');\n  for (let i = 0; i < selection.groups.length; i++) {\n    const group = selection.groups[i], { client, infrastructure, assessment: assessment2, ...result } = group.result;\n    const { sourceStates, observedMatches, currentMatches, ...infra } = infrastructure;\n    const { checkedSources, ...verdict } = assessment2;\n    const occurrences = report.source.profile === \"ip-ua-only\" ? group.occurrences.map((row) => ({\n      reference: row.reference,\n      rawRecord: row.rawRecord,\n      rawIp: row.rawIp,\n      ip: row.ip,\n      rawUserAgent: row.rawUserAgent,\n      status: row.status,\n      ipProvenance: row.ipProvenance\n    })) : group.occurrences;\n    output.append((i ? \",\" : \"\") + JSON.stringify({ ...group, finding: assessmentFinding(group.result), occurrences, result: {\n      ...result,\n      clientRef: references[i].clientRef,\n      infrastructure: {\n        ...infra,\n        sourceStatesRef: \"dataset.sourceStates\",\n        observedMatchRefs: references[i].observedMatchRefs,\n        currentMatchRefs: references[i].currentMatchRefs\n      },\n      assessment: verdict\n    } }));\n    if ((i + 1) % 100 === 0) progress({ stage: \"export\", completed: i + 1, total: selection.groups.length });\n  }\n  output.append('],\"invalidRows\":' + JSON.stringify(selection.invalidRows) + \"}\\n\");\n  return output.finish();\n}\nasync function createExport(report, dataset, options = {}, progress = () => {\n}) {\n  if (!report) throw new Error(\"Analyze input before exporting.\");\n  const now = options.now ?? Date.now(), format = options.format ?? \"json\";\n  const selection = reportSelection(report, { scope: format === \"shortlist\" ? \"shortlist\" : options.scope, ids: options.ids }, { now });\n  if ([\"selected\", \"filtered\"].includes(selection.scope) && !selection.groups.length && !selection.invalidRows.length) throw new Error(\"No results in this export scope. Select results or clear the filters.\");\n  const digest = dataset?.manifest ? await sha256(JSON.stringify(dataset.manifest)) : null;\n  const maxBytes = options.maxBytes ?? MAX_EXPORT_BYTES;\n  if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > MAX_EXPORT_BYTES) throw new Error(\"Invalid export size limit.\");\n  if (format === \"csv\") return { format, filename: \"crawler-results.csv\", ...csv(report, selection, dataset, digest, maxBytes, progress), scope: selection.scope };\n  if (format === \"json\" || format === \"shortlist\") return {\n    format,\n    filename: format === \"shortlist\" ? \"crawler-investigation-shortlist.json\" : \"crawler-results.json\",\n    ...json(report, selection, dataset, digest, now, maxBytes, progress, format === \"shortlist\" ? \"crawler-investigation-shortlist\" : void 0),\n    scope: selection.scope,\n    groups: selection.groups.length\n  };\n  if (format === \"candidates\") {\n    const candidates = selectedCandidates(selection);\n    if (!candidates.ips.length) throw new Error(\"Select at least one public IP. Invalid/nonpublic rows are excluded from candidate lists.\");\n    const output = writer(\"text/plain;charset=utf-8\", maxBytes);\n    output.append(OPERATIONAL_WARNINGS.map((warning) => `# ${warning}`).join(\"\\n\") + `\n# Unique selected IPs: ${candidates.ips.length}; excluded rows/groups: ${candidates.excluded.length}\n`);\n    for (const ip of candidates.ips) output.append(ip + \"\\n\");\n    return {\n      format,\n      filename: \"crawler-candidate-ips-review.txt\",\n      ...output.finish(),\n      scope: selection.scope,\n      groups: selection.groups.length,\n      candidateIPs: candidates.ips.length,\n      excluded: candidates.excluded\n    };\n  }\n  throw new Error(\"Choose CSV, JSON or selected IPs.\");\n}\n\n// web/src/bulk/worker.js\nvar datasetClient;\nvar datasetOrigin;\nvar activeReport = null;\nvar activeDataset = null;\nasync function loadDataset(data) {\n  if (!data.datasetOrigin) return { status: \"unavailable\", snapshots: [], error: \"dataset-not-configured\", manifest: null };\n  if (data.datasetOrigin !== datasetOrigin) {\n    datasetClient = createDatasetClient({ baseUrl: data.datasetOrigin, cache: browserDatasetCache(data.datasetOrigin) });\n    datasetOrigin = data.datasetOrigin;\n  }\n  return datasetClient.load({ refresh: data.refresh === true });\n}\nfunction describeDataset(dataset, states) {\n  states ??= new IdentityVerifier({ snapshots: dataset.snapshots }).analyze({ ip: \"\" }).infrastructure.sourceStates;\n  return {\n    status: dataset.status,\n    error: dataset.error,\n    manifest: dataset.manifest,\n    persistence: dataset.persistence ?? \"none\",\n    evaluatedAt: (/* @__PURE__ */ new Date()).toISOString(),\n    sourceStates: states\n  };\n}\nself.onmessage = async ({ data }) => {\n  const { id, type, options = {} } = data;\n  try {\n    if (type === \"export\") {\n      const output = await createExport(activeReport, activeDataset, data.options, (progress) => {\n        self.postMessage({ id, type: \"progress\", progress });\n      });\n      self.postMessage({ id, type: \"export\", output });\n      return;\n    }\n    activeReport = null;\n    activeDataset = null;\n    if (type === \"dataset\") {\n      const dataset = await loadDataset(data);\n      self.postMessage({ id, type: \"dataset\", dataset: describeDataset(dataset) });\n      return;\n    }\n    const text = data.file ? await readInputFile(data.file, options.limits) : data.text;\n    if (type === \"inspect\") {\n      self.postMessage({ id, type: \"inspection\", inspection: describeInput(prepareInput(text, options)) });\n    } else if (type === \"analyze\") {\n      self.postMessage({ id, type: \"progress\", progress: { stage: \"dataset\", completed: 0, total: 1 } });\n      const dataset = await loadDataset(data);\n      const report = analyzeInput({ text, options, snapshots: dataset.snapshots }, (progress) => {\n        self.postMessage({ id, type: \"progress\", progress });\n      });\n      activeReport = report;\n      activeDataset = describeDataset(dataset, report.groups[0]?.result.infrastructure.sourceStates);\n      self.postMessage({ id, type: \"result\", report, dataset: activeDataset });\n    } else throw new Error(\"Unknown background operation.\");\n  } catch (error) {\n    self.postMessage({ id, type: \"error\", error: {\n      code: error.code ?? \"analysis-failed\",\n      message: error.message,\n      reference: error.reference ?? null\n    } });\n  }\n};\n";
var worker;
var workerURL;
var requestId = 0;
var inspection = null;
var selectedFile = null;
var busy = false;
var report2 = null;
var activeOperation = null;
var exportView;
var analyzeAfterInspection = false;
var resultsView = createResultsView(() => {
  exportView?.setReady(Boolean(report2 && worker));
});
var dnsView = createDNSView({ selectedIPs: () => resultsView.selectedIPs(), baseUrl: datasetOrigin });
exportView = createExportView({ scope: (value) => resultsView.exportScope(value), request: startExport });
var mappingNames = { ip: "Client IP", userAgent: "User-Agent", status: "HTTP status / edge response" };
function clearWorker() {
  worker?.terminate();
  worker = null;
  if (workerURL) URL.revokeObjectURL(workerURL);
  workerURL = null;
  requestId++;
}
function setSettingsOpen(open2) {
  $3("import-settings").hidden = !open2;
  $3("settings-toggle").setAttribute("aria-expanded", String(open2));
}
$3("settings-toggle").addEventListener("click", () => setSettingsOpen($3("import-settings").hidden));
function showError(message) {
  $3("error").textContent = message;
  $3("error").hidden = !message;
}
function setBusy(value) {
  busy = value;
  window.dispatchEvent(new CustomEvent("verifier-busy", { detail: value }));
  exportView.setBusy(value);
  for (const id of ["example", "format", "header", "refresh-dataset"]) $3(id).disabled = value;
  $3("analyze").disabled = value;
  for (const control of $3("mapping-panel").querySelectorAll("select")) control.disabled = value;
  $3("cancel").hidden = !value;
  $3("analyze").textContent = value ? "Cooking..." : "Analyze Locally";
  $3("analyze").setAttribute("aria-busy", String(value));
}
function invalidate() {
  dnsView.reset();
  clearWorker();
  setBusy(false);
  inspection = null;
  report2 = null;
  analyzeAfterInspection = false;
  resultsView.clear();
  $3("input-evidence").hidden = true;
  $3("results").hidden = true;
  $3("mapping-panel").hidden = true;
  $3("trust-panel").hidden = true;
  $3("summary-details").hidden = true;
  $3("summary-content").hidden = true;
  $3("bulk-overview").hidden = true;
  $3("summary-empty").hidden = false;
  $3("summary-lead").hidden = false;
  $3("trust-forwarded").checked = false;
  $3("analyze").disabled = false;
  showError("");
  $3("status").textContent = "Ready to analyze";
}
function options() {
  const settings = { profile: "ip-ua-only", format: $3("format").value, mode: "ip-ua", trustForwarded: $3("trust-forwarded").checked };
  if (inspection && ["csv", "tsv", "json", "jsonl"].includes(inspection.format)) {
    settings.format = inspection.format;
    if (["csv", "tsv"].includes(inspection.format)) settings.header = $3("header").checked;
    settings.mapping = Object.fromEntries(SIMPLE_FIELDS.map((field) => {
      const value = $3(`map-${field}`).value;
      return [field, value === "" ? null : Number(value)];
    }));
  }
  return settings;
}
function updateTrust() {
  const value = $3("map-ip")?.value;
  const needed = value !== void 0 && value !== "" && forwardedColumn(inspection.headers[Number(value)]);
  $3("trust-panel").hidden = !needed;
  if (!needed) $3("trust-forwarded").checked = false;
  else setSettingsOpen(true);
}
function updateImportEvidence() {
  const tabular = inspection && ["csv", "tsv", "json", "jsonl"].includes(inspection.format);
  const ua = $3("map-userAgent")?.value;
  const http = $3("map-status")?.value;
  const userAgent = !tabular || ua === "" ? "not supplied" : Number(ua) === inspection.mapping.userAgent && !inspection.userAgentValuesPresent ? "empty column" : "supplied";
  const httpField = tabular && http !== "" ? inspection.headers[Number(http)] : "not supplied";
  $3("input-evidence").textContent = `User-Agent: ${userAgent} \xB7 HTTP status: ${httpField}`;
  $3("input-evidence").hidden = false;
}
function mapColumns(value) {
  $3("mapping").replaceChildren();
  $3("http-mapping").replaceChildren();
  $3("header").checked = value.hasHeader;
  const tabular = ["csv", "tsv", "json", "jsonl"].includes(value.format);
  $3("mapping-panel").hidden = !tabular;
  $3("header").closest(".check").hidden = ["json", "jsonl"].includes(value.format);
  if (tabular && value.mapping.ip === null) setSettingsOpen(true);
  if (!tabular) {
    updateImportEvidence();
    return;
  }
  for (const field of SIMPLE_FIELDS) {
    const container = document.createElement("div"), label = document.createElement("label"), select = document.createElement("select");
    label.htmlFor = select.id = `map-${field}`;
    label.textContent = mappingNames[field];
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = field === "ip" ? "Choose client IP column" : "Not supplied";
    select.append(empty);
    value.headers.forEach((header, index2) => {
      const option = document.createElement("option");
      option.value = String(index2);
      option.textContent = `${index2 + 1}: ${header}`;
      select.append(option);
    });
    select.value = value.mapping[field] === null ? "" : String(value.mapping[field]);
    select.addEventListener("change", () => {
      report2 = null;
      resultsView.clear();
      $3("results").hidden = true;
      $3("summary-details").hidden = true;
      $3("summary-content").hidden = true;
      $3("bulk-overview").hidden = true;
      $3("summary-empty").hidden = false;
      $3("summary-lead").hidden = false;
      dnsView.reset();
      updateTrust();
      updateImportEvidence();
    });
    container.append(label, select);
    $3(field === "status" ? "http-mapping" : "mapping").append(container);
  }
  $3("preview").textContent = value.preview.map((row) => `Line ${row.lineStart}: ${JSON.stringify(row.fields)}`).join("\n");
  updateTrust();
  updateImportEvidence();
}
function definitionList(element, values) {
  element.replaceChildren();
  for (const [label, value] of Object.entries(values)) {
    const dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value === null ? "Not established" : Number(value).toLocaleString();
    element.append(dt, dd);
  }
}
function displayResult(value, dataset) {
  report2 = value;
  const s = value.summary;
  const finding = summarizeFindings(value, dataset);
  const showFinding = finding.single || !value.groups.length;
  $3("finding-title").textContent = showFinding ? finding.title : "";
  $3("finding-title").className = finding.badgeStatus ? assessmentBadgeClass(finding.badgeStatus) : "";
  $3("summary-lead").hidden = true;
  $3("finding-description").textContent = showFinding ? finding.description : "";
  $3("finding-title").hidden = !showFinding;
  $3("finding-description").hidden = !showFinding;
  $3("bulk-overview").hidden = s.originalRows <= 1;
  definitionList($3("bulk-counts"), { "Rows": s.originalRows, "Unique IPs": s.uniqueIPs });
  $3("top-claims").replaceChildren();
  for (const claim of finding.topClaims) {
    const li = document.createElement("li"), logo = providerLogo(claim.providerId);
    if (logo) li.append(logo);
    li.append(`${claim.name}: ${claim.count.toLocaleString()}`);
    $3("top-claims").append(li);
  }
  $3("claims-empty").hidden = finding.topClaims.length > 0;
  $3("finding-ip").hidden = true;
  const providerLine = $3("finding-provider");
  providerLine.replaceChildren();
  if (finding.providers.length) {
    providerLine.append(`${finding.ip} ${finding.currentProvider ? "belongs to" : "was previously listed by"} `);
    finding.providers.forEach((provider, index2) => {
      if (index2) providerLine.append(", ");
      const mark = document.createElement("span");
      mark.className = "provider-mark";
      const logo = providerLogo(provider.id);
      if (logo) mark.append(logo);
      mark.append(provider.name);
      providerLine.append(mark);
    });
    providerLine.append(".");
  } else providerLine.textContent = `No published provider established for ${finding.ip}.`;
  $3("finding-provider").hidden = !finding.single;
  $3("finding-category").textContent = `${finding.currentProvider ? "Identified as" : "Previously listed as"} ${finding.categories.join(", ")}.`;
  $3("finding-category").hidden = !finding.single || !finding.categories.length;
  const singleInput = s.uniqueIPs === 1 && s.invalidRows === 0;
  document.querySelector(".summary-side").hidden = singleInput;
  $3("summary-details").open = s.parsedRows === 0;
  definitionList($3("summary"), {
    "Original data rows": s.originalRows,
    "Parsed valid rows": s.parsedRows,
    "Invalid rows": s.invalidRows,
    "Unique normalized IPs": s.uniqueIPs,
    "Unique IP/User-Agent groups": s.uniqueIPUserAgentGroups,
    "Result groups": s.resultGroups,
    "Repeated entries": s.omittedDuplicateRows
  });
  const findingCounts = {};
  for (const group of value.groups) {
    const id = assessmentFinding(group.result).id;
    findingCounts[id] = (findingCounts[id] ?? 0) + 1;
  }
  if (s.invalidRows) findingCounts["invalid-input"] = s.invalidRows;
  definitionList($3("assessments"), Object.fromEntries(Object.entries(findingCounts).map(([id, count]) => [FINDING_LABELS[id], count])));
  $3("invalid-note").textContent = s.invalidRows ? `${s.invalidRows} invalid rows were excluded from matching. The first five errors appear below; all invalid rows remain in the local report.` : "No invalid rows.";
  $3("invalid-preview").textContent = value.invalidRows.slice(0, 5).map((row) => `Line ${row.reference.lineStart}: ${row.message}
${row.rawRecord.slice(0, 160)}`).join("\n");
  $3("invalid-preview").hidden = !s.invalidRows;
  $3("results").hidden = false;
  $3("summary-empty").hidden = true;
  $3("summary-content").hidden = false;
  renderDataset(dataset);
  resultsView.show(value);
  const current = dataset.sourceStates.filter((source) => source.current).length;
  $3("verification-note").textContent = !s.parsedRows ? "No valid input rows were available for infrastructure verification. Inspect the invalid rows below." : dataset.status === "cached" ? "Using a validated cached dataset after a download failure. Evidence is noncurrent; current verification is incomplete." : current < dataset.sourceStates.length ? `Verification is incomplete: ${current} of ${dataset.sourceStates.length} sources are current. Missing, stale or failed sources cannot justify a negative result.` : "Analysis uses current validated source observations. Published coverage and individual request identity still have the limitations shown in Details.";
  $3("analysis-time").textContent = `Evidence assessed ${new Date(value.analyzedAt).toLocaleString(void 0, { timeZoneName: "short" })}. Reload the published dataset and re-analyze to update this assessment.${value.groups.some((group) => group.result.client.category === "missing") ? " Some groups have no User-Agent; no client identity can be inferred from that omission." : ""}`;
  $3("status").textContent = `Completed locally. ${finding.single ? "The finding is ready above." : "Review the traffic results."}`;
  (singleInput ? $3("report-title") : $3("results-title")).focus();
}
function getWorker() {
  if (worker) return worker;
  workerURL = URL.createObjectURL(new Blob([workerSource], { type: "text/javascript" }));
  worker = new Worker(workerURL, { type: "module" });
  worker.onmessage = ({ data }) => {
    if (data.id !== requestId) return;
    if (data.type === "progress") {
      $3("status").textContent = `${data.progress.stage}: ${data.progress.completed.toLocaleString()} / ${data.progress.total.toLocaleString()}`;
      return;
    }
    setBusy(false);
    if (data.type === "error") {
      analyzeAfterInspection = false;
      showError(`${data.error.message}${data.error.reference ? ` (line ${data.error.reference.lineStart ?? data.error.reference.line ?? "?"})` : ""}`);
      if (activeOperation === "export") {
        exportView.error(data.error.message);
        $3("status").textContent = "Export stopped; no partial download was created. The existing analysis is unchanged.";
      } else $3("status").textContent = "Processing stopped. Correct the input or reduce its size; no partial result was published.";
    } else if (data.type === "inspection") {
      if (!data.inspection.records) {
        inspection = null;
        $3("analyze").disabled = false;
        analyzeAfterInspection = false;
        showError("Enter at least one address or data record.");
        $3("status").textContent = "No input records found.";
        return;
      }
      inspection = data.inspection;
      mapColumns(inspection);
      $3("analyze").disabled = false;
      $3("status").textContent = `Detected ${inspection.format}: ${inspection.records.toLocaleString()} records. Ready to analyze.`;
      if (analyzeAfterInspection) {
        analyzeAfterInspection = false;
        if (["csv", "tsv", "json", "jsonl"].includes(inspection.format) && inspection.mapping.ip === null) {
          $3("status").textContent = "Choose the client IP column, then Analyze Locally.";
          $3("map-ip").focus();
        } else {
          start2("analyze");
          return;
        }
      }
    } else if (data.type === "result") displayResult(data.report, data.dataset);
    else if (data.type === "dataset") {
      renderDataset(data.dataset);
      $3("status").textContent = `Published dataset reload complete: ${data.dataset.status}. Analyze input to create a new assessment.`;
    } else if (data.type === "export") {
      exportView.receive(data.output);
      $3("status").textContent = "Export generated locally. No input or draft was sent to Cloudflare.";
    }
    activeOperation = null;
  };
  worker.onerror = () => {
    clearWorker();
    setBusy(false);
    exportView.setReady(false);
    showError("The background worker failed. Re-analyze input before exporting, or reduce the input size.");
  };
  return worker;
}
function start2(type, overrides = {}) {
  dnsView.reset();
  activeOperation = type;
  showError("");
  report2 = null;
  resultsView.clear();
  $3("results").hidden = true;
  $3("summary-details").hidden = true;
  $3("summary-content").hidden = true;
  $3("bulk-overview").hidden = true;
  $3("summary-empty").hidden = false;
  $3("summary-lead").hidden = false;
  const settings = type === "inspect" ? { profile: "ip-ua-only", format: $3("format").value, ...overrides } : options();
  setBusy(true);
  $3("status").textContent = type === "dataset" ? "Downloading public dataset\u2026" : "Processing locally\u2026";
  try {
    getWorker().postMessage({
      id: ++requestId,
      type,
      options: settings,
      datasetOrigin,
      ...type === "dataset" ? { refresh: true } : selectedFile ? { file: selectedFile } : { text: $3("input").value }
    });
  } catch {
    clearWorker();
    setBusy(false);
    showError("A background worker could not start. Use a browser supporting Web Workers.");
  }
}
function startExport(settings) {
  if (!report2 || busy || !worker) return;
  activeOperation = "export";
  showError("");
  setBusy(true);
  $3("export-status").textContent = "Generating locally in the background worker\u2026";
  worker.postMessage({ id: ++requestId, type: "export", options: settings });
}
$3("analyze").addEventListener("click", () => {
  if (!inspection) {
    analyzeAfterInspection = true;
    start2("inspect");
  } else start2("analyze");
});
$3("refresh-dataset").addEventListener("click", () => start2("dataset"));
$3("cancel").addEventListener("click", () => {
  clearWorker();
  setBusy(false);
  report2 = null;
  resultsView.clear();
  $3("results").hidden = true;
  $3("status").textContent = "Processing canceled. No partial result was published.";
});
$3("input").addEventListener("input", () => {
  selectedFile = null;
  $3("file").value = "";
  $3("file-name").textContent = "Using pasted input.";
  $3("file-name").hidden = false;
  invalidate();
});
$3("input").addEventListener("paste", (event) => {
  const text = event.clipboardData?.getData("text/plain");
  if (!text || text.length <= 1e4) return;
  event.preventDefault();
  const input = $3("input"), start3 = input.selectionStart, end = input.selectionEnd;
  input.value = input.value.slice(0, start3) + text + input.value.slice(end);
  input.setSelectionRange(start3 + text.length, start3 + text.length);
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
$3("format").addEventListener("change", invalidate);
$3("header").addEventListener("change", () => {
  const header = $3("header").checked;
  start2("inspect", { header });
});
function selectFiles(files) {
  invalidate();
  selectedFile = null;
  if (files.length !== 1) {
    showError("Select one file per analysis.");
    return;
  }
  $3("file-name").hidden = false;
  selectedFile = files[0];
  $3("input").value = "";
  $3("file-name").textContent = `${selectedFile.name} \xB7 ${Math.max(1, Math.round(selectedFile.size / 1024)).toLocaleString()} KB`;
  start2("inspect");
}
$3("file").addEventListener("change", () => {
  if ($3("file").files.length) selectFiles($3("file").files);
});
$3("drop-zone").addEventListener("click", () => $3("file").click());
$3("drop-zone").addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    $3("file").click();
  }
});
for (const event of ["dragover", "dragleave", "drop"]) $3("drop-zone").addEventListener(event, (e) => {
  e.preventDefault();
  $3("drop-zone").dataset.drag = event === "dragover" ? "true" : "false";
  if (event === "drop") selectFiles(e.dataTransfer.files);
});
$3("example").addEventListener("click", () => {
  selectedFile = null;
  $3("file").value = "";
  $3("input").value = crawler_import_default;
  $3("format").value = "auto";
  $3("file-name").hidden = false;
  $3("file-name").textContent = "Using example data; examples include a published crawler IP and an unconfirmed address.";
  invalidate();
  start2("inspect");
});
$3("reset").addEventListener("click", () => {
  invalidate();
  selectedFile = null;
  $3("input").value = "";
  $3("file").value = "";
  $3("format").value = "auto";
  $3("file-name").textContent = "";
  $3("file-name").hidden = true;
  $3("input").focus();
});
for (const [id, content, mime] of [["csv-template", crawler_import_default, "text/csv"]]) {
  $3(id).href = URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` }));
}
Object.defineProperty(window, "crawlerImport", { value: Object.freeze({ getReport: () => report2 }) });
window.addEventListener("pagehide", clearWorker);
