/*
 * The contents of this file are subject to the Common Public Attribution License Version 1.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at https://opensource.org/license/CPAL-1.0. The License is based on the Mozilla Public License Version 1.1 but Sections 14 and 15 have been added to cover use of software over a computer network and provide for limited attribution for the Original Developer. In addition, Exhibit A has been modified to be consistent with Exhibit B.
 *
 * Software distributed under the License is distributed on an "AS IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the specific language governing rights and limitations under the License.
 *
 * The Original Code is the Robots.txt Checker and Multi-Crawler Rule Tester, including its robots.txt parser, rule-matching and validation logic, crawler catalogue, resource evaluation functionality, and dedicated JavaScript application, originally published at https://alexanderkyriakou.eu/ak/robots-txt-checker.
 *
 * The Original Developer is not the Initial Developer and is __________. If left blank, the Original Developer is the Initial Developer.
 *
 * The Initial Developer of the Original Code is Alexander Kyriakou. All portions of the code written by Alexander Kyriakou are Copyright (c) 2026 Alexander Kyriakou. All Rights Reserved.
 *
 * Contributor ______________________.
 *
 * No alternative license is offered by the Initial Developer for the Original Code under this source notice.
 *
 * Section 14 Attribution Information (Exhibit B):
 * Attribution Copyright Notice: Copyright (c) 2026 Alexander Kyriakou.
 * Attribution Phrase (not exceeding 10 words): Based on the Robots.txt Checker by Alexander Kyriakou
 * Attribution URL: https://alexanderkyriakou.eu/ak/robots-txt-checker
 * Graphic Image as provided in the Covered Code, if any: None.
 * Display of Attribution Information is required in Larger Works which are defined in the CPAL as a work which combines Covered Code or portions thereof with code not governed by the terms of the CPAL.
 *
 * SPDX-License-Identifier: CPAL-1.0
 */

