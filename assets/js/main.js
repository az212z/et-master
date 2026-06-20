/* ===== ET MASTER — interactions ===== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* ---- Preloader (always resolves) ---- */
  function hidePreloader() {
    var pl = $("#preloader");
    if (!pl) return;
    pl.classList.add("hide");
    setTimeout(function () { pl.style.display = "none"; }, 650);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1200); // safety fallback

  /* ---- Year ---- */
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Header scrolled state ---- */
  var header = $("#site-header");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 30);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu (full-screen) ---- */
  var burger = $("#burger"), menu = $("#mobile-menu"), close = $("#menu-close");
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    requestAnimationFrame(function () { menu.classList.add("open"); });
    if (burger) burger.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    if (burger) burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    setTimeout(function () { menu.hidden = true; }, 400);
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (close) close.addEventListener("click", closeMenu);
  if (menu) $$("a", menu).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { if (menu && !menu.hidden) closeMenu(); closeLightbox(); }
  });

  /* ---- Scroll reveal (with fallback) ---- */
  var reveals = $$("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    // safety: ensure visible after 2.5s no matter what
    setTimeout(function () { reveals.forEach(function (el) { el.classList.add("in"); }); }, 2500);
  }

  /* ---- Count-up ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
    if (reduce) { el.textContent = target.toFixed(dec); return; }
    var start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(dec);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }
  var counters = $$(".countup");
  if ("IntersectionObserver" in window && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    counters.forEach(function (c) {
      c.textContent = (parseFloat(c.getAttribute("data-target")) || 0)
        .toFixed(parseInt(c.getAttribute("data-decimals") || "0", 10));
    });
  }

  /* ---- Signature dry-age reveal (WAAPI) ---- */
  function playSignature() {
    var stage = $(".hero-stage");
    if (!stage || reduce || !stage.animate) {
      // resolved final state
      var rect = $(".cut-rect"); if (rect) { rect.setAttribute("height", "320"); }
      return;
    }
    var cleaver = $(".cleaver"), cutRect = $(".cut-rect"),
        cutLine = $(".cut-line"), steam = $(".steam"), sheen = $(".sheen");
    var ease = "cubic-bezier(.16,1,.3,1)";
    if (cleaver) {
      cleaver.animate(
        [{ transform: "translateY(0)" }, { transform: "translateY(190px)", offset: .55 }, { transform: "translateY(176px)" }],
        { duration: 1100, delay: 500, easing: "cubic-bezier(.6,0,.4,1)", fill: "forwards" }
      );
    }
    if (cutLine) {
      cutLine.animate([{ opacity: 0 }, { opacity: 1, offset: .5 }, { opacity: 0 }],
        { duration: 700, delay: 1050, easing: ease, fill: "forwards" });
    }
    if (cutRect) {
      cutRect.animate([{ height: "0px" }, { height: "320px" }],
        { duration: 900, delay: 1150, easing: ease, fill: "forwards" });
    }
    if (steam) {
      steam.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: .9, offset: .4 }, { opacity: 0, transform: "translateY(-26px)" }],
        { duration: 2200, delay: 1300, easing: "ease-out", fill: "forwards", iterations: Infinity });
    }
    if (sheen) {
      sheen.animate([{ opacity: 0, transform: "translateX(0)" }, { opacity: .55, offset: .3 }, { opacity: 0, transform: "translateX(86px)" }],
        { duration: 1100, delay: 700, easing: ease, fill: "forwards" });
    }
  }
  window.addEventListener("load", function () { setTimeout(playSignature, 300); });

  /* ---- Hero parallax (pointer + scroll, capped, off touch) ---- */
  if (!reduce && !isTouch) {
    var stageEl = $(".hero-stage"), copyEl = $(".hero-copy"), glow = $(".glow");
    var px = 0, py = 0, sx = 0;
    var hero = $("#hero");
    if (hero) {
      hero.addEventListener("pointermove", function (e) {
        var r = hero.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
    }
    function pLoop() {
      var cap = 12;
      if (stageEl) stageEl.style.transform = "translate(" + (-px * cap) + "px," + (-py * cap + sx) + "px)";
      if (copyEl) copyEl.style.transform = "translate(" + (px * 5) + "px," + (py * 5) + "px)";
      if (glow) glow.style.transform = "translate(" + (-50 + px * 4) + "%, " + (-50 + py * 4) + "%)";
      requestAnimationFrame(pLoop);
    }
    window.addEventListener("scroll", function () {
      sx = Math.min(window.scrollY * 0.06, 40);
    }, { passive: true });
    requestAnimationFrame(pLoop);
  }

  /* ---- Magnetic buttons ---- */
  if (!reduce && !isTouch) {
    $$(".magnetic").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var mx = (e.clientX - r.left - r.width / 2) * 0.25;
        var my = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = "translate(" + mx + "px," + my + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---- Lightbox ---- */
  var lb = $("#lightbox"), lbImg = $("#lb-img"), lbClose = $(".lb-close");
  function openLightbox(src, alt) {
    if (!lb) return;
    lbImg.src = src; lbImg.alt = alt || "صورة من معرض إت ماستر";
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add("show"); });
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lb || lb.hidden) return;
    lb.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(function () { lb.hidden = true; lbImg.src = ""; }, 300);
  }
  $$(".gal-item").forEach(function (g) {
    g.addEventListener("click", function () {
      openLightbox(g.getAttribute("data-src"), g.querySelector("img") ? g.querySelector("img").alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });

  /* ---- Toast ---- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add("show"); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("show");
      setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 4200);
  }

  /* ---- Reservation form -> WhatsApp + localStorage demo ---- */
  var form = $("#reserve-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#r-name"), phone = $("#r-phone");
      var ok = true;
      $$(".err", form).forEach(function (x) { x.textContent = ""; });
      if (!name.value.trim()) { setErr("r-name", "الرجاء كتابة الاسم"); ok = false; }
      var pv = phone.value.replace(/\s/g, "");
      if (!/^0?5\d{8}$/.test(pv)) { setErr("r-phone", "رقم جوال غير صحيح (مثال: 05xxxxxxxx)"); ok = false; }
      if (!ok) { var f = $(".err[data-for]", form); return; }

      var data = {
        name: name.value.trim(),
        phone: pv,
        guests: ($("#r-guests").value || "").trim(),
        time: ($("#r-time").value || "").trim(),
        note: ($("#r-note").value || "").trim(),
        at: new Date().toISOString()
      };
      try {
        var arr = JSON.parse(localStorage.getItem("etmaster_reservations") || "[]");
        arr.push(data); localStorage.setItem("etmaster_reservations", JSON.stringify(arr));
      } catch (err) {}

      var btn = $(".submit-btn", form);
      if (btn) { btn.disabled = true; var sp = btn.querySelector("span"); var old = sp.textContent; sp.textContent = "جارٍ التحويل…"; }

      var msg = "السلام عليكم، أبغى أحجز طاولة في إت ماستر%0A" +
        "الاسم: " + enc(data.name) + "%0A" +
        "الجوال: " + enc(data.phone) + "%0A" +
        (data.guests ? "عدد الأشخاص: " + enc(data.guests) + "%0A" : "") +
        (data.time ? "الوقت المفضّل: " + enc(data.time) + "%0A" : "") +
        (data.note ? "ملاحظات: " + enc(data.note) : "");
      var url = "https://wa.me/966502225533?text=" + msg;

      toast("تم تجهيز حجزك — يفتح واتساب الآن ✓");
      setTimeout(function () {
        window.open(url, "_blank", "noopener");
        if (btn) { btn.disabled = false; btn.querySelector("span").textContent = old; }
        form.reset();
      }, 700);
    });
  }
  function setErr(id, msg) {
    var s = $('.err[data-for="' + id + '"]'); if (s) s.textContent = msg;
  }
  function enc(s) { return encodeURIComponent(s); }

  /* ---- Smooth anchor offset handled by CSS scroll-behavior ---- */
})();
