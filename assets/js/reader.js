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

  pdfjsLib.getDocument(url).promise.then(function (pdf) {
    status.textContent = pdf.numPages + (pdf.numPages === 1 ? " page" : " pages");
    var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); draw(e.target); } });
    }, { rootMargin: "800px 0px" }) : null;

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
