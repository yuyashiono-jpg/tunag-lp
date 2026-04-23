/**
 * Tsumugi LP — sample scripts
 *
 * 数字カウントアップアニメーション
 * - 対象: `[data-count-to]` 属性が付与された要素
 * - トリガー: IntersectionObserver でビューポートに 35% 進入した時点
 * - 継続時間: 1.6 秒、easeOutCubic
 * - prefers-reduced-motion: reduce を検出したら即座に最終値を表示
 * - 非JS環境では HTML に書かれた初期値(最終値)をそのまま表示するフォールバック
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // フォーム送信(仮: バリデーションはブラウザ標準に委任)
    var form = document.querySelector('.p-contact__form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var done = form.querySelector('.p-contact__done');
        if (done) done.hidden = false;
      });
    }

    const counters = document.querySelectorAll('[data-count-to]');
    if (counters.length === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      counters.forEach(setFinalValue);
      return;
    }

    counters.forEach(function (el) {
      const decimals = getDecimals(el.dataset.countTo);
      el.textContent = (0).toFixed(decimals);
    });

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  function setFinalValue(el) {
    const target = parseFloat(el.dataset.countTo);
    const decimals = getDecimals(el.dataset.countTo);
    el.textContent = target.toFixed(decimals);
  }

  function animate(el) {
    const target = parseFloat(el.dataset.countTo);
    if (isNaN(target)) return;
    const decimals = getDecimals(el.dataset.countTo);
    const duration = 800;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = target * eased;
      el.textContent = value.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function getDecimals(str) {
    const dotIndex = str.indexOf('.');
    return dotIndex === -1 ? 0 : str.length - dotIndex - 1;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // FAQ アコーディオン
  document.querySelectorAll('.p-faq__question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.p-faq__item');
      var isOpen = item.classList.contains('is-open');
      // 他を全部閉じる
      document.querySelectorAll('.p-faq__item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.p-faq__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
