// Progressive enhancement: the site still works without JavaScript.
const root = document.documentElement;
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];

// Appearance: Liquid Glass theme with dark/light mode.
function setMode(theme, save) {
  root.dataset.theme = theme === "light" ? "light" : "dark";
  if (save) try { localStorage.setItem("ur-theme", root.dataset.theme); } catch (e) {}
  const m = $("#modeToggle");
  if (m) { m.setAttribute("aria-pressed", root.dataset.theme === "dark"); m.textContent = root.dataset.theme === "dark" ? "☾ Dark" : "☀ Light"; }
  requestAnimationFrame(() => { const c = $("meta[name=theme-color]"); if (c) c.content = getComputedStyle(document.body).backgroundColor; });
}
setMode(root.dataset.theme || "dark", false);
const modeToggle = $("#modeToggle");
if (modeToggle) modeToggle.onclick = () => setMode(root.dataset.theme === "dark" ? "light" : "dark", true);

// Mobile navigation (+ Escape and tap-outside to close)
const menuToggle = $("#menuToggle"), sidebar = $("#sidebar");
function closeMenu() { sidebar.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); }
if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => menuToggle.setAttribute("aria-expanded", String(sidebar.classList.toggle("open"))));
  $$("a", sidebar).forEach((l) => l.addEventListener("click", closeMenu));
  $("#scrim").addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());
}

// Active section highlight
const sections = $$("main section[id], main[id]"), navLinks = $$(".nav-link");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) navLinks.forEach((l) => {
      const on = l.getAttribute("href") === `#${en.target.id}`;
      l.classList.toggle("active", on); on ? l.setAttribute("aria-current", "true") : l.removeAttribute("aria-current");
    });
  }), { rootMargin: "-25% 0px -60% 0px" });
  sections.forEach((s) => io.observe(s));

  // Scroll reveal
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const rv = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); rv.unobserve(e.target); } }), { threshold: .08 });
    $$(".stat-card, .section-heading, .project-card, .skill-card, .about-panel, .contact-card").forEach((el) => { el.classList.add("reveal"); rv.observe(el); });
  }
}

// Project filter by tool
const chips = $$("[data-filter]"), cards = $$(".project-card");
chips.forEach((c) => c.addEventListener("click", () => {
  chips.forEach((x) => x.setAttribute("aria-pressed", x === c));
  cards.forEach((card) => (card.hidden = c.dataset.filter !== "all" && !card.dataset.tools.split(" ").includes(c.dataset.filter)));
}));

const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
