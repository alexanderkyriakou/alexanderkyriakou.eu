---
title: "Image Optimizer and Aspect Ratio Editor — Technical Reference"
description: "Technical Markdown alternate covering local image cropping, resizing and optimization, platform presets, JPEG, PNG, WebP and AVIF exports, comparison results, limits and publishing guidance."
author: "Alexander Kyriakou"
canonical_url: "https://alexanderkyriakou.eu/ak/image-optimization-aspect-ratio-editor"
markdown_url: "https://alexanderkyriakou.eu/ak/image-optimization-aspect-ratio-editor.md"
date_published: "2026-11-10"
date_modified: "2026-11-10"
language: "en"
---

# Image optimizer and aspect ratio editor

A free, browser-based tool by [Alexander Kyriakou](https://alexanderkyriakou.eu/) for cropping, resizing and optimizing JPEG, PNG, WebP and AVIF images. Keep the original framing, export a crop in its source format, or resize and optimize the selected crop directly.

- [Interactive tool and accompanying guide](https://alexanderkyriakou.eu/ak/image-optimization-aspect-ratio-editor)
- [Markdown alternate](https://alexanderkyriakou.eu/ak/image-optimization-aspect-ratio-editor.md)
- [Process demonstration: MP4](https://alexanderkyriakou.eu/assets/images/thoughts/image-optimization-aspect-ratio-editor/cropping-optimizing-at-once-demo.mp4)
- [Contact the author](https://alexanderkyriakou.eu/contact)

This document describes the tool and accompanying guide as of November 10, 2026. It is a technical alternate of the page. Use the interactive page to edit images; the Markdown document describes the workflows, settings, limits and publishing considerations.

## Purpose

I like well-optimized images online, and Squoosh is my go-to tool. But I usually had another program open just to crop an image before optimizing it. Getting a specific aspect ratio through an online cropper or a heavier image editor felt like more work than it needed to be. This adds the cropping step I kept needing.

The tool supports three independent workflows:

1. Optimize an image without changing its framing.
2. Crop an image to an aspect ratio and download it in its source format.
3. Crop an image, optionally reduce the crop's dimensions, then optimize and download it.

It edits one image at a time. Typical uses include website images, article illustrations, social posts, link previews and thumbnails. It is intended for SEOs, copywriters, social media managers and anyone preparing images to publish.

## Processing and privacy

**Image processing happens locally in your browser. Your images are not uploaded.**

The tool does not send selected images to a server, an image-processing API, Squoosh or jSquash. The page, fonts, icons, example images and encoder files still load from the website. Encoder files load when needed, so local processing does not mean that the application makes no network requests or is guaranteed to work offline.

Selected images and generated results remain in the current page session. The tool does not persist image files or edit history. Reloading clears the loaded image. Downloading saves a new file through the browser and does not overwrite the source file.

These statements describe the image tool's behaviour, rather than the hosting provider's access logs or unrelated website features.

## Inputs and browser requirements

Drag and drop or choose a **JPEG, PNG, WebP or AVIF** file. The implementation checks file signatures rather than relying on the filename alone. The browser must be able to decode the selected image.

Every new or replacement image starts with its complete original framing. Large images may still be downscaled on export to meet the output limits.

| Constraint | Limit or requirement |
| --- | --- |
| Images per editing session | One image at a time |
| Supported input formats | JPEG, PNG, WebP, AVIF |
| Minimum input dimensions | 100 pixels on each edge |
| Maximum input file size | 32 MiB |
| Maximum input pixel count | 40,000,000 pixels |
| Maximum input edge | 16,384 pixels |
| Maximum output pixel count | 16,000,000 pixels |
| Maximum output edge | 8,192 pixels |
| Browser capabilities | JavaScript, Canvas, module Web Workers, WebAssembly and decoding support for the chosen input |

Both file-size and dimension limits apply. Memory use and encoding time depend on the image and device. HEIC/HEIF, SVG, GIF, RAW and other formats outside the four accepted types are unsupported.

The four supported formats work in current major browsers, but older browsers and individual publishing platforms may differ. Format decoding support does not establish that a CMS or social platform will accept the file. Consult [MDN's image format guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types) for compatibility details.

## Examples and demonstration

The idle page provides three example cards. Small WebP thumbnails load initially; the full example image loads when selected.

| Card | Image | Behaviour |
| --- | --- | --- |
| Optimization | Seagulls | Loads the image and starts WebP optimization without selecting a crop. |
| Cropping | Fish | Loads the image and opens the aspect ratio controls. Choose a ratio to start cropping. |
| Doing both | Cat | Loads the image and opens the aspect ratio controls. Choose a crop, then run Optimize. |

Examples reset optimization settings to **WebP, quality 80 and Balanced effort**. These are also the initial page defaults. Replacing a personal image within the session does not necessarily reset the settings.

The page reports this result for the seagull example:

**PNG 5.35 MiB → WebP 346.4 KiB**, using WebP quality 80 and Balanced effort.

This is an example result, not a promised reduction for other images. Compare the details before keeping the output. File sizes are rounded for display; an exact percentage should be calculated from the underlying byte counts.

The [process video](https://alexanderkyriakou.eu/assets/images/thoughts/image-optimization-aspect-ratio-editor/cropping-optimizing-at-once-demo.mp4) demonstrates cropping and optimizing an image at once. It was recorded in Firefox, is not sped up, and has dimensions of **2512 × 1872 pixels**. The written workflow below provides instructions alongside the demonstration.

## From image to download

1. **Choose an image.** Drop a supported file into the tool, choose one from the device, or select an example.
2. **Choose the frame and dimensions.** Keep the original framing or choose a preset or custom aspect ratio. Move and resize the crop frame, then set **Output width** to resize the selected crop. Height follows the ratio; the tool does not intentionally upscale.
3. **Optimize, compare, download.** Choose the target format, quality and effort, then run **Optimize**. Move the comparison handle to inspect the result before using **Download**.

Only need the crop? **Download crop** exports the current crop in the source format. This uses separate encoding settings from the optimization panel; see [Download paths](#download-paths).

Selecting an image opens the editor. The aspect ratio controls are at the upper left, with optimization controls at the upper right. On mobile, one control panel opens at a time. Light and dark editor themes are available.

## Cropping, aspect ratios and dimensions

These properties describe different things:

| Property | Meaning |
| --- | --- |
| Aspect ratio | The shape, such as 16:9 or 1:1. |
| Crop frame | The part of the source image included in the export. |
| Output dimensions | The exported resolution in pixels. |
| File size | The encoded byte size, affected by image content, dimensions, format and settings. |
| Preview zoom | How closely the image is viewed in the editor. It does not set export resolution. |

### Built-in presets

The quick shortcuts are **16:9**, **1:1** and **3:4**. The platform menu provides:

| Platform or use | Available aspect ratios |
| --- | --- |
| Instagram | 3:4, 4:5, 1:1, 9:16 |
| YouTube | 16:9, 9:16 |
| Facebook | 1.91:1, 1:1, 9:16 |
| LinkedIn | 1.91:1, 1:1, 4:1 |
| Pinterest | 2:3, 9:16 |
| TikTok | 9:16 |
| X / Twitter | 16:9, 3:1 |
| Photography & web | 3:2, 4:3, 21:9 |

These presets provide framing guides. They do not validate a platform's current upload requirements, recommended resolution, safe areas or placement rules. Check the intended destination before publishing.

Custom ratio components accept whole numbers from **1 to 1,000**, with a resulting ratio between **1:100 and 100:1**.

### Adjusting the crop

Opening the aspect ratio panel alone does not crop an image. Choosing a preset or custom ratio starts the crop.

- Drag the image underneath the frame to adjust its placement.
- Move the frame using its border or top handle, or resize it using the corners.
- Use **Crop size** to adjust the frame size; the slider also accepts the scroll wheel while hovered.
- With the crop frame focused, arrow keys move it; plus and minus resize it.
- Choose **Rule of thirds**, **Center lines**, **Golden ratio** or **Frame only** as the composition guide.
- Use **Center**, **Reset crop** or **Keep original framing** as needed.

Relative crop size is retained when switching ratios.

### Resizing the selected crop

**Output width** sets the exported dimensions of the current crop, or of the complete image when keeping original framing. Height follows the ratio. For example, a sufficiently large 16:9 crop can be reduced to 1280 × 720 pixels.

Export does not intentionally upscale. Selected ratios normally use whole multiples of their reduced components, so the actual width can be slightly below the requested width. Very small crops use the closest permitted whole-pixel dimensions when a complete ratio unit cannot fit. Output limits can also require downscaling.

### Zoom and framing

The mouse wheel, zoom buttons, editable percentage and **Fit** control change the view. The editable zoom accepts **1–1,600%**; crop coverage can impose a higher minimum.

While actively cropping, moving or zooming the image changes which source pixels fall inside the frame. In the selected-frame preview or optimized comparison, zoom and pan only change the view.

## Output formats and optimization settings

I have kept the selection to the four formats I mainly use. They cover quite a bit of everyday web publishing.

| Format | Practical use | Encoding and transparency |
| --- | --- | --- |
| WebP | A practical starting point for website images. Inspect text, edges and fine textures. | Local WebAssembly encoder; lossy compression with transparency preserved. |
| AVIF | Worth comparing with WebP when file size matters. Encoding can take longer. | Local WebAssembly encoder; lossy compression with transparency preserved. |
| JPEG | Photographs and destinations expecting JPEG. | MozJPEG through local WebAssembly; lossy compression. Transparent pixels are replaced by the selected background colour. |
| PNG | Screenshots and graphics where lossless output matters. | Browser Canvas lossless encoding with transparency preserved. Quality and effort controls are disabled. |

[MozJPEG](https://github.com/mozilla/mozjpeg) is an encoder that improves compression efficiency while producing standard JPEG files. It is not a separate image format requiring a special viewer.

PNG's lossless encoding applies to the rendered output pixels. It does not promise an unchanged file, retained metadata or identical pixels after resizing and Canvas colour processing. The tool does not expose lossless WebP or AVIF modes, or a dedicated PNG optimizer.

### Quality

Lossy formats accept quality values from **1 to 100**. Quality controls the compression trade-off. A setting of 100 is not a universal lossless mode, and the same number does not represent equivalent quality across different encoders.

### Effort

The available presets are **Fast**, **Balanced** and **Thorough**. Effort controls how much processing the encoder spends searching for efficient compression. Higher effort takes longer and may save bytes; it does not guarantee a smaller result or higher visual quality.

The initial settings are **WebP, quality 80, Balanced effort**. They are a starting point, not a recommendation for every image.

## Download paths

| Action | Result |
| --- | --- |
| Download crop, or Download image when uncropped | Re-encodes the current frame and output dimensions in the source format. The optimization panel's target format, quality and effort do not apply. |
| Optimize, then Download | Encodes the current frame and output dimensions using the selected optimization settings. Enables the before/after comparison when the browser can preview the format. |

### Source-format downloads

Keeping the source format does not mean preserving the source bytes or its original compression settings:

- PNG remains lossless.
- JPEG, WebP and AVIF use quality 90.
- AVIF uses Balanced effort.
- JPEG and WebP use browser encoders where supported, with a local WebAssembly fallback. AVIF uses the local WebAssembly encoder.

Cropping a JPEG, WebP or AVIF therefore involves another lossy encode. Keeping the extension does not guarantee a smaller file.

### Generated filenames

For a source named `holiday.photo.jpg`:

| Export | Example filename |
| --- | --- |
| Source-format 16:9 crop | `holiday.photo-16-9.jpg` |
| The same crop optimized as WebP | `holiday.photo-16-9.webp` |
| WebP optimization without a selected crop | `holiday.photo.webp` |

The 1.91:1 preset uses the reduced ratio suffix `-191-100`.

## Before/after comparison and savings

The comparison previews use the same frame and output dimensions. Move the circular handle to compare the images; both sides share zoom and pan.

The reference used to calculate savings depends on the exported geometry:

| Geometry | Before reference |
| --- | --- |
| Complete original frame and unchanged dimensions | The actual original file. |
| Cropped or resized output | A newly generated source-format export at the same frame and dimensions: PNG lossless, or quality 90 for JPEG, WebP and AVIF. |

This separates optimization savings from the effect of removing pixels or reducing dimensions. A cropped JPEG is compared with a same-frame JPEG reference, rather than a PNG baseline. For crops and resizes, the displayed percentage is not the total reduction against the originally loaded file.

Savings are calculated from actual byte counts:

```text
savings (%) = (1 - optimized bytes / reference bytes) × 100
```

The result can be smaller or larger. Compression is not guaranteed to reduce file size.

Sizes use binary units:

- **B:** bytes.
- **KiB:** 1,024 bytes.
- **MiB:** 1,048,576 bytes.

Displayed sizes are rounded. Percentages use the underlying byte counts and are shown to one decimal place.

The footer reports the original dimensions, aspect ratio and file size. Output dimensions and ratio are available before encoding; the actual output size appears after Optimize or a source-format download. The tool does not estimate an encoded size beforehand. Changes that invalidate a result clear stale size information.

## Metadata, colour and animation

The browser handles supported orientation metadata when decoding. Generated exports do not retain source EXIF/GPS metadata. This is not a guarantee that every possible metadata field is removed: browsers and encoders may write their own output information.

Canvas colour processing is used. The tool is not intended to preserve print colour profiles, HDR or complete source metadata.

Animation is not preserved. If a supported animated input is decoded, the export contains a single decoded frame. GIF input is unsupported.

No batch processing, rotation or flip controls, AI generation, background removal, account system or persistent edit history is implemented.

## Publishing images for websites, search and social

### On-page images, page speed and Core Web Vitals

Hero images, article illustrations and product photos should retain enough detail for their displayed size without making visitors download unnecessary pixels. Smaller files can help [Largest Contentful Paint (LCP)](https://web.dev/articles/optimize-lcp) when an image is the largest visible element. Loading priority and rendering still matter; compression alone does not guarantee a better LCP result.

On the published page, reserve image space with dimensions to help prevent layout shifts (CLS). Cropping and encoding the image do not themselves set the page's layout or loading behaviour.

### SERP thumbnails and Open Graph previews

A clear subject helps an image remain useful as a small thumbnail beside a search result. Use relevant images on the page, descriptive filenames, useful alt text and nearby context.

Google chooses thumbnails automatically. [Image metadata](https://developers.google.com/search/docs/appearance/google-images#preferred-image), including `og:image` and appropriate structured data, can influence the choice without guaranteeing it.

[Open Graph](https://ogp.me/) images also represent pages when links are shared. Prepare a crop for the intended placement, then set its URL in the page's metadata. The tool prepares the image file; it does not modify the destination website's metadata.

### Google Discover

The accompanying guide follows [Google's Discover recommendations](https://developers.google.com/search/docs/appearance/google-discover): relevant, high-quality images at least **1200 pixels wide**, with **more than 300,000 pixels** and a **16:9 ratio**.

A **1280 × 720** crop is a practical option if the source is large enough. Keep the important details in frame and enable large previews on the published page with `max-image-preview:large`. These choices prepare the image; they do not guarantee a Discover appearance.

### Images in the agentic web

Some [AI agents already navigate through screenshots](https://www.anthropic.com/news/developing-computer-use), so visual information can matter to software using a page as well as to people reading it.

As this develops, clear images, readable details and supporting text may become even more useful. Keep meaningful information intact when cropping or compressing. There is no established image setting that guarantees an agent will understand or recommend a page.

## Practical questions and troubleshooting

### Can I optimize without cropping?

Yes. Keep the original framing and run Optimize. Opening the aspect ratio panel alone does not crop anything; choosing a ratio starts the crop.

### Can I resize just the crop?

Yes. Resize the frame to choose how much of the scene to include, then use Output width to set the crop's exported resolution. Height follows the selected ratio. The tool does not intentionally upscale.

### Why is the result larger or softer?

An already compressed image may not shrink further. Try another format, lower quality or smaller output dimensions. If detail suffers, increase quality or retain more pixels. Source-format downloads are also re-encoded.

### Why won't my image open?

Check that the actual file format is JPEG, PNG, WebP or AVIF and that the browser can decode it. Renaming another format's extension does not convert it. Check the file size, pixel count, minimum dimensions and maximum edge length against the input limits.

### Why is processing slow?

Large images, AVIF and Thorough effort can take longer, especially on mobile. Try Balanced or Fast, or reduce Output width. Device resources affect processing time even when an image is within the accepted limits.

### Why is the export smaller than the dimensions I requested?

The source crop may not contain enough pixels, the output limits may require downscaling, or dimensions may be rounded down to preserve the ratio. Preview zoom does not increase the available source resolution.

### Why are the quality and effort controls disabled for PNG?

The PNG path uses lossless Canvas encoding. Those controls do not apply, and the tool does not include a dedicated PNG optimizer.

### Does downloading change the original or preserve my session?

Downloading saves a new file and does not overwrite the original. The tool does not retain edit history across reloads. Save the result before leaving or reloading the page.

## Thank you, Squoosh

This tool uses [jSquash](https://github.com/jamsinclair/jSquash) encoders derived from [Squoosh](https://github.com/GoogleChromeLabs/squoosh), the open-source project from GoogleChromeLabs. It is a custom local integration, rather than an embedded Squoosh app or a remote Squoosh service, and is not an official Google product.

Thank you to the people who made that work available to build on. Squoosh has saved me plenty of bytes; this adds the cropping step I kept needing.

## Feedback

If there's an aspect ratio preset or output format you'd find useful, or something isn't working as it should, [send me a note](https://alexanderkyriakou.eu/contact). Other suggestions and corrections are welcome, too.

## License and attribution

For reuse and attribution, see the [licensing page](https://alexanderkyriakou.eu/licensing). Third-party components remain subject to their applicable licences and notices, [third party notices](https://alexanderkyriakou.eu/assets/licenses/THIRD-PARTY-NOTICES.md). See the [license and attribution details](https://alexanderkyriakou.eu/assets/licenses/image-optimization-aspect-ratio-editor-LICENSE.md) and [full software license](https://alexanderkyriakou.eu/assets/licenses/CPAL-1-0.txt). [Original tool](https://alexanderkyriakou.eu/ak/image-optimization-aspect-ratio-editor).
