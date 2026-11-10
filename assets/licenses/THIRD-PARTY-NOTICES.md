# Third-party notices

The image editor uses local copies of the following open-source assets. No third-party service receives user images.

## Encoders

JPEG: `@jsquash/jpeg` **1.6.0**; WebP: `@jsquash/webp` **1.5.0**; AVIF: `@jsquash/avif` **2.1.1**, from [jSquash](https://github.com/jamsinclair/jSquash), derived from [GoogleChromeLabs/Squoosh](https://github.com/GoogleChromeLabs/squoosh). JavaScript wrappers are Apache-2.0. Full licenses are preserved in each `editor/vendor/<format>/LICENSE`. The JPEG and WebP codec notices are retained in `vendor/<format>/codec/LICENSE.codec.md`.

Only the single-threaded encoder modules, matching WASM binaries, defaults and notices are included. Modules are loaded on demand by a local worker. Vendor JavaScript and WASM are unmodified; the worker is a custom integration using each codec factory's API. No build or CDN is needed to deploy the vendored files.

AVIF uses libavif and the AOM AV1 encoder. Upstream notices: [libavif license](https://github.com/AOMediaCodec/libavif/blob/main/LICENSE), [AOM license](https://aomedia.googlesource.com/aom/+/refs/heads/main/LICENSE), [AOM patent license](https://aomedia.googlesource.com/aom/+/refs/heads/main/PATENTS). See the bundled `editor/vendor/avif/codec` notices.

## Fonts

Commissioner and STIX Two Text are copied from the author's existing site. Both use the SIL Open Font License 1.1. License texts are in `/assets/images/thoughts/image-optimization-aspect-ratio-editor/fonts/Commissioner-OFL.txt` and `STIX-Two-Text-OFL.txt`.

## Icons

Control icons are unmodified SVGs from [Matita](https://matita.dev), `@matita/icons` **0.6.0**, [source](https://github.com/matita-dev/icons), licensed under MIT. The full license is retained at `/assets/licenses/MATITA-LICENSE.txt`. CSS masks allow the icons to inherit the editor theme; the comparison thumb uses the original arrow-left-right SVG. The notification close button embeds the Matita X paths directly in the HTML, with display size and accessibility attributes, so it needs no separate icon request.

Instagram, YouTube, Facebook, Pinterest, TikTok and X logos come from [Simple Icons](https://simpleicons.org) **16.36.0**, via `@iconify-json/simple-icons` **1.2.101**, licensed under CC0 1.0. SVGs wrap the original path data in a 24 × 24 view box. The full license is retained at `/assets/licenses/SIMPLE-ICONS-LICENSE.txt`. Brand marks remain the property of their respective owners.

The colorful idle hero image icon (`hero-image.svg`) adapts the Matita image icon’s original path geometry with colored strokes, fills and a sky background. It uses the same MIT license above. The crop mark used as the favicon is an original SVG created for this tool.

## Example images

The project’s three example originals are `seagulls-wallpaper.png`, `fish-wallpaper.jpg` (fish), and `cat-wallpaper.jpg` (cat), supplied in the repository by its owner. Small WebP thumbnails in `examples/` are derived from those files for the idle page. The originals are unchanged; these photos are separate from the codec and font licenses above.
