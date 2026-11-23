---
title: "How to test robots.txt changes before publishing"
subtitle: "Test a toy shop's proposed rules against five outcomes, from blocking internal search to keeping a railway set's assembly guide crawlable."
url: "https://alexanderkyriakou.eu/ak/test-robots-txt-changes"
author: "Alexander Kyriakou"
published: "2026-11-23"
topics:
  - seo
image: "https://alexanderkyriakou.eu/assets/images/thoughts/test-robots-txt-changes/brighton-toy-and-model-museum-sir-alexander-great-central-railway-model-trains.webp"
image_alt: "Display case at the Brighton Toy and Model Museum featuring a green Gauge 1 clockwork locomotive named Sir Alexander with tender and Great Central Railway coach on the top shelf, alongside L.S.W.R. passenger coaches, Colman's Mustard Traffic and Bassett-Lowke wagons, station figures, and historical signage below."
---

# How to test robots.txt changes before publishing

> Test a toy shop's proposed rules against five outcomes, from blocking internal search to keeping a railway set's assembly guide crawlable.

## TL;DR: how to test robots.txt before and after publishing

To test a `robots.txt` change safely, grab the live file, test the exact URLs and crawlers that matter against both the old and proposed rules in [my robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker), and verify what the public host and crawlers actually receive after deployment.

