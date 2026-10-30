/*
Hairline Settle — https://github.com/lucasmarkes/hairline
Version 0.5.1, source commit 37d2e78dcb333ab30c3338e28ed4a690364ea014.
Adaptation: TypeScript types removed; the five source modules are combined below.
Only Settle is mounted. Styling stays in the page's scoped inline CSS.

MIT License

Copyright (c) 2026 Lucas Marques

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Upstream: packages/hairline/src/core/iso.ts
/**
 * Hairline — the drawing maths every figure shares, with no DOM. Ported from
 * the study (design/lab-hairline/cartilha-v2.html) arithmetic-for-arithmetic,
 * so a figure here can be diffed against its IIFE there by eye.
 *
 * Everything is in viewBox units: every figure is drawn in a 400 × 320 box and
 * scaled to its column by the svg, so no number here depends on the viewport.
 * World space is x/y on the ground and z up; the camera turns the ground by an
 * azimuth, then squashes y by sin(el) and lifts z by cos(el). There is no
 * perspective and no hidden-line removal: plates are filled with the ground
 * colour and painted back to front, so a nearer one simply covers.
 */




/** A sample on a rounded outline, with its outward normal on the ground plane. */



/**
 * An orthographic camera. `az` is in radians, `k` is sin(elevation) (.5 is
 * the 2:1 view every figure rests at), `S` is the scale, and `ox`/`oy` the
 * screen offset `fit` computes. Mutable on purpose: the turntable turns it.
 */



/** Two lines of a solid: its bright silhouette and the one dim crease inside it. */


const clamp = (v        , a        , b        ) => Math.max(a, Math.min(b, v));
const lerp = (a        , b        , t        ) => a + (b - a) * t;
const rad = (d        ) => (d * Math.PI) / 180;
/** Two decimals: enough for a hairline at any zoom, and path strings stay short. */
const r2 = (n        ) => Math.round(n * 100) / 100;

/** A closed path through the points. */
const poly = (pts                 ) =>
  "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L") + "Z";
/** One straight segment, as its own subpath, so several can be joined into one `d`. */
const seg = (a      , b      ) => `M${r2(a[0])} ${r2(a[1])}L${r2(b[0])} ${r2(b[1])}`;
/** An open polyline; empty for fewer than two points. */
const open = (pts                 ) =>
  pts.length < 2 ? "" : "M" + pts.map((p) => r2(p[0]) + " " + r2(p[1])).join("L");

/* ---------- projection ---------- */

const Cam = (azDeg        , k        , S        )         => ({ az: rad(azDeg), k, S, ox: 0, oy: 0 });

/**
 * The projector for the camera as it is now. Figures that move the camera
 * (the turntable) call this again each frame; the rest call it once.
 */
function proj(C        )            {
  const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
  return (x, y, z) => {
    const X = x * c - y * s, Y = x * s + y * c;
    return [C.ox + C.S * X, C.oy + C.S * (Y * C.k - z * zf)];
  };
}

/**
 * The ground-plane inverse: the world x/y under a screen point, on the plane
 * at height z. This is how the pointer reaches the drawing — every hover in
 * the figures is tested in world units, never in pixels.
 */
function unproj(C        , sx        , sy        , z        )                   {
  const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
  const X = (sx - C.ox) / C.S, Y = ((sy - C.oy) / C.S + z * zf) / C.k;
  return [X * c + Y * s, -X * s + Y * c];
}

/** Sets the camera's offset so the bounding box of `pts` is centred on (cx, cy). */
function fit(C        , pts                 , cx        , cy        ) {
  C.ox = 0; C.oy = 0;
  const P = proj(C);
  let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
  for (const p of pts) {
    const q = P(p[0], p[1], p[2]);
    a = Math.min(a, q[0]); b = Math.max(b, q[0]); c = Math.min(c, q[1]); d = Math.max(d, q[1]);
  }
  C.ox = cx - (a + b) / 2; C.oy = cy - (c + d) / 2;
}

/* ---------- rounded solids ---------- */

/**
 * A rounded rectangle, sampled. Each sample carries its outward normal, so a
 * caller can keep just the run that faces the camera. `n` samples per corner.
 */
function rrect(u0        , v0        , u1        , v1        , r        , n = 4)       {
  r = Math.max(0, Math.min(r, (u1 - u0) / 2, (v1 - v0) / 2));
  const out       = [];
  for (const [cu, cv, a0] of [[u1 - r, v1 - r, 0], [u0 + r, v1 - r, 90], [u0 + r, v0 + r, 180], [u1 - r, v0 + r, 270]])
    for (let k = 0; k <= n; k++) {
      const a = rad(a0 + (90 * k) / n), ca = Math.cos(a), sa = Math.sin(a);
      out.push({ u: cu + r * ca, v: cv + r * sa, nu: ca, nv: sa });
    }
  return out;
}

/** A circle of radius R about the origin, sampled the same way. */
function circ(R        , n = 96)       {
  const out       = [];
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
    out.push({ u: R * ca, v: R * sa, nu: ca, nv: sa });
  }
  return out;
}