(function () {
  'use strict';

  // User-agent catalogue
  const E = (id, name, cat, o = {}) => ({
    id, name, cat, token: o.t === undefined ? id : o.t,
    fb: o.fb || [], w: o.w || 0, note: o.n || '',
    tags: o.tags || [], ignoresRobots: o.ir || false,
    mayIgnoreRobots: o.mi || false
  });
  const G = ['googlebot'];
  const USER_AGENTS = [
    // Top Search Engines
    E('googlebot', 'Googlebot', 'top-search', { tags: ['image-bots', 'news-bots'], n: 'Primary crawler for Google Search, including Discover and related search features' }),
    E('bingbot', 'Bingbot', 'top-search', { fb: ['msnbot'], tags: ['image-bots', 'news-bots'], n: 'Primary crawler for Microsoft Bing Search indexing, including related search verticals' }),
    E('baiduspider', 'Baiduspider', 'top-search', { n: 'Primary crawler for Baidu, a major Chinese search engine' }),
    E('yandexbot', 'YandexBot', 'top-search', { fb: ['yandex'], n: 'Primary crawler for Yandex Search; follows dedicated YandexBot rules or shared Yandex rules when no dedicated group exists' }),
    E('applebot', 'Applebot', 'top-search', { fb: ['googlebot'], tags: ['ai-search'], n: 'Apple crawler supporting Siri, Spotlight, and Apple search experiences; follows Googlebot rules when Applebot rules are absent' }),
    E('duckduckbot', 'DuckDuckBot', 'top-search', { n: 'DuckDuckGo crawler supporting its independent search index' }),
    E('slurp', 'Yahoo! Slurp', 'top-search', { n: 'Legacy Yahoo search crawler; Yahoo Search primarily relies on partner indexes' }),
    E('yeti', 'Naver (Yeti)', 'top-search', { n: 'Web crawler for Naver, a major South Korean search engine' }),
    // AI & LLM Scrapers
    E('ai2bot', 'AI2Bot', 'ai-search', { n: 'Allen Institute for AI crawler collecting web data for AI research' }),
    E('amazonbot', 'Amazonbot', 'ai-search', { n: 'Amazon web crawler supporting search, AI, and other Amazon services' }),
    E('amzn-searchbot', 'Amzn-SearchBot', 'ai-search', { n: 'Amazon crawler supporting search discovery and retrieval' }),
    E('amzn-user', 'Amzn-User', 'ai-search', { n: 'On-demand webpage fetcher for user-initiated Amazon services' }),
    E('anthropic-ai', 'anthropic-ai (legacy)', 'ai-search', { n: 'Legacy Anthropic crawler identifier associated with AI data collection' }),
    E('apifybot', 'ApifyBot', 'ai-search', { n: "Crawler associated with Apify's web scraping infrastructure" }),
    E('applebot-extended', 'Applebot-Extended (control token)', 'ai-search', { w: 2, n: 'Control token for Apple foundation model training; wildcard applicability is not explicitly documented' }),
    E('bravebot', 'Bravebot (Brave Search / AI)', 'ai-search', { tags: ['top-search'], n: 'Independent Brave Search crawler supporting web search and AI answers' }),
    E('bytespider', 'Bytespider (ByteDance)', 'ai-search', { n: 'ByteDance crawler associated with web data collection and AI development' }),
    E('ccbot', 'CCBot (Common Crawl)', 'ai-search', { n: 'Common Crawl crawler collecting public web data for open datasets' }),
    E('chatgpt-user', 'ChatGPT-User', 'ai-search', { w: 2, n: 'On-demand webpage fetcher for user-initiated ChatGPT interactions; robots.txt may not apply to all requests' }),
    E('claude-searchbot', 'Claude-SearchBot (Anthropic Search)', 'ai-search', { n: 'Anthropic crawler supporting Claude web search results' }),
    E('claude-user', 'Claude-User (Anthropic On-Demand)', 'ai-search', { n: 'On-demand webpage fetcher for user-initiated Claude interactions' }),
    E('claude-web', 'Claude-Web (legacy)', 'ai-search', { n: 'Legacy web fetching agent associated with Claude' }),
    E('claudebot', 'ClaudeBot (Anthropic Training)', 'ai-search', { n: 'Anthropic crawler collecting web content potentially used for AI model training' }),
    E('cohere-ai', 'cohere-ai (Cohere AI)', 'ai-search', { n: 'Cohere-associated web crawler for AI data collection' }),
    E('cohere-training-data-crawler', 'cohere-training-data-crawler', 'ai-search', { n: 'Crawler associated with collecting training data for Cohere AI models' }),
    E('crawl4ai', 'Crawl4AI', 'ai-search', { n: 'Open-source web crawling framework used by AI applications and agents; not a centrally operated crawler' }),
    E('deepseekbot', 'DeepSeekBot', 'ai-search', { n: 'Web crawler associated with DeepSeek AI services' }),
    E('diffbot', 'Diffbot', 'ai-search', { n: "AI-powered crawler extracting structured web data for Diffbot's Knowledge Graph" }),
    E('duckassistbot', 'DuckAssistBot', 'ai-search', { tags: ['top-search'], n: 'DuckDuckGo crawler associated with AI-assisted answer retrieval' }),
    E('facebookbot', 'FacebookBot', 'ai-search', { tags: ['social-bots'], n: 'Meta crawler associated with web content indexing and AI-related data collection' }),
    E('gemini-deep-research', 'Gemini-Deep-Research', 'ai-search', { n: 'Community-listed identifier associated with Gemini Deep Research; official crawler behavior unverified' }),
    E('google-extended', 'Google-Extended (Gemini control token)', 'ai-search', { w: 2, n: 'Control token governing certain Gemini model training and grounding uses; does not control Google Search indexing' }),
    E('google-notebooklm', 'Google-NotebookLM (legacy)', 'ai-search', { n: 'Former official Google fetcher for NotebookLM sources; replaced by Google-GeminiNotebook in 2026' }),
    E('google-gemininotebook', 'Google-GeminiNotebook', 'ai-search', { w: 2, n: 'User-triggered source fetcher for Gemini Notebook; generally ignores robots.txt restrictions' }),
    E('google-agent', 'Google-Agent', 'ai-search', { ir: true, n: 'Google-hosted AI agent fetching webpages and performing user-requested actions; generally ignores robots.txt restrictions' }),
    E('grok-agent', 'Grok-Agent (xAI)', 'ai-search', { n: 'Reported user-agent associated with xAI/Grok; official behavior unverified' }),
    E('grokbot', 'GrokBot (xAI)', 'ai-search', { n: 'Reported crawler associated with xAI/Grok; exact robots.txt behavior unverified' }),
    E('gptbot', 'GPTBot (OpenAI Training)', 'ai-search', { n: 'OpenAI crawler collecting web content that may be used to train AI models' }),
    E('kangaroo bot', 'Kangaroo Bot', 'ai-search', { n: 'Unverified crawler identifier; operator and purpose not established' }),
    E('kimi-user', 'Kimi-User', 'ai-search', { n: "Reported on-demand webpage fetcher associated with Moonshot AI's Kimi" }),
    E('manus-user', 'Manus-User', 'ai-search', { n: 'Reported webpage fetcher associated with Manus AI workflows' }),
    E('meta-externalagent', 'Meta-ExternalAgent', 'ai-search', { n: 'Meta crawler collecting public web content for AI-related uses' }),
    E('meta-externalfetcher', 'Meta-ExternalFetcher', 'ai-search', { n: 'Meta fetcher retrieving webpages in response to user or product requests' }),
    E('meta-webindexer', 'Meta-WebIndexer', 'ai-search', { tags: ['social-bots'], n: 'Meta crawler indexing public web content for search and discovery' }),
    E('mistralai-index', 'MistralAI-Index (Mistral Search)', 'ai-search', { n: 'Mistral crawler indexing web content to support search-powered AI responses' }),
    E('mistralai-training', 'MistralAI-Training', 'ai-search', { n: 'Mistral crawler collecting web content for generative AI model training' }),
    E('mistralai-user', 'MistralAI-User (Vibe Fetch)', 'ai-search', { n: 'On-demand webpage fetcher for user-initiated Mistral Vibe interactions' }),
    E('oai-searchbot', 'OAI-SearchBot (ChatGPT Search)', 'ai-search', { n: 'OpenAI crawler indexing webpages for discovery in ChatGPT Search' }),
    E('omgili', 'omgili', 'ai-search', { n: 'Web data crawler associated with collecting online discussions and user-generated content' }),
    E('omgilibot', 'Omgilibot', 'ai-search', { n: 'Omgili-associated crawler for collecting public web content' }),
    E('pangubot', 'PanguBot', 'ai-search', { n: 'Reported AI-related crawler; operator and exact purpose are unknown' }),
    E('perplexity-user', 'Perplexity-User', 'ai-search', { mi: true, n: 'User-triggered Perplexity fetcher; generally ignores robots.txt, so directives may not restrict access. Not used for web indexing or AI foundation model training' }),
    E('perplexitybot', 'PerplexityBot', 'ai-search', { n: 'Perplexity crawler discovering and indexing content for AI-powered search' }),
    E('tiktokspider', 'TikTokSpider', 'ai-search', { n: 'ByteDance/TikTok-associated web crawler; specific usage not established' }),
    E('timpibot', 'Timpibot', 'ai-search', { n: 'Timpi crawler supporting decentralized web search and indexing' }),
    E('webzio-extended', 'Webzio-Extended', 'ai-search', { w: 2, n: 'Webzio-associated token for controlling AI-related data collection or reuse' }),
    E('youbot', 'YouBot', 'ai-search', { n: 'You.com crawler supporting AI-powered search and answer retrieval' }),
    // European Search & Open Web
    E('owler', 'Owler (OpenWebSearch.eu)', 'eu-search', { n: 'OpenWebSearch.eu crawler building a European open web index' }),
    E('genai', 'GenAI (OpenWebSearch Generative AI Metadata)', 'eu-search', { tags: ['ai-search'], w: 2, n: 'OpenWebSearch.eu control token for generative AI training' }),
    E('qwantbot', 'Qwantbot (European Privacy Search)', 'eu-search', { tags: ['top-search'], n: "French search engine crawler used to build and refresh Qwant's web index" }),
    E('seznambot', 'SeznamBot', 'eu-search', { n: 'Primary web crawler for Seznam.cz, a major Czech search engine' }),
    E('mojeekbot', 'MojeekBot (Mojeek Search)', 'eu-search', { n: 'Independent UK search engine crawler building and maintaining the Mojeek search index' }),
    // Image Search Bots
    E('googlebot-image', 'Googlebot-Image', 'image-bots', { fb: G, tags: ['top-search'], n: 'Dedicated Google crawler for image content used in Google Images and related Search features' }),
    E('googleother-image', 'GoogleOther-Image', 'image-bots', { fb: ['googleother'], tags: ['misc'], n: 'GoogleOther variant fetching public image URLs; does not affect Google Search indexing' }),
    E('msnbot-media', 'MSNBot-Media', 'image-bots', { tags: ['top-search'], n: 'Legacy Microsoft crawler associated with media and image content discovery' }),
    // News Bots
    E('applebot-news', 'Applebot-News (unverified)', 'news-bots', { tags: ['top-search'], n: 'Reported Apple news-related crawler identifier; separate robots.txt token and behavior unverified' }),
    E('googlebot-news', 'Googlebot-News', 'news-bots', { fb: ['googlebot'], tags: ['top-search'], n: 'Robots.txt control token for Google News; uses existing Googlebot crawlers rather than a separate HTTP user-agent' }),
    E('googleproducer', 'GoogleProducer', 'news-bots', { w: 1, n: 'Google Publisher Center fetcher retrieving publisher-supplied feeds; generally ignores robots.txt restrictions' }),
    E('feedfetcher-google', 'FeedFetcher-Google', 'news-bots', { ir: true, n: 'Google fetcher retrieving RSS and Atom feeds for News and WebSub; ignores robots.txt restrictions' }),
    E('yahoo-verticals', 'Yahoo Verticals (News/Finance)', 'news-bots', { n: 'Reported legacy Yahoo content and news ingestion identifier; separate robots.txt behavior unverified' }),
    E('msnbot-news', 'MSNBot-News (legacy)', 'news-bots', { n: 'Legacy Microsoft news crawler identifier; current robots.txt token behavior unverified' }),
    E('qwantbot-news', 'Qwantbot-news (Qwant News)', 'news-bots', { fb: ['qwantbot'], tags: ['eu-search'], n: 'Dedicated news crawler for Qwant, the French search engine' }),
    // Social Media Preview
    E('discordbot', 'Discordbot (Discord Previews)', 'social-bots', { n: 'Generates link cards and rich embeds on Discord' }),
    E('facebookexternalhit', 'FacebookExternalHit (Meta)', 'social-bots', { n: 'Meta scraper retrieving Open Graph metadata for shared-link previews on Facebook and related platforms' }),
    E('LinkedInBot', 'LinkedInBot', 'social-bots', { n: "Open Graph preview scraper for LinkedIn, it's case-sensitive - personally verified" }),
    E('pinterestbot', 'Pinterestbot', 'social-bots', { tags: ['image-bots'], n: 'Pinterest crawler discovering content and images for Pins and search' }),
    E('quora-bot', 'QuoraBot (Quora / Poe)', 'social-bots', { tags: ['ai-search'], n: 'Quora link-preview fetcher retrieving shared webpages and metadata; robots.txt compliance not fully verified' }),
    E('slackbot', 'Slackbot-LinkExpanding', 'social-bots', { n: 'URL preview expander for Slack messages' }),
    E('twitterbot', 'Twitterbot (X / Twitter)', 'social-bots', { n: 'X/Twitter crawler retrieving webpage metadata for link previews' }),
    E('googlemessages', 'GoogleMessages', 'social-bots', { ir: true, n: 'Google Messages fetcher generating shared-link previews; generally ignores robots.txt restrictions' }),
    E('whatsapp', 'WhatsApp', 'social-bots', { fb: ['facebookexternalhit'], n: 'Link preview fetcher associated with shared URLs in WhatsApp chats' }),
    // SEO Crawlers
    E('ahrefsbot', 'AhrefsBot', 'seo-bots', { n: 'Ahrefs backlink and SEO crawler' }),
    E('dataforseobot', 'DataForSEO Bot', 'seo-bots', { n: 'SEO data API crawler' }),
    E('deepcrawl', 'Deepcrawl (Lumar Legacy)', 'seo-bots', { n: 'Legacy Deepcrawl crawler identity maintained by Lumar for existing integrations and crawling configurations' }),
    E('dotbot', 'DotBot (Moz)', 'seo-bots', { n: 'Moz-associated crawler used for link discovery and web data collection' }),
    E('lumar', 'Lumar', 'seo-bots', { n: 'Lumar website intelligence crawler for technical SEO, accessibility, and site performance analysis' }),
    E('mj12bot', 'MJ12bot (Majestic)', 'seo-bots', { n: 'Majestic SEO backlink crawler' }),
    E('rogerbot', 'Rogerbot (Moz)', 'seo-bots', { n: 'Moz crawler historically used for link discovery and SEO analysis' }),
    E('screaming frog SEO spider', 'Screaming Frog SEO Spider', 'seo-bots', { n: 'Desktop SEO crawler used for technical website audits' }),
    E('semrushbot', 'SemrushBot', 'seo-bots', { n: 'Semrush crawler collecting website data for SEO and competitive analysis' }),
    E('semrushbot-ocob', 'SemrushBot-OCOB', 'seo-bots', { n: 'Specialized Semrush crawler associated with online content optimization' }),
    E('serankingbot', 'SE Ranking Bot', 'seo-bots', { n: 'SE Ranking crawler supporting website analysis and SEO research' }),
    E('serpstatbot', 'SerpstatBot', 'seo-bots', { n: 'Serpstat SEO platform crawler' }),
    E('sitebulb', 'Sitebulb', 'seo-bots', { n: 'Technical SEO auditing crawler available for desktop and cloud; user-agent and robots.txt behavior are configurable' }),
    E('technicalseodotcom', 'TechnicalSEOdotCom', 'seo-bots', { n: 'TechnicalSEO.com testing tool crawler' }),
    // Web Scrapers & Data Extraction
    E('008', '008', 'scrapers', { n: 'Unverified numeric scraper identifier; operator and robots.txt matching behavior unknown' }),
    E('adstxtcrawler', 'AdsTxtCrawler', 'scrapers', { n: 'Crawler for collecting and analyzing ads.txt files used in digital advertising' }),
    E('brightbot', 'Brightbot (Bright Data)', 'scrapers', { tags: ['ai-search'], n: 'Bright Data crawler collecting public web content for data products, analytics, and AI applications' }),
    E('dcrawl', 'dcrawl', 'scrapers', { n: 'Web crawler for collecting links and discovering domains; distinct from Lumar Deepcrawl' }),
    E('helloworkjobpostingbot', 'HelloworkJobPostingBot', 'scrapers', { n: 'French HelloWork job aggregation crawler collecting publicly available job listings' }),
    E('httrack', 'HTTrack', 'scrapers', { n: 'Website copying and offline browsing tool that downloads pages and linked resources' }),
    E('indeedjobbot', 'IndeedJobBot', 'scrapers', { n: 'Indeed-associated crawler for discovering and processing job listings' }),
    E('krawlerbot', 'KrawlerBot', 'scrapers', { n: 'Reported web data collection crawler; operator and exact purpose unverified' }),
    E('metainspector', 'MetaInspector', 'scrapers', { n: 'Open-source metadata extraction library retrieving titles, descriptions, links and images' }),
    E('metajobbot', 'MetaJobBot', 'scrapers', { n: 'Reported job listing aggregation crawler; operator and robots.txt behavior unverified' }),
    E('newspaper', 'newspaper', 'scrapers', { n: 'Article extraction software used to retrieve and parse news webpage content' }),
    E('nutch', 'Nutch (Apache Nutch)', 'scrapers', { n: 'Open-source web crawling framework used to build customized crawlers and search indexes' }),
    E('nyt_scraping', 'nyt_scraping', 'scrapers', { n: 'Reported scraping identifier associated with news content; operator and purpose unverified' }),
    E('offline explorer', 'Offline Explorer', 'scrapers', { n: 'Website downloading software for saving web pages and resources for offline browsing' }),
    E('openindexspider', 'OpenindexSpider', 'scrapers', { fb: ['openindex'], tags: ['top-search'], n: 'Openindex crawler collecting web data for research and development of search engines' }),
    E('potions', 'Potions', 'scrapers', { n: 'Reported web data extraction identifier; operator and purpose unverified' }),
    E('scrapy', 'Scrapy', 'scrapers', { n: 'Open-source Python framework for web crawling, scraping and data extraction' }),
    E('serverhunterspider', 'ServerHunterSpider', 'scrapers', { n: 'Reported web reconnaissance crawler; operator and robots.txt behavior unverified' }),
    E('statsdronebot', 'StatsDroneBot', 'scrapers', { n: 'Reported automated web data collection identifier; exact purpose unverified' }),
    E('thinkbot', 'Thinkbot', 'scrapers', { n: 'Reported automated crawler identifier; operator and purpose unverified' }),
    E('web-image-collection-research', 'Web Image Collection Research', 'scrapers', { tags: ['image-bots'], n: 'Reported crawler collecting images for research datasets; operator unverified' }),
    E('wget', 'GNU Wget', 'scrapers', { n: 'Command-line web downloader used for automated retrieval and website mirroring' }),
    E('python-requests', 'Python Requests', 'scrapers', { n: 'Python HTTP library frequently used in automation and web scraping scripts' }),
    // Miscellaneous
    E('*', '* (Wildcard / Default)', 'misc', { n: 'Default robots.txt group for crawlers without a matching specific user-agent group' }),
    E('adidxbot', 'AdIdxBot (Bing Ads)', 'misc', { n: 'Microsoft Advertising crawler verifying ad destinations and landing pages' }),
    E('adsbot-google', 'AdsBot-Google', 'misc', { w: 1, n: 'Google Ads crawler verifying landing page quality; ignores wildcard robots.txt groups' }),
    E('adsbot-google-mobile', 'AdsBot-Google-Mobile', 'misc', { w: 1, n: 'Mobile Google Ads crawler verifying landing page quality; ignores wildcard robots.txt groups' }),
    E('apis-google', 'APIs-Google', 'misc', { w: 1, n: 'Google special-case crawler supporting API push-notification delivery; honors dedicated robots.txt rules but ignores wildcard groups' }),
    E('archive.org_bot', 'archive.org_bot (Internet Archive)', 'misc', { n: 'Internet Archive crawler used to preserve historical snapshots of websites' }),
    E('baidu-ads', 'Baidu-ADS (Baidu Advertising)', 'misc', { n: 'Reported Baidu advertising-related proxy crawler; exact purpose and robots.txt behavior are not fully documented' }),
    E('baiduspider-ads', 'Baiduspider-ads (Baidu Advertising)', 'misc', { n: 'Baidu advertising crawler associated with paid-search landing page verification' }),
    E('bingpreview', 'BingPreview', 'misc', { tags: ['top-search'], n: 'Page preview generator and rendering bot associated with Microsoft Bing search results' }),
    E('google-cloudvertexbot', 'Google-CloudVertexBot', 'misc', { fb: G, tags: ['ai-search'], n: 'Google crawler supporting site-owner-requested crawling for Vertex AI agents; does not affect Google Search' }),
    E('google-inspectiontool', 'Google-InspectionTool', 'misc', { fb: G, n: 'Google Search Console URL inspection and testing crawler for desktop and mobile' }),
    E('google-safety', 'Google-Safety', 'misc', { ir: true, n: 'Google security crawler used for abuse detection and malware discovery; ignores robots.txt crawling restrictions' }),
    E('googlebot-video', 'Googlebot-Video', 'misc', { fb: G, tags: ['top-search'], n: 'Google crawler fetching video content for video-related Search features' }),
    E('googleother', 'GoogleOther', 'misc', { n: 'General-purpose Google crawler used for research and other non-product-specific tasks' }),
    E('googleother-video', 'GoogleOther-Video', 'misc', { fb: ['googleother'], n: 'GoogleOther variant fetching public video URLs; does not affect Google Search indexing' }),
    E('ia_archiver', 'ia_archiver', 'misc', { n: 'Legacy web crawler associated with Alexa Internet; not the current primary Internet Archive crawler' }),
    E('known agent', 'Known Agent', 'misc', { n: 'Known Agents platform bot used for development, monitoring and testing; not expected to honor robots.txt' }),
    E('mediapartners-google', 'Mediapartners-Google', 'misc', { w: 1, n: 'Google crawler analyzing webpage content for contextual advertising across AdSense, Ad Manager, and related ad products' }),
    E('petalbot', 'PetalBot', 'misc', { tags: ['top-search'], n: 'Primary web crawling bot for Petal Search, operated by Huawei' }),
    E('storebot-google', 'Storebot-Google', 'misc', { n: 'Google Shopping crawler for desktop and mobile product and merchant-related pages' }),
    E('yak', 'Yak (unverified)', 'misc', { tags: ['scrapers'], n: 'Reported Yak crawler identifier; operator, purpose, and robots.txt behavior not independently verified' }),
    E('yandex', 'Yandex (Shared Rules)', 'misc', { tags: ['top-search'], n: 'Shared robots.txt control token for Yandex crawlers; applies to compatible Yandex bots when no more specific bot rules exist' }),
    E('yandexmobilebot', 'YandexMobileBot', 'misc', { tags: ['top-search'], w: 1, n: 'Yandex crawler checking whether pages have mobile-friendly layouts; does not follow general wildcard robots.txt restrictions' }),
    E('yandexdirect', 'YandexDirect (Advertising)', 'misc', { w: 1, n: 'Yandex Advertising Network crawler analyzing partner-site content to determine topics and match relevant advertisements; does not follow general wildcard robots.txt restrictions' })
  ];
  const CATS = [
    ['top-search', 'Top Search Engines'], ['ai-search', 'AI & LLM Scrapers'],
    ['eu-search', 'European Search & Open Web'], ['image-bots', 'Image Search Bots'],
    ['news-bots', 'News Bots'], ['social-bots', 'Social Media Preview'],
    ['seo-bots', 'SEO Crawlers'], ['scrapers', 'Web Scrapers & Data Extraction'],
    ['misc', 'Miscellaneous']
  ];
  // Configuration. Empty = direct browser fetch + AllOrigins fallback.
  const WORKER_PROXY_URL = 'https://robots-checker-fetch.alexanderkyriakou.workers.dev/fetch';
  const MAX_BYTES = 512000;
  const MAX_FILE = 2 * 1024 * 1024;
  const MSG_MS = 5000;
  const COPIED_MS = 3000;
  const HIGHLIGHT_MS = 10000;
  const MAX_EXTRA_URLS = 10;
  const $ = id => document.getElementById(id);
  const ed = $('robotsInput');
  const tp = $('testPath');
  const extra = $('additionalUrls');
  const DEFAULT_UAS = ['googlebot', 'gptbot', 'claudebot', 'bingbot', 'mistralai-user', 'applebot', 'duckduckbot', 'perplexitybot', 'grokbot'];
  const selectedUAs = new Set(DEFAULT_UAS);
  const S = { baseline: '', loaded: false, sourceOrigin: null, missingOrigin: null, hlLine: null, hlType: null, activeBulk: null };
  let fetchSeq = 0, fetchCtl = null, evalTimer = null, msgTimer = null, copiedTimer = null, highlightTimer = null;

  // URL parsing
  function parseSiteUrl(input, assumeHttps = false) {
    let value = String(input || '').trim();
    if (!value) return { error: 'Please enter a URL.' };
    if (assumeHttps && !/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) value = 'https://' + value;
    let url;
    try { url = new URL(value); } catch (_) { return { error: 'Invalid URL. Use an absolute URL such as https://yourdomain.eu/page.' }; }
    if (!['http:', 'https:'].includes(url.protocol)) return { error: 'Only HTTP and HTTPS URLs are supported.' };
    if (!url.hostname || url.username || url.password) return { error: 'A hostname is required; embedded credentials are not supported.' };
    url.hash = '';
    return { url, origin: url.origin, robotsUrl: url.origin + '/robots.txt' };
  }

  // robots.txt parser
  // Keep the original group boundaries and line numbers.
  function normalizeAgentDeclaration(value) {
    const text = String(value).trim().toLowerCase();
    if (text === '*') return '*';
    // Only a trailing numeric version is accepted as a compatibility extension.
    // Do not interpret arbitrary substrings as separate crawler names.
    const match = /^([a-z0-9_.-]+)(?:\/[0-9]+(?:\.[0-9]+)*)?$/.exec(text);
    return match ? match[1] : null;
  }

  function validRulePath(path) {
    if (!path) return true; // Empty Allow/Disallow is a no-op.
    if (!path.startsWith('/')) return false;
    if (/[\x00-\x1F\x7F]/.test(path)) return false;
    // A malformed percent sequence cannot be matched reliably.
    if (/%(?![0-9a-fA-F]{2})/.test(path)) return false;
    return true;
  }

  function parseRobots(text) {
    const groups = [], sitemaps = [], warnings = [];
    let group = null, inRules = false;
    String(text).replace(/^\uFEFF/, '').split(/\r\n|\r|\n/).forEach((raw, index) => {
      const lineNumber = index + 1;
      const line = raw.replace(/#.*$/, '').trim();
      if (!line) return;
      const colon = line.indexOf(':');
      if (colon < 1) { warnings.push({ line: lineNumber, msg: 'Malformed line: expected directive: value' }); return; }
      const key = line.slice(0, colon).trim().toLowerCase();
      const value = line.slice(colon + 1).trim();
      if (key === 'user-agent') {
        if (!value) { warnings.push({ line: lineNumber, msg: 'Empty user-agent ignored' }); return; }
        const normalized = normalizeAgentDeclaration(value);
        if (!normalized) {
          const unicodeHyphens = /[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g;
          const suggested = value.replace(unicodeHyphens, '-');
          const hasUnicodeHyphen = suggested !== value;
          warnings.push({
            line: lineNumber,
            msg: hasUnicodeHyphen && normalizeAgentDeclaration(suggested)
              ? 'Invalid user-agent token "' + value + '" (Unicode hyphen). Use "' + suggested + '" with a standard ASCII hyphen (-); directive ignored'
              : 'Invalid user-agent token "' + value + '" ignored (use ASCII letters, digits, underscore, period or hyphen, with an optional numeric version)'
          });
          // Do not attach following rules to the preceding valid group.
          group = null;
          inRules = false;
          return;
        }
        if (!group || inRules) {
          group = { agents: [], rules: [] };
          groups.push(group);
          inRules = false;
        }
        group.agents.push(normalized);
      } else if (key === 'allow' || key === 'disallow') {
        if (!group) { warnings.push({ line: lineNumber, msg: key + ' before any valid user-agent ignored' }); return; }
        inRules = true;
        if (!validRulePath(value)) {
          warnings.push({ line: lineNumber, msg: 'Invalid ' + key + ' path ignored (expected /-prefixed path and valid encoding)' });
          return;
        }
        group.rules.push({ type: key, path: value, line: lineNumber });
        if (key === 'allow' && !value) warnings.push({ line: lineNumber, msg: 'Empty Allow: has no effect' });
      } else if (key === 'sitemap') {
        sitemaps.push({ url: value, line: lineNumber });
      } else if (!['crawl-delay', 'host', 'clean-param', 'request-rate', 'visit-time'].includes(key)) {
        warnings.push({ line: lineNumber, msg: 'Unsupported directive "' + key + '" ignored' });
      }
    });
    return { groups, sitemaps, warnings };
  }

  // Rule matching
  const UNRESERVED = /^[A-Za-z0-9._~-]$/;
  function normEnc(value, isUrl = false) {
    // Decode only percent-encoded unreserved ASCII characters.
    // Keep reserved characters (including %2F, %2A and %24) encoded.
    return (isUrl ? String(value).replace(/\*/g, '%2A').replace(/\$/g, '%24') : String(value))
      .replace(/[^\x00-\x7F]+/g, match => encodeURIComponent(match))
      .replace(/%[0-9a-f]{2}/gi, match => {
        const character = String.fromCharCode(parseInt(match.slice(1), 16));
        return UNRESERVED.test(character) ? character : match.toUpperCase();
      });
  }
  const reCache = new Map();
  function toRegex(path) {
    if (reCache.has(path)) return reCache.get(path);
    let pattern = normEnc(path);
    const anchored = pattern.endsWith('$');
    if (anchored) pattern = pattern.slice(0, -1);
    const regex = new RegExp('^' + pattern.split('*').map(part => part.replace(/[.+?^${}()|[\]\\\/]/g, '\\$&')).join('.*') + (anchored ? '$' : ''));
    reCache.set(path, regex);
    return regex;
  }
  function matchGroups(groups, ua) {
    for (const token of [ua.token, ...ua.fb]) {
      const matches = groups.filter(group => group.agents.includes(token));
      if (matches.length) return { gs: matches, via: token };
    }
    if (ua.w === 1) return { gs: [], via: null, note: 'Wildcard group does not apply to this crawler (documented)' };
    const wildcardGroups = groups.filter(group => group.agents.includes('*'));
    if (ua.w === 2) return wildcardGroups.length ? { unclear: true } : { gs: [], via: null };
    return wildcardGroups.length ? { gs: wildcardGroups, via: '*' } : { gs: [], via: null };
  }
  function inc(rule, note = '') { return { state: 'inconclusive', rule, line: null, note }; }
  function evaluate(parsed, ua, url) {
    if (!url) return inc('Please provide a valid absolute URL');
    if (ua.ignoresRobots) return { state: 'allowed', rule: 'robots.txt directives ignored', line: null, note: 'This fetcher ignores robots.txt; actual server access is not guaranteed' };
    if (ua.mayIgnoreRobots) return inc(
      'robots.txt compliance not assured',
      'Perplexity-User generally ignores robots.txt for user-requested fetches; Allow/Disallow cannot reliably predict access'
    );
    const matched = matchGroups(parsed.groups, ua);
    if (matched.unclear) return inc('No dedicated group; wildcard applicability is undocumented for this token');
    const rules = matched.gs.flatMap(group => group.rules);
    const path = normEnc(url.pathname + url.search, true);
    const note = matched.note || (matched.via && matched.via !== ua.token ? 'Rules from "' + matched.via + '" group' : '');
    let best = null;
    for (const rule of rules) {
      if (!rule.path || !toRegex(rule.path).test(path)) continue;
      // Compare literal UTF-8 octets, not JavaScript string length.
      const literal = normEnc(rule.path).replace(/\*/g, '').replace(/\$$/, '');
      const length = new TextEncoder().encode(literal).length;
      if (!best || length > best.length || (length === best.length && rule.type === 'allow' && best.rule.type !== 'allow')) best = { length, rule };
    }
    if (!best) return { state: 'allowed', rule: rules.length ? 'No matching rule (default allow)' : 'No applicable rules (default allow)', line: null, note };
    return { state: best.rule.type === 'allow' ? 'allowed' : 'blocked', rule: best.rule.type.toUpperCase() + ': ' + best.rule.path, line: best.rule.line, note };
  }
  window.RobotsCore = { parseSiteUrl, parseRobots, evaluate, toRegex, USER_AGENTS };

  // Messages
  function say(element, message, kind = '') { element.textContent = message || ''; element.className = 'msg' + (kind ? ' ' + kind : ''); }
  function sayEditor(message, kind = '') {
    clearTimeout(msgTimer); say($('editorMsg'), message, kind);
    if (message && kind !== 'error') msgTimer = setTimeout(() => say($('editorMsg'), ''), MSG_MS);
  }

  // User-agent sidebar
  function updateBulkButtons() {
    document.querySelectorAll('.app-layout [data-bulk]').forEach(button => {
      const active = button.dataset.bulk === S.activeBulk;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  const bulkTooltip = document.createElement('div');
  bulkTooltip.className = 'bulk-disabled-tooltip';
  bulkTooltip.textContent = 'Disable Check resources to use group selection';
  bulkTooltip.hidden = true;
  document.body.appendChild(bulkTooltip);
  document.addEventListener('pointermove', event => {
    if (!resourceCheck.checked || event.pointerType === 'touch') { bulkTooltip.hidden = true; return; }
    const hoveredButton = [...document.querySelectorAll('.app-layout [data-bulk]:disabled')].find(button => {
      const r = button.getBoundingClientRect();
      return event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom;
    });
    if (!hoveredButton) { bulkTooltip.hidden = true; return; }
    bulkTooltip.hidden = false;
    const rect = bulkTooltip.getBoundingClientRect();
    bulkTooltip.style.left = Math.max(8, Math.min(event.clientX + 12, innerWidth - rect.width - 8)) + 'px';
    bulkTooltip.style.top = Math.max(8, event.clientY - rect.height - 12) + 'px';
  });
  document.addEventListener('pointerdown', () => { bulkTooltip.hidden = true; });
  function renderSidebarList() {
    const term = $('uaSearchBox').value.trim().toLowerCase();
    const container = $('uaCheckboxList');
    container.textContent = '';
    const matching = USER_AGENTS.filter(ua => ua.name.toLowerCase().includes(term) || ua.id.includes(term) || (ua.token || '').includes(term));
    if (!matching.length) {
      const message = document.createElement('div');
      message.className = 'msg'; message.style.textAlign = 'center'; message.textContent = 'No matches found';
      container.appendChild(message); return;
    }
    for (const [category, label] of CATS) {
      const items = matching.filter(ua => ua.cat === category);
      if (!items.length) continue;
      const heading = document.createElement('div'); heading.className = 'ua-cat'; heading.textContent = label;
      container.appendChild(heading);
      for (const ua of items) {
        const row = document.createElement('div'); row.className = 'ua-item';
        const checkbox = document.createElement('input'); checkbox.type = 'checkbox';
        checkbox.id = 'ua_' + ua.id.replace(/\s/g, '_'); checkbox.checked = selectedUAs.has(ua.id);
        checkbox.addEventListener('change', () => {
          if (resourceCheck.checked) {
            if (checkbox.checked) { selectedUAs.clear(); selectedUAs.add(ua.id); }
            else selectedUAs.add(ua.id);
            invalidateResourceResults('User-agent changed.'); renderSidebarList();
          } else {
            if (checkbox.checked) selectedUAs.add(ua.id);
            else selectedUAs.delete(ua.id);
          }
          S.activeBulk = null; updateBulkButtons(); bulkTooltip.hidden = true; schedule(true);
        });
        const labelEl = document.createElement('label'); labelEl.htmlFor = checkbox.id; labelEl.textContent = ua.name;
        if (ua.note) labelEl.title = ua.note;
        row.append(checkbox, labelEl); container.appendChild(row);
      }
    }
  }
  window.bulkSelect = function (group) {
    if (resourceCheck.checked) return;
    selectedUAs.clear();
    if (group !== 'none') USER_AGENTS.forEach(ua => {
      if (group === 'all' || ua.cat === group || ua.tags.includes(group)) selectedUAs.add(ua.id);
    });
    S.activeBulk = group; updateBulkButtons(); renderSidebarList(); schedule(true);
  };

  // Editor setup
  const editorLines = $('editorLines');
  const highlightOverlay = $('highlightOverlay');
  const gutterContent = document.createElement('div');
  gutterContent.style.position = 'relative';
  gutterContent.style.whiteSpace = 'pre';
  gutterContent.style.lineHeight = 'inherit';
  gutterContent.style.font = 'inherit';
  gutterContent.style.willChange = 'transform';
  editorLines.textContent = ''; editorLines.appendChild(gutterContent);
  function clearHighlight() {
    clearTimeout(highlightTimer); highlightTimer = null;
    S.hlLine = null; S.hlType = null; updateHighlightOverlay();
  }
  function updateHighlightOverlay() {
    highlightOverlay.textContent = '';
    if (!S.hlLine || !S.hlType) return;
    const styles = getComputedStyle(ed);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const marker = document.createElement('div');
    marker.className = 'highlight-marker ' + (S.hlType === 'allow' ? 'highlight-line-allow' : 'highlight-line-block');
    marker.style.height = lineHeight + 'px';
    marker.style.top = (paddingTop + (S.hlLine - 1) * lineHeight - ed.scrollTop) + 'px';
    highlightOverlay.appendChild(marker);
  }
  function syncScroll() {
    gutterContent.style.transform = 'translateY(' + (-ed.scrollTop) + 'px)';
    updateHighlightOverlay();
  }
  function updateEditorUi() {
    const value = ed.value;
    const lines = value.split(/\r\n|\r|\n/);
    gutterContent.textContent = Array.from({ length: lines.length }, (_, index) => String(index + 1)).join('\n');
    const bytes = new TextEncoder().encode(value).length;
    const sizeInfo = $('sizeInfo'); const overLimit = bytes > MAX_BYTES;
    sizeInfo.textContent = '~ ' + (bytes / 1024).toFixed(1) + ' / 500 KiB' +
      (overLimit ? ' — exceeds 500 KiB; Google ignores content beyond its limit' : '');
    sizeInfo.classList.toggle('over', overLimit);
    const unchanged = value === S.baseline;
    $('copyBtn').disabled = unchanged; $('downloadBtn').disabled = unchanged;
    const warnings = parseRobots(value).warnings;
    $('parseNote').textContent = warnings.length
      ? 'Parser notes • ' + warnings.slice(0, 3).map(w => 'line ' + w.line + ': ' + w.msg).join('; ') +
        (warnings.length > 3 ? ' (+' + (warnings.length - 3) + ' more)' : '') : '';
    syncScroll();
  }
  function loadContent(text, origin) {
    clearHighlight(); ed.value = text;
    S.baseline = text; S.loaded = true; S.sourceOrigin = origin || null; S.missingOrigin = null;
    ed.scrollTop = 0; ed.scrollLeft = 0;
    updateEditorUi();
    if (resourceCheck.checked) invalidateResourceResults('Robots.txt content changed.');
    schedule(true);
  }
  ed.addEventListener('input', () => {
    clearHighlight(); updateEditorUi();
    if (resourceCheck.checked) invalidateResourceResults('Robots.txt rules changed.');
    schedule(true);
  });
  ed.addEventListener('scroll', syncScroll);
  if ('ResizeObserver' in window) new ResizeObserver(() => syncScroll()).observe(ed);

  // Editor copy / download
  $('copyBtn').addEventListener('click', async () => {
    const button = $('copyBtn');
    try {
      await navigator.clipboard.writeText(ed.value);
      sayEditor('Copied to clipboard.', 'ok'); button.classList.add('copied');
      clearTimeout(copiedTimer);
      copiedTimer = setTimeout(() => button.classList.remove('copied'), COPIED_MS);
    } catch (_) {
      sayEditor('Copy failed. Select the editor text and copy it manually.', 'error');
    }
  });
  function downloadEditor() {
    if (!ed.value.trim()) return;
    const blob = new Blob([ed.value], { type: 'text/plain;charset=utf-8' });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = objectUrl; link.download = 'robots.txt';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }
  $('downloadBtn').addEventListener('click', downloadEditor);
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === 's') {
      if (ed.value.trim()) { event.preventDefault(); downloadEditor(); }
    }
  });

  // Rule highlighting
  function highlightRuleLine(line, type) {
    if (!Number.isInteger(line) || line < 1) return;
    clearTimeout(highlightTimer); S.hlLine = line; S.hlType = type;
    const styles = getComputedStyle(ed);
    const lineHeight = parseFloat(styles.lineHeight) || 24;
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const lineTop = paddingTop + (line - 1) * lineHeight;
    ed.scrollTop = Math.max(0, lineTop - lineHeight * 2);
    syncScroll();
    $('editorWrapper').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    highlightTimer = setTimeout(() => clearHighlight(), HIGHLIGHT_MS);
  }

  // Local file upload
  async function processFile(file) {
    if (!file) return;
    if (!/\.txt$/i.test(file.name) && file.type !== 'text/plain') {
      sayEditor('Unsupported file. Please choose a plain-text .txt file.', 'error'); return;
    }
    if (file.size > MAX_FILE) {
      sayEditor('File is too large (' + (file.size / 1048576).toFixed(1) + ' MiB). Maximum upload size: 2 MiB.', 'error'); return;
    }
    try {
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8', { fatal: true }).decode(buffer).replace(/^\uFEFF/, '');
      loadContent(text, null);
      sayEditor(text.trim() ? 'Loaded "' + file.name + '" locally (nothing was uploaded).' : '"' + file.name + '" is empty.', text.trim() ? 'ok' : 'warn');
    } catch (_) { sayEditor('Could not read the file as UTF-8 text.', 'error'); }
  }
  const dropZone = $('dropZone'); const fileInput = $('fileInput');
  dropZone.addEventListener('click', () => fileInput.click());
  dropZone.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); fileInput.click(); }
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0]; fileInput.value = ''; processFile(file);
  });
  dropZone.addEventListener('dragover', event => { event.preventDefault(); dropZone.classList.add('dragover'); });
  dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
  dropZone.addEventListener('drop', event => {
    event.preventDefault(); dropZone.classList.remove('dragover'); processFile(event.dataTransfer.files[0]);
  });

  // Live fetch helpers (unchanged behavior)
  async function fetchWithDeadline(url, parentSignal, mode = 'robots') {
    if (parentSignal.aborted) throw new DOMException('Aborted', 'AbortError');
    if (!WORKER_PROXY_URL) throw new Error('Worker endpoint has not been configured.');

    // The caller specifies the operation; never infer it from a page filename.
    const target = new URL(url);
    if (mode !== 'robots' && mode !== 'page') throw new Error('Unsupported fetch mode.');
    const endpoint = new URL(WORKER_PROXY_URL);
    endpoint.searchParams.set('url', target.href);
    endpoint.searchParams.set('mode', mode);

    const controller = new AbortController();
    const onAbort = () => controller.abort();
    parentSignal.addEventListener('abort', onAbort, { once: true });
    const timer = setTimeout(() => controller.abort(), mode === 'robots' ? 14000 : 16000);
    try {
      const response = await fetch(endpoint.href, {
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json().catch(() => null);
      if (!data || typeof data !== 'object') {
        const error = new Error('The fetch service returned invalid JSON.');
        error.code = 'BAD_RESPONSE'; throw error;
      }
      if (!response.ok) {
        const error = new Error(data.error || ('Fetch service HTTP ' + response.status));
        error.code = data.code || 'WORKER_ERROR';
        error.httpStatus = response.status;
        throw error;
      }
      if (!Number.isInteger(data.status) || typeof data.text !== 'string' ||
          typeof data.finalUrl !== 'string' || !Number.isInteger(data.hops)) {
        const error = new Error('The fetch service returned incomplete data.');
        error.code = 'BAD_RESPONSE'; throw error;
      }
      return {
        status: data.status,
        text: data.text,
        finalUrl: data.finalUrl,
        proxied: true,
        redirected: data.hops > 0,
        hops: data.hops,
        redirects: Array.isArray(data.redirects) ? data.redirects : [],
        method: 'Cloudflare Worker'
      };
    } catch (error) {
      if (parentSignal.aborted) throw new DOMException('Aborted', 'AbortError');
      if (controller.signal.aborted) {
        const timeout = new Error('The fetch service timed out.');
        timeout.code = 'TIMEOUT'; throw timeout;
      }
      throw error;
    } finally {
      clearTimeout(timer);
      parentSignal.removeEventListener('abort', onAbort);
    }
  }

  // Live fetch
  async function fetchLive() {
    const message = $('fetchMsg');
    const requested = parseSiteUrl($('fetchUrlInput').value, true);
    if (requested.error) { say(message, requested.error, 'error'); return; }
    if (fetchCtl) fetchCtl.abort();
    const sequence = ++fetchSeq;
    const controller = new AbortController(); fetchCtl = controller;
    const button = $('fetchBtn'); button.textContent = 'Fetching...'; button.disabled = true;
    say(message, 'Fetching ' + requested.robotsUrl + ' ...');
    try {
      let response, resolved = requested, apexFallback = false;
      try {
        response = await fetchWithDeadline(requested.robotsUrl, controller.signal);
      } catch (error) {
        if (error.name === 'AbortError' || error.code === 'TOO_MANY_REDIRECTS') throw error;
        const hostname = requested.url.hostname;
        if (!hostname.toLowerCase().startsWith('www.')) throw error;
        const alternate = new URL(requested.url.href); alternate.hostname = hostname.slice(4);
        resolved = parseSiteUrl(alternate.href, false);
        if (resolved.error) throw error;
        say(message, 'The www hostname could not be fetched. Trying ' + resolved.robotsUrl + ' ...', 'warn');
        response = await fetchWithDeadline(resolved.robotsUrl, controller.signal);
        apexFallback = true;
      }
      if (sequence !== fetchSeq || controller.signal.aborted) return;
      const status = response.status;
      let finalUrl = null, redirectNote = '';
      try {
        finalUrl = new URL(response.finalUrl || resolved.robotsUrl);
        if (finalUrl.href !== resolved.robotsUrl) redirectNote = ' Final URL: ' + finalUrl.href + '.';
      } catch (_) {}
      if (Number.isInteger(response.hops)) redirectNote += ' Redirects followed: ' + response.hops + ' / 5.';
      else if (response.redirected || (finalUrl && finalUrl.href !== resolved.robotsUrl)) redirectNote += ' Redirect count could not be verified.';
      if (status >= 200 && status < 300) {
        const content = response.text.replace(/^\uFEFF/, '');
        if (/^\s*<(!doctype|html|\?xml)/i.test(content)) {
          say(message, 'The server returned HTML/XML instead of robots.txt. The editor was not changed.', 'error'); return;
        }
        const sourceOrigin = apexFallback ? resolved.origin : requested.origin;
        loadContent(content, sourceOrigin);
        if (apexFallback) tp.value = new URL(requested.url.pathname + requested.url.search, resolved.origin).href;
        else tp.value = requested.url.href;
        if (resourceCheck.checked) invalidateResourceResults('Robots.txt or target URL changed.');
        schedule(true);
        const fallbackNote = apexFallback
          ? ' The www hostname could not be verified. Loaded the apex domain instead. This does not confirm that www redirects to apex.' : '';
        say(message, (content.trim() ? 'Loaded ' : 'Loaded an empty ') + resolved.robotsUrl + ' via ' + response.method + '.' + redirectNote + fallbackNote,
          apexFallback || !content.trim() ? 'warn' : 'ok');
      } else if (status === 404 || status === 410) {
        const origin = apexFallback ? resolved.origin : requested.origin;
        clearHighlight(); S.missingOrigin = origin; S.sourceOrigin = null; S.loaded = false;
        ed.value = ''; S.baseline = ''; updateEditorUi();
        tp.value = apexFallback ? new URL(requested.url.pathname + requested.url.search, resolved.origin).href : requested.url.href;
        if (resourceCheck.checked) invalidateResourceResults('Robots.txt availability changed.');
        schedule(true);
        say(message, 'The domain was reached, but robots.txt returned HTTP ' + status +
          '. This is treated as no robots.txt restrictions for the verified origin.' +
          (apexFallback ? ' The www hostname remains unverified.' : ''), 'warn');
      } else if (status === 401 || status === 403) {
        say(message, 'HTTP ' + status + ': Access denied. The server refused the request.', 'error');
      } else if (status === 429) {
        say(message, 'HTTP 429: The server is rate limiting requests.', 'error');
      } else if (status >= 500) {
        say(message, 'HTTP ' + status + ': The server returned an error.', 'error');
      } else {
        say(message, 'HTTP ' + status + ': The server responded, but robots.txt could not be loaded.', 'error');
      }
    } catch (error) {
      if (sequence !== fetchSeq) return;
      let text;
      if (error.code === 'TOO_MANY_REDIRECTS') text = 'More than 3 redirects were encountered. Unable to fetch robots.txt.';
      else if (error.name === 'AbortError' || controller.signal.aborted) text = 'The request was cancelled or timed out. The robots.txt file could not be verified.';
      else text = 'Unable to reach or retrieve robots.txt for this domain. The hostname may not exist, DNS/network access may have failed, or CORS/proxy restrictions may have blocked the request. No HTTP 404 response was verified.';
      say(message, text, 'error');
    } finally {
      if (sequence === fetchSeq) { button.textContent = 'Fetch Live'; button.disabled = false; fetchCtl = null; }
    }
  }
  $('fetchBtn').addEventListener('click', fetchLive);
  $('fetchUrlInput').addEventListener('keydown', event => { if (event.key === 'Enter') fetchLive(); });

  // Static HTML resource discovery
  function discoverResources(html, pageUrl) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const resources = new Map();
    let baseUrl = pageUrl;
    const base = doc.querySelector('base[href]');
    if (base) {
      try { baseUrl = new URL(base.getAttribute('href'), pageUrl).href; } catch (_) {}
    }
    function addResource(value, type) {
      if (!value) return;
      try {
        const url = new URL(value.trim(), baseUrl);
        if (!['http:', 'https:'].includes(url.protocol)) return;
        url.hash = '';
        if (!resources.has(url.href)) resources.set(url.href, { url: url.href, type });
      } catch (_) {}
    }
    doc.querySelectorAll('link[href]').forEach(link => {
      const rel = (link.getAttribute('rel') || '').toLowerCase().split(/\s+/);
      const href = link.getAttribute('href');
      if (rel.includes('stylesheet')) addResource(href, 'CSS');
      else if (rel.includes('modulepreload')) addResource(href, 'JavaScript');
      else if (rel.includes('icon') || rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed') || rel.includes('mask-icon')) addResource(href, 'Image');
      else if (rel.includes('preload') && link.getAttribute('as')) {
        const type = link.getAttribute('as').toLowerCase();
        const types = { style: 'CSS', script: 'JavaScript', image: 'Image', font: 'Font', video: 'Video', audio: 'Audio' };
        if (types[type]) addResource(href, types[type]);
      }
    });
    doc.querySelectorAll('script[src]').forEach(script => addResource(script.getAttribute('src'), 'JavaScript'));
    doc.querySelectorAll('img[src]').forEach(img => addResource(img.getAttribute('src'), 'Image'));

    // srcset splitting: do not split commas inside data URLs; skip data URLs
    // themselves, and keep all regular URL candidates.
    function addSrcset(value, type) {
      if (!value) return;
      // Candidates with whitespace descriptors use commas as separators.
      // Data URLs have no HTTP origin and are excluded.
      const candidates = value.match(/(?:data:[^\s]+|[^,\s]+)(?:\s+[^,]*)?(?:,|$)/gi) || [];
      candidates.forEach(candidate => {
        const trimmed = candidate.trim().replace(/,$/, '').trim();
        if (!trimmed || /^data:/i.test(trimmed)) return;
        addResource(trimmed.split(/\s+/)[0], type);
      });
    }
    doc.querySelectorAll('img[srcset], source[srcset]').forEach(element => {
      const picture = element.closest('picture');
      addSrcset(element.getAttribute('srcset'), picture || element.matches('img') ? 'Image' :
        (element.closest('video') ? 'Video' : element.closest('audio') ? 'Audio' : 'Image'));
    });
    doc.querySelectorAll('video[poster]').forEach(video => addResource(video.getAttribute('poster'), 'Image'));
    doc.querySelectorAll('video[src]').forEach(video => addResource(video.getAttribute('src'), 'Video'));
    doc.querySelectorAll('audio[src]').forEach(audio => addResource(audio.getAttribute('src'), 'Audio'));
    doc.querySelectorAll('source[src]').forEach(element => {
      const type = element.closest('video') ? 'Video' : element.closest('audio') ? 'Audio' : 'Media';
      addResource(element.getAttribute('src'), type);
    });
    return [...resources.values()];
  }

  function getEffectiveResourceAgent(ua, resource) {
    if (ua.id !== 'googlebot') return ua;
    const id = resource.type === 'Image' ? 'googlebot-image' : resource.type === 'Video' ? 'googlebot-video' : null;
    return (id && USER_AGENTS.find(agent => agent.id === id)) || ua;
  }
  function evaluateDiscoveredResources() {
    const ua = getResourceAgent();
    if (!ua || !scannedResourceUrl) return [];
    const page = parseSiteUrl(scannedResourceUrl);
    if (!page.url) return [];
    const parsed = parseRobots(ed.value);
    return discoveredResources.map(resource => {
      const target = parseSiteUrl(resource.url);
      if (!target.url) return { ...resource, result: inc('Invalid resource URL') };
      if (target.origin !== page.origin) return { ...resource, result: inc('External origin', 'Separate robots.txt verification required') };
      if (S.sourceOrigin && S.sourceOrigin !== page.origin) return {
        ...resource, result: inc('Robots.txt origin mismatch', 'Loaded rules belong to ' + S.sourceOrigin)
      };
      if (S.missingOrigin === page.origin && !ed.value.trim() && !S.loaded) return {
        ...resource,
        result: { state: 'allowed', rule: 'robots.txt not found (default allow)', line: null, note: 'HTTP 404/410 verified for this origin' }
      };
      const effectiveAgent = getEffectiveResourceAgent(ua, resource);
      const result = evaluate(parsed, effectiveAgent, target.url);
      if (effectiveAgent !== ua) {
        result.note = [result.note, 'Evaluated as ' + effectiveAgent.name + ' for Google ' +
          (resource.type === 'Video' ? 'video' : 'image') + ' crawling'].filter(Boolean).join('; ');
      }
      if (S.sourceOrigin !== page.origin && S.missingOrigin !== page.origin) {
        result.note = [result.note, 'Editor rules; live robots.txt not verified for this origin'].filter(Boolean).join('; ');
      }
      return { ...resource, result };
    });
  }
  function renderResourceResults(evaluations, agent) {
    const tbody = $('resourceTableBody'); tbody.textContent = '';
    const counts = { allowed: 0, blocked: 0, inconclusive: 0 };
    evaluations.forEach(item => {
      const result = item.result; counts[result.state]++;
      const row = tbody.insertRow();
      const urlCell = row.insertCell(); const urlText = document.createElement('span');
      urlText.className = 'resource-url'; urlText.title = item.url;
      const resource = parseSiteUrl(item.url); const page = parseSiteUrl(scannedResourceUrl);
      urlText.textContent = resource.url && page.url && resource.origin === page.origin
        ? resource.url.pathname + resource.url.search : item.url;
      urlCell.appendChild(urlText);
      const typeCell = row.insertCell(); typeCell.textContent = item.type;
      const statusCell = row.insertCell(); const badge = document.createElement('span');
      badge.className = 'badge ' + (result.state === 'allowed' ? 'badge-allowed' : result.state === 'blocked' ? 'badge-blocked' : 'badge-na');
      badge.textContent = { allowed: 'Allowed', blocked: 'Blocked', inconclusive: 'Inconclusive' }[result.state];
      statusCell.appendChild(badge);
      const directiveCell = row.insertCell(); directiveCell.className = 'resource-directive';
      directiveCell.appendChild(document.createTextNode(result.rule + (result.line ? ' (Line ' + result.line + ')' : '')));
      if (result.note) {
        const note = document.createElement('span'); note.className = 'fallback-note'; note.textContent = '\u21b3 ' + result.note;
        directiveCell.appendChild(note);
      }
      if (result.line) {
        row.classList.add('row-click'); row.tabIndex = 0;
        const activate = () => highlightRuleLine(result.line, result.state === 'allowed' ? 'allow' : 'block');
        row.addEventListener('click', activate);
        row.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        });
      }
    });
    $('resourceAllowedCount').textContent = counts.allowed;
    $('resourceBlockedCount').textContent = counts.blocked;
    $('resourceInconclusiveCount').textContent = counts.inconclusive;
    $('resourceResultsAgent').textContent = agent.name;
    $('resourceResultsInfo').textContent = evaluations.length + ' unique static resource(s) evaluated for ' + scannedResourceUrl + '.';
    $('resourceSummary').hidden = false;
    $('resourceTableWrap').hidden = evaluations.length === 0;
  }
  function getResourceAgent() {
    if (selectedUAs.size === 1) {
      const id = [...selectedUAs][0];
      const agent = USER_AGENTS.find(ua => ua.id === id);
      if (agent) return agent;
    }
    return USER_AGENTS.find(ua => ua.id === 'googlebot');
  }
  function updateResultsMode() {
    const active = resourceCheck.checked;
    $('multiAgentResults').hidden = active;
    $('resourceResults').hidden = !active;
  }
  function clearResourceResults(message = 'Enter a target URL and press Check URL to discover and evaluate its resources.', isError = false) {
    $('resourceResults').classList.remove('resource-results-stale');
    $('resourceSummary').hidden = true; $('resourceTableWrap').hidden = true;
    $('resourceTableBody').textContent = '';
    $('resourceResultsInfo').textContent = message;
    $('resourceResultsInfo').classList.toggle('error', isError);
    $('resourceResultsAgent').textContent = getResourceAgent().name;
  }
  function invalidateResourceResults(message) {
    cancelResourceScan();
    const hasResults = !$('resourceSummary').hidden && completedResourceScan !== null;
    $('resourceResultsInfo').classList.remove('error');
    if (hasResults) {
      const matches = resourceInputsMatch(resourceScanInputs(), completedResourceScan);
      $('resourceResults').classList.toggle('resource-results-stale', !matches);
      $('resourceResultsInfo').textContent = matches ? completedResourceScan.info : message + ' Click Check URL to re-check.';
    } else {
      clearResourceResults(message + ' Click Check URL to check resources.');
    }
    updateTargetState();
  }
  async function scanPageResources() {
    const target = parseSiteUrl(tp.value, false);
    if (!target.url) { clearResourceResults('Enter a valid absolute URL first.', true); return; }
    cancelResourceScan(); completedResourceScan = null;
    clearResourceResults('Fetching and evaluating page resources...');
    const scanId = resourceScanId;
    const controller = new AbortController();
    resourceScanController = controller; resourceScanBusy = true;
    updateTargetState(); updateResourceProgress(0, 'Fetching page...');
    try {
      const response = await fetchWithDeadline( target.url.href, controller.signal, 'page' );
      if (controller.signal.aborted || scanId !== resourceScanId) return;
      if (response.status < 200 || response.status >= 300) throw new Error('Page returned HTTP ' + response.status);
      if (!/<(?:!doctype\s+html|html|head|body)\b/i.test(response.text)) throw new Error('The response does not appear to contain an HTML page');
      updateResourceProgress(0, 'Discovering resources...');
      const finalPageUrl = response.finalUrl || target.url.href;
      discoveredResources = discoverResources(response.text, finalPageUrl);
      scannedResourceUrl = finalPageUrl;
      const evaluations = evaluateDiscoveredResources();
      const resourceAgent = getResourceAgent();
      renderResourceResults(evaluations, resourceAgent);
      completedResourceScan = { ...resourceScanInputs(), info: $('resourceResultsInfo').textContent };
      updateResourceProgress(100, 'Evaluation complete');
    } catch (error) {
      if (controller.signal.aborted || scanId !== resourceScanId) return;
      discoveredResources = []; scannedResourceUrl = null; completedResourceScan = null;
      clearResourceResults(error.message.startsWith('Page returned HTTP ') || error.message.startsWith('The response does not')
        ? error.message : 'Unable to retrieve the page. CORS, network or proxy restrictions may apply.', true);
    } finally {
      if (scanId === resourceScanId) {
        resourceScanBusy = false; resourceScanController = null;
        hideResourceProgress(); updateTargetState();
      }
    }
  }

  // Additional URLs / deduplication
  const resourceCheck = $('resourceCheck');
  const multiUrlPanel = $('multiUrlPanel');
  let previousResourceSelection = null, previousResourceBulk = null;
  let resourceScanController = null, resourceScanId = 0, resourceScanBusy = false;
  let discoveredResources = [], scannedResourceUrl = null, completedResourceScan = null;
  function resourceScanInputs() {
    return { url: parseSiteUrl(tp.value, false).url?.href || null, agentId: getResourceAgent()?.id || null,
      rules: ed.value, sourceOrigin: S.sourceOrigin, missingOrigin: S.missingOrigin, loaded: S.loaded };
  }
  function resourceInputsMatch(a, b) {
    return !!a && !!b && a.url === b.url && a.agentId === b.agentId && a.rules === b.rules &&
      a.sourceOrigin === b.sourceOrigin && a.missingOrigin === b.missingOrigin && a.loaded === b.loaded;
  }
  function cancelResourceScan() {
    resourceScanId++;
    if (resourceScanController) { resourceScanController.abort(); resourceScanController = null; }
    resourceScanBusy = false; discoveredResources = []; scannedResourceUrl = null;
    hideResourceProgress();
  }
  let previousAutoCheck = $('autoCheck').checked;
  resourceCheck.addEventListener('change', () => {
    cancelResourceScan(); completedResourceScan = null;
    const active = resourceCheck.checked, autoCheck = $('autoCheck');
    if (active) {
      previousAutoCheck = autoCheck.checked; autoCheck.checked = false; autoCheck.disabled = true;
      previousResourceSelection = new Set(selectedUAs); previousResourceBulk = S.activeBulk;
      selectedUAs.clear(); selectedUAs.add('googlebot'); S.activeBulk = null;
      multiUrlPanel.open = false; extra.value = '';
    } else {
      autoCheck.disabled = false; autoCheck.checked = previousAutoCheck;
      if (previousResourceSelection) {
        selectedUAs.clear(); previousResourceSelection.forEach(id => selectedUAs.add(id)); S.activeBulk = previousResourceBulk;
      }
      previousResourceSelection = null; previousResourceBulk = null;
    }
    multiUrlPanel.classList.toggle('resource-disabled', active); multiUrlPanel.inert = active;
    document.querySelectorAll('.app-layout [data-bulk]').forEach(button => { button.disabled = active; });
    renderSidebarList(); updateBulkButtons(); clearResourceResults(); updateResultsMode(); schedule(true);
  });
  function updateResourceProgress(percent, message = 'Checking resources...') {
    const progress = $('resourceProgress'); progress.hidden = false;
    $('resourceProgressText').textContent = message;
  }
  function hideResourceProgress() { $('resourceProgress').hidden = true; }
  function extraInputs() {
    const seen = new Set();
    const primaryValue = tp.value.trim();
    const primary = parseSiteUrl(primaryValue, false);
    if (primary.url) seen.add(primary.url.href);
    else if (primaryValue) seen.add(primaryValue);
    return extra.value.split(/\r\n|\r|\n/).map(value => value.trim()).filter(Boolean).filter(value => {
      const parsed = parseSiteUrl(value, false);
      const key = parsed.url ? parsed.url.href : value;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    });
  }
  $('multiUrlPanel').addEventListener('toggle', () => {
    if (!$('multiUrlPanel').open && extra.value.trim()) { extra.value = ''; schedule(true); }
  });
  function updateExtraUi() {
    const rawCount = extra.value.split(/\r\n|\r|\n/).map(value => value.trim()).filter(Boolean).length;
    const uniqueCount = extraInputs().length;
    $('additionalUrlCount').textContent = Math.min(uniqueCount, MAX_EXTRA_URLS) + ' / ' + MAX_EXTRA_URLS + ' URLs';
    const messages = [];
    if (rawCount > uniqueCount) messages.push((rawCount - uniqueCount) + ' duplicate URL(s) omitted.');
    if (uniqueCount > MAX_EXTRA_URLS) messages.push('Only the first ' + MAX_EXTRA_URLS + ' additional URLs will be checked.');
    say($('additionalUrlMsg'), messages.join(' '), uniqueCount > MAX_EXTRA_URLS ? 'warn' : '');
  }

  // Target URL state
  function setIndicator(state, tip) {
    const element = $('urlStatus');
    element.className = 'url-status' + (state === 'ok' ? ' ok' : state === 'fail' ? ' fail' : '');
    element.textContent = state === 'ok' ? '\u2713' : state === 'fail' ? '\u2717' : '\u2022';
    element.title = tip; element.setAttribute('aria-label', tip);
  }
  function updateTargetState() {
    const value = tp.value.trim(); const parsed = parseSiteUrl(value, false); const note = $('targetNote');
    tp.classList.toggle('target-url-empty', !value);
    const hasValidTarget = !!parsed.url || extraInputs().slice(0, MAX_EXTRA_URLS).some(input => !!parseSiteUrl(input, false).url);
    $('checkBtn').disabled = resourceScanBusy || ($('autoCheck').checked && !resourceCheck.checked) || !hasValidTarget;
    if (value && parsed.error) {
      note.textContent = 'Please enter an absolute URL starting with http:// or https://'; note.className = 'msg warn';
    } else if (!value) {
      note.textContent = ''; note.className = 'msg';
    } else if (parsed.url && (!S.sourceOrigin || S.sourceOrigin === parsed.origin)) {
      note.textContent = ''; note.className = 'msg';
    }
    updateExtraUi();
  }

  // Evaluation
  const UA_COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"> <rect x="8" y="8" width="13" height="13" rx="2"/> <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/> </svg>`;
  function makeResult(parsed, ua, input) {
    const target = parseSiteUrl(input, false);
    if (!target.url) return inc(input ? 'Invalid absolute URL' : 'Enter a target URL to evaluate');
    if (ua.ignoresRobots || ua.mayIgnoreRobots) return evaluate(parsed, ua, target.url);
    if (S.missingOrigin === target.origin && !ed.value.trim() && !S.loaded) {
      return { state: 'allowed', rule: 'robots.txt not found (default allow)', line: null, note: 'HTTP 404/410 was verified for this origin' };
    }
    if (!ed.value.trim() && !S.loaded) {
      return { state: 'allowed', rule: 'No applicable rules (default allow)', line: null, note: 'Empty editor; live robots.txt restrictions have not been verified' };
    }
    return evaluate(parsed, ua, target.url);
  }
  function addResultRow(tbody, ua, result) {
    const row = tbody.insertRow(); row.className = 'row-click'; row.tabIndex = result.line ? 0 : -1;
    if (result.line) {
      const activate = () => highlightRuleLine(result.line, result.state === 'allowed' ? 'allow' : 'block');
      row.addEventListener('click', activate);
      row.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
      });
    }
    const firstCell = row.insertCell(); const strong = document.createElement('strong');
    strong.textContent = ua.name; firstCell.appendChild(strong);
    const copyToken = document.createElement('button');
    copyToken.type = 'button'; copyToken.className = 'ua-copy-token';
    copyToken.title = 'Copy user-agent name: ' + ua.token;
    copyToken.setAttribute('aria-label', 'Copy user-agent name: ' + ua.token);
    copyToken.innerHTML = UA_COPY_ICON;
    copyToken.addEventListener('click', async event => {
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText('User-agent: ' + ua.token);
        const originalIcon = copyToken.innerHTML;
        copyToken.textContent = '✓'; copyToken.classList.add('is-copied');
        copyToken.title = 'Copied: ' + ua.token;
        copyToken.setAttribute('aria-label', 'Copied: ' + ua.token);
        setTimeout(() => {
          copyToken.innerHTML = originalIcon; copyToken.classList.remove('is-copied');
          copyToken.title = 'Copy user-agent name: ' + ua.token;
          copyToken.setAttribute('aria-label', 'Copy user-agent name: ' + ua.token);
        }, 2000);
      } catch (_) { sayEditor('Could not copy the user-agent token.', 'error'); }
    });
    firstCell.appendChild(copyToken);
    if (ua.note) {
      const note = document.createElement('span'); note.className = 'fallback-note';
      note.textContent = ua.note; firstCell.appendChild(note);
    }
    const statusCell = row.insertCell();
    statusCell.style.textAlign = 'center'; statusCell.style.verticalAlign = 'middle';
    const badge = document.createElement('span');
    badge.className = 'badge ' + (result.state === 'allowed' ? 'badge-allowed' : result.state === 'blocked' ? 'badge-blocked' : 'badge-na');
    badge.style.display = 'inline-block';
    badge.textContent = { allowed: 'Allowed', blocked: 'Blocked', inconclusive: 'Inconclusive' }[result.state] || 'N/A';
    statusCell.appendChild(badge);
    const directiveCell = row.insertCell();
    directiveCell.style.textAlign = 'left';
    directiveCell.style.fontFamily = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
    directiveCell.style.fontSize = '0.9rem';
    directiveCell.appendChild(document.createTextNode(result.rule + (result.line ? ' (Line ' + result.line + ')' : '')));
    if (result.note) {
      const note = document.createElement('span'); note.className = 'fallback-note';
      note.textContent = '\u21b3 ' + result.note; directiveCell.appendChild(note);
    }
  }
  function runEvaluation() {
    clearTimeout(evalTimer);
    const table = $('resultsTable'); const tbody = $('matrixTableBody'); const head = $('resultsTableHead');
    table.classList.remove('stale');
    const primary = tp.value.trim();
    const additional = extraInputs().slice(0, MAX_EXTRA_URLS);
    const targets = [primary, ...additional].filter(Boolean);
    const multiple = targets.length > 1;
    table.classList.toggle('has-multiple-urls', multiple);
    head.textContent = '';
    for (const title of ['User-Agent', 'Status', 'Winning Directive']) {
      const th = document.createElement('th'); th.textContent = title; head.appendChild(th);
    }
    tbody.textContent = '';
    const parsed = parseRobots(ed.value);
    const agents = USER_AGENTS.filter(ua => selectedUAs.has(ua.id));
    if (CATS.some(([category]) => category === S.activeBulk) && agents.length) {
      const copyGroup = document.createElement('button');
      copyGroup.type = 'button'; copyGroup.className = 'ua-copy-token';
      copyGroup.innerHTML = UA_COPY_ICON; copyGroup.title = 'Copy all selected user-agent tokens';
      copyGroup.setAttribute('aria-label', 'Copy all selected user-agent tokens');
      copyGroup.addEventListener('click', async event => {
        event.stopPropagation();
        const tokens = agents.map(ua => 'User-agent: ' + ua.token).join('\n');
        try {
          await navigator.clipboard.writeText(tokens);
          copyGroup.textContent = '✓'; copyGroup.classList.add('is-copied');
          copyGroup.title = 'User-agent tokens copied';
          setTimeout(() => {
            copyGroup.innerHTML = UA_COPY_ICON; copyGroup.classList.remove('is-copied');
            copyGroup.title = 'Copy all selected user-agent tokens';
          }, 2000);
        } catch (_) { sayEditor('Could not copy the selected user-agent tokens.', 'error'); }
      });
      head.cells[0].appendChild(copyGroup);
    }
    const note = $('targetNote'); note.textContent = ''; note.className = 'msg';
    if (!targets.length) targets.push('');
    if (!agents.length) {
      const row = tbody.insertRow(); const cell = row.insertCell();
      cell.colSpan = 3; cell.style.textAlign = 'center'; cell.textContent = 'No user-agents selected.';
    }
    let primaryInconclusive = false;
    targets.forEach((target, index) => {
      if (multiple) {
        const headingRow = tbody.insertRow(); headingRow.className = 'result-url-heading';
        const headingCell = headingRow.insertCell(); headingCell.colSpan = 3;
        headingCell.textContent = 'URL ' + (index + 1) + ': ' + target;
      }
      for (const ua of agents) {
        const result = makeResult(parsed, ua, target);
        if (index === 0 && result.state === 'inconclusive') primaryInconclusive = true;
        addResultRow(tbody, ua, result);
      }
    });
    const parsedPrimary = parseSiteUrl(primary, false);
    if (!primary) setIndicator('unchecked', 'No primary URL entered.');
    else if (!parsedPrimary.url) setIndicator('fail', 'Invalid primary URL: ' + parsedPrimary.error);
    else if (!agents.length) setIndicator('unchecked', 'Valid primary URL, but no user-agents are selected for evaluation.');
    else if (primaryInconclusive) setIndicator('fail', 'Primary URL is syntactically valid, but one or more evaluations are inconclusive.');
    else setIndicator('ok', 'Primary URL evaluated. See the per-agent status; this symbol is not an allow indicator.');
    if (parsedPrimary.url && S.sourceOrigin && S.sourceOrigin !== parsedPrimary.origin) {
      note.textContent = 'The loaded robots.txt belongs to ' + S.sourceOrigin + ', not ' + parsedPrimary.origin + '.';
      note.className = 'msg warn';
    }
    updateTargetState();
  }
  function schedule(immediate = false) {
    updateTargetState(); clearTimeout(evalTimer);
    if ($('autoCheck').checked) evalTimer = setTimeout(runEvaluation, immediate ? 0 : 300);
    else { setIndicator('unchecked', 'Auto-check is off. Press Check URL to evaluate.'); $('resultsTable').classList.add('stale'); }
  }

  // URL field listeners
  tp.addEventListener('input', () => {
    if (resourceCheck.checked) invalidateResourceResults('Target URL changed.');
    schedule(false);
  });
  tp.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing) return;
    event.preventDefault(); const button = $('checkBtn');
    if (!button.disabled) button.click();
  });
  extra.addEventListener('input', () => schedule(false));
  $('clearAdditionalUrls').addEventListener('click', () => { extra.value = ''; schedule(true); extra.focus(); });
  $('autoCheck').addEventListener('change', () => {
    if ($('autoCheck').checked) runEvaluation(); else schedule();
  });
  $('checkBtn').addEventListener('click', () => {
    if (resourceCheck.checked) scanPageResources(); else runEvaluation();
  });

  // User-agent search
  const uaBox = $('uaSearchBox'); const uaClear = $('uaSearchClear');
  function syncSearchClear() { uaClear.hidden = uaBox.value === ''; }
  uaBox.addEventListener('input', () => { syncSearchClear(); renderSidebarList(); });
  uaBox.addEventListener('keydown', event => {
    if (event.key === 'Escape' && uaBox.value) {
      uaBox.value = ''; syncSearchClear(); renderSidebarList();
    }
  });
  uaClear.addEventListener('click', () => {
    uaBox.value = ''; syncSearchClear(); renderSidebarList(); uaBox.focus();
  });

  // Reset fields on page load / refresh
  function resetOnLoad() {
    if (fetchCtl) fetchCtl.abort();
    clearHighlight(); cancelResourceScan(); completedResourceScan = null;
    ed.value = ''; tp.value = ''; extra.value = '';
    $('fetchUrlInput').value = ''; uaBox.value = '';
    S.baseline = ''; S.loaded = false; S.sourceOrigin = null; S.missingOrigin = null;
    $('multiUrlPanel').open = false; resourceCheck.checked = false;
    previousResourceSelection = null; previousResourceBulk = null;
    document.querySelectorAll('.app-layout [data-bulk]').forEach(button => { button.disabled = false; });
    $('autoCheck').checked = true; $('autoCheck').disabled = false; previousAutoCheck = true;
    multiUrlPanel.inert = false; multiUrlPanel.classList.remove('resource-disabled');
    ed.scrollTop = 0; ed.scrollLeft = 0;
    selectedUAs.clear(); DEFAULT_UAS.forEach(id => selectedUAs.add(id)); S.activeBulk = null;
    syncSearchClear(); renderSidebarList(); hideResourceProgress(); updateEditorUi();
    clearResourceResults(); updateResultsMode(); runEvaluation();
  }
  window.addEventListener('pageshow', event => { if (event.persisted) resetOnLoad(); });
  resetOnLoad(); updateBulkButtons();

  // Floating Table of Contents
  function initPageIndex() {
    const index = document.querySelector('.page-index');
    const guide = document.querySelector('.robots-guide');
    const mobileMenu = document.querySelector('.page-index-mobile');
    if (!index || !guide || !mobileMenu) return;
    const links = [...index.querySelectorAll('nav a[href^="#"]')];
    const sections = [...guide.querySelectorAll('h2[id], h3[id]')]
      .map(heading => ({ heading, links: links.filter(link => decodeURIComponent(link.hash.slice(1)) === heading.id) }))
      .filter(section => section.links.length);
    if (!sections.length) return;
    const firstHeading = sections[0].heading; let ticking = false;
    function updateIndex() {
      const viewportHeight = window.innerHeight;
      const firstTop = firstHeading.getBoundingClientRect().top;
      const guideBottom = guide.getBoundingClientRect().bottom;
      const threshold = window.matchMedia('(max-width: 768px)').matches ? viewportHeight : 50;
      const visible = firstTop <= threshold && guideBottom > 0;
      index.classList.toggle('index-visible', visible);
      if (!visible && mobileMenu.open) mobileMenu.open = false;
      let current = null;
      for (const section of sections) {
        const top = section.heading.getBoundingClientRect().top;
        if (top <= 50) current = section; else break;
      }
      for (const section of sections) {
        const rect = section.heading.getBoundingClientRect();
        const headingVisible = rect.top < viewportHeight && rect.bottom > 0;
        const active = visible && (headingVisible || section === current);
        section.links.forEach(link => {
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
      ticking = false;
    }
    function scheduleIndexUpdate() {
      if (ticking) return;
      ticking = true; requestAnimationFrame(updateIndex);
    }
    window.addEventListener('scroll', scheduleIndexUpdate, { passive: true });
    window.addEventListener('resize', scheduleIndexUpdate);
    window.addEventListener('pageshow', scheduleIndexUpdate);
    document.addEventListener('click', event => {
      if (!mobileMenu.open) return;
      if (!mobileMenu.contains(event.target)) mobileMenu.open = false;
    });
    mobileMenu.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => { mobileMenu.open = false; });
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mobileMenu.open) {
        mobileMenu.open = false; mobileMenu.querySelector('summary').focus();
      }
    });
    updateIndex();
  }
  initPageIndex();

