(() => {
  class ModalController {
    constructor(config) {
      this.trigger   = document.querySelector(config.triggerSelector);
      this.overlay   = document.querySelector(config.overlaySelector);
      this.closeBtn  = document.querySelector(config.closeSelector);
      this.openClass = config.openClass || 'modal-overlay--open';
      this._lastFocus = null;
      this._bindEvents();
    }

    _bindEvents() {
      if (!this.trigger || !this.overlay) return;

      this.trigger.addEventListener('click', () => this.open());

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) this.close();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen()) this.close();
      });
    }

    open() {
      this._lastFocus = document.activeElement;
      this.overlay.classList.add(this.openClass);
      document.body.style.overflow = 'hidden';
      const firstFocusable = this.overlay.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) firstFocusable.focus();
    }

    close() {
      this.overlay.classList.remove(this.openClass);
      document.body.style.overflow = '';
      if (this._lastFocus) this._lastFocus.focus();
    }

    isOpen() {
      return this.overlay.classList.contains(this.openClass);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ModalController({
      triggerSelector: '#cv-btn',
      overlaySelector: '#cv-modal',
      closeSelector:   '#cv-modal-close',
      openClass:       'modal-overlay--open',
    });
  });
})();