/** Convex hull (monotone chain), counter-clockwise in screen space. */
function hull(input                 )         {
  const pts = input.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const x = (o      , a      , b      ) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo         = [], up         = [];
  for (const p of pts) { while (lo.length > 1 && x(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length > 1 && x(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  lo.pop(); up.pop();
  return lo.concat(up);
}

/** A ring laid flat at height z, projected. */
const ringAt = (P           , ring                   , z        )         => ring.map((q) => P(q.u, q.v, z));

/**
 * The samples whose normal faces the camera. The world direction of
 * screen-down is (sin az, cos az), so facing is a dot product with it.
 */
const facing = (C        ) => {
  const s = Math.sin(C.az), c = Math.cos(C.az);
  return (q        ) => q.nu * s + q.nv * c >= -1e-6;
};

/** The one cyclic run of samples that pass `keep`, in ring order. */
function run(ring                   , keep                        )       {
  const n = ring.length;
  let s = -1;
  for (let i = 0; i < n; i++) if (keep(ring[i]) && !keep(ring[(i + n - 1) % n])) { s = i; break; }
  if (s < 0) return keep(ring[0]) ? ring.slice() : [];
  const out       = [];
  for (let k = 0; k < n && keep(ring[(s + k) % n]); k++) out.push(ring[(s + k) % n]);
  return out;
}

/**
 * A prism standing from z0 to z1. Its silhouette is the hull of the two rings,
 * so the vertical corners are never drawn; its only inner line is the crease,
 * the front run of an inset ring on the lid, which reads as a bevel.
 */
function prism(
  P           ,
  front                        ,
  ring                   ,
  inner                                      ,
  z0        ,
  z1        ,
)             {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))),
    crease: inner ? open(ringAt(P, run(inner, front), z1)) : "",
  };
}

/** A rounded footprint and its crease ring, inset by b. */
const rings = (x0        , y0        , x1        , y1        , r        , b        )               => [
  rrect(x0, y0, x1, y1, r),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b)),
];

/** The leftmost, rightmost and nearest samples of a ring: where construction lines drop from. */
function extremes(P           , ring                   )                           {
  const pr = ring.map((q) => P(q.u, q.v, 0));
  let a = 0, b = 0, c = 0;
  pr.forEach((p, k) => { if (p[0] < pr[a][0]) a = k; if (p[0] > pr[b][0]) b = k; if (p[1] > pr[c][1]) c = k; });
  return [ring[a], ring[b], ring[c]];
}

/** Rounds every vertex of a closed polygon with a quadratic through the vertex; r per vertex. */
function fillet(pts                 , rs                   , n = 4)         {
  const m = pts.length, out         = [];
  for (let i = 0; i < m; i++) {
    const a = pts[(i + m - 1) % m], p = pts[i], b = pts[(i + 1) % m];
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1]);
    const t = Math.min(rs[i], la / 2, lb / 2);
    const p1 = [p[0] + ((a[0] - p[0]) / la) * t, p[1] + ((a[1] - p[1]) / la) * t];
    const p2 = [p[0] + ((b[0] - p[0]) / lb) * t, p[1] + ((b[1] - p[1]) / lb) * t];
    for (let k = 0; k <= n; k++) {
      const s = k / n, w = 1 - s;
      out.push([w * w * p1[0] + 2 * w * s * p[0] + s * s * p2[0], w * w * p1[1] + 2 * w * s * p[1] + s * s * p2[1]]);
    }
  }
  return out;
}

/**
 * A prism's mirror under its floor, as a path: the far edge of the reflection
 * and its two sides. `y0`/`y1` are where its fade starts (the floor's top) and
 * ends (just past the reflection's lowest point).
 */
function ghost(
  P           , front                        , ring                   , z0        , depth        ,
)                                        {
  const f = run(ring, front), lowP = ringAt(P, f, z0 - depth);
  return {
    d: open(lowP) + [f[0], f[f.length - 1]].map((q) => seg(P(q.u, q.v, z0), P(q.u, q.v, z0 - depth))).join(""),
    y0: Math.min(...ringAt(P, f, z0).map((p) => p[1])),
    y1: Math.max(...lowP.map((p) => p[1])) + 2,
  };
}


// Upstream: packages/hairline/src/core/motion.ts
/**
 * Hairline — the two clocks, with no DOM. A discrete change (which card) gets
 * a long ease-out on a tween; a continuous input (where the pointer is) gets
 * a spring, because its target moves every frame and a timed ease would
 * always be chasing it. Both from the study (design/lab-hairline/cartilha-v2.html).
 *
 * Reduced motion is one flag here rather than a `matchMedia` call, so this
 * file stays pure and a test can flip it. The stage (components/hairline/
 * stage.ts) owns the only media query and writes the flag through
 * `setReducedMotion` before any figure ticks; figures read it with
 * `reducedMotion()`. With it on, springs and tweens land on their target in
 * one step.
 */

