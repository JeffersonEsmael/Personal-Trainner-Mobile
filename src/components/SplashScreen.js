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
            
            this.overlay.innerHTML = `
                <div class="splash-logo-container">
                    <div class="moove-logo loading">
                        <span class="logo-letter">M</span>
                        <div class="logo-track">
                            <div class="logo-track-bg-dot"></div>
                            <div class="logo-track-bg-dot"></div>
                            <div class="logo-track-bg-dot"></div>
                            <div class="logo-track-bg-dot"></div>
                            <div class="logo-animated-dot"></div>
                        </div>
                        <span class="logo-letter">V</span>
                        <span class="logo-letter">E</span>
                    </div>
                </div>
                ${this.academy ? `
                    <div class="splash-academy-branding">
                        ${this.academy.logo_url ? `<span class="splash-academy-logo" style="background-image: url('${this.academy.logo_url}');"></span>` : ''}
                        <span class="splash-academy-name">${this.academy.name}</span>
                    </div>
                ` : ''}
            `;

            document.body.appendChild(this.overlay);

            // Wait 2.5 seconds for full animations to execute before removing
            setTimeout(() => {
                this.overlay.style.animation = 'fadeOut 0.4s var(--ease-out) forwards';
                this.overlay.addEventListener('animationend', () => {
                    this.overlay.remove();
                    resolve();
                });
            }, 2500);
        });
    }
}
