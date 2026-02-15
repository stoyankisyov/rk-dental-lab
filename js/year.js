import { qs } from './dom.js';

export function initYear() {
  var yearEl = qs('#year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}