// Mobile user-agent sidebar
function initMobileUaSidebar() {
  const toggle = $('uaMobileToggle');
  const content = $('uaSidebarContent');
  const count = $('uaSelectedCount');

  if (!toggle || !content || !count) return;

  const sidebar = toggle.closest('.sidebar-card');
  if (!sidebar) return;

  const mobileQuery = window.matchMedia('(max-width: 768px)');

  function setOpen(open) {
    sidebar.classList.toggle('is-open', open);

    toggle.setAttribute('aria-expanded', String(open));

    content.hidden = !open;
  }

  function syncViewport() {
    setOpen(!mobileQuery.matches);
  }

  function updateCount() {
    const total = selectedUAs.size;

    count.textContent =
      `${total} ${total === 1 ? 'agent' : 'agents'} selected`;
  }

  toggle.addEventListener('click', () => {
    if (!mobileQuery.matches) return;

    setOpen(content.hidden);
  });

  mobileQuery.addEventListener('change', syncViewport);

  const list = $('uaCheckboxList');

  if (list) {
    const observer = new MutationObserver(updateCount);

    observer.observe(list, {
      childList: true
    });

    list.addEventListener('change', updateCount);
  }

  syncViewport();
  updateCount();

  window.addEventListener('pageshow', () => {
    syncViewport();
    updateCount();
  });
}

