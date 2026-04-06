(function () {
  function formatRub(n) {
    return (
      new Intl.NumberFormat("ru-RU").format(Math.round(Number(n))).replace(/\u00a0/g, " ") + " ₽"
    );
  }

  function updateLineTotal(line) {
    var unit = parseInt(line.getAttribute("data-unit-price"), 10) || 0;
    var qtyEl = line.querySelector("[data-cart-qty]");
    var qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1;
    var priceEl = line.querySelector(".cart-line__price");
    if (priceEl) priceEl.textContent = formatRub(unit * qty);
  }

  function updateGrandTotal(root) {
    var sum = 0;
    root.querySelectorAll(".cart-line[data-unit-price]").forEach(function (line) {
      var unit = parseInt(line.getAttribute("data-unit-price"), 10) || 0;
      var qtyEl = line.querySelector("[data-cart-qty]");
      var qty = qtyEl ? parseInt(qtyEl.textContent, 10) || 0 : 0;
      sum += unit * qty;
    });
    var out = root.querySelector("[data-cart-total]");
    if (out) out.textContent = formatRub(sum);
    updateBadge(root);
  }

  function updateBadge(root) {
    var n = root.querySelectorAll(".cart-line[data-unit-price]").length;
    var badge = document.querySelector(".cart-btn__badge");
    if (badge) badge.textContent = String(n);
  }

  function setMinusState(line) {
    var qtyEl = line.querySelector("[data-cart-qty]");
    var minus = line.querySelector('.fig-stepper__btn[data-step="-1"]');
    if (!qtyEl || !minus) return;
    var q = parseInt(qtyEl.textContent, 10) || 1;
    minus.disabled = q <= 1;
  }

  document.addEventListener("click", function (e) {
    var stepBtn = e.target.closest(".fig-stepper__btn[data-step]");
    if (!stepBtn) return;
    var line = stepBtn.closest(".cart-line");
    if (!line || !line.closest("[data-cart-root]")) return;

    var qtyEl = line.querySelector("[data-cart-qty]");
    if (!qtyEl) return;
    var delta = parseInt(stepBtn.getAttribute("data-step"), 10);
    var q = parseInt(qtyEl.textContent, 10) || 1;
    var next = q + delta;
    if (next < 1) next = 1;
    qtyEl.textContent = String(next);
    setMinusState(line);
    updateLineTotal(line);
    updateGrandTotal(line.closest("[data-cart-root]"));
  });

  document.addEventListener("click", function (e) {
    var removeBtn = e.target.closest(".cart-line__remove");
    if (!removeBtn) return;
    var line = removeBtn.closest(".cart-line");
    var root = line && line.closest("[data-cart-root]");
    if (!line || !root) return;
    line.remove();
    updateGrandTotal(root);
  });

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-cart-root]");
    if (!root) return;
    root.querySelectorAll(".cart-line").forEach(function (line) {
      setMinusState(line);
      updateLineTotal(line);
    });
    updateGrandTotal(root);
  });
})();
