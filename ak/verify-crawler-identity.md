# Is that really Googlebot? How to verify web crawler identity

Checking crawler claims, tracing source IP, and deciding what evidence is enough to act on.

**Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)  
**Published:** November 9, 2026  
**Article:** https://alexanderkyriakou.eu/ak/verify-crawler-identity  
**Topics:** [SEO](https://alexanderkyriakou.eu/thoughts/seo), [Data](https://alexanderkyriakou.eu/thoughts/data)

![Photo by Alexander Kyriakou (2025) capturing a golden sunset over the sea at Kallithea Marina, Athens. A small motorboat leads a single-file line of small training sailboats across shimmering water illuminated by bright sunlight reflecting off the calm sea, framed by a large multi-deck yacht on the harbor horizon](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/training-sailboats-sunset-athens.webp)

*Well-behaved sloops. © Alexander Kyriakou · Athens · 2025. [Photograph licensing and permissions](https://alexanderkyriakou.eu/licensing).*

## Contents

- [Borrowed crawler name](#borrowed-name)
- [Find the client IP](#client-ip)
- [IP ranges & CIDR](#published-ranges)
- [DNS verification](#dns-verification)
- [Operator differences](#operators)
- [Uncertain results](#unresolved)
- [Read the request context](#request-context)
- [Deciding what to allow](#access-decisions)
- [Signed requests](#signed-requests)
- [Investigation checklist](#checklist-title)

## The short answer

A request calling itself Googlebot hasn't proved where it came from. Start with the client IP in your logs, check it against the operator's published crawler ranges, and use reverse and forward DNS where the operator documents that method. Then examine what the client requested and what your website returned. Identifying the infrastructure and deciding whether to allow access are separate steps.

If you already have an IP address or a log export, my [Crawler IP Verifier](https://alexanderkyriakou.eu/ak/crawler-ip-verifier) can help you examine the range evidence and run supported DNS checks.

<a id="borrowed-name"></a>

## A crawler name is easy to borrow

There's a slightly uncomfortable moment when a request in your logs stops being “Googlebot visited this page” and becomes “something wrote Googlebot in a header.” The request hasn't changed. Your confidence in what you're looking at has.

Working on my robots.txt checker and its companion IP verifier brought me back to that distinction repeatedly. We spend time deciding which crawlers should visit, writing their rules and explaining those decisions to others. Then the first piece of identification we encounter is text that the requester chose for itself. A rather fragile starting point.

The HTTP `User-agent` field describes the requesting software through product names, versions and comments; [HTTP's specification](https://www.rfc-editor.org/rfc/rfc9110.html#section-10.1.5) defines that syntax. It doesn't turn the field into a credential. A copied version number, browser description or documentation URL adds no independent evidence of who sent it.

On a site you control, you can send Googlebot's name from your own machine:

```sh
curl --user-agent 'Googlebot/2.1 (+http://www.google.com/bot.html)' https://yourdomain.eu/
```

That is an ordinary [curl option](https://curl.se/docs/manpage.html#-A). It changes the user-agent text, without turning curl into Googlebot or reproducing how Google fetches and renders your page. If changing the name gets you a different response, you've learned something about how the website handles that header.

Nor does changing a header change the source IP of an established connection. The server still sees the connection's source address, subject to any proxies in the path. HTTPS protects the connection; it doesn't verify the name you've put in the user-agent.

Even an honest user-agent can be copied. My own robots.txt fetcher declares `RobotsTxtChecker/1.0`, with a link explaining what it does. That's useful information for someone reading their logs, but it is still text supplied by the sender. The [fetcher example](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-tool-user-agent) shows the complete value.

<a id="client-ip"></a>

## Before checking an IP, establish where it came from

Start one step earlier than the lookup. Where did the address in your report come from?

For a direct connection, the web server sees its network peer. Put a CDN or reverse proxy in front, and the origin's peer may be that intermediary. Checking that address against Googlebot ranges would tell you about the proxy while leaving the original requester unexamined.

[Cloudflare documents this explicitly](https://developers.cloudflare.com/support/troubleshooting/restoring-visitor-ips/restoring-original-visitor-ips/): its proxying changes which address an origin normally records, and the original client address can be restored through the appropriate server configuration.

![A client connects through a proxy to an origin; the address recorded depends on the observation point and trusted forwarding configuration.](https://alexanderkyriakou.eu/assets/images/thoughts/crawler-ip-verifier/client-ip-behind-a-proxy.webp)

*Checking the proxy's address answers a different question from checking its client. Diagram from the [Crawler IP Verifier guide](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-client-ip). © 2026 Alexander Kyriakou · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*

A header named `X-Forwarded-For` isn't trustworthy just because it has a familiar name. First check that the connection to your origin came through a proxy you trust. Otherwise, a visitor could connect directly and supply their own header.

With a configured list of trusted proxies, read the complete address chain from right to left, skipping addresses belonging to those proxies. The first address outside that list is the one to use for security decisions. Stop there: addresses further left may have been supplied by that untrusted client or proxy. Your server or framework should handle this through its trusted-proxy configuration; nginx's [recursive client-IP handling](https://nginx.org/en/docs/http/ngx_http_realip_module.html#real_ip_recursive) follows this approach. The resulting address may still belong to an upstream proxy rather than the original visitor.

For Cloudflare, `CF-Connecting-IP` is useful, but [Worker subrequests and Pseudo IPv4 need extra care](https://developers.cloudflare.com/fundamentals/reference/http-headers/). When Pseudo IPv4 overwrites headers, the original IPv6 address is retained in `CF-Connecting-IPv6`. A convenient column name isn't a substitute for checking the request path.

There is another proxy problem on the other side. Your CDN may correctly report the address connecting to it, while that client is itself a proxy used by somebody else. Restoring the client field doesn't reveal the person or software behind every upstream intermediary. Shared cloud hosting, NAT and rotating proxies are reasons to describe what you established carefully.

For an SEO, this means asking for the right export. For a developer or DevOps engineer, it means checking the logging and proxy configuration. For a product owner, it means not treating a chart labelled “Googlebot traffic” as a settled fact before somebody has checked its definition.

<a id="published-ranges"></a>

## What published IP ranges establish

Some operators publish machine-readable lists of addresses used by their crawlers. You obtain the appropriate list, parse the client address and test whether it belongs to one of the listed networks. The result should identify the source and the matching prefix, not merely display a reassuring green label.

<a id="cidr-matching"></a>

### A CIDR is an address range, not a text pattern

In IPv4, `192.0.2.0/24` fixes the first 24 of the address's 32 bits. It contains 256 addresses, from `192.0.2.0` through `192.0.2.255`. `192.0.2.128/25` fixes one more bit and covers only the upper half: `192.0.2.128` through `192.0.2.255`. These are documentation addresses, not crawler infrastructure.

That extra bit is why matching the first three decimal groups is insufficient. CIDR matching compares the address bits selected by the prefix length. The [IPv4 CIDR specification](https://www.rfc-editor.org/rfc/rfc4632.html) supplies the underlying notation.

IPv6 applies prefixes to 128-bit addresses. `2001:db8::/32` is another documentation example. The same IPv6 address can be written in several valid ways, so compare parsed addresses rather than their spelling. See the [IPv6 addressing specification](https://www.rfc-editor.org/rfc/rfc4291.html). A feed containing only IPv4 prefixes doesn't establish IPv6 coverage.

<a id="range-example"></a>

### A small check you can inspect

You can run the code below in the accompanying [Colab notebook](https://colab.research.google.com/drive/1TWdxssCkDFfFWKWB3T-G-c5TW5WL_h2E). It uses Python's [ipaddress module](https://docs.python.org/3/library/ipaddress.html) to check an IPv4 or IPv6 address against Google's published common-crawler ranges. The default address comes from Google's verification documentation.

```python
import ipaddress
import json
import urllib.request
from datetime import datetime, timezone

source = (
    "https://developers.google.com/static/crawling/"
    "ipranges/common-crawlers.json"
)
address = ipaddress.ip_address(ip_to_check.strip())
with urllib.request.urlopen(source, timeout=15) as response:
    snapshot = response.read()
data = json.loads(snapshot)
prefixes = data["prefixes"]
if not isinstance(prefixes, list) or not prefixes:
    raise ValueError("No usable prefix list")

matches = []
for entry in prefixes:
    value = entry.get("ipv4Prefix") or entry.get("ipv6Prefix")
    network = ipaddress.ip_network(value, strict=True)
    if address.version == network.version and address in network:
        matches.append(str(network))

print("IP address:", address)
print("Source:", source)
print("Checked:", datetime.now(timezone.utc).isoformat())
print("Publisher timestamp:", data.get("creationTime", "not supplied"))
print("Matching prefixes:", ", ".join(matches) or "none in this snapshot")
```

The example stops if it can't retrieve or process the published ranges, so a failed check isn't reported as “no match”. For a code-free check, add your IP addresses, preferably with their full user-agent headers, to the [Crawler IP Verifier](https://alexanderkyriakou.eu/ak/crawler-ip-verifier) and run an analysis.

![Screenshot of the Crawler IP Verifier results page, displaying the crawler claim, published provider, finding and http status for selected IP addresses](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/crawler-ip-verifier-results-screenshot.webp)

*Crawler IP addresses matched against the operators' published ranges.*

<a id="range-scope"></a>

### Check the crawler's ranges, not just who owns the IP

A request can come from Google's network without coming from Googlebot. Someone renting a server on Google Cloud could send it. Finding “Google” in an IP ownership lookup therefore isn't enough: compare the address with the ranges Google specifically publishes for its crawlers.

Check which crawlers the list covers, too. Some operators publish a separate list for each bot; others publish one list shared by several bots. A match against a shared list can support “this came from the operator's published infrastructure” without confirming the particular bot named in the user-agent.

IP ranges can change. If you're investigating a request from three months ago, today's list cannot prove which ranges the crawler used then. Keep a copy of the list and the date of your check so you can explain which evidence supported your conclusion.

<a id="dns-verification"></a>

## Check the hostname, then check its IP

DNS verification initially confused me a bit. If an IP returns a Googlebot hostname, isn't that enough? The problem is that a reverse DNS record can name a domain without proving that the domain points back to that IP. That's why the check needs both directions.

A **reverse lookup** starts with an IP address and asks for its hostname through a PTR record. A **forward lookup** starts with that hostname and asks for its IP addresses: A records for IPv4, or AAAA records for IPv6. These records are defined in the [DNS specification](https://www.rfc-editor.org/rfc/rfc1035.html) and its [IPv6 extension](https://www.rfc-editor.org/rfc/rfc3596.html).

To verify a crawler using DNS, follow three steps:

1. Look up the client IP to find its hostname.
2. Check that the hostname belongs to a domain the crawler operator tells you to expect.
3. Look up that hostname and check that its returned addresses include the original IP.

The reverse and forward lookups together are called **forward-confirmed reverse DNS, or FCrDNS**. The domain check matters just as much: a hostname on somebody else's domain can resolve back correctly without having any connection to Googlebot.

<a id="dns-example"></a>

### Checking Google's documented example

[Google's verification guide](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests) uses `66.249.66.1` as an example. Its reverse lookup returns `crawl-66-249-66-1.googlebot.com`, and the forward lookup returns the original IP.

On macOS or Linux, with `host` available, start with the reverse lookup:

```sh
host 66.249.66.1
```

Check the returned hostname. In Google's example, it ends in `.googlebot.com`. Then look up that hostname's IPv4 addresses:

```sh
host -t A crawl-66-249-66-1.googlebot.com
```

The returned addresses should include `66.249.66.1`. When checking another IP, use the hostname your own reverse lookup returned. The values above illustrate Google's documented example; live DNS answers can change.

On Windows, the equivalent commands use `nslookup`:

```text
nslookup 66.249.66.1
nslookup -type=A crawl-66-249-66-1.googlebot.com
```

The initial `Server` and `Address` lines identify the DNS resolver answering your query. Look below those for the hostname and address returned by the lookup.

For an IPv6 address, check the hostname's AAAA records instead: use `host -t AAAA` or `nslookup -type=AAAA`. You don't need both record types to pass: check for the original address in the relevant answers.

Finally, read the whole hostname. `crawler.googlebot.com.example.net` belongs under `example.net`, not `googlebot.com`. Likewise, `notgooglebot.com` is a different domain. Finding the word “googlebot” somewhere in a hostname isn't the domain check.

![DNS verification checks the reverse hostname, its documented provider domain and forward resolution back to the submitted IP.](https://alexanderkyriakou.eu/assets/images/thoughts/crawler-ip-verifier/dns-verification.webp)

*The hostname's domain and the return address both matter. Diagram from the [Crawler IP Verifier guide](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-dns). © 2026 Alexander Kyriakou · [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).*

<a id="dns-confidence"></a>

### What the DNS check tells you

If the IP resolves to a hostname under the operator's documented domain, and that hostname resolves back to the same IP, it passes the operator's DNS verification procedure. That supports identifying the address with the operator. You still need to examine its requests before deciding what access to allow.

An unsuccessful check needs a more specific explanation. A timeout means the lookup couldn't finish. No PTR record means it returned no hostname to check. A hostname that doesn't resolve back to the original IP fails forward confirmation. These outcomes shouldn't all be reported as “fake crawler”. Also, checking an old log entry today tells you about today's DNS records, not necessarily those in place when the request happened.

Not every operator offers DNS verification. If it publishes crawler IP ranges but no hostname-checking instructions, use those ranges. Don't invent an expected hostname and reject a request because it doesn't match.

![Windows nslookup results showing reverse and forward DNS lookups linking 34.83.129.165 with 165.129.83.34.bc.googleusercontent.com.](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/nslookup-results.webp)

*The IP resolves to a Google Cloud hostname, and that hostname resolves back to the original IP.*

<a id="operators"></a>

## Different operators publish different evidence

There isn't one crawler-verification recipe with a few brand names swapped in. Start with the operator's documentation, and check which client or infrastructure category it actually covers.

**Published verification routes**

| Operator | Public evidence | What needs care |
| --- | --- | --- |
| [Google](https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests) | Category-specific range feeds and documented reverse/forward DNS. | Common crawlers, special crawlers and user-triggered traffic have different scopes. A Google-hosted customer fetcher is not automatically Googlebot. |
| [Bing](https://www.bing.com/webmasters/help/how-to-verify-bingbot-3905dc26) | [Bingbot ranges](https://www.bing.com/toolbox/bingbot.json), forward-confirmed hostnames beneath `search.msn.com`, and Microsoft's [verification tool](https://www.bing.com/toolbox/verifybingbot). | Microsoft recommends refreshing the published list daily. |
| [OpenAI](https://developers.openai.com/api/docs/bots) | Separate feeds for [GPTBot](https://openai.com/gptbot.json), [OAI-SearchBot](https://openai.com/searchbot.json), [ChatGPT-User](https://openai.com/chatgpt-user.json) and [OAI-AdsBot](https://openai.com/adsbot.json). | Training-related collection, search, user actions and ad validation are different purposes. The crawler documentation does not prescribe a provider-specific FCrDNS test. |
| [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) | A public [crawler IP list](https://claude.com/crawling/bots.json). | Older claims that no ranges are published are outdated. The shared list alone doesn't distinguish every Claude crawler identity or establish exhaustive coverage. |
| [Yandex](https://yandex.com/support/webmaster/en/robot-workings/check-yandex-robots) | Forward-confirmed hostnames beneath `yandex.ru`, `yandex.net` or `yandex.com`. | Yandex says its changing IP list is not disclosed. No published range list does not mean no documented verification method. |

*Documentation checked November 6, 2026.*

Google's common-crawler feed is currently named `common-crawlers.json`; use the link in its verification documentation rather than copying an old endpoint from somewhere else. The [crawling documentation changelog](https://developers.google.com/crawling/docs/changelog) records the February 2026 move to the crawling IP-ranges directory and the March addition of user-triggered agent coverage.

For OpenAI, `ChatGPT-User` represents certain user-initiated actions and is not its automatic search crawler. OpenAI says robots.txt may not apply to those user actions. Applying one provider's rules to another provider's similarly named fetcher is an easy way to reach the wrong conclusion.

<a id="no-public-method"></a>

### When there is no public verification route

Some operators don't publish crawler IP ranges or explain how to verify their hostnames. In those cases, the user-agent tells you who the client claims to be, but gives you no independent way to confirm it.

A self-hosted crawler can run from an office connection, a cloud server or a customer's network. Recognising the software's name doesn't tell you who is running it. For a crawl you've agreed to, you can arrange access using a known IP or a secret request header. For an unsolicited request, you may have to leave its identity unverified.

Don't treat every address belonging to a cloud provider as evidence of a particular crawler. Equally, an identity you can't verify isn't automatically abusive. Examine what they request and how they behave before deciding whether to allow them.

<a id="unresolved"></a>

## When the evidence doesn't settle the claim

When verification doesn't give you a clear answer, record where it stopped. An address missing from a published list is a different finding from a list you couldn't download. The distinction matters when deciding what to do next.

**What each verification result tells you**

| What you found | What it tells you |
| --- | --- |
| The IP matches the crawler's published ranges | The address is in the operator's list. Record the matching CIDR and check which crawlers that list covers. |
| The IP matches a list shared by several crawlers | The match supports identifying the operator, but doesn't tell you which of its crawlers sent the request. |
| The IP doesn't match any listed range | The address wasn't in the list you checked. Before questioning the claimed identity, confirm that the list is current and covers that crawler and its address type: IPv4 or IPv6. |
| The list couldn't be downloaded or processed | The check couldn't finish. Don't report this as an IP that was checked and found missing. |
| The hostname matches the documented domain and resolves back to the IP | The address passed the operator's documented DNS check when you looked it up. |
| The DNS check didn't verify the address | Record why: no PTR record, an unexpected hostname, no matching return address or a lookup error. These are different findings. |

My verifier reports findings such as *Official infrastructure match*, *Unverified crawler claim* and *Could not verify*, based on the information it can check. The [finding explanations](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-results) describe what each result means.

If a request claims to be Googlebot but its IP and hostname don't support that claim, record what you checked and what didn't match. Other requests from the same address may help explain what's happening. These clues can give you reason to question the claim without telling you who actually sent the request.

You don't need to identify the sender before limiting unwanted traffic. If requests overload your search, filters or API, you can restrict them based on that behaviour.

<a id="request-context"></a>

## Put the request back into the logs

An IP list lets you check published ranges, but leaves out what those addresses requested and how your website responded.

Retain the full user-agent, timestamp and timezone, hostname, method, path, response status and useful request identifiers. Where your infrastructure exposes them, keep edge and origin responses distinct. Record whether the export is sampled or aggregated. One IP is not one visitor, and one grouped result is not necessarily one request.

Cache hits may be served without reaching the origin. A firewall may stop a request before the application logs it. Absence from an origin log therefore needs to be read alongside the edge's observation point. Equally, a successful status code doesn't tell you whether the response was the intended page, a challenge or some other fallback. Inspect the relevant response evidence when diagnosing access.

For an SEO investigation, keep fetching separate from indexing and visibility. A verified crawler request can support “this infrastructure requested this URL”. It doesn't establish that the response was indexed, shown in an answer or used for training.

<a id="supporting-case"></a>

### One small example, rather than a universal verdict

In the [case documented on my verifier page](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-googlebot-case), an address sent six requests with a Googlebot header. At the October 24, 2026 assessment, the applicable current range source provided no match and the DNS lookup returned no PTR record. Other requests from the address used different user-agents and asked for plugin-related paths.

The missing PTR record was evidence against the Googlebot claim: Google's documented verification procedure expects a Googlebot address to resolve to one of its crawler hostnames. Combined with the absent range match and the requests for plugin-related paths, it gave me reason to restrict the traffic. None of that identified who actually sent it, though.

![Screenshot from the Crawler IP Verifier displaying Details for a selected IP address.](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/crawler-ip-verifier-screenshot-fake-googlebot.webp)

*“Googlebot” requested my non-existent `web.config` file.*

![Screenshot of a DNS lookup for two selected IP addresses, with one returning no PTR record and the other returning a Google Cloud hostname.](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/crawler-ip-verifier-dns-lookup-result.webp)

*After a quick DNS check, doesn't smell like Google.*

Request patterns can justify action without proving attribution. Paths associated with a CMS you don't use, repeated expensive queries or sudden bursts deserve examination. A single unfamiliar path, a 404 or a missing robots.txt request in a short log window is not enough to settle the story. Crawlers can know stale links and cache policies; your observation window may also be incomplete.

Those copied names can also distort your traffic reports. In its [October 28, 2026 investigation](https://www.cequence.ai/blog/ai-agent-impersonation), Cequence described a scanner rotating through roughly 32 AI-bot identities while probing for credential files. That is Cequence's finding from the traffic it studied, not a measurement of the whole web. It illustrates how a user-agent-only “AI traffic” category can count an impersonating scanner as several recognised services.

<a id="access-decisions"></a>

## Deciding what to allow

Identification and access are separate decisions. Once you've checked a crawler's identity, you still decide what it may fetch and how much traffic to accept. A recognised crawler can be unwanted on a particular path, while an audit you've agreed to may need an exception.

Robots.txt still has a useful job: communicating crawl preferences to clients that follow them. Its [specification explicitly separates those rules from access authorisation](https://www.rfc-editor.org/rfc/rfc9309.html#section-3). Publishing a restriction and making the server refuse a request are different actions. When cooperation fails, the preference file has no enforcement mechanism to fall back on.

My [Robots.txt Checker](https://alexanderkyriakou.eu/ak/robots-txt-checker) helps test which rules apply to a URL for the crawler(s) you've selected. Use it to check your crawl rules, network evidence and logs to investigate the requester, and firewall or application controls to refuse or limit access.

![Robots.txt checker results for a URL, showing the selected user-agents and whether they are allowed or disallowed by the rules.](https://alexanderkyriakou.eu/assets/images/thoughts/verify-crawler-identity/robots-txt-results-selected-top-user-agents.webp)

*Robots.txt ruling results for [my /robots.txt](https://alexanderkyriakou.eu/robots.txt) against top selected user-agents, on November 9, 2026.*

<a id="allowlisting"></a>

### Allowlisting can be the right choice

If your firewall or bot protection blocks a crawler you want to let through, an allowlist rule can make an exception. Be specific about what qualifies, where the exception applies and which checks it skips.

For a public crawler, use its documented verification method or your security provider's verified-bot classification, after checking what that classification means. Keep published IP lists updated and monitor failed refreshes. A rule that accepts the user-agent alone gives anyone who copies the name the same exception.

For an [SEO audit you've agreed to](https://alexanderkyriakou.eu/ak/crawler-ip-verifier#guide-own-crawl-blocked), allow the expected source IPs or arrange a secret request header that your rule checks. That identifies an authorised crawl without asking the crawler to pretend to be Googlebot.

Treat a secret header like a password for that exception: someone who obtains it may be able to use it. Keep it out of public code and logs, limit the rule to the agreed hosts, paths and period, and revoke the credential when the crawl is finished.

Check what the exception actually bypasses. Cloudflare's [Skip rules](https://developers.cloudflare.com/waf/custom-rules/skip/), for example, let you select particular security checks. Allowing a crawler through bot protection shouldn't also grant access to private pages or remove the permissions required by your API.

Wanted traffic can still need rate limits. Fetching public articles is different from repeatedly running expensive catalogue filters or API queries. Apply the exception where it's needed, check that the wanted crawl works, and watch for unintended access elsewhere. Keep a way to reverse the change.

<a id="signed-requests"></a>

## Signed requests add another verification method

IP ranges and DNS help you check where a request came from. A cryptographic signature lets you check whether the signed parts of a request match a signature made with a particular key. To identify the operator, you also need a trusted way to establish whose key it is.

[HTTP Message Signatures, RFC 9421](https://www.rfc-editor.org/rfc/rfc9421.html), defines the signing mechanism. Web Bot Auth builds a bot-identification approach around signatures and key discovery; its work is still developing in the [IETF working group](https://datatracker.ietf.org/wg/webbotauth/about/).

As of this article's November 2026 review, [Google documents an experimental implementation](https://developers.google.com/crawling/docs/crawlers-fetchers/web-bot-auth) for some AI-agent traffic and warns that not every request is signed. [OpenAI documents signed requests for ChatGPT Work's Cloud browser](https://help.openai.com/en/articles/11845367-chatgpt-works-cloud-browser-allowlisting). Neither statement means all Googlebot, GPTBot or ChatGPT-User requests carry those signatures.

A signature header still needs to be checked. The verifier must establish whose key it is, validate the signature against the required parts of the request, and apply the scheme's time and replay checks, which help prevent captured requests from being reused. Proxies that change signed parts of a request can affect that verification. A copied `Signature-Agent` value proves no more than a copied user-agent.

Check which requests the service says it signs before treating a missing signature as suspicious. A valid signature still doesn't give the sender permission to access every resource. My Crawler IP Verifier doesn't check message signatures; you need a separate implementation or infrastructure that supports them.

A useful result is being able to explain what you checked and why you allowed or restricted the requests. Keep that evidence with your decision so you can revisit it when the traffic, published ranges or your own rules change. Where the sender's identity remains unknown, record that too.

<a id="investigation-checklist"></a>
<a id="checklist-title"></a>

## A checklist for the next crawler investigation

Use this for one IP or a group of related requests. Tick each step after completing it. If the operator doesn't provide a particular verification method, note that in your investigation and move on.

- [ ] Check that the logged IP belongs to the client you're investigating. If a proxy supplied it, confirm the trusted-proxy settings.
- [ ] Keep the original requests, including the full user-agent, requested URL, method, timestamp, timezone and response status.
- [ ] Open the claimed operator's verification instructions. Identify which IP list, hostname rules or signature checks apply to this crawler.
- [ ] If an applicable IP list is available, compare the address with it. Record the result, matching CIDR where present, source and retrieval date.
- [ ] Where supported, run the documented DNS or signature check. Record whether it passed, failed or couldn't finish, and when you checked.
- [ ] Review the requested paths, request rate and responses. Check CDN or firewall records alongside origin logs where available.
- [ ] Decide whether to allow, limit or block the requests. If you change a rule, check that it affects the intended traffic and preserves wanted access.
- [ ] Save the log sample, verification results, dates and reason for your decision, including anything you couldn't establish.

Crawler documentation and verification methods change. If you find a broken reference or a published verification method I've missed, [let me know](https://alexanderkyriakou.eu/contact). A link to the operator's documentation would help me check it.

---

Author is I, [Alexander Kyriakou](https://alexanderkyriakou.eu/).  
Proofreader, GPT-6.1 Sol  
Published November 9, 2026.
