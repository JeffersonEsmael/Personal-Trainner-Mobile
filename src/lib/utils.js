// ============================================
// UTILITIES — Helper Functions
// ============================================

/**
 * Format time in seconds to mm:ss format
 * @param {number} totalSeconds 
 * @returns {string}
 */
export function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format date to a readable brazilian string (e.g. "07 de Julho de 2026")
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export function formatDate(dateVal) {
    const date = new Date(dateVal);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Format date to short string (e.g. "Ter, 07 jul")
 * @param {string|Date} dateVal 
 * @returns {string}
 */
export function formatShortDate(dateVal) {
    const date = new Date(dateVal);
    const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${month}`;
}

/**
 * Generates a random color for confetti
 * @returns {string}
 */
export function getRandomConfettiColor() {
    const colors = ['#FF6B2C', '#FF8F5E', '#34C759', '#FF9F0A', '#FF453A', '#5AC8FA', '#AF52DE'];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Simple debounce function
 * @param {Function} func 
 * @param {number} wait 
 * @returns {Function}
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Analyze a workout to find the dominant muscle group category
 * @param {object} workout 
 * @returns {'superiores' | 'costas' | 'pernas'}
 */
export function getDominantMuscleCategory(workout) {
    if (!workout || !workout.exercises || workout.exercises.length === 0) {
        return 'superiores';
    }

    let upperCount = 0;
    let backCount = 0;
    let legsCount = 0;

    workout.exercises.forEach(we => {
        const exercise = we.exercise;
        if (!exercise) return;

        const muscleGroup = (exercise.muscle_group || '').toLowerCase();
        
        // Match muscle group names in Portuguese (since they are in Portuguese in mockData.js)
        if (
            muscleGroup.includes('peito') ||
            muscleGroup.includes('ombro') ||
            muscleGroup.includes('tríceps') ||
            muscleGroup.includes('triceps') ||
            muscleGroup.includes('bíceps') ||
            muscleGroup.includes('biceps') ||
            muscleGroup.includes('braço')
        ) {
            upperCount++;
        } else if (muscleGroup.includes('costas')) {
            backCount++;
        } else if (
            muscleGroup.includes('perna') ||
            muscleGroup.includes('quadríceps') ||
            muscleGroup.includes('quadriceps') ||
            muscleGroup.includes('posterior') ||
            muscleGroup.includes('isquiotibiais') ||
            muscleGroup.includes('glúteo') ||
            muscleGroup.includes('panturrilha')
        ) {
            legsCount++;
        }
    });

    // Determine the maximum
    if (upperCount >= backCount && upperCount >= legsCount) {
        return 'superiores';
    } else if (backCount >= upperCount && backCount >= legsCount) {
        return 'costas';
    } else {
        return 'pernas';
    }
}

/**
 * Get the image path based on the dominant muscle category of the workout and user's gender
 * @param {object} workout 
 * @param {'male' | 'female'} gender 
 * @returns {string}
 */
export function getWorkoutImageUrl(workout, gender = 'male') {
    const category = getDominantMuscleCategory(workout);
    const isFemale = (gender || '').toLowerCase() === 'female';
    
    if (isFemale) {
        switch (category) {
            case 'superiores':
                return '/src/assets/female_upper.png';
            case 'costas':
                return '/src/assets/female_back.png';
            case 'pernas':
                return '/src/assets/female_legs.png';
            default:
                return '/src/assets/female_default.png';
        }
    } else {
        switch (category) {
            case 'superiores':
                return '/src/assets/male_upper.png';
            case 'costas':
                return '/src/assets/male_back.png';
            case 'pernas':
                return '/src/assets/male_legs.png';
            default:
                return '/src/assets/male_default.png';
        }
    }
}

