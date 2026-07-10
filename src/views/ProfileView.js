// ============================================
// PROFILE VIEW
// ============================================

import { store } from '../lib/store.js';
import { logout } from '../lib/auth.js';
import { router } from '../lib/router.js';
import { Toast } from '../components/Toast.js';

export class ProfileView {
    constructor() {
        this.state = store.getState();
    }

    async render() {
        const { profile, academy } = this.state;
        const details = profile?.student_details || {};

        // Translate database enum names to Portuguese
        const goalTranslations = {
            hypertrophy: 'Hipertrofia',
            weight_loss: 'Emagrecimento',
            conditioning: 'Condicionamento Físico',
            strength: 'Força',
            mobility: 'Mobilidade',
            rehabilitation: 'Reabilitação'
        };

        const expTranslations = {
            beginner: 'Iniciante',
            intermediate: 'Intermediário',
            advanced: 'Avançado'
        };

        const currentGoalText = goalTranslations[details.goal] || 'Não informado';
        const currentExpText = expTranslations[details.experience] || 'Não informado';

        return `
            <div class="view">
                <!-- Avatar + Header -->
                <div class="profile-header">
                    <div class="profile-avatar-wrapper">
                        ${profile?.avatar_url 
                            ? `<img class="avatar avatar-xl" src="${profile.avatar_url}" alt="${profile.full_name}" id="profileAvatar">`
                            : `<div class="avatar avatar-xl avatar-placeholder" id="profileAvatar">${profile?.full_name?.charAt(0) || 'U'}</div>`
                        }
                        <button class="profile-avatar-edit press-effect" id="btnEditPhoto">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="white" stroke="white" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                        </button>
                        <input type="file" id="photoInput" accept="image/*" style="display:none;">
                    </div>
                    
                    <h2 class="profile-name">${profile?.full_name || 'Usuário Aluno'}</h2>
                    <span class="profile-academy">${academy?.name || 'Minha Academia'}</span>
                </div>

                <!-- Personal Physical Details Metrics Card -->
                <div class="view-padded" style="padding-top:0;">
                    <div class="card" style="padding: var(--space-4); display:grid; grid-template-columns: repeat(3, 1fr); text-align:center;">
                        <div>
                            <div style="font-size:12px; color:var(--color-text-secondary); margin-bottom:4px;">Idade</div>
                            <div style="font-weight:bold; font-size:18px; color:var(--color-text);">${details.age || '--'} anos</div>
                        </div>
                        <div style="border-left: 1px solid var(--color-border); border-right: 1px solid var(--color-border);">
                            <div style="font-size:12px; color:var(--color-text-secondary); margin-bottom:4px;">Peso</div>
                            <div style="font-weight:bold; font-size:18px; color:var(--color-text);">${details.weight || '--'} kg</div>
                        </div>
                        <div>
                            <div style="font-size:12px; color:var(--color-text-secondary); margin-bottom:4px;">Altura</div>
                            <div style="font-weight:bold; font-size:18px; color:var(--color-text);">${details.height || '--'} m</div>
                        </div>
                    </div>
                </div>

                <!-- General Info rows -->
                <div class="profile-section">
                    <h3 class="section-title">Informações de Treino</h3>
                    <div class="card">
                        <div class="profile-row">
                            <span class="profile-row-label">Objetivo Principal</span>
                            <span class="profile-row-value" style="color: var(--color-primary); font-weight:600; cursor:pointer;" id="rowGoal">${currentGoalText} ➔</span>
                        </div>
                        <div class="profile-row">
                            <span class="profile-row-label">Gênero</span>
                            <span class="profile-row-value" style="color: var(--color-primary); font-weight:600; cursor:pointer;" id="rowGender">${details.gender === 'female' ? 'Feminino' : 'Masculino'} ➔</span>
                        </div>
                        <div class="profile-row">
                            <span class="profile-row-label">Nível de Experiência</span>
                            <span class="profile-row-value">${currentExpText}</span>
                        </div>
                        <div class="profile-row">
                            <span class="profile-row-label">Professor Responsável</span>
                            <span class="profile-row-value">${details.trainer_name || 'Prof. Lucas Ribeiro'}</span>
                        </div>
                    </div>
                </div>

                <!-- App custom specs info -->
                <div class="profile-section" style="padding-top: 0;">
                    <h3 class="section-title">Configurações do App</h3>
                    <div class="card">
                        <div class="profile-row">
                            <span class="profile-row-label">E-mail de Login</span>
                            <span class="profile-row-value" style="font-size: 13px; color:var(--color-text-secondary);">${profile?.phone || 'aluno@academia.com'}</span>
                        </div>
                        <div class="profile-row">
                            <span class="profile-row-label">Versão do App</span>
                            <span class="profile-row-value">v1.0.0 (White Label)</span>
                        </div>
                    </div>
                </div>

                <!-- Signout Action -->
                <div class="profile-logout">
                    <button class="btn btn-secondary btn-full press-effect" id="btnSignout" style="color: var(--color-error); border-color: rgba(255, 69, 58, 0.2);">
                        Sair da Conta
                    </button>
                </div>
            </div>
        `;
    }

