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
  /* Close the mobile menu after picking an in-page link such as Contact. */
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) { btn.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  });
})();

/* Arriving at /#contact from another page: web fonts load after the browser's
   jump and push the target down, so jump again once they are ready. */
(function () {
  if (!location.hash || !document.fonts || !document.fonts.ready) return;
  var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (!target) return;
  document.fonts.ready.then(function () {
    target.scrollIntoView({ behavior: "auto", block: "start" });
  });
})();
