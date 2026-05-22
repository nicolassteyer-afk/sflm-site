const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const cursor = document.querySelector(".cursor-orbit");
const progress = document.querySelector("[data-progress]");
const revealItems = document.querySelectorAll(".reveal");
const magneticItems = document.querySelectorAll(".magnetic");
const tickerTrack = document.querySelector(".ticker-track");
const imageFrames = document.querySelectorAll(".image-frame");
const floatAssets = document.querySelectorAll(".float-asset");

if (tickerTrack) {
  tickerTrack.innerHTML += tickerTrack.innerHTML;
}

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  header?.classList.toggle("is-scrolled", window.scrollY > 18);
  if (progress) progress.style.transform = `scaleX(${ratio})`;

  floatAssets.forEach((asset, index) => {
    const speed = index % 2 === 0 ? 0.08 : -0.05;
    asset.style.translate = `0 ${window.scrollY * speed}px`;
  });
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

menuToggle?.addEventListener("click", () => {
  header?.classList.toggle("is-open");
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => header?.classList.remove("is-open"));
});

window.addEventListener("pointermove", (event) => {
  if (cursor) {
    cursor.style.opacity = "1";
    cursor.style.transform = `translate(${event.clientX - 115}px, ${event.clientY - 115}px)`;
  }
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
  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

imageFrames.forEach((slot) => {
  slot.addEventListener("pointermove", (event) => {
    const rect = slot.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    slot.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  slot.addEventListener("pointerleave", () => {
    slot.style.transform = "";
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => observer.observe(item));
