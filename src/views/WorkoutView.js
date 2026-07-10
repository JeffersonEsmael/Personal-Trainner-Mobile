// ============================================
// WORKOUT VIEW — Active Workout Session
// ============================================

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { VideoPlayer } from '../components/VideoPlayer.js';
import { Toast } from '../components/Toast.js';
import { formatTime } from '../lib/utils.js';

export class WorkoutView {
    /**
     * @param {object} params Route params (contains id)
     */
    constructor(params) {
        this.workoutId = params.id;
        this.state = store.getState();
        this.workout = this.state.workouts.find(w => w.id === this.workoutId) || this.state.workouts[0];
        
        this.timerInterval = null;
        this.restInterval = null;
        this.durationSeconds = 0;
        this.restRemaining = 0;

        this.initSession();
    }

    /**
     * Load or start a new workout session
     */
    initSession() {
        const active = this.state.activeWorkout;
        
        if (active && active.workoutId === this.workout.id) {
            // Restore active session
            this.durationSeconds = Math.floor((Date.now() - new Date(active.startTime).getTime()) / 1000);
            this.sessionExercises = active.exercises;
            this.isActive = true;
        } else {
            // Start in preview mode (not active yet)
            this.isActive = false;
            this.durationSeconds = 0;
            this.sessionExercises = this.workout.exercises.map(we => ({
                id: we.id,
                exercise: we.exercise,
                sets: we.sets,
                reps: we.reps,
                rest_seconds: we.rest_seconds,
                notes: we.notes,
                completed: false
            }));
        }
    }

    async render() {
        if (!this.workout) {
            return `<div class="view view-padded"><p>Treino não encontrado.</p></div>`;
        }

        const countCompleted = this.sessionExercises.filter(e => e.completed).length;
        const totalExercises = this.sessionExercises.length;
        const progressPct = totalExercises > 0 ? Math.round((countCompleted / totalExercises) * 100) : 0;

        // Map list of exercises to template
        const exercisesHtml = this.sessionExercises.map((se, index) => {
            // If active: show complete checkbox. If preview: show sequence index number.
            const rightActionHtml = this.isActive
                ? `<button class="exercise-card-check ${se.completed ? 'checked' : ''}" data-action="toggle-complete">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="${se.completed ? 'color:white;' : 'color:transparent;'}"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </button>`
                : `<div class="flex-center" style="width:32px; height:32px; border-radius:50%; background:var(--color-bg-elevated); border:1px solid var(--color-border); font-size:12px; font-weight:700; color:var(--color-text-secondary);">${index + 1}</div>`;

            return `
                <div class="exercise-card stagger-item ${se.completed ? 'completed' : ''}" data-id="${se.id}" style="animation-delay: ${index * 60}ms;">
                    <!-- Exercise Thumbnail (Opens Video Player) -->
                    <div class="exercise-card-thumb" data-action="play-video">
                        <img src="${se.exercise.thumbnail_url || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=150&auto=format&fit=crop'}" alt="${se.exercise.name}">
                        <div class="play-icon flex-center" style="background: rgba(0,0,0,0.4); border-radius: var(--radius-sm); position: absolute; inset:0;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="white" stroke="white" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="exercise-card-info" data-action="open-detail">
                        <div class="exercise-card-name">${se.exercise.name}</div>
                        <div class="exercise-card-meta">${se.sets}x${se.reps} • Descanso ${se.rest_seconds}s</div>
                        ${se.notes ? `<div style="font-size:11px; color:var(--color-primary); margin-top:2px;">Nota: ${se.notes}</div>` : ''}
                    </div>

                    <!-- Action checkbox or number -->
                    ${rightActionHtml}
                </div>
            `;
        }).join('');

        const headerMeta = this.isActive
            ? `Série ${this.workout.letter} • <span id="stopwatch">${formatTime(this.durationSeconds)}</span>`
            : `Série ${this.workout.letter} • ${totalExercises} exercícios`;

        const actionButtonHtml = this.isActive
            ? `<button class="btn btn-primary btn-sm press-effect" id="btnFinish">Concluir</button>`
            : '';

        // Add padding at bottom if there is a start button
        const paddingBottom = this.isActive 
            ? 'calc(var(--bottom-nav-height) + 80px)' 
            : '120px';

        return `
            <div class="view" style="padding-bottom: ${paddingBottom};">
                <!-- Header -->
                <div class="workout-header">
                    <button class="workout-back-btn press-effect" id="btnCancel">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div class="workout-header-info">
                        <div class="workout-header-title">${this.workout.name}</div>
                        <div class="workout-header-meta">${headerMeta}</div>
                    </div>
                    ${actionButtonHtml}
                </div>

                <!-- Progress Header (Only if active) -->
                ${this.isActive ? `
                <div class="workout-progress-section">
                    <div class="workout-progress-text">
                        <span>Progresso do treino</span>
                        <span class="workout-progress-count"><span id="completedCounter">${countCompleted}</span> de ${totalExercises} concluídos</span>
                    </div>
                    <div class="progress-bar progress-bar-lg">
                        <div class="progress-bar-fill" id="progressBarFill" style="width: ${progressPct}%"></div>
                    </div>
                </div>
                ` : ''}

                <!-- Exercise List -->
                <div class="workout-exercises">
                    ${exercisesHtml}
                </div>

                <!-- Rest Timer overlay (Only in active mode) -->
                ${this.isActive ? `
                <div class="workout-timer-bar" id="restTimerBar" style="display: none;">
                    <div class="workout-timer-value" id="restTimerVal">30s</div>
                    <div style="flex:1;">
                        <div class="workout-timer-label">Intervalo de Descanso</div>
                        <div style="font-size:11px; color:var(--color-text-secondary);">Recupere o fôlego para a próxima série!</div>
                    </div>
                    <button class="btn btn-ghost btn-sm" id="btnSkipRest">Pular</button>
                </div>
                ` : ''}

                <!-- Bottom Footer Start Button (Only in preview mode) -->
                ${!this.isActive ? `
                <div style="position: absolute; bottom: 0; left: 0; right: 0; padding: var(--space-4); background: var(--color-bg); border-top: 1px solid var(--color-border); z-index: var(--z-sticky);">
                    <button class="btn btn-primary btn-lg btn-full press-effect" id="btnStartWorkout">Iniciar Treino</button>
                </div>
                ` : ''}
            </div>
        `;
    }

