(function () {
  function initFigSelects() {
    document.querySelectorAll("[data-ui-select]").forEach(function (root) {
      var trigger = root.querySelector(".fig-select__trigger");
      var list = root.querySelector(".fig-select__list");
      var valueEl = root.querySelector(".fig-select__value");
      var options = root.querySelectorAll(".fig-select__option");
      if (!trigger || !list) return;

      function open() {
        root.classList.add("fig-select--open");
        trigger.setAttribute("aria-expanded", "true");
      }

      function close() {
        root.classList.remove("fig-select--open");
        trigger.setAttribute("aria-expanded", "false");
      }

      trigger.addEventListener("click", function (e) {
        e.stopPropagation();
        if (root.classList.contains("fig-select--open")) close();
        else open();
      });

      options.forEach(function (opt) {
        opt.addEventListener("click", function () {
          var text = opt.textContent.trim();
          if (valueEl) valueEl.textContent = text;
          options.forEach(function (o) {
            o.removeAttribute("aria-selected");
          });
          opt.setAttribute("aria-selected", "true");
          close();
        });
      });

      document.addEventListener("click", function (e) {
        if (!root.contains(e.target)) close();
      });

      root.addEventListener("keydown", function (e) {
        if (e.key === "Escape") close();
      });
    });
  }

  function initCatalogPriceRange() {
    var range = document.getElementById("catalog-price-range");
    var out = document.getElementById("catalog-price-max-label");
    if (!range || !out) return;

    function formatRub(n) {
      return (
        new Intl.NumberFormat("ru-RU").format(Math.round(Number(n))).replace(/\u00a0/g, " ") +
        " ₽"
      );
    }

    function sync() {
      out.textContent = formatRub(range.value);
      range.setAttribute("aria-valuenow", range.value);
    }

    range.addEventListener("input", sync);
    sync();
  }

  function initFigPagination() {
    var root = document.querySelector("[data-ui-pagination]");
    if (!root) return;

    var pages = root.querySelectorAll(".fig-pagination__page[data-page]");
    var prev = root.querySelector("[data-pagination-prev]");
    var next = root.querySelector("[data-pagination-next]");
    var current = 1;
    var total = 12;

    function setActive(n) {
      current = Math.max(1, Math.min(total, n));
      pages.forEach(function (btn) {
        var p = Number(btn.getAttribute("data-page"), 10);
        btn.classList.toggle("fig-pagination__page--active", p === current);
      });
      if (prev) prev.disabled = current <= 1;
      if (next) next.disabled = current >= total;
    }

    pages.forEach(function (btn) {
      btn.addEventListener("click", function () {
        setActive(Number(btn.getAttribute("data-page"), 10));
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        setActive(current - 1);
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        setActive(current + 1);
      });
    }

    setActive(1);
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFigSelects();
    initCatalogPriceRange();
    initFigPagination();
  });
})();
