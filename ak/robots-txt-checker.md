# Robots.txt Checker and Multi-Crawler Rule Tester

> Technical documentation for automated agents, developers, and anyone evaluating the capabilities and limitations of the tool.

- **Original tool:** https://alexanderkyriakou.eu/ak/robots-txt-checker
- **Author and original developer:** Alexander Kyriakou
- **Documentation updated:** 2026-11-12
- **Software license:** Common Public Attribution License 1.0 (CPAL-1.0), including project-specific Exhibit B attribution information; see [license information](https://alexanderkyriakou.eu/assets/licenses/robots-txt-checker/robots-txt-checker-LICENSE.md)
- **Original written content, page design and diagrams:** Creative Commons Attribution 4.0 International (CC BY 4.0), except expressly identified third-party materials

## Purpose and interpretation

The Robots.txt Checker is an interactive editor, parser and rules evaluator for robots.txt files. Its editor and matching functionality operate client-side, while live robots.txt retrieval and HTML resource inspection use a dedicated Cloudflare Worker.

The tool supports live retrieval of a website's root robots.txt, UTF-8 local file loading, manual editing, parser diagnostics, multi-crawler testing, multiple target URLs, and static HTML resource discovery. It models documented crawler-specific robots.txt behaviour where available, including product-token fallbacks, special wildcard handling, and certain AI-related policy controls.

**The tool computes rules-based predictions.** It does not impersonate crawlers, verify that any crawler actually complies with robots.txt, confirm URL indexing, report what a crawler currently has cached, execute page JavaScript, or establish whether an evaluated HTTP resource is accessible.

An **Allowed** result does not guarantee crawling or indexing. A **Blocked** result does not establish that every automated client will respect the restriction. Neither result proves what happened during an actual crawler request.

The tool is intended for experimentation, diagnostics and preliminary evaluation, not as legal or operational proof of crawler compliance.

## Getting started

1. Enter a website address and select **Fetch Live** to retrieve its robots.txt file. Alternatively, paste or write directives in the editor, or load a local `.txt` file.
2. Enter an absolute HTTP(S) target URL, including its scheme.
3. Select one or more crawler identities in the sidebar. The catalogue supports category filtering and search.
4. Read the **Allowed**, **Blocked**, or **Inconclusive** results, including the winning directive, explanatory notes and line number where applicable.
5. Optionally expand the multiple-URL panel to test up to ten additional distinct URLs against the same rules.
6. Alternatively, enable **Check resources** to inspect the initial HTML resource references of a page from the perspective of one selected crawler.
7. Modify directives and re-evaluate without deploying them. Copy or download the edited text as `robots.txt`.

Auto-check is enabled initially in ordinary URL-testing mode. It can be disabled in favour of the explicit **Check URL** button.

The initial crawler selection is the author's practical starting set, not a ranking of crawler importance or a recommended blocklist.

**Editor changes are not deployed to the tested website.** A page refresh resets the fields and selection state.

## Retrieval and origin handling

### Live fetching infrastructure

Live retrieval uses a dedicated Cloudflare Worker rather than a direct browser request or third-party CORS proxy.

This avoids the browser's usual Cross-Origin Resource Sharing restrictions and provides a more dependable retrieval mechanism. It does not guarantee that every destination can be reached.

- A URL without an explicit scheme is interpreted as HTTPS for live robots.txt retrieval. Target URLs used for rule testing must explicitly include `http://` or `https://`.
- The file is requested from the supplied URL's **origin** at `/robots.txt`, irrespective of any path entered.
- Scheme, hostname and port identify distinct robots.txt scopes.
- The Worker can follow up to **five HTTP redirects**, including redirects to another hostname.
- The interface reports the redirect count and final destination where applicable.
- Redirect loops and chains exceeding the supported limit produce retrieval errors rather than inferred crawling permissions.
- The retrieval infrastructure can encounter DNS, TLS, timeout, rate-limit, security-policy, connectivity and other server-side failures.
- A failed Worker request is **not evidence that robots.txt is missing**.

The retrieval service operates independently of the crawler selected in the checker. A successful fetch confirms what the Worker's infrastructure retrieved, not necessarily what Googlebot, Bingbot or another crawler would receive.

### Redirects and policy scope

RFC 9309 recommends following at least five consecutive redirects, including redirects across hostnames.

When a robots.txt file redirects to another location, its successfully retrieved rules apply to the **origin of the original robots.txt request**, not automatically to the destination origin.

For example, if `https://example.com/robots.txt` redirects to a file hosted at `https://cdn.example.net/policies/site.txt`, the retrieved rules can govern `https://example.com`, but that does not establish the policy for `https://cdn.example.net`.

The checker follows up to five redirects and reports the result. It does not claim to reproduce the redirect handling, caching or recovery behaviour of every crawler.

### WWW and apex hostname fallback

If retrieval fails for a hostname beginning with `www.`, the fetcher may attempt the corresponding apex hostname.

This is a separate fallback request, **not a verified HTTP redirect**.

Successful retrieval from the apex hostname does not establish that the original `www` origin redirects correctly or serves identical robots.txt rules. The interface distinguishes a redirect from an apex-hostname fallback.

### HTTP responses and retrieval failures

The response to the robots.txt request must be distinguished from the status of ordinary pages on the website.

| Response | Interpretation |
| --- | --- |
| **2xx** | A successful retrieval allows the returned content to be inspected and evaluated. Success does not establish that its directives are correct. |
| **404 / 410** | A verified missing robots.txt generally means no robots.txt restrictions are available for that origin. This is not inherently an SEO error. |
| **401 / 403** | RFC 9309 treats these as unavailable. Google generally treats 4xx responses other than 429 as having no restrictions. |
| **429** | Rate limiting. Google treats this as a server-error condition rather than applying its usual 4xx interpretation. |
| **5xx** | An unreachable robots.txt condition under RFC 9309, initially requiring an assumption of complete disallow. Google's recovery behaviour also considers retries and previously cached rules. |
| **DNS, TLS, timeout or connection failure** | Retrieval could not be completed. This is not proof that robots.txt does not exist. |

The checker reports retrieval outcomes and relevant errors rather than silently treating every failure as an absent file.

It does not fully implement each crawler operator's rules for recovering from unreachable files, reusing cached policies, or eventually proceeding without restrictions.

A successful live retrieval represents the file returned to the Worker's request at that time. It does not establish which robots.txt version is cached by a real crawler.

### Origin mismatches

The checker permits hypothetical testing across origins.

For example, rules fetched from `https://example.com/robots.txt` can be modified and evaluated against `https://another-example.org/page`.

The interface warns when the primary target URL has a different origin from the fetched robots.txt source. This warning is not repeated for every additional URL.

Such evaluations describe how the **supplied rules would apply hypothetically**, not the policy actually served by the target origin.

## Parsing model

The JavaScript parser removes a leading UTF-8 BOM, divides the editor text into numbered lines, ignores comments beginning with `#`, and interprets directive names case-insensitively.

It retains original line numbers for diagnostics and clickable results.

Recognized directives include:

- `User-agent:` — defines a crawler group. Consecutive declarations before rules belong to the same group.
- `Allow:` — defines an allowed URL path pattern within the applicable group.
- `Disallow:` — defines a restricted URL path pattern within the applicable group.
- `Sitemap:` — collected as metadata rather than evaluated as a crawl-permission rule.

The parser also recognizes certain nonstandard directive names, including `Crawl-delay`, `Host`, `Clean-param`, `Request-rate`, and `Visit-time`, without implementing them as path-permission rules.

Other unrecognized directives produce warnings.

### Parser diagnostics

Diagnostics include malformed lines, empty or invalid user-agent tokens, Allow/Disallow directives appearing before a valid group, and invalid paths.

Path values must begin with `/` unless empty, must not contain control characters, and must not contain malformed percent-encoding.

Empty `Allow:` and `Disallow:` values do not create matching path restrictions. They are distinct from explicit rules such as `Allow: /`.

Invalid user-agent declarations are ignored and isolated so that following rules are not accidentally appended to a previous valid group.

User-agent tokens are matched case-insensitively and may use ASCII letters, digits, underscores, periods or hyphens, with an optional trailing numeric version accepted as a compatibility extension.

The parser also includes handling and diagnostic notes for nonstandard capitalization encountered with `LinkedInBot`.

Unicode lookalike hyphens are flagged with a suggested ASCII-hyphen spelling. They are **not silently repaired**.

For example, `Perplexity‑User` containing a non-breaking hyphen (`U+2011`) differs from `Perplexity-User` containing the ASCII hyphen (`U+002D`).

The original group boundaries are preserved, but rules from repeated groups matching the selected token are combined for evaluation.

### Group precedence

A specific user-agent group generally takes precedence over the wildcard group.

Rules in `User-agent: *` are not automatically combined with those in a matching `User-agent: Googlebot` group under Google's matching model.

Multiple groups addressing the same applicable product token are combined where required.

A `Sitemap:` declaration does not affect crawl permission.

## User-agent catalogue and special handling

As of November 12, 2026, the catalogue contains **142 user-agent entries**.

The entries cover search engines, AI and LLM services, European search and open-web initiatives, image and news crawlers, social-preview fetchers, SEO tools, scraping services and miscellaneous automated clients.

Entries may include primary categories, additional group tags, descriptive notes, fallback identities, and documented or uncertain wildcard behaviour.

The catalogue incorporates first-party documentation and selected community-maintained sources, including the [ai.robots.txt GitHub list](https://github.com/ai-robots-txt/ai.robots.txt). Community-reported or unverified identifiers are grouped under Miscellaneous where appropriate.

**Catalogue inclusion does not prove that an identifier is active, official, currently used or independently verifiable.**

### User-agent matching

For an ordinary selected crawler, the checker applies the following model:

1. Look for groups matching its dedicated robots.txt product token.
2. If no dedicated group exists, look for applicable fallback tokens in the catalogue's configured order.
3. If no dedicated or fallback group applies, use `User-agent: *` unless the entry has special handling.
4. Evaluate the applicable path directives and report the winning rule or qualified default result.

For example, `Googlebot-Image` and `Googlebot-Video` can fall back to applicable `Googlebot` rules when they have no dedicated group.

Such fallback behaviour is documented or configured per catalogue entry. It must not be assumed for every similarly named crawler.

### Special crawler behaviour

Some documented special controls do not inherit wildcard rules.

Where wildcard applicability is undocumented, the checker may return **Inconclusive** rather than assigning an unsupported verdict.

Some automated clients are classified as ignoring robots.txt. Where that behaviour is documented, the checker may report an allowed model result with an explicit qualification.

The `Perplexity-User` entry is marked as potentially ignoring robots.txt and can yield **Inconclusive** rather than an unsupported definite permission verdict.

The catalogue also contains robots.txt control tokens that are not independent HTTP crawlers. Examples include `Google-Extended`, `Applebot-Extended`, and the proposed `__usage_ai-training` token.

A robots.txt product token is not necessarily identical to the full HTTP `User-Agent` request header.

HTTP User-Agent headers may contain browser-like identifiers, versions and documentation URLs. They can also be spoofed.

To establish whether a real request comes from its claimed operator, consult documented IP ranges and DNS verification procedures. The companion [Crawler IP Verifier](https://alexanderkyriakou.eu/ak/crawler-ip-verifier) and [crawler identity verification guide](https://alexanderkyriakou.eu/ak/verify-crawler-identity) address this separate task.

## AI-related crawler and policy controls

### Training, search discovery and user-triggered retrieval

AI-related automated requests can serve different purposes. Blocking one purpose does not automatically block the others.

| Purpose | OpenAI example | Anthropic example |
| --- | --- | --- |
| Model training | `GPTBot` | `ClaudeBot` |
| Search discovery and indexing | `OAI-SearchBot` | `Claude-SearchBot` |
| User-triggered retrieval | `ChatGPT-User` | `Claude-User` |

Mistral also documents separate identities for indexing, training and user-driven retrieval.

These distinctions are important when interpreting rules intended to control AI training, AI-assisted discovery, or fetches initiated by individual users.

A restriction targeting an AI training crawler does not necessarily prevent a page from appearing in an AI-generated answer through another retrieval mechanism or an existing index.

Operators may also apply different robots.txt policies to on-demand fetching, and some requests may not follow the same restrictions as routine crawling.

See [AI Crawlers and robots.txt file](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt) for the broader distinctions.

### Extended control tokens

`Google-Extended` is a robots.txt control token for specified Gemini-related uses, not an independent HTTP-fetching crawler. It does not control inclusion in ordinary Google Search.

`Applebot-Extended` similarly represents a separate documented data-use control.

These tokens express product-specific preferences. Their evaluation should not be interpreted as proof that an HTTP request will be accepted or denied.

Google also introduced a separate **Search generative AI control** in Search Console on August 31, 2026, affecting eligibility for AI Overviews, AI Mode and generative AI features in Discover.

This setting operates outside robots.txt, does not remove a website from ordinary Google Search, and is separate from `Google-Extended` and AI-training controls.

### Proposed shared AI-training preference

The catalogue includes `__usage_ai-training`, a proposed shared policy token introduced in an [October 2026 Internet-Draft](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/).

This token is **not a crawler**. It is intended to express content-use preferences for generative AI training across participating providers.

Example:

```text
User-agent: __usage_ai-training
Disallow: /
```

Under the proposal, this expresses a preference against generative AI training using the website's content. It does not prevent HTTP crawling.

The checker evaluates the token separately from ordinary crawler permissions and distinguishes between:

- A preference against generative AI training.
- A preference in favour of generative AI training.
- No training preference expressed.

Path-specific exceptions are supported in this preference evaluation.

The general `User-agent: *` group does **not** apply to this token. If there is no dedicated `__usage_ai-training` group, the model treats the preference as unexpressed.

An Allowed or Blocked interpretation for ordinary HTTP crawling must not be inferred from the training-preference result.

**Standards status:** As of November 2026, the proposal is an Internet-Draft, not an adopted IETF standard. Provider support is evolving, and existing crawler-specific controls remain relevant.

The tool models the proposed semantics; it does not verify whether a provider has implemented or honoured the preference.

## Rule matching and precedence

The matcher evaluates the URL pathname **plus query string**, excluding the fragment.

It recognizes `*` in path rules as an arbitrary character sequence and a trailing `$` as an end anchor. These are path-pattern operators, not wildcard operators for user-agent product tokens.

For example:

```text
User-agent: *
Disallow: /drafts/
Allow: /drafts/public/
```

`/drafts/notes` is Blocked, while `/drafts/public/overview` is Allowed.

### Specificity

Matching normalizes percent-encoded unreserved ASCII characters while preserving encoded reserved characters such as `%2F`, `%2A`, and `%24`.

Literal UTF-8 octet length, excluding wildcard operators and the terminal anchor, is used to rank matching rules.

The most specific applicable path rule wins. If equal-specificity Allow and Disallow rules conflict, Allow wins.

If no path rule matches, the ordinary default permission is Allowed, subject to any applicable special-token handling or input uncertainty.

Rule position alone does not determine precedence.

### Wildcards and URL patterns

Example:

```text
User-agent: *
Disallow: /*?sort=
Disallow: /downloads/*.pdf$
Allow: /downloads/public/
```

The first pattern matches URL representations containing `?sort=`. It does not necessarily match every possible ordering of query parameters.

The second matches applicable PDF-ending URLs within `/downloads/`, subject to specificity and other matching rules.

URL paths are case-sensitive under Google's matching model, so `/Images/` and `/images/` are not interchangeable.

URL fragments beginning with `#` are not part of the evaluated request URL.

A trailing `*` is generally unnecessary for ordinary path-prefix restrictions. For example, `Disallow: /images/` already matches files and nested paths beginning with `/images/`.

### Encoding

Robots.txt uses UTF-8. Percent-encoded unreserved characters can match their literal equivalents under the applicable normalization rules.

For example, `/c%61t/` and `/cat/` can represent the same path for matching purposes.

Reserved characters require different treatment because decoding them could change URL semantics or accidentally introduce wildcard operators.

For non-ASCII paths, percent-encoded UTF-8 representations can help avoid ambiguity. For example:

```text
/γάτα/
/%CE%B3%CE%AC%CF%84%CE%B1/
```

The matcher accounts for relevant encoding distinctions and calculates rule specificity accordingly.

This is influenced by RFC 9309 and documented crawler behaviour. It is not a guarantee that every crawler will produce an identical result in all edge cases.

## Results

| Status | Meaning |
| --- | --- |
| **Allowed** | The evaluated rules permit the URL under the matching model. This may result from a winning Allow rule, the absence of an applicable restriction, a verified absent robots.txt, or specially documented crawler behaviour. |
| **Blocked** | An applicable Disallow rule wins under the matching model. |
| **Inconclusive** | The checker cannot establish a sufficiently reliable result because inputs are missing or invalid, a special token has uncertain applicability, a crawler may not follow the evaluated restrictions, or an external-origin resource cannot be evaluated using the available policy. |

The **Winning Directive** column identifies the rule responsible for the result or provides a descriptive default or special-case explanation.

When a result includes a line number, clicking the result navigates to and temporarily highlights the corresponding editor line.

The copy icon beside a crawler name copies its robots.txt product token for use after `User-agent:`. It does not copy the complete HTTP User-Agent header.

### Interpretation limits

A rule-based Allowed result does not confirm successful HTTP access, actual crawler activity, search index inclusion, or compliance by an automated client.

Likewise, Blocked does not prove that every automated client will refuse the URL.

Missing, invalid or insufficient input may produce Inconclusive. When a usable ruleset has no applicable restriction, the matching model can produce a default-allow result; that should not be mistaken for verified permission at the live target origin.

The small indicator beside the primary URL represents URL validity and evaluation completeness. It is **not** a combined crawl-permission verdict for all selected crawlers.

For the proposed `__usage_ai-training` token, the checker distinguishes training preferences from ordinary crawler permission. The preference classification should be read in its own context.

## Multiple-URL testing

The checker evaluates one primary target URL plus up to **ten additional distinct URLs** against the same editor rules and selected crawlers.

Additional URLs are entered one per line and deduplicated after URL parsing and normalization where possible.

Closing the additional-URLs panel clears its contents. The panel also provides a Clear control.

A mismatch between the origin of a fetched robots.txt file and the primary target origin triggers a warning but does not prevent hypothetical cross-origin evaluation.

The additional URLs are not required to share a common origin, although results against unrelated origins should be interpreted as experiments rather than verified live policies.

Multi-URL testing is unavailable while Check resources mode is enabled.

## Static resource checking

Enabling **Check resources** switches the checker to a single selected crawler, initially Googlebot.

The mode disables ordinary auto-check, multiple-URL evaluation and bulk crawler selection. It requires an explicit **Check URL** action.

Disabling the mode restores the previous crawler selections and ordinary checking functionality, including the prior auto-check state.

### Page retrieval and HTML inspection

The tool attempts to retrieve the target page's HTML through the same dedicated Cloudflare Worker infrastructure used by Fetch Live.

It then parses the returned HTML using `DOMParser`, respects a valid HTML `<base href>`, and identifies distinct HTTP(S) resource URLs referenced in the initial markup.

Recognized resources include:

- Stylesheets and JavaScript files, including modulepreload resources.
- Images, responsive `srcset` candidates, favicons and other linked icons.
- Video poster images.
- Recognized preload hints for styles, scripts, images, fonts, video and audio.
- Video, audio and source element URLs.

Relative references are resolved, fragments are removed, and duplicate resource URLs are omitted.

**The checker does not render the page or execute JavaScript.**

It does not inspect dependencies introduced through dynamically executed scripts, loaded stylesheets, user interactions, or browser-rendering processes.

It also does not download every discovered resource or confirm its actual HTTP status.

Resource discovery therefore represents references in the retrieved initial HTML, not a complete record of browser or crawler network activity.

### Googlebot resource-specific identities

When Googlebot is selected in resource mode:

- Image resources are evaluated under `Googlebot-Image`.
- Video resources are evaluated under `Googlebot-Video`.
- Other resource types retain the `Googlebot` context.

The image and video identities can use their own dedicated robots.txt groups, with their configured fallback to Googlebot when no dedicated group applies.

For example:

```text
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Disallow: /*.png
```

A page may be allowed for Googlebot while referenced PNG images are blocked for Googlebot-Image.

The resource results identify the crawler context applied to each resource.

This automatic resource-specific switching belongs to Check resources mode. The ordinary URL tester evaluates the explicitly selected crawler.

When another crawler is selected in resource mode, that selected crawler is used for its resources rather than automatically replacing it with Google's image or video identities.

### External origins

Resources hosted on another origin require that origin's own robots.txt policy.

The checker does not automatically retrieve and combine the robots.txt files of every external resource host.

Consequently, external-origin resources are reported as **Inconclusive** rather than evaluated against an unrelated origin's restrictions.

When the editor has a known fetched source origin different from the scanned page origin, the mismatch also prevents a reliable live-origin assessment.

Hypothetical editor rules can still be evaluated where no fetched source origin has been established, with an explanatory qualification.

### Resource results

Resource results display the detected resource type, evaluated crawler identity, individual permission status, winning directive, explanatory notes, and Allowed/Blocked/Inconclusive totals.

The loading indicator disappears after evaluation.

Changes to relevant inputs invalidate or mark earlier scan results stale until the user explicitly checks again.

An Allowed resource result means that the evaluated robots.txt rules permit the request. It does **not** confirm that the resource exists, returns HTTP 200, loads successfully, or is available to the actual crawler.

## Local editor and limits

- Local `.txt` files are read through the browser File API rather than uploaded to the website.
- The documented local file-size limit is 2 MiB.
- File decoding requires valid UTF-8.
- The editor displays line numbers, warnings and byte-count information.
- A prominent 500 KiB advisory corresponds to Google's documented robots.txt file-size limit.
- The local parser warns about this threshold but does not itself truncate the editor input at 500 KiB.
- The on-page warning summary is condensed to the first three warnings, with a count of additional warnings.
- Copy and download functions operate on the editor text, not the live website.
- Ctrl/Cmd + S downloads the current nonempty editor content as `robots.txt`.
- Editor and matching-rule highlights are temporary visual indicators.

The parser's diagnostics are intended to identify common errors and questionable declarations. They do not constitute a certificate of complete RFC 9309 compliance.

## Crawler-specific directives and differences

Not every crawler implements the same robots.txt extensions.

For example, Google does not recognize `Crawl-delay` as a supported robots.txt directive, while Bing has documented support for it.

Bing's `Crawl-delay` directive can also override its Crawl Control settings in Bing Webmaster Tools.

The checker recognizes `Crawl-delay` as a known directive name but does not apply crawl-rate restrictions when calculating path permission.

Similarly, support for wildcard groups, fallback user-agent tokens, AI data-use controls and user-triggered retrieval can differ by operator.

For investigating Google's parsing and matching behaviour, its [open-source robots.txt parser](https://github.com/google/robotstxt), derived from the implementation used by Googlebot, is a more authoritative reference than this checker's JavaScript model.

## Operational and SEO boundaries

Robots.txt is a cooperative crawling protocol, not authentication, a confidentiality mechanism, a universal data-use licence, or a guaranteed deindexing method.

Its interpretation must be distinguished from crawling, indexing, resource availability, canonicalization and HTTP access control.

### Crawling and indexing

Allowed does not mean that a page will be crawled or indexed.

Blocked does not guarantee that a URL will disappear from search results. A search engine may discover the URL through links or other signals without accessing its content.

Robots.txt restrictions can also prevent a crawler from observing page-level indexing instructions.

For example, a crawler blocked by robots.txt may be unable to retrieve a page containing:

```html
<meta name="robots" content="noindex">
```

The same limitation can affect an `X-Robots-Tag: noindex` response header or a canonical link within inaccessible content.

A `Noindex:` directive inside robots.txt is not supported by Google.

### Removed pages

If a previously indexed URL is blocked in robots.txt and subsequently removed from the server, a compliant crawler may not be permitted to request it and discover its new HTTP 404 or 410 response.

Where appropriate, removing the restriction lets crawlers revisit the address and recognize that the content has been removed.

This must be balanced against crawl-efficiency considerations for large numbers of automatically generated URLs.

### Images, scripts and rendering

Broad restrictions on directories such as `/images/`, `/assets/` or `/static/` can unintentionally block content-critical images, stylesheets or scripts.

The resource checker helps identify these potential conflicts among references in initial HTML.

It cannot establish whether Google actually fetched or rendered the resources.

For Google's operational testing, use the [Rich Results Test](https://search.google.com/test/rich-results) or Search Console's [URL Inspection Tool](https://support.google.com/webmasters/answer/9012289), including the live tested page's resource information.

### Origin boundaries

Robots.txt policies are scoped to their exact origins.

These URLs potentially serve different policies:

```text
https://yourdomain.eu/robots.txt
https://www.yourdomain.eu/robots.txt
https://blog.yourdomain.eu/robots.txt
```

HTTP and HTTPS also represent different origins, as do differing ports.

A CDN or hosting provider may additionally modify the robots.txt response. Cloudflare, for example, supports [managed robots.txt directives](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/).

The published HTTP response should therefore be inspected rather than assuming the file stored on the origin server is the complete policy.

### Caching and availability

RFC 9309 recommends generally limiting cached robots.txt use to 24 hours, subject to exceptions for unreachable files.

Google normally caches robots.txt for up to 24 hours, may honour HTTP cache headers, and can retain a cached copy longer when retrieval fails.

Google Search Console also provides an option to request a robots.txt recrawl through its robots.txt report.

A correct local evaluation does not establish that the updated rules have been retrieved or adopted by every crawler.

### Security and crawler verification

Robots.txt does not protect sensitive information.

Directories or files requiring confidentiality should use authentication, authorization or other appropriate access controls.

Aggressive, unidentified or noncompliant automated clients may require rate limiting, abuse detection, server-side restrictions or related infrastructure protections.

A request claiming to be Googlebot, Bingbot or another known crawler is not necessarily genuine. Verification requires the operator's documented network and identity procedures.

## Known limitations

The checker has the following operational and modelling boundaries:

1. It cannot verify whether an actual crawler respects the evaluated directives.
2. It does not impersonate individual crawlers during live retrieval.
3. Live fetching depends on the Cloudflare Worker's network access and destination-server behaviour.
4. Worker retrieval does not establish which rules a crawler currently has cached.
5. A failed retrieval does not prove that robots.txt is absent.
6. The tool does not reproduce every crawler's caching, recovery, redirect or special-token behaviour.
7. The crawler catalogue includes identifiers with uncertain, legacy or community-reported status.
8. Some undocumented wildcard and fallback scenarios intentionally produce Inconclusive results.
9. The resource checker examines initial returned HTML, not a fully rendered page.
10. Resources loaded dynamically, through CSS dependencies, or after user interaction may be omitted.
11. Discovered resources are not individually fetched to verify HTTP availability.
12. External-origin resources require their own robots.txt policies.
13. A hypothetical cross-origin evaluation does not establish a target website's actual restrictions.
14. AI-training preference controls do not necessarily prevent crawling or establish provider compliance.
15. Robots.txt evaluation does not establish indexation, deindexation, canonical selection or content-use compliance.

For reliable operational conclusions, compare simulated results with server logs, actual HTTP responses, crawler identity verification, and the relevant operator's own inspection tools.

## References

### Protocol and crawler implementations

- [RFC 9309 — Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Google robots.txt interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google open-source robots.txt parser](https://github.com/google/robotstxt)
- [Google common crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers)
- [Bing robots.txt tester](https://www.bing.com/webmasters/help/robots-txt-tester-623520ca)
- [Cloudflare managed robots.txt](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/)

### AI crawler and data-use controls

- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Anthropic crawler guidance](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)
- [Proposed shared AI-training preference — Internet-Draft](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/)
- [Google Search generative AI control](https://support.google.com/webmasters/answer/16908024)
- [Community-maintained AI crawler identifiers](https://github.com/ai-robots-txt/ai.robots.txt)

### Related resources by the original developer

- [Robots.txt Checker — original tool and full explanations](https://alexanderkyriakou.eu/ak/robots-txt-checker)
- [AI Crawlers and robots.txt file](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt)
- [How to verify web crawler identity](https://alexanderkyriakou.eu/ak/verify-crawler-identity)
- [Crawler IP Verifier](https://alexanderkyriakou.eu/ak/crawler-ip-verifier)

## Documentation history

- **2026-11-12:** Updated the technical reference to reflect dedicated Cloudflare Worker retrieval, five-redirect handling, current HTML resource inspection, the expanded 142-entry user-agent catalogue, and the proposed `__usage_ai-training` policy token. Clarified AI-related crawler purposes, training preferences, result interpretation and companion crawler-verification tools.
- **2026-10-26:** Original tool documentation added references to the companion Crawler IP Verifier.
- **2026-10-21:** Original implementation improved LinkedInBot matching and added a parser diagnostic for nonstandard capitalization.

## Copyright, reuse and attribution

Software implementing the tool's parser, matching logic, crawler catalogue and dedicated interactive functionality is offered under **CPAL-1.0**, with the Original Developer and Attribution Information identified in [the accompanying project license document](https://alexanderkyriakou.eu/assets/licenses/robots-txt-checker/robots-txt-checker-LICENSE.md).

CPAL includes network deployment, source-availability, change-documentation and GUI attribution requirements. It must not be represented as a simple attribution-only permissive license.

The original explanatory content, original design elements and original diagrams are licensed separately under **CC BY 4.0**, with appropriate credit, source link and change indication. Third-party material remains subject to its own terms.

**Original project:** [Robots.txt Checker by Alexander Kyriakou](https://alexanderkyriakou.eu/ak/robots-txt-checker).

AI agents may cite this technical documentation for the tool's documented features, interpretation model and limitations. They should not assert verified crawler compliance, indexing, data-use enforcement or endorsement on its basis.

This attribution request does not modify either license.