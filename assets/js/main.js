// Auto-update year in copyright footer
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('copy-year');
yearElement.textContent = currentYear;

// Disable draggable elements
document.querySelectorAll('.honeycomb .item').forEach(el => {
  el.setAttribute('draggable', false);
});

// Thoughts page copy URL button
document.querySelectorAll('.postfooter-share').forEach(share => {
  const button = share.querySelector('button');
  const status = share.querySelector('.postfooter-share-status');

  if (!button) return;

  let resetTimer;

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      clearTimeout(resetTimer);

      button.classList.add('copied');

      if (status) {
        status.textContent = 'Link copied';
      }

      resetTimer = setTimeout(() => {
        button.classList.remove('copied');

        if (status) {
          status.textContent = '';
        }
      }, 2000);

    } catch (error) {
      console.error('Unable to copy page URL:', error);

      if (status) {
        status.textContent = 'Unable to copy link';
      }
    }
  });
});


// Floating Table of Contents
function initPageIndex() {
  const desktopMenu = document.querySelector('.page-index-desktop');
  const siteFooter = document.querySelector('footer:has(> .footer)');
  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const index = document.querySelector('.page-index');
  const toc = document.querySelector('.toc');
  const mobileMenu = document.querySelector('.page-index-mobile');
  if (!index || !toc || !mobileMenu) return;
  const links = [...index.querySelectorAll('nav a[href^="#"]')];
  const sections = [...toc.querySelectorAll('h2[id], h3[id]')]
    .map(heading => ({ heading, links: links.filter(link => decodeURIComponent(link.hash.slice(1)) === heading.id) }))
    .filter(section => section.links.length);
  if (!sections.length) return;
  const firstHeading = sections[0].heading; let ticking = false;
  function updateIndex() {
    const viewportHeight = window.innerHeight;
    const firstTop = firstHeading.getBoundingClientRect().top;
    const guideBottom = toc.getBoundingClientRect().bottom;
    const threshold = mobileQuery.matches ? viewportHeight : 50;

    const nearFooter = !mobileQuery.matches && desktopMenu && siteFooter
    && siteFooter.getBoundingClientRect().top
    <= desktopMenu.getBoundingClientRect().bottom + 30;

    index.classList.toggle('index-near-footer', Boolean(nearFooter));
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


// Extras
console.log("Hi there explorer!");