let reduced = false;
const setReducedMotion = (on         ) => { reduced = on; };
const reducedMotion = () => reduced;




/** A spring at rest on x. k 100 · c 18 · m 1 unless told otherwise; `eps` is when it counts as settled. */
function spring(x        , o                = {})         {
  return { x, v: 0, t: x, k: o.k ?? 100, c: o.c ?? 18, m: o.m ?? 1, eps: o.eps ?? 0.01 };
}

/**
 * Advances a spring by dt seconds toward `sp.t`, substepped at 240 Hz so a
 * long frame can't make it overshoot. Returns whether it is still moving.
 */
function stepS(sp        , dt        )          {
  if (reduced) { sp.x = sp.t; sp.v = 0; return false; }
  const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
  for (let i = 0; i < n; i++) {
    const a = (-sp.k * (sp.x - sp.t) - sp.c * sp.v) / sp.m;
    sp.v += a * h; sp.x += sp.v * h;
  }
  if (Math.abs(sp.x - sp.t) < sp.eps && Math.abs(sp.v) < sp.eps * 10) { sp.x = sp.t; sp.v = 0; return false; }
  return true;
}

/** A CSS cubic-bezier as a function of progress: Newton first, bisection if it strays. */
function bezier(x1        , y1        , x2        , y2        )                        {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (u        ) => ((ax * u + bx) * u + cx) * u;
  const Y = (u        ) => ((ay * u + by) * u + cy) * u;
  const dX = (u        ) => (3 * ax * u + 2 * bx) * u + cx;
  return (t) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 8; i++) {
      const e = X(u) - t;
      if (Math.abs(e) < 1e-5) break;
      const d = dX(u);
      if (Math.abs(d) < 1e-6) break;
      u -= e / d;
    }
    if (!(u >= 0 && u <= 1) || Math.abs(X(u) - t) > 1e-4) {
      let lo = 0, hi = 1;
      u = t;
      for (let i = 0; i < 24; i++) { if (X(u) < t) lo = u; else hi = u; u = (lo + hi) / 2; }
    }
    return Y(u);
  };
}

/** Linear's lift curve, 700ms (.32, .72, 0, 1): the discrete clock. */
const EASE_LIFT = bezier(0.32, 0.72, 0, 1);

/**
 * A tween on EASE_LIFT. `t0` is when it starts (it may be in the future: that
 * is how a stagger delays it), `dur` how long it runs, in ms of `now`.
 */

const tween = (v        , dur = 700)        => ({ from: v, to: v, t0: -1e9, dur });
/** Where the tween is at `now`. */
const tval = (tw       , now        ) => {
  const p = clamp((now - tw.t0) / tw.dur, 0, 1);
  return tw.from + (tw.to - tw.from) * (reduced ? 1 : EASE_LIFT(p));
};
/** Retargets from wherever it is now, starting after `delay` ms. A no-op if the target is unchanged. */
const tset = (tw       , to        , now        , delay        ) => {
  if (tw.to === to) return;
  tw.from = tval(tw, now); tw.to = to; tw.t0 = now + delay;
};
const tdone = (tw       , now        ) => reduced || now >= tw.t0 + tw.dur;


// Upstream: packages/hairline/src/core/stage.ts
/**
 * Hairline — the DOM side every figure shares: making svg nodes, the helpers
 * that write a solid or a dot into them, one frame loop for all six figures,
 * the pointer, and the only reduced-motion query.
 *
 * Everything comes apart. A page navigates away and back, and React's
 * StrictMode mounts twice. So `register` hands back an unregister, `pointer`
 * a disposer, and `disposer()` collects them so a figure's `destroy` is one
 * call. Once the last figure is unregistered no frame, observer or media
 * listener is left behind, and the next `register` starts them again.
 *
 * Nothing here touches `window` at import: the module is evaluated during
 * a server render too, so the loop, the observer and the media query are
 * created by the first `register`.
 */

/* ---------- the contract ---------- */

/** Where an engine writes its caption. Only `textContent` is ever touched, so it need not be an element. */





/* ---------- svg ---------- */

const NS = "http://www.w3.org/2000/svg";


/** One svg element, with its attributes, appended to `parent` when there is one. */
function mk                                      (tag   , attrs               , parent                 )                          {
  const e = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  if (parent) parent.appendChild(e);
  return e;
}

/** A solid's two paths in one group: the silhouette (`.sil`) and its crease (`.nf.lo`). */

function solid(parent         )        {
  const g = mk("g", {}, parent);
  return { g, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) };
}
/** Writes a prism's paths into a solid. */
const put = (el       , s            ) => { el.sil.setAttribute("d", s.sil); el.cr.setAttribute("d", s.crease); };

/** A dot lying flat on a horizontal plane: an ellipse squashed by the camera. Position it with `place`. */
const flatDot = (parent         , C        , r        , cls        ) =>
  mk("ellipse", { rx: r2(r * C.S), ry: r2(r * C.S * C.k), class: cls }, parent);
