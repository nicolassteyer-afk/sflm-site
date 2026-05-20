const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const hasScrolled = window.scrollY > 12;
  header.style.boxShadow = hasScrolled
    ? "0 12px 34px rgba(23, 33, 27, 0.08)"
    : "none";
});
