// ============================================
// STORE — Simple Global State Management
// ============================================

import { mockAcademies, mockWorkouts, mockHistory, mockProfile } from './mockData.js';

class Store {
    constructor() {
        this.state = {
            user: null,
            profile: null,
            academy: null,
            workouts: [],
            history: [],
            activeWorkout: null, // { workoutId, letter, name, exercises: [...], startTime, completedCount }
            toasts: [],
            useMock: true // Use mock by default, can be toggled if Supabase config is loaded
        };
        this.listeners = [];
        this.loadLocalState();
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.saveLocalState();
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }

    loadLocalState() {
        const saved = localStorage.getItem('trainer_app_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state.user = parsed.user || null;
                this.state.profile = parsed.profile || null;
                this.state.academy = parsed.academy || null;
                this.state.activeWorkout = parsed.activeWorkout || null;
                this.state.useMock = parsed.useMock !== undefined ? parsed.useMock : true;
                this.state.workouts = parsed.workouts || [];
                this.state.history = parsed.history || [];
            } catch (e) {
                console.error("Error parsing local state", e);
            }
        }
    }

    saveLocalState() {
        const toSave = {
            user: this.state.user,
            profile: this.state.profile,
            academy: this.state.academy,
            activeWorkout: this.state.activeWorkout,
            useMock: this.state.useMock,
            workouts: this.state.workouts,
            history: this.state.history
        };
        localStorage.setItem('trainer_app_state', JSON.stringify(toSave));
    }

    clearState() {
        this.state = {
            user: null,
            profile: null,
            academy: null,
            workouts: [],
            history: [],
            activeWorkout: null,
            toasts: [],
            useMock: true
        };
        localStorage.removeItem('trainer_app_state');
        this.notify();
    }

    // Helper functions for mock integration
    initializeMockData(academySlug = 'alpha') {
        const academy = mockAcademies[academySlug] || mockAcademies['alpha'];
        const profile = this.state.profile || { ...mockProfile, academy_id: academy.id };
        
        // Only load mock workouts if they are not already stored in the state (e.g. from local storage)
        const workouts = (this.state.workouts && this.state.workouts.length > 0)
            ? this.state.workouts
            : mockWorkouts.map(w => ({ ...w, academy_id: academy.id }));
            
        // Only load mock history if not already stored
        const history = (this.state.history && this.state.history.length > 0)
            ? this.state.history
            : mockHistory.map(h => ({ ...h, academy_id: academy.id }));

        this.setState({
            user: this.state.user || { id: profile.id, email: 'joao.iniciante@academia.com' },
            profile,
            academy,
            workouts,
            history,
            useMock: true
        });
    }
}

export const store = new Store();
