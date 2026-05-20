const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const glow = document.querySelector(".cursor-glow");
const magneticItems = document.querySelectorAll(".magnetic");
const revealItems = document.querySelectorAll(".reveal");
const marqueeTrack = document.querySelector(".marquee-track");

if (marqueeTrack) marqueeTrack.innerHTML += marqueeTrack.innerHTML;

window.addEventListener("scroll", () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
});

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => header?.classList.remove("is-open"));
});

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.opacity = "1";
  glow.style.transform = `translate(${event.clientX - 120}px, ${event.clientY - 120}px)`;
  document.documentElement.style.setProperty("--mx", `${event.clientX / window.innerWidth - 0.5}`);
  document.documentElement.style.setProperty("--my", `${event.clientY / window.innerHeight - 0.5}`);
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    item.style.transform = `translate(${x * 0.035}px, ${y * 0.035}px)`;
  });
  item.addEventListener("pointerleave", () => { item.style.transform = ""; });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));
