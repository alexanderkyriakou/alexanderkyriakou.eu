# Robots.txt, Noindex, and Canonical: Three different jobs

A gatekeeper, an absolutist, and a proposer walk into a pub. What do they have to say?

**Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)  
**Published:** November 17, 2026  
**Topics:** [SEO](https://alexanderkyriakou.eu/thoughts/seo)

<figure>
<img src="https://alexanderkyriakou.eu/assets/images/thoughts/robots-txt-noindex-canonical/self-service-bar-athens-2021.webp" alt="A dark charcoal wall inside a pub in central Athens featuring hand-painted off-white lettering that reads, &#39;Welcome, This is a Self Service BAR enjoy your stay &amp; be nice to eachother, especially to the barman.&#39; A brass beer tap stands in the lower right foreground, while wooden shelves on the left hold small framed pictures and memorabilia against an adjacent dark green wall." />
<figcaption aria-hidden="true">A dark charcoal wall inside a pub in central Athens featuring hand-painted off-white lettering that reads, 'Welcome, This is a Self Service BAR enjoy your stay &amp; be nice to eachother, especially to the barman.' A brass beer tap stands in the lower right foreground, while wooden shelves on the left hold small framed pictures and memorabilia against an adjacent dark green wall.</figcaption>
</figure>

*Treat responsibly. © Alexander Kyriakou · Athens · 2021.*

## Contents

- [Quick shot](#summary)
- [One bike, eight options](#bicycle)
- [Crawl access](#crawl)
- [Meta tags and headers](#robots-rules)
- [Canonical selection](#selection)
- [Colours, sizes and years](#variants)
- [Loops and chains](#conflicts)
- [Cloudflare at the edge](#edge)
- [AI search and retrieval](#ai)
- [The public response](#verify)

## The three jobs in a shot

Imagine we're discussing a bicycle purchase over a beer. Three people have rather different opinions about which bicycle should be available, which one should appear in a catalogue, and which one should be considered the preferred version.

That's roughly the situation with robots.txt, noindex and canonical. They all influence how search engines deal with URLs, but they have three distinct responsibilities.

- **Crawling.** A matching `Disallow` in robots.txt [stops the fetch](#crawl). Google may still discover the URL through links, but it can't read an indexing instruction in a response it hasn't fetched.
- **Indexing.** A [robots meta tag or an `X-Robots-Tag` header](#robots-rules) can tell Google to exclude a URL once it processes the response. An `index` in the HTML won't cancel a `noindex` added at the edge.
- **Canonicalisation.** A canonical names your preferred URL among duplicates. [Google groups similar pages and selects a representative](#selection), taking your declaration and other signals into account.

Three different jobs. The distinction sounds straightforward enough. Things get more interesting when we put them together.

## One bicycle, eight ways to buy it

Let's use a fictional gravel bike called the **awgravel**. A cycling magazine has reviewed it, and the reviewer rode the Forest Green version. Naturally, the review links directly to that colour.

By the time someone reads the review, however, the shop's default colour is Ocean Blue. The visitor lands on the product page and sees a different bicycle from the one they were reading about.

That's not particularly helpful. Ideally, the link should remember the selection. Now let's add another dimension: frame size.

There are two colours and four frame sizes. A customer wants the Forest Green version in 60 cm, of which there's only one left. Ocean Blue is on backorder. The warehouse consequently has eight stock records, each representing a different combination.

The shop could make those selections addressable using URLs like these:

    Model             /bikes/awgravel
    Reviewed colour   /bikes/awgravel?colour=forest-green
    Selected bike     /bikes/awgravel?colour=forest-green&size=60

Now, with two colours and four sizes, we have eight possible combinations. That's a good reason to let someone share an exact selection. Whether the shop needs eight landing pages in organic search is a separate decision.

Open the last URL in a fresh session. The photo, price, stock and add-to-cart SKU should all match the Forest Green bike in 60 cm, even if the visitor has never touched a colour swatch.

Google's <a href="https://developers.google.com/search/docs/appearance/structured-data/product-variants" target="_blank" rel="noopener external">product variant guidance</a> describes what preselection should deliver. Merchant Center's <a href="https://support.google.com/merchants/answer/4752265" target="_blank" rel="noopener external">landing-page requirements</a> also make that preselection part of the shopping experience.

An organic canonical pointing to the model page can coexist with that deep link because the shopper still receives the requested page. A redirect to the model that drops the selection would change the buying experience.

Keep that distinction in mind. A URL can be perfectly useful to a visitor without necessarily deserving to be indexed as an independent search result.

## Crawl access comes before the response

Suppose the shop decides that it doesn't want all eight size and colour combinations appearing in Google. Someone adds a `noindex` to the product template for those selections.

That sounds reasonable. But another developer decides to tidy up the robots.txt file and adds a rule matching the same URLs.

Now we have two instructions contradicting against each other. The browser can still open the selected bike URL and show the `noindex` meta tag in its source. Googlebot, however, consults the robots rules and skips the request.

Both sides have done exactly what they were told. The problem is that Googlebot cannot read an indexing instruction in a response it never fetches.

A crawler can learn a URL from the magazine's link, an internal link or a sitemap before fetching its content. For a particular crawler, check the rule against the actual scheme, host and port, as well as the actual path and query string. A shop on `www` and a PDF hosted on a separate asset hostname can have different robots files.

My <a href="https://alexanderkyriakou.eu/ak/robots-txt-checker" target="_blank" rel="noopener external">robots.txt checker and multi-crawler rule tester</a> takes you through matching and crawler identity. An "allowed" result answers the rule question. You still need the public response to find out whether the URL serves a product, redirects, or returns an error.

<figure>
<ol>
<li>
<strong>1 · Before the release</strong><br />
<span class="small">Public site</span> The size URL returns an indexable product.<br />
<span class="small">Google Search</span> Google has previously indexed this selection.
</li>
<li>
<strong>2 · Deployment</strong><br />
<span class="small">Public site</span> The shop adds noindex and blocks the URL.<br />
<span class="small">Google Search</span> The earlier indexed state can persist.
</li>
<li>
<strong>3 · Next crawl attempt</strong><br />
<span class="small">Public site</span> A browser can fetch the new header.<br />
<span class="small">Google Search</span> Googlebot sees the disallow and skips the product fetch.
</li>
<li>
<strong>4 · After unblocking</strong><br />
<span class="small">Public site</span> The shop keeps noindex on the accessible URL.<br />
<span class="small">Google Search</span> On a later successful fetch, Google can process the exclusion.
</li>
</ol>
<figcaption>A deployment and an indexing change run on different clocks. The decisive event here is a successful fetch after the URL becomes crawlable again.</figcaption>
</figure>

If exclusion is the aim, let Googlebot fetch the URL and serve `noindex` consistently. Keep it crawlable so the engine can continue to observe that policy.

For a product permanently removed without a replacement, expose its real <a href="https://developers.google.com/crawling/docs/troubleshooting/http-status-codes" target="_blank" rel="noopener external"><code>404</code> or <code>410</code></a> instead. Blocking the retired path can hide the status just as effectively as it hides a meta tag.

For a private catalogue, use authentication. Anyone with the address can request a publicly accessible page carrying `noindex`. An indexing directive isn't access control.

## Robots meta tags and X-Robots-Tag

Now, let's move from crawl access to what happens once a crawler actually retrieves a page.

The headers arrive before the HTML body. That delivery order doesn't give an HTTP header higher authority. Google considers the rules applicable to its crawler, combines compatible restrictions, and uses the more restrictive rule where they conflict.

Here's what that means in a response that looks perfectly fine in a browser.

    HTTP/2 200
    Content-Type: text/html; charset=utf-8
    X-Robots-Tag: noindex

And here's the initial HTML returned for the same URL:

    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://bikes.example/bikes/awgravel">

Google applies the <a href="https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" target="_blank" rel="noopener external">more restrictive robots rule</a> here, so the header's `noindex` excludes the page once Google processes it.

Changing the HTML to `index, follow` again won't repair the page. Check the CDN, origin and application for the layer adding the header. The self-canonical doesn't make this response eligible for search either.

**Scope matters before precedence.** Take a generic `X-Robots-Tag: noindex` and an HTML `googlebot` tag that says `index`. Both apply to Googlebot, so the generic exclusion still stands.

Reverse the targeting and a generic `max-image-preview:large` can coexist with `X-Robots-Tag: googlebot: noindex`. <a href="https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag" target="_blank" rel="noopener external">Google's documentation</a> explains how crawler-specific rules are applied.

[The remainder of the original document continues here.]

------------------------------------------------------------------------

Author is I, [Alexander Kyriakou](https://alexanderkyriakou.eu/).  
Proofreader, GPT-6.1 Sol  
Published November 17, 2026.