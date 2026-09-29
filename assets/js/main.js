// Auto-update year in copyright footer
const currentYear = new Date().getFullYear();
const yearElement = document.getElementById('copy-year');
yearElement.textContent = currentYear;

// Extras
console.log("Hi there explorer!");
  
// Disable draggable elements
document.querySelectorAll('.honeycomb .item').forEach(el => {
  el.setAttribute('draggable', false);
});

// Thoughts page copy URL button
const shareButton = document.querySelector('.footnotes-share button');
const linkCopied = document.querySelector('.link-copied');

shareButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);

    linkCopied.classList.add('visible');

    setTimeout(() => {
      linkCopied.classList.remove('visible');
    }, 2000);

  } catch (error) {
    console.error('Failed to copy URL:', error);
  }
});