const place = (el            , q      ) => { el.setAttribute("cx", String(r2(q[0]))); el.setAttribute("cy", String(r2(q[1]))); };

/** A vertical fade, as a mask, for reflections. Returns the `url(#…)` to put in a `mask` attribute. */
let fid = 0;
function fade(svg               , y0        , y1        , a0 = 0.7)         {
  const id = "hl-fd" + ++fid, defs = mk("defs", {}, svg);
  const lg = mk("linearGradient", { id: id + "g", gradientUnits: "userSpaceOnUse", x1: 0, y1: r2(y0), x2: 0, y2: r2(y1) }, defs);
  mk("stop", { offset: 0, "stop-color": "#fff", "stop-opacity": a0 }, lg);
  mk("stop", { offset: 1, "stop-color": "#fff", "stop-opacity": 0 }, lg);
  const m = mk("mask", { id, maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 400, height: 320 }, defs);
  mk("rect", { x: 0, y: 0, width: 400, height: 320, fill: `url(#${id}g)` }, m);
  return `url(#${id})`;
}

/** A prism's mirror under its floor: the far edge of the reflection and its two sides, fading out. */
function reflect(
  svg               , parent         , P           , front                        ,
  ring                   , z0        , depth        ,
) {
  const r = ghost(P, front, ring, z0, depth);
  const gh = mk("g", { class: "ghost", mask: fade(svg, r.y0, r.y1) }, parent);
  mk("path", { d: r.d }, gh);
}

/* ---------- one loop, asleep offscreen ---------- */

/** A figure's frame: dt in seconds (capped at 50ms), now in ms. Returns whether it wants another frame. */









let boards          = [];
/** The boards on each stage: a figure's engine and, under play, its tour share one stage. */
const byStage = new Map                     ();
let raf = 0, last = 0;
let io                              = null;
let rm                        = null;

function frame() {
  /* one clock for every figure: rAF's own timestamp can trail performance.now() by seconds in a frame that loaded late, and figures stamp events with performance.now() */
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  let any = false;
  for (const b of boards.slice()) if (b.vis && b.awake) {
    /* a tick that throws, or a handler the tour calls from one, sleeps alone: the error is reported as uncaught and every other board keeps its frames */
    try { b.awake = !!b.tick(dt, now); } catch (err) { b.awake = false; setTimeout(() => { throw err; }); }
    any = any || b.awake;
  }
  raf = any ? requestAnimationFrame(frame) : 0;
}

function wake(b       ) {
  b.awake = true;
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
}

const onMotion = () => { setReducedMotion(!!rm?.matches); boards.forEach(wake); };

/** The observer and the media query exist while at least one figure is registered. */
function start() {
  if (io) return;
  io = new IntersectionObserver((es) => {
    for (const e of es) {
      const set = byStage.get(e.target);
      if (!set) continue;
      for (const b of set) {
        b.vis = e.isIntersecting;
        if (b.vis) wake(b);
      }
    }
  }, { rootMargin: "80px" });
  rm = matchMedia("(prefers-reduced-motion: reduce)");
  setReducedMotion(rm.matches);
  rm.addEventListener("change", onMotion);
}

function stop() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
  io?.disconnect(); io = null;
  rm?.removeEventListener("change", onMotion); rm = null;
}

/**
 * Joins the shared loop. The tick runs once now, so the figure is drawn
 * before it is ever on screen, then on every frame while its stage is within
 * 80px of the viewport and it keeps returning true. Offscreen it sleeps.
 */
function register(stage         , tick      )       {
  start();
  const b        = { stage, tick, vis: false, awake: true };
  boards.push(b);
  const peers = byStage.get(stage);
  if (peers) {
    /* a stage already watched: the new board takes its peers' visibility, since the observer will not speak again until it changes */
    for (const p of peers) b.vis = p.vis;
    peers.add(b);
    if (b.vis) wake(b);
  } else {
    byStage.set(stage, new Set([b]));
    io .observe(stage);
  }
  tick(0, performance.now());
  let gone = false;
  return {
    wake: () => { if (!gone) wake(b); },
    unregister: () => {
      if (gone) return;
      gone = true;
      boards = boards.filter((x) => x !== b);
      const set = byStage.get(stage);
      if (set) {
        set.delete(b);
        if (!set.size) {
          byStage.delete(stage);
          io?.unobserve(stage);
        }
      }
      if (!boards.length) stop();
    },
  };
}

/* ---------- pointer ---------- */









/** The handlers each stage's pointer() was given, so a tour can drive them. */
const handlers = new WeakMap                          ();
/** The tour on each stage, told when a real pointer arrives and leaves. */
const touring = new WeakMap                                            ();

/**
 * Pointer input in viewBox units. A mouse leaving acts at once; a finger
 * lifting holds the pose for 1.4s first, so a tap reads as a look rather than
 * a flash. Touch releases its capture on press, so dragging across the stage
 * keeps sending moves. Returns the disposer.
 */