    afterRender() {
        // Signout logic
        document.getElementById('btnSignout').addEventListener('click', async () => {
            if (confirm('Tem certeza de que deseja sair?')) {
                await logout();
                Toast.show('Você saiu da sua conta.', 'info');
                router.navigate('/login');
            }
        });

        // Edit profile picture photo click handler
        const photoInput = document.getElementById('photoInput');
        const btnEditPhoto = document.getElementById('btnEditPhoto');
        const profileAvatar = document.getElementById('profileAvatar');

        btnEditPhoto.addEventListener('click', () => {
            photoInput.click();
        });

        photoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Update in store state
                    const state = store.getState();
                    const updatedProfile = { ...state.profile, avatar_url: event.target.result };
                    store.setState({ profile: updatedProfile });
                    
                    // Update visual image src
                    if (profileAvatar.tagName === 'IMG') {
                        profileAvatar.src = event.target.result;
                    } else {
                        // If it was a text placeholder div, swap with img node
                        const img = document.createElement('img');
                        img.className = 'avatar avatar-xl';
                        img.id = 'profileAvatar';
                        img.src = event.target.result;
                        profileAvatar.parentNode.replaceChild(img, profileAvatar);
                    }
                    Toast.show('Foto de perfil atualizada!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });

        // Toggle Objective goal list selector (Interactive Modal prompt)
        document.getElementById('rowGoal').addEventListener('click', () => {
            this.promptGoalChange();
        });

        // Toggle Gender selector (Interactive Modal prompt)
        document.getElementById('rowGender').addEventListener('click', () => {
            this.promptGenderChange();
        });
    }

    promptGoalChange() {
        const goalTranslations = {
            hypertrophy: 'Hipertrofia',
            weight_loss: 'Emagrecimento',
            conditioning: 'Condicionamento Físico',
            strength: 'Força'
        };

        const currentDetails = this.state.profile?.student_details || {};
        
        // Setup select dialog
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-handle"></div>
                <h3 style="font-weight:bold; font-size:18px; margin-bottom:var(--space-4);">Selecione seu Objetivo</h3>
                
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${Object.entries(goalTranslations).map(([key, name]) => `
                        <button class="btn btn-secondary btn-full press-effect text-left btn-select-goal" data-key="${key}" style="justify-content:flex-start; ${currentDetails.goal === key ? 'border-color:var(--color-primary); color:var(--color-primary);' : ''}">
                            ${name}
                        </button>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary btn-full press-effect" id="btnCancelGoal" style="margin-top:var(--space-5);">Cancelar</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind items
        modal.querySelectorAll('.btn-select-goal').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedKey = btn.dataset.key;
                
                // Save updated goal state
                const state = store.getState();
                const updatedDetails = { ...state.profile.student_details, goal: selectedKey };
                const updatedProfile = { ...state.profile, student_details: updatedDetails };
                
                store.setState({ profile: updatedProfile });
                Toast.show(`Objetivo atualizado para ${goalTranslations[selectedKey]}!`, 'success');
                
                // Teardown modal and reload view
                modal.remove();
                router.handleRouting();
            });
        });

        document.getElementById('btnCancelGoal').addEventListener('click', () => modal.remove());
    }

    promptGenderChange() {
        const genderTranslations = {
            male: 'Masculino',
            female: 'Feminino'
        };

        const currentDetails = this.state.profile?.student_details || {};
        const currentGender = currentDetails.gender || 'male';
        
        // Setup select dialog
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-handle"></div>
                <h3 style="font-weight:bold; font-size:18px; margin-bottom:var(--space-4);">Selecione seu Gênero</h3>
                
                <div style="display:flex; flex-direction:column; gap:8px;">
                    ${Object.entries(genderTranslations).map(([key, name]) => `
                        <button class="btn btn-secondary btn-full press-effect text-left btn-select-gender" data-key="${key}" style="justify-content:flex-start; ${currentGender === key ? 'border-color:var(--color-primary); color:var(--color-primary);' : ''}">
                            ${name}
                        </button>
                    `).join('')}
                </div>
                
                <button class="btn btn-primary btn-full press-effect" id="btnCancelGender" style="margin-top:var(--space-5);">Cancelar</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind items
        modal.querySelectorAll('.btn-select-gender').forEach(btn => {
            btn.addEventListener('click', () => {
                const selectedKey = btn.dataset.key;
                
                // Save updated gender state
                const state = store.getState();
                const updatedDetails = { ...state.profile.student_details, gender: selectedKey };
                const updatedProfile = { ...state.profile, student_details: updatedDetails };
                
                store.setState({ profile: updatedProfile });
                Toast.show(`Gênero atualizado para ${genderTranslations[selectedKey]}!`, 'success');
                
                // Teardown modal and reload view
                modal.remove();
                router.handleRouting();
            });
        });

        document.getElementById('btnCancelGender').addEventListener('click', () => modal.remove());
    }
}
