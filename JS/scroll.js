(() => {
  class ScrollReveal {
    constructor(config = {}) {
      this.selector     = config.selector     || '.reveal';
      this.visibleClass = config.visibleClass || 'reveal--visible';
      this.threshold    = config.threshold    ?? 0.12;
      this.rootMargin   = config.rootMargin   || '0px';

      this._prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      this._init();
    }

    _init() {
      const elements = document.querySelectorAll(this.selector);
      if (!elements.length) return;

      if (this._prefersReducedMotion) {
        elements.forEach(el => el.classList.add(this.visibleClass));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => this._handleEntries(entries, observer),
        { threshold: this.threshold, rootMargin: this.rootMargin }
      );

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add(this.visibleClass);
        } else {
          observer.observe(el);
        }
      });
    }

    _handleEntries(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(this.visibleClass);
          observer.unobserve(entry.target);
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ScrollReveal({
      selector:     '.reveal',
      visibleClass: 'reveal--visible',
      threshold:    0.1,
    });
  });
})();