function pointer(stage             , on                 )             {
  handlers.set(stage, on);
  let tm = 0;
  const pt = (e              )       => {
    const r = stage.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * 400, ((e.clientY - r.top) / r.height) * 320];
  };
  /* a real pointer holds the stage's tour before the figure hears it, and frees it after the figure hears the leave */
  const move = (e              ) => { clearTimeout(tm); touring.get(stage)?.hold(); on.move(pt(e), e); };
  const down = (e              ) => {
    clearTimeout(tm);
    touring.get(stage)?.hold();
    if (e.pointerType !== "mouse") stage.releasePointerCapture?.(e.pointerId);
    if (on.down) on.down(pt(e), e); else on.move(pt(e), e);
  };
  const leave = (e              ) => {
    clearTimeout(tm);
    tm = window.setTimeout(() => { on.leave(e); touring.get(stage)?.release(); }, e.pointerType === "mouse" ? 0 : 1400);
  };
  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerdown", down);
  stage.addEventListener("pointerleave", leave);
  return () => {
    clearTimeout(tm);
    if (handlers.get(stage) === on) handlers.delete(stage);
    stage.removeEventListener("pointermove", move);
    stage.removeEventListener("pointerdown", down);
    stage.removeEventListener("pointerleave", leave);
  };
}

/* ───── the tour: an unseen pointer that walks a figure's stops ───── */

/** Where an unseen pointer stops: a viewBox point, or null to leave the stage. */


/** The default stops: a diamond around the centre, left, up, right, down, then a leave. */
const LAP       = [[128, 150], [200, 118], [272, 150], [200, 206], null];

const TRAVEL = 900, DWELL = 1200, REST = 1800, RESUME = 1200, STAGGER = 450;
const GHOST = { pointerType: "ghost" }                ;
/** How many tours have started on the page: the stagger that keeps a page of them out of step. */
let started = 0;

/** Where a pointer heading for `p` first touches the viewBox: the ray from the centre through `p` meets the edge. */
function entry([x, y]      )       {
  const dx = x - 200, dy = y - 160;
  if (!dx && !dy) return [200, 320];
  const k = Math.min(dx ? (dx > 0 ? 200 : -200) / dx : Infinity, dy ? (dy > 0 ? 160 : -160) / dy : Infinity);
  return [200 + dx * k, 160 + dy * k];
}

/**
 * Walks `stops` on the figure under `stage`, calling the handlers its pointer()
 * was given as a hand would: in from the edge, TRAVEL to each stop on EASE_LIFT,
 * DWELL there, leave(GHOST) at a null stop and REST, then round again. A real
 * pointer or focus on the stage holds it; when they go it waits RESUME and
 * starts from the first stop. It is a board in the one loop: it sleeps offscreen
 * and leaves under reduced motion. onStop(i) is called on arriving at stop i,
 * or on leaving for a null stop i. A figure never calls this; the bench and the
 * package do.
 */
function tour(stage             , stops      , onStop                          )             {
  let i = 0;                                            // the stop the ghost is heading to
  let wait = RESUME + STAGGER * (started++ % 4);        // ms before the next travel begins
  let t = -1;                                           // ms into the travel; -1 before it begins
  let at              = null;                           // where the ghost is; null when off the stage
  let origin       = [200, 320];                        // where the current travel began
  let hand = false, keys = stage.contains(stage.ownerDocument.activeElement);
  let gone = false;

  const leave = () => { at = null; t = -1; handlers.get(stage)?.leave(GHOST); };
  const tick       = (dt) => {
    if (hand || keys || !stops.length) return false;
    if (reducedMotion()) { if (at) leave(); return false; }
    if (wait > 0) { wait -= dt * 1000; return true; }
    const stop = stops[i];
    if (stop === null) {
      if (at) leave();
      onStop?.(i);
      i = (i + 1) % stops.length;
      wait = REST;
      return true;
    }
    const h = handlers.get(stage);
    if (!h) return true;                                // the figure has not called pointer() yet, or has let it go
    if (t < 0) { origin = at ?? entry(stop); t = 0; }
    t = Math.min(TRAVEL, t + dt * 1000);
    const k = EASE_LIFT(t / TRAVEL);
    at = [origin[0] + (stop[0] - origin[0]) * k, origin[1] + (stop[1] - origin[1]) * k];
    h.move(at, GHOST);
    if (t < TRAVEL) return true;
    onStop?.(i);
    i = (i + 1) % stops.length;
    t = -1;
    wait = DWELL;
    return true;
  };

  /* a hand or the keyboard owns the handlers: the ghost drops where it was and says nothing until both are gone */
  const take = () => { at = null; t = -1; };
  const give = () => { if (hand || keys) return; i = 0; t = -1; wait = RESUME; board.wake(); };
  const me = {
    hold: () => { hand = true; take(); },
    release: () => { if (!hand) return; hand = false; give(); },
  };
  const focusIn = () => { keys = true; take(); };
  const focusOut = (e            ) => { if (keys && !stage.contains(e.relatedTarget               )) { keys = false; give(); } };
  stage.addEventListener("focusin", focusIn);
  stage.addEventListener("focusout", focusOut);
  touring.set(stage, me);
  const board = register(stage, tick);

  return {
    stop: () => {
      if (gone) return;
      gone = true;
      board.unregister();
      stage.removeEventListener("focusin", focusIn);
      stage.removeEventListener("focusout", focusOut);
      if (touring.get(stage) === me) touring.delete(stage);
      if (at) leave();
    },
  };
}

