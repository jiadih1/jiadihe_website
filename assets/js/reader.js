/* In-page PDF preview: renders each page to a canvas with PDF.js, lazily. */
(function () {
  var root = document.querySelector(".reader[data-pdf]");
  if (!root) return;
  var url = root.getAttribute("data-pdf");
  var pagesEl = root.querySelector(".reader-pages");
  var status = root.querySelector(".reader-status");

  function fallback() {
    status.textContent = "Preview unavailable in this browser";
    pagesEl.innerHTML = '<object class="reader-fallback" data="' + url + '" type="application/pdf">' +
      '<p class="reader-error">This browser cannot show the paper inline. <a href="' + url + '" target="_blank" rel="noopener">Open the PDF</a>.</p></object>';
  }
  if (!window.pdfjsLib) { fallback(); return; }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  /* Character maps and standard fonts let PDF.js draw the Chinese text (e.g. the
     Gaokao paper); cdnjs does not host them, jsDelivr does for this version. */
  var assets = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/";
  pdfjsLib.getDocument({ url: url, cMapUrl: assets + "cmaps/", cMapPacked: true, standardFontDataUrl: assets + "standard_fonts/" }).promise.then(function (pdf) {
    var total = pdf.numPages;
    status.textContent = total === 1 ? "1 page" : "Page 1 of " + total;
    /* Pages scroll inside the framed reader, so it is the observer's root. */
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target); } });
    }, { root: pagesEl, rootMargin: "1200px 0px" }) : null;

    /* "Page n of N": the page whose top is nearest the top of the frame. */
    var ticking = false;
    pagesEl.addEventListener("scroll", function () {
      if (ticking || total === 1) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        var top = pagesEl.getBoundingClientRect().top, cur = 1;
        Array.prototype.forEach.call(pagesEl.children, function (h) {
          if (h.getBoundingClientRect().top - top < pagesEl.clientHeight * 0.4) cur = +h.getAttribute("data-page") || cur;
        });
        status.textContent = "Page " + cur + " of " + total;
      });
    }, { passive: true });

    function draw(holder) {
      var n = +holder.getAttribute("data-page");
      pdf.getPage(n).then(function (page) {
        var w = holder.clientWidth || 800;
        var base = page.getViewport({ scale: 1 });
        var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        var vp = page.getViewport({ scale: (w / base.width) * dpr });
        var canvas = document.createElement("canvas");
        canvas.width = Math.floor(vp.width); canvas.height = Math.floor(vp.height);
        canvas.setAttribute("aria-label", "Page " + n);
        holder.insertBefore(canvas, holder.firstChild);
        holder.style.aspectRatio = "";
        page.render({ canvasContext: canvas.getContext("2d"), viewport: vp });
      });
    }

    pdf.getPage(1).then(function (p1) {
      var v = p1.getViewport({ scale: 1 });
      for (var i = 1; i <= pdf.numPages; i++) {
        var holder = document.createElement("div");
        holder.className = "reader-page";
        holder.setAttribute("data-page", i);
        holder.style.aspectRatio = v.width + " / " + v.height;
        holder.innerHTML = '<span class="pg">' + i + " / " + pdf.numPages + "</span>";
        pagesEl.appendChild(holder);
        if (io) io.observe(holder); else draw(holder);
      }
    });
  }).catch(fallback);
})();
