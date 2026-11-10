// Squoosh-derived codecs, via jSquash. Single-threaded WASM deliberately avoids
// SharedArrayBuffer / COOP / COEP requirements on the host site.
const modules = new Map();
const paths = { jpeg: 'mozjpeg_enc', webp: 'webp_enc', avif: 'avif_enc' };
self.onmessage = async ({ data: { pixels, width, height, format, quality, effort } }) => {
  try {
    if (!modules.has(format)) {
      modules.set(format, (async () => {
        const [{ default: factory }, { defaultOptions }] = await Promise.all([
          import(`./vendor/${format}/codec/enc/${paths[format]}.js`),
          import(`./vendor/${format}/meta.js`),
        ]);
        return { codec: await factory({ noInitialRun: true }), defaultOptions };
      })());
    }
    const { codec, defaultOptions } = await modules.get(format);
    const options = { ...defaultOptions, quality };
    if (format === 'webp') options.method = [0, 4, 6][effort];
    if (format === 'avif') options.speed = [8, 6, 3][effort];
    if (format === 'jpeg') {
      options.trellis_multipass = effort > 0;
      options.trellis_opt_zero = effort > 0;
      options.trellis_opt_table = effort > 1;
      options.trellis_loops = effort > 1 ? 2 : 1;
    }
    const result = codec.encode(new Uint8Array(pixels), width, height, options);
    if (!result) throw new Error('The encoder could not create this image.');
    // Copy out of WASM-owned memory before transferring.
    const buffer = new Uint8Array(result).slice().buffer;
    self.postMessage({ buffer }, [buffer]);
  } catch (error) {
    self.postMessage({ error: error.message || 'Encoding failed.' });
  }
};
