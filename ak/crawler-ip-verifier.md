---
title: "Crawler IP Verifier — Technical Reference"
description: "Technical Markdown alternate covering crawler IP-range matching, user-agent claims, findings, source health, optional DNS verification, input limits and exports."
author: "Alexander Kyriakou"
canonical_url: "https://alexanderkyriakou.eu/ak/crawler-ip-verifier"
markdown_url: "https://alexanderkyriakou.eu/ak/crawler-ip-verifier.md"
date_published: "2026-10-26"
date_modified: "2026-10-26"
language: "en"
---

# Crawler IP Verifier

A browser-based tool by [Alexander Kyriakou](https://alexanderkyriakou.eu/) for comparing IPv4 and IPv6 addresses and declared crawler identities with published crawler IP ranges. Optional DNS checks provide separate, current provider evidence for selected public IPs.

- [Interactive tool and accompanying guide](https://alexanderkyriakou.eu/ak/crawler-ip-verifier)
- [Markdown alternate](https://alexanderkyriakou.eu/ak/crawler-ip-verifier.md)
- [Companion robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker)
- [Contact the author](https://alexanderkyriakou.eu/contact)

This document describes the implementation and guide as of October 26, 2026. It is a technical alternate of the page, not a live range dataset, an analysis report or an API specification. Consult the tool's source-health panel and result evidence for the data used in a particular analysis.

## Purpose and evidence boundaries

A user-agent is a client-supplied claim. A published range match is infrastructure evidence. A forward-confirmed hostname beneath a documented provider domain can supply additional DNS evidence. These observations are related but not interchangeable.

The verifier supports focused identity investigations, including individual addresses and bounded batches extracted from logs. It is not a general-purpose log-analysis platform, a firewall, a behavioural risk scorer or a request-authentication system.

A result does not establish:

- Whether a request was benign, useful or permitted by the site's policy.
- That a browser-like header came from a human.
- That an unverified claim is an impersonator.
- That a provider-associated address identifies a specific crawler when the source covers shared infrastructure.
- Historical range membership or historical DNS for an old request.
- Whether a fetched page was indexed, or what a client subsequently did with its content.

No WHOIS or ASN attribution is performed. **None established** in the provider column means no provider was established through the included range evidence; it does not mean the address has no network operator.

## Processing and privacy

Ordinary analysis processes the imported records locally in the browser. The browser downloads the shared public crawler dataset. It does not upload the input file, user-agents or full records for range matching.

The frontend includes a browser worker for importing, analysis and export generation. Filtering and presentation operate on the resulting local report. Pagination reduces displayed rows; it does not remove retained occurrences from memory.

Validated public datasets may be cached locally for reuse. Imported traffic is not written into that dataset cache. Optional DNS is a separate, explicitly acknowledged operation: selected IPs are sent to the lookup service and Cloudflare DNS. DNS observations may be held in a short-lived shared server cache.

Downloaded reports may contain private original input. Treat them with the same care as the source logs.

## Input contract

### Supported formats

| Format | Accepted structure |
| --- | --- |
| TXT | One IP address per nonblank line. |
| CSV / TSV | Delimited records with configurable header handling and column mapping. |
| JSON | One object, an array of objects, or an array of IP strings. |
| JSONL / NDJSON | One complete supported record per line. |

Files must contain UTF-8 text. Format detection examines content, not just the filename. Explicit format selection is available in import settings.

Mapped JSON fields must be top-level properties. Nested context can remain in the original record, but nested IP fields are not automatically flattened. A JSON collection mixing object and string records is unsupported.

Raw Apache or nginx combined-log text must first be converted to a supported structured format. Compressed exports must be decompressed before import. Splitting access-log lines on spaces is not a reliable conversion method because request lines and user-agents can contain spaces and quoted content.

### Fields

| Field | Role |
| --- | --- |
| Client IP | Required. One complete IPv4 or IPv6 literal per record. |
| Full user-agent | Optional. Enables interpretation of declared crawler identities. |
| HTTP response status | Optional. Adds grouping, display and filtering context. |
| Time, path, method, host and other context | Preserved in original records when supplied; available for manual investigation. Not a behavioural classification input. |

Cloudflare field names such as `ClientIP`, `ClientRequestUserAgent` and `EdgeResponseStatus` are recognised regardless of capitalisation. Inspect the actual mapping before analysis. `EdgeResponseStatus` and `OriginResponseStatus` describe different observation points.

An example CSV structure:

```csv
ip,user_agent,http_status
66.249.66.1,"Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",200
```

This is a formatting example, not a captured request or a guarantee of a future finding.

### Limits

| Constraint | Maximum |
| --- | --- |
| Input | 10 MiB of UTF-8 text; one file per analysis |
| Data records | 20,000 |
| Distinct normalised IPs | 10,000 |
| User-agent length | 8,192 JavaScript string code units |
| Record length | 32,768 JavaScript string code units |
| Columns / top-level fields | 64 |
| JSON nesting | Depth 64 or greater is rejected |
| Generated export | 64 MiB |

MiB means 1,048,576 bytes. JavaScript string length counts UTF-16 code units; some characters use two units.

Oversized input is rejected rather than silently truncated. A structural parse failure stops the import. Individual invalid address records in an otherwise parseable input remain available with their error and original record. Oversized exports stop without a partial download; use a smaller scope.

### Client-IP provenance

Behind a CDN or reverse proxy, the network peer in an origin log may be the intermediary rather than the original client. Select the address field whose provenance you have checked against the trusted-proxy configuration.

The forwarded-IP acknowledgement records the user's review; the tool does not audit that configuration. A familiar forwarded-header name is not itself evidence of trust. The importer expects one address and does not select a client from an `X-Forwarded-For` chain.

For large logs, extract the relevant time window and fields first. Deduplicating by IP alone can hide different user-agents. Deduplicating by IP, full user-agent and response status reduces identity checks but loses repeated observations and possibly paths and timestamps. A retained `count` field does not reconstruct those discarded occurrences in the page's input-entry totals.

## Address and user-agent interpretation

### Addresses

Addresses are normalised for comparison while original input values remain inspectable. Inputs must be individual IP literals, without a URL scheme, port, CIDR suffix or IPv6 zone identifier. IPv4 shorthand and leading-zero forms are rejected rather than interpreted ambiguously.

CIDR matching compares address bits, not text prefixes. Publishers supply CIDR ranges; users supply addresses. All relevant overlapping range observations are retained.

IPv4 and IPv6 coverage are evaluated separately. An IPv4-only source does not establish IPv6 coverage. IPv4-mapped IPv6 inputs retain their IPv6 representation and record when a match uses the embedded IPv4 address; they are not silently merged with native IPv4 inputs.

Bundled IANA special-purpose classifications determine matching eligibility. A special-purpose assignment is not automatically excluded: eligibility depends on the assignment. Absence from the special-purpose registry does not prove routability or ownership.

### User-agents

The parser preserves the raw header and interprets recognised crawler claims, product versions, advertised browser and platform components, and automation libraries. A crawler name appearing only inside a supplied URL is not treated as an identity claim. Multiple recognised claims remain ambiguous rather than being resolved by arbitrarily choosing one.

The client-interpretation labels are:

- Recognized crawler claim
- Other crawler claim
- Browser-like
- Automation-like
- Unknown client
- Missing User-Agent
- Malformed User-Agent

Invalid records use **Not parsed** in the results model. These labels are searchable. They describe the supplied text, not verified intent or human activity.

## Published-range coverage

The included registry contains 21 feeds from 11 providers. This is the version's configured scope, not a guarantee that every source is currently available or that the lists cover all traffic from each operator.

| Provider | Included scope |
| --- | --- |
| Google | Five categories: common crawlers, special crawlers, customer-platform fetchers, Google-controlled fetchers and user-triggered agents. |
| Microsoft Bing | Bingbot ranges. |
| OpenAI | Separate GPTBot, OAI-SearchBot, ChatGPT-User and OAI-AdsBot feeds. |
| Anthropic | Shared infrastructure for the registered Claude crawler claims. |
| Ahrefs | Shared ranges associated with AhrefsBot and AhrefsSiteAudit. |
| DuckDuckGo | DuckDuckBot and DuckAssistBot feeds. |
| Common Crawl | CCBot open-web-crawl ranges. |
| Perplexity | PerplexityBot and Perplexity-User feeds. |
| Apple | Applebot infrastructure. |
| Mistral | MistralAI-User and MistralAI-Index feeds. |
| Kimi / Moonshot AI | Shared published infrastructure; does not establish a specific registered HTTP crawler identity in this tool. |

Purpose categories describe registered claims or feed scope, including web indexing, AI search, potential training collection, user-triggered retrieval, SEO analysis, advertising, site verification, link previews and open web data. They do not establish the downstream use of an individual request.

Yandex is supported separately by the DNS service; it is not one of the 11 range providers.

## Source freshness and historical limitations

Publisher retrieval is scheduled daily. Feeds are validated before publication. A failed refresh can leave previous validated ranges available as noncurrent evidence.

**Fresh** means the feed passed the tool's validation checks, remains within its configured freshness interval and has no disqualifying refresh or timestamp error. Freshness does not establish completeness of a publisher's list.

**Reload published dataset** checks the saved dataset served to the page. It does not trigger direct retrieval from every publisher or repair a failed refresh. Analyze again to apply the newly loaded evidence. The latest retrieval timestamp for the dataset does not imply that every feed refreshed successfully at that time.

A retained browser dataset can be used as explicitly noncurrent fallback evidence when the service is unavailable. Inspect health per applicable source, rather than assuming that a loaded dataset is wholly current.

Current ranges cannot prove membership at the time of an old log entry. The tool has no historical ownership archive or historical DNS reconstruction. Preserve assessment times, source versions and the original records when documenting an investigation.

## Findings and their exact meaning

Public findings are a presentation layer over the detailed assessment. They appear in results, summaries and exports. The updated browser and embedded export worker use the same finding logic.

| Public finding | Identifier | Meaning |
| --- | --- | --- |
| Official infrastructure match | `official-infrastructure-match` | A qualifying positive assessment has at least one current published range match. Shared or category ranges can leave the exact crawler unresolved. |
| Unverified crawler claim | `unverified-crawler-claim` | At least one recognised crawler claim exists, no published range match was observed, and the input is not classified as invalid or nonpublic/special-use. |
| Could not verify | `could-not-verify` | Evidence does not support a stronger public finding. Examples include only noncurrent observed matches, ambiguous or unsupported identity assessment despite observed infrastructure, or insufficient source availability. |
| No published range match | `no-published-range-match` | No observed match, no recognised claim triggering the unverified label, and the remaining assessment is not inconclusive; at least one source is current. This does not assert complete coverage. |
| Nonpublic / special-use IP | `invalid-nonpublic` | The parsed address is excluded from ordinary public matching by its classification. |
| Invalid input | `invalid-input` | No usable address assessment was performed for the record. |

### Unverified crawler claim

The important condition is **no observed range match**, not merely no current match. The provider column uses observed matches, including noncurrent ones. A stale observed provider therefore remains visible and normally leads to **Could not verify**, rather than **Unverified crawler claim**.

The unverified finding can occur both when current applicable data contains no match and when the required data is incomplete or unavailable. The detailed assessment and source health preserve those reasons. The light orange badge marks an evidence gap, not a risk score or blocking recommendation.

A recognised claim on another provider's observed infrastructure does not satisfy the no-observed-provider condition. Review the declared identity, observed provider, scope and detailed explanation together.

### Underlying statuses and disabled mismatch verdicts

Detailed assessment statuses include `claim-consistent`, `provider-identified`, `official-infrastructure-match`, `inconclusive`, client-category outcomes and invalid-address outcomes. A public `unverified-crawler-claim` finding can accompany an underlying `inconclusive` assessment. Those fields answer different questions and are not contradictory.

The engine retains `claimed-identity-mismatch`, but the supplied registry disables negative verification for every source. Consequently, that status cannot be produced by the normal current configuration. It would require explicitly reviewed, complete identity/address-family coverage and qualifying current evidence. A simple range nonmatch must not be converted into that status.

The legacy mismatch finding is retained defensively and appears in the finding selector only if present in actual results. The ordinary investigation view now selects **Unverified crawler claim**.

## Grouping, counts, search and filters

Results group records by **normalised IP + exact user-agent + mapped HTTP status**. Different paths or timestamps may occur within one group. Original occurrences remain accessible through Details.

- **Input entries** counts imported occurrences in a group, including repeats.
- **Result groups** counts grouped table rows.
- **Distinct IPs** counts normalised addresses; it is not a visitor count.
- **Top claimed crawlers** counts claims across imported rows. A row with multiple distinct claims can contribute to several claim totals.

Counts describe the imported data, not necessarily total requests in the original logging system. Sampling, aggregation and preprocessing affect what they represent. Invalid records are not counted by the pagination input-entry counter.

Search is case-insensitive and supports partial matches across addresses, raw user-agent text, client-interpretation labels, recognised claims, observed providers, matched CIDRs, purpose values, finding labels and response status. It does not search every arbitrary field preserved inside valid original records. Use Details for paths and other retained context.

Filters combine finding, published provider, crawler claim, HTTP status when mapped, purpose, user-agent type, address family, applicable source health and investigation view. Sort by input order, numeric IP, finding, repeated entries or user-agent type in either direction.

Pagination offers 25, 50 or 100 result rows. With multiple filtered pages, the entries counter shows the current page's imported entries against all matching entries. With one filtered page, it shows the matching total. It is hidden when that total is zero or one.

Select all filtered results applies across pages. Selected groups include all their occurrences, and selections remain selected when later filters hide them. Clearing filters and clearing selections are separate operations.

HTTP codes `100`–`599` are retained; `0` means no response was recorded in the selected field. Missing and unrecognised status values are distinguished. An unusable status value does not invalidate an otherwise usable IP. Response status provides context, not authentication.

## Optional DNS investigation

Select up to five distinct eligible public IPs and acknowledge sharing before using **Check selected IPs**. Ordinary range analysis does not trigger DNS lookups.

The service:

1. Queries PTR records for the submitted address.
2. Checks candidate hostnames against documented provider suffixes at domain-label boundaries.
3. Resolves the hostname forward and checks whether the returned addresses include the submitted IP.

Provider attribution requires a supported suffix and forward confirmation. A name such as `googlebot.com.attacker.example` does not qualify. A forward-confirmed hostname under an unrelated domain does not verify Googlebot.

| Provider | Supported hostname endings | Scope |
| --- | --- | --- |
| Google | `.googlebot.com`, `.google.com`, `.googleusercontent.com` | Scope varies. Google-hosted customer fetching must not be equated with Googlebot. |
| Microsoft Bing | `.search.msn.com` | Bing crawler infrastructure. |
| Apple | `.applebot.apple.com` | Applebot infrastructure; subtype unresolved. |
| Ahrefs | `.ahrefs.com`, `.ahrefs.net` | Ahrefs infrastructure; subtype unresolved. |
| Common Crawl | `.crawl.commoncrawl.org` | IPv4 only. |
| Yandex | `.yandex.ru`, `.yandex.net`, `.yandex.com` | DNS-only coverage, separate from the range registry. |

At most three distinct valid PTR hostnames are checked per IP. Additional unchecked hostnames are reported. No PTR record, failed forward confirmation and resolver failure are different outcomes. DNS can succeed without identifying a supported crawler provider.

Private/special-use addresses and IPv4-mapped IPv6 selections are ineligible for this DNS action. Checks run sequentially; a service limit, timeout or resolver error can stop later submissions while completed results remain visible.

### Limits and caching

- Five new IP checks per minute and 500 per day, shared across visitors.
- Unexpired cache hits do not consume a new lookup allowance.
- An accepted attempt can consume allowance even if it subsequently fails.
- Confirmed observations are cached for up to one hour, bounded by DNS lifetimes.
- Missing-PTR and unconfirmed results can be cached for up to one minute.
- Resolver errors are not cached.

Only selected IPs go to the lookup Worker and Cloudflare DNS; files, user-agents and full records remain local. The displayed observation time distinguishes cached evidence from a new lookup.

DNS findings remain separate from published-range findings, provider filters and analysis exports. They do not authenticate an individual request or establish its intent.

### Manual checks

Windows:

```text
nslookup IP_ADDRESS
nslookup RETURNED_HOSTNAME
```

Linux, with `host` installed:

```text
host IP_ADDRESS
host RETURNED_HOSTNAME
```

Check the answer section, the provider's exact documented hostname ending, and whether forward resolution includes the original IP. The initial resolver address in `nslookup` output is not the crawler. Manual commands use the computer's configured DNS resolver and do not consume this tool's shared allowance.

## Exports

| Format | Contents and scope |
| --- | --- |
| CSV | One row per original occurrence, with relevant invalid records. Spreadsheet-sensitive cells receive a protective prefix. |
| JSON | Structured findings and fuller evidence, including preserved raw values and source context. |
| TXT | Explicitly selected eligible public IPs, deduplicated, with explanatory comment lines. A review list, not a verified blocklist. |

CSV and JSON support the whole batch, all filtered results across pages, or selected results. Quick CSV/JSON buttons export the whole batch. TXT always uses explicit selection.

Exports are generated locally and may contain private input. DNS results obtained later are not included. When using TXT with another program, remove explanatory comments if that program requires strictly one IP per line.

For automated interpretation, preserve the public finding separately from the detailed assessment status and source-health evidence. JSON references to pooled clients, matches and source evidence must be resolved before treating a result as a self-contained record.

## Investigation workflow

1. Confirm the original client-IP field and trusted-proxy configuration.
2. Review observed and current matches, applicable source health, source scope and the detailed assessment.
3. Use documented DNS checks where supported, keeping their observation time separate.
4. Inspect original paths, methods, timestamps, response codes and repetition.
5. If the request behaviour warrants restriction, apply proportionate controls through the site's firewall, rate limits or application, then check the effect on wanted traffic.

A user-agent-only rule can block legitimate crawlers while missing clients that change the header. A range association does not justify bypassing subscriber authentication, API credentials or other access controls.

Robots.txt communicates crawler preferences; it does not make a server refuse requests. The companion checker evaluates those rules. This verifier evaluates infrastructure and claims. Neither substitutes for access-control enforcement.

For SEO investigations, separate fetching from indexing and compare client-facing responses with CDN, firewall and origin records. A `200` can accompany an unintended challenge page; this tool does not fetch response bodies. Missing origin-log entries can reflect caching or blocking before the origin. Unexpected paths can come from stale links, invented URLs or probing; their presence alone does not establish a successful exploit.

Training, search indexing and user-triggered retrieval are different policy categories. Consult the individual operator's documentation. The purpose filter cannot determine the intent of an individual request. The tool does not verify HTTP Message Signatures or Web Bot Auth, correlate rotating proxies or identify unnamed operators from browser-like headers.

## References and related documentation

These are documentation links, not guarantees of current source availability. Exact feeds, versions and retrieval times used by an analysis are shown in its source evidence.

- [Google crawler verification](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests)
- [Bingbot verification](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26)
- [OpenAI bots](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Applebot](https://support.apple.com/en-us/119829)
- [Ahrefs crawlers](https://ahrefs.com/robot)
- [DuckDuckBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckduckbot) and [DuckAssistBot](https://duckduckgo.com/duckduckgo-help-pages/results/duckassistbot)
- [Common Crawl / CCBot](https://commoncrawl.org/ccbot)
- [Perplexity crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Mistral robots](https://docs.mistral.ai/robots)
- [Kimi published feed](https://www.kimi.ai/policies/kimibot.json)
- [Yandex robot verification](https://yandex.com/support/webmaster/en/robot-workings/check-yandex-robots)
- [IANA IPv4 special-purpose registry](https://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml)
- [IANA IPv6 special-purpose registry](https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml)
- [Robots Exclusion Protocol, RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html)
- [CSV, RFC 4180](https://www.rfc-editor.org/rfc/rfc4180.html)

## License and attribution

© 2026 Alexander Kyriakou. The Crawler IP Verifier's original software, including its dedicated HTML, CSS and JavaScript, is licensed under [CPAL 1.0](https://opensource.org/license/CPAL-1.0), with attribution required where Section 14 applies. Original written content, copyrightable visual design and diagrams are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), unless otherwise noted; reuse requires appropriate credit, a license link and an indication of changes. See the [tool-specific license details](https://alexanderkyriakou.eu/assets/licenses/crawler-ip-verifier/crawler-ip-verifier-LICENSE.md), [attribution notices](https://alexanderkyriakou.eu/assets/licenses/crawler-ip-verifier/crawler-ip-verifier-NOTICES.md) and [full software license](https://alexanderkyriakou.eu/assets/licenses/CPAL-1-0.txt). [Original tool](https://alexanderkyriakou.eu/ak/crawler-ip-verifier). Third-party material and source data remain subject to their own applicable terms.
