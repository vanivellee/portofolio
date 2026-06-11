/* scroll.js — Scroll Reveal Animation Controller */

/**
 * ScrollReveal
 * Uses IntersectionObserver to add a visible modifier class
 * to elements as they enter the viewport.
 * Respects prefers-reduced-motion.
 */
class ScrollReveal {
  /**
   * @param {Object} config
   * @param {string} config.selector    - CSS selector for elements to reveal
   * @param {string} config.visibleClass - Class added when element is visible
   * @param {number} config.threshold   - Intersection ratio to trigger (0–1)
   * @param {string} config.rootMargin  - Observer root margin
   */
  constructor(config = {}) {
    this.selector     = config.selector    || '.reveal';
    this.visibleClass = config.visibleClass || 'reveal--visible';
    this.threshold    = config.threshold   ?? 0.12;
    this.rootMargin   = config.rootMargin  || '0px';

    this._prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    this._init();
  }

  /* Private: Set up observer or skip if reduced motion */
  _init() {
    const elements = document.querySelectorAll(this.selector);
    if (!elements.length) return;

    // If user prefers reduced motion, reveal all immediately
    if (this._prefersReducedMotion) {
      elements.forEach(el => el.classList.add(this.visibleClass));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => this._handleEntries(entries, observer),
      {
        threshold:  this.threshold,
        rootMargin: this.rootMargin,
      }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ── Private: Handle intersection entries ── */
  _handleEntries(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(this.visibleClass);
        // Unobserve after reveal — no need to watch anymore
        observer.unobserve(entry.target);
      }
    });
  }
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  new ScrollReveal({
    selector:     '.reveal',
    visibleClass: 'reveal--visible',
    threshold:    0.1,
  });
});