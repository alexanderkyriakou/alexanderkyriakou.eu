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