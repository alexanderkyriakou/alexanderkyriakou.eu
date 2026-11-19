---
title: "When robots.txt fails: HTTP errors, redirects, and caching"
subtitle: "A 404 on robots.txt can be perfectly fine. It depends on which rules you expected the crawler to find."
url: "https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching"
author: "Alexander Kyriakou"
published: "2026-11-19"
topics:
  - seo
image: "https://alexanderkyriakou.eu/assets/images/thoughts/robots-txt-errors-redirects-caching/white-daisies-sunlit-grass.webp"
image_alt: "Ground-level close-up of white daisies with yellow centres blooming in sunlit green grass, with shallow depth of field blurring the foreground and background."
---

# When robots.txt fails: HTTP errors, redirects, and caching

> A 404 on robots.txt can be perfectly fine. It depends on which rules you expected the crawler to find.

I'd be quite happy to see a `404` for `/robots.txt` on a site with nothing to restrict. Googlebot can carry on crawling. What would bother me is finding that same 404 on a site whose robots.txt contains three hundred carefully maintained rules. Someone could spend a whole afternoon fixing those rules and Googlebot would still be getting a 404.

That's why I like to see the request for the file alongside the file itself. The [HTTP response](#what-did-the-request-for-robotstxt-return) tells me whether Googlebot got any text to work with. If the request [went to another host](#which-host-owns-the-rules-after-a-redirect), I'd want to read what that host served. And if the logs show `304 Not Modified`, the body is omitted by design, so working out whether Googlebot could crawl a URL depends on [the copy it already had](#why-a-fixed-file-can-still-produce-yesterdays-crawl).

## What did the request for robots.txt return?

First, pin the status code to a URL. A `403` on `/archive/notes` denies that request. A `403` on `/robots.txt` denies the request for the *instructions*. Googlebot can still ask for the notes, and if the notes return `200`, it can read them. If they require a login, enforce that on the notes themselves.

The Robots Exclusion Protocol distinguishes an unavailable file from an unreachable one. With a client error, it permits crawling. When the service is unreachable, the starting assumption is a complete crawl restriction, with provisions for cached rules and prolonged failure. Individual crawlers document their own behaviour; in my [how robots.txt works](https://alexanderkyriakou.eu/ak/robots-txt-checker#what-robots-does) section, I summarise RFC 9309 and what Google documents.

**Googlebot's next step after requesting `/robots.txt`**

| Fetch result | Effect on crawling |
| :--- | :--- |
| `200` | Google reads the response body and applies the rules it can parse. An empty file supplies no restrictions. |
| `301`, `302`, `307` or `308` | Google follows the HTTP redirect. The destination's response determines whether it gets any rules. |
| `304` | On a conditional fetch, the stored body still supplies the rules. There's no new file in this response. |
| `401`, `403`, `404`, `410` or other `4xx` (except `429`) | Google assumes there are no robots.txt restrictions. Returning a 403 or a WAF 406 or 451 for this one path can therefore open up crawling elsewhere. |
| `429` | Google treats rate limiting as a server overload signal. This is the exception to its ordinary 4xx handling. |
| `5xx` or network failure | Google pauses crawling and retries the file. What happens next depends on how long the failure lasts and whether Google has an earlier copy. |

That 429 exception matters if a rate limiter covers the entire host. A healthy origin can be serving the right file while the CDN tells a crawler it's making too many requests, so check the client-facing CDN logs; an edge-blocked request may never reach the origin log at all.

## How long does Googlebot wait after a server error?

Say you remove a restriction on `/archive/`. The updated file reaches the origin on Monday, but requests for `/robots.txt` start timing out before Google fetches it. Under Google's server-error policy, the sequence works like this.

1. **First 12 hours.** Google suspends crawling the site and keeps retrying robots.txt. Previously allowed pages can go quiet too.
2. **Next 30 days, if the failure persists.** Google uses its last good copy. In our example that copy still disallows the archive, so other pages can receive visits again while the archive stays quiet. Without a cached copy, Google assumes there are no restrictions during this phase.
3. **If the failure continues beyond that period.** Google considers the site's wider availability. If the site is generally accessible, it can crawl without robots.txt restrictions. If availability problems affect the site more broadly, Google stops crawling it. In both cases it keeps checking for the file.

A DNS failure, an expired or misconfigured TLS certificate, or an interrupted connection can start the same investigation even though there's no HTTP status to put in the incident report. Anchor the timeline to when Google's fetch failed rather than Monday's deployment timestamp. Other traditional search engines such as Bingbot also back off on unreachable responses under RFC 9309, though they don't publish Google's specific 12-hour and 30-day thresholds.

## What happens when an AI search crawler can't fetch robots.txt?

Googlebot's outage timeline matters for [AI Overviews and AI Mode](https://developers.google.com/search/docs/appearance/ai-features) because both draw on Google Search. A pause in crawling can delay discovery of new pages. If a page was already indexed, a failed robots.txt request alone tells us very little about whether it can still appear as a supporting link.

For ChatGPT Search, I'd look for [`OAI-SearchBot` in the CDN logs](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt). Say the CDN serves Googlebot the file directly but redirects OAI-SearchBot to a bot challenge. Both requests can end in a 200. Google got the rules, OpenAI got an HTML page, and Search Console can only show you Google's copy. OpenAI sometimes adds a `robots.txt` marker to the user-agent string for these requests, which helps if your logs omit the path.

OpenAI says changes to robots.txt can take about 24 hours to affect search. Perplexity gives changes up to 24 hours and identifies `PerplexityBot` as its search crawler. Those timings describe a rule change. Neither guide says how long the crawler keeps an old copy when the next fetch returns 503. If you see `ChatGPT-User` or `Perplexity-User` visit the archive in the meantime, that's a user-requested fetch. The search crawler may still be working from a different copy.

The same distinction matters for `Claude-SearchBot` and `MistralAI-Index` (covered alongside Perplexity in my [How AI search products handle robots.txt, noindex, and canonical URLs](https://alexanderkyriakou.eu/ak/ai-search-robots-txt-noindex-canonical)). Both are search crawlers with separate agents for user requests. Their published guides identify which agent to look for without giving a retry schedule for a robots.txt outage, so after a 503 at noon you have to watch the logs for the next fetch rather than applying Google's 12-hour window.

## Which host owns the rules after a redirect?

Suppose `https://yourdomain.eu/robots.txt` redirects to `https://static.yourdomain.eu/policies/main.txt`. The file there says `Disallow: /archive/` for all crawlers. Under the protocol's redirect rules, that instruction applies to `https://yourdomain.eu/archive/` because the original request establishes the scope, leaving `static.yourdomain.eu`'s own archive unaffected.

The destination could equally be `https://cooldomain.eu/policies/main`. A subdomain, an entirely different domain, even a path without a file extension can serve the rules. Each site using that shared file needs its own working route from `/robots.txt`. If the central server goes down, [test the redirect and final rules](https://alexanderkyriakou.eu/ak/robots-txt-checker) for each affected site.

This comes up in migrations. If the old hostname redirects *every* path to the new hostname, it may redirect its robots.txt too. Say the new file disallows `/archive/`. A crawler fetching rules for the old host can inherit that restriction and never request the old archive URLs to see their page-level 301s. I'd test the old host's robots.txt and one old page URL separately before deciding the migration redirects work.

The RFC recommends following at least five consecutive redirects, including across hosts. Beyond five, a crawler may give up. Google describes an exhausted chain as equivalent to a missing file. Count the HTTP hops, including the HTTP-to-HTTPS and bare-host-to-www redirects. A redirect loop can discard the restrictions you thought the final file would supply. A login page with a JavaScript redirect is another case entirely. Google's robots.txt fetcher won't follow that script.

Start each test on the exact scheme, hostname and port of the page you're investigating. `https://yourdomain.eu:8443/` has its own robots.txt scope.

### Can a canonical HTTP header point the crawler to another rules file?

Say `/robots.txt` returns `200 OK` with a rule disallowing `/archive/`. The response also carries this header:

```http
Link: <https://cooldomain.eu/policies/main>; rel="canonical"
```

The [canonical link relation identifies a preferred version of duplicate content](https://www.rfc-editor.org/rfc/rfc6596.html#section-3), and the robots protocol defines no step that fetches rules from that link. Because the crawler has already received a successful response with a parseable archive rule, that rule applies regardless of what the canonical target says, and if the 200 response were empty, the header would still leave the crawler with no rules. Centralising a file requires an HTTP redirect with a `Location` header or serving its contents directly at the root path.

### What if the o in robots.txt is Greek?

Look closely at `/rοbοts.txt`. Both round letters are Greek omicrons (`ο`, U+03BF). The standard lookup path has two Latin letters (`o`, U+006F). The difference is easier to see in a request log: the Greek spelling can appear as `/r%CE%BFb%CE%BFts.txt`. Those bytes identify a different path. By comparison, `%6F` encodes the Latin o itself, which [URI normalization treats as equivalent](https://www.rfc-editor.org/rfc/rfc3986.html#section-6.2.2.2) to the literal letter.

If only the Greek spelling returns 200 and the ordinary `/robots.txt` returns 404, Google sees a missing file. It has no reason to try visually similar names. If the ordinary path redirects to the Greek spelling, the crawler can follow it and use the resulting rules for the original site. An internal rewrite can also work: the server can read a file with any name on disk, provided a GET for the ordinary public path returns the intended rules.

## When 200 OK delivers the wrong rules

Here's an easy one to miss in uptime monitoring. An application routes every unknown path to its homepage, including `/robots.txt`. The response is fast, the status is green, and the first line is `<!doctype html>`. Google tries to extract valid robots.txt lines from the body it received. A typical homepage gives it no restrictions. A help page with a plain-text example on separate lines could, rather awkwardly, supply some.

The same test catches a consent page or a bot challenge returned with `200`. Inspect a full GET response without login cookies, checking the body alongside `Content-Type` (which should be UTF-8 plain text), since a HEAD request omits the body and will hide a login form served with a `200`. Check the raw encoding too: a file saved as UTF-16, a common Windows or PowerShell accident, can serve a clean `200` and look normal in an editor while breaking line-by-line rule matching for parsers expecting UTF-8 bytes.

Even the right-looking text can be incomplete. Google ignores content beyond 500 KiB (512,000 bytes). If a generator emits thousands of individual paths and appends the archive rule at the end, that rule can disappear from Google's view while remaining perfectly readable in your editor. Compare the size and position in the fetched body. Where a directory rule would replace a long list, test it against a path you want blocked *and* a neighbouring path you want crawled.

### A robots.txt you can read in a browser, and one you can play

On November 19, [Gary Illyes's robots.txt](https://garyillyes.com/robots.txt) returned 200 with `Content-Type: text/html`. The HTML source puts `User-agent: *` and `Allow: /` on their own lines inside an HTML comment. Your browser hides the comment. A parser reading the raw lines can still recognise the group and its rule. Google explicitly describes [trying to extract valid rules from an HTML response](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#file-format).

On the same date, [John Mueller's robots.txt](https://johnmu.com/robots.txt) returned 200 with `Content-Type: audio/wav`. It's playable audio. Near the beginning of the WAV file is a `JUNK` chunk containing ordinary lines of robots.txt, including a wildcard group with `Disallow: /`. The audio player skips that chunk. A sufficiently tolerant robots parser can read the text directly from the bytes, as John explains in [his account of building the WAV file](https://johnmu.com/2025-side-effects/). Nobody needs to transcribe the music.

Both sites serve their rules at the standard `/robots.txt` path using nonstandard formats. Even then, format tolerance has limits: a JSON object containing `{"Disallow":"/archive/"}` wouldn't express a robots rule just because it contains familiar words. For predictable behaviour across crawlers, serve the instructions as UTF-8 `text/plain`, and inspect the raw body before guessing what a particular crawler extracted from anything else.

## Why a fixed file can still produce yesterday's crawl

At 09:00 the origin serves the revised file. At 09:10 you purge the CDN and see the revision in your browser. Neither event tells us whether Google has asked for robots.txt since 09:00. There are two copies worth accounting for here. Your CDN can reuse a response when Google asks, and Google can reuse its own copy without asking the CDN at all.

RFC 9309 gives crawlers a [24-hour caching guideline](https://alexanderkyriakou.eu/ak/robots-txt-checker#caching), with an exception when the file is unreachable. Google generally caches the file for up to a day, can adjust that period based on `Cache-Control: max-age`, and can keep an older copy during fetch failures. Setting `max-age=0` or `no-store` won't force Googlebot to refetch `/robots.txt` before every URL request, though a short `max-age` helps prevent a week-long CDN default from stretching Google's cache past a day. Either way, twenty-four hours after deployment is a poor deadline for declaring the fix unsuccessful.

### What if Google comes back after the fix and still gets a 404?

Back to those three hundred rules. You restore the file and the origin serves 200, but the CDN [can cache a 404 response](https://www.rfc-editor.org/rfc/rfc9111.html#section-2) too. Google can request the correct URL after your fix and still receive the earlier 404 from the edge. Check the client-facing status on that request and the CDN's error-cache lifetime. If the cached miss is still fresh, purging that URL at the CDN can fix the next response without another deployment.

### Can one crawler receive another crawler's file?

If the application chooses a robots.txt body using the request's `User-Agent`, two crawlers can ask for the same URL and need different responses. A shared cache keyed only by URL can hand the first crawler's copy to the second. Both get a convincing 200. Compare the bodies served at the edge and check whether its cache key distinguishes those requests. [The Vary header tells an HTTP cache which request headers matter](https://www.rfc-editor.org/rfc/rfc9111.html#section-4.1), so check how your CDN handles `Vary: User-Agent` if you use it. If all you need is a different rule per crawler, one static file with separate user-agent groups avoids that dependency altogether.

### What if the log shows a 304 after the edit?

Suppose the crawler has the old file tagged `"rules-v7"`. It sends `If-None-Match: "rules-v7"`. If the effective rules changed, a correctly implemented validator for the new representation won't match, and an otherwise successful GET returns the new body. A [304 response revalidates the stored response](https://www.rfc-editor.org/rfc/rfc9111.html#section-4.3.4). An endpoint that mistakenly reuses the old tag can therefore keep the old restriction in use even though the crawler came back exactly as you'd hoped.

Try the old validator against the public URL and compare it with an unconditional GET. If the ordinary GET contains the new rules and the old tag still earns a 304, inspect how the application or CDN generates validators. If both requests return the old version, look at cache freshness and routing first—keeping in mind that an `Age` header only reflects intermediary caching, while Google's own cache duration stays invisible from your headers.

## Which copy did the crawler actually see?

For a quick check on the archive example, open an incognito window with DevTools on the Network tab, tick **Disable cache** and **Preserve log**, and request `https://yourdomain.eu/robots.txt`. Watch the redirect chain, the final status, and headers such as `Content-Type`, `Cache-Control`, `Age`, and `ETag`, then inspect the raw response in the Network panel rather than the rendered tab. Keep in mind that a browser executes JavaScript and follows up to twenty redirects, so it can pass a bot challenge or long redirect chain that would stop a crawler.

When I want a clean non-browser capture, or an easier record to attach to an incident ticket before changing another rule, I grab the public response with `curl`. The headers file keeps every HTTP response in the chain, while the body file contains only the final response.

```bash
curl -sS -L --max-redirs 10 -D robots-headers.txt -o robots-body.txt https://yourdomain.eu/robots.txt
```

Ten is a diagnostic limit for this command. If curl reaches a file on hop eight, the useful finding is the eight hops. Read the status and `Location` at each step, then inspect the body. If you suspect a bot challenge or `Vary: User-Agent` cache mismatch, repeat the check with a crawler string such as `-A "OAI-SearchBot/1.0"` or Googlebot's user-agent, keeping in mind that any WAF verifying reverse DNS or published IP ranges will still treat `curl` differently from the real bot.

Next, open the [robots.txt report in Google Search Console](https://support.google.com/webmasters/answer/6062598?hl=en) and select the affected host. Compare the fetched text and check time with the deployment. Its version history covers 30 days and records changes in the file or fetch result, so a gap between versions can include identical fetches. For a critical fix you can request a robots.txt recrawl there. A visit to the newly allowed archive is a separate event.

Line up that time with the CDN access logs, allowing for the report's local time zone. Check the client-facing response and, if the request reached the origin, compare the origin response. When the conclusion depends on a request being Googlebot's, [verify the request against Google's published IP ranges or DNS procedure](https://alexanderkyriakou.eu/ak/crawler-ip-verifier). A user-agent string alone is easy to copy.

Once I have the fetched text, I'd paste that version into my [robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker), select the crawler, and test one actual archive URL. Then I'd repeat it with the revised text. If the old file blocks the URL and the new one allows it, the rule change does what you intended.

And if Search Console already shows the new file, the rule allows the exact URL, and the logs still show no visit? I'd leave robots.txt alone for a bit.

---

* **Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)
* **Published:** 2026-11-19
* **Topic:** [seo](https://alexanderkyriakou.eu/thoughts/seo)
* **Proofreader:** Gemini Hydrogen