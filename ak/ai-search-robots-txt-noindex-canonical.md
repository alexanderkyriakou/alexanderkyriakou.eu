# How AI search products handle robots.txt, noindex, and canonical URLs

An AI answer links to the green bike. Your canonical points to the model page. That isn't necessarily a contradiction.

**Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)  
**Published:** November 18, 2026  
**Topics:** [SEO](https://alexanderkyriakou.eu/thoughts/seo)

<figure>
<img src="https://alexanderkyriakou.eu/assets/images/thoughts/ai-search-robots-txt-noindex-canonical/autumn-cycling-mountain-road-vytina-greece-2024.webp" alt="A group of cyclists rides along a winding mountain road near Vytina, Greece, flanked by dense evergreen trees and rocky hillsides on the left and autumn foliage on the right. In the lower right foreground, a rustic wooden picnic table and benches sit covered in fallen orange leaves beside the sunlit asphalt." />
<figcaption aria-hidden="true">Cycling mountains.</figcaption>
</figure>

*© Alexander Kyriakou · Vytina · 2024.*

## Contents

- [The right product URL](#variants)
- [How the URL was discovered](#routes)
- [The triad of signals](#signals)
- [Merchant product feeds](#feed)
- [PDFs and Markdown](#documents)
- [Conflicting information](#claims)
- [Retrieval and training](#training)
- [Investigating a citation](#evidence)

Say you sell a gravel bike called the AWGravel. Someone asks an AI search product where to buy it in forest green. The answer links straight to `/bikes/awgravel?colour=forest-green`. The shop, however, has declared `/bikes/awgravel` as the canonical URL.

Did the AI product ignore the canonical? Not necessarily. The two URLs may serve different purposes, and we don't yet know how the product discovered the variant URL or whether it even considered the canonical declaration.

The short answer is that a canonical is a hint, not a command, even for Google. Google weighs it against other signals when it picks a representative URL, and a product that doesn't use Google's index owes your declaration nothing. Whether a given AI product reads it at all is a question for that product's documentation, not for your markup.

An answer can draw on a search index, a page fetched in response to a user's request, or information supplied through a merchant feed. These routes don't necessarily follow the same rules. And while Google documents how it handles canonical selection and indexing directives, other AI search products don't always tell us what they do with those same signals.

I'd start by establishing what the URLs represent, then work backwards to how the product obtained the information. There's little point changing a perfectly useful product URL because an AI answer happens to cite it.

<a id="variants"></a>

## Is the green URL actually the wrong destination?

Start with `/bikes/awgravel?colour=forest-green`. If the parameter only changes the selected colour, and the main product page already presents both colours, their prices and availability, I'd be comfortable pointing both variants to `/bikes/awgravel`.

The green URL should still work as a destination. Someone following a link to it should see the forest green bike selected, without having to interact with the colour selector first.

Now imagine that forest green ships today while ocean blue is on back order. The main product page opens on blue, and a shopper following the citation wants the green bike in size 60. The distinction matters.

If the green URL consistently displays the correct product, SKU, price and stock availability, it may deserve to be an independently indexable landing page with its own canonical. I'd first open it in a fresh browser session. If it needs a previously stored cookie to remember the colour selection, it's a rather poor destination regardless of how neatly its canonical is configured.

The important thing is not to confuse a URL that deserves an independent search result with one that is useful to a visitor. Those are two different decisions. I've covered the distinction between colour variations, frame sizes and model years in [the product variation section of my robots.txt, noindex and canonical article](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#colours-sizes-and-years).

<a id="routes"></a>

## How did the AI product discover the URL?

Before looking at individual AI products, I'd establish how the URL reached the answer in the first place. There are a few possibilities.

### Search indexing

A search service can crawl a product page, process its contents and make it available in an index. An AI product can then use that information when answering a question. The page might have been fetched hours or days earlier, so the price and availability in the answer aren't necessarily current.

### On-demand retrieval

Someone pastes the green variant URL into a conversation and asks the assistant to check its specifications. The product may fetch the supplied address and retrieve the page in response to that request.

This is a different route from discovering the page through a search index. The fact that a search crawler couldn't access the URL doesn't automatically tell us whether a user-requested fetcher can access it too.

### Grounding

Grounding describes the use of external information to support a generated answer. A product might use information from its search index, retrieve a page directly, or combine several sources. Grounding isn't necessarily a separate way of discovering a URL; it describes how retrieved information is used to answer the question.

### Merchant-provided information

A retailer can also supply product information directly through a merchant feed. In that case, the assistant may know about the forest green AWGravel without having retrieved its product page at all.

These routes can overlap. A product can be discovered through search, fetched again when someone asks about it, and compared with information supplied by the merchant.

This distinction is worth keeping in mind when reading server logs. A crawler visit establishes that a request was made. It doesn't establish that the content was indexed, used in an answer or included in a model's training data. I've covered the different uses and crawler identities in [one product page, four AI use cases](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#one-page-four-uses) and [the crawler comparison](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#which-crawler).

<a id="signals"></a>

## What do robots.txt, noindex and canonical mean to AI search products?

The underlying mechanisms haven't changed. A matching `Disallow` in robots.txt can prevent a crawler from fetching a URL. A `noindex` instruction asks an indexing system to exclude a page after it has retrieved and processed the response. A canonical declaration expresses a preference for the representative URL among duplicate or similar pages.

Order matters here. A crawler has to be allowed to fetch a URL before it can read that URL's `noindex` or canonical. If robots.txt blocks the fetch, the page-level signals on that URL are never seen.

The catch is that these mechanisms don't have a universal interpretation across every AI product. Some providers document specific behaviours, while others leave important details open.

If you need a refresher on how the three mechanisms interact, particularly when a blocked page contains a canonical or a noindex directive, see [Crawl access comes before the response](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#crawl-access) in my existing article.

### Google AI Overviews and AI Mode

[Google's guidance for AI Overviews and AI Mode](https://developers.google.com/search/docs/appearance/ai-features) gives us a fairly clear starting point. To qualify as a supporting link, a page must be indexed and eligible to appear with a search snippet.

That means Google's normal indexing and canonicalisation decisions matter. If the forest green variant is considered a duplicate and Google selects the main AWGravel page as its canonical representative, I'd investigate whether the variant still offers anything independently useful before trying to force it into the index.

There are also more granular controls. Suppose the shop wants to keep the bike's specifications available in Search but doesn't want a particular dealer-only passage appearing in text previews. A page-wide `noindex` would be excessive. Google supports the `data-nosnippet` attribute on selected HTML elements, while `nosnippet` and `max-snippet` offer page-level controls.

These controls have different consequences. In particular, `nosnippet` prevents a text snippet and also prevents the page content from being used as a direct input for AI Overviews and AI Mode. Don't confuse it with excluding one passage from a preview.

There's another detail worth remembering. Suppose the shop wraps the green bike's €1,899 price in a `span` with `data-nosnippet`, but also publishes the same price in its `Offer` structured data.

That price can still be available for a Google product rich result. Google explicitly states that structured data remains usable for search results even when declared within a `data-nosnippet` element. If the price appears in a rich result, I'd check where it came from before changing the page.

See Google's [robots meta tag and X-Robots-Tag documentation](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) for the full set of controls.

### ChatGPT search

OpenAI distinguishes between `OAI-SearchBot`, `GPTBot` and `ChatGPT-User`. The first is used for search, the second for potential training use, and the third for certain user-initiated actions.

If the shop disallows `OAI-SearchBot`, OpenAI says its pages won't be shown in ChatGPT search answers. They can, however, still appear as navigational links. That distinction is important: seeing the bike's name linked in an answer doesn't necessarily mean OpenAI used the product page's contents.

For a user-requested fetch, OpenAI says robots.txt rules may not apply to `ChatGPT-User`. A shopper supplying the green variant URL is therefore a different test from waiting for the automatic search crawler to discover it.

OpenAI's crawler documentation doesn't establish a general rule that ChatGPT search must honour every page-level `noindex` or follow a site's declared canonical when choosing a citation. I'd avoid assuming either behaviour without evidence from the particular retrieval route.

See [OpenAI's crawler documentation](https://developers.openai.com/api/docs/bots) for the current distinctions.

### Claude web search

Anthropic documents a specific `noindex` behaviour for Claude web search. Its search partners are instructed not to index pages carrying the robots meta tag, so they should no longer supply that content in response to web search queries once the directive has been processed.

That doesn't mean the URL becomes inaccessible. Anthropic notes that someone can still follow a direct link to the page.

There are also separate crawlers for Anthropic's own search and user-requested retrieval. `Claude-SearchBot` handles search indexing, while `Claude-User` is used when someone asks Claude to visit a page. Anthropic documents robots.txt controls for both.

I'd be careful not to extend the documented meta-tag behaviour to every possible HTTP header or canonical implementation. Anthropic's guidance doesn't establish a universal canonical-selection rule for Claude citations.

References: [Anthropic's noindex guidance](https://support.claude.com/en/articles/10684638-report-block-and-remove-content-from-claude) and [its crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler).

### Perplexity and Mistral

[Perplexity distinguishes `PerplexityBot` from `Perplexity-User`](https://docs.perplexity.ai/docs/resources/perplexity-crawlers). The first handles automated search indexing. The second handles user-requested visits and, according to its documentation, generally ignores robots.txt rules for those requests.

So asking Perplexity to open the green variant is a poor test of a rule written specifically for its search crawler.

[Mistral makes a similar distinction](https://docs.mistral.ai/robots). `MistralAI-Index` handles automated search indexing, while `MistralAI-User` handles user-requested visits in Vibe. Its crawler documentation describes how to control those activities through robots.txt.

Neither provider's published crawler guidance establishes how its search product selects a canonical URL or consistently interprets page-level `noindex` directives when choosing citations.

### And what about Gemini?

I'd keep Google's AI search features separate from the Gemini app. Google documents how developers can use [Google Search grounding in the Gemini API](https://ai.google.dev/gemini-api/docs/google-search). That establishes a connection between Google's search results and a particular API workflow, not a promise that every Gemini app response uses the canonical URL selected in Search Console.

Gemini Apps can show sources and related links, including public websites and files supplied by users. The [consumer app's source documentation](https://support.google.com/gemini/answer/14143489) doesn't establish that every citation must match Google's selected canonical.

If someone supplies the green variant URL, or uploads the dealer's PDF, I'd record that input before comparing the resulting citation with URL Inspection.

### Bing and Microsoft Copilot

Some AI products have drawn on Bing's index alongside other sources, so Bing's own handling matters. [Bing documents `noindex` and canonical handling](https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a) for its search index, and Bingbot follows robots.txt. Whether a particular AI product applies those same signals to the pages it cites is a separate question that each provider has to answer.

<a id="feed"></a>

## Could ChatGPT find the bike through a product feed?

Yes. A merchant doesn't have to rely exclusively on its product pages to provide information to ChatGPT.

For example, the shop could connect a product feed through [ChatGPT Business Hub](https://help.openai.com/en/articles/20001635-setting-up-your-business-on-chatgpt). One record describes the forest green AWGravel in size 60, priced at €1,899 and currently in stock.

ChatGPT now has those product details directly from the merchant. A `noindex` on the product page doesn't withdraw the record from the feed. If the bike appears in a shopping result, that alone doesn't tell us whether ChatGPT also retrieved its HTML page.

Equally, the feed doesn't tell ChatGPT the bike's frame geometry unless the shop has supplied those details too or made another accessible source available.

A feed also comes with contractual terms. Section 3 of the [Businesses in ChatGPT Terms](https://openai.com/policies/businesses-in-chatgpt-terms/) covers crawler access and text-and-data-mining rights for merchants who supply a feed. My reading is that it limits how far a merchant can reserve those rights against OpenAI while using the feed. I'm not a lawyer, so read the clause yourself and ask counsel before combining a feed with a blanket block.

So I wouldn't treat a product feed and a blanket website block as an uncomplicated supported combination. The feed can supply product records independently of a page fetch, but the terms still matter.

Product images can introduce another point of failure. OpenAI's [guidance for product feeds](https://help.openai.com/en/articles/20001243-advertiser-guidance-for-allowing-openai-web-crawlers) specifically asks publishers to allow `OAI-SearchBot` to retrieve product image URLs. A 403 from the image host can interrupt feed processing even when the CSV itself is accessible.

For this example, I'd check three things separately: whether the latest feed contains the green size 60, whether its image can be retrieved, and whether the supplied product URL opens on the correct variant at €1,899.

A valid feed makes the offer available for consideration in ChatGPT shopping. It doesn't guarantee a recommendation or establish that the product will be selected over competing offers. ChatGPT can also consider the shopper's question and other available sources.

<a id="documents"></a>

## What if the citation points to a PDF or Markdown file?

The shop publishes a frame geometry chart in HTML and as a printable PDF. Both contain the same measurements. The HTML page is easier to use on a phone, so the developer gives it a self-canonical.

Someone asks about the stack height of a size 60 and receives a link to the PDF. Where would the crawler have seen the shop's preference when it fetched the file?

### PDFs have their own response headers

Unlike HTML, a PDF has no document head in which to put a robots meta tag or a canonical link. For Google, the server can express the relationship through an HTTP `Link` header in the PDF response.

```http
Content-Type: application/pdf
Link: <https://shop.example/bikes/awgravel/geometry>; rel="canonical"
```

If the aim is to exclude the PDF from Google's index while keeping it downloadable, the relevant header is `X-Robots-Tag: noindex`, served on the PDF itself.

These are Google-supported mechanisms. They don't establish that every AI product will follow the same canonical or indexing instructions when retrieving a PDF.

Also check that the HTML destination really contains the same measurements. A sales page with a photograph and a download button isn't a suitable canonical replacement for a geometry chart containing reach, stack and standover measurements.

I've covered the implementation in more detail in [the section on robots meta tags and HTTP headers](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#meta-tags-and-headers).

### When the Markdown file says more than the page

Now suppose the HTML geometry guide lists the dimensions for each AWGravel frame. Its Markdown companion also says that the measurements for size 60 apply to the 2026 frame only.

An agent given the Markdown can use that qualification. Someone following a citation to the HTML, however, has no way to check it. And someone buying a used 2025 frame could reasonably read the measurements as applying to their bike.

I'd put the model year next to the measurements in both versions. The two representations should agree on the facts and the qualifications that make those facts meaningful.

There's a good case for publishing additional material in Markdown, too. Say the shop maintains a guide for developers importing its geometry data. It explains that `stack_mm` is measured in millimetres and that a missing value means unmeasured, rather than zero.

Give that guide its own URL and link to it from the HTML table as something like *Geometry data and field definitions*. An agent can discover it, and so can the developer wondering why their importer turned a blank into zero. A separate reference with useful information of its own deserves a link people can follow.

### How should the HTML and Markdown versions relate?

If both documents contain the same measurements and qualifications, I'd keep the HTML as the main public URL and advertise the Markdown representation alongside it.

```html
<link rel="canonical" href="https://shop.example/bikes/awgravel/geometry">
<link rel="alternate" type="text/markdown" href="https://shop.example/bikes/awgravel/geometry.md" title="Frame geometry in Markdown">
```

The [HTML alternate relationship](https://html.spec.whatwg.org/multipage/links.html#link-type-alternate) identifies another representation for clients that understand it. It doesn't instruct every AI agent to fetch the file or promise that the HTML URL will receive the citation.

If the two URLs are equivalent, the Markdown response can also declare the HTML URL as canonical using an HTTP `Link` header, where the relevant consumer supports that mechanism. I'd skip the cross-canonical for the separate field-definition guide. The HTML table would be a poor substitute for its additional information.

There's also a way to serve both representations from one URL. A client sends `Accept: text/markdown`, and the server returns Markdown for that request while serving HTML to a browser. [Cloudflare's Markdown for Agents](https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/) is one implementation.

Make sure the cache distinguishes the two responses, typically with `Vary: Accept` and matching CDN configuration. Test both requests against the public URL. A format choice that exists only in a request header doesn't create a separate Markdown path for robots.txt to match.

### What if the Markdown URL has noindex or is blocked?

Take the two-URL setup again. The shop wants people and their tools to be able to read `geometry.md` on demand, but doesn't want the file appearing in Google's results.

Leave the file crawlable and serve these headers.

```http
Content-Type: text/markdown; charset=utf-8
X-Robots-Tag: noindex
```

Google can process the indexing instruction when it next fetches the file. Writing `noindex: true` in Markdown front matter doesn't achieve this unless the publishing system translates it into a supported HTTP or HTML signal.

Now change the requirement to Googlebot shouldn't fetch the Markdown at all. The shop could use a robots.txt rule matching the path that actually serves the file.

```text
User-agent: Googlebot
Disallow: /bikes/awgravel/geometry.md
```

Googlebot may still discover the address through the HTML alternate link, but it can't retrieve the Markdown response or its headers. Adding `noindex` to a blocked file won't reliably remove an already known URL.

If removal is the aim, allow the fetch and keep serving the header. If the aim is to prevent access, remember that robots.txt is a crawl preference rather than access control. And neither rule covers a copy on another hostname or tells another provider's crawler what to do.

### Can an AI answer cite the Markdown URL?

Yes. A Markdown file can be a citable source when a product discovers or retrieves it. For example, [OpenAI publishes its own crawler documentation in Markdown](https://developers.openai.com/api/docs/bots.md).

A single pair of prompts proves little. Answers vary between runs, and a link can come from an index, a live fetch, a feed or the model's memory. Treat each prompt as a trial instead:

1. Record the question, the product, the date, and whether you supplied the URL.
2. Repeat it at least ten times in fresh sessions, varying the phrasing. Run one set with the URL supplied and one set without.
3. Count how often each run cites the HTML, the Markdown or the PDF.
4. Compare with your server logs for the same window, verifying source IPs, and note which crawler requested which URL.

A citation rate with matching log entries is evidence. A single link is an anecdote. Even then, if HTML and Markdown share one negotiated URL, the citation can't show which representation the client received.

### Which format gives the clearest answer?

It depends on the information and the way the client extracts it. For the stack height of a size-60 frame, the important thing is keeping the number attached to the right model year, frame size and unit.

#### HTML

I'd start here for the public product page. A table with a caption naming the frame year, size headings and a row labelled Stack (mm) makes the relationships explicit. Check that the content is present in the HTML returned to an ordinary fetch, rather than appearing only after a click or in a canvas.

#### Markdown

A short file with headings, labelled values and links can be easier for a text-oriented client to process, but only when the conversion is lossless. Test the hardest table. If the conversion drops the shared millimetre heading or mixes two model years, the smaller file has cost you the answer. Simpler markup isn't automatically a better representation. What matters is whether the format keeps the context needed to interpret each value.

#### Structured data (JSON-LD)

For prices, availability and identifiers, Product and Offer markup is the documented route for Google, and it has to match the visible page. I wouldn't publish a separate JSON file with a JSON Schema for AI search. I'm not aware of provider documentation saying any AI search product discovers or uses one. A data feed or API for developers is a different, legitimate purpose, and I'd label it as that.

#### Plain text

For a single fact, `2026 AWGravel, size 60: stack 626 mm` works perfectly well. A long run of numbers aligned with spaces is another matter. Once the columns wrap, the relationship between values becomes ambiguous.

#### PDF

A dimensioned frame drawing can show exactly where a measurement starts and ends. A client receiving the page image can use that detail. A text-only extractor may lose it, mix the columns or get nothing usable from a scanned document without OCR. [OpenAI's file-input documentation](https://developers.openai.com/api/docs/guides/file-inputs) describes how one upload workflow supplies extracted PDF text and page images to vision-capable models. It doesn't establish how a search crawler processes a PDF found on the web.

For this shop, I'd publish the accessible HTML table as the primary reference, offer Markdown where it provides a useful alternative, and make the product specifications available as structured JSON, with a JSON Schema defining their expected structure. I'd keep the PDF for the dimensioned drawing, where the visual representation matters. Then I'd test the same size-60 question against each representation before claiming one is easier for AI products to understand.

Google explicitly says [its generative search features don't require a Markdown version](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide). I wouldn't introduce another format just to satisfy an assumed requirement.

<a id="claims"></a>

## What happens when the available sources disagree?

### Does Schema.org JSON-LD give the shop the deciding vote?

On the bike page, [Product and Offer structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing) can describe a SKU, its price, currency and availability. For example, an offer of €1,899 for the forest green size 60 should describe that specific variant, and the shopper following its link should see the same offer.

Suppose the visible HTML says €1,999 while the JSON-LD says €1,899. Which price would you use? I'd first establish the actual offer presented to the shopper, then correct the other representations, including the merchant feed if the shop supplies one.

[Google's structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) require the markup to represent the visible page. Its guidance for AI Overviews and AI Mode doesn't introduce a special AI schema.

JSON-LD is useful for describing the product. Adding a URL or an `@id` to that description doesn't give the shop a documented way to choose an AI citation or settle a disagreement with another source.

### Which source is right about the bike?

Say the manufacturer specifies 45 mm maximum tyre clearance, while a reviewer says they successfully fitted a 50 mm tyre.

Ask what clearance the manufacturer approves, and the manufacturer's specification for that frame year is the relevant source. Ask whether anyone has fitted a 50 mm tyre, and the reviewer's experience is relevant.

Both statements can be accurate. The mistake would be to turn one rider's successful fit into a manufacturer-approved specification.

If two sources genuinely disagree about the same specification, there isn't a published first-party-wins rule in the product guidance discussed here. An AI answer may cite either source, describe the disagreement or miss it altogether.

I'd check the exact statement each source supports, followed by the model year, frame size and publication date. If the reviewer quoted an old manual, a dated correction on the current specification page gives readers something they can verify.

A canonical can help group duplicate documents. It can't resolve two different claims about a tyre.

<a id="training"></a>

## Can the shop allow retrieval but decline training?

Yes, where the provider offers separate controls. A citation concerns what a product could use to answer a question. Training concerns the use of content to modify a model's learned parameters.

A `noindex` on the Markdown file, a canonical pointing to HTML, and an alternate pointing back to Markdown express no general preference about training. A robots.txt restriction for a particular training crawler addresses a different purpose from one written for a search crawler.

There is also a shared training preference being developed through the IETF. The latest version of the Internet-Draft, [published on November 16 of 2026](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/), defines the policy token `__usage_ai-training`.

For a shop declining training use of its bike catalogue, the proposed syntax looks like this:

```text
User-agent: __usage_ai-training
Disallow: /bikes/
```

This is a policy token in the existing `User-agent` field, not a new robots.txt directive or an actual crawler. It expresses a content-use preference for providers that implement the proposal. It doesn't itself block a request. Actual crawl access remains a separate decision governed by the relevant crawler rules.

The draft is still an Internet-Draft, not a published standard. The provider-specific implementation details also matter.

Google, for example, has said it plans to interpret the shared training opt-out as a `Google-Extended` disallow when no explicit `Google-Extended` preference exists. That can affect Gemini grounding as well as training. Microsoft has introduced separate training and grounding preferences, with its own page-level controls and transition arrangements.

There is a reason I wouldn't try to summarise every provider's implementation in one example. The differences matter, and they are changing. I've covered them in more detail in [the section on Google-Extended](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#extended), [the shared training preference](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#shared-preference) and [Microsoft's grounding choices](https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt#microsoft).

One further complication is the product feed discussed earlier. The Businesses in ChatGPT Terms impose specific conditions on merchants providing one, including their treatment of text-and-data-mining opt-outs with respect to OpenAI and its affiliates. A site-wide training preference alone isn't a complete account of the contractual arrangements.

<a id="evidence"></a>

## What can the citation actually tell us?

I'd keep the exact question that produced the answer alongside the citation. Did someone supply the URL? Did the answer quote a stock figure that appears only on the green variant, or did it simply name the bike? Those details help narrow down how the product might have obtained the information.

Next, I'd open the cited URL and compare it with the clean model URL. Follow the redirects and inspect the final response, including its status code, `X-Robots-Tag` and `Link` headers, HTML robots meta tag and canonical declaration.

I'd also check the initial HTML response against the rendered page in DevTools. Suppose the server sends `noindex` while the catalogue loads, then JavaScript removes it once the bike becomes available. The browser's final DOM can look perfectly fine even though Google may skip rendering after seeing the initial instruction. For Google, URL Inspection adds the indexed view, the canonical Google selected and the last crawl date.

For the robots.txt part, put the exact variant URL and the clean model URL into my [robots.txt checker](https://alexanderkyriakou.eu/ak/robots-txt-checker) and select the crawler in question. It can evaluate the matching rules and show which directive wins.

Remember what the result represents, though. It's a rules-based evaluation, not proof that a crawler visited the URL, could retrieve its contents or included it in an index. For an actual request, [look at the server logs](https://alexanderkyriakou.eu/ak/crawler-ip-verifier).

And if the log says `Googlebot` or `OAI-SearchBot`, don't stop at the user-agent string. Verify the source IP using the operator's published information and documented checks. A user-agent can be copied. I've covered the process in [the crawler identity and DNS verification article](https://alexanderkyriakou.eu/ak/verify-crawler-identity#dns-verification).

For Google, my existing article's [section on inspecting the public response](https://alexanderkyriakou.eu/ak/robots-txt-noindex-canonical#verify) walks through the browser checks in more detail.

Back to the shopper looking for forest green. If the answer sends them to ocean blue, where the bike appears sold out, I'd investigate the URL choice. If it sends them to the correct size, in stock and in the colour they asked for, I think that's perfectly fine.

The shop's preference for one URL and the shopper's preference for one particular bike can both make sense. The important thing is to understand what each URL represents, what the AI product could access, and what evidence we actually have before changing anything.

---

Author is I, [Alexander Kyriakou](https://alexanderkyriakou.eu/).  
Proofreader, GPT-6.1 Sol  
Published November 18, 2026.