/* ---------- tear-down ---------- */










/**
 * Collects a figure's tear-down, so its `destroy` can be `bag.dispose`:
 *
 *   const bag = disposer();
 *   const B = register(stage, tick); bag.add(B.unregister);
 *   bag.add(pointer(stage, { move, leave }));
 *   bag.on(stage, "keydown", onKey);
 *   bag.add(() => svg.replaceChildren());
 *   return { set, destroy: bag.dispose };
 */
function disposer()           {
  let fns                    = [];
  return {
    add: (fn) => { fns.push(fn); },
    on: (target, type, fn, opts) => {
      const h = fn                 ;
      target.addEventListener(type, h, opts);
      fns.push(() => target.removeEventListener(type, h, opts));
    },
    dispose: () => {
      const run = fns;
      fns = [];
      for (let i = run.length - 1; i >= 0; i--) run[i]();
    },
  };
}


// Upstream: packages/hairline/src/slab.ts
/**
 * Slabs: the tiles, plates and frames of the graph figures, drawn whole. Not
 * in src/core, so the skill's kernel and the pages it wrote stay as they are.
 */

/**
 * A prism whose lid is drawn whole. The silhouette carries the lid's front
 * edge, so the lid reads as a face on its band, and the crease is the inset
 * ring all round, a lip.
 */
function slab(
  P           ,
  front                        ,
  ring                   ,
  inner                                      ,
  z0        ,
  z1        ,
)             {
  return {
    sil: poly(hull(ringAt(P, ring, z1).concat(ringAt(P, ring, z0)))) + open(ringAt(P, run(ring, front), z1)),
    crease: inner ? poly(ringAt(P, inner, z1)) : "",
  };
}

/**
 * A ring set d inside another, the gap measured on the screen, so it reads even all the way round, corners
 * included. Concentric in plan is not enough: the 2:1 view squeezes the top and bottom corners, which pinches
 * the gap there, and stretches the side corners, which opens it. So each sample goes to the view plane with
 * its normal, moves d + m in, and stays only if it is that far inside every tangent; then it grows back m, and
 * where the cut took a corner out the ring turns round it at radius m. Then back to plan, to ride any height.
 */
function inset(C        , ring                   , d        , m = 1)       {
  const c = Math.cos(C.az), s = Math.sin(C.az), k = C.k, e = d + m, out       = [];
  const put = (x        , y        , a        , b        ) => {
    const nu = c * a + k * s * b, nv = k * c * b - s * a, l = Math.hypot(nu, nv);
    out.push({ u: x * c + (y / k) * s, v: (y / k) * c - x * s, nu: nu / l, nv: nv / l });
  };
  // the view plane: the normal goes by the inverse transpose, so it stays square to the edge as drawn
  const v = ring.map((q) => {
    const a = q.nu * c - q.nv * s, b = (q.nu * s + q.nv * c) / k, l = Math.hypot(a, b);
    return [q.u * c - q.v * s, (q.u * s + q.v * c) * k, a / l, b / l];
  });
  const w = v
    .map(([x, y, a, b]) => [x - e * a, y - e * b, a, b])
    .filter(([x, y]) => v.every(([X, Y, a, b]) => (x - X) * a + (y - Y) * b < 1e-6 - e));
  w.forEach(([x, y, a, b], i) => {
    const [X, Y, A, B] = w[(i + 1) % w.length], t = Math.atan2(a * B - b * A, a * A + b * B);
    put(x + m * a, y + m * b, a, b);
    if (Math.abs(t) < 0.1) return;
    // the two edges meet at (px, py): round it
    const h = x * a + y * b, H = X * A + Y * B, D = a * B - b * A, px = (h * B - H * b) / D, py = (a * H - A * h) / D;
    for (let j = 0, n = Math.ceil(Math.abs(t) / 0.2); j <= n; j++) {
      const r = Math.atan2(b, a) + (t * j) / n, ca = Math.cos(r), sa = Math.sin(r);
      put(px + m * ca, py + m * sa, ca, sa);
    }
  });
  return out;
}

/** A rounded footprint and its lip, inset by b, sampled finely enough for a large tile: eight samples per corner. */
const lid = (x0        , y0        , x1        , y1        , r        , b        )               => [
  rrect(x0, y0, x1, y1, r, 8),
  rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(0.3, r - b), 8),
];


