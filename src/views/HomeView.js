// ============================================
// HOME VIEW — Dashboard Router View
// ============================================

import { store } from '../lib/store.js';
import { router } from '../lib/router.js';
import { getWorkoutImageUrl, getDominantMuscleCategory } from '../lib/utils.js';

let selectedWorkoutLetter = '';

export class HomeView {
    constructor() {
        this.state = store.getState();
    }

    async render() {
        const { profile, academy, workouts, activeWorkout, isImpersonating } = this.state;

        // 1. If logged in user is a Personal Trainer and NOT in student edit mode, show the Trainer Dashboard
        if (profile?.role === 'trainer' && !isImpersonating) {
            return this.renderTrainerDashboard();
        }

        // 2. Render Aluno (Student) Dashboard (or Impersonated mode for Trainer)
        const student = profile?.student_details || {};
        const gender = student.gender || 'male';
        
        // Determine featured workout letter
        if (!selectedWorkoutLetter) {
            selectedWorkoutLetter = activeWorkout ? activeWorkout.letter : 'A';
        }

        // Choose workout of the day based on user selection
        const todayWorkout = workouts.find(w => w.letter === selectedWorkoutLetter) || workouts[0];
        const hasExercises = todayWorkout?.exercises && todayWorkout.exercises.length > 0;

        const workoutImageUrl = hasExercises ? getWorkoutImageUrl(todayWorkout, gender) : null;
        const category = hasExercises ? getDominantMuscleCategory(todayWorkout) : null;
        const workoutMeta = hasExercises 
            ? `${todayWorkout.exercises.length} exercícios` 
            : 'Nenhum exercício cadastrado';

        const workoutName = todayWorkout?.name || 'Treino Geral';

        // Find if there is an active session in progress for this specific featured workout
        const isFeaturedActive = activeWorkout && activeWorkout.workoutId === todayWorkout.id;
        const activeText = isFeaturedActive 
            ? 'RETOMAR TREINO' 
            : hasExercises ? 'ABRIR SÉRIE' : 'MONTAR SÉRIE';

        // Construct list of series letters (A, B, C by default)
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
        const historyThisWeek = this.state.history ? this.state.history.length : 0;
        const totalTarget = 5;
        const pct = Math.min((historyThisWeek / totalTarget) * 100, 100);

        // Impersonation banner warning for Personal Trainer
        const impersonationBannerHtml = isImpersonating
            ? `
                <div class="trainer-edit-banner" style="background: var(--color-primary); padding: var(--space-2) var(--space-4); display: flex; align-items: center; justify-content: space-between; gap: var(--space-2); z-index: var(--z-sticky); position: sticky; top: 0; box-shadow: var(--shadow-md);">
                    <span style="font-size: 13px; font-weight: 700; color: white;">✏️ Modo Personal: Editando ${profile.full_name}</span>
                    <button class="btn btn-ghost press-effect" id="btnExitImpersonation" style="color: white; padding: 2px 8px; min-height: 28px; font-size: 11px; background: rgba(0,0,0,0.25); border-radius: 4px; font-weight: 700; border: none; cursor: pointer;">
                        Salvar e Voltar
                    </button>
                </div>
              `
            : '';

        // Hero Card content based on whether it has exercises
        const heroContentHtml = hasExercises
            ? `
                <div class="home-hero-slide">
                    <div class="home-hero-content">
                        <div class="home-hero-label">Treino Recomendado</div>
                        <h2 class="home-hero-title">${workoutName}<br>Série ${todayWorkout?.letter || 'A'}</h2>
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
              `
            : `
                <div class="home-hero-slide">
                    <div class="home-hero-content" style="max-width: 100%;">
                        <div class="home-hero-label" style="color: var(--color-primary);">Sem Exercícios</div>
                        <h2 class="home-hero-title">Monte seu Treino<br>Série ${todayWorkout?.letter || 'A'}</h2>
                        <p class="home-hero-meta" style="margin-bottom: var(--space-4);">Nenhum exercício cadastrado nesta série ainda. Monte sua série personalizada!</p>
                        
                        <button class="btn btn-primary btn-full press-effect btn-start-today" data-workout-id="${todayWorkout?.id || ''}">
                            MONTAR SÉRIE
                        </button>
                    </div>
                </div>
              `;

        return `
            ${impersonationBannerHtml}
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
                        ${heroContentHtml}
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

    renderTrainerDashboard() {
        const { profile, academy, trainerStudents } = this.state;
        
        const studentsListHtml = trainerStudents.map(student => {
            const details = student.student_details || {};
            const numWorkouts = student.workouts ? student.workouts.length : 0;
            const goalTranslations = {
                hypertrophy: 'Hipertrofia',
                weight_loss: 'Emagrecimento',
                conditioning: 'Condicionamento',
                strength: 'Força'
            };
            const goalText = goalTranslations[details.goal] || 'Treino Geral';
            const numExercises = student.workouts ? student.workouts.reduce((total, w) => total + (w.exercises ? w.exercises.length : 0), 0) : 0;

            return `
                <div class="card student-card press-effect" data-student-id="${student.id}" style="padding: var(--space-4); display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); margin-bottom: var(--space-3); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: var(--space-3);">
                        ${student.avatar_url 
                            ? `<img src="${student.avatar_url}" class="avatar avatar-lg" alt="${student.full_name}" />`
                            : `<div class="avatar avatar-lg avatar-placeholder">${student.full_name.charAt(0)}</div>`
                        }
                        <div>
                            <div style="font-weight: 700; font-size: var(--text-md); color: var(--color-text);">${student.full_name}</div>
                            <div style="font-size: var(--text-xs); color: var(--color-text-secondary); margin-top: 2px;">
                                ${goalText} • ${numWorkouts} séries • ${numExercises} exercícios
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm btn-manage-student" data-student-id="${student.id}" style="border-color: var(--color-primary); color: var(--color-primary);">
                        Editar Treinos
                    </button>
                </div>
            `;
        }).join('');

        return `
            <div class="view view-padded">
                <!-- Header -->
                <div class="home-header" style="padding: var(--space-4) 0 var(--space-5) 0;">
                    <div>
                        <div class="home-greeting">Painel do Personal 👋</div>
                        <div class="home-name" style="font-size: var(--text-2xl);">${profile?.full_name || 'Prof. Lucas Ribeiro'}</div>
                    </div>
                    <div class="home-academy-logo" style="background-image: url('${academy?.logo_url}'); background-size: cover;"></div>
                </div>

                <!-- Search Input -->
                <div class="input-group" style="margin-bottom: var(--space-5);">
                    <input class="input-field" type="text" id="searchStudent" placeholder="Buscar aluno pelo nome..." style="background: var(--color-bg-card); border-color: var(--color-border);" />
                </div>

                <!-- Students list -->
                <div>
                    <h3 class="section-title">Meus Alunos</h3>
                    <div id="studentsList">
                        ${studentsListHtml}
                    </div>
                </div>
            </div>
        `;
    }

    transitionWorkout(newLetter, direction) {
        if (selectedWorkoutLetter === newLetter) return;
        
        selectedWorkoutLetter = newLetter;

        const workouts = this.state.workouts;
        const student = this.state.profile?.student_details || {};
        const gender = student.gender || 'male';
        
        const todayWorkout = workouts.find(w => w.letter === selectedWorkoutLetter) || workouts[0];
        const hasExercises = todayWorkout?.exercises && todayWorkout.exercises.length > 0;

        const workoutImageUrl = hasExercises ? getWorkoutImageUrl(todayWorkout, gender) : null;
        const category = hasExercises ? getDominantMuscleCategory(todayWorkout) : null;
        const workoutMeta = hasExercises 
            ? `${todayWorkout.exercises.length} exercícios` 
            : 'Nenhum exercício cadastrado';

        const workoutName = todayWorkout?.name || 'Treino Geral';

        const isFeaturedActive = this.state.activeWorkout && this.state.activeWorkout.workoutId === todayWorkout.id;
        const activeText = isFeaturedActive 
            ? 'RETOMAR TREINO' 
            : hasExercises ? 'ABRIR SÉRIE' : 'MONTAR SÉRIE';

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
            
            newSlide.innerHTML = hasExercises
                ? `
                    <div class="home-hero-content">
                        <div class="home-hero-label">Treino Recomendado</div>
                        <h2 class="home-hero-title">${workoutName}<br>Série ${todayWorkout?.letter || 'A'}</h2>
                        <p class="home-hero-meta">Série ${todayWorkout?.letter || 'A'} • ${workoutMeta}</p>
                        
                        <button class="btn btn-primary btn-full press-effect btn-start-today" data-workout-id="${todayWorkout?.id || ''}" style="margin-top: var(--space-2);">
                            ${activeText}
                        </button>
                    </div>
                    ${workoutImageUrl 
                        ? `<img class="home-hero-image image-${category}" src="${workoutImageUrl}" alt="Ilustração do treino" />` 
                        : ''
                    }
                  `
                : `
                    <div class="home-hero-content" style="max-width: 100%;">
                        <div class="home-hero-label" style="color: var(--color-primary);">Sem Exercícios</div>
                        <h2 class="home-hero-title">Monte seu Treino<br>Série ${todayWorkout?.letter || 'A'}</h2>
                        <p class="home-hero-meta" style="margin-bottom: var(--space-4);">Nenhum exercício cadastrado nesta série ainda. Monte sua série personalizada!</p>
                        
                        <button class="btn btn-primary btn-full press-effect btn-start-today" data-workout-id="${todayWorkout?.id || ''}">
                            MONTAR SÉRIE
                        </button>
                    </div>
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
        const { profile, isImpersonating } = this.state;

        // 1. Trainer Dashboard binds
        if (profile?.role === 'trainer' && !isImpersonating) {
            // Search filter
            const searchInput = document.getElementById('searchStudent');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const cards = document.querySelectorAll('.student-card');
                    cards.forEach(card => {
                        const name = card.querySelector('div div').textContent.toLowerCase();
                        if (name.includes(query)) {
                            card.style.display = 'flex';
                        } else {
                            card.style.display = 'none';
                        }
                    });
                });
            }

            // Click listener for student card / manager
            const studentsList = document.getElementById('studentsList');
            if (studentsList) {
                studentsList.addEventListener('click', (e) => {
                    const card = e.target.closest('.student-card');
                    if (card) {
                        const studentId = card.dataset.studentId;
                        const student = this.state.trainerStudents.find(s => s.id === studentId);
                        if (student) {
                            store.impersonateStudent(student);
                            // Reroute back to home which will now render Aluno view under impersonation
                            router.handleRouting();
                        }
                    }
                });
            }
            return;
        }

        // 2. Impersonating exit button bind
        if (isImpersonating) {
            const exitBtn = document.getElementById('btnExitImpersonation');
            if (exitBtn) {
                exitBtn.addEventListener('click', () => {
                    store.stopImpersonation();
                    // Clear selected letter cache
                    selectedWorkoutLetter = '';
                    router.handleRouting();
                });
            }
        }

        // 3. Aluno / Impersonated Aluno binds
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
            
            heroEl.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            heroEl.addEventListener('touchend', (e) => {
                const diffX = e.changedTouches[0].clientX - startX;
                const diffY = e.changedTouches[0].clientY - startY;
                
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    const baseLetters = ['A', 'B', 'C'];
                    const workouts = store.getState().workouts;
                    const extraLetters = workouts.map(w => w.letter).filter(l => !baseLetters.includes(l));
                    const activeLetters = [...baseLetters, ...extraLetters].sort();
                    
                    const currentIndex = activeLetters.indexOf(selectedWorkoutLetter);
                    
                    if (diffX < 0) {
                        if (currentIndex < activeLetters.length - 1) {
                            const nextLetter = activeLetters[currentIndex + 1];
                            const hasWorkout = workouts.find(w => w.letter === nextLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(nextLetter, 'left');
                            }
                        }
                    } else {
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
                if (e.button !== 0) return;
                isDragging = true;
                mouseStartX = e.clientX;
                mouseStartY = e.clientY;
                heroEl.style.cursor = 'grabbing';
            });

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
                        if (currentIndex < activeLetters.length - 1) {
                            const nextLetter = activeLetters[currentIndex + 1];
                            const hasWorkout = workouts.find(w => w.letter === nextLetter);
                            if (hasWorkout) {
                                this.transitionWorkout(nextLetter, 'left');
                            }
                        }
                    } else {
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

        // Add dynamic series listener (Create brand new blank series)
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
                    const { Toast } = await import('../components/Toast.js');

                    // Create a blank series so the student / trainer can customize it
                    const newWorkout = {
                        id: `w-new-${nextLetter.toLowerCase()}`,
                        name: 'Treino Geral',
                        letter: nextLetter,
                        exercises: []
                    };

                    selectedWorkoutLetter = nextLetter;
                    const updatedWorkouts = [...workouts, newWorkout];
                    store.setState({ workouts: updatedWorkouts });
                    
                    Toast.show(`Série ${nextLetter} criada com sucesso!`, 'success');
                    router.handleRouting();
                }
            });
        }
    }
}
