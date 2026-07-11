// ============================================
// HOME VIEW — Aluno Dashboard
// ============================================

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { getWorkoutImageUrl, getDominantMuscleCategory } from '../lib/utils.js';

// Module-level state for currently selected series card on the dashboard
let selectedWorkoutLetter = null;

export class HomeView {
    constructor() {
        this.state = store.getState();
    }

    async render() {
        const { profile, academy, workouts, activeWorkout } = this.state;
        const student = profile?.student_details || {};
        const gender = student.gender || 'male';
        
        // Determine featured workout letter
        if (!selectedWorkoutLetter) {
            selectedWorkoutLetter = activeWorkout ? activeWorkout.letter : 'A';
        }

        // Choose workout of the day based on user selection
        const todayWorkout = workouts.find(w => w.letter === selectedWorkoutLetter) || workouts[0];

        const workoutImageUrl = getWorkoutImageUrl(todayWorkout, gender);
        const category = getDominantMuscleCategory(todayWorkout);
        const workoutMeta = todayWorkout?.exercises?.length 
            ? `${todayWorkout.exercises.length} exercícios` 
            : 'Nenhum exercício cadastrado';

        const workoutName = todayWorkout?.name || 'Treino Geral';
        const displayWorkoutName = workoutName;

        // Find if there is an active session in progress for this specific featured workout
        const isFeaturedActive = activeWorkout && activeWorkout.workoutId === todayWorkout.id;
        const activeText = isFeaturedActive 
            ? 'RETOMAR TREINO' 
            : 'ABRIR SÉRIE';

        // Construct list of series letters (A, B, C by default, D and E added dynamically)
        const baseLetters = ['A', 'B', 'C'];
        const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
        const activeLetters = [...baseLetters, ...extraLetters].sort();

        let seriesHtml = activeLetters.map(letter => {
            const hasWorkout = workouts.find(w => w.letter === letter);
            const isActive = todayWorkout?.letter === letter;
            
            return `
                <button class="workout-letter-card press-effect ${isActive ? 'active' : ''}" 
                        data-letter="${letter}"
                        ${!hasWorkout ? 'disabled style="opacity: 0.25;"' : ''}>
                    <span class="workout-letter">${letter}</span>
                    <span class="workout-letter-label">SÉRIE</span>
                </button>
            `;
        }).join('');

        // If there are less than 5 series (max A-E), show the "+" button
        const canAddMore = activeLetters.length < 5;
        if (canAddMore) {
            seriesHtml += `
                <button class="workout-letter-card press-effect btn-add-series" style="border: 2px dashed var(--color-border-strong); background: transparent;">
                    <span class="workout-letter" style="color: var(--color-text-secondary); line-height: 0.9;">+</span>
                    <span class="workout-letter-label" style="color: var(--color-text-tertiary);">NOVA</span>
                </button>
            `;
        }

        // Progress bar percentage calculation
        const historyThisWeek = this.state.history.length;
        const totalTarget = 5;
        const pct = Math.min((historyThisWeek / totalTarget) * 100, 100);

        return `
            <div class="view">
                <!-- Home Header -->
                <div class="home-header">
                    <div>
                        <div class="home-greeting">Olá, ${profile?.full_name?.split(' ')[0]}! 👋</div>
                        <div class="home-name">Bora treinar hoje?</div>
                    </div>
                    <div class="home-academy-logo" style="background-image: url('${academy?.logo_url}'); background-size: cover;"></div>
                </div>

                <!-- Active / Recommended Workout Hero Card -->
                <div class="home-hero anim-scale-in">
                    <div class="home-hero-slide-wrapper">
                        <div class="home-hero-slide">
                            <div class="home-hero-content">
                                <div class="home-hero-label">Treino Recomendado</div>
                                <h2 class="home-hero-title">${displayWorkoutName}<br>Série ${todayWorkout?.letter || 'A'}</h2>
                                <p class="home-hero-meta">Série ${todayWorkout?.letter || 'A'} • ${workoutMeta}</p>
                                
                                <button class="btn btn-primary btn-full press-effect btn-start-today" data-workout-id="${todayWorkout?.id || ''}" style="margin-top: var(--space-2);">
                                    ${activeText}
                                </button>
                            </div>
                            ${workoutImageUrl 
                                ? `<img class="home-hero-image image-${category}" src="${workoutImageUrl}" alt="Ilustração do treino" />` 
                                : ''
                            }
                        </div>
                    </div>
                </div>

                <!-- Workout Series Letters Scroll -->
                <div class="home-section anim-fade-in-up" style="animation-delay: 100ms;">
                    <h3 class="section-title">Minhas Séries</h3>
                    <div class="home-series-scroll">
                        ${seriesHtml}
                    </div>
                </div>

                <!-- Weekly Progress Card -->
                <div class="home-section anim-fade-in-up" style="animation-delay: 200ms;">
                    <h3 class="section-title">Meta Semanal</h3>
                    <div class="card" style="padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);">
                        <div class="flex-between">
                            <span style="font-weight: 600; font-size: 14px;">Treinos concluídos</span>
                            <span style="font-weight: bold; color: var(--color-primary);">${historyThisWeek} de ${totalTarget}</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-bar-fill" style="width: ${pct}%"></div>
                        </div>
                        <p style="font-size: 12px; color: var(--color-text-secondary);">Mantenha a constância para atingir seus objetivos de ${student.goal === 'hypertrophy' ? 'Hipertrofia' : 'Emagrecimento'}!</p>
                    </div>
                </div>

                <!-- Personal Trainer Info widget -->
                <div class="home-section anim-fade-in-up" style="animation-delay: 300ms;">
                    <h3 class="section-title">Personal Trainer</h3>
                    <div class="card" style="display: flex; align-items: center; gap: var(--space-3);">
                        <div class="avatar avatar-placeholder">P</div>
                        <div>
                            <div style="font-weight:600; font-size:14px;">${student.trainer_name || 'Prof. Lucas Ribeiro'}</div>
                            <div style="font-size:12px; color:var(--color-text-secondary);">Responsável pela sua ficha de treinos</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    transitionWorkout(newLetter, direction) {
        if (selectedWorkoutLetter === newLetter) return;
        
        const oldLetter = selectedWorkoutLetter;
        selectedWorkoutLetter = newLetter;

        const workouts = this.state.workouts;
        const student = this.state.profile?.student_details || {};
        const gender = student.gender || 'male';
        
        const todayWorkout = workouts.find(w => w.letter === selectedWorkoutLetter) || workouts[0];
        const workoutImageUrl = getWorkoutImageUrl(todayWorkout, gender);
        const category = getDominantMuscleCategory(todayWorkout);
        const workoutMeta = todayWorkout?.exercises?.length 
            ? `${todayWorkout.exercises.length} exercícios` 
            : 'Nenhum exercício cadastrado';

        const workoutName = todayWorkout?.name || 'Treino Geral';
        const displayWorkoutName = workoutName;

        const isFeaturedActive = this.state.activeWorkout && this.state.activeWorkout.workoutId === todayWorkout.id;
        const activeText = isFeaturedActive ? 'RETOMAR TREINO' : 'ABRIR SÉRIE';

        // 1. Update letter card visual state in the DOM
        const seriesCards = document.querySelectorAll('.workout-letter-card:not(.btn-add-series)');
        seriesCards.forEach(card => {
            if (card.dataset.letter === newLetter) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // 2. Animate recommended workout card slider
        const wrapper = document.querySelector('.home-hero-slide-wrapper');
        const oldSlide = wrapper.querySelector('.home-hero-slide');
        
        if (wrapper && oldSlide) {
            const newSlide = document.createElement('div');
            newSlide.className = `home-hero-slide ${direction === 'left' ? 'slide-in-right-init' : 'slide-in-left-init'}`;
            newSlide.innerHTML = `
                <div class="home-hero-content">
                    <div class="home-hero-label">Treino Recomendado</div>
                    <h2 class="home-hero-title">${displayWorkoutName}<br>Série ${todayWorkout?.letter || 'A'}</h2>
                    <p class="home-hero-meta">Série ${todayWorkout?.letter || 'A'} • ${workoutMeta}</p>
                    
                    <button class="btn btn-primary btn-full press-effect btn-start-today" data-workout-id="${todayWorkout?.id || ''}" style="margin-top: var(--space-2);">
                        ${activeText}
                    </button>
                </div>
                ${workoutImageUrl 
                    ? `<img class="home-hero-image image-${category}" src="${workoutImageUrl}" alt="Ilustração do treino" />` 
                    : ''
                }
            `;

            wrapper.appendChild(newSlide);

            // Force reflow
            newSlide.offsetHeight;

            // Trigger animations
            oldSlide.className = `home-hero-slide ${direction === 'left' ? 'slide-out-left' : 'slide-out-right'}`;
            newSlide.className = 'home-hero-slide';

            // Clean up after transition
            setTimeout(() => {
                oldSlide.remove();
                
                // Re-bind the click listener on the new button in the new slide
                const startBtn = newSlide.querySelector('.btn-start-today');
                if (startBtn) {
                    startBtn.addEventListener('click', () => {
                        const workoutId = startBtn.dataset.workoutId;
                        if (workoutId) {
                            router.navigate(`/workout/${workoutId}`);
                        }
                    });
                }
            }, 350);
        }
    }

    afterRender() {
        const startBtn = document.querySelector('.btn-start-today');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                const workoutId = startBtn.dataset.workoutId;
                if (workoutId) {
                    router.navigate(`/workout/${workoutId}`);
                }
            });
        }

        // Add listeners to series selector cards
        const seriesCards = document.querySelectorAll('.workout-letter-card:not(.btn-add-series)');
        seriesCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const letter = card.dataset.letter;
                if (letter && letter !== selectedWorkoutLetter) {
                    const baseLetters = ['A', 'B', 'C'];
                    const workouts = this.state.workouts;
                    const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
                    const activeLetters = [...baseLetters, ...extraLetters].sort();
                    
                    const fromIndex = activeLetters.indexOf(selectedWorkoutLetter);
                    const toIndex = activeLetters.indexOf(letter);
                    const direction = toIndex > fromIndex ? 'left' : 'right';
                    
                    this.transitionWorkout(letter, direction);
                }
            });
        });

        // Swipe and Mouse Drag controls for Recommended Workout Card
        const heroEl = document.querySelector('.home-hero');
        if (heroEl) {
            let startX = 0;
            let startY = 0;
            
            // Touch handlers
            heroEl.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            heroEl.addEventListener('touchend', (e) => {
                const diffX = e.changedTouches[0].clientX - startX;
                const diffY = e.changedTouches[0].clientY - startY;
                
                // Only trigger if horizontal drag is dominant and exceeds threshold
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    const baseLetters = ['A', 'B', 'C'];
                    const workouts = store.getState().workouts;
                    const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
                    const activeLetters = [...baseLetters, ...extraLetters].sort();
                    
                    const currentIndex = activeLetters.indexOf(selectedWorkoutLetter);
                    
                    if (diffX < 0) {
                        // Swiped Left -> Next Series
                        if (currentIndex < activeLetters.length - 1) {
                            const nextLetter = activeLetters[currentIndex + 1];
                            const hasWorkout = workouts.find(w => w.letter === nextLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(nextLetter, 'left');
                            }
                        }
                    } else {
                        // Swiped Right -> Previous Series
                        if (currentIndex > 0) {
                            const prevLetter = activeLetters[currentIndex - 1];
                            const hasWorkout = workouts.find(w => w.letter === prevLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(prevLetter, 'right');
                            }
                        }
                    }
                }
            }, { passive: true });

            // Mouse Drag Handlers
            let isDragging = false;
            let mouseStartX = 0;
            let mouseStartY = 0;

            heroEl.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return; // Only track main click
                isDragging = true;
                mouseStartX = e.clientX;
                mouseStartY = e.clientY;
                heroEl.style.cursor = 'grabbing';
            });

            // Prevent browser image dragging interference
            const heroImg = heroEl.querySelector('.home-hero-image');
            if (heroImg) {
                heroImg.addEventListener('dragstart', (e) => e.preventDefault());
            }

            window.addEventListener('mouseup', (e) => {
                if (!isDragging) return;
                isDragging = false;
                heroEl.style.cursor = 'grab';

                const diffX = e.clientX - mouseStartX;
                const diffY = e.clientY - mouseStartY;

                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    const baseLetters = ['A', 'B', 'C'];
                    const workouts = store.getState().workouts;
                    const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
                    const activeLetters = [...baseLetters, ...extraLetters].sort();
                    
                    const currentIndex = activeLetters.indexOf(selectedWorkoutLetter);
                    
                    if (diffX < 0) {
                        // Dragged Left -> Next Series
                        if (currentIndex < activeLetters.length - 1) {
                            const nextLetter = activeLetters[currentIndex + 1];
                            const hasWorkout = workouts.find(w => w.letter === nextLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(nextLetter, 'left');
                            }
                        }
                    } else {
                        // Dragged Right -> Previous Series
                        if (currentIndex > 0) {
                            const prevLetter = activeLetters[currentIndex - 1];
                            const hasWorkout = workouts.find(w => w.letter === prevLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(prevLetter, 'right');
                            }
                        }
                    }
                }
            });
        }

        // Add dynamic series listener
        const addSeriesBtn = document.querySelector('.btn-add-series');
        if (addSeriesBtn) {
            addSeriesBtn.addEventListener('click', async () => {
                const baseLetters = ['A', 'B', 'C'];
                const workouts = this.state.workouts;
                const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
                const activeLetters = [...baseLetters, ...extraLetters].sort();

                const allPossible = ['A', 'B', 'C', 'D', 'E'];
                const nextLetter = allPossible.find(l => !activeLetters.includes(l));

                if (nextLetter) {
                    const { mockExercises } = await import('../lib/mockData.js');
                    const { Toast } = await import('../components/Toast.js');

                    // Pick 2 random exercises for the new series
                    const newExercises = [];
                    if (mockExercises && mockExercises.length > 0) {
                        const firstEx = mockExercises[Math.floor(Math.random() * mockExercises.length)];
                        let secondEx = mockExercises[Math.floor(Math.random() * mockExercises.length)];
                        if (firstEx.id === secondEx.id) {
                            secondEx = mockExercises[(mockExercises.indexOf(firstEx) + 1) % mockExercises.length];
                        }
                        newExercises.push(
                            { id: `we-new-1-${nextLetter}`, exercise: firstEx, sets: 3, reps: '12', rest_seconds: 60, order_index: 0, notes: 'Executar com cuidado' },
                            { id: `we-new-2-${nextLetter}`, exercise: secondEx, sets: 4, reps: '10', rest_seconds: 45, order_index: 1, notes: 'Movimento controlado' }
                        );
                    }

                    const newWorkout = {
                        id: `w-new-${nextLetter.toLowerCase()}`,
                        name: nextLetter === 'D' ? 'Cardio Regenerativo' : 'Abdômen e Core',
                        letter: nextLetter,
                        exercises: newExercises
                    };

                    selectedWorkoutLetter = nextLetter;
                    const updatedWorkouts = [...workouts, newWorkout];
                    store.setState({ workouts: updatedWorkouts });
                    
                    Toast.show(`Série ${nextLetter} criada com sucesso!`, 'success');
                    
                    // Reload current view
                    router.handleRouting();
                }
            });
        }
    }
}