    afterRender() {
        // Start background duration stopwatch ONLY IF active
        if (this.isActive) {
            this.timerInterval = setInterval(() => {
                this.durationSeconds++;
                const stopwatch = document.getElementById('stopwatch');
                if (stopwatch) stopwatch.textContent = formatTime(this.durationSeconds);
            }, 1000);

            // Bind finish workout action
            document.getElementById('btnFinish').addEventListener('click', () => {
                this.finishWorkout();
            });

            // Bind skip rest action
            document.getElementById('btnSkipRest').addEventListener('click', () => {
                this.stopRestTimer();
            });
        } else {
            // Bind start workout action
            const startBtn = document.getElementById('btnStartWorkout');
            if (startBtn) {
                startBtn.addEventListener('click', () => {
                    this.isActive = true;

                    // Set up session properties
                    store.setState({
                        activeWorkout: {
                            workoutId: this.workout.id,
                            letter: this.workout.letter,
                            name: this.workout.name,
                            exercises: this.sessionExercises,
                            startTime: new Date().toISOString()
                        }
                    });

                    Toast.show("Treino iniciado! Bons treinos! 💪", "success");

                    // Reroute back to itself to trigger active render mode
                    router.handleRouting();
                });
            }
        }

        // Cancel / Back to Home directly without native confirm alerts
        document.getElementById('btnCancel').addEventListener('click', () => {
            router.navigate('/home');
        });

        // Bind interactive list buttons
        const listContainer = document.querySelector('.workout-exercises');
        listContainer.addEventListener('click', (e) => {
            const card = e.target.closest('.exercise-card');
            if (!card) return;

            const id = card.dataset.id;
            const item = this.sessionExercises.find(x => x.id === id);
            
            const targetAction = e.target.closest('[data-action]');
            const action = targetAction ? targetAction.dataset.action : 'open-detail';

            if (action === 'play-video') {
                e.stopPropagation();
                // Spawn customized video player overlay
                new VideoPlayer(item.exercise).open();
            } else if (action === 'toggle-complete') {
                e.stopPropagation();
                if (this.isActive) {
                    this.toggleExerciseComplete(item, card);
                }
            } else {
                // Navigate to details view
                router.navigate(`/exercise/${item.exercise.id}`);
            }
        });
    }

