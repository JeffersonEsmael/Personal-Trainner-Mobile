// ============================================
// TOAST NOTIFICATIONS
// ============================================

export class Toast {
    /**
     * Show a transient alert to the user
     * @param {string} message 
     * @param {'success'|'error'|'warning'} type 
     * @param {number} duration 
     */
    static show(message, type = 'success', duration = 3000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✓';
        if (type === 'error') icon = '⚠️';
        if (type === 'warning') icon = '🔔';

        toast.innerHTML = `
            <div style="font-weight:bold; color:var(--color-primary);">${icon}</div>
            <div style="flex:1; font-size:14px; font-weight:500;">${message}</div>
        `;

        container.appendChild(toast);

        // Fade out and remove
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out forwards';
            toast.addEventListener('animationend', () => {
                toast.remove();
                if (container.children.length === 0) {
                    container.remove();
                }
            });
        }, duration);
    }
}
