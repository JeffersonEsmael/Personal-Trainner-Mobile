// ============================================
// LOGIN VIEW
// ============================================

import { login } from '../lib/auth.js';
import { router } from '../lib/router.js';
import { store } from '../lib/store.js';
import { Toast } from '../components/Toast.js';

export class LoginView {
    constructor() {
        this.state = store.getState();
        this.loading = false;
    }

    async render() {
        const academy = this.state.academy || { name: 'Personal Trainer', logo_url: '/icons/icon.svg' };
        
        return `
            <div class="login-view">
                <div class="login-bg-glow"></div>
                
                <div class="login-brand-header">
                    <div class="moove-logo">
                        <span class="logo-letter">M</span>
                        <div class="logo-track">
                            <div class="logo-track-bg-dot logo-track-dot-static-1"></div>
                            <div class="logo-track-bg-dot logo-track-dot-static-2"></div>
                            <div class="logo-track-bg-dot logo-track-dot-static-3"></div>
                            <div class="logo-track-bg-dot logo-track-dot-static-4"></div>
                        </div>
                        <span class="logo-letter">V</span>
                        <span class="logo-letter">E</span>
                    </div>
                </div>
                
                <div class="login-academy-badge">
                    ${academy.logo_url ? `<div class="login-academy-logo" style="background-image: url('${academy.logo_url}');"></div>` : ''}
                    <span class="login-academy-title">${academy.name}</span>
                </div>
                
                <p class="login-subtitle">Seu Personal Trainer Digital</p>
                
                <form class="login-form" id="loginForm">
                    <div class="input-group">
                        <label class="input-label" for="email">E-mail</label>
                        <input class="input-field" type="email" id="email" placeholder="nome@email.com" required value="aluno@academia.com" />
                    </div>
                    
                    <div class="input-group">
                        <label class="input-label" for="password">Senha</label>
                        <input class="input-field" type="password" id="password" placeholder="••••••••" required value="123456" />
                    </div>
                    
                    <button class="btn btn-primary btn-lg btn-full press-effect" type="submit" id="submitBtn" style="margin-top: var(--space-4);">
                        Entrar no App
                    </button>
                </form>

                <div class="login-footer">
                    <p>Branding customizado da academia ativa</p>
                    <div style="margin-top: 12px; display: flex; gap: 8px; justify-content: center; font-size: 11px;">
                        <a href="?gym=alpha" style="color: #FF6B2C; text-decoration: underline;">Alpha</a> |
                        <a href="?gym=blackwave" style="color: #8E8E93; text-decoration: underline;">BlackWave</a> |
                        <a href="?gym=evolution" style="color: #007AFF; text-decoration: underline;">Evolution</a>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.loading) return;

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            this.loading = true;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Autenticando...';

            const res = await login(email, password);

            if (res.success) {
                Toast.show('Bem-vindo de volta!', 'success');
                // Redirect user to home
                router.navigate('/home');
            } else {
                Toast.show(res.error || 'Erro ao realizar login', 'error');
                this.loading = false;
                submitBtn.disabled = false;
                submitBtn.textContent = 'Entrar no App';
            }
        });
    }

    onDestroy() {
        // Cleanup listeners if any
    }
}