// Upstream: packages/hairline/src/figures/settle.ts
/**
 * Settle: a hub plate on a faint floor grid and twelve thin tiles lying
 * scattered and crooked around it, no links. The nearer the pointer comes to
 * the hub, the more the map resolves: each tile slides and turns into its
 * place in a pinwheel tree on its own spring, the inner ones first, and a
 * dashed link draws in from the hub once both its ends are seated. Pointer far
 * away: they drift back to the heap. The hub takes the bright stroke. The
 * slider is the reach, in world units: how far from the hub the map starts to
 * resolve.
 *
 * The pattern: a field, read as a count. The pointer sets a distance on the
 * ground plane (which never moves); each tile has its own threshold on it.
 */

const TH = 3.2, HALF = 9, HUB = 17, HUBT = 6.5, GRID = 22, GN = 0, GR = 86;
// [settled x, y, parent (-1 hub), scattered x, y, angle, z]
const T             = [
  [50, 0, -1, 51, -19, 14, 0], [88, 0, 0, 93, 23, -22, 0], [50, 34, 0, 58, 50, 26, 0],
  [0, 50, -1, -21, 59, -16, 0], [0, 88, 3, 20, 84, 28, 0], [-34, 50, 3, -59, 64, -20, 0],
  [-50, 0, -1, -67, -20, -12, 0], [-88, 0, 6, -91, 26, 20, 0], [-50, -34, 6, -47, -57, -28, 0],
  [0, -50, -1, 22, -46, 18, 0], [0, -88, 9, -15, -95, -14, 0], [34, -50, 9, 62, -60, 22, 0],
];







/** A rounded square of half-side h about (cx, cy), turned by a degrees: a ring whose samples carry their normals round with it. */
function turned(cx        , cy        , h        , r        , a        )       {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  return rrect(-h, -h, h, h, r, 8).map((q) => ({
    u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c,
  }));
}

