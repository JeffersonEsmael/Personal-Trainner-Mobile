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
                // Only load persistent user/profile/activeWorkout data
                this.state.user = parsed.user || null;
                this.state.profile = parsed.profile || null;
                this.state.academy = parsed.academy || null;
                this.state.activeWorkout = parsed.activeWorkout || null;
                this.state.useMock = parsed.useMock !== undefined ? parsed.useMock : true;
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
            useMock: this.state.useMock
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
        const profile = { ...mockProfile, academy_id: academy.id };
        const workouts = mockWorkouts.map(w => ({ ...w, academy_id: academy.id }));
        const history = mockHistory.map(h => ({ ...h, academy_id: academy.id }));

        this.setState({
            user: { id: profile.id, email: 'joao.iniciante@academia.com' },
            profile,
            academy,
            workouts,
            history,
            useMock: true
        });
    }
}

export const store = new Store();