    toggleExerciseComplete(item, cardEl) {
        item.completed = !item.completed;

        // Apply visual updates to card
        const checkBtn = cardEl.querySelector('.exercise-card-check');
        const checkIcon = checkBtn.querySelector('svg');

        if (item.completed) {
            cardEl.classList.add('completed');
            checkBtn.classList.add('checked');
            checkIcon.style.color = 'white';
            
            // Show rest timer if specified
            if (item.rest_seconds > 0) {
                this.startRestTimer(item.rest_seconds);
            }
        } else {
            cardEl.classList.remove('completed');
            checkBtn.classList.remove('checked');
            checkIcon.style.color = 'transparent';
            this.stopRestTimer();
        }

        // Update overall progress numbers
        const countCompleted = this.sessionExercises.filter(e => e.completed).length;
        const totalExercises = this.sessionExercises.length;
        const pct = totalExercises > 0 ? Math.round((countCompleted / totalExercises) * 100) : 0;

        document.getElementById('completedCounter').textContent = countCompleted;
        document.getElementById('progressBarFill').style.width = `${pct}%`;

        // Save progress details to store
        const active = store.getState().activeWorkout;
        if (active) {
            active.exercises = this.sessionExercises;
            store.setState({ activeWorkout: active });
        }

        // Check if all exercises finished -> Auto prompt finish
        if (countCompleted === totalExercises) {
            setTimeout(() => {
                this.finishWorkout();
            }, 800);
        }
    }

    startRestTimer(seconds) {
        this.stopRestTimer(); // Clear any active timers
        
        this.restRemaining = seconds;
        const bar = document.getElementById('restTimerBar');
        const val = document.getElementById('restTimerVal');
        
        if (!bar || !val) return;

        val.textContent = `${this.restRemaining}s`;
        bar.style.display = 'flex';

        this.restInterval = setInterval(() => {
            this.restRemaining--;
            val.textContent = `${this.restRemaining}s`;
            
            if (this.restRemaining <= 0) {
                this.stopRestTimer();
                Toast.show("Tempo de descanso encerrado! Próxima série.", "warning");
                // Play simple vibration sound check if supported
                if (navigator.vibrate) navigator.vibrate(200);
            }
        }, 1000);
    }

    stopRestTimer() {
        if (this.restInterval) {
            clearInterval(this.restInterval);
            this.restInterval = null;
        }
        const bar = document.getElementById('restTimerBar');
        if (bar) bar.style.display = 'none';
    }

    finishWorkout() {
        this.stopRestTimer();
        clearInterval(this.timerInterval);

        // Save this completed workout to the history list
        const active = store.getState().activeWorkout;
        const countCompleted = this.sessionExercises.filter(e => e.completed).length;
        const totalExercises = this.sessionExercises.length;

        const newHistoryItem = {
            id: `h-${Date.now()}`,
            workout_id: this.workout.id,
            name: this.workout.name,
            letter: this.workout.letter,
            started_at: active ? active.startTime : new Date(Date.now() - this.durationSeconds * 1000).toISOString(),
            completed_at: new Date().toISOString(),
            duration_seconds: this.durationSeconds,
            exercises_completed: countCompleted,
            exercises_total: totalExercises
        };

        // Append to store history list and clear current session
        const currentHistory = store.getState().history;
        store.setState({
            history: [newHistoryItem, ...currentHistory],
            activeWorkout: null
        });

        // Navigate to completion review screen
        router.navigate(`/workout-complete/${newHistoryItem.id}`);
    }

    onDestroy() {
        clearInterval(this.timerInterval);
        this.stopRestTimer();
    }
}
