(() => {
  class NavController {
    constructor(config) {
      this.hamburger   = document.querySelector(config.hamburgerSelector);
      this.mobileNav   = document.querySelector(config.mobileNavSelector);
      this.navLinks    = document.querySelectorAll(config.navLinkSelector);
      this.mobileLinks = document.querySelectorAll(config.mobileLinkSelector);
      this.sections    = document.querySelectorAll(config.sectionSelector);

      this._bindHamburger();
      this._bindMobileLinks();
      this._initSectionObserver();
      this._bindOutsideClick();
      this._bindEscKey();
    }

    _bindHamburger() {
      if (!this.hamburger) return;
      this.hamburger.addEventListener('click', () => {
        const isOpen = this.mobileNav.classList.toggle('mobile-nav--open');
        this.hamburger.setAttribute('aria-expanded', String(isOpen));
      });
    }

    _bindMobileLinks() {
      this.mobileLinks.forEach(link => {
        link.addEventListener('click', () => this._closeDrawer());
      });
    }

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

    _bindEscKey() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this._closeDrawer();
      });
    }

    _closeDrawer() {
      if (!this.mobileNav) return;
      this.mobileNav.classList.remove('mobile-nav--open');
      if (this.hamburger) this.hamburger.setAttribute('aria-expanded', 'false');
    }

    _initSectionObserver() {
      if (!this.sections.length || !this.navLinks.length) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) this._setActiveLink(entry.target.getAttribute('id'));
          });
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      this.sections.forEach(section => observer.observe(section));
    }

    _setActiveLink(activeSectionId) {
      this.navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('nav__link--active', href === `#${activeSectionId}`);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new NavController({
      hamburgerSelector:  '.header__hamburger',
      mobileNavSelector:  '.mobile-nav',
      navLinkSelector:    '.header__nav .nav__link',
      mobileLinkSelector: '.mobile-nav__link',
      sectionSelector:    'section[id]',
    });
  });
})();
