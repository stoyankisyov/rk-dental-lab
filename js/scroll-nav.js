import { qs, qsa, on, prefersReducedMotion } from './dom.js';

function getSections() {
  return qsa('main.page > section').filter(function (s) {
    return Boolean(s.id);
  });
}

function scrollToSection(id) {
  var el = document.getElementById(id);
  if (!el) {
    return;
  }

  var reduced = prefersReducedMotion();

  var rect = el.getBoundingClientRect();
  var y = window.scrollY + rect.top;
  var target = y - window.innerHeight / 2 + rect.height / 2;

  var max = document.documentElement.scrollHeight - window.innerHeight;
  if (target < 0) {
    target = 0;
  }
  if (target > max) {
    target = max;
  }

  window.scrollTo({
    top: target,
    behavior: reduced ? 'auto' : 'smooth',
  });
}

function cleanUrl() {
  history.replaceState(null, '', window.location.pathname + window.location.search);
}

function wireDataTargetLinks() {
  var links = qsa('[data-target]');
  links.forEach(function (a) {
    on(a, 'click', function (e) {
      e.preventDefault();
      var id = a.getAttribute('data-target');
      if (!id) {
        return;
      }
      scrollToSection(id);
      cleanUrl();
    });
  });
}

function buildDots(railDots, sections) {
  railDots.innerHTML = '';

  sections.forEach(function (s, idx) {
    var label = s.getAttribute('data-rail-label') || s.id;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'scrollNav__item';
    btn.setAttribute('data-target', s.id);
    btn.setAttribute('aria-label', label);

    var dot = document.createElement('span');
    dot.className = 'scrollNav__dot';
    dot.setAttribute('aria-hidden', 'true');

    var text = document.createElement('span');
    text.className = 'scrollNav__text';
    text.textContent = label;

    var tip = document.createElement('span');
    tip.className = 'scrollNav__tip';
    tip.textContent = label;
    tip.setAttribute('aria-hidden', 'true');

    btn.appendChild(dot);
    btn.appendChild(text);
    btn.appendChild(tip);

    on(btn, 'click', function () {
      scrollToSection(s.id);
      cleanUrl();
    });

    railDots.appendChild(btn);

    if (idx === 0) {
      btn.classList.add('is-start');
    }
  });
}

function setActiveDot(railDots, sections) {
  var mid = window.innerHeight * 0.5;
  var activeId = null;

  for (var i = 0; i < sections.length; i += 1) {
    var r = sections[i].getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) {
      activeId = sections[i].id;
      break;
    }
  }

  qsa('.scrollNav__item', railDots).forEach(function (it) {
    var isActive = it.getAttribute('data-target') === activeId;
    it.classList.toggle('is-active', isActive);
    it.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

export function initScrollNav() {
  var railDots = qs('#railDots');
  if (!railDots) {
    return;
  }

  var sections = getSections();
  buildDots(railDots, sections);
  wireDataTargetLinks();

  var rafPending = false;
  function onScrollOrResize() {
    if (rafPending) {
      return;
    }
    rafPending = true;
    window.requestAnimationFrame(function () {
      rafPending = false;
      setActiveDot(railDots, sections);
    });
  }

  on(window, 'scroll', onScrollOrResize, { passive: true });
  on(window, 'resize', onScrollOrResize, { passive: true });
  on(window, 'load', onScrollOrResize);

  setActiveDot(railDots, sections);
}