const mount              = ({ stage, svg, read }, value) => {
  const bag = disposer();
  let reach = value, q = 0;

  const C = Cam(45, 0.5, 1.9);
  const pts         = [[0, 0, HUBT], [GR, 0, 0], [-GR, 0, 0], [0, GR, 0], [0, -GR, 0]];
  for (const t of T) for (const [x, y] of [[t[0], t[1]], [t[3], t[4]]]          ) pts.push([x - 11, y - 11, 0], [x + 11, y + 11, 0], [x + 11, y - 11, 0], [x - 11, y + 11, 0]);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  // the floor: a faint grid, lying flat, under everything
  let d = "";
  for (let k = -GN; k <= GN; k++) {
    const e = Math.sqrt(GR * GR - (k * GRID) ** 2);
    d += seg(P(k * GRID, -e, 0), P(k * GRID, e, 0)) + seg(P(-e, k * GRID, 0), P(e, k * GRID, 0));
  }
  if (GN > 0) mk("path", { d, class: "nf lo" }, g);

  // links are guides on the floor: painted before every plate they join
  const links         = T.map((t, i) => {
    const a       = t[2] < 0 ? [0, 0] : [T[t[2]][0], T[t[2]][1]], b       = [t[0], t[1]];
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]), u = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const ha = t[2] < 0 ? HUB : HALF, from       = [a[0] + u[0] * (ha + 2), a[1] + u[1] * (ha + 2)], to       = [b[0] - u[0] * (HALF + 2), b[1] - u[1] * (HALF + 2)];
    return { i, from, to, tw: tween(0), p: parent(i), el: mk("path", { class: "nf" }, g), drawn: NaN };
  });
  function parent(i        ) { return T[i][2]; }

  // the hub: a thick slab with a recessed square set into its lid
  const hub = mk("g", {}, g);
  const hr = rrect(-HUB, -HUB, HUB, HUB, 7, 8);
  const hs = solid(hub);
  put(hs, slab(P, front, hr, inset(C, hr, 1.3), 0, HUBT));
  hs.sil.classList.add("hi");
  mk("path", { d: poly(ringAt(P, inset(C, hr, 2.8), HUBT)), class: "nf lo" }, hub);

  const tiles         = T.map((t, i) => ({
    i, t, el: solid(mk("g", {}, g)),
    // the inner tiles seat first and a little more briskly; the outer ones follow, out of step
    th: [0.05, 0.3, 0.4][i % 3],
    sp: spring(0, { k: i % 3 === 0 ? 120 : 90 - (i % 3) * 8, c: i % 3 === 0 ? 14 : 12, eps: 0.002 }),
    key: "", ord: 0, k: 0,
    // arrival and return keep their own springs: the return is softer, near-critical, no bounce
    rise: { k: i % 3 === 0 ? 120 : 90 - (i % 3) * 8, c: i % 3 === 0 ? 14 : 12 },
    fall: { k: [38, 44, 50][i % 3], c: 2 * Math.sqrt([38, 44, 50][i % 3]) },
    // outermost let go first: the leaves, then the middles, then the stems
    lag: [0.3, 0.2, 0.12][i % 3] * 1000,
    want: 0, wait: 0, falling: false,
  }));

    function pose(tl      ) {
    const s = tl.sp.x, [sx, sy, , x0, y0, a0, z0] = tl.t;
    const w = clamp(s, 0, 1), hop = 6.5 * w * (1 - w) * 4 / 4;
    const x = lerp(x0, sx, s), y = lerp(y0, sy, s), a = lerp(a0, 0, s), z = Math.max(0, lerp(z0, 0, w) + hop);
    return { x, y, a, z };
  }
  function drawTile(tl      ) {
    const p = pose(tl), key = [p.x, p.y, p.a, p.z].map((v) => v.toFixed(2)).join();
    tl.k = p.x + p.y + 6 * p.z;
    if (key === tl.key) return;
    tl.key = key;
    const r = turned(p.x, p.y, HALF, 3.6, p.a);
    put(tl.el, slab(P, front, r, inset(C, r, 1), p.z, p.z + TH));
  }

  let order = "";
  function paintOrder() {
    const list = tiles.slice().sort((a, b) => a.k - b.k);
    const hubAt = list.findIndex((t) => t.k > 0), arr = list.slice();
    // the hub sits at x + y = 0; tiles are painted around it
    const seq                                = hubAt < 0 ? arr.map((t) => t.el.g).concat(hub) : arr.slice(0, hubAt).map((t) => t.el.g).concat(hub, arr.slice(hubAt).map((t) => t.el.g));
    const id = seq.map((e) => (e === hub ? "h" : tiles.findIndex((t) => t.el.g === e))).join();
    if (id === order) return;
    order = id;
    for (const e of seq) g.appendChild(e);
  }

  function drawLink(l      , now        ) {
    const A = l.p < 0 ? null : tiles[l.p], B2 = tiles[l.i];
    const a = A ? A.sp.x : 1, b = B2.sp.x;
    // it draws in only once both ends are seated, and draws back out as soon as either is asked to leave
    const want = Math.min(a, b) > 0.96 && B2.want >= 1 && (!A || A.want >= 1) ? 1 : 0;
    if (l.tw.to !== want) { tset(l.tw, want, now, 0); l.tw.dur = want ? 700 : 900; }
    const u = tval(l.tw, now);
    if (u === l.drawn) return;
    l.drawn = u;
    // real dashes along the link in screen space, as many as the draw-in has reached
    const pa = P(l.from[0], l.from[1], 0), pb = P(l.to[0], l.to[1], 0), k = Math.max(2, Math.round(Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) / 9));
    let dd = "";
    for (let j = 0; j < k; j++) {
      const f0 = (j + 0.1) / k, f1 = Math.min((j + 0.6) / k, u);
      if (f1 > f0) dd += seg([lerp(pa[0], pb[0], f0), lerp(pa[1], pb[1], f0)], [lerp(pa[0], pb[0], f1), lerp(pa[1], pb[1], f1)]);
    }
    l.el.setAttribute("d", dd);
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const tl of tiles) {
      if (tl.wait > 0) { tl.wait -= dt * 1000; m = true; if (tl.wait <= 0) tl.sp.t = tl.want; }
      if (stepS(tl.sp, dt)) m = true;
      drawTile(tl);
    }
    for (const l of links) { drawLink(l, now); if (!tdone(l.tw, now)) m = true; }
    paintOrder();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let n = 0;
    for (const tl of tiles) {
      const s = clamp((q - tl.th) / 0.22, 0, 1);
      if (s > tl.want) {
        tl.falling = false; tl.wait = 0; tl.want = s; Object.assign(tl.sp, tl.rise); tl.sp.t = s;
      } else if (s < tl.want) {
        if (!tl.falling) { tl.falling = true; tl.wait = reducedMotion() ? 0 : tl.lag; Object.assign(tl.sp, tl.fall); }
        tl.want = s;
        if (tl.wait <= 0) tl.sp.t = s;
      }
      if (s > 0.5) n++;
    }
    read.textContent = q <= 0 ? "rest" : `map ${n}·${tiles.length}`;
    B.wake();
  }

  /** How resolved the map is, 0 at the reach and beyond, 1 at the hub. */
  const resolve = (dd        ) => { const u = clamp((reach - dd) / (reach - 18), 0, 1); return u * u * (3 - 2 * u); };
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); q = resolve(Math.hypot(x, y)); retarget(); },
    leave: () => { q = 0; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  for (const tl of tiles) drawTile(tl);
  paintOrder();
  read.textContent = "rest";

  return { set: (v) => { reach = v; }, destroy: bag.dispose };
};


// Page integration: decorative, pointer-driven, with no autoplay or remote requests.
const hero = document.getElementById('kg-hero-figure');
let headerFigure;
function mountHeaderFigure() {
  if (!hero || headerFigure) return;
  const svg = mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true', focusable: 'false' }, hero);
  const figure = mount({ stage: hero, svg, read: { textContent: '' } }, 120);
  headerFigure = { figure, svg };
}
function destroyHeaderFigure() {
  if (!headerFigure) return;
  headerFigure.figure.destroy();
  headerFigure.svg.remove();
  headerFigure = null;
}
mountHeaderFigure();
window.addEventListener('pagehide', destroyHeaderFigure);
window.addEventListener('pageshow', mountHeaderFigure);
