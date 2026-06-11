/* nav.js — Mobile Navigation & Active Link Highlighting */

/**
 * NavController
 * Manages hamburger menu toggle and active nav link state
 * based on the current scroll position.
 */
class NavController {
  /**
   * @param {Object} config
   * @param {string} config.hamburgerSelector  - Button that opens mobile nav
   * @param {string} config.mobileNavSelector  - Mobile nav drawer element
   * @param {string} config.navLinkSelector    - Desktop nav anchor links
   * @param {string} config.mobileLinkSelector - Mobile nav anchor links
   * @param {string} config.sectionSelector    - Scrollable sections to observe
   */
  constructor(config) {
    this.hamburger    = document.querySelector(config.hamburgerSelector);
    this.mobileNav    = document.querySelector(config.mobileNavSelector);
    this.navLinks     = document.querySelectorAll(config.navLinkSelector);
    this.mobileLinks  = document.querySelectorAll(config.mobileLinkSelector);
    this.sections     = document.querySelectorAll(config.sectionSelector);

    this._bindHamburger();
    this._bindMobileLinks();
    this._initSectionObserver();
    this._bindOutsideClick();
    this._bindEscKey();
  }

  /* Private: Hamburger toggle */
  _bindHamburger() {
    if (!this.hamburger) return;

    this.hamburger.addEventListener('click', () => {
      const isOpen = this.mobileNav.classList.toggle('mobile-nav--open');
      this.hamburger.setAttribute('aria-expanded', String(isOpen));
    });
  }

  /* Private: Close drawer when a mobile link is tapped */
  _bindMobileLinks() {
    this.mobileLinks.forEach(link => {
      link.addEventListener('click', () => this._closeDrawer());
    });
  }

  /* Private: Close on outside click */
  _bindOutsideClick() {
    document.addEventListener('click', (e) => {
      if (
        this.mobileNav &&
        this.mobileNav.classList.contains('mobile-nav--open') &&
        !this.mobileNav.contains(e.target) &&
        !this.hamburger.contains(e.target)
      ) {
        this._closeDrawer();
      }
    });
  }

  /* Private: Close on Escape key */
  _bindEscKey() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this._closeDrawer();
    });
  }

  /* Private: Close drawer helper */
  _closeDrawer() {
    if (!this.mobileNav) return;
    this.mobileNav.classList.remove('mobile-nav--open');
    if (this.hamburger) {
      this.hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  /* Private: Highlight active nav link via IntersectionObserver */
  _initSectionObserver() {
    if (!this.sections.length || !this.navLinks.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this._setActiveLink(id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    this.sections.forEach(section => observer.observe(section));
  }

  /* Private: Apply/remove --active modifier on nav links */
  _setActiveLink(activeSectionId) {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href'); // e.g. "#about"
      if (href === `#${activeSectionId}`) {
        link.classList.add('nav__link--active');
      } else {
        link.classList.remove('nav__link--active');
      }
    });
  }
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  new NavController({
    hamburgerSelector:  '.header__hamburger',
    mobileNavSelector:  '.mobile-nav',
    navLinkSelector:    '.header__nav .nav__link',
    mobileLinkSelector: '.mobile-nav__link',
    sectionSelector:    'section[id]',
  });
});