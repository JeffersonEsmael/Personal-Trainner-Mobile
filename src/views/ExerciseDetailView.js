// ============================================
// EXERCISE DETAIL VIEW
// ============================================

import { mockExercises } from '../lib/mockData.js';
import { router } from '../lib/router.js';
import { VideoPlayer } from '../components/VideoPlayer.js';

export class ExerciseDetailView {
    constructor(params) {
        this.exerciseId = params.id;
        // Search in mock database
        this.exercise = mockExercises.find(e => e.id === this.exerciseId) || mockExercises[0];
    }

    async render() {
        if (!this.exercise) {
            return `
                <div class="view view-padded">
                    <p>Exercício não encontrado.</p>
                    <button class="btn btn-secondary btn-full" onclick="history.back()">Voltar</button>
                </div>
            `;
        }

        const stepsHtml = this.exercise.execution_steps.map((step, i) => `
            <li style="display:flex; gap:12px; margin-bottom:12px; align-items:flex-start;">
                <span class="flex-center" style="width:24px; height:24px; border-radius:50%; background:var(--color-primary-alpha); color:var(--color-primary); font-weight:bold; font-size:12px; flex-shrink:0;">${i+1}</span>
                <p style="font-size:14px; color:var(--color-text); line-height:1.4;">${step}</p>
            </li>
        `).join('');

        const mistakesHtml = this.exercise.common_mistakes.map(mistake => `
            <li style="display:flex; gap:8px; margin-bottom:8px; align-items:center; color:var(--color-error);">
                <span style="font-size:12px;">⚠️</span>
                <p style="font-size:13px; line-height:1.3; color: var(--color-text-secondary);">${mistake}</p>
            </li>
        `).join('');

        return `
            <div class="view">
                <!-- Header -->
                <div class="workout-header">
                    <button class="workout-back-btn press-effect" onclick="history.back()">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <div class="workout-header-info">
                        <div class="workout-header-title">${this.exercise.name}</div>
                        <div class="workout-header-meta">${this.exercise.muscle_group} • ${this.exercise.equipment}</div>
                    </div>
                </div>

                <!-- Video Preview Hero -->
                <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000; overflow:hidden;">
                    <img src="${this.exercise.thumbnail_url || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=640'}" style="width:100%; height:100%; object-fit:cover; opacity:0.8;">
                    <button class="btn-play-hero flex-center" style="position:absolute; inset:0; background:rgba(0,0,0,0.3); border:none; color:white; width:100%; height:100%;">
                        <div class="flex-center" style="width:64px; height:64px; border-radius:50%; background:var(--gradient-primary); box-shadow:var(--shadow-glow);">
                            <svg viewBox="0 0 24 24" width="28" height="28" fill="white" stroke="white" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </button>
                </div>

                <!-- Details Content -->
                <div class="view-padded" style="display:flex; flex-direction:column; gap: var(--space-5);">
                    <!-- Tags -->
                    <div style="display:flex; gap:8px;">
                        <span class="badge badge-primary">${this.exercise.muscle_group}</span>
                        <span class="badge badge-secondary">${this.exercise.equipment}</span>
                        <span class="badge badge-success">${this.exercise.difficulty === 'beginner' ? 'Iniciante' : 'Intermediário'}</span>
                    </div>

                    <!-- Description -->
                    <div>
                        <h4 class="section-title">Sobre o Exercício</h4>
                        <p style="font-size:14px; line-height:1.5; color:var(--color-text-secondary);">${this.exercise.description}</p>
                    </div>

                    <div class="divider"></div>

                    <!-- Steps -->
                    <div>
                        <h4 class="section-title">Como Executar</h4>
                        <ul style="list-style:none; padding:0;">
                            ${stepsHtml}
                        </ul>
                    </div>

                    <div class="divider"></div>

                    <!-- Common Mistakes -->
                    <div>
                        <h4 class="section-title" style="color:var(--color-error);">Erros Comuns a Evitar</h4>
                        <ul style="list-style:none; padding:0;">
                            ${mistakesHtml}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    afterRender() {
        const playBtn = document.querySelector('.btn-play-hero');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                new VideoPlayer(this.exercise).open();
            });
        }
    }
}
