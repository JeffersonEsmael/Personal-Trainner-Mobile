// ============================================
// WORKOUT VIEW — Active Workout Session
// ============================================

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { VideoPlayer } from '../components/VideoPlayer.js';
import { Toast } from '../components/Toast.js';
import { formatTime } from '../lib/utils.js';
import { mockExercises } from '../lib/mockData.js';

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
                weight_kg: we.weight_kg || 0,
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
            // If active: show complete checkbox. If preview: show edit & delete buttons.
            const rightActionHtml = this.isActive
                ? `<button class="exercise-card-check ${se.completed ? 'checked' : ''}" data-action="toggle-complete">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="${se.completed ? 'color:white;' : 'color:transparent;'}"><polyline points="20 6 9 17 4 12"></polyline></svg>
                   </button>`
                : `<div style="display:flex; gap: 8px; align-items:center;">
                     <button class="exercise-action-btn edit-btn press-effect" data-action="edit-exercise" style="background:var(--color-bg-elevated); border:1px solid var(--color-border); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--color-primary); cursor:pointer;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                     </button>
                     <button class="exercise-action-btn delete-btn press-effect" data-action="delete-exercise" style="background:var(--color-bg-elevated); border:1px solid var(--color-border); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:var(--color-error); cursor:pointer;">
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                     </button>
                   </div>`;

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
                        <div class="exercise-card-meta">${se.sets} séries x ${se.reps} reps • ${se.weight_kg || 0} kg • Descanso ${se.rest_seconds}s</div>
                    </div>

                    <!-- Action checkbox or edit/delete buttons -->
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

        const addExerciseBtnHtml = !this.isActive
            ? `<button class="btn btn-secondary btn-full press-effect" id="btnAddExercise" style="margin-top: var(--space-4); border: 2px dashed var(--color-border-strong); background: transparent;">+ Adicionar Exercício</button>`
            : '';

        // Add padding at bottom if there is a start button
        const paddingBottom = this.isActive 
            ? 'calc(var(--bottom-nav-height) + 80px)' 
            : '180px';

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
                ${addExerciseBtnHtml}
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
            } else if (action === 'edit-exercise') {
                e.stopPropagation();
                this.openEditModal(item);
            } else if (action === 'delete-exercise') {
                e.stopPropagation();
                this.deleteExercise(item);
            } else {
                // Navigate to details view
                router.navigate(`/exercise/${item.exercise.id}`);
            }
        });

        // Bind add exercise button
        const addExBtn = document.getElementById('btnAddExercise');
        if (addExBtn) {
            addExBtn.addEventListener('click', () => {
                this.openAddExerciseModal();
            });
        }
    }

    openEditModal(item) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal-content anim-scale-in">
                <h3 class="custom-modal-title">Editar Exercício</h3>
                <p class="custom-modal-subtitle">${item.exercise.name}</p>
                
                <div class="custom-modal-form">
                    <div class="form-group">
                        <label>Séries</label>
                        <input type="number" id="editSets" value="${item.sets}" min="1" max="10" class="input">
                    </div>
                    <div class="form-group">
                        <label>Repetições</label>
                        <input type="text" id="editReps" value="${item.reps}" class="input">
                    </div>
                    <div class="form-group">
                        <label>Carga (kg)</label>
                        <input type="number" id="editWeight" value="${item.weight_kg || 0}" min="0" class="input">
                    </div>
                    <div class="form-group">
                        <label>Descanso (segundos)</label>
                        <input type="number" id="editRest" value="${item.rest_seconds}" min="0" class="input">
                    </div>
                </div>
                
                <div class="custom-modal-actions">
                    <button class="btn btn-secondary btn-sm" id="btnCancelEdit">Cancelar</button>
                    <button class="btn btn-primary btn-sm" id="btnSaveEdit">Salvar</button>
                </div>
            </div>
        `;

        document.getElementById('app').appendChild(modal);

        modal.querySelector('#btnCancelEdit').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#btnSaveEdit').addEventListener('click', () => {
            const sets = parseInt(modal.querySelector('#editSets').value) || 3;
            const reps = modal.querySelector('#editReps').value || '12';
            const weight_kg = parseInt(modal.querySelector('#editWeight').value) || 0;
            const rest_seconds = parseInt(modal.querySelector('#editRest').value) || 60;

            // Update item details locally
            item.sets = sets;
            item.reps = reps;
            item.weight_kg = weight_kg;
            item.rest_seconds = rest_seconds;

            // Update workouts in store
            const currentWorkouts = store.getState().workouts;
            const updatedWorkouts = currentWorkouts.map(w => {
                if (w.id === this.workout.id) {
                    const updatedExercises = w.exercises.map(we => {
                        if (we.id === item.id) {
                            return {
                                ...we,
                                sets,
                                reps,
                                weight_kg,
                                rest_seconds
                            };
                        }
                        return we;
                    });
                    return {
                        ...w,
                        exercises: updatedExercises
                    };
                }
                return w;
            });

            store.setState({ workouts: updatedWorkouts });
            Toast.show("Exercício atualizado!", "success");

            modal.remove();
            router.handleRouting(); // Reload screen
        });
    }

    deleteExercise(item) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal-content anim-scale-in" style="max-width:320px; text-align:center;">
                <h3 class="custom-modal-title">Remover Exercício</h3>
                <p style="font-size:14px; color:var(--color-text-secondary); margin-bottom:var(--space-2);">Tem certeza que deseja remover <strong>${item.exercise.name}</strong> da série?</p>
                <div class="custom-modal-actions" style="justify-content:center; gap:var(--space-3);">
                    <button class="btn btn-secondary btn-sm" id="btnCancelDelete">Cancelar</button>
                    <button class="btn btn-primary btn-sm" id="btnConfirmDelete" style="background:var(--color-error); border-color:var(--color-error);">Remover</button>
                </div>
            </div>
        `;
        document.getElementById('app').appendChild(modal);

        modal.querySelector('#btnCancelDelete').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#btnConfirmDelete').addEventListener('click', () => {
            this.sessionExercises = this.sessionExercises.filter(se => se.id !== item.id);

            const currentWorkouts = store.getState().workouts;
            const updatedWorkouts = currentWorkouts.map(w => {
                if (w.id === this.workout.id) {
                    return {
                        ...w,
                        exercises: w.exercises.filter(we => we.id !== item.id)
                    };
                }
                return w;
            });

            store.setState({ workouts: updatedWorkouts });
            Toast.show("Exercício removido!", "warning");
            
            modal.remove();
            router.handleRouting();
        });
    }

    openAddExerciseModal() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        
        // Define Categories
        const categories = [
            'Todos', 'Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps', 
            'Quadríceps', 'Posterior de coxa', 'Glúteos', 'Panturrilhas', 
            'Abdômen', 'Lombar', 'Trapézio', 'Antebraço'
        ];
        
        let activeCategory = 'Todos';
        let searchQuery = '';

        const renderSelectorList = () => {
            const filtered = mockExercises.filter(ex => {
                const matchesCategory = activeCategory === 'Todos' || ex.muscle_group.toLowerCase() === activeCategory.toLowerCase();
                const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || ex.muscle_group.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
            });

            return filtered.map(ex => `
                <div class="exercise-selector-item" data-ex-id="${ex.id}">
                    <div>
                        <div class="exercise-selector-item-name">${ex.name}</div>
                        <div class="exercise-selector-item-meta">${ex.muscle_group} • ${ex.equipment}</div>
                    </div>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
            `).join('') || '<div style="text-align:center; color:var(--color-text-tertiary); padding:var(--space-4);">Nenhum exercício encontrado.</div>';
        };

        const updateList = () => {
            const listContainer = modal.querySelector('.exercise-selector-list');
            if (listContainer) {
                listContainer.innerHTML = renderSelectorList();
            }
        };

        modal.innerHTML = `
            <div class="custom-modal-content anim-scale-in" style="max-width: 400px; height: 85%; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <div class="flex-between" style="margin-bottom:var(--space-3);">
                        <h3 class="custom-modal-title">Adicionar Exercício</h3>
                        <button class="press-effect btn-close-modal" style="background:transparent; border:none; color:var(--color-text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center;">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <!-- Search input -->
                    <div style="margin-bottom: var(--space-3);">
                        <input type="text" class="exercise-selector-search" placeholder="Buscar por nome ou músculo..." id="searchExInput">
                    </div>

                    <!-- Category tabs -->
                    <div class="exercise-selector-categories" style="margin-bottom: var(--space-4);">
                        ${categories.map(cat => `
                            <button class="exercise-category-tab ${cat === activeCategory ? 'active' : ''}" data-cat="${cat}">${cat}</button>
                        `).join('')}
                    </div>

                    <!-- Exercises List -->
                    <div class="exercise-selector-list">
                        ${renderSelectorList()}
                    </div>
                </div>
            </div>
        `;

        document.getElementById('app').appendChild(modal);

        // Bind events
        const searchInput = modal.querySelector('#searchExInput');
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            updateList();
        });

        const categoryTabs = modal.querySelectorAll('.exercise-category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                activeCategory = tab.dataset.cat;
                updateList();
            });
        });

        modal.querySelector('.btn-close-modal').addEventListener('click', () => {
            modal.remove();
        });

        // Click exercise item -> Open configuration modal
        const listContainer = modal.querySelector('.exercise-selector-list');
        listContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.exercise-selector-item');
            if (!item) return;

            const exId = item.dataset.exId;
            const exerciseObj = mockExercises.find(ex => ex.id === exId);
            if (exerciseObj) {
                modal.remove(); // Close search modal
                this.openConfigureAddModal(exerciseObj);
            }
        });
    }

    openConfigureAddModal(exerciseObj) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal-content anim-scale-in">
                <h3 class="custom-modal-title">Configurar Exercício</h3>
                <p class="custom-modal-subtitle">${exerciseObj.name}</p>
                
                <div class="custom-modal-form">
                    <div class="form-group">
                        <label>Séries</label>
                        <input type="number" id="addSets" value="3" min="1" max="10" class="input">
                    </div>
                    <div class="form-group">
                        <label>Repetições</label>
                        <input type="text" id="addReps" value="12" class="input" placeholder="ex: 12 ou 10-12">
                    </div>
                    <div class="form-group">
                        <label>Carga (kg)</label>
                        <input type="number" id="addWeight" value="10" min="0" class="input">
                    </div>
                    <div class="form-group">
                        <label>Descanso (segundos)</label>
                        <input type="number" id="addRest" value="60" min="0" class="input">
                    </div>
                </div>
                
                <div class="custom-modal-actions">
                    <button class="btn btn-secondary btn-sm" id="btnCancelAdd">Cancelar</button>
                    <button class="btn btn-primary btn-sm" id="btnConfirmAdd">Adicionar à Série</button>
                </div>
            </div>
        `;

        document.getElementById('app').appendChild(modal);

        modal.querySelector('#btnCancelAdd').addEventListener('click', () => {
            modal.remove();
            this.openAddExerciseModal(); // Go back to search list
        });

        modal.querySelector('#btnConfirmAdd').addEventListener('click', () => {
            const sets = parseInt(modal.querySelector('#addSets').value) || 3;
            const reps = modal.querySelector('#addReps').value || '12';
            const weight_kg = parseInt(modal.querySelector('#addWeight').value) || 0;
            const rest_seconds = parseInt(modal.querySelector('#addRest').value) || 60;

            const newWorkoutExercise = {
                id: `we-gen-${Date.now()}`,
                exercise: exerciseObj,
                sets,
                reps,
                weight_kg,
                rest_seconds,
                order_index: this.sessionExercises.length
            };

            // Update session exercises and workout definition
            this.sessionExercises.push({
                ...newWorkoutExercise,
                completed: false
            });

            // Update workouts in store
            const currentWorkouts = store.getState().workouts;
            const updatedWorkouts = currentWorkouts.map(w => {
                if (w.id === this.workout.id) {
                    return {
                        ...w,
                        exercises: [...w.exercises, newWorkoutExercise]
                    };
                }
                return w;
            });

            store.setState({ workouts: updatedWorkouts });
            Toast.show(`${exerciseObj.name} adicionado à Série!`, "success");

            modal.remove();
            router.handleRouting(); // Reload screen
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
