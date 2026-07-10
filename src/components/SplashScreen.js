// ============================================
// SPLASH SCREEN COMPONENT
// ============================================

export class SplashScreen {
    /**
     * @param {object} academy Academy branding details
     */
    constructor(academy) {
        this.academy = academy;
        this.overlay = null;
    }

    /**
     * Mounts the animated splash screen to the document
     * @returns {Promise<void>} Resolves when splash completes animation
     */
    show() {
        return new Promise((resolve) => {
            this.overlay = document.createElement('div');
            this.overlay.className = 'splash-screen';
            
            // Custom splash configuration based on White Label settings
            this.overlay.innerHTML = `
                <div class="splash-logo" style="background-image: url(${this.academy.logo_url}); background-size: cover; border-radius: var(--radius-xl);">
                    <svg viewBox="0 0 100 100" width="100%" height="100%" fill="none" stroke="var(--color-primary)" stroke-width="4">
                        <circle cx="50" cy="50" r="40" stroke-dasharray="10 10" />
                    </svg>
                </div>
                <h1 class="splash-name">${this.academy.name}</h1>
                <div class="splash-bar">
                    <div class="splash-bar-fill"></div>
                </div>
            `;

            document.body.appendChild(this.overlay);

            // Wait 2.2 seconds for full animations to execute before removing
            setTimeout(() => {
                this.overlay.style.animation = 'fadeOut 0.4s var(--ease-out) forwards';
                this.overlay.addEventListener('animationend', () => {
                    this.overlay.remove();
                    resolve();
                });
            }, 2200);
        });
    }
}
