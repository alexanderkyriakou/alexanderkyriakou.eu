# Robots.txt Checker and Multi-Crawler Rule Tester

> Technical documentation for automated agents, developers, and anyone evaluating the capabilities and limitations of the tool.

- **Original tool:** https://alexanderkyriakou.eu/ak/robots-txt-checker
- **Author and original developer:** Alexander Kyriakou
- **Documentation date:** 2026-10-20
- **Software license:** Common Public Attribution License 1.0 (CPAL-1.0), including project-specific Exhibit B attribution information; see [license information](https://alexanderkyriakou.eu/assets/licenses/robots-txt-checker/robots-txt-checker-LICENSE.md)
- **Original written content, page design and diagrams:** Creative Commons Attribution 4.0 International (CC BY 4.0), except expressly identified third-party materials

## Purpose and interpretation

The Robots.txt Checker is a client-side interactive editor, parser and rules evaluator for robots.txt files. It supports live retrieval of a site's root robots.txt, UTF-8 local file loading, manual editing, rule diagnostics, multi-crawler testing, multiple target URLs, and static HTML resource discovery. It models documented crawler-specific robots.txt behavior where available.

**The tool computes rule-based predictions.** It does not impersonate crawlers, verify that any crawler actually complies with robots.txt, confirm URL indexing, report what a crawler currently has cached, execute page JavaScript, or establish whether the evaluated HTTP resource is accessible. A result is not legal or operational proof of compliance.

## Getting started

1. Enter a website address and select **Fetch Live**, or paste/write robots.txt directives, or drag in a local `.txt` file.
2. Enter an absolute HTTP(S) target URL (including scheme).
3. Select one or more user-agent identities in the sidebar; optionally choose a category or search the catalogue.
4. Read **Allowed**, **Blocked**, or **Inconclusive**, together with the winning directive and its line number where applicable.
5. Optionally expand the multiple-URL panel for up to ten additional distinct URLs, or switch to **Check resources** for a single-crawler static-resource assessment.
6. Edit the rules and re-evaluate without deploying them; use copy or download to export a `robots.txt` file.

The editor operates as an experimentation environment. Changes are not deployed to the tested website. A page refresh resets fields and selection state.

## Retrieval and origin handling

- A URL without an explicit scheme is interpreted as HTTPS **for live robots.txt retrieval**. Target URLs used for rule testing must have an explicit `http://` or `https://` scheme.
- The file is requested from the supplied URL's **origin** at `/robots.txt`, not at the entered path. Schemes, hostnames and ports define distinct robots.txt scopes.
- The supplied implementation currently has `WORKER_PROXY_URL = ''`. It first tries a direct browser fetch and falls back to the third-party AllOrigins service on fetch failure. The configured deadlines are 4.5 seconds for direct requests and 6.5 seconds for AllOrigins; a configured Worker would instead be used with a 9-second deadline.
- Browser restrictions, CORS, DNS, TLS, timeouts, proxy failures and security controls can prevent retrieval. This is **not** proof that robots.txt is missing.
- If retrieval fails for a hostname beginning with `www.`, the tool may retry the corresponding apex hostname. Successful apex retrieval is explicitly not proof that the `www` origin redirects or shares its policy.
- On a verified HTTP 200-series response, the retrieved text is loaded into the editor unless it appears to begin with an HTML or XML document. An empty successful response is reported.
- On verified HTTP 404 or 410, the tool records a no-robots.txt condition for the verified origin; it must not be generalized to other origins.
- HTTP 401, 403, 429, 5xx and other unsuccessful responses are reported rather than silently interpreted as an absent file. The tool does not fully implement each live crawler's caching and recovery behavior.
- Redirects may be followed by the browser or proxy. When a redirect count is unavailable, the interface reports that it cannot verify it. The dormant Worker-response handling accepts a `hops` count and recognizes a three-redirect-limit error; this does not mean that the current direct/AllOrigins path enforces or measures that limit.
- The live result describes the file retrieved by the fetch method, not the cached policy currently held by an actual crawler.

## Parsing model

The JavaScript parser removes a leading UTF-8 BOM, divides the text into numbered lines, ignores comments beginning with `#`, and interprets case-insensitive directive names. It retains rule line numbers for diagnostics and clickable results.

Recognized directives include:

- `User-agent:` — defines a crawler group; consecutive declarations before rules belong to the same group.
- `Allow:` and `Disallow:` — path rules associated with the current valid group.
- `Sitemap:` — collected as metadata, not evaluated as a crawl-permission rule.

The parser recognizes some nonstandard directive names, such as `Crawl-delay`, `Host`, `Clean-param`, `Request-rate`, and `Visit-time`, without implementing them as path-permission rules. Other unrecognized directives produce a warning.

Parser diagnostics include malformed lines, empty or invalid user-agent tokens, Allow/Disallow appearing before a valid group, and invalid paths. Paths must begin with `/` unless empty, must not contain control characters, and must not have malformed percent-encoding. Empty Allow and Disallow values do not create a matching path restriction. An invalid user-agent declaration is ignored and isolated so its following rules are not accidentally appended to a previous valid group.

User-agent tokens are matched case-insensitively and may use ASCII letters, digits, underscore, period or hyphen, plus an optional trailing numeric version accepted as a compatibility extension. Unicode lookalike hyphens are flagged with a suggested ASCII-hyphen spelling; they are **not silently repaired**.

The original group boundaries are preserved, but rules from repeated groups matching the chosen token are combined for evaluation.

## User-agent selection and special handling

The catalogue contains more than 140 user-agent entries, organized into search, AI and LLM, European search/open-web, image, news, social-preview, SEO, scraper and miscellaneous categories. Entries may have primary categories, additional group tags, notes, fallback identities, and documented or uncertain wildcard behavior. Catalogue inclusion **does not** prove that an identifier is active, official or verifiable.

- For a selected crawler, the matcher first looks for groups matching its dedicated robots.txt product token.
- If no dedicated group exists, it searches the catalogue's ordered fallback tokens. Example: a configured Googlebot-Image entry may fall back to Googlebot.
- If no dedicated or fallback group exists, the ordinary `User-agent: *` group applies unless the catalogue marks the crawler differently.
- Some documented special crawlers ignore wildcard groups. Where wildcard applicability is undocumented, a present wildcard group produces **Inconclusive** instead of a guessed verdict.
- Some agents are explicitly marked as ignoring robots.txt; the checker reports its model's allowed status with a qualification, not confirmed accessibility. The `Perplexity-User` entry is marked *may ignore robots.txt*, yielding Inconclusive when evaluated rather than an unsupported definite permission verdict.
- `Google-Extended` and other similar entries may represent robots.txt control tokens rather than separate HTTP crawlers. A product token is not necessarily identical to a full HTTP `User-Agent` request header. Full header strings can also be spoofed.

## Rule matching and precedence

The matcher evaluates the URL pathname **plus query string** after removing the fragment. It interprets `*` in path rules as an arbitrary character sequence and a trailing `$` as an end anchor; these are **path-rule** operators, not user-agent token wildcards.

Matching normalizes percent-encoded unreserved ASCII characters while preserving encoded reserved characters such as `%2F`, `%2A` and `%24`. Literal UTF-8 octet length, excluding wildcard operators and the terminal anchor, is used to rank matching rules. The most specific applicable path rule wins. If equal-specificity Allow and Disallow rules conflict, Allow wins. If no rule matches, the default permission is Allowed.

Example:

```text
User-agent: *
Disallow: /drafts/
Allow: /drafts/public/
```

`/drafts/notes` is Blocked; `/drafts/public/overview` is Allowed.

The model is influenced by RFC 9309 and documented crawler behavior; it is not a guarantee of identical behavior in every real crawler implementation.

## Results

| Status | Meaning |
| --- | --- |
| **Allowed** | An Allow rule wins, no applicable restriction matches, a verified absent robots.txt results in default allow for its origin, or a specially classified fetcher ignores robots.txt under the model. Examine the explanation. |
| **Blocked** | The selected crawler's applicable Disallow rule wins under the matching model. |
| **Inconclusive** | The tool cannot make a reliable determination, such as an invalid URL, uncertain special-crawler wildcard applicability, potential robots.txt noncompliance or an external-origin resource. |

The winning-directive field provides the matching rule and line number, or a descriptive default/special-case explanation. Click a result with a line number to locate and temporarily highlight it in the editor. The copy icon copies the appropriate `User-agent:` declaration.

**Nuance in the current implementation:** In ordinary multi-crawler URL mode, an empty editor with no verified live file currently returns **Allowed** with a notice that live restrictions have not been verified. It is not automatically marked Inconclusive. This means “default allow in the supplied test rules,” not verified permission at the target origin.

The small indicator beside the primary URL represents validity and completeness of selected evaluations; it is **not** a combined crawl-permission verdict.

## Multiple-URL testing

The tool evaluates the main target plus up to ten additional distinct URLs against the same editor rules and selected crawlers. URLs are deduplicated after URL parsing/normalization where possible. Closing the additional-URLs panel clears its contents. A mismatch between the fetched robots.txt origin and the primary target origin triggers a warning, but deliberately does not prohibit hypothetical cross-origin experiments.

## Static resource checking

Enabling **Check resources** switches to a single selected crawler (initially Googlebot), turns off auto-check, disables multi-URL evaluation and bulk agent selection, and requires explicit **Check URL**. Disabling the mode restores prior crawler selections and auto-check state.

The tool fetches the target page's returned HTML, parses it using `DOMParser`, respects a valid HTML `<base href>`, and identifies distinct HTTP(S) resource URLs referenced in initial markup, including:

- Stylesheets and scripts, including modulepreload resources.
- Images, responsive `srcset` candidates, icons and video posters.
- Recognized preload hints for styles, scripts, images, fonts, video and audio.
- Video, audio and source element URLs.

It resolves relative URLs, discards fragments, and deduplicates discovered URLs. It **does not execute JavaScript**, perform browser rendering, inspect loaded CSS or script dependencies, or discover resources introduced dynamically after initial HTML retrieval.

A resource on an external origin is **Inconclusive** because that origin needs its own robots.txt. When the editor has a known fetched source origin different from the scanned page origin, a mismatch is also Inconclusive. Hypothetical editor rules can be evaluated when no source origin is established, with an explanatory qualification.

With Googlebot as the selected resource agent, image URLs are evaluated as Googlebot-Image and video URLs as Googlebot-Video, with their configured fallback-to-Googlebot behavior. Other resource types retain Googlebot. If another crawler is selected, the selected crawler is used for its resources. A result describes theoretical robots.txt access, **not successful fetching of each resource**.

Results display resource type, per-resource status, winning directive, explanatory notes and Allowed/Blocked/Inconclusive totals. A loading indicator disappears after evaluation. Changes to inputs invalidate or mark prior scan results stale until explicitly rechecked.

## Local editor and limits

- Local `.txt` files are read with the browser File API, not uploaded to the site. Files over 2 MiB are rejected; decoding requires valid UTF-8.
- The editor displays line numbers, warnings, byte count, and a prominent 500 KiB advisory corresponding to Google's documented file-size limit. **The implementation warns but does not truncate its own local parser input at 500 KiB.**
- Current warnings in the on-page note are condensed to the first three, plus a count of additional warnings.
- Copy and download functions operate on editor text, not on the live website. Ctrl/Cmd+S downloads the current editor content as `robots.txt` when nonempty.
- Editor and result highlights are temporary and purely visual.

## Operational and SEO boundaries

Robots.txt is a cooperative crawling protocol, not authentication, a data-use license, or a guaranteed deindexing mechanism. Allowed does not mean that a page will be crawled or indexed; Blocked does not mean it will never appear in a search index. `noindex` requires a crawler to be able to access the relevant page or response header. Resources on subdomains or other origins have separate robots.txt scopes. Cached policies, network failures, crawler-specific exceptions and infrastructure rules may produce outcomes different from the simulation. Verify real behavior using server logs and the crawler operator's own tools.

## References

- [RFC 9309 — Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Google robots.txt interpretation](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google open-source robots.txt parser](https://github.com/google/robotstxt)
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots)
- [Original tool, fuller human-oriented explanations and interface](https://alexanderkyriakou.eu/ak/robots-txt-checker)

## Copyright, reuse and attribution

Software implementing the tool's parser, matching logic, crawler catalogue and dedicated interactive functionality is offered under **CPAL-1.0** with the Original Developer and Attribution Information identified in [the accompanying project license document](https://alexanderkyriakou.eu/assets/licenses/robots-txt-checker/robots-txt-checker-LICENSE.md). CPAL includes network deployment, source-availability, change-documentation, and GUI attribution requirements; do not represent it as a simple attribution-only permissive license.

The original explanatory content, original design elements and original diagrams are licensed separately under **CC BY 4.0**, with appropriate credit, source link and change indication. Third-party material remains subject to its own terms.

**Original project:** [Robots.txt Checker by Alexander Kyriakou](https://alexanderkyriakou.eu/ak/robots-txt-checker).

AI agents may cite this technical documentation for features and limitations, but should not assert verified crawler compliance, indexing or endorsement on its basis. This attribution request is not a change to either license.
