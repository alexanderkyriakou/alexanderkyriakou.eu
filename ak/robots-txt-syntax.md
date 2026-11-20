---
title: "Robots.txt syntax, RFC 9309, and the rules crawlers actually follow"
subtitle: "Conflicting Googlebot rules, a sneaky Yandex exception, and a typo only a parser could love."
url: "https://alexanderkyriakou.eu/ak/robots-txt-syntax"
author: "Alexander Kyriakou"
published: "2026-11-20"
topics:
  - seo
image: "https://alexanderkyriakou.eu/assets/images/thoughts/robots-txt-syntax/painted-door-kos-2019.webp"
image_alt: "An arched brown door with a white doorknob painted on a textured cream exterior wall, flanked by a painted blue flowerpot on the left and grey cartoon mice on the right, with tall green grass growing across the foreground. Kos, 2019"
---

# Robots.txt syntax, RFC 9309, and the rules crawlers actually follow

> Conflicting Googlebot rules, a sneaky Yandex exception, and a typo only a parser could love.

Googlebot appears twice in the same file. The first group allows the whole site. The last one blocks it. In between, there's a wildcard group that blocks it too. **Googlebot can crawl the site.** Now change the last slash to `/drafts/` and Googlebot can still crawl the site, except for a directory you care about.

The answer depends on [which lines belong to Googlebot](#where-does-one-user-agent-group-end), then on [which rule matches the requested URL](#which-rule-wins-for-this-url). If you already have a file open and a crawler doing something odd, start with the [crawler name](#which-parts-are-case-sensitive) or try the [rule-matching tests](#rule-matching-tests-you-can-repeat). There's a particularly easy mistake to miss if you copied Perplexity's name from a table. I did.

## Who are we opening the site to?

Someone reads a page, a search engine indexes it, a social network fetches a link preview, and an assistant retrieves an answer for someone who may never visit. From the server's side, all four look like successful page requests. On a small personal site that traffic barely registers. On an ecommerce store or a large publishing site, it turns into real strain when search crawlers, AI scrapers and preview fetchers all hit sorting parameters, product filters, internal search pages and deep archives at once.

There is some scale behind that traffic. Across its customer base in 2025, [Cloudflare attributed 4.2% of HTML requests to AI bots](https://blog.cloudflare.com/radar-2025-year-in-review/) and another 4.5% to Googlebot, which it counted separately. Almost 9% of HTML requests on that network came from those two buckets alone, before counting Bingbot, social fetchers or unlabelled scrapers. When a big catalogue creates thousands of URL combinations, letting every bot crawl them freely wastes bandwidth.

So is robots.txt a bit decorative? It can feel that way, since the decision to skip a URL happens at the crawler's end. Even so, disallowing internal search paths or messy filter combinations keeps cooperating crawlers away from thousands of heavy URLs you never wanted them hitting. That takes real load off the origin. It simply won't stop a scraper that ignores the file, or protect private account pages where only the server itself can refuse access.

## Where does one user-agent group end?

Here's the Googlebot puzzle in a smaller file. You can add Bingbot, ClaudeBot and another twenty consecutive user-agent lines above the first rule. They all share it. Even the blank line between Googlebot and Qwantbot changes nothing for Google.

```
User-agent: Googlebot

User-agent: Qwantbot
Allow: /

User-agent: *
Disallow: /

User-agent: Googlebot
Disallow: /
```

Read down until you reach the first access rule. Every user-agent collected above it belongs to that group. Once a group has a rule, the next user-agent starts a new group. Blank lines and comments help people read the file. They don't close a group under [the RFC 9309 grammar](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2). A rule above the first user-agent should be ignored. A final group can have no rules at all.

For Googlebot, the first and third groups have the same specific token. [Google combines those groups](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#grouping-of-lines-and-rules), leaving two applicable rules, `Allow: /` and `Disallow: /`. The wildcard group supplies neither. Both paths match every ordinary page equally well, so Google gives the tie to `Allow`. A compliant crawler with no matching named group gets the wildcard block. With neither a named match nor a wildcard group, it can crawl.

**Line order matters when it changes who owns a rule.** Move Qwantbot below the first `Allow` and it no longer shares that allowance. Reversing two access rules *within* a group is a different edit. Google still compares their specificity. This is where the "read it from top to bottom" habit from an ordered ruleset can land you in trouble.

### Can a sitemap accidentally join two groups?

```
User-agent: Googlebot
Sitemap: https://yourdomain.eu/sitemap.xml
User-agent: Bingbot
Disallow: /proofs/
```

Googlebot is blocked from `/proofs/` here. Google recognises `Sitemap` for discovery, but skips it when constructing access-rule groups. Both names therefore sit above the same first access rule. [The RFC permits additional records](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.4) on the condition that they don't interfere with parsing the standard ones. A blank line around the sitemap won't rescue this layout.

### Does a named group inherit the site-wide block?

Say the wildcard group disallows `/proofs/`. You add a specific Googlebot group with just `Disallow: /search/`. Googlebot can now fetch `/proofs/`. Its new group replaced the wildcard fallback for that crawler. If both restrictions matter to you, both paths need to appear in the applicable rules. This is the edit I'd pay closest attention to when adding a new crawler to an established file.

## Which rule wins for this URL?

[Section 2.2.2 of RFC 9309](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.2) starts the comparison at the first byte of the path and requires the most specific match, measured in octets (bytes). If nothing matches, access is allowed. For equivalent conflicting rules, the RFC says the crawler **should** prefer `Allow`. [Google documents its tie-break](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#order-of-precedence-for-rules) as the least restrictive rule, including when wildcard patterns conflict.

```
User-agent: *
Disallow: /rides
Allow: /rides/public/
Disallow: /rides/public/drafts/
```

For `/rides/public/athens`, the first two patterns match and the longer allowance wins. Add `drafts/` before `athens` and the third pattern wins. Less obviously, `/rideshare` is blocked too. A prefix has no idea where you intended a word to end. If you mean the directory and its slashless landing page, write two rules, `Disallow: /rides/` and `Disallow: /rides$`. The second one is exact, so remember to test query variants of that landing page.

### What does the dollar sign buy you?

```
User-agent: *
Disallow: /
Allow: /$
```

Only the bare root wins the exception. A request for `https://yourdomain.eu` has a root path of `/`. Request `/?ref=home`, though, and the query follows the slash. Google compares the path **including the query**, so the dollar sign can no longer match there. A browser fragment such as `/#map` stays on the client. The server still receives a request for `/`.

Remove `Disallow: /` and the whole site becomes crawlable. `Allow: /$` expresses permission for one URL. It has no effect on the default for everything else. And with the block in place, the homepage's own stylesheet, script and image requests can all be disallowed. Fetching the HTML and rendering the page as a visitor sees it are two different tests.

### How much does a wildcard consume?

An asterisk in a **path** matches zero or more characters, including slashes. So `/maps/*.gpx$` matches both `/maps/.gpx` and `/maps/attica/coast.gpx`. It misses `/maps/coast.gpx?v=2`. A trailing asterisk on a simple prefix buys you nothing. `/maps/` already covers descendants. A question mark is a literal query delimiter here. Parentheses, brackets and pipes won't give you regular-expression alternatives.

The asterisk can even match its way into a query. `Disallow: /*.gpx$` catches `/download?file=coast.gpx`, although the path itself has no extension. Similarly, `Disallow: /*?sort=` catches a first parameter named sort but misses `/shop?colour=green&sort=price`. If you need both positions, add `Disallow: /*&sort=` and test an actual URL from each case.

### Is `Disallow: *secret-pages*` valid?

The missing slash matters more than the extra asterisk at the end. [RFC 9309's grammar for a nonempty path](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2) requires it to begin with `/`. To match the text anywhere, write `Disallow: /*secret-pages`. Once the parser reaches the end of that prefix, anything can follow it.

That rule also catches `/not-secret-pages-after-all` and `/search?q=secret-pages`. If the intention was to keep a crawler out of one directory at the root, `Disallow: /secret-pages/` is a closer fit. Try both spellings in the [test cases below](#rule-matching-tests-you-can-repeat). The parser used there accepts even the missing-slash version. Seeing a green tick in a tester tells you something about that parser, but it can still leave you with a rule another crawler reads differently.

## What does this Yandex example allow?

```
User-agent: yandex
User-agent: yandexbot
Disallow: /

User-agent: yandex
Allow: /$
```

The question here is whether the main indexing bot gets the root allowance at all. [Yandex's user-agent documentation](https://www.yandex.com/support/webmaster/en/robot-workings/user-agent) gives a worked example where the specific YandexBot group takes priority over the broader Yandex group. Following that model, I'd expect the main indexing bot to pick the first group and be blocked even at the root. The second group only names the family. I'm inferring that from Yandex's documented example, as I haven't tested this mixed file against a live YandexBot crawl.

If the intention is to allow just the root for the main indexing bot, put `User-agent: YandexBot`, `Disallow: /` and `Allow: /$` together. [Yandex gives the same root exception](https://www.yandex.com/support/webmaster/en/robot-workings/allow-disallow) in its path-matching examples. Keeping the two rules together also makes the intention clear to the next person editing the file.

### Which Yandex robots need an explicit name?

The main Yandex indexing bot can follow the wildcard group. [YandexCalendar is an interesting exception](https://yandex.com/support/webmaster/en/robot-workings/check-yandex-robots.html). It downloads calendar files when a user asks, and those files often live in directories owners have excluded from search. Yandex documents that this client can skip the general rules. To tell the calendar fetcher itself to stay away, name it:

```
User-agent: YandexCalendar
Disallow: /
```

There's a similar exception closer to home for many SEOs. [Google says its AdsBot crawlers must be named explicitly](https://developers.google.com/crawling/docs/robots-txt/useful-robots-txt-rules). Finding a request after publishing a wildcard block is a reason to check which service made it before concluding that the operator ignored the file.

## Which parts are case-sensitive?

In `dIsAlLoW: /Images/`, the odd capitalisation on the left is harmless. On the right, it matters. Google will block `/Images/logo.svg` and allow `/images/logo.svg` if this is the only matching group's only rule. Even if your server serves the same file at both addresses, the crawler evaluates the address it wants to fetch.

For user-agent group selection the RFC **requires** case-insensitive matching. For path matching it **recommends** case sensitivity. `Googlebot` and `googlebot` therefore name the same product token under the standard. A full HTTP User-agent header can include a browser, a version and a contact URL. Use the operator's published robots.txt token. [Googlebot Smartphone and Desktop](https://developers.google.com/search/docs/crawling-indexing/googlebot) send different headers but share the same token. In the other direction, [Google-Extended has a robots.txt token](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended) without a separate HTTP user agent of its own.

### Can an asterisk stand in for part of a crawler name?

`User-agent: *` is the fallback. The RFC gives the asterisk that meaning only when it occupies the whole field. There's no standard `User-agent: *Bot` selector for names ending in "Bot". To give several crawlers the same rules, put their published tokens on consecutive user-agent lines.

[Google even accepts the spelling `Googlebot*`](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#order-of-precedence-for-user-agents), which makes this easy to misread. Google ignores the trailing text and treats it as `Googlebot`. The star adds no coverage. Likewise, `Yandex` works as a family token because Yandex recognises that name. Adding an asterisk won't turn it into a portable way to address an operator's entire fleet.

### The Perplexity hyphen I could barely see

```
Perplexity‑User
Perplexity-User
```

[My checker](https://alexanderkyriakou.eu/ak/robots-txt-checker) flagged the first spelling. The difference is the middle character. The first line contains a non-breaking hyphen (U+2011), the second an ASCII hyphen-minus (U+002D). You can see both spellings in [Perplexity's crawler table](https://docs.perplexity.ai/docs/resources/perplexity-crawlers), including the ASCII one in the example HTTP header, as of publishing this page. Lowercasing either string won't turn one dash into the other. The RFC's product-token grammar allows ASCII letters, underscores and hyphens, plus the standalone wildcard. A typographic hyphen falls outside it. So does the period in a token like `archive.org_bot`. An operator's historical name can fall outside that grammar too, which is worth checking before "fixing" someone else's token.

Correcting the hyphen fixes the declaration. It still leaves the question of purpose. Perplexity says `PerplexityBot` discovers content for search, while `Perplexity-User` makes user-requested fetches and generally ignores robots.txt. Getting the spelling exactly right can leave you with a request in the logs all the same.

### Why I keep the capitals in LinkedInBot

I observed case-sensitive behaviour with `LinkedInBot` while working on the checker, so I keep that exact capitalisation for LinkedIn previews. That's a narrower claim than saying every robots.txt parser needs a case-sensitive token comparison. For a repeat test, I'd change only the token casing, use fresh preview URLs to avoid a cached card, and inspect the actual requests. A missing preview image on its own can't tell you which rule LinkedIn read.

I'm after such cases, so if you've encountered any of them, please [let me know](https://alexanderkyriakou.eu/contact).

## Which bytes does the crawler compare?

Save the file as UTF-8 and serve it as plain text at the origin's lowercase ASCII `/robots.txt`. The filename matters even before a parser reaches line one. A Greek omicron looks quite at home in `/rοbots.txt`. It still sends the crawler to a different address if you use it in a link. Crawlers look up the ASCII spelling themselves.

In a rule value, `/café/` and `/caf%C3%A9/` represent the same UTF-8 bytes. That doesn't make every URL that *looks* like café equal. A precomposed é is `C3 A9`. An e followed by a combining acute accent is `65 CC 81`. If your CMS or CDN emits both forms, compare the actual encoded URLs before assuming one rule covers both.

Even where raw UTF-8 works for Google, writing the percent-encoded path directly in `robots.txt`, for instance `/%CE%B3%CE%AC%CF%84%CE%B1/` instead of `/γάτα/`, makes every crawler's life easier. In [Google Search Central's Non-Canonical Cabinet episode on robots.txt](https://www.youtube.com/watch?v=-jHONLQgE-s), Gary Illyes and Cherry Prommawin note that while Google accepts non-ASCII characters in paths, other parsers can skip or mishandle them unless they are percent-encoded.

[The RFC's percent-encoding examples](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.2) draw another important boundary. In a requested URI, an encoded unreserved ASCII character such as `%72` can be compared as `r`, so `/%72ides/` matches a rule for `/rides/` under the RFC. An encoded reserved slash, `%2F`, keeps its identity. `/rides%2Fprivate` and `/rides/private` can therefore give different results. Decoding the entire URL before testing loses exactly the distinction you're trying to inspect.

A literal hash in a rule starts a comment. Write `Disallow: /#draft` and you've effectively written `Disallow: /`. Use `%23` for a literal hash carried as path data. Likewise, [the RFC shows how to encode special characters](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.3) such as `%2A` for an actual asterisk and `%24` for a dollar sign. If your paths contain nested URLs in parameters, keep a copy of what went over the wire. [A discussion in Google's parser repository](https://github.com/google/robotstxt/issues/64) shows how even a worked example involving an encoded URL inside a URL can lead implementers to different readings.

## Empty rules, extensions and unusually musical files

`Disallow:` on its own has no path to block. Google ignores that empty value, just as it ignores an empty `Allow:`. Add `Disallow: /drafts/` to the same group and the drafts are still blocked. An empty line can't undo a populated rule. One slash is the entire difference between an empty disallow and a site-wide block.

A few familiar-looking fields have quite different jobs.

* **Sitemap** gives supporting consumers an absolute sitemap URL. Listing a disallowed page there helps advertise its address without granting permission to fetch it.
* **Crawl-delay** sits outside RFC 9309. [Bing describes a crawl window](https://blogs.bing.com/webmaster/2012/5/To-crawl-or-not-to-crawl%2C-that-is-BingBot-s-questi/) for its implementation. Google ignores the field. Copying the same value into both groups won't give you equal crawl rates.
* **Clean-param** lets you [tell Yandex which parameters leave the content unchanged](https://www.yandex.com/support/webmaster/en/robot-workings/clean-param). For example, a campaign tag may be disposable while a page number changes the list completely. It's a Yandex-specific signal about URL variants.
* **Noindex** inside robots.txt supplies no supported Google indexing instruction. Google reads a [noindex meta tag or HTTP header](https://developers.google.com/search/docs/crawling-indexing/block-indexing) when it fetches the resource. A matching disallow can prevent that fetch.

My favourite consequence of line-by-line recovery is [John Mueller's experiment putting robots.txt inside a WAV file](https://johnmu.com/2025-side-effects/). He arranged the bytes so a parser could pick out the directive lines while an audio player could play the file. It's a lovely demonstration of how much unrelated material a tolerant reader can skip. The format the RFC asks publishers to serve is still UTF-8 plain text. A less entertaining version of the same problem is [an HTML error page returned with a 200 status](https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching#body). Inspect the body before assuming the crawler received your rules.

File size can change an apparently obvious result too. [Google reads up to 500 KiB](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#file-format). The RFC sets 500 KiB as a **minimum** if a crawler imposes a parsing limit. A long generated list can put the one exception you need past Google's cutoff. Moving the exception above the cutoff can look like fixing rule order, even though it only moved the line back inside the readable 500 KiB.

## What does `__usage_ai-training` say about a page?

Suppose I'm happy for search engines to crawl the articles here, but the only material I want used for generative AI training is in `/ak/`. The proposed [machine-readable training preference signal](https://datatracker.ietf.org/doc/html/draft-kelley-aipref-training-preference-signal-01) lets me express that choice in familiar syntax. Those are two underscores at the start.

```
User-agent: __usage_ai-training
Disallow: /
Allow: /ak/
```

The group names a use of the content. A participating provider reads a preference against training for an article, and a preference in favour for `/ak/cool-article`. Its crawler still evaluates its own product token to decide whether it may fetch either URL. I wouldn't expect to find a visitor called `__usage_ai-training` in my logs.

Two edits that look cautious have quite different consequences under [the draft's lookup rules](https://datatracker.ietf.org/doc/html/draft-kelley-aipref-training-preference-signal-01#section-4.2). Change the user-agent to `*` and there's no shared training preference anywhere in the file, assuming this was the only policy group. The draft deliberately excludes the wildcard fallback from this lookup. Conversely, keep the policy token but give it just one line, `Disallow: /drafts/`. A lookup for `/articles/one` then returns allowed by default. The draft reads that as a preference **in favour** of training on that article. Leaving out the policy group altogether would have left the preference unspecified.

As of November 20 this is an individual Internet-Draft, and [provider rollout timelines vary](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#shared-preference) across Anthropic, OpenAI, Google and Microsoft. I'd keep existing provider-specific rules in place wherever their documented behaviour is something I'm relying on.

## Rule-matching tests you can repeat

Use each row as a fresh file starting with `User-agent: Googlebot`. Put the listed rules on separate lines, then request the path shown on `https://yourdomain.eu`. You can paste the file and absolute URL into my [multi-crawler robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker) and select Googlebot to inspect the winning directive.

**Google-style matching, one fresh group per row**

| Rules | Requested URL suffix | Expected result | Reason |
| :--- | :--- | :--- | :--- |
| `Disallow: /`<br>`Allow: /` | `/proofs/` | Allowed | Equal paths, Allow wins. |
| `Disallow: /`<br>`Allow: /$` | `/` | Allowed | The slash ends the URL. |
| `Disallow: /`<br>`Allow: /$` | `/?ref=home` | Blocked | The query defeats the anchor. |
| `Allow: /$` | `/contact` | Allowed | No rule matches. |
| `Disallow: /rides/` | `/rides` | Allowed | The trailing slash is absent. |
| `Disallow: /rides` | `/rideshare` | Blocked | The prefix is enough. |
| `Disallow: /maps/*.gpx$` | `/maps/.gpx` | Blocked | The wildcard can be empty. |
| `Disallow: /maps/*.gpx$` | `/maps/attica/loop.gpx?v=1` | Allowed | The extension is followed by a query. |
| `Disallow: /Images/` | `/images/a.svg` | Allowed | The capital I matters. |
| `Disallow: /#draft` | `/coast` | Blocked | The comment leaves a bare slash. |
| `Disallow:`<br>`Disallow: /drafts/` | `/drafts/a` | Blocked | The populated rule still matches. |
| `Disallow: /café/` | `/caf%C3%A9/menu` | Blocked | The UTF-8 bytes agree. |
| `Disallow: /rides/` | `/rides%2Fprivate` | Allowed | An encoded slash is distinct. |
| `Disallow: *secret-pages*` | `/archive/secret-pages/a` | Blocked | This parser accepts a missing leading slash. Outside the RFC grammar. |
| `Disallow: /*secret-pages` | `/archive/secret-pages/a` | Blocked | The slash-prefixed pattern matches the same URL. |
| `Disallow: /*secret-pages` | `/search?q=secret-pages` | Blocked | The wildcard reaches into the query. |
| `Disallow: /secret-pages/` | `/search?q=secret-pages` | Allowed | The root-directory prefix misses the query. |
| `Disallow: /maps/`<br>`Allow: /maps/index.html` | `/maps/` | Allowed | Index-document allowance. |
| `Disallow: /maps/`<br>`Allow: /maps/index.html` | `/maps/key` | Blocked | The directory exception stops at the slash. |

All 19 rows were checked with [google-robotstxt-parser 1.2.0](https://www.npmjs.com/package/google-robotstxt-parser/v/1.2.0), an independent JavaScript port of Google's matcher, alongside my own checker. These results describe runs on both parsers. A live fetch also depends on the operator and the server.

The last two rows are a curiosity from [Google's open-source matcher](https://github.com/google/robotstxt/blob/master/robots.cc). An allowance for an index document can also open the directory URL itself. The sibling page remains blocked. I'd write an explicit allowance for the directory URL if that's the policy I wanted another crawler to understand.

## Why can a blocked URL still show up in Google?

The puzzle at the start asks whether Googlebot may fetch a URL now. A search result tells you Google knows an address. Someone can link to a page Google has never fetched, or the page may already have been indexed when you added the block. In either case the URL can still appear. There's no backlink threshold or dependable expiry date you can infer from the file.

If Google explicitly reports a robots.txt block, inspect that URL and the applicable Googlebot group. A missing snippet by itself is weaker evidence. A publisher can also [suppress the snippet with nosnippet](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag#nosnippet). If the goal is removal through `noindex`, [Google needs access to read it](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical).

In the end, a robots.txt file only answers one narrow question: may this specific client ask for this specific URL? Pick three addresses you care about, test them against the exact token you meant to spell, and check the parser's answer before touching another rule. And maybe double-check your hyphens.

---

* **Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)
* **Published:** 2026-11-20
* **Topic:** [seo](https://alexanderkyriakou.eu/thoughts/seo)
* **Proofreader:** Gemini Hydrogen