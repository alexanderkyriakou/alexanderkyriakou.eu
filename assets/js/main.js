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


// Extras
console.log("Hi there explorer!");