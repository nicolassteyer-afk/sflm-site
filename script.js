const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const glow = document.querySelector('.cursor-glow');
const magneticItems = document.querySelectorAll('.magnetic');
const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeTrack) {
  marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
});

menuToggle?.addEventListener('click', () => {
  header.classList.toggle('is-open');
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => header.classList.remove('is-open'));
});

window.addEventListener('pointermove', (event) => {
  glow.style.opacity = '1';
  glow.style.transform = `translate(${event.clientX - 110}px, ${event.clientY - 110}px)`;
});

magneticItems.forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.035}px, ${y * 0.035}px)`;
  });

  item.addEventListener('pointerleave', () => {
    item.style.transform = '';
  });
});