* **Before editing:** [Save the live `/robots.txt`](#save-the-robotstxt-that-crawlers-can-fetch-today) from every affected origin (main domain, API, image CDN) using *Fetch Live* in the checker and check Google Search Console's 30-day version history.
* **What to test:** [Pair every URL you want to block with its closest useful neighbour](#choose-urls-that-could-prove-the-change-wrong); clean products, query variants, paginated collections, PDFs, and page assets. Across both named bots (such as `Googlebot`) and the wildcard/default group.
* **How to compare files:** [Run the same URL list in two tabs of the checker](#run-the-same-cases-against-the-current-and-proposed-files) (current vs. proposed) and enable *Check resources* on key templates. Watch for named groups dropping `User-agent: *` rules, prefix matches catching unintended folders, and broad `/*?` wildcards blocking variants or CSS/PDFs.
* **Staging and domain moves:** [Rehearse production rules locally or via Screaming Frog's custom override](#test-the-production-policy-while-staging-stays-private) while keeping staging behind authentication. On a [site migration](#what-should-the-old-domain-serve-at-robotstxt), keep old-URL redirects crawlable instead of blindly redirecting the old `/robots.txt`.
* **AI and edge cases:** [Test search, training, and user-fetch bots separately](#which-bots-are-you-writing-this-rule-for), watch for CDN-prepended rules and Google's 500 KiB limit, and preserve percent-encoded reserved slashes (`%2F`) in test URLs.
* **After publishing:** [Re-fetch the live URL in the checker and with `curl`](#check-what-went-live-including-a-request-with-the-old-etag) (including a conditional `If-None-Match` check with the old ETag), confirm the revision in Search Console, and [watch verified crawler logs](#watch-the-crawler-pick-up-the-change) rather than trusting spoofable `User-agent` strings.

Suppose a wooden toy shop wants crawlers to skip internal searches for train sets. Someone adds `Disallow: /search` and checks `/search?q=wooden+train`. Blocked, as intended. Now try `/search-by-age/ages-3-to-5`. That's a collection the shop has taken some care to put together, and the very same rule just blocked it.

Before publishing, I'd [save the file the site serves](#save-the-robotstxt-that-crawlers-can-fetch-today), [write down which URLs should change](#choose-urls-that-could-prove-the-change-wrong), then [run the same URLs and crawlers against both files](#run-the-same-cases-against-the-current-and-proposed-files). After publishing, check [what reached the public host](#check-what-went-live-including-a-request-with-the-old-etag) and [which version the crawler has picked up](#watch-the-crawler-pick-up-the-change).

## Save the robots.txt that crawlers can fetch today

Open the shop's public `/robots.txt` in your browser. If you can see the rules, press <kbd>Ctrl</kbd> + <kbd>S</kbd> (<kbd>⌘</kbd> + <kbd>S</kbd> on a Mac) and save the text as `robots.before.txt`. Note the URL and date. That's enough for a before-and-after comparison.

If you're ready to test a rule, you can [fetch the shop's robots.txt and try your URLs against it](https://alexanderkyriakou.eu/ak/robots-txt-checker) in the same place. Enter the shop's URL and choose *Fetch Live*. The rules appear in the editor. The tool is free and always will be, and currently supports more than 280 user agents. For this change I'd start with Googlebot and the default group.

For Google's copy, open the [robots.txt report in Search Console](https://support.google.com/webmasters/answer/6062598?hl=en), select the exact host and protocol, and copy the displayed rules. Open *Versions* to view the last 30 days of history. Google adds an entry when the contents or the fetch result changes. That history is particularly handy when someone remembers changing a rule last Tuesday and nobody kept a copy. Label it with Google's fetch date, since the public site may already serve a newer file.

Repeat this for each affected origin. The product page on `https://woodentoys.example`, its stock data on `https://api.woodentoys.example` and its photos on `https://img.woodentoys.example` can each have different rules. On a [domain move, test the old hostname too](#what-should-the-old-domain-serve-at-robotstxt). A crawler may still need it to reach the new product page.

## Choose URLs that could prove the change wrong

Write the expectation before opening a tester. For this wooden toy shop, I'd ask the teams handling search, merchandising and checkout to agree on five outcomes for cooperating search crawlers.

1. **Block internal search results.** The bare endpoint, query results and search subpaths should all be excluded, including for a crawler using the default group.
2. **Keep the shop-by-age collection crawlable.** The merchandiser's `/search-by-age/ages-3-to-5` page has a stable selection and links to products. Its unfortunate name is a good reason to test it.
3. **Keep basket sessions blocked.** The existing crawl restriction on `/basket/` should survive the release. Access controls separately protect any customer data.
4. **Keep product pages crawlable.** A crawler should still be allowed to fetch the wooden railway set, and the natural-finish variant linked from the collection.
5. **Keep the assembly guide crawlable.** The railway set links to a PDF with a revision number in its query string. Check the exact link a parent would follow to put the bridge together.

I'd build the list from three places. Sitemaps give you the pages the business wants found. Raw request paths from CDN or server logs give you the parameter orders, old routes and odd capitalisation that visitors and bots request. A browser's Network panel gives you the stock request, script or image that makes an apparently crawlable page useful. Add a newly launched toy that has never been crawled. By definition, last month's logs won't volunteer it.

* For each proposed restriction, take one URL inside it and the closest useful neighbour outside it. For the toy shop, take the age collection and one product linked from it, then include their nearest search equivalents. If the collection paginates, take page two as well.
* Include something that must *stay blocked*. An accidentally reopened search or basket path can generate enough requests to make the crawl chart look rather healthy.
* Keep the requested scheme, host, path and query intact. Use invented session values and strip personal information before sharing examples. Sorting every query alphabetically while preparing the list can erase the very variation you meant to test.

A useful row in the release review has the origin, exact URL, crawler token, expected decision and reason. Add the old decision and winning rule, then the proposed decision and winning rule. "Inconclusive" is worth recording too. Someone looking at the row later should be able to distinguish a deliberate exception from an accidentally missing rule.

## Run the same cases against the current and proposed files

Here's the complete current file for our example.

```
User-agent: *
Disallow: /basket/
```

And here's a plausible first draft. The author kept the original lines, targeted Googlebot explicitly and tried to catch every search parameter with one extra rule.

```
User-agent: *
Disallow: /basket/

User-agent: Googlebot
Disallow: /search
Disallow: /*?
```

Keep the fetched file open in one tab and paste your proposal into a second copy of [my robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker). Select the same crawlers in both. Enter the full product URL for a single check, or paste the rest under *Check multiple URLs*, one absolute URL per line. Run *Check URL* in both tabs and compare the *Winning Directive* column. Click a result with a line number to highlight the rule. The tick beside the URL tells you the input was valid and the evaluation conclusive. A blocked URL can earn that tick too.

To inspect the railway-set page's dependencies, enable *Check resources*, select one crawler and run *Check URL* for that page. You can see which rules apply to the images, stylesheets and scripts referenced in its HTML. A photo on a separate CDN is marked inconclusive, so fetch that host's robots.txt and test the photo URL separately. For assets added by JavaScript, take the request URLs from the browser's Network panel. Test the linked assembly PDF as an ordinary URL in the shop's list.

**Five outcomes on `https://woodentoys.example`. Allow and Block are crawl decisions.**

| Outcome | Requested path and query | Crawler | Wanted | Current | First draft | Revised |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **1 · Search** | `/search?q=wooden+train` | Googlebot | Block | Allow | Block | Block |
| **1 · Search** | `/search/trains` | ToyBot | Block | Allow | Allow | Block |
| **2 · Age collection** | `/search-by-age/ages-3-to-5` | Googlebot | Allow | Allow | Block | Allow |
| **3 · Basket** | `/basket/session/demo` | Googlebot | Block | Block | Allow | Block |
| **4 · Product** | `/toys/wooden-railway-set` | Googlebot | Allow | Allow | Allow | Allow |
| **4 · Product** | `/toys/wooden-railway-set?finish=natural` | Googlebot | Allow | Allow | Block | Allow |
| **5 · Assembly guide** | `/guides/railway-bridge.pdf?rev=2` | Googlebot | Allow | Allow | Block | Allow |

`ToyBot` is an invented, protocol-following crawler with no named group. Select the checker's wildcard/default entry for that row. Googlebot's `/search` prefix catches the age collection, and because Googlebot now has its own named group, it ignores the `/basket/` rule in the wildcard group under [Google's group-selection rules](https://alexanderkyriakou.eu/ak/robots-txt-syntax#does-a-named-group-inherit-the-site-wide-block). Meanwhile, `/*?` catches the product variant and assembly guide because both URLs contain a question mark. The clean product URL still passes. It would have been an entirely reasonable URL to spot-check, too.

Now look at the default crawler. Its search URL stays allowed in both files when the shop wanted it blocked. A report showing only URLs whose decisions changed would hide that failure. Compare every proposed decision with the intended one, including the rows where nothing moved.

How much would each mistake affect the shop? Group the failing rows by template, then compare the number of distinct URLs in your inventory with verified crawler requests in a recent log window. A basket can have few stable URLs and generate many requests. One age collection can receive little traffic itself and still be the only way to discover dozens of toys. Keep those two measures separate, and record the length of the log window so the next reviewer can reproduce the comparison.

Given *this* brief, I'd remove the special group. The application has a bare search endpoint, query variants and a directory of search results, so give each form a boundary.

```
User-agent: *
Disallow: /basket/
Disallow: /search$
Disallow: /search?
Disallow: /search/
```

Rerun the whole table. Add `/search` itself, `/search?q=trains`, `/research` and `/search-by-age`. The first two should be blocked and the last two allowed. If the application also serves `/el/search` or `/Search`, decide explicitly whether those belong in the policy. Translating the page title doesn't translate the directive.

Once you've confirmed the rules in [my robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker), you can also use Google's and Bing's own tools to double-verify the outcome and remove any lingering doubt. For a large inventory, put the same cases in version control and run them against each candidate build. [Google's open-source matcher](https://github.com/google/robotstxt) requires cloning the repository and building the `:robots_main` target with Bazel (and a C++14 compiler) or CMake; once built, the binary takes a local file, crawler token and absolute URL, so you can test the age collection in one command.

```
git clone https://github.com/google/robotstxt.git && cd robotstxt && bazelisk build :robots_main
bazel-bin\robots_main C:\path\to\robots.proposed.txt Googlebot "https://woodentoys.example/search-by-age/ages-3-to-5"
```

![Windows command line mock results for Google's robots.txt parser.](https://alexanderkyriakou.eu/assets/images/thoughts/test-robots-txt-changes/command-line-google-robots-txt-parser.webp)

*Google's parser in action.*

Compare the result to the expected decision. A correctly blocked URL is a *passing* test. Treat a missing fixture, unreadable file or failed invocation as a test error. Keep the parser version with the results. Pass correctly formatted URLs to the matcher. Google also documents a limit that matters if you test images: the standalone library omits crawler-specific behaviour such as the Googlebot-Image fallback to Googlebot rules. My parser takes the Googlebot-Image fallback into consideration, so running image URLs through my checker catches rules the standalone binary misses.

For Bing, open the shop's [robots.txt Tester in Bing Webmaster Tools](https://www.bing.com/webmasters/help/robots-txt-tester-623520ca) as a second check against Bingbot's own evaluator. Choose the host and protocol you're changing, fetch the latest file and test the full age-collection URL as Bingbot. Then paste the proposed rules into the editor and test that same URL again. Bing evaluates the contents of the editor, so you can see whether its decision changes before publishing. If two testers disagree, keep the exact URL, crawler token and smallest set of rules that reproduces the difference.

## Test the production policy while staging stays private

Staging has two jobs that pull in different directions. You want to stop the public from reaching an unfinished site, and you want to rehearse a file that will allow crawlers into production. Keep staging behind authentication or a network restriction. Generate the candidate with the production host mapping, then evaluate its bytes locally against *production* URLs. A parser can decide whether Googlebot is allowed to request a future product while the product preview is still private.

For a site-wide rehearsal in Screaming Frog, authenticate to staging, set your target bot under *Configuration → HTTP Header → User-Agent* (for example, `Googlebot (Smartphone)`) and open *Configuration → robots.txt: Custom*. Use the [custom robots.txt override](https://www.screamingfrog.co.uk/seo-spider/user-guide/configuration/#:~:text=Custom%20Robots) for the staging host. This lets the Spider evaluate the rules you supply against the selected user-agent while staging continues to serve its usual file. (If your file also contains named groups alongside `User-agent: *`, run a check with a default/wildcard-matching agent too, and check that staging's firewall doesn't reject a spoofed `Googlebot` header from your IP with a `403`.)

Run the first crawl with the current production rules as the override. Swap in the proposed rules for the second. Keep *Respect robots.txt* enabled and use the same seed URLs, user-agent and rendering settings both times. In *Response Codes → Blocked by Robots.txt*, compare the URLs and their matched directives. If the age collection appears only in the second run, you've caught the regression while the change is still on staging.

If you use a script, give it the same production URL list and crawler token for both runs, evaluate each URL with the matcher, and record the old and proposed decisions. To test discovery too, start from the same navigation links in each run and have the script check the applicable rules before following each link. The fixed list might show that every individual toy is allowed. A crawl starting at the homepage might lose the toys for ages three to five because their only incoming links were on the age collection. Compare the collection's outlinks and the first point at which the two crawls diverge. Otherwise you may spend an afternoon examining product pages whose own directives were fine.

Before promoting the build, inspect the generated production robots file and its sitemap targets, plus the headers and HTML of a representative public page. A [staging `X-Robots-Tag: noindex`](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#edge), an internal sitemap hostname or a login redirect can survive a release in which every robots.txt rule is correct.

## What should the old domain serve at /robots.txt?

If the wooden toy shop only changes its domain name and both hosts need the same rules, I'd send a direct `301` from the old `/robots.txt` to the new one. Under [RFC 9309's rules for cross-host redirects](https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching#redirects), a crawler that starts at the old host applies the file it retrieves to paths on the *old host*. So before sharing the file, try the new rules against a few URLs from the old catalogue.

Suppose the railway set used to live at `old.woodentoys.example/catalog/wooden-railway-set`. On the new platform, `/catalog/` generates internal listings, so the new file includes `Disallow: /catalog/`. The new product at `woodentoys.example/toys/wooden-railway-set` passes its crawl test. But if the old robots.txt redirects to the new one, Googlebot is also blocked from requesting the old product URL. The shop has a perfectly good product redirect that Googlebot can't fetch.

In that case, I'd exempt `/robots.txt` from the old host's blanket redirect and serve a separate file there with a `200`. Keep the old product paths crawlable and retain any restrictions the old host still needs. Then test the whole journey once the move is live. Does the old host's policy allow the railway-set URL? Does a GET to that URL return the intended permanent redirect? Does the destination host allow the new URL, and does it serve the product page? Repeat for the assembly PDF if it moved to a media host. [Google's site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) includes downloads and images alongside pages when mapping old URLs to new ones.

There's another way for a migration test to pass long after it has stopped telling you anything. Run a fresh search for wooden trains on the new shop. If it now generates `/catalogsearch/result/?q=trains`, yesterday's successful block on `/search?q=trains` tells you nothing about today's results. Repeat the [five shop outcomes](#choose-urls-that-could-prove-the-change-wrong) with links generated by the new storefront after cutover. Keep the old product and guide URLs in the test set for as long as you rely on their redirects, particularly if both domains share a robots file that someone may edit again.

## Small changes worth trying to break

### When is a versioned stylesheet a search result?

A [Webmasters Stack Exchange question about keeping clean URLs crawlable](https://webmasters.stackexchange.com/questions/132055/robots-txt-disallow-url-only-if-it-has-parameters) led to a suggestion to block URLs containing a question mark. Try that rule against `/assets/toys.css?v=4`, `/toys?page=2` and `/img/train.webp?width=960`. All three carry queries, yet all three need to stay crawlable. Conversely, a narrow `/*?sort=` catches `/toys?sort=price` and misses `/toys?lang=el&sort=price`. Put both orders through the test with the same expected outcome if the application treats them alike.

### What does your URL decoder do to a slash?

For a path containing `/ξύλο/`, take the UTF-8 percent-encoded request from the network trace and test it against the intended rule. Then try `/toys%2Ftrains` alongside `/toys/trains`. The latter pair contains an encoded reserved slash versus a real path separator. [RFC 9309's octet-matching rules](https://alexanderkyriakou.eu/ak/robots-txt-syntax#encoding) preserve that distinction. A spreadsheet or test helper that decodes both into the same path has removed a test case. And if the only difference is `#assembly`, the server receives the same request either way. Keep one row for the HTTP request.

### Can a comment change crawl permission?

In a short file, a properly commented toy train drawn in ASCII is harmless. Near [Google's 500 KiB parsing limit](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec#file-format), enough comment bytes above a final `Allow` can push the exception out of view. Parsers ignore comment text while still counting those bytes toward the file-size cap. Compare the uncompressed byte sizes of the live and proposed files—[my robots.txt tester](https://alexanderkyriakou.eu/ak/robots-txt-checker) checks the file size and warns once it exceeds 500 KiB.

There's a less whimsical version in [Glenn Gabe's account of a site with over 5,000 lines of directives](https://www.gsqi.com/marketing-blog/robots-txt-seo-5k-lines/). The site had managed to block its own content. Any file that large is prone to conflicting rules, and testing one ordinary public page would have caught the self-block immediately.

### The file you reviewed can gain another author at the edge

Vinayak Kulkarni [compared his checked-in rules with the rules his site served](https://vinayakkulkarni.dev/articles/til-cloudflare-prepends-managed-robots-txt) and found a managed block above his own. [Cloudflare documents when it prepends rules](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/). A repeated group can [combine with an earlier matching group](https://alexanderkyriakou.eu/ak/robots-txt-syntax#groups), so reading the bottom line as the final override is a poor test. Run the complete public body, including both groups. A third-party checker shows how that tool evaluates the text, while your server logs confirm what a bot actually fetched.

## Which bots are you writing this rule for?

A wooden railway set's product page can be fetched to update a search index, collect training material or answer a parent who just asked whether the bridge fits the wooden tracks they already own. Those are three quite different reasons to request the very same page. In [Cloudflare's 2025 analysis of HTML requests across its customers](https://blog.cloudflare.com/radar-2025-year-in-review/), Googlebot alone averaged 4.5% of requests and AI bots averaged 4.2%. Those figures reflect traffic on one network, and they show why testing only a desktop browser and Googlebot leaves plenty of crawlers unaccounted for.

If the owner wants to allow AI search and decline training, put the same public URL through two explicit expectations. In OpenAI's crawler documentation, those tokens are `OAI-SearchBot` for search and `GPTBot` for training. A fetch triggered by a ChatGPT user is a third case where OpenAI says robots.txt rules may not apply. Anthropic describes a different policy for Claude-User, alongside its separate search and training bots. Record what the operator commits to before deciding what counts as a pass for a user-triggered fetch.

Also keep a row for a new, unnamed cooperative crawler. It exercises the wildcard policy you'll give tomorrow's bot before anyone adds it to a list. At the other extreme, Google-Extended is a control token without its own HTTP user-agent string. You can test that the policy expresses the intended preference. Looking for a `Google-Extended` request in the access log won't confirm it. I cover the distinctions in more detail in [AI crawlers and robots.txt controls](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#who-fetches).

One more case is worth dating. Google says it intends to support `__usage_ai-training` in early 2027. In its [announcement of the shared training control](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#shared-preference), Google describes how the proposed opt-out would apply when a site hasn't specified Google-Extended explicitly. As of November 2026, I'd keep that as a future policy test with a review date. A parser recognising the spelling today checks the syntax, while provider adoption determines whether it takes effect.

## Check what went live, including a request with the old ETag

After deployment, use *Fetch Live* again in a fresh tab of [my robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker). Compare what comes back with the approved file, then rerun the same shop URLs. If anything differs, open the browser's Network panel and reload the exact `/robots.txt` URL to [inspect the status, redirect chain and cache headers](https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching#body). Adding `?nocache=1` may select a different cache entry from the one crawlers request.

If the browser and checker show different rules, I'd use `curl` to keep the response headers alongside the file. Replace the example host with yours.

```
curl -sS -L --compressed -D robots.headers -o robots.after.txt https://woodentoys.example/robots.txt
```

Open `robots.headers` to see each HTTP status and any redirect destinations, then open `robots.after.txt` to see what the final host served. A redirect to a login screen can end in a perfectly cheerful `200`.

If the old response had an ETag, repeat the GET with its *old* value in `If-None-Match`, using the same request headers and representation. After a meaningful rules change you expect the new body. A [304 response to that conditional GET](https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching#conditional-304) tells a client to reuse the copy it already holds. If an unconditional GET shows the new rules while the old validator still gets a 304, inspect the validator or cache configuration. A fresh incognito tab won't reproduce that client's history.

```
curl -sS -L --compressed -i -H 'If-None-Match: "OLD_ETAG"' https://woodentoys.example/robots.txt
```

On a site with geographic redirects or separate edge configurations, sample the affected regions and hosts. Check the live robots response and one public page without staff cookies. A challenge page, consent redirect or an application shell can all reach an external client while the origin looks fine. For the robots URL specifically, [Google treats most 4xx responses, including 403, as an absence of crawl restrictions](https://alexanderkyriakou.eu/ak/robots-txt-errors-redirects-caching#status). A 429 is an exception. A 5xx at that endpoint can pause crawling even while every product page returns 200. Repairing the file contents won't help a crawler that can't retrieve them.

## Watch the crawler pick up the change

Note down when you deployed, when an external GET first returned the intended body, and when you first saw a verified crawler refresh the file. Where possible, log the response version or ETag at the CDN. Logging the served version or ETag alongside the timestamp and status confirms both contact and which rules were delivered. Origin logs can also miss requests the edge answered from cache.

Did Google fetch *this* release? Open the [robots.txt report](https://support.google.com/webmasters/answer/6062598?hl=en) for the right host and protocol. Look for *Fetched* and a *Checked on* time after deployment. Then open the file and find a distinctive changed directive, such as the shop's new `Disallow: /search$`. Compare the displayed contents with the approved copy and check for parsing issues. The timestamp alone can't tell you whether the CDN gave Google the old file again. If you've just fixed a critical block, the file's menu lets you request a recrawl. Google fetching fresh rules and Google revisiting the railway-set page are separate events.

Compare verified requests for the affected URL families with a comparable period before the change. For these five outcomes, check whether internal search requests decline, whether bots still reach the age collection, and whether basket sessions stay quiet. Look separately for the clean product and its finish variant, then the exact PDF revision the product links to. Those last two serve different needs, and if your log filter only tracks HTML pages, you'll miss the fifth check altogether. Compare with an unaffected collection and allow for normal crawl frequency. An uncrawled URL over a quiet afternoon proves very little. If a purported bot keeps hitting blocked URLs, [verify the crawler identity](https://alexanderkyriakou.eu/ak/verify-crawler-identity), then check the host, fetch time and requested path before blaming its parser.

If you can't get server or CDN logs, use [Crawl Stats in Google Search Console](https://support.google.com/webmasters/answer/9679690?hl=en) to look for changes in request volume, response codes and host availability around the release. Check the example URLs where available. In [Bing Webmaster Tools' Site Explorer](https://www.bing.com/webmasters/help/site-explorer-c680da37), open the affected folder and inspect crawl warnings, robots.txt exclusions and the last crawl date on individual URLs. These reports can help you investigate a change in either engine's activity, even though their examples alone can't confirm that no crawler requested a particular basket URL.

**When would I roll back?** As soon as the public response blocks a critical directory that should be allowed, reopens a high-volume path that should stay blocked, or repeatedly fails to serve the expected file. Restore the known-good file or edge setting, invalidate the affected cache entry if needed, and run the same external GET and cases again. If the bytes and decisions are correct while search impressions move, investigate discovery, rendering and indexing separately. A rankings chart alone is a poor reason to put the broken rule back.

## Three tempting shortcuts

**"It's in the sitemap, so the crawler can still fetch it."** A sitemap helps a crawler discover where a product lives, and a matching `Disallow` rule still blocks the fetch. Test the listed URL and, if the sitemap moved as part of the release, fetch the advertised sitemap itself.

**"The old page now redirects, so I can block it."** Test [the old URL as well as its destination](#what-should-the-old-domain-serve-at-robotstxt). If the old URL is disallowed, a cooperating crawler can't request it to see the 301. The same reasoning applies to a page carrying a new `noindex` directive. [Google needs access to see the directive](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#crawl), and a [blocked URL can still appear in results](https://alexanderkyriakou.eu/ak/robots-txt-syntax#indexing) if Google discovers it elsewhere.

**"I got a 200 using Googlebot's user-agent, so Googlebot is allowed."** An ordinary curl request goes straight to your server without evaluating robots.txt, and a spoofed `User-agent` header skips both [Google's network identity verification](https://alexanderkyriakou.eu/ak/verify-crawler-identity) and Google's cached rules.

For this shop, I'd keep the railway guide in the test set even if it gets very little organic traffic. A parent with half a wooden bridge on the kitchen table has a perfectly good reason to want that PDF, and the person editing a search rule has very little reason to think of it. That's the sort of URL worth writing down.

---

* **Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)
* **Published:** 2026-11-23
* **Topic:** [seo](https://alexanderkyriakou.eu/thoughts/seo)
* **Proofreader:** Gemini Hydrogen