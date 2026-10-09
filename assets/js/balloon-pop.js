(() => {
  'use strict';

  const TRIGGER = '.footer-bg-four';

  const HOLD = 180;
  const BURST = 1000;

  const trigger = document.querySelector(TRIGGER);

  if (!trigger) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  let busy = false;

  /* --------------------------------------------------------------- markup */

  const MARKUP = `
<span class="balloon-pop" aria-hidden="true">
  <svg xmlns="http://www.w3.org/2000/svg"
       viewBox="0 0 350 800"
       focusable="false">

    <defs>
      <linearGradient id="bp-g">
        <stop style="stop-color:#b8b8b8;stop-opacity:1" offset="0"/>
        <stop style="stop-color:#b8b8b8;stop-opacity:0" offset="1"/>
      </linearGradient>

      <linearGradient href="#bp-g" id="bp-g1"
        x1="126.26905" y1="162.08865"
        x2="168.94803" y2="210.32345"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-5.0000003,-5.714286)"/>

      <linearGradient href="#bp-g" id="bp-g2"
        x1="126.26906" y1="203.12609"
        x2="160.10918" y2="212.21746"
        gradientUnits="userSpaceOnUse"
        gradientTransform="matrix(0.99872739,-0.05043419,0.05043419,0.99872739,-43.093621,-1.70721)"/>

      <linearGradient href="#bp-g" id="bp-g3"
        x1="130" y1="257.14284"
        x2="172.85715" y2="219.64284"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-20.2857145,-4.2857145)"/>

      <linearGradient href="#bp-g" id="bp-g4"
        x1="199.00005" y1="122.94521"
        x2="174.25133" y2="221.43511"
        gradientUnits="userSpaceOnUse"/>

      <linearGradient href="#bp-g" id="bp-g5"
        x1="236.78572" y1="204.99999"
        x2="185" y2="217.85714"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(17.500001,-1.4285715)"/>

      <linearGradient href="#bp-g" id="bp-g6"
        x1="226.32706" y1="279.60256"
        x2="166.11784" y2="207.10262"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(5.0000003,5.0000003)"/>

      <linearGradient href="#bp-g" id="bp-g7"
        x1="216.07143" y1="174.99996"
        x2="181.78572" y2="212.49996"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(20.714286,-17.500001)"/>

      <linearGradient href="#bp-g" id="bp-g8"
        x1="182.07997" y1="263.1039"
        x2="175.51401" y2="219.66735"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(0,45.000002)"/>
    </defs>

    <g class="bp-tail">
      <path fill="#ff4c4c"
        d="m 188.22808,349.25088 c 0,0 6.93415,19.41771 5.52302,21.82905 -2.42552,4.14475 -29.89939,4.50087 -32.75777,0 -1.84348,-2.90278 5.77555,-21.70278 5.77555,-21.70278 z"/>

      <path fill="#df0008"
        d="m 164.62762,354.98274 c 0,0 3.71409,2.91278 13.18428,2.91278 9.2211,0 12.40237,-2.75719 12.40237,-2.75719 l -2.02888,-6.12908 -21.33948,0.0631 z"/>

      <path fill="none"
        stroke="#ff4c4c"
        stroke-width="6"
        stroke-linecap="round"
        d="m 176.86017,373.73455 c 0,0 1e-5,26.14502 2.02569,82.52025 2.02569,56.37522 10.45301,73.52832 10.12844,138.89548 -0.41785,84.15131 -13.16697,136.44438 -12.15412,201.80696"/>

      <path fill="none"
        stroke="#df0008"
        stroke-width="6"
        stroke-linecap="butt"
        d="m 176.9082,374.23056 0,7.8208"/>

      <path class="bp-rim"
        fill="#ff4c4c"
        d="m 177.05357,350.80354 c 0,0 14.73214,-0.80357 26.42857,-4.55357 11.69643,-3.75 21.25,-8.57143 21.25,-8.57143 -6.53196,-0.37837 -10.72197,-2.30908 -11.16071,-9.55357 -2.65213,2.14357 -5.06586,1.82981 -6.96429,-1.33929 -6.79333,3.02976 -12.65394,3.1328 -16.16071,-5.98214 -9.03699,8.01487 -24.32056,13.0975 -37.71664,2.63261 -0.54175,7.61121 -5.60222,9.83543 -12.0805,7.99688 0.65151,5.56406 -3.45742,8.37219 -10.11358,7.04908 0,0 9.39573,4.50151 21.16892,7.95278 13.68172,4.01073 25.34894,4.36865 25.34894,4.36865 z"/>
    </g>

    <g class="bp-shards">

      <path class="bp-shard" fill="#ff4c4c"
        d="m 238.14347,329.52142 c 0,0 17.27659,-10.40073 32.07233,-31.8198 13.05208,-18.89485 18.52711,-36.22769 23.23351,-54.80077 -10.32183,11.08509 -15.98893,13.62898 -30.93593,8.20748 6.73515,13.42962 3.90184,22.14178 -9.09136,26.39025 4.10813,8.51838 0.53744,14.05538 -8.08121,16.41498 6.2846,8.43215 3.6818,16.86031 -6.9448,18.94035 5.98755,6.25623 4.31344,11.59865 -0.25254,16.66751 z"/>

      <path class="bp-shard" fill="#ff4c4c"
        d="m 295.64031,220.83489 c -0.99143,-2.18021 -3.35559,-4.9993 -5.12507,-6.11127 -1.31002,-0.82324 -3.66116,-1.61036 -5.63559,-1.88669 l -1.43006,-0.20014 0.94566,-1.74597 c 1.2095,-2.23311 1.51306,-5.91493 0.69158,-8.38815 -0.94196,-2.83599 -3.24542,-5.23913 -5.58455,-5.82621 -0.44127,-0.11075 -0.80231,-0.24811 -0.80231,-0.30524 0,-0.0571 0.29887,-0.61043 0.66416,-1.22955 0.93408,-1.58315 1.13977,-4.88392 0.43805,-7.0293 -1.09269,-3.34074 -3.63882,-5.84878 -6.38307,-6.2876 -1.24579,-0.19921 -1.2475,-0.20143 -1.05963,-1.37629 0.37198,-2.32622 -1.48495,-4.71222 -3.66966,-4.71522 l -0.84738,-10e-4 1.23983,-1.91826 c 3.51602,-5.43996 3.09879,-12.82181 -1.02028,-18.05159 l -0.92816,-1.17844 2.49139,-2.31454 c 4.40815,-4.09526 7.13619,-8.49782 8.46078,-13.65411 0.3662,-1.42554 0.79225,-4.6378 0.99942,-7.5352 l 0.36111,-5.05038 1.01831,1.63376 c 1.3266,2.12838 5.58919,10.74807 7.20307,14.56586 5.07127,11.99656 9.2272,29.87031 10.31763,44.37397 0.65351,8.69228 -0.0841,30.13787 -1.21356,35.28532 -0.21034,0.95857 -0.2213,0.94836 -1.13167,-1.0536 z"/>

      <path class="bp-shard" fill="#ff4c4c"
        d="m 247.20159,116.50718 c -0.004,-0.4605 -1.06776,-2.33105 -1.75076,-3.07863 -1.7503,-1.9158 -4.2981,-2.77892 -7.15107,-2.42256 l -1.05741,0.13208 -1.1168,-1.10399 c -2.7433,-2.71183 -6.05796,-3.28189 -9.63968,-1.65786 -1.48608,0.67382 -2.80214,1.62797 -4.45396,3.22915 l -1.48455,1.43904 -0.42404,-1.50889 c -1.56251,-5.55999 -4.46498,-8.52675 -9.23872,-9.44337 -1.29214,-0.24811 -4.57419,-0.28458 -6.07609,-0.0675 -0.55201,0.0798 -1.01993,0.12876 -1.03984,0.10885 -0.0199,-0.0199 -0.15036,-0.58889 -0.28989,-1.26441 -1.24658,-6.03508 -5.56842,-9.13479 -10.6052,-7.60626 -0.40035,0.1215 -0.77406,0.22166 -0.83045,0.22259 -0.0564,9.3e-4 -0.14908,-0.60982 -0.20597,-1.3572 -0.68177,-8.95687 -2.86204,-12.56903 -10.29013,-17.04818 l -0.89364,-0.53886 0.62999,-4e-4 c 1.06519,-6.8e-4 7.6199,0.45324 10.16343,0.70382 8.33398,0.82103 15.87552,2.12285 23.73,4.09627 9.82106,2.46753 16.57695,4.92911 24.33566,8.86696 9.08593,4.61146 17.47982,10.45223 23.97063,16.67964 1.14027,1.09399 3.49027,3.66701 3.41404,3.73802 -0.0284,0.0265 -0.50595,-0.0478 -1.06115,-0.16508 -5.58854,-1.18054 -14.12998,2.43114 -18.21165,7.70064 -0.23156,0.29895 -0.4218,0.45472 -0.42275,0.34616 z"/>

      <path class="bp-shard" fill="#ff4c4c"
        d="m 52.858543,171.70577 c 0,-0.91098 1.29398,-6.98321 2.36241,-11.086 2.33379,-8.96183 6.34822,-19.62574 10.69874,-28.42008 10.82807,-21.88836 30.42094,-38.81113 56.824307,-49.08035 7.54238,-2.9335 15.99679,-5.37346 22.51865,-6.49893 4.28705,-0.73981 4.24766,-0.79869 1.44568,2.16141 -5.0234,5.30688 -6.70337,11.61565 -4.89395,18.3782 l 0.43114,1.61137 -3.15047,-0.1676 c -5.87311,-0.31242 -10.27006,1.21979 -13.89086,4.84059 -3.55858,3.55858 -5.10584,7.92798 -4.88241,13.78775 0.10044,2.63437 0.0515,3.02657 -0.36146,2.89396 -3.8577,-1.23892 -7.71432,-1.48101 -10.48507,-0.65819 -4.73346,1.40569 -7.66614,5.47369 -8.06983,11.19413 l -0.17834,2.52714 -1.277364,-0.65004 c -1.881973,-0.95772 -7.471603,-0.94537 -9.562893,0.0211 -3.21916,1.48776 -5.51526,4.70668 -6.00177,8.41393 l -0.214,1.63066 -1.31218,0 c -5.40911,0 -11.23771,4.66397 -13.24155,10.5957 -0.5495,1.62662 -0.64876,2.51482 -0.55141,4.9344 0.10158,2.52446 0.26211,3.25642 1.11126,5.06682 0.5459,1.16386 1.27727,2.47807 1.62527,2.92049 0.348,0.44241 0.59583,0.83885 0.55073,0.88098 -0.0451,0.0421 -1.0604,-0.11383 -2.25622,-0.34659 -6.16445,-1.19987 -11.20879,0.051 -15.36205,3.80952 -1.09427,0.99026 -1.87636,1.50694 -1.87636,1.23961 z"/>

      <path class="bp-shard" fill="#ff4c4c"
        d="m 53.222893,226.13875 c -1.68767,-10.69858 -2.52371,-20.57638 -2.52652,-29.85068 l -0.001,-4.77585 2.45517,2.49508 c 4.61434,4.68935 9.40616,7.47974 16.44437,9.57593 0.29486,0.0878 0.13907,0.44321 -0.52661,1.20138 -1.73775,1.97919 -2.09205,5.04613 -0.85229,7.3778 l 0.74813,1.40704 -0.80592,0.36721 c -2.6436,1.2045 -4.41757,3.75035 -4.41757,6.33973 0,1.65182 0.86978,3.63116 1.91837,4.36563 0.82119,0.57518 0.92387,0.48644 -1.76306,1.52361 -3.09322,1.19399 -6.31037,3.0483 -8.13527,4.68904 l -1.57067,1.41218 -0.96669,-6.1281 z"/>

      <path class="bp-shard" fill="#ff4c4c"
        d="m 104.36831,322.53559 c -7.544683,-6.03244 -15.608343,-14.12048 -21.590303,-21.65561 -9.36911,-11.80171 -16.64416,-25.90875 -22.2875,-43.21762 -1.76123,-5.40194 -2.67897,-8.63136 -2.50291,-8.80742 0.0735,-0.0735 1.15012,0.12047 2.39245,0.43107 5.39568,1.34901 10.32255,1.90875 16.80314,1.90902 l 4.44142,1.9e-4 -0.73509,1.48249 c -2.8679,5.78379 -0.92281,11.13821 4.65173,12.80523 0.51674,0.15453 0.90778,0.33862 0.86899,0.40909 -1.88643,3.42654 -2.21284,7.21583 -0.85853,9.96682 0.84617,1.71882 2.02335,2.83103 3.95133,3.73323 1.25262,0.58617 1.7462,0.6871 3.76773,0.77039 l 2.32627,0.0958 -0.41994,1.89552 c -0.64233,2.89938 -0.63212,9.60125 0.0182,11.92706 1.6613,5.94173 6.080463,10.15965 12.421183,11.85554 0.56904,0.15219 1.03462,0.33104 1.03462,0.39744 0,0.0664 -0.44542,0.66361 -0.98982,1.32713 -1.30986,1.59647 -2.43736,3.78049 -2.84546,5.51181 -0.70048,2.97164 -0.24336,6.56263 1.19914,9.42023 0.37853,0.74986 0.65706,1.39381 0.61895,1.431 -0.0381,0.0372 -1.05761,-0.72261 -2.26557,-1.68845 z"/>
    </g>

    <g class="bp-head-group">

      <g class="bp-effect">
        <path fill="url(#bp-g1)" d="m 83.928571,106.78568 37.857139,16.07143 33.92858,68.57143 z"/>
        <path fill="url(#bp-g2)" d="m 118.33712,200.29631 -49.999335,-29.45811 -6.846133,15.3871 z"/>
        <path fill="url(#bp-g3)" d="m 146.57143,236.78568 -62.857144,57.5 15.357144,13.21429 z"/>
        <path fill="url(#bp-g4)" d="m 178.10066,192.91316 3.44144,-109.1621 20.12075,2.34155 z"/>
        <path fill="url(#bp-g5)" d="m 230.07143,213.21425 60.35714,-12.49999 -6.78572,12.49999 z"/>
        <path fill="url(#bp-g6)" d="m 198.85714,243.14283 53.21429,45.71429 0.71429,27.49999 z"/>
        <path fill="url(#bp-g7)" d="m 238.71429,159.49997 27.5,-17.5 -6.42857,-6.78571 z"/>
        <path fill="url(#bp-g8)" d="m 175.51401,276.78917 -4.82361,45.30892 10.40482,-0.35713 z"/>
      </g>

      <g class="bp-head">
        <path fill="#ff4c4c"
          d="m 176.78905,350.77618 c 0,0 91.97353,0.15566 117.35208,-109.82667 22.21763,-96.28393 -34.07651,-140.93836 -34.07651,-140.93836 -41.94765,-36.1979 -128.21048,-34.9372 -169.73386,1.32089 0,0 -58.289748,41.06742 -33.5417,143.72987 24.748051,102.66246 119.99999,105.71427 119.99999,105.71427 z"/>

        <path fill="#ffb0b0"
          d="m 174.42213,85.83928 c 0,0 -34.56546,0.77983 -62.08943,20.84508 -44.812346,33.92078 -49.695766,77.43476 -44.340226,114.77644 4.98717,24.77186 9.80916,38.33956 9.80916,38.33956 0,0 2.47452,-58.2234 21.794929,-97.37483 19.528737,-39.57361 48.482547,-61.83575 74.825567,-76.58625 z"/>
      </g>

    </g>
  </svg>
</span>`;

  /* --------------------------------------------------------------- helpers */

  const outExpo = (t) => (
    t === 1 ? 1 : 1 - 2 ** (-5 * t)
  );

  const wait = (ms) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const animate = (duration, draw) =>
    new Promise((resolve) => {
      let start = null;

      const tick = (now) => {
        if (start === null) start = now;

        const t = Math.min(
          (now - start) / duration,
          1
        );

        draw(t);

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(tick);
    });

  const setOrigin = (el, svg, ratio, xPct, yPct) => {
    const box = el.getBoundingClientRect();
    const root = svg.getBoundingClientRect();

    const x =
      (box.left - root.left + box.width * (xPct / 100)) *
      ratio.x;

    const y =
      (box.top - root.top + box.height * (yPct / 100)) *
      ratio.y;

    el.style.transformOrigin = `${x}px ${y}px`;
  };

  const place = (el, x = 0, y = 0, s = 1) => {
    el.style.transform =
      `translate(${x}px, ${y}px) scale(${s})`;
  };

  const positionBalloon = (wrap) => {
    const triggerRect = trigger.getBoundingClientRect();

    wrap.style.left = `${triggerRect.left}px`;
    wrap.style.top = `${triggerRect.top}px`;
    wrap.style.width = `${triggerRect.width}px`;
  };

  const waitForTop = () =>
    new Promise((resolve) => {
      const check = () => {
        if (window.scrollY <= 0) {
          resolve();
          return;
        }

        requestAnimationFrame(check);
      };

      check();
    });

  /* ------------------------------------------------------------------- pop */

  async function pop() {

    document.body.insertAdjacentHTML('beforeend', MARKUP);

    const wrap = document.body.lastElementChild;

    try {

      positionBalloon(wrap);

      const svg = wrap.querySelector('svg');
      const head = svg.querySelector('.bp-head-group');
      const effect = svg.querySelector('.bp-effect');
      const tail = svg.querySelector('.bp-tail');
      const rim = svg.querySelector('.bp-rim');
      const shards = [
        ...svg.querySelectorAll('.bp-shard')
      ];

      await waitForTop();

      const triggerRect = trigger.getBoundingClientRect();

      wrap.style.left = `${triggerRect.left}px`;
      wrap.style.top = '20px';
      wrap.style.width = `${triggerRect.width}px`;

      wrap.classList.add('is-visible');

      /*
       * SVG dimensions now exist in their final on-screen size.
       */
      const view = svg.viewBox.baseVal;
      const size = svg.getBoundingClientRect();

      const ratio = {
        x: view.width / size.width,
        y: view.height / size.height
      };

      setOrigin(effect, svg, ratio, 50, 60);
      setOrigin(rim, svg, ratio, 47, 100);

      shards.forEach((shard) => {
        setOrigin(shard, svg, ratio, 50, 50);
      });

      /*
       * Let the intact balloon appear briefly.
       */
      await wait(HOLD);

      /*
       * Remove the balloon head, exposing the burst pieces.
       */
      head.style.display = 'none';

      /*
       * Animate the explosion.
       *
       * The first part is fast and energetic, while the final part
       * lets the fragments hang in the air and fade away gradually.
       */
      await animate(BURST, (t) => {

        /*
         * A fast initial expansion followed by a long tail.
         */
        const n = outExpo(t);

        /*
         * Keep the fragments larger for longer.
         */
        const scale = 1 - n * 0.28;

        /*
         * The rim contracts quickly instead of remaining fully visible.
         */
        const rimProgress = Math.min(t / 0.35, 1);
        const rimScale = 1 - outExpo(rimProgress) * 0.4;

        place(
          rim,
          0,
          0,
          rimScale
        );

        const flight = [
          { dx: 34, reach: 34, deg: 32 },
          { dx: 36, reach: 36, deg: -6 },
          { dx: 22, reach: 38, deg: -90 },
          { dx: -34, reach: -34, deg: 75 },
          { dx: -36, reach: -36, deg: 0 },
          { dx: -34, reach: -34, deg: -32 }
        ];

        shards.forEach((shard, i) => {
          const f = flight[i];

          const lift =
            Math.sin((f.deg * Math.PI) / 180) *
            n *
            f.reach;

          /*
           * Fade the fragments mostly during the second half.
           */
          const fade =
            t < 0.35
              ? 1
              : 1 - ((t - 0.35) / 0.65);

          shard.style.opacity = String(
            Math.max(0, fade)
          );

          place(
            shard,
            f.dx * n,
            lift,
            scale
          );
        });

        /*
         * The flash expands quickly, then remains faint for a moment.
         */
        const effectProgress = Math.min(t / 0.45, 1);

        place(
          effect,
          0,
          0,
          0.5 + outExpo(effectProgress) * 0.65
        );

        effect.style.opacity = String(
          t < 0.2
            ? 1
            : Math.max(0, 1 - ((t - 0.2) / 0.8))
        );

        /*
         * Let the tail fall slightly before disappearing.
         */
        place(
          tail,
          0,
          n * 30
        );

        tail.style.opacity = String(
          Math.max(0, 1 - t * 1.2)
        );

        /*
         * Keep the SVG itself visible while the individual pieces
         * finish their fade-out.
         */
        svg.style.opacity = '1';
      });

    } finally {
      wrap.remove();
    }
  }

  /* --------------------------------------------------------------- scrolling */

  const goTop = () => {
    if (window.location.hash !== '#top') {
      history.pushState(null, '', '#top');
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  /* ------------------------------------------------------------------ click */

  trigger.addEventListener('click', (event) => {

    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    /*
     * For reduced-motion users, allow the original #top link to work.
     */
    if (reduceMotion.matches) {
      return;
    }

    event.preventDefault();

    if (busy) {
      return;
    }

    busy = true;

    /*
     * Start the scroll immediately.
     *
     * pop() waits independently until scrollY reaches 0 before
     * displaying the balloon.
     */
    goTop();

    pop().finally(() => {
      busy = false;
    });
  });

})();