// ============================================
// HASH-BASED SPA ROUTER
// ============================================

import { isAuthenticated, getUserRole } from './auth.js';
import { store } from './store.js';

class Router {
    constructor() {
        this.routes = {};
        this.currentViewInstance = null;
        window.addEventListener('hashchange', () => this.handleRouting());
    }

    /**
     * Define a path and its view component handler
     * @param {string} path 
     * @param {Function} viewClass Constructor of the view class
     * @param {string[]} allowedRoles Array of authorized roles (e.g. ['student'])
     */
    addRoute(path, viewClass, allowedRoles = []) {
        this.routes[path] = { viewClass, allowedRoles };
    }

    /**
     * Parse hash url to identify path and query/route params
     */
    parseHash() {
        const hash = window.location.hash || '#/login';
        
        // Split path and query parameters
        const parts = hash.split('?');
        let path = parts[0].slice(1) || '/'; // Remove leading #
        
        // Remove trailing slash if exists (except for root '/')
        if (path.length > 1 && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Match dynamics like #/workout/some-uuid
        let routeParams = {};
        let matchedPath = path;

        // Simple match patterns: #/workout/:id
        for (const definedRoute of Object.keys(this.routes)) {
            const definedParts = definedRoute.split('/');
            const actualParts = path.split('/');

            if (definedParts.length === actualParts.length) {
                let match = true;
                let tempParams = {};

                for (let i = 0; i < definedParts.length; i++) {
                    if (definedParts[i].startsWith(':')) {
                        const paramName = definedParts[i].slice(1);
                        tempParams[paramName] = actualParts[i];
                    } else if (definedParts[i] !== actualParts[i]) {
                        match = false;
                        break;
                    }
                }

                if (match) {
                    matchedPath = definedRoute;
                    routeParams = tempParams;
                    break;
                }
            }
        }

        return {
            fullPath: path,
            matchedPath,
            params: routeParams
        };
    }

    /**
     * Navigates to a specific view
     * @param {string} path 
     */
    navigate(path) {
        window.location.hash = path.startsWith('#') ? path : `#${path}`;
    }

    /**
     * Run routing handler, validate auth status, render view
     */
    async handleRouting() {
        const { matchedPath, params } = this.parseHash();
        const route = this.routes[matchedPath];

        const appEl = document.getElementById('app');
        if (!appEl) return;

        // 1. Route not found -> redirect to login or home
        if (!route) {
            console.warn(`Route ${matchedPath} not found. Redirecting to home/login.`);
            this.navigate(isAuthenticated() ? '/home' : '/login');
            return;
        }

        // 2. Auth Guard
        const isAuth = isAuthenticated();
        const isLoginRoute = (matchedPath === '/login');

        if (!isAuth && !isLoginRoute) {
            this.navigate('/login');
            return;
        }

        if (isAuth && isLoginRoute) {
            this.navigate('/home');
            return;
        }

        // 3. Permissions Guard (Role Check)
        if (isAuth && route.allowedRoles.length > 0) {
            const role = getUserRole();
            if (!route.allowedRoles.includes(role)) {
                console.warn(`Access denied. User role: ${role}. Required: ${route.allowedRoles}`);
                this.navigate('/home');
                return;
            }
        }

        // 4. Tear down current view
        if (this.currentViewInstance && typeof this.currentViewInstance.onDestroy === 'function') {
            this.currentViewInstance.onDestroy();
        }

        // 5. Instantiate new view
        appEl.innerHTML = ''; // clear app
        
        try {
            this.currentViewInstance = new route.viewClass(params);
            const viewHtml = await this.currentViewInstance.render();
            
            // Add entry transition
            const viewWrapper = document.createElement('div');
            viewWrapper.className = 'view-transition-wrapper view-enter';
            viewWrapper.style.height = '100%';
            viewWrapper.style.width = '100%';
            viewWrapper.innerHTML = viewHtml;
            
            appEl.appendChild(viewWrapper);
            
            if (typeof this.currentViewInstance.afterRender === 'function') {
                this.currentViewInstance.afterRender();
            }
            
            // Add navigation if not on login/complete pages and user is authenticated
            if (isAuth && matchedPath !== '/workout-complete/:id' && !matchedPath.includes('/workout/')) {
                this.renderBottomNavigation(appEl, matchedPath);
            }

        } catch (error) {
            console.error("Routing error rendering view:", error);
            appEl.innerHTML = `
                <div class="complete-view">
                    <span class="complete-emoji">⚠️</span>
                    <h1 class="complete-title">Ops! Ocorreu um erro</h1>
                    <p class="complete-subtitle">${error.message || 'Erro ao carregar tela.'}</p>
                    <button class="btn btn-primary" onclick="window.location.reload()">Recarregar App</button>
                </div>
            `;
        }
    }

    /**
     * Render bottom menu bar into container
     */
    renderBottomNavigation(container, currentPath) {
        const navContainer = document.createElement('div');
        navContainer.className = 'bottom-nav';

        const navItems = [
            { path: '/home', label: 'Treinos', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-item-icon"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v8H2z"></path><path d="M6 8v8"></path><path d="M14 8v8"></path></svg>` },
            { path: '/history', label: 'Histórico', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-item-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>` },
            { path: '/profile', label: 'Perfil', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-item-icon"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` }
        ];

        navItems.forEach(item => {
            const btn = document.createElement('button');
            const isActive = currentPath === item.path;
            btn.className = `nav-item ${isActive ? 'active' : ''}`;
            btn.innerHTML = `
                ${item.icon}
                <span class="nav-item-label">${item.label}</span>
            `;
            btn.addEventListener('click', () => this.navigate(item.path));
            navContainer.appendChild(btn);
        });

        container.appendChild(navContainer);
    }
}

export const router = new Router();
