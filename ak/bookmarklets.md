---
title: "Bookmarklets for SEO, Writing & Everyday Browsing — Technical Reference"
description: "Technical Markdown alternate covering bookmarklet installation, configuration, 23 active tools, four paused entries, Greek proofreading, keyword repetition, product SEO checks, browser restrictions, data handling and exports."
author: "Alexander Kyriakou"
canonical_url: "https://alexanderkyriakou.eu/ak/bookmarklets"
markdown_url: "https://alexanderkyriakou.eu/ak/bookmarklets.md"
date_published: "2026-11-04"
date_modified: "2026-11-05"
language: "en"
---

# Bookmarklets for SEO, writing & digital marketing

A few fewer clicks. Another use for that crowded bookmarks bar.

A collection of small browser tools by [Alexander Kyriakou](https://alexanderkyriakou.eu/) for SEO, writing, digital marketing, LLM research and everyday browser tasks.

- [Interactive collection and installation buttons](https://alexanderkyriakou.eu/ak/bookmarklets)
- [Markdown alternate](https://alexanderkyriakou.eu/ak/bookmarklets.md)
- [Collection JavaScript](https://alexanderkyriakou.eu/assets/js/bookmarklets.js)
- [Website source repository](https://github.com/alexanderkyriakou/alexanderkyriakou.eu)
- [Licensing and copyright](https://alexanderkyriakou.eu/licensing)
- [Contact the author](https://alexanderkyriakou.eu/contact)

This document describes the collection as of November 5, 2026. It is a technical alternate of the page. Use the interactive collection for draggable bookmarks, current generated code and configuration controls.

## Useful little shortcuts, one bookmark away

A bookmarklet is a small piece of JavaScript saved as a browser bookmark. Click it to work with the page you're viewing, or send that page's URL to another service.

Quirky little time-savers, in much the same spirit as searching selected text from your browser's right-click menu. A few saved clicks add up. For an occasional task, I often prefer a bookmarklet to another extension or a tab kept open just in case. Save the ones you use and leave the rest here.

## Collection and availability

There are **27 entries: 23 active and four paused**. Paused entries are greyed out and disabled on the interactive page. They are not working search-query extraction tools.

| Group | Active | Paused | Total |
| --- | ---: | ---: | ---: |
| SEO & page inspection | 9 | 0 | 9 |
| Writing & digital marketing | 6 | 0 | 6 |
| LLM research & prompts | 2 | 4 | 6 |
| Everyday browser utilities | 6 | 0 | 6 |
| **Total** | **23** | **4** | **27** |

Active does not mean universally supported. Some entries depend on browser APIs, site structure, account access or external services. Experimental and limited-support labels remain relevant.

## Installation and configuration

### Drag to the bookmarks bar

1. Show your browser's bookmarks bar.
2. Adjust the tool's settings, if needed.
3. Drag its bookmark button from the collection into the bar.
4. Open the page you want to work on and click the saved bookmark.

Clicking an installation button on the collection page shows instructions. Dragging saves the bookmarklet for use on other pages.

### Manual installation

1. Use the main copy icon beside **Bookmarklet code** to copy the encoded bookmarklet URL.
2. Create a browser bookmark.
3. Paste the copied value into the bookmark's URL or address field.
4. Retain the `javascript:` prefix and save the bookmark.

Mobile installation and feature support vary. Use the browser's manual bookmark editor where available; desktop installation instructions do not establish mobile compatibility.

### Changing settings

Configuration controls update the displayed code and draggable bookmark immediately. Previously saved bookmarks do not update automatically. After changing settings on the collection page, save the bookmarklet again. Updates to a tool's implementation also require re-saving its bookmarklet; an existing bookmark retains the code saved into it.

Some tools also expose controls in their result page or floating panel. Those controls are described with the relevant tool below.

### Encoded and readable code

The main copy icon copies an encoded bookmarklet URL for installation. Encoding preserves whitespace and special characters within the URL.

Expand a code block to find a second copy icon at its bottom right. That icon copies human-readable JavaScript. Both forms run equivalent JavaScript; the main copy action is the installation option.

## SEO & page inspection

### [Schema Validator](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-schema)

Send the open page to Schema.org's markup validator.

Opens an external service with the current URL. Private pages may not be fetchable.

### [PageSpeed Insights](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-pagespeed)

Start a performance check for the page you are viewing.

Opens Google PageSpeed Insights with the current URL. Publicly reachable pages work best.

### [Google Search Console](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-gsc)

Open the Performance report for the active page over the past 12 months.

Uses the current page as a contains filter. Requires access to the configured property.

- **Setting:** Search Console property, such as `sc-domain:yourdomain.eu` or `https://yourdomain.eu/`.
- **Blank setting:** uses the current hostname as a Domain property, removing `www.`.
- **Other subdomains:** enter the parent domain explicitly when that is the property you intend to use.

The page filter is **contains**, not an exact-URL filter. Review the selected property and filter when interpreting the report.

### [Wayback history](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-wayback)

See archived versions of the current URL.

Opens the Internet Archive. A page may have no saved captures.

### [Export page links](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-links)

A new-tab report of URLs, anchor texts, and their relationships.

Includes URL + anchor pairs, plain anchor texts, unique URL lists, internal/external filters, and CSV export. Internal means the same hostname.

The report describes links in the current document. Its internal/external distinction is based on hostname, not an inferred organisational relationship between domains or subdomains.

### [Colour link attributes](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-attributes)

See nofollow, sponsored, ugc, external, and new-tab links in place.

A floating legend controls colours and labels. Stripes show overlapping attributes. Close it, press Escape, or run again to restore the page.

Highlights make link attributes and targets easier to inspect; they do not establish how a particular crawler will treat a link.

### [Image inspector](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-images)

Check alt text, dimensions, sources, and current image load states.

Reports `<img>` elements in the current document, including `srcset` and `sizes`. Empty alt can be intentional. Pending lazy images are not marked broken.

The report reflects the loaded document and its current state. It is not a complete image inventory for the website or a complete image accessibility audit.

### [Link health checker](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-link-health)

Check page links and distinguish broken URLs from unreadable responses.

Start checks from the report. CORS, timeouts and policy blocks are “Unable to verify”, not broken. Same-host responses can use your signed-in session.

| Setting or limit | Value |
| --- | --- |
| Maximum unique URLs | Configurable from 1 to 500 |
| Default maximum | 100 |
| Concurrent requests | 3 |
| Request timeout | 8 seconds |

The tool checks links from the current page; it does not crawl the entire site. An unverifiable response does not automatically establish a broken destination.

### [Product page SEO auditor](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-product-seo)

Inspect the current product page in a floating panel, with a downloadable JSON audit and an illustrative search result.

| Area | Checks and observations |
| --- | --- |
| Page metadata | Title, meta description, duplicate tags, Open Graph and Twitter card fields, plus an expandable list of all meta tags. Character counts are informational, not fixed search-result limits. |
| Canonical | HTML canonical presence, empty or invalid URLs, multiple tags, placement and whether the resolved URL points to the current page or another URL. |
| Robots directives | Observed robots, Googlebot, Googlebot News and Bingbot meta directives. Google blocking signals use `robots` and `googlebot` noindex/none directives; other agents are listed separately. |
| Page content | H1 elements, main-content word count, document language, images missing alt attributes and any hreflang links. No universal description word count or H1-count ranking rule is imposed. |
| JSON-LD | Parse errors, observed types and basic Product fields, including locally defined `@id` references, offers, prices, currency, availability, price-expiry dates, images and aggregate ratings. |
| Other schema formats | Product/ProductGroup scopes in microdata and RDFa are detected. Their individual fields are not validated. ProductGroup is distinguished from individual Product variants. |

Open Graph and Twitter fields appear on separate lines. Result labels wrap between words so they remain readable in a narrow panel.

The preview places the favicon to the left of the site name and URL. It uses available same-origin WebSite JSON-LD, `og:site_name`, application-name metadata or the hostname to approximate the site name. Desktop/mobile widths and a Product selector help inspect the available markup. Price, availability and ratings are shown from the selected Product where usable data exists. Loading its thumbnail is optional.

The favicon is requested from a declared icon URL or the page origin's `/favicon.ico`, with a generic fallback if it cannot load. Clicking **Load selected product thumbnail** requests that image from its source. Google may choose a different site name, favicon, title, description or result treatment; this preview does not reproduce a live Google result.

**Fetch response headers** sends one fresh same-origin `HEAD` request using the current session. It reports HTTP status, the final URL, redirects, `X-Robots-Tag` and `Link` headers. These are not the original navigation headers. HEAD and GET responses, or browser and crawler responses, may differ. The request has a ten-second timeout; a failed or unsupported HEAD request does not establish a broken page.

The audit does not verify actual index status, Google's selected canonical, robots.txt access, hreflang reciprocity or full rich-result eligibility. It reads the rendered document rather than comparing it with the original server HTML. JSON-LD context expansion and complete nested schema requirements are outside its basic field checks. Use the linked [Rich Results Test](https://search.google.com/test/rich-results) and [Schema Validator](https://validator.schema.org/), and Search Console where appropriate, for further verification. External test links send the current URL when opened.

## Writing & digital marketing

### [Quick notes](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-notes)

Keep draggable Markdown notes on the page you are viewing.

A floating panel stays in the active tab. Drag its heading or focus it and use arrow keys. Ctrl/Cmd+S while editing saves an `.md` file with the source page appended. Notes are not stored automatically.

The saved file uses a URL-derived filename and includes a source-page reference. Download notes you want to keep.

### [Edit page copy](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-design)

Toggle design mode to try new headlines and copy on a live layout.

Edits are local to the tab. Run again to stop editing; refresh to discard changes.

This is temporary editing of the displayed document. It does not publish changes to the website or save them to its content-management system.

### [Copy clean page content](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-content)

Extract selected text or main content as plain text or Markdown.

A new tab lets you review and copy the result. Complex layouts may need cleanup; unloaded content and cross-origin frames are outside scope.

| Setting | Options | Default |
| --- | --- | --- |
| Output format | Markdown; plain text | Markdown |
| Include title and source URL | Yes; no | Yes |

### [UTM campaign builder](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-utm)

Build a campaign URL here, or save a bookmarklet with your campaign settings.

The saved bookmarklet applies the campaign to the page open when you run it. Blank fields remove the matching UTM parameter. Other parameters and fragments stay intact.

| Field | Role |
| --- | --- |
| Destination URL | Used for the copyable campaign URL built on the collection page. It is not fixed into the saved bookmarklet. |
| Source | `utm_source`; required to create a campaign bookmarklet. |
| Medium | `utm_medium`; required to create a campaign bookmarklet. |
| Campaign | `utm_campaign`; required to create a campaign bookmarklet. |
| Term | Optional `utm_term`. |
| Content | Optional `utm_content`. |

The copyable URL and reusable bookmarklet serve different purposes. The former tags a supplied destination; the latter retains campaign settings and applies them to whichever page is open when run.

### [Greek orthography](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-greek-orthography)

Review Greek text in a floating panel and check possible spelling, punctuation and grammar issues through a LanguageTool-compatible API.

Select main content, page text without navigation/forms, or the text selected when the bookmarklet launched. The extracted text is an editable snapshot. Review it and approve the displayed destination before clicking **Send text & check Greek**. Nothing is sent automatically when the panel opens. Changing the text or endpoint resets approval and invalidates earlier results.

The default endpoint is `https://api.languagetool.org/v2/check`, using a POST request with language fixed to Greek (`el`). The request omits browser credentials and the referrer. A custom HTTPS endpoint must accept LanguageTool's parameters, support Greek and allow requests from the page through CORS. No API key is embedded in the bookmarklet.

| Tool behaviour | Limit or detail |
| --- | --- |
| Text per manual check | Maximum 20,000 UTF-8 bytes. This is a byte limit, not 20,000 Greek characters. |
| Checks | At least ten seconds between submissions within the same panel. The service can impose additional limits. |
| Request timeout | 30 seconds. |
| Long text | Select a shorter passage or edit the snapshot. Text is not silently truncated or automatically split into batches. |
| Results | Possible issues with highlighted excerpts, messages, available suggestions and a JSON download. |
| Editing | Suggestions do not automatically change the original page. |

The [public API documentation](https://dev.languagetool.org/public-http-api) currently lists limits of 20 requests per IP per minute, 75 KB of text per IP per minute, and 20 KB per request. Suggestions are limited to up to 30 misspelled words. Its availability, behaviour and limits can change; the bookmarklet does not override those service limits or automatically retry failed checks.

Greek coverage depends on the service's dictionaries and rules. Names and specialist terms may be flagged, and a result with no issues does not establish error-free text. Page CSP, CORS or network restrictions may prevent the request. This implementation uses the API; it does not download a local Greek dictionary.

The exact reviewed text is sent to the displayed endpoint. See [LanguageTool's privacy policy](https://languagetool.org/legal/privacy) when using the default service, or the relevant policy for a custom endpoint. Downloaded results include the submitted text, matches, endpoint and source-page URL.

### [Keyword repetition & stuffing review](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-keyword-review)

Count words and review repetition in a floating, browser-local report. Choose main content, page text without navigation/forms, or the text selected at launch. Add an optional target word or phrase and optionally ignore Greek tonos/other accents during matching.

The report includes total words, unique tokens, frequent words, repeated two- and three-word phrases, consecutive repeated-token pairs and duplicated paragraphs of at least eight words. Unicode word tokens include numbers. Matching is case-insensitive, treats Greek sigma variants as equivalent and does not stem words or expand synonyms. Inflected forms remain separate. The word-frequency table hides a small list of common Greek/English stopwords; totals and target counts still include them.

| Target metric | Meaning |
| --- | --- |
| Exact phrase occurrences | Matching token sequences; overlapping matches are included. Target phrase words must be separated by whitespace within one paragraph. |
| Occurrences per 100 words | Target occurrences divided by all words, multiplied by 100. A multiword target still counts as one occurrence each time it appears. |
| Target word coverage | Share of all word positions covered by the target. Overlapping positions count once. |
| Local cluster | Most target occurrences within any 100-word window, or the whole sample when shorter. |

The default density review signal requires at least three target occurrences and a rate above 3 occurrences per 100 words. The default cluster signal starts at five occurrences in a window. Both thresholds are adjustable heuristics, not Google rules or proof of keyword stuffing. Samples under 100 words receive a short-sample note. Repeated product names, specifications and natural language need contextual review.

Click a word or phrase in the tables, or use **Highlight target**, to highlight its occurrences on the page in bright yellow. **Previous match** and **Next match** move between occurrences; the current match is underlined on the page. The words in the report's lists are clickable without underlines.

Highlights remain after closing/reopening the panel, changing report settings or refreshing the analysis. Choosing another word or phrase replaces them. **Clear highlights**, a full page reload or closing the page removes them. They are temporary document state, not saved annotations or changes to the website's source. Page scripts that replace or alter the matched text can affect the ranges.

Browsers with CSS custom highlight support highlight matches without wrapping or replacing the page's text nodes. Where that styling is unavailable, navigation selects one match at a time instead; ordinary browser selection can change when the user selects other text. This fallback does not guarantee persistent yellow highlights.

Refresh the analysis after page content changes. Hidden or excluded text, shadow trees, cross-origin frames and unloaded content are outside the main/page scope. The JSON download contains the analysis settings and metrics, including any detected duplicate paragraphs. No page text is sent to a proofreading or SEO service by this tool.

## LLM research & prompts

### [LLM citation exporter](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-ai-citations)

**Status: active, experimental.**

Collect source titles and URLs from ChatGPT, Claude, Gemini, or Google AI Mode.

Provider metadata is preferred. Visible answer links are a clearly labelled partial fallback and can include non-citation links. AI Mode layouts without ordinary source links are unsupported.

Provider metadata and visible answer links have different provenance. A collected link is not automatically a verified citation, proof that the source was consulted, or evidence that it supports the surrounding claim. Availability depends on what the current service exposes to the browser.

### [Prompt with page context](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-prompt)

Prepare a reusable prompt with selected text or the current page's main content.

The template is used exactly as written; only `{title}`, `{url}` and `{content}` are replaced. Copy-and-open buttons launch ChatGPT, Claude or Gemini. Paste and send there.

| Placeholder | Replacement |
| --- | --- |
| `{title}` | Current page title. |
| `{url}` | Current page URL. |
| `{content}` | Selected text or the current page's main content. |

The default template asks for a summary of key points, unclear claims and three specific improvements, followed by the page title, source URL and content. Edit the template before saving a bookmarklet if you want a different task or format.

The tool prepares an editable prompt. Opening a provider does not automatically submit the prompt; the user pastes and sends it.

### Paused search-data entries

**All four entries below are paused and disabled.** Their descriptions record intended scope, not available extraction functionality. Do not treat them as working tools for extracting internal searches or query fan-out.

| Entry | Intended scope and evidence boundary |
| --- | --- |
| [ChatGPT search queries](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-chatgpt-queries) | Search metadata exposed by a saved conversation. The paused entry's description includes nested query formats, tool-call JSON, branch selection and local JSON import; these are not advertised as available functions. |
| [Claude search queries](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-claude-queries) | Exposed web-search tool queries in a conversation. The paused entry describes workspace selection and local conversation JSON; these are not advertised as available functions. |
| [Gemini exposed search data](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-gemini-queries) | Browser-exposed metadata or a local grounding JSON file. Gemini's web interface does not reliably expose internal searches. Recognised query fields and visible suggestions are different evidence. |
| [Google AI Mode exposed data](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-ai-mode-queries) | Available query metadata without inventing hidden searches. Actual internal fan-out extraction remains unverified. |

Missing or inaccessible metadata does not establish that a service performed no searches. Visible suggestions or answer links do not reconstruct its internal search process.

## Everyday browser utilities

### [Bookmarklet builder](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-builder)

Turn a platform's URL-checking address into your own bookmarklet.

Supply only the platform URL or its input prefix, such as `https://validator.schema.org/#url=`. Empty query or fragment values are filled with the page you are viewing. Otherwise a `url` parameter is added; the destination platform must support it.

Schema Validator, PageSpeed and Wayback homepages are recognised. For other tools, include the empty parameter they expect, or an optional `{url}` insertion marker. Preview uses `https://yourdomain.eu/page`.

If a service accepts a page URL as part of its own address, this can often turn it into a simple shortcut. It cannot infer every platform's required syntax from its homepage. For something more specific, you can ask a chatbot to make a bookmarklet.

### [Clean URL & copy](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-clean)

Remove tracking clutter or all query parameters, then copy the cleaned URL.

| Mode | Behaviour |
| --- | --- |
| Known tracking parameters | Default. Removes recognised tracking parameters. |
| All query parameters | Removes every query parameter, which can change which page or product is shown or how the destination behaves. |

Fragments are preserved. Removing tracking parameters is not a guarantee that a destination cannot identify a visit by other means.

### [Show URLs as link text](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-anchors)

Replace text links with their destinations to inspect where they lead.

Run again to restore the original link contents. Applies to the current document's text links.

### [Screen colour picker](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-colour)

**Status: active, limited browser support.**

Pick a screen colour and get its HEX value.

Requires HTTPS and a browser with EyeDropper support, such as desktop Chrome or Edge. Press Escape to cancel.

### [Clear accessible cookies](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-cookies)

Attempt to remove cookies JavaScript can access on the current site.

Asks before deletion. Can affect preferences and sign-in. HttpOnly cookies, unknown paths, third-party cookies and other site storage are not cleared.

This is not a complete cookie or site-data reset.

### [Experimental page capture](https://alexanderkyriakou.eu/ak/bookmarklets#bookmarklet-screenshot)

**Status: active, experimental.**

Render the loaded page to a downloadable PNG.

Loads html2canvas 1.4.1 from cdnjs only after confirmation. This is a visual approximation; CORS, CSP, unsupported CSS, video, frames, and page size can limit results. Native browser screenshots are more faithful.

The output is a rendered approximation of loaded content, not a browser-native screenshot or a guarantee of a complete full-page capture.

## Browser and document boundaries

Page inspection covers the loaded document rather than an entire website. Content not loaded into that document may be absent from reports or exports.

Browser-internal pages, PDF viewers, content inside cross-origin frames, site policies, permissions and unsupported APIs can limit execution or access. Restrictions differ between browsers and actions. Running one bookmarklet successfully does not establish that every other tool will work on the same page.

Reports describe what was available when the tool ran. A missing image, inaccessible link response or absent AI metadata must be interpreted with that tool's stated limits.

## Processing and privacy

Most processing happens locally, but the collection does not make a blanket claim that every action stays in the browser.

| Action | Data handling |
| --- | --- |
| Local inspection, editing, text extraction and URL construction | Processing takes place in the current browser. Saved files and copied results can include page content or URLs. |
| Greek orthography | Sends only the reviewed, approved text to the displayed LanguageTool-compatible endpoint on a manual check. The result export includes that text and the source URL. |
| Keyword repetition & stuffing review | Counts, analysis and page highlights run locally. The JSON export can include detected duplicate paragraphs. |
| Product page SEO auditor | Inspects the rendered document locally. Optional HEAD checks request the current page using the existing session; the preview loads a favicon and optionally a product thumbnail. External test links pass the current URL when opened. |
| Schema Validator, PageSpeed Insights, Search Console and Wayback shortcuts | Pass the current page URL to the named external service. |
| Custom shortcuts made with Bookmarklet builder | Pass the current page URL to the configured destination. |
| Link health checks | Make requests to checked URLs. Same-host responses can use the existing signed-in session. |
| LLM citation exporter | Reads the current service using the existing session and collects available metadata or visible answer links. |
| Prompt with page context | Prepares content for copying. The user chooses when to paste and send it to the selected provider. |
| Experimental page capture | Loads an external renderer after confirmation. |
| Clear accessible cookies | Attempts deletion only after confirmation; its scope is limited to accessible cookies. |

Quick notes does not save automatically. Review what a copied prompt, exported report, saved note or generated URL contains before sharing it.

## Managing saved shortcuts and Markdown

Folders and shorter names help organise a crowded bookmarks bar. Ordinary website bookmarks can often be recognisable by their icon alone; for these tools, keeping just the emoji in the bookmark's name is another option.

For notes saved as Markdown, use whichever online or local viewer or editor suits you. [MarkText](https://marktext.me/) is an open-source desktop option. Download notes you want to keep before leaving the page.

## Licence and attribution

© 2026 Alexander Kyriakou. Original bookmarklet software is available under [CPAL-1.0](https://opensource.org/license/cpal-1.0). See the website's [licensing and copyright page](https://alexanderkyriakou.eu/licensing) for applicable scope and attribution information.

Result pages and floating panels link back to the original collection. The new panels display this credit:

> [Alexander Kyriakou’s bookmarklet collection](https://alexanderkyriakou.eu/ak/bookmarklets)

Third-party software, icons, fonts, photographs and other outside material retain their own rights and licence terms. Third-party notices are maintained centrally; this Markdown alternate does not replace the applicable licence texts or source notices.
