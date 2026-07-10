// ============================================
// THEME ENGINE — White Label Manager
// ============================================

import { store } from './store.js';

/**
 * Apply the visual style values for the specified academy
 * @param {object} academy 
 */
export function applyAcademyTheme(academy) {
    if (!academy) return;

    const root = document.documentElement;

    // Apply primary color
    root.style.setProperty('--color-primary', academy.primary_color);
    
    // Calculate variations of primary color (tint and shade)
    const colorHex = academy.primary_color;
    
    // Apply primary alpha variants for subtle glows / overlays
    const rgb = hexToRgb(colorHex);
    if (rgb) {
        root.style.setProperty('--color-primary-alpha', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
        root.style.setProperty('--color-primary-alpha-strong', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.35)`);
    }
    
    // Apply secondary color
    if (academy.secondary_color) {
        root.style.setProperty('--color-secondary', academy.secondary_color);
        // Fallback or dynamic light gradient variations
        root.style.setProperty('--color-primary-light', academy.secondary_color);
    } else {
        root.style.setProperty('--color-primary-light', adjustColorBrightness(colorHex, 20));
    }

    // Set academy styling variables
    root.style.setProperty('--academy-name', `"${academy.name}"`);
    if (academy.logo_url) {
        root.style.setProperty('--academy-logo', `url(${academy.logo_url})`);
    }

    // Save app styling title meta
    document.title = academy.name;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
        themeMeta.setAttribute('content', '#0A0A0F'); // keep premium dark bg
    }
}

/**
 * Parses Hex color code to RGB Object
 * @param {string} hex 
 * @returns {object|null} {r, g, b}
 */
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

/**
 * Adjust hex color brightness
 * @param {string} hex 
 * @param {number} percent 
 * @returns {string} Adjust brightness by percentage
 */
function adjustColorBrightness(hex, percent) {
    const num = parseInt(hex.replace("#",""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
}

/**
 * Detect academy from URL pathname or subdomain, then apply theme
 * Format support: /academy-slug or subdomain.domain.com
 */
export function detectAndLoadAcademy() {
    // Priority: Slug in hash query parameters or hash path (hash routing friendly)
    // E.g. #/login?gym=alpha or #/alpha/login or location path /alpha
    let slug = 'alpha'; // default backup
    
    const hash = window.location.hash;
    const urlParams = new URLSearchParams(window.location.search);
    
    // 1. Check search parameter ?gym=xxx
    if (urlParams.has('gym')) {
        slug = urlParams.get('gym');
    } 
    // 2. Check hash route parameter ?gym=xxx inside route (e.g. #/login?gym=blackwave)
    else if (hash.includes('?')) {
        const hashQuery = hash.split('?')[1];
        const hashParams = new URLSearchParams(hashQuery);
        if (hashParams.has('gym')) {
            slug = hashParams.get('gym');
        }
    }
    // 3. Check path prefix /alpha
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0 && ['alpha', 'blackwave', 'evolution'].includes(pathParts[0].toLowerCase())) {
        slug = pathParts[0].toLowerCase();
    }
    
    // Initialize mock state with this specific academy
    store.initializeMockData(slug);
    
    const currentState = store.getState();
    applyAcademyTheme(currentState.academy);
    
    return slug;
}
