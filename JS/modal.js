/* modal.js — CV Modal Controller */

/**
 * ModalController
 * Handles open / close behaviour for a single modal dialog.
 * Traps focus inside when open; restores it on close.
 */
class ModalController {
  /**
   * @param {Object} config
   * @param {string} config.triggerSelector - Button that opens the modal
   * @param {string} config.overlaySelector - The .modal-overlay element
   * @param {string} config.closeSelector   - The × close button inside modal
   * @param {string} config.openClass       - CSS modifier class for open state
   */
  constructor(config) {
    this.trigger  = document.querySelector(config.triggerSelector);
    this.overlay  = document.querySelector(config.overlaySelector);
    this.closeBtn = document.querySelector(config.closeSelector);
    this.openClass = config.openClass || 'modal-overlay--open';

    this._lastFocus = null;

    this._bindEvents();
  }

  /* Private: Bind all event listeners */
  _bindEvents() {
    if (!this.trigger || !this.overlay) return;

    // Open
    this.trigger.addEventListener('click', () => this.open());

    // Close via × button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close via overlay backdrop click
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) this.close();
    });

    // Close via Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) this.close();
    });
  }

  /* Public: Open modal */
  open() {
    this._lastFocus = document.activeElement;
    this.overlay.classList.add(this.openClass);
    document.body.style.overflow = 'hidden'; // prevent background scroll

    // Move focus inside modal for accessibility
    const firstFocusable = this.overlay.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (firstFocusable) firstFocusable.focus();
  }

  /* Public: Close modal */
  close() {
    this.overlay.classList.remove(this.openClass);
    document.body.style.overflow = '';

    // Restore focus to trigger element
    if (this._lastFocus) this._lastFocus.focus();
  }

  /* Public: Check open state */
  isOpen() {
    return this.overlay.classList.contains(this.openClass);
  }
}

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  new ModalController({
    triggerSelector: '#cv-btn',
    overlaySelector: '#cv-modal',
    closeSelector:   '#cv-modal-close',
    openClass:       'modal-overlay--open',
  });
});