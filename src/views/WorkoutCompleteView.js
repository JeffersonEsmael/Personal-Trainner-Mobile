// ============================================
// WORKOUT COMPLETE VIEW — Celebration Screen
// ============================================

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { formatTime, getRandomConfettiColor } from '../lib/utils.js';

export class WorkoutCompleteView {
    constructor(params) {
        this.historyId = params.id;
        const state = store.getState();
        this.historyItem = state.history.find(h => h.id === this.historyId) || state.history[0];
    }

    async render() {
        if (!this.historyItem) {
            return `
                <div class="view view-padded flex-center" style="height:100%;">
                    <p>Histórico não localizado.</p>
                    <button class="btn btn-primary btn-full" onclick="window.location.hash='#/home'">Voltar à Home</button>
                </div>
            `;
        }

        // Determine next suggested training letter (A -> B -> C -> D -> E -> A)
        const currentLetter = this.historyItem.letter;
        const letterOrder = ['A', 'B', 'C', 'D', 'E'];
        const currentIndex = letterOrder.indexOf(currentLetter);
        const nextIndex = (currentIndex + 1) % letterOrder.length;
        const nextLetter = letterOrder[nextIndex];

        return `
            <div class="complete-view">
                <!-- Confetti container background -->
                <div id="confettiContainer" style="position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:0;"></div>

                <div style="z-index: 1; width: 100%;">
                    <span class="complete-emoji">🎉</span>
                    <h1 class="complete-title">Treino Concluído!</h1>
                    <p class="complete-subtitle">Excelente trabalho! Mais um passo rumo ao seu objetivo.</p>

                    <!-- Summary Stats Grid -->
                    <div class="complete-stats">
                        <div class="complete-stat">
                            <div class="complete-stat-value">${formatTime(this.historyItem.duration_seconds)}</div>
                            <div class="complete-stat-label">Tempo total</div>
                        </div>
                        <div class="complete-stat">
                            <div class="complete-stat-value">${this.historyItem.exercises_completed}/${this.historyItem.exercises_total}</div>
                            <div class="complete-stat-label">Exercícios</div>
                        </div>
                    </div>

                    <div class="card" style="padding: var(--space-4); margin-bottom: var(--space-6); text-align: left;">
                        <div style="font-size: 11px; font-weight: 600; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1);">Série Executada</div>
                        <div style="font-weight: bold; font-size: 16px; color: var(--color-primary);">${this.historyItem.name}</div>
                        <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px;">Realizado em ${new Date(this.historyItem.completed_at).toLocaleDateString('pt-BR')}</div>
                    </div>

                    <!-- Next suggested series link -->
                    <div class="complete-next">
                        <div style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: var(--space-3);">Sugestão para o próximo treino:</div>
                        <button class="btn btn-secondary btn-full press-effect" id="btnNextWorkout">
                            Iniciar Série ${nextLetter}
                        </button>
                    </div>

                    <button class="btn btn-primary btn-full press-effect" id="btnGoHome" style="margin-top: var(--space-3); height: 52px;">
                        Voltar para a Home
                    </button>
                </div>
            </div>
        `;
    }

    afterRender() {
        this.spawnConfetti();

        document.getElementById('btnGoHome').addEventListener('click', () => {
            router.navigate('/home');
        });

        // Set action to launch the next sequence exercise workout
        document.getElementById('btnNextWorkout').addEventListener('click', () => {
            const letterOrder = ['A', 'B', 'C', 'D', 'E'];
            const currentIndex = letterOrder.indexOf(this.historyItem.letter);
            const nextIndex = (currentIndex + 1) % letterOrder.length;
            const nextLetter = letterOrder[nextIndex];

            const workouts = store.getState().workouts;
            const nextWorkout = workouts.find(w => w.letter === nextLetter);

            if (nextWorkout) {
                router.navigate(`/workout/${nextWorkout.id}`);
            } else {
                router.navigate('/home');
            }
        });
    }

    spawnConfetti() {
        const container = document.getElementById('confettiContainer');
        if (!container) return;

        // Generate 60 confetti bits dynamically flying down the UI page
        for (let i = 0; i < 60; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.backgroundColor = getRandomConfettiColor();
            piece.style.animationDelay = `${Math.random() * 2000}ms`;
            
            // Random scales
            const size = Math.random() * 6 + 6;
            piece.style.width = `${size}px`;
            piece.style.height = `${size}px`;
            
            container.appendChild(piece);
        }
    }
}