initMobileUaSidebar();


// extra
document.querySelectorAll('a[href="#results-legend"], a[href="#dropZone"]')
  .forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      // Restart animation on repeated clicks
      target.classList.remove('jump-highlight');
      void target.offsetWidth;
      target.classList.add('jump-highlight');
    });
  });

  document.querySelectorAll('#results-legend, #dropZone')
  .forEach(target => {
    target.addEventListener('animationend', () => {
      target.classList.remove('jump-highlight');
    });
  });
})();


/* check url input history */
(function () {
  'use strict';

  const MAX_HISTORY = 15;
  const STORAGE_KEY = 'check-url-history';

  const input = document.getElementById('testPath');
  const button = document.getElementById('checkBtn');
  const wrapper = input?.closest('.url-history-anchor');
  const menu = wrapper?.querySelector('.url-history-menu');

  if (!input || !wrapper || !menu) return;

  let matches = [];
  let activeIndex = -1;
  let showAll = false;

  function readHistory() {
    try {
      const data = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || '[]'
      );

      return Array.isArray(data)
        ? data.filter(item => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }

  function writeHistory(items) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.slice(0, MAX_HISTORY))
      );
    } catch {
      // Storage may be unavailable or disabled.
    }
  }

  function validUrl(value) {
    try {
      const url = new URL(value);

      return /^https?:$/.test(url.protocol) &&
        !!url.hostname &&
        !url.username &&
        !url.password &&
        !/\s/.test(value);
    } catch {
      return false;
    }
  }

  function saveUrl(value) {
    value = String(value || '').trim();

    if (!validUrl(value)) return;

    const items = readHistory().filter(
      item => item !== value
    );

    items.unshift(value);
    writeHistory(items);
  }

  function close() {
    menu.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    activeIndex = -1;
  }

  function setActive(index) {
    const rows = menu.querySelectorAll('.url-history-item');

    rows.forEach((row, i) => {
      row.classList.toggle('is-active', i === index);
    });

    activeIndex = index;

    if (index >= 0 && rows[index]) {
      rows[index].scrollIntoView({ block: 'nearest' });
    }
  }

  function select(value) {
    input.value = value;

    input.dispatchEvent(
      new Event('input', { bubbles: true })
    );

    input.dispatchEvent(
      new Event('change', { bubbles: true })
    );

    input.focus();
    close();
  }

  function render() {
    const query = showAll
      ? ''
      : input.value.trim().toLowerCase();

    matches = readHistory().filter(
      url => url.toLowerCase().includes(query)
    );

    menu.replaceChildren();
    activeIndex = -1;

    if (!matches.length) {
      close();
      return;
    }

    const list = document.createElement('ul');
    list.className = 'url-history-list';

    matches.forEach(url => {
      const item = document.createElement('li');
      item.className = 'url-history-item';

      const selectButton = document.createElement('button');
      selectButton.type = 'button';
      selectButton.className = 'url-history-select';
      selectButton.title = url;

      // Clock icon
      const clock = document.createElement('span');
      clock.className = 'url-history-clock';
      clock.setAttribute('aria-hidden', 'true');

      clock.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg"
             width="14" height="14"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             stroke-width="1.8"
             stroke-linecap="round"
             stroke-linejoin="round">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 7v5l3 2"></path>
        </svg>
      `;

      // URL text
      const urlText = document.createElement('span');
      urlText.className = 'url-history-url';
      urlText.textContent = url;

      selectButton.append(clock, urlText);

      selectButton.addEventListener('click', () => {
        select(url);
      });

      // Remove individual URL
      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      removeButton.className = 'url-history-remove';
      removeButton.textContent = '\u00d7';
      removeButton.title = 'Remove from history';

      removeButton.setAttribute(
        'aria-label',
        'Remove ' + url + ' from history'
      );

      removeButton.addEventListener('click', () => {
        writeHistory(
          readHistory().filter(item => item !== url)
        );

        render();
      });

      item.append(selectButton, removeButton);
      list.appendChild(item);
    });

    // Clear history footer
    const footer = document.createElement('div');
    footer.className = 'url-history-footer';

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.className = 'url-history-clear';
    clearButton.textContent = 'Clear history';

    clearButton.addEventListener('click', () => {
      writeHistory([]);
      close();
    });

    footer.appendChild(clearButton);
    menu.append(list, footer);

    menu.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  // Opening the input displays all saved URLs.
  input.addEventListener('focus', () => {
    showAll = true;
    render();
  });

  input.addEventListener('click', () => {
    showAll = true;
    render();
  });

  // Typing filters the history.
  input.addEventListener('input', () => {
    showAll = false;
    render();
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === 'ArrowDown' ||
        event.key === 'ArrowUp') {

      if (menu.hidden) {
        showAll = true;
        render();
      }

      if (!matches.length) return;

      event.preventDefault();

      const direction =
        event.key === 'ArrowDown' ? 1 : -1;

      const next = activeIndex + direction;

      setActive(
        next < 0
          ? matches.length - 1
          : next >= matches.length
            ? 0
            : next
      );
    }

    if (event.key === 'Enter' &&
        !menu.hidden &&
        activeIndex >= 0) {

      event.preventDefault();
      select(matches[activeIndex]);
    }
  });

  // Close when clicking outside.
  document.addEventListener('pointerdown', event => {
    if (!wrapper.contains(event.target)) {
      close();
    }
  });

  // Close when keyboard focus leaves the component.
  wrapper.addEventListener('focusout', event => {
    if (!wrapper.contains(event.relatedTarget)) {
      close();
    }
  });

  // Save URLs when manually checking.
  if (button) {
    button.addEventListener('click', () => {
      saveUrl(input.value);
      close();
    }, true);
  }

  // Public method for your existing auto-check logic.
  window.robotsUrlHistory = {
    saveTest(value) {
      saveUrl(value);
    }
  };

})();
