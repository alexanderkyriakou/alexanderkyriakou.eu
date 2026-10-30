---
title: "Google Knowledge Graph Explorer — Technical Reference"
description: "Technical Markdown alternate covering entity search and lookup, identifiers, inspection, entity and language comparison, Wikipedia images, optional Wikidata research, sharing, CSV exports and evidence boundaries."
author: "Alexander Kyriakou"
canonical_url: "https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer"
markdown_url: "https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer.md"
date_modified: "2026-10-30"
language: "en"
---

# Google's Knowledge Graph Explorer

A browser-based interface by [Alexander Kyriakou](https://alexanderkyriakou.eu/) for exploring entity records returned by Google Enterprise Knowledge Graph Basic. Search by keyword or identifier, inspect available fields, compare entities or language records, and investigate a candidate Wikidata identity separately.

- [Interactive tool and accompanying guide](https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer)
- [Markdown alternate](https://alexanderkyriakou.eu/ak/google-knowledge-graph-explorer.md)
- [Contact the author](https://alexanderkyriakou.eu/contact)

This document describes the implemented tool and its interpretation boundaries as of October 30, 2026. It is a technical reference, not a live entity dataset, a saved search report or a Google API specification. Available records and fields depend on the request, language and source response.

## Purpose and evidence boundaries

A name is a string. An entity is the person, place, organisation, work or other subject that the name describes.

Different entities can share a name. One entity can have several names, aliases or labels in different languages. Similar wording is therefore a starting point for investigation, not proof of identity.

The explorer makes returned descriptions, types, identifiers and references easier to examine. It preserves distinctions between sources and identifier namespaces rather than automatically merging records.

A result does not establish:

- That the response contains everything Google knows about the subject.
- Whether Google displays a Knowledge Panel for the entity.
- Popularity, authority, confidence, entity strength or SEO value.
- That same-name records refer to the same real-world subject.
- That different source identifiers necessarily describe different real-world subjects.
- That a missing description, image or reference does not exist elsewhere.
- That an associated website or source link grants permission to reuse its content.

The explorer does not claim, create or edit Google entities or Knowledge Panels. Its illustrations do not represent relationships retrieved from the current results.

## Processing and privacy

Searches and lookups use server-side routes to request Google source data. Optional Wikipedia image retrieval and Wikidata research use separate routes. This is not an offline or exclusively local-processing tool.

Visitors do not enter their own API keys. Google credentials remain in server-side configuration.

Results, comparison selections and completed-request reuse are held in the current page's memory. Reloading clears selections and in-memory records. URL parameters can trigger a new search or identifier lookup.

The application does not provide visitor accounts, persistent saved collections or a historical record archive. Hosting and source-provider request handling are separate from the application's page-memory behaviour.

Copied links can expose their search terms and identifiers to anyone receiving them. Review what the URL contains before sharing it.

## Search contract

### Input

Enter a keyword, name, Cloud MID or Google MID.

A recognised identifier triggers direct lookup. Other input triggers keyword search.

| Input | Behaviour |
| --- | --- |
| Keyword or name | Searches for records using the selected language, type and result limit. |
| Google MID beginning `/m/` or `/g/` | Looks up the identifier in the selected language. |
| Cloud MID beginning `c-` | Looks up the identifier in the selected language. |
| Supported identifier with leading `kg:` | Removes that prefix before identifier validation. |

Identifier examples above describe formats; ellipses are not literal identifier characters.

The keyword is normalised for validation. Empty queries, excessive lengths, control characters, unsupported options and repeated parameters are rejected.

### Defaults and controls

| Setting | Default | Available choices |
| --- | --- | --- |
| Language | English | 39 language options |
| Entity type | All entities | All entities and 22 schema.org type presets |
| Requested results | 10 | 10, 20 or 50 |

Advanced search is initially collapsed. A recognised identifier uses the lookup path, where language applies but keyword-search type and result-count filters do not.

Language and type coverage vary by entity. A supported option can return no records. The requested result limit is not a guarantee that Google will return that many entities.

### Limits

| Constraint | Implemented limit |
| --- | --- |
| Keyword | 1–200 JavaScript string code units after server-side normalisation |
| Lookup identifier | Valid supported format, no more than 150 characters |
| Requested search results | 10, 20 or 50 |
| Simultaneous comparison selections | Three entities |

JavaScript string length counts UTF-16 code units; some characters use two units.

There is no application-level global visitor search counter or custom hard request allowance. Google quotas and service availability still apply. The three-entity comparison limit is an interface constraint, not an API quota.

### Starting examples and clearing input

The starting cards run searches for Bill Watterson, LAIKA, LLC and Dipper Pines using the current settings. They are query shortcuts, not fixed result sets.

The search field's X clears its text and returns focus to the input. Existing results and comparison selections remain until another action changes them.

A new search replaces results and closes inspection. Comparison selections remain available across searches within the page session.

## Results and name interpretation

Results preserve the order returned by Google. Each entry can show its name, short description, supplied types, image or placeholder, name-match badge and API position.

Actions support inspection, opening Google Search and adding the entity to comparison.

### API order

The compact API-order label uses Roman numerals. It describes position in the returned response.

It is not a popularity ranking, authority metric, confidence estimate or measurement of entity strength.

### Name-match labels

| Label | Meaning |
| --- | --- |
| Exact name match | The normalised entity name equals the normalised query. |
| Alternative-name match | A supplied alternative name equals the normalised query. |
| Partial name match | One normalised value contains the other as a complete token sequence. |
| Other returned result | None of those name-matching conditions applies. |

Matching uses Unicode compatibility normalisation, case folding, punctuation and spacing normalisation. It does not translate names, remove accents or infer synonyms.

These labels describe name similarity. They do not verify identity.

When several returned records share a name, the interface recommends comparing their descriptions, types and identifiers.

### Empty and unavailable results

A valid search can return no matching entities. The empty state offers ways to remove the type filter, change language or search Google by name.

No returned record does not establish that an entity or Knowledge Panel does not exist.

Source errors are distinguished from empty responses. The interface provides messages for unavailable services, timeouts, Google quota exhaustion, authorisation/configuration problems and unexpected response formats.

The source-record/Knowledge Panel note appears inside Results only when at least one entity has been returned.

## Record inspection

Select Inspect entity to open one returned record. Its result entry receives a subtle background highlight. Opening another inspector replaces the current record.

| Field or content | Meaning |
| --- | --- |
| Name | Source-supplied entity name |
| Short description | Supplied description, or an explicit missing-value message |
| Image | Available source image or initial-letter placeholder |
| Types | Source-supplied classifications |
| Google MID | Google identifier, displayed separately from Cloud MID |
| Cloud MID | Cloud record identifier |
| Google Search | Identifier-based link when possible; otherwise a name search |
| Language | Requested record language |
| Website | Associated URL supplied on the record |
| Source | Source of the returned record |
| Retrieved | Time the response was retrieved and normalised |
| Detailed description | Longer source text when supplied |
| References | Available image-source, description-source and licence links |

Retrieved does not mean the date Google last updated the underlying entity.

The explorer does not generate plausible replacements for absent descriptions or other missing fields.

### Identifier namespaces

Google MIDs usually begin with `/m/` or `/g/`. Cloud MIDs begin with `c-`. Wikidata items use Q-IDs such as `Q42`.

Corresponding records can carry different strings in different namespaces. Preserve the namespace with the value when documenting an investigation.

Google Search links use `kgmid` when a compatible Google MID is available. A Cloud MID is not substituted into that parameter. Without a Google MID, the link searches by name.

Neither link form guarantees Knowledge Panel display.

### Layout and navigation

Inspection appears beside results on desktop and below them on narrower layouts.

Desktop inspection remains sticky while scrolling through results. Tall content scrolls within a keyboard-focusable panel constrained to the available viewport below the comparison tray.

Expanding Compare languages releases inspection into normal page flow. The corner X closes it.

## Images and Wikipedia references

The explorer first attempts an image explicitly returned by Google. An image can be displayed even when a separate image-source URL is unavailable.

When Google has no usable image, a direct Wikipedia article supplied on the same record can provide a lead-image fallback. Eligible article associations come from the description reference or associated website.

The fallback does not search Wikipedia by name or guess an article.

### Retrieval and attribution

- HTTP and mobile Wikipedia article links are normalised to standard HTTPS article URLs.
- The supplied article establishes the association used for image retrieval.
- Wikimedia file metadata supplies available attribution and licence information.
- Automatic fallback accepts recognised free-licence or public-domain metadata.
- A failed thumbnail can be retried using the same file's original image URL.
- Image-source attribution appears in inspection.

Unavailable metadata, unsupported licensing and failed image loads leave a placeholder. Optional image retrieval does not block search results.

A source link is not a blanket permission to reuse the image. Review the particular file's terms and attribution requirements.

### Why a Knowledge Panel image can be missing here

Google Search presentation and the Enterprise API response are different layers.

A Knowledge Panel can cite Wikipedia while the returned API record contains no Wikipedia URL, description or image. Related records can have different coverage.

Manually supplying an article URL to an image service can demonstrate that the image is retrievable. It does not demonstrate that Google's returned record supplied that article association.

## Entity comparison

Add entities using their result comparison icons.

The selection tray:

- Holds up to three entities.
- Retains selections across searches within the page session.
- Rejects duplicate selections.
- Requires a stable identifier.
- Provides individual removal controls.
- Becomes sticky when scrolled past.
- Enables Compare when at least two entities are selected.

Compare opens the matrix and scrolls to it smoothly. Reduced-motion preferences use immediate navigation.

Removing a selection updates an existing comparison when at least two remain, without forcing another scroll. With fewer than two selections, the matrix is hidden. Removing the final selection hides the tray and clears its status message.

### Compared fields

Name, description, types, Google MID, Cloud MID, associated website, description reference, detailed description, source and retrieval time.

| Cell state | Interpretation |
| --- | --- |
| Identical values | The displayed normalised values are equal. |
| Different values | The displayed values differ. |
| Missing information | At least one compared value is unavailable. |

Missing information is not a contradictory claim.

An identity note distinguishes shared source identifiers, different Google MIDs and insufficient evidence. Different source records do not automatically establish whether their real-world subjects differ.

## Language comparison

Compare languages retrieves the same stable lookup identifier in two selected languages.

The first selector starts with the inspected record's language. The visitor explicitly chooses the second language; there is no fixed language pairing. The languages must differ.

Each successful response must contain the requested identifier. A failed or missing record remains explicit. A same-name search result is not substituted for it.

Language comparison uses the field-based comparison format. It is unavailable when the required lookup identifier is missing.

This is comparison of source records, not translation, translation-quality scoring or an automated explanation of coverage differences.

A changed label can be ordinary localisation. Missing wording can reflect limited coverage. Neither observation alone establishes a different entity.

## Optional Wikidata investigation

External identity research supports manual candidate review:

1. Open Find candidates on Wikidata.
2. Examine the external name-search results.
3. Enter a candidate Q-ID.
4. Select Retrieve Wikidata record beside the input.

Returned candidate information can include its label, description, aliases, website claims, record link, source, retrieval time and structured-data licence link.

### Identity evidence

The explorer compares applicable non-deprecated Wikidata `P646` values with the inspected record's Google MID. P646 is Wikidata's Freebase ID property.

A matching value is presented as supporting cross-source identity evidence. Otherwise the candidate remains unconfirmed.

A name-search match is not automatically associated with the Google record. Available website values that differ prompt further verification rather than an automatic conflict verdict.

Candidate data stays separate from Google data. This is selected-field research, not a complete Wikidata statement browser or independent fact-checking service. Optional retrieval failures do not remove Google results.

## Copying and shared URLs

### Identifiers

Copy controls appear beside available Google and Cloud MIDs. Success is confirmed locally with a temporary check icon and accessible feedback. Clipboard failures provide manual-copy guidance.

Identifier copying does not add a search-section status message.

### Search links

The results-heading link control copies the current URL and briefly displays Link copied.

The copied URL serialises the current search-field and filter values, plus the inspected record's lookup identifier when available. Editing the input without submitting can therefore change the query encoded in a subsequently copied link.

Opening a query-only URL runs that search. A URL containing an entity identifier performs a lookup to reopen inspection.

A shared link does not preserve comparison selections, reconstruct the entire original result list or freeze historical data. Returned source information can change.

## CSV export

Entity comparison provides an Export comparison CSV action.

The export includes normalised comparison fields, source and retrieval time. It omits images and detailed descriptions. Spreadsheet-sensitive formula prefixes are escaped.

There is no research-findings JSON export.

The existing reuse note states:

> Exports omit images and detailed descriptions. Review applicable source terms before reuse.

The interface's availability of an export does not grant unrestricted rights to the exported data.

## Knowledge Panels, source records and structured identity

The Knowledge Graph, an API record and a Knowledge Panel are related but distinct:

| Layer | Role |
| --- | --- |
| Knowledge Graph | Entity information and relationships in Google's systems |
| API response | Fields exposed by a particular request and service |
| Knowledge Panel | A presentation within Google Search |

The explorer examines returned records. It does not establish Knowledge Panel eligibility, availability or completeness.

For structured identity descriptions, JSON-LD provides a linked-data format and Schema.org provides a vocabulary. An `@graph` groups node descriptions; relationships require appropriate properties and references to the intended nodes.

Putting objects in one array does not automatically express a relationship between them. Identity assertions require verified associations, rather than similar names alone.

## Investigation workflow

1. Search a name or look up a known identifier.
2. Review the returned types, descriptions and name-match labels.
3. Inspect identifiers, associated websites and source references.
4. Compare same-name or otherwise relevant records without assuming they are the same subject.
5. Compare the same identifier across languages where useful.
6. Investigate a Wikidata candidate separately, preserving the distinction between a candidate and an established association.
7. Record the source and retrieval time alongside any exported or copied values.
8. Review source terms before reusing descriptions, data or images.

A photograph, long description or first-place API position is not an authority measurement. A missing field is a limitation of the available response, not evidence that the information does not exist elsewhere.

## Supported languages

The 39 choices are:

Arabic, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Norwegian, Persian, Polish, Portuguese, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swedish, Thai, Turkish, Ukrainian and Vietnamese.

Selectable language codes do not guarantee complete records or equal coverage.

## Entity type presets

Alongside All entities:

`Person`, `Organization`, `Corporation`, `EducationalOrganization`,
`LocalBusiness`, `SportsTeam`, `MusicGroup`, `Place`, `City`, `Country`,
`AdministrativeArea`, `LandmarksOrHistoricalBuildings`, `CreativeWork`,
`Book`, `Movie`, `TVSeries`, `MusicAlbum`, `MusicRecording`, `VideoGame`,
`Event`, `SportsEvent` and `Product`.

These are supported search presets, not a claim of exhaustive classification coverage.

## Accessibility and presentation

JavaScript is required. Interactive controls have accessible names, status updates use live regions, and keyboard focus indicators remain available.

Completing a search does not automatically focus the returned-count heading. Inspection and comparison retain their own navigation behaviour.

Mobile result metadata places the name-match badge and API order on a shared row above the image, text and actions.

The decorative header uses Hairline's Settle illustration. Its tiles respond to pointer and touch input, without autoplay. Reduced-motion handling is retained. The illustration does not display relationships from the returned entities.

## References and related documentation

These links provide background documentation. They do not guarantee current API availability, complete source coverage or reuse rights for a particular returned field.

- [Google Enterprise Knowledge Graph](https://cloud.google.com/enterprise-knowledge-graph/docs)
- [Google's explanation of Knowledge Panels](https://support.google.com/knowledgepanel/answer/9163198)
- [Wikidata items](https://www.wikidata.org/wiki/Help:Items)
- [Wikidata P646: Freebase ID](https://www.wikidata.org/wiki/Property:P646)
- [Wikidata structured-data access](https://www.wikidata.org/wiki/Wikidata:Data_access)
- [Schema.org](https://schema.org/)
- [JSON-LD 1.1](https://www.w3.org/TR/json-ld11/)
- [Hairline](https://github.com/lucasmarkes/hairline)

## Attribution and source terms

The tool and accompanying editorial work are by Alexander Kyriakou. Consult the licensing notices on the interactive page and in its source distribution for the applicable first-party terms.

Source data and third-party material remain subject to their own terms. A licence covering application code or editorial content does not automatically license Google records, Wikipedia text or images returned from other sources.

Hairline's Settle illustration is by Lucas Marques, distributed under the MIT licence; its notice is retained in the local JavaScript asset. Wikidata structured data is offered under CC0. Wikipedia image licensing and attribution must be checked for the individual file.