import { Component, Host, h, State } from '@stencil/core';

@Component({
  tag: 'pwa-install-prompt',
  styleUrl: 'pwa-install-prompt.scss',
  shadow: true,
})
export class PwaInstallPrompt {
  @State() showPrompt: boolean = false;
  @State() isIOS: boolean = false;

  private deferredPrompt: any = null;

  componentWillLoad() {
    // Check if iOS
    this.isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if dismissed previously
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const now = new Date();
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    if (this.isIOS) {
      // Show iOS instructions after 3 seconds
      setTimeout(() => {
        this.showPrompt = true;
      }, 3000);
    } else {
      // Listen for beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('beforeinstallprompt', this.handleBeforeInstallPrompt);
  }

  handleBeforeInstallPrompt = (e: Event) => {
    // Prevent the default browser install prompt
    e.preventDefault();

    // Store the event for later use
    this.deferredPrompt = e;

    // Show custom prompt after 5 seconds
    setTimeout(() => {
      this.showPrompt = true;
    }, 5000);
  };

  handleInstall = async () => {
    if (!this.deferredPrompt) {
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installation accepted');
    } else {
      console.log('PWA installation dismissed');
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.showPrompt = false;
  };

  handleDismiss = () => {
    this.showPrompt = false;
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  handleKeyDown = (e: KeyboardEvent, action: 'install' | 'dismiss') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (action === 'install') {
        this.handleInstall();
      } else {
        this.handleDismiss();
      }
    }
  };

  render() {
    if (!this.showPrompt) {
      return null;
    }

    return (
      <Host role="dialog" aria-labelledby="pwa-prompt-title" aria-describedby="pwa-prompt-description">
        <div class="pwa-backdrop" onClick={this.handleDismiss}></div>
        <div class="pwa-prompt animate__animated animate__fadeInUp">
          <button
            class="close-button"
            onClick={this.handleDismiss}
            onKeyDown={(e) => this.handleKeyDown(e, 'dismiss')}
            aria-label="Close install prompt"
            type="button"
          >
            <span class="material-symbols-sharp">close</span>
          </button>

          <div class="pwa-icon">
            <span class="material-symbols-sharp">install_mobile</span>
          </div>

          <h2 id="pwa-prompt-title" class="pwa-title">Install FruitsBytes</h2>

          {this.isIOS ? (
            <div id="pwa-prompt-description">
              <p class="pwa-description">
                Install this app on your iPhone: tap <span class="share-icon">
                  <span class="material-symbols-sharp">ios_share</span>
                </span> and then <strong>Add to Home Screen</strong>.
              </p>
            </div>
          ) : (
            <div id="pwa-prompt-description">
              <p class="pwa-description">
                Install FruitsBytes for quick access and offline functionality. Works just like a native app!
              </p>

              <div class="pwa-features">
                <div class="feature">
                  <span class="material-symbols-sharp">offline_bolt</span>
                  <span>Offline Access</span>
                </div>
                <div class="feature">
                  <span class="material-symbols-sharp">speed</span>
                  <span>Faster Loading</span>
                </div>
                <div class="feature">
                  <span class="material-symbols-sharp">phone_iphone</span>
                  <span>App-Like Experience</span>
                </div>
              </div>

              <div class="pwa-actions">
                <button
                  class="btn-install"
                  onClick={this.handleInstall}
                  onKeyDown={(e) => this.handleKeyDown(e, 'install')}
                  aria-label="Install application"
                  type="button"
                >
                  <span class="material-symbols-sharp">download</span>
                  <span>Install App</span>
                </button>
                <button
                  class="btn-dismiss"
                  onClick={this.handleDismiss}
                  onKeyDown={(e) => this.handleKeyDown(e, 'dismiss')}
                  aria-label="Not now"
                  type="button"
                >
                  Not Now
                </button>
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
