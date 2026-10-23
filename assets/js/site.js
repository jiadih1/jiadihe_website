/* Mobile menu toggle. */
(function () {
  var btn = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  /* Close the mobile menu after picking a link. */
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { btn.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  });
})();

/* Ideas & Research: the theme list works as tabs, one theme visible at a time.
   #theme-03 in the URL (e.g. the "back" link from a paper) opens that theme. */
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".theme-index a[data-theme]"));
  var panels = Array.prototype.slice.call(document.querySelectorAll("section.theme"));
  if (!tabs.length || !panels.length) return;
  document.documentElement.classList.add("js-tabs");
  var list = tabs[0].closest("ol");
  if (list) list.setAttribute("role", "tablist");
  function show(id, focus) {
    var found = false;
    panels.forEach(function (p) { var on = p.id === "theme-" + id; p.classList.toggle("is-active", on); if (on) found = true; });
    if (!found) return show(tabs[0].getAttribute("data-theme"));
    tabs.forEach(function (t) {
      var on = t.getAttribute("data-theme") === id;
      t.setAttribute("role", "tab");
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.setAttribute("aria-controls", "theme-" + t.getAttribute("data-theme"));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      var id = t.getAttribute("data-theme");
      show(id);
      try { history.replaceState(null, "", "#theme-" + id); } catch (err) {}
    });
    t.addEventListener("keydown", function (e) {
      var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      show(next.getAttribute("data-theme"), true);
      try { history.replaceState(null, "", "#theme-" + next.getAttribute("data-theme")); } catch (err) {}
    });
  });
  var m = /^#theme-(\d+)$/.exec(location.hash);
  show(m ? m[1] : tabs[0].getAttribute("data-theme"));
  if (m) window.scrollTo(0, 0);
})();

/* Arriving at a #section link from another page: web fonts load after the
   browser's jump and push the target down, so jump again once they are ready. */
(function () {
  if (!location.hash || !document.fonts || !document.fonts.ready) return;
  var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  document.fonts.ready.then(function () {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  });
})();
