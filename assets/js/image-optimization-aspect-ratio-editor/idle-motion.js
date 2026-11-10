export function initIdleMotion() {
  const idleScreen = document.getElementById('idle-screen');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let visible = true;
  const sync = () => idleScreen.classList.toggle('motion-paused',reduced.matches || !visible || document.hidden);
  reduced.addEventListener('change',sync);
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(idleScreen);
  sync();
}
