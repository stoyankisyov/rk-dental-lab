import { qsa, on, prefersReducedMotion } from './dom.js';

export function initTitleDrift() {
  if (prefersReducedMotion()) {
    return;
  }

  var slideTitles = qsa('.slideTitle');

  function update() {
    var vh = Math.max(1, window.innerHeight);

    slideTitles.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var t = (vh * 0.55 - r.top) / (vh * 0.8);
      t = Math.max(0, Math.min(1, t));

      var k = (t - 0.5) * 2;
      var px = k * 22;

      el.style.setProperty('--sx', px.toFixed(2) + 'px');
    });
  }

  var rafPending = false;
  function schedule() {
    if (rafPending) {
      return;
    }
    rafPending = true;
    window.requestAnimationFrame(function () {
      rafPending = false;
      update();
    });
  }

  on(window, 'scroll', schedule, { passive: true });
  on(window, 'resize', schedule, { passive: true });
  on(window, 'load', update);

  update();
}
