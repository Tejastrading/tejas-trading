/* Tejas Trading: interaction layer (progressive enhancement) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* header shadow on scroll */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 12); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") document.body.classList.remove("nav-open");
    });
  }

  /* scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* product search filter (products.html) */
  var search = document.getElementById("product-search");
  if (search) {
    var groups = document.querySelectorAll(".prod-group");
    var items = Array.prototype.slice.call(document.querySelectorAll(".prod-item"));
    var empty = document.getElementById("search-empty");
    function runFilter() {
      var q = search.value.trim().toLowerCase();
      var total = 0;
      items.forEach(function (it) {
        var hit = !q || it.textContent.toLowerCase().indexOf(q) > -1;
        it.style.display = hit ? "" : "none";
        if (hit) total++;
      });
      groups.forEach(function (g) {
        var vis = g.querySelectorAll('.prod-item[style=""], .prod-item:not([style])');
        var any = 0;
        g.querySelectorAll(".prod-item").forEach(function (i) { if (i.style.display !== "none") any++; });
        g.style.display = any ? "" : "none";
      });
      if (empty) { empty.hidden = total > 0; }
    }
    search.addEventListener("input", runFilter);
    document.getElementById("search-clear") && document.getElementById("search-clear").addEventListener("click", function () { search.value = ""; runFilter(); search.focus(); });
  }

  /* (enquiry form logic removed: contact is phone/email-first) */

  /* current year */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
