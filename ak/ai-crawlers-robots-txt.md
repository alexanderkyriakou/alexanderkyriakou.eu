# If I block GPTBot, can ChatGPT still find my page?

A page can show up in an answer through a search index, a direct user request, or a feed you set up yourself. What exactly did you mean to control?

**Author:** [Alexander Kyriakou](https://alexanderkyriakou.eu/)  
**Published:** November 11, 2026  
**Article:** https://alexanderkyriakou.eu/ak/ai-crawlers-robots-txt  
**Topics:** [SEO](https://alexanderkyriakou.eu/thoughts/seo)

![A striking luxury floor lamp styled like a palm tree, featuring a wooden stem and a wide canopy of vibrant teal ostrich feathers illuminated from within. The lamp is displayed in a showroom next to a sofa draped with various fabric swatches.](https://alexanderkyriakou.eu/assets/images/thoughts/ai-crawlers-robots-txt/teal-feather-palm-tree-floor-lamp.webp)

*Portrait crop of the supplied landscape photograph. © Alexander Kyriakou · Athens · 2024. [Photograph licensing and permissions](https://alexanderkyriakou.eu/licensing).*

## Contents

- [One page, four uses](#one-page)
- [Which crawler?](#who-fetches)
- [The Extended tokens](#extended)
- [A shared training preference](#shared-preference)
- [Microsoft's grounding choices](#microsoft)
- [Publisher dashboards](#dashboards)
- [Test the rules](#test-rules)
- [When the CDN blocks](#cdn)
- [What the evidence shows](#evidence)

Say you sell a floor lamp. You're happy for someone to find it through ChatGPT, and you'd quite like the answer to show today's price. You'd also prefer that OpenAI leave your product descriptions out of its model training. So you add two lines to your robots.txt file.

```text
User-agent: GPTBot
Disallow: /
```

A few days later, a shopper finds the lamp in a ChatGPT answer. Did OpenAI ignore your file? Almost certainly not. OpenAI uses [separate crawlers for training and for search](https://developers.openai.com/api/docs/bots). Your rule addresses `GPTBot`. The crawler that indexes pages for ChatGPT search is `OAI-SearchBot`, and your file never mentioned it. The lamp appearing is consistent with what you asked for.

<a id="one-page"></a>

## One product page, four AI use cases

Which price a potential customer might see this afternoon, ff you changed it from €59 to €49 this morning? That depends on how the LLM chat got its information.

**Model training.** Your page could be one item in a vast collection used to adjust a model's learned parameters. Updating the price on your site doesn't affect those parameters. A visit from a training crawler shows that it requested the page. You can't tell from that visit whether the description made it into a training run.

**Search indexing.** A search service can fetch the product page ahead of time and make it retrievable for a chat discussion. That's useful for discovery, though the index may still have yesterday's price when the user asks.

**Grounding.** Grounding means using information from a source to answer a question. Say Google crawled your floor lamp page yesterday, when the price was €59. If a user asks about it today, Gemini can use [the price stored in Google's Search index](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). Looking up that price in the index doesn't send a new request to your server. Only if the chatbot fetches the live page directly to check today's price will that fetch initiate a new request, accompanied by the accurate price in the chat.

**On-demand retrieval.** A potential customer pastes the page's URL and asks the chatbot, “Is it good VFM?” their chatbot may read the page to find lamp's price, that's on-demand retrieval. If it then uses the retrieved price listed on the page to explain whether the lamp is VFM, it's grounding its answer in the product description, while citing the updated price of the floor lamp.

It's tempting to count the bot names in a log and assign one purpose to each visit. When a site allows both its training and search crawlers, OpenAI says it may [use the results of one crawl for both purposes](https://developers.openai.com/api/docs/bots). A log records what reached your server. The operator's policy tells you what it says it can do with your server response.

<a id="who-fetches"></a>

## Which crawler made the request?

OpenAI and Anthropic both publish separate bots for training, search and user-requested fetches. Their documentation differs on the third.

**What happens when you disallow each bot in robots.txt?**

| Purpose | OpenAI | Anthropic |
| --- | --- | --- |
| Model training | `GPTBot`<br>Tells OpenAI to exclude your site's content from training its generative foundation models. | `ClaudeBot`<br>Tells Anthropic to exclude future content from your site from its training datasets. |
| Search indexing | `OAI-SearchBot`<br>Your pages won't appear in ChatGPT search answers, though ChatGPT may still show a navigational link to your site. | `Claude-SearchBot`<br>Your pages won't be indexed for Claude's search results. |
| On-demand retrieval | `ChatGPT-User`<br>ChatGPT may still fetch the page. OpenAI says [robots.txt rules may not apply when a user requests it](https://developers.openai.com/api/docs/bots). | `Claude-User`<br>[Anthropic documents](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) that it honours the rule. |

If a colleague asks whether “user bots respect robots.txt”, I'd ask which one they've seen. A rule for `Claude-User` has a documented effect that you'd have a hard time promising for `ChatGPT-User`. Anthropic also documents its hosted browsers separately, so a statement about its three named robots has a fairly precise boundary.

A third route involves no visit from the AI provider at all; its training data can come from someone else's crawl. Anyone can [download Common Crawl's web archives](https://www.commoncrawl.org/overview). A rule addressed to `GPTBot` means nothing to [Common Crawl's own crawler, `CCBot`](https://www.commoncrawl.org/ccbot).

<a id="extended"></a>

## The two “Extended” names you won't see making a request

If your server logs the `User-Agent` header, you can see which crawler a request claims to come from, such as `Googlebot`. You won't see a separate visit from Google when you add a `Google-Extended` rule. Google [uses its existing crawlers to fetch the page](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). The `Google-Extended` rule tells Google whether it may use that content for the Gemini training and grounding uses covered by the rule. The request header alone can't tell you whether either use took place.

### Google-Extended covers more than training

Google documents [two uses for `Google-Extended`](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). One is training future Gemini models that power Gemini Apps and the Vertex AI API for Gemini. The other is grounding in Gemini Apps and in Grounding with Google Search on Vertex AI. If you disallow `Google-Extended` for a page to decline training, you also give up those grounding uses. Ordinary Google Search inclusion and ranking are separate, and Google provides a different control for its own Search generative features.

### Applebot does the fetching. Applebot-Extended expresses a training choice

If you want the floor lamp to remain discoverable through Apple's search experiences while declining use of the description for Apple's generative foundation models, let `Applebot` crawl the product page and disallow `Applebot-Extended`. Apple explains that [the Extended token governs how it uses content Applebot has already crawled](https://support.apple.com/en-us/119829). And if your actual concern is subscriber-only text being supplied as context to an answer, Apple documents a separate page-level signal for paywalled content, `isAccessibleForFree: false`. A shop's public product pages and a publisher's paid articles can call for quite different choices.

<a id="shared-preference"></a>

## Can I express my training preference once?

Soon! That's the idea behind [the shared training preference proposed on October 30, 2026](https://datatracker.ietf.org/doc/draft-kelley-aipref-training-preference-signal/): `__usage_ai-training`. You may see it described as a new robots.txt directive. The distinction matters when you write the file: the new part goes on the *value* side of an existing `User-agent:` line. The familiar `Allow` and `Disallow` rules still do the path matching. The draft proposes a shared meaning for the result.

```text
User-agent: __usage_ai-training
Disallow: /
Allow: /products/
```

Here a preference against training across the site is stated, with an explicit exception in favour of training under `/products/`. Remove the last line for a site-wide opt-out. A general `User-agent: *` group doesn't express this preference under the present draft. And allowing the products directory for training wouldn't give a crawler permission to fetch it if the crawler's own access rules disallow it. The use and the fetch are evaluated separately.

**Rollout checked on 11 November 2026.** The IETF AI Preferences working group is [discussing how the proposal fits its wider work](https://mailarchive.ietf.org/arch/msg/ai-control/60V9tZ56eL0OsnSgO2BsfXlXfCc/). For now it's in the Draft phase.

**What the participating providers have said**

| Provider | What matters for your file |
| --- | --- |
| Google | Google [aims to support the signal in early 2027](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers#google-extended). If you opt out through the shared token and leave `Google-Extended` unspecified, Google plans to [treat that choice as a Google-Extended disallow](https://developers.google.com/search/blog/2026/10/ai-training-control). That can cost you Gemini grounding eligibility as well. An explicit Google-Extended choice lets you specify Google's treatment separately. |
| Microsoft | Microsoft plans to [honour the new preferences as it crawls](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/), beginning on February 1, 2027. It adds a page-level training override and an independent page-level choice for grounding. |
| OpenAI | OpenAI's [October 30 announcement](https://openai.com/index/helping-websites-express-ai-training-preferences/) gave a timeframe of months for implementation. Its existing crawler controls continue to apply. For a decision about GPTBot today, keep the GPTBot rule. |
| Anthropic | The draft's author [reported that Anthropic had started implementation](https://mailarchive.ietf.org/arch/msg/ai-control/mddjatOxSR0h6GmLRBWlc839c7w/) and that support across services would take time. Its existing crawler controls continue alongside that work. |

<a id="microsoft"></a>

## Microsoft gives grounding its own setting

Suppose the shop also publishes detailed repair guides. It's happy for a guide to help someone replace the switch on a lamp through Copilot, but wants to exclude that page from grounding services Microsoft supplies to third parties. A training opt-out alone wouldn't express this choice. Under Microsoft's announced rules, the shop could put these two tags in the guide's HTML head:

```html
<meta name="Bingbot" content="ai-training:disallow">
<meta name="Bingbot" content="ai-grounding:disallowextended">
```

The first declines generative-model training for the selected page. For that page, [the training preference in the meta tag takes precedence](https://www.bing.com/webmasters/help/new-ai-preferences-2t1cc16d) over the shared setting in robots.txt. The second keeps the guide eligible for grounding in Microsoft-operated experiences such as Copilot and Microsoft 365, while excluding grounding supplied to third parties. For a publisher comfortable with both kinds of grounding, the value is `allow`. To decline both, use `disallow`. The **defaults are `allow`** when there's no preference set. Traditional Bing search eligibility is separate.

For a PDF version of the guide, the server can send the grounding choice in the HTTP response. The equivalent header for declining all Microsoft grounding on that PDF is:

```http
X-Robots-Tag: Bingbot: ai-grounding:disallow
```

Bingbot needs to [crawl the page to discover its instructions](https://blogs.bing.com/search/2026/10/your-content-your-choice-clearer-preferences-for-training-and-grounding/). If you disallow the PDF's directory for Bingbot, putting a beautifully precise header on the PDF won't help Bing read it. Microsoft hasn't proposed a site-wide `ai-grounding` group in robots.txt. A publisher that wants the same ongoing grounding choice on every page can serve the same tag or header on each respective response.

<a id="dashboards"></a>

## What can I change in the dashboards?

### Google Search Console

For Google's AI Overviews, AI Mode and generative features in Discover, open the relevant property and go to **[Settings → Search generative AI](https://support.google.com/webmasters/answer/16908024?hl=en)**. Google rolled this control out worldwide on 31 August 2026. You can include or exclude your site's content and links from the covered experiences, or inherit the parent property's choice where applicable. Excluding the site also removes its eligibility to ground responses in those features. Other parts of Google Search keep their own inclusion and ranking criteria. So if the request from your editor is “keep our articles in regular Search, but out of AI Overviews”, this is the setting I'd tweak first.

### Bing Webmaster Tools

If you already rely on `noarchive` or `nocache` for Microsoft's AI uses, the dates matter. The dashboard setting is a temporary bridge for *grounding* while Bing revisits pages. Microsoft's [transition timetable](https://www.bing.com/webmasters/help/new-ai-preferences-2t1cc16d) gives publishers four dates to work with.

1. **15 December 2026.** If your site uses `noarchive` or `nocache` on this date, you can set a temporary grounding preference in Bing Webmaster Tools. It covers your pages while Bing recrawls them.
2. **1 February 2027.** Microsoft starts applying the new training and grounding preferences as it crawls your site. Individual pages may pick up the changes at different times.
3. **By 1 March 2027.** To keep an existing grounding restriction, publish it on each affected page and set the temporary preference in Webmaster Tools. To keep a training restriction, publish it in robots.txt or on the pages themselves. Training has no temporary setting in Webmaster Tools. After this deadline, Microsoft stops using `noarchive` and `nocache` to determine either preference.
4. **30 September 2027.** The temporary grounding preference expires. If Bing recrawls a page before then and finds its new grounding instruction, that instruction takes effect for that page as soon as Bing reads it.

That gap between publishing and recrawling is the whole reason for the temporary setting. Without it, a page still relying on the old restriction can default to allowing grounding while it waits for its new instruction to be discovered. Bing also offers an [AI Performance report](https://www.bing.com/webmasters/help/ai-performance-9f8e7d6c). A citation there can help you investigate visibility, but it tells you neither how many readers clicked nor whether a page was used in training.

### ChatGPT Business Hub

OpenAI [introduced Businesses in ChatGPT in beta](https://openai.com/index/introducing-businesses-chatgpt/) on 10 November 2026. For the floor lamp shop, Business Hub is relevant for a different reason. An eligible business can [claim and verify its profile](https://openai.com/business/businesses-in-chatgpt/), update its details and submit a product feed containing prices and availability. If the shop itself sends OpenAI the €49 price, that provides another route for the figure to reach ChatGPT. Blocking a fetch of the product page wouldn't withdraw a feed the shop chose to supply.

The Hub also provides aggregated insights such as mentions and website clicks, subject to reporting thresholds. OpenAI documents controls there for business information, feeds and eligible Business Agents. For the shop's website, [OpenAI's crawler guidance](https://developers.openai.com/api/docs/bots) still points publishers to `GPTBot` and `OAI-SearchBot` in robots.txt. Claiming a business doesn't guarantee preferential placement.

<a id="test-rules"></a>

## Put the floor lamp through the checker

Let's make the original brief a little more specific. We want ChatGPT search to be able to retrieve the public product description. We'd like GPTBot to leave the catalogue alone, and we want the checkout path excluded for both crawlers. Here's a small test file for that policy:

```text
User-agent: *
Disallow: /checkout/

User-agent: GPTBot
Disallow: /products/
Disallow: /checkout/
```

Why write `/checkout/` twice? Because the dedicated GPTBot group supplies that crawler's rules. It doesn't inherit the wildcard group as an extra set of restrictions. Remove the last line and, under the [robots.txt group-matching rules](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.2.1), you've accidentally allowed GPTBot to fetch the very path you meant to exclude.

**What the example file says about two paths**

| Path on yourdomain.eu | GPTBot | OAI-SearchBot |
| --- | --- | --- |
| `/products/floor-lamp` | Blocked by `/products/` | Allowed. The wildcard group has no matching restriction. |
| `/checkout/review` | Blocked by its own checkout rule | Blocked by the wildcard checkout rule |

Paste those rules into my [Robots.txt Checker](https://alexanderkyriakou.eu/ak/robots-txt-checker), select `GPTBot` and `OAI-SearchBot`, and enter `https://yourdomain.eu/products/floor-lamp`. Add the checkout URL as a second test. The multiple-URLs field accepts both at once. Click a result with a line number to see which rule won, then delete the last line and run it again.

The **AI & LLM Scrapers** group in the checker contains 54 entries as of November 11, 2026. That count includes fetchers and policy tokens. The copy icon beside a result gives you its `User-agent:` declaration, which saves you retyping it. Select the whole group if you want to see where the same rule produces different results. If a row comes back *Inconclusive*. The checker guide lists the [reasons a result can be Inconclusive](https://alexanderkyriakou.eu/ak/robots-txt-checker#reading-results).

<a id="cdn"></a>

## The checker says allowed. The CDN returns 403.

Both can be right. The checker evaluated a text file. A real request still has to get through the infrastructure serving the page. If the product path is allowed for search but the CDN blocks the request, adding another `Allow: /products/` line won't get your floor lamp back in front of anyone.

I'd check the public response at `https://yourdomain.eu/robots.txt` first. The CDN can serve different content from the file you last committed. Cloudflare's [Bot Preference Sync](https://developers.cloudflare.com/bots/additional-configurations/managed-robots-txt/) can add managed rules and, with its Training policy set to Disallow, also block identified training crawlers at the edge. It excludes mixed-use crawlers from that particular edge block. Its separate Content Signals vocabulary distinguishes `search`, `ai-input` and `ai-train`. If you see `Content-Signal` in your public file, read it according to that policy. It's a separate mechanism from `__usage_ai-training`.

Next, pull up the edge event for the affected URL. Did a [web application firewall rule](https://developers.cloudflare.com/ai-crawl-control/configuration/ai-crawl-control-with-waf/) block the request before it reached your server? Check the hostname, the response and the rule that took the action. An edge block may explain why you can't find the request at the origin. The reverse can happen too. A robots.txt disallow can coexist with an HTTP 200 for a visitor who asks for the page.

<a id="evidence"></a>

## What would convince me the rule worked?

For the shop, I'd keep three things together: the served robots.txt response, the checker result for each product and checkout URL, and a dated edge or server log entry for any request worth investigating. They answer three useful questions. What did we publish? Which rule applies? What did the server actually do?

If the request calls itself GPTBot, remember how little effort it took to copy that name from the checker. An HTTP client can supply the same text. If your site sits behind a CDN, first [check which address in your logs belongs to the client](https://alexanderkyriakou.eu/ak/verify-crawler-identity#client-ip). Otherwise, you could spend the next few minutes verifying your own proxy. Take that client IP and the claimed user-agent into my [Crawler IP Verifier](https://alexanderkyriakou.eu/ak/crawler-ip-verifier) to see whether the operator's published ranges support the claim. If several crawlers share the range, you may be able to identify the operator and still have an open question about which bot made the request.

If someone finds the floor lamp next week, I'd want to know *how* they found it. A link in ChatGPT search, a price supplied through the shop's feed, and a visit to the page after someone pasted its URL each give you a different place to look. And if the original brief was “let customers find the lamp, but decline training”, that first link might just be the part that's working.

---

Author is I, [Alexander Kyriakou](https://alexanderkyriakou.eu/).  
Proofreader, ChatGPT-6.1 Sol · Gemini 3 Flash  
Published November 11, 2026.
