import { qsa, prefersReducedMotion } from './dom.js';

export function initReveal() {
  var reduced = prefersReducedMotion();
  var reveals = qsa('.reveal');

  if (!reduced) {
    var sections = qsa('main.page > section');
    sections.forEach(function (sec) {
      var items = qsa('.reveal', sec);
      var i = 0;
      items.forEach(function (el) {
        el.style.setProperty('--d', String(Math.min(i, 8) * 70) + 'ms');
        i += 1;
      });
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.14, rootMargin: '0px 0px -12% 0px' },
  );

  reveals.forEach(function (el) {
    io.observe(el);
  });
